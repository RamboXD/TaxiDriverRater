// internal/routes/shared_routes.go
package shared_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
)

func RegisterSharedRoutes(r *gin.RouterGroup, userService *services.UserService) {
	log := logger.NewColoredLogger()

	r.GET("/profile", func(c *gin.Context) {
		userID, _ := c.Get("userID")
		userRole, _ := c.Get("userRole")
		userData, err := userService.GetUserWithCompanyData(c.Request.Context(), userID.(string), userRole.(string))
		if err != nil {
			log.Error("Failed to retrieve user data: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user data"})
			return
		}

		c.JSON(http.StatusOK, userData)
	})
}
