package model

import (
	"time"

	"github.com/lib/pq"
)

type Device struct {
	ID              int64     `gorm:"column:id;primary_key"`
	VillageID       int64     `gorm:"column:village_id"`
	Code            string    `gorm:"column:code"`
	Capacity        float64   `gorm:"column:capacity"`
	Status          int16     `gorm:"column:status"`
	Lat             float64   `gorm:"column:lat"`
	Long            float64   `gorm:"column:long"`
	Brand           string    `gorm:"column:brand"`
	Power           int64     `gorm:"column:power"`
	Level           float64   `gorm:"column:level"`
	Type            string    `gorm:"column:type"`
	MacAddress      string    `gorm:"column:mac_address"`
	Sensor          string    `gorm:"column:sensor"`
	IoTInstallDate  time.Time `gorm:"column:iot_install_date"`
	PumpInstallDate time.Time `gorm:"column:pump_install_date"`
	CreatedAt       time.Time `gorm:"column:created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at"`

	Village Village `gorm:"foreignkey:VillageID"`
}

type InstallDeviceRequest struct {
	VillageID       int64   `json:"village_id"`
	Code            string  `json:"code"`
	Capacity        float64 `json:"capacity"`
	Lat             float64 `json:"lat"`
	Long            float64 `json:"long"`
	IoTInstallDate  string  `json:"iot_install_date"`
	PumpInstallDate string  `json:"pump_install_date"`
}

type DeviceListRequest struct {
	Status     int16 `query:"status"`
	VillageIDs []int64
	BasicGetParam
}

type DeviceListResponse struct {
	DeviceID         int64     `json:"device_id"`
	DeviceCode       string    `json:"device_code"`
	VillageID        int64     `json:"village_id"`
	VillageName      string    `json:"village_name"`
	City             string    `json:"city"`
	InstallationDate time.Time `json:"installation_date"`
	LastUpdate       time.Time `json:"last_update"`
	Status           int16     `json:"status"`
}

type FindDeviceParam struct {
	VillageIDs []int64
	Status     int16
	BasicGetParam
}

type FindDeviceResult struct {
	DeviceID         int64     `json:"device_id"`
	DeviceCode       string    `json:"device_code"`
	VillageID        int64     `json:"village_id"`
	VillageName      string    `json:"village_name"`
	City             string    `json:"city"`
	InstallationDate time.Time `json:"installation_date"`
	LastUpdate       time.Time `json:"last_update"`
	Status           int16     `json:"status"`
}

type FindToBeAlertedParam struct {
	DeviceIDs    []int64
	ExcludeTypes []string
}

type FindToBeAlertedResult struct {
	DeviceID    int64  `gorm:"device_id"`
	VillageID   int64  `gorm:"village_id"`
	VillageName string `gorm:"village_name"`
	Status      int16  `gorm:"status"`
}

type SaveDeviceRequest struct {
	DeviceID int64 `json:"device_id"`

	// village related
	VillageName     string  `json:"village_name"`
	DistrictID      int64   `json:"district_id"`
	FieldCode       string  `json:"field_code"`
	Lat             float64 `json:"lat"`
	Long            float64 `json:"long"`
	Population      int64   `json:"population"`
	PumpInstallDate string  `json:"pump_install_date"`
	PicName         string  `json:"pic_name"`
	PicContact      string  `json:"pic_contact"`

	// device related
	DeviceCode     string  `json:"device_code"`
	Brand          string  `json:"brand"`
	Capacity       float64 `json:"capacity"`
	Power          int64   `json:"power"`
	Level          float64 `json:"level"`
	Type           string  `json:"type"`
	IoTInstallDate string  `json:"iot_install_date"`
}

type (
	DeviceFunctionalityStatsRequest struct {
		Area       string `query:"area"`
		VillageIDs []int64
		Roles      []string
	}

	DeviceFunctionalityStatsResponse struct {
		Functioning             DeviceFunctionalityStatsData `json:"functioning"`
		NonFunctioning          DeviceFunctionalityStatsData `json:"non_functioning"`
		PermanentNonFunctioning DeviceFunctionalityStatsData `json:"permanent_non_functioning"`
	}

	DeviceFunctionalityStatsData struct {
		Total      int64   `json:"total"`
		Difference float64 `json:"difference"`
	}

	DeviceFunctionalityStatsParam struct {
		VillageIDs []int64
	}

	DeviceFunctionalityStatsResult struct {
		ID     int64 `gorm:"column:id"`
		Status int16 `gorm:"column:status"`
	}
)

