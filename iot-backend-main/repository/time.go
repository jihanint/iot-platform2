package repository

import (
	"time"

	"github.com/iotplatform-tech/iot-backend/model"
)

type TimeRepository interface {
	TimeNow() time.Time
	FillTimeFields(createdAt time.Time) model.TimeInterval
	TruncateMonthYearTime(time time.Time) time.Time
}

type TimeRepositoryCtx struct{}

func (c *TimeRepositoryCtx) TimeNow() time.Time {
	return time.Now()
}

func (c *TimeRepositoryCtx) FillTimeFields(createdAt time.Time) model.TimeInterval {
	createdYear, createdMonth, createdDay := createdAt.Date()
	createdHour, _, _ := createdAt.Clock()

	return model.TimeInterval{
		Hour:  int16(createdHour),
		Day:   int16(createdDay),
		Week:  int16(createdYearISOWeek(createdYear, createdMonth, createdDay)),
		Month: int16(createdMonth),
		Year:  int16(createdYear),
	}
}

func (c *TimeRepositoryCtx) TruncateMonthYearTime(originalTime time.Time) time.Time {
	truncatedTime := originalTime.Truncate(24 * time.Hour)

	// Retrieve the month and year from the truncated time
	month := truncatedTime.Month()
	year := truncatedTime.Year()

	// Create a new time value with only the month and year
	monthYearTime := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
	return monthYearTime
}

// createdYearISOWeek returns the ISO week number given the year, month, and day.
func createdYearISOWeek(year int, month time.Month, day int) int {
	t := time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
	_, week := t.ISOWeek()
	return week
}
