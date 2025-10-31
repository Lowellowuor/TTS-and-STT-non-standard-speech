import numpy as np
from typing import List, Tuple, Dict
import jiwer
from rapidfuzz import fuzz

def calculate_wer(reference: str, hypothesis: str) -> float:
    """Calculate Word Error Rate"""
    try:
        return jiwer.wer(reference, hypothesis)
    except:
        return 1.0  # Maximum error if calculation fails

def calculate_cer(reference: str, hypothesis: str) -> float:
    """Calculate Character Error Rate"""
    try:
        return jiwer.cer(reference, hypothesis)
    except:
        return 1.0

def calculate_rtf(audio_duration: float, processing_time: float) -> float:
    """Calculate Real Time Factor"""
    return processing_time / audio_duration if audio_duration > 0 else float('inf')

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate text similarity using fuzzy matching"""
    return fuzz.ratio(text1.lower(), text2.lower()) / 100.0

def evaluate_stt_performance(
    references: List[str], 
    hypotheses: List[str],
    audio_durations: List[float],
    processing_times: List[float]
) -> Dict[str, float]:
    """Comprehensive STT performance evaluation"""
    
    if len(references) != len(hypotheses):
        raise ValueError("References and hypotheses must have same length")
    
    wers = [calculate_wer(ref, hyp) for ref, hyp in zip(references, hypotheses)]
    cers = [calculate_cer(ref, hyp) for ref, hyp in zip(references, hypotheses)]
    rtfs = [calculate_rtf(dur, time) for dur, time in zip(audio_durations, processing_times)]
    
    return {
        "word_error_rate": np.mean(wers),
        "character_error_rate": np.mean(cers),
        "real_time_factor": np.mean(rtfs),
        "accuracy": 1 - np.mean(wers),
        "throughput": len(audio_durations) / sum(processing_times) if processing_times else 0
    }

def evaluate_tts_quality(
    original_texts: List[str],
    synthesized_audio_paths: List[str],
    ground_truth_audio_paths: List[str] = None
) -> Dict[str, float]:
    """Evaluate TTS quality (placeholder for actual metrics)"""
    # In practice, you'd use metrics like:
    # - MOS (Mean Opinion Score)
    # - MCD (Mel Cepstral Distortion)
    # - F0 RMSE (Pitch error)
    
    return {
        "naturalness_score": 0.85,  # Placeholder
        "intelligibility_score": 0.92,  # Placeholder
        "similarity_score": 0.78  # Placeholder
    }