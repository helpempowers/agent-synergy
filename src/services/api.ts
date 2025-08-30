import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              await AsyncStorage.setItem('access_token', response.access_token);
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    const response: AxiosResponse = await this.api.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(userData: any) {
    const response: AxiosResponse = await this.api.post('/api/v1/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response: AxiosResponse = await this.api.post('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response: AxiosResponse = await this.api.get('/api/v1/auth/me');
    return response.data;
  }

  // User endpoints
  async updateUser(userData: any) {
    const response: AxiosResponse = await this.api.put('/api/v1/users/me', userData);
    return response.data;
  }

  async deleteUser() {
    const response: AxiosResponse = await this.api.delete('/api/v1/users/me');
    return response.data;
  }

  // Agent endpoints
  async getAgents() {
    const response: AxiosResponse = await this.api.get('/api/v1/agents/');
    return response.data;
  }

  async getAgent(agentId: string) {
    const response: AxiosResponse = await this.api.get(`/api/v1/agents/${agentId}`);
    return response.data;
  }

  async createAgent(agentData: any) {
    const response: AxiosResponse = await this.api.post('/api/v1/agents/', agentData);
    return response.data;
  }

  async updateAgent(agentId: string, agentData: any) {
    const response: AxiosResponse = await this.api.put(`/api/v1/agents/${agentId}`, agentData);
    return response.data;
  }

  async deleteAgent(agentId: string) {
    const response: AxiosResponse = await this.api.delete(`/api/v1/agents/${agentId}`);
    return response.data;
  }

  async chatWithAgent(agentId: string, message: string) {
    const response: AxiosResponse = await this.api.post('/api/v1/agents/chat', {
      agent_id: agentId,
      message,
    });
    return response.data;
  }

  // Conversation endpoints
  async getConversations(params?: any) {
    const response: AxiosResponse = await this.api.get('/api/v1/conversations/', { params });
    return response.data;
  }

  async getConversation(conversationId: string) {
    const response: AxiosResponse = await this.api.get(`/api/v1/conversations/${conversationId}`);
    return response.data;
  }

  async createConversation(conversationData: any) {
    const response: AxiosResponse = await this.api.post('/api/v1/conversations/', conversationData);
    return response.data;
  }

  async addMessage(conversationId: string, messageData: any) {
    const response: AxiosResponse = await this.api.post(`/api/v1/conversations/${conversationId}/messages`, messageData);
    return response.data;
  }

  async getConversationMessages(conversationId: string, params?: any) {
    const response: AxiosResponse = await this.api.get(`/api/v1/conversations/${conversationId}/messages`, { params });
    return response.data;
  }

  // Integration endpoints
  async getIntegrations() {
    const response: AxiosResponse = await this.api.get('/api/v1/integrations/');
    return response.data;
  }

  async connectIntegration(integrationData: any) {
    const response: AxiosResponse = await this.api.post('/api/v1/integrations/', integrationData);
    return response.data;
  }

  async disconnectIntegration(integrationId: string) {
    const response: AxiosResponse = await this.api.delete(`/api/v1/integrations/${integrationId}`);
    return response.data;
  }

  // Analytics endpoints
  async getAnalytics(timeframe: string = 'week') {
    const response: AxiosResponse = await this.api.get('/api/v1/analytics/', { params: { timeframe } });
    return response.data;
  }

  async getAgentPerformance(agentId: string, timeframe: string = 'week') {
    const response: AxiosResponse = await this.api.get(`/api/v1/analytics/agents/${agentId}/performance`, {
      params: { timeframe },
    });
    return response.data;
  }

  // Training endpoints
  async uploadTrainingData(agentId: string, trainingData: any) {
    const response: AxiosResponse = await this.api.post(`/api/v1/agents/${agentId}/training`, {
      training_data: trainingData,
    });
    return response.data;
  }

  async startTraining(agentId: string, trainingOptions: any) {
    const response: AxiosResponse = await this.api.post(`/api/v1/agents/${agentId}/train`, trainingOptions);
    return response.data;
  }

  async getTrainingStatus(trainingId: string) {
    const response: AxiosResponse = await this.api.get(`/api/v1/training/${trainingId}/status`);
    return response.data;
  }

  // Utility methods
  async uploadFile(url: string, file: any, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const api = new ApiService();
