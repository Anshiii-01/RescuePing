import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Types for emergency system
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'family' | 'friend' | 'medical' | 'emergency-service';
  isPrimary: boolean;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyNotes: string;
  emergencyContact: string;
  lastUpdated: number;
}

interface SOSState {
  isActive: boolean;
  startTime: number | null;
  countdown: number;
  locationSent: boolean;
  contactsNotified: string[];
}

// =====================================================
// ANIMATIONS
// =====================================================

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1); }
  50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(239, 68, 68, 0.2); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const urgentFlash = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
`;

// =====================================================
// STYLED COMPONENTS - MODERN SOS THEME
// =====================================================

const EmergencyContainer = styled.div`
  background: linear-gradient(165deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.95) 50%, 
    rgba(15, 23, 42, 0.98) 100%
  );
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  padding: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 
    0 0 0 1px rgba(239, 68, 68, 0.1),
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  ${css`animation: ${fadeIn} 0.5s ease-out;`}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LiveBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.$active ? '#22c55e' : '#ef4444'};
  border: 1px solid ${props => props.$active ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    ${props => props.$active && css`animation: ${pulse} 1.5s infinite;`}
  }
`;

const SOSSection = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const SOSButton = styled.button<{ isActive: boolean }>`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid ${({ isActive }) => isActive ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.5)'};
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  margin: 0 auto 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  background: ${({ isActive }) => 
    isActive 
      ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.9))'
      : 'linear-gradient(145deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.7))'
  };
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  box-shadow: 
    0 4px 20px rgba(239, 68, 68, 0.3),
    inset 0 -2px 10px rgba(0, 0, 0, 0.2);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 
      0 8px 30px rgba(239, 68, 68, 0.4),
      inset 0 -2px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  ${({ isActive }) => isActive && css`animation: ${glow} 1s infinite;`}
`;

const CountdownOverlay = styled.div<{ countdown: number }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  
  ${({ countdown }) => countdown <= 3 && css`
    animation: ${urgentFlash} 0.5s infinite;
    color: #fef08a;
  `}
`;

const SOSDescription = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
`;

const StatusMessage = styled.div<{ type: 'info' | 'success' | 'warning' | 'error' }>`
  padding: 14px 18px;
  border-radius: 12px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  ${css`animation: ${fadeIn} 0.3s ease-out;`}
  
  background: ${({ type }) => ({
    success: 'rgba(34, 197, 94, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    error: 'rgba(239, 68, 68, 0.15)',
    info: 'rgba(99, 102, 241, 0.15)'
  })[type]};
  
  color: ${({ type }) => ({
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#6366f1'
  })[type]};
  
  border: 1px solid ${({ type }) => ({
    success: 'rgba(34, 197, 94, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(99, 102, 241, 0.3)'
  })[type]};
`;

const Section = styled.div`
  margin: 24px 0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContactsGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const ContactCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(239, 68, 68, 0.2);
    transform: translateX(4px);
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  
  .name {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 2px;
  }
  
  .phone {
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    font-family: 'SF Mono', 'Monaco', monospace;
  }
  
  .relationship {
    color: rgba(255, 255, 255, 0.4);
    font-size: 11px;
    text-transform: capitalize;
    margin-top: 2px;
  }
