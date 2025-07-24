package model

import "time"

type DeviceStatusLog struct {
	ID             int64     `gorm:"column:id;primary_key"`
	DeviceID       int64     `gorm:"column:device_id"`
	RSSI           int64     `gorm:"column:rssi"`
	BatteryCurrent float64   `gorm:"column:battery_current"`
	BatteryLevel   float64   `gorm:"column:battery_level"`
	BatteryPower   float64   `gorm:"column:battery_power"`
	Lat            float64   `gorm:"column:lat"`
	Long           float64   `gorm:"column:long"`
	CreatedAt      time.Time `gorm:"column:created_at"`
	DeviceTime     time.Time `gorm:"column:device_time"`

	Device Device `gorm:"foreignkey:DeviceID"`
}

type LogStatusRequest struct {
	DeviceCode     string  `json:"device_code"`
	RSSI           int64   `json:"rssi"`
	BatteryCurrent float64 `json:"battery_current"`
	BatteryLevel   float64 `json:"battery_level"`
	BatteryPower   float64 `json:"battery_power"`
	Lat            float64 `json:"lat"`
	Long           float64 `json:"long"`
	Timestamp      int64   `json:"timestamp"`
	DeviceID       int64
}

type StatusLogsRequest struct {
	Code string `query:"code"`
	BasicGetParam
}

type StatusLogsResponse struct {
	Statuses []StatusLogsResponseData
	Meta     MetaPagination
}

type StatusLogsResponseData struct {
	ID             int64     `json:"id"`
	DeviceCode     string    `json:"device_code"`
	RSSI           int64     `json:"rssi"`
	BatteryCurrent float64   `json:"battery_current"`
	BatteryLevel   float64   `json:"battery_level"`
	BatteryPower   float64   `json:"battery_power"`
	Lat            float64   `json:"lat"`
	Long           float64   `json:"long"`
	CreatedAt      time.Time `json:"created_at"`
	DeviceTime     time.Time `json:"device_time"`
}

type StatusLogsParam struct {
	Code       string
	PageSize   int64
	PageNumber int64
}

type StatusLogsResult struct {
	ID             int64     `json:"id"`
	DeviceCode     string    `json:"device_code"`
	RSSI           int64     `json:"rssi"`
	BatteryCurrent float64   `json:"battery_current"`
	BatteryLevel   float64   `json:"battery_level"`
	BatteryPower   float64   `json:"battery_power"`
	Lat            float64   `json:"lat"`
	Long           float64   `json:"long"`
	CreatedAt      time.Time `json:"created_at"`
	DeviceTime     time.Time `json:"device_time"`
}
