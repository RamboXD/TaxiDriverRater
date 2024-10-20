// internal/services/user_service.go
package services

import (
	"context"
	"errors"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"github.com/ramboxd/taxidriverrater/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// CreateUserWithRole registers a user with a specific role and additional fields
func (s *UserService) CreateUserWithRole(ctx context.Context, email, password, role, companyID, iin, name, surname string, patronymic *string) error {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	var user models.User
	user.Email = email
	user.Password = string(hashedPassword)
	user.CompanyID = companyID
	user.IIN = iin
	user.Name = name
	user.Surname = surname
	user.Patronymic = patronymic

	// Set role ID based on the input role
	switch role {
	case "super_admin":
		user.SuperAdminID = jwt.GenerateUUID() // Assign pointer to UUID
	case "company_admin":
		user.CompanyAdminID = jwt.GenerateUUID() // Assign pointer to UUID
	case "worker":
		user.WorkerID = jwt.GenerateUUID() // Assign pointer to UUID
	default:
		return errors.New("invalid role")
	}

	// Call repository to save the user
	return s.repo.CreateUser(ctx, &user)
}

func (s *UserService) RegisterSuperAdmin(ctx context.Context, email, password, iin, name, surname string, patronymic *string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		SuperAdminID: jwt.GenerateUUID(), // Assume generateUUID() is defined
		IIN:          iin,
		Name:         name,
		Surname:      surname,
		Patronymic:   patronymic,
		Email:        email,
		Password:     string(hashedPassword),
		CompanyID:    "", // No company associated for super admin
	}

	return s.repo.CreateUser(ctx, user)
}
