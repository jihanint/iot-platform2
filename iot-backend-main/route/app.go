package route

import (
	"github.com/iotplatform-tech/iot-backend/handler"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/service"
)

type AppModels struct {
	Health   handler.HealthHandler
	User     handler.UserHandler
	Region   handler.RegionHandler
	Device   handler.DeviceHandler
	Water    handler.WaterHandler
	Alert    handler.AlertHandler
	Activity handler.ActivityHandler
}

func App() AppModels {
	// repository
	healthRepository := &repository.HealthRepositoryCtx{}
	userRepository := &repository.UserRepositoryCtx{}
	timeRepository := &repository.TimeRepositoryCtx{}
	roleRepository := &repository.RoleRepositoryCtx{}
	userRoleRepository := &repository.UserRoleRepositoryCtx{}
	userDetailRepository := &repository.UserDetailRepositoryCtx{}
	cityRepository := &repository.CityRepositoryCtx{}
	provinceRepository := &repository.ProvinceRepositoryCtx{}
	districtRepository := &repository.DistrictRepositoryCtx{}
	villageRepository := &repository.VillageRepositoryCtx{}
	deviceRepository := &repository.DeviceRepositoryCtx{}
	deviceStatusLogRepository := &repository.DeviceStatusLogRepositoryCtx{}
	alertRepository := &repository.AlertRepositoryCtx{}
	activityHistoryRepository := &repository.ActivityHistoryRepositoryCtx{}
	telemetryRepository := &repository.TelemetryRepositoryCtx{}
	deviceCalibrationRepository := &repository.DeviceCalibrationRepositoryCtx{}
	apiWilayahIndoRepository := &repository.APIWilayahIndoRepositoryCtx{}

	// service
	healthService := service.HealthService{
		HealthRepository: healthRepository,
	}
	userService := service.UserService{
		UserRepository:       userRepository,
		TimeRepository:       timeRepository,
		RoleRepository:       roleRepository,
		UserRoleRepository:   userRoleRepository,
		UserDetailRepository: userDetailRepository,
		VillageRepository:    villageRepository,
	}
	regionService := service.RegionService{
		CityRepository:           cityRepository,
		ProvinceRepository:       provinceRepository,
		DistrictRepository:       districtRepository,
		VillageRepository:        villageRepository,
		DeviceRepository:         deviceRepository,
		APIWilayahIndoRepository: apiWilayahIndoRepository,
	}
	deviceService := service.DeviceService{
		VillageRepository:           villageRepository,
		DeviceRepository:            deviceRepository,
		TimeRepository:              timeRepository,
		DeviceStatusLogRepository:   deviceStatusLogRepository,
		ActivityHistoryRepository:   activityHistoryRepository,
		TelemetryRepository:         telemetryRepository,
		DeviceCalibrationRepository: deviceCalibrationRepository,
		AlertRepository:             alertRepository,
	}
	alertService := service.AlertService{
		TimeRepository:              timeRepository,
		DeviceRepository:            deviceRepository,
		AlertRepository:             alertRepository,
		UserDetailRepository:        userDetailRepository,
		ActivityHistoryRepository:   activityHistoryRepository,
		DeviceCalibrationRepository: deviceCalibrationRepository,
		TelemetryRepository:         telemetryRepository,
	}
	waterService := service.WaterService{
		DeviceRepository:            deviceRepository,
		TimeRepository:              timeRepository,
		TelemetryRepository:         telemetryRepository,
		DeviceCalibrationRepository: deviceCalibrationRepository,
		AlertService:                alertService,
		VillageRepository:           villageRepository,
		AlertRepository:             alertRepository,
	}
	activityService := service.ActivityService{
		ActivityHistoryRepository: activityHistoryRepository,
		TimeRepository:            timeRepository,
	}

	// handler
	healthHandler := handler.HealthHandler{
		HealthService: healthService,
	}
	userHandler := handler.UserHandler{
		UserService: userService,
	}
	regionHandler := handler.RegionHandler{
		RegionService: regionService,
	}
	deviceHandler := handler.DeviceHandler{
		DeviceService: deviceService,
	}
	waterHandler := handler.WaterHandler{
		WaterService: waterService,
	}
	alertHandler := handler.AlertHandler{
		AlertService: alertService,
	}
	activityHandler := handler.ActivityHandler{
		ActivityService: activityService,
	}

	return AppModels{
		Health:   healthHandler,
		User:     userHandler,
		Region:   regionHandler,
		Device:   deviceHandler,
		Water:    waterHandler,
		Alert:    alertHandler,
		Activity: activityHandler,
	}
}

type CronModels struct {
	Alert service.AlertService
	Water service.WaterService
}

func CronApp() CronModels {
	// repository
	timeRepository := &repository.TimeRepositoryCtx{}
	deviceRepository := &repository.DeviceRepositoryCtx{}
	alertRepository := &repository.AlertRepositoryCtx{}
	userDetailRepository := &repository.UserDetailRepositoryCtx{}
	telemetryRepository := &repository.TelemetryRepositoryCtx{}

	// service
	alertService := service.AlertService{
		TimeRepository:       timeRepository,
		DeviceRepository:     deviceRepository,
		AlertRepository:      alertRepository,
		UserDetailRepository: userDetailRepository,
		TelemetryRepository:  telemetryRepository,
	}

	waterService := service.WaterService{
		TelemetryRepository: telemetryRepository,
	}

	return CronModels{
		Alert: alertService,
		Water: waterService,
	}
}
