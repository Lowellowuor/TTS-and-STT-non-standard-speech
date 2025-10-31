# STT Model Checkpoints

This directory contains Speech-to-Text model checkpoints.

## Expected Files

- Fine-tuned Wav2Vec2 models
- Custom model weights (.pth, .pt files)
- Model configuration files

## Adding Models

1. Place model files in this directory
2. Update core/stt_service.py to load your models
3. Test with evaluation scripts
