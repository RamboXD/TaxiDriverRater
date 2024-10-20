// internal/repositories/driver_repository.go
package repositories

import (
	"context"

	"github.com/ramboxd/taxidriverrater/internal/models"
	"github.com/ramboxd/taxidriverrater/pkg/database"
	"github.com/ramboxd/taxidriverrater/pkg/logger"
	"go.uber.org/zap"
)

type DriverRepository interface {
	GetDriverByID(ctx context.Context, id string) (*models.Driver, error)
}

type driverRepository struct{}

func NewDriverRepository() DriverRepository {
	return &driverRepository{}
}

func (r *driverRepository) GetDriverByID(ctx context.Context, id string) (*models.Driver, error) {
	log := logger.NewColoredLogger()
	var driver models.Driver
	err := database.DB.QueryRow(ctx, `SELECT * FROM drivers WHERE id = $1`, id).Scan(
		&driver.ID, &driver.IIN, &driver.Name, &driver.Surname, &driver.Patronymic, &driver.Category, &driver.DtpDate,
		&driver.Penalty, &driver.InsuranceData, &driver.InsuranceNumber, &driver.Address, &driver.PhoneNumber,
	)
	if err != nil {
		log.Error("Failed to get driver by ID", zap.Error(err))
		return nil, err
	}
	log.Info("Successfully retrieved driver", zap.String("driver_id", id))
	return &driver, nil
}
