package service

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	cfg "github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	UserRepository       repository.UserRepository
	TimeRepository       repository.TimeRepository
	RoleRepository       repository.RoleRepository
	UserRoleRepository   repository.UserRoleRepository
	UserDetailRepository repository.UserDetailRepository
	VillageRepository    repository.VillageRepository
}

func (c *UserService) SignUp(params *model.SignUpRequest) (*model.SignUpResponse, error) {
	err := c.validateSignUp(params)
	if err != nil {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), 10)
	if err != nil {
		return nil, err
	}

	user := model.User{
		Email:       &params.Email,
		PhoneNumber: &params.PhoneNumber,
		Password:    string(hashedPassword),
		FirstName:   params.Fullname,
	}
	_, err = c.UserRepository.InsertUser(&user)
	if err != nil {
		return nil, err
	}

	role, err := c.RoleRepository.GetRole(&model.Role{Name: utils.RoleUser})
	if err != nil {
		return nil, err
	}
	if role == nil {
		return nil, utils.ErrRoleNameUserNotExist
	}

	userRole := model.UserRole{
		UserID: user.ID,
		RoleID: role.ID,
	}
	_, err = c.UserRoleRepository.InsertUserRole(&userRole)
	if err != nil {
		return nil, err
	}

	email := ""
	if user.Email != nil {
		email = *user.Email
	}

	phone := ""
	if user.PhoneNumber != nil {
		phone = *user.PhoneNumber
	}

	now := c.TimeRepository.TimeNow()
	payload := model.JWTPayload{
		ID:          user.ID,
		Email:       email,
		PhoneNumber: phone,
		StandardClaims: jwt.StandardClaims{
			IssuedAt: now.Unix(),
		},
	}
	token, err := utils.GenerateJWT(payload)
	if err != nil {
		return nil, err
	}

	go func() {
		templateEmail := "./template/verify_account.html"
		sendRequest := model.SendMail{
			SendTo:            *user.Email,
			UserFullname:      user.FirstName,
			VerifyAccountLink: fmt.Sprintf(utils.VerifyUrl, cfg.GetConfig().FrontendBaseUrl, token),
			GcsBucket:         cfg.GetConfig().GcsBucketUrl,
		}
		subject := fmt.Sprintf("Verifikasi Akun %s!", user.FirstName)
		utils.SendMail(templateEmail, sendRequest, subject)
	}()

	resp := model.SignUpResponse{
		Email:    *user.Email,
		Fullname: user.FirstName,
	}

	if params.Debug {
		resp.VerifyUrl = fmt.Sprintf(utils.VerifyUrl, cfg.GetConfig().FrontendBaseUrl, token)
	}

	return &resp, nil
}

func (c *UserService) Verify(params *model.VerifyRequest) error {
	err := c.validateVerify(params)
	if err != nil {
		return err
	}

	user := model.User{
		ID:     params.UserID,
		Status: utils.UserVerified,
	}
	_, err = c.UserRepository.UpdateUser(&user)
	if err != nil {
		return err
	}

	return nil
}

func (c *UserService) LogIn(params *model.LogInRequest) (*model.LogInResponse, error) {
	roleNames := []string{}
	villageIDs := []int64{}

	user, err := c.validateLogIn(params)
	if err != nil {
		return nil, err
	}

	userRoles, err := c.UserRoleRepository.GetUserRolesWithPreload(&model.UserRole{UserID: user.ID})
	if err != nil {
		return nil, err
	}

	for _, userRole := range userRoles {
		roleNames = append(roleNames, userRole.Role.Name)
	}

	userDetail, err := c.UserDetailRepository.Get(&model.UserDetail{UserID: user.ID})
	if err != nil {
		return nil, err
	}

	if userDetail != nil {
		for _, villageID := range userDetail.VillageIDs {
			villageIDs = append(villageIDs, villageID)
		}
	}

	now := c.TimeRepository.TimeNow()
	payload := model.JWTPayload{
		ID:         user.ID,
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		Status:     utils.UserStatus[user.Status],
		Roles:      roleNames,
		VillageIDs: villageIDs,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(time.Hour * 24 * 30).Unix(),
		},
	}

	if user.Email != nil {
		payload.Email = *user.Email
	}
	if user.PhoneNumber != nil {
		payload.PhoneNumber = *user.PhoneNumber
	}

	token, err := utils.GenerateJWT(payload)
	if err != nil {
		return nil, err
	}

	resp := model.LogInResponse{
		ID:          user.ID,
		Email:       user.Email,
		PhoneNumber: user.PhoneNumber,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		PhotoURL:    user.PhotoURL,
		Status:      utils.UserStatus[user.Status],
		Roles:       roleNames,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
		Token:       token,
	}

	return &resp, nil
}

