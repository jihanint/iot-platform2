package service

import (
	"encoding/json"
	"fmt"
	"math"
	"time"

	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type DeviceService struct {
	VillageRepository           repository.VillageRepository
	DeviceRepository            repository.DeviceRepository
	TimeRepository              repository.TimeRepository
	DeviceStatusLogRepository   repository.DeviceStatusLogRepository
	ActivityHistoryRepository   repository.ActivityHistoryRepository
	TelemetryRepository         repository.TelemetryRepository
	DeviceCalibrationRepository repository.DeviceCalibrationRepository
	AlertRepository             repository.AlertRepository
}

func (c *DeviceService) InstallDevice(params *model.InstallDeviceRequest) error {
	err := c.validateInstallDevice(params)
	if err != nil {
		return err
	}

	device := model.Device{
		VillageID: params.VillageID,
		Code:      params.Code,
		Capacity:  params.Capacity,
		Lat:       params.Lat,
		Long:      params.Long,
		Status:    utils.DeviceNormal,
	}

	if params.IoTInstallDate != "" {
		iotInstallDate, err := time.Parse(utils.TimeLayout, params.IoTInstallDate)
		if err != nil {
			return err
		}
		device.IoTInstallDate = iotInstallDate
	} else {
		device.IoTInstallDate = c.TimeRepository.TimeNow()
	}

	if params.PumpInstallDate != "" {
		pumpInstallDate, err := time.Parse(utils.TimeLayout, params.PumpInstallDate)
		if err != nil {
			return err
		}
		device.PumpInstallDate = pumpInstallDate
	} else {
		device.PumpInstallDate = c.TimeRepository.TimeNow()
	}

	deviceRes, err := c.DeviceRepository.InsertDevice(&device)
	if err != nil {
		return err
	}

	village, err := c.VillageRepository.GetWithCity(&model.Village{ID: params.VillageID})
	if err != nil {
		return err
	}

	_, err = c.ActivityHistoryRepository.Insert(&model.ActivityHistory{
		Type:      utils.ActivityHistoryTypeDevice,
		RefID:     deviceRes.ID,
		Message:   fmt.Sprintf(utils.DeviceActivityHistory, village.VillageName, village.CityName),
		VillageID: params.VillageID,
	})
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceService) LogStatus(params []model.LogStatusRequest) error {
	dsl := make([]model.DeviceStatusLog, len(params))

	for i, param := range params {
		err := c.validateLogStatus(&param)
		if err != nil {
			return err
		}

		now := c.TimeRepository.TimeNow()
		deviceTime := time.Unix(param.Timestamp, 0)

		dsl[i] = model.DeviceStatusLog{
			DeviceID:       param.DeviceID,
			RSSI:           param.RSSI,
			BatteryCurrent: param.BatteryCurrent,
			BatteryLevel:   param.BatteryLevel,
			BatteryPower:   param.BatteryPower,
			Lat:            param.Lat,
			Long:           param.Long,
			CreatedAt:      now,
			DeviceTime:     deviceTime,
		}
	}

	_, err := c.DeviceStatusLogRepository.Insert(dsl)
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceService) DeviceList(params *model.DeviceListRequest) ([]model.DeviceListResponse, error) {
	devices, err := c.DeviceRepository.FindDeviceList(&model.FindDeviceParam{
		VillageIDs:    params.VillageIDs,
		Status:        params.Status,
		BasicGetParam: params.BasicGetParam,
	})
	if err != nil {
		return nil, err
	}

	deviceIDs := make([]int64, len(devices))
	for i := range devices {
		deviceIDs[i] = devices[i].DeviceID
	}

	water, err := c.TelemetryRepository.GetLatest(&model.GetLatestTelemetryParam{DeviceIDs: deviceIDs})
	if err != nil {
		return nil, err
	}

	waterMap := make(map[int64]time.Time)
	for _, w := range water {
		waterMap[w.DeviceID] = w.LatestCreatedAt
	}

	for i := range devices {
		if lastUpdate, ok := waterMap[devices[i].DeviceID]; ok {
			devices[i].LastUpdate = lastUpdate
		}
	}

	resp := make([]model.DeviceListResponse, len(devices))
	for i, device := range devices {
		resp[i] = model.DeviceListResponse(device)
	}

	return resp, nil
}

func (c *DeviceService) StatusLogs(params *model.StatusLogsRequest) (*model.StatusLogsResponse, error) {
	statuses, err := c.DeviceStatusLogRepository.Find(&model.StatusLogsParam{
		Code:       params.Code,
		PageNumber: params.PageNumber,
		PageSize:   params.PageSize,
	})
	if err != nil {
		return nil, err
	}

	count, err := c.DeviceStatusLogRepository.Count(&model.StatusLogsParam{Code: params.Code})
	if err != nil {
		return nil, err
	}

	respData := make([]model.StatusLogsResponseData, len(statuses))
	for i, status := range statuses {
		respData[i] = model.StatusLogsResponseData(status)
	}

	// TODO wrap into function
	if params.PageSize == 0 && params.PageNumber == 0 {
		params.PageSize = int64(len(respData))
		params.PageNumber = 1
	}

	resp := model.StatusLogsResponse{
		Statuses: respData,
		Meta: model.MetaPagination{ // TODO wrap into function
			PageNumber:   params.PageNumber,
			PageSize:     int64(len(respData)),
			TotalPages:   utils.GetTotalPage(count, params.PageSize),
			TotalRecords: count,
		},
	}

	return &resp, nil
}

func (c *DeviceService) FunctionalityStats(params *model.DeviceFunctionalityStatsRequest) (*model.DeviceFunctionalityStatsResponse, error) {
	functionalities, err := c.DeviceRepository.FindFunctionalityStats(&model.DeviceFunctionalityStatsParam{
		VillageIDs: params.VillageIDs,
	})
	if err != nil {
		return nil, err
	}

	funtionalityMap := make(map[int16]model.DeviceFunctionalityStatsData, 0)
	for _, functionality := range functionalities {
		funtionalityMap[functionality.Status] = model.DeviceFunctionalityStatsData{
			Total: funtionalityMap[functionality.Status].Total + 1,
		}
	}

	nonFuntioning := model.DeviceFunctionalityStatsData{
		Total: funtionalityMap[utils.DeviceWarning].Total + funtionalityMap[utils.DeviceCritical].Total,
	}

	resp := model.DeviceFunctionalityStatsResponse{
		Functioning:             funtionalityMap[utils.DeviceNormal],
		NonFunctioning:          nonFuntioning,
		PermanentNonFunctioning: funtionalityMap[utils.DeviceInactive],
	}

	return &resp, nil
}

func (c *DeviceService) Save(params *model.SaveDeviceRequest) error {
	var (
		iotInstallDate, pumpInstallDate time.Time
		err                             error
	)

	// TODO wrap into function
	if params.DeviceID >= 0 {
		iotInstallDate, err = time.Parse(utils.DateLayout, params.IoTInstallDate)
		if err != nil {
			return err
		}
		pumpInstallDate, err = time.Parse(utils.DateLayout, params.PumpInstallDate)
		if err != nil {
			return err
		}
	}

	// TODO wrap into function
	if params.DeviceID == 0 {
		err := c.validateCreateVillage(params)
		if err != nil {
			return err
		}

		village, err := c.VillageRepository.InsertVillage(&model.Village{
			Name:       params.VillageName,
			DistrictID: params.DistrictID,
			Lat:        params.Lat,
			Long:       params.Long,
			Population: params.Population,
			FieldCode:  params.FieldCode,
			PicName:    params.PicName,
			PicContact: params.PicContact,
		})
		if err != nil {
			return err
		}

		device, err := c.DeviceRepository.InsertDevice(&model.Device{
			VillageID:       village.ID,
			Code:            params.DeviceCode,
			Capacity:        params.Capacity,
			Status:          utils.DeviceNormal,
			Lat:             params.Lat,
			Long:            params.Long,
			Brand:           params.Brand,
			Power:           params.Power,
			Level:           params.Level,
			Type:            params.Type,
			Sensor:          utils.DeviceSensorUltrasonic,
			IoTInstallDate:  iotInstallDate,
			PumpInstallDate: pumpInstallDate,
		})
		if err != nil {
			return err
		}

		_, err = c.DeviceRepository.UpdateCode(&model.Device{
			ID:         device.ID,
			Code:       fmt.Sprintf("SC%d", device.ID),
			MacAddress: device.Code,
		})
		if err != nil {
			return err
		}

		return nil
	}

	// TODO wrap into function
	if params.DeviceID < 0 {
		deviceID := -params.DeviceID
		device, err := c.DeviceRepository.Get(&model.Device{ID: deviceID})
		if err != nil {
			return err
		}
		if device == nil {
			return utils.ErrDeviceNotExist
		}

		err = c.AlertRepository.Delete(&model.Alert{VillageID: device.VillageID})
		if err != nil {
			return err
		}

		err = c.ActivityHistoryRepository.Delete(&model.ActivityHistory{VillageID: device.VillageID})
		if err != nil {
			return err
		}

		err = c.DeviceCalibrationRepository.Delete(&model.DeviceCalibration{DeviceID: deviceID})
		if err != nil {
			return err
		}

		err = c.DeviceRepository.Delete(&model.Device{ID: deviceID})
		if err != nil {
			return err
		}

		err = c.VillageRepository.Delete(&model.Village{ID: device.VillageID})
		if err != nil {
			return err
		}

		return nil
	}

	// TODO wrap into function
	device, err := c.DeviceRepository.Get(&model.Device{ID: params.DeviceID})
	if err != nil {
		return err
	}

	_, err = c.DeviceRepository.Update(&model.Device{
		ID:              params.DeviceID,
		Capacity:        params.Capacity,
		Lat:             params.Lat,
		Long:            params.Long,
		Brand:           params.Brand,
		Power:           params.Power,
		Level:           params.Level,
		Type:            params.Type,
		MacAddress:      params.DeviceCode,
		IoTInstallDate:  iotInstallDate,
		PumpInstallDate: pumpInstallDate,
	})
	if err != nil {
		return err
	}

	_, err = c.VillageRepository.Update(&model.Village{
		ID:         device.VillageID,
		Name:       params.VillageName,
		DistrictID: params.DistrictID,
		Lat:        params.Lat,
		Long:       params.Long,
		Population: params.Population,
		FieldCode:  params.FieldCode,
		PicName:    params.PicName,
		PicContact: params.PicContact,
	})
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceService) Calibrate(params *model.CalibrateDeviceRequest) error {
	device, err := c.DeviceRepository.Get(&model.Device{ID: params.DeviceID})
	if err != nil {
		return err
	}

	calibration, err := c.DeviceCalibrationRepository.Get(&model.DeviceCalibration{DeviceID: params.DeviceID})
	if err != nil {
		return err
	}

	test := model.WaterCalibrationTest{
		Inflow:  params.Inflow,
		Outflow: params.Outflow,
		Level:   params.Level,
	}

	testMarshaled, err := json.Marshal(test)
	if err != nil {
		return err
	}

	inflowCalculated := make([]float64, len(params.Inflow))
	for i, inflow := range params.Inflow {
		inflowCalculated[i] = CalcCalibration(params, inflow)
	}

	outflowCalculated := make([]float64, len(params.Outflow))
	for i, outflow := range params.Outflow {
		outflowCalculated[i] = CalcCalibration(params, outflow)
	}

	levelCalculated := params.Level.ActualLevel + params.Level.TelemetryLevel - device.Level

	calibrationUpsertParam := model.DeviceCalibration{
		DeviceID:          params.DeviceID,
		Shape:             params.Shape,
		Diameter:          params.Diameter,
		Length:            params.Length,
		Width:             params.Width,
		Test:              string(testMarshaled),
		InflowCalculated:  inflowCalculated,
		OutflowCalculated: outflowCalculated,
		LevelCalculated:   levelCalculated,
	}

	if calibration == nil {
		_, err = c.DeviceCalibrationRepository.Insert(&calibrationUpsertParam)
		if err != nil {
			return err
		}

		return nil
	}

	_, err = c.DeviceCalibrationRepository.Update(&calibrationUpsertParam)
	if err != nil {
		return err
	}

	return nil
}

func CalcCalibration(params *model.CalibrateDeviceRequest, waterFlow model.WaterFlowCalibration) float64 {
	firstCalc := CalcBaseCalibration(params, waterFlow.FirstTest.ActualLevel, waterFlow.FirstTest.TelemetryLevel)
	secondCalc := CalcBaseCalibration(params, waterFlow.SecondTest.ActualLevel, waterFlow.SecondTest.TelemetryLevel)
	thirdCalc := CalcBaseCalibration(params, waterFlow.ThirdTest.ActualLevel, waterFlow.ThirdTest.TelemetryLevel)

	return (firstCalc + secondCalc + thirdCalc) / 3
}

func CalcBaseCalibration(params *model.CalibrateDeviceRequest, actualHeight, telemetryHeight float64) float64 {
	var volume float64

	switch params.Shape {
	case utils.ReservoirShapeBlock:
		volume = (params.Length * params.Width * actualHeight) / utils.TelemetryInputInterval
	case utils.ReservoirShapeTube:
		volume = (math.Pi * math.Pow(params.Diameter/2, 2) * actualHeight) / utils.TelemetryInputInterval
	}

	return volume / telemetryHeight
}

func (c *DeviceService) DeviceCalibrationList(params *model.DeviceCalibrationListRequest) ([]model.DeviceCalibrationListResponse, error) {
	devices, err := c.DeviceRepository.FindDeviceCalibrationList(&model.FindDeviceCalibrationParam{
		VillageIDs:    params.VillageIDs,
		BasicGetParam: params.BasicGetParam,
	})
	if err != nil {
		return nil, err
	}

	resp := make([]model.DeviceCalibrationListResponse, len(devices))
	for i, device := range devices {
		var waterLevelCalibrationStatus, waterFlowCalibrationStatus int16

		if device.LevelCalibration != 0 {
			waterLevelCalibrationStatus = utils.CalibratedStatus
		}

		if len(device.InflowCalibration) > 0 && len(device.OutflowCalibration) > 0 {
			waterFlowCalibrationStatus = utils.CalibratedStatus
		}

		resp[i] = model.DeviceCalibrationListResponse{
			DeviceID:                    device.DeviceID,
			VillageID:                   device.VillageID,
			VillageName:                 device.VillageName,
			City:                        device.City,
			WaterLevelCalibrationStatus: waterLevelCalibrationStatus,
			WaterFlowCalibrationStatus:  waterFlowCalibrationStatus,
			CalibrationDate:             device.CalibrationDate,
		}
	}

	return resp, nil
}

func (c *DeviceService) Saved(params *model.SavedDeviceRequest) (*model.SavedDeviceResponse, error) {
	device, err := c.DeviceRepository.GetSaved(params.DeviceID)
	if err != nil {
		return nil, err
	}

	if device == nil {
		return nil, utils.ErrDeviceNotExist
	}

	resp := model.SavedDeviceResponse{
		DeviceID: device.DeviceID,
		VillageData: model.SavedVillageData{
			VillageName:     device.VillageName,
			ProvinceID:      device.ProvinceID,
			ProvinceName:    device.ProvinceName,
			CityID:          device.CityID,
			CityName:        device.CityName,
			DistrictID:      device.DistrictID,
			DistrictName:    device.DistrictName,
			FieldCode:       device.FieldCode,
			Lat:             device.Lat,
			Long:            device.Long,
			Population:      device.Population,
			PumpInstallDate: device.PumpInstallDate,
			PicName:         device.PicName,
			PicContact:      device.PicContact,
		},
		DeviceData: model.SavedDeviceData{
			DeviceCode:     device.DeviceCode,
			Brand:          device.Brand,
			Capacity:       device.Capacity,
			Power:          device.Power,
			Level:          device.Level,
			Type:           device.Type,
			Sensor:         device.Sensor,
			IoTInstallDate: device.IoTInstallDate,
		},
	}

	return &resp, nil
}

func (c *DeviceService) Calibrated(params *model.CalibratedDeviceRequest) (*model.CalibratedDeviceResponse, error) {
	calibrated, err := c.DeviceCalibrationRepository.Get(&model.DeviceCalibration{DeviceID: params.DeviceID})
	if err != nil {
		return nil, err
	}

	if calibrated == nil {
		return nil, nil
	}

	test := model.WaterCalibrationTest{}
	err = json.Unmarshal([]byte(calibrated.Test), &test)
	if err != nil {
		return nil, err
	}

	resp := model.CalibratedDeviceResponse{
		DeviceID: calibrated.DeviceID,
		Shape:    calibrated.Shape,
		Diameter: calibrated.Diameter,
		Length:   calibrated.Length,
		Width:    calibrated.Width,
		Inflow:   test.Inflow,
		Outflow:  test.Outflow,
		Level:    test.Level,
	}

	return &resp, nil
}
