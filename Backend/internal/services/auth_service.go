// internal/services/auth_service.go
package services

import (
	"context"
	"time"

	"github.com/ramboxd/taxidriverrater/internal/errors"

	"github.com/dgrijalva/jwt-go"
	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  repositories.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo repositories.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSecret: jwtSecret}
}

func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (string, error) {

	user, err := s.userRepo.FindUserByEmail(ctx, req.Email)
	if err != nil {
		return "", errors.UserNotFoundError()
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return "", errors.IncorrectPasswordError()
	}

	var userID string
	if user.SuperAdminID != nil {
		userID = *user.SuperAdminID
	} else if user.CompanyAdminID != nil {
		userID = *user.CompanyAdminID
	} else if user.WorkerID != nil {
		userID = *user.WorkerID
	} else {
		return "", errors.GenericInternalServerError()
	}

	token, err := s.generateJWT(userID)
	if err != nil {
		return "", errors.GenericInternalServerError()
	}

	return token, nil
}

func (s *AuthService) generateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
