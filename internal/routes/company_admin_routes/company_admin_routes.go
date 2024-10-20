// internal/routes/company_admin_routes.go
package company_admin_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterCompanyAdminRoutes(r *gin.RouterGroup, service *services.CompanyService) {
	// Route for company admin and super admin to view a company by ID
	r.GET("/company/:id", func(c *gin.Context) {
		companyID := c.Param("id")
		ctx := c.Request.Context()
		company, err := service.GetCompanyByID(ctx, companyID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get company data"})
			return
		}
		c.JSON(200, gin.H{"company": company})
	})
}
