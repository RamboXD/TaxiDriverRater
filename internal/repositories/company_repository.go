// internal/repositories/company_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

type CompanyRepository interface {
	GetCompanyByID(ctx context.Context, id string) (*models.Company, error)
}

type companyRepository struct{}

func NewCompanyRepository() CompanyRepository {
	return &companyRepository{}
}

func (r *companyRepository) GetCompanyByID(ctx context.Context, id string) (*models.Company, error) {
	log := logger.NewColoredLogger()
	var company models.Company
	err := database.DB.QueryRow(ctx, `SELECT * FROM company WHERE id = $1`, id).Scan(
		&company.ID, &company.IIN, &company.BIN, &company.Address, &company.HeadName, &company.HeadSurname, &company.HeadPatronymic,
	)
	if err != nil {
		log.Error("Failed to get company by ID", zap.Error(err))
		return nil, err
	}
	log.Info("Successfully retrieved company", zap.String("company_id", id))
	return &company, nil
}
