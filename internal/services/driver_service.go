// internal/services/driver_service.go
package services

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

type DriverService struct {
	repo repositories.DriverRepository
}

func NewDriverService(repo repositories.DriverRepository) *DriverService {
	return &DriverService{repo: repo}
}

func (s *DriverService) GetDriverByID(ctx context.Context, id string) (*models.Driver, error) {
	return s.repo.GetDriverByID(ctx, id)
}
