package model

type SmsResponse struct {
	Results []SmsResult `json:"results"`
}

type SmsResult struct {
	Status      string `json:"status"`
	MessageID   string `json:"messageid"`
	Destination string `json:"destination"`
}

type ConstructAlertSMSMessage struct {
	UserFullname string
	AlertType    string
	AlertMessage string
	VillageName  string
}
