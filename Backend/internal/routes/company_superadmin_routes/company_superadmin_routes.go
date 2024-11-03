// internal/routes/company_superadmin_routes.go
package company_superadmin_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/errors"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
)

func RegisterCompanySuperAdminRoutes(r *gin.RouterGroup, userService *services.UserService, driverService *services.DriverService) {
	log := logger.NewColoredLogger()

	r.POST("/register/worker", func(c *gin.Context) {
		var req dto.UserRegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid request for /register/worker: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		err := userService.CreateUserWithRole(c.Request.Context(), req, "worker")
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Failed to register worker: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected error in /register/worker: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("Worker registered successfully")
		c.JSON(http.StatusOK, gin.H{"message": "Worker registered successfully"})
	})

	r.POST("/register/driver", func(c *gin.Context) {
		var req dto.DriverRegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid request for /register/driver: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		err := driverService.RegisterDriver(c.Request.Context(), req)
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Failed to register driver: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected error in /register/driver: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("Driver registered successfully")
		c.JSON(http.StatusOK, gin.H{"message": "Driver registered successfully"})
	})
}
