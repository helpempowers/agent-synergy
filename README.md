# 🚀 Agent Synergy

**Plug-and-play AI agents that work like employees—reliable, scalable, and tailored for mid-market efficiency.**

## 🏗️ Project Structure

```
agent-synergy/
├── backend/          # FastAPI backend with agent services
├── web-app/          # Next.js web dashboard
├── mobile-app/       # React Native mobile app
└── docs/            # Project documentation and plans
```

## 🚀 Quick Start

### Backend API
```bash
cd agent-synergy/backend
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000
```

### Web Dashboard
```bash
cd agent-synergy/web-app
npm run dev
```

### Mobile App
```bash
cd agent-synergy/mobile-app
npm start
```

## 📚 Documentation

All project documentation is located in the [`docs/`](./docs/) folder:

- [Master Plan](./docs/agent_synergy_master_plan.md)
- [Technical Implementation Guide](./docs/technical_implementation_guide.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Pitch Deck Outline](./docs/pitch_deck_outline.md)

## 🌐 API Endpoints

- **Health Check**: `GET /health`
- **API Documentation**: `GET /docs`
- **Agents**: `/api/v1/agents`
- **Conversations**: `/api/v1/conversations`
- **Analytics**: `/api/v1/analytics`
- **Integrations**: `/api/v1/integrations`

## 🔧 Tech Stack

- **Backend**: FastAPI, Python 3.12, Supabase
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Mobile**: React Native, Expo
- **AI**: CrewAI, LangChain, GPT-4
- **Database**: PostgreSQL with pgvector

## 📖 License

This project is proprietary software for Agent Synergy.
