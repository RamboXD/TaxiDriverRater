// internal/repositories/user_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

type UserRepository interface {
	FindUserByEmail(ctx context.Context, email string) (*models.User, error)
	CreateUser(ctx context.Context, user *models.User) error
}

type userRepository struct{}

func NewUserRepository() UserRepository {
	return &userRepository{}
}

func (r *userRepository) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	log := logger.NewColoredLogger()
	var user models.User
	err := database.DB.QueryRow(ctx, `
        SELECT * FROM users WHERE email = $1
    `, email).Scan(&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID, &user.Email, &user.Password)
	if err != nil {
		log.Error("Failed to find user by email", zap.Error(err))
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) CreateUser(ctx context.Context, user *models.User) error {
	log := logger.NewColoredLogger()
	_, err := database.DB.Exec(ctx, `
        INSERT INTO users (super_admin_id, company_admin_id, worker_id, company_id, email, password) 
        VALUES ($1, $2, $3, $4, $5, $6)
    `, user.SuperAdminID, user.CompanyAdminID, user.WorkerID, user.CompanyID, user.Email, user.Password)
	if err != nil {
		log.Error("Failed to create user", zap.Error(err))
		return err
	}
	log.Info("Successfully created user", zap.String("email", user.Email))
	return nil
}
