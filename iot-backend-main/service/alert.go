package service

import (
	"fmt"
	"log"
	"time"

	"github.com/lib/pq"
	cfg "github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type AlertService struct {
	TimeRepository              repository.TimeRepository
	DeviceRepository            repository.DeviceRepository
	AlertRepository             repository.AlertRepository
	UserDetailRepository        repository.UserDetailRepository
	ActivityHistoryRepository   repository.ActivityHistoryRepository
	DeviceCalibrationRepository repository.DeviceCalibrationRepository
	TelemetryRepository         repository.TelemetryRepository
}

func (c *AlertService) InflowAlert() {
	log.Println("Inflow alert cron is running")

	wpAvgYesterday, err := c.TelemetryRepository.FindFlowAvgInHour(&model.FindFlowAvgInHourParam{
		WaterType: utils.WaterTypeProduction,
		PastDay:   2,
	})
	if err != nil {
		log.Println("err - alert.InflowAlert.TelemetryRepository.FindFlowAvgInHour(Yesterday): ", err)
		return
	}

	wpAvgToday, err := c.TelemetryRepository.FindFlowAvgInHour(&model.FindFlowAvgInHourParam{
		WaterType: utils.WaterTypeProduction,
		PastDay:   1,
	})
	if err != nil {
		log.Println("err - alert.InflowAlert.TelemetryRepository.FindFlowAvgInHour(Today): ", err)
		return
	}

	wpToday := make(map[int64]float64)
	for _, wp := range wpAvgToday {
		wpValue := wp.Value
		if wpValue < 0 {
			wpValue = 0
		}

		wpToday[wp.DeviceID] += wpValue
	}

	wpYesterday := make(map[int64]float64)
	for _, wp := range wpAvgYesterday {
		wpValue := wp.Value
		if wpValue < 0 {
			wpValue = 0
		}

		wpYesterday[wp.DeviceID] += wpValue
	}

	var warningDeviceIDs []int64
	var criticalDeviceIDs []int64
	for deviceID, todayValue := range wpToday {
		if _, ok := wpYesterday[deviceID]; !ok {
			continue
		}

		yesterdayValue := wpYesterday[deviceID]
		if todayValue < yesterdayValue*0.2 {
			criticalDeviceIDs = append(criticalDeviceIDs, deviceID)
		} else if todayValue < yesterdayValue*0.4 {
			warningDeviceIDs = append(warningDeviceIDs, deviceID)
		}
	}

	if len(warningDeviceIDs) == 0 && len(criticalDeviceIDs) == 0 {
		return
	}

	warningDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: warningDeviceIDs})
	if err != nil {
		log.Println("err - alert.InflowAlert.DeviceRepository.FindToBeAlerted(Warning): ", err)
		return
	}

	criticalDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: criticalDeviceIDs})
	if err != nil {
		log.Println("err - alert.InflowAlert.DeviceRepository.FindToBeAlerted(Critical): ", err)
		return
	}

	alerts := make([]model.Alert, len(warningDevices)+len(criticalDevices))
	for i, device := range warningDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.InflowAlertType,
			Message:   utils.WarningInflow,
			Status:    utils.AlertCreated,
		}

		go func(device model.FindToBeAlertedResult) {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.InflowAlert.UserDetailRepository.Find(Warning): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.InflowAlertType],
						AlertMessage: utils.WarningInflow,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.InflowAlertType], utils.WarningInflow)
					utils.SendMail(templateEmail, sendRequest, subject)
				}
			}
		}(device)
	}

	for i, device := range criticalDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.InflowAlertType,
			Message:   utils.CriticalInflow,
			Status:    utils.AlertCreated,
		}

		go func(device model.FindToBeAlertedResult) {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.InflowAlert.UserDetailRepository.Find(Critical): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.InflowAlertType],
						AlertMessage: utils.CriticalInflow,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.InflowAlertType], utils.CriticalInflow)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send WA
				if user.User.PhoneNumber != nil {
					message := ConstructAlertWAMessage(model.ConstructAlertWAMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.InflowAlertType],
						AlertMessage: utils.CriticalInflow,
						VillageName:  device.VillageName,
						AlertAction:  utils.AlertActionMap[utils.InflowAlertType][utils.CriticalInflow],
					})

					err = utils.SendWhatsAppMessage(model.WaRequest{
						Destination: *user.User.PhoneNumber,
						Message:     message,
					})
					if err != nil {
						errMsg := fmt.Errorf("message: %s || error: %s", message, err.Error())
						utils.SendServerError(errMsg, "alert.InflowAlert.SendWhatsAppMessage")
						return
					}
				}
			}
		}(device)
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		log.Println("err - alert.InflowAlert.Insert: ", err)
		return
	}
}

