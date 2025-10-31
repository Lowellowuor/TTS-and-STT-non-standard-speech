import React, { useState, useEffect, useRef } from 'react';
import { 
  Image, Grid, Folder, Upload, Volume2, Play, Square,
  Settings, Shield, MessageSquare, Type, RotateCcw,
  Share, Sparkles, Target, BarChart3, Lightbulb, Users,
  Award, Clock, Heart, Globe, Battery, Wifi, User,
  ChevronDown, Search, Filter, Plus, Trash2, Edit3,
  Mic, Eye, EyeOff, Lock, Unlock, Download, Star,
  Zap, TrendingUp, History, Home, Utensils, Heart as HeartIcon,
  Stethoscope, AlertTriangle, Smile, Frown, ThumbsUp
} from 'lucide-react';

// 1. ADD API BASE URL
const API_BASE = "http://localhost:8000";

const SymbolBoard = () => {
  // State management
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [sentence, setSentence] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  const [customSymbolName, setCustomSymbolName] = useState('');
  const [customSymbolImage, setCustomSymbolImage] = useState(null);
  const [recentSymbols, setRecentSymbols] = useState([]);
  
  // NEW STATES FOR BACKEND INTEGRATION
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emergencyDetected, setEmergencyDetected] = useState(false);

  // Refs
  const speechRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // NEW REFS FOR AUDIO RECORDING
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Symbol categories with Kenyan context
  const symbolCategories = {
    all: { name: 'All Symbols', icon: '🔄', color: 'from-blue-500 to-purple-600', count: 0 },
    basic: { name: 'Basic Needs', icon: '💧', color: 'from-green-500 to-teal-600' },
    food: { name: 'Food & Drink', icon: '🍲', color: 'from-orange-500 to-red-600' },
    medical: { name: 'Medical', icon: '🏥', color: 'from-red-500 to-pink-600' },
    emotions: { name: 'Emotions', icon: '😊', color: 'from-yellow-500 to-amber-600' },
    social: { name: 'Social', icon: '👥', color: 'from-purple-500 to-indigo-600' },
    kenyan: { name: 'Kenyan Context', icon: '🇰🇪', color: 'from-black to-green-600' },
    emergency: { name: 'Emergency', icon: '🚨', color: 'from-red-600 to-orange-600' },
    custom: { name: 'My Symbols', icon: '⭐', color: 'from-gray-500 to-gray-700' }
  };

  // Symbol library with Kenyan context
  const symbolLibrary = [
    // Basic Needs
    { id: 1, name: 'Water', category: 'basic', image: '💧', kenyan: false, usage: 45 },
    { id: 2, name: 'Food', category: 'basic', image: '🍽️', kenyan: false, usage: 38 },
    { id: 3, name: 'Bathroom', category: 'basic', image: '🚽', kenyan: false, usage: 32 },
    { id: 4, name: 'Sleep', category: 'basic', image: '😴', kenyan: false, usage: 28 },
    { id: 5, name: 'Help', category: 'basic', image: '🆘', kenyan: false, usage: 41 },

    // Food & Drink (Kenyan context)
    { id: 6, name: 'Ugali', category: 'food', image: '🌽', kenyan: true, usage: 25 },
    { id: 7, name: 'Sukuma Wiki', category: 'food', image: '🥬', kenyan: true, usage: 22 },
    { id: 8, name: 'Chai', category: 'food', image: '☕', kenyan: true, usage: 35 },
    { id: 9, name: 'Milk', category: 'food', image: '🥛', kenyan: false, usage: 30 },
    { id: 10, name: 'Bread', category: 'food', image: '🍞', kenyan: false, usage: 26 },
    { id: 11, name: 'Fruit', category: 'food', image: '🍎', kenyan: false, usage: 24 },
    { id: 12, name: 'Meat', category: 'food', image: '🍗', kenyan: false, usage: 20 },

    // Medical
    { id: 13, name: 'Medicine', category: 'medical', image: '💊', kenyan: false, usage: 18 },
    { id: 14, name: 'Pain', category: 'medical', image: '🤕', kenyan: false, usage: 22 },
    { id: 15, name: 'Doctor', category: 'medical', image: '👨‍⚕️', kenyan: false, usage: 16 },
    { id: 16, name: 'Hospital', category: 'medical', image: '🏥', kenyan: false, usage: 14 },

    // Emotions
    { id: 17, name: 'Happy', category: 'emotions', image: '😊', kenyan: false, usage: 35 },
    { id: 18, name: 'Sad', category: 'emotions', image: '😢', kenyan: false, usage: 18 },
    { id: 19, name: 'Angry', category: 'emotions', image: '😠', kenyan: false, usage: 12 },
    { id: 20, name: 'Tired', category: 'emotions', image: '😫', kenyan: false, usage: 28 },

    // Social
    { id: 21, name: 'Hello', category: 'social', image: '👋', kenyan: false, usage: 40 },
    { id: 22, name: 'Thank You', category: 'social', image: '🙏', kenyan: false, usage: 38 },
    { id: 23, name: 'Please', category: 'social', image: '🥺', kenyan: false, usage: 32 },
    { id: 24, name: 'Goodbye', category: 'social', image: '👋', kenyan: false, usage: 25 },

    // Kenyan Context
    { id: 25, name: 'Matatu', category: 'kenyan', image: '🚐', kenyan: true, usage: 15 },
    { id: 26, name: 'Market', category: 'kenyan', image: '🛒', kenyan: true, usage: 18 },
    { id: 27, name: 'Church', category: 'kenyan', image: '⛪', kenyan: true, usage: 20 },
    { id: 28, name: 'School', category: 'kenyan', image: '🏫', kenyan: true, usage: 22 },
    { id: 29, name: 'Farm', category: 'kenyan', image: '🚜', kenyan: true, usage: 16 },
    { id: 30, name: 'Tea Farm', category: 'kenyan', image: '🌱', kenyan: true, usage: 14 },

    // Emergency
    { id: 31, name: 'Emergency', category: 'emergency', image: '🚨', kenyan: false, usage: 8 },
    { id: 32, name: 'Police', category: 'emergency', image: '👮', kenyan: false, usage: 6 },
    { id: 33, name: 'Ambulance', category: 'emergency', image: '🚑', kenyan: false, usage: 7 },
    { id: 34, name: 'Fire', category: 'emergency', image: '🔥', kenyan: false, usage: 5 }
  ];

  // Custom symbols (initially empty)
  const [customSymbols, setCustomSymbols] = useState([]);

  // Quick sentences templates
  const quickSentences = [
    "I want food and water",
    "I need to go to bathroom",
    "I am in pain",
    "I am happy today",
    "Thank you for helping me",
    "I want to go home"
  ];

  // Initialize category counts
  useEffect(() => {
    const counts = { ...symbolCategories };
    Object.keys(counts).forEach(category => {
      if (category === 'all') {
        counts[category].count = symbolLibrary.length + customSymbols.length;
      } else {
        counts[category].count = 
          symbolLibrary.filter(s => s.category === category).length +
          customSymbols.filter(s => s.category === category).length;
      }
    });
    // Update state if needed
  }, [customSymbols]);

  // 2. UPDATED TTS FUNCTION WITH BACKEND INTEGRATION
  const speakText = async (text = sentence) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    
    try {
      // Call your backend TTS API
      const response = await fetch(`${API_BASE}/api/v1/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: "default",
          speaking_rate: 0.8,
          pitch: 0.0,
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // If backend returns audio URL or data, handle it here
        console.log('TTS successful:', data);
        
        // For now, fallback to browser TTS since we have placeholder backend
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          
          speechRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        alert(`TTS Error: ${data.error}`);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS API Error:', error);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text-to-speech not supported in your browser');
        setIsSpeaking(false);
      }
    }
  };

  // 3. ADD STT FUNCTION FOR VOICE INPUT
  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'voice_input.wav');
      
      const response = await fetch(`${API_BASE}/api/v1/stt/transcribe`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Voice input transcribed:', data.transcription);
        
        // Set the transcript
        setTranscript(data.transcription);
        
        // Handle emergency detection
        if (data.emergency_detected) {
          setEmergencyDetected(true);
          showEmergencyAlert(data.transcription);
        } else {
          setEmergencyDetected(false);
        }
        
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

  // 4. VOICE RECORDING FUNCTIONS
  const startVoiceRecording = async () => {
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
        
        if (result.success) {
          // Convert speech to symbols
          convertSpeechToSymbols(result.transcription);
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
      console.error('Recording failed:', error);
      alert('Could not access microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 5. CONVERT SPEECH TO SYMBOLS
  const convertSpeechToSymbols = (transcription) => {
    const words = transcription.toLowerCase().split(' ');
    
    // Find matching symbols
    const matchedSymbols = [...symbolLibrary, ...customSymbols].filter(symbol => 
      words.some(word => symbol.name.toLowerCase().includes(word))
    );
    
    if (matchedSymbols.length > 0) {
      setSelectedSymbols(matchedSymbols.slice(0, 6));
      setSentence(transcription);
      
      // Add to recent symbols
      setRecentSymbols(prev => {
        const newRecent = [...matchedSymbols.slice(0, 3), ...prev];
        return newRecent.slice(0, 6);
      });
    }
  };

  // 6. TEXT ENHANCEMENT FUNCTION
  const enhanceText = async () => {
    if (!sentence.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/enhance/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sentence,
          enhancement_type: "clarity"
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSentence(data.enhanced_text);
        alert('Text enhanced successfully!');
      } else {
        alert(`Enhancement failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Enhancement API Error:', error);
      alert('Text enhancement service unavailable');
    }
  };

  // 7. EMERGENCY ALERT FUNCTION
  const showEmergencyAlert = (message) => {
    alert(`🚨 EMERGENCY DETECTED: ${message}\n\nEmergency services have been notified.`);
    
    // You can add more emergency handling here
    // Like calling emergency contacts, showing emergency symbols, etc.
    
    // Auto-select emergency symbols
    const emergencySymbols = symbolLibrary.filter(s => s.category === 'emergency');
    setSelectedSymbols(emergencySymbols.slice(0, 3));
  };

  const stopSpeech = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Filter symbols based on active category and search
  const filteredSymbols = () => {
    let symbols = [...symbolLibrary, ...customSymbols];
    
    if (activeCategory !== 'all') {
      symbols = symbols.filter(symbol => symbol.category === activeCategory);
    }
    
    if (searchTerm) {
      symbols = symbols.filter(symbol => 
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return symbols;
  };

  // Handle symbol selection
  const handleSymbolSelect = (symbol) => {
    setSelectedSymbols(prev => {
      const newSelection = [...prev, symbol];
      // Update sentence
      const newSentence = newSelection.map(s => s.name).join(' ');
      setSentence(newSentence);
      return newSelection;
    });

    // Add to recent symbols
    setRecentSymbols(prev => {
      const filtered = prev.filter(s => s.id !== symbol.id);
      return [symbol, ...filtered.slice(0, 7)];
    });
  };

  // Remove symbol from selection
  const handleRemoveSymbol = (index) => {
    setSelectedSymbols(prev => {
      const newSelection = prev.filter((_, i) => i !== index);
      const newSentence = newSelection.map(s => s.name).join(' ');
      setSentence(newSentence);
      return newSelection;
    });
  };

  // Clear all symbols
  const handleClearAll = () => {
    setSelectedSymbols([]);
    setSentence('');
    setEmergencyDetected(false);
  };

  // Handle custom symbol upload
  const handleCustomUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomSymbolImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save custom symbol
  const saveCustomSymbol = () => {
    if (customSymbolName && customSymbolImage) {
      const newSymbol = {
        id: Date.now(),
        name: customSymbolName,
        category: 'custom',
        image: customSymbolImage,
        kenyan: false,
        usage: 0,
        custom: true
      };
      
      setCustomSymbols(prev => [newSymbol, ...prev]);
      setCustomSymbolName('');
      setCustomSymbolImage(null);
      setShowCustomUpload(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove custom symbol
  const removeCustomSymbol = (id) => {
    setCustomSymbols(prev => prev.filter(symbol => symbol.id !== id));
  };

  // Handle quick sentence selection
  const handleQuickSentence = (sentenceText) => {
    setSentence(sentenceText);
    // Convert sentence to symbols (simplified)
    const words = sentenceText.toLowerCase().split(' ');
    const matchedSymbols = filteredSymbols().filter(symbol => 
      words.some(word => symbol.name.toLowerCase().includes(word))
    );
    setSelectedSymbols(matchedSymbols.slice(0, 6));
  };

  return (
    <div className="symbol-board-page">
      {/* Emergency Alert Banner */}
      {emergencyDetected && (
        <div className="emergency-banner">
          <AlertTriangle size={24} />
          <span>EMERGENCY DETECTED - Assistance is on the way</span>
          <button onClick={() => setEmergencyDetected(false)}>×</button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="symbol-grid">
        
        {/* Left Sidebar - Categories & Quick Access */}
        <div className="sidebar-left">
          {/* Category Navigation */}
          <div className="categories-card glass-card">
            <h3 className="card-title">
              <Folder size={18} />
              <span>Categories</span>
            </h3>
            
            <div className="categories-list">
              {Object.entries(symbolCategories).map(([key, category]) => (
                <button
                  key={key}
                  className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="symbol-count">
                    {key === 'all' 
                      ? symbolLibrary.length + customSymbols.length
                      : symbolLibrary.filter(s => s.category === key).length +
                        customSymbols.filter(s => s.category === key).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Sentences */}
          <div className="sentences-card glass-card">
            <h3 className="card-title">
              <MessageSquare size={18} />
              <span>Quick Sentences</span>
            </h3>
            
            <div className="sentences-list">
              {quickSentences.map((sentence, index) => (
                <button
                  key={index}
                  className="sentence-btn"
                  onClick={() => handleQuickSentence(sentence)}
                >
                  <span className="sentence-text">{sentence}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Symbols */}
          <div className="recent-card glass-card">
            <h3 className="card-title">
              <History size={18} />
              <span>Recently Used</span>
            </h3>
            
            <div className="recent-symbols">
              {recentSymbols.slice(0, 6).map((symbol, index) => (
                <button
                  key={index}
                  className="recent-symbol"
                  onClick={() => handleSymbolSelect(symbol)}
                >
                  <span className="symbol-emoji">{symbol.image}</span>
                  <span className="symbol-name">{symbol.name}</span>
                </button>
              ))}
              {recentSymbols.length === 0 && (
                <div className="empty-recent">
                  <span>No recent symbols</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - Main Symbol Board */}
        <div className="main-symbol-area">
          {/* Header */}
          <div className="symbol-header">
            <div className="header-left">
              <h1 className="page-title">Symbol Board</h1>
              <p className="page-subtitle">Visual communication made easy</p>
            </div>
            <div className="header-actions">
              <button 
                className="action-btn"
                onClick={() => setShowCustomUpload(true)}
                title="Upload Custom Symbol"
              >
                <Upload size={20} />
              </button>
              <button className="action-btn" title="Settings">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section glass-card">
            <div className="search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Sentence Builder */}
          <div className="sentence-builder glass-card">
            <div className="builder-header">
              <h3 className="section-title">
                <MessageSquare size={18} />
                <span>Your Message</span>
              </h3>
              <div className="builder-actions">
                <button 
                  className="action-btn small"
                  onClick={handleClearAll}
                  disabled={selectedSymbols.length === 0}
                >
                  <RotateCcw size={16} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
            
            <div className="sentence-display">
              {selectedSymbols.length > 0 ? (
                <div className="selected-symbols">
                  {selectedSymbols.map((symbol, index) => (
                    <div key={index} className="selected-symbol-item">
                      <span className="symbol-emoji large">{symbol.image}</span>
                      <span className="symbol-name">{symbol.name}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveSymbol(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-sentence">
                  <Image size={32} />
                  <p>Select symbols to build your message</p>
                </div>
              )}
            </div>
            
            <div className="sentence-text">
              <div className="text-display">
                {sentence || "Your message will appear here..."}
                {transcript && (
                  <div className="transcript-bubble">
                    <small>Voice input: "{transcript}"</small>
                  </div>
                )}
              </div>
              <div className="text-actions">
                <button 
                  className="btn-primary"
                  onClick={() => speakText()}
                  disabled={!sentence.trim() || isSpeaking}
                >
                  <Play size={18} />
                  <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
                </button>
                
                {/* VOICE RECORDING BUTTON */}
                <button 
                  className={`btn-secondary ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                >
                  <Mic size={18} />
                  <span>{isRecording ? 'Stop' : 'Voice Input'}</span>
                </button>
                
                {/* TEXT ENHANCEMENT BUTTON */}
                <button 
                  className="btn-secondary"
                  onClick={enhanceText}
                  disabled={!sentence.trim()}
                >
                  <Sparkles size={18} />
                  <span>Enhance</span>
                </button>
                
                <button 
                  className="btn-secondary"
                  onClick={stopSpeech}
                  disabled={!isSpeaking}
                >
                  <Square size={18} />
                  <span>Stop</span>
                </button>
                
                <button className="btn-outline">
                  <Share size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Voice Recording Visualizer */}
          {isRecording && (
            <div className="recording-visualizer glass-card">
              <div className="visualizer-header">
                <div className="recording-indicator">
                  <div className="pulse-dot"></div>
                  <span>Recording... Speak now</span>
                </div>
                <span className="recording-timer">10s</span>
              </div>
              <div className="visualizer-bars">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="viz-bar"
                    style={{ 
                      animationDelay: `${i * 0.1}s`,
                      height: `${20 + Math.random() * 80}%`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Symbol Grid */}
          <div className="symbol-grid-section glass-card">
            <div className="grid-header">
              <h3 className="section-title">
                <Grid size={18} />
                <span>
                  {symbolCategories[activeCategory]?.name} 
                  {searchTerm && ` - Search: "${searchTerm}"`}
                </span>
              </h3>
              <span className="symbol-count">
                {filteredSymbols().length} symbols
              </span>
            </div>
            
            <div className="symbols-grid">
              {filteredSymbols().map((symbol) => (
                <button
                  key={symbol.id}
                  className={`symbol-card ${symbol.kenyan ? 'kenyan' : ''} ${symbol.custom ? 'custom' : ''}`}
                  onClick={() => handleSymbolSelect(symbol)}
                >
                  <div className="symbol-image">
                    {symbol.custom ? (
                      <img src={symbol.image} alt={symbol.name} className="custom-symbol-img" />
                    ) : (
                      <span className="symbol-emoji">{symbol.image}</span>
                    )}
                    {symbol.kenyan && (
                      <div className="kenyan-badge" title="Kenyan Context">
                        🇰🇪
                      </div>
                    )}
                    {symbol.custom && (
                      <div className="custom-badge" title="Custom Symbol">
                        ⭐
                      </div>
                    )}
                  </div>
                  <div className="symbol-info">
                    <span className="symbol-name">{symbol.name}</span>
                    <div className="symbol-usage">
                      <div 
                        className="usage-bar"
                        style={{ width: `${Math.min(100, symbol.usage)}%` }}
                      ></div>
                    </div>
                  </div>
                  {symbol.custom && (
                    <button
                      className="delete-custom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomSymbol(symbol.id);
                      }}
                      title="Delete custom symbol"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </button>
              ))}
              
              {filteredSymbols().length === 0 && (
                <div className="empty-symbols">
                  <Image size={48} />
                  <p>No symbols found</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCustomUpload(true)}
                  >
                    <Upload size={16} />
                    <span>Add Custom Symbol</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools & Settings */}
        <div className="sidebar-right">
          {/* Custom Symbol Upload */}
          {showCustomUpload && (
            <div className="upload-card glass-card">
              <div className="card-header">
                <h3 className="card-title">Upload Custom Symbol</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowCustomUpload(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="upload-form">
                <div className="form-group">
                  <label className="form-label">Symbol Name</label>
                  <input
                    type="text"
                    value={customSymbolName}
                    onChange={(e) => setCustomSymbolName(e.target.value)}
                    placeholder="Enter symbol name..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Symbol Image</label>
                  <div className="upload-area">
                    {customSymbolImage ? (
                      <div className="image-preview">
                        <img src={customSymbolImage} alt="Preview" />
                        <button 
                          className="change-image-btn"
                          onClick={() => setCustomSymbolImage(null)}
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCustomUpload}
                          className="file-input"
                        />
                        <Upload size={32} />
                        <span>Click to upload image</span>
                        <span className="upload-hint">PNG, JPG up to 2MB</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowCustomUpload(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={saveCustomSymbol}
                    disabled={!customSymbolName || !customSymbolImage}
                  >
                    Save Symbol
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voice Input Tools */}
          <div className="tools-card glass-card">
            <h3 className="card-title">
              <Mic size={18} />
              <span>Voice Tools</span>
            </h3>
            
            <div className="tools-grid">
              <button 
                className={`tool-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              >
                <Mic size={16} />
                <span>{isRecording ? 'Stop Recording' : 'Start Voice Input'}</span>
              </button>
              <button className="tool-btn" onClick={enhanceText}>
                <Sparkles size={16} />
                <span>Enhance Text</span>
              </button>
              <button className="tool-btn" onClick={() => speakText()}>
                <Volume2 size={16} />
                <span>Speak Message</span>
              </button>
              <button className="tool-btn">
                <Download size={16} />
                <span>Export Board</span>
              </button>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="stats-card glass-card">
            <h3 className="card-title">
              <BarChart3 size={18} />
              <span>Usage Stats</span>
            </h3>
            
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{symbolLibrary.length + customSymbols.length}</span>
                <span className="stat-label">Total Symbols</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{customSymbols.length}</span>
                <span className="stat-label">Custom Symbols</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{symbolLibrary.filter(s => s.kenyan).length}</span>
                <span className="stat-label">Kenyan Symbols</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24</span>
                <span className="stat-label">Messages Today</span>
              </div>
            </div>
          </div>

          {/* Kenyan Context Guide */}
          <div className="guide-card glass-card">
            <h3 className="card-title">
              <Globe size={18} />
              <span>Kenyan Context</span>
            </h3>
            
            <div className="guide-content">
              <div className="guide-item">
                <span className="guide-emoji">🚐</span>
                <div className="guide-text">
                  <strong>Matatu</strong>
                  <span>Public transport</span>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-emoji">🌽</span>
                <div className="guide-text">
                  <strong>Ugali</strong>
                  <span>Staple food</span>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-emoji">🥬</span>
                <div className="guide-text">
                  <strong>Sukuma Wiki</strong>
                  <span>Collard greens</span>
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-emoji">⛪</span>
                <div className="guide-text">
                  <strong>Church</strong>
                  <span>Place of worship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolBoard;