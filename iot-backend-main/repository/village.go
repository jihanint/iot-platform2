package repository

import (
	"errors"
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type VillageRepository interface {
	Get(params *model.Village) (*model.Village, error)
	GetWithCity(params *model.Village) (*model.GetVillageWithCityResult, error)
	InsertVillage(village *model.Village) (*model.Village, error)
	Find(params *model.FindVillageRequest) ([]model.Village, error)
	Update(village *model.Village) (*model.Village, error)
	Delete(village *model.Village) error
	SumPopulation(excludeVillageIDs string, villageID int64) (int64, error)
	Count(excludeDeviceIDs string) (int64, error)
}

type VillageRepositoryCtx struct{}

func (c *VillageRepositoryCtx) Get(params *model.Village) (*model.Village, error) {
	db := config.DbManager()
	village := model.Village{}

	if params.ID != 0 {
		db = db.Where("id = ?", params.ID)
	}

	if params.Name != "" {
		db = db.Where("name = ?", params.Name)
	}

	if params.DistrictID != 0 {
		db = db.Where("district_id = ?", params.DistrictID)
	}

	err := db.First(&village).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &village, nil
}

func (c *VillageRepositoryCtx) GetWithCity(params *model.Village) (*model.GetVillageWithCityResult, error) {
	db := config.DbManager().Table("village")
	village := model.GetVillageWithCityResult{}

	db = db.Select("village.name AS village_name, city.name AS city_name").
		Joins("JOIN district ON village.district_id = district.id").
		Joins("JOIN city ON district.city_id = city.id")

	if params.ID != 0 {
		db = db.Where("village.id = ?", params.ID)
	}

	err := db.First(&village).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &village, nil
}

func (c *VillageRepositoryCtx) InsertVillage(village *model.Village) (*model.Village, error) {
	db := config.DbManager()
	err := db.Create(village).Error
	if err != nil {
		return nil, err
	}

	return village, nil
}

func (c *VillageRepositoryCtx) Find(params *model.FindVillageRequest) ([]model.Village, error) {
	db := config.DbManager()
	villages := []model.Village{}

	if len(params.IDs) != 0 {
		db = db.Where("id IN (?)", params.IDs)
	}

	if params.DistrictID != 0 {
		db = db.Where("district_id = ?", params.DistrictID)
	}

	if params.Search != "" {
		db = db.Where("name ILIKE ?", "%"+params.Search+"%")
	}

	if params.ExcludeIDs != "" {
		db = db.Where(fmt.Sprintf("id NOT IN (%s)", params.ExcludeIDs))
	}

	err := db.Find(&villages).Error
	if err != nil {
		return nil, err
	}

	return villages, nil
}

func (c *VillageRepositoryCtx) Update(village *model.Village) (*model.Village, error) {
	db := config.DbManager().Model(&model.Village{})
	update := map[string]interface{}{}

	update["name"] = village.Name
	update["district_id"] = village.DistrictID
	update["lat"] = village.Lat
	update["long"] = village.Long
	update["population"] = village.Population
	update["field_code"] = village.FieldCode
	update["pic_name"] = village.PicName
	update["pic_contact"] = village.PicContact

	err := db.Where("id = ?", village.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return village, nil
}

func (c *VillageRepositoryCtx) Delete(village *model.Village) error {
	db := config.DbManager()

	err := db.Delete(village).Error
	if err != nil {
		return err
	}

	return nil
}

func (c *VillageRepositoryCtx) SumPopulation(excludeVillageIDs string, villageID int64) (int64, error) {
	type tempRes struct {
		Sum int64 `gorm:"column:sum"`
	}

	db := config.DbManager()
	res := tempRes{}

	query := "SELECT SUM(population) FROM village"

	if villageID > 0 {
		query += fmt.Sprintf(" WHERE id = %d", villageID)
	}

	if excludeVillageIDs != "" {
		if villageID > 0 {
			query += " AND"
		} else {
			query += " WHERE"
		}
		query += fmt.Sprintf(" id NOT IN (%s)", excludeVillageIDs)
	}

	err := db.Raw(query).Scan(&res).Error
	if err != nil {
		return 0, err
	}

	return res.Sum, nil
}

func (c *VillageRepositoryCtx) Count(excludeVillageIDs string) (int64, error) {
	var count int64
	db := config.DbManager().Model(&model.Village{})

	if excludeVillageIDs != "" {
		db = db.Where(fmt.Sprintf("id NOT IN (%s)", excludeVillageIDs))
	}

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}
