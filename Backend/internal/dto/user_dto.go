package dto

type UserRegisterRequest struct {
	Email      string  `json:"email" binding:"required,email"`
	Password   string  `json:"password" binding:"required,min=6"`
	CompanyID  string  `json:"company_id" binding:"required"`
	IIN        string  `json:"iin" binding:"required"`
	Name       string  `json:"name" binding:"required"`
	Surname    string  `json:"surname" binding:"required"`
	Patronymic *string `json:"patronymic"`
}

type UserRegisterResponse struct {
	Message string `json:"message"`
}
