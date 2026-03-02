package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/oneforall/backend/models"
	"github.com/oneforall/backend/storage"
)

// ExamHandler handles exam-related requests
type ExamHandler struct {
	store *storage.JSONStorage
}

// NewExamHandler creates a new exam handler
func NewExamHandler(store *storage.JSONStorage) *ExamHandler {
	return &ExamHandler{store: store}
}

// GetAllExams returns all available exams
// @Summary Get all exams
// @Description Get a list of all entrance exams
// @Tags exams
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /api/exams [get]
func (h *ExamHandler) GetAllExams(c *gin.Context) {
	exams, err := h.store.GetExams()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Exams retrieved successfully",
		Data:    exams,
	})
}

// GetExamByID returns a specific exam by ID
// @Summary Get exam by ID
// @Description Get detailed information about a specific exam
// @Tags exams
// @Accept json
// @Produce json
// @Param id path string true "Exam ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /api/exams/:id [get]
func (h *ExamHandler) GetExamByID(c *gin.Context) {
	examID := c.Param("id")

	exam, err := h.store.GetExamByID(examID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Exam not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Exam retrieved successfully",
		Data:    exam,
	})
}

// ToolHandler handles tool-related requests
type ToolHandler struct {
	store *storage.JSONStorage
}

// NewToolHandler creates a new tool handler
func NewToolHandler(store *storage.JSONStorage) *ToolHandler {
	return &ToolHandler{store: store}
}

// GetAllTools returns all available tools
// @Summary Get all tools
// @Description Get a list of all file conversion tools
// @Tags tools
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /api/tools [get]
func (h *ToolHandler) GetAllTools(c *gin.Context) {
	tools, err := h.store.GetTools()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Tools retrieved successfully",
		Data:    tools,
	})
}

// ConversionHandler handles file conversion requests
type ConversionHandler struct {
	store *storage.JSONStorage
}

// NewConversionHandler creates a new conversion handler
func NewConversionHandler(store *storage.JSONStorage) *ConversionHandler {
	return &ConversionHandler{store: store}
}

// RequestConversion creates a new file conversion request
// @Summary Request file conversion
// @Description Create a new file conversion request
// @Tags conversions
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "Conversion request data"
// @Success 201 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Router /api/conversions/request [post]
func (h *ConversionHandler) RequestConversion(c *gin.Context) {
	var req struct {
		UserID     string `json:"user_id" binding:"required"`
		ExamID     string `json:"exam_id" binding:"required"`
		DocumentID string `json:"document_id" binding:"required"`
		FileName   string `json:"file_name" binding:"required"`
		FileSize   int64  `json:"file_size" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	conv, err := h.store.CreateConversion(req.UserID, req.ExamID, req.DocumentID, req.FileName, req.FileSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Conversion request created successfully",
		Data: models.ConversionResponse{
			ID:       conv.ID,
			Status:   conv.Status,
			Progress: 0,
			Message:  "Conversion queued",
		},
	})
}

// GetConversionStatus retrieves the status of a conversion request
// @Summary Get conversion status
// @Description Get the status and details of a conversion request
// @Tags conversions
// @Accept json
// @Produce json
// @Param id path string true "Conversion ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /api/conversions/:id [get]
func (h *ConversionHandler) GetConversionStatus(c *gin.Context) {
	conversionID := c.Param("id")

	conv, err := h.store.GetConversionByID(conversionID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Conversion not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Conversion status retrieved",
		Data: models.ConversionResponse{
			ID:        conv.ID,
			Status:    conv.Status,
			InputFile: conv.FileName,
			Message:   "Conversion in progress",
		},
	})
}

// GetUserConversions retrieves all conversions for a user
// @Summary Get user conversions
// @Description Get all conversion requests for a specific user
// @Tags conversions
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} models.APIResponse
// @Router /api/conversions/user/:user_id [get]
func (h *ConversionHandler) GetUserConversions(c *gin.Context) {
	userID := c.Param("user_id")

	conversions, err := h.store.GetUserConversions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "User conversions retrieved successfully",
		Data:    conversions,
	})
}

// HealthCheck endpoint
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"message": "1forall backend is running",
	})
}
