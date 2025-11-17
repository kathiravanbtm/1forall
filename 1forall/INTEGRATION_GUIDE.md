# Frontend-Backend Integration Guide

## 🔗 Connecting React Native Frontend to Go Backend

### Step 1: Update Environment Configuration

Create or update `.env` files in both projects:

**Frontend** - `1forall/.env` (if not exists):
```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_ENV=development
```

**Backend** - `backend/.env` (already configured):
```env
PORT=8080
ENVIRONMENT=development
```

### Step 2: Create API Service Layer (Frontend)

Create `1forall/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Exams
export const getExams = async () => {
  const response = await apiClient.get('/api/exams');
  return response.data;
};

export const getExamById = async (examId: string) => {
  const response = await apiClient.get(`/api/exams/${examId}`);
  return response.data;
};

// Tools
export const getTools = async () => {
  const response = await apiClient.get('/api/tools');
  return response.data;
};

// Conversions
export const requestConversion = async (data: {
  user_id: string;
  exam_id: string;
  document_id: string;
  file_name: string;
  file_size: number;
}) => {
  const response = await apiClient.post('/api/conversions/request', data);
  return response.data;
};

export const getConversionStatus = async (conversionId: string) => {
  const response = await apiClient.get(`/api/conversions/${conversionId}`);
  return response.data;
};

export const getUserConversions = async (userId: string) => {
  const response = await apiClient.get(`/api/conversions/user/${userId}`);
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
```

### Step 3: Update Frontend Components to Use Backend

Update `1forall/app/(tabs)/index.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { getExams } from '@/services/api';

export default function HomeScreen() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getExams();
        setExams(response.data);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        // Fallback to local data
        const localExams = require('@/assets/data/exams.json');
        setExams(localExams);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Rest of the component...
}
```

### Step 4: Update Tools Page

Update `1forall/app/(tabs)/explore.tsx`:

```typescript
import { getTools } from '@/services/api';

export default function ToolsScreen() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await getTools();
        setToolCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
        // Fallback to local data
        const localTools = require('@/assets/data/tools.json');
        setToolCategories(localTools);
      }
    };

    fetchTools();
  }, []);

  // Rest of the component...
}
```

### Step 5: Install Axios (if using)

```bash
cd 1forall
npm install axios
```

Or use React Native's built-in `fetch`:

```typescript
const response = await fetch(`${API_BASE_URL}/api/exams`);
const data = await response.json();
```

## 🧪 Testing the Integration

### 1. Start Backend Server
```bash
cd backend
make dev
# or
go run main.go
```

### 2. Start Frontend
```bash
cd 1forall
npm start
```

### 3. Test API Calls

Use a tool like Postman or curl:

```bash
# Test exams endpoint
curl http://localhost:8080/api/exams

# Test tools endpoint
curl http://localhost:8080/api/tools

# Test health check
curl http://localhost:8080/health
```

### 4. Check Network Requests

In Expo DevTools, monitor network activity to see all API calls.

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution:** CORS is already enabled in the backend. If issues persist:
```go
// In backend/routes/routes.go
c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
```

### Issue: Connection Refused
**Solution:** Make sure backend is running on port 8080:
```bash
# Check if port is in use
lsof -i :8080

# Kill process if needed
kill -9 <PID>
```

### Issue: ENOTFOUND localhost
**Solution:** Use machine's actual IP address instead of localhost:
```typescript
const API_BASE_URL = 'http://192.168.x.x:8080'; // Your machine IP
```

### Issue: Timeout Errors
**Solution:** Increase timeout and add retry logic:
```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increase to 30 seconds
});

// Add retry logic
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 503) {
      // Retry after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

## 📊 API Response Handling

All API responses follow a consistent format:

```typescript
interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

Handle responses properly:

```typescript
try {
  const response = await getExams();
  
  if (response.success) {
    setExams(response.data);
  } else {
    console.error(response.error);
  }
} catch (error) {
  console.error('API Error:', error);
  // Show error to user
}
```

## 🔄 State Management (Future)

For larger applications, consider using Redux or Zustand:

```bash
npm install zustand
# or
npm install @reduxjs/toolkit react-redux
```

Example with Zustand:

```typescript
import create from 'zustand';

interface ExamStore {
  exams: Exam[];
  loading: boolean;
  fetchExams: () => Promise<void>;
}

export const useExamStore = create<ExamStore>((set) => ({
  exams: [],
  loading: false,
  fetchExams: async () => {
    set({ loading: true });
    try {
      const response = await getExams();
      set({ exams: response.data });
    } finally {
      set({ loading: false });
    }
  },
}));
```

## 🌍 Production Deployment

### Backend Deployment URLs

**AWS**:
```
https://1forall-backend-aws.herokuapp.com
```

**Heroku**:
```
https://1forall-backend.herokuapp.com
```

**Railway**:
```
https://1forall-backend.railway.app
```

Update frontend environment:

```env
EXPO_PUBLIC_API_URL=https://1forall-backend.example.com
```

## 📝 Data Flow Diagram

```
Frontend (React Native)
    │
    ├─→ useEffect hook
    │
    ├─→ API Service (axios/fetch)
    │
    └─→ HTTP Request
              │
              ↓
Backend (Go)
    │
    ├─→ Router (Gin)
    │
    ├─→ Handler
    │
    ├─→ Storage (JSON → DB)
    │
    └─→ HTTP Response
              │
              ↓
Frontend (React Native)
    │
    ├─→ Parse JSON
    │
    ├─→ setState
    │
    └─→ Re-render UI
```

## ✅ Integration Checklist

- [ ] Backend running on port 8080
- [ ] Frontend can reach backend
- [ ] API responses are being received
- [ ] Exams load from backend
- [ ] Tools load from backend
- [ ] Conversion requests can be created
- [ ] Conversion status can be tracked
- [ ] CORS is working properly
- [ ] Error handling is in place
- [ ] Fallback to local data works

## 🚀 Next Steps

1. **File Upload**: Implement file upload endpoint in backend
2. **Authentication**: Add JWT authentication
3. **Caching**: Add response caching
4. **Error Handling**: Enhanced error messages
5. **Logging**: Server-side logging
6. **Monitoring**: Set up error tracking (Sentry)

---

Happy integrating! 🎉
