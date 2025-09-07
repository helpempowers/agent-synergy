const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  company_name: string;
  company_size: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  agent_type: 'CHATBOT' | 'ASSISTANT' | 'ANALYST' | 'CUSTOM';
  description: string;
  config: Record<string, any>;
  status: 'ACTIVE' | 'INACTIVE' | 'TRAINING' | 'ERROR';
  created_at: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  message: string;
  conversation_type: 'CHAT' | 'TASK' | 'ANALYSIS';
  metadata?: Record<string, any>;
  response?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  company_name: string;
  company_size: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CreateAgentRequest {
  user_id: string;
  name: string;
  agent_type: 'CHATBOT' | 'ASSISTANT' | 'ANALYST' | 'CUSTOM';
  description: string;
  config: Record<string, any>;
}

export interface CreateConversationRequest {
  user_id: string;
  message: string;
  conversation_type: 'CHAT' | 'TASK' | 'ANALYSIS';
  metadata?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/v1/auth/me');
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    });
    
    this.clearToken();
    return response;
  }

  // Agent endpoints
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>('/api/v1/agents');
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/api/v1/agents/${agentId}`);
  }

  async createAgent(agentData: CreateAgentRequest): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentId: string, agentData: Partial<CreateAgentRequest>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/api/v1/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(agentId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/v1/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Conversation endpoints
  async chatWithAgent(agentId: string, conversationData: CreateConversationRequest): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>(`/api/v1/agents/${agentId}/chat`, {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string; version: string }>> {
    return this.request<{ status: string; service: string; version: string }>('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

