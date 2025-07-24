package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type WaterHandler struct {
	WaterService service.WaterService
}

func (waterHandler *WaterHandler) Telemetry(c echo.Context) error {
	reqs := new([]model.TelemetryRequest)

	body := c.Request().Body
	err := json.NewDecoder(body).Decode(reqs)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&reqs), err.Error())
		utils.SendServerError(errMsg, "WaterHandler.Telemetry.Request.Decode")
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	params := make([]model.TelemetryRequest, len(*reqs))
	copy(params, *reqs)

	err = validateTelemetryRequest(params)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(params), err.Error())
		utils.SendServerError(errMsg, "WaterHandler.Telemetry.validateTelemetryRequest")
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = waterHandler.WaterService.Telemetry(params)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(params), err.Error())
		utils.SendServerError(errMsg, "WaterHandler.Telemetry.WaterService.Telemetry")
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetWaterUsageChart(c echo.Context) error {
	params := new(model.GetWaterChartRequest)
	villageIDs := c.Get("villageIDs").([]int64)
	roles := c.Get("roles").([]string)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs
	params.Roles = roles

	err = validateGetWaterChart(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	water, err := waterHandler.WaterService.GetWaterUsageChart(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetWaterProductionChart(c echo.Context) error {
	params := new(model.GetWaterChartRequest)
	villageIDs := c.Get("villageIDs").([]int64)
	roles := c.Get("roles").([]string)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs
	params.Roles = roles

	err = validateGetWaterChart(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	water, err := waterHandler.WaterService.GetWaterProductionChart(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetWaterLevelChart(c echo.Context) error {
	params := new(model.GetWaterChartRequest)
	villageIDs := c.Get("villageIDs").([]int64)
	roles := c.Get("roles").([]string)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs
	params.Roles = roles

	err = validateGetWaterChart(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	water, err := waterHandler.WaterService.GetWaterLevelChart(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) TelemetryList(c echo.Context) error {
	params := new(model.TelemetryListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	// TODO do inside validate
	if params.PageSize == 0 {
		params.PageSize = 20
	}
	if params.PageNumber == 0 {
		params.PageNumber = 1
	}

	telemetry, err := waterHandler.WaterService.TelemetryList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    telemetry.Telemetry,
		Meta:    telemetry.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetWaterList(c echo.Context) error {
	params := new(model.GetWaterListRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateGetWaterUsageList(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	water, err := waterHandler.WaterService.GetWaterList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water.Water,
		Meta:    water.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetSummary(c echo.Context) error {
	var params model.GetSumWaterFlowReq

	err := c.Bind(&params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	water, err := waterHandler.WaterService.GetSummary(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetOpenWaterProductionChart(c echo.Context) error {
	params := new(model.GetWaterChartRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.ExcludeVillageIDs = config.GetConfig().TestingVillageIDs

	if params.Area != "" {
		areaID, err := strconv.Atoi(params.Area)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
		}
		params.VillageIDs = []int64{int64(areaID)}
	}

	water, err := waterHandler.WaterService.GetWaterProductionChart(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetOpenWaterLevelChart(c echo.Context) error {
	params := new(model.GetWaterChartRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.ExcludeVillageIDs = config.GetConfig().TestingVillageIDs

	if params.Area != "" {
		areaID, err := strconv.Atoi(params.Area)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
		}
		params.VillageIDs = []int64{int64(areaID)}
	}

	water, err := waterHandler.WaterService.GetWaterLevelChart(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    water,
	}

	return c.JSON(http.StatusOK, resp)
}

func (waterHandler *WaterHandler) GetReport(c echo.Context) error {
	var param model.GetWaterReportReq

	err := c.Bind(&param)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	param.Start, err = utils.ParseDateTime(param.StartTime)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	param.End, err = utils.ParseDateTime(param.EndTime)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	report, err := waterHandler.WaterService.GetReport(param)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    report,
	}

	return c.JSON(http.StatusOK, resp)
}
