// internal/models/driver.go
package models

import "time"

type Driver struct {
	ID              string     `db:"id"`
	IIN             string     `db:"iin"`
	Name            string     `db:"name"`
	Surname         string     `db:"surname"`
	Patronymic      *string    `db:"patronymic"`
	Category        string     `db:"category"`
	DtpDate         *time.Time `db:"dtp_date"`
	Penalty         bool       `db:"penalty"`
	InsuranceData   string     `db:"insurance_data"`
	InsuranceNumber string     `db:"insurance_number"`
	Address         string     `db:"address"`
	PhoneNumber     string     `db:"phone_number"`
	CreatedAt       time.Time  `db:"created_at"`
	UpdatedAt       time.Time  `db:"updated_at"`
}
