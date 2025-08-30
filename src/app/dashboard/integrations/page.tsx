'use client';

import { useState, useEffect } from 'react';
import {
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { getIntegrations } from '@/lib/api';

const integrationTypes = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect your Slack workspace for notifications and team collaboration',
    icon: '💬',
    status: 'connected',
    lastSync: '2 minutes ago',
    features: ['Notifications', 'Team channels', 'Direct messages'],
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and receive emails through your business email system',
    icon: '📧',
    status: 'connected',
    lastSync: '1 hour ago',
    features: ['Inbox management', 'Auto-replies', 'Email templates'],
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Integrate with Jira for project management and issue tracking',
    icon: '🎯',
    status: 'disconnected',
    lastSync: 'Never',
    features: ['Issue creation', 'Status updates', 'Project sync'],
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Connect Zendesk for customer support ticket management',
    icon: '🎫',
    status: 'connected',
    lastSync: '5 minutes ago',
    features: ['Ticket sync', 'Customer data', 'Support workflows'],
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Sync data with Google Sheets for reporting and analysis',
    icon: '📊',
    status: 'error',
    lastSync: '2 hours ago',
    features: ['Data export', 'Report generation', 'Real-time sync'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect Notion for knowledge management and documentation',
    icon: '📝',
    status: 'disconnected',
    lastSync: 'Never',
    features: ['Page sync', 'Database integration', 'Knowledge base'],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-800';
    case 'disconnected':
      return 'bg-gray-100 text-gray-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'connecting':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    case 'disconnected':
      return <XCircleIcon className="h-5 w-5 text-gray-600" />;
    case 'error':
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    case 'connecting':
      return <ArrowPathIcon className="h-5 w-5 text-yellow-600 animate-spin" />;
    default:
      return <XCircleIcon className="h-5 w-5 text-gray-600" />;
  }
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await getIntegrations();
        setIntegrations(response.data || []);
      } catch (error) {
        console.error('Error fetching integrations:', error);
        // Use mock data for now
        setIntegrations(integrationTypes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const filteredIntegrations = integrations.filter((integration) => {
    if (filter === 'all') return true;
    return integration.status === filter;
  });

  const handleConnect = async (integrationId: string) => {
    // TODO: Implement actual connection logic
    console.log('Connecting to:', integrationId);
  };

  const handleDisconnect = async (integrationId: string) => {
    // TODO: Implement actual disconnection logic
    console.log('Disconnecting from:', integrationId);
  };

  const handleRefresh = async (integrationId: string) => {
    // TODO: Implement actual refresh logic
    console.log('Refreshing:', integrationId);
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
              <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600">
                Connect your AI agents with external tools and services
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'connected', 'disconnected', 'error', 'connecting'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === status
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{integration.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1 capitalize">{integration.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{integration.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                  <span>Last sync: {integration.lastSync}</span>
                </div>

                <div className="flex space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => handleRefresh(integration.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Refresh
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : integration.status === 'error' ? (
                    <>
                      <button
                        onClick={() => handleRefresh(integration.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Retry
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' ? 'No integrations available' : `No ${filter} integrations`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Integrations will appear here once configured.'
                : `No integrations are currently ${filter}.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
