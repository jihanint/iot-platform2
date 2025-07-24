package handler

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
)

type HealthHandler struct {
	HealthService service.HealthService
}

func (healthHandler *HealthHandler) Check(c echo.Context) error {
	health, err := healthHandler.HealthService.Check()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: "Success",
		Data:    health,
	}

	return c.JSON(http.StatusOK, resp)
}
