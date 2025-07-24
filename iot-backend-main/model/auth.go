package model

import "github.com/golang-jwt/jwt"

type JWTPayload struct {
	ID          int64    `json:"id"`
	Email       string   `json:"email,omitempty"`
	PhoneNumber string   `json:"phone_number,omitempty"`
	FirstName   string   `json:"first_name,omitempty"`
	LastName    string   `json:"last_name,omitempty"`
	Status      string   `json:"status,omitempty"`
	Roles       []string `json:"roles,omitempty"`
	VillageIDs  []int64  `json:"village_ids,omitempty"`
	jwt.StandardClaims
}
