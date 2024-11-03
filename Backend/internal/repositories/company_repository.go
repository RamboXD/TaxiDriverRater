// internal/repositories/company_repository.go
package repositories

import (
	"context"
	"errors"

	"github.com/jackc/pgconn"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

var ErrCompanyAlreadyExists = errors.New("company with this IIN or BIN already exists")

type CompanyRepository interface {
	FindCompanyByID(ctx context.Context, companyID string) (*models.Company, error)
	CompanyExists(ctx context.Context, companyID string) (bool, error)
	CreateCompany(ctx context.Context, company *models.Company) error
	GetAllCompanies(ctx context.Context) ([]models.Company, error)
}

type companyRepository struct{}

func NewCompanyRepository() CompanyRepository {
	return &companyRepository{}
}

func (r *companyRepository) CompanyExists(ctx context.Context, companyID string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM company WHERE id = $1)`
	err := database.DB.QueryRow(ctx, query, companyID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *companyRepository) CreateCompany(ctx context.Context, company *models.Company) error {
	_, err := database.DB.Exec(ctx, `
        INSERT INTO company (iin, bin, address, name, head_name, head_surname, head_patronymic, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, &7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, company.IIN, company.BIN, company.Address, company.Name, company.HeadName, company.HeadSurname, company.HeadPatronymic)

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			return ErrCompanyAlreadyExists
		}
		return err
	}

	return nil
}

func (r *companyRepository) FindCompanyByID(ctx context.Context, companyID string) (*models.Company, error) {
	var company models.Company
	query := `SELECT * FROM company WHERE id = $1`
	err := database.DB.QueryRow(ctx, query, companyID).Scan(
		&company.ID, &company.IIN, &company.BIN, &company.Address,
		&company.HeadName, &company.HeadSurname, &company.HeadPatronymic,
		&company.CreatedAt, &company.UpdatedAt, &company.Name,
	)
	if err != nil {
		return nil, err
	}
	return &company, nil
}

func (r *companyRepository) GetAllCompanies(ctx context.Context) ([]models.Company, error) {
	var companies []models.Company
	query := `SELECT id, iin, bin, address, name, head_name, head_surname, head_patronymic, created_at, updated_at FROM company`
	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var company models.Company
		if err := rows.Scan(&company.ID, &company.IIN, &company.BIN, &company.Address, &company.Name,
			&company.HeadName, &company.HeadSurname, &company.HeadPatronymic,
			&company.CreatedAt, &company.UpdatedAt); err != nil {
			return nil, err
		}
		companies = append(companies, company)
	}

	return companies, nil
}
