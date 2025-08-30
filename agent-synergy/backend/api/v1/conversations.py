from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from models.conversation import ConversationCreate, ConversationUpdate, ConversationResponse
from models.user import User
from services.conversation_service import conversation_service
from services.auth_service import get_current_user

router = APIRouter()

@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new conversation"""
    try:
        conversation = await conversation_service.create_conversation(conversation_data, current_user)
        return conversation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[ConversationResponse])
async def get_conversations(
    agent_id: Optional[str] = Query(None, description="Filter by agent ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=100, description="Number of conversations to return"),
    offset: int = Query(0, ge=0, description="Number of conversations to skip"),
    current_user: User = Depends(get_current_user)
):
    """Get conversations for the current user"""
    try:
        conversations = await conversation_service.get_user_conversations(
            current_user, agent_id, status, limit, offset
        )
        return conversations
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific conversation by ID"""
    try:
        conversation = await conversation_service.get_conversation(conversation_id, current_user)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: str,
    updates: ConversationUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update a conversation"""
    try:
        conversation = await conversation_service.update_conversation(conversation_id, updates, current_user)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation"""
    try:
        success = await conversation_service.delete_conversation(conversation_id, current_user)
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {"message": "Conversation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{conversation_id}/messages")
async def add_message(
    conversation_id: str,
    message_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Add a message to a conversation"""
    try:
        role = message_data.get("role", "user")
        content = message_data.get("message", "")
        metadata = message_data.get("metadata")
        
        if not content:
            raise HTTPException(status_code=400, detail="Message content is required")
            
        message = await conversation_service.add_message(
            conversation_id, role, content, current_user, metadata
        )
        return message
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = Query(100, ge=1, le=200, description="Number of messages to return"),
    offset: int = Query(0, ge=0, description="Number of messages to skip"),
    current_user: User = Depends(get_current_user)
):
    """Get messages for a conversation"""
    try:
        messages = await conversation_service.get_conversation_messages(
            conversation_id, current_user, limit, offset
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{conversation_id}/complete")
async def complete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a conversation as completed"""
    try:
        success = await conversation_service.mark_conversation_completed(conversation_id, current_user)
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {"message": "Conversation marked as completed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/summary")
async def get_conversation_analytics(
    timeframe: str = Query("week", description="Timeframe for analytics"),
    current_user: User = Depends(get_current_user)
):
    """Get conversation analytics for the current user"""
    try:
        analytics = await conversation_service.get_conversation_analytics(current_user, timeframe)
        return analytics
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
