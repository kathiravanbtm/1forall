package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/oneforall/backend/handlers"
	"github.com/oneforall/backend/storage"
)

// SetupRoutes configures all API routes
func SetupRoutes(store *storage.JSONStorage) *gin.Engine {
	router := gin.Default()

	// Add CORS middleware
	router.Use(CORSMiddleware())

	// Health check endpoint
	router.GET("/health", handlers.HealthCheck)

	// API v1 routes
	api := router.Group("/api")
	{
		// Exam routes
		examHandler := handlers.NewExamHandler(store)
		exams := api.Group("/exams")
		{
			exams.GET("", examHandler.GetAllExams)
			exams.GET("/:id", examHandler.GetExamByID)
		}

		// Tools routes
		toolHandler := handlers.NewToolHandler(store)
		tools := api.Group("/tools")
		{
			tools.GET("", toolHandler.GetAllTools)
		}

		// Conversion routes
		convHandler := handlers.NewConversionHandler(store)
		conversions := api.Group("/conversions")
		{
			conversions.POST("/request", convHandler.RequestConversion)
			conversions.GET("/:id", convHandler.GetConversionStatus)
			conversions.GET("/user/:user_id", convHandler.GetUserConversions)
		}
	}

	return router
}

// CORSMiddleware handles CORS headers for frontend communication
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
