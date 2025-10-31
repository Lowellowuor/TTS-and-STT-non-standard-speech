import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Settings, Play, Square, Download, Upload, 
  Star, History, Zap, Clock, Shield, MessageSquare,
  Brain, Type, Hand, Eye, ThumbsUp, ThumbsDown, 
  RotateCcw, Share, Sparkles, Target, BarChart3,
  Lightbulb, Users, Award, Heart, Globe, Battery,
  Wifi, User, ChevronDown, Search, Filter, Plus,
  Trash2, Edit3, Mic, EyeOff, Lock, Unlock, Copy,
  CheckCircle, XCircle, TrendingUp, Pause, SkipForward,
  SkipBack, Waves, Gauge, Activity, Monitor, FileText
} from 'lucide-react';

const VoicePersonalizer = () => {
  // State management
  const [activeVoice, setActiveVoice] = useState('default');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 50,
    speed: 50,
    volume: 80,
    clarity: 75,
    emotion: 'neutral'
  });
  const [accent, setAccent] = useState('kenyan');
  const [testText, setTestText] = useState('Hello, this is my personalized voice. How does it sound?');
  const [recordingTime, setRecordingTime] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [recordingPhase, setRecordingPhase] = useState(0);

  // Refs
  const speechRef = useRef(null);
  const recordingRef = useRef(null);
  const timerRef = useRef(null);

  // Voice profiles
  const voiceProfiles = [
    {
      id: 'default',
      name: 'Default Voice',
      description: 'Standard system voice',
      accent: 'neutral',
      trained: true,
      progress: 100,
      created: '2024-01-15',
      usage: 45
    },
    {
      id: 'personal',
      name: 'My Personal Voice',
      description: 'Trained with my voice samples',
      accent: 'kenyan',
      trained: true,
      progress: 85,
      created: '2024-02-20',
      usage: 120
    },
    {
      id: 'professional',
      name: 'Professional Voice',
      description: 'Clear and formal tone',
      accent: 'british',
      trained: false,
      progress: 0,
      created: '',
      usage: 0
    },
    {
      id: 'friendly',
      name: 'Friendly Voice',
      description: 'Warm and approachable',
      accent: 'kenyan',
      trained: false,
      progress: 0,
      created: '',
      usage: 0
    }
  ];

  // Accent options
  const accentOptions = [
    { id: 'kenyan', name: 'Kenyan English', flag: '🇰🇪', description: 'East African accent' },
    { id: 'british', name: 'British English', flag: '🇬🇧', description: 'UK English accent' },
    { id: 'american', name: 'American English', flag: '🇺🇸', description: 'US English accent' },
    { id: 'swahili', name: 'Swahili', flag: '🌍', description: 'Bantu language' },
    { id: 'neutral', name: 'Neutral', flag: '🌐', description: 'Standard international' }
  ];

  // Training phrases for voice cloning
  const trainingPhrases = [
    "The quick brown fox jumps over the lazy dog",
    "Hello, my name is [Your Name] and this is my voice",
    "I am using VoiceForge to create my personalized voice",
    "The weather is beautiful today in Nairobi",
    "Thank you for helping me communicate better",
    "I would like to order some food and drinks",
    "Could you please help me with this task?",
    "I am feeling happy and excited today"
  ];

  // Voice settings presets
  const voicePresets = [
    {
      id: 'clear',
      name: 'Clear Speech',
      settings: { pitch: 60, speed: 45, volume: 85, clarity: 90, emotion: 'neutral' },
      description: 'Optimized for clarity'
    },
    {
      id: 'expressive',
      name: 'Expressive',
      settings: { pitch: 70, speed: 55, volume: 80, clarity: 75, emotion: 'happy' },
      description: 'More emotional variation'
    },
    {
      id: 'calm',
      name: 'Calm & Soothing',
      settings: { pitch: 40, speed: 35, volume: 70, clarity: 80, emotion: 'calm' },
      description: 'Relaxed speaking pace'
    },
    {
      id: 'energetic',
      name: 'Energetic',
      settings: { pitch: 80, speed: 65, volume: 90, clarity: 70, emotion: 'excited' },
      description: 'High energy delivery'
    }
  ];

  // Training progress tracking
  const trainingProgressData = {
    phases: [
      { name: 'Voice Sampling', progress: 100, completed: true },
      { name: 'Pattern Analysis', progress: 100, completed: true },
      { name: 'Model Training', progress: 85, completed: false },
      { name: 'Quality Testing', progress: 45, completed: false },
      { name: 'Optimization', progress: 20, completed: false }
    ],
    estimatedTime: '15 minutes remaining',
    samplesCollected: 45,
    targetSamples: 50,
    accuracy: '88%'
  };

  // Initialize
  useEffect(() => {
    // Simulate initial training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev < 85) return prev + 0.5;
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Text-to-Speech with current settings
  const speakText = (text = testText) => {
    if (!text.trim()) return;

    setIsPlaying(true);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply voice settings
      utterance.rate = voiceSettings.speed / 50;
      utterance.pitch = (voiceSettings.pitch - 50) / 50 + 1;
      utterance.volume = voiceSettings.volume / 100;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in your browser');
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Handle voice setting changes
  const handleSettingChange = (setting, value) => {
    setVoiceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Apply preset
  const applyPreset = (preset) => {
    setVoiceSettings(preset.settings);
  };

  // Start voice training
  const startVoiceTraining = () => {
    setShowTrainingModal(true);
    setTrainingStatus('preparing');
    setRecordingPhase(0);
    setRecordingTime(0);
  };

  // Simulate recording process
  const startRecording = () => {
    setIsRecording(true);
    setTrainingStatus('recording');
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Simulate recording phases
    setTimeout(() => {
      setRecordingPhase(1);
    }, 5000);
    
    setTimeout(() => {
      setRecordingPhase(2);
    }, 10000);
    
    setTimeout(() => {
      finishRecording();
    }, 15000);
  };

  const finishRecording = () => {
    setIsRecording(false);
    setTrainingStatus('processing');
    clearInterval(timerRef.current);
    
    // Simulate processing
    setTimeout(() => {
      setTrainingStatus('completed');
      setTrainingProgress(100);
    }, 3000);
  };

  const cancelTraining = () => {
    setIsRecording(false);
    setTrainingStatus('idle');
    clearInterval(timerRef.current);
    setShowTrainingModal(false);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current training phrase
  const getCurrentPhrase = () => {
    return trainingPhrases[recordingPhase] || trainingPhrases[0];
  };

  return (
    <div className="voice-personalizer-page">
      {/* Training Modal */}
      {showTrainingModal && (
        <div className="training-modal-overlay">
          <div className="training-modal glass-card">
            <div className="modal-header">
              <h2>Voice Training Session</h2>
              <button className="close-btn" onClick={cancelTraining}>
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="training-progress">
              <div className="progress-header">
                <span>Phase {recordingPhase + 1} of {trainingPhrases.length}</span>
                <span>{formatTime(recordingTime)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((recordingPhase + 1) / trainingPhrases.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="training-content">
              {trainingStatus === 'preparing' && (
                <div className="training-phase">
                  <div className="phase-icon">🎤</div>
                  <h3>Get Ready to Record</h3>
                  <p>Please ensure you're in a quiet environment and speak clearly into your microphone.</p>
                  <button className="btn-primary" onClick={startRecording}>
                    Start Recording
                  </button>
                </div>
              )}

              {trainingStatus === 'recording' && (
                <div className="training-phase">
                  <div className="phase-icon recording">🔴</div>
                  <h3>Recording in Progress</h3>
                  <div className="recording-visualizer">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="visualizer-bar"
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          height: `${30 + Math.random() * 70}%`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="current-phrase">
                    <p>"{getCurrentPhrase()}"</p>
                  </div>
                  <button className="btn-secondary" onClick={finishRecording}>
                    Stop Recording
                  </button>
                </div>
              )}

              {trainingStatus === 'processing' && (
                <div className="training-phase">
                  <div className="phase-icon processing">⚡</div>
                  <h3>Processing Your Voice</h3>
                  <p>Analyzing voice patterns and training the AI model...</p>
                  <div className="processing-spinner"></div>
                </div>
              )}

              {trainingStatus === 'completed' && (
                <div className="training-phase">
                  <div className="phase-icon completed">✅</div>
                  <h3>Training Complete!</h3>
                  <p>Your voice model has been successfully trained and is ready to use.</p>
                  <div className="training-results">
                    <div className="result-item">
                      <span>Accuracy</span>
                      <span className="result-value">92%</span>
                    </div>
                    <div className="result-item">
                      <span>Samples Collected</span>
                      <span className="result-value">50/50</span>
                    </div>
                    <div className="result-item">
                      <span>Training Time</span>
                      <span className="result-value">{formatTime(recordingTime)}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowTrainingModal(false)}
                  >
                    Use My Voice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="voice-grid">
        
        {/* Left Sidebar - Voice Profiles & Training */}
        <div className="sidebar-left">
          {/* Voice Profiles */}
          <div className="profiles-card glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <User size={18} />
                <span>Voice Profiles</span>
              </h3>
              <button className="icon-btn" title="Create new profile">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="profiles-list">
              {voiceProfiles.map(profile => (
                <div
                  key={profile.id}
                  className={`profile-card ${activeVoice === profile.id ? 'active' : ''} ${profile.trained ? 'trained' : 'untrained'}`}
                  onClick={() => setActiveVoice(profile.id)}
                >
                  <div className="profile-avatar">
                    <Volume2 size={20} />
                    {profile.trained && (
                      <div className="trained-badge">
                        <CheckCircle size={12} />
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-info">
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-desc">{profile.description}</span>
                    <div className="profile-meta">
                      <span className="profile-accent">{profile.accent}</span>
                      {profile.created && (
                        <span className="profile-date">{profile.created}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="profile-stats">
                    {profile.trained ? (
                      <>
                        <div className="progress-circle">
                          <div 
                            className="circle-fill"
                            style={{ 
                              background: `conic-gradient(var(--accent-primary) ${profile.progress}%, var(--glass-bg) 0)` 
                            }}
                          ></div>
                          <span className="progress-value">{profile.progress}%</span>
                        </div>
                        <span className="usage-count">{profile.usage} uses</span>
                      </>
                    ) : (
                      <button 
                        className="train-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          startVoiceTraining();
                        }}
                      >
                        <Zap size={14} />
                        <span>Train</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Progress */}
          <div className="training-card glass-card">
            <h3 className="card-title">
              <Activity size={18} />
              <span>Training Progress</span>
            </h3>
            
            <div className="progress-overview">
              <div className="progress-main">
                <div className="progress-circle large">
                  <div 
                    className="circle-fill"
                    style={{ 
                      background: `conic-gradient(var(--accent-primary) ${trainingProgress}%, var(--glass-bg) 0)` 
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(trainingProgress)}%</span>
                </div>
                <div className="progress-info">
                  <span className="progress-label">Model Training</span>
                  <span className="progress-time">{trainingProgressData.estimatedTime}</span>
                </div>
              </div>
              
              <div className="progress-details">
                <div className="detail-item">
                  <span>Samples</span>
                  <span>{trainingProgressData.samplesCollected}/{trainingProgressData.targetSamples}</span>
                </div>
                <div className="detail-item">
                  <span>Accuracy</span>
                  <span>{trainingProgressData.accuracy}</span>
                </div>
              </div>
            </div>
            
            <div className="training-phases">
              {trainingProgressData.phases.map((phase, index) => (
                <div key={index} className="phase-item">
                  <div className={`phase-indicator ${phase.completed ? 'completed' : ''}`}>
                    {phase.completed ? <CheckCircle size={12} /> : <div className="phase-dot"></div>}
                  </div>
                  <span className="phase-name">{phase.name}</span>
                  <div className="phase-progress">
                    <div 
                      className="phase-fill"
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="presets-card glass-card">
            <h3 className="card-title">
              <Copy size={18} />
              <span>Quick Presets</span>
            </h3>
            
            <div className="presets-grid">
              {voicePresets.map(preset => (
                <button
                  key={preset.id}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="preset-icon">
                    <Volume2 size={16} />
                  </div>
                  <div className="preset-info">
                    <span className="preset-name">{preset.name}</span>
                    <span className="preset-desc">{preset.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Voice Customization */}
        <div className="main-voice-area">
          {/* Header */}
          <div className="voice-header">
            <div className="header-left">
              <h1 className="page-title">Voice Personalizer</h1>
              <p className="page-subtitle">Customize and train your unique voice</p>
            </div>
            <div className="header-actions">
              <button className="action-btn" title="Voice Analytics">
                <BarChart3 size={20} />
              </button>
              <button className="action-btn" title="Settings">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Voice Settings Controls */}
          <div className="settings-section glass-card">
            <h3 className="section-title">
              <Settings size={18} />
              <span>Voice Settings</span>
            </h3>
            
            <div className="settings-grid">
              {/* Pitch Control */}
              <div className="setting-control">
                <div className="control-header">
                  <span className="control-label">Pitch</span>
                  <span className="control-value">{voiceSettings.pitch}%</span>
                </div>
                <div className="slider-container">
                  <span className="slider-label">Low</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceSettings.pitch}
                    onChange={(e) => handleSettingChange('pitch', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <span className="slider-label">High</span>
                </div>
              </div>

              {/* Speed Control */}
              <div className="setting-control">
                <div className="control-header">
                  <span className="control-label">Speed</span>
                  <span className="control-value">{voiceSettings.speed}%</span>
                </div>
                <div className="slider-container">
                  <span className="slider-label">Slow</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceSettings.speed}
                    onChange={(e) => handleSettingChange('speed', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <span className="slider-label">Fast</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="setting-control">
                <div className="control-header">
                  <span className="control-label">Volume</span>
                  <span className="control-value">{voiceSettings.volume}%</span>
                </div>
                <div className="slider-container">
                  <span className="slider-label">Soft</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceSettings.volume}
                    onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <span className="slider-label">Loud</span>
                </div>
              </div>

              {/* Clarity Control */}
              <div className="setting-control">
                <div className="control-header">
                  <span className="control-label">Clarity</span>
                  <span className="control-value">{voiceSettings.clarity}%</span>
                </div>
                <div className="slider-container">
                  <span className="slider-label">Natural</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceSettings.clarity}
                    onChange={(e) => handleSettingChange('clarity', parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <span className="slider-label">Clear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accent Selection */}
          <div className="accent-section glass-card">
            <h3 className="section-title">
              <Globe size={18} />
              <span>Accent & Language</span>
            </h3>
            
            <div className="accent-options">
              {accentOptions.map(option => (
                <button
                  key={option.id}
                  className={`accent-option ${accent === option.id ? 'active' : ''}`}
                  onClick={() => setAccent(option.id)}
                >
                  <span className="accent-flag">{option.flag}</span>
                  <div className="accent-info">
                    <span className="accent-name">{option.name}</span>
                    <span className="accent-desc">{option.description}</span>
                  </div>
                  {accent === option.id && (
                    <div className="accent-check">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Testing Playground */}
          <div className="playground-section glass-card">
            <h3 className="section-title">
              <Play size={18} />
              <span>Voice Testing</span>
            </h3>
            
            <div className="playground-content">
              <div className="test-input">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Type text here to test your voice settings..."
                  className="test-textarea"
                  rows="3"
                />
                <div className="test-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => speakText()}
                    disabled={!testText.trim() || isPlaying}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={16} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={stopSpeech}
                    disabled={!isPlaying}
                  >
                    <Square size={16} />
                    <span>Stop</span>
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={() => setTestText('')}
                  >
                    <RotateCcw size={16} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              
              <div className="test-visualization">
                <div className="visualizer">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i}
                      className="viz-bar"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: `${isPlaying ? 20 + Math.random() * 80 : 10}%`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="viz-info">
                  <span>Real-time voice visualization</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analytics & Tools */}
        <div className="sidebar-right">
          {/* Voice Analytics */}
          <div className="analytics-card glass-card">
            <h3 className="card-title">
              <BarChart3 size={18} />
              <span>Voice Analytics</span>
            </h3>
            
            <div className="analytics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <Volume2 size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">156</span>
                  <span className="metric-label">Total Uses</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">92%</span>
                  <span className="metric-label">Accuracy</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <Clock size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">4.2h</span>
                  <span className="metric-label">Training Time</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <Star size={20} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">A+</span>
                  <span className="metric-label">Quality Score</span>
                </div>
              </div>
            </div>
            
            <div className="usage-chart">
              <h4>Usage This Week</h4>
              <div className="chart-bars">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ height: `${30 + Math.random() * 70}%` }}
                    ></div>
                    <span className="bar-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training Tools */}
          <div className="tools-card glass-card">
            <h3 className="card-title">
              <Zap size={18} />
              <span>Training Tools</span>
            </h3>
            
            <div className="tools-list">
              <button 
                className="tool-btn primary"
                onClick={startVoiceTraining}
              >
                <Mic size={16} />
                <span>Start Voice Training</span>
              </button>
              
              <button className="tool-btn">
                <Upload size={16} />
                <span>Import Voice Samples</span>
              </button>
              
              <button className="tool-btn">
                <Download size={16} />
                <span>Export Voice Profile</span>
              </button>
              
              <button className="tool-btn">
                <FileText size={16} />
                <span>Training Guide</span>
              </button>
            </div>
          </div>

          {/* Voice Quality Monitor */}
          <div className="quality-card glass-card">
            <h3 className="card-title">
              <Monitor size={18} />
              <span>Quality Monitor</span>
            </h3>
            
            <div className="quality-metrics">
              <div className="quality-item">
                <span className="quality-label">Clarity</span>
                <div className="quality-bar">
                  <div 
                    className="quality-fill excellent"
                    style={{ width: '92%' }}
                  ></div>
                </div>
                <span className="quality-value">92%</span>
              </div>
              
              <div className="quality-item">
                <span className="quality-label">Naturalness</span>
                <div className="quality-bar">
                  <div 
                    className="quality-fill good"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <span className="quality-value">85%</span>
              </div>
              
              <div className="quality-item">
                <span className="quality-label">Emotion</span>
                <div className="quality-bar">
                  <div 
                    className="quality-fill good"
                    style={{ width: '78%' }}
                  ></div>
                </div>
                <span className="quality-value">78%</span>
              </div>
              
              <div className="quality-item">
                <span className="quality-label">Consistency</span>
                <div className="quality-bar">
                  <div 
                    className="quality-fill excellent"
                    style={{ width: '94%' }}
                  ></div>
                </div>
                <span className="quality-value">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePersonalizer;