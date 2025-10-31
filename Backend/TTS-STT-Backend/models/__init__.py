"""
Models package for machine learning models and checkpoints
"""

import os
from pathlib import Path

def initialize_model_directories():
    """Initialize required model directories"""
    base_path = Path(__file__).parent
    
    # Create directories if they don't exist
    directories = ["stt_checkpoints", "tts_voice_packs"]
    
    for dir_name in directories:
        dir_path = base_path / dir_name
        dir_path.mkdir(exist_ok=True)
        
        # Create __init__.py if it doesn't exist
        init_file = dir_path / "__init__.py"
        if not init_file.exists():
            init_file.touch()
        
        print(f"Initialized {dir_name} directory")
    
    print("Model directories initialized successfully")

# Initialize on import
initialize_model_directories()

__all__ = ["initialize_model_directories"]
