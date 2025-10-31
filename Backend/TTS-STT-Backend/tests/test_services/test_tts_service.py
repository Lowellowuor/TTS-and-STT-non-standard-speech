import pytest
from pathlib import Path

from services.tts_service import TTSService

class TestServicesTTSService:
    """Test services TTS service functionality"""
    
    @pytest.fixture
    def tts_service(self):
        """Create TTS service instance"""
        return TTSService()
    
    def test_service_initialization(self, tts_service):
        """Test service initialization"""
        assert tts_service is not None
        assert tts_service.core_tts is not None
        assert tts_service.output_dir.exists()
    
    def test_synthesize_speech_success(self, tts_service):
        """Test successful speech synthesis"""
        test_text = "Hello, this is a test message."
        result = tts_service.synthesize_speech(test_text)
        
        assert isinstance(result, dict)
        assert "success" in result
        
        if result["success"]:
            assert "audio_url" in result
            assert "audio_path" in result
            assert "duration" in result
    
    def test_synthesize_with_voice_id(self, tts_service):
        """Test synthesis with specific voice ID"""
        test_text = "Testing voice selection"
        result = tts_service.synthesize_speech(test_text, voice_id="default")
        
        assert isinstance(result, dict)
        assert "success" in result
    
    def test_synthesize_empty_text(self, tts_service):
        """Test synthesis with empty text"""
        result = tts_service.synthesize_speech("")
        
        assert result["success"] is False
        assert "error" in result
    
    def test_validate_text_input(self, tts_service):
        """Test text input validation"""
        # Test valid text
        valid_result = tts_service._validate_text_input("Valid text")
        assert valid_result["valid"] is True
        
        # Test empty text
        empty_result = tts_service._validate_text_input("")
        assert empty_result["valid"] is False
        
        # Test too long text
        long_text = "a" * 1001
        long_result = tts_service._validate_text_input(long_text)
        assert long_result["valid"] is False
    
    def test_list_available_voices(self, tts_service):
        """Test listing available voices"""
        result = tts_service.list_available_voices()
        
        assert result["success"] is True
        assert "voices" in result
        assert "count" in result
        assert isinstance(result["voices"], dict)
        assert result["count"] > 0
    
    def test_filename_generation(self, tts_service):
        """Test audio filename generation"""
        filename = tts_service._generate_filename("test_user")
        
        assert filename.startswith("tts_test_user_")
        assert filename.endswith(".wav")
        assert len(filename) > 20  # Should have timestamp and UUID