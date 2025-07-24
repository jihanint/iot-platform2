package utils

import (
	"errors"
	"time"
)

// Response
var (
	Success = "Success"

	ErrEmptyType           = errors.New("type cannot be empty")
	ErrEmptyEmail          = errors.New("email cannot be empty")
	ErrEmptyPhoneNumber    = errors.New("phone number cannot be empty")
	ErrEmptyFullname       = errors.New("fullname cannot be empty")
	ErrEmptyPassword       = errors.New("password cannot be empty")
	ErrEmptyVerifyToken    = errors.New("verify token cannot be empty")
	ErrEmptyUserID         = errors.New("user id cannot be empty")
	ErrEmptyTeamID         = errors.New("team id cannot be empty")
	ErrEmptyOldPssword     = errors.New("old password cannot be empty")
	ErrEmptyNewPassword    = errors.New("new password cannot be empty")
	ErrEmptyName           = errors.New("name cannot be empty")
	ErrEmptyProvinceID     = errors.New("province id cannot be empty")
	ErrEmptyCityID         = errors.New("city id cannot be empty")
	ErrEmptyDistrictID     = errors.New("district id cannot be empty")
	ErrEmptyVillageID      = errors.New("village id cannot be empty")
	ErrEmptyDeviceCode     = errors.New("device code cannot be empty")
	ErrEmptyRSSI           = errors.New("RSSI cannot be empty")
	ErrEmptyBatteryCurrent = errors.New("battery current cannot be empty")
	ErrEmptyBatteryLevel   = errors.New("battery level cannot be empty")
	ErrEmptyBatteryPower   = errors.New("battery power cannot be empty")
	ErrEmptyWaterInflow    = errors.New("water inflow cannot be empty")
	ErrEmptyWaterOutflow   = errors.New("water outflow cannot be empty")
	ErrEmptyWaterInVolume  = errors.New("involume cannot be empty")
	ErrEmptyWaterOutVolume = errors.New("outvolume cannot be empty")
	ErrEmptyTimestamp      = errors.New("timestamp cannot be empty")
	ErrEmptyAlertID        = errors.New("alert id cannot be empty")
	ErrEmptyAlertComment   = errors.New("comment cannot be empty")
	ErrEmptyDeviceID       = errors.New("device id cannot be empty")
	ErrEmptyRole           = errors.New("role cannot be empty")
	ErrEmptyDiameter       = errors.New("diameter cannot be empty")
	ErrEmptyLength         = errors.New("length cannot be empty")
	ErrEmptyWidth          = errors.New("width cannot be empty")

	ErrPopulationBelowZero = errors.New("population must be more than zero")
	ErrCapacityBelowZero   = errors.New("capacity must be more than zero")

	ErrEmailExist      = errors.New("email already exist")
	ErrPhoneExist      = errors.New("phone number already exist")
	ErrCityExist       = errors.New("city already exist")
	ErrDistrictExist   = errors.New("district already exist")
	ErrVillageExist    = errors.New("village already exist")
	ErrDeviceInstalled = errors.New("device already installed")

	ErrUserNotExist         = errors.New("user is not exist")
	ErrUserDetailNotExist   = errors.New("user detail is not exist")
	ErrRoleNameUserNotExist = errors.New("role name user is not exist")
	ErrRoleNotExist         = errors.New("role is not exist")
	ErrUserTokenNotExist    = errors.New("user token is not exist")
	ErrVillageNotExist      = errors.New("village is not exist")
	ErrDeviceNotExist       = errors.New("device is not exist")
	ErrAlertNotExist        = errors.New("alert is not exist")

	ErrUserIDEmailNotMatch   = errors.New("user id and email do not match")
	ErrUserVerified          = errors.New("user is already verified")
	ErrWrongPassword         = errors.New("password is incorrect")
	ErrWrongOldPassword      = errors.New("old password is incorrect")
	ErrVerifyTokenInvalid    = errors.New("verify token is invalid")
	ErrInvalidUserType       = errors.New("user type is invalid")
	ErrInvalidFilterInterval = errors.New("filter interval is invalid")
	ErrInvalidOrderBy        = errors.New("order by is invalid")
	ErrInvalidSortBy         = errors.New("sort by is invalid")
	ErrInvalidDeviceStatus   = errors.New("device status is invalid")
	ErrInvalidWaterType      = errors.New("water type is invalid")
	ErrInvalidRoleType       = errors.New("role type is invalid")
	ErrInvalidShape          = errors.New("shape is invalid")
	ErrUserStatusNotVerified = errors.New("user status is not verified")
	ErrAlertDone             = errors.New("alert is already done")

	ErrUnauthorizedUserVillageRelation = errors.New("you are unauthorized for this village")
)

