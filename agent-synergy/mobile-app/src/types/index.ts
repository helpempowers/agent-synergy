export interface User {
  id: string;
  email: string;
  company_name?: string;
  company_size?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  confirm_password: string;
  company_name?: string;
  company_size?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  company_name?: string;
  company_size?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  agent_type: 'support' | 'qa' | 'reporting' | 'virtual_assistant' | 'lead_prospector' | 'custom';
  description?: string;
  config: Record<string, unknown>;
  status: 'inactive' | 'active' | 'training' | 'error' | 'maintenance';
  created_at: string;
  updated_at?: string;
  last_active?: string;
  total_conversations: number;
  success_rate: number;
}

export interface AgentCreate {
  user_id: string;
  name: string;
  agent_type: 'support' | 'qa' | 'reporting' | 'virtual_assistant' | 'lead_prospector' | 'custom';
  description?: string;
  config?: Record<string, unknown>;
}

export interface AgentUpdate {
  name?: string;
  description?: string;
  config?: Record<string, unknown>;
  status?: 'inactive' | 'active' | 'training' | 'error' | 'maintenance';
}

export interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  title?: string;
  conversation_type: 'support_ticket' | 'qa_test' | 'report_generation' | 'admin_task' | 'custom';
  metadata?: Record<string, unknown>;
  status: 'active' | 'completed' | 'archived' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ConversationCreate {
  agent_id: string;
  title?: string;
  conversation_type: 'support_ticket' | 'qa_test' | 'report_generation' | 'admin_task' | 'custom';
  metadata?: Record<string, unknown>;
}

export interface ConversationUpdate {
  title?: string;
  status?: 'active' | 'completed' | 'archived' | 'failed';
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsOverview {
  total_agents: number;
  active_agents: number;
  total_conversations: number;
  successful_conversations: number;
  success_rate: number;
  time_saved_hours: number;
  cost_savings: number;
  period: string;
}

export interface ConversationAnalytics {
  timeframe: string;
  total_conversations: number;
  completed_conversations: number;
  failed_conversations: number;
  active_conversations: number;
  success_rate: number;
  conversations_by_type: Record<string, number>;
  daily_conversations: Record<string, number>;
}

export interface CostAnalytics {
  timeframe: string;
  total_cost: number;
  avg_cost_per_conversation: number;
  total_conversations: number;
  cost_by_agent: Record<string, number>;
  daily_costs: Record<string, number>;
}

export interface ROIAnalytics {
  timeframe: string;
  total_cost: number;
  time_saved_hours: number;
  cost_savings: number;
  net_savings: number;
  roi_percentage: number;
  conversations_to_break_even: number;
  total_conversations: number;
  is_profitable: boolean;
}

export interface Integration {
  id: string;
  user_id: string;
  platform: string;
  config: Record<string, unknown>;
  status: 'inactive' | 'active' | 'error';
  created_at: string;
  updated_at: string;
}

export interface SlackIntegration {
  bot_token: string;
  signing_secret: string;
  channel_id: string;
}

export interface GoogleSheetsIntegration {
  spreadsheet_id: string;
  sheet_name: string;
  credentials: Record<string, unknown>;
}

export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface RootStackParamList {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Agents: undefined;
  AgentDetail: { agentId: string };
  Conversations: undefined;
  ConversationDetail: { conversationId: string };
  Analytics: undefined;
  Integrations: undefined;
  Settings: undefined;
  Profile: undefined;
}
