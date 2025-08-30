'use client';

import { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { getConversations } from '@/lib/api';

// Mock data for conversations (replace with real API data)
const mockConversations = [
  {
    id: 1,
    agent_name: 'Support Agent',
    agent_type: 'support',
    user_message: 'I need help with my account login',
    agent_response: 'I can help you with that. Can you provide your email address?',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    duration: 45,
    satisfaction_score: 5,
    tags: ['login', 'account', 'support'],
  },
  {
    id: 2,
    agent_name: 'QA Agent',
    agent_type: 'qa',
    user_message: 'Run regression tests on the payment module',
    agent_response: 'I\'ve started the regression tests. This will take approximately 15 minutes.',
    status: 'in_progress',
    timestamp: '2024-01-15T09:15:00Z',
    duration: 120,
    satisfaction_score: null,
    tags: ['testing', 'payment', 'regression'],
  },
  {
    id: 3,
    agent_name: 'Reporting Agent',
    agent_type: 'reporting',
    user_message: 'Generate monthly sales report',
    agent_response: 'Monthly sales report generated and sent to your email. Total revenue: $125,000',
    status: 'completed',
    timestamp: '2024-01-15T08:45:00Z',
    duration: 30,
    satisfaction_score: 4,
    tags: ['reporting', 'sales', 'monthly'],
  },
  {
    id: 4,
    agent_name: 'Support Agent',
    agent_type: 'support',
    user_message: 'How do I reset my password?',
    agent_response: 'You can reset your password by clicking the "Forgot Password" link on the login page.',
    status: 'completed',
    timestamp: '2024-01-14T16:20:00Z',
    duration: 25,
    satisfaction_score: 5,
    tags: ['password', 'reset', 'support'],
  },
  {
    id: 5,
    agent_name: 'QA Agent',
    agent_type: 'qa',
    user_message: 'Check for broken links on the homepage',
    agent_response: 'Found 2 broken links. I\'ve created tickets for the development team.',
    status: 'completed',
    timestamp: '2024-01-14T14:10:00Z',
    duration: 180,
    satisfaction_score: 4,
    tags: ['testing', 'links', 'homepage'],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'in_progress':
      return <ClockIcon className="h-4 w-4" />;
    case 'failed':
      return <XCircleIcon className="h-4 w-4" />;
    case 'pending':
      return <ClockIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

const getAgentTypeIcon = (type: string) => {
  switch (type) {
    case 'support':
      return '💬';
    case 'qa':
      return '🔍';
    case 'reporting':
      return '📊';
    case 'admin':
      return '⚙️';
    default:
      return '🤖';
  }
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations();
        setConversations(response.data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Use mock data for now
        setConversations(mockConversations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.agent_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || conversation.agent_type === agentFilter;
    
    return matchesSearch && matchesStatus && matchesAgent;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
              <p className="text-gray-600">
                View and manage interactions with your AI agents
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Agent Type Filter */}
            <div>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">All Agent Types</option>
                <option value="support">Support</option>
                <option value="qa">QA</option>
                <option value="reporting">Reporting</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getAgentTypeIcon(conversation.agent_type)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{conversation.agent_name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                            {getStatusIcon(conversation.status)}
                            <span className="ml-1 capitalize">{conversation.status.replace('_', ' ')}</span>
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Duration: {formatDuration(conversation.duration)}</div>
                      {conversation.satisfaction_score && (
                        <div className="mt-1">
                          Rating: {'⭐'.repeat(conversation.satisfaction_score)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">User Message:</h4>
                      <p className="text-gray-900">{conversation.user_message}</p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-primary-700 mb-2">Agent Response:</h4>
                      <p className="text-primary-900">{conversation.agent_response}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {conversation.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm || statusFilter !== 'all' || agentFilter !== 'all' 
                ? 'No conversations match your filters'
                : 'No conversations yet'
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || agentFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Conversations will appear here once you start interacting with your AI agents.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
