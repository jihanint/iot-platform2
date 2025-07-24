package repository

import (
	"errors"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type CityRepository interface {
	GetCity(params *model.City) (*model.City, error)
	InsertCity(city *model.City) (*model.City, error)
	BulkInsertWithTx(tx *gorm.DB, cities []model.City) ([]model.City, error)
	Find(params *model.FindCityParam) ([]model.City, error)
}

type CityRepositoryCtx struct{}

func (c *CityRepositoryCtx) GetCity(params *model.City) (*model.City, error) {
	db := config.DbManager()
	city := model.City{}

	if params.Name != "" {
		db = db.Where("name = ?", params.Name)
	}

	if params.ProvinceID != 0 {
		db = db.Where("province_id = ?", params.ProvinceID)
	}

	err := db.First(&city).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &city, nil
}

func (c *CityRepositoryCtx) InsertCity(city *model.City) (*model.City, error) {
	db := config.DbManager()
	err := db.Create(city).Error
	if err != nil {
		return nil, err
	}

	return city, nil
}

func (c *CityRepositoryCtx) Find(params *model.FindCityParam) ([]model.City, error) {
	db := config.DbManager()
	cities := []model.City{}

	if params.ProvinceID != 0 {
		db = db.Where("province_id = ?", params.ProvinceID)
	}

	if params.IsDeviceInstalled {
		db = db.Table("city").Select("DISTINCT on (city.id) city.*").
			Joins("JOIN district ON district.city_id = city.id").
			Joins("JOIN village ON village.district_id = district.id")
	}

	err := db.Find(&cities).Error
	if err != nil {
		return nil, err
	}

	return cities, nil
}

func (c *CityRepositoryCtx) BulkInsertWithTx(tx *gorm.DB, cities []model.City) ([]model.City, error) {
	insertQuery := "INSERT INTO city (province_id, name) VALUES "
	values := []interface{}{}
	var placeholders []string

	for _, city := range cities {
		placeholders = append(placeholders, "(?, ?)")
		values = append(values, city.ProvinceID, city.Name)
	}

	insertQuery += strings.Join(placeholders, ",")

	// Execute the INSERT query and return the generated IDs
	rows, err := tx.Raw(insertQuery+" RETURNING id;", values...).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	index := 0
	for rows.Next() {
		var generatedCity model.City
		err := rows.Scan(&generatedCity.ID)
		if err != nil {
			return nil, err
		}

		cities[index].ID = generatedCity.ID
		index++
	}

	return cities, nil
}
