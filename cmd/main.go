// cmd/main.go
package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/routes"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

func main() {
	// Initialize logger
	log := logger.NewColoredLogger()
	defer log.Sync()

	// Initialize the database
	if err := database.InitDatabase(); err != nil {
		log.Fatal("Database initialization failed", zap.Error(err))
	}
	defer database.DB.Close()

	// Create a Gin router
	r := gin.New()
	r.Use(gin.Recovery())

	// Register routes
	routes.RegisterRoutes(r)

	// Graceful shutdown channel
	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	log.Info("Server running on :8080")

	// Wait for interrupt signal for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info("Shutting down server...")

	// Create a deadline for the server to finish ongoing requests
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown", zap.Error(err))
	}

	log.Info("Server exiting")
}
