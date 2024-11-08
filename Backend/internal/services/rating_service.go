// internal/services/rating_service.go
package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

type RatingService struct {
	repo       repositories.RatingRepository
	driverRepo repositories.DriverRepository
}

func NewRatingService(repo repositories.RatingRepository, driverRepo repositories.DriverRepository) *RatingService {
	return &RatingService{repo: repo, driverRepo: driverRepo}
}

func (s *RatingService) RateDriver(ctx context.Context, req dto.RateDriverRequest, companyID string) error {
	driverExists, err := s.driverRepo.DriverExists(ctx, req.DriverID)
	if err != nil {
		return errors.New("failed to check driver existence")
	}
	if !driverExists {
		return errors.New("driver not found")
	}

	ratingExists, err := s.repo.CompanyHasRatedDriver(ctx, companyID, req.DriverID)
	if err != nil {
		return errors.New("failed to check if rating exists")
	}

	rating := &models.Rating{
		DriverID:    req.DriverID,
		CompanyID:   companyID,
		Rating:      req.Rating,
		Description: req.Description,
	}

	if ratingExists {
		err = s.repo.UpdateRating(ctx, rating)
	} else {
		err = s.repo.CreateRating(ctx, rating)
	}

	if err != nil {
		return fmt.Errorf("failed to save rating: %w", err)
	}

	return nil
}
