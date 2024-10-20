// internal/services/company_service.go
package services

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

type CompanyService struct {
	repo repositories.CompanyRepository
}

func NewCompanyService(repo repositories.CompanyRepository) *CompanyService {
	return &CompanyService{repo: repo}
}

func (s *CompanyService) GetCompanyByID(ctx context.Context, id string) (*models.Company, error) {
	return s.repo.GetCompanyByID(ctx, id)
}
