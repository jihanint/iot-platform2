package model

import "time"

type ActivityHistory struct {
	ID        int64     `gorm:"column:id;primary_key"`
	VillageID int64     `gorm:"column:village_id"`
	Type      int16     `gorm:"column:type"`
	RefID     int64     `gorm:"column:ref_id"`
	Message   string    `gorm:"column:message"`
	CreatedAt time.Time `gorm:"column:created_at"`
}

type ActivityHistoriesRequest struct {
	Interval    string `query:"interval"`
	FilterRange int16
	VillageIDs  []int64
	BasicGetParam
}

type ActivityHistoriesResponse struct {
	Data ActivityHistoriesResponseData
	Meta MetaPagination
}

type ActivityHistoriesResponseData struct {
	Difference float64                 `json:"difference"`
	Data       []ActivityHistoriesData `json:"data"`
}

type ActivityHistoriesData struct {
	ID        int64     `json:"id"`
	Message   string    `json:"message"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

type ActivityHistoriesGroupedRequest struct {
	VillageID  int64 `query:"village_id"`
	VillageIDs []int64
}

type ActivityHistoriesGroupedResponse struct {
	Date       time.Time               `json:"date"`
	Activities []ActivityHistoriesData `json:"activities"`
}
