import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  UserCreate,
  UserLogin,
  UserUpdate,
  AuthResponse,
  Agent,
  AgentCreate,
  AgentUpdate,
  Conversation,
  ConversationCreate,
  ConversationUpdate,
  ChatMessage,
  AnalyticsOverview,
  ConversationAnalytics,
  CostAnalytics,
  ROIAnalytics,
  Integration,
  SlackIntegration,
  GoogleSheetsIntegration,
  ApiError,
  PaginatedResponse
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          AsyncStorage.removeItem('access_token');
          AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async register(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/api/v1/auth/register', userData);
    return response.data;
  }

  async login(credentials: UserLogin): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/v1/auth/login', credentials);
    return response.data;
  }

  async refreshToken(): Promise<{ access_token: string; token_type: string }> {
    const response = await this.client.post('/api/v1/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/api/v1/auth/logout');
  }

  // Users
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/api/v1/users/me');
    return response.data;
  }

  async updateCurrentUser(userData: UserUpdate): Promise<User> {
    const response: AxiosResponse<User> = await this.client.put('/api/v1/users/me', userData);
    return response.data;
  }

  // Agents
  async createAgent(agentData: AgentCreate): Promise<Agent> {
    const response: AxiosResponse<Agent> = await this.client.post('/api/v1/agents', agentData);
    return response.data;
  }

  async getAgents(): Promise<Agent[]> {
    const response: AxiosResponse<Agent[]> = await this.client.get('/api/v1/agents');
    return response.data;
  }

  async getAgent(agentId: string): Promise<Agent> {
    const response: AxiosResponse<Agent> = await this.client.get(`/api/v1/agents/${agentId}`);
    return response.data;
  }

  async updateAgent(agentId: string, agentData: AgentUpdate): Promise<Agent> {
    const response: AxiosResponse<Agent> = await this.client.put(`/api/v1/agents/${agentId}`, agentData);
    return response.data;
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.client.delete(`/api/v1/agents/${agentId}`);
  }

  async chatWithAgent(agentId: string, message: string, conversationType: string = 'custom', metadata?: Record<string, unknown>): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await this.client.post(`/api/v1/agents/${agentId}/chat`, {
      message,
      conversation_type: conversationType,
      metadata
    });
    return response.data;
  }

  // Conversations
  async createConversation(conversationData: ConversationCreate): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await this.client.post('/api/v1/conversations', conversationData);
    return response.data;
  }

  async getConversations(params?: {
    agent_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Conversation[]> {
    const response: AxiosResponse<Conversation[]> = await this.client.get('/api/v1/conversations', { params });
    return response.data;
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await this.client.get(`/api/v1/conversations/${conversationId}`);
    return response.data;
  }

  async updateConversation(conversationId: string, conversationData: ConversationUpdate): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await this.client.put(`/api/v1/conversations/${conversationId}`, conversationData);
    return response.data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.client.delete(`/api/v1/conversations/${conversationId}`);
  }

  async addMessage(conversationId: string, messageData: { role: string; content: string; metadata?: Record<string, unknown> }): Promise<{ message: string; message_id: string }> {
    const response = await this.client.post(`/api/v1/conversations/${conversationId}/messages`, messageData);
    return response.data;
  }

  async getMessages(conversationId: string, params?: { limit?: number; offset?: number }): Promise<ChatMessage[]> {
    const response: AxiosResponse<ChatMessage[]> = await this.client.get(`/api/v1/conversations/${conversationId}/messages`, { params });
    return response.data;
  }

  async completeConversation(conversationId: string): Promise<{ message: string }> {
    const response = await this.client.post(`/api/v1/conversations/${conversationId}/complete`);
    return response.data;
  }

  // Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response: AxiosResponse<AnalyticsOverview> = await this.client.get('/api/v1/analytics/overview');
    return response.data;
  }

  async getAgentPerformance(agentId: string): Promise<unknown> {
    const response = await this.client.get(`/api/v1/analytics/agents/${agentId}/performance`);
    return response.data;
  }

  async getConversationAnalytics(timeframe: string = '30d'): Promise<ConversationAnalytics> {
    const response: AxiosResponse<ConversationAnalytics> = await this.client.get('/api/v1/analytics/conversations', {
      params: { timeframe }
    });
    return response.data;
  }

  async getCostAnalytics(timeframe: string = '30d'): Promise<CostAnalytics> {
    const response: AxiosResponse<CostAnalytics> = await this.client.get('/api/v1/analytics/costs', {
      params: { timeframe }
    });
    return response.data;
  }

  async getROIAnalytics(timeframe: string = '30d'): Promise<ROIAnalytics> {
    const response: AxiosResponse<ROIAnalytics> = await this.client.get('/api/v1/analytics/roi', {
      params: { timeframe }
    });
    return response.data;
  }

  // Integrations
  async getIntegrations(): Promise<Integration[]> {
    const response: AxiosResponse<Integration[]> = await this.client.get('/api/v1/integrations');
    return response.data;
  }

  async connectSlack(slackData: SlackIntegration): Promise<Integration> {
    const response: AxiosResponse<Integration> = await this.client.post('/api/v1/integrations/slack', slackData);
    return response.data;
  }

  async connectGoogleSheets(sheetsData: GoogleSheetsIntegration): Promise<Integration> {
    const response: AxiosResponse<Integration> = await this.client.post('/api/v1/integrations/google-sheets', sheetsData);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
