from typing import Dict, Any, List
from core.stt_service import STTService as CoreSTTService
from core.content_enhancer import ContentEnhancer

class STTService:
    def __init__(self):
        self.core_stt = CoreSTTService()
        self.enhancer = ContentEnhancer()
    
    def process_audio(self, audio_path: str) -> Dict[str, Any]:
        """Process audio through STT pipeline"""
        # Step 1: Transcribe audio
        stt_result = self.core_stt.transcribe(audio_path)
        
        if not stt_result["success"]:
            return stt_result
        
        # Step 2: Enhance transcription for non-standard speech
        enhanced_text = self.enhancer.enhance_transcription(
            stt_result["transcription"]
        )
        
        stt_result["enhanced_transcription"] = enhanced_text
        return stt_result
