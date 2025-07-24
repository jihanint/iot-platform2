package repository

import (
	"errors"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type DistrictRepository interface {
	GetDistrict(params *model.District) (*model.District, error)
	InsertDistrict(district *model.District) (*model.District, error)
	BulkInsertWithTx(tx *gorm.DB, districts []model.District) error
	Find(params *model.District) ([]model.District, error)
}

type DistrictRepositoryCtx struct{}

func (c *DistrictRepositoryCtx) GetDistrict(params *model.District) (*model.District, error) {
	db := config.DbManager()
	district := model.District{}

	if params.Name != "" {
		db = db.Where("name = ?", params.Name)
	}

	if params.CityID != 0 {
		db = db.Where("city_id = ?", params.CityID)
	}

	err := db.First(&district).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &district, nil
}

func (c *DistrictRepositoryCtx) InsertDistrict(district *model.District) (*model.District, error) {
	db := config.DbManager()
	err := db.Create(district).Error
	if err != nil {
		return nil, err
	}

	return district, nil
}

func (c *DistrictRepositoryCtx) Find(params *model.District) ([]model.District, error) {
	db := config.DbManager()
	districts := []model.District{}

	if params.CityID != 0 {
		db = db.Where("city_id = ?", params.CityID)
	}

	err := db.Find(&districts).Error
	if err != nil {
		return nil, err
	}

	return districts, nil
}

func (c *DistrictRepositoryCtx) BulkInsertWithTx(tx *gorm.DB, districts []model.District) error {
	query := "INSERT INTO district (city_id, name) VALUES "
	values := []interface{}{}

	for _, district := range districts {
		query += "(?, ?),"
		values = append(values, district.CityID, district.Name)
	}

	query = query[:len(query)-1]

	err := tx.Exec(query, values...).Error
	if err != nil {
		return err
	}

	return nil
}
