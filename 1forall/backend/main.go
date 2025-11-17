package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/oneforall/backend/config"
	"github.com/oneforall/backend/routes"
	"github.com/oneforall/backend/storage"
)

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
}

func main() {
	// Initialize storage (JSON for now)
	store := storage.NewJSONStorage()
	if err := store.Initialize(); err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Get server configuration
	cfg := config.NewConfig()

	// Setup routes
	router := routes.SetupRoutes(store)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.Port
	}

	log.Printf("🚀 Starting 1forall backend server on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
