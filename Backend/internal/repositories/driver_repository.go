// internal/repositories/driver_repository.go
package repositories

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgconn"
	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
)

var ErrDriverAlreadyExists = errors.New("driver with this IIN already exists")

type DriverRepository interface {
	CreateDriver(ctx context.Context, driver *models.Driver) error
}

type driverRepository struct{}

func NewDriverRepository() DriverRepository {
	return &driverRepository{}
}

func (r *driverRepository) CreateDriver(ctx context.Context, driver *models.Driver) error {
	_, err := database.DB.Exec(ctx, `
		INSERT INTO drivers (iin, name, surname, patronymic, category, dtp_date, penalty, insurance_data, insurance_number, address, phone_number, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	`, driver.IIN, driver.Name, driver.Surname, driver.Patronymic, driver.Category, driver.DtpDate, driver.Penalty, driver.InsuranceData, driver.InsuranceNumber, driver.Address, driver.PhoneNumber, time.Now(), time.Now())

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			return ErrDriverAlreadyExists
		}
		return err
	}

	return nil
}
