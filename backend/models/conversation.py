from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class ConversationStatus(str, Enum):
    """Conversation status"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"
    FAILED = "failed"

class ConversationType(str, Enum):
    """Conversation types"""
    SUPPORT_TICKET = "support_ticket"
    QA_TEST = "qa_test"
    REPORT_GENERATION = "report_generation"
    ADMIN_TASK = "admin_task"
    CUSTOM = "custom"

class ConversationBase(BaseModel):
    """Base conversation model"""
    agent_id: UUID
    title: Optional[str] = "New Conversation"
    conversation_type: ConversationType = ConversationType.CUSTOM
    metadata: Optional[Dict[str, Any]] = {}

class ConversationCreate(ConversationBase):
    """Conversation creation model"""
    pass

class ConversationUpdate(BaseModel):
    """Conversation update model"""
    title: Optional[str] = None
    status: Optional[ConversationStatus] = None
    metadata: Optional[Dict[str, Any]] = None

class Conversation(ConversationBase):
    """Conversation model"""
    id: UUID
    user_id: UUID
    status: ConversationStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(Conversation):
    """Conversation response model for API"""
    pass

class ConversationWithAgent(Conversation):
    """Conversation with agent details"""
    agent_name: str
    agent_type: str

class ConversationAnalytics(BaseModel):
    """Conversation analytics model"""
    total_conversations: int
    successful_conversations: int
    failed_conversations: int
    avg_processing_time: float
    total_cost: float
    success_rate: float
    conversations_by_type: Dict[str, int]
    conversations_by_status: Dict[str, int]
    daily_conversations: Dict[str, int]

class ChatMessage(BaseModel):
    """Individual chat message model"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None
