// internal/repositories/driver_repository.go
package repositories

import (
	"context"
	"errors"

	"github.com/jackc/pgconn"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

var ErrDriverAlreadyExists = errors.New("driver with this IIN already exists")

type DriverRepository interface {
	CreateDriver(ctx context.Context, driver *models.Driver) error
	DriverExists(ctx context.Context, driverID string) (bool, error)
	FindDriverByID(ctx context.Context, driverID string) (*models.Driver, error)
	ListDrivers(ctx context.Context) ([]models.Driver, error)
}

type driverRepository struct{}

func NewDriverRepository() DriverRepository {
	return &driverRepository{}
}

func (r *driverRepository) CreateDriver(ctx context.Context, driver *models.Driver) error {
	_, err := database.DB.Exec(ctx, `
		INSERT INTO drivers (iin, name, surname, patronymic, category, dtp_date, penalty, insurance_data, insurance_number, address, phone_number)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`, driver.IIN, driver.Name, driver.Surname, driver.Patronymic, driver.Category, driver.DtpDate, driver.Penalty, driver.InsuranceData, driver.InsuranceNumber, driver.Address, driver.PhoneNumber)

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			return ErrDriverAlreadyExists
		}
		return err
	}

	return nil
}

func (r *driverRepository) DriverExists(ctx context.Context, driverID string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM drivers WHERE id = $1)`
	err := database.DB.QueryRow(ctx, query, driverID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *driverRepository) FindDriverByID(ctx context.Context, driverID string) (*models.Driver, error) {
	var driver models.Driver
	query := `SELECT id, iin, name, surname, patronymic, category, dtp_date, penalty, insurance_data, insurance_number, address, phone_number, created_at, updated_at
			  FROM drivers WHERE id = $1`
	err := database.DB.QueryRow(ctx, query, driverID).Scan(
		&driver.ID, &driver.IIN, &driver.Name, &driver.Surname, &driver.Patronymic, &driver.Category,
		&driver.DtpDate, &driver.Penalty, &driver.InsuranceData, &driver.InsuranceNumber,
		&driver.Address, &driver.PhoneNumber, &driver.CreatedAt, &driver.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &driver, nil
}

func (r *driverRepository) ListDrivers(ctx context.Context) ([]models.Driver, error) {
	query := `SELECT id, iin, name, surname, patronymic, category, dtp_date, penalty, insurance_data, insurance_number, address, phone_number, created_at, updated_at FROM drivers`

	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	drivers := make([]models.Driver, 0)
	for rows.Next() {
		var driver models.Driver
		err := rows.Scan(
			&driver.ID,
			&driver.IIN,
			&driver.Name,
			&driver.Surname,
			&driver.Patronymic,
			&driver.Category,
			&driver.DtpDate,
			&driver.Penalty,
			&driver.InsuranceData,
			&driver.InsuranceNumber,
			&driver.Address,
			&driver.PhoneNumber,
			&driver.CreatedAt,
			&driver.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		drivers = append(drivers, driver)
	}

	return drivers, nil
}
