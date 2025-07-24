package service

import (
	"math"
	"time"

	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

type ActivityService struct {
	ActivityHistoryRepository repository.ActivityHistoryRepository
	TimeRepository            repository.TimeRepository
}

func (c *ActivityService) ActivityHistories(params *model.ActivityHistoriesRequest) (*model.ActivityHistoriesResponse, error) {
	var diffPercentage float64
	now := c.TimeRepository.TimeNow()
	timeRange := c.TimeRepository.FillTimeFields(now)

	switch params.Interval {
	case utils.FilterRangeMonth:
		params.FilterRange = timeRange.Month
	case utils.FilterRangeWeek:
		params.FilterRange = timeRange.Week
	case utils.FilterRangeDay:
		params.FilterRange = timeRange.Day
	}

	activityHistoryData, err := c.ActivityHistoryRepository.Find(params)
	if err != nil {
		return nil, err
	}

	totalThisPeriod, err := c.ActivityHistoryRepository.Count(params)
	if err != nil {
		return nil, err
	}

	ahDataToResp := make([]model.ActivityHistoriesData, len(activityHistoryData))
	for i, ahData := range activityHistoryData {
		ahDataToResp[i] = model.ActivityHistoriesData{
			ID:        ahData.ID,
			Message:   ahData.Message,
			Type:      utils.ActivityHistoryType[ahData.Type],
			CreatedAt: ahData.CreatedAt,
		}
	}

	params.FilterRange -= 1
	totalLastPeriod, err := c.ActivityHistoryRepository.Count(params)
	if err != nil {
		return nil, err
	}

	if totalLastPeriod != 0 {
		diffPercentage = math.Round((float64(totalThisPeriod-totalLastPeriod) / float64(totalLastPeriod)) * 100)
	} else {
		diffPercentage = 0
	}

	if params.PageSize == 0 && params.PageNumber == 0 {
		params.PageSize = int64(len(activityHistoryData))
		params.PageNumber = 1
	}

	resp := model.ActivityHistoriesResponse{
		Data: model.ActivityHistoriesResponseData{
			Difference: diffPercentage,
			Data:       ahDataToResp,
		},
		Meta: model.MetaPagination{
			PageNumber:   params.PageNumber,
			PageSize:     int64(len(activityHistoryData)),
			TotalPages:   utils.GetTotalPage(totalThisPeriod, params.PageSize),
			TotalRecords: totalThisPeriod,
		},
	}

	return &resp, nil
}

func (c *ActivityService) ActivityHistoriesGrouped(params *model.ActivityHistoriesGroupedRequest) ([]model.ActivityHistoriesGroupedResponse, error) {
	ahData, err := c.ActivityHistoryRepository.Find(&model.ActivityHistoriesRequest{
		VillageIDs: []int64{params.VillageID},
	})
	if err != nil {
		return nil, err
	}

	return c.ConstructActivityHistoriesIntoGrouped(ahData), nil
}

func (c *ActivityService) ConstructActivityHistoriesIntoGrouped(ahData []model.ActivityHistory) []model.ActivityHistoriesGroupedResponse {
	ahMap := c.ConstructActivityHistoriesIntoMap(ahData)
	return ConstructAHMapIntoGrouped(ahMap)
}

func (c *ActivityService) ConstructActivityHistoriesIntoMap(ahData []model.ActivityHistory) map[time.Time][]model.ActivityHistoriesData {
	ahMap := make(map[time.Time][]model.ActivityHistoriesData, 0)

	for _, ah := range ahData {
		monthYear := c.TimeRepository.TruncateMonthYearTime(ah.CreatedAt)
		ahMap[monthYear] = append(ahMap[monthYear], model.ActivityHistoriesData{
			ID:        ah.ID,
			Message:   ah.Message,
			Type:      utils.ActivityHistoryType[ah.Type],
			CreatedAt: ah.CreatedAt,
		})
	}

	return ahMap
}

func ConstructAHMapIntoGrouped(ahMap map[time.Time][]model.ActivityHistoriesData) []model.ActivityHistoriesGroupedResponse {
	groupedData := make([]model.ActivityHistoriesGroupedResponse, 0)
	for monthYear, activities := range ahMap {
		groupedData = append(groupedData, model.ActivityHistoriesGroupedResponse{
			Date:       monthYear,
			Activities: activities,
		})
	}

	return groupedData
}
