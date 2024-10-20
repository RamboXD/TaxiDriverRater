// internal/repositories/rating_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

type RatingRepository interface {
	GetRatingsByDriverID(ctx context.Context, driverID string) ([]models.Rating, error)
	CreateRating(ctx context.Context, rating *models.Rating) error
}

type ratingRepository struct{}

func NewRatingRepository() RatingRepository {
	return &ratingRepository{}
}

func (r *ratingRepository) GetRatingsByDriverID(ctx context.Context, driverID string) ([]models.Rating, error) {
	log := logger.NewColoredLogger()
	var ratings []models.Rating
	rows, err := database.DB.Query(ctx, `SELECT * FROM ratings WHERE driver_id = $1`, driverID)
	if err != nil {
		log.Error("Failed to get ratings for driver", zap.Error(err))
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var rating models.Rating
		if err := rows.Scan(&rating.ID, &rating.DriverID, &rating.WorkerID, &rating.Rating, &rating.Description, &rating.CreatedAt, &rating.UpdatedAt); err != nil {
			log.Error("Failed to scan rating", zap.Error(err))
			return nil, err
		}
		ratings = append(ratings, rating)
	}

	log.Info("Successfully retrieved ratings for driver", zap.String("driver_id", driverID))
	return ratings, nil
}

func (r *ratingRepository) CreateRating(ctx context.Context, rating *models.Rating) error {
	log := logger.NewColoredLogger()
	_, err := database.DB.Exec(ctx, `
        INSERT INTO ratings (driver_id, worker_id, rating, description) VALUES ($1, $2, $3, $4)
    `, rating.DriverID, rating.WorkerID, rating.Rating, rating.Description)
	if err != nil {
		log.Error("Failed to create rating", zap.Error(err))
		return err
	}
	log.Info("Successfully created rating", zap.String("driver_id", rating.DriverID))
	return nil
}
