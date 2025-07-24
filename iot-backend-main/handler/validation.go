package handler

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/golang-jwt/jwt"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
)

// USER

func validateSignUp(params *model.SignUpRequest) error {
	if params.Type == "" {
		return utils.ErrEmptyType
	}

	if !utils.AllowedUserType[params.Type] {
		return utils.ErrInvalidUserType
	}

	if params.Type == utils.UserTypeEmail && params.Email == "" {
		return utils.ErrEmptyEmail
	}

	if params.Type == utils.UserTypePhone && params.PhoneNumber == "" {
		return utils.ErrEmptyPhoneNumber
	}

	if params.Fullname == "" {
		return utils.ErrEmptyFullname
	}

	if params.Password == "" {
		return utils.ErrEmptyPassword
	}

	return nil
}

func validateVerify(params *model.VerifyRequest) error {
	if params.Token == "" {
		return utils.ErrEmptyVerifyToken
	}

	token, err := jwt.ParseWithClaims(params.Token, &model.JWTPayload{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf(utils.UnexpectedSigning, token.Header["alg"])
		}
		return []byte(config.GetConfig().JWTSecret), nil
	})

	if err != nil {
		return err
	}
	params.ParsedToken = token

	return nil
}

func validateLogIn(params *model.LogInRequest) error {
	if params.Type == "" {
		return utils.ErrEmptyType
	}

	if !utils.AllowedUserType[params.Type] {
		return utils.ErrInvalidUserType
	}

	if params.Type == utils.UserTypeEmail && params.Email == "" {
		return utils.ErrEmptyEmail
	}

	if params.Type == utils.UserTypePhone && params.PhoneNumber == "" {
		return utils.ErrEmptyPhoneNumber
	}

	if params.Password == "" {
		return utils.ErrEmptyPassword
	}

	return nil
}

func validateUpdatePassword(params *model.UpdatePasswordRequest) error {
	if params.OldPassword == "" {
		return utils.ErrEmptyOldPssword
	}

	if params.NewPassword == "" {
		return utils.ErrEmptyNewPassword
	}

	return nil
}

func validateForgotPassword(params *model.ForgotPasswordRequest) error {
	if params.Email == "" {
		return utils.ErrEmptyEmail
	}

	return nil
}

func validateResetPassword(params *model.ResetPasswordRequest) error {
	if params.Token == "" {
		return utils.ErrEmptyVerifyToken
	}

	if params.NewPassword == "" {
		return utils.ErrEmptyNewPassword
	}

	token, err := jwt.ParseWithClaims(params.Token, &model.JWTPayload{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf(utils.UnexpectedSigning, token.Header["alg"])
		}
		return []byte(config.GetConfig().JWTSecret), nil
	})

	if err != nil {
		return err
	}
	params.ParsedToken = token

	return nil
}

func validateAssigment(params *model.AssignmentReq) error {
	if params.Role == "" {
		return utils.ErrEmptyRole
	}

	params.Role = strings.ToUpper(params.Role)

	if !utils.AllowedUserRoleAssignment[params.Role] {
		return utils.ErrInvalidRoleType
	}

	switch params.Role {
	case utils.CapRoleManager:
		if params.UserID == 0 {
			return utils.ErrEmptyUserID
		}
	case utils.CapRoleSupervisor:
		if params.UserName == "" {
			return utils.ErrEmptyName
		}

		if params.PhoneNumber == "" {
			return utils.ErrEmptyPhoneNumber
		}
	}

	if params.UserID == 0 && len(params.VillageIDs) == 0 {
		return utils.ErrEmptyVillageID
	}

	return nil
}

func validateGetUserDetail(params *model.GetUserDetailReq) error {
	if params.UserID <= 0 {
		return utils.ErrEmptyUserID
	}

	return nil
}

func validateRegisterAssign(params *model.RegisterAssignReq) error {
	if params.Email == "" {
		return utils.ErrEmptyEmail
	}

	if params.Fullname == "" {
		return utils.ErrEmptyFullname
	}

	if params.Password == "" {
		return utils.ErrEmptyPassword
	}

	if len(params.VillageIDs) == 0 {
		return utils.ErrEmptyVillageID
	}

	return nil
}

// REGION

func validateCreateCity(params *model.CreateCityRequest) error {
	if params.Name == "" {
		return utils.ErrEmptyName
	}

	if params.ProvinceID == 0 {
		return utils.ErrEmptyProvinceID
	}

	return nil
}

func validateCreateProvince(params *model.CreateProvinceRequest) error {
	if params.Name == "" {
		return utils.ErrEmptyName
	}

	return nil
}

func validateCreateDistrict(params *model.CreateDistrictRequest) error {
	if params.Name == "" {
		return utils.ErrEmptyName
	}

	if params.CityID == 0 {
		return utils.ErrEmptyCityID
	}

	return nil
}

func validateCreateVillage(params *model.CreateVillageRequest) error {
	if params.Name == "" {
		return utils.ErrEmptyName
	}

	if params.DistrictID == 0 {
		return utils.ErrEmptyDistrictID
	}

	if params.Population < 0 {
		return utils.ErrPopulationBelowZero
	}

	return nil
}

func validateGetVillage(params *model.GetVillageRequest) error {
	if params.VillageID == 0 {
		return utils.ErrEmptyVillageID
	}

	if len(params.VillageIDs) > 0 {
		interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
		err := validation.Validate(params.VillageID, validation.In(interfaceSliceVillages...))
		if err != nil {
			return utils.ErrUnauthorizedUserVillageRelation
		}
	}

	return nil
}

// DEVICE

func validateInstallDevice(params *model.InstallDeviceRequest) error {
	if params.VillageID == 0 {
		return utils.ErrEmptyVillageID
	}

	if params.Code == "" {
		return utils.ErrEmptyDeviceCode
	}

	if params.Capacity < 0 {
		return utils.ErrCapacityBelowZero
	}

	return nil
}

func validateLogStatus(params []model.LogStatusRequest) ([]model.LogStatusRequest, error) {
	var (
		err       error
		newParams []model.LogStatusRequest
	)

	for _, param := range params {
		if param.DeviceCode == "" {
			err = utils.ErrEmptyDeviceCode
			continue
		}

		if param.RSSI == 0 {
			err = utils.ErrEmptyRSSI
			continue
		}

		if param.BatteryCurrent == 0 {
			err = utils.ErrEmptyBatteryCurrent
			continue
		}

		if param.BatteryLevel == 0 {
			err = utils.ErrEmptyBatteryLevel
			continue
		}

		if param.BatteryPower == 0 {
			err = utils.ErrEmptyBatteryPower
			continue
		}

		if param.Timestamp == 0 {
			err = utils.ErrEmptyTimestamp
			continue
		}

		newParams = append(newParams, param)
	}

	if len(newParams) == 0 {
		return nil, err
	}

	return newParams, nil
}

func validateDeviceList(params *model.DeviceListRequest) error {
	if params.OrderBy != "" && !utils.AllowedOrderBy[strings.ToUpper(params.OrderBy)] {
		return utils.ErrInvalidOrderBy
	}

	if params.Status != 0 && !utils.AllowedDeviceStatus[params.Status] {
		return utils.ErrInvalidDeviceStatus
	}

	return nil
}

func validateDeviceFunctionalityStats(params *model.DeviceFunctionalityStatsRequest) error {
	if params.Area == "" {
		params.Area = utils.FilterAreaAll
	}

	var villageID int
	var err error
	if params.Area != utils.FilterAreaAll {
		villageID, err = strconv.Atoi(params.Area)
		if err != nil {
			return err
		}

		interfaceSliceRoles := utils.ConvertToSliceInterface(params.Roles...)
		err = validation.Validate(utils.RoleAdmin, validation.In(interfaceSliceRoles...))
		if err != nil {
			interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
			err = validation.Validate(int64(villageID), validation.In(interfaceSliceVillages...))
			if err != nil {
				return utils.ErrUnauthorizedUserVillageRelation
			}
		}

		params.VillageIDs = []int64{int64(villageID)}
	}

	return nil
}

func validateDeviceCalibrationList(params *model.DeviceCalibrationListRequest) error {
	if params.SortBy != "" && !utils.AllowedDeviceCalibrationListSortBy[params.SortBy] {
		return utils.ErrInvalidSortBy
	}

	if params.OrderBy != "" && !utils.AllowedOrderBy[strings.ToUpper(params.OrderBy)] {
		return utils.ErrInvalidOrderBy
	}

	return nil
}

func validateSevedDevice(params *model.SavedDeviceRequest) error {
	if params.DeviceID == 0 {
		return utils.ErrEmptyDeviceID
	}

	return nil
}

func validateCalibratedDevice(params *model.CalibratedDeviceRequest) error {
	if params.DeviceID == 0 {
		return utils.ErrEmptyDeviceID
	}

	return nil
}

func validateCalibrateDevice(params *model.CalibrateDeviceRequest) error {
	if !utils.AllowedReservoirShape[params.Shape] {
		return utils.ErrInvalidShape
	}

	switch params.Shape {
	case utils.ReservoirShapeTube:
		if params.Diameter == 0 {
			return utils.ErrEmptyDiameter
		}
	case utils.ReservoirShapeBlock:
		if params.Length == 0 {
			return utils.ErrEmptyLength
		}

		if params.Width == 0 {
			return utils.ErrEmptyWidth
		}
	}

	return nil
}

// WATER

func validateTelemetryRequest(params []model.TelemetryRequest) error {
	for _, param := range params {
		if param.DeviceCode == "" {
			return utils.ErrEmptyDeviceCode
		}

		if len(param.Inflow) == 0 {
			return utils.ErrEmptyWaterInflow
		}

		if len(param.Outflow) == 0 {
			return utils.ErrEmptyWaterOutflow
		}

		if len(param.InVolume) == 0 {
			return utils.ErrEmptyWaterInVolume
		}

		if len(param.OutVolume) == 0 {
			return utils.ErrEmptyWaterOutVolume
		}

		if param.Timestamp == 0 {
			return utils.ErrEmptyTimestamp
		}
	}

	return nil
}

func validateGetWaterChart(params *model.GetWaterChartRequest) error {
	if params.Area == "" {
		params.Area = utils.FilterAreaAll
	}

	if params.Interval == "" {
		params.Interval = utils.FilterRangeMonth
	}

	if !utils.AllowedFilterInterval[params.Interval] {
		return utils.ErrInvalidFilterInterval
	}

	var villageID int
	var err error
	if params.Area != utils.FilterAreaAll {
		villageID, err = strconv.Atoi(params.Area)
		if err != nil {
			return err
		}

		interfaceSliceRoles := utils.ConvertToSliceInterface(params.Roles...)
		err = validation.Validate(utils.RoleAdmin, validation.In(interfaceSliceRoles...))
		if err != nil {
			interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
			err = validation.Validate(int64(villageID), validation.In(interfaceSliceVillages...))
			if err != nil {
				return utils.ErrUnauthorizedUserVillageRelation
			}
		}

		params.VillageIDs = []int64{int64(villageID)}
	}

	return nil
}

func validateGetWaterUsageList(params *model.GetWaterListRequest) error {
	if params.VillageID == 0 {
		return utils.ErrEmptyVillageID
	}

	if !utils.AllowedWaterType[params.WaterType] {
		return utils.ErrInvalidWaterType
	}

	if !utils.AllowedFilterInterval[params.Interval] {
		return utils.ErrInvalidFilterInterval
	}

	if len(params.VillageIDs) > 0 {
		interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
		err := validation.Validate(params.VillageID, validation.In(interfaceSliceVillages...))
		if err != nil {
			return utils.ErrUnauthorizedUserVillageRelation
		}
	}

	return nil
}

// ALERT

func validateAlertReview(params *model.AlertChangeRequest) error {
	if params.AlertID == 0 {
		return utils.ErrEmptyAlertID
	}

	if params.Comment == "" {
		return utils.ErrEmptyAlertComment
	}

	return nil
}

func validateAlertDone(params *model.AlertChangeRequest) error {
	if params.AlertID == 0 {
		return utils.ErrEmptyAlertID
	}

	return nil
}

func validateGetAlertList(params *model.AlertListRequest) error {
	var err error
	if params.AreaID != 0 {
		if len(params.VillageIDs) != 0 {
			interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
			err = validation.Validate(params.AreaID, validation.In(interfaceSliceVillages...))
			if err != nil {
				return utils.ErrUnauthorizedUserVillageRelation
			}

			params.VillageIDs = []int64{params.AreaID}
		} else {
			params.VillageIDs = []int64{params.AreaID}
		}
	}

	if params.StartTime != "" {
		params.StartCreatedAt, err = time.Parse(time.DateTime, params.StartTime)
		params.StartCreatedAt = params.StartCreatedAt.Add(time.Hour * -7)
		if err != nil {
			return err
		}
	}

	if params.EndTime != "" {
		params.EndCreatedAt, err = time.Parse(time.DateTime, params.EndTime)
		params.EndCreatedAt = params.EndCreatedAt.Add(time.Hour * -7)
		if err != nil {
			return err
		}
	}

	return nil
}

// ACTIVITY

func validateActivityHistories(params *model.ActivityHistoriesRequest) error {
	if params.Interval == "" {
		params.Interval = utils.FilterRangeMonth
	}

	if !utils.AllowedFilterInterval[params.Interval] {
		return utils.ErrInvalidFilterInterval
	}

	return nil
}

func validateActivityHistoriesGrouped(params *model.ActivityHistoriesGroupedRequest) error {
	if params.VillageID == 0 {
		return utils.ErrEmptyVillageID
	}

	if len(params.VillageIDs) > 0 {
		interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
		err := validation.Validate(params.VillageID, validation.In(interfaceSliceVillages...))
		if err != nil {
			return utils.ErrUnauthorizedUserVillageRelation
		}
	}

	return nil
}
