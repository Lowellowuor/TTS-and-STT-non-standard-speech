from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class STTResponse(BaseModel):
    success: bool
    transcription: Optional[str] = None
    enhanced_transcription: Optional[str] = None
    emergency_detected: bool = False
    confidence: float = 0.0
    error: Optional[str] = None

class TTSResponse(BaseModel):
    success: bool
    audio_url: Optional[str] = None
    duration: Optional[float] = None
    error: Optional[str] = None

class EnhancementResponse(BaseModel):
    success: bool
    original_text: str
    enhanced_text: str
    enhancements_applied: List[str] = []
    improvements: Dict[str, Any] = {}

class EmergencyResponse(BaseModel):
    success: bool
    emergency_detected: bool
    alert_sent: bool
    contacts_notified: List[str]
    message: str
