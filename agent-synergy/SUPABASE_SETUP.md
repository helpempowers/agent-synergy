# 🚀 Supabase Setup Guide for Agent Synergy

## 📋 Prerequisites
- Supabase account (free tier available)
- PostgreSQL knowledge (basic)

## 🎯 Step 1: Create Supabase Project

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Click "New Project"**
3. **Fill in project details:**
   - Organization: Your organization
   - Name: `agent-synergy`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. **Click "Create new project"**

## 🗄️ Step 2: Get Database Credentials

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon public key (starts with `eyJ...`)
   - Service role key (starts with `eyJ...`)

## 🔐 Step 3: Configure Environment Variables

Create/update your `.env` file in the backend directory:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI (optional for now)
OPENAI_API_KEY=your-openai-key-here

# Other configurations
DEBUG=true
ENVIRONMENT=development
```

## 🏗️ Step 4: Create Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to SQL Editor in Supabase Dashboard**
2. **Run the following SQL commands:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('support', 'qa', 'reporting', 'virtual_assistant', 'lead_prospector', 'custom')),
    description TEXT,
    config JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'training', 'error', 'maintenance')),
    model_name VARCHAR(100) DEFAULT 'gpt-3.5-turbo',
    is_active BOOLEAN DEFAULT true,
    total_conversations INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    avg_response_time DECIMAL(10,2) DEFAULT 0.0,
    total_tokens_used INTEGER DEFAULT 0,
    capabilities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    title VARCHAR(255),
    conversation_type VARCHAR(50) NOT NULL CHECK (conversation_type IN ('support_ticket', 'qa_test', 'report_generation', 'admin_task', 'custom')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'failed')),
    metadata JSONB DEFAULT '{}',
    message_count INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    token_count INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0.0,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_agents INTEGER DEFAULT 0,
    active_agents INTEGER DEFAULT 0,
    total_conversations INTEGER DEFAULT 0,
    successful_conversations INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.0,
    time_saved_hours DECIMAL(10,2) DEFAULT 0.0,
    cost_savings DECIMAL(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_date ON analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Agents policies
CREATE POLICY "Users can view own agents" ON agents FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own agents" ON agents FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own agents" ON agents FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own agents" ON agents FOR DELETE USING (auth.uid()::text = user_id::text);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid()::text = user_id::text);

-- Messages policies
CREATE POLICY "Users can view messages from own conversations" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE conversations.id = messages.conversation_id 
        AND conversations.user_id::text = auth.uid()::text
    )
);
CREATE POLICY "Users can insert messages to own conversations" ON messages FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE conversations.id = messages.conversation_id 
        AND conversations.user_id::text = auth.uid()::text
    )
);

-- Integrations policies
CREATE POLICY "Users can view own integrations" ON integrations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own integrations" ON integrations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own integrations" ON integrations FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own integrations" ON integrations FOR DELETE USING (auth.uid()::text = user_id::text);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
```

### Option B: Using Migration Files

1. **Create a migrations folder:**
```bash
mkdir -p backend/migrations
```

2. **Create migration file:**
```bash
touch backend/migrations/001_initial_schema.sql
```

3. **Copy the SQL above into the migration file**

## 🔧 Step 5: Test Database Connection

1. **Restart your backend server:**
```bash
cd backend
source venv/bin/activate
python run.py
```

2. **Test the API:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "confirm_password": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company"
  }'
```

## 🎯 Step 6: Verify Setup

You should see:
- ✅ Database connection successful
- ✅ User registration working
- ✅ No more "Database not initialized" errors

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid URL" error:**
   - Check your SUPABASE_URL format
   - Should be: `https://your-project.supabase.co`

2. **"Invalid API key" error:**
   - Verify your SUPABASE_ANON_KEY
   - Make sure it starts with `eyJ`

3. **"Table does not exist" error:**
   - Run the SQL commands in Supabase SQL Editor
   - Check table names match exactly

4. **RLS Policy errors:**
   - Make sure RLS is enabled
   - Check policy syntax

## 📚 Next Steps

1. **Set up authentication in Supabase Dashboard**
2. **Configure email templates**
3. **Set up storage buckets (if needed)**
4. **Configure real-time subscriptions**

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
