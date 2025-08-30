# 🚀 Agent Synergy Backend

*Plug-and-play AI agents that work like employees*

## 📋 Overview

Agent Synergy is a FastAPI-based backend service that provides AI agent management, conversation handling, and analytics for mid-market companies. The system enables companies to deploy, configure, and monitor AI agents that can handle customer support, QA testing, reporting, and other business tasks.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Agent API     │    │ • OpenAI GPT-4o │
│ • Agent Config  │    │ • Auth/Users    │    │ • Slack API     │
│ • Analytics     │    │ • Integrations  │    │ • Google Sheets │
│ • Billing       │    │ • Monitoring    │    │ • Jira API      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Agent Engine  │    │   Monitoring    │
│   (Supabase)    │    │   (CrewAI)      │    │   (Grafana)     │
│                 │    │                 │    │                 │
│ • Users         │    │ • Support Agent │    │ • Uptime        │
│ • Agents        │    │ • QA Agent      │    │ • Performance   │
│ • Conversations │    │ • Workflows     │    │ • Costs         │
│ • Analytics     │    │ • Memory        │    │ • Alerts        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

- **AI Agent Management**: Create, configure, and manage different types of AI agents
- **Authentication & Authorization**: JWT-based user authentication with role-based access
- **Conversation Handling**: Process and track conversations with AI agents
- **Integration APIs**: Slack, Google Sheets, and Jira integrations
- **Analytics & ROI**: Track agent performance and calculate cost savings
- **Real-time Updates**: WebSocket support for live agent status updates

## 🛠️ Tech Stack

- **Backend Framework**: FastAPI (Python 3.8+)
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: CrewAI + LangChain
- **LLM**: OpenAI GPT-4o
- **Authentication**: JWT with bcrypt
- **API Documentation**: Auto-generated with FastAPI
- **Testing**: pytest
- **Deployment**: Docker + Docker Compose

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16+ (for frontend)
- Supabase account
- OpenAI API key
- Slack app credentials (optional)
- Google Cloud credentials (optional)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd agent-synergy/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration**
```bash
cp env_example.txt .env
# Edit .env with your actual credentials
```

5. **Database Setup**
```bash
# Create tables in Supabase (run in SQL editor)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  company_size TEXT,
  first_name TEXT,
  last_name TEXT,
  hashed_password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  description TEXT,
  config JSONB,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT,
  conversation_type TEXT NOT NULL,
  metadata JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  processing_time FLOAT,
  cost FLOAT,
  error_message TEXT,
  tokens_used INTEGER,
  model_used TEXT
);

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  platform TEXT NOT NULL,
  config JSONB,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

6. **Run the application**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `SLACK_BOT_TOKEN` | Slack bot token | No |
| `GOOGLE_SHEETS_CREDENTIALS_FILE` | Google service account file | No |

### Supabase Configuration

1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Create the required tables
4. Set up authentication policies
5. Configure storage buckets (if needed)

## 📚 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

#### Agents
- `POST /api/v1/agents/` - Create new agent
- `GET /api/v1/agents/` - List user's agents
- `GET /api/v1/agents/{id}` - Get specific agent
- `PUT /api/v1/agents/{id}` - Update agent
- `DELETE /api/v1/agents/{id}` - Delete agent
- `POST /api/v1/agents/{id}/chat` - Chat with agent

#### Integrations
- `GET /api/v1/integrations/` - List integrations
- `POST /api/v1/integrations/slack` - Configure Slack
- `POST /api/v1/integrations/google-sheets` - Configure Google Sheets
- `POST /api/v1/integrations/jira` - Configure Jira

#### Analytics
- `GET /api/v1/analytics/overview` - Analytics overview
- `GET /api/v1/analytics/roi` - ROI metrics
- `GET /api/v1/analytics/trends` - Trend analysis

## 🤖 Agent Types

### Support Agent
- Handles customer support tickets
- Answers FAQs based on company knowledge
- Escalates complex issues
- Integrates with help desk systems

### QA Agent
- Automates web/app testing
- Logs bugs and issues
- Generates test reports
- Integrates with Jira/Linear

### Reporting Agent
- Generates data-driven reports
- Analyzes business metrics
- Creates executive dashboards
- Integrates with Google Sheets

### Virtual Assistant
- Manages scheduling and calendars
- Handles email processing
- Performs administrative tasks
- Integrates with productivity tools

## 🔗 Integrations

### Slack Integration
- Bot mentions and DMs
- Channel message processing
- Automated responses
- Status updates

### Google Sheets Integration
- Read/write spreadsheet data
- Automated report generation
- Data processing workflows
- Real-time updates

### Jira Integration
- Bug logging and tracking
- Issue management
- Workflow automation
- Status synchronization

## 📊 Analytics & ROI

### Performance Metrics
- Agent uptime and reliability
- Conversation success rates
- Response time analysis
- Cost per conversation

### ROI Calculation
- Time saved per conversation
- Cost savings vs. subscription
- Break-even analysis
- Trend analysis

### Custom Dashboards
- Real-time agent status
- Performance trends
- Cost analysis
- User engagement metrics

## 🧪 Testing

### Run Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run specific test file
pytest tests/test_agents.py

# Run with coverage
pytest --cov=app tests/
```

### Test Structure
```
tests/
├── test_auth.py          # Authentication tests
├── test_agents.py        # Agent management tests
├── test_conversations.py # Conversation tests
├── test_integrations.py  # Integration tests
└── test_analytics.py     # Analytics tests
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t agent-synergy-backend .

# Run container
docker run -p 8000:8000 agent-synergy-backend

# Using docker-compose
docker-compose up -d
```

### Production Considerations
- Use environment-specific settings
- Enable HTTPS with SSL certificates
- Set up monitoring and logging
- Configure rate limiting
- Enable CORS for production domains
- Set up backup and recovery

## 🔒 Security

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt
- Role-based access control
- Token refresh mechanism

### Data Protection
- Row Level Security (RLS) in Supabase
- Encrypted API communications
- Secure credential storage
- Audit logging

### API Security
- Input validation with Pydantic
- SQL injection prevention
- Rate limiting
- CORS configuration

## 📈 Monitoring & Logging

### Health Checks
- `/health` - Basic health status
- `/api/status` - API status information
- Database connectivity checks
- External service status

### Logging
- Structured logging with Python logging
- Request/response logging
- Error tracking and alerting
- Performance metrics

### Metrics
- Request counts and response times
- Error rates and types
- Database query performance
- Agent processing metrics

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- Follow PEP 8 style guidelines
- Add type hints to all functions
- Include docstrings for all classes and methods
- Write comprehensive tests
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the API documentation at `/docs`
- Review the troubleshooting guide
- Open an issue on GitHub
- Contact the development team

### Common Issues
- **Database Connection**: Verify Supabase credentials and network access
- **OpenAI API**: Check API key validity and rate limits
- **Authentication**: Ensure JWT tokens are properly formatted
- **CORS Issues**: Verify allowed origins in configuration

## 🗺️ Roadmap

### Phase 1 (Q1 2026)
- ✅ Basic agent management
- ✅ Support agent implementation
- ✅ Authentication system
- ✅ Basic analytics

### Phase 2 (Q2 2026)
- 🚧 QA agent beta
- 🚧 Advanced integrations
- 🚧 Enhanced analytics
- 🚧 Performance optimization

### Phase 3 (Q3-Q4 2026)
- 🚧 Report builder agent
- 🚧 Multi-agent workflows
- 🚧 Enterprise features
- 🚧 Marketplace preparation

---

**Agent Synergy** - Transforming how mid-market companies work with AI agents.
