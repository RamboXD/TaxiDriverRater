// internal/routes/shared_routes.go
package shared_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
)

func RegisterSharedRoutes(r *gin.RouterGroup, userService *services.UserService, driverService *services.DriverService) {
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

	r.GET("/driver/:driverID", func(c *gin.Context) {
		driverID := c.Param("driverID")

		// Fetch driver information along with ratings and average rating
		driverInfo, err := driverService.GetDriverInfoWithRatings(c.Request.Context(), driverID)
		if err != nil {
			log.Error("Failed to fetch driver information: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve driver information"})
			return
		}

		c.JSON(http.StatusOK, driverInfo)
	})

	r.GET("/drivers", func(c *gin.Context) {
		drivers, err := driverService.ListDrivers(c.Request.Context())
		if err != nil {
			log.Error("Failed to retrieve drivers list: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve drivers list"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"drivers": drivers})
	})
}
