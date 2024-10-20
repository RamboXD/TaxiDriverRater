// internal/routes/user_routes.go
package user_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterUserRoutes(r *gin.RouterGroup, service *services.UserService) {
	// Example: User route that allows accessing user profile
	r.GET("/user/profile", func(c *gin.Context) {
		userID := c.GetString("userID")
		ctx := c.Request.Context()
		user, err := service.FindUserByEmail(ctx, userID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get user data"})
			return
		}
		c.JSON(200, gin.H{"user": user})
	})
}
