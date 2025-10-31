#!/usr/bin/env python3
"""
Test script to verify all directories and files are properly set up
"""

import os
import sys
from pathlib import Path

def test_directories():
    """Test that all required directories exist"""
    required_dirs = [
        "models",
        "models/stt_checkpoints", 
        "models/tts_voice_packs",
        "models/tts_voice_packs/friendly_voice",
        "data",
        "data/audio_samples",
        "data/user_data", 
        "data/temp",
        "data/logs"
    ]
    
    print("Testing directory structure...")
    all_good = True
    
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} - MISSING")
            all_good = False
    
    return all_good

def test_files():
    """Test that all required files exist"""
    required_files = [
        "models/__init__.py",
        "models/stt_checkpoints/__init__.py",
        "models/tts_voice_packs/__init__.py",
        "models/tts_voice_packs/friendly_voice/voice_config.json",
        "data/__init__.py",
        "data/symbols.json"
    ]
    
    print("\nTesting required files...")
    all_good = True
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            all_good = False
    
    return all_good

def test_imports():
    """Test that modules can be imported"""
    print("\nTesting imports...")
    
    try:
        from models import initialize_model_directories
        initialize_model_directories()
        print("✅ models package")
    except Exception as e:
        print(f"❌ models package: {e}")
        return False
    
    try:
        from data import initialize_data_files
        initialize_data_files()
        print("✅ data package")
    except Exception as e:
        print(f"❌ data package: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("Testing Nairobo Speech API Setup...")
    print("=" * 50)
    
    dirs_ok = test_directories()
    files_ok = test_files()
    imports_ok = test_imports()
    
    print("=" * 50)
    if dirs_ok and files_ok and imports_ok:
        print("🎉 All tests passed! Setup is complete.")
    else:
        print("❌ Some tests failed. Please check the missing items.")
        sys.exit(1)
