package super_admin_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/errors"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
)

func RegisterSuperAdminRoutes(r *gin.RouterGroup, userService *services.UserService, companyService *services.CompanyService) {
	log := logger.NewColoredLogger() // Initialize the logger

	r.POST("/register/superadmin", func(c *gin.Context) {
		var req dto.UserRegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid request for /register/superadmin: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		err := userService.CreateUserWithRole(c.Request.Context(), req, "super_admin")
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Failed to register super admin: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected error in /register/superadmin: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("Super admin registered successfully")
		c.JSON(http.StatusOK, gin.H{"message": "Super admin registered successfully"})
	})

	r.POST("/register/company_admin", func(c *gin.Context) {
		var req dto.UserRegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid request for /register/company_admin: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		err := userService.CreateUserWithRole(c.Request.Context(), req, "company_admin")
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Failed to register company_admin: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected error in /register/company_admin: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("Company admin registered successfully")
		c.JSON(http.StatusOK, gin.H{"message": "Company admin registered successfully"})
	})

	r.POST("/register/company", func(c *gin.Context) {
		var req dto.CompanyRegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Error("Invalid request for /register/company: ", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		err := companyService.RegisterCompany(c.Request.Context(), req)
		if err != nil {
			if appErr, ok := err.(*errors.AppError); ok {
				log.Error("Failed to register company: ", appErr.Message)
				c.JSON(appErr.StatusCode, gin.H{"error": appErr.Message})
			} else {
				log.Error("Unexpected error in /register/company: ", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			}
			return
		}

		log.Info("Company registered successfully")
		c.JSON(http.StatusOK, gin.H{"message": "Company registered successfully"})
	})

	r.GET("/companies", func(c *gin.Context) {
		companies, err := companyService.GetAllCompanies(c.Request.Context())
		if err != nil {
			log.Error("Failed to retrieve companies: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"companies": companies})
	})

	r.GET("/companies/:company_id", func(c *gin.Context) {
		companyID := c.Param("company_id")

		companyData, err := companyService.GetCompanyWithUsers(c.Request.Context(), companyID)
		if err != nil {
			log.Error("Failed to fetch company data: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch company data"})
			return
		}

		c.JSON(http.StatusOK, companyData)
	})
}
