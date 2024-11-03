// internal/routes/public_routes.go
package public_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/errors"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
)

func RegisterPublicRoutes(r *gin.Engine, authService *services.AuthService, userService *services.UserService, companyService *services.CompanyService) {
	// Public login route
	log := logger.NewColoredLogger()
	r.POST("/login", func(c *gin.Context) {
		var req dto.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid login request: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		token, err := authService.Login(c.Request.Context(), req)
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Login error: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected login error: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("User logged in successfully")
		res := dto.LoginResponse{Token: token}
		c.JSON(http.StatusOK, res)
	})

}
