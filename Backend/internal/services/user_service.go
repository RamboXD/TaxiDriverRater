package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgconn"
	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/errors"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo    repositories.UserRepository
	companyRepo repositories.CompanyRepository
}

func NewUserService(userRepo repositories.UserRepository, companyRepo repositories.CompanyRepository) *UserService {
	return &UserService{userRepo: userRepo, companyRepo: companyRepo}
}

// CreateUserWithRole creates a new user with the specified role
func (s *UserService) CreateUserWithRole(ctx context.Context, req dto.UserRegisterRequest, role string) error {
	existingUser, _ := s.userRepo.FindUserByEmail(ctx, req.Email)
	if existingUser != nil {
		return errors.UserAlreadyExistsError()
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.GenericInternalServerError()
	}

	user := models.User{
		Email:      req.Email,
		Password:   string(hashedPassword),
		CompanyID:  req.CompanyID,
		IIN:        req.IIN,
		Name:       req.Name,
		Surname:    req.Surname,
		Patronymic: req.Patronymic,
	}

	id := uuid.NewString() // Generate a new UUID as a string
	switch role {
	case "super_admin":
		user.SuperAdminID = &id
	case "company_admin":
		user.CompanyAdminID = &id
	case "worker":
		user.WorkerID = &id
	default:
		return errors.MissingFieldsError() // Return if the role is invalid
	}

	exists, _ := s.companyRepo.CompanyExists(ctx, req.CompanyID)
	if !exists {
		return errors.CompanyNotFoundError()
	}

	err = s.userRepo.CreateUser(ctx, &user)
	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" { // PostgreSQL unique_violation error code
			if pgErr.ConstraintName == "users_email_key" || pgErr.ConstraintName == "users_iin_key" {
				return errors.UserAlreadyExistsError()
			}
		}
		return errors.GenericInternalServerError()
	}

	return nil
}

func (s *UserService) GetUserWithCompanyData(ctx context.Context, userID, role string) (*models.UserWithCompany, error) {
	user, err := s.userRepo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, errors.UserNotFoundError()
	}

	company, err := s.companyRepo.FindCompanyByID(ctx, user.CompanyID)
	if err != nil {
		return nil, errors.CompanyNotFoundError()
	}

	userPublic := models.UserPublic{
		SuperAdminID:   user.SuperAdminID,
		CompanyAdminID: user.CompanyAdminID,
		WorkerID:       user.WorkerID,
		CompanyID:      user.CompanyID,
		IIN:            user.IIN,
		Name:           user.Name,
		Surname:        user.Surname,
		Patronymic:     user.Patronymic,
		CreatedAt:      user.CreatedAt.String(),
		UpdatedAt:      user.UpdatedAt.String(),
	}

	userWithCompany := &models.UserWithCompany{
		User:    userPublic,
		Company: *company,
		Role:    role,
	}

	return userWithCompany, nil
}
