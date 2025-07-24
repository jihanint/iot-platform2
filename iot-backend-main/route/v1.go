package route

import (
	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/middleware"
	"github.com/iotplatform-tech/iot-backend/utils"
)

func V1Routes(g *echo.Group, h AppModels) {
	g.GET("/health", h.Health.Check)

	user := g.Group("/user")
	user.POST("/signup", h.User.SignUp)
	user.POST("/verify", h.User.Verify)
	user.POST("/login", h.User.LogIn)
	user.PATCH("/password/update", h.User.UpdatePassword, middleware.JWTVerify([]string{utils.RoleUser}))
	user.POST("/password/forgot", h.User.ForgotPassword)
	user.POST("/password/reset", h.User.ResetPassword)
	user.GET("/unassign-list", h.User.UnassignList, middleware.JWTVerify([]string{utils.RoleAdmin}))
	user.GET("/assignment-list", h.User.AssignmentList, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	user.POST("/assignment", h.User.Assignment, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	user.GET("/detail", h.User.GetDetail, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	user.POST("/register-assign", h.User.RegisterAssign, middleware.JWTVerify([]string{utils.RoleAdmin}))

	regionAdmin := g.Group("/region", middleware.JWTVerify([]string{utils.RoleAdmin}))
	regionAdmin.POST("/create", h.Region.CreateRegion)
	regionAdmin.POST("/province", h.Region.CreateProvince)
	regionAdmin.POST("/city", h.Region.CreateCity)
	regionAdmin.POST("/district", h.Region.CreateDistrict)
	regionAdmin.POST("/village", h.Region.CreateVillage) // TODO delete. Merge with save device

	regionAdminUser := g.Group("/region", middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	regionAdminUser.GET("/provinces", h.Region.GetProvinceList)
	regionAdminUser.GET("/cities", h.Region.GetCityList)
	regionAdminUser.GET("/districts", h.Region.GetDistrictList)
	regionAdminUser.GET("/villages", h.Region.GetVillageList)
	regionAdminUser.GET("/village", h.Region.GetVillage)

	openRegion := g.Group("/open-region")
	openRegion.GET("/villages", h.Region.GetOpenVillageList)

	device := g.Group("/device")
	device.POST("/install", h.Device.DeviceInstall, middleware.JWTVerify([]string{utils.RoleAdmin})) // TODO delete. Handled by Device Save
	device.POST("/save", h.Device.Save, middleware.JWTVerify([]string{utils.RoleAdmin}))
	device.POST("/calibrate", h.Device.Calibrate, middleware.JWTVerify([]string{utils.RoleAdmin}))
	device.GET("/saved", h.Device.Saved, middleware.JWTVerify([]string{utils.RoleAdmin}))
	device.GET("/calibrated", h.Device.Calibrated, middleware.JWTVerify([]string{utils.RoleAdmin}))
	device.GET("/calibration-list", h.Device.DeviceCalibrationList, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	device.POST("/log-status", h.Device.LogStatus)
	device.GET("/list", h.Device.DeviceList, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	device.GET("/status-logs", h.Device.StatusLogs)
	device.GET("/functionality-stats", h.Device.FunctionalityStats, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))

	water := g.Group("/water")
	water.POST("/telemetry", h.Water.Telemetry)
	water.GET("/telemetry-list", h.Water.TelemetryList)
	water.GET("/usage-chart", h.Water.GetWaterUsageChart, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	water.GET("/production-chart", h.Water.GetWaterProductionChart, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	water.GET("/level-chart", h.Water.GetWaterLevelChart, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	water.GET("/list", h.Water.GetWaterList, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	water.GET("/summary", h.Water.GetSummary)
	water.GET("/report", h.Water.GetReport)

	openWater := g.Group("/open-water")
	openWater.GET("/production-chart", h.Water.GetOpenWaterProductionChart)
	openWater.GET("/level-chart", h.Water.GetOpenWaterLevelChart)

	alert := g.Group("/alert")
	alert.GET("/list", h.Alert.List, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	alert.PATCH("/review", h.Alert.Review, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	alert.PATCH("/done", h.Alert.Done, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))

	openAlert := g.Group("/open-alert")
	openAlert.GET("/list", h.Alert.OpenList)

	activity := g.Group("/activity")
	activity.GET("/histories", h.Activity.Histories, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
	activity.GET("/histories-grouped", h.Activity.HistoriesGrouped, middleware.JWTVerify([]string{utils.RoleAdmin, utils.RoleUser}))
}
