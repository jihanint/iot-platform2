package repository

import (
	"errors"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type AlertRepository interface {
	Insert(alerts []model.Alert) ([]model.Alert, error)
	Get(params *model.GetAlertParam) (*model.Alert, error)
	Find(params *model.AlertListParam) ([]model.AlertListResult, error)
	Count(params *model.AlertListParam) (int64, error)
	Update(alert *model.Alert) (*model.Alert, error)
	Delete(alert *model.Alert) error
	CountGroupedAlert(param model.CountGroupedAlertParam) ([]model.GroupedAlertCountRes, error)
}

type AlertRepositoryCtx struct{}

func (c *AlertRepositoryCtx) Insert(alerts []model.Alert) ([]model.Alert, error) {
	db := config.DbManager()
	query := "INSERT INTO alert (village_id, type, message, status) VALUES "
	values := []interface{}{}

	for _, alert := range alerts {
		query += "(?, ?, ?, ?),"
		values = append(values, alert.VillageID, alert.Type, alert.Message, alert.Status)
	}

	query = query[:len(query)-1]

	err := db.Exec(query, values...).Error
	if err != nil {
		return nil, err
	}

	return alerts, nil
}

func (c *AlertRepositoryCtx) Get(params *model.GetAlertParam) (*model.Alert, error) {
	db := config.DbManager()
	alert := model.Alert{}

	if params.ID != 0 {
		db = db.Where("id = ?", params.ID)
	}

	if params.VillageID != 0 {
		db = db.Where("village_id = ?", params.VillageID)
	}

	if params.Type != 0 {
		db = db.Where("type = ?", params.Type)
	}

	if params.Message != "" {
		db = db.Where("message = ?", params.Message)
	}

	if params.IsToday {
		db = db.Where("created_at >= current_date AND created_at < current_date + interval '1 day'")
	}

	if params.IsPreload {
		db = db.Preload("Village")
	}

	err := db.First(&alert).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &alert, nil
}

func (c *AlertRepositoryCtx) Find(params *model.AlertListParam) ([]model.AlertListResult, error) {
	db := config.DbManager()
	alerts := []model.AlertListResult{}

	db = db.Table("alert").
		Select("alert.id, village.name AS village_name, city.name AS city_name, alert.type, alert.message, alert.comment, alert.created_at").
		Joins("JOIN village ON village.id = alert.village_id").
		Joins("JOIN district ON district.id = village.district_id").
		Joins("JOIN city ON city.id = district.city_id").
		Where("alert.status = 0")

	if params.CityID != 0 {
		db = db.Where("city.id = ?", params.CityID)
	} else if len(params.VillageIDs) > 0 {
		db = db.Where("alert.village_id IN (?)", params.VillageIDs)
	}

	if params.StartCreatedAt != (time.Time{}) && params.EndCreatedAt != (time.Time{}) {
		db = db.Where("alert.created_at BETWEEN ? AND ?", params.StartCreatedAt, params.EndCreatedAt)
	}

	db = db.Order("alert.created_at DESC, alert.id DESC")

	if params.PageSize != 0 && params.PageNumber != 0 {
		offset := (params.PageNumber - 1) * params.PageSize
		db = db.Offset(offset).Limit(params.PageSize)
	}

	err := db.Scan(&alerts).Error
	if err != nil {
		return nil, err
	}

	return alerts, nil
}

func (c *AlertRepositoryCtx) Count(params *model.AlertListParam) (int64, error) {
	var count int64
	db := config.DbManager()

	db = db.Table("alert").
		Select("alert.id, village.name AS village_name, city.name AS city_name, alert.type, alert.message, alert.created_at").
		Joins("JOIN village ON village.id = alert.village_id").
		Joins("JOIN district ON district.id = village.district_id").
		Joins("JOIN city ON city.id = district.city_id").
		Where("alert.status = 0")

	if params.CityID != 0 {
		db = db.Where("city.id = ?", params.CityID)
	} else if len(params.VillageIDs) > 0 {
		db = db.Where("alert.village_id IN (?)", params.VillageIDs)
	}

	if params.StartCreatedAt != (time.Time{}) && params.EndCreatedAt != (time.Time{}) {
		db = db.Where("alert.created_at BETWEEN ? AND ?", params.StartCreatedAt, params.EndCreatedAt)
	}

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (c *AlertRepositoryCtx) Update(alert *model.Alert) (*model.Alert, error) {
	db := config.DbManager().Model(&model.Alert{})
	update := map[string]interface{}{}

	if alert.Status != 0 {
		update["status"] = alert.Status
	}

	if alert.Comment != "" {
		update["comment"] = alert.Comment
	}

	update["updated_at"] = time.Now()

	err := db.Where("id = ?", alert.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return alert, nil
}

func (c *AlertRepositoryCtx) Delete(alert *model.Alert) error {
	db := config.DbManager()

	db = db.Where("village_id = ?", alert.VillageID)
	err := db.Delete(alert).Error
	if err != nil {
		return err
	}

	return nil
}

func (c *AlertRepositoryCtx) CountGroupedAlert(param model.CountGroupedAlertParam) ([]model.GroupedAlertCountRes, error) {
	db := config.DbManager()
	results := []model.GroupedAlertCountRes{}

	err := db.Table("alert").
		Select("type, message, COUNT(*) as alert_count").
		Where("village_id = ?", param.VillageID).
		Where("created_at > ?", param.StartCreatedAt).
		Where("created_at < ?", param.EndCreatedAt).
		Group("type, message").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return results, nil
}
