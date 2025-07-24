package service

import (
	"fmt"
	"log"
	"math"
	"time"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type WaterService struct {
	DeviceRepository            repository.DeviceRepository
	TimeRepository              repository.TimeRepository
	TelemetryRepository         repository.TelemetryRepository
	DeviceCalibrationRepository repository.DeviceCalibrationRepository
	VillageRepository           repository.VillageRepository
	AlertRepository             repository.AlertRepository
	AlertService                AlertService
}

func (c *WaterService) Telemetry(params []model.TelemetryRequest) error {
	var err error
	telemetryParam := make([]model.Telemetry, len(params))

	deviceLevelMap := make(map[int64]model.RealTimeAlertReq)
	for i, param := range params {
		err := c.validateTelemetryRequest(&param)
		if err != nil {
			return err
		}

		now := c.TimeRepository.TimeNow()
		deviceTime := time.Unix(param.Timestamp, 0)
		timeInterval := c.TimeRepository.FillTimeFields(deviceTime)

		telemetryParam[i] = model.Telemetry{
			DeviceID:       param.DeviceID,
			Production:     param.Inflow,
			Usage:          param.Outflow,
			Level:          param.Level,
			InVolume:       param.InVolume,
			OutVolume:      param.OutVolume,
			UnixDeviceTime: param.Timestamp,
			DeviceTime:     deviceTime,
			Hour:           timeInterval.Hour,
			Day:            timeInterval.Day,
			Week:           timeInterval.Week,
			Month:          timeInterval.Month,
			Year:           timeInterval.Year,
			CreatedAt:      now,
		}

		deviceLevelMap[param.DeviceID] = model.RealTimeAlertReq{
			TelemetryLevel: param.Level,
			DeviceLevel:    param.DeviceLevel,
			VillageID:      param.VillageID,
		}
	}

	go c.AlertService.ValidateAndSendRealTimeLevelAlert(deviceLevelMap)

	_, err = c.TelemetryRepository.Insert(telemetryParam)
	if err != nil {
		return err
	}

	return nil
}

func (c *WaterService) GetWaterUsageChart(params *model.GetWaterChartRequest) (*model.GetWaterChartResponse, error) {
	var (
		filterInterval  string
		viewDateTrunc   string
		filterDateTrunc string
		water           []model.FindWaterChartResult
		err             error
	)

	// TODO wrap into function
	switch params.Interval {
	case utils.FilterRangeMonth:
		filterInterval = fmt.Sprintf(utils.FilterByMonthFormat, params.Previous)
		viewDateTrunc = utils.FilterRangeDay
		filterDateTrunc = utils.FilterRangeMonth
	case utils.FilterRangeWeek:
		filterInterval = fmt.Sprintf(utils.FilterByWeekFormat, params.Previous)
		viewDateTrunc = utils.FilterRangeDay
		filterDateTrunc = utils.FilterRangeWeek
	case utils.FilterRangeDay:
		filterInterval = fmt.Sprintf(utils.FilterByDayFormat, params.Previous)
		viewDateTrunc = utils.FilterRangeHour
		filterDateTrunc = utils.FilterRangeDay
	}

	water, err = c.TelemetryRepository.FindForChartV3(&model.FindWaterChartParam{
		VillageIDs:      params.VillageIDs,
		ViewDateTrunc:   viewDateTrunc,
		FilterDateTrunc: filterDateTrunc,
		FilterInterval:  filterInterval,
		WaterType:       utils.WaterTypeUsage,
	})
	if err != nil {
		return nil, err
	}

	if len(water) == 0 {
		resp := model.GetWaterChartResponse{
			Series: nil,
			Date:   []time.Time{},
		}
		return &resp, nil
	}

	dataSeries, dateSeries := CalculateWaterFlowChart(water)

	resp := model.GetWaterChartResponse{
		Series: dataSeries,
		Date:   dateSeries,
	}

	return &resp, nil
}

func (c *WaterService) GetWaterProductionChart(params *model.GetWaterChartRequest) (*model.GetWaterChartResponse, error) {
	var (
		filterInterval  string
		viewDateTrunc   string
		filterDateTrunc string
		water           []model.FindWaterChartResult
		err             error
	)

	// there are 2 kind of filtering interval; by specific date range or by interval like day, week, month
	if params.Frequency != "" && params.StartTime != "" && params.EndTime != "" {
		water, err = c.TelemetryRepository.FindForChartV4(&model.FindWaterChartParam{
			VillageIDs:        params.VillageIDs,
			ViewDateTrunc:     params.Frequency,
			StartTime:         params.StartTime,
			EndTime:           params.EndTime,
			WaterType:         utils.WaterTypeProduction,
			ExcludeVillageIDs: params.ExcludeVillageIDs,
		})
		if err != nil {
			return nil, err
		}
	} else {
		switch params.Interval {
		case utils.FilterRangeMonth:
			filterInterval = fmt.Sprintf(utils.FilterByMonthFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeDay
			filterDateTrunc = utils.FilterRangeMonth
		case utils.FilterRangeWeek:
			filterInterval = fmt.Sprintf(utils.FilterByWeekFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeDay
			filterDateTrunc = utils.FilterRangeWeek
		case utils.FilterRangeDay:
			filterInterval = fmt.Sprintf(utils.FilterByDayFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeHour
			filterDateTrunc = utils.FilterRangeDay
		}

		water, err = c.TelemetryRepository.FindForChartV3(&model.FindWaterChartParam{
			VillageIDs:        params.VillageIDs,
			ViewDateTrunc:     viewDateTrunc,
			FilterDateTrunc:   filterDateTrunc,
			FilterInterval:    filterInterval,
			WaterType:         utils.WaterTypeProduction,
			ExcludeVillageIDs: params.ExcludeVillageIDs,
		})
		if err != nil {
			return nil, err
		}
	}

	if len(water) == 0 {
		resp := model.GetWaterChartResponse{
			Series: nil,
			Date:   []time.Time{},
		}
		return &resp, nil
	}

	dataSeries, dateSeries := CalculateWaterFlowChart(water)

	resp := model.GetWaterChartResponse{
		Series: dataSeries,
		Date:   dateSeries,
	}

	return &resp, nil
}

func (c *WaterService) GetWaterLevelChart(params *model.GetWaterChartRequest) (*model.GetWaterChartResponse, error) {
	var (
		filterInterval     string
		viewDateTrunc      string
		filterDateTrunc    string
		startTime, endTime string
		dataSeries         []model.WaterData
		water              []model.FindWaterChartResult
		err                error
	)

	// there are 2 kind of filtering interval; by specific date range or by interval like day, week, month
	if params.Frequency != "" && params.StartTime != "" && params.EndTime != "" {
		viewDateTrunc = params.Frequency
		startTime = params.StartTime
		endTime = params.EndTime
	} else {
		switch params.Interval {
		case utils.FilterRangeMonth:
			filterInterval = fmt.Sprintf(utils.FilterByMonthFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeDay
			filterDateTrunc = utils.FilterRangeMonth
		case utils.FilterRangeWeek:
			filterInterval = fmt.Sprintf(utils.FilterByWeekFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeDay
			filterDateTrunc = utils.FilterRangeWeek
		case utils.FilterRangeDay:
			filterInterval = fmt.Sprintf(utils.FilterByDayFormat, params.Previous)
			viewDateTrunc = utils.FilterRangeHour
			filterDateTrunc = utils.FilterRangeDay
		}
	}

	water, err = c.TelemetryRepository.FindForLevelChart(&model.FindWaterChartParam{
		VillageIDs:        params.VillageIDs,
		ViewDateTrunc:     viewDateTrunc,
		FilterDateTrunc:   filterDateTrunc,
		FilterInterval:    filterInterval,
		ExcludeVillageIDs: params.ExcludeVillageIDs,
		StartTime:         startTime,
		EndTime:           endTime,
	})
	if err != nil {
		return nil, err
	}

	timeMap := make(map[time.Time]bool)
	dateSeries := []time.Time{}
	for _, w := range water {
		if _, ok := timeMap[w.Interval]; ok {
			continue
		}

		dateSeries = append(dateSeries, w.Interval)
		timeMap[w.Interval] = true
	}

	regionMap := make(map[string]bool)
	regionArr := []string{}
	for _, w := range water {
		if _, ok := regionMap[w.Name]; ok {
			continue
		}

		regionArr = append(regionArr, w.Name)
		regionMap[w.Name] = true
	}

	for _, region := range regionArr {
		var data []float64
		for _, date := range dateSeries {
			isFilled := false
			for _, w := range water {
				if region == w.Name && date == w.Interval {
					if w.Value < 0 {
						w.Value = 0
					}
					data = append(data, w.Value)
					isFilled = true
					continue
				}
			}
			if !isFilled {
				data = append(data, 0)
			}
		}

		dataSeries = append(dataSeries, model.WaterData{
			Name: region,
			Data: data,
		})
	}

	resp := model.GetWaterChartResponse{
		Series: dataSeries,
		Date:   dateSeries,
	}

	return &resp, nil
}

func CalculateWaterFlowChart(water []model.FindWaterChartResult) ([]model.WaterData, []time.Time) {
	dateSeries := []time.Time{}
	timeMap := make(map[time.Time]bool)
	regionMap := make(map[string]bool)
	regionArr := []string{}
	aggregatedMap := make(map[string]map[time.Time]float64)

	for _, w := range water {
		if aggregatedMap[w.Name] == nil {
			aggregatedMap[w.Name] = make(map[time.Time]float64)
		}
		aggregatedMap[w.Name][w.Interval] = w.Value

		if _, ok := timeMap[w.Interval]; !ok {
			dateSeries = append(dateSeries, w.Interval)
			timeMap[w.Interval] = true
		}

		if _, ok := regionMap[w.Name]; !ok {
			regionArr = append(regionArr, w.Name)
			regionMap[w.Name] = true
		}
	}

	dataSeries := make([]model.WaterData, len(regionArr))
	for idxRegion, region := range regionArr {
		data := make([]float64, len(dateSeries))
		for idxDate, date := range dateSeries {
			value := aggregatedMap[region][date]

			if value < 0 {
				value = 0
			}

			data[idxDate] = value
		}

		dataSeries[idxRegion] = model.WaterData{
			Name: region,
			Data: data,
		}
	}

	return dataSeries, dateSeries
}

func (c *WaterService) TelemetryList(params *model.TelemetryListRequest) (*model.TelemetryListResponse, error) {
	telemetry, err := c.TelemetryRepository.FindTelemetryList(params)
	if err != nil {
		return nil, err
	}

	count, err := c.TelemetryRepository.CountTelemetryList(params)
	if err != nil {
		return nil, err
	}

	// TODO wrap into function
	if params.PageSize == 0 && params.PageNumber == 0 {
		params.PageSize = int64(len(telemetry))
		params.PageNumber = 1
	}

	respData := make([]model.TelemetryListResponseData, len(telemetry))
	for i, v := range telemetry {
		respData[i] = model.TelemetryListResponseData{
			ID:         v.ID,
			DeviceCode: v.DeviceCode,
			Inflow:     v.Inflow,
			Outflow:    v.Outflow,
			Level:      v.Level,
			Involume:   v.Involume,
			Outvolume:  v.Outvolume,
			CreatedAt:  v.CreatedAt,
			DeviceTime: v.DeviceTime,
		}
	}

	resp := model.TelemetryListResponse{
		Telemetry: respData,
		Meta: model.MetaPagination{ // TODO wrap into function
			PageNumber:   params.PageNumber,
			PageSize:     int64(len(telemetry)),
			TotalPages:   utils.GetTotalPage(count, params.PageSize),
			TotalRecords: count,
		},
	}

	return &resp, nil
}

func (c *WaterService) GetWaterList(params *model.GetWaterListRequest) (*model.GetWaterListResponse, error) {
	var (
		filterRange int16
		isDay       bool
		month       int16
		err         error
		meta        model.MetaPagination
	)
	now := c.TimeRepository.TimeNow()
	timeRange := c.TimeRepository.FillTimeFields(now)

	// TODO wrap into function
	switch params.Interval {
	case utils.FilterRangeMonth:
		filterRange = timeRange.Month
	case utils.FilterRangeWeek:
		filterRange = timeRange.Week
	case utils.FilterRangeDay:
		filterRange = timeRange.Day
		isDay = true
		month = timeRange.Month
	}

	getParam := model.FindWaterListByVillageParam{
		VillageID:     params.VillageID,
		Interval:      params.Interval,
		FilterRange:   filterRange,
		IsDay:         isDay,
		Month:         month,
		Year:          timeRange.Year,
		BasicGetParam: params.BasicGetParam,
	}

	switch params.WaterType {
	case utils.WaterTypeProduction:
		getParam.WaterType = utils.WaterTypeProduction
	case utils.WaterTypeUsage:
		getParam.WaterType = utils.WaterTypeUsage
	case utils.WaterTypeLevel:
		getParam.WaterType = utils.WaterTypeLevel
	}

	waterList, meta, err := c.DoGetWaterList(&getParam)
	if err != nil {
		return nil, err
	}

	resp := model.GetWaterListResponse{
		Water: waterList,
		Meta:  meta,
	}

	return &resp, nil
}

func (c *WaterService) DoGetWaterList(params *model.FindWaterListByVillageParam) ([]model.GetWaterListResponseData, model.MetaPagination, error) {
	wps, err := c.TelemetryRepository.FindByVillage(params)
	if err != nil {
		return []model.GetWaterListResponseData{}, model.MetaPagination{}, err
	}

	count, err := c.TelemetryRepository.CountByVillage(params)
	if err != nil {
		return []model.GetWaterListResponseData{}, model.MetaPagination{}, err
	}

	device, err := c.DeviceRepository.Get(&model.Device{
		VillageID: params.VillageID,
	})
	if err != nil {
		return []model.GetWaterListResponseData{}, model.MetaPagination{}, err
	}

	calibration, err := c.DeviceCalibrationRepository.Get(&model.DeviceCalibration{
		DeviceID: device.ID,
	})
	if err != nil {
		return []model.GetWaterListResponseData{}, model.MetaPagination{}, err
	}

	// TODO wrap into function
	if params.PageSize == 0 && params.PageNumber == 0 {
		params.PageSize = int64(len(wps))
		params.PageNumber = 1
	}

	meta := model.MetaPagination{ // TODO wrap into function
		PageNumber:   params.PageNumber,
		PageSize:     int64(len(wps)),
		TotalPages:   utils.GetTotalPage(count, params.PageSize),
		TotalRecords: count,
	}

	data := ConstructWaterListResult(model.ConstructWaterListResultParam{
		WaterList:   wps,
		WaterType:   params.WaterType,
		Device:      device,
		Calibration: calibration,
	})

	return data, meta, nil
}

func ConstructWaterListResult(params model.ConstructWaterListResultParam) []model.GetWaterListResponseData {
	waterList := make([]model.GetWaterListResponseData, len(params.WaterList))

	if params.WaterType != utils.WaterTypeLevel {
		for i := range params.WaterList {
			value := GetCalibratedWaterFlow(model.GetCalibratedWaterFlowParam{
				Values:      params.WaterList[i].ValueList,
				WaterType:   params.WaterType,
				Calibration: params.Calibration,
			})

			waterList[i] = model.GetWaterListResponseData{
				ID:        params.WaterList[i].ID,
				CreatedAt: params.WaterList[i].DeviceTime,
				Value:     value,
				Status:    GetWaterStatus(value),
			}
		}
	} else {
		for i := range params.WaterList {
			value := GetCalibratedWaterLevel(model.GetCalibratedWaterLevelParam{
				Value:       params.WaterList[i].Value,
				DeviceLevel: params.Device.Level,
				Calibration: params.Calibration,
			})

			waterList[i] = model.GetWaterListResponseData{
				ID:        params.WaterList[i].ID,
				CreatedAt: params.WaterList[i].DeviceTime,
				Value:     value,
				Status:    GetWaterStatus(value),
			}
		}
	}

	return waterList
}

func GetCalibratedWaterFlow(params model.GetCalibratedWaterFlowParam) float64 {
	var value float64

	if params.Calibration != nil {
		if params.WaterType == utils.WaterTypeProduction && len(params.Values) == len(params.Calibration.InflowCalculated) {
			for i, val := range params.Values {
				value += ConvertToMeter(val) * params.Calibration.InflowCalculated[i]
			}
		} else if params.WaterType == utils.WaterTypeUsage && len(params.Values) == len(params.Calibration.OutflowCalculated) {
			for i, val := range params.Values {
				value += ConvertToMeter(val) * params.Calibration.OutflowCalculated[i]
			}
		} else {
			for _, val := range params.Values {
				value += ConvertToMeter(val)
			}
		}

		return value
	}

	for _, val := range params.Values {
		value += ConvertToMeter(val)
	}

	return value
}

func GetCalibratedWaterLevel(params model.GetCalibratedWaterLevelParam) float64 {
	var value float64

	if params.Calibration != nil && params.Calibration.LevelCalculated != 0 {
		value += params.DeviceLevel - ConvertToMeter(params.Value) + params.Calibration.LevelCalculated
		return value
	}

	return params.DeviceLevel - ConvertToMeter(params.Value)
}

func GetWaterStatus(value float64) int16 {
	if value > 0 {
		return utils.DeviceNormal
	}

	return utils.DeviceInactive
}

func ConvertToMeter(value float64) float64 {
	return value / 1000
}

func (c *WaterService) SumWaterProduction() {
	waterProduction, err := c.TelemetryRepository.SumAllWaterFlowFromDB()
	if err != nil {
		log.Println("err - water.SumWaterProduction.TelemetryRepository.SumAllWaterFlowFromDB: ", err)
		return
	}

	groupedSum, err := c.TelemetryRepository.SumGroupedWaterFlowFromDB()
	if err != nil {
		log.Println("err - water.SumWaterProduction.TelemetryRepository.SumGroupedWaterFlowFromDB: ", err)
		return
	}

	err = c.TelemetryRepository.SaveSumWaterFlowToRedis(utils.SumAllWaterProductionRedisKey, waterProduction)
	if err != nil {
		log.Println("err - water.SumWaterProduction.TelemetryRepository.SaveSumWaterFlowToRedis: ", err)
		return
	}

	for _, sum := range groupedSum {
		key := fmt.Sprintf(utils.SumGroupedWaterProductionRedisKey, sum.VillageID)
		err = c.TelemetryRepository.SaveSumWaterFlowToRedis(key, sum.Total)
		if err != nil {
			log.Println("err - water.SumWaterProduction.TelemetryRepository.SaveSumWaterFlowToRedis: ", err)
			return
		}
	}
}

func (c *WaterService) GetSummary(params model.GetSumWaterFlowReq) (model.GetSumWaterFlowResp, error) {
	key := utils.SumAllWaterProductionRedisKey
	if params.VillageID > 0 {
		key = fmt.Sprintf(utils.SumGroupedWaterProductionRedisKey, params.VillageID)
	}

	sum, err := c.TelemetryRepository.SumWaterFlowFromRedis(key)
	if err != nil && err.Error() != utils.RedisNil {
		return model.GetSumWaterFlowResp{}, err
	}

	exclueVillageIDs := config.GetConfig().TestingVillageIDs
	population, err := c.VillageRepository.SumPopulation(exclueVillageIDs, params.VillageID)
	if err != nil {
		return model.GetSumWaterFlowResp{}, err
	}

	// TODO remove if not needed
	// villageServed, err := c.VillageRepository.Count(exclueVillageIDs)
	// if err != nil {
	// 	return model.GetSumWaterFlowResp{}, err
	// }

	res := model.GetSumWaterFlowResp{
		WaterProduction: sum,
		HoursSaved:      CalculateHoursSaved(sum),
		PeopleReach:     population,
		VillageServed:   10, // hardcoded for now
	}

	return res, nil
}

func CalculateHoursSaved(waterProduction float64) float64 {
	res := (utils.CubicMeterToLiter(waterProduction) / 10) * 2
	return res
}

func (c *WaterService) GetReport(param model.GetWaterReportReq) (model.GetWaterReportResp, error) {
	alertCount, alertTriggered, err := c.GetAlertReport(param)
	if err != nil {
		return model.GetWaterReportResp{}, err
	}

	waterProduction, waterProductionData, err := c.GetWaterProductionReport(param)
	if err != nil {
		return model.GetWaterReportResp{}, err
	}

	waterLevel, waterLevelData, device, deviceCalibration, err := c.GetWaterLevelReport(param)
	if err != nil {
		return model.GetWaterReportResp{}, err
	}

	waterUsage, err := c.GetWaterUsageReport(param, device, deviceCalibration, waterProductionData, waterLevelData)
	if err != nil {
		return model.GetWaterReportResp{}, err
	}

	resp := model.GetWaterReportResp{
		AlertCount:      alertCount,
		AlertTriggered:  alertTriggered,
		WaterProduction: waterProduction,
		WaterLevel:      waterLevel,
		WaterUsage:      waterUsage,
		WaterUsageImpact: model.WaterUsageImpactReport{
			MonthlyCost: model.WaterUsageImpactReportDiff{
				Before: 200000,
				After:  20000,
			},
			Time: model.WaterUsageImpactReportDiff{
				Before: 14400,
				After:  180,
			},
		},
	}

	return resp, nil
}

func (c *WaterService) GetAlertReport(param model.GetWaterReportReq) (int64, []string, error) {
	groupedAlert, err := c.AlertRepository.CountGroupedAlert(model.CountGroupedAlertParam{
		VillageID:      param.VillageID,
		StartCreatedAt: param.Start,
		EndCreatedAt:   param.End,
	})
	if err != nil {
		return 0, []string{}, err
	}

	var (
		alertCount     int64
		alertTriggered = make([]string, len(groupedAlert))
	)
	for i, alert := range groupedAlert {
		alertCount += alert.AlertCount
		alertTriggered[i] = utils.AlertTriggeredType[alert.Type][alert.Message]
	}

	return alertCount, alertTriggered, nil
}

func (c *WaterService) GetWaterProductionReport(param model.GetWaterReportReq) (model.WaterProductionReport, []model.FindWaterChartResult, error) {
	var (
		total   float64
		highest model.WaterReportProductionHighest
		series  []float64
		date    []time.Time
	)

	water, err := c.TelemetryRepository.FindForChartV4(&model.FindWaterChartParam{
		VillageIDs:    []int64{param.VillageID},
		ViewDateTrunc: utils.FilterRangeDay,
		StartTime:     param.StartTime,
		EndTime:       param.EndTime,
		WaterType:     utils.WaterTypeProduction,
	})
	if err != nil {
		return model.WaterProductionReport{}, []model.FindWaterChartResult{}, err
	}

	for _, w := range water {
		if w.Value < 0 {
			w.Value = 0
		}

		if highest.Value < w.Value {
			highest.Value = w.Value
			highest.Date = w.Interval
		}

		total += w.Value
		series = append(series, w.Value)
		date = append(date, w.Interval)
	}

	resp := model.WaterProductionReport{
		Total:   total,
		Highest: highest,
		Chart: model.WaterReportProductionChart{
			Series: series,
			Date:   date,
		},
	}

	return resp, water, nil
}

func (c *WaterService) GetWaterLevelReport(param model.GetWaterReportReq) (model.WaterLevelReport, []model.FindWaterChartResult, model.Device, model.DeviceCalibration, error) {
	var sum, highest float64

	water, err := c.TelemetryRepository.FindDailyLastLevel(model.FindWaterChartParam{
		VillageIDs: []int64{param.VillageID},
		StartTime:  param.StartTime,
		EndTime:    param.EndTime,
	})
	if err != nil {
		return model.WaterLevelReport{}, []model.FindWaterChartResult{}, model.Device{}, model.DeviceCalibration{}, err
	}

	device, err := c.DeviceRepository.Get(&model.Device{VillageID: param.VillageID})
	if err != nil {
		return model.WaterLevelReport{}, []model.FindWaterChartResult{}, model.Device{}, model.DeviceCalibration{}, err
	}

	deviceCalibration, err := c.DeviceCalibrationRepository.Get(&model.DeviceCalibration{DeviceID: device.ID})
	if err != nil {
		return model.WaterLevelReport{}, []model.FindWaterChartResult{}, model.Device{}, model.DeviceCalibration{}, err
	}

	for i := range water {
		if water[i].Value < 0 {
			water[i].Value = 0
		}

		water[i].Value = GetCalibratedWaterLevel(model.GetCalibratedWaterLevelParam{
			Value:       water[i].Value,
			DeviceLevel: device.Level,
			Calibration: deviceCalibration,
		})

		if water[i].Value > highest {
			highest = water[i].Value
		}
		sum += water[i].Value
	}

	average := sum / float64(len(water))
	resp := model.WaterLevelReport{
		Average: average,
		Highest: highest,
	}

	return resp, water, *device, *deviceCalibration, nil
}

func (c *WaterService) GetWaterUsageReport(param model.GetWaterReportReq, device model.Device, deviceCalibration model.DeviceCalibration, waterProduction, waterLevel []model.FindWaterChartResult) (model.WaterUsageReport, error) {
	wpLastPeriod, err := c.TelemetryRepository.FindForChartV4(&model.FindWaterChartParam{
		VillageIDs:    []int64{param.VillageID},
		ViewDateTrunc: utils.FilterRangeDay,
		StartTime:     param.Start.AddDate(0, -1, 0).Format(time.DateTime),
		EndTime:       param.End.AddDate(0, -1, 0).Format(time.DateTime),
		WaterType:     utils.WaterTypeProduction,
	})
	if err != nil {
		return model.WaterUsageReport{}, err
	}

	wlLastPeriod, err := c.TelemetryRepository.FindDailyLastLevel(model.FindWaterChartParam{
		VillageIDs: []int64{param.VillageID},
		StartTime:  param.Start.AddDate(0, -1, 0).Format(time.DateTime),
		EndTime:    param.End.AddDate(0, -1, 0).Format(time.DateTime),
	})
	if err != nil {
		return model.WaterUsageReport{}, err
	}

	for i := range wlLastPeriod {
		if wlLastPeriod[i].Value < 0 {
			wlLastPeriod[i].Value = 0
		}

		wlLastPeriod[i].Value = GetCalibratedWaterLevel(model.GetCalibratedWaterLevelParam{
			Value:       wlLastPeriod[i].Value,
			DeviceLevel: device.Level,
			Calibration: &deviceCalibration,
		})
	}

	var lastVolume, lastWaterUsage float64
	for i := range wlLastPeriod {
		var currentVolume float64
		if deviceCalibration.Shape == utils.ReservoirShapeBlock {
			currentVolume = deviceCalibration.Length * deviceCalibration.Width * wlLastPeriod[i].Value
		} else if deviceCalibration.Shape == utils.ReservoirShapeTube {
			r := deviceCalibration.Diameter / 2
			currentVolume = math.Phi * (r * r) * wlLastPeriod[i].Value
		}

		if i == 0 {
			lastVolume = currentVolume
			continue
		}

		lastWaterUsage += wpLastPeriod[i].Value - (currentVolume - lastVolume)
	}

	var waterUsage float64
	lastVolume = 0 // reset last volume
	for i := range waterLevel {
		var currentVolume float64
		if deviceCalibration.Shape == utils.ReservoirShapeBlock {
			currentVolume = deviceCalibration.Length * deviceCalibration.Width * waterLevel[i].Value
		} else if deviceCalibration.Shape == utils.ReservoirShapeTube {
			r := deviceCalibration.Diameter / 2
			currentVolume = math.Phi * (r * r) * waterLevel[i].Value
		}

		if i == 0 {
			lastVolume = currentVolume
			continue
		}

		waterUsage += waterProduction[i].Value - (currentVolume - lastVolume)
		lastVolume = currentVolume
	}

	res := model.WaterUsageReport{
		BeforeWaterProject: 333,
		PreviousPeriod:     lastWaterUsage,
		CurrentPeriod:      waterUsage,
	}

	return res, nil
}
