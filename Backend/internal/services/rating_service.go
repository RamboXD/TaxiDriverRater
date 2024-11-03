// internal/services/rating_service.go
package services

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

type RatingService struct {
	repo repositories.RatingRepository
}

func NewRatingService(repo repositories.RatingRepository) *RatingService {
	return &RatingService{repo: repo}
}

func (s *RatingService) GetRatingsByDriverID(ctx context.Context, driverID string) ([]models.Rating, error) {
	return s.repo.GetRatingsByDriverID(ctx, driverID)
}

func (s *RatingService) CreateRating(ctx context.Context, rating *models.Rating) error {
	return s.repo.CreateRating(ctx, rating)
}
