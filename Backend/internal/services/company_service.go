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
	repo     repositories.CompanyRepository
	userRepo repositories.UserRepository
}

func NewCompanyService(repo repositories.CompanyRepository, userRepo repositories.UserRepository) *CompanyService {
	return &CompanyService{repo: repo, userRepo: userRepo}
}

func (s *CompanyService) RegisterCompany(ctx context.Context, req dto.CompanyRegisterRequest) error {
	company := &models.Company{
		IIN:            req.IIN,
		BIN:            req.BIN,
		Address:        req.Address,
		Name:           req.Name,
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

func (s *CompanyService) GetCompanyWithUsers(ctx context.Context, companyID string) (map[string]interface{}, error) {
	company, err := s.repo.FindCompanyByID(ctx, companyID)
	if err != nil {
		return nil, errors.New("company not found")
	}

	users, err := s.userRepo.GetUsersByCompanyID(ctx, companyID)
	if err != nil {
		return nil, errors.New("failed to retrieve users")
	}

	// Prepare response
	companyData := map[string]interface{}{
		"company": company,
		"users":   users,
	}

	return companyData, nil
}
