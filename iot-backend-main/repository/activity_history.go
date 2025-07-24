package repository

import (
	"fmt"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type ActivityHistoryRepository interface {
	Insert(activityHistory *model.ActivityHistory) (*model.ActivityHistory, error)
	Find(params *model.ActivityHistoriesRequest) ([]model.ActivityHistory, error)
	Count(params *model.ActivityHistoriesRequest) (int64, error)
	Delete(activityHistory *model.ActivityHistory) error
}

type ActivityHistoryRepositoryCtx struct{}

func (c *ActivityHistoryRepositoryCtx) Insert(activityHistory *model.ActivityHistory) (*model.ActivityHistory, error) {
	db := config.DbManager()
	err := db.Create(activityHistory).Error
	if err != nil {
		return nil, err
	}

	return activityHistory, nil
}

func (c *ActivityHistoryRepositoryCtx) Find(params *model.ActivityHistoriesRequest) ([]model.ActivityHistory, error) {
	db := config.DbManager()
	activityHistories := []model.ActivityHistory{}

	if params.Interval != "" && params.FilterRange != 0 {
		db = db.Where(fmt.Sprintf("EXTRACT(%s FROM created_at) = %d", params.Interval, params.FilterRange)) // TODO also filter by its month (only for filter day) and by its year
	}

	if len(params.VillageIDs) != 0 {
		db = db.Where("village_id IN (?)", params.VillageIDs)
	}

	db = db.Order("created_at DESC")

	if params.PageSize != 0 && params.PageNumber != 0 {
		offset := (params.PageNumber - 1) * params.PageSize
		db = db.Offset(offset).Limit(params.PageSize)
	}

	err := db.Find(&activityHistories).Error
	if err != nil {
		return nil, err
	}

	return activityHistories, nil
}

func (c *ActivityHistoryRepositoryCtx) Count(params *model.ActivityHistoriesRequest) (int64, error) {
	var count int64
	db := config.DbManager().Model(&model.ActivityHistory{})

	db = db.Where(fmt.Sprintf("EXTRACT(%s FROM created_at) = %d", params.Interval, params.FilterRange)) // TODO also filter by its month (only for filter day) and by its year

	if len(params.VillageIDs) != 0 {
		db = db.Where("village_id IN (?)", params.VillageIDs)
	}

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (c *ActivityHistoryRepositoryCtx) Delete(activityHistory *model.ActivityHistory) error {
	db := config.DbManager()

	db = db.Where("village_id = ?", activityHistory.VillageID)
	err := db.Delete(activityHistory).Error
	if err != nil {
		return err
	}

	return nil
}
