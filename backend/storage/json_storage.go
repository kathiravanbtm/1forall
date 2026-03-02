package storage

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/oneforall/backend/models"
)

// JSONStorage handles JSON file-based storage
type JSONStorage struct {
	dataDir              string
	examsFile            string
	toolsFile            string
	conversionsFile      string
	mu                   sync.RWMutex
	exams                []models.Exam
	tools                []models.ToolCategory
	conversions          []models.ConversionRequest
}

// NewJSONStorage creates a new JSON storage instance
func NewJSONStorage() *JSONStorage {
	return &JSONStorage{
		dataDir:         "./data",
		examsFile:       "./data/exams.json",
		toolsFile:       "./data/tools.json",
		conversionsFile: "./data/conversions.json",
		exams:           []models.Exam{},
		tools:           []models.ToolCategory{},
		conversions:     []models.ConversionRequest{},
	}
}

// Initialize sets up the storage directories and loads data
func (js *JSONStorage) Initialize() error {
	// Create data directory if it doesn't exist
	if err := os.MkdirAll(js.dataDir, 0755); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}

	// Create uploads directory
	uploadsDir := filepath.Join(js.dataDir, "uploads")
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		return fmt.Errorf("failed to create uploads directory: %w", err)
	}

	// Load all data
	if err := js.loadExams(); err != nil {
		log.Printf("Failed to load exams: %v", err)
		// Initialize with empty exams if file doesn't exist
		js.exams = []models.Exam{}
	}

	if err := js.loadTools(); err != nil {
		log.Printf("Failed to load tools: %v", err)
		js.tools = []models.ToolCategory{}
	}

	if err := js.loadConversions(); err != nil {
		log.Printf("Failed to load conversions: %v", err)
		js.conversions = []models.ConversionRequest{}
	}

	log.Println("✓ Storage initialized successfully")
	return nil
}

// loadExams loads exams from JSON file
func (js *JSONStorage) loadExams() error {
	data, err := ioutil.ReadFile(js.examsFile)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &js.exams)
}

// loadTools loads tools from JSON file
func (js *JSONStorage) loadTools() error {
	data, err := ioutil.ReadFile(js.toolsFile)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &js.tools)
}

// loadConversions loads conversions from JSON file
func (js *JSONStorage) loadConversions() error {
	data, err := ioutil.ReadFile(js.conversionsFile)
	if err != nil {
		if os.IsNotExist(err) {
			return nil // File doesn't exist yet, that's fine
		}
		return err
	}
	return json.Unmarshal(data, &js.conversions)
}

// saveConversions persists conversions to JSON file
func (js *JSONStorage) saveConversions() error {
	data, err := json.MarshalIndent(js.conversions, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile(js.conversionsFile, data, 0644)
}

// GetExams returns all exams
func (js *JSONStorage) GetExams() ([]models.Exam, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()
	return js.exams, nil
}

// GetExamByID returns a specific exam by ID
func (js *JSONStorage) GetExamByID(examID string) (*models.Exam, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()

	for _, exam := range js.exams {
		if exam.ID == examID {
			return &exam, nil
		}
	}
	return nil, fmt.Errorf("exam not found: %s", examID)
}

// GetTools returns all tools
func (js *JSONStorage) GetTools() ([]models.ToolCategory, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()
	return js.tools, nil
}

// CreateConversion creates a new conversion request
func (js *JSONStorage) CreateConversion(userID, examID, documentID, fileName string, fileSize int64) (*models.ConversionRequest, error) {
	js.mu.Lock()
	defer js.mu.Unlock()

	conv := models.ConversionRequest{
		ID:         uuid.New().String(),
		UserID:     userID,
		ExamID:     examID,
		DocumentID: documentID,
		FileName:   fileName,
		FileSize:   fileSize,
		Status:     "pending",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	js.conversions = append(js.conversions, conv)

	if err := js.saveConversions(); err != nil {
		return nil, fmt.Errorf("failed to save conversion: %w", err)
	}

	return &conv, nil
}

// GetConversionByID retrieves a conversion request by ID
func (js *JSONStorage) GetConversionByID(conversionID string) (*models.ConversionRequest, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()

	for _, conv := range js.conversions {
		if conv.ID == conversionID {
			return &conv, nil
		}
	}
	return nil, fmt.Errorf("conversion not found: %s", conversionID)
}

// UpdateConversion updates a conversion request
func (js *JSONStorage) UpdateConversion(conversionID, status, errorMsg string) error {
	js.mu.Lock()
	defer js.mu.Unlock()

	for i, conv := range js.conversions {
		if conv.ID == conversionID {
			js.conversions[i].Status = status
			js.conversions[i].ErrorMsg = errorMsg
			js.conversions[i].UpdatedAt = time.Now()

			if err := js.saveConversions(); err != nil {
				return fmt.Errorf("failed to save conversion: %w", err)
			}
			return nil
		}
	}
	return fmt.Errorf("conversion not found: %s", conversionID)
}

// GetUserConversions retrieves all conversions for a specific user
func (js *JSONStorage) GetUserConversions(userID string) ([]models.ConversionRequest, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()

	var userConversions []models.ConversionRequest
	for _, conv := range js.conversions {
		if conv.UserID == userID {
			userConversions = append(userConversions, conv)
		}
	}
	return userConversions, nil
}

// GetConversionsByExam retrieves all conversions for a specific exam
func (js *JSONStorage) GetConversionsByExam(examID string) ([]models.ConversionRequest, error) {
	js.mu.RLock()
	defer js.mu.RUnlock()

	var examConversions []models.ConversionRequest
	for _, conv := range js.conversions {
		if conv.ExamID == examID {
			examConversions = append(examConversions, conv)
		}
	}
	return examConversions, nil
}
