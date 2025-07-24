package repository

import (
	"fmt"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type DeviceStatusLogRepository interface {
	Insert(dsls []model.DeviceStatusLog) ([]model.DeviceStatusLog, error)
	Find(params *model.StatusLogsParam) ([]model.StatusLogsResult, error)
	Count(params *model.StatusLogsParam) (int64, error)
}

type DeviceStatusLogRepositoryCtx struct{}

func (c *DeviceStatusLogRepositoryCtx) Insert(dsls []model.DeviceStatusLog) ([]model.DeviceStatusLog, error) {
	db := config.DbManager()
	query := "INSERT INTO device_status_log (device_id, rssi, battery_current, battery_level, battery_power, lat, long, created_at, device_time) VALUES "
	values := []interface{}{}

	for _, dsl := range dsls {
		query += "(?, ?, ?, ?, ?, ?, ?, ?, ?),"
		values = append(values, dsl.DeviceID, dsl.RSSI, dsl.BatteryCurrent, dsl.BatteryLevel, dsl.BatteryPower, dsl.Lat, dsl.Long, dsl.CreatedAt, dsl.DeviceTime)
	}

	query = query[:len(query)-1]

	err := db.Exec(query, values...).Error
	if err != nil {
		return nil, err
	}

	return dsls, nil
}

func (c *DeviceStatusLogRepositoryCtx) Find(params *model.StatusLogsParam) ([]model.StatusLogsResult, error) {
	db := config.DbManager()
	status := []model.StatusLogsResult{}

	db = db.Table("device_status_log").
		Select("device_status_log.*, device.code AS device_code").
		Joins("JOIN device ON device.id = device_status_log.device_id")

	if params.Code != "" {
		db = db.Where("device.code ILIKE ?", "%"+params.Code+"%")
	}

	offset := (params.PageNumber - 1) * params.PageSize
	db = db.Offset(offset).Limit(params.PageSize).
		Order(fmt.Sprintf("%s %s", "device_status_log.created_at", utils.OrderByDesc))

	err := db.Find(&status).Error
	if err != nil {
		return nil, err
	}

	return status, nil
}

func (c *DeviceStatusLogRepositoryCtx) Count(params *model.StatusLogsParam) (int64, error) {
	var count int64
	db := config.DbManager()

	db = db.Table("device_status_log").
		Select("device_status_log.*, device.code").
		Joins("JOIN device ON device.id = device_status_log.device_id")

	if params.Code != "" {
		db = db.Where("device.code ILIKE ?", "%"+params.Code+"%")
	}

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}
