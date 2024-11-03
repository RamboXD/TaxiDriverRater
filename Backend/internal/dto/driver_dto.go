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

type DriverInfoDTO struct {
	Driver        DriverDTO              `json:"driver"`
	Ratings       []RatingWithCompanyDTO `json:"ratings"`
	AverageRating float64                `json:"average_rating"`
}

type DriverDTO struct {
	ID              string     `json:"id"`
	IIN             string     `json:"iin"`
	Name            string     `json:"name"`
	Surname         string     `json:"surname"`
	Patronymic      *string    `json:"patronymic"`
	Category        string     `json:"category"`
	DtpDate         *time.Time `json:"dtp_date"`
	Penalty         bool       `json:"penalty"`
	InsuranceData   string     `json:"insurance_data"`
	InsuranceNumber string     `json:"insurance_number"`
	Address         string     `json:"address"`
	PhoneNumber     string     `json:"phone_number"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type RatingWithCompanyDTO struct {
	Rating      int        `json:"rating"`
	Description string     `json:"description"`
	Company     CompanyDTO `json:"company"`
}

type CompanyDTO struct {
	ID             string    `json:"id"`
	IIN            string    `json:"iin"`
	BIN            string    `json:"bin"`
	Address        string    `json:"address"`
	HeadName       string    `json:"head_name"`
	HeadSurname    string    `json:"head_surname"`
	HeadPatronymic *string   `json:"head_patronymic"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
