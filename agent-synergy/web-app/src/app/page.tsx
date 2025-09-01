'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Bot, MessageSquare, BarChart3, Zap, Activity, Shield, Database, Code, CheckCircle, TrendingUp, Users, Globe, Plus, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Agent Synergy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">API Status: </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
              <button 
                onClick={() => router.push('/auth/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'agents', label: 'AI Agents', icon: Bot },
                { id: 'conversations', label: 'Conversations', icon: MessageSquare },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'integrations', label: 'Integrations', icon: Zap },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'api', label: 'API Status', icon: Code },
                { id: 'database', label: 'Database', icon: Database },
                { id: 'security', label: 'Security', icon: Shield },
              ].map((item) => (
                <li key={item.id}>
                  <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI Agents that Work Like Employees
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Plug-and-play AI agents that work like employees—reliable, scalable, and tailored for mid-market efficiency.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => router.push('/auth/register')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Get Started Free
                </button>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Bot,
                  title: 'AI Agents',
                  description: 'Create and manage intelligent AI agents for various business tasks.',
                  status: 'Active',
                  color: 'text-green-600',
                },
                {
                  icon: MessageSquare,
                  title: 'Conversations',
                  description: 'Real-time chat interface for interacting with your AI agents.',
                  status: 'Active',
                  color: 'text-blue-600',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics',
                  description: 'Comprehensive analytics and performance insights.',
                  status: 'Active',
                  color: 'text-purple-600',
                },
                {
                  icon: Zap,
                  title: 'Integrations',
                  description: 'Connect with Slack, Google Sheets, and other platforms.',
                  status: 'Active',
                  color: 'text-yellow-600',
                },
                {
                  icon: Shield,
                  title: 'Security',
                  description: 'Enterprise-grade security and data protection.',
                  status: 'Active',
                  color: 'text-red-600',
                },
                {
                  icon: Database,
                  title: 'Database',
                  description: 'Robust data storage and management system.',
                  status: 'Active',
                  color: 'text-indigo-600',
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Agents', value: '150+', icon: Bot },
                  { label: 'Active Users', value: '1,200+', icon: Users },
                  { label: 'Conversations', value: '50K+', icon: MessageSquare },
                  { label: 'Success Rate', value: '95%', icon: CheckCircle },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of businesses using AI agents to automate their workflows.
              </p>
              <button 
                onClick={() => router.push('/auth/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
