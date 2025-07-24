package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

func SendWhatsAppMessage(param model.WaRequest) error {
	WaOn, err := strconv.ParseBool(config.GetConfig().WaOn)
	if err != nil {
		return err
	}

	if !WaOn {
		return nil
	}

	baseUrl := config.GetConfig().WaBaseUrl
	param.Destination = validatePhoneNumber(param.Destination)
	url := baseUrl + "/whatsapp/message"
	bodyReq, err := json.Marshal(param)
	if err != nil {
		return err
	}

	// Create POST request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyReq))
	if err != nil {
		return err
	}

	// Set the required headers
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("APIKey", config.GetConfig().WaApiKey)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Read the response body
	var response model.WaResponse
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusCreated {
		err = errors.New(response.Message)
		return err
	}

	return nil
}
