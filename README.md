# Agent Synergy

**Plug-and-play AI agents that work like employees**

Agent Synergy is a comprehensive AI infrastructure platform that enables businesses to deploy, manage, and scale AI agents as if they were human employees. Our platform provides a complete ecosystem for AI agent management, from creation and training to deployment and monitoring.

## 🏗️ Project Structure

```
agentSynergy/
├── 📁 backend/                    # FastAPI Backend
│   ├── 📁 api/v1/                # API endpoints
│   ├── 📁 core/                  # Core configuration
│   ├── 📁 models/                # Database models
│   ├── 📁 services/              # Business logic
│   ├── 📁 utils/                 # Utility functions
│   ├── 📁 schemas/               # Pydantic schemas
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   └── README_backend.md         # Backend documentation
│
├── 📁 web-app/                   # Next.js Web Application
│   ├── 📁 src/
│   │   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 components/        # React components
│   │   ├── 📁 hooks/             # Custom hooks
│   │   ├── 📁 lib/               # Utility libraries
│   │   └── 📁 types/             # TypeScript types
│   ├── package.json              # Node.js dependencies
│   ├── next.config.ts            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── tsconfig.json             # TypeScript configuration
│
├── 📁 mobile-app/                # React Native Mobile Application
│   ├── 📁 src/
│   │   ├── 📁 components/        # Mobile UI components
│   │   ├── 📁 navigation/        # Navigation components
│   │   ├── 📁 screens/           # Mobile app screens
│   │   ├── 📁 services/          # Mobile services
│   │   ├── 📁 types/             # TypeScript types
│   │   └── 📁 utils/             # Utility functions
│   ├── App.tsx                   # Mobile app entry point
│   ├── package.json              # Mobile app dependencies
│   └── metro.config.js           # Metro bundler configuration
│
├── 📁 docs/                      # Documentation
│   ├── PROJECT_STRUCTURE.md      # Detailed project structure
│   ├── technical_implementation_guide.md
│   └── ...                       # Other documentation files
│
├── README.md                     # This file
├── deploy.sh                     # Deployment script
└── ...                           # Other project files
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+** for backend
- **Node.js 18+** for web and mobile apps
- **PostgreSQL** database
- **Supabase** account (for database hosting)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env_example.txt .env
# Edit .env with your configuration

# Start the backend server
python start.py
```

The backend will be available at `http://localhost:8000` with API documentation at `http://localhost:8000/docs`.

### 2. Web Application Setup

```bash
# Navigate to web app directory
cd web-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The web application will be available at `http://localhost:3000`.

### 3. Mobile Application Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# For iOS (requires macOS)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting and real-time features
- **JWT** - Authentication
- **OpenAI GPT-4o** - AI capabilities
- **LangChain** - AI agent framework
- **CrewAI** - Multi-agent orchestration

### Web Application
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Mobile Application
- **React Native** - Cross-platform mobile development
- **React Navigation** - Navigation
- **React Native Paper** - UI components
- **AsyncStorage** - Local storage
- **Axios** - HTTP client

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/agent_synergy
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Authentication
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8081"]
```

### Web Application (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Agent Synergy
```

### Mobile Application
Update the API URL in `src/services/api.ts` to point to your backend.

## 📊 Key Features

### 🤖 AI Agent Management
- Create and configure AI agents
- Train agents with custom data
- Deploy agents across multiple channels
- Monitor agent performance

### 💬 Conversation Management
- Real-time chat interfaces
- Conversation history
- Multi-agent conversations
- Context preservation

### 📈 Analytics & Reporting
- Performance metrics
- Cost analysis
- Usage statistics
- Custom dashboards

### 🔌 Integration Management
- Slack integration
- Google Workspace integration
- Custom API integrations
- Webhook support

### 👥 User Management
- Authentication & authorization
- Role-based access control
- Team management
- API key management

## 🚀 Deployment

### Backend Deployment
```bash
# Using the deployment script
./deploy.sh

# Or manually with Docker
docker build -t agent-synergy-backend ./backend
docker run -p 8000:8000 agent-synergy-backend
```

### Web Application Deployment
```bash
# Build for production
cd web-app
npm run build

# Deploy to Vercel
vercel --prod
```

### Mobile Application Deployment
```bash
# Build for production
cd mobile-app

# iOS
npm run ios -- --configuration Release

# Android
npm run android -- --variant=release
```

## 📚 Documentation

- [Backend API Documentation](backend/README_backend.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Technical Implementation Guide](docs/technical_implementation_guide.md)
- [API Documentation](http://localhost:8000/docs) (when backend is running)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] Advanced AI model support
- [ ] Multi-tenant architecture
- [ ] Advanced analytics
- [ ] Mobile app store deployment
- [ ] Enterprise features
- [ ] API rate limiting
- [ ] Advanced security features

---

**Agent Synergy** - Building the future of AI-powered business automation.

For more information, visit our [documentation](docs/) or contact us at [your-email@domain.com].