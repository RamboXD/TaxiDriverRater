package errors

import "net/http"

type AppError struct {
	Message    string
	StatusCode int
}

func (e *AppError) Error() string {
	return e.Message
}

func MissingFieldsError() *AppError {
	return &AppError{
		Message:    "Some required fields are missing",
		StatusCode: http.StatusBadRequest,
	}
}

func UserAlreadyExistsError() *AppError {
	return &AppError{
		Message:    "User already exists",
		StatusCode: http.StatusConflict,
	}
}

func CompanyNotFoundError() *AppError {
	return &AppError{
		Message:    "Specified company does not exist",
		StatusCode: http.StatusNotFound,
	}
}

func GenericInternalServerError() *AppError {
	return &AppError{
		Message:    "Internal server error",
		StatusCode: http.StatusInternalServerError,
	}
}

func UserNotFoundError() *AppError {
	return &AppError{
		Message:    "User not found",
		StatusCode: http.StatusNotFound,
	}
}

func IncorrectPasswordError() *AppError {
	return &AppError{
		Message:    "Incorrect password",
		StatusCode: http.StatusUnauthorized,
	}
}
