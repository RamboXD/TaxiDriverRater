// internal/routes/shared_routes.go
package shared_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterSharedRoutes(r *gin.RouterGroup, userService *services.UserService) {
	// // Get current user info (accessible by all roles)
	// r.GET("/me", func(c *gin.Context) {
	// 	userID := c.GetString("userID")
	// 	user, err := userService.GetUserByID(c.Request.Context(), userID)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to get user info"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"user": user})
	// })
}
