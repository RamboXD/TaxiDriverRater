package dto

// CompanyRegisterRequest represents the request body for registering a company
type CompanyRegisterRequest struct {
	IIN            string  `json:"iin" binding:"required"`
	BIN            string  `json:"bin" binding:"required"`
	Address        string  `json:"address" binding:"required"`
	Name           string  `json:"name" binding:"required"`
	HeadName       string  `json:"head_name" binding:"required"`
	HeadSurname    string  `json:"head_surname" binding:"required"`
	HeadPatronymic *string `json:"head_patronymic"`
}

// CompanyRegisterResponse represents the response after registering a company
type CompanyRegisterResponse struct {
	Message string `json:"message"`
}
