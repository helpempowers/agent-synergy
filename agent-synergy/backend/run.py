#!/usr/bin/env python3
"""
Simple script to run the Agent Synergy backend server
"""
import uvicorn
from main import app
from core.config import settings

if __name__ == "__main__":
    print("🚀 Starting Agent Synergy Backend...")
    print(f"📍 Server: {settings.HOST}:{settings.PORT}")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/docs")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
