'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser, getAnalytics } from '@/lib/api';
import { storage } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.get('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const userResponse = await getCurrentUser();
        setUser(userResponse.data);
        
        const analyticsResponse = await getAnalytics();
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      name: 'Active Agents',
      value: analytics?.overview?.active_agents || 0,
      icon: UserGroupIcon,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Conversations',
      value: analytics?.overview?.total_conversations || 0,
      icon: ChatBubbleLeftRightIcon,
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Success Rate',
      value: `${analytics?.overview?.success_rate || 0}%`,
      icon: CheckCircleIcon,
      change: '+2%',
      changeType: 'positive',
    },
    {
      name: 'Monthly Savings',
      value: `$${analytics?.overview?.monthly_savings || 0}`,
      icon: ArrowTrendingUpIcon,
      change: '+15%',
      changeType: 'positive',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'agent_created',
      message: 'Support Agent "HelpBot" was created',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'conversation_completed',
      message: 'QA Agent completed 50 test cases',
      timestamp: '4 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'integration_connected',
      message: 'Slack integration connected successfully',
      timestamp: '1 day ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'agent_updated',
      message: 'Reporting Agent configuration updated',
      timestamp: '2 days ago',
      status: 'completed',
    },
  ];

  const quickActions = [
    {
      name: 'Create New Agent',
      description: 'Deploy a new AI agent for your team',
      icon: PlusIcon,
      href: '/dashboard/agents/create',
      color: 'bg-primary-500',
    },
    {
      name: 'View Analytics',
      description: 'Detailed performance metrics and insights',
      icon: ChartBarIcon,
      href: '/dashboard/analytics',
      color: 'bg-secondary-500',
    },
    {
      name: 'Manage Integrations',
      description: 'Connect and configure external tools',
      icon: CogIcon,
      href: '/dashboard/integrations',
      color: 'bg-accent-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.first_name}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your AI agents today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {user.company_name} • {user.company_size} employees
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                {quickActions.map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{action.name}</h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                <CheckCircleIcon className="h-5 w-5 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.message}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={activity.timestamp}>{activity.timestamp}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance Preview */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Agent Performance</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics?.agent_performance?.slice(0, 3).map((agent: any) => (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tasks completed:</span>
                        <span className="font-medium">{agent.tasks_completed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Success rate:</span>
                        <span className="font-medium">{agent.success_rate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Avg response time:</span>
                        <span className="font-medium">{agent.avg_response_time}s</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-3 text-center py-8">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No agents yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first AI agent.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/dashboard/agents/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Create Agent
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
