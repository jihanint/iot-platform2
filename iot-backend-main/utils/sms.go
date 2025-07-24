package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

func SendSMS(message, phoneNumber string) {
	smsOn, err := strconv.ParseBool(config.GetConfig().SmsOn)
	if err != nil {
		fmt.Println(err)
		return
	}

	if !smsOn {
		return
	}

	baseUrl := config.GetConfig().SmsBaseUrl
	user := config.GetConfig().SmsUser
	password := url.QueryEscape(config.GetConfig().SmsPassword)
	message = url.QueryEscape(message)
	phoneNumber = validatePhoneNumber(phoneNumber)
	url := fmt.Sprintf("%s/plain?user=%s&password=%s&SMSText=%s&GSM=%s&output=json", baseUrl, user, password, message, phoneNumber)
	fmt.Println(url)

	// Send GET request
	response, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error sending request: %s\n", err)
		return
	}

	// Read response body
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Error reading response: %s\n", err)
		return
	}

	// Parse response JSON
	var parsedResponse model.SmsResponse
	err = json.Unmarshal(body, &parsedResponse)
	if err != nil {
		fmt.Printf("Error parsing JSON: %s\n", err)
		return
	}

	// Access the parsed response data
	if len(parsedResponse.Results) > 0 {
		result := parsedResponse.Results[0]

		if result.Status != "0" {
			fmt.Printf("Message is not sent, status: %s", result.Status)
		}
	} else {
		fmt.Println("No results found in the response.")
	}
}

func validatePhoneNumber(phoneNumber string) string {
	if strings.HasPrefix(phoneNumber, "0") {
		return "62" + phoneNumber[1:]
	} else if strings.HasPrefix(phoneNumber, "+") {
		return phoneNumber[1:]
	}
	return phoneNumber
}
