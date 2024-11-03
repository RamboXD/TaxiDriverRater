// internal/services/driver_service.go
package services

import (
	"context"
	"errors"

	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

var ErrDriverExists = errors.New("driver already exists")

type DriverService struct {
	repo repositories.DriverRepository
}

func NewDriverService(repo repositories.DriverRepository) *DriverService {
	return &DriverService{repo: repo}
}

func (s *DriverService) RegisterDriver(ctx context.Context, req dto.DriverRegisterRequest) error {
	driver := &models.Driver{
		IIN:             req.IIN,
		Name:            req.Name,
		Surname:         req.Surname,
		Patronymic:      req.Patronymic,
		Category:        req.Category,
		DtpDate:         req.DtpDate,
		Penalty:         req.Penalty,
		InsuranceData:   req.InsuranceData,
		InsuranceNumber: req.InsuranceNumber,
		Address:         req.Address,
		PhoneNumber:     req.PhoneNumber,
	}

	err := s.repo.CreateDriver(ctx, driver)
	if errors.Is(err, repositories.ErrDriverAlreadyExists) {
		return ErrDriverExists
	}
	return err
}
