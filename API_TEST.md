# 🧪 API Testing Guide for Agent Synergy

## 📋 Current API Status

Based on our testing, here's the current status:

### ✅ Working Endpoints:
- `GET /health` - Health check
- `GET /docs` - API documentation
- `GET /api/v1/users/me` - User profile (returns "Not authenticated" as expected)

### ❌ Not Working (Due to Database):
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- All other authenticated endpoints

## 🔧 Complete API Test Suite

### 1. Health Check
```bash
curl -X GET "http://localhost:8000/health" \
  -H "accept: application/json"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "agent-synergy-api",
  "version": "1.0.0"
}
```

### 2. API Documentation
```bash
curl -X GET "http://localhost:8000/docs" \
  -H "accept: text/html"
```

**Expected Response:** HTML page with Swagger UI

### 3. Authentication Test (Unauthenticated)
```bash
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "accept: application/json"
```

**Expected Response:**
```json
{
  "detail": "Not authenticated"
}
```

### 4. User Registration (Will fail until Supabase is set up)
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "confirm_password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company",
    "company_size": "10-50"
  }'
```

**Expected Response (after Supabase setup):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company",
    "is_active": true,
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 5. User Login (Will fail until Supabase is set up)
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 6. Authenticated Endpoints (After Login)

#### Get Current User
```bash
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "accept: application/json"
```

#### Get All Agents
```bash
curl -X GET "http://localhost:8000/api/v1/agents" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "accept: application/json"
```

#### Create Agent
```bash
curl -X POST "http://localhost:8000/api/v1/agents" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Bot",
    "agent_type": "support",
    "description": "AI agent for customer support",
    "config": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7
    }
  }'
```

#### Get All Conversations
```bash
curl -X GET "http://localhost:8000/api/v1/conversations" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "accept: application/json"
```

#### Get Analytics
```bash
curl -X GET "http://localhost:8000/api/v1/analytics/overview" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "accept: application/json"
```

## 🚀 Automated Test Script

Create a test script to run all tests:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"
TOKEN=""

echo "🧪 Starting API Tests..."
echo "================================"

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH_RESPONSE=$(curl -s -X GET "$BASE_URL/health" -H "accept: application/json")
echo "Response: $HEALTH_RESPONSE"
echo ""

# Test 2: API Docs
echo "2. Testing API Documentation..."
DOCS_RESPONSE=$(curl -s -X GET "$BASE_URL/docs" -H "accept: text/html" | head -1)
echo "Response: $DOCS_RESPONSE"
echo ""

# Test 3: Unauthenticated User
echo "3. Testing Unauthenticated User..."
UNAUTH_RESPONSE=$(curl -s -X GET "$BASE_URL/api/v1/users/me" -H "accept: application/json")
echo "Response: $UNAUTH_RESPONSE"
echo ""

# Test 4: User Registration (will fail without Supabase)
echo "4. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "confirm_password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company"
  }')
echo "Response: $REGISTER_RESPONSE"
echo ""

echo "✅ API Tests Complete!"
echo "📝 Note: Registration and authenticated endpoints will fail until Supabase is configured"
```

## 🔍 Manual Testing Checklist

### Before Supabase Setup:
- [ ] Health check returns 200 OK
- [ ] API docs are accessible
- [ ] Unauthenticated requests return proper error
- [ ] Registration returns database error (expected)

### After Supabase Setup:
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated correctly
- [ ] Authenticated endpoints work
- [ ] CRUD operations work for all entities
- [ ] Error handling works properly

## 🐛 Common Issues & Solutions

### 1. "Database not initialized" Error
**Cause:** Supabase not configured
**Solution:** Follow the Supabase setup guide

### 2. "Invalid URL" Error
**Cause:** Wrong Supabase URL format
**Solution:** Check URL format: `https://your-project.supabase.co`

### 3. "Invalid API key" Error
**Cause:** Wrong or expired API key
**Solution:** Regenerate API key in Supabase dashboard

### 4. "Table does not exist" Error
**Cause:** Database tables not created
**Solution:** Run the SQL commands in Supabase SQL Editor

### 5. CORS Errors
**Cause:** Frontend trying to access API from different origin
**Solution:** Check CORS configuration in backend

## 📊 API Endpoints Summary

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/health` | ✅ Working | Health check |
| GET | `/docs` | ✅ Working | API documentation |
| GET | `/api/v1/users/me` | ✅ Working* | Get current user |
| POST | `/api/v1/auth/register` | ❌ Needs DB | User registration |
| POST | `/api/v1/auth/login` | ❌ Needs DB | User login |
| GET | `/api/v1/agents` | ❌ Needs DB | Get all agents |
| POST | `/api/v1/agents` | ❌ Needs DB | Create agent |
| GET | `/api/v1/conversations` | ❌ Needs DB | Get conversations |
| GET | `/api/v1/analytics/overview` | ❌ Needs DB | Get analytics |

*Returns "Not authenticated" when no token provided (expected behavior)

## 🎯 Next Steps

1. **Set up Supabase** following the setup guide
2. **Run the SQL commands** to create tables
3. **Configure environment variables**
4. **Test all endpoints** with the test script
5. **Verify mobile and web apps** can connect to the API
