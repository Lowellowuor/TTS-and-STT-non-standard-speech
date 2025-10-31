import torch
import torchaudio
import numpy as np
from pathlib import Path
from typing import Optional, Dict, Any, List
import json

from config.settings import settings
from utils.audio_utils import preprocess_audio, validate_audio

class STTService:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.load_model()
    
    def load_model(self):
        """Load STT model from checkpoint"""
        try:
            # This would be replaced with your actual model loading logic
            model_path = Path(settings.STT_MODEL_PATH)
            
            if not model_path.exists():
                # Initialize with base model
                from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
                self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
                self.model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
            else:
                # Load your fine-tuned model
                # self.processor = Wav2Vec2Processor.from_pretrained(str(model_path))
                # self.model = Wav2Vec2ForCTC.from_pretrained(str(model_path))
                pass
                
            if self.model:
                self.model.to(self.device)
                self.model.eval()
            
        except Exception as e:
            print(f"Error loading STT model: {e}")
            # Fallback to basic model
            try:
                from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
                self.processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
                self.model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
                self.model.to(self.device)
                self.model.eval()
            except Exception as e2:
                print(f"Fallback model also failed: {e2}")
    
    def transcribe(self, audio_path: str) -> Dict[str, Any]:
        """Transcribe audio file to text"""
        try:
            # Validate and preprocess audio
            if not validate_audio(audio_path):
                return {"success": False, "error": "Invalid audio file"}
            
            # Load and preprocess audio
            waveform, sample_rate = preprocess_audio(audio_path, target_sr=16000)
            
            # Process with model (simplified - adapt based on your actual model)
            if self.processor and self.model:
                inputs = self.processor(waveform, sampling_rate=sample_rate, return_tensors="pt", padding=True)
                
                with torch.no_grad():
                    logits = self.model(inputs.input_values.to(self.device)).logits
                    predicted_ids = torch.argmax(logits, dim=-1)
                    transcription = self.processor.batch_decode(predicted_ids)[0]
            else:
                transcription = "Model not loaded - using placeholder transcription"
            
            # Check for emergency keywords
            emergency_detected = self._check_emergency(transcription)
            
            return {
                "success": True,
                "transcription": transcription,
                "emergency_detected": emergency_detected,
                "confidence": 0.95  # Placeholder
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _check_emergency(self, text: str) -> bool:
        """Check if transcription contains emergency keywords"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in settings.EMERGENCY_KEYWORDS)
