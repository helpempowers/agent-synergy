// Agent Synergy Web App Types

// User Types
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
  company_name?: string;
  company_size?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  confirm_password: string;
}

export interface UserUpdate {
  company_name?: string;
  company_size?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Agent Types
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  agent_type: AgentType;
  description?: string;
  config: Record<string, any>;
  status: AgentStatus;
  created_at: string;
  updated_at?: string;
  last_active?: string;
  total_conversations: number;
  success_rate: number;
}

export type AgentType = 'support' | 'qa' | 'reporting' | 'virtual_assistant' | 'lead_prospector' | 'custom';

export type AgentStatus = 'inactive' | 'active' | 'training' | 'error' | 'maintenance';

export interface AgentCreate {
  user_id: string;
  name: string;
  agent_type: AgentType;
  description?: string;
  config: Record<string, any>;
}

export interface AgentUpdate {
  name?: string;
  description?: string;
  config?: Record<string, any>;
  status?: AgentStatus;
}

export interface AgentConfig {
  company_name?: string;
  company_policies?: string[];
  faqs?: string[];
  custom_instructions?: string;
  response_tone?: string;
  max_response_length?: number;
  allowed_actions?: string[];
  fallback_responses?: string[];
}

// Conversation Types
export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string;
  message: string;
  response?: string;
  conversation_type: ConversationType;
  metadata?: Record<string, any>;
  status: ConversationStatus;
  created_at: string;
  updated_at?: string;
  processing_time?: number;
  cost?: number;
  error_message?: string;
  tokens_used?: number;
  model_used?: string;
}

export type ConversationType = 'support_ticket' | 'qa_test' | 'report_generation' | 'admin_task' | 'custom';

export type ConversationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'timeout';

export interface ConversationCreate {
  agent_id: string;
  user_id: string;
  message: string;
  conversation_type: ConversationType;
  metadata?: Record<string, any>;
}

// Integration Types
export interface Integration {
  id: string;
  user_id: string;
  platform: string;
  config: Record<string, any>;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface IntegrationConfig {
  slack?: SlackConfig;
  google_sheets?: GoogleSheetsConfig;
  jira?: JiraConfig;
}

export interface SlackConfig {
  bot_token: string;
  signing_secret: string;
  channels?: string[];
}

export interface GoogleSheetsConfig {
  credentials_file: string;
  token_file: string;
  spreadsheet_ids?: string[];
}

export interface JiraConfig {
  base_url: string;
  username: string;
  api_token: string;
  project_keys?: string[];
}

// Analytics Types
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

export interface AgentPerformance {
  agent_id: string;
  total_conversations: number;
  successful_conversations: number;
  failed_conversations: number;
  success_rate: number;
  time_saved_hours: number;
  cost_savings: number;
  daily_conversations: Record<string, number>;
  period: string;
}

export interface ROIMetrics {
  total_conversations: number;
  successful_conversations: number;
  time_saved_hours: number;
  cost_savings: number;
  subscription_cost: number;
  roi_percentage: number;
  conversations_to_break_even: number;
  break_even_status: string;
  period: string;
}

export interface ConversationAnalytics {
  total_conversations: number;
  conversations_by_status: Record<string, number>;
  conversations_by_type: Record<string, number>;
  daily_conversations: Record<string, number>;
  period_days: number;
}

export interface Trends {
  weekly_conversations: Record<string, number>;
  growth_rate_percent: number;
  trend_direction: string;
  period: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// UI Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
  badge?: string;
}

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  children?: SidebarItem[];
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

// Chart Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, any>;
}

// Feature Flag Types
export interface FeatureFlags {
  analytics: boolean;
  integrations: boolean;
  agent_marketplace: boolean;
}

// App Configuration
export interface AppConfig {
  name: string;
  version: string;
  description: string;
  apiBaseUrl: string;
  apiVersion: string;
  features: FeatureFlags;
}