func (c *UserService) UpdatePassword(params *model.UpdatePasswordRequest) error {
	err := c.validateUpdatePassword(params)
	if err != nil {
		return err
	}

	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(params.NewPassword), 10)
	if err != nil {
		return err
	}

	c.UserRepository.UpdateUser(&model.User{
		ID:       params.UserID,
		Password: string(hashedNewPassword),
	})

	return nil
}

func (c *UserService) ForgotPassword(params *model.ForgotPasswordRequest) error {
	user, err := c.validateForgotPassword(params)
	if err != nil {
		return err
	}

	now := c.TimeRepository.TimeNow()
	payload := model.JWTPayload{
		ID:    user.ID,
		Email: *user.Email,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(time.Hour * 24).Unix(),
		},
	}

	token, err := utils.GenerateJWT(payload)
	if err != nil {
		return err
	}

	go func() {
		templateEmail := "./template/reset_password.html"
		sendRequest := model.SendMail{
			SendTo:            *user.Email,
			UserFullname:      user.FirstName,
			VerifyAccountLink: fmt.Sprintf(utils.ResetPasswordUrl, cfg.GetConfig().FrontendBaseUrl, token),
			GcsBucket:         cfg.GetConfig().GcsBucketUrl,
		}
		subject := fmt.Sprintf("Reset Password %s!", user.FirstName)
		utils.SendMail(templateEmail, sendRequest, subject)
	}()

	return nil
}

func (c *UserService) ResetPassword(params *model.ResetPasswordRequest) error {
	err := c.validateResetPassword(params)
	if err != nil {
		return err
	}

	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(params.NewPassword), 10)
	if err != nil {
		return err
	}

	c.UserRepository.UpdateUser(&model.User{
		ID:       params.UserID,
		Password: string(hashedNewPassword),
	})

	return nil
}

func (c *UserService) UnassignList() ([]model.UnassignListResp, error) {
	users, err := c.UserRepository.FindUnassign()
	if err != nil {
		return []model.UnassignListResp{}, err
	}

	resp := make([]model.UnassignListResp, len(users))
	for i, user := range users {
		resp[i] = model.UnassignListResp{
			UserID:      user.ID,
			UserName:    user.FirstName,
			Email:       user.Email,
			PhoneNumber: user.PhoneNumber,
			Role:        utils.CapRoleManager,
			Villages:    []model.AssignmentListVillage{},
		}
	}

	return resp, nil
}

func (c *UserService) AssignmentList(villageIDs []int64) ([]model.AssignmentListResp, error) {
	users, err := c.UserRepository.FindAssignment(villageIDs)
	if err != nil {
		return []model.AssignmentListResp{}, err
	}

	var findVillageParam model.FindVillageRequest
	if len(villageIDs) > 0 {
		findVillageParam.IDs = villageIDs
	} else {
		villageIDMap := make(map[int64]bool)
		for _, user := range users {
			for _, villageID := range user.VillageIDs {
				if _, ok := villageIDMap[villageID]; ok {
					continue
				}

				villageIDMap[villageID] = true
				findVillageParam.IDs = append(findVillageParam.IDs, villageID)
			}
		}
	}

	villages, err := c.VillageRepository.Find(&findVillageParam)
	if err != nil {
		return []model.AssignmentListResp{}, err
	}

	villageMap := make(map[int64]string)
	for _, village := range villages {
		villageMap[village.ID] = village.Name
	}

	resp := make([]model.AssignmentListResp, len(users))
	for i, user := range users {
		respVillages := make([]model.AssignmentListVillage, len(user.VillageIDs))
		for i, villageID := range user.VillageIDs {
			respVillages[i] = model.AssignmentListVillage{
				ID:   villageID,
				Name: villageMap[villageID],
			}
		}

		resp[i] = model.AssignmentListResp{
			UserID:      user.ID,
			UserName:    user.FirstName,
			Email:       user.Email,
			PhoneNumber: user.PhoneNumber,
			Role:        utils.NewUserRole[user.Role],
			Villages:    respVillages,
		}
	}

	return resp, nil
}