func (c *AlertService) OutflowAlert() {
	// deactivate for now
	return

	log.Println("Outflow alert cron is running")

	wuAnomalies, err := c.TelemetryRepository.FindAnomaly(&model.FindAnomalyParam{
		WaterType: utils.WaterTypeUsage,
	})
	if err != nil {
		log.Println("err - alert.OutflowAlert.TelemetryRepository.FindAnomaly: ", err)
		return
	}

	wus, err := c.TelemetryRepository.FindByDay(&model.FindByDayParam{
		WaterType: utils.WaterTypeUsage,
	})
	if err != nil {
		log.Println("err - alert.OutflowAlert.TelemetryRepository.Find: ", err)
		return
	}

	sums := make(map[int64]float64)
	counts := make(map[int64]int)

	for _, wu := range wus {
		deviceID := wu.DeviceID
		sum := 0.0

		for _, value := range wu.Value {
			sum += value
		}

		sums[deviceID] += sum
		counts[deviceID]++
	}

	avgMap := make(map[int64]float64)

	for deviceID, sum := range sums {
		count := counts[deviceID]
		average := sum / float64(count)

		avgMap[deviceID] = average
	}

	var warningDeviceIDs []int64
	var criticalDeviceIDs []int64
	for _, wuAnomaly := range wuAnomalies {
		if wuAnomaly.Value > avgMap[wuAnomaly.DeviceID]*1.8 {
			criticalDeviceIDs = append(criticalDeviceIDs, wuAnomaly.DeviceID)
		} else if wuAnomaly.Value > avgMap[wuAnomaly.DeviceID]*1.2 {
			warningDeviceIDs = append(warningDeviceIDs, wuAnomaly.DeviceID)
		}
	}

	if len(warningDeviceIDs) == 0 && len(criticalDeviceIDs) == 0 {
		return
	}

	warningDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: warningDeviceIDs})
	if err != nil {
		log.Println("err - alert.OutflowAlert.DeviceRepository.FindToBeAlerted(Warning): ", err)
		return
	}

	criticalDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: criticalDeviceIDs})
	if err != nil {
		log.Println("err - alert.OutflowAlert.DeviceRepository.FindToBeAlerted(Critical): ", err)
		return
	}

	alerts := make([]model.Alert, len(warningDevices)+len(criticalDevices))
	for i, device := range warningDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.OutflowAlertType,
			Message:   utils.WarningOutflow,
			Status:    utils.AlertCreated,
		}

		go func() {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.OutflowAlert.UserDetailRepository.Find(Warning): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.OutflowAlertType],
						AlertMessage: utils.WarningOutflow,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.OutflowAlertType], utils.WarningOutflow)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send SMS
				if user.User.PhoneNumber != nil {
					message := ConstructAlertSMSMessage(model.ConstructAlertSMSMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.OutflowAlertType],
						AlertMessage: utils.WarningOutflow,
						VillageName:  device.VillageName,
					})

					utils.SendSMS(message, *user.User.PhoneNumber)
				}
			}
		}()
	}

	for i, device := range criticalDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.OutflowAlertType,
			Message:   utils.CriticalOutflow,
			Status:    utils.AlertCreated,
		}

		go func() {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.OutflowAlert.UserDetailRepository.Find(Critical): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.OutflowAlertType],
						AlertMessage: utils.CriticalOutflow,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.OutflowAlertType], utils.CriticalOutflow)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send SMS
				if user.User.PhoneNumber != nil {
					message := ConstructAlertSMSMessage(model.ConstructAlertSMSMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.OutflowAlertType],
						AlertMessage: utils.CriticalOutflow,
						VillageName:  device.VillageName,
					})

					utils.SendSMS(message, *user.User.PhoneNumber)
				}
			}
		}()
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		log.Println("err - alert.OutflowAlert.Insert: ", err)
		return
	}
}

// TODO OutflowAlertV2

