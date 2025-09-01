from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, List
from datetime import datetime, timedelta

from core.database import get_supabase
from services.auth_service import AuthService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()

# Services
auth_service = AuthService()

@router.get("/overview")
async def get_analytics_overview(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get analytics overview for the current user"""
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
        agents_result = supabase.table('agents').select('*').eq('user_id', user_id).execute()
        agents = agents_result.data or []
        
        # Get conversations for the last 30 days
        thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', thirty_days_ago).execute()
        conversations = conversations_result.data or []
        
        # Calculate metrics
        total_agents = len(agents)
        active_agents = len([a for a in agents if a['status'] == 'active'])
        total_conversations = len(conversations)
        successful_conversations = len([c for c in conversations if c['status'] == 'completed'])
        success_rate = (successful_conversations / total_conversations * 100) if total_conversations > 0 else 0
        
        # Calculate cost savings (rough estimate)
        # Assume each conversation saves 15 minutes of human time at $50/hour
        time_saved_hours = total_conversations * 0.25  # 15 minutes = 0.25 hours
        cost_savings = time_saved_hours * 50  # $50/hour
        
        overview = {
            "total_agents": total_agents,
            "active_agents": active_agents,
            "total_conversations": total_conversations,
            "successful_conversations": successful_conversations,
            "success_rate": round(success_rate, 2),
            "time_saved_hours": round(time_saved_hours, 2),
            "cost_savings": round(cost_savings, 2),
            "period": "last_30_days"
        }
        
        return overview
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics overview: {str(e)}"
        )

@router.get("/agents/{agent_id}/performance")
async def get_agent_performance(
    agent_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get performance metrics for a specific agent"""
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
        
        # Verify agent belongs to user
        agent_result = supabase.table('agents').select('*').eq('id', agent_id).eq('user_id', user_id).execute()
        
        if not agent_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Get agent conversations for the last 30 days
        thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
        conversations_result = supabase.table('conversations').select('*').eq('agent_id', agent_id).gte('created_at', thirty_days_ago).execute()
        conversations = conversations_result.data or []
        
        # Calculate metrics
        total_conversations = len(conversations)
        successful_conversations = len([c for c in conversations if c['status'] == 'completed'])
        failed_conversations = len([c for c in conversations if c['status'] == 'failed'])
        success_rate = (successful_conversations / total_conversations * 100) if total_conversations > 0 else 0
        
        # Calculate time and cost savings
        time_saved_hours = successful_conversations * 0.25  # 15 minutes per conversation
        cost_savings = time_saved_hours * 50  # $50/hour
        
        # Daily breakdown
        daily_conversations = {}
        for conversation in conversations:
            date = conversation['created_at'][:10]  # Extract date part
            daily_conversations[date] = daily_conversations.get(date, 0) + 1
        
        performance = {
            "agent_id": agent_id,
            "total_conversations": total_conversations,
            "successful_conversations": successful_conversations,
            "failed_conversations": failed_conversations,
            "success_rate": round(success_rate, 2),
            "time_saved_hours": round(time_saved_hours, 2),
            "cost_savings": round(cost_savings, 2),
            "daily_conversations": daily_conversations,
            "period": "last_30_days"
        }
        
        return performance
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get agent performance: {str(e)}"
        )

@router.get("/roi")
async def get_roi_metrics(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get ROI metrics for the current user"""
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
        agents_result = supabase.table('agents').select('*').eq('user_id', user_id).execute()
        agents = agents_result.data or []
        
        # Get conversations for the last 30 days
        thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', thirty_days_ago).execute()
        conversations = conversations_result.data or []
        
        # Calculate ROI metrics
        total_conversations = len(conversations)
        successful_conversations = len([c for c in conversations if c['status'] == 'completed'])
        
        # Time and cost savings
        time_saved_hours = successful_conversations * 0.25  # 15 minutes per conversation
        cost_savings = time_saved_hours * 50  # $50/hour
        
        # Subscription cost (assuming $299/month for now)
        subscription_cost = 299
        
        # ROI calculation
        roi_percentage = (cost_savings / subscription_cost * 100) if subscription_cost > 0 else 0
        
        # Break-even analysis
        conversations_to_break_even = subscription_cost / (0.25 * 50)  # $299 / ($12.50 per conversation)
        
        roi_metrics = {
            "total_conversations": total_conversations,
            "successful_conversations": successful_conversations,
            "time_saved_hours": round(time_saved_hours, 2),
            "cost_savings": round(cost_savings, 2),
            "subscription_cost": subscription_cost,
            "roi_percentage": round(roi_percentage, 2),
            "conversations_to_break_even": round(conversations_to_break_even, 1),
            "break_even_status": "achieved" if cost_savings >= subscription_cost else "pending",
            "period": "last_30_days"
        }
        
        return roi_metrics
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get ROI metrics: {str(e)}"
        )

@router.get("/conversations")
async def get_conversation_analytics(
    timeframe: str = "30d",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get conversation analytics for the current user"""
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
        
        # Calculate date range based on timeframe
        if timeframe == "7d":
            start_date = datetime.utcnow() - timedelta(days=7)
        elif timeframe == "30d":
            start_date = datetime.utcnow() - timedelta(days=30)
        elif timeframe == "90d":
            start_date = datetime.utcnow() - timedelta(days=90)
        else:
            start_date = datetime.utcnow() - timedelta(days=30)
        
        # Get conversations in date range
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', start_date.isoformat()).execute()
        conversations = conversations_result.data or []
        
        # Calculate metrics
        total_conversations = len(conversations)
        completed_conversations = len([c for c in conversations if c['status'] == 'completed'])
        failed_conversations = len([c for c in conversations if c['status'] == 'failed'])
        active_conversations = len([c for c in conversations if c['status'] == 'active'])
        
        success_rate = (completed_conversations / total_conversations * 100) if total_conversations > 0 else 0
        
        # Group by conversation type
        conversations_by_type = {}
        for conv in conversations:
            conv_type = conv.get('conversation_type', 'unknown')
            conversations_by_type[conv_type] = conversations_by_type.get(conv_type, 0) + 1
        
        # Daily breakdown
        daily_conversations = {}
        for conv in conversations:
            date = conv['created_at'][:10]  # YYYY-MM-DD
            daily_conversations[date] = daily_conversations.get(date, 0) + 1
        
        analytics = {
            "timeframe": timeframe,
            "total_conversations": total_conversations,
            "completed_conversations": completed_conversations,
            "failed_conversations": failed_conversations,
            "active_conversations": active_conversations,
            "success_rate": round(success_rate, 2),
            "conversations_by_type": conversations_by_type,
            "daily_conversations": daily_conversations
        }
        
        return analytics
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get conversation analytics: {str(e)}"
        )

