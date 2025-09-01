"""
Utility functions for the Agent Synergy backend
"""
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

def generate_uuid() -> str:
    """Generate a UUID string"""
    return str(uuid.uuid4())

def get_current_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.utcnow().isoformat()

def format_response(data: Any, message: str = "Success", status: str = "success") -> Dict[str, Any]:
    """Format API response"""
    return {
        "status": status,
        "message": message,
        "data": data,
        "timestamp": get_current_timestamp()
    }

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    if not text:
        return ""
    # Remove potentially dangerous characters
    return text.strip()

def log_api_call(endpoint: str, method: str, user_id: Optional[str] = None, status_code: int = 200):
    """Log API call for analytics"""
    logger.info(f"API Call: {method} {endpoint} - User: {user_id} - Status: {status_code}")

def calculate_cost(tokens_used: int, model: str = "gpt-4") -> float:
    """Calculate cost based on tokens used and model"""
    # Simplified cost calculation
    # In production, use actual OpenAI pricing
    costs = {
        "gpt-4": 0.03 / 1000,  # $0.03 per 1K tokens
        "gpt-3.5-turbo": 0.002 / 1000,  # $0.002 per 1K tokens
    }
    return tokens_used * costs.get(model, 0.03 / 1000)
