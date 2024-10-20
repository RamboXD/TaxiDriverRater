// internal/routes/routes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/middleware"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"github.com/ramboxd/taxidriverrater/internal/routes/auth_routes"
	"github.com/ramboxd/taxidriverrater/internal/routes/company_admin_routes"
	"github.com/ramboxd/taxidriverrater/internal/routes/user_routes"
	"github.com/ramboxd/taxidriverrater/internal/services"
)

func RegisterRoutes(r *gin.Engine) {
	// Initialize repositories
	userRepo := repositories.NewUserRepository()
	companyRepo := repositories.NewCompanyRepository()
	authRepo := repositories.NewAuthRepository()

	// Initialize services
	userService := services.NewUserService(userRepo)
	companyService := services.NewCompanyService(companyRepo)
	authService := services.NewAuthService(authRepo)

	// Public routes (e.g., login, registration)
	auth_routes.RegisterAuthRoutes(r, authService, userService)

	// Protected routes (require JWT token and role checks)
	protected := r.Group("/")
	{
		// Routes that allow both super_admin and company_admin
		superAndCompanyAdmin := protected.Group("/")
		superAndCompanyAdmin.Use(middleware.RoleChecker("super_admin", "company_admin"))
		company_admin_routes.RegisterCompanyAdminRoutes(superAndCompanyAdmin, companyService)

		// Routes that are user-specific (workers, admins)
		userProtected := protected.Group("/")
		userProtected.Use(middleware.RoleChecker("worker", "super_admin"))
		user_routes.RegisterUserRoutes(userProtected, userService)
	}
}
