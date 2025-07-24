package repository

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type DeviceRepository interface {
	Get(params *model.Device) (*model.Device, error)
	InsertDevice(device *model.Device) (*model.Device, error)
	Find(params *model.FindDeviceParam) ([]model.Device, error)
	FindDeviceList(params *model.FindDeviceParam) ([]model.FindDeviceResult, error)
	FindDeviceCalibrationList(params *model.FindDeviceCalibrationParam) ([]model.FindDeviceCalibrationResult, error)
	FindToBeAlerted(params *model.FindToBeAlertedParam) ([]model.FindToBeAlertedResult, error)
	FindFunctionalityStats(params *model.DeviceFunctionalityStatsParam) ([]model.DeviceFunctionalityStatsResult, error)
	Update(device *model.Device) (*model.Device, error)
	BulkUpdateStatus(devices []model.Device) error
	UpdateCode(device *model.Device) (*model.Device, error)
	Delete(params *model.Device) error
	GetSaved(deviceID int64) (*model.SavedDeviceResult, error)
}

type DeviceRepositoryCtx struct{}

const (
	queryFormatUpdateDeviceStatusBulk string = `
	UPDATE device
	SET status = v.new_status::smallint
	FROM (
		VALUES %s
	) AS v(id, new_status)
	WHERE device.id = v.id::int;
	`
)

func (c *DeviceRepositoryCtx) Get(params *model.Device) (*model.Device, error) {
	db := config.DbManager()
	device := model.Device{}

	if params.ID != 0 {
		db = db.Where("id = ?", params.ID)
	}

	if params.VillageID != 0 {
		db = db.Where("village_id = ?", params.VillageID)
	}

	if params.Code != "" {
		db = db.Where("code = ?", params.Code)
	}

	if params.MacAddress != "" {
		db = db.Where("mac_address = ?", params.MacAddress)
	}

	err := db.First(&device).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &device, nil
}

func (c *DeviceRepositoryCtx) InsertDevice(device *model.Device) (*model.Device, error) {
	db := config.DbManager()
	err := db.Create(device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) Find(params *model.FindDeviceParam) ([]model.Device, error) {
	db := config.DbManager()
	device := []model.Device{}

	if len(params.VillageIDs) != 0 {
		db = db.Where("village_id IN (?)", params.VillageIDs)
	}

	err := db.Preload("Village").Find(&device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) FindDeviceList(params *model.FindDeviceParam) ([]model.FindDeviceResult, error) {
	db := config.DbManager().Table("device")
	device := []model.FindDeviceResult{}

	db = db.Select(`
		device.id AS device_id,
		device.code AS device_code,
		village.id AS village_id,
		village.name AS village_name,
		city.name AS city,
		DATE_TRUNC('second', device.pump_install_date) AS installation_date,
		device.status AS status
	`)

	db = db.Joins("JOIN village ON device.village_id = village.id").
		Joins("JOIN district ON village.district_id = district.id").
		Joins("JOIN city ON district.city_id = city.id")

	if len(params.VillageIDs) != 0 {
		db = db.Where("device.village_id IN (?)", params.VillageIDs)
	}

	if params.Status != 0 {
		db = db.Where("device.status = ?", params.Status)
	}

	if params.Search != "" {
		db = db.Where("village.name ILIKE ?", "%"+params.Search+"%")
	}

	if params.SortBy != "" {
		orderBy := utils.OrderByAsc
		if params.OrderBy != "" {
			orderBy = params.OrderBy
		}
		db = db.Order(fmt.Sprintf("%s %s", params.SortBy, orderBy))
	}

	err := db.Find(&device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) FindToBeAlerted(params *model.FindToBeAlertedParam) ([]model.FindToBeAlertedResult, error) {
	db := config.DbManager().Table("device")
	device := []model.FindToBeAlertedResult{}

	db = db.Select(`
		device.id AS device_id,
		device.village_id AS village_id,
		village.name AS village_name,
		device.status
	`)

	db = db.Joins("JOIN village ON device.village_id = village.id")
	db = db.Where("device.id IN (?)", params.DeviceIDs)

	if len(params.ExcludeTypes) > 0 {
		db = db.Where("device.type NOT IN (?)", params.ExcludeTypes)
	}

	err := db.Find(&device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) FindFunctionalityStats(params *model.DeviceFunctionalityStatsParam) ([]model.DeviceFunctionalityStatsResult, error) {
	db := config.DbManager().Table("device")
	device := []model.DeviceFunctionalityStatsResult{}

	db = db.Select(`device.id, device.status`)

	if len(params.VillageIDs) > 0 {
		db = db.Where("device.village_id IN (?)", params.VillageIDs)
	}

	err := db.Find(&device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) Update(device *model.Device) (*model.Device, error) {
	db := config.DbManager().Model(&model.Device{})
	update := map[string]interface{}{}

	update["capacity"] = device.Capacity
	update["lat"] = device.Lat
	update["long"] = device.Long
	update["brand"] = device.Brand
	update["power"] = device.Power
	update["level"] = device.Level
	update["type"] = device.Type
	update["mac_address"] = device.MacAddress
	update["iot_install_date"] = device.IoTInstallDate
	update["pump_install_date"] = device.PumpInstallDate
	update["updated_at"] = time.Now()

	err := db.Where("id = ?", device.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) UpdateCode(device *model.Device) (*model.Device, error) {
	db := config.DbManager().Model(&model.Device{})
	update := map[string]interface{}{}

	update["mac_address"] = device.MacAddress
	update["code"] = device.Code
	update["updated_at"] = time.Now()

	err := db.Where("id = ?", device.ID).Updates(update).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) Delete(device *model.Device) error {
	db := config.DbManager()

	err := db.Delete(device).Error
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceRepositoryCtx) FindDeviceCalibrationList(params *model.FindDeviceCalibrationParam) ([]model.FindDeviceCalibrationResult, error) {
	db := config.DbManager().Table("device")
	device := []model.FindDeviceCalibrationResult{}

	db = db.Select(`
		device.id AS device_id,
		village_id AS village_id,
		village.name AS village_name,
		city.name AS city,
		device_calibration.inflow_calculated AS inflow_calibration,
		device_calibration.outflow_calculated AS outflow_calibration,
		device_calibration.level_calculated AS level_calibration,
		device_calibration.updated_at AS calibration_date
	`)

	db = db.Joins("JOIN village ON device.village_id = village.id").
		Joins("JOIN district ON village.district_id = district.id").
		Joins("JOIN city ON district.city_id = city.id").
		Joins("left join device_calibration on device_calibration.device_id = device.id")

	if len(params.VillageIDs) != 0 {
		db = db.Where("device.village_id IN (?)", params.VillageIDs)
	}

	if params.Search != "" {
		db = db.Where("village.name ILIKE ?", "%"+params.Search+"%")
	}

	if params.SortBy != "" {
		orderBy := utils.OrderByAsc
		if params.OrderBy != "" {
			orderBy = params.OrderBy
		}
		db = db.Order(fmt.Sprintf("%s %s", params.SortBy, orderBy))
	}

	err := db.Find(&device).Error
	if err != nil {
		return nil, err
	}

	return device, nil
}

func (c *DeviceRepositoryCtx) GetSaved(deviceID int64) (*model.SavedDeviceResult, error) {
	db := config.DbManager().Table("device")
	device := model.SavedDeviceResult{}

	db = db.Select(`
		device.id AS device_id,
		village.name AS village_name,
		province.id AS province_id,
		province.name AS province_name,
		city.id AS city_id,
		city.name AS city_name,
		district.id AS district_id,
		district.name AS district_name,
		village.field_code,
		village.lat,
		village.long,
		village.population,
		device.pump_install_date,
		village.pic_name,
		village.pic_contact,
		device.mac_address AS device_code,
		device.brand,
		device.capacity,
		device.power,
		device."level",
		device."type",
		device.sensor,
		device.iot_install_date
	`)

	db = db.Joins("JOIN village ON device.village_id = village.id").
		Joins("JOIN district ON village.district_id = district.id").
		Joins("JOIN city ON district.city_id = city.id").
		Joins("JOIN province ON city.province_id = province.id")

	db = db.Where("device.id = ?", deviceID)

	err := db.First(&device).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &device, nil
}

func (c *DeviceRepositoryCtx) BulkUpdateStatus(devices []model.Device) error {
	db := config.DbManager()

	valueArgs, valueParams := constructUpdateDeviceStatusBulk(devices)
	query := fmt.Sprintf(queryFormatUpdateDeviceStatusBulk, strings.Join(valueParams, ","))

	err := db.Exec(query, valueArgs...).Error
	if err != nil {
		return err
	}

	return nil
}

func constructUpdateDeviceStatusBulk(devices []model.Device) (valueArgs []interface{}, valueParams []string) {
	idx := 1
	valueArgs = []interface{}{}
	valueParams = []string{}

	for _, device := range devices {
		valueParams = append(valueParams, fmt.Sprintf("($%d, $%d)",
			idx, idx+1))
		valueArgs = append(valueArgs,
			device.ID,
			device.Status)
		idx += 2
	}

	return valueArgs, valueParams
}