// Url
const (
	VerifyUrl        = "%s/auth/verify-account?token=%s"
	LoginUrl         = "%s/auth/login"
	ResetPasswordUrl = "%s/auth/forgot-password?status=reset_password&token=%s"
)

// Number variable
const (
	UserRegistered int16 = 0
	UserVerified   int16 = 1
	UserActive     int16 = 2
	UserInactive   int16 = 3

	DeviceCritical int16 = 1
	DeviceWarning  int16 = 2
	DeviceNormal   int16 = 3
	DeviceInactive int16 = 4

	InflowAlertType              int16 = 1
	OutflowAlertType             int16 = 2
	WaterLevelAlertType          int16 = 3
	SensorMalfunctionAlertType   int16 = 4
	ChangedDeviceStatusAlertType int16 = 5

	AlertCreated int16 = 0
	AlertDone    int16 = 1

	ActivityHistoryTypeAlert  int16 = 1
	ActivityHistoryTypeDevice int16 = 2

	NotCalibratedStatus int16 = 0
	CalibratedStatus    int16 = 1

	TelemetryInputInterval float64 = 3

	DeviceLevelAlertTreshold float64 = 0.8
)

// String variable
const (
	RoleAdmin         = "admin"
	RoleUser          = "user"
	RoleSupervisor    = "supervisor"
	CapRoleManager    = "MANAGER"
	CapRoleSupervisor = "SUPERVISOR"
	UserTypeEmail     = "email"
	UserTypePhone     = "phone"

	InflowAlertTypeStr            = "Debit Air Masuk"
	OutflowAlertTypeStr           = "Debit Air Keluar"
	WaterLevelAlertTypeStr        = "Air Reservoir"
	SensorMalfunctionAlertTypeStr = "Pompa"
	DeviceChangeStatusTypeStr     = "Alat"

	ActivityHistoryTypeAlertStr  = "alert"
	ActivityHistoryTypeDeviceStr = "device"

	WarningInflow         = "terdeteksi terlalu rendah"
	CriticalInflow        = "terdeteksi sangat rendah"
	WarningOutflow        = "terdeteksi terlalu tinggi"
	CriticalOutflow       = "terdeteksi sangat tinggi"
	AlmostFullWaterLevel  = "terdeteksi terlalu tinggi"
	AlmostEmptyWaterLevel = "terdeteksi terlalu rendah"
	SensorMalfuntion      = "tidak aktif"
	InactiveDevice        = "tidak aktif"

	AlertActivityHistory  = "Peringatan %s di Desa %s telah %s."
	DeviceActivityHistory = "Perangkat baru terpasang di Desa %s, Kabupaten %s."

	AlertStatusReviewed = "ditinjau"
	AlertStatusDone     = "diselesaikan"

	WaterTypeProduction = "production"
	WaterTypeUsage      = "usage"
	WaterTypeLevel      = "level"

	EmptyAuth         = "authorization is empty"
	InvalidAuth       = "authorization is invalid"
	UnexpectedSigning = "unexpected signing method: %v"

	TimeLayout = "2006-01-02 15:04:05.000 -0700"
	DateLayout = "2006-01-02"

	FilterByDayFormat   = "%d day"
	FilterByWeekFormat  = "%d week"
	FilterByMonthFormat = "%d month"

	FilterByMonth = "30 days"
	FilterByWeek  = "7 days"
	FilterByDay   = "24 hours"

	FilterAreaAll    = "all"
	FilterRangeHour  = "hour"
	FilterRangeDay   = "day"
	FilterRangeWeek  = "week"
	FilterRangeMonth = "month"
	OrderByAsc       = "ASC"
	OrderByDesc      = "DESC"

	ReservoirShapeBlock = "BLOCK"
	ReservoirShapeTube  = "TUBE"

	DeviceSensorPulse      = "pulse"
	DeviceSensorUltrasonic = "ultrasonic"

	DeviceTypeGravity = "Gravitasi"

	SumAllWaterProductionRedisKey     = "sum_water_production:all"
	SumGroupedWaterProductionRedisKey = "sum_water_production:%d"
	RedisNil                          = "redis: nil"
)

