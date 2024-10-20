// internal/middleware/role_checker.go
package middleware

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

func RoleChecker(repo repositories.AuthRepository, allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, exists := c.Get("jwt")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
			return
		}

		claims, ok := token.(*jwt.Token).Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		userRole := claims["role"].(string)
		userID := claims["sub"].(string)

		// Check if the user's role is allowed
		allowed := false
		for _, role := range allowedRoles {
			if userRole == role {
				allowed = true
				break
			}
		}

		if !allowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "You do not have access to this resource"})
			return
		}

		// Pass the context and check if the user exists with the correct role ID
		exists, err := validateUserRole(c.Request.Context(), repo, userID, userRole)
		if err != nil || !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid user or role"})
			return
		}

		// Set the userID to the context for further use
		c.Set("userID", userID)
		c.Next()
	}
}

// validateUserRole checks if the user exists with the given role and userID in the database
func validateUserRole(ctx context.Context, repo repositories.AuthRepository, userID string, role string) (bool, error) {
	switch role {
	case "super_admin":
		return repo.UserExistsByRoleID(ctx, userID, "super_admin")
	case "company_admin":
		return repo.UserExistsByRoleID(ctx, userID, "company_admin")
	case "worker":
		return repo.UserExistsByRoleID(ctx, userID, "worker")
	default:
		return false, nil
	}
}
