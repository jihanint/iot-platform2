package model

import (
	"time"

	"github.com/lib/pq"
)

type DeviceCalibration struct {
	ID                int64           `gorm:"column:id;primary_key"`
	DeviceID          int64           `gorm:"column:device_id"`
	Shape             string          `gorm:"column:shape"`
	Diameter          float64         `gorm:"column:diameter"`
	Length            float64         `gorm:"column:length"`
	Width             float64         `gorm:"column:width"`
	Test              string          `gorm:"column:test"`
	InflowCalculated  pq.Float64Array `gorm:"column:inflow_calculated;type:numeric[]"`
	OutflowCalculated pq.Float64Array `gorm:"column:outflow_calculated;type:numeric[]"`
	LevelCalculated   float64         `gorm:"column:level_calculated"`
	CreatedAt         time.Time       `gorm:"column:created_at"`
	UpdatedAt         time.Time       `gorm:"column:updated_at"`

	Device Device `gorm:"foreignkey:DeviceID"`
}

type CalibrateDeviceRequest struct {
	DeviceID int64                  `json:"device_id"`
	Shape    string                 `json:"shape"`
	Diameter float64                `json:"diameter"`
	Length   float64                `json:"length"`
	Width    float64                `json:"width"`
	Inflow   []WaterFlowCalibration `json:"inflow"`
	Outflow  []WaterFlowCalibration `json:"outflow"`
	Level    WaterCalibrationData   `json:"level"`
}

type WaterFlowCalibration struct {
	FirstTest  WaterCalibrationData `json:"first_test"`
	SecondTest WaterCalibrationData `json:"second_test"`
	ThirdTest  WaterCalibrationData `json:"third_test"`
}

type WaterCalibrationData struct {
	ActualLevel    float64 `json:"actual_level"`
	TelemetryLevel float64 `json:"telemetry_level"`
}

type WaterCalibrationTest struct {
	Inflow  []WaterFlowCalibration `json:"inflow"`
	Outflow []WaterFlowCalibration `json:"outflow"`
	Level   WaterCalibrationData   `json:"level"`
}

type CalibratedDeviceRequest struct {
	DeviceID int64 `query:"device_id"`
}

type CalibratedDeviceResponse struct {
	DeviceID int64                  `json:"device_id"`
	Shape    string                 `json:"shape"`
	Diameter float64                `json:"diameter"`
	Length   float64                `json:"length"`
	Width    float64                `json:"width"`
	Inflow   []WaterFlowCalibration `json:"inflow"`
	Outflow  []WaterFlowCalibration `json:"outflow"`
	Level    WaterCalibrationData   `json:"level"`
}

type FindByDeviceIDsResult struct {
	DeviceID          int64           `gorm:"column:device_id"`
	InflowCalculated  pq.Float64Array `gorm:"column:inflow_calculated;type:numeric[]"`
	OutflowCalculated pq.Float64Array `gorm:"column:outflow_calculated;type:numeric[]"`
	LevelCalculated   float64         `gorm:"column:level_calculated"`
}
