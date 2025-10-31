import re
from pathlib import Path
from typing import List
from config.constants import SUPPORTED_AUDIO_FORMATS

def validate_text_input(text: str, max_length: int = 1000) -> dict:
    """Validate text input for TTS"""
    if not text or not text.strip():
        return {"valid": False, "error": "Text cannot be empty"}
    
    if len(text) > max_length:
        return {"valid": False, "error": f"Text exceeds maximum length of {max_length} characters"}
    
    # Check for potentially harmful content
    harmful_patterns = [
        r"<script.*?>.*?</script>",
        r"javascript:",
        r"on\w+="
    ]
    
    for pattern in harmful_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return {"valid": False, "error": "Text contains potentially harmful content"}
    
    return {"valid": True, "message": "Text is valid"}

def validate_audio_input(audio_path: Path) -> dict:
    """Validate audio file input"""
    if not audio_path.exists():
        return {"valid": False, "error": "Audio file does not exist"}
    
    # Check file extension
    if audio_path.suffix.lower() not in SUPPORTED_AUDIO_FORMATS:
        return {"valid": False, "error": f"Unsupported audio format. Supported: {SUPPORTED_AUDIO_FORMATS}"}
    
    # Check file size (max 50MB)
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    file_size = audio_path.stat().st_size
    
    if file_size > max_size:
        return {"valid": False, "error": f"File too large. Maximum size is 50MB"}
    
    if file_size == 0:
        return {"valid": False, "error": "File is empty"}
    
    return {"valid": True, "message": "Audio file is valid"}

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove directory components
    filename = Path(filename).name
    
    # Remove potentially dangerous characters
    filename = re.sub(r'[^\w\-. ]', '', filename)
    
    # Limit length
    if len(filename) > 255:
        filename = filename[:255]
    
    return filename

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone_number(phone: str) -> bool:
    """Validate phone number format"""
    # Basic international phone number validation
    pattern = r'^\+?[\d\s\-\(\)]{10,}$'
    return bool(re.match(pattern, phone))