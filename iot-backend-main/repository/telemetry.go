package repository

import (
	"fmt"
	"strconv"

	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type TelemetryRepository interface {
	Insert(telemetry []model.Telemetry) ([]model.Telemetry, error)
	FindForChart(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error)     // TODO Delete - not used anymore
	FindForChartV2(params *model.FindWaterChartParam) ([]model.FindWaterChartV2Result, error) // TODO Delete - not used anymore
	FindForChartV3(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error)
	FindForChartV4(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error)
	FindForChartWithCity(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) // TODO Delete - not used anymore
	FindForChartWithCityV2(params *model.FindWaterChartParam) ([]model.FindWaterChartV2Result, error)
	FindForLevelChart(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error)
	FindForLevelChartWithCity(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error)
	FindTelemetryList(params *model.TelemetryListRequest) ([]model.TelemetryListResult, error)
	CountTelemetryList(params *model.TelemetryListRequest) (int64, error)
	FindByVillage(params *model.FindWaterListByVillageParam) ([]model.FindWaterListByVillageResult, error)
	CountByVillage(params *model.FindWaterListByVillageParam) (int64, error)
	FindAnomaly(params *model.FindAnomalyParam) ([]model.FindAnomalyResult, error)
	FindByDay(params *model.FindByDayParam) ([]model.FindByDayResult, error)
	FindFlowSumInDay(params *model.FindFlowSumInDayParam) ([]model.FindFlowSumInDayParamRes, error)
	FindFlowAvgInHour(params *model.FindFlowAvgInHourParam) ([]model.FindFlowAvgInHourRes, error)
	GetLatest(params *model.GetLatestTelemetryParam) ([]model.GetLatestTelemetryResult, error)
	SumAllWaterFlowFromDB() (float64, error)
	SumGroupedWaterFlowFromDB() ([]model.SumGroupedWaterFlowFromDBRes, error)
	FindDailyLastLevel(param model.FindWaterChartParam) ([]model.FindWaterChartResult, error)

	// redis
	SaveSumWaterFlowToRedis(key string, total float64) error
	SumWaterFlowFromRedis(key string) (float64, error)
}

type TelemetryRepositoryCtx struct{}

var findForChartV3Query = `
	SELECT name, date_trunc('%s', hour) AS interval, SUM(avg_value) AS value FROM
		(
			SELECT village.name AS name, date_trunc('hour', device_time) AS hour, AVG(element) AS avg_value
			FROM telemetry
			CROSS JOIN lateral UNNEST(%s) AS element
			JOIN device ON device.id = telemetry.device_id
			JOIN village ON village.id = device.village_id
			WHERE DATE_TRUNC('%s', device_time) = DATE_TRUNC('%s', CURRENT_DATE - INTERVAL '%s')
			%s
			%s
			GROUP BY name, date_trunc('hour', device_time)
		) AS subquery
	GROUP BY name, date_trunc('%s', hour) 
	ORDER BY date_trunc('%s', hour)
`

var findForChartV4Query = `
	SELECT name, date_trunc('%s', hour) AS interval, SUM(avg_value) AS value FROM
		(
			SELECT village.name AS name, date_trunc('hour', device_time) AS hour, AVG(element) AS avg_value
			FROM telemetry
			CROSS JOIN lateral UNNEST(%s) AS element
			JOIN device ON device.id = telemetry.device_id
			JOIN village ON village.id = device.village_id
			WHERE device_time BETWEEN '%s' AND '%s'
			%s
			%s
			GROUP BY name, date_trunc('hour', device_time)
		) AS subquery
	GROUP BY name, date_trunc('%s', hour) 
	ORDER BY date_trunc('%s', hour)
`

var findFlowSumInDay = `
	SELECT device_id, SUM(avg_value) AS value FROM
		(
			SELECT device_id, AVG(element) AS avg_value
			FROM telemetry
			CROSS JOIN lateral UNNEST(%s) AS element
			WHERE DATE_TRUNC('day', device_time) = DATE_TRUNC('day', CURRENT_DATE - INTERVAL '%d day')
			GROUP BY device_id, date_trunc('hour', device_time)
		) AS subquery
	GROUP BY device_id;
`

var findFlowAvgInDay = `
	SELECT device_id, AVG(element) AS value, date_trunc('hour', device_time) as hour
	FROM telemetry
	CROSS JOIN lateral UNNEST(%s) AS element
	WHERE DATE_TRUNC('day', device_time) = DATE_TRUNC('day', CURRENT_DATE - INTERVAL '%d day')
	GROUP BY device_id, date_trunc('hour', device_time)
	order by device_id asc, hour asc;
`

var sumAllWaterFlow = `
	SELECT SUM(avg_value) AS total from
	(
		SELECT AVG(element) AS avg_value from telemetry
		CROSS JOIN lateral UNNEST(production) AS element
		WHERE device_id not in (%s)
		AND device_time > '%s'
		AND element >= 0
		GROUP BY device_id, date_trunc('hour', device_time)
	) as subquery;
`

var sumGroupedWaterFlow = `
	select village_id, SUM(avg_value) AS total from
	(
		SELECT device.village_id, AVG(element) AS avg_value from telemetry
		CROSS JOIN lateral UNNEST(production) AS element
		JOIN device ON device.id = telemetry.device_id
		WHERE device_id not in (%s)
		AND device_time > '%s'
		AND element >= 0
		GROUP BY device.village_id, date_trunc('hour', device_time)
	) as subquery
	GROUP BY village_id;
`

func (c *TelemetryRepositoryCtx) Insert(telemetry []model.Telemetry) ([]model.Telemetry, error) {
	db := config.DbManager()
	query := "INSERT INTO telemetry (device_id, usage, production, level, in_volume, out_volume, unix_device_time, device_time, hour, day, week, month, year, created_at) VALUES "
	values := []interface{}{}

	for _, t := range telemetry {
		query += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),"
		values = append(values, t.DeviceID, t.Usage, t.Production, t.Level, t.InVolume, t.OutVolume, t.UnixDeviceTime, t.DeviceTime, t.Hour, t.Day, t.Week, t.Month, t.Year, t.CreatedAt)
	}

	query = query[:len(query)-1]

	err := db.Exec(query, values...).Error
	if err != nil {
		return nil, err
	}

	return telemetry, nil
}

