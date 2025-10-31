import torch
import torchaudio
import numpy as np
from pathlib import Path
from typing import Dict, Any, Optional, List
import io
import tempfile

from config.settings import settings
from utils.audio_utils import normalize_audio, save_audio_file
from core.tts_service import TTSService as CoreTTSService

class TTSService:
    """Service layer for Text-to-Speech operations"""
    
    def __init__(self):
        self.core_tts = CoreTTSService()
        self.output_dir = Path("generated_audio")
        self.output_dir.mkdir(exist_ok=True)
    
    def synthesize_speech(self, text: str, voice_id: Optional[str] = None, 
                         user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Convert text to speech with optional voice personalization
        """
        try:
            # Validate input
            validation_result = self._validate_text_input(text)
            if not validation_result["valid"]:
                return {"success": False, "error": validation_result["error"]}
            
            # Get personalized settings if user_id provided
            voice_settings = {}
            if user_id:
                voice_settings = self.core_tts.voice_personalization.get_voice_settings(user_id)
            
            # Synthesize speech using core TTS
            synthesis_result = self.core_tts.synthesize(
                text=text, 
                voice_id=voice_id,
                **voice_settings
            )
            
            if not synthesis_result["success"]:
                return synthesis_result
            
            # For now, just return success without actual audio generation
            return {
                "success": True,
                "text_processed": synthesis_result.get("text_processed", text),
                "message": "TTS synthesis completed (audio generation placeholder)"
            }
            
        except Exception as e:
            return {"success": False, "error": f"TTS synthesis failed: {str(e)}"}
    
    def list_available_voices(self) -> Dict[str, Any]:
        """Get list of available voice profiles"""
        try:
            voices = {
                "default": {
                    "name": "Default Voice",
                    "language": "en",
                    "gender": "neutral",
                    "description": "Standard English voice"
                }
            }
            
            return {
                "success": True,
                "voices": voices,
                "count": len(voices)
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _validate_text_input(self, text: str) -> Dict[str, Any]:
        """Validate text input for TTS"""
        if not text or not text.strip():
            return {"valid": False, "error": "Text cannot be empty"}
        
        if len(text) > 1000:
            return {"valid": False, "error": "Text exceeds maximum length of 1000 characters"}
        
        return {"valid": True, "message": "Text is valid"}
