package handler

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type DeviceHandler struct {
	DeviceService service.DeviceService
}

func (deviceHandler *DeviceHandler) DeviceInstall(c echo.Context) error {
	params := new(model.InstallDeviceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateInstallDevice(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = deviceHandler.DeviceService.InstallDevice(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) LogStatus(c echo.Context) error {
	reqs := new([]model.LogStatusRequest)

	err := c.Bind(reqs)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&reqs), err.Error())
		utils.SendServerError(errMsg, "DeviceHandler.LogStatus.Bind")
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	params := make([]model.LogStatusRequest, len(*reqs))
	copy(params, *reqs)

	params, err = validateLogStatus(params)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(params), err.Error())
		utils.SendServerError(errMsg, "DeviceHandler.LogStatus.validateLogStatus")
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = deviceHandler.DeviceService.LogStatus(params)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(params), err.Error())
		utils.SendServerError(errMsg, "DeviceHandler.LogStatus.DeviceService.LogStatus")
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) DeviceList(c echo.Context) error {
	params := new(model.DeviceListRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateDeviceList(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	devices, err := deviceHandler.DeviceService.DeviceList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    devices,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) StatusLogs(c echo.Context) error {
	params := new(model.StatusLogsRequest)

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

	status, err := deviceHandler.DeviceService.StatusLogs(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    status.Statuses,
		Meta:    status.Meta,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) FunctionalityStats(c echo.Context) error {
	params := new(model.DeviceFunctionalityStatsRequest)
	villageIDs := c.Get("villageIDs").([]int64)
	roles := c.Get("roles").([]string)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs
	params.Roles = roles

	err = validateDeviceFunctionalityStats(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	functionality, err := deviceHandler.DeviceService.FunctionalityStats(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    functionality,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) Save(c echo.Context) error {
	params := new(model.SaveDeviceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = deviceHandler.DeviceService.Save(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) Calibrate(c echo.Context) error {
	params := new(model.CalibrateDeviceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCalibrateDevice(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = deviceHandler.DeviceService.Calibrate(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) DeviceCalibrationList(c echo.Context) error {
	params := new(model.DeviceCalibrationListRequest)
	villageIDs := c.Get("villageIDs").([]int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.VillageIDs = villageIDs

	err = validateDeviceCalibrationList(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	devices, err := deviceHandler.DeviceService.DeviceCalibrationList(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    devices,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) Saved(c echo.Context) error {
	params := new(model.SavedDeviceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateSevedDevice(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	device, err := deviceHandler.DeviceService.Saved(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    device,
	}

	return c.JSON(http.StatusOK, resp)
}

func (deviceHandler *DeviceHandler) Calibrated(c echo.Context) error {
	params := new(model.CalibratedDeviceRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateCalibratedDevice(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	calibrated, err := deviceHandler.DeviceService.Calibrated(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    calibrated,
	}

	return c.JSON(http.StatusOK, resp)
}
