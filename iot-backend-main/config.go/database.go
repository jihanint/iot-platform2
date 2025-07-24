package config

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var db *gorm.DB
var err error

func DbInit() {
	config := GetConfig()
	connectString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		config.DbUsername, config.DbPassword, config.DbHost, config.DbPort, config.DbName)
	db, err = gorm.Open("postgres", connectString)
	if err != nil {
		panic("DB Connection Error")
	}

	db.SingularTable(true)
	// db.LogMode(true)
	// defer db.Close()
	// db.AutoMigrate(&model.Example{})

	fmt.Println("Connected to Database")
}

func DbManager() *gorm.DB {
	return db
}
