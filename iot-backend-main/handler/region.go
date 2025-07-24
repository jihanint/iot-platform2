package handler

import (
	"net/http"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type RegionHandler struct {
	RegionService service.RegionService
}

func (regionHandler *RegionHandler) CreateRegion(c echo.Context) error {
	params := new(model.CreateRegionReq)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = regionHandler.RegionService.CreateRegion(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) CreateProvince(c echo.Context) error {
	params := new(model.CreateProvinceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCreateProvince(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	province, err := regionHandler.RegionService.CreateProvince(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    province,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) CreateCity(c echo.Context) error {
	params := new(model.CreateCityRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCreateCity(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	city, err := regionHandler.RegionService.CreateCity(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    city,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) CreateDistrict(c echo.Context) error {
	params := new(model.CreateDistrictRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCreateDistrict(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	district, err := regionHandler.RegionService.CreateDistrict(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    district,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) CreateVillage(c echo.Context) error {
	params := new(model.CreateVillageRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCreateVillage(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	village, err := regionHandler.RegionService.CreateVillage(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    village,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetProvinceList(c echo.Context) error {
	province, err := regionHandler.RegionService.GetProvinceList()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    province,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetCityList(c echo.Context) error {
	params := new(model.GetCityListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	city, err := regionHandler.RegionService.GetCityList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    city,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetDistrictList(c echo.Context) error {
	params := new(model.GetDistrictListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	district, err := regionHandler.RegionService.GetDistrictList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    district,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetVillageList(c echo.Context) error {
	params := new(model.GetVillageListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	if params.IsAssignedFor {
		params.VillageIDs = c.Get("villageIDs").([]int64)
	}

	village, err := regionHandler.RegionService.GetVillageList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    village,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetVillage(c echo.Context) error {
	params := new(model.GetVillageRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateGetVillage(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	village, err := regionHandler.RegionService.GetVillage(params)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, model.BasicResp{Message: err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    village,
	}

	return c.JSON(http.StatusOK, resp)
}

func (regionHandler *RegionHandler) GetOpenVillageList(c echo.Context) error {
	params := new(model.GetVillageListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.ExcludeVillageIDs = config.GetConfig().TestingVillageIDs
	if params.IsWaterReport {
		params.ExcludeVillageIDs += "," + config.GetConfig().BlacklistReportVillageIDs
	}

	village, err := regionHandler.RegionService.GetVillageList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    village,
	}

	return c.JSON(http.StatusOK, resp)
}
