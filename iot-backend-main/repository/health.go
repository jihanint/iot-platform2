package repository

type HealthRepository interface {
	GetHealth() (string, error)
}

type HealthRepositoryCtx struct{}

func (c *HealthRepositoryCtx) GetHealth() (string, error) {
	return "The service is running", nil
}
