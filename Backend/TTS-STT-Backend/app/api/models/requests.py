from pydantic import BaseModel, Field
from typing import Optional, List

class STTRequest(BaseModel):
    audio_data: Optional[str] = None  # base64 encoded audio
    language: str = "en"
    enhance: bool = True

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice_id: Optional[str] = None
    speaking_rate: float = Field(1.0, ge=0.5, le=2.0)

class EnhancementRequest(BaseModel):
    text: str
    enhancement_type: str = "clarity"  # clarity, brevity, formality

class EmergencyRequest(BaseModel):
    transcription: str
    location: Optional[str] = None
    contact_info: Optional[str] = None
