"use client";

import { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Users, 
  Zap,
  Activity,
  Shield,
  Database,
  Code,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Cpu,
  Brain,
  Globe,
  Lock,
  Key,
  Server,
  Network,
  Monitor,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Rocket,
  Star,
  Award,
  Crown,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'agents', label: 'AI Agents', icon: Bot, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'integrations', label: 'Integrations', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'api', label: 'API Status', icon: Code, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'database', label: 'Database', icon: Database, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'agents':
        return <AgentsTab />;
      case 'conversations':
        return <ConversationsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'users':
        return <UsersTab />;
      case 'api':
        return <APIStatusTab />;
      case 'database':
        return <DatabaseTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <Bot className="h-8 w-8 text-green-600 mr-3 transition-transform duration-300 hover:scale-110" />
                <div className="absolute inset-0 bg-green-600/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Synergy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">API Status: </span>
                <span className="status-badge status-active">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white/80 backdrop-blur-sm shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 focus-ring ${
                        activeTab === item.id
                          ? `${item.bgColor} text-gray-900 border-r-2 border-green-500 shadow-sm`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${item.color}`} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Dashboard Overview</h2>
        <p className="text-xl text-gray-600">Monitor your AI agents and platform performance in real-time</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="card hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Bot className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 this week
              </p>
            </div>
          </div>
        </div>
        
        <div className="card hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% today
              </p>
            </div>
          </div>
        </div>
        
        <div className="card hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-3xl font-bold text-gray-900">8,934</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% this month
              </p>
            </div>
          </div>
        </div>
        
        <div className="card hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Integrations</p>
              <p className="text-3xl font-bold text-gray-900">6</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                All active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-subtitle">Common tasks and shortcuts</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary">
              <Bot className="h-4 w-4" />
              Create Agent
            </button>
            <button className="btn-secondary">
              <MessageSquare className="h-4 w-4" />
              Start Chat
            </button>
            <button className="btn-success">
              <Zap className="h-4 w-4" />
              Add Integration
            </button>
            <button className="btn-warning">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Health</h3>
            <p className="card-subtitle">Current platform status</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">API Status</span>
              <span className="status-badge status-active">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Database</span>
              <span className="status-badge status-active">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Agents</span>
              <span className="status-badge status-active">12 Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Security</span>
              <span className="status-badge status-active">Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsTab() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center animate-slide-in">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">AI Agents</h2>
          <p className="text-xl text-gray-600">Manage and monitor your AI agents</p>
        </div>
        <button className="btn-primary hover-glow">
          <Bot className="h-4 w-4" />
          Create New Agent
        </button>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Agent Endpoints</h3>
          <p className="card-subtitle">Available API endpoints for agent management</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/agents</code>
                <p className="text-xs text-gray-500 mt-1">List all agents with status and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">POST /api/v1/agents</code>
                <p className="text-xs text-gray-500 mt-1">Create new agent with configuration and training data</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/agents/{'{id}'}</code>
                <p className="text-xs text-gray-500 mt-1">Get detailed agent information and performance stats</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationsTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Conversations</h2>
        <p className="text-xl text-gray-600">Monitor agent conversations and interactions</p>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Conversation Endpoints</h3>
          <p className="card-subtitle">API endpoints for managing conversations</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/conversations</code>
                <p className="text-xs text-gray-500 mt-1">List all conversations with metadata and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">POST /api/v1/conversations</code>
                <p className="text-xs text-gray-500 mt-1">Start new conversation with specified agent and context</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Analytics</h2>
        <p className="text-xl text-gray-600">Track performance metrics and ROI</p>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Analytics Endpoints</h3>
          <p className="card-subtitle">API endpoints for performance tracking</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Code className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/analytics/overview</code>
                <p className="text-xs text-gray-500 mt-1">Get comprehensive overview metrics and KPIs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/analytics/roi</code>
                <p className="text-xs text-gray-500 mt-1">Calculate ROI metrics and cost savings analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center animate-slide-in">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Integrations</h2>
          <p className="text-xl text-gray-600">Manage third-party service connections</p>
        </div>
        <button className="btn-primary hover-glow">
          <Zap className="h-4 w-4" />
          Add Integration
        </button>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Integration Endpoints</h3>
          <p className="card-subtitle">API endpoints for managing integrations</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Code className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/integrations</code>
                <p className="text-xs text-gray-500 mt-1">List all active integrations and their status</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">POST /api/v1/integrations</code>
                <p className="text-xs text-gray-500 mt-1">Configure new integration with credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Users</h2>
        <p className="text-xl text-gray-600">Manage user accounts and permissions</p>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">User Endpoints</h3>
          <p className="card-subtitle">API endpoints for user management</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Code className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/v1/users</code>
                <p className="text-xs text-gray-500 mt-1">List all users with roles and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <code className="text-sm font-mono text-gray-700 font-semibold">POST /api/v1/users</code>
                <p className="text-xs text-gray-500 mt-1">Create new user account with role assignment</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="status-badge status-active">Active</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIStatusTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">API Status</h2>
        <p className="text-xl text-gray-600">Monitor API health and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title">Health Check</h3>
            <p className="card-subtitle">System health status</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <code className="text-sm font-mono text-gray-700 font-semibold">GET /health</code>
                  <p className="text-xs text-gray-500 mt-1">System health status</p>
                </div>
              </div>
              <span className="status-badge status-active">Healthy</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Code className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <code className="text-sm font-mono text-gray-700 font-semibold">GET /api/status</code>
                  <p className="text-xs text-gray-500 mt-1">API operational status</p>
                </div>
              </div>
              <span className="status-badge status-active">Operational</span>
            </div>
          </div>
        </div>
        
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-title">Documentation</h3>
            <p className="card-subtitle">API documentation access</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Code className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <code className="text-sm font-mono text-gray-700 font-semibold">GET /docs</code>
                  <p className="text-xs text-gray-500 mt-1">Interactive API docs</p>
                </div>
              </div>
              <span className="status-badge status-active">Available</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Code className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <code className="text-sm font-mono text-gray-700 font-semibold">GET /redoc</code>
                  <p className="text-xs text-gray-500 mt-1">Alternative API docs</p>
                </div>
              </div>
              <span className="status-badge status-active">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Database</h2>
        <p className="text-xl text-gray-600">Monitor database performance and connections</p>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Database Status</h3>
          <p className="card-subtitle">Current database health and configuration</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Connection Status</span>
                <p className="text-xs text-gray-500 mt-1">PostgreSQL connection pool</p>
              </div>
            </div>
            <span className="status-badge status-active">Connected</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Database Type</span>
                <p className="text-xs text-gray-500 mt-1">PostgreSQL with extensions</p>
              </div>
            </div>
            <span className="text-sm text-gray-900 font-medium">PostgreSQL</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Vector Extension</span>
                <p className="text-xs text-gray-500 mt-1">pgvector for embeddings</p>
              </div>
            </div>
            <span className="status-badge status-active">pgvector Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Security</h2>
        <p className="text-xl text-gray-600">Monitor security settings and compliance</p>
      </div>
      
      <div className="card animate-fade-in">
        <div className="card-header">
          <h3 className="card-title">Security Features</h3>
          <p className="card-subtitle">Active security measures and compliance status</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Authentication</span>
                <p className="text-xs text-gray-500 mt-1">JWT-based authentication system</p>
              </div>
            </div>
            <span className="status-badge status-active">JWT Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">CORS Protection</span>
                <p className="text-xs text-gray-500 mt-1">Cross-origin resource sharing</p>
              </div>
            </div>
            <span className="status-badge status-active">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Lock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Rate Limiting</span>
                <p className="text-xs text-gray-500 mt-1">API request throttling</p>
              </div>
            </div>
            <span className="status-badge status-warning">Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
