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

// CreateUser inserts a new user into the database
func (r *userRepository) CreateUser(ctx context.Context, user *models.User) error {
	_, err := database.DB.Exec(ctx, `
        INSERT INTO users (super_admin_id, company_admin_id, worker_id, company_id, iin, name, surname, patronymic, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, user.SuperAdminID, user.CompanyAdminID, user.WorkerID, user.CompanyID, user.IIN, user.Name, user.Surname, user.Patronymic, user.Email, user.Password)
	return err
}

// FindUserByEmail finds a user by email address
func (r *userRepository) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	log := logger.NewColoredLogger()
	var user models.User
	err := database.DB.QueryRow(ctx, `
        SELECT super_admin_id, company_admin_id, worker_id, company_id, iin, name, surname, patronymic, email, password, created_at, updated_at 
        FROM users WHERE email = $1
    `, email).Scan(&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID, &user.IIN, &user.Name, &user.Surname, &user.Patronymic, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		log.Error("Failed to find user by email", zap.Error(err))
		return nil, err
	}
	return &user, nil
}
