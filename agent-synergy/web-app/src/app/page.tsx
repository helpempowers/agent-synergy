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
  Code
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'text-blue-600' },
    { id: 'agents', label: 'AI Agents', icon: Bot, color: 'text-green-600' },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, color: 'text-purple-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-orange-600' },
    { id: 'integrations', label: 'Integrations', icon: Zap, color: 'text-yellow-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-indigo-600' },
    { id: 'api', label: 'API Status', icon: Code, color: 'text-red-600' },
    { id: 'database', label: 'Database', icon: Database, color: 'text-gray-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-pink-600' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Agent Synergy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">API Status: </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your AI agents and platform performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">8,934</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Integrations</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Agents</h2>
          <p className="text-gray-600">Manage and monitor your AI agents</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Create New Agent
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Endpoints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/agents</code>
                <p className="text-xs text-gray-500 mt-1">List all agents</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">POST /api/v1/agents</code>
                <p className="text-xs text-gray-500 mt-1">Create new agent</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/agents/{'{id}'}</code>
                <p className="text-xs text-gray-500 mt-1">Get agent details</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Conversations</h2>
        <p className="text-gray-600">Monitor agent conversations and interactions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Endpoints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/conversations</code>
                <p className="text-xs text-gray-500 mt-1">List all conversations</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">POST /api/v1/conversations</code>
                <p className="text-xs text-gray-500 mt-1">Start new conversation</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Track performance metrics and ROI</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Endpoints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/analytics/overview</code>
                <p className="text-xs text-gray-500 mt-1">Get overview metrics</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/analytics/roi</code>
                <p className="text-xs text-gray-500 mt-1">Calculate ROI metrics</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h2>
          <p className="text-gray-600">Manage third-party service connections</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Integration
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Endpoints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/integrations</code>
                <p className="text-xs text-gray-500 mt-1">List all integrations</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">POST /api/v1/integrations</code>
                <p className="text-xs text-gray-500 mt-1">Configure new integration</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Users</h2>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Endpoints</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/v1/users</code>
                <p className="text-xs text-gray-500 mt-1">List all users</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">POST /api/v1/users</code>
                <p className="text-xs text-gray-500 mt-1">Create new user</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIStatusTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">API Status</h2>
        <p className="text-gray-600">Monitor API health and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Health Check</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /health</code>
                <p className="text-xs text-gray-500 mt-1">System health status</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /api/status</code>
                <p className="text-xs text-gray-500 mt-1">API operational status</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Operational</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /docs</code>
                <p className="text-xs text-gray-500 mt-1">Interactive API docs</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <code className="text-sm font-mono text-gray-700">GET /redoc</code>
                <p className="text-xs text-gray-500 mt-1">Alternative API docs</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Database</h2>
        <p className="text-gray-600">Monitor database performance and connections</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Database Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Connection Status</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Database Type</span>
              <span className="text-sm text-gray-900">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Vector Extension</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">pgvector Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Security</h2>
        <p className="text-gray-600">Monitor security settings and compliance</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Authentication</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">JWT Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">CORS Protection</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Rate Limiting</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
