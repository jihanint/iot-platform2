package model

type City struct {
	ID         int64  `gorm:"column:id;primary_key"`
	Name       string `gorm:"column:name"`
	ProvinceID int64  `gorm:"column:province_id"`

	Province Province `gorm:"foreignkey:ProvinceID"`
}

type CreateCityRequest struct {
	Name       string `json:"name"`
	ProvinceID int64  `json:"province_id"`
}

type CreateCityResponse struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	ProvinceID int64  `json:"province_id"`
}

type GetCityListRequest struct {
	ProvinceID        int64 `query:"province_id"`
	IsDeviceInstalled bool  `query:"is_device_installed"`
}

type FindCityParam struct {
	ProvinceID        int64
	IsDeviceInstalled bool
}

type GetCityListResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}
