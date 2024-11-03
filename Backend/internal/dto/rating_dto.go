package dto

type RateDriverRequest struct {
	DriverID    string `json:"driver_id" binding:"required"`
	Rating      int    `json:"rating" binding:"required,min=1,max=5"`
	Description string `json:"description" binding:"required"`
}
