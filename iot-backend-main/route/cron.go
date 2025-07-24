package route

import (
	"github.com/robfig/cron/v3"
	"github.com/iotplatform-tech/iot-backend/config.go"
)

func CronRoutes(c *cron.Cron, s CronModels) {
	c.AddFunc(config.GetConfig().AlertCron, s.Alert.InflowAlert)
	c.AddFunc(config.GetConfig().AlertCron, s.Alert.OutflowAlert)
	c.AddFunc(config.GetConfig().AlertCron, s.Alert.ReservoirLevelAlert)
	c.AddFunc(config.GetConfig().AlertCron, s.Alert.SensorMalfunctionAlert)
	c.AddFunc(config.GetConfig().AlertCron, s.Alert.DeviceStatusCheck)

	c.AddFunc(config.GetConfig().SumWPCron, s.Water.SumWaterProduction)
}
