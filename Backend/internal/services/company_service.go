// internal/services/company_service.go
package services

import (
	"context"
	"errors"

	"github.com/ramboxd/taxidriverrater/internal/dto"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/internal/repositories"
)

var ErrCompanyExists = errors.New("company already exists")

type CompanyService struct {
	repo repositories.CompanyRepository
}

func NewCompanyService(repo repositories.CompanyRepository) *CompanyService {
	return &CompanyService{repo: repo}
}

func (s *CompanyService) RegisterCompany(ctx context.Context, req dto.CompanyRegisterRequest) error {
	company := &models.Company{
		IIN:            req.IIN,
		BIN:            req.BIN,
		Address:        req.Address,
		HeadName:       req.HeadName,
		HeadSurname:    req.HeadSurname,
		HeadPatronymic: req.HeadPatronymic,
	}

	err := s.repo.CreateCompany(ctx, company)
	if errors.Is(err, repositories.ErrCompanyAlreadyExists) {
		return ErrCompanyExists
	}
	return err
}

func (s *CompanyService) GetAllCompanies(ctx context.Context) ([]models.Company, error) {
	return s.repo.GetAllCompanies(ctx)
}
