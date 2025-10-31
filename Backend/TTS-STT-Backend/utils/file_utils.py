import os
import shutil
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import UploadFile

def save_uploaded_file(upload_file: UploadFile, target_dir: Path) -> Optional[Path]:
    """Save uploaded file to target directory"""
    try:
        target_dir.mkdir(parents=True, exist_ok=True)
        file_path = target_dir / upload_file.filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return file_path
    except Exception as e:
        print(f"Error saving file: {e}")
        return None

def cleanup_temp_files(file_paths: list):
    """Clean up temporary files"""
    for file_path in file_paths:
        try:
            if isinstance(file_path, (str, Path)) and os.path.exists(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {e}")

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()

def validate_file_size(file_path: Path, max_size_mb: int = 50) -> bool:
    """Validate file size"""
    if not file_path.exists():
        return False
    
    file_size_mb = file_path.stat().st_size / (1024 * 1024)
    return file_size_mb <= max_size_mb

def create_temp_directory() -> Path:
    """Create temporary directory"""
    temp_dir = Path(tempfile.mkdtemp())
    return temp_dir

def get_file_size(file_path: Path) -> int:
    """Get file size in bytes"""
    return file_path.stat().st_size if file_path.exists() else 0