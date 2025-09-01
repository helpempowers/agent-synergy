# 📚 Agent Synergy API Documentation

**Complete API reference for Agent Synergy backend**

## 🔗 Base URL

```
http://localhost:8000
```

## 🔐 Authentication

All API endpoints (except auth endpoints) require JWT Bearer token authentication.

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

## 📋 API Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "company_name": "Example Corp",
  "company_size": "50-100",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "company_name": "Example Corp",
  "company_size": "50-100",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Login User
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "company_name": "Example Corp",
    "company_size": "50-100",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_verified": false
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
```

**Headers:**
```
Authorization: Bearer <current_token>
```

**Response:**
```json
{
  "access_token": "new_jwt_token_here",
  "token_type": "bearer"
}
```

#### Logout
```http
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### 👤 Users

#### Get Current User
```http
GET /api/v1/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "company_name": "Example Corp",
  "company_size": "50-100",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "last_login": "2024-01-01T00:00:00Z"
}
```

#### Update Current User
```http
PUT /api/v1/users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "company_name": "Updated Corp",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### 🤖 Agents

#### Create Agent
```http
POST /api/v1/agents
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "name": "Support Agent",
  "agent_type": "support",
  "description": "Customer support agent",
  "config": {
    "company_name": "Example Corp",
    "response_tone": "professional",
    "max_response_length": 500
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Support Agent",
  "agent_type": "support",
  "description": "Customer support agent",
  "config": {
    "company_name": "Example Corp",
    "response_tone": "professional",
    "max_response_length": 500
  },
  "status": "inactive",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get User Agents
```http
GET /api/v1/agents
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Support Agent",
    "agent_type": "support",
    "description": "Customer support agent",
    "config": {},
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Agent by ID
```http
GET /api/v1/agents/{agent_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Update Agent
```http
PUT /api/v1/agents/{agent_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Agent Name",
  "description": "Updated description",
  "status": "active"
}
```

#### Delete Agent
```http
DELETE /api/v1/agents/{agent_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Chat with Agent
```http
POST /api/v1/agents/{agent_id}/chat
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "Hello, I need help with my order",
  "conversation_type": "support_ticket",
  "metadata": {
    "priority": "high",
    "category": "billing"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "agent_id": "uuid",
  "user_id": "uuid",
  "message": "Hello, I need help with my order",
  "conversation_type": "support_ticket",
  "metadata": {
    "priority": "high",
    "category": "billing"
  },
  "response": "I'd be happy to help you with your order. Could you please provide your order number?",
  "status": "completed",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 💬 Conversations

#### Create Conversation
```http
POST /api/v1/conversations
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "agent_id": "uuid",
  "title": "Support Request",
  "conversation_type": "support_ticket",
  "metadata": {
    "priority": "high"
  }
}
```

#### Get Conversations
```http
GET /api/v1/conversations?agent_id=uuid&status=active&limit=50&offset=0
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `agent_id` (optional): Filter by agent ID
- `status` (optional): Filter by status
- `limit` (default: 50): Number of conversations to return
- `offset` (default: 0): Number of conversations to skip

#### Get Conversation by ID
```http
GET /api/v1/conversations/{conversation_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Update Conversation
```http
PUT /api/v1/conversations/{conversation_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "completed"
}
```

#### Delete Conversation
```http
DELETE /api/v1/conversations/{conversation_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Add Message to Conversation
```http
POST /api/v1/conversations/{conversation_id}/messages
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "user",
  "content": "Hello, how can you help me?",
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Conversation Messages
```http
GET /api/v1/conversations/{conversation_id}/messages?limit=100&offset=0
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "role": "user",
    "content": "Hello, how can you help me?",
    "timestamp": "2024-01-01T00:00:00Z",
    "metadata": {}
  },
  {
    "role": "assistant",
    "content": "I'm here to help! What do you need assistance with?",
    "timestamp": "2024-01-01T00:00:01Z",
    "metadata": {}
  }
]
```

#### Complete Conversation
```http
POST /api/v1/conversations/{conversation_id}/complete
```

**Headers:**
```
Authorization: Bearer <token>
```

### 📊 Analytics

#### Get Analytics Overview
```http
GET /api/v1/analytics/overview
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_agents": 5,
  "active_agents": 3,
  "total_conversations": 150,
  "successful_conversations": 135,
  "success_rate": 90.0,
  "time_saved_hours": 37.5,
  "cost_savings": 1875.0,
  "period": "last_30_days"
}
```

#### Get Agent Performance
```http
GET /api/v1/analytics/agents/{agent_id}/performance
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Get Conversation Analytics
```http
GET /api/v1/analytics/conversations?timeframe=30d
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `timeframe`: "7d", "30d", or "90d"

**Response:**
```json
{
  "timeframe": "30d",
  "total_conversations": 150,
  "completed_conversations": 135,
  "failed_conversations": 10,
  "active_conversations": 5,
  "success_rate": 90.0,
  "conversations_by_type": {
    "support_ticket": 100,
    "qa_test": 30,
    "report_generation": 20
  },
  "daily_conversations": {
    "2024-01-01": 5,
    "2024-01-02": 8
  }
}
```

#### Get Cost Analytics
```http
GET /api/v1/analytics/costs?timeframe=30d
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "timeframe": "30d",
  "total_cost": 45.50,
  "avg_cost_per_conversation": 0.3033,
  "total_conversations": 150,
  "cost_by_agent": {
    "agent_uuid_1": 25.30,
    "agent_uuid_2": 20.20
  },
  "daily_costs": {
    "2024-01-01": 1.50,
    "2024-01-02": 2.30
  }
}
```

#### Get ROI Analytics
```http
GET /api/v1/analytics/roi?timeframe=30d
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "timeframe": "30d",
  "total_cost": 45.50,
  "time_saved_hours": 37.5,
  "cost_savings": 1875.0,
  "net_savings": 1829.5,
  "roi_percentage": 4020.88,
  "conversations_to_break_even": 3.64,
  "total_conversations": 150,
  "is_profitable": true
}
```

### 🔗 Integrations

#### Get Integrations
```http
GET /api/v1/integrations
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Connect Slack
```http
POST /api/v1/integrations/slack
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bot_token": "xoxb-your-slack-bot-token",
  "signing_secret": "your-slack-signing-secret",
  "channel_id": "C1234567890"
}
```

#### Connect Google Sheets
```http
POST /api/v1/integrations/google-sheets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheet_name": "Sheet1",
  "credentials": {
    "type": "service_account",
    "project_id": "your-project-id"
  }
}
```

## 📝 Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "detail": "Access denied"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

## 🔧 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📋 Data Types

### Agent Types
- `support` - Customer support agent
- `qa` - Quality assurance agent
- `reporting` - Reporting agent
- `virtual_assistant` - Virtual assistant
- `lead_prospector` - Lead prospector
- `custom` - Custom agent

### Agent Status
- `inactive` - Agent is inactive
- `active` - Agent is active
- `training` - Agent is training
- `error` - Agent has an error
- `maintenance` - Agent is in maintenance

### Conversation Types
- `support_ticket` - Support ticket
- `qa_test` - QA test
- `report_generation` - Report generation
- `admin_task` - Administrative task
- `custom` - Custom conversation

### Conversation Status
- `active` - Conversation is active
- `completed` - Conversation is completed
- `archived` - Conversation is archived
- `failed` - Conversation failed

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   cd agent-synergy/backend
   python run.py
   ```

2. **Access interactive docs:**
   ```
   http://localhost:8000/docs
   ```

3. **Register a user:**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
          "email": "user@example.com",
          "password": "password123",
          "confirm_password": "password123",
          "company_name": "Example Corp"
        }'
   ```

4. **Login to get token:**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
          "email": "user@example.com",
          "password": "password123"
        }'
   ```

5. **Use the token for authenticated requests:**
   ```bash
   curl -X GET "http://localhost:8000/api/v1/users/me" \
        -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## 📚 Additional Resources

- **Interactive API Docs:** http://localhost:8000/docs
- **ReDoc Documentation:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json
- **Health Check:** http://localhost:8000/health
