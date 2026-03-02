# 1forall Backend

A Go-based backend server for the 1forall file conversion application. Currently uses JSON for data storage with plans to integrate Supabase or other databases.

## Features

- 📄 RESTful API for exam and conversion management
- 📦 JSON-based data storage (easily migrate to databases)
- 🚀 Fast and efficient file processing
- 🔄 Real-time conversion status tracking
- 📱 CORS enabled for frontend communication
- 🎯 Modular architecture for easy scaling

## Project Structure

```
backend/
├── config/
│   └── config.go          # Configuration management
├── handlers/
│   └── handlers.go        # API request handlers
├── models/
│   └── models.go          # Data models
├── routes/
│   └── routes.go          # API routes setup
├── storage/
│   └── json_storage.go    # JSON storage implementation
├── main.go                # Application entry point
├── go.mod                 # Go module dependencies
├── .env                   # Environment variables
└── .env.example           # Example environment variables
```

## Quick Start

### Prerequisites

- Go 1.21 or higher
- Git

### Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Run the server:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get specific exam details

### Tools
- `GET /api/tools` - Get all conversion tools

### Conversions
- `POST /api/conversions/request` - Create a new conversion request
- `GET /api/conversions/:id` - Get conversion status
- `GET /api/conversions/user/:user_id` - Get user's conversions

## Example Requests

### Create a Conversion Request
```bash
curl -X POST http://localhost:8080/api/conversions/request \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "exam_id": "jee-main",
    "document_id": "admit-card",
    "file_name": "admit_card.pdf",
    "file_size": 1024000
  }'
```

### Get Conversion Status
```bash
curl http://localhost:8080/api/conversions/conv-id-123
```

### Get All Exams
```bash
curl http://localhost:8080/api/exams
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=8080
ENVIRONMENT=development
UPLOAD_DIR=./uploads
DATA_DIR=./data
MAX_FILE_SIZE=1073741824
API_VERSION=v1
API_PREFIX=/api
```

## Data Storage

### Current Implementation (JSON)

- Exams: `./data/exams.json`
- Tools: `./data/tools.json`
- Conversions: `./data/conversions.json`

### Future Database Integration

The architecture is designed to easily support database migration:

1. **Supabase (PostgreSQL)** - Recommended for quick setup
2. **Firebase** - For real-time features
3. **MongoDB** - For flexible schema

To migrate:
1. Create a new storage interface implementation
2. Update `main.go` to use the new storage
3. No changes needed in handlers or routes

## Development

### Dependencies

- `github.com/gin-gonic/gin` - Web framework
- `github.com/joho/godotenv` - Environment variable management
- `github.com/google/uuid` - UUID generation

### Adding New Endpoints

1. Create handler in `handlers/handlers.go`
2. Add route in `routes/routes.go`
3. Update models if needed in `models/models.go`

### Testing

```bash
go test ./...
```

## Build for Production

```bash
go build -o 1forall-backend main.go
./1forall-backend
```

## Environment Variables

- `PORT` - Server port (default: 8080)
- `ENVIRONMENT` - dev/production (default: development)
- `UPLOAD_DIR` - Directory for file uploads (default: ./uploads)
- `DATA_DIR` - Directory for data files (default: ./data)
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 1GB)

## API Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "error": null
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Contributing

1. Follow Go conventions
2. Write clean, readable code
3. Add comments for public functions
4. Test your changes

## License

MIT

## Future Improvements

- [ ] Database integration (Supabase/PostgreSQL)
- [ ] File upload handling
- [ ] Actual file conversion processing
- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] Caching layer
- [ ] WebSocket for real-time updates
- [ ] Docker containerization
- [ ] Kubernetes deployment

## Support

For issues and questions, please open an issue on GitHub.
