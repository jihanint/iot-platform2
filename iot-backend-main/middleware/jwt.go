package middleware

import (
	"fmt"
	"net/http"
	"strings"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo"
	"github.com/iotplatform-tech/iot-backend/config.go"
	"github.com/iotplatform-tech/iot-backend/model"
	"github.com/iotplatform-tech/iot-backend/repository"
	"github.com/iotplatform-tech/iot-backend/utils"
)

func JWTVerify(role []string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			req := c.Request()
			header := req.Header
			auth := header.Get("Authorization")

			if len(auth) <= 0 {
				return echo.NewHTTPError(http.StatusUnauthorized, utils.EmptyAuth)
			}

			splitToken := strings.Split(auth, " ")
			if len(splitToken) < 2 {
				return echo.NewHTTPError(http.StatusUnauthorized, utils.EmptyAuth)
			}

			if splitToken[0] != "Bearer" {
				return echo.NewHTTPError(http.StatusUnauthorized, utils.InvalidAuth)
			}

			tokenStr := splitToken[1]
			token, err := jwt.ParseWithClaims(tokenStr, &model.JWTPayload{}, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf(utils.UnexpectedSigning, token.Header["alg"])
				}
				return []byte(config.GetConfig().JWTSecret), nil
			})

			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
			}

			if claims, ok := token.Claims.(*model.JWTPayload); token.Valid && ok {
				c.Set("token", token)
				c.Set("tokenStr", tokenStr)
				c.Set("id", claims.ID)
				c.Set("email", claims.Email)
				c.Set("roles", claims.Roles)
				c.Set("villageIDs", claims.VillageIDs)

				userParams := &model.User{}
				if claims.Email != "" {
					userParams.Email = &claims.Email
				} else {
					userParams.PhoneNumber = &claims.PhoneNumber
				}

				user, err := repository.UserRepository.GetLoginUser(&repository.UserRepositoryCtx{}, userParams)
				if err != nil {
					return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
				}

				if user == nil {
					return echo.NewHTTPError(http.StatusUnauthorized, utils.ErrUserTokenNotExist.Error())
				}

				if len(role) > 0 {
					isValidAccountType := false
					interfaceSliceRoles := utils.ConvertToSliceInterface(claims.Roles...)
					for _, val := range role {
						err = validation.Validate(val, validation.In(interfaceSliceRoles...))
						if err == nil {
							isValidAccountType = true
						}
					}

					if !isValidAccountType {
						return echo.NewHTTPError(http.StatusUnauthorized, `Unauthorize`)
					}
				}

				return next(c)
			} else if ve, ok := err.(*jwt.ValidationError); ok {
				var errorStr string
				if ve.Errors&jwt.ValidationErrorMalformed != 0 {
					errorStr = fmt.Sprintf("Invalid token format: %s", tokenStr)
				} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
					errorStr = "Token has been expired"
				} else {
					errorStr = fmt.Sprintf("Token Parsing Error: %s", err.Error())
				}
				return echo.NewHTTPError(http.StatusUnauthorized, errorStr)
			} else {
				return echo.NewHTTPError(http.StatusUnauthorized, "Unknown token error")
			}
		}
	}
}
