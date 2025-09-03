#!/usr/bin/env python3
"""
Startup script for Agent Synergy Backend
"""

import uvicorn
import os
from dotenv import load_dotenv

def main():
    """Start the FastAPI server"""
    # Load environment variables
    load_dotenv()
    
    # Server configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print("🚀 Starting Agent Synergy Backend...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"🌐 API Docs: http://{host}:{port}/docs")
    print(f"📖 ReDoc: http://{host}:{port}/redoc")
    print("=" * 50)
    
    # Start server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )

if __name__ == "__main__":
    main()
