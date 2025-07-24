package repository

import (
	"errors"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/jinzhu/gorm"
)

type RoleRepository interface {
	GetRole(params *model.Role) (*model.Role, error)
}

type RoleRepositoryCtx struct{}

func (c *RoleRepositoryCtx) GetRole(params *model.Role) (*model.Role, error) {
	db := config.DbManager()
	role := model.Role{}

	if params.Name != "" {
		db = db.Where("name = ?", params.Name)
	}

	err := db.First(&role).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &role, nil
}
