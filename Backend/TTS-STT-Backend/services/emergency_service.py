from typing import Dict, Any, List
from core.emergency_handler import EmergencyHandler

class EmergencyService:
    """Service for handling emergency situations"""
    
    def __init__(self):
        self.emergency_handler = EmergencyHandler()
    
    def handle_emergency(self, transcription: str, location: str = None) -> Dict[str, Any]:
        """Handle emergency detection and response"""
        try:
            # Simple emergency detection
            emergency_level = self._detect_emergency_level(transcription)
            
            if emergency_level == "none":
                return {
                    "success": True,
                    "emergency_detected": False,
                    "message": "No emergency detected"
                }
            
            # For demo purposes, just return detected
            return {
                "success": True,
                "emergency_detected": True,
                "emergency_level": emergency_level,
                "alert_sent": False,  # In real implementation, this would be True
                "contacts_notified": [],
                "message": f"Emergency situation detected: {emergency_level}"
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _detect_emergency_level(self, text: str) -> str:
        """Detect emergency level from text"""
        text_lower = text.lower()
        
        high_urgency = ['help', 'emergency', 'accident', 'danger', 'urgent']
        medium_urgency = ['pain', 'unwell', 'assistance', 'support']
        
        if any(word in text_lower for word in high_urgency):
            return "high"
        elif any(word in text_lower for word in medium_urgency):
            return "medium"
        else:
            return "none"
