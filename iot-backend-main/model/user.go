package model

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

type User struct {
	ID          int64     `gorm:"column:id;primary_key"`
	Email       *string   `gorm:"column:email;unique"`
	PhoneNumber *string   `gorm:"column:phone_number;unique"`
	Password    string    `gorm:"column:password"`
	FirstName   string    `gorm:"column:first_name"`
	LastName    string    `gorm:"column:last_name"`
	PhotoURL    string    `gorm:"column:photo_url"`
	Status      int16     `gorm:"column:status;default:0"`
	CreatedAt   time.Time `gorm:"column:created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at"`
}

func (User) TableName() string {
	return "users"
}

func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	if u.Email != nil && *u.Email == "" {
		u.Email = nil
	}

	if u.PhoneNumber != nil && *u.PhoneNumber == "" {
		u.PhoneNumber = nil
	}

	return
}

type SignUpRequest struct {
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Fullname    string `json:"fullname"`
	Password    string `json:"password"`
	Type        string `json:"type"`
	Debug       bool   `json:"debug"`
}

type SignUpResponse struct {
	Email       string `json:"email,omitempty"`
	PhoneNumber string `json:"phone_number,omitempty"`
	Fullname    string `json:"fullname"`
	VerifyUrl   string `json:"verify_url,omitempty"`
}

type VerifyRequest struct {
	Token       string `json:"token"`
	ParsedToken *jwt.Token
	UserID      int64
}

type AssignmentManagerRequest struct {
	VillageIDs []int64 `json:"village_ids"`
	User       *User
}

type LogInRequest struct {
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Password    string `json:"password"`
	Type        string `json:"type"`
}

type LogInResponse struct {
	ID          int64     `json:"id"`
	Email       *string   `json:"email"`
	PhoneNumber *string   `json:"phone_number"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	PhotoURL    string    `json:"photo_url"`
	Status      string    `json:"status"`
	Roles       []string  `json:"roles"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Token       string    `json:"token"`
}

type UpdatePasswordRequest struct {
	UserID      int64
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
	ParsedToken *jwt.Token
	UserID      int64
}

type UnassignListResp struct {
	UserID      int64                   `json:"user_id"`
	UserName    string                  `json:"user_name"`
	Email       *string                 `json:"email"`
	PhoneNumber *string                 `json:"phone_number"`
	Role        string                  `json:"role"`
	Villages    []AssignmentListVillage `json:"villages"`
}

type AssignmentListResp struct {
	UserID      int64                   `json:"user_id"`
	UserName    string                  `json:"user_name"`
	Email       *string                 `json:"email"`
	PhoneNumber *string                 `json:"phone_number"`
	Role        string                  `json:"role"`
	Villages    []AssignmentListVillage `json:"villages"`
}

type AssignmentListVillage struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type FindAssignmentParam struct {
	ID          int64         `gorm:"column:id"`
	FirstName   string        `gorm:"column:first_name"`
	Email       *string       `gorm:"column:email"`
	PhoneNumber *string       `gorm:"column:phone_number"`
	Role        string        `gorm:"column:role"`
	VillageIDs  pq.Int64Array `gorm:"column:village_ids;type:_int[]"`
}

type AssignmentReq struct {
	UserID      int64   `json:"user_id"`
	UserName    string  `json:"user_name"`
	PhoneNumber string  `json:"phone_number"`
	Role        string  `json:"role"`
	VillageIDs  []int64 `json:"village_ids"`
}

type GetUserDetailReq struct {
	UserID int64 `query:"user_id"`
}

type GetUserDetailResp struct {
	UserID      int64                   `json:"user_id"`
	UserName    string                  `json:"user_name"`
	Email       *string                 `json:"email"`
	PhoneNumber *string                 `json:"phone_number"`
	Role        string                  `json:"role"`
	Villages    []AssignmentListVillage `json:"villages"`
}

type RegisterAssignReq struct {
	Email       string  `json:"email"`
	PhoneNumber string  `json:"phone_number"`
	Fullname    string  `json:"fullname"`
	Password    string  `json:"password"`
	VillageIDs  []int64 `json:"village_ids"`
}
