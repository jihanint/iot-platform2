package model

type UserRole struct {
	ID     int64 `gorm:"column:id;primary_key"`
	UserID int64 `gorm:"column:user_id"`
	RoleID int64 `gorm:"column:role_id"`

	User User `gorm:"foreignkey:UserID"`
	Role Role `gorm:"foreignkey:RoleID"`
}
