// internal/repositories/auth_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

type AuthRepository interface {
	FindUserByEmail(ctx context.Context, email string) (*models.User, error)
	UserExistsByRoleID(ctx context.Context, userID string, role string) (bool, error)
}

type authRepository struct{}

func NewAuthRepository() AuthRepository {
	return &authRepository{}
}

func (r *authRepository) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(ctx, `
        SELECT * FROM users WHERE email = $1
    `, email).Scan(&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID, &user.Email, &user.Password)
	return &user, err
}

// UserExistsByRoleID checks if the user exists in the database by their role-specific ID
func (r *authRepository) UserExistsByRoleID(ctx context.Context, userID string, role string) (bool, error) {
	var query string

	switch role {
	case "super_admin":
		query = `SELECT COUNT(1) FROM users WHERE super_admin_id = $1`
	case "company_admin":
		query = `SELECT COUNT(1) FROM users WHERE company_admin_id = $1`
	case "worker":
		query = `SELECT COUNT(1) FROM users WHERE worker_id = $1`
	default:
		return false, nil
	}

	var count int
	err := database.DB.QueryRow(ctx, query, userID).Scan(&count)
	if err != nil {
		return false, err
	}

	return count == 1, nil
}