func (c *UserService) Assignment(params *model.AssignmentReq) error {
	tx := utils.InitTx()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Deactivate existing user
	if len(params.VillageIDs) == 0 {
		err := c.UserDetailRepository.DeleteWithTx(tx, &model.UserDetail{UserID: params.UserID})
		if err != nil {
			tx.Rollback()
			return err
		}

		if params.Role == utils.CapRoleManager {
			_, err := c.UserRepository.UpdateWithTx(tx, &model.User{
				ID:     params.UserID,
				Status: utils.UserVerified,
			})
			if err != nil {
				tx.Rollback()
				return err
			}

			return tx.Commit().Error
		}

		err = c.UserRoleRepository.DeleteWithTx(tx, &model.UserRole{UserID: params.UserID})
		if err != nil {
			tx.Rollback()
			return err
		}

		err = c.UserRepository.DeleteWithTx(tx, &model.User{ID: params.UserID})
		if err != nil {
			tx.Rollback()
			return err
		}

		return tx.Commit().Error
	}

	switch params.Role {
	case utils.CapRoleManager:
		user, err := c.UserRepository.GetUser(&model.User{ID: params.UserID})
		if err != nil {
			return err
		}
		if user == nil {
			return utils.ErrUserNotExist
		}

		err = c.validateAssignmentManager(&model.AssignmentManagerRequest{
			VillageIDs: params.VillageIDs,
			User:       user,
		})
		if err != nil {
			tx.Rollback()
			return err
		}

		if user.Status == utils.UserVerified {
			_, err = c.UserRepository.UpdateWithTx(tx, &model.User{
				ID:     params.UserID,
				Status: utils.UserActive,
			})
			if err != nil {
				tx.Rollback()
				return err
			}
		}

	case utils.CapRoleSupervisor:
		err := c.validateVilageIDs(params.VillageIDs)
		if err != nil {
			tx.Rollback()
			return err
		}

		if params.UserID == 0 {
			user, err := c.UserRepository.InsertWithTx(tx, &model.User{
				PhoneNumber: &params.PhoneNumber,
				FirstName:   params.UserName,
				Status:      utils.UserRegistered,
			})
			if err != nil {
				tx.Rollback()
				return err
			}

			role, err := c.RoleRepository.GetRole(&model.Role{Name: utils.RoleSupervisor})
			if err != nil {
				tx.Rollback()
				return err
			}
			if role == nil {
				tx.Rollback()
				return utils.ErrRoleNameUserNotExist
			}

			_, err = c.UserRoleRepository.InsertWithTx(tx, &model.UserRole{
				UserID: user.ID,
				RoleID: role.ID,
			})
			if err != nil {
				tx.Rollback()
				return err
			}

			params.UserID = user.ID
		}

		_, err = c.UserRepository.UpdateWithTx(tx, &model.User{
			ID:          params.UserID,
			PhoneNumber: &params.PhoneNumber,
			FirstName:   params.UserName,
		})
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	userDetail, err := c.UserDetailRepository.Get(&model.UserDetail{UserID: params.UserID})
	if err != nil {
		tx.Rollback()
		return err
	}

	if userDetail == nil {
		_, err = c.UserDetailRepository.InsertWithTx(tx, &model.UserDetail{
			UserID:     params.UserID,
			VillageIDs: params.VillageIDs,
		})
		if err != nil {
			tx.Rollback()
			return err
		}

		return tx.Commit().Error
	}

	_, err = c.UserDetailRepository.UpdateWithTx(tx, &model.UserDetail{
		ID:         userDetail.ID,
		VillageIDs: params.VillageIDs,
	})
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (c *UserService) GetDetail(params *model.GetUserDetailReq) (*model.GetUserDetailResp, error) {
	user, err := c.UserRepository.GetUser(&model.User{ID: params.UserID})
	if err != nil {
		return &model.GetUserDetailResp{}, err
	}
	if user == nil {
		return &model.GetUserDetailResp{}, utils.ErrUserNotExist
	}

	userRoles, err := c.UserRoleRepository.GetUserRolesWithPreload(&model.UserRole{UserID: user.ID})
	if err != nil {
		return &model.GetUserDetailResp{}, err
	}

	var userRole string
	if len(userRoles) > 0 {
		userRole = utils.NewUserRole[userRoles[0].Role.Name]
	}

	userDetail, err := c.UserDetailRepository.Get(&model.UserDetail{UserID: user.ID})
	if err != nil {
		return &model.GetUserDetailResp{}, err
	}

	assignedVillages := make([]model.AssignmentListVillage, 0)
	if userDetail != nil {
		villages, err := c.VillageRepository.Find(&model.FindVillageRequest{IDs: userDetail.VillageIDs})
		if err != nil {
			return &model.GetUserDetailResp{}, err
		}

		for _, village := range villages {
			assignedVillages = append(assignedVillages, model.AssignmentListVillage{
				ID:   village.ID,
				Name: village.Name,
			})
		}
	}

	resp := &model.GetUserDetailResp{
		UserID:      user.ID,
		UserName:    user.FirstName,
		Email:       user.Email,
		PhoneNumber: user.PhoneNumber,
		Role:        userRole,
		Villages:    assignedVillages,
	}

	return resp, nil
}

func (c *UserService) RegisterAssign(params *model.RegisterAssignReq) error {
	err := c.validateSignUp(&model.SignUpRequest{
		Email: params.Email,
		Type:  utils.UserTypeEmail,
	})
	if err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), 10)
	if err != nil {
		return err
	}

	tx := utils.InitTx()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	user := &model.User{
		Email:       &params.Email,
		PhoneNumber: &params.PhoneNumber,
		Password:    string(hashedPassword),
		FirstName:   params.Fullname,
		Status:      utils.UserActive,
	}
	user, err = c.UserRepository.InsertWithTx(tx, user)
	if err != nil {
		tx.Rollback()
		return err
	}

	role, err := c.RoleRepository.GetRole(&model.Role{Name: utils.RoleUser})
	if err != nil {
		tx.Rollback()
		return err
	}
	if role == nil {
		tx.Rollback()
		return utils.ErrRoleNameUserNotExist
	}

	_, err = c.UserRoleRepository.InsertWithTx(tx, &model.UserRole{
		UserID: user.ID,
		RoleID: role.ID,
	})
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = c.UserDetailRepository.InsertWithTx(tx, &model.UserDetail{
		UserID:     user.ID,
		VillageIDs: params.VillageIDs,
	})
	if err != nil {
		tx.Rollback()
		return err
	}

	// send email the password
	go func() {
		templateEmail := "./template/register_assign.html"
		sendRequest := model.SendMail{
			SendTo:       params.Email,
			UserFullname: user.FirstName,
			Password:     params.Password,
			LoginLink:    fmt.Sprintf(utils.LoginUrl, cfg.GetConfig().FrontendBaseUrl),
			GcsBucket:    cfg.GetConfig().GcsBucketUrl,
		}
		subject := "Selamat Datang Di IoThub!"
		utils.SendMail(templateEmail, sendRequest, subject)
	}()

	return tx.Commit().Error
}
