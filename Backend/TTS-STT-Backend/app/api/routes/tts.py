from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.api.models.requests import TTSRequest
from services.tts_service import TTSService

router = APIRouter()
tts_service = TTSService()

@router.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """Convert text to speech"""
    try:
        result = tts_service.synthesize_speech(request.text, request.voice_id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        # For now, return a success message since we don't have real audio
        return {
            "success": True,
            "message": "TTS synthesis would generate audio here",
            "text_processed": result.get("text_processed", request.text),
            "audio_url": result.get("audio_url")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
