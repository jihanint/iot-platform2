package model

import "time"

type Alert struct {
	ID        int64     `gorm:"column:id;primary_key"`
	VillageID int64     `gorm:"column:village_id"`
	Type      int16     `gorm:"column:type"`
	Message   string    `gorm:"column:message"`
	Status    int16     `gorm:"column:status"`
	Comment   string    `gorm:"column:comment"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`

	Village Village `gorm:"foreignkey:VillageID"`
}

type AlertChangeRequest struct {
	AlertID     int64  `json:"alert_id"`
	Comment     string `json:"comment"`
	VillageIDs  []int64
	Type        int16
	VillageID   int64
	VillageName string
}

type AlertListResult struct {
	ID          int64     `json:"id"`
	VillageName string    `json:"village_name"`
	CityName    string    `json:"city_name"`
	Type        int16     `json:"type"`
	Message     string    `json:"message"`
	Comment     string    `json:"comment"`
	CreatedAt   time.Time `json:"created_at"`
}

type AlertListRequest struct {
	AreaID            int64  `query:"area_id"`
	StartTime         string `query:"start_time"`
	EndTime           string `query:"end_time"`
	VillageIDs        []int64
	ExcludeVillageIDs string
	CityID            int64
	StartCreatedAt    time.Time
	EndCreatedAt      time.Time
	BasicGetParam
}

type AlertListResponse struct {
	Data []AlertListResponseData
	Meta MetaPagination
}

type AlertListResponseData struct {
	ID          int64     `json:"id"`
	VillageName string    `json:"village_name"`
	CityName    string    `json:"city_name"`
	AlertType   string    `json:"alert_type"`
	Message     string    `json:"message"`
	Comment     string    `json:"comment"`
	Action      string    `json:"action"`
	CreatedAt   time.Time `json:"created_at"`
}

type AlertListParam struct {
	VillageIDs        []int64
	ExcludeVillageIDs string
	CityID            int64
	StartCreatedAt    time.Time
	EndCreatedAt      time.Time
	PageNumber        int64
	PageSize          int64
}

type GetAlertParam struct {
	ID        int64
	VillageID int64
	Type      int16
	Message   string
	IsToday   bool
	IsPreload bool
}

type RealTimeAlertReq struct {
	TelemetryLevel float64
	DeviceLevel    float64
	VillageID      int64
}

type CountGroupedAlertParam struct {
	VillageID      int64     `json:"village_id"`
	StartCreatedAt time.Time `json:"start_created_at"`
	EndCreatedAt   time.Time `json:"end_created_at"`
}

type GroupedAlertCountRes struct {
	Type       int16  `json:"type"`
	Message    string `json:"message"`
	AlertCount int64  `json:"alert_count"`
}
