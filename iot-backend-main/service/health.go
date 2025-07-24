package service

import "github.com/iotplatform-tech/iot-backend/repository"

type HealthService struct {
	HealthRepository repository.HealthRepository
}

func (c *HealthService) Check() (string, error) {
	health, err := c.HealthRepository.GetHealth()
	if err != nil {
		return "", err
	}

	return health, nil
}
