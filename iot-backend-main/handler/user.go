package handler

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/service"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type UserHandler struct {
	UserService service.UserService
}

func (userHandler *UserHandler) SignUp(c echo.Context) error {
	params := new(model.SignUpRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateSignUp(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	user, err := userHandler.UserService.SignUp(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    user,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) Verify(c echo.Context) error {
	params := new(model.VerifyRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateVerify(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.Verify(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) LogIn(c echo.Context) error {
	params := new(model.LogInRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateLogIn(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	login, err := userHandler.UserService.LogIn(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    login,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) UpdatePassword(c echo.Context) error {
	params := new(model.UpdatePasswordRequest)
	userID := c.Get("id").(int64)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}
	params.UserID = userID

	err = validateUpdatePassword(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.UpdatePassword(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) ForgotPassword(c echo.Context) error {
	params := new(model.ForgotPasswordRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateForgotPassword(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.ForgotPassword(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) ResetPassword(c echo.Context) error {
	params := new(model.ResetPasswordRequest)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateResetPassword(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.ResetPassword(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) UnassignList(c echo.Context) error {
	data, err := userHandler.UserService.UnassignList()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    data,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) AssignmentList(c echo.Context) error {
	villageIDs := c.Get("villageIDs").([]int64)

	data, err := userHandler.UserService.AssignmentList(villageIDs)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    data,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) Assignment(c echo.Context) error {
	params := new(model.AssignmentReq)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateAssigment(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.Assignment(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) GetDetail(c echo.Context) error {
	params := new(model.GetUserDetailReq)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateGetUserDetail(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	data, err := userHandler.UserService.GetDetail(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
		Data:    data,
	}

	return c.JSON(http.StatusOK, resp)
}

func (userHandler *UserHandler) RegisterAssign(c echo.Context) error {
	params := new(model.RegisterAssignReq)

	err := c.Bind(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = validateRegisterAssign(params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.BasicResp{Message: err.Error()})
	}

	err = userHandler.UserService.RegisterAssign(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.BasicResp{Message: err.Error()})
	}

	resp := model.BasicResp{
		Message: utils.Success,
	}

	return c.JSON(http.StatusOK, resp)
}
