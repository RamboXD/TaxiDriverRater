// internal/services/auth_service.go
package services

import (
	"context"
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"github.com/ramboxd/taxidriverrater/pkg/config"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo repositories.AuthRepository
}

func NewAuthService(repo repositories.AuthRepository) *AuthService {
	return &AuthService{repo: repo}
}

// Login checks the user's credentials and returns the user object with role IDs
func (s *AuthService) Login(ctx context.Context, email, password string) (*models.User, error) {
	user, err := s.repo.FindUserByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

// GenerateJWT creates a JWT token for the user using role-specific ID
func (s *AuthService) GenerateJWT(roleID string, role string) (string, error) {
	claims := jwt.MapClaims{
		"sub":  roleID,                                // Subject (role-specific ID)
		"role": role,                                  // User's role (super_admin, company_admin, worker)
		"exp":  time.Now().Add(time.Hour * 24).Unix(), // Expiration time
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key from config
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
