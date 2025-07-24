package repository

import (
	"errors"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type UserRoleRepository interface {
	InsertUserRole(userRole *model.UserRole) (*model.UserRole, error)
	InsertWithTx(tx *gorm.DB, userRole *model.UserRole) (*model.UserRole, error)
	GetUserRolesWithPreload(params *model.UserRole) ([]model.UserRole, error)
	DeleteWithTx(tx *gorm.DB, userRole *model.UserRole) error
}

type UserRoleRepositoryCtx struct{}

func (c *UserRoleRepositoryCtx) InsertUserRole(userRole *model.UserRole) (*model.UserRole, error) {
	db := config.DbManager()
	err := db.Create(userRole).Error
	if err != nil {
		return nil, err
	}

	return userRole, nil
}

func (c *UserRoleRepositoryCtx) InsertWithTx(tx *gorm.DB, userRole *model.UserRole) (*model.UserRole, error) {
	err := tx.Create(userRole).Error
	if err != nil {
		return nil, err
	}

	return userRole, nil
}

func (c *UserRoleRepositoryCtx) GetUserRolesWithPreload(params *model.UserRole) ([]model.UserRole, error) {
	db := config.DbManager()
	userRoles := []model.UserRole{}

	if params.UserID != 0 {
		db = db.Where("user_id = ?", params.UserID)
	}

	err := db.Preload("Role").Find(&userRoles).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return userRoles, nil
}

func (c *UserRoleRepositoryCtx) DeleteWithTx(tx *gorm.DB, userRole *model.UserRole) error {
	tx = tx.Where("user_id = ?", userRole.UserID)
	err := tx.Delete(userRole).Error
	if err != nil {
		return err
	}

	return nil
}
