// pkg/database/database.go
package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
)

var DB *pgxpool.Pool

// InitDatabase initializes the database connection pool
func InitDatabase() error {
	// Get the database URL from the environment variables
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	// Set connection configuration (optional timeout setup)
	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return fmt.Errorf("failed to parse database URL: %w", err)
	}

	// Set connection pool configuration
	config.MaxConns = 10                       // Max connections in the pool
	config.MaxConnIdleTime = 5 * time.Minute   // Max idle time for connections
	config.HealthCheckPeriod = 1 * time.Minute // Time between health checks

	// Establish the connection pool
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	DB, err = pgxpool.ConnectConfig(ctx, config)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Verify the connection
	err = DB.Ping(ctx)
	if err != nil {
		return fmt.Errorf("failed to ping the database: %w", err)
	}

	fmt.Println("Database connection established")
	return nil
}

// CloseDatabase closes the database connection pool
func CloseDatabase() {
	if DB != nil {
		DB.Close()
	}
}
