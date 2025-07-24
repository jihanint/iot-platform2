package repository

import (
	"errors"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

type DeviceCalibrationRepository interface {
	Insert(calibration *model.DeviceCalibration) (*model.DeviceCalibration, error)
	Update(calibration *model.DeviceCalibration) (*model.DeviceCalibration, error)
	Delete(calibration *model.DeviceCalibration) error
	Get(params *model.DeviceCalibration) (*model.DeviceCalibration, error)
	FindByDeviceIDs(deviceIDs []int64) ([]model.FindByDeviceIDsResult, error)
}

type DeviceCalibrationRepositoryCtx struct{}

func (c *DeviceCalibrationRepositoryCtx) Insert(calibration *model.DeviceCalibration) (*model.DeviceCalibration, error) {
	db := config.DbManager()
	err := db.Create(calibration).Error
	if err != nil {
		return nil, err
	}

	return calibration, nil
}

func (c *DeviceCalibrationRepositoryCtx) Update(calibration *model.DeviceCalibration) (*model.DeviceCalibration, error) {
	db := config.DbManager().Model(&model.DeviceCalibration{})
	update := map[string]interface{}{}

	update["shape"] = calibration.Shape
	update["diameter"] = calibration.Diameter
	update["length"] = calibration.Length
	update["width"] = calibration.Width
	update["test"] = calibration.Test
	update["inflow_calculated"] = calibration.InflowCalculated
	update["outflow_calculated"] = calibration.OutflowCalculated
	update["level_calculated"] = calibration.LevelCalculated
	update["updated_at"] = time.Now()

	err := db.Where("device_id = ?", calibration.DeviceID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return calibration, nil
}

func (c *DeviceCalibrationRepositoryCtx) Get(params *model.DeviceCalibration) (*model.DeviceCalibration, error) {
	db := config.DbManager()
	calibration := model.DeviceCalibration{}

	if params.DeviceID != 0 {
		db = db.Where("device_id = ?", params.DeviceID)
	}

	err := db.First(&calibration).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &calibration, nil
}

func (c *DeviceCalibrationRepositoryCtx) Delete(calibration *model.DeviceCalibration) error {
	db := config.DbManager()

	db = db.Where("device_id = ?", calibration.DeviceID)
	err := db.Delete(calibration).Error
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceCalibrationRepositoryCtx) FindByDeviceIDs(deviceIDs []int64) ([]model.FindByDeviceIDsResult, error) {
	db := config.DbManager()
	calibration := []model.FindByDeviceIDsResult{}

	db = db.Table("device_calibration").
		Select("device_id, inflow_calculated, outflow_calculated, level_calculated").
		Where("device_id IN (?)", deviceIDs)

	err := db.Find(&calibration).Error
	if err != nil {
		return nil, err
	}

	return calibration, nil
}
