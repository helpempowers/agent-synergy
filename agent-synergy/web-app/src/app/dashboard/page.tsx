'use client';

import { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { AnalyticsOverview, Agent, Conversation } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsData, agentsData, conversationsData] = await Promise.all([
          apiClient.getAnalyticsOverview(),
          apiClient.getAgents(),
          apiClient.getConversations({ limit: 5 })
        ]);

        setAnalytics(analyticsData);
        setAgents(agentsData);
        setConversations(conversationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Agents',
      value: analytics?.total_agents || 0,
      icon: Bot,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Active Agents',
      value: analytics?.active_agents || 0,
      icon: Activity,
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Total Conversations',
      value: analytics?.total_conversations || 0,
      icon: MessageSquare,
      change: '+23%',
      changeType: 'positive',
    },
    {
      name: 'Success Rate',
      value: `${analytics?.success_rate || 0}%`,
      icon: CheckCircle,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Time Saved',
      value: `${analytics?.time_saved_hours || 0}h`,
      icon: Clock,
      change: '+15%',
      changeType: 'positive',
    },
    {
      name: 'Cost Savings',
      value: `$${analytics?.cost_savings || 0}`,
      icon: DollarSign,
      change: '+18%',
      changeType: 'positive',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.first_name}! Here's what's happening with your AI agents.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-green-500 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                <span className="sr-only">Increased by</span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Agents */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Agents</h3>
            <div className="space-y-4">
              {agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.agent_type}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              ))}
              {agents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No agents created yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Conversations</h3>
            <div className="space-y-4">
              {conversations.slice(0, 5).map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {conversation.title || 'Untitled Conversation'}
                      </p>
                      <p className="text-sm text-gray-500">{conversation.conversation_type}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                    {conversation.status}
                  </span>
                </div>
              ))}
              {conversations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No conversations yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <Bot className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Create Agent
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Set up a new AI agent for your business needs.
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <MessageSquare className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Start Chat
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Begin a conversation with your AI agents.
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <BarChart3 className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View Analytics
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Check performance metrics and insights.
                </p>
              </div>
            </button>

            <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <Zap className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Add Integration
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Connect with Slack, Google Sheets, and more.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
