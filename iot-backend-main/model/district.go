package model

type District struct {
	ID     int64  `gorm:"column:id;primary_key"`
	Name   string `gorm:"column:name"`
	CityID int64  `gorm:"column:city_id"`

	City City `gorm:"foreignkey:CityID"`
}

type CreateDistrictRequest struct {
	Name   string `json:"name"`
	CityID int64  `json:"city_id"`
}

type CreateDistrictResponse struct {
	ID     int64  `json:"id"`
	Name   string `json:"name"`
	CityID int64  `json:"city_id"`
}

type GetDistrictListRequest struct {
	CityID int64 `query:"city_id"`
}

type GetDistrictListResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}
