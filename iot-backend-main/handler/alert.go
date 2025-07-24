package handler

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type AlertHandler struct {
	AlertService service.AlertService
}

func (alertHandler *AlertHandler) List(c echo.Context) error {
	params := new(model.AlertListRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateGetAlertList(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	alert, err := alertHandler.AlertService.AlertList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    alert.Data,
		Meta:    alert.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}

func (alertHandler *AlertHandler) Review(c echo.Context) error {
	params := new(model.AlertChangeRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateAlertReview(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = alertHandler.AlertService.AlertReview(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (alertHandler *AlertHandler) Done(c echo.Context) error {
	params := new(model.AlertChangeRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateAlertDone(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = alertHandler.AlertService.AlertDone(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (alertHandler *AlertHandler) OpenList(c echo.Context) error {
	params := new(model.AlertListRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.ExcludeVillageIDs = config.GetConfig().TestingVillageIDs

	alert, err := alertHandler.AlertService.AlertList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    alert.Data,
		Meta:    alert.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}
