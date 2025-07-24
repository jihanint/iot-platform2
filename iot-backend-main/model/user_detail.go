package model

import "github.com/lib/pq"

type UserDetail struct {
	ID         int64         `gorm:"column:id;primary_key"`
	UserID     int64         `gorm:"column:user_id"`
	VillageIDs pq.Int64Array `gorm:"column:village_ids;type:_int[]"`

	User User `gorm:"foreignkey:UserID"`
}