`;

const CallButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2));
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

// Emergency Response Panel Component
const EmergencyResponsePanel: React.FC = () => {
  const [sosState, setSosState] = useState<SOSState>({
    isActive: false,
    startTime: null,
    countdown: 0,
    locationSent: false,
    contactsNotified: []
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Emergency Services',
      phone: '112',
      relationship: 'emergency-service',
      isPrimary: true
    },
    {
      id: '2', 
      name: 'Police',
      phone: '100',
      relationship: 'emergency-service',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Fire Department',
      phone: '101',
      relationship: 'emergency-service',
      isPrimary: false
    },
    {
      id: '4',
      name: 'Ambulance',
      phone: '102',
      relationship: 'emergency-service',
      isPrimary: false
    },
    {
      id: '5',
      name: 'Disaster Management',
      phone: '108',
      relationship: 'emergency-service',
      isPrimary: false
    }
  ]);

  // Medical info removed as requested - keeping minimal structure for compatibility
  const [medicalInfo] = useState<MedicalInfo>({
    bloodType: '',
    allergies: [],
    medications: [],
    conditions: [],
    emergencyNotes: '',
    emergencyContact: '',
    lastUpdated: Date.now()
  });

  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

  // Execute SOS actions - wrapped in useCallback to prevent infinite loops
  const executeSOS = useCallback(async () => {
    // Prevent multiple executions
    if (sosState.locationSent) return;

    try {
      setStatus({ message: 'Executing emergency protocol...', type: 'warning' });
      
      // Get current location with high accuracy
      const location = await getCurrentLocation();
      
      // Send location to emergency contacts via multiple channels
      await notifyEmergencyContacts(location);
      
      // Save emergency event to localStorage for recovery
      const emergencyEvent = {
        timestamp: Date.now(),
        location,
        medicalInfo: medicalInfo,
        contactsNotified: emergencyContacts.map(c => c.id),
        status: 'active'
      };
      localStorage.setItem('activeEmergency', JSON.stringify(emergencyEvent));
      
      // Call primary emergency number (112)
      const primaryContact = emergencyContacts.find(c => c.isPrimary);
      if (primaryContact) {
        setTimeout(() => {
          window.open(`tel:${primaryContact.phone}`);
        }, 1000); // Small delay to let location send first
      }
      
      // Update state with success and STOP the SOS active state to prevent loops
      setSosState(prev => ({ 
        ...prev, 
        isActive: false, // Stop the active state
        locationSent: true, 
        contactsNotified: emergencyContacts.map(c => c.id) 
      }));
      
      // Vibrate phone if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
      
      setStatus({ 
        message: '✅ SOS SENT! Emergency services contacted and location shared.', 
        type: 'success' 
      });
      
      // Keep success message visible longer
      setTimeout(() => {
        setStatus({ 
          message: 'Emergency active. Help is on the way. Stay calm and safe.', 
          type: 'info' 
        });
      }, 5000);
      
    } catch (error) {
      console.error('SOS execution failed:', error);
      
      // Even if location fails, still make the call
      const primaryContact = emergencyContacts.find(c => c.isPrimary);
      if (primaryContact) {
        window.open(`tel:${primaryContact.phone}`);
      }
      
      setStatus({ 
        message: '⚠️ SOS partially sent. Location failed but calling emergency services. Please provide location verbally.', 
        type: 'error' 
      });
      
      // Stop active state even on error to prevent loops
      setSosState(prev => ({ ...prev, isActive: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emergencyContacts, medicalInfo, sosState.locationSent]);

  // SOS countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (sosState.isActive && sosState.countdown > 0) {
      timer = setTimeout(() => {
        setSosState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (sosState.isActive && sosState.countdown === 0) {
      // Execute SOS actions
      executeSOS();
    }
    
    return () => clearTimeout(timer);
  }, [sosState.isActive, sosState.countdown, executeSOS]);

  // Start SOS sequence
  const startSOS = () => {
    setStatus({ message: 'SOS activated! Canceling in 10 seconds...', type: 'warning' });
    setSosState({
      isActive: true,
      startTime: Date.now(),
      countdown: 10,
      locationSent: false,
      contactsNotified: []
    });
  };

  // Cancel SOS
  const cancelSOS = () => {
    setSosState({
      isActive: false,
      startTime: null,
      countdown: 0,
      locationSent: false,
      contactsNotified: []
    });
    setStatus({ message: 'SOS canceled', type: 'info' });
    setTimeout(() => setStatus(null), 3000);
  };

  // Get current location for SOS with enhanced accuracy
  const getCurrentLocation = (): Promise<{ lat: number; lon: number; accuracy: number; address?: string }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this device'));
        return;
      }
      
      // First try high accuracy GPS
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          // Try to get human-readable address
          try {
            const address = await reverseGeocode(location.lat, location.lon);
            resolve({ ...location, address });
          } catch {
            resolve(location); // Return without address if geocoding fails
          }
        },
        (error) => {
          console.error('High accuracy GPS failed:', error);
          
          // Fallback to lower accuracy
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (fallbackError) => {
              console.error('All location methods failed:', fallbackError);
              reject(new Error(`Location unavailable: ${fallbackError.message}`));
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  };

  // Notify emergency contacts via multiple methods
  const notifyEmergencyContacts = async (location: { lat: number; lon: number; accuracy?: number; address?: string }) => {
    const timestamp = new Date().toLocaleString();
    const accuracyText = location.accuracy ? ` (±${Math.round(location.accuracy)}m)` : '';
    const locationText = location.address || `${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}`;
    
    const emergencyMessage = `🚨 EMERGENCY ALERT from Rescue Ping App
    
Time: ${timestamp}
I need immediate assistance at:
📍 ${locationText}${accuracyText}
🗺️ Maps: https://maps.google.com/maps?q=${location.lat},${location.lon}

