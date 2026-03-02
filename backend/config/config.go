package config

import (
	"os"
)

// Config holds the application configuration
type Config struct {
	Port              string
	Environment       string
	MaxFileSize       int64
	AllowedFileTypes  []string
	StoragePath       string
	UploadDirectory   string
	DataDirectory     string
}

// NewConfig creates a new configuration from environment variables
func NewConfig() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		MaxFileSize:     1073741824, // 1GB in bytes
		AllowedFileTypes: []string{".pdf", ".jpg", ".jpeg", ".png", ".docx", ".doc", ".xlsx", ".pptx"},
		StoragePath:     getEnv("STORAGE_PATH", "./data"),
		UploadDirectory: getEnv("UPLOAD_DIR", "./uploads"),
		DataDirectory:   getEnv("DATA_DIR", "./data"),
	}
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
