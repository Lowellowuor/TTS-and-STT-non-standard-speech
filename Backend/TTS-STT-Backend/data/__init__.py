"""
Data package for application data and configurations
"""

import os
from pathlib import Path
import json

def initialize_data_files():
    """Initialize required data files"""
    data_dir = Path(__file__).parent
    
    # Create symbols.json if it doesn't exist
    symbols_file = data_dir / "symbols.json"
    if not symbols_file.exists():
        default_symbols = {
            "phonemes": {
                "vowels": ["a", "e", "i", "o", "u", "ɑ", "ɛ", "ɪ", "ɔ", "ʊ", "ʌ", "ə"],
                "consonants": ["p", "b", "t", "d", "k", "g", "f", "v", "θ", "ð", "s", "z", "ʃ", "ʒ", "h", "m", "n", "ŋ", "l", "r", "w", "j"]
            },
            "common_errors": {
                "helb": "help",
                "accidend": "accident",
                "dangor": "danger", 
                "pleese": "please",
                "thanc": "thank",
                "wadder": "water",
                "birfday": "birthday",
                "pasketti": "spaghetti",
                "aminal": "animal",
                "libary": "library"
            },
            "emergency_keywords": [
                "help", "emergency", "accident", "danger", "urgent", 
                "pain", "hurt", "ambulance", "police", "fire",
                "bleeding", "broken", "unconscious", "choking"
            ],
            "enhancement_patterns": {
                "simplify_complex": {
                    "emergency": "help needed",
                    "accident": "crash", 
                    "difficulty": "trouble",
                    "assistance": "help",
                    "approximately": "about"
                },
                "expand_abbreviations": {
                    "dr.": "doctor",
                    "st.": "street", 
                    "ave.": "avenue",
                    "mr.": "mister",
                    "mrs.": "misses"
                }
            }
        }
        
        with open(symbols_file, 'w', encoding='utf-8') as f:
            json.dump(default_symbols, f, indent=2, ensure_ascii=False)
        print("Created symbols.json with default data")
    
    # Create .gitkeep files in subdirectories
    subdirs = ["audio_samples", "user_data", "temp", "logs"]
    for subdir in subdirs:
        dir_path = data_dir / subdir
        dir_path.mkdir(exist_ok=True)
        
        gitkeep_file = dir_path / ".gitkeep"
        if not gitkeep_file.exists():
            gitkeep_file.touch()
    
    print("Data directory initialized successfully")

# Initialize on import
initialize_data_files()

__all__ = ["initialize_data_files"]
