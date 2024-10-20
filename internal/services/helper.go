package services

import "github.com/google/uuid"

// generateUUID returns a pointer to a new UUID string
func generateUUID() *string {
	uuidStr := uuid.New().String()
	return &uuidStr
}
