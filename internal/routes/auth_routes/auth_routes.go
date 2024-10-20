// internal/routes/auth_routes.go
package auth_routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterAuthRoutes(r *gin.Engine, authService *services.AuthService, userService *services.UserService) {
	// Login route (public)
	r.POST("/login", func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")
		if err := authService.Login(c.Request.Context(), email, password); err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}
		// Generate JWT token and send it in response
		token, _ := authService.GenerateJWT(email) // Add token generation logic
		c.JSON(200, gin.H{"message": "Login successful", "token": token})
	})

	// Registration route (public)
	r.POST("/register", func(c *gin.Context) {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Role     string `json:"role"` // Expecting roles: super_admin, company_admin, worker
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		// Hash the password and create a new user
		if err := userService.CreateUserWithRole(c.Request.Context(), req.Email, req.Password, req.Role); err != nil {
			c.JSON(500, gin.H{"error": "Failed to register user"})
			return
		}
		c.JSON(200, gin.H{"message": "Registration successful"})
	})
}
