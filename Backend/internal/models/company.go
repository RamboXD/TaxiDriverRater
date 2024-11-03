// internal/models/company.go
package models

import "time"

type Company struct {
	ID             string    `db:"id"`
	IIN            string    `db:"iin"`
	BIN            string    `db:"bin"`
	Address        string    `db:"address"`
	Name           string    `db:"name"`
	HeadName       string    `db:"head_name"`
	HeadSurname    string    `db:"head_surname"`
	HeadPatronymic *string   `db:"head_patronymic"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
}
