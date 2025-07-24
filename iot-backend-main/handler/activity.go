package handler

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type ActivityHandler struct {
	ActivityService service.ActivityService
}

func (activityHandler *ActivityHandler) Histories(c echo.Context) error {
	params := new(model.ActivityHistoriesRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateActivityHistories(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	activityHistories, err := activityHandler.ActivityService.ActivityHistories(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    activityHistories.Data,
		Meta:    activityHistories.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}

func (activityHandler *ActivityHandler) HistoriesGrouped(c echo.Context) error {
	params := new(model.ActivityHistoriesGroupedRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateActivityHistoriesGrouped(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	ahGrouped, err := activityHandler.ActivityService.ActivityHistoriesGrouped(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    ahGrouped,
	}

	return c.JSON(http.StatusOK, resp)
}
