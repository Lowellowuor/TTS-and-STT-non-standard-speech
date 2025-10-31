import pytest
import tempfile
import os
from pathlib import Path
import numpy as np

from core.stt_service import STTService

class TestSTTService:
    """Test STT service functionality"""
    
    @pytest.fixture
    def stt_service(self):
        """Create STT service instance"""
        return STTService()
    
    @pytest.fixture
    def sample_audio_file(self):
        """Create a minimal valid audio file"""
        # Create a 1-second silent WAV file
        import wave
        import struct
        
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
            with wave.open(f.name, 'w') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(16000)
                
                # Generate 1 second of silence
                frames = b''.join([struct.pack('<h', 0) for _ in range(16000)])
                wav_file.writeframes(frames)
            
            temp_path = f.name
        
        yield temp_path
        # Cleanup
        if os.path.exists(temp_path):
            os.unlink(temp_path)
    
    def test_stt_service_initialization(self, stt_service):
        """Test that STT service initializes properly"""
        assert stt_service is not None
        assert stt_service.model is not None
        assert stt_service.processor is not None
        assert stt_service.device is not None
    
    def test_transcribe_audio_file(self, stt_service, sample_audio_file):
        """Test audio transcription"""
        result = stt_service.transcribe(sample_audio_file)
        
        assert isinstance(result, dict)
        assert "success" in result
        assert "transcription" in result
        assert "emergency_detected" in result
    
    def test_transcribe_invalid_file(self, stt_service):
        """Test transcription with invalid file"""
        result = stt_service.transcribe("/path/to/nonexistent/file.wav")
        
        assert result["success"] is False
        assert "error" in result
    
    def test_emergency_detection(self, stt_service):
        """Test emergency keyword detection"""
        # Test with emergency keywords
        text_with_emergency = "I need help there's an accident"
        assert stt_service._check_emergency(text_with_emergency) is True
        
        # Test without emergency keywords
        text_normal = "Hello how are you today"
        assert stt_service._check_emergency(text_normal) is False
        
        # Test case insensitivity
        text_upper = "EMERGENCY HELP"
        assert stt_service._check_emergency(text_upper) is True
    
    def test_model_loading_fallback(self):
        """Test that service uses fallback when custom models not available"""
        # This test verifies the service can initialize without custom models
        service = STTService()
        assert service.model is not None
        assert service.processor is not None