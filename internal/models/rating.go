// internal/models/rating.go
package models

import "time"

type Rating struct {
	ID          string    `db:"id"`
	DriverID    string    `db:"driver_id"`
	WorkerID    string    `db:"worker_id"`
	Rating      int       `db:"rating"`
	Description string    `db:"description"`
	CreatedAt   time.Time `db:"created_at"`
	UpdatedAt   time.Time `db:"updated_at"`
}
