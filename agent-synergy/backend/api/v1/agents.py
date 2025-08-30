from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import datetime
import uuid

from core.database import get_supabase
from models.agent import AgentCreate, Agent, AgentUpdate, AgentType, AgentStatus
from models.conversation import ConversationCreate, Conversation, ConversationStatus
from services.auth_service import AuthService
from services.agent_service import AgentService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()

# Services
auth_service = AuthService()
agent_service = AgentService()

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_data: AgentCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new AI agent"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Validate user owns the agent
        if str(agent_data.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot create agent for another user"
            )
        
        supabase = get_supabase()
        
        # Create agent record
        agent_id = str(uuid.uuid4())
        agent_record = {
            'id': agent_id,
            'user_id': agent_data.user_id,
            'name': agent_data.name,
            'agent_type': agent_data.agent_type.value,
            'description': agent_data.description,
            'config': agent_data.config,
            'status': AgentStatus.INACTIVE.value,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('agents').insert(agent_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create agent"
            )
        
        # Return created agent
        created_agent = result.data[0]
        return Agent(
            id=created_agent['id'],
            user_id=created_agent['user_id'],
            name=created_agent['name'],
            agent_type=AgentType(created_agent['agent_type']),
            description=created_agent['description'],
            config=created_agent['config'],
            status=AgentStatus(created_agent['status']),
            created_at=datetime.fromisoformat(created_agent['created_at']),
            updated_at=datetime.fromisoformat(created_agent['updated_at']) if created_agent['updated_at'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create agent: {str(e)}"
        )

@router.get("/", response_model=List[Agent])
async def get_user_agents(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all agents for the current user"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Get user's agents
        result = supabase.table('agents').select('*').eq('user_id', user_id).execute()
        
        agents = []
        for agent_data in result.data:
            agent = Agent(
                id=agent_data['id'],
                user_id=agent_data['user_id'],
                name=agent_data['name'],
                agent_type=AgentType(agent_data['agent_type']),
                description=agent_data['description'],
                config=agent_data['config'],
                status=AgentStatus(agent_data['status']),
                created_at=datetime.fromisoformat(agent_data['created_at']),
                updated_at=datetime.fromisoformat(agent_data['updated_at']) if agent_data['updated_at'] else None
            )
            agents.append(agent)
        
        return agents
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get agents: {str(e)}"
        )

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(
    agent_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get a specific agent by ID"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Get agent
        result = supabase.table('agents').select('*').eq('id', agent_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        agent_data = result.data[0]
        
        # Check if user owns the agent
        if agent_data['user_id'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return Agent(
            id=agent_data['id'],
            user_id=agent_data['user_id'],
            name=agent_data['name'],
            agent_type=AgentType(agent_data['agent_type']),
            description=agent_data['description'],
            config=agent_data['config'],
            status=AgentStatus(agent_data['status']),
            created_at=datetime.fromisoformat(agent_data['created_at']),
            updated_at=datetime.fromisoformat(agent_data['updated_at']) if agent_data['updated_at'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get agent: {str(e)}"
        )

@router.put("/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: str,
    agent_update: AgentUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update an agent"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Check if agent exists and user owns it
        result = supabase.table('agents').select('*').eq('id', agent_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        agent_data = result.data[0]
        
        if agent_data['user_id'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Prepare update data
        update_data = {}
        if agent_update.name is not None:
            update_data['name'] = agent_update.name
        if agent_update.description is not None:
            update_data['description'] = agent_update.description
        if agent_update.config is not None:
            update_data['config'] = agent_update.config
        if agent_update.status is not None:
            update_data['status'] = agent_update.status.value
        
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Update agent
        result = supabase.table('agents').update(update_data).eq('id', agent_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update agent"
            )
        
        # Return updated agent
        updated_agent = result.data[0]
        return Agent(
            id=updated_agent['id'],
            user_id=updated_agent['user_id'],
            name=updated_agent['name'],
            agent_type=AgentType(updated_agent['agent_type']),
            description=updated_agent['description'],
            config=updated_agent['config'],
            status=AgentStatus(updated_agent['status']),
            created_at=datetime.fromisoformat(updated_agent['created_at']),
            updated_at=datetime.fromisoformat(updated_agent['updated_at']) if updated_agent['updated_at'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update agent: {str(e)}"
        )

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete an agent"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Check if agent exists and user owns it
        result = supabase.table('agents').select('*').eq('id', agent_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        agent_data = result.data[0]
        
        if agent_data['user_id'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Delete agent
        supabase.table('agents').delete().eq('id', agent_id).execute()
        
        return {"message": "Agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete agent: {str(e)}"
        )

@router.post("/{agent_id}/chat", response_model=Conversation)
async def chat_with_agent(
    agent_id: str,
    conversation_data: ConversationCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Chat with an AI agent"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Validate user owns the conversation
        if str(conversation_data.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot create conversation for another user"
            )
        
        # Validate agent exists and user owns it
        supabase = get_supabase()
        agent_result = supabase.table('agents').select('*').eq('id', agent_id).execute()
        
        if not agent_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        agent_data = agent_result.data[0]
        
        if agent_data['user_id'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to agent"
            )
        
        # Create conversation record
        conversation_id = str(uuid.uuid4())
        conversation_record = {
            'id': conversation_id,
            'agent_id': agent_id,
            'user_id': user_id,
            'message': conversation_data.message,
            'conversation_type': conversation_data.conversation_type.value,
            'metadata': conversation_data.metadata,
            'status': ConversationStatus.PENDING.value,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Insert conversation
        result = supabase.table('conversations').insert(conversation_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create conversation"
            )
        
        # Process with agent service
        try:
            response = await agent_service.process_message(
                agent_id=agent_id,
                message=conversation_data.message,
                agent_config=agent_data['config']
            )
            
            # Update conversation with response
            update_data = {
                'response': response,
                'status': ConversationStatus.COMPLETED.value,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            supabase.table('conversations').update(update_data).eq('id', conversation_id).execute()
            
            # Return conversation
            return Conversation(
                id=conversation_id,
                agent_id=agent_id,
                user_id=user_id,
                message=conversation_data.message,
                conversation_type=conversation_data.conversation_type,
                metadata=conversation_data.metadata,
                response=response,
                status=ConversationStatus.COMPLETED,
                created_at=datetime.fromisoformat(conversation_record['created_at']),
                updated_at=datetime.utcnow()
            )
            
        except Exception as e:
            # Update conversation with error
            update_data = {
                'status': ConversationStatus.FAILED.value,
                'error_message': str(e),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            supabase.table('conversations').update(update_data).eq('id', conversation_id).execute()
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Agent processing failed: {str(e)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )
