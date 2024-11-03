// internal/services/driver_service.go
package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

var ErrDriverExists = errors.New("driver already exists")

type DriverService struct {
	driverRepo repositories.DriverRepository
	ratingRepo repositories.RatingRepository
}

func NewDriverService(driverRepo repositories.DriverRepository, ratingRepo repositories.RatingRepository) *DriverService {
	return &DriverService{
		driverRepo: driverRepo,
		ratingRepo: ratingRepo,
	}
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

	err := s.driverRepo.CreateDriver(ctx, driver)
	if errors.Is(err, repositories.ErrDriverAlreadyExists) {
		return ErrDriverExists
	}
	return err
}

func (s *DriverService) GetDriverInfoWithRatings(ctx context.Context, driverID string) (map[string]interface{}, error) {
	driver, err := s.driverRepo.FindDriverByID(ctx, driverID)
	if err != nil {
		return nil, errors.New("driver not found")
	}

	ratings, err := s.ratingRepo.GetRatingsWithCompanyData(ctx, driverID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve ratings %w", err)
	}

	var totalRating int
	for _, ratingWithCompany := range ratings {
		totalRating += ratingWithCompany.Rating.Rating
	}
	var averageRating float64
	if len(ratings) > 0 {
		averageRating = float64(totalRating) / float64(len(ratings))
	}

	driverInfo := map[string]interface{}{
		"driver":         driver,
		"ratings":        ratings,
		"average_rating": averageRating,
	}

	return driverInfo, nil
}

func (s *DriverService) ListDrivers(ctx context.Context) ([]models.Driver, error) {
	return s.driverRepo.ListDrivers(ctx)
}
