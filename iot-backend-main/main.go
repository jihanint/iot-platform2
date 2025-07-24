package main

import (
	"github.com/robfig/cron/v3"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/route"
)

func main() {
	config.DbInit()
	config.RedisInit()
	e := route.InitHttp()

	c := cron.New()
	route.InitCron(c)
	c.Start()

	e.Logger.Fatal(e.Start(":1323"))
}
