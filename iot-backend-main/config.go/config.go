package config

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/tkanos/gonfig"
)

type Configuration struct {
	DbUsername string `env:"DB_USERNAME"`
	DbPassword string `env:"DB_PASSWORD"`
	DbName     string `env:"DB_NAME"`
	DbPort     string `env:"DB_PORT"`
	DbHost     string `env:"DB_HOST"`

	JWTSecret string `env:"JWT_SECRET"`

	FrontendBaseUrl string `env:"FRONTEND_BASE_URL"`

	SendFromAddress string `env:"SEND_FROM_ADDRESS"`
	MailPassword    string `env:"MAIL_PASSWORD"`

	SmsOn       string `env:"SMS_ON"`
	SmsBaseUrl  string `env:"SMS_BASE_URL"`
	SmsUser     string `env:"SMS_USER"`
	SmsPassword string `env:"SMS_PASSWORD"`

	WaOn      string `env:"WA_ON"`
	WaBaseUrl string `env:"WA_BASE_URL"`
	WaApiKey  string `env:"WA_API_KEY"`

	GcsBucketUrl string `env:"GCS_BUCKET_URL"`

	RedisAddress string `env:"REDIS_ADDRESS"`

	TestingDeviceIDs          string `env:"TESTING_DEVICE_IDS"`
	TestingVillageIDs         string `env:"TESTING_VILLAGE_IDS"`
	BlacklistReportVillageIDs string `env:"BLACKLIST_REPORT_VILLAGE_IDS"`

	ValidSumWPStartDate string `env:"VALID_SUM_WP_START_DATE"`

	AlertCron string `env:"ALERT_CRON"`
	SumWPCron string `env:"SUM_WP_CRON"`
}

func GetConfig() Configuration {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}

	configuration := Configuration{}

	err = gonfig.GetConf("", &configuration)
	if err != nil {
		fmt.Println("Error loading config:", err)
	}

	return configuration
}
