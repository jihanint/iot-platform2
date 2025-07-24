package repository

import (
	"errors"
	"strconv"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type UserDetailRepository interface {
	InsertWithTx(tx *gorm.DB, userDetail *model.UserDetail) (*model.UserDetail, error)
	UpdateWithTx(tx *gorm.DB, userDetail *model.UserDetail) (*model.UserDetail, error)
	DeleteWithTx(tx *gorm.DB, userDetail *model.UserDetail) error
	Get(params *model.UserDetail) (*model.UserDetail, error)
	Find(params *model.UserDetail) ([]model.UserDetail, error)
}

type UserDetailRepositoryCtx struct{}

func (c *UserDetailRepositoryCtx) InsertWithTx(tx *gorm.DB, userDetail *model.UserDetail) (*model.UserDetail, error) {
	err := tx.Create(userDetail).Error
	if err != nil {
		return nil, err
	}

	return userDetail, nil
}

func (c *UserDetailRepositoryCtx) UpdateWithTx(tx *gorm.DB, userDetail *model.UserDetail) (*model.UserDetail, error) {
	tx = tx.Model(&model.UserDetail{})
	update := map[string]interface{}{}

	if len(userDetail.VillageIDs) > 0 {
		update["village_ids"] = userDetail.VillageIDs
	}

	err := tx.Where("id = ?", userDetail.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return userDetail, nil
}

func (c *UserDetailRepositoryCtx) Get(params *model.UserDetail) (*model.UserDetail, error) {
	db := config.DbManager()
	user := model.UserDetail{}

	if params.UserID != 0 {
		db = db.Where("user_id = ?", params.UserID)
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

func (c *UserDetailRepositoryCtx) Find(params *model.UserDetail) ([]model.UserDetail, error) {
	db := config.DbManager()
	users := []model.UserDetail{}

	var strArray []string
	for _, villageID := range params.VillageIDs {
		strArray = append(strArray, strconv.FormatInt(villageID, 10))
	}
	searchStr := strings.Join(strArray, ",")
	db = db.Where("village_ids && ARRAY[" + searchStr + "]")

	err := db.Preload("User").Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (c *UserDetailRepositoryCtx) DeleteWithTx(tx *gorm.DB, userDetail *model.UserDetail) error {
	tx = tx.Where("user_id = ?", userDetail.UserID)
	err := tx.Delete(userDetail).Error
	if err != nil {
		return err
	}

	return nil
}
