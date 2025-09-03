from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class AgentType(str, Enum):
    """Agent types"""
    SUPPORT = "support"
    QA = "qa"
    REPORTING = "reporting"
    VIRTUAL_ASSISTANT = "virtual_assistant"
    LEAD_PROSPECTOR = "lead_prospector"
    CUSTOM = "custom"

class AgentStatus(str, Enum):
    """Agent status"""
    INACTIVE = "inactive"
    ACTIVE = "active"
    TRAINING = "training"
    ERROR = "error"
    MAINTENANCE = "maintenance"

class AgentBase(BaseModel):
    """Base agent model"""
    name: str = Field(..., min_length=1, max_length=100)
    agent_type: AgentType
    description: Optional[str] = None
    config: Dict[str, Any] = {}

class AgentCreate(AgentBase):
    """Agent creation model"""
    user_id: UUID

class AgentUpdate(BaseModel):
    """Agent update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    status: Optional[AgentStatus] = None

class Agent(AgentBase):
    """Agent response model"""
    id: UUID
    user_id: UUID
    status: AgentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_active: Optional[datetime] = None
    total_conversations: int = 0
    success_rate: float = 0.0

    class Config:
        from_attributes = True

class AgentWithConversations(Agent):
    """Agent with conversations model"""
    conversations: List['Conversation'] = []

class AgentConfig(BaseModel):
    """Agent configuration model"""
    company_name: Optional[str] = None
    company_policies: Optional[List[str]] = None
    faqs: Optional[List[str]] = None
    custom_instructions: Optional[str] = None
    response_tone: Optional[str] = "professional"
    max_response_length: Optional[int] = 500
    allowed_actions: Optional[List[str]] = None
    fallback_responses: Optional[List[str]] = None

class AgentPerformance(BaseModel):
    """Agent performance metrics"""
    agent_id: UUID
    total_conversations: int
    successful_conversations: int
    failed_conversations: int
    success_rate: float
    avg_response_time: float
    total_cost: float
    cost_savings: float
    last_30_days: Dict[str, Any]
