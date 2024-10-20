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