func (c *AlertService) ReservoirLevelAlert() {
	// deactivate; already handled by realtime alert
	return

	log.Println("Reservoir level alert cron is running")

	wls, err := c.TelemetryRepository.FindAnomaly(&model.FindAnomalyParam{
		WaterType: utils.WaterTypeLevel,
	})
	if err != nil {
		log.Println("err - alert.ReservoirLevelAlert.TelemetryRepository.FindAnomaly: ", err)
		return
	}

	var almostFullDeviceIDs []int64
	var almostEmptyDeviceIDs []int64
	for _, wl := range wls {
		wlPercentage := wl.Value / wl.Level
		if wlPercentage > 0.9 {
			almostFullDeviceIDs = append(almostFullDeviceIDs, wl.DeviceID)
		} else if wlPercentage < 0.2 {
			almostEmptyDeviceIDs = append(almostEmptyDeviceIDs, wl.DeviceID)
		}
	}
	if len(almostFullDeviceIDs) == 0 && len(almostEmptyDeviceIDs) == 0 {
		return
	}

	almostFullDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: almostFullDeviceIDs})
	if err != nil {
		log.Println("err - alert.ReservoirLevelAlert.DeviceRepository.FindToBeAlerted(Full): ", err)
		return
	}

	almostEmptyDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: almostEmptyDeviceIDs})
	if err != nil {
		log.Println("err - alert.ReservoirLevelAlert.DeviceRepository.FindToBeAlerted(Empty): ", err)
		return
	}

	alerts := make([]model.Alert, len(almostFullDevices)+len(almostEmptyDevices))
	for i, device := range almostFullDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.WaterLevelAlertType,
			Message:   utils.AlmostFullWaterLevel,
			Status:    utils.AlertCreated,
		}

		go func() {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.ReservoirLevelAlert.UserDetailRepository.Find(Full): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.WaterLevelAlertType],
						AlertMessage: utils.AlmostFullWaterLevel,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.WaterLevelAlertType], utils.AlmostFullWaterLevel)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send SMS
				if user.User.PhoneNumber != nil {
					message := ConstructAlertSMSMessage(model.ConstructAlertSMSMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.WaterLevelAlertType],
						AlertMessage: utils.AlmostFullWaterLevel,
						VillageName:  device.VillageName,
					})

					utils.SendSMS(message, *user.User.PhoneNumber)
				}
			}
		}()
	}

	for i, device := range almostEmptyDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.WaterLevelAlertType,
			Message:   utils.AlmostEmptyWaterLevel,
			Status:    utils.AlertCreated,
		}

		go func() {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.ReservoirLevelAlert.UserDetailRepository.Find(Empty): ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.WaterLevelAlertType],
						AlertMessage: utils.AlmostEmptyWaterLevel,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.WaterLevelAlertType], utils.AlmostEmptyWaterLevel)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send SMS
				if user.User.PhoneNumber != nil {
					message := ConstructAlertSMSMessage(model.ConstructAlertSMSMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.WaterLevelAlertType],
						AlertMessage: utils.AlmostEmptyWaterLevel,
						VillageName:  device.VillageName,
					})

					utils.SendSMS(message, *user.User.PhoneNumber)
				}
			}
		}()
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		log.Println("err - alert.ReservoirLevelAlert.Insert: ", err)
		return
	}
}

func (c *AlertService) SensorMalfunctionAlert() {
	log.Println("Sensor malfunction alert cron is running")

	wpAvgs, err := c.TelemetryRepository.FindFlowAvgInHour(&model.FindFlowAvgInHourParam{
		WaterType: utils.WaterTypeProduction,
		PastDay:   1,
	})
	if err != nil {
		log.Println("err - alert.SensorMalfunctionAlert.TelemetryRepository.FindFlowSumInDay: ", err)
		return
	}

	wp := make(map[int64]float64)
	for _, wpAvg := range wpAvgs {
		wpValue := wpAvg.Value
		if wpValue < 0 {
			wpValue = 0
		}

		wp[wpAvg.DeviceID] += wpValue
	}

	// TODO check water level sensor

	malfunctionDeviceIDs := []int64{}
	for deviceID, value := range wp {
		if value > 0 {
			continue
		}

		malfunctionDeviceIDs = append(malfunctionDeviceIDs, deviceID)
	}

	if len(malfunctionDeviceIDs) == 0 {
		return
	}

	malfunctionDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{
		DeviceIDs:    malfunctionDeviceIDs,
		ExcludeTypes: []string{utils.DeviceTypeGravity},
	})
	if err != nil {
		log.Println("err - alert.SensorMalfunctionAlert.DeviceRepository.FindToBeAlerted: ", err)
		return
	}

	alerts := make([]model.Alert, len(malfunctionDevices))
	for i, device := range malfunctionDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.SensorMalfunctionAlertType,
			Message:   utils.SensorMalfuntion,
			Status:    utils.AlertCreated,
		}

		go func(device model.FindToBeAlertedResult) {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.SensorMalfunctionAlert.UserDetailRepository.Find: ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.SensorMalfunctionAlertType],
						AlertMessage: utils.SensorMalfuntion,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.SensorMalfunctionAlertType], utils.SensorMalfuntion)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send WA
				if user.User.PhoneNumber != nil {
					message := ConstructAlertWAMessage(model.ConstructAlertWAMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.SensorMalfunctionAlertType],
						AlertMessage: utils.SensorMalfuntion,
						VillageName:  device.VillageName,
						AlertAction:  utils.AlertActionMap[utils.SensorMalfunctionAlertType][utils.SensorMalfuntion],
					})

					err = utils.SendWhatsAppMessage(model.WaRequest{
						Destination: *user.User.PhoneNumber,
						Message:     message,
					})
					if err != nil {
						errMsg := fmt.Errorf("message: %s || error: %s", message, err.Error())
						utils.SendServerError(errMsg, "alert.SensorMalfunctionAlert.SendWhatsAppMessage")
						return
					}
				}
			}
		}(device)
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		log.Println("err - alert.SensorMalfunctionAlert.Insert: ", err)
		return
	}
}

func (c *AlertService) DeviceStatusCheck() {
	log.Println("Device status check cron is running")

	water, err := c.TelemetryRepository.GetLatest(&model.GetLatestTelemetryParam{})
	if err != nil {
		log.Println("err - alert.DeviceStatusCheck.TelemetryRepository.GetLatest: ", err)
		return
	}

	now := c.TimeRepository.TimeNow()
	inactiveDeviceIDs := []int64{}
	updateDeviceStatusParam := make([]model.Device, 0)

	for _, w := range water {
		duration := now.Sub(w.LatestCreatedAt)
		oneDay := 24 * time.Hour
		if duration >= oneDay {
			inactiveDeviceIDs = append(inactiveDeviceIDs, w.DeviceID)
			updateDeviceStatusParam = append(updateDeviceStatusParam, model.Device{
				ID:     w.DeviceID,
				Status: utils.DeviceInactive,
			})
			continue
		}

		updateDeviceStatusParam = append(updateDeviceStatusParam, model.Device{
			ID:     w.DeviceID,
			Status: utils.DeviceNormal,
		})
	}

	defer func() {
		err = c.DeviceRepository.BulkUpdateStatus(updateDeviceStatusParam)
		if err != nil {
			log.Println("err - alert.DeviceStatusCheck.DeviceRepository.BulkUpdateStatus: ", err)
			return
		}
	}()

	if len(inactiveDeviceIDs) == 0 {
		return
	}

	inactiveDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: inactiveDeviceIDs})
	if err != nil {
		log.Println("err - alert.DeviceStatusCheck.DeviceRepository.FindToBeAlerted: ", err)
		return
	}

	alerts := make([]model.Alert, 0)
	for _, device := range inactiveDevices {
		if device.Status == utils.DeviceInactive {
			continue
		}

		alerts = append(alerts, model.Alert{
			VillageID: device.VillageID,
			Type:      utils.ChangedDeviceStatusAlertType,
			Message:   utils.InactiveDevice,
			Status:    utils.AlertCreated,
		})

		go func(device model.FindToBeAlertedResult) {
			userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
			if err != nil {
				log.Println("err - alert.DeviceStatusCheck.UserDetailRepository.Find: ", err)
				return
			}

			for _, user := range userDetails {
				// Send Email
				if user.User.Email != nil {
					templateEmail := "./template/alert.html"
					sendRequest := model.SendMail{
						SendTo:       *user.User.Email,
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.ChangedDeviceStatusAlertType],
						AlertMessage: utils.InactiveDevice,
						VillageName:  device.VillageName,
						GcsBucket:    cfg.GetConfig().GcsBucketUrl,
					}
					subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.ChangedDeviceStatusAlertType], utils.InactiveDevice)
					utils.SendMail(templateEmail, sendRequest, subject)
				}

				// Send WA
				if user.User.PhoneNumber != nil {
					message := ConstructAlertWAMessage(model.ConstructAlertWAMessage{
						UserFullname: user.User.FirstName,
						AlertType:    utils.AlertType[utils.ChangedDeviceStatusAlertType],
						AlertMessage: utils.InactiveDevice,
						VillageName:  device.VillageName,
						AlertAction:  utils.AlertActionMap[utils.ChangedDeviceStatusAlertType][utils.InactiveDevice],
					})

					err = utils.SendWhatsAppMessage(model.WaRequest{
						Destination: *user.User.PhoneNumber,
						Message:     message,
					})
					if err != nil {
						errMsg := fmt.Errorf("message: %s || error: %s", message, err.Error())
						utils.SendServerError(errMsg, "alert.DeviceStatusCheck.SendWhatsAppMessage")
						return
					}
				}
			}
		}(device)
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		log.Println("err - alert.DeviceStatusCheck.Insert: ", err)
		return
	}
}

func (c *AlertService) ValidateAndSendRealTimeLevelAlert(deviceLevelMap map[int64]model.RealTimeAlertReq) {
	deviceIDs := make([]int64, 0)
	for deviceID := range deviceLevelMap {
		deviceIDs = append(deviceIDs, deviceID)
	}

	devices, err := c.DeviceCalibrationRepository.FindByDeviceIDs(deviceIDs)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&deviceLevelMap), err.Error())
		utils.SendServerError(errMsg, "ValidateAndSendRealTimeAlert.DeviceCalibrationRepository.FindByDeviceIDs")
		return
	}

	deviceCalibratedLevelMap := make(map[int64]float64) // key: device ID, value: level
	for _, device := range devices {
		deviceCalibratedLevelMap[device.DeviceID] = device.LevelCalculated
	}

	warningDeviceIDs := make([]int64, 0)
	for deviceID, val := range deviceLevelMap {
		levelCalibration, ok := deviceCalibratedLevelMap[deviceID]
		if !ok {
			continue
		}

		var levelCalibrated float64
		adjustedTelemetry := val.TelemetryLevel / 1000
		if levelCalibration == 0 {
			levelCalibrated = adjustedTelemetry
		} else {
			levelCalibrated = val.DeviceLevel - adjustedTelemetry + levelCalibration
		}

		if levelCalibrated/val.DeviceLevel > utils.DeviceLevelAlertTreshold {
			alert, err := c.AlertRepository.Get(&model.GetAlertParam{
				VillageID: val.VillageID,
				Type:      utils.WaterLevelAlertType,
				Message:   utils.AlmostFullWaterLevel,
				IsToday:   true,
			})
			if err != nil {
				errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&deviceLevelMap), err.Error())
				utils.SendServerError(errMsg, "ValidateAndSendRealTimeAlert.AlertRepository.Get")
				return
			}

			if alert != nil {
				continue
			}

			warningDeviceIDs = append(warningDeviceIDs, deviceID)
		}
	}

	if len(warningDeviceIDs) == 0 {
		return
	}

	warningDevices, err := c.DeviceRepository.FindToBeAlerted(&model.FindToBeAlertedParam{DeviceIDs: warningDeviceIDs})
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&deviceLevelMap), err.Error())
		utils.SendServerError(errMsg, "ValidateAndSendRealTimeAlert.DeviceRepository.FindToBeAlerted")
		return
	}

	alerts := make([]model.Alert, len(warningDevices))
	for i, device := range warningDevices {
		alerts[i] = model.Alert{
			VillageID: device.VillageID,
			Type:      utils.WaterLevelAlertType,
			Message:   utils.AlmostFullWaterLevel,
			Status:    utils.AlertCreated,
		}

		userDetails, err := c.UserDetailRepository.Find(&model.UserDetail{VillageIDs: pq.Int64Array{device.VillageID}})
		if err != nil {
			errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&deviceLevelMap), err.Error())
			utils.SendServerError(errMsg, "ValidateAndSendRealTimeAlert.UserDetailRepository.Find")
			return
		}

		for _, user := range userDetails {
			// Send Email
			if user.User.Email != nil {
				templateEmail := "./template/alert.html"
				sendRequest := model.SendMail{
					SendTo:       *user.User.Email,
					UserFullname: user.User.FirstName,
					AlertType:    utils.AlertType[utils.WaterLevelAlertType],
					AlertMessage: utils.AlmostFullWaterLevel,
					VillageName:  device.VillageName,
					GcsBucket:    cfg.GetConfig().GcsBucketUrl,
				}
				subject := fmt.Sprintf("%s %s!", utils.AlertType[utils.WaterLevelAlertType], utils.AlmostFullWaterLevel)
				utils.SendMail(templateEmail, sendRequest, subject)
			}
		}
	}

	if len(alerts) == 0 {
		return
	}

	_, err = c.AlertRepository.Insert(alerts)
	if err != nil {
		errMsg := fmt.Errorf("req: %s || error: %s", utils.PrettyStruct(&deviceLevelMap), err.Error())
		utils.SendServerError(errMsg, "ValidateAndSendRealTimeAlert.AlertRepository.Insert")
		return
	}
}

