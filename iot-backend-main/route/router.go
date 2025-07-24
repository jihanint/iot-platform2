package route

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/robfig/cron/v3"
)

func InitHttp() *echo.Echo {
	app := App()

	e := echo.New()
	e.Use(middleware.CORS())
	V1Routes(e.Group("/v1"), app)

	return e
}

func InitCron(c *cron.Cron) {
	cronApp := CronApp()

	CronRoutes(c, cronApp)
}
