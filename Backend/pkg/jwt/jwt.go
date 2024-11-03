package jwt

import "github.com/google/uuid"

// generateUUID returns a pointer to a new UUID string
func GenerateUUID() *string {
	uuidStr := uuid.New().String()
	return &uuidStr
}
