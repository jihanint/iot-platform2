package model

type ConstructAlertWAMessage struct {
	UserFullname string
	AlertType    string
	AlertMessage string
	VillageName  string
	AlertAction  string
}

type WaRequest struct {
	Destination string `json:"destination"`
	Message     string `json:"message"`
}

type WaResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}
