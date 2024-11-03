// internal/repositories/user_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

type UserRepository interface {
	FindUserByID(ctx context.Context, userID string) (*models.User, error)
	FindUserByEmail(ctx context.Context, email string) (*models.User, error)
	CreateUser(ctx context.Context, user *models.User) error
}

type userRepository struct{}

func NewUserRepository() UserRepository {
	return &userRepository{}
}

func (r *userRepository) CreateUser(ctx context.Context, user *models.User) error {
	_, err := database.DB.Exec(ctx, `
        INSERT INTO users (super_admin_id, company_admin_id, worker_id, company_id, iin, name, surname, patronymic, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, user.SuperAdminID, user.CompanyAdminID, user.WorkerID, user.CompanyID, user.IIN, user.Name, user.Surname, user.Patronymic, user.Email, user.Password)
	return err
}

func (r *userRepository) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(ctx, `SELECT * FROM users WHERE email = $1`, email).Scan(
		&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID, &user.IIN,
		&user.Name, &user.Surname, &user.Patronymic, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindUserByID(ctx context.Context, userID string) (*models.User, error) {
	var user models.User
	query := `
        SELECT super_admin_id, company_admin_id, worker_id, company_id, email, iin, name, surname, patronymic, created_at, updated_at 
        FROM users 
        WHERE super_admin_id = $1 OR company_admin_id = $1 OR worker_id = $1
    `
	err := database.DB.QueryRow(ctx, query, userID).Scan(
		&user.SuperAdminID, &user.CompanyAdminID, &user.WorkerID, &user.CompanyID,
		&user.Email, &user.IIN, &user.Name, &user.Surname, &user.Patronymic,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
