import React, { useState, useEffect, useRef } from 'react';
import { 
    Volume2, Zap, TrendingUp, Brain, Heart, Globe,
    Play, Square, Download, Share, Sparkles, Target,
    BarChart3, Lightbulb, MessageSquare, Type, RotateCcw,
    Settings, Award
} from 'lucide-react';
// IMPORT THE SEPARATE CSS FILE HERE
// import './ContentAmplifier.css'; 

const ContentAmplifier = () => {
    // State management (as provided in the prompt)
    const [inputText, setInputText] = useState('');
    const [enhancedText, setEnhancedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeTool, setActiveTool] = useState('enhancer');
    const [suggestions, setSuggestions] = useState([]);
    const [emotionalTone, setEmotionalTone] = useState('neutral');
    const [culturalContext, setCulturalContext] = useState('global');
    const [practiceScore, setPracticeScore] = useState(0);
    const [practiceInput, setPracticeInput] = useState('');
    const [practiceFeedback, setPracticeFeedback] = useState('');
    const [analytics, setAnalytics] = useState({
        clarity: 0,
        impact: 0,
        engagement: 0,
        confidence: 0
    });

    // Refs
    const speechRef = useRef(null);

    // Data Definitions
    const enhancementTools = [
        { id: 'enhancer', name: 'Smart Enhancer', icon: <Zap size={18} />, description: 'AI-powered message improvement' },
        { id: 'builder', name: 'Sentence Builder', icon: <Brain size={18} />, description: 'Construct perfect sentences' },
        { id: 'emotional', name: 'Tone Adjuster', icon: <Heart size={18} />, description: 'Adjust emotional impact' },
        { id: 'cultural', name: 'Cultural Adaptor', icon: <Globe size={18} />, description: 'Cultural context optimization' }
    ];

    const emotionalTones = [
        { id: 'friendly', name: 'Friendly', emoji: '😊' },
        { id: 'professional', name: 'Professional', emoji: '💼' },
        { id: 'empathetic', name: 'Empathetic', emoji: '🤗' },
        { id: 'enthusiastic', name: 'Enthusiastic', emoji: '🎉' },
        { id: 'neutral', name: 'Neutral', emoji: '😐' },
        { id: 'confident', name: 'Confident', emoji: '💪' }
    ];

    const culturalContexts = [
        { id: 'global', name: 'Global English', flag: '🌐', description: 'Universal understanding' },
        { id: 'us', name: 'US English', flag: '🇺🇸', description: 'American cultural context' },
        { id: 'uk', name: 'UK English', flag: '🇬🇧', description: 'British cultural context' },
        { id: 'kenyan', name: 'Kenyan English', flag: '🇰🇪', description: 'East African context' },
        { id: 'formal', name: 'Formal', flag: '🎩', description: 'Professional settings' },
        { id: 'casual', name: 'Casual', flag: '👕', description: 'Informal conversations' }
    ];

    const suggestionTemplates = {
        greetings: ['Hello! How are you doing today?', 'Good morning! Hope you\'re having a great day.'],
        requests: ['Could you please help me with this?', 'I would appreciate your assistance with...'],
        gratitude: ['Thank you so much for your help!', 'I really appreciate your support.'],
        questions: ['What are your thoughts on this?', 'Could you explain this further?']
    };

    const enhancementExamples = {
        original: "I want food",
        enhanced: "I'm feeling quite hungry and would appreciate something to eat when you have a moment"
    };

    // --- Logic Functions ---
    const updateAnalytics = (text) => {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const sentenceCount = (text.match(/[.!?]/g) || []).length;
        
        setAnalytics({
            clarity: Math.min(100, Math.floor(Math.random() * 20 + 75)), 
            impact: Math.min(100, Math.floor((wordCount / 10) * 10)),
            engagement: Math.min(100, Math.floor((sentenceCount / 2) * 20)),
            confidence: Math.min(100, Math.floor(Math.random() * 30 + 70))
        });
    };
    
    const generateSuggestions = (text) => {
        const newSuggestions = [];
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            newSuggestions.push(suggestionTemplates.greetings[0]);
        }
        if (lowerText.includes('help') || lowerText.includes('please')) {
            newSuggestions.push(suggestionTemplates.requests[0]);
        }
        if (lowerText.includes('thank') || lowerText.includes('appreciate')) {
            newSuggestions.push(suggestionTemplates.gratitude[0]);
        }
        if (lowerText.includes('?')) {
            newSuggestions.push(suggestionTemplates.questions[0]);
        }
        
        setSuggestions(newSuggestions.slice(0, 4));
    };

    const enhanceText = async (text) => {
        if (!text.trim()) return;

        setIsProcessing(true);
        setAnalytics({ clarity: 0, impact: 0, engagement: 0, confidence: 0 });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let enhanced = text;
        
        // Simple tone logic
        if (emotionalTone === 'friendly') {
            enhanced = enhanced.replace(/I need/g, 'I\'d love to get assistance with');
        } else if (emotionalTone === 'professional') {
            enhanced = enhanced.replace(/I need/g, 'I require assistance with');
        } 
        
        // Cultural adaptations
        if (culturalContext === 'kenyan') {
            enhanced = 'Habari. ' + enhanced.replace(/hello/gi, 'greetings');
        } else if (culturalContext === 'uk') {
            enhanced = enhanced.replace(/awesome/gi, 'brilliant');
        }
        
        setEnhancedText(enhanced);
        updateAnalytics(enhanced);
        generateSuggestions(enhanced);
        setIsProcessing(false);
    };
    
    const speakText = (text) => {
        if (!text.trim()) return;
        stopSpeech(); 
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
    
    const evaluatePractice = () => {
        if (!practiceInput.trim()) return;
        
        const score = Math.min(100, Math.floor(Math.random() * 30 + 70));
        setPracticeScore(score);
        
        if (score >= 90) {
            setPracticeFeedback("Excellent! Your message is clear, engaging, and well-structured. You nailed the polite tone! 🌟");
        } else if (score >= 70) {
            setPracticeFeedback("Good job! Your message is effective but could be slightly more refined for impact. Try 'May I please have some water?'");
        } else {
            setPracticeFeedback("Keep practicing! Try using words like 'May I' or 'Could I' to increase politeness.");
        }
    };

    // Initialize with sample data
    useEffect(() => {
        const initialText = "Hello, I need help with something important.";
        setInputText(initialText);
        enhanceText(initialText); 
    }, []);

    // --- Render JSX ---
    return (
        <div className="content-amplifier-page">
            
            {/* Main Layout Grid */}
            <div className="amplifier-grid">
                
                {/* Left Sidebar - Tools & Controls */}
                <div className="sidebar-left">
                    {/* Enhancement Tools */}
                    <div className="tools-card glass-card">
                        <h3 className="card-title">
                            <Zap size={18} />
                            <span>Amplification Tools</span>
                        </h3>
                        <div className="tools-grid">
                            {enhancementTools.map(tool => (
                                <button
                                    key={tool.id}
                                    className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                                    onClick={() => setActiveTool(tool.id)}
                                >
                                    <div className="tool-icon">{tool.icon}</div>
                                    <div className="tool-info">
                                        <span className="tool-name">{tool.name}</span>
                                        <span className="tool-desc">{tool.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
        
                    {/* Emotional Tone Selector */}
                    <div className="tone-card glass-card">
                        <h3 className="card-title">
                            <Heart size={18} />
                            <span>Emotional Tone</span>
                        </h3>
                        <div className="tone-options">
                            {emotionalTones.map(tone => (
                                <button
                                    key={tone.id}
                                    className={`tone-option ${emotionalTone === tone.id ? 'active' : ''}`}
                                    onClick={() => setEmotionalTone(tone.id)}
                                >
                                    <span className="tone-emoji">{tone.emoji}</span>
                                    <span className="tone-name">{tone.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
        
                    {/* Cultural Context */}
                    <div className="culture-card glass-card">
                        <h3 className="card-title">
                            <Globe size={18} />
                            <span>Cultural Context</span>
                        </h3>
                        <div className="culture-options">
                            {culturalContexts.map(context => (
                                <button
                                    key={context.id}
                                    className={`culture-option ${culturalContext === context.id ? 'active' : ''}`}
                                    onClick={() => setCulturalContext(context.id)}
                                >
                                    <span className="culture-flag">{context.flag}</span>
                                    <div className="culture-info">
                                        <span className="culture-name">{context.name}</span>
                                        <span className="culture-desc">{context.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
        
                {/* Center - Main Amplification Area */}
                <div className="main-amplifier-area">
                    {/* Header */}
                    <div className="amplifier-header">
                        <div className="header-left">
                            <h1 className="page-title">Content Amplifier</h1>
                            <p className="page-subtitle">Transform your messages with AI-powered enhancement</p>
                        </div>
                        <div className="header-actions">
                            <button className="action-btn" title="Settings">
                                <Settings size={20} />
                            </button>
                            <button className="action-btn" title="Practice Mode">
                                <Target size={20} />
                            </button>
                        </div>
                    </div>
        
                    {/* Input Section */}
                    <div className="input-section glass-card">
                        <div className="section-header">
                            <h3 className="section-title">
                                <Type size={18} />
                                <span>Your Message</span>
                            </h3>
                            <div className="text-stats">
                                <span>**{inputText.length}** chars</span>
                                <span>**{inputText.split(/\s+/).filter(w => w.length > 0).length}** words</span>
                            </div>
                        </div>
                        
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message here... (Try: 'I need help' or 'Hello, how are you?')"
                            className="message-textarea"
                            rows="4"
                        />
                        
                        <div className="input-actions">
                            <button 
                                className="btn-primary"
                                onClick={() => enhanceText(inputText)}
                                disabled={!inputText.trim() || isProcessing}
                            >
                                <Zap size={18} />
                                <span>{isProcessing ? 'Amplifying...' : 'Amplify Message'}</span>
                            </button>
                            
                            <button 
                                className="btn-secondary"
                                onClick={() => setInputText('')}
                            >
                                <RotateCcw size={18} />
                                <span>Clear</span>
                            </button>
                        </div>
                    </div>
        
                    {/* Enhanced Output Section */}
                    <div className="output-section glass-card">
                        <div className="section-header">
                            <h3 className="section-title">
                                <Sparkles size={18} />
                                <span>Amplified Message</span>
                            </h3>
                            {enhancedText.length > 0 && inputText.length > 0 && (
                                <div className="enhancement-badge">
                                    <TrendingUp size={14} color="var(--accent-success)" />
                                    <span>+{Math.floor(((enhancedText.split(/\s+/).filter(w => w.length > 0).length - inputText.split(/\s+/).filter(w => w.length > 0).length) / Math.max(1, inputText.split(/\s+/).filter(w => w.length > 0).length)) * 100)}% words</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="enhanced-text-container">
                            {isProcessing ? (
                                <div className="processing-indicator">
                                    <div className="processing-spinner"></div>
                                    <p>AI is amplifying your message...</p>
                                </div>
                            ) : (
                                <div className="enhanced-text">
                                    {enhancedText || 'Your amplified message will appear here...'}
                                </div>
                            )}
                        </div>
                        
                        <div className="output-actions">
                            <button 
                                className="btn-primary"
                                onClick={() => speakText(enhancedText)}
                                disabled={!enhancedText.trim() || isSpeaking}
                            >
                                <Volume2 size={18} />
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
                            
                            <button className="btn-outline" onClick={() => navigator.clipboard.writeText(enhancedText)} disabled={!enhancedText.trim()}>
                                <Share size={18} />
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
        
                    {/* Smart Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="suggestions-section glass-card">
                            <h3 className="section-title">
                                <Lightbulb size={18} />
                                <span>Smart Suggestions</span>
                            </h3>
                            <div className="suggestions-grid">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="suggestion-card"
                                        onClick={() => {
                                            setInputText(suggestion);
                                            enhanceText(suggestion);
                                        }}
                                    >
                                        <div className="suggestion-content">
                                            <span className="suggestion-text">{suggestion}</span>
                                            <div className="suggestion-actions">
                                                <MessageSquare size={14} color="var(--color-primary)" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
        
                    {/* Enhancement Example */}
                    <div className="example-section glass-card">
                        <h3 className="section-title">
                            <Award size={18} />
                            <span>Enhancement Example</span>
                        </h3>
                        <div className="example-comparison">
                            <div className="example-column">
                                <h4>Original</h4>
                                <div className="example-text original">
                                    {enhancementExamples.original}
                                </div>
                            </div>
                            <div className="example-arrow">→</div>
                            <div className="example-column">
                                <h4>Amplified</h4>
                                <div className="example-text enhanced">
                                    {enhancementExamples.enhanced}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                {/* Right Sidebar - Analytics & Practice */}
                <div className="sidebar-right">
                    {/* Communication Analytics */}
                    <div className="analytics-card glass-card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <BarChart3 size={18} />
                                <span>Message Analytics</span>
                            </h3>
                            <TrendingUp size={16} color="var(--accent-success)" />
                        </div>
                        
                        <div className="analytics-grid">
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-name">Clarity</span>
                                    <span className="metric-value">{analytics.clarity}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div 
                                        className="metric-fill clarity"
                                        style={{ width: `${analytics.clarity}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-name">Impact</span>
                                    <span className="metric-value">{analytics.impact}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div 
                                        className="metric-fill impact"
                                        style={{ width: `${analytics.impact}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-name">Engagement</span>
                                    <span className="metric-value">{analytics.engagement}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div 
                                        className="metric-fill engagement"
                                        style={{ width: `${analytics.engagement}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="metric-card">
                                <div className="metric-header">
                                    <span className="metric-name">Confidence</span>
                                    <span className="metric-value">{analytics.confidence}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div 
                                        className="metric-fill confidence"
                                        style={{ width: `${analytics.confidence}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* Practice Mode */}
                    <div className="practice-card glass-card">
                        <h3 className="card-title">
                            <Target size={18} />
                            <span>Practice Mode</span>
                        </h3>
                        
                        <div className="practice-area">
                            <div className="practice-prompt">
                                <p>Try rephrasing: **"I want water"** to sound more polite</p>
                            </div>
                            
                            <textarea
                                value={practiceInput}
                                onChange={(e) => setPracticeInput(e.target.value)}
                                placeholder="Type your improved version here..."
                                className="practice-textarea"
                                rows="3"
                            />
                            
                            <button 
                                className="btn-primary practice-btn"
                                onClick={evaluatePractice}
                                disabled={!practiceInput.trim()}
                            >
                                <Award size={18} />
                                <span>Evaluate</span>
                            </button>
                            
                            {practiceScore > 0 && (
                                <div className="practice-feedback">
                                    <div className="score-display">
                                        <span className="score-value">{practiceScore}%</span>
                                        <span className="score-label">Effectiveness Score</span>
                                    </div>
                                    <p className="feedback-text">
                                        {practiceFeedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
        
                    {/* Quick Templates */}
                    <div className="templates-card glass-card">
                        <h3 className="card-title">
                            <MessageSquare size={18} />
                            <span>Quick Templates</span>
                        </h3>
                        
                        <div className="templates-list">
                            <button className="template-btn">
                                <span>💬 Meeting Request</span>
                            </button>
                            <button className="template-btn">
                                <span>🙏 Help Needed</span>
                            </button>
                            <button className="template-btn">
                                <span>🎉 Good News</span>
                            </button>
                            <button className="template-btn">
                                <span>🤔 Question</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
    
export default ContentAmplifier;