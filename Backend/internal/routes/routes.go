// internal/routes/routes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ramboxd/taxidriverrater/internal/middleware"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
	"github.com/ramboxd/taxidriverrater/internal/routes/company_superadmin_routes"
	"github.com/ramboxd/taxidriverrater/internal/routes/public_routes"
	"github.com/ramboxd/taxidriverrater/internal/routes/shared_routes"
	"github.com/ramboxd/taxidriverrater/internal/routes/super_admin_routes"
	"github.com/ramboxd/taxidriverrater/internal/services"
	"github.com/ramboxd/taxidriverrater/pkg/config"
)

func RegisterRoutes(r *gin.Engine) {
	// Initialize repositories
	userRepo := repositories.NewUserRepository()
	companyRepo := repositories.NewCompanyRepository()
	driverRepo := repositories.NewDriverRepository()
	// ratingRepo := repositories.NewRatingRepository()
	authRepo := repositories.NewAuthRepository()

	// Initialize services
	userService := services.NewUserService(userRepo, companyRepo)
	companyService := services.NewCompanyService(companyRepo)
	driverService := services.NewDriverService(driverRepo)
	// ratingService := services.NewRatingService(ratingRepo)
	authService := services.NewAuthService(userRepo, string(config.JWTSecret))

	// Public routes (login, etc.)
	public_routes.RegisterPublicRoutes(r, authService, userService, companyService)

	// Super admin routes (only accessible by super admin)
	superAdminGroup := r.Group("/auth")
	superAdminGroup.Use(middleware.RoleChecker(authRepo, "super_admin"))
	super_admin_routes.RegisterSuperAdminRoutes(superAdminGroup, userService, companyService)

	// Company and Super Admin routes (accessible by both super_admin and company_admin)
	companySuperAdminGroup := r.Group("/auth")
	companySuperAdminGroup.Use(middleware.RoleChecker(authRepo, "super_admin", "company_admin"))
	company_superadmin_routes.RegisterCompanySuperAdminRoutes(companySuperAdminGroup, userService, driverService)

	// Shared routes (accessible by super_admin, company_admin, and worker)
	sharedGroup := r.Group("/auth")
	sharedGroup.Use(middleware.RoleChecker(authRepo, "super_admin", "company_admin", "worker"))
	shared_routes.RegisterSharedRoutes(sharedGroup, userService)
}
