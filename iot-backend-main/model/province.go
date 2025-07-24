package model

type Province struct {
	ID   int64  `gorm:"column:id;primary_key"`
	Name string `gorm:"column:name;unique"`
}

type CreateRegionReq struct {
	ProvinceID   int64  `json:"province_id"`
	ProvinceName string `json:"province_name"`
}

type CreateProvinceRequest struct {
	Name string `json:"name"`
}

type ProvinceResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}
