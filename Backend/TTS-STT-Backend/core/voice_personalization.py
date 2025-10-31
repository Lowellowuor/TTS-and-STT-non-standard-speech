import numpy as np
from typing import Dict, List, Optional, Any
from pathlib import Path

class VoicePersonalization:
    """Handles voice personalization for TTS"""
    
    def __init__(self):
        self.voice_profiles = {}
        self.default_voice_settings = {
            "speaking_rate": 1.0,
            "pitch": 0.0,
            "volume_gain": 0.0,
            "pause_duration": 1.0
        }
    
    def create_voice_profile(self, user_id: str, audio_samples: List[str]) -> Dict[str, Any]:
        """Create personalized voice profile from audio samples"""
        try:
            # Extract voice characteristics from samples
            characteristics = self._analyze_voice_samples(audio_samples)
            
            voice_profile = {
                "user_id": user_id,
                "characteristics": characteristics,
                "settings": self._optimize_settings(characteristics),
                "created_at": np.datetime64('now')
            }
            
            self.voice_profiles[user_id] = voice_profile
            return {"success": True, "profile": voice_profile}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _analyze_voice_samples(self, audio_samples: List[str]) -> Dict[str, float]:
        """Analyze voice samples to extract characteristics"""
        # Placeholder for actual voice analysis
        # This could include pitch analysis, speaking rate, formants, etc.
        return {
            "average_pitch": 120.0,
            "pitch_range": 50.0,
            "speaking_rate": 1.0,
            "voice_quality": "clear"  # clear, breathy, hoarse, etc.
        }
    
    def _optimize_settings(self, characteristics: Dict[str, float]) -> Dict[str, float]:
        """Optimize TTS settings based on voice characteristics"""
        settings = self.default_voice_settings.copy()
        
        # Adjust settings based on analysis
        if characteristics.get("speaking_rate", 1.0) < 0.8:
            settings["speaking_rate"] = 0.9
            settings["pause_duration"] = 1.2
        
        if characteristics.get("average_pitch", 120) > 140:
            settings["pitch"] = -2.0
        elif characteristics.get("average_pitch", 120) < 100:
            settings["pitch"] = 2.0
            
        return settings
    
    def get_voice_settings(self, user_id: str) -> Dict[str, float]:
        """Get voice settings for user"""
        if user_id in self.voice_profiles:
            return self.voice_profiles[user_id]["settings"]
        return self.default_voice_settings
    
    def adapt_for_speech_impairment(self, text: str, impairment_type: str) -> str:
        """Adapt text for specific speech impairments"""
        adaptations = {
            "dysarthria": self._adapt_for_dysarthria,
            "stutter": self._adapt_for_stutter,
            "apraxia": self._adapt_for_apraxia
        }
        
        adapter = adaptations.get(impairment_type, self._default_adaptation)
        return adapter(text)
    
    def _adapt_for_dysarthria(self, text: str) -> str:
        """Adapt text for dysarthria (slurred speech)"""
        # Simplify complex words, break long sentences
        words = text.split()
        simplified = []
        
        for word in words:
            if len(word) > 8:
                # Replace long words with simpler alternatives
                simple_map = {
                    "emergency": "help needed",
                    "accident": "crash",
                    "difficulty": "trouble"
                }
                simplified.append(simple_map.get(word.lower(), word))
            else:
                simplified.append(word)
        
        return " ".join(simplified)
    
    def _adapt_for_stutter(self, text: str) -> str:
        """Adapt text for stutter"""
        # Avoid words that commonly cause stuttering
        problematic_sounds = ["p", "b", "t", "d", "k", "g"]
        words = text.split()
        
        adapted = []
        for word in words:
            if word[0].lower() in problematic_sounds and len(word) > 4:
                # Rephrase or replace
                adapted.append(f"the word {word}")
            else:
                adapted.append(word)
        
        return " ".join(adapted)
    
    def _adapt_for_apraxia(self, text: str) -> str:
        """Adapt text for apraxia of speech"""
        # Use simpler sentence structures
        return text.lower().replace("ing ", "in ").replace("th", "d")
    
    def _default_adaptation(self, text: str) -> str:
        """Default text adaptation"""
        return text
