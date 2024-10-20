// internal/routes/company_superadmin_routes.go
package company_superadmin_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterCompanySuperAdminRoutes(r *gin.RouterGroup, companyService *services.CompanyService, driverService *services.DriverService) {
	// // Companies (accessible by super admin and company admin)
	// r.GET("/companies/company/:id", func(c *gin.Context) {
	// 	companyID := c.Param("id")
	// 	company, err := companyService.GetCompanyByID(c.Request.Context(), companyID)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to get company"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"company": company})
	// })

	// // Drivers (accessible by super admin and company admin)
	// r.GET("/drivers", func(c *gin.Context) {
	// 	drivers, err := driverService.GetAllDrivers(c.Request.Context())
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to get drivers"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"drivers": drivers})
	// })

	// r.GET("/drivers/driver/:id", func(c *gin.Context) {
	// 	driverID := c.Param("id")
	// 	driver, err := driverService.GetDriverByID(c.Request.Context(), driverID)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to get driver"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"driver": driver})
	// })

	// r.POST("/register/driver", func(c *gin.Context) {
	// 	var req struct {
	// 		IIN       string  `json:"iin"`
	// 		Name      string  `json:"name"`
	// 		Surname   string  `json:"surname"`
	// 		Category  string  `json:"category"`
	// 		Address   string  `json:"address"`
	// 		Phone     string  `json:"phone"`
	// 		Patronymic *string `json:"patronymic"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	err := driverService.RegisterDriver(c.Request.Context(), req.IIN, req.Name, req.Surname, req.Category, req.Address, req.Phone, req.Patronymic)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to register driver"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Driver registered"})
	// })

	// // Register a new worker
	// r.POST("/register/worker", func(c *gin.Context) {
	// 	var req struct {
	// 		Email    string  `json:"email"`
	// 		Password string  `json:"password"`
	// 		CompanyID string `json:"company_id"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	err := workerService.RegisterWorker(c.Request.Context(), req.Email, req.Password, req.CompanyID)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to register worker"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Worker registered"})
	// })

	// // Update a worker by ID
	// r.PATCH("/users/worker/:id", func(c *gin.Context) {
	// 	workerID := c.Param("id")
	// 	var req struct {
	// 		Email    string `json:"email"`
	// 		Password string `json:"password"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	if err := workerService.UpdateWorker(c.Request.Context(), workerID, req.Email, req.Password); err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to update worker info"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Worker updated"})
	// })

	// // Create a new rating
	// r.POST("/ratings/rating/:id", func(c *gin.Context) {
	// 	var req struct {
	// 		DriverID    string `json:"driver_id"`
	// 		WorkerID    string `json:"worker_id"`
	// 		Rating      int    `json:"rating"`
	// 		Description string `json:"description"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	err := ratingService.CreateRating(c.Request.Context(), req.DriverID, req.WorkerID, req.Rating, req.Description)
	// 	if err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to create rating"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Rating created"})
	// })

	// // Update a rating
	// r.PATCH("/ratings/rating/:id", func(c *gin.Context) {
	// 	ratingID := c.Param("id")
	// 	var req struct {
	// 		Rating      int    `json:"rating"`
	// 		Description string `json:"description"`
	// 	}
	// 	if err := c.ShouldBindJSON(&req); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid request"})
	// 		return
	// 	}

	// 	if err := ratingService.UpdateRating(c.Request.Context(), ratingID, req.Rating, req.Description); err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to update rating"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Rating updated"})
	// })

	// // Delete a rating
	// r.DELETE("/ratings/rating/:id", func(c *gin.Context) {
	// 	ratingID := c.Param("id")
	// 	if err := ratingService.DeleteRating(c.Request.Context(), ratingID); err != nil {
	// 		c.JSON(500, gin.H{"error": "Failed to delete rating"})
	// 		return
	// 	}
	// 	c.JSON(200, gin.H{"message": "Rating deleted"})
	// })
}