func (c *TelemetryRepositoryCtx) FindForChart(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf("village.name as name, DATE_TRUNC('%s', telemetry.created_at) AS interval, SUM(subquery.value) AS value", params.ViewDateTrunc)).
		Joins(fmt.Sprintf("CROSS JOIN LATERAL unnest(%s) AS subquery(value)", params.WaterType)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("JOIN village ON village.id = device.village_id").
		Where("village.id IN (?)", params.VillageIDs).
		Where(fmt.Sprintf("telemetry.created_at BETWEEN current_timestamp - interval '%s' AND current_timestamp", params.FilterBy))

	db = db.Group("interval, village.name").
		Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForChartV2(params *model.FindWaterChartParam) ([]model.FindWaterChartV2Result, error) {
	db := config.DbManager()
	water := []model.FindWaterChartV2Result{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf("device.id AS device_id, village.name as name, DATE_TRUNC('%s', telemetry.device_time) AS interval, telemetry.%s AS value", params.ViewDateTrunc, params.WaterType)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("JOIN village ON village.id = device.village_id").
		Where(fmt.Sprintf("DATE_TRUNC('%s', telemetry.device_time) = DATE_TRUNC('%s', CURRENT_DATE - INTERVAL '%s')", params.FilterDateTrunc, params.FilterDateTrunc, params.FilterInterval))

	if len(params.VillageIDs) > 0 {
		db = db.Where("village.id IN (?)", params.VillageIDs)
	}

	db = db.Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForChartV3(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	var villageIDsQuery string
	if len(params.VillageIDs) > 0 {
		villageIDsQuery = fmt.Sprintf("AND village.id IN (%s)", ConstructVillageIDsString(params.VillageIDs))
	}

	var excludeVillageIDsQuery string
	if params.ExcludeVillageIDs != "" {
		excludeVillageIDsQuery = fmt.Sprintf("AND village.id NOT IN (%s)", params.ExcludeVillageIDs)
	}

	sql := fmt.Sprintf(findForChartV3Query,
		params.ViewDateTrunc,
		params.WaterType,
		params.FilterDateTrunc,
		params.FilterDateTrunc,
		params.FilterInterval,
		villageIDsQuery,
		excludeVillageIDsQuery,
		params.ViewDateTrunc,
		params.ViewDateTrunc,
	)

	err := db.Raw(sql).Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForChartV4(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	var villageIDsQuery string
	if len(params.VillageIDs) > 0 {
		villageIDsQuery = fmt.Sprintf("AND village.id IN (%s)", ConstructVillageIDsString(params.VillageIDs))
	}

	var excludeVillageIDsQuery string
	if params.ExcludeVillageIDs != "" {
		excludeVillageIDsQuery = fmt.Sprintf("AND village.id NOT IN (%s)", params.ExcludeVillageIDs)
	}

	sql := fmt.Sprintf(findForChartV4Query,
		params.ViewDateTrunc,
		params.WaterType,
		params.StartTime,
		params.EndTime,
		villageIDsQuery,
		excludeVillageIDsQuery,
		params.ViewDateTrunc,
		params.ViewDateTrunc,
	)

	err := db.Raw(sql).Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForChartWithCity(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf("city.name as name, DATE_TRUNC('%s', telemetry.created_at) AS interval, SUM(subquery.value) AS value", params.ViewDateTrunc)).
		Joins(fmt.Sprintf("CROSS JOIN LATERAL unnest(%s) AS subquery(value)", params.WaterType)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("JOIN village ON village.id = device.village_id").
		Joins("JOIN district ON district.id = village.district_id").
		Joins("JOIN city ON city.id = district.city_id")

	if params.CityID != 0 {
		db = db.Where("city.id = ?", params.CityID)
	}

	db = db.Where(fmt.Sprintf("telemetry.created_at BETWEEN current_timestamp - interval '%s' AND current_timestamp", params.FilterBy))

	db = db.Group("interval, city.name").
		Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForChartWithCityV2(params *model.FindWaterChartParam) ([]model.FindWaterChartV2Result, error) {
	db := config.DbManager()
	water := []model.FindWaterChartV2Result{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf("device.id AS device_id, city.name as name, DATE_TRUNC('%s', telemetry.created_at) AS interval, telemetry.%s AS value", params.ViewDateTrunc, params.WaterType)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("JOIN village ON village.id = device.village_id").
		Joins("JOIN district ON district.id = village.district_id").
		Joins("JOIN city ON city.id = district.city_id")

	if params.CityID != 0 {
		db = db.Where("city.id = ?", params.CityID)
	}

	db = db.Where(fmt.Sprintf("telemetry.created_at BETWEEN current_timestamp - interval '%s' AND current_timestamp", params.FilterBy))

	db = db.Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForLevelChart(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf(`
			village.name as name, 
			DATE_TRUNC('%s', telemetry.device_time) AS interval, 
			(case when device_calibration.id IS NULL then AVG(device.level - (telemetry.level / 1000))
				else AVG(device.level - (telemetry.level / 1000) + device_calibration.level_calculated)
			end) AS value`, // Because unit in telemetry.level is in mm, so it need to be converted to m first
			params.ViewDateTrunc)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("LEFT JOIN device_calibration on device_calibration.device_id = device.id").
		Joins("JOIN village ON village.id = device.village_id")

	if params.StartTime != "" && params.EndTime != "" {
		db = db.Where(fmt.Sprintf("telemetry.device_time BETWEEN '%s' AND '%s'", params.StartTime, params.EndTime))
	} else {
		db = db.Where(fmt.Sprintf("DATE_TRUNC('%s', telemetry.device_time) = DATE_TRUNC('%s', CURRENT_DATE - INTERVAL '%s')", params.FilterDateTrunc, params.FilterDateTrunc, params.FilterInterval))
	}

	if len(params.VillageIDs) > 0 {
		db = db.Where("village.id IN (?)", params.VillageIDs)
	}

	if params.ExcludeVillageIDs != "" {
		db = db.Where(fmt.Sprintf("village.id NOT IN (%s)", params.ExcludeVillageIDs))
	}

	db = db.Group("interval, village.name, device_calibration.id").
		Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindForLevelChartWithCity(params *model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	db = db.Table("telemetry").
		Select(fmt.Sprintf(`
			city.name as name, 
			DATE_TRUNC('%s', telemetry.created_at) AS interval, 
			(case when device_calibration.id IS NULL then AVG(device.level - (telemetry.level / 1000))
				else AVG(device.level - (telemetry.level / 1000) + device_calibration.level_calculated)
			end) AS value`, // Because unit in telemetry.level is in mm, so it need to be converted to m first
			params.ViewDateTrunc)).
		Joins("JOIN device ON device.id = telemetry.device_id ").
		Joins("LEFT JOIN device_calibration on device_calibration.device_id = device.id").
		Joins("JOIN village ON village.id = device.village_id").
		Joins("JOIN district ON district.id = village.district_id").
		Joins("JOIN city ON city.id = district.city_id")

	if params.CityID != 0 {
		db = db.Where("city.id = ?", params.CityID)
	}

	db = db.Where(fmt.Sprintf("telemetry.created_at BETWEEN current_timestamp - interval '%s' AND current_timestamp", params.FilterBy))

	db = db.Group("interval, city.name, device_calibration.id").
		Order("interval")

	err := db.Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindTelemetryList(params *model.TelemetryListRequest) ([]model.TelemetryListResult, error) {
	db := config.DbManager()
	telemetry := []model.TelemetryListResult{}

	db = db.Table("telemetry").
		Select(`telemetry.id AS id, 
			device.code AS device_code, 
			telemetry.production AS inflow, 
			telemetry.usage AS outflow, 
			telemetry.level AS level, 
			telemetry.in_volume AS involume, 
			telemetry.out_volume AS outvolume, 
			DATE_TRUNC('second', telemetry.created_at) AS created_at,
			DATE_TRUNC('second', telemetry.device_time) AS device_time
		`).
		Joins("JOIN device on device.id = telemetry.device_id")

	if params.Code != "" {
		db = db.Where("device.code ILIKE ?", "%"+params.Code+"%")
	}

	offset := (params.PageNumber - 1) * params.PageSize
	db = db.Offset(offset).Limit(params.PageSize).
		Order(fmt.Sprintf("%s %s", "telemetry.created_at", utils.OrderByDesc))

	err := db.Find(&telemetry).Error
	if err != nil {
		return nil, err
	}

	return telemetry, nil
}

func (c *TelemetryRepositoryCtx) CountTelemetryList(params *model.TelemetryListRequest) (int64, error) {
	var count int64
	db := config.DbManager()

	db = db.Table("telemetry").
		Joins("JOIN device on device.id = telemetry.device_id")

	if params.Code != "" {
		db = db.Where("device.code ILIKE ?", "%"+params.Code+"%")
	}

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (c *TelemetryRepositoryCtx) FindByVillage(params *model.FindWaterListByVillageParam) ([]model.FindWaterListByVillageResult, error) {
	db := config.DbManager()
	wl := []model.FindWaterListByVillageResult{}

	db = db.Table("telemetry")
	if params.WaterType != utils.WaterTypeLevel {
		db = db.Select(fmt.Sprintf("telemetry.id, DATE_TRUNC('second', telemetry.device_time) AS device_time, telemetry.%s AS value_list", params.WaterType))
	} else {
		db = db.Select("telemetry.id, DATE_TRUNC('second', telemetry.device_time) AS device_time, telemetry.level AS value")
	}

	db = db.Joins("JOIN device ON telemetry.device_id = device.id").
		Where(fmt.Sprintf("telemetry.device_time >= date_trunc('%s', current_timestamp)::date", params.Interval)).
		Where("telemetry.device_time <= current_timestamp").
		Where("device.village_id = ?", params.VillageID)

	if params.PageNumber != 0 && params.PageSize != 0 {
		offset := (params.PageNumber - 1) * params.PageSize
		db = db.Offset(offset).Limit(params.PageSize)
	}

	db = db.Order(fmt.Sprintf("%s %s", "telemetry.device_time", utils.OrderByDesc))

	err := db.Find(&wl).Error
	if err != nil {
		return nil, err
	}

	return wl, nil
}

func (c *TelemetryRepositoryCtx) CountByVillage(params *model.FindWaterListByVillageParam) (int64, error) {
	var count int64
	db := config.DbManager()

	db = db.Table("telemetry").
		Joins("JOIN device ON telemetry.device_id = device.id").
		Where(fmt.Sprintf("telemetry.device_time >= date_trunc('%s', current_timestamp)::date", params.Interval)).
		Where("telemetry.device_time <= current_timestamp").
		Where("device.village_id = ?", params.VillageID)

	err := db.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (c *TelemetryRepositoryCtx) FindAnomaly(params *model.FindAnomalyParam) ([]model.FindAnomalyResult, error) {
	db := config.DbManager()
	wp := []model.FindAnomalyResult{}

	db = db.Table("telemetry")

	if params.WaterType != utils.WaterTypeLevel {
		db = db.Select("telemetry.device_id, SUM(subquery.value) AS value").
			Joins(fmt.Sprintf("CROSS JOIN LATERAL unnest(%s) AS subquery(value)", params.WaterType))
	} else {
		db = db.Select(`
			telemetry.device_id, 
			(case when device_calibration.id IS NULL then (device.level - (telemetry.level / 1000))
				else (device.level - (telemetry.level / 1000) + device_calibration.level_calculated)
			end) AS value, 
			device.level AS level`).
			Joins("JOIN device ON telemetry.device_id = device.id").
			Joins("LEFT JOIN device_calibration on device_calibration.device_id = device.id")
	}

	if !params.IsYesterday {
		db = db.Where("telemetry.created_at IN (?)",
			db.Table("telemetry").
				Select("MAX(telemetry.created_at)").
				Where("telemetry.created_at >= date_trunc('day', current_timestamp)").
				Where("telemetry.created_at <= current_timestamp").
				Group("telemetry.device_id").
				SubQuery(),
		)
	} else {
		db = db.Where("telemetry.created_at IN (?)",
			db.Table("telemetry").
				Select("MAX(telemetry.created_at)").
				Where("telemetry.created_at >= date_trunc('day', current_timestamp) - interval '1 day'").
				Where("telemetry.created_at <= date_trunc('day', current_timestamp)").
				Group("telemetry.device_id").
				SubQuery(),
		)
	}

	if params.WaterType != utils.WaterTypeLevel {
		db = db.Group("telemetry.device_id")
	}

	err := db.Scan(&wp).Error
	if err != nil {
		return nil, err
	}

	return wp, nil
}

func (c *TelemetryRepositoryCtx) FindByDay(params *model.FindByDayParam) ([]model.FindByDayResult, error) {
	db := config.DbManager()
	water := []model.FindByDayResult{}

	db = db.Table("telemetry")

	db = db.Select(fmt.Sprintf("device_id, %s AS value", params.WaterType))
	db = db.Where("telemetry.created_at >= date_trunc('day', current_timestamp)").
		Where("telemetry.created_at <= current_timestamp")

	err := db.Find(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindFlowSumInDay(params *model.FindFlowSumInDayParam) ([]model.FindFlowSumInDayParamRes, error) {
	db := config.DbManager()
	water := []model.FindFlowSumInDayParamRes{}

	db = db.Table("telemetry")

	sql := fmt.Sprintf(findFlowSumInDay,
		params.WaterType,
		params.PastDay,
	)

	err := db.Raw(sql).Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) FindFlowAvgInHour(params *model.FindFlowAvgInHourParam) ([]model.FindFlowAvgInHourRes, error) {
	db := config.DbManager()
	water := []model.FindFlowAvgInHourRes{}

	db = db.Table("telemetry")

	sql := fmt.Sprintf(findFlowAvgInDay,
		params.WaterType,
		params.PastDay,
	)

	err := db.Raw(sql).Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func (c *TelemetryRepositoryCtx) GetLatest(params *model.GetLatestTelemetryParam) ([]model.GetLatestTelemetryResult, error) {
	db := config.DbManager()
	water := []model.GetLatestTelemetryResult{}

	db = db.Table("telemetry").
		Select("device_id, DATE_TRUNC('second', MAX(created_at)) AS latest_created_at")

	if len(params.DeviceIDs) > 0 {
		db = db.Where("device_id IN (?)", params.DeviceIDs)
	}

	db = db.Group("device_id")

	err := db.Find(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}

func ConstructVillageIDsString(villageIDs []int64) string {
	var villageIDsStr string
	for _, villageID := range villageIDs {
		if villageIDsStr == "" {
			villageIDStr := strconv.Itoa(int(villageID))
			villageIDsStr += villageIDStr
			continue
		}

		villageIDStr := strconv.Itoa(int(villageID))
		villageIDsStr += "," + villageIDStr
	}

	return villageIDsStr
}

func (c *TelemetryRepositoryCtx) SumAllWaterFlowFromDB() (float64, error) {
	type tempRes struct {
		Total float64 `gorm:"column:total"`
	}

	db := config.DbManager()
	cfg := config.GetConfig()
	testingDeviceIDs := cfg.TestingDeviceIDs
	startDate := cfg.ValidSumWPStartDate
	res := tempRes{}

	sql := fmt.Sprintf(sumAllWaterFlow,
		testingDeviceIDs,
		startDate,
	)

	err := db.Raw(sql).Scan(&res).Error
	if err != nil {
		return 0, err
	}

	return res.Total, nil
}

func (c *TelemetryRepositoryCtx) SumGroupedWaterFlowFromDB() ([]model.SumGroupedWaterFlowFromDBRes, error) {
	db := config.DbManager()
	cfg := config.GetConfig()
	testingDeviceIDs := cfg.TestingDeviceIDs
	startDate := cfg.ValidSumWPStartDate
	res := []model.SumGroupedWaterFlowFromDBRes{}

	sql := fmt.Sprintf(sumGroupedWaterFlow,
		testingDeviceIDs,
		startDate,
	)

	err := db.Raw(sql).Scan(&res).Error
	if err != nil {
		return []model.SumGroupedWaterFlowFromDBRes{}, err
	}

	return res, nil
}

func (c *TelemetryRepositoryCtx) SaveSumWaterFlowToRedis(key string, total float64) error {
	client := config.RedisClient()

	err := client.Set(key, total, utils.SaveSumWaterFlowToRedisTTL).Err()
	if err != nil {
		return err
	}

	return nil
}

func (c *TelemetryRepositoryCtx) SumWaterFlowFromRedis(key string) (float64, error) {
	client := config.RedisClient()

	sumStr, err := client.Get(key).Result()
	if err != nil {
		return 0, err
	}

	sum, err := strconv.ParseFloat(sumStr, 64)
	if err != nil {
		return 0, err
	}

	return sum, nil
}

func (c *TelemetryRepositoryCtx) FindDailyLastLevel(param model.FindWaterChartParam) ([]model.FindWaterChartResult, error) {
	db := config.DbManager()
	water := []model.FindWaterChartResult{}

	query := `
        WITH daily_last_level AS (
            SELECT 
                village.name as name,
                DATE(device_time) as interval,
                telemetry.level as value,
                ROW_NUMBER() OVER (
                    PARTITION BY DATE(device_time) 
                    ORDER BY device_time DESC
                ) as rn
            FROM telemetry
            JOIN device ON device.id = telemetry.device_id
            JOIN village ON village.id = device.village_id
            WHERE village.id IN (?)
            AND device_time > ? AND device_time < ?
        )
        SELECT 
            name,
            interval,
            value
        FROM daily_last_level
        WHERE rn = 1
        ORDER BY interval ASC`

	err := db.Raw(query, param.VillageIDs, param.StartTime, param.EndTime).Scan(&water).Error
	if err != nil {
		return nil, err
	}

	return water, nil
}
