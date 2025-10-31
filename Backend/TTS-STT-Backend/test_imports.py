#!/usr/bin/env python3
"""
Test that all packages can be imported successfully
"""

import sys

def test_import(package_name, import_name=None):
    """Test if a package can be imported"""
    try:
        if import_name:
            __import__(import_name)
        else:
            __import__(package_name)
        print(f"✅ {package_name}")
        return True
    except ImportError as e:
        print(f"❌ {package_name}: {e}")
        return False

print("Testing package imports...")
print("=" * 40)

# Test critical packages
critical_packages = [
    ("fastapi", "fastapi"),
    ("uvicorn", "uvicorn"),
    ("pydantic", "pydantic"),
    ("torch", "torch"),
    ("transformers", "transformers"),
    ("librosa", "librosa"),
    ("numpy", "numpy"),
    ("soundfile", "soundfile"),
]

all_ok = True
for package, import_name in critical_packages:
    if not test_import(package, import_name):
        all_ok = False

# Test optional packages
print("\nTesting optional packages...")
print("-" * 30)
optional_packages = [
    ("pydub", "pydub"),
    ("sqlalchemy", "sqlalchemy"),
    ("twilio", "twilio"),
    ("jiwer", "jiwer"),
    ("pytest", "pytest"),
]

for package, import_name in optional_packages:
    test_import(package, import_name)

print("=" * 40)
if all_ok:
    print("🎉 All critical packages imported successfully!")
else:
    print("❌ Some critical packages failed to import")

# Test specific functionality
print("\nTesting core functionality...")
print("-" * 30)
try:
    import torch
    print(f"✅ PyTorch version: {torch.__version__}")
    print(f"✅ CUDA available: {torch.cuda.is_available()}")
except Exception as e:
    print(f"❌ PyTorch test failed: {e}")

try:
    from transformers import pipeline
    print("✅ Transformers pipeline working")
except Exception as e:
    print(f"❌ Transformers test failed: {e}")

try:
    import librosa
    print("✅ Librosa audio processing working")
except Exception as e:
    print(f"❌ Librosa test failed: {e}")
