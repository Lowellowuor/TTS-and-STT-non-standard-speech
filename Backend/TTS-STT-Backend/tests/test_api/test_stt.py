import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_stt_transcribe_success():
    """Test successful STT transcription"""
    # This would normally test with a real audio file
    # For now, just test the endpoint exists
    response = client.post("/api/v1/stt/transcribe")
    assert response.status_code in [422, 400]  # Should fail without file

def test_stt_transcribe_invalid_file():
    """Test STT with invalid file"""
    response = client.post(
        "/api/v1/stt/transcribe",
        files={"audio_file": ("test.txt", b"not an audio file", "text/plain")}
    )
    
    assert response.status_code == 400

def test_stt_transcribe_no_file():
    """Test STT with no file"""
    response = client.post("/api/v1/stt/transcribe")
    assert response.status_code == 422  # Validation error
