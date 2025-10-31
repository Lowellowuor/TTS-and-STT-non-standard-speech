"""
TTS voice packs directory
"""

import os
from pathlib import Path
import json

def get_available_voices() -> dict:
    """Get available voice packs"""
    voices_dir = Path(__file__).parent
    voices = {}
    
    # Check for voice pack directories
    for item in voices_dir.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            config_file = item / "voice_config.json"
            if config_file.exists():
                try:
                    with open(config_file, 'r', encoding='utf-8') as f:
                        voice_config = json.load(f)
                    voices[item.name] = voice_config
                except Exception as e:
                    print(f"Error loading voice config for {item.name}: {e}")
                    continue
    
    # Add default voice if no custom voices found
    if not voices:
        voices["default"] = {
            "name": "Default Voice",
            "language": "en",
            "gender": "neutral",
            "speaking_rate": 1.0,
            "pitch": 0.0,
            "description": "Standard voice"
        }
    
    return voices

def get_voice_path(voice_id: str) -> Path:
    """Get path to voice pack"""
    voices_dir = Path(__file__).parent
    return voices_dir / voice_id

def voice_exists(voice_id: str) -> bool:
    """Check if voice pack exists"""
    voice_path = get_voice_path(voice_id)
    return voice_path.exists() and (voice_path / "voice_config.json").exists()

__all__ = ["get_available_voices", "get_voice_path", "voice_exists"]
