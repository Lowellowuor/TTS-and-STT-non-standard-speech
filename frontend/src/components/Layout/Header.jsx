import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Volume2, Zap, Brain, 
  Grid3X3, Shield, ChevronDown, Wifi, 
  Battery, Clock, User, Settings, 
  Bell, Mic, Play, Square, Pause,
  CheckCircle, AlertTriangle
} from 'lucide-react';
import ThemeToggle from "../Layout/ThemeToggle";

const Header = ({ activeSolution, setActiveSolution, systemStatus, currentLanguage, setCurrentLanguage }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [speechConfidence, setSpeechConfidence] = useState(85);
  const [activeInputMode, setActiveInputMode] = useState('enhanced-stt');
  const [sttStatus, setSttStatus] = useState('ready');
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [ttsProgress, setTtsProgress] = useState(0);

  // Professional solutions with Lucide icons
  const coreSolutions = [
    { 
      id: 'daily', 
      name: 'Daily Communicator', 
      icon: <MessageSquare size={20} />,
      description: 'Main communication interface'
    },
    { 
      id: 'symbols', 
      name: 'Symbol Board', 
      icon: <Grid3X3 size={20} />,
      description: 'Visual communication'
    },
    { 
      id: 'emergency', 
      name: 'Emergency', 
      icon: <Shield size={20} />,
      description: 'Quick help access'
    }
  ];

  const additionalSolutions = [
    { 
      id: 'personalizer', 
      name: 'Voice Personalizer', 
      icon: <Volume2 size={20} />,
      description: 'Customize your voice'
    },
    { 
      id: 'amplifier', 
      name: 'Content Amplifier', 
      icon: <Zap size={20} />,
      description: 'Enhance your messages'
    },
    { 
      id: 'predictor', 
      name: 'Smart Predictor', 
      icon: <Brain size={20} />,
      description: 'AI-powered suggestions'
    }
  ];

  const allSolutions = [...coreSolutions, ...additionalSolutions];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate STT status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setSttStatus(prev => {
        const transitions = {
          'ready': 'listening', 
          'listening': 'success', 
          'success': 'ready', 
          'error': 'ready'
        };
        return transitions[prev] || 'ready';
      });
    }, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  // Simulate TTS playback for demo
  useEffect(() => {
    let interval;
    if (isTTSPlaying) {
      interval = setInterval(() => {
        setTtsProgress(prev => {
          if (prev >= 100) {
            setIsTTSPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTTSPlaying]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowNavMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const triggerEmergency = () => {
    setEmergencyMode(true);
    setTimeout(() => setEmergencyMode(false), 10000);
  };

  const toggleTTS = () => {
    setIsTTSPlaying(!isTTSPlaying);
    if (!isTTSPlaying) setTtsProgress(0);
  };

  const stopTTS = () => {
    setIsTTSPlaying(false);
    setTtsProgress(0);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'confidence-excellent';
    if (confidence >= 70) return 'confidence-good';
    return 'confidence-poor';
  };

  const getSTTStatusDisplay = () => {
    const statusConfig = {
      'listening': { 
        icon: <div className="pulse-animation"><Mic size={16} /></div>, 
        text: 'Listening...', 
        color: 'status-listening'
      },
      'success': { 
        icon: <CheckCircle size={16} />, 
        text: 'Understood', 
        color: 'status-success'
      },
      'error': { 
        icon: <AlertTriangle size={16} />, 
        text: 'Try Again', 
        color: 'status-error'
      },
      'ready': { 
        icon: <Mic size={16} />, 
        text: 'Ready', 
        color: 'status-ready'
      }
    };

    const config = statusConfig[sttStatus] || statusConfig.ready;
    
    return (
      <div className={`stt-status ${config.color}`}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    );
  };

  // Prevent dropdown close when clicking inside
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <header className={`professional-header ${emergencyMode ? 'emergency-active' : ''}`}>
      
      {/* Primary Navigation Bar */}
      <div className="primary-nav">
        
        {/* Brand Section */}
        <div className="brand-section">
          <div className="logo">
            <MessageSquare size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">VoiceForge</h1>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="main-navigation">
          {coreSolutions.map((solution) => (
            <button
              key={solution.id}
              onClick={() => setActiveSolution(solution.id)}
              className={`nav-item ${activeSolution === solution.id ? 'active' : ''}`}
              title={solution.name}
            >
              {solution.icon}
              <span className="nav-text">{solution.name}</span>
            </button>
          ))}
          
          {/* More Solutions Dropdown */}
          <div className="nav-dropdown">
            <button 
              className={`nav-item dropdown-toggle ${showNavMenu ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNavMenu(!showNavMenu);
              }}
            >
              <ChevronDown size={20} />
              <span className="nav-text">More</span>
            </button>
            
            {showNavMenu && (
              <div className="dropdown-menu" onClick={handleDropdownClick}>
                {additionalSolutions.map((solution) => (
                  <button
                    key={solution.id}
                    onClick={() => {
                      setActiveSolution(solution.id);
                      setShowNavMenu(false);
                    }}
                    className={`dropdown-item ${activeSolution === solution.id ? 'active' : ''}`}
                  >
                    {solution.icon}
                    <div className="dropdown-item-text">
                      <span className="dropdown-item-name">{solution.name}</span>
                      <span className="dropdown-item-desc">{solution.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Control Section */}
        <div className="control-section">
          
          {/* Status Indicators */}
          <div className="status-indicators">
            <div className="confidence-indicator">
              <div className={`confidence-dot ${getConfidenceColor(speechConfidence)}`}></div>
            </div>
            
            <div className="stt-indicator">
              {getSTTStatusDisplay()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <ThemeToggle />
            
            <button className="action-btn" title="Notifications">
              <Bell size={18} />
            </button>
            
            <button 
              className="action-btn emergency"
              onClick={triggerEmergency}
              title="Emergency Assistance"
            >
              <Shield size={18} />
            </button>
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <button 
              className="profile-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
            >
              <div className="avatar">
                <User size={18} />
              </div>
              <ChevronDown size={14} />
            </button>

            {showUserMenu && (
              <div className="profile-menu" onClick={handleDropdownClick}>
                <div className="menu-section">
                  <button className="menu-item">
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="menu-item">
                    <Settings size={16} />
                    <span>Preferences</span>
                  </button>
                </div>
                <div className="menu-section">
                  <button className="menu-item">
                    <span>Language: {currentLanguage}</span>
                  </button>
                  <button className="menu-item">
                    <span>Battery: {systemStatus?.battery || 85}%</span>
                  </button>
                </div>
                <div className="menu-section">
                  <button className="menu-item sign-out">
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TTS Playback Bar */}
      {isTTSPlaying && (
        <div className="tts-playback-bar">
          <button className="tts-control" onClick={toggleTTS}>
            {isTTSPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <div className="tts-text-scroll">
            <span>Hello, this is a demonstration of the text-to-speech playback functionality.</span>
          </div>
          
          <div className="tts-progress">
            <div 
              className="tts-progress-fill"
              style={{ width: `${ttsProgress}%` }}
            ></div>
          </div>
          
          <button className="tts-control" onClick={stopTTS}>
            <Square size={16} />
          </button>
        </div>
      )}

      {/* Emergency Overlay */}
      {emergencyMode && (
        <div className="emergency-overlay">
          <div className="emergency-alert">
            <div className="emergency-header">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-content">
                <h3>Emergency Assistance Activated</h3>
                <p>Help has been notified and is on the way</p>
              </div>
            </div>
            <div className="emergency-actions">
              <button className="emergency-action primary">
                Call Emergency Contact
              </button>
              <button 
                className="emergency-action secondary"
                onClick={() => setEmergencyMode(false)}
              >
                Cancel Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;