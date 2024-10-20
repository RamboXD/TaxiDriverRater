// internal/routes/public_routes.go
package public_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterPublicRoutes(r *gin.Engine, authService *services.AuthService, userService *services.UserService, companyService *services.CompanyService) {
	// Public login route
	r.POST("/login", func(c *gin.Context) {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		// Authenticate the user
		user, err := authService.Login(c.Request.Context(), req.Email, req.Password)
		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		// Check which ID is present and use that for JWT generation
		var roleID, role string
		if user.SuperAdminID != nil {
			roleID = *user.SuperAdminID
			role = "super_admin"
		} else if user.CompanyAdminID != nil {
			roleID = *user.CompanyAdminID
			role = "company_admin"
		} else if user.WorkerID != nil {
			roleID = *user.WorkerID
			role = "worker"
		} else {
			c.JSON(500, gin.H{"error": "User does not have a valid role ID"})
			return
		}

		// Generate JWT using the correct role ID and role
		token, err := authService.GenerateJWT(roleID, role)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(200, gin.H{"token": token})
	})

	r.POST("/register/super/admin", func(c *gin.Context) {
		var req struct {
			Email      string  `json:"email"`
			Password   string  `json:"password"`
			IIN        string  `json:"iin"`
			Name       string  `json:"name"`
			Surname    string  `json:"surname"`
			Patronymic *string `json:"patronymic"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		err := userService.RegisterSuperAdmin(c.Request.Context(), req.Email, req.Password, req.IIN, req.Name, req.Surname, req.Patronymic)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to register super admin"})
			return
		}

		c.JSON(200, gin.H{"message": "Super Admin registered"})
	})

	// Register a new company
	r.POST("/register/company", func(c *gin.Context) {
		var req struct {
			IIN            string  `json:"iin"`
			BIN            string  `json:"bin"`
			Address        string  `json:"address"`
			HeadName       string  `json:"head_name"`
			HeadSurname    string  `json:"head_surname"`
			HeadPatronymic *string `json:"head_patronymic"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		err := companyService.RegisterCompany(c.Request.Context(), req.IIN, req.BIN, req.Address, req.HeadName, req.HeadSurname, req.HeadPatronymic)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to register company"})
			return
		}

		c.JSON(200, gin.H{"message": "Company registered"})
	})

}
