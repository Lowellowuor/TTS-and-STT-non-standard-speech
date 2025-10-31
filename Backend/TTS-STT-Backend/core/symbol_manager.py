import json
from pathlib import Path
from typing import Dict, List, Optional, Any

class SymbolManager:
    """Manages symbols and mappings for speech processing"""
    
    def __init__(self):
        self.symbols_file = Path("data/symbols.json")
        self.symbols = self._load_symbols()
    
    def _load_symbols(self) -> Dict[str, Any]:
        """Load symbols from JSON file"""
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
            ]
        }
        
        try:
            if self.symbols_file.exists():
                with open(self.symbols_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # Create default symbols file
                self.symbols_file.parent.mkdir(parents=True, exist_ok=True)
                with open(self.symbols_file, 'w', encoding='utf-8') as f:
                    json.dump(default_symbols, f, indent=2, ensure_ascii=False)
                return default_symbols
        except Exception as e:
            print(f"Error loading symbols: {e}")
            return default_symbols
    
    def get_phonemes(self) -> List[str]:
        """Get all phonemes"""
        return self.symbols.get("phonemes", {}).get("vowels", []) + \
               self.symbols.get("phonemes", {}).get("consonants", [])
    
    def get_common_errors(self) -> Dict[str, str]:
        """Get common error mappings"""
        return self.symbols.get("common_errors", {})
    
    def get_emergency_keywords(self) -> List[str]:
        """Get emergency keywords"""
        return self.symbols.get("emergency_keywords", [])
    
    def add_custom_mapping(self, incorrect: str, correct: str):
        """Add custom error mapping"""
        if "common_errors" not in self.symbols:
            self.symbols["common_errors"] = {}
        
        self.symbols["common_errors"][incorrect] = correct
        self._save_symbols()
    
    def _save_symbols(self):
        """Save symbols to file"""
        try:
            with open(self.symbols_file, 'w', encoding='utf-8') as f:
                json.dump(self.symbols, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving symbols: {e}")
