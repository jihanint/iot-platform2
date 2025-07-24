package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type ProvinceRepository interface {
	InsertProvince(province *model.Province) (*model.Province, error)
	InsertWithTx(tx *gorm.DB, province *model.Province) (*model.Province, error)
	Find() ([]model.Province, error)
}

type ProvinceRepositoryCtx struct{}

func (c *ProvinceRepositoryCtx) InsertProvince(province *model.Province) (*model.Province, error) {
	db := config.DbManager()
	err := db.Create(province).Error
	if err != nil {
		return nil, err
	}

	return province, nil
}

func (c *ProvinceRepositoryCtx) InsertWithTx(tx *gorm.DB, province *model.Province) (*model.Province, error) {
	err := tx.Create(province).Error
	if err != nil {
		return nil, err
	}

	return province, nil
}

func (c *ProvinceRepositoryCtx) Find() ([]model.Province, error) {
	db := config.DbManager()
	provinces := []model.Province{}

	err := db.Find(&provinces).Error
	if err != nil {
		return nil, err
	}

	return provinces, nil
}
