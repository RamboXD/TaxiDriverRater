// internal/dto/driver_dto.go
package dto

import "time"

type DriverRegisterRequest struct {
	IIN             string     `json:"iin" binding:"required"`
	Name            string     `json:"name" binding:"required"`
	Surname         string     `json:"surname" binding:"required"`
	Patronymic      *string    `json:"patronymic"`
	Category        string     `json:"category" binding:"required"`
	DtpDate         *time.Time `json:"dtp_date"`
	Penalty         bool       `json:"penalty"`
	InsuranceData   string     `json:"insurance_data" binding:"required"`
	InsuranceNumber string     `json:"insurance_number" binding:"required"`
	Address         string     `json:"address" binding:"required"`
	PhoneNumber     string     `json:"phone_number" binding:"required"`
}
