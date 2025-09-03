-- Agent Synergy Database Schema
-- This file contains all the necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('support', 'qa', 'reporting', 'admin')),
    model VARCHAR(100) NOT NULL,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    system_prompt TEXT,
    capabilities TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'training', 'error')),
    integration_preferences TEXT[] DEFAULT '{}',
    custom_instructions TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    conversation_type VARCHAR(50) DEFAULT 'chat' CHECK (conversation_type IN ('chat', 'task', 'analysis')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversation Messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'connecting')),
    last_sync TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Training Data table
CREATE TABLE IF NOT EXISTS training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    context TEXT,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Training Sessions table
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'training', 'completed', 'failed')),
    progress DECIMAL(5,2) DEFAULT 0.0,
    epochs INTEGER DEFAULT 10,
    learning_rate DECIMAL(10,6) DEFAULT 0.001,
    batch_size INTEGER DEFAULT 32,
    metrics JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent Performance table
CREATE TABLE IF NOT EXISTS agent_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    successful_conversations INTEGER DEFAULT 0,
    failed_conversations INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0.0,
    avg_response_time DECIMAL(8,3) DEFAULT 0.0,
    user_satisfaction_avg DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password Reset Tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_training_data_agent_id ON training_data(agent_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_agent_id ON training_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_agent_id ON agent_performance(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_performance_date ON agent_performance(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, company_size, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@agentsynergy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kq', 'Demo', 'User', 'Demo Company', '11-50', true);

-- Insert sample agents
INSERT INTO agents (id, user_id, name, description, agent_type, model, system_prompt, capabilities, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Support Bot', 'Customer support agent for handling inquiries', 'support', 'gpt-4', 'You are a helpful customer support agent. Be polite and professional.', ARRAY['ticket_management', 'knowledge_base', 'escalation'], 'active'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'QA Tester', 'Automated testing and quality assurance', 'qa', 'gpt-4', 'You are a QA testing specialist. Help with test planning and execution.', ARRAY['test_execution', 'bug_reporting', 'regression_testing'], 'active'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Report Generator', 'Data analysis and report generation', 'reporting', 'gpt-4', 'You are a data analyst. Help generate insights and reports.', ARRAY['data_analysis', 'report_generation', 'trend_identification'], 'active');

-- Insert sample conversations
INSERT INTO conversations (id, user_id, agent_id, title, status) VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Password Reset Help', 'completed'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Test Case Review', 'active');

-- Insert sample messages
INSERT INTO conversation_messages (conversation_id, role, content) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'user', 'I need help resetting my password'),
('550e8400-e29b-41d4-a716-446655440004', 'assistant', 'I can help you with that! Click the "Forgot Password" link on the login page and follow the instructions sent to your email.'),
('550e8400-e29b-41d4-a716-446655440005', 'user', 'Can you review these test cases for the payment module?'),
('550e8400-e29b-41d4-a716-446655440005', 'assistant', 'I\'d be happy to review your test cases for the payment module. Please share the test cases you\'d like me to examine.');

-- Insert sample integrations
INSERT INTO integrations (user_id, integration_type, name, config, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'Slack Workspace', '{"workspace": "demo-workspace", "channels": ["#support", "#general"]}', 'connected'),
('550e8400-e29b-41d4-a716-446655440000', 'email', 'Business Email', '{"smtp_server": "smtp.gmail.com", "port": 587}', 'connected'),
('550e8400-e29b-41d4-a716-446655440000', 'jira', 'Jira Project', '{"project_key": "DEMO", "base_url": "https://demo.atlassian.net"}', 'disconnected');

-- Insert sample training data
INSERT INTO training_data (agent_id, input_text, expected_output, context, category, tags) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'How do I reset my password?', 'Click the "Forgot Password" link on the login page and follow the email instructions.', 'password_reset', 'support', ARRAY['password', 'reset', 'login']),
('550e8400-e29b-41d4-a716-446655440001', 'What are your business hours?', 'We are open Monday-Friday 9AM-6PM EST.', 'business_hours', 'support', ARRAY['hours', 'time', 'business']),
('550e8400-e29b-41d4-a716-446655440002', 'How do I run regression tests?', 'Use the command: npm run test:regression. This will execute all regression test suites.', 'testing', 'qa', ARRAY['testing', 'regression', 'npm']);

-- Insert sample performance data
INSERT INTO agent_performance (agent_id, date, total_conversations, successful_conversations, total_tokens_used, total_cost, avg_response_time) VALUES
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 25, 24, 1500, 0.045, 2.3),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '1 day', 15, 15, 1200, 0.036, 1.8),
('550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '1 day', 8, 8, 800, 0.024, 5.2);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
