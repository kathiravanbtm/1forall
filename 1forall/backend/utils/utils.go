package utils

import (
	"mime/multipart"
	"path/filepath"
	"strings"
)

// AllowedExtensions defines the file extensions that are allowed
var AllowedExtensions = map[string]bool{
	".pdf":   true,
	".doc":   true,
	".docx":  true,
	".xls":   true,
	".xlsx":  true,
	".ppt":   true,
	".pptx":  true,
	".jpg":   true,
	".jpeg":  true,
	".png":   true,
	".gif":   true,
	".webp":  true,
	".mp3":   true,
	".wav":   true,
	".aac":   true,
	".m4a":   true,
	".mp4":   true,
	".avi":   true,
	".mov":   true,
	".webm":  true,
	".mkv":   true,
}

// IsValidFileExtension checks if a file extension is allowed
func IsValidFileExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	_, exists := AllowedExtensions[ext]
	return exists
}

// ValidateFileSize checks if file size is within limits
func ValidateFileSize(fileSize int64, maxSize int64) bool {
	return fileSize > 0 && fileSize <= maxSize
}

// GetFileExtension extracts the file extension
func GetFileExtension(filename string) string {
	return strings.ToLower(filepath.Ext(filename))
}

// ValidateFileHeader checks the file MIME type using header bytes
func ValidateFileHeader(file *multipart.FileHeader) (bool, string) {
	// This would typically read file header bytes to validate
	// For now, we'll just validate based on extension
	return IsValidFileExtension(file.Filename), GetFileExtension(file.Filename)
}

// SanitizeFileName removes potentially dangerous characters from filename
func SanitizeFileName(filename string) string {
	// Remove path separators
	filename = strings.ReplaceAll(filename, "/", "_")
	filename = strings.ReplaceAll(filename, "\\", "_")
	
	// Remove special characters but keep dots and dashes
	illegal := []string{"<", ">", ":", "\"", "|", "?", "*"}
	for _, char := range illegal {
		filename = strings.ReplaceAll(filename, char, "_")
	}
	
	return filename
}

// ConversionStatusConstants
const (
	StatusPending    = "pending"
	StatusProcessing = "processing"
	StatusCompleted  = "completed"
	StatusFailed     = "failed"
)

// IsValidStatus checks if the status is valid
func IsValidStatus(status string) bool {
	validStatuses := map[string]bool{
		StatusPending:    true,
		StatusProcessing: true,
		StatusCompleted:  true,
		StatusFailed:     true,
	}
	return validStatuses[status]
}
