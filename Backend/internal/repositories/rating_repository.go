// internal/repositories/rating_repository.go
package repositories

import (
	"context"
	"errors"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

var ErrCompanyAlreadyRated = errors.New("company has already rated this driver")

type RatingRepository interface {
	CompanyHasRatedDriver(ctx context.Context, companyID, driverID string) (bool, error)
	CreateRating(ctx context.Context, rating *models.Rating) error
	UpdateRating(ctx context.Context, rating *models.Rating) error
	GetRatingsWithCompanyData(ctx context.Context, driverID string) ([]models.RatingWithCompany, error)
}

type ratingRepository struct{}

func NewRatingRepository() RatingRepository {
	return &ratingRepository{}
}

func (r *ratingRepository) CompanyHasRatedDriver(ctx context.Context, companyID, driverID string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM ratings WHERE company_id = $1 AND driver_id = $2)`
	err := database.DB.QueryRow(ctx, query, companyID, driverID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *ratingRepository) CreateRating(ctx context.Context, rating *models.Rating) error {
	_, err := database.DB.Exec(ctx, `
		INSERT INTO ratings (driver_id, company_id, rating, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`, rating.DriverID, rating.CompanyID, rating.Rating, rating.Description)
	return err
}

func (r *ratingRepository) UpdateRating(ctx context.Context, rating *models.Rating) error {
	_, err := database.DB.Exec(ctx, `
		UPDATE ratings
		SET rating = $1, description = $2, updated_at = CURRENT_TIMESTAMP
		WHERE driver_id = $3 AND company_id = $4
	`, rating.Rating, rating.Description, rating.DriverID, rating.CompanyID)
	return err
}

func (r *ratingRepository) GetRatingsWithCompanyData(ctx context.Context, driverID string) ([]models.RatingWithCompany, error) {
	ratingsWithCompany := make([]models.RatingWithCompany, 0)

	query := `
		SELECT 
			r.id,
			r.driver_id,
			r.company_id,
			r.rating,
			r.description,
			r.created_at,
			r.updated_at,
			c.name as company_name,
			c.address as company_address
		FROM 
			ratings r
		JOIN 
			company c ON r.company_id = c.id
		WHERE 
			r.driver_id = $1
	`
	rows, err := database.DB.Query(ctx, query, driverID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var ratingWithCompany models.RatingWithCompany
		if err := rows.Scan(
			&ratingWithCompany.Rating.ID,
			&ratingWithCompany.Rating.DriverID,
			&ratingWithCompany.Rating.CompanyID,
			&ratingWithCompany.Rating.Rating,
			&ratingWithCompany.Rating.Description,
			&ratingWithCompany.Rating.CreatedAt,
			&ratingWithCompany.Rating.UpdatedAt,
			&ratingWithCompany.Company.Name,
			&ratingWithCompany.Company.Address,
		); err != nil {
			return nil, err
		}
		ratingsWithCompany = append(ratingsWithCompany, ratingWithCompany)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ratingsWithCompany, nil
}
