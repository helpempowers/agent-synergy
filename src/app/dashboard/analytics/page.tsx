'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { getAnalytics } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        setAnalytics(response.data || {});
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Mock data for charts (replace with real data from API)
  const conversationTrends = [
    { date: 'Jan 1', conversations: 120, success_rate: 85 },
    { date: 'Jan 2', conversations: 135, success_rate: 88 },
    { date: 'Jan 3', conversations: 98, success_rate: 82 },
    { date: 'Jan 4', conversations: 156, success_rate: 91 },
    { date: 'Jan 5', conversations: 142, success_rate: 87 },
    { date: 'Jan 6', conversations: 178, success_rate: 93 },
    { date: 'Jan 7', conversations: 165, success_rate: 89 },
  ];

  const agentPerformance = [
    { name: 'Support Agent', tasks: 450, success: 92, response: 2.3 },
    { name: 'QA Agent', tasks: 320, success: 88, response: 1.8 },
    { name: 'Reporting Agent', tasks: 180, success: 95, response: 5.2 },
  ];

  const roiData = [
    { month: 'Jan', savings: 8500, cost: 1200, net: 7300 },
    { month: 'Feb', savings: 9200, cost: 1200, net: 8000 },
    { month: 'Mar', savings: 10800, cost: 1200, net: 9600 },
    { month: 'Apr', savings: 11500, cost: 1200, net: 10300 },
    { month: 'May', savings: 12800, cost: 1200, net: 11600 },
    { month: 'Jun', savings: 14200, cost: 1200, net: 13000 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const overviewStats = [
    {
      name: 'Total Agents',
      value: analytics?.overview?.total_agents || 0,
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Active Agents',
      value: analytics?.overview?.active_agents || 0,
      change: '+8%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Total Conversations',
      value: analytics?.overview?.total_conversations || 0,
      change: '+15%',
      changeType: 'positive',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Success Rate',
      value: `${analytics?.overview?.success_rate || 0}%`,
      change: '+2%',
      changeType: 'positive',
      icon: TrendingUpIcon,
    },
    {
      name: 'Avg Response Time',
      value: `${analytics?.overview?.avg_response_time || 0}s`,
      change: '-8%',
      changeType: 'positive',
      icon: ClockIcon,
    },
    {
      name: 'Monthly Savings',
      value: `$${analytics?.overview?.monthly_savings || 0}`,
      change: '+18%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">
                Monitor performance and track ROI of your AI agents
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {overviewStats.map((stat) => (
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Conversation Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversations" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="success_rate" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#3B82F6" />
                <Bar dataKey="success" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ROI Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} name="Savings" />
              <Line type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="Cost" />
              <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} name="Net Benefit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Performance Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance Details</h3>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={agent.name} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <span className="text-sm text-gray-500">
                      {agent.success}% success rate
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tasks:</span>
                      <span className="ml-2 font-medium">{agent.tasks}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Success:</span>
                      <span className="ml-2 font-medium">{agent.success}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Response:</span>
                      <span className="ml-2 font-medium">{agent.response}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analytics?.recent_activity?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <ChartBarIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
