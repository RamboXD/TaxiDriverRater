// pkg/config/config.go
package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var (
	JWTSecret   []byte
	DatabaseURL string
)

// LoadConfig loads environment variables from .env file and system environment
func LoadConfig() error {
	// Load .env file if it exists
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found, relying on system environment variables")
	}

	// Load JWT_SECRET from environment variable
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("JWT_SECRET environment variable not set")
	}
	JWTSecret = []byte(jwtSecret)

	// Load DATABASE_URL from environment variable
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL environment variable not set")
	}
	DatabaseURL = databaseURL

	return nil
}
