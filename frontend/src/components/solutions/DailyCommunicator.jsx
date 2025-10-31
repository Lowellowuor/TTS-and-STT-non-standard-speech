import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Volume2, Play, Square, Download, Upload, 
  Star, History, Zap, Clock, Settings, Shield,
  MessageSquare, Brain, Type, Hand, Eye, 
  ThumbsUp, ThumbsDown, RotateCcw, Share,
  Wifi, Battery, User, Bell, Languages,
  ChevronDown, Sparkles, Heart, TrendingUp,
  AlertTriangle
} from 'lucide-react';

// 1. ADD API BASE URL
const API_BASE = "http://localhost:8000";

const DailyCommunicator = () => {
  // State management
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechConfidence, setSpeechConfidence] = useState(85);
  const [activeCategory, setActiveCategory] = useState('all');
  const [inputMode, setInputMode] = useState('enhanced-stt');
  const [quickActions, setQuickActions] = useState([]);
  const [recentPhrases, setRecentPhrases] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: 'Kenyan Enhanced'
  });
  
  // NEW STATES FOR BACKEND INTEGRATION
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connected');

  // Refs
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  
  // NEW REFS FOR AUDIO RECORDING
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRef = useRef(null);

  // Kenyan context data
  const kenyanContext = {
    languages: ['en-KE', 'sw-KE'],
    emergencyContacts: ['999', '112', '911'],
    culturalPhrases: [
      { text: 'Habari yako?', category: 'greeting', language: 'sw' },
      { text: 'Mambo vipi?', category: 'greeting', language: 'sw' },
      { text: 'Asante sana', category: 'manners', language: 'sw' },
      { text: 'Tafadhali', category: 'manners', language: 'sw' },
      { text: 'Nahitaji msaada', category: 'emergency', language: 'sw' }
    ]
  };

  // Smart phrase categories with usage analytics
  const phraseCategories = {
    all: { name: 'All Phrases', icon: '📝', color: 'from-blue-500 to-purple-600' },
    frequent: { name: 'Most Used', icon: '🔥', color: 'from-orange-500 to-red-600' },
    greetings: { name: 'Greetings', icon: '👋', color: 'from-green-500 to-teal-600' },
    needs: { name: 'Basic Needs', icon: '💧', color: 'from-purple-500 to-pink-600' },
    medical: { name: 'Medical', icon: '🏥', color: 'from-red-500 to-orange-600' },
    emergency: { name: 'Emergency', icon: '🚨', color: 'from-red-600 to-pink-600' },
    manners: { name: 'Manners', icon: '🙏', color: 'from-yellow-500 to-amber-600' },
    kenyan: { name: 'Kenyan', icon: '🇰🇪', color: 'from-black to-green-600' }
  };

  // Smart phrases with usage tracking
  const [smartPhrases, setSmartPhrases] = useState([
    { id: 1, text: 'Hello', category: 'greetings', usage: 45, favorite: true, language: 'en' },
    { id: 2, text: 'Thank you', category: 'manners', usage: 38, favorite: true, language: 'en' },
    { id: 3, text: 'I need help', category: 'emergency', usage: 12, favorite: true, language: 'en' },
    { id: 4, text: 'I am in pain', category: 'medical', usage: 8, favorite: true, language: 'en' },
    { id: 5, text: 'I am hungry', category: 'needs', usage: 15, favorite: false, language: 'en' },
    { id: 6, text: 'I am thirsty', category: 'needs', usage: 14, favorite: false, language: 'en' },
    { id: 7, text: 'Habari yako?', category: 'kenyan', usage: 22, favorite: true, language: 'sw' },
    { id: 8, text: 'Asante sana', category: 'kenyan', usage: 18, favorite: false, language: 'sw' },
    { id: 9, text: 'Nahitaji msaada', category: 'emergency', usage: 5, favorite: true, language: 'sw' },
    { id: 10, text: 'Ninaumwa', category: 'medical', usage: 3, favorite: false, language: 'sw' }
  ]);

  // Input modes for different abilities
  const inputModes = [
    {
      id: 'enhanced-stt',
      name: 'Enhanced Speech',
      icon: <Mic size={18} />,
      description: 'Optimized for non-standard speech',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'predictive-text',
      name: 'Predictive Input',
      icon: <Brain size={18} />,
      description: 'AI-powered word prediction',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'symbol-board',
      name: 'Symbol Board',
      icon: <Type size={18} />,
      description: 'Visual communication',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'gesture-control',
      name: 'Gesture Input',
      icon: <Hand size={18} />,
      description: 'Head movements & expressions',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Word predictions based on context
  const [predictions, setPredictions] = useState([]);
  const predictionModels = {
    'en-KE': {
      'I need': ['help', 'water', 'food', 'medicine', 'restroom', 'assistance'],
      'I am': ['hungry', 'thirsty', 'in pain', 'tired', 'sick', 'happy'],
      'I want': ['to go home', 'to sleep', 'to eat', 'to drink', 'help'],
      'Where is': ['the bathroom', 'water', 'food', 'help', 'the doctor']
    },
    'sw-KE': {
      'Nahitaji': ['msaada', 'maji', 'chakula', 'dawa', 'choo', 'mapumziko'],
      'Mimi ni': ['njaa', 'kiu', 'umwa', 'mchovu', 'mgonjwa', 'furaha'],
      'Nataka': ['kwenda nyumbani', 'kulala', 'kula', 'kunywa', 'msaada'],
      'Wapi ni': ['choo', 'maji', 'chakula', 'msaada', 'daktari']
    }
  };

  // Initialize quick actions based on usage
  useEffect(() => {
    const frequentPhrases = smartPhrases
      .filter(phrase => phrase.usage > 10)
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 6);
    setQuickActions(frequentPhrases);
  }, [smartPhrases]);

  // Simulate confidence changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeechConfidence(prev => {
        const change = Math.random() * 20 - 10;
        return Math.min(95, Math.max(60, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. UPDATED TTS FUNCTION WITH BACKEND INTEGRATION
  const speakText = async (textToSpeak = message) => {
    if (!textToSpeak.trim()) return;

    setIsSpeaking(true);
    
    // Add to recent phrases
    if (!recentPhrases.find(phrase => phrase.text === textToSpeak)) {
      setRecentPhrases(prev => [
        { text: textToSpeak, timestamp: new Date(), usage: 1 },
        ...prev.slice(0, 9)
      ]);
    }

    // Update phrase usage
    const phraseIndex = smartPhrases.findIndex(phrase => phrase.text === textToSpeak);
    if (phraseIndex !== -1) {
      const updatedPhrases = [...smartPhrases];
      updatedPhrases[phraseIndex].usage += 1;
      setSmartPhrases(updatedPhrases);
    }

    try {
      // Call your backend TTS API
      const response = await fetch(`${API_BASE}/api/v1/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice_id: "kenyan-enhanced",
          speaking_rate: voiceSettings.rate,
          pitch: voiceSettings.pitch - 1.0,
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('TTS successful:', data);
        
        // Fallback to browser TTS
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = voiceSettings.rate;
          utterance.pitch = voiceSettings.pitch;
          utterance.volume = voiceSettings.volume;
          
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          
          speechRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        console.error('TTS Error:', data.error);
        fallbackTTS(textToSpeak);
      }
    } catch (error) {
      console.error('TTS API Error:', error);
      fallbackTTS(textToSpeak);
    }
  };

  // Fallback TTS function
  const fallbackTTS = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in your browser');
      setIsSpeaking(false);
    }
  };

  // 3. ENHANCED STT WITH BACKEND INTEGRATION
  const startEnhancedSTT = async () => {
    setIsRecording(true);
    setTranscript('');
    setEmergencyDetected(false);
    
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Send to STT backend for transcription
        const result = await transcribeAudio(audioBlob);
        
        if (result.success && result.transcription) {
          setMessage(result.transcription);
          setTranscript(result.transcription);
          
          // Auto-generate predictions
          updatePredictions(result.transcription);
          
          // Handle emergency detection
          if (result.emergencyDetected) {
            handleEmergencyDetection(result.transcription);
          }
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Store media recorder reference
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = audioChunks;
      
      // Start recording
      mediaRecorder.start();
      
      // Stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Enhanced STT failed:', error);
      alert('Could not access microphone. Please check permissions.');
      setIsRecording(false);
      // Fallback to browser speech recognition
      startBrowserSpeechRecognition();
    }
  };

  // 4. BACKEND STT TRANSCRIPTION
  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'daily_communication.wav');
      
      const response = await fetch(`${API_BASE}/api/v1/stt/transcribe`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Speech transcribed:', data.transcription);
        
        return { 
          success: true, 
          transcription: data.transcription,
          emergencyDetected: data.emergency_detected 
        };
      } else {
        console.error('STT Error:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('STT API Error:', error);
      return { success: false, error: error.message };
    }
  };

  // 5. TEXT ENHANCEMENT FUNCTION
  const enhanceText = async () => {
    if (!message.trim()) return;
    
    setIsEnhancing(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/enhance/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          enhancement_type: "clarity",
          context: "daily_communication"
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.enhanced_text);
        updatePredictions(data.enhanced_text);
        console.log('Text enhanced successfully');
      } else {
        console.error('Enhancement failed:', data.error);
      }
    } catch (error) {
      console.error('Enhancement API Error:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // 6. EMERGENCY DETECTION HANDLER
  const handleEmergencyDetection = (transcription) => {
    setEmergencyDetected(true);
    
    // Auto-switch to emergency category
    setActiveCategory('emergency');
    
    // Speak emergency alert
    speakText("Emergency detected. Help is available.");
    
    // Log emergency
    console.log('Emergency detected in speech:', transcription);
  };

  // 7. BROWSER SPEECH RECOGNITION FALLBACK
  const startBrowserSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-KE';
    
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setMessage(prev => prev + ' ' + transcript);
      updatePredictions(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Update predictions based on input
  const updatePredictions = (text) => {
    if (text.trim()) {
      const words = text.toLowerCase().split(' ');
      const lastWords = words.slice(-2).join(' ');
      const language = 'en-KE';
      const model = predictionModels[language];
      
      let newPredictions = [];
      Object.keys(model).forEach(phrase => {
        if (lastWords.toLowerCase().startsWith(phrase.toLowerCase())) {
          newPredictions = [...newPredictions, ...model[phrase]];
        }
      });
      
      setPredictions([...new Set(newPredictions)].slice(0, 4));
    } else {
      setPredictions([]);
    }
  };

  useEffect(() => {
    updatePredictions(message);
  }, [message]);

  const stopSpeech = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Phrase management
  const addToFavorites = (phraseId) => {
    setSmartPhrases(prev => 
      prev.map(phrase => 
        phrase.id === phraseId ? { ...phrase, favorite: !phrase.favorite } : phrase
      )
    );
  };

  const addCustomPhrase = (text, category = 'custom') => {
    const newPhrase = {
      id: Date.now(),
      text,
      category,
      usage: 1,
      favorite: false,
      language: 'en'
    };
    setSmartPhrases(prev => [newPhrase, ...prev]);
    setMessage('');
  };

  // Filter phrases based on active category
  const filteredPhrases = smartPhrases.filter(phrase => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'frequent') return phrase.usage > 5;
    if (activeCategory === 'favorites') return phrase.favorite;
    return phrase.category === activeCategory;
  });

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceColorClass = (confidence) => {
    if (confidence >= 80) return 'var(--accent-success)';
    if (confidence >= 70) return 'var(--accent-warning)';
    return 'var(--accent-error)';
  };

  const getUsageIntensity = (usage) => {
    if (usage > 30) return 'high';
    if (usage > 15) return 'medium';
    return 'low';
  };

  return (
    <div className="daily-communicator-page">
      {/* Emergency Alert Banner */}
      {emergencyDetected && (
        <div className="emergency-banner">
          <AlertTriangle size={24} />
          <span>EMERGENCY DETECTED - Assistance is available</span>
          <button onClick={() => setEmergencyDetected(false)}>×</button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="comms-grid">
        
        {/* Left Sidebar - Quick Access & Categories */}
        <div className="sidebar-left">
          {/* Communication Status Card */}
          <div className="status-card glass-card">
            <div className="status-header">
              <div className="status-title">
                <MessageSquare size={20} />
                <span>Communication Status</span>
              </div>
              <div className={`connection-status ${backendStatus === 'connected' ? 'good' : 'poor'}`}>
                <div className="status-dot"></div>
                <span>{backendStatus === 'connected' ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
            
            <div className="confidence-meters">
              <div className="confidence-item">
                <span>Speech Understanding</span>
                <div className="confidence-display">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ 
                        width: `${speechConfidence}%`,
                        backgroundColor: getConfidenceColorClass(speechConfidence)
                      }}
                    ></div>
                  </div>
                  <span className={`confidence-value ${getConfidenceColor(speechConfidence)}`}>
                    {speechConfidence}%
                  </span>
                </div>
              </div>
              
              <div className="confidence-item">
                <span>Backend Services</span>
                <div className="backend-status">
                  <div className="service-status">
                    <Wifi size={14} className={backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'} />
                    <span>TTS: {backendStatus === 'connected' ? 'Online' : 'Offline'}</span>
                  </div>
                  <div className="service-status">
                    <Mic size={14} className={backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'} />
                    <span>STT: {backendStatus === 'connected' ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Mode Selector */}
          <div className="input-mode-card glass-card">
            <h3 className="card-title">
              <Zap size={18} />
              <span>Input Mode</span>
            </h3>
            <div className="mode-options">
              {inputModes.map(mode => (
                <button
                  key={mode.id}
                  className={`mode-option ${inputMode === mode.id ? 'active' : ''}`}
                  onClick={() => setInputMode(mode.id)}
                >
                  <div className="mode-icon">{mode.icon}</div>
                  <div className="mode-info">
                    <span className="mode-name">{mode.name}</span>
                    <span className="mode-desc">{mode.description}</span>
                  </div>
                  {inputMode === mode.id && (
                    <div className="active-indicator"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={18} />
                <span>Quick Actions</span>
              </h3>
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <div className="quick-actions-grid">
              {quickActions.map(phrase => (
                <button
                  key={phrase.id}
                  className="quick-action-btn"
                  onClick={() => {
                    setMessage(phrase.text);
                    speakText(phrase.text);
                  }}
                >
                  <span className="phrase-icon">
                    {phrase.favorite ? '⭐' : '💬'}
                  </span>
                  <span className="phrase-text">{phrase.text}</span>
                  <div className={`usage-badge ${getUsageIntensity(phrase.usage)}`}>
                    {phrase.usage}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Main Communication Area */}
        <div className="main-comms-area">
          {/* Communication Header */}
          <div className="comms-header">
            <div className="header-left">
              <h1 className="page-title">Daily Communicator</h1>
              <p className="page-subtitle">Your voice, your way</p>
            </div>
            <div className="header-actions">
              <button className="action-btn" title="Settings">
                <Settings size={20} />
              </button>
              <button className="action-btn emergency" title="Emergency">
                <Shield size={20} />
              </button>
            </div>
          </div>

          {/* Smart Input Area */}
          <div className="input-area glass-card">
            {/* Input Mode Display */}
            <div className="input-mode-display">
              <div className="current-mode">
                <span>Active: </span>
                <strong>
                  {inputModes.find(m => m.id === inputMode)?.name}
                </strong>
              </div>
              <div className="language-badge">
                <Languages size={14} />
                <span>EN-KE</span>
              </div>
            </div>

            {/* Enhanced Speech Input Section */}
            {inputMode === 'enhanced-stt' && (
              <div className="speech-input-section">
                <button
                  className={`speech-btn ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopSpeechRecognition : startEnhancedSTT}
                >
                  <Mic size={24} />
                  <span>{isRecording ? 'Stop Recording' : 'Start Enhanced Speech'}</span>
                  {isRecording && (
                    <div className="speech-visualizer">
                      {[...Array(6)].map((_, i) => (
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
                  )}
                </button>
                
                {/* Voice Transcript Display */}
                {transcript && (
                  <div className="voice-transcript">
                    <small>Voice input: "{transcript}"</small>
                  </div>
                )}
              </div>
            )}

            {/* Text Input Area */}
            <div className="text-input-section">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here or use voice input..."
                className="smart-textarea"
                rows="4"
              />
              
              {/* Word Predictions */}
              {predictions.length > 0 && (
                <div className="predictions-bar">
                  <span className="predictions-label">AI Suggestions:</span>
                  <div className="predictions-list">
                    {predictions.map((prediction, index) => (
                      <button
                        key={index}
                        className="prediction-chip"
                        onClick={() => setMessage(prev => prev + ' ' + prediction)}
                      >
                        {prediction}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Actions */}
              <div className="input-actions">
                <div className="action-group">
                  <button 
                    className="btn-primary"
                    onClick={() => speakText()}
                    disabled={!message.trim() || isSpeaking}
                  >
                    <Play size={18} />
                    <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={stopSpeech}
                    disabled={!isSpeaking}
                  >
                    <Square size={18} />
                    <span>Stop</span>
                  </button>
                  
                  {/* Text Enhancement Button */}
                  <button 
                    className="btn-secondary"
                    onClick={enhanceText}
                    disabled={!message.trim() || isEnhancing}
                  >
                    <Sparkles size={18} />
                    <span>{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
                  </button>
                  
                  <button 
                    className="btn-secondary"
                    onClick={() => setMessage('')}
                  >
                    <RotateCcw size={18} />
                    <span>Clear</span>
                  </button>
                </div>
                
                <div className="action-group">
                  <button 
                    className="btn-outline"
                    onClick={() => addCustomPhrase(message)}
                    disabled={!message.trim()}
                  >
                    <Star size={18} />
                    <span>Save</span>
                  </button>
                  
                  <button className="btn-outline">
                    <Share size={18} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Phrases */}
          <div className="recent-phrases glass-card">
            <h3 className="card-title">
              <History size={18} />
              <span>Recent Phrases</span>
            </h3>
            <div className="phrases-grid">
              {recentPhrases.slice(0, 6).map((phrase, index) => (
                <button
                  key={index}
                  className="recent-phrase"
                  onClick={() => {
                    setMessage(phrase.text);
                    speakText(phrase.text);
                  }}
                >
                  <span className="phrase-text">{phrase.text}</span>
                  <span className="phrase-time">
                    {new Date(phrase.timestamp).toLocaleTimeString('en-KE', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </button>
              ))}
              {recentPhrases.length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={32} />
                  <p>Your recent phrases will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Phrase Library */}
        <div className="sidebar-right">
          {/* Phrase Categories */}
          <div className="categories-card glass-card">
            <h3 className="card-title">Phrase Library</h3>
            <div className="categories-list">
              {Object.entries(phraseCategories).map(([key, category]) => (
                <button
                  key={key}
                  className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="phrase-count">
                    {key === 'all' ? smartPhrases.length :
                     key === 'frequent' ? smartPhrases.filter(p => p.usage > 5).length :
                     key === 'favorites' ? smartPhrases.filter(p => p.favorite).length :
                     smartPhrases.filter(p => p.category === key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Phrases List */}
          <div className="phrases-list-card glass-card">
            <div className="card-header">
              <h3 className="card-title">
                {phraseCategories[activeCategory]?.name}
              </h3>
              <div className="sort-options">
                <button className="sort-btn active">Usage</button>
                <button className="sort-btn">A-Z</button>
              </div>
            </div>
            
            <div className="phrases-scroller">
              {filteredPhrases
                .sort((a, b) => b.usage - a.usage)
                .map(phrase => (
                  <div key={phrase.id} className="phrase-item">
                    <button
                      className="phrase-content"
                      onClick={() => {
                        setMessage(phrase.text);
                        speakText(phrase.text);
                      }}
                    >
                      <span className="phrase-text">{phrase.text}</span>
                      {phrase.language === 'sw' && (
                        <span className="language-tag">SW</span>
                      )}
                    </button>
                    
                    <div className="phrase-actions">
                      <button
                        className={`favorite-btn ${phrase.favorite ? 'active' : ''}`}
                        onClick={() => addToFavorites(phrase.id)}
                      >
                        <Heart 
                          size={14} 
                          fill={phrase.favorite ? 'currentColor' : 'none'}
                        />
                      </button>
                      
                      <div className="usage-indicator">
                        <div 
                          className={`usage-bar ${getUsageIntensity(phrase.usage)}`}
                          style={{ width: `${Math.min(100, phrase.usage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {filteredPhrases.length === 0 && (
                <div className="empty-phrases">
                  <Type size={32} />
                  <p>No phrases found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCommunicator;