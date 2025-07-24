package service

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
	"golang.org/x/crypto/bcrypt"
)

// USER

func (c *UserService) validateSignUp(params *model.SignUpRequest) error {
	userParams := model.User{}

	if params.Type == utils.UserTypeEmail {
		userParams.Email = &params.Email
	} else {
		userParams.PhoneNumber = &params.PhoneNumber
	}

	username, err := c.UserRepository.GetUser(&userParams)
	if err != nil {
		return err
	}
	if username != nil {
		return utils.ErrEmailExist
	}

	return nil
}

func (c *UserService) validateVerify(params *model.VerifyRequest) error {
	userParams := model.User{}

	if claims, ok := params.ParsedToken.Claims.(*model.JWTPayload); params.ParsedToken.Valid && ok {
		userParams.ID = claims.ID
		userParams.Email = &claims.Email
		userParams.PhoneNumber = &claims.PhoneNumber
	} else {
		return utils.ErrVerifyTokenInvalid
	}

	user, err := c.UserRepository.GetUser(&model.User{ID: userParams.ID})
	if err != nil {
		return err
	}
	if user == nil {
		return utils.ErrUserNotExist
	}

	if user.Email != nil && *user.Email != *userParams.Email {
		return utils.ErrUserIDEmailNotMatch
	}

	if user.Status == utils.UserVerified {
		return utils.ErrUserVerified
	}

	params.UserID = user.ID

	return nil
}

func (c *UserService) validateAssignmentManager(params *model.AssignmentManagerRequest) error {
	if params.User.Status == utils.UserRegistered {
		return utils.ErrUserStatusNotVerified
	}

	villages, err := c.VillageRepository.Find(&model.FindVillageRequest{IDs: params.VillageIDs})
	if err != nil {
		return err
	}
	if len(villages) != len(params.VillageIDs) {
		return utils.ErrVillageNotExist
	}

	return nil
}

func (c *UserService) validateVilageIDs(villageIDs []int64) error {
	if len(villageIDs) == 0 {
		return nil
	}

	villages, err := c.VillageRepository.Find(&model.FindVillageRequest{IDs: villageIDs})
	if err != nil {
		return err
	}
	if len(villages) != len(villageIDs) {
		return utils.ErrVillageNotExist
	}

	return nil
}

func (c *UserService) validateLogIn(params *model.LogInRequest) (*model.User, error) {
	userParams := &model.User{}

	if params.Type == utils.UserTypeEmail {
		userParams.Email = &params.Email
	} else {
		userParams.PhoneNumber = &params.PhoneNumber
	}

	user, err := c.UserRepository.GetLoginUser(userParams)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, utils.ErrUserNotExist
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.Password))
	if err != nil {
		return nil, utils.ErrWrongPassword
	}

	return user, nil
}

func (c *UserService) validateUpdatePassword(params *model.UpdatePasswordRequest) error {
	user, err := c.UserRepository.GetUser(&model.User{ID: params.UserID})
	if err != nil {
		return err
	}
	if user == nil {
		return utils.ErrUserNotExist
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.OldPassword))
	if err != nil {
		return utils.ErrWrongOldPassword
	}

	return nil
}

func (c *UserService) validateForgotPassword(params *model.ForgotPasswordRequest) (*model.User, error) {
	user, err := c.UserRepository.GetUser(&model.User{Email: &params.Email})
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, utils.ErrUserNotExist
	}

	return user, nil
}

func (c *UserService) validateResetPassword(params *model.ResetPasswordRequest) error {
	userParams := model.User{}

	if claims, ok := params.ParsedToken.Claims.(*model.JWTPayload); params.ParsedToken.Valid && ok {
		userParams.ID = claims.ID
		userParams.Email = &claims.Email
	} else {
		return utils.ErrVerifyTokenInvalid
	}

	user, err := c.UserRepository.GetUser(&model.User{ID: userParams.ID})
	if err != nil {
		return err
	}
	if user == nil {
		return utils.ErrUserNotExist
	}

	if user.Email != nil && *user.Email != *userParams.Email {
		return utils.ErrUserIDEmailNotMatch
	}

	params.UserID = user.ID

	return nil
}

// REGION

func (c *RegionService) validateCreateCity(params *model.CreateCityRequest) error {
	city, err := c.CityRepository.GetCity(&model.City{
		Name:       params.Name,
		ProvinceID: params.ProvinceID,
	})
	if err != nil {
		return err
	}
	if city != nil {
		return utils.ErrCityExist
	}

	return nil
}

func (c *RegionService) validateCreateDistrict(params *model.CreateDistrictRequest) error {
	district, err := c.DistrictRepository.GetDistrict(&model.District{
		Name:   params.Name,
		CityID: params.CityID,
	})
	if err != nil {
		return err
	}
	if district != nil {
		return utils.ErrDistrictExist
	}

	return nil
}

func (c *RegionService) validateCreateVillage(params *model.CreateVillageRequest) error {
	village, err := c.VillageRepository.Get(&model.Village{
		Name:       params.Name,
		DistrictID: params.DistrictID,
	})
	if err != nil {
		return err
	}
	if village != nil {
		return utils.ErrVillageExist
	}

	return nil
}

func (c *DeviceService) validateCreateVillage(params *model.SaveDeviceRequest) error {
	village, err := c.VillageRepository.Get(&model.Village{
		Name:       params.VillageName,
		DistrictID: params.DistrictID,
	})
	if err != nil {
		return err
	}
	if village != nil {
		return utils.ErrVillageExist
	}

	return nil
}

// DEVICE

func (c *DeviceService) validateInstallDevice(params *model.InstallDeviceRequest) error {
	village, err := c.VillageRepository.Get(&model.Village{
		ID: params.VillageID,
	})
	if err != nil {
		return err
	}
	if village == nil {
		return utils.ErrVillageNotExist
	}

	device, err := c.DeviceRepository.Get(&model.Device{
		Code: params.Code,
	})
	if err != nil {
		return err
	}
	if device != nil {
		return utils.ErrDeviceInstalled
	}

	return nil
}

func (c *DeviceService) validateLogStatus(params *model.LogStatusRequest) error {
	device, err := c.DeviceRepository.Get(&model.Device{
		MacAddress: params.DeviceCode,
	})
	if err != nil {
		return err
	}
	if device == nil {
		return utils.ErrDeviceNotExist
	}

	params.DeviceID = device.ID
	return nil
}

// WATER

func (c *WaterService) validateTelemetryRequest(params *model.TelemetryRequest) error {
	device, err := c.DeviceRepository.Get(&model.Device{
		MacAddress: params.DeviceCode,
	})
	if err != nil {
		return err
	}
	if device == nil {
		return utils.ErrDeviceNotExist
	}

	params.DeviceID = device.ID
	params.VillageID = device.VillageID
	params.DeviceLevel = device.Level
	return nil
}

// ALERT

func (c *AlertService) validateAlertChange(params *model.AlertChangeRequest) error {
	alert, err := c.AlertRepository.Get(&model.GetAlertParam{
		ID:        params.AlertID,
		IsPreload: true,
	})
	if err != nil {
		return err
	}

	if alert == nil {
		return utils.ErrAlertNotExist
	}

	if len(params.VillageIDs) != 0 {
		interfaceSliceVillages := utils.ConvertIntToSliceInterface(params.VillageIDs...)
		err = validation.Validate(int64(alert.VillageID), validation.In(interfaceSliceVillages...))
		if err != nil {
			return utils.ErrUnauthorizedUserVillageRelation
		}
	}

	if alert.Status == utils.AlertDone {
		return utils.ErrAlertDone
	}

	params.Type = alert.Type
	params.VillageID = alert.VillageID
	params.VillageName = alert.Village.Name
	return nil
}
