package repository

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/iotplatform-tech/iot-backend/model"
)

type APIWilayahIndoRepository interface {
	FindCity(provinceID int64) ([]model.CityAPI, error)
	FindDistrict(cityID int64) ([]model.DistrictAPI, error)
}

type APIWilayahIndoRepositoryCtx struct{}

func (c *APIWilayahIndoRepositoryCtx) FindCity(provinceID int64) ([]model.CityAPI, error) {
	// Send GET request
	url := fmt.Sprintf("https://emsifa.github.io/api-wilayah-indonesia/api/regencies/%d.json", provinceID)
	resp, err := http.Get(url)
	if err != nil {
		return []model.CityAPI{}, err
	}
	defer resp.Body.Close()

	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []model.CityAPI{}, err
	}

	// Parse JSON response
	var cities []model.CityAPI
	err = json.Unmarshal(body, &cities)
	if err != nil {
		return []model.CityAPI{}, err
	}

	return cities, nil
}

func (c *APIWilayahIndoRepositoryCtx) FindDistrict(cityID int64) ([]model.DistrictAPI, error) {
	// Send GET request
	url := fmt.Sprintf("https://emsifa.github.io/api-wilayah-indonesia/api/districts/%d.json", cityID)
	resp, err := http.Get(url)
	if err != nil {
		return []model.DistrictAPI{}, err
	}
	defer resp.Body.Close()

	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []model.DistrictAPI{}, err
	}

	// Parse JSON response
	var districts []model.DistrictAPI
	err = json.Unmarshal(body, &districts)
	if err != nil {
		return []model.DistrictAPI{}, err
	}

	return districts, nil
}
