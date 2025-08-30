'use client';

import { useState, useEffect } from 'react';
import { useAIModels } from '@/hooks/useAI';
import { CheckIcon, XMarkIcon, CurrencyDollarIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface AIModelSelectorProps {
  selectedModel?: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

export default function AIModelSelector({ 
  selectedModel, 
  onModelSelect, 
  className = '' 
}: AIModelSelectorProps) {
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'cost' | 'capabilities'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { models, loading, error, fetchModels } = useAIModels();

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const providers = ['OpenAI', 'Anthropic', 'Google', 'Other'];
  
  const filteredModels = models
    .filter(model => filterProvider === 'all' || model.provider === filterProvider)
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'provider':
          comparison = a.provider.localeCompare(b.provider);
          break;
        case 'cost':
          comparison = a.costPerToken - b.costPerToken;
          break;
        case 'capabilities':
          comparison = a.capabilities.length - b.capabilities.length;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI':
        return 'bg-green-100 text-green-800';
      case 'Anthropic':
        return 'bg-blue-100 text-blue-800';
      case 'Google':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCost = (cost: number) => {
    if (cost < 0.001) {
      return `$${(cost * 1000000).toFixed(2)}/1M tokens`;
    } else if (cost < 1) {
      return `$${(cost * 1000).toFixed(2)}/1K tokens`;
    } else {
      return `$${cost.toFixed(2)}/token`;
    }
  };

  const getCapabilityIcon = (capability: string) => {
    if (capability.includes('code')) return '💻';
    if (capability.includes('image')) return '🖼️';
    if (capability.includes('audio')) return '🎵';
    if (capability.includes('vision')) return '👁️';
    if (capability.includes('math')) return '🧮';
    if (capability.includes('reasoning')) return '🧠';
    return '✨';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading models...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <XMarkIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading models</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchModels}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">AI Model Selection</h3>
            <p className="text-sm text-gray-500">
              Choose the best AI model for your use case
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">{models.length} models available</span>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Provider Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Providers</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="provider">Provider</option>
              <option value="cost">Cost</option>
              <option value="capabilities">Capabilities</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Order
            </label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="p-6">
        {filteredModels.length === 0 ? (
          <div className="text-center py-8">
            <XMarkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No models found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onModelSelect(model.id)}
              >
                {/* Selection Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(model.provider)}`}>
                    {model.provider}
                  </span>
                  {selectedModel === model.id && (
                    <CheckIcon className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                {/* Model Name */}
                <h4 className="font-medium text-gray-900 mb-2">{model.name}</h4>

                {/* Model Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Max Tokens
                    </span>
                    <span className="font-medium">{model.maxTokens.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      Cost
                    </span>
                    <span className="font-medium">{formatCost(model.costPerToken)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      Capabilities
                    </span>
                    <span className="font-medium">{model.capabilities.length}</span>
                  </div>
                </div>

                {/* Capabilities Preview */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.slice(0, 3).map((capability, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        title={capability}
                      >
                        {getCapabilityIcon(capability)} {capability}
                      </span>
                    ))}
                    {model.capabilities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        +{model.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedModel && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Selected: {models.find(m => m.id === selectedModel)?.name}
              </span>
            </div>
            <button
              onClick={() => onModelSelect('')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
