package utils

import (
	"github.com/golang-jwt/jwt"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
)

func GenerateJWT(claims model.JWTPayload) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(config.GetConfig().JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
