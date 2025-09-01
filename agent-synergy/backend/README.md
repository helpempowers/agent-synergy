# 🚀 Agent Synergy Backend

**FastAPI backend for Agent Synergy - Plug-and-play AI agents that work like employees**

## 🏗️ Architecture

- **Framework**: FastAPI with Python 3.12
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt
- **AI Integration**: CrewAI, LangChain, OpenAI
- **Task Queue**: Celery with Redis
- **Documentation**: Auto-generated with Swagger UI

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Virtual environment
- Supabase account
- OpenAI API key

### Installation

1. **Clone and navigate to backend**
```bash
cd agent-synergy/backend
```

2. **Create and activate virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp env_example.txt .env
# Edit .env with your actual credentials
```

5. **Run the server**
```bash
python run.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `DELETE /api/v1/users/me` - Delete user account

### Agents
- `GET /api/v1/agents` - List user's agents
- `POST /api/v1/agents` - Create new agent
- `GET /api/v1/agents/{agent_id}` - Get agent details
- `PUT /api/v1/agents/{agent_id}` - Update agent
- `DELETE /api/v1/agents/{agent_id}` - Delete agent
- `POST /api/v1/agents/{agent_id}/chat` - Chat with agent

### Conversations
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/{conversation_id}` - Get conversation
- `PUT /api/v1/conversations/{conversation_id}` - Update conversation
- `DELETE /api/v1/conversations/{conversation_id}` - Delete conversation

### Analytics
- `GET /api/v1/analytics/overview` - Get analytics overview
- `GET /api/v1/analytics/agents` - Get agent analytics
- `GET /api/v1/analytics/conversations` - Get conversation analytics

### Integrations
- `GET /api/v1/integrations` - List integrations
- `POST /api/v1/integrations/slack` - Connect Slack
- `POST /api/v1/integrations/google-sheets` - Connect Google Sheets

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Security
SECRET_KEY=your_secret_key_for_jwt_tokens
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
ENVIRONMENT=development

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

## 🗄️ Database Schema

The backend uses Supabase (PostgreSQL) with the following main tables:

- **users** - User accounts and profiles
- **agents** - AI agent configurations
- **conversations** - Chat conversations
- **messages** - Individual chat messages
- **integrations** - Third-party integrations
- **analytics** - Usage analytics and metrics

## 🤖 AI Agents

The backend supports multiple types of AI agents:

- **Support Agent** - Customer support and helpdesk
- **QA Agent** - Quality assurance and testing
- **Reporting Agent** - Data analysis and reporting
- **Virtual Assistant** - General administrative tasks
- **Lead Prospector** - Sales and lead generation
- **Custom Agent** - Customized for specific needs

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Rate limiting (planned)

## 📊 Monitoring

- Health check endpoint
- Request logging
- Error tracking
- Performance metrics
- Cost tracking for AI usage

## 🧪 Testing

Run tests with:
```bash
python -m pytest test_basic.py
```

## 🚀 Deployment

### Development
```bash
python run.py
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 API Documentation

Interactive API documentation is available at `/docs` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software for Agent Synergy.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
