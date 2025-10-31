import pytest
import numpy as np

from core.tts_service import TTSService

class TestTTSService:
    """Test TTS service functionality"""
    
    @pytest.fixture
    def tts_service(self):
        """Create TTS service instance"""
        return TTSService()
    
    def test_tts_service_initialization(self, tts_service):
        """Test that TTS service initializes properly"""
        assert tts_service is not None
        assert tts_service.device is not None
    
    def test_synthesize_text(self, tts_service):
        """Test text synthesis"""
        test_text = "Hello, this is a test."
        result = tts_service.synthesize(test_text)
        
        assert isinstance(result, dict)
        assert "success" in result
        assert "audio_data" in result
        assert isinstance(result["audio_data"], np.ndarray)
    
    def test_synthesize_empty_text(self, tts_service):
        """Test synthesis with empty text"""
        result = tts_service.synthesize("")
        
        assert result["success"] is False
        assert "error" in result
    
    def test_text_preprocessing(self, tts_service):
        """Test text preprocessing for non-standard speech"""
        test_cases = [
            ("helb", "help"),
            ("accidend", "accident"),
            ("dangor", "danger"),
            ("pleese", "please")
        ]
        
        for input_text, expected in test_cases:
            processed = tts_service._preprocess_text(input_text)
            assert expected in processed
    
    def test_voice_personalization_initialization(self, tts_service):
        """Test voice personalization component"""
        assert hasattr(tts_service, 'voice_personalization')
        assert tts_service.voice_personalization is not None
    
    def test_voice_adaptation(self, tts_service):
        """Test voice adaptation for different impairments"""
        test_text = "I need assistance with this emergency situation"
        
        # Test dysarthria adaptation
        adapted_dysarthria = tts_service.voice_personalization.adapt_for_speech_impairment(
            test_text, "dysarthria"
        )
        assert isinstance(adapted_dysarthria, str)
        assert len(adapted_dysarthria) > 0
        
        # Test stutter adaptation  
        adapted_stutter = tts_service.voice_personalization.adapt_for_speech_impairment(
            test_text, "stutter"
        )
        assert isinstance(adapted_stutter, str)
        
        # Test default adaptation
        adapted_default = tts_service.voice_personalization.adapt_for_speech_impairment(
            test_text, "unknown"
        )
        assert adapted_default == test_text.lower()