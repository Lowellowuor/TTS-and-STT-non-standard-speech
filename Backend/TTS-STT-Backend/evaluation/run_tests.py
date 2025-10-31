import time
from typing import List, Dict, Any
from pathlib import Path
from evaluation.metrics import evaluate_stt_performance, evaluate_tts_quality

def run_evaluation(
    test_audio_dir: Path,
    reference_transcriptions: List[str],
    model_type: str = "stt"
) -> Dict[str, Any]:
    """Run comprehensive evaluation on test dataset"""
    
    print(f"Running {model_type.upper()} evaluation...")
    
    if model_type == "stt":
        return _run_stt_evaluation(test_audio_dir, reference_transcriptions)
    elif model_type == "tts":
        return _run_tts_evaluation(reference_transcriptions)
    else:
        raise ValueError("model_type must be 'stt' or 'tts'")

def _run_stt_evaluation(test_audio_dir: Path, references: List[str]) -> Dict[str, Any]:
    """Run STT evaluation"""
    from core.stt_service import STTService
    
    stt_service = STTService()
    hypotheses = []
    processing_times = []
    audio_durations = []
    
    audio_files = list(test_audio_dir.glob("*.wav")) + list(test_audio_dir.glob("*.mp3"))
    
    for i, audio_file in enumerate(audio_files[:len(references)]):
        print(f"Processing {i+1}/{len(audio_files)}: {audio_file.name}")
        
        start_time = time.time()
        result = stt_service.transcribe(str(audio_file))
        end_time = time.time()
        
        processing_time = end_time - start_time
        processing_times.append(processing_time)
        
        # Estimate audio duration (simplified)
        audio_duration = 5.0  # Placeholder - use librosa to get actual duration
        audio_durations.append(audio_duration)
        
        if result["success"]:
            hypotheses.append(result["transcription"])
        else:
            hypotheses.append("")  # Empty string for failed transcriptions
    
    # Calculate metrics
    metrics = evaluate_stt_performance(references, hypotheses, audio_durations, processing_times)
    
    return {
        "metrics": metrics,
        "samples": list(zip(references, hypotheses)),
        "processing_times": processing_times
    }

def _run_tts_evaluation(texts: List[str]) -> Dict[str, Any]:
    """Run TTS evaluation"""
    from core.tts_service import TTSService
    
    tts_service = TTSService()
    synthesized_paths = []
    
    for i, text in enumerate(texts):
        print(f"Synthesizing {i+1}/{len(texts)}: {text[:50]}...")
        
        result = tts_service.synthesize(text)
        if result["success"]:
            # Save synthesized audio (placeholder)
            output_path = f"temp_synth_{i}.wav"
            synthesized_paths.append(output_path)
    
    metrics = evaluate_tts_quality(texts, synthesized_paths)
    
    return {
        "metrics": metrics,
        "synthesized_samples": list(zip(texts, synthesized_paths))
    }

def compare_models(
    test_audio_dir: Path,
    references: List[str],
    model_configs: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Compare multiple models"""
    
    results = {}
    
    for config in model_configs:
        print(f"Testing model: {config['name']}")
        results[config['name']] = run_evaluation(test_audio_dir, references, config['type'])
    
    return results