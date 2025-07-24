package model

import (
	"time"

	"github.com/lib/pq"
)

type TelemetryRequest struct {
	DeviceCode  string    `json:"device_code"`
	Inflow      []float64 `json:"inflow"`
	Outflow     []float64 `json:"outflow"`
	Level       float64   `json:"level"`
	InVolume    []float64 `json:"involume"`
	OutVolume   []float64 `json:"outvolume"`
	Timestamp   int64     `json:"timestamp"`
	DeviceID    int64
	VillageID   int64
	DeviceLevel float64
}

type GetWaterChartRequest struct {
	Interval          string `query:"interval"` // month, week, day
	Area              string `query:"area"`
	Previous          int64  `query:"previous"`
	StartTime         string `query:"start_time"`
	EndTime           string `query:"end_time"`
	Frequency         string `query:"frequency"` // day, hour
	VillageIDs        []int64
	ExcludeVillageIDs string
	Roles             []string
}

type GetWaterChartResponse struct {
	Series []WaterData `json:"series"`
	Date   []time.Time `json:"date"`
}

type WaterData struct {
	Name string    `json:"name"`
	Data []float64 `json:"data"`
}

type FindAnomalyParam struct {
	IsYesterday bool
	WaterType   string
}

type FindAnomalyResult struct {
	DeviceID int64   `gorm:"column:device_id"`
	Value    float64 `gorm:"column:value"`
	Level    float64 `gorm:"column:level"`
}

type TelemetryListRequest struct {
	Code string `query:"code"`
	BasicGetParam
}

type TelemetryListResponse struct {
	Telemetry []TelemetryListResponseData
	Meta      MetaPagination
}

type TelemetryListResponseData struct {
	ID         int64     `json:"id"`
	DeviceCode string    `json:"device_code"`
	Inflow     []float64 `json:"inflow"`
	Outflow    []float64 `json:"outflow"`
	Level      float64   `json:"level"`
	Involume   []float64 `json:"involume"`
	Outvolume  []float64 `json:"outvolume"`
	CreatedAt  time.Time `json:"created_at"`
	DeviceTime time.Time `json:"device_time"`
}

type TelemetryListResult struct {
	ID         int64
	DeviceCode string
	Inflow     pq.Float64Array
	Outflow    pq.Float64Array
	Level      float64
	Involume   pq.Float64Array
	Outvolume  pq.Float64Array
	CreatedAt  time.Time
	DeviceTime time.Time
}

type GetWaterListRequest struct {
	VillageID  int64  `query:"village_id"`
	WaterType  string `query:"water_type"`
	Interval   string `query:"interval"`
	VillageIDs []int64
	BasicGetParam
}

type GetWaterListResponseData struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"` // using DeviceTime value
	Value     float64   `json:"value"`
	Status    int16     `json:"status"`
}

type GetWaterListResponse struct {
	Water []GetWaterListResponseData
	Meta  MetaPagination
}

type FindWaterListByVillageParam struct {
	VillageID   int64
	Interval    string
	FilterRange int16
	IsDay       bool
	Month       int16
	Year        int16
	WaterType   string
	BasicGetParam
}

type FindWaterListByVillageResult struct {
	ID         int64           `gorm:"column:id;primary_key"`
	DeviceTime time.Time       `gorm:"column:device_time"`
	Value      float64         `gorm:"column:value"`
	ValueList  pq.Float64Array `gorm:"column:value_list;type:_float8[]"`
}

type ConstructWaterListResultParam struct {
	WaterList   []FindWaterListByVillageResult
	WaterType   string
	Device      *Device
	Calibration *DeviceCalibration
}

type GetCalibratedWaterFlowParam struct {
	Values      []float64
	WaterType   string
	Calibration *DeviceCalibration
}

type GetCalibratedWaterLevelParam struct {
	Value       float64
	DeviceLevel float64
	Calibration *DeviceCalibration
}

type (
	GetLatestTelemetryParam struct {
		DeviceIDs []int64
	}

	GetLatestTelemetryResult struct {
		DeviceID        int64
		LatestCreatedAt time.Time
	}
)

type GetSumWaterFlowReq struct {
	VillageID int64 `query:"village_id"`
}

type GetSumWaterFlowResp struct {
	WaterUsage      float64 `json:"water_usage"`
	WaterProduction float64 `json:"water_production"`
	HoursSaved      float64 `json:"hours_saved"`
	IncomeIncreased float64 `json:"income_increased"`
	PeopleReach     int64   `json:"people_reach"`
	VillageServed   int64   `json:"village_served"`
}

type SumGroupedWaterFlowFromDBRes struct {
	VillageID int64   `gorm:"column:village_id"`
	Total     float64 `gorm:"column:total"`
}

type GetWaterReportReq struct {
	VillageID int64  `query:"village_id"`
	StartTime string `query:"start_time"`
	EndTime   string `query:"end_time"`
	Start     time.Time
	End       time.Time
}

type GetWaterReportResp struct {
	AlertCount       int64                  `json:"alert_count"`
	AlertTriggered   []string               `json:"alert_triggered"`
	WaterProduction  WaterProductionReport  `json:"water_production"`
	WaterLevel       WaterLevelReport       `json:"water_level"`
	WaterUsage       WaterUsageReport       `json:"water_usage"`
	WaterUsageImpact WaterUsageImpactReport `json:"water_usage_impact"`
}

type WaterProductionReport struct {
	Total   float64                      `json:"total"`
	Highest WaterReportProductionHighest `json:"highest"`
	Chart   WaterReportProductionChart   `json:"chart"`
}

type WaterReportProductionHighest struct {
	Date  time.Time `json:"date"`
	Value float64   `json:"value"`
}

type WaterReportProductionChart struct {
	Series []float64   `json:"series"`
	Date   []time.Time `json:"date"`
}

type WaterLevelReport struct {
	Average float64 `json:"average"`
	Highest float64 `json:"highest"`
}

type WaterUsageReport struct {
	BeforeWaterProject float64 `json:"before_water_project"`
	PreviousPeriod     float64 `json:"previous_period"`
	CurrentPeriod      float64 `json:"current_period"`
}

type WaterUsageImpactReport struct {
	MonthlyCost WaterUsageImpactReportDiff `json:"monthly_cost"`
	Time        WaterUsageImpactReportDiff `json:"time"`
}

type WaterUsageImpactReportDiff struct {
	Before float64 `json:"before"`
	After  float64 `json:"after"`
}
