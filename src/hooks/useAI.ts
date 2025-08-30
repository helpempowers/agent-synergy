import { useState, useCallback, useRef } from 'react';
import { aiService, type AIAgent, type AIMessage, type AIResponse, type AIConversation } from '@/lib/ai-service';

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAgents = await aiService.getAgents();
      setAgents(fetchedAgents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAgent = useCallback(async (agentData: Partial<AIAgent>) => {
    try {
      setLoading(true);
      setError(null);
      const newAgent = await aiService.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgent = useCallback(async (agentId: string, updates: Partial<AIAgent>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAgent = await aiService.updateAgent(agentId, updates);
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? updatedAgent : agent
      ));
      return updatedAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAgent = useCallback(async (agentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await aiService.deleteAgent(agentId);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  };
}

export function useAIConversation(agentId?: string) {
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = useCallback(async (initialMessage?: string) => {
    if (!agentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const newConversation = await aiService.startConversation(agentId, initialMessage);
      setConversation(newConversation);
      setMessages(newConversation.messages || []);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversation) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add user message immediately
      const userMessage: AIMessage = {
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const response = await aiService.sendMessage(conversation.id, content);
      
      // Add assistant response
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata,
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const loadedConversation = await aiService.getConversation(conversationId);
      setConversation(loadedConversation);
      setMessages(loadedConversation.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setConversation(null);
    setMessages([]);
    setError(null);
  }, []);

  return {
    conversation,
    messages,
    loading,
    error,
    startConversation,
    sendMessage,
    loadConversation,
    clearConversation,
  };
}

export function useAIStreaming(agentId?: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async (
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void
  ) => {
    if (!agentId) return;
    
    try {
      setIsStreaming(true);
      setError(null);
      setStreamedContent('');
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      await aiService.streamResponse(
        conversationId,
        content,
        (chunk) => {
          setStreamedContent(prev => prev + chunk);
          onChunk(chunk);
        },
        () => {
          setIsStreaming(false);
        }
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Stream was cancelled
        return;
      }
      setError(err instanceof Error ? err.message : 'Streaming failed');
      setIsStreaming(false);
    }
  }, [agentId]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  }, []);

  const resetStreaming = useCallback(() => {
    setIsStreaming(false);
    setStreamedContent('');
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isStreaming,
    streamedContent,
    error,
    startStreaming,
    stopStreaming,
    resetStreaming,
  };
}

export function useAIModels() {
  const [models, setModels] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    capabilities: string[];
    maxTokens: number;
    costPerToken: number;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await aiService.getAvailableModels();
      setModels(fetchedModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  }, []);

  const switchModel = useCallback(async (agentId: string, newModel: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAgent = await aiService.switchModel(agentId, newModel);
      return updatedAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch model');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    models,
    loading,
    error,
    fetchModels,
    switchModel,
  };
}

export function useAITraining() {
  const [trainingStatus, setTrainingStatus] = useState<{
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    currentEpoch: number;
    totalEpochs: number;
    loss: number;
    estimatedTimeRemaining?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTraining = useCallback(async (
    agentId: string,
    options: { epochs: number; learningRate: number; batchSize: number }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.startTraining(agentId, options);
      
      if (result.status === 'started') {
        // Start polling for status
        pollTrainingStatus(result.trainingId);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start training');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pollTrainingStatus = useCallback(async (trainingId: string) => {
    const poll = async () => {
      try {
        const status = await aiService.getTrainingStatus(trainingId);
        setTrainingStatus(status);
        
        if (status.status === 'running') {
          // Continue polling
          setTimeout(() => poll(), 5000); // Poll every 5 seconds
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get training status');
      }
    };
    
    poll();
  }, []);

  const cancelTraining = useCallback(async (trainingId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.cancelTraining(trainingId);
      if (result.success) {
        setTrainingStatus(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel training');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadTrainingData = useCallback(async (agentId: string, data: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.uploadTrainingData(agentId, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload training data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trainingStatus,
    loading,
    error,
    startTraining,
    cancelTraining,
    uploadTrainingData,
  };
}

export function useAIPerformance() {
  const [performance, setPerformance] = useState<{
    totalConversations: number;
    averageResponseTime: number;
    userSatisfaction: number;
    costPerConversation: number;
    totalCost: number;
    usageTrends: Array<{
      date: string;
      conversations: number;
      cost: number;
    }>;
  } | null>(null);
  const [costAnalytics, setCostAnalytics] = useState<{
    totalCost: number;
    costByAgent: Array<{
      agentId: string;
      agentName: string;
      cost: number;
      percentage: number;
    }>;
    costByModel: Array<{
      model: string;
      cost: number;
      percentage: number;
    }>;
    dailyCosts: Array<{
      date: string;
      cost: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentPerformance = useCallback(async (agentId: string, timeframe: 'day' | 'week' | 'month' = 'week') => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiService.getAgentPerformance(agentId, timeframe);
      setPerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agent performance');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCostAnalytics = useCallback(async (timeframe: 'day' | 'week' | 'month' = 'month') => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiService.getCostAnalytics(timeframe);
      setCostAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cost analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    performance,
    costAnalytics,
    loading,
    error,
    fetchAgentPerformance,
    fetchCostAnalytics,
  };
}
