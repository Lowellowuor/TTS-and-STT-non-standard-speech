from fastapi import Header, HTTPException, Depends
from typing import Optional

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Dependency to verify API key"""
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key missing")
    # In production, validate against database or environment variable
    valid_keys = ["test-key-123", "production-key-456"]
    if x_api_key not in valid_keys:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

async def get_stt_service():
    """Dependency injection for STT service"""
    from services.stt_service import STTService
    return STTService()

async def get_tts_service():
    """Dependency injection for TTS service"""
    from services.tts_service import TTSService
    return TTSService()

async def get_enhancement_service():
    """Dependency injection for enhancement service"""
    from services.enhancement_service import EnhancementService
    return EnhancementService()