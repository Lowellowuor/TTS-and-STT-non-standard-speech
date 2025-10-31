import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Zap, TrendingUp, Star, Settings,
  Play, Square, Download, Upload, History, Shield,
  MessageSquare, Type, ThumbsUp, ThumbsDown, RotateCcw,
  Share, Sparkles, Target, BarChart3, Lightbulb, Users,
  Award, Clock, Heart, Globe, Battery, Wifi, User,
  ChevronDown, Search, Filter, Plus, Trash2, Edit3,
  Volume2, Mic, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';

const SmartPredictor = () => {
  // State management
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [recentPhrases, setRecentPhrases] = useState([]);
  const [customPhrases, setCustomPhrases] = useState([]);
  const [emergencyPhrases, setEmergencyPhrases] = useState([]);
  const [activeTab, setActiveTab] = useState('predictions');
  const [learningLevel, setLearningLevel] = useState(75);
  const [accuracy, setAccuracy] = useState(88);
  const [usageStats, setUsageStats] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newCustomPhrase, setNewCustomPhrase] = useState('');

  // Refs
  const textareaRef = useRef(null);
  const speechRef = useRef(null);

  // Prediction models based on context
  const predictionModels = {
    general: {
      'I': ['need', 'want', 'am', 'have', 'would like'],
      'I need': ['help', 'water', 'food', 'medicine', 'assistance', 'to rest'],
      'I want': ['to eat', 'to drink', 'to sleep', 'to go home', 'help'],
      'I am': ['hungry', 'thirsty', 'tired', 'in pain', 'sick', 'happy'],
      'Can you': ['help me', 'get me', 'show me', 'tell me', 'explain'],
      'Where is': ['the bathroom', 'water', 'food', 'help', 'the doctor'],
      'How': ['are you', 'do I', 'can I', 'much is', 'long will']
    },
    medical: {
      'I have': ['pain', 'headache', 'fever', 'nausea', 'dizziness'],
      'My': ['head hurts', 'stomach hurts', 'back hurts', 'arm hurts', 'leg hurts'],
      'I feel': ['sick', 'dizzy', 'tired', 'weak', 'better', 'worse'],
      'I need': ['medicine', 'a doctor', 'to lie down', 'help', 'water']
    },
    social: {
      'Hello': ['how are you?', 'nice to meet you', 'good morning', 'good afternoon'],
      'How are': ['you?', 'you doing?', 'you feeling?'],
      'Thank you': ['so much', 'for your help', 'very much', 'for everything'],
      'Goodbye': ['see you later', 'take care', 'have a good day', 'until next time']
    }
  };

  // Emergency phrases
  const defaultEmergencyPhrases = [
    { id: 1, text: 'I need emergency help', category: 'emergency', priority: 'high' },
    { id: 2, text: 'Call ambulance please', category: 'emergency', priority: 'high' },
    { id: 3, text: 'I am in danger', category: 'emergency', priority: 'high' },
    { id: 4, text: 'Help me quickly', category: 'emergency', priority: 'medium' },
    { id: 5, text: 'I feel very sick', category: 'medical', priority: 'medium' }
  ];

  // Usage patterns data
  const usagePatterns = {
    mostUsed: [
      { phrase: 'I need help', count: 45, trend: 'up' },
      { phrase: 'Thank you', count: 38, trend: 'stable' },
      { phrase: 'I am hungry', count: 32, trend: 'up' },
      { phrase: 'Where is bathroom', count: 28, trend: 'stable' },
      { phrase: 'Hello', count: 25, trend: 'down' }
    ],
    timeBased: {
      morning: ['Good morning', 'I am hungry', 'I need coffee'],
      afternoon: ['I need lunch', 'I am tired', 'How are you?'],
      evening: ['Good evening', 'I am sleepy', 'I want dinner']
    },
    contextBased: {
      medical: ['I have pain', 'I need medicine', 'I feel sick'],
      social: ['Hello', 'How are you?', 'Thank you'],
      needs: ['I am hungry', 'I am thirsty', 'I need restroom']
    }
  };

  // Initialize data
  useEffect(() => {
    setEmergencyPhrases(defaultEmergencyPhrases);
    setRecentPhrases([
      { text: 'I need help with this', timestamp: new Date(), used: true },
      { text: 'Thank you very much', timestamp: new Date(), used: true },
      { text: 'Where is the bathroom', timestamp: new Date(), used: false },
      { text: 'I am feeling hungry', timestamp: new Date(), used: true }
    ]);
    setCustomPhrases([
      { id: 1, text: 'My favorite drink is water', category: 'personal', usage: 12 },
      { id: 2, text: 'I prefer to sit near the window', category: 'preference', usage: 8 },
      { id: 3, text: 'I need my medication at 2 PM', category: 'medical', usage: 15 }
    ]);
    
    // Simulate usage stats
    setUsageStats({
      totalPredictions: 1247,
      accuracyRate: '88%',
      learningProgress: '75%',
      favoritePhrases: 12,
      timeSaved: '3.2h'
    });
  }, []);

  // Generate predictions based on input
  const generatePredictions = (text) => {
    if (!text.trim()) {
      setPredictions([]);
      return;
    }

    const words = text.toLowerCase().split(' ');
    const lastWords = words.slice(-2).join(' ');
    
    let newPredictions = [];
    
    // Check all prediction models
    Object.values(predictionModels).forEach(model => {
      Object.keys(model).forEach(key => {
        if (lastWords.toLowerCase().startsWith(key.toLowerCase())) {
          newPredictions = [...newPredictions, ...model[key]];
        }
      });
    });

    // Add custom phrases that match
    customPhrases.forEach(phrase => {
      if (phrase.text.toLowerCase().includes(text.toLowerCase())) {
        newPredictions.push(phrase.text);
      }
    });

    // Add emergency phrases if input suggests urgency
    if (text.toLowerCase().includes('help') || text.toLowerCase().includes('emergency')) {
      emergencyPhrases.forEach(phrase => {
        newPredictions.push(phrase.text);
      });
    }

    // Remove duplicates and limit to 6 predictions
    setPredictions([...new Set(newPredictions)].slice(0, 6));
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    generatePredictions(text);
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    const words = inputText.split(' ');
    const baseText = words.slice(0, -2).join(' ');
    const newText = baseText ? `${baseText} ${prediction}` : prediction;
    
    setInputText(newText);
    setPredictions([]);
    
    // Add to recent phrases
    if (!recentPhrases.find(phrase => phrase.text === newText)) {
      setRecentPhrases(prev => [
        { text: newText, timestamp: new Date(), used: true },
        ...prev.slice(0, 9)
      ]);
    }
  };

  // Text-to-Speech
  const speakText = (text) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    
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
  };

  const stopSpeech = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Add custom phrase
  const addCustomPhrase = () => {
    if (newCustomPhrase.trim()) {
      const newPhrase = {
        id: Date.now(),
        text: newCustomPhrase,
        category: 'custom',
        usage: 0
      };
      setCustomPhrases(prev => [newPhrase, ...prev]);
      setNewCustomPhrase('');
    }
  };

  // Remove custom phrase
  const removeCustomPhrase = (id) => {
    setCustomPhrases(prev => prev.filter(phrase => phrase.id !== id));
  };

  // Update learning level (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setLearningLevel(prev => Math.min(100, prev + 0.1));
      setAccuracy(prev => Math.min(95, prev + 0.05));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Get prediction confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'var(--accent-success)';
    if (confidence >= 60) return 'var(--accent-warning)';
    return 'var(--accent-error)';
  };

  return (
    <div className="smart-predictor-page">
      {/* Main Layout Grid */}
      <div className="predictor-grid">
        
        {/* Left Sidebar - Controls & Analytics */}
        <div className="sidebar-left">
          {/* AI Learning Status */}
          <div className="learning-card glass-card">
            <div className="card-header">
              <h3 className="card-title">
                <Brain size={18} />
                <span>AI Learning Status</span>
              </h3>
              <Zap size={16} className="text-accent" />
            </div>
            
            <div className="learning-metrics">
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Learning Level</span>
                  <span className="metric-value">{Math.floor(learningLevel)}%</span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill learning"
                    style={{ width: `${learningLevel}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Prediction Accuracy</span>
                  <span className="metric-value">{accuracy}%</span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill accuracy"
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="learning-insights">
              <div className="insight-item">
                <Lightbulb size={14} />
                <span>Learning from your patterns...</span>
              </div>
              <div className="insight-item">
                <TrendingUp size={14} />
                <span>+12 new phrases learned this week</span>
              </div>
            </div>
          </div>

          {/* Quick Access Phrases */}
          <div className="quick-access-card glass-card">
            <h3 className="card-title">
              <Sparkles size={18} />
              <span>Quick Access</span>
            </h3>
            
            <div className="quick-phrases">
              {emergencyPhrases.slice(0, 4).map(phrase => (
                <button
                  key={phrase.id}
                  className={`quick-phrase ${phrase.priority}`}
                  onClick={() => {
                    setInputText(phrase.text);
                    generatePredictions(phrase.text);
                  }}
                >
                  <span className="phrase-icon">🚨</span>
                  <span className="phrase-text">{phrase.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Usage Patterns */}
          <div className="patterns-card glass-card">
            <h3 className="card-title">
              <BarChart3 size={18} />
              <span>Your Patterns</span>
            </h3>
            
            <div className="pattern-list">
              {usagePatterns.mostUsed.slice(0, 4).map((item, index) => (
                <div key={index} className="pattern-item">
                  <div className="pattern-info">
                    <span className="pattern-phrase">{item.phrase}</span>
                    <span className="pattern-count">{item.count} uses</span>
                  </div>
                  <div className={`pattern-trend ${item.trend}`}>
                    {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Main Prediction Area */}
        <div className="main-predictor-area">
          {/* Header */}
          <div className="predictor-header">
            <div className="header-left">
              <h1 className="page-title">Smart Predictor</h1>
              <p className="page-subtitle">AI-powered communication assistance</p>
            </div>
            <div className="header-actions">
              <button 
                className={`action-btn ${showAnalytics ? 'active' : ''}`}
                onClick={() => setShowAnalytics(!showAnalytics)}
                title="Analytics"
              >
                <BarChart3 size={20} />
              </button>
              <button className="action-btn" title="Settings">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Prediction Input Area */}
          <div className="prediction-section glass-card">
            <div className="section-header">
              <h3 className="section-title">
                <Brain size={18} />
                <span>Smart Input</span>
              </h3>
              <div className="prediction-stats">
                <span>{predictions.length} predictions</span>
                <span>{usageStats.totalPredictions} total</span>
              </div>
            </div>
            
            <div className="input-container">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Start typing... I'll predict what you want to say next"
                className="prediction-textarea"
                rows="3"
              />
              
              {/* Predictions Grid */}
              {predictions.length > 0 && (
                <div className="predictions-grid">
                  {predictions.map((prediction, index) => (
                    <button
                      key={index}
                      className="prediction-card"
                      onClick={() => handlePredictionSelect(prediction)}
                    >
                      <div className="prediction-content">
                        <span className="prediction-text">{prediction}</span>
                        <div className="prediction-confidence">
                          <div 
                            className="confidence-dot"
                            style={{ 
                              backgroundColor: getConfidenceColor(85 - index * 10)
                            }}
                          ></div>
                          <span>{85 - index * 10}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="prediction-actions">
              <button 
                className="btn-primary"
                onClick={() => speakText(inputText)}
                disabled={!inputText.trim() || isSpeaking}
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
              
              <button 
                className="btn-secondary"
                onClick={() => {
                  setInputText('');
                  setPredictions([]);
                }}
              >
                <RotateCcw size={18} />
                <span>Clear</span>
              </button>
              
              <button className="btn-outline">
                <Share size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {showAnalytics && (
            <div className="analytics-dashboard glass-card">
              <h3 className="section-title">
                <TrendingUp size={18} />
                <span>Usage Analytics</span>
              </h3>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <Brain size={24} />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-value">{usageStats.totalPredictions}</span>
                    <span className="analytics-label">Total Predictions</span>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <Target size={24} />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-value">{usageStats.accuracyRate}</span>
                    <span className="analytics-label">Accuracy Rate</span>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <Clock size={24} />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-value">{usageStats.timeSaved}</span>
                    <span className="analytics-label">Time Saved</span>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <Star size={24} />
                  </div>
                  <div className="analytics-content">
                    <span className="analytics-value">{usageStats.favoritePhrases}</span>
                    <span className="analytics-label">Favorite Phrases</span>
                  </div>
                </div>
              </div>
              
              <div className="pattern-breakdown">
                <h4>Pattern Analysis</h4>
                <div className="pattern-categories">
                  <div className="pattern-category">
                    <span className="category-name">Medical</span>
                    <div className="category-bar">
                      <div className="category-fill medical" style={{ width: '65%' }}></div>
                    </div>
                    <span className="category-percent">65%</span>
                  </div>
                  <div className="pattern-category">
                    <span className="category-name">Social</span>
                    <div className="category-bar">
                      <div className="category-fill social" style={{ width: '45%' }}></div>
                    </div>
                    <span className="category-percent">45%</span>
                  </div>
                  <div className="pattern-category">
                    <span className="category-name">Needs</span>
                    <div className="category-bar">
                      <div className="category-fill needs" style={{ width: '35%' }}></div>
                    </div>
                    <span className="category-percent">35%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="recent-activity glass-card">
            <h3 className="section-title">
              <History size={18} />
              <span>Recent Activity</span>
            </h3>
            
            <div className="activity-list">
              {recentPhrases.map((phrase, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-content">
                    <span className="activity-text">{phrase.text}</span>
                    <span className="activity-time">
                      {new Date(phrase.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="activity-actions">
                    <button
                      className="activity-btn"
                      onClick={() => {
                        setInputText(phrase.text);
                        generatePredictions(phrase.text);
                      }}
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button
                      className="activity-btn"
                      onClick={() => speakText(phrase.text)}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Customization & Management */}
        <div className="sidebar-right">
          {/* Navigation Tabs */}
          <div className="tabs-card glass-card">
            <div className="tabs-navigation">
              <button
                className={`tab-btn ${activeTab === 'predictions' ? 'active' : ''}`}
                onClick={() => setActiveTab('predictions')}
              >
                <Brain size={16} />
                <span>Predictions</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
                onClick={() => setActiveTab('custom')}
              >
                <Edit3 size={16} />
                <span>Custom</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'emergency' ? 'active' : ''}`}
                onClick={() => setActiveTab('emergency')}
              >
                <Shield size={16} />
                <span>Emergency</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Predictions Settings */}
            {activeTab === 'predictions' && (
              <div className="settings-card glass-card">
                <h3 className="card-title">Prediction Settings</h3>
                
                <div className="setting-options">
                  <div className="setting-item">
                    <label className="setting-label">Prediction Speed</label>
                    <select className="setting-select">
                      <option>Fast (Real-time)</option>
                      <option>Balanced</option>
                      <option>Accurate (Slower)</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <label className="setting-label">Context Awareness</label>
                    <div className="setting-toggle">
                      <span>High</span>
                      <div className="toggle-switch active"></div>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <label className="setting-label">Learning Mode</label>
                    <div className="setting-toggle">
                      <span>Active</span>
                      <div className="toggle-switch active"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Phrases */}
            {activeTab === 'custom' && (
              <div className="custom-phrases-card glass-card">
                <div className="card-header">
                  <h3 className="card-title">Custom Phrases</h3>
                  <button className="icon-btn" title="Add new phrase">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="add-phrase-form">
                  <input
                    type="text"
                    value={newCustomPhrase}
                    onChange={(e) => setNewCustomPhrase(e.target.value)}
                    placeholder="Add a new custom phrase..."
                    className="phrase-input"
                  />
                  <button 
                    className="btn-primary add-btn"
                    onClick={addCustomPhrase}
                    disabled={!newCustomPhrase.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="custom-phrases-list">
                  {customPhrases.map(phrase => (
                    <div key={phrase.id} className="custom-phrase-item">
                      <div className="phrase-content">
                        <span className="phrase-text">{phrase.text}</span>
                        <span className="phrase-usage">{phrase.usage} uses</span>
                      </div>
                      <div className="phrase-actions">
                        <button 
                          className="phrase-btn edit"
                          title="Edit phrase"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="phrase-btn delete"
                          onClick={() => removeCustomPhrase(phrase.id)}
                          title="Delete phrase"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Phrases */}
            {activeTab === 'emergency' && (
              <div className="emergency-phrases-card glass-card">
                <h3 className="card-title">Emergency Phrases</h3>
                
                <div className="emergency-phrases-list">
                  {emergencyPhrases.map(phrase => (
                    <div key={phrase.id} className="emergency-phrase-item">
                      <div className="emergency-indicator"></div>
                      <div className="phrase-content">
                        <span className="phrase-text">{phrase.text}</span>
                        <span className="phrase-category">{phrase.category}</span>
                      </div>
                      <div className="phrase-actions">
                        <button 
                          className="phrase-btn speak"
                          onClick={() => speakText(phrase.text)}
                          title="Speak phrase"
                        >
                          <Volume2 size={14} />
                        </button>
                        <button 
                          className="phrase-btn use"
                          onClick={() => {
                            setInputText(phrase.text);
                            generatePredictions(phrase.text);
                          }}
                          title="Use phrase"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="emergency-actions">
                  <button className="btn-primary emergency-btn">
                    <Shield size={16} />
                    <span>Emergency Mode</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Learning Insights */}
          <div className="insights-card glass-card">
            <h3 className="card-title">
              <Lightbulb size={18} />
              <span>Learning Insights</span>
            </h3>
            
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon">📈</div>
                <div className="insight-content">
                  <span className="insight-title">Pattern Detected</span>
                  <span className="insight-desc">You often ask for help around 2 PM</span>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">🕒</div>
                <div className="insight-content">
                  <span className="insight-title">Time Analysis</span>
                  <span className="insight-desc">Most active during morning hours</span>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">💡</div>
                <div className="insight-content">
                  <span className="insight-title">Suggestion</span>
                  <span className="insight-desc">Try using more descriptive phrases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPredictor;