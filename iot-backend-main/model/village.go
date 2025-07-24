package model

import (
	"time"
)

type Village struct {
	ID         int64   `gorm:"column:id;primary_key"`
	Name       string  `gorm:"column:name"`
	DistrictID int64   `gorm:"column:district_id"`
	Lat        float64 `gorm:"column:lat"`
	Long       float64 `gorm:"column:long"`
	Population int64   `gorm:"column:population"`
	FieldCode  string  `gorm:"column:field_code"`
	PicName    string  `gorm:"column:pic_name"`
	PicContact string  `gorm:"column:pic_contact"`

	District District `gorm:"foreignkey:DistrictID"`
}

type CreateVillageRequest struct {
	Name       string  `json:"name"`
	DistrictID int64   `json:"district_id"`
	Lat        float64 `json:"lat"`
	Long       float64 `json:"long"`
	Population int64   `json:"population"`
	PicUserID  int64   `json:"pic_user_id"`
	// TODO add field_code
}

type CreateVillageResponse struct {
	ID         int64   `json:"id"`
	Name       string  `json:"name"`
	DistrictID int64   `json:"district_id"`
	Lat        float64 `json:"lat"`
	Long       float64 `json:"long"`
	Population int64   `json:"population"`
	PicUserID  *int64  `json:"pic_user_id"`
}

type FindVillageRequest struct {
	IDs        []int64
	DistrictID int64
	Search     string
	ExcludeIDs string
}

type GetVillageListRequest struct {
	DistrictID        int64  `query:"district_id"`
	IsAssignedFor     bool   `query:"is_assigned_for"`
	Search            string `query:"search"`
	IsWaterReport     bool   `query:"is_water_report"`
	VillageIDs        []int64
	ExcludeVillageIDs string
}

type GetVillageListResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type GetVillageWithCityResult struct {
	VillageName string `json:"village_name"`
	CityName    string `json:"city_name"`
}

type (
	GetVillageRequest struct {
		VillageID  int64 `query:"village_id"`
		VillageIDs []int64
	}

	GetVillageResponse struct {
		ID             int64             `json:"id"`
		VillageName    string            `json:"village_name"`
		VillageProfile GetVillageProfile `json:"village_profile"`
		DeviceProfile  GetDeviceProfile  `json:"device_profile"`
	}

	GetVillageProfile struct {
		FieldID     string    `json:"field_id"`
		Lat         float64   `json:"lat"`
		Long        float64   `json:"long"`
		Population  int64     `json:"population"`
		InstallDate time.Time `json:"install_date"`
		PICName     string    `json:"pic_name"`
		PICPhone    string    `json:"pic_phone"`
	}

	GetDeviceProfile struct {
		DeviceID    int64     `json:"device_id"`
		DeviceCode  string    `json:"device_code"`
		Brand       string    `json:"brand"`
		Capacity    float64   `json:"capacity"`
		Power       int64     `json:"power"`
		Level       float64   `json:"level"`
		Type        string    `json:"type"`
		InstallDate time.Time `json:"install_date"`
	}
)
