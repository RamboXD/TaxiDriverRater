// pkg/database/database.go
package database

import (
	"context"
	"fmt"
	"time"

	"github.com/ramboxd/taxidriverrater/pkg/config"

	"github.com/jackc/pgx/v4/pgxpool"
)

var DB *pgxpool.Pool

// InitDatabase initializes the database connection pool
func InitDatabase() error {
	// Use the DatabaseURL loaded from the config package
	dbURL := config.DatabaseURL
	if dbURL == "" {
		return fmt.Errorf("database url not found in the configuration")
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
