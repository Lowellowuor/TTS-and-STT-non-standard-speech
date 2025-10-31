from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import tempfile
import os

from app.api.models.requests import STTRequest
from app.api.models.responses import STTResponse
from services.stt_service import STTService

router = APIRouter()
stt_service = STTService()

@router.post("/transcribe", response_model=STTResponse)
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    audio_file: UploadFile = File(...)
):
    """Transcribe audio file to text"""
    try:
        # Validate file type
        if not audio_file.filename.lower().endswith(('.wav', '.mp3', '.m4a', '.flac')):
            raise HTTPException(status_code=400, detail="Unsupported audio format")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            content = await audio_file.read()
            temp_audio.write(content)
            temp_path = temp_audio.name
        
        try:
            # Process audio
            result = stt_service.process_audio(temp_path)
            
            if not result["success"]:
                raise HTTPException(status_code=400, detail=result["error"])
            
            # Handle emergency if detected
            if result.get("emergency_detected"):
                background_tasks.add_task(handle_emergency, result["transcription"])
            
            return STTResponse(
                success=True,
                transcription=result["transcription"],
                emergency_detected=result.get("emergency_detected", False),
                confidence=result.get("confidence", 0.0)
            )
            
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def handle_emergency(transcription: str):
    """Background task to handle emergency situations"""
    from services.emergency_service import EmergencyService
    emergency_service = EmergencyService()
    emergency_service.handle_emergency(transcription)