# Agent Synergy Web Application

A modern, responsive web application built with Next.js for managing AI agents and their interactions.

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS and modern design principles
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Authentication System**: Secure login and registration with JWT tokens
- **Dashboard**: Comprehensive overview of AI agents and performance metrics
- **Agent Management**: Create, configure, and monitor AI agents
- **Analytics**: Detailed performance tracking and ROI analysis
- **Integrations**: Connect with external tools and services
- **Conversation History**: Track and manage AI agent interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios with interceptors
- **State Management**: React hooks and context
- **Build Tool**: Vite (via Next.js)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Dashboard pages
│   │   ├── agents/        # Agent management
│   │   ├── analytics/     # Analytics and reporting
│   │   ├── conversations/ # Conversation history
│   │   └── integrations/  # External integrations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # Reusable UI components
│   └── Navigation.tsx     # Dashboard navigation
├── lib/                    # Utility libraries
│   ├── api.ts             # API client and endpoints
│   └── utils.ts           # Helper functions
└── types/                  # TypeScript type definitions
    └── index.ts           # Global type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agent-synergy/web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Agent Synergy
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Agent Synergy` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

### Tailwind CSS

The application uses a custom Tailwind configuration with:
- Custom color palette (primary, secondary, accent, success, warning, error)
- Custom animations (fade-in, slide-up, slide-down, scale-in, bounce-gentle)
- Extended typography and spacing
- Custom box shadows

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with value proposition
- Feature highlights
- Call-to-action for registration

### Authentication (`/auth/*`)
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): New user registration

### Dashboard (`/dashboard/*`)
- **Main Dashboard** (`/dashboard`): Overview and quick actions
- **Agents** (`/dashboard/agents`): AI agent management
- **Analytics** (`/dashboard/analytics`): Performance metrics and charts
- **Conversations** (`/dashboard/conversations`): Chat history
- **Integrations** (`/dashboard/integrations`): External service connections

## 🔌 API Integration

The web app communicates with the backend through a centralized API client (`src/lib/api.ts`) that provides:

- **Authentication**: Login, registration, token management
- **User Management**: Profile operations
- **Agent Operations**: CRUD operations for AI agents
- **Analytics**: Performance metrics and reporting
- **Integrations**: External service management

### API Client Features

- Automatic JWT token handling
- Request/response interceptors
- Error handling and retry logic
- Token refresh on 401 responses

## 🎨 UI Components

### Navigation Component
- Responsive sidebar navigation
- Mobile-friendly mobile menu
- Active state indicators
- Logout functionality

### Form Components
- React Hook Form integration
- Zod schema validation
- Error handling and display
- Loading states

### Data Visualization
- Line charts for trends
- Bar charts for comparisons
- Responsive chart containers
- Interactive tooltips

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

### Environment Setup for Production

1. Set production environment variables
2. Configure API endpoints for production
3. Set up proper CORS settings on backend
4. Configure domain and SSL certificates

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework

### Best Practices

- Use TypeScript for all components
- Follow React hooks best practices
- Implement proper error boundaries
- Use semantic HTML elements
- Ensure accessibility compliance

## 🔒 Security Features

- JWT-based authentication
- Secure token storage
- Automatic token refresh
- Protected routes
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Performance

- Next.js App Router for optimal routing
- Image optimization
- Code splitting and lazy loading
- Efficient state management
- Optimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🗺️ Roadmap

- [ ] Real-time chat interface
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-tenant support
- [ ] Advanced agent configuration
- [ ] API marketplace
- [ ] Enterprise features

## 🔗 Related Projects

- **Backend API**: FastAPI-based backend service
- **Mobile App**: React Native mobile application (planned)
- **Documentation**: Comprehensive API and user documentation