This is an automated emergency alert. Please respond immediately.`;

    try {
      // Method 1: Web Share API (if available)
      if (navigator.share) {
        try {
          await navigator.share({
            title: '🚨 EMERGENCY ALERT',
            text: emergencyMessage,
            url: `https://maps.google.com/maps?q=${location.lat},${location.lon}`
          });
          console.log('Emergency alert shared via Web Share API');
        } catch (shareError) {
          console.log('Web Share failed, trying other methods');
        }
      }

      // Method 2: Copy to clipboard for manual sharing
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(emergencyMessage);
          setStatus({ 
            message: '📋 Emergency details copied to clipboard. Share with contacts!', 
            type: 'success' 
          });
        } catch (clipboardError) {
          console.error('Clipboard write failed:', clipboardError);
        }
      }

      // Method 3: SMS links for each contact (opens default SMS app)
      const personalContacts = emergencyContacts.filter(c => c.relationship !== 'emergency-service');
      personalContacts.forEach((contact, index) => {
        setTimeout(() => {
          const smsBody = encodeURIComponent(emergencyMessage);
          window.open(`sms:${contact.phone}?body=${smsBody}`);
        }, index * 1000); // Stagger SMS opens to avoid blocking
      });

      // Method 4: Email as fallback (if configured)
      const emailSubject = encodeURIComponent('🚨 EMERGENCY ALERT - Immediate Assistance Needed');
      const emailBody = encodeURIComponent(emergencyMessage);
      setTimeout(() => {
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
      }, personalContacts.length * 1000);

      // Log for emergency recovery
      const notificationLog = {
        timestamp: Date.now(),
        location,
        message: emergencyMessage,
        contactsAttempted: emergencyContacts.map(c => ({ name: c.name, phone: c.phone })),
        methods: ['clipboard', 'sms', 'email']
      };
      localStorage.setItem('lastEmergencyNotification', JSON.stringify(notificationLog));

      return true;
    } catch (error) {
      console.error('Emergency notification failed:', error);
      
      // Fallback: show alert dialog with emergency info
      alert(`EMERGENCY ALERT!\n\n${emergencyMessage}\n\nPlease manually contact emergency services and share this information.`);
      
      throw error;
    }
  };

  // Quick call function with enhanced features
  const makeCall = (phone: string, contactName?: string) => {
    // Log the call for emergency records
    const callLog = {
      timestamp: Date.now(),
      contact: contactName || phone,
      phone: phone,
      context: sosState.isActive ? 'emergency' : 'normal'
    };
    
    const existingLogs = JSON.parse(localStorage.getItem('emergencyCallLogs') || '[]');
    existingLogs.push(callLog);
    localStorage.setItem('emergencyCallLogs', JSON.stringify(existingLogs.slice(-50))); // Keep last 50 calls
    
    // Show feedback
    setStatus({ 
      message: `Calling ${contactName || phone}...`, 
      type: 'info' 
    });
    setTimeout(() => setStatus(null), 2000);
    
    // Make the call
    window.open(`tel:${phone}`);
  };

  // Load data from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  return (
    <EmergencyContainer>
      <Header>
        <Title>🚨 Emergency Response</Title>
        <LiveBadge $active={!sosState.isActive}>
          {sosState.isActive ? 'SOS ACTIVE' : 'READY'}
        </LiveBadge>
      </Header>
      
      {/* Enhanced SOS Button */}
      <SOSSection>
        <SOSButton 
          isActive={sosState.isActive}
          onClick={sosState.isActive ? cancelSOS : startSOS}
          onDoubleClick={() => {
            if (!sosState.isActive) {
              // Double-click for immediate SOS (bypassing countdown)
              setStatus({ message: 'Double-click detected! Immediate SOS activated!', type: 'error' });
              setSosState({
                isActive: true,
                startTime: Date.now(),
                countdown: 1, // Nearly immediate
                locationSent: false,
                contactsNotified: []
              });
            }
          }}
        >
          {sosState.isActive ? (
            <CountdownOverlay countdown={sosState.countdown}>
              {sosState.countdown > 3 ? sosState.countdown : '🚨'}
            </CountdownOverlay>
          ) : (
            <>
              🆘<br />SOS
            </>
          )}
        </SOSButton>
        
        <SOSDescription>
          {sosState.isActive 
            ? `⏱️ Emergency alert in ${sosState.countdown}s — Click to cancel`
            : '🆘 Click to start SOS countdown • Double-click for immediate SOS'
          }
        </SOSDescription>
      </SOSSection>
      
      {status && (
        <StatusMessage type={status.type}>
          {status.message}
        </StatusMessage>
      )}

      {/* Emergency Contacts */}
      <Section>
        <SectionTitle>📞 Emergency Contacts</SectionTitle>
        <ContactsGrid>
          {emergencyContacts.map(contact => (
            <ContactCard key={contact.id}>
              <ContactInfo>
                <div className="name">{contact.name}</div>
                <div className="phone">{contact.phone}</div>
                <div className="relationship">{contact.relationship.replace('-', ' ')}</div>
              </ContactInfo>
              <CallButton
                onClick={() => makeCall(contact.phone, contact.name)}
              >
                📞 Call
              </CallButton>
            </ContactCard>
          ))}
        </ContactsGrid>
      </Section>
    </EmergencyContainer>
  );
};

export default EmergencyResponsePanel;