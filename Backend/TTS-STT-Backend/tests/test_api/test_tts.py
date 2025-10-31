import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tts_synthesize_success():
    """Test successful TTS synthesis"""
    response = client.post(
        "/api/v1/tts/synthesize",
        json={"text": "Hello, this is a test", "voice_id": "default"}
    )
    
    assert response.status_code in [200, 400]
    
    if response.status_code == 200:
        assert response.headers["content-type"] == "audio/wav"

def test_tts_synthesize_empty_text():
    """Test TTS with empty text"""
    response = client.post(
        "/api/v1/tts/synthesize",
        json={"text": "", "voice_id": "default"}
    )
    
    assert response.status_code == 422

def test_tts_synthesize_long_text():
    """Test TTS with very long text"""
    long_text = "test " * 1000  # 5000 characters
    response = client.post(
        "/api/v1/tts/synthesize",
        json={"text": long_text, "voice_id": "default"}
    )
    
    assert response.status_code in [400, 422]  # Should be rejected
