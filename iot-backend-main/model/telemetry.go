package model

import (
	"time"

	"github.com/lib/pq"
)

type Telemetry struct {
	ID             int64           `gorm:"column:id;primary_key"`
	DeviceID       int64           `gorm:"column:device_id"`
	Usage          pq.Float64Array `gorm:"column:usage;type:_float8[]"`
	Production     pq.Float64Array `gorm:"column:production;type:_float8[]"`
	Level          float64         `gorm:"column:level"`
	InVolume       pq.Float64Array `gorm:"column:in_volume;type:_float8[]"`
	OutVolume      pq.Float64Array `gorm:"column:out_volume;type:_float8[]"`
	UnixDeviceTime int64           `gorm:"column:unix_device_time"`
	DeviceTime     time.Time       `gorm:"column:device_time"`
	Hour           int16           `gorm:"column:hour"`
	Day            int16           `gorm:"column:day"`
	Week           int16           `gorm:"column:week"`
	Month          int16           `gorm:"column:month"`
	Year           int16           `gorm:"column:year"`
	CreatedAt      time.Time       `gorm:"column:created_at"`

	Device Device `gorm:"foreignkey:DeviceID"`
}

type FindWaterChartParam struct {
	VillageIDs        []int64
	ExcludeVillageIDs string
	CityID            int64
	FilterBy          string
	ViewDateTrunc     string
	FilterDateTrunc   string
	FilterInterval    string
	WaterType         string
	StartTime         string
	EndTime           string
}

type FindWaterChartResult struct {
	Name     string    `json:"name"`
	Interval time.Time `json:"interval"`
	Value    float64   `json:"value"`
}

type FindWaterChartV2Result struct {
	DeviceID int64           `json:"device_id"`
	Name     string          `json:"name"`
	Interval time.Time       `json:"interval"`
	Value    pq.Float64Array `json:"value"`
}

type AggregatedWaterChart struct {
	Name     string    `json:"name"`
	Interval time.Time `json:"interval"`
	Value    float64   `json:"value"`
}

type DoCalculateWaterFlowChartRes struct {
	DateSeries    []time.Time
	RegionArr     []string
	AggregatedMap map[string]map[time.Time]float64
}

type (
	FindByDayParam struct {
		WaterType string
	}

	FindByDayResult struct {
		DeviceID int64           `gorm:"column:device_id"`
		Value    pq.Float64Array `gorm:"column:value;type:_float8[]"`
	}
)

type (
	FindFlowSumInDayParam struct {
		WaterType string
		PastDay   int64
	}

	FindFlowSumInDayParamRes struct {
		DeviceID int64   `gorm:"column:device_id"`
		Value    float64 `gorm:"column:value"`
	}

	FindFlowAvgInHourParam struct {
		WaterType string
		PastDay   int64
	}

	FindFlowAvgInHourRes struct {
		DeviceID int64     `gorm:"column:device_id"`
		Value    float64   `gorm:"column:value"`
		Hour     time.Time `gorm:"column:hour"`
	}
)
