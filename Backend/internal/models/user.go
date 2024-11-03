// internal/models/user.go
package models

import "time"

type User struct {
	SuperAdminID   *string   `db:"super_admin_id"`
	CompanyAdminID *string   `db:"company_admin_id"`
	WorkerID       *string   `db:"worker_id"`
	CompanyID      string    `db:"company_id"`
	IIN            string    `db:"iin"`
	Name           string    `db:"name"`
	Surname        string    `db:"surname"`
	Patronymic     *string   `db:"patronymic"`
	Email          string    `db:"email"`
	Password       string    `db:"password"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
}

type UserPublic struct {
	SuperAdminID   *string `json:"super_admin_id,omitempty"`
	CompanyAdminID *string `json:"company_admin_id,omitempty"`
	WorkerID       *string `json:"worker_id,omitempty"`
	CompanyID      string  `json:"company_id"`
	IIN            string  `json:"iin"`
	Name           string  `json:"name"`
	Surname        string  `json:"surname"`
	Patronymic     *string `json:"patronymic,omitempty"`
	CreatedAt      string  `json:"created_at"`
	UpdatedAt      string  `json:"updated_at"`
}

type UserWithCompany struct {
	User    UserPublic `json:"user"`
	Company Company    `json:"company"`
	Role    string     `json:"role"`
}