@router.get("/costs")
async def get_cost_analytics(
    timeframe: str = "30d",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get cost analytics for the current user"""
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
        
        # Calculate date range
        if timeframe == "7d":
            start_date = datetime.utcnow() - timedelta(days=7)
        elif timeframe == "30d":
            start_date = datetime.utcnow() - timedelta(days=30)
        elif timeframe == "90d":
            start_date = datetime.utcnow() - timedelta(days=90)
        else:
            start_date = datetime.utcnow() - timedelta(days=30)
        
        # Get conversations with cost data
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', start_date.isoformat()).execute()
        conversations = conversations_result.data or []
        
        # Calculate costs
        total_cost = sum(float(c.get('cost', 0)) for c in conversations)
        avg_cost_per_conversation = total_cost / len(conversations) if conversations else 0
        
        # Cost by agent
        cost_by_agent = {}
        for conv in conversations:
            agent_id = conv.get('agent_id')
            cost = float(conv.get('cost', 0))
            if agent_id:
                cost_by_agent[agent_id] = cost_by_agent.get(agent_id, 0) + cost
        
        # Daily cost breakdown
        daily_costs = {}
        for conv in conversations:
            date = conv['created_at'][:10]
            cost = float(conv.get('cost', 0))
            daily_costs[date] = daily_costs.get(date, 0) + cost
        
        cost_analytics = {
            "timeframe": timeframe,
            "total_cost": round(total_cost, 4),
            "avg_cost_per_conversation": round(avg_cost_per_conversation, 4),
            "total_conversations": len(conversations),
            "cost_by_agent": cost_by_agent,
            "daily_costs": daily_costs
        }
        
        return cost_analytics
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get cost analytics: {str(e)}"
        )

@router.get("/roi")
async def get_roi_analytics(
    timeframe: str = "30d",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get ROI (Return on Investment) analytics"""
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
        
        # Calculate date range
        if timeframe == "7d":
            start_date = datetime.utcnow() - timedelta(days=7)
        elif timeframe == "30d":
            start_date = datetime.utcnow() - timedelta(days=30)
        elif timeframe == "90d":
            start_date = datetime.utcnow() - timedelta(days=90)
        else:
            start_date = datetime.utcnow() - timedelta(days=30)
        
        # Get conversations
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', start_date.isoformat()).execute()
        conversations = conversations_result.data or []
        
        # Calculate ROI metrics
        total_cost = sum(float(c.get('cost', 0)) for c in conversations)
        
        # Assume each conversation saves 15 minutes of human time at $50/hour
        time_saved_hours = len(conversations) * 0.25  # 15 minutes = 0.25 hours
        cost_savings = time_saved_hours * 50  # $50/hour
        
        # Calculate ROI
        roi_percentage = ((cost_savings - total_cost) / total_cost * 100) if total_cost > 0 else 0
        
        # Break-even analysis
        conversations_to_break_even = total_cost / (0.25 * 50) if total_cost > 0 else 0
        
        roi_analytics = {
            "timeframe": timeframe,
            "total_cost": round(total_cost, 2),
            "time_saved_hours": round(time_saved_hours, 2),
            "cost_savings": round(cost_savings, 2),
            "net_savings": round(cost_savings - total_cost, 2),
            "roi_percentage": round(roi_percentage, 2),
            "conversations_to_break_even": round(conversations_to_break_even, 0),
            "total_conversations": len(conversations),
            "is_profitable": cost_savings > total_cost
        }
        
        return roi_analytics
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get ROI analytics: {str(e)}"
        )

@router.get("/trends")
async def get_trends(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get trend analysis for the current user"""
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
        
        # Get conversations for the last 90 days to analyze trends
        ninety_days_ago = (datetime.utcnow() - timedelta(days=90)).isoformat()
        conversations_result = supabase.table('conversations').select('*').eq('user_id', user_id).gte('created_at', ninety_days_ago).execute()
        conversations = conversations_result.data or []
        
        # Weekly breakdown
        weekly_conversations = {}
        for conversation in conversations:
            # Get week number
            date = datetime.fromisoformat(conversation['created_at'].replace('Z', '+00:00'))
            week = date.isocalendar()[1]
            week_key = f"week_{week}"
            weekly_conversations[week_key] = weekly_conversations.get(week_key, 0) + 1
        
        # Calculate growth rate
        if len(weekly_conversations) >= 2:
            weeks = sorted(weekly_conversations.keys())
            first_week_count = weekly_conversations[weeks[0]]
            last_week_count = weekly_conversations[weeks[-1]]
            growth_rate = ((last_week_count - first_week_count) / first_week_count * 100) if first_week_count > 0 else 0
        else:
            growth_rate = 0
        
        trends = {
            "weekly_conversations": weekly_conversations,
            "growth_rate_percent": round(growth_rate, 2),
            "trend_direction": "increasing" if growth_rate > 0 else "decreasing" if growth_rate < 0 else "stable",
            "period": "last_90_days"
        }
        
        return trends
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get trends: {str(e)}"
        )
