from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from models.conversation import ConversationCreate, ConversationUpdate, ConversationResponse
from models.user import User
from core.database import get_supabase

class ConversationService:
    def __init__(self):
        pass

    def _get_supabase(self):
        return get_supabase()

    async def create_conversation(self, conversation_data: ConversationCreate, user: User) -> ConversationResponse:
        """Create a new conversation"""
        conversation_id = str(uuid.uuid4())
        
        conversation = {
            "id": conversation_id,
            "user_id": user.id,
            "agent_id": conversation_data.agent_id,
            "title": conversation_data.title or "New Conversation",
            "status": "active",
            "conversation_type": conversation_data.conversation_type.value,
            "metadata": conversation_data.metadata or {},
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = self._get_supabase().table("conversations").insert(conversation).execute()
        
        if result.data:
            return ConversationResponse(**result.data[0])
        raise Exception("Failed to create conversation")

    async def get_conversation(self, conversation_id: str, user: User) -> Optional[ConversationResponse]:
        """Get a specific conversation by ID"""
        result = self._get_supabase().table("conversations").select("*").eq("id", conversation_id).eq("user_id", user.id).execute()
        
        if result.data:
            return ConversationResponse(**result.data[0])
        return None

    async def get_user_conversations(
        self, 
        user: User, 
        agent_id: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[ConversationResponse]:
        """Get conversations for a user with optional filters"""
        query = self._get_supabase().table("conversations").select("*").eq("user_id", user.id)
        
        if agent_id:
            query = query.eq("agent_id", agent_id)
        if status:
            query = query.eq("status", status)
            
        result = query.order("updated_at", desc=True).range(offset, offset + limit - 1).execute()
        
        return [ConversationResponse(**conv) for conv in result.data]

    async def update_conversation(
        self, 
        conversation_id: str, 
        updates: ConversationUpdate, 
        user: User
    ) -> Optional[ConversationResponse]:
        """Update a conversation"""
        # Verify ownership
        existing = await self.get_conversation(conversation_id, user)
        if not existing:
            return None
            
        update_data = updates.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = self._get_supabase().table("conversations").update(update_data).eq("id", conversation_id).execute()
        
        if result.data:
            return ConversationResponse(**result.data[0])
        return None

    async def delete_conversation(self, conversation_id: str, user: User) -> bool:
        """Delete a conversation"""
        # Verify ownership
        existing = await self.get_conversation(conversation_id, user)
        if not existing:
            return False
            
        result = self._get_supabase().table("conversations").delete().eq("id", conversation_id).execute()
        return len(result.data) > 0

    async def add_message(
        self, 
        conversation_id: str, 
        role: str, 
        content: str, 
        user: User,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Add a message to a conversation"""
        # Verify conversation ownership
        conversation = await self.get_conversation(conversation_id, user)
        if not conversation:
            raise Exception("Conversation not found or access denied")
        
        message_id = str(uuid.uuid4())
        message = {
            "id": message_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        }
        
        result = self.supabase.table("conversation_messages").insert(message).execute()
        
        if result.data:
            # Update conversation timestamp
            await self.update_conversation(conversation_id, ConversationUpdate(), user)
            return result.data[0]
        raise Exception("Failed to add message")

    async def get_conversation_messages(
        self, 
        conversation_id: str, 
        user: User,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get messages for a conversation"""
        # Verify conversation ownership
        conversation = await self.get_conversation(conversation_id, user)
        if not conversation:
            return []
        
        result = self.supabase.table("conversation_messages").select("*").eq("conversation_id", conversation_id).order("timestamp", desc=True).range(offset, offset + limit - 1).execute()
        
        return result.data or []

    async def mark_conversation_completed(self, conversation_id: str, user: User) -> bool:
        """Mark a conversation as completed"""
        conversation = await self.get_conversation(conversation_id, user)
        if not conversation:
            return False
        
        updates = ConversationUpdate(status="completed")
        result = await self.update_conversation(conversation_id, updates, user)
        return result is not None

    async def get_conversation_analytics(self, user: User, timeframe: str = "week") -> Dict[str, Any]:
        """Get conversation analytics for a user"""
        # Get all user conversations
        conversations = await self.get_user_conversations(user, limit=1000, offset=0)
        
        if not conversations:
            return {
                "total_conversations": 0,
                "successful_conversations": 0,
                "failed_conversations": 0,
                "avg_processing_time": 0,
                "total_cost": 0,
                "success_rate": 0,
                "conversations_by_type": {},
                "conversations_by_status": {},
                "daily_conversations": {}
            }
        
        # Calculate analytics
        total = len(conversations)
        successful = len([c for c in conversations if c.status == "completed"])
        failed = len([c for c in conversations if c.status == "failed"])
        
        # Count by type and status
        by_type = {}
        by_status = {}
        for conv in conversations:
            by_type[conv.conversation_type] = by_type.get(conv.conversation_type, 0) + 1
            by_status[conv.status] = by_status.get(conv.status, 0) + 1
        
        return {
            "total_conversations": total,
            "successful_conversations": successful,
            "failed_conversations": failed,
            "avg_processing_time": 0,  # Not implemented yet
            "total_cost": 0,  # Not implemented yet
            "success_rate": (successful / total) * 100 if total > 0 else 0,
            "conversations_by_type": by_type,
            "conversations_by_status": by_status,
            "daily_conversations": {}  # Not implemented yet
        }

# Create service instance
conversation_service = ConversationService()
