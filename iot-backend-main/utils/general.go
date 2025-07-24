package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

func ConvertToSliceInterface(data ...string) []interface{} {
	types := make([]interface{}, 0)
	for _, v := range data {
		types = append(types, v)
	}
	return types
}

func ConvertIntToSliceInterface(data ...int64) []interface{} {
	types := make([]interface{}, 0)
	for _, v := range data {
		types = append(types, v)
	}
	return types
}

func GetTotalPage(count, pageSize int64) int64 {
	return int64(math.Ceil(float64(count) / float64(pageSize)))
}

func PrettyStruct(data interface{}) string {
	val, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(val)
}

func SendServerError(err error, point string) {
	emails := []string{
		config.GetConfig().SendFromAddress,
		"nathanael-pribady@iotplatform.com",
	}

	for _, email := range emails {
		go func(email string) {
			SendMail("./template/server_alert.html", model.SendMail{
				SendTo:  email,
				Message: err.Error(),
			}, fmt.Sprintf("Server Alert: %s", point))
		}(email)
	}
}

func InitTx() *gorm.DB {
	db := config.DbManager()
	tx := db.Begin()
	return tx
}

func ToCapitalCase(param string) string {
	return strings.Title(strings.ToLower(param))
}

func CubicMeterToLiter(param float64) float64 {
	return param * 1000
}

func ParseDateTime(dateStr string) (time.Time, error) {
	return time.Parse(time.DateTime, dateStr)
}
