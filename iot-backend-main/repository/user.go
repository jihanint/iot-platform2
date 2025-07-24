package repository

import (
	"errors"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type UserRepository interface {
	GetUser(params *model.User) (*model.User, error)
	GetLoginUser(params *model.User) (*model.User, error)
	InsertUser(user *model.User) (*model.User, error)
	InsertWithTx(tx *gorm.DB, user *model.User) (*model.User, error)
	UpdateUser(user *model.User) (*model.User, error)
	UpdateWithTx(tx *gorm.DB, user *model.User) (*model.User, error)
	DeleteWithTx(tx *gorm.DB, user *model.User) error
	FindUnassign() ([]model.User, error)
	FindAssignment(villageIDs []int64) ([]model.FindAssignmentParam, error)
}

type UserRepositoryCtx struct{}

func (c *UserRepositoryCtx) GetUser(params *model.User) (*model.User, error) {
	db := config.DbManager()
	user := model.User{}

	if params.ID != 0 {
		db = db.Where("id = ?", params.ID)
	}

	if params.Email != nil && *params.Email != "" {
		db = db.Where("email = ?", params.Email)
	}

	if params.PhoneNumber != nil && *params.PhoneNumber != "" {
		db = db.Where("phone_number = ?", params.PhoneNumber)
	}

	err := db.First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (c *UserRepositoryCtx) GetLoginUser(params *model.User) (*model.User, error) {
	db := config.DbManager()
	user := model.User{}

	if params.Email != nil && *params.Email != "" {
		db = db.Where("email = ?", params.Email)
	}

	if params.PhoneNumber != nil && *params.PhoneNumber != "" {
		db = db.Where("phone_number = ?", params.PhoneNumber)
	}

	db = db.Where("status = ? OR status = ?", utils.UserVerified, utils.UserActive)

	err := db.First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (c *UserRepositoryCtx) InsertUser(user *model.User) (*model.User, error) {
	db := config.DbManager()
	err := db.Create(user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (c *UserRepositoryCtx) InsertWithTx(tx *gorm.DB, user *model.User) (*model.User, error) {
	err := tx.Create(user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (c *UserRepositoryCtx) UpdateUser(user *model.User) (*model.User, error) {
	db := config.DbManager().Model(&model.User{})
	update := map[string]interface{}{}

	if user.Status != 0 {
		update["status"] = user.Status
	}

	if user.Password != "" {
		update["password"] = user.Password
	}

	update["updated_at"] = time.Now()

	err := db.Where("id = ?", user.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (c *UserRepositoryCtx) UpdateWithTx(tx *gorm.DB, user *model.User) (*model.User, error) {
	tx = tx.Model(&model.User{})
	update := map[string]interface{}{}

	if user.Status != 0 {
		update["status"] = user.Status
	}

	if user.PhoneNumber != nil {
		update["phone_number"] = user.PhoneNumber
	}

	if user.FirstName != "" {
		update["first_name"] = user.FirstName
	}

	update["updated_at"] = time.Now()

	err := tx.Where("id = ?", user.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (c *UserRepositoryCtx) FindUnassign() ([]model.User, error) {
	db := config.DbManager()
	users := []model.User{}

	db = db.Table("users").
		Select("users.id, users.first_name, users.email, users.phone_number").
		Joins("JOIN user_role ON user_role.user_id = users.id").
		Joins("JOIN role ON role.id = user_role.role_id").
		Joins("LEFT JOIN user_detail ON user_detail.user_id = users.id").
		Where("users.status = ?", utils.UserVerified).
		Where("user_detail.id IS NULL").
		Where("role.name != ?", utils.RoleAdmin).
		Order("users.first_name ASC")

	err := db.Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (c *UserRepositoryCtx) FindAssignment(villageIDs []int64) ([]model.FindAssignmentParam, error) {
	db := config.DbManager()
	users := []model.FindAssignmentParam{}

	db = db.Table("users").
		Select("users.id, users.first_name, users.email, users.phone_number, role.name AS role, user_detail.village_ids").
		Joins("JOIN user_role ON user_role.user_id = users.id").
		Joins("JOIN role ON role.id = user_role.role_id").
		Joins("JOIN user_detail ON user_detail.user_id = users.id").
		Where("role.name != ?", utils.RoleAdmin)

	if len(villageIDs) > 0 {
		db = db.Where("user_detail.village_ids && ARRAY[?]::integer[]", villageIDs).
			Where("role.name != ?", utils.RoleUser)
	}

	db = db.Order("user_detail.id ASC")

	err := db.Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (c *UserRepositoryCtx) DeleteWithTx(tx *gorm.DB, user *model.User) error {
	tx = tx.Where("id = ?", user.ID)
	err := tx.Delete(user).Error
	if err != nil {
		return err
	}

	return nil
}
