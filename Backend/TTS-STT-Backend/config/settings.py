from pathlib import Path
from typing import List

class Settings:
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Nairobo Speech API"
    
    # Model Paths
    STT_MODEL_PATH: str = "models/stt_checkpoints"
    TTS_MODEL_PATH: str = "models/tts_voice_packs"
    SYMBOLS_FILE: str = "data/symbols.json"
    
    # Audio Settings
    SAMPLE_RATE: int = 22050
    MAX_AUDIO_LENGTH: int = 30
    CHUNK_SIZE: int = 1024
    
    # Emergency Settings
    EMERGENCY_KEYWORDS: List[str] = ["help", "emergency", "accident", "danger"]
    EMERGENCY_CONTACTS: List[str] = ["+254712345678"]

settings = Settings()
