// internal/routes/super_admin_routes.go
package super_admin_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterSuperAdminRoutes(r *gin.RouterGroup, companyService *services.CompanyService, driverService *services.DriverService, ratingService *services.RatingService, userService *services.UserService) {
	// // Companies (super admin only)
	// r.GET("/companies", func(c *gin.Context) {
	// 	companies, err := companyService.GetAllCompanies(c.Request.Context())
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to get companies"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"companies": companies})
	// })

	// r.PATCH("/companies/company/:id", func(c *gin.Context) {
	// 	companyID := c.Param("id")
	// 	var req struct {
	// 		Address string `json:"address"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	if err := companyService.UpdateCompany(c.Request.Context(), companyID, req.Address); err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to update company"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Company updated"})
	// })

	// // User management (super admin only)
	// r.PATCH("/users/user/:id", func(c *gin.Context) {
	// 	userID := c.Param("id")
	// 	var req struct {
	// 		Email    string `json:"email"`
	// 		Password string `json:"password"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	if err := userService.UpdateUser(c.Request.Context(), userID, req.Email, req.Password); err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to update user info"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "User updated"})
	// })
}
