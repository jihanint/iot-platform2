package model

type SendMail struct {
	SendTo string

	// General
	UserFullname      string
	LoginLink         string
	VerifyAccountLink string
	GcsBucket         string

	// Alert
	AlertType    string
	AlertMessage string
	VillageName  string

	// Server Alert
	Message string

	// Register Assign
	Password string
}
