package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"github.com/ramboxd/taxidriverrater/pkg/config"
)

func RoleChecker(repo repositories.AuthRepository, allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization format must be Bearer {token}"})
			return
		}
		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(config.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		userID := claims["sub"].(string)

		user, err := repo.FindUserByID(c.Request.Context(), userID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "User not found"})
			return
		}

		// Determne user role based on which role ID is set
		userRole, roleErr := getUserRole(user)
		if roleErr != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "User role determination failed"})
			return
		}

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

		c.Set("userID", userID)
		c.Set("companyID", user.CompanyID)
		c.Set("userRole", userRole)
		c.Next()
	}
}

func getUserRole(user *models.User) (string, error) {
	switch {
	case user.SuperAdminID != nil:
		return "super_admin", nil
	case user.CompanyAdminID != nil:
		return "company_admin", nil
	case user.WorkerID != nil:
		return "worker", nil
	default:
		return "", errors.New("no role assigned to user")
	}
}
