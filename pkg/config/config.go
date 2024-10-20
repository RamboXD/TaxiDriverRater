// pkg/config/config.go
package config

import (
	"fmt"
	"os"
)

var (
	JWTSecret   []byte
	DatabaseURL string
)

func LoadConfig() error {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("JWT_SECRET environment variable not set")
	}
	JWTSecret = []byte(jwtSecret)

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL environment variable not set")
	}
	DatabaseURL = databaseURL

	return nil
}
