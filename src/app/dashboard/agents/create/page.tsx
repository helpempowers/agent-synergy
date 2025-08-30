'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { createAgent } from '@/lib/api';

const agentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['support', 'qa', 'reporting', 'admin'], {
    required_error: 'Please select an agent type',
  }),
  capabilities: z.array(z.string()).min(1, 'Select at least one capability'),
  integration_preferences: z.array(z.string()).optional(),
  custom_instructions: z.string().optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

const agentTypes = [
  {
    value: 'support',
    label: 'Support Agent',
    description: 'Handle customer inquiries and support tickets',
    icon: ChatBubbleLeftRightIcon,
    capabilities: ['ticket_management', 'knowledge_base', 'escalation', 'multilingual'],
  },
  {
    value: 'qa',
    label: 'QA Agent',
    description: 'Automate testing and quality assurance processes',
    icon: MagnifyingGlassIcon,
    capabilities: ['test_execution', 'bug_reporting', 'regression_testing', 'performance_testing'],
  },
  {
    value: 'reporting',
    label: 'Reporting Agent',
    description: 'Generate insights and automated reports',
    icon: ChartBarIcon,
    capabilities: ['data_analysis', 'report_generation', 'trend_identification', 'scheduling'],
  },
  {
    value: 'admin',
    label: 'Admin Agent',
    description: 'Manage system operations and workflows',
    icon: CogIcon,
    capabilities: ['workflow_management', 'user_management', 'system_monitoring', 'automation'],
  },
];

const allCapabilities = [
  'ticket_management',
  'knowledge_base',
  'escalation',
  'multilingual',
  'test_execution',
  'bug_reporting',
  'regression_testing',
  'performance_testing',
  'data_analysis',
  'report_generation',
  'trend_identification',
  'scheduling',
  'workflow_management',
  'user_management',
  'system_monitoring',
  'automation',
];

const integrationOptions = [
  'slack',
  'email',
  'jira',
  'zendesk',
  'google_sheets',
  'notion',
  'discord',
  'teams',
];

export default function CreateAgentPage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      capabilities: [],
      integration_preferences: [],
    },
  });

  const watchedType = watch('type');

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue('type', type as any);
    
    // Auto-select recommended capabilities for the type
    const typeConfig = agentTypes.find(t => t.value === type);
    if (typeConfig) {
      setValue('capabilities', typeConfig.capabilities);
    }
  };

  const handleCapabilityToggle = (capability: string) => {
    const currentCapabilities = watch('capabilities');
    const newCapabilities = currentCapabilities.includes(capability)
      ? currentCapabilities.filter(c => c !== capability)
      : [...currentCapabilities, capability];
    setValue('capabilities', newCapabilities);
  };

  const handleIntegrationToggle = (integration: string) => {
    const currentIntegrations = watch('integration_preferences') || [];
    const newIntegrations = currentIntegrations.includes(integration)
      ? currentIntegrations.filter(i => i !== integration)
      : [...currentIntegrations, integration];
    setValue('integration_preferences', newIntegrations);
  };

  const onSubmit = async (data: AgentFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await createAgent(data);
      
      if (response.data) {
        router.push('/dashboard/agents?message=Agent created successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCapabilityLabel = (capability: string) => {
    return capability.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getIntegrationLabel = (integration: string) => {
    return integration.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/dashboard/agents"
              className="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Agent</h1>
              <p className="text-gray-600">
                Deploy a new AI agent for your team
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Agent Type Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Agent Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentTypes.map((type) => (
                <div
                  key={type.value}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedType === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeSelect(type.value)}
                >
                  <div className="flex items-center">
                    <type.icon className="h-8 w-8 text-primary-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  {selectedType === type.value && (
                    <div className="absolute top-2 right-2">
                      <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Agent Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter agent name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe what this agent will do"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allCapabilities.map((capability) => (
                <label key={capability} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('capabilities').includes(capability)}
                    onChange={() => handleCapabilityToggle(capability)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {getCapabilityLabel(capability)}
                  </span>
                </label>
              ))}
            </div>
            {errors.capabilities && (
              <p className="mt-2 text-sm text-red-600">{errors.capabilities.message}</p>
            )}
          </div>

          {/* Integration Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Preferences</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the tools and platforms this agent should integrate with
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {integrationOptions.map((integration) => (
                <label key={integration} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={watch('integration_preferences')?.includes(integration) || false}
                    onChange={() => handleIntegrationToggle(integration)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {getIntegrationLabel(integration)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Instructions (Optional)</h3>
            <textarea
              rows={4}
              {...register('custom_instructions')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              placeholder="Add any specific instructions or guidelines for this agent..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/agents"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
