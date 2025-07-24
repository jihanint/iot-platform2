package model

type BasicResp struct {
	Message string         `json:"message"`
	Data    interface{}    `json:"data,omitempty"`
	Meta    MetaPagination `json:"meta,omitempty"`
}

type BasicGetParam struct {
	SortBy     string `query:"sort_by"`
	OrderBy    string `query:"order_by"`
	Search     string `query:"search"`
	PageNumber int64  `query:"page_number"`
	PageSize   int64  `query:"page_size"`
}

type MetaPagination struct {
	PageNumber   int64 `json:"page_number,omitempty"`
	PageSize     int64 `json:"page_size,omitempty"`
	TotalPages   int64 `json:"total_pages,omitempty"`
	TotalRecords int64 `json:"total_records,omitempty"`
}
