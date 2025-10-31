import librosa
import numpy as np
import soundfile as sf
from pathlib import Path
from typing import Tuple, Dict, Any

def preprocess_audio(audio_path: str, target_sr: int = 16000) -> Tuple[np.ndarray, int]:
    """Load and preprocess audio file"""
    try:
        audio, sr = librosa.load(audio_path, sr=target_sr)
        audio = normalize_audio(audio)
        return audio, sr
    except Exception as e:
        raise ValueError(f"Error processing audio: {e}")

def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """Normalize audio to [-1, 1] range"""
    if np.max(np.abs(audio)) > 0:
        audio = audio / np.max(np.abs(audio))
    return audio

def validate_audio(audio_path: str) -> bool:
    """Validate audio file"""
    try:
        if not Path(audio_path).exists():
            return False
        audio, sr = librosa.load(audio_path, sr=None)
        duration = len(audio) / sr
        if duration > 30:
            return False
        return True
    except:
        return False

def save_audio_file(audio_data: np.ndarray, file_path: Path, sample_rate: int = 22050) -> Dict[str, Any]:
    """Save audio data to file"""
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        sf.write(str(file_path), audio_data, sample_rate)
        return {"success": True, "file_path": str(file_path)}
    except Exception as e:
        return {"success": False, "error": str(e)}

def convert_audio_format(input_path: str, output_path: str, target_format: str = "wav") -> Dict[str, Any]:
    """Convert audio file to different format"""
    try:
        audio, sr = librosa.load(input_path, sr=None)
        output_path_with_ext = f"{output_path}.{target_format}"
        sf.write(output_path_with_ext, audio, sr)
        return {"success": True, "output_path": output_path_with_ext, "sample_rate": sr}
    except Exception as e:
        return {"success": False, "error": str(e)}