type DeviceCalibrationListRequest struct {
	VillageIDs []int64
	BasicGetParam
}

type DeviceCalibrationListResponse struct {
	DeviceID                    int64     `json:"device_id"`
	VillageID                   int64     `json:"village_id"`
	VillageName                 string    `json:"village_name"`
	City                        string    `json:"city"`
	WaterLevelCalibrationStatus int16     `json:"water_level_calibration_status"`
	WaterFlowCalibrationStatus  int16     `json:"water_flow_calibration_status"`
	CalibrationDate             time.Time `json:"calibration_date"`
}

type FindDeviceCalibrationParam struct {
	VillageIDs []int64
	BasicGetParam
}

type FindDeviceCalibrationResult struct {
	DeviceID           int64           `gorm:"device_id"`
	VillageID          int64           `gorm:"village_id"`
	VillageName        string          `gorm:"village_name"`
	City               string          `gorm:"city"`
	InflowCalibration  pq.Float64Array `gorm:"inflow_calibration"`
	OutflowCalibration pq.Float64Array `gorm:"outflow_calibration"`
	LevelCalibration   float64         `gorm:"level_calibration"`
	CalibrationDate    time.Time       `gorm:"calibration_date"`
}

type SavedDeviceRequest struct {
	DeviceID int64 `query:"device_id"`
}

type SavedDeviceResponse struct {
	DeviceID    int64            `json:"device_id"`
	VillageData SavedVillageData `json:"village_data"`
	DeviceData  SavedDeviceData  `json:"device_data"`
}

type SavedVillageData struct {
	VillageName     string  `json:"village_name"`
	ProvinceID      int64   `json:"province_id"`
	ProvinceName    string  `json:"province_name"`
	CityID          int64   `json:"city_id"`
	CityName        string  `json:"city_name"`
	DistrictID      int64   `json:"district_id"`
	DistrictName    string  `json:"district_name"`
	FieldCode       string  `json:"field_code"`
	Lat             float64 `json:"lat"`
	Long            float64 `json:"long"`
	Population      int64   `json:"population"`
	PumpInstallDate string  `json:"pump_install_date"`
	PicName         string  `json:"pic_name"`
	PicContact      string  `json:"pic_contact"`
}

type SavedDeviceData struct {
	DeviceCode     string  `json:"device_code"`
	Brand          string  `json:"brand"`
	Capacity       float64 `json:"capacity"`
	Power          int64   `json:"power"`
	Level          float64 `json:"level"`
	Type           string  `json:"type"`
	Sensor         string  `json:"sensor"`
	IoTInstallDate string  `json:"iot_install_date"`
}

type SavedDeviceResult struct {
	DeviceID int64 `gorm:"column:device_id"`

	// village related
	VillageName     string  `gorm:"column:village_name"`
	ProvinceID      int64   `gorm:"column:province_id"`
	ProvinceName    string  `gorm:"column:province_name"`
	CityID          int64   `gorm:"column:city_id"`
	CityName        string  `gorm:"column:city_name"`
	DistrictID      int64   `gorm:"column:district_id"`
	DistrictName    string  `gorm:"column:district_name"`
	FieldCode       string  `gorm:"column:field_code"`
	Lat             float64 `gorm:"column:lat"`
	Long            float64 `gorm:"column:long"`
	Population      int64   `gorm:"column:population"`
	PumpInstallDate string  `gorm:"column:pump_install_date"`
	PicName         string  `gorm:"column:pic_name"`
	PicContact      string  `gorm:"column:pic_contact"`

	// device related
	DeviceCode     string  `gorm:"column:device_code"`
	Brand          string  `gorm:"column:brand"`
	Capacity       float64 `gorm:"column:capacity"`
	Power          int64   `gorm:"column:power"`
	Level          float64 `gorm:"column:level"`
	Type           string  `gorm:"column:type"`
	Sensor         string  `gorm:"column:sensor"`
	IoTInstallDate string  `gorm:"column:iot_install_date"`
}
