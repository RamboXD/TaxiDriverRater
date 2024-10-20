// internal/middleware/role_checker.go
package middleware

import (
	"context"
	"database/sql"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/pkg/config"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

// RoleChecker checks if a user has one of the allowed roles.
func RoleChecker(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Parse the token and extract the claims
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &jwt.MapClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JWTSecret, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Extract the user ID from the JWT claims
		userID, ok := (*claims)["sub"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Log the user trying to access
		log := logger.NewColoredLogger()
		log.Info("User ID found in token", zap.String("userID", userID))

		// Check if the user has access based on their role
		if !checkUserRole(c.Request.Context(), userID, allowedRoles...) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			log.Warn("User access denied", zap.String("userID", userID))
			c.Abort()
			return
		}

		// Add the user ID to the context for further use in handlers
		c.Set("userID", userID)

		c.Next() // Proceed to the next middleware/handler
	}
}

// Function to check if the user has any of the allowed roles by querying the database
func checkUserRole(ctx context.Context, userID string, allowedRoles ...string) bool {
	var query string
	var args []interface{}

	// Build SQL query based on allowed roles
	conditions := []string{}
	if contains(allowedRoles, "worker") {
		conditions = append(conditions, "worker_id = $1")
	}
	if contains(allowedRoles, "company_admin") {
		conditions = append(conditions, "company_admin_id = $1")
	}
	if contains(allowedRoles, "super_admin") {
		conditions = append(conditions, "super_admin_id = $1")
	}

	query = `SELECT EXISTS(SELECT 1 FROM users WHERE (` + strings.Join(conditions, " OR ") + `))`
	args = append(args, userID)

	var exists bool
	err := database.DB.QueryRow(ctx, query, args...).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		return false
	}

	return exists
}

// Helper function to check if a string exists in a slice
func contains(slice []string, item string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}