func (c *AlertService) AlertList(params *model.AlertListRequest) (*model.AlertListResponse, error) {
	alerts, err := c.AlertRepository.Find(&model.AlertListParam{
		VillageIDs:        params.VillageIDs,
		CityID:            params.CityID,
		PageNumber:        params.PageNumber,
		PageSize:          params.PageSize,
		ExcludeVillageIDs: params.ExcludeVillageIDs,
		StartCreatedAt:    params.StartCreatedAt,
		EndCreatedAt:      params.EndCreatedAt,
	})
	if err != nil {
		return nil, err
	}

	count, err := c.AlertRepository.Count(&model.AlertListParam{
		VillageIDs:        params.VillageIDs,
		CityID:            params.CityID,
		ExcludeVillageIDs: params.ExcludeVillageIDs,
		StartCreatedAt:    params.StartCreatedAt,
		EndCreatedAt:      params.EndCreatedAt,
	})
	if err != nil {
		return nil, err
	}

	respData := make([]model.AlertListResponseData, len(alerts))
	for i, alert := range alerts {
		respData[i] = model.AlertListResponseData{
			ID:          alert.ID,
			VillageName: alert.VillageName,
			CityName:    alert.CityName,
			AlertType:   utils.AlertType[alert.Type],
			Message:     alert.Message,
			Comment:     alert.Comment,
			Action:      utils.AlertActionMap[alert.Type][alert.Message],
			CreatedAt:   alert.CreatedAt,
		}
	}

	if params.PageSize == 0 && params.PageNumber == 0 {
		params.PageSize = int64(len(respData))
		params.PageNumber = 1
	}

	resp := model.AlertListResponse{
		Data: respData,
		Meta: model.MetaPagination{
			PageNumber:   params.PageNumber,
			PageSize:     int64(len(respData)),
			TotalPages:   utils.GetTotalPage(count, params.PageSize),
			TotalRecords: count,
		},
	}

	return &resp, nil
}

func (c *AlertService) AlertReview(params *model.AlertChangeRequest) error {
	err := c.validateAlertChange(params)
	if err != nil {
		return err
	}

	_, err = c.AlertRepository.Update(&model.Alert{
		ID:      params.AlertID,
		Comment: params.Comment,
	})
	if err != nil {
		return err
	}

	_, err = c.ActivityHistoryRepository.Insert(&model.ActivityHistory{
		Type:      utils.ActivityHistoryTypeAlert,
		RefID:     params.AlertID,
		Message:   fmt.Sprintf(utils.AlertActivityHistory, utils.AlertType[params.Type], params.VillageName, utils.AlertStatusReviewed),
		VillageID: params.VillageID,
	})
	if err != nil {
		return err
	}

	return nil
}

func (c *AlertService) AlertDone(params *model.AlertChangeRequest) error {
	err := c.validateAlertChange(params)
	if err != nil {
		return err
	}

	// TODO add handle device status change to active for "ChangedDeviceStatusAlertType" type

	_, err = c.AlertRepository.Update(&model.Alert{
		ID:     params.AlertID,
		Status: utils.AlertDone,
	})
	if err != nil {
		return err
	}

	_, err = c.ActivityHistoryRepository.Insert(&model.ActivityHistory{
		Type:      utils.ActivityHistoryTypeAlert,
		RefID:     params.AlertID,
		Message:   fmt.Sprintf(utils.AlertActivityHistory, utils.AlertType[params.Type], params.VillageName, utils.AlertStatusDone),
		VillageID: params.VillageID,
	})
	if err != nil {
		return err
	}

	return nil
}

func ConstructAlertSMSMessage(param model.ConstructAlertSMSMessage) string {
	return fmt.Sprintf("Halo %s. Peringatan! %s di Desa %s %s", param.UserFullname, param.AlertType, param.VillageName, param.AlertMessage)
}

func ConstructAlertWAMessage(param model.ConstructAlertWAMessage) string {
	return fmt.Sprintf("Halo %s. Peringatan! %s di Desa %s %s. %s", param.UserFullname, param.AlertType, param.VillageName, param.AlertMessage, param.AlertAction)
}
