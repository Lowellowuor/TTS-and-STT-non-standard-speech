"""
STT model checkpoints directory
"""

import os
from pathlib import Path

def get_available_models() -> list:
    """Get list of available STT models"""
    models_dir = Path(__file__).parent
    models = []
    
    # Check for model files
    for item in models_dir.iterdir():
        if item.is_file() and item.suffix in ['.pt', '.pth', '.bin', '.ckpt']:
            models.append(item.name)
        elif item.is_dir() and not item.name.startswith('.'):
            models.append(item.name)
    
    return models

def get_model_path(model_name: str) -> Path:
    """Get full path to model"""
    models_dir = Path(__file__).parent
    return models_dir / model_name

def model_exists(model_name: str) -> bool:
    """Check if model exists"""
    model_path = get_model_path(model_name)
    return model_path.exists()

__all__ = ["get_available_models", "get_model_path", "model_exists"]
