// internal/services/auth_service.go
package services

import (
	"context"
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
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

// Login checks if user credentials are valid
func (s *AuthService) Login(ctx context.Context, email, password string) error {
	user, err := s.repo.FindUserByEmail(ctx, email)
	if err != nil {
		return errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return errors.New("invalid credentials")
	}

	return nil
}

// GenerateJWT creates a JWT token for the user
func (s *AuthService) GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{
		"sub": email,                                 // Subject (user email)
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Expiration time
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key from config
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
