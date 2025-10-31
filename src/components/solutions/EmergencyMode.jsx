import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, Shield, Phone, MapPin, User, Heart,
  MessageSquare, Send, Clock, Battery, Wifi, Volume2,
  Play, Square, Download, Upload, Star, History,
  Settings, Brain, Type, Hand, Eye, ThumbsUp,
  ThumbsDown, RotateCcw, Share, Sparkles, Target,
  BarChart3, Lightbulb, Users, Award, Globe, ChevronDown,
  Search, Filter, Plus, Trash2, Edit3, Mic, EyeOff,
  Lock, Unlock, Copy, CheckCircle, XCircle, TrendingUp,
  Pause, SkipForward, SkipBack, Waves, Gauge, Activity,
  Monitor, FileText, Bell, Navigation, Crosshair,
  Ambulance, Stethoscope, AlertCircle, Siren, Siren as Police,
  Zap 
} from 'lucide-react';
const EmergencyMode = () => {
  // State management
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [locationShared, setLocationShared] = useState(false);
  const [contactsNotified, setContactsNotified] = useState(false);
  const [medicalInfoVisible, setMedicalInfoVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [lastKnownLocation, setLastKnownLocation] = useState(null);

  // Refs
  const countdownRef = useRef(null);
  const alertSoundRef = useRef(null);

  // Emergency types
  const emergencyTypes = [
    {
      id: 'medical',
      name: 'Medical Emergency',
      icon: <Stethoscope size={20} />,
      color: 'from-red-500 to-pink-600',
      message: 'I need immediate medical assistance!',
      contacts: ['Ambulance', 'Doctor', 'Family']
    },
    {
      id: 'police',
      name: 'Police Emergency',
      icon: <Shield size={20} />,
      color: 'from-blue-500 to-indigo-600',
      message: 'I need police assistance immediately!',
      contacts: ['Police', 'Security', 'Family']
    },
    {
      id: 'fire',
      name: 'Fire Emergency',
      icon: <AlertTriangle size={20} />,
      color: 'from-orange-500 to-red-600',
      message: 'Fire emergency! Need immediate help!',
      contacts: ['Fire Department', 'Neighbors', 'Family']
    },
    {
      id: 'personal',
      name: 'Personal Safety',
      icon: <User size={20} />,
      color: 'from-purple-500 to-pink-600',
      message: 'I feel unsafe and need assistance!',
      contacts: ['Trusted Contacts', 'Security', 'Family']
    }
  ];

  // Emergency contacts
  const emergencyContacts = [
    { id: 1, name: 'Ambulance', number: '999', type: 'medical', priority: 1 },
    { id: 2, name: 'Police', number: '999', type: 'police', priority: 1 },
    { id: 3, name: 'Fire Department', number: '999', type: 'fire', priority: 1 },
    { id: 4, name: 'Dr. Wanjiku', number: '+254 712 345 678', type: 'medical', priority: 2 },
    { id: 5, name: 'Family - Mom', number: '+254 723 456 789', type: 'personal', priority: 2 },
    { id: 6, name: 'Neighbor John', number: '+254 734 567 890', type: 'personal', priority: 3 }
  ];

  // Pre-set emergency messages
  const emergencyMessages = [
    "I need immediate medical assistance!",
    "Emergency! Please help me quickly!",
    "I'm in danger and need help!",
    "Medical emergency - need ambulance!",
    "I'm lost and need assistance!",
    "I feel unsafe - please check on me"
  ];

  // Medical information
  const medicalInfo = {
    name: "John Mwangi",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Hypertension"],
    medications: ["Ventolin inhaler", "Blood pressure medication"],
    emergencyContact: "Mary Mwangi - +254 723 456 789",
    doctor: "Dr. Wanjiku - +254 712 345 678",
    insurance: "NHIF - 123456789"
  };

  // Location data
  const locationData = {
    latitude: -1.2921,
    longitude: 36.8219,
    address: "Nairobi, Kenya",
    accuracy: "15 meters",
    lastUpdated: "2 minutes ago"
  };

  // Initialize
  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLastKnownLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default Nairobi coordinates as fallback
          setLastKnownLocation({
            latitude: -1.2921,
            longitude: 36.8219
          });
        }
      );
    }

    // Set default emergency message
    const defaultType = emergencyTypes.find(type => type.id === emergencyType);
    if (defaultType) {
      setEmergencyMessage(defaultType.message);
    }
  }, [emergencyType]);

  // Start emergency countdown
  const startEmergency = () => {
    setShowConfirmation(true);
    setCountdown(5);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cancel emergency
  const cancelEmergency = () => {
    clearInterval(countdownRef.current);
    setShowConfirmation(false);
    setCountdown(5);
  };

  // Activate emergency mode
  const activateEmergency = () => {
    clearInterval(countdownRef.current);
    setEmergencyActive(true);
    setShowConfirmation(false);
    
    // Simulate emergency actions
    simulateEmergencyActions();
    
    // Play alert sound (in real app)
    if (alertSoundRef.current) {
      alertSoundRef.current.play().catch(console.error);
    }
  };

  // Simulate emergency actions
  const simulateEmergencyActions = () => {
    // Simulate location sharing
    setTimeout(() => setLocationShared(true), 1000);
    
    // Simulate contact notifications
    setTimeout(() => setContactsNotified(true), 3000);
    
    // Simulate emergency services contact
    setTimeout(() => {
      const contacts = emergencyContacts.filter(contact => 
        contact.type === emergencyType || contact.priority === 1
      );
      console.log('Notifying contacts:', contacts);
    }, 5000);
  };

  // Deactivate emergency
  const deactivateEmergency = () => {
    setEmergencyActive(false);
    setLocationShared(false);
    setContactsNotified(false);
    setMedicalInfoVisible(false);
  };

  // Share location
  const shareLocation = () => {
    setLocationShared(true);
    // In real app, this would send location to emergency contacts
    console.log('Sharing location:', lastKnownLocation);
  };

  // Notify contacts
  const notifyContacts = () => {
    setContactsNotified(true);
    // In real app, this would send messages to all emergency contacts
    console.log('Notifying emergency contacts');
  };

  // Call emergency number
  const callEmergency = (number) => {
    // In real app, this would initiate a phone call
    console.log('Calling:', number);
    window.open(`tel:${number}`, '_self');
  };

  // Send emergency message
  const sendEmergencyMessage = () => {
    const selectedType = emergencyTypes.find(type => type.id === emergencyType);
    const message = emergencyMessage || selectedType?.message;
    
    // In real app, this would send to all emergency contacts
    console.log('Sending emergency message:', message);
    
    // Simulate sending
    setTimeout(() => {
      console.log('Emergency message sent to all contacts');
    }, 1000);
  };

  // Get current emergency type
  const getCurrentEmergencyType = () => {
    return emergencyTypes.find(type => type.id === emergencyType);
  };

  return (
    <div className="emergency-mode-page">
      {/* Emergency Alert Sound */}
      <audio 
        ref={alertSoundRef}
        src="/emergency-alert.mp3" 
        loop
        preload="auto"
      />

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal glass-card">
            <div className="modal-header emergency">
              <AlertTriangle size={32} className="emergency-icon" />
              <h2>Emergency Alert</h2>
            </div>
            
            <div className="confirmation-content">
              <div className="countdown-display">
                <div className="countdown-circle">
                  <span className="countdown-number">{countdown}</span>
                </div>
                <p>Emergency mode will activate in {countdown} seconds</p>
              </div>
              
              <div className="emergency-details">
                <h4>Emergency Type: {getCurrentEmergencyType()?.name}</h4>
                <p>The following actions will be taken:</p>
                <ul className="action-list">
                  <li>📍 Share your current location</li>
                  <li>📱 Notify your emergency contacts</li>
                  <li>🚨 Contact emergency services</li>
                  <li>📋 Share medical information (if enabled)</li>
                </ul>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button 
                className="btn-secondary cancel-btn"
                onClick={cancelEmergency}
              >
                Cancel Emergency
              </button>
              <button 
                className="btn-primary activate-btn"
                onClick={activateEmergency}
              >
                Activate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Emergency Interface */}
      <div className="emergency-container">
        
        {/* Emergency Header */}
        <div className="emergency-header glass-card">
          <div className="header-content">
            <div className="header-left">
              <div className="emergency-status">
                <div className={`status-indicator ${emergencyActive ? 'active' : 'inactive'}`}>
                  <Siren size={20} />
                </div>
                <div className="status-info">
                  <h1 className="page-title">
                    {emergencyActive ? 'EMERGENCY MODE ACTIVE' : 'Emergency Mode'}
                  </h1>
                  <p className="page-subtitle">
                    {emergencyActive 
                      ? 'Help is on the way. Stay calm.' 
                      : 'Critical assistance interface'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              {!emergencyActive ? (
                <button 
                  className="emergency-activate-btn"
                  onClick={startEmergency}
                >
                  <AlertTriangle size={20} />
                  <span>Activate Emergency</span>
                </button>
              ) : (
                <button 
                  className="emergency-deactivate-btn"
                  onClick={deactivateEmergency}
                >
                  <CheckCircle size={20} />
                  <span>All Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Content */}
        <div className="emergency-content">
          
          {/* Left Column - Emergency Controls */}
          <div className="emergency-left">
            
            {/* Emergency Type Selector */}
            <div className="type-selector-card glass-card">
              <h3 className="card-title">
                <AlertCircle size={18} />
                <span>Emergency Type</span>
              </h3>
              
              <div className="emergency-types">
                {emergencyTypes.map(type => (
                  <button
                    key={type.id}
                    className={`type-card ${emergencyType === type.id ? 'active' : ''}`}
                    onClick={() => setEmergencyType(type.id)}
                    disabled={emergencyActive}
                  >
                    <div className="type-icon">
                      {type.icon}
                    </div>
                    <span className="type-name">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-card glass-card">
              <h3 className="card-title">
                <Zap size={18} />
                <span>Quick Actions</span>
              </h3>
              
              <div className="quick-actions">
                <button 
                  className="action-btn primary"
                  onClick={shareLocation}
                  disabled={!emergencyActive || locationShared}
                >
                  <MapPin size={20} />
                  <span>{locationShared ? 'Location Shared' : 'Share Location'}</span>
                </button>
                
                <button 
                  className="action-btn primary"
                  onClick={notifyContacts}
                  disabled={!emergencyActive || contactsNotified}
                >
                  <Bell size={20} />
                  <span>{contactsNotified ? 'Contacts Notified' : 'Notify Contacts'}</span>
                </button>
                
                <button 
                  className="action-btn"
                  onClick={() => setMedicalInfoVisible(!medicalInfoVisible)}
                >
                  <Heart size={20} />
                  <span>Medical Info</span>
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="contacts-card glass-card">
              <h3 className="card-title">
                <Users size={18} />
                <span>Emergency Contacts</span>
              </h3>
              
              <div className="contacts-list">
                {emergencyContacts
                  .filter(contact => contact.type === emergencyType || contact.priority === 1)
                  .map(contact => (
                    <div key={contact.id} className="contact-item">
                      <div className="contact-info">
                        <span className="contact-name">{contact.name}</span>
                        <span className="contact-number">{contact.number}</span>
                      </div>
                      <button 
                        className="call-btn"
                        onClick={() => callEmergency(contact.number)}
                        disabled={!emergencyActive}
                      >
                        <Phone size={16} />
                        <span>Call</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Center Column - Emergency Status */}
          <div className="emergency-center">
            
            {/* Emergency Status Dashboard */}
            <div className="status-dashboard glass-card">
              <h3 className="section-title">
                <Activity size={18} />
                <span>Emergency Status</span>
              </h3>
              
              <div className="status-grid">
                <div className={`status-item ${locationShared ? 'active' : ''}`}>
                  <div className="status-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="status-info">
                    <span className="status-label">Location</span>
                    <span className="status-value">
                      {locationShared ? 'Shared' : 'Not Shared'}
                    </span>
                  </div>
                </div>
                
                <div className={`status-item ${contactsNotified ? 'active' : ''}`}>
                  <div className="status-icon">
                    <Bell size={20} />
                  </div>
                  <div className="status-info">
                    <span className="status-label">Contacts</span>
                    <span className="status-value">
                      {contactsNotified ? 'Notified' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="status-item active">
                  <div className="status-icon">
                    <Shield size={20} />
                  </div>
                  <div className="status-info">
                    <span className="status-label">Services</span>
                    <span className="status-value">Alerted</span>
                  </div>
                </div>
                
                <div className="status-item active">
                  <div className="status-icon">
                    <Clock size={20} />
                  </div>
                  <div className="status-info">
                    <span className="status-label">Response</span>
                    <span className="status-value">5-10 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="location-card glass-card">
              <h3 className="section-title">
                <Navigation size={18} />
                <span>Your Location</span>
              </h3>
              
              <div className="location-map">
                <div className="map-placeholder">
                  <MapPin size={48} />
                  <p>Live Location Tracking Active</p>
                  <div className="location-details">
                    <span>{locationData.address}</span>
                    <span>Accuracy: {locationData.accuracy}</span>
                    <span>Updated: {locationData.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <div className="location-actions">
                <button className="btn-outline">
                  <Share size={16} />
                  <span>Share Live Location</span>
                </button>
                <button className="btn-outline">
                  <Download size={16} />
                  <span>Download Location Data</span>
                </button>
              </div>
            </div>

            {/* Emergency Message */}
            <div className="message-card glass-card">
              <h3 className="section-title">
                <MessageSquare size={18} />
                <span>Emergency Message</span>
              </h3>
              
              <div className="message-content">
                <textarea
                  value={emergencyMessage}
                  onChange={(e) => setEmergencyMessage(e.target.value)}
                  placeholder="Type your emergency message..."
                  className="emergency-textarea"
                  rows="3"
                  disabled={!emergencyActive}
                />
                
                <div className="quick-messages">
                  <span>Quick Messages:</span>
                  <div className="message-chips">
                    {emergencyMessages.map((message, index) => (
                      <button
                        key={index}
                        className="message-chip"
                        onClick={() => setEmergencyMessage(message)}
                        disabled={!emergencyActive}
                      >
                        {message}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="btn-primary send-btn"
                  onClick={sendEmergencyMessage}
                  disabled={!emergencyActive}
                >
                  <Send size={16} />
                  <span>Send Emergency Alert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Medical & Info */}
          <div className="emergency-right">
            
            {/* Medical Information */}
            <div className="medical-card glass-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Heart size={18} />
                  <span>Medical Information</span>
                </h3>
                <button 
                  className="icon-btn"
                  onClick={() => setMedicalInfoVisible(!medicalInfoVisible)}
                >
                  {medicalInfoVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {medicalInfoVisible && (
                <div className="medical-info">
                  <div className="info-section">
                    <span className="info-label">Name</span>
                    <span className="info-value">{medicalInfo.name}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Blood Type</span>
                    <span className="info-value">{medicalInfo.bloodType}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Allergies</span>
                    <span className="info-value">{medicalInfo.allergies.join(', ')}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Medical Conditions</span>
                    <span className="info-value">{medicalInfo.conditions.join(', ')}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Medications</span>
                    <span className="info-value">{medicalInfo.medications.join(', ')}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Emergency Contact</span>
                    <span className="info-value">{medicalInfo.emergencyContact}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Doctor</span>
                    <span className="info-value">{medicalInfo.doctor}</span>
                  </div>
                  
                  <div className="info-section">
                    <span className="info-label">Insurance</span>
                    <span className="info-value">{medicalInfo.insurance}</span>
                  </div>
                </div>
              )}
              
              <div className="medical-actions">
                <button className="btn-outline">
                  <Download size={16} />
                  <span>Download Medical Card</span>
                </button>
                <button className="btn-outline">
                  <Share size={16} />
                  <span>Share with Responders</span>
                </button>
              </div>
            </div>

            {/* Response Timeline */}
            <div className="timeline-card glass-card">
              <h3 className="card-title">
                <Clock size={18} />
                <span>Response Timeline</span>
              </h3>
              
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">Just now</span>
                    <span className="timeline-event">Emergency detected</span>
                  </div>
                </div>
                
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">30 seconds ago</span>
                    <span className="timeline-event">Location shared</span>
                  </div>
                </div>
                
                <div className="timeline-item active">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">1 minute ago</span>
                    <span className="timeline-event">Contacts notified</span>
                  </div>
                </div>
                
                <div className="timeline-item pending">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">Estimated</span>
                    <span className="timeline-event">First responder dispatch</span>
                  </div>
                </div>
                
                <div className="timeline-item pending">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">5-10 minutes</span>
                    <span className="timeline-event">Help arrives</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Resources */}
            <div className="resources-card glass-card">
              <h3 className="card-title">
                <Shield size={18} />
                <span>Emergency Resources</span>
              </h3>
              
              <div className="resources-list">
                <button className="resource-btn">
                  <Ambulance size={16} />
                  <span>Nearest Hospital</span>
                </button>
                
                <button className="resource-btn">
                  <Police size={16} />
                  <span>Police Station</span>
                </button>
                
                <button className="resource-btn">
                  <Users size={16} />
                  <span>Safe Locations</span>
                </button>
                
                <button className="resource-btn">
                  <Phone size={16} />
                  <span>Emergency Hotlines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;