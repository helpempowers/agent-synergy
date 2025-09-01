from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import datetime
import uuid

from core.database import get_supabase
from models.conversation import (
    ConversationCreate, 
    ConversationUpdate, 
    Conversation, 
    ConversationStatus,
    ConversationType,
    ChatMessage
)
from services.auth_service import AuthService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()

# Services
auth_service = AuthService()

@router.post("/", response_model=Conversation, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new conversation"""
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
        
        # Create conversation record
        conversation_id = str(uuid.uuid4())
        conversation_record = {
            'id': conversation_id,
            'user_id': user_id,
            'agent_id': str(conversation_data.agent_id),
            'title': conversation_data.title or "New Conversation",
            'conversation_type': conversation_data.conversation_type.value,
            'metadata': conversation_data.metadata or {},
            'status': ConversationStatus.ACTIVE.value,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('conversations').insert(conversation_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create conversation"
            )
        
        # Return created conversation
        created_conversation = result.data[0]
        return Conversation(
            id=created_conversation['id'],
            user_id=created_conversation['user_id'],
            agent_id=created_conversation['agent_id'],
            title=created_conversation['title'],
            conversation_type=ConversationType(created_conversation['conversation_type']),
            metadata=created_conversation['metadata'],
            status=ConversationStatus(created_conversation['status']),
            created_at=datetime.fromisoformat(created_conversation['created_at']),
            updated_at=datetime.fromisoformat(created_conversation['updated_at'])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create conversation: {str(e)}"
        )

@router.get("/", response_model=List[Conversation])
async def get_conversations(
    agent_id: Optional[str] = Query(None, description="Filter by agent ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=100, description="Number of conversations to return"),
    offset: int = Query(0, ge=0, description="Number of conversations to skip"),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get conversations for the current user"""
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
        
        # Build query
        query = supabase.table('conversations').select('*').eq('user_id', user_id)
        
        if agent_id:
            query = query.eq('agent_id', agent_id)
        if status:
            query = query.eq('status', status)
        
        # Add pagination and ordering
        result = query.order('updated_at', desc=True).range(offset, offset + limit - 1).execute()
        
        # Convert to response models
        conversations = []
        for conv_data in result.data:
            conversations.append(Conversation(
                id=conv_data['id'],
                user_id=conv_data['user_id'],
                agent_id=conv_data['agent_id'],
                title=conv_data['title'],
                conversation_type=ConversationType(conv_data['conversation_type']),
                metadata=conv_data['metadata'],
                status=ConversationStatus(conv_data['status']),
                created_at=datetime.fromisoformat(conv_data['created_at']),
                updated_at=datetime.fromisoformat(conv_data['updated_at'])
            ))
        
        return conversations
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get conversations: {str(e)}"
        )

@router.get("/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get a specific conversation by ID"""
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
        result = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        conv_data = result.data[0]
        return Conversation(
            id=conv_data['id'],
            user_id=conv_data['user_id'],
            agent_id=conv_data['agent_id'],
            title=conv_data['title'],
            conversation_type=ConversationType(conv_data['conversation_type']),
            metadata=conv_data['metadata'],
            status=ConversationStatus(conv_data['status']),
            created_at=datetime.fromisoformat(conv_data['created_at']),
            updated_at=datetime.fromisoformat(conv_data['updated_at'])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get conversation: {str(e)}"
        )

@router.put("/{conversation_id}", response_model=Conversation)
async def update_conversation(
    conversation_id: str,
    updates: ConversationUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update a conversation"""
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
        
        # Check if conversation exists and belongs to user
        existing = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Prepare update data
        update_data = {}
        if updates.title is not None:
            update_data['title'] = updates.title
        if updates.status is not None:
            update_data['status'] = updates.status.value
        if updates.metadata is not None:
            update_data['metadata'] = updates.metadata
        
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Update conversation
        result = supabase.table('conversations').update(update_data).eq('id', conversation_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update conversation"
            )
        
        # Return updated conversation
        updated_conv = result.data[0]
        return Conversation(
            id=updated_conv['id'],
            user_id=updated_conv['user_id'],
            agent_id=updated_conv['agent_id'],
            title=updated_conv['title'],
            conversation_type=ConversationType(updated_conv['conversation_type']),
            metadata=updated_conv['metadata'],
            status=ConversationStatus(updated_conv['status']),
            created_at=datetime.fromisoformat(updated_conv['created_at']),
            updated_at=datetime.fromisoformat(updated_conv['updated_at'])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update conversation: {str(e)}"
        )

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete a conversation"""
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
        
        # Check if conversation exists and belongs to user
        existing = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Delete conversation
        result = supabase.table('conversations').delete().eq('id', conversation_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete conversation"
            )
        
        return {"message": "Conversation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete conversation: {str(e)}"
        )

@router.post("/{conversation_id}/messages")
async def add_message(
    conversation_id: str,
    message_data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Add a message to a conversation"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Validate message data
        role = message_data.get("role", "user")
        content = message_data.get("content", "")
        metadata = message_data.get("metadata", {})
        
        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message content is required"
            )
        
        if role not in ["user", "assistant"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role must be 'user' or 'assistant'"
            )
        
        supabase = get_supabase()
        
        # Check if conversation exists and belongs to user
        existing = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Create message record
        message_id = str(uuid.uuid4())
        message_record = {
            'id': message_id,
            'conversation_id': conversation_id,
            'role': role,
            'content': content,
            'metadata': metadata,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('messages').insert(message_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add message"
            )
        
        # Update conversation timestamp
        supabase.table('conversations').update({
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', conversation_id).execute()
        
        return {
            "message": "Message added successfully",
            "message_id": message_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add message: {str(e)}"
        )

@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = Query(100, ge=1, le=200, description="Number of messages to return"),
    offset: int = Query(0, ge=0, description="Number of messages to skip"),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get messages for a conversation"""
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
        
        # Check if conversation exists and belongs to user
        existing = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Get messages
        result = supabase.table('messages').select('*').eq('conversation_id', conversation_id).order('timestamp', desc=False).range(offset, offset + limit - 1).execute()
        
        messages = []
        for msg_data in result.data:
            messages.append(ChatMessage(
                role=msg_data['role'],
                content=msg_data['content'],
                timestamp=datetime.fromisoformat(msg_data['timestamp']),
                metadata=msg_data.get('metadata', {})
            ))
        
        return messages
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get messages: {str(e)}"
        )

@router.post("/{conversation_id}/complete")
async def complete_conversation(
    conversation_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Mark a conversation as completed"""
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
        
        # Check if conversation exists and belongs to user
        existing = supabase.table('conversations').select('*').eq('id', conversation_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        # Update conversation status
        result = supabase.table('conversations').update({
            'status': ConversationStatus.COMPLETED.value,
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', conversation_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to complete conversation"
            )
        
        return {"message": "Conversation marked as completed"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete conversation: {str(e)}"
        )
