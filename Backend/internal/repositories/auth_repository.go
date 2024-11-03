package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

type AuthRepository interface {
	FindUserByID(ctx context.Context, userID string) (*models.User, error)
}

type authRepository struct{}

func NewAuthRepository() AuthRepository {
	return &authRepository{}
}

func (r *authRepository) FindUserByID(ctx context.Context, userID string) (*models.User, error) {
	var user models.User
	query := `
		SELECT super_admin_id, company_admin_id, worker_id, company_id, iin, name, surname, patronymic, email, password, created_at, updated_at
		FROM users 
		WHERE super_admin_id = $1 OR company_admin_id = $1 OR worker_id = $1`
	err := database.DB.QueryRow(ctx, query, userID).Scan(
		&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID, &user.IIN,
		&user.Name, &user.Surname, &user.Patronymic, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