var (
	UserStatus = map[int16]string{
		UserRegistered: "registered",
		UserVerified:   "verified",
		UserActive:     "active",
		UserInactive:   "inactive",
	}

	AlertType = map[int16]string{
		InflowAlertType:              InflowAlertTypeStr,
		OutflowAlertType:             OutflowAlertTypeStr,
		WaterLevelAlertType:          WaterLevelAlertTypeStr,
		SensorMalfunctionAlertType:   SensorMalfunctionAlertTypeStr,
		ChangedDeviceStatusAlertType: DeviceChangeStatusTypeStr,
	}

	AlertTriggeredType = map[int16]map[string]string{
		InflowAlertType: {
			WarningInflow:  "warning_water_production",
			CriticalInflow: "critical_water_production",
		},
		WaterLevelAlertType: {
			AlmostFullWaterLevel: "almost_full_water_level",
			AlmostEmptyWaterLevel: "almost_empty_water_level",
		},
		SensorMalfunctionAlertType: {
			SensorMalfuntion: "sensor_malfunction",
		},
		ChangedDeviceStatusAlertType: {
			InactiveDevice: "inactive_device",
		},
	}

	ActivityHistoryType = map[int16]string{
		ActivityHistoryTypeAlert:  ActivityHistoryTypeAlertStr,
		ActivityHistoryTypeDevice: ActivityHistoryTypeDeviceStr,
	}

	NewUserRole = map[string]string{
		RoleUser:       CapRoleManager,
		RoleSupervisor: CapRoleSupervisor,
	}

	AllowedUserType = map[string]bool{
		UserTypeEmail: true,
		UserTypePhone: true,
	}

	AllowedFilterInterval = map[string]bool{
		FilterRangeDay:   true,
		FilterRangeWeek:  true,
		FilterRangeMonth: true,
	}

	AllowedOrderBy = map[string]bool{
		OrderByAsc:  true,
		OrderByDesc: true,
	}

	AllowedDeviceStatus = map[int16]bool{
		DeviceCritical: true,
		DeviceWarning:  true,
		DeviceNormal:   true,
		DeviceInactive: true,
	}

	AllowedWaterType = map[string]bool{
		WaterTypeProduction: true,
		WaterTypeUsage:      true,
		WaterTypeLevel:      true,
	}

	AllowedDeviceCalibrationListSortBy = map[string]bool{
		"village_name":                   true,
		"city":                           true,
		"water_level_calibration_status": true,
		"water_flow_calibration_status":  true,
		"calibration_date":               true,
	}

	AllowedUserRoleAssignment = map[string]bool{
		CapRoleManager:    true,
		CapRoleSupervisor: true,
	}

	AllowedReservoirShape = map[string]bool{
		ReservoirShapeBlock: true,
		ReservoirShapeTube:  true,
	}

	AlertActionMap = map[int16]map[string]string{
		InflowAlertType: {
			CriticalInflow: "Harap periksa pompa, pipa, dan panel surya.",
		},
		OutflowAlertType: {
			CriticalOutflow: "Harap periksa kondisi bak reservoir dan sensor.",
		},
		WaterLevelAlertType: {
			AlmostFullWaterLevel:  "Harap membuka tugu keran.",
			AlmostEmptyWaterLevel: "Harap tutup keran keluar dan periksa kondisi bak reservoir.",
		},
		SensorMalfunctionAlertType: {
			SensorMalfuntion: "Periksa fungsi sensor atau hubungi team Solar Chapter untuk bantuan penanganan",
		},
		ChangedDeviceStatusAlertType: {
			InactiveDevice: "Periksa fungsi sensor atau hubungi team Solar Chapter untuk bantuan penanganan",
		},
	}
)

const (
	SaveSumWaterFlowToRedisTTL time.Duration = 15 * time.Minute
)
