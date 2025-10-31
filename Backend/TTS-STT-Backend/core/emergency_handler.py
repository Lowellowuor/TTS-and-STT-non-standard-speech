from typing import List

class EmergencyHandler:
    def __init__(self):
        self.emergency_contacts = ["+254712345678"]
    
    def handle_emergency(self, transcription: str, location: str = None) -> bool:
        """Handle emergency situation"""
        # For demo purposes, just return True
        print(f"Emergency detected: {transcription}")
        if location:
            print(f"Location: {location}")
        return True
