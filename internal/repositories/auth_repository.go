// internal/repositories/auth_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

type AuthRepository interface {
	FindUserByEmail(ctx context.Context, email string) (*models.User, error)
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
