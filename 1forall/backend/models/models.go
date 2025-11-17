package models

import "time"

// Exam represents an entrance exam
type Exam struct {
	ID          string      `json:"id"`
	Title       string      `json:"title"`
	Icon        string      `json:"icon"`
	Description string      `json:"description"`
	Documents   []Document  `json:"documents"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// Document represents a required document for an exam
type Document struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Size     string `json:"size"`
	Format   string `json:"format"`
	MaxSize  int64  `json:"max_size"`
	Required bool   `json:"required"`
}

// ConversionRequest represents a file conversion request
type ConversionRequest struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	ExamID     string    `json:"exam_id"`
	DocumentID string    `json:"document_id"`
	FileName   string    `json:"file_name"`
	FileSize   int64     `json:"file_size"`
	InputPath  string    `json:"input_path"`
	OutputPath string    `json:"output_path"`
	Status     string    `json:"status"` // pending, processing, completed, failed
	ErrorMsg   string    `json:"error_msg,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Tool represents a conversion tool
type Tool struct {
	ID          string `json:"id"`
	Category    string `json:"category"`
	Icon        string `json:"icon"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Logo        string `json:"logo"`
}

// ToolCategory represents a category of tools
type ToolCategory struct {
	ID       string `json:"id"`
	Category string `json:"category"`
	Icon     string `json:"icon"`
	Tools    []Tool `json:"tools"`
}

// APIResponse is a generic API response wrapper
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// UploadResponse represents the response after file upload
type UploadResponse struct {
	ID        string `json:"id"`
	FileName  string `json:"file_name"`
	FileSize  int64  `json:"file_size"`
	Path      string `json:"path"`
	Status    string `json:"status"`
	Message   string `json:"message"`
}

// ConversionResponse represents the response for a conversion operation
type ConversionResponse struct {
	ID         string `json:"id"`
	Status     string `json:"status"`
	InputFile  string `json:"input_file"`
	OutputFile string `json:"output_file,omitempty"`
	Progress   int    `json:"progress"`
	Message    string `json:"message"`
}

// PaginationQuery represents pagination parameters
type PaginationQuery struct {
	Page  int `form:"page" binding:"min=1"`
	Limit int `form:"limit" binding:"min=1,max=100"`
}
