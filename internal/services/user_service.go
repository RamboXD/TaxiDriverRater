// internal/services/user_service.go
package services

import (
	"context"
	"errors"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	return s.repo.FindUserByEmail(ctx, email)
}

func (s *UserService) CreateUserWithRole(ctx context.Context, email, password, role string) error {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	var user models.User
	user.Email = email
	user.Password = string(hashedPassword)

	// Set role ID based on the input role
	switch role {
	case "super_admin":
		user.SuperAdminID = generateUUID() // Generate unique UUID for the role
	case "company_admin":
		user.CompanyAdminID = generateUUID()
	case "worker":
		user.WorkerID = generateUUID()
	default:
		return errors.New("invalid role")
	}

	// Call repository to save the user
	return s.repo.CreateUser(ctx, &user)
}
