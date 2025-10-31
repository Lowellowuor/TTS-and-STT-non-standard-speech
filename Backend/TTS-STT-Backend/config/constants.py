# Audio processing constants
SUPPORTED_AUDIO_FORMATS = [".wav", ".mp3", ".m4a", ".flac"]
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# API Response messages
SUCCESS_MESSAGES = {
    "stt_success": "Speech transcribed successfully",
    "tts_success": "Text converted to speech successfully",
    "enhancement_success": "Content enhanced successfully",
    "emergency_handled": "Emergency situation handled"
}

ERROR_MESSAGES = {
    "invalid_audio": "Invalid audio file format",
    "file_too_large": "Audio file too large",
    "transcription_failed": "Speech transcription failed",
    "synthesis_failed": "Text synthesis failed"
}