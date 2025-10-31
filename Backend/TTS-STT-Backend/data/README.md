# Data Directory

This directory contains application data, configurations, and user data.

## Structure

- `symbols.json` - Phonemes, common errors, and enhancement patterns
- `audio_samples/` - User audio samples for voice personalization
- `user_data/` - User profiles and preferences
- `temp/` - Temporary files (auto-cleaned)
- `logs/` - Application logs

## symbols.json

Contains linguistic data for speech processing:
- **phonemes**: Speech sounds for analysis
- **common_errors**: Common mispronunciations and corrections
- **emergency_keywords**: Words that trigger emergency response
- **enhancement_patterns**: Rules for text enhancement

## Adding Custom Data

1. Edit `symbols.json` to add new patterns
2. Place user audio samples in `audio_samples/`
3. User profiles are stored in `user_data/`