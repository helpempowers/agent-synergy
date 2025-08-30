'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CogIcon, BeakerIcon, ChartBarIcon, PlayIcon, PauseIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAIAgents, useAIModels, useAITraining } from '@/hooks/useAI';
import { AIAgent } from '@/lib/ai-service';

const agentConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  model: z.string().min(1, 'Model is required'),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(100000),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  capabilities: z.array(z.string()).min(1, 'At least one capability is required'),
});

type AgentConfigFormData = z.infer<typeof agentConfigSchema>;

interface AIAgentConfigProps {
  agentId?: string;
  onSave: (agent: AIAgent) => void;
  onCancel: () => void;
  className?: string;
}

export default function AIAgentConfig({ 
  agentId, 
  onSave, 
  onCancel, 
  className = '' 
}: AIAgentConfigProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'training' | 'performance'>('config');
  const [isEditing, setIsEditing] = useState(false);

  const { agents, loading: agentsLoading, createAgent, updateAgent } = useAIAgents();
  const { models, loading: modelsLoading, fetchModels } = useAIModels();
  const { trainingStatus, startTraining, cancelTraining, uploadTrainingData } = useAITraining();

  const currentAgent = agentId ? agents.find(a => a.id === agentId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AgentConfigFormData>({
    resolver: zodResolver(agentConfigSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      model: '',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '',
      capabilities: [],
    },
  });

  const watchedCapabilities = watch('capabilities');

  useEffect(() => {
    if (currentAgent) {
      reset({
        name: currentAgent.name,
        type: currentAgent.type,
        description: currentAgent.description,
        model: currentAgent.model,
        temperature: currentAgent.temperature,
        maxTokens: currentAgent.maxTokens,
        systemPrompt: currentAgent.systemPrompt,
        capabilities: currentAgent.capabilities,
      });
      setIsEditing(true);
    }
  }, [currentAgent, reset]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const onSubmit = async (data: AgentConfigFormData) => {
    try {
      if (isEditing && currentAgent) {
        const updatedAgent = await updateAgent(currentAgent.id, data);
        onSave(updatedAgent);
      } else {
        const newAgent = await createAgent(data);
        onSave(newAgent);
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
    }
  };

  const handleCapabilityToggle = (capability: string) => {
    const newCapabilities = watchedCapabilities.includes(capability)
      ? watchedCapabilities.filter(c => c !== capability)
      : [...watchedCapabilities, capability];
    setValue('capabilities', newCapabilities);
  };

  const predefinedCapabilities = [
    'text-generation',
    'code-generation',
    'data-analysis',
    'language-translation',
    'summarization',
    'question-answering',
    'sentiment-analysis',
    'content-moderation',
    'image-description',
    'document-processing',
  ];

  const renderConfigTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter agent name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Type *
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="support">Customer Support</option>
              <option value="qa">Question Answering</option>
              <option value="reporting">Reporting & Analytics</option>
              <option value="admin">Administrative</option>
              <option value="creative">Creative Writing</option>
              <option value="technical">Technical Assistant</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this agent does"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* AI Model Configuration */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Model Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <select
              {...register('model')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature
            </label>
            <input
              {...register('temperature', { valueAsNumber: true })}
              type="range"
              min="0"
              max="2"
              step="0.1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused (0)</span>
              <span>Balanced (1)</span>
              <span>Creative (2)</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Current: {watch('temperature')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens
            </label>
            <input
              {...register('maxTokens', { valueAsNumber: true })}
              type="number"
              min="1"
              max="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.maxTokens && (
              <p className="mt-1 text-sm text-red-600">{errors.maxTokens.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt *
        </label>
        <textarea
          {...register('systemPrompt')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Define the agent's behavior, personality, and capabilities..."
        />
        {errors.systemPrompt && (
          <p className="mt-1 text-sm text-red-600">{errors.systemPrompt.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          This prompt defines how the AI agent behaves and responds to users.
        </p>
      </div>

      {/* Capabilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capabilities *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {predefinedCapabilities.map((capability) => (
            <label key={capability} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watchedCapabilities.includes(capability)}
                onChange={() => handleCapabilityToggle(capability)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {capability.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
        {errors.capabilities && (
          <p className="mt-2 text-sm text-red-600">{errors.capabilities.message}</p>
        )}
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Training Data</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Training Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload CSV or JSON files to improve your agent's performance
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Files
            </button>
          </div>
        </div>
      </div>

      {trainingStatus && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Training Status</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Status: {trainingStatus.status}
              </span>
              {trainingStatus.status === 'running' && (
                <button
                  onClick={() => cancelTraining('training-id')}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
            {trainingStatus.status === 'running' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{trainingStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingStatus.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  Epoch {trainingStatus.currentEpoch} of {trainingStatus.totalEpochs}
                </div>
                <div className="text-sm text-gray-600">
                  Loss: {trainingStatus.loss.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Conversations</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">0s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">0%</div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">$0</div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Trends</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No usage data available yet</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CogIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Agent' : 'Create New Agent'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Agent' : 'Create Agent')}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'config', name: 'Configuration', icon: CogIcon },
            { id: 'training', name: 'Training', icon: BeakerIcon },
            { id: 'performance', name: 'Performance', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="inline-block w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {activeTab === 'config' && renderConfigTab()}
        {activeTab === 'training' && renderTrainingTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
}
