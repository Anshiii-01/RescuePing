/**
 * Voice-Activated Emergency Assistant Service
 * Speech recognition and synthesis for hands-free emergency assistance
 * Supports multiple Indian languages and accessibility features
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

// Voice command interface
interface VoiceCommand {
  command: string;
  patterns: RegExp[];
  action: string;
  parameters?: string[];
  response: string;
  priority: 'high' | 'medium' | 'low';
}

// Speech recognition result
interface RecognitionResult {
  transcript: string;
  confidence: number;
  language: string;
  timestamp: Date;
  isFinal: boolean;
}

// Voice assistant response
interface VoiceResponse {
  text: string;
  action?: string;
  data?: Record<string, unknown>;
  audioUrl?: string;
  followUpPrompt?: string;
}

// Supported languages
type SupportedLanguage = 'en-IN' | 'hi-IN' | 'bn-IN' | 'ta-IN' | 'te-IN' | 'mr-IN' | 'gu-IN' | 'kn-IN' | 'ml-IN' | 'pa-IN';

// Language configuration
const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  name: string;
  nativeName: string;
  emergencyKeywords: string[];
}> = {
  'en-IN': {
    name: 'English (India)',
    nativeName: 'English',
    emergencyKeywords: ['help', 'emergency', 'danger', 'flood', 'fire', 'earthquake', 'rescue', 'ambulance', 'police'],
  },
  'hi-IN': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    emergencyKeywords: ['मदद', 'आपातकाल', 'खतरा', 'बाढ़', 'आग', 'भूकंप', 'बचाव', 'एम्बुलेंस', 'पुलिस'],
  },
  'bn-IN': {
    name: 'Bengali',
    nativeName: 'বাংলা',
    emergencyKeywords: ['সাহায্য', 'জরুরি', 'বিপদ', 'বন্যা', 'আগুন', 'ভূমিকম্প', 'উদ্ধার'],
  },
  'ta-IN': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    emergencyKeywords: ['உதவி', 'அவசரம்', 'ஆபத்து', 'வெள்ளம்', 'தீ', 'நிலநடுக்கம்'],
  },
  'te-IN': {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    emergencyKeywords: ['సహాయం', 'అత్యవసరం', 'ప్రమాదం', 'వరద', 'అగ్ని'],
  },
  'mr-IN': {
    name: 'Marathi',
    nativeName: 'मराठी',
    emergencyKeywords: ['मदत', 'आणीबाणी', 'धोका', 'पूर', 'आग', 'भूकंप'],
  },
  'gu-IN': {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    emergencyKeywords: ['મદદ', 'કટોકટી', 'ખતરો', 'પૂર', 'આગ'],
  },
  'kn-IN': {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    emergencyKeywords: ['ಸಹಾಯ', 'ತುರ್ತು', 'ಅಪಾಯ', 'ಪ್ರವಾಹ', 'ಬೆಂಕಿ'],
  },
  'ml-IN': {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    emergencyKeywords: ['സഹായം', 'അടിയന്തിരം', 'അപകടം', 'വെള്ളപ്പൊക്കം', 'തീ'],
  },
  'pa-IN': {
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    emergencyKeywords: ['ਮਦਦ', 'ਐਮਰਜੈਂਸੀ', 'ਖ਼ਤਰਾ', 'ਹੜ੍ਹ', 'ਅੱਗ'],
  },
};

// Voice commands registry
const VOICE_COMMANDS: VoiceCommand[] = [
  // Emergency commands (highest priority)
  {
    command: 'emergency_help',
    patterns: [
      /\b(help|emergency|sos|mayday)\b/i,
      /\b(मदद|आपातकाल|बचाओ)\b/i,
    ],
    action: 'TRIGGER_EMERGENCY',
    response: 'Emergency alert activated. Sharing your location with emergency services.',
    priority: 'high',
  },
  {
    command: 'call_ambulance',
    patterns: [
      /\b(call|need|send)\s*(an?\s*)?(ambulance|medical|doctor)\b/i,
      /\b(एम्बुलेंस|डॉक्टर)\s*(बुलाओ|चाहिए)\b/i,
    ],
    action: 'CALL_AMBULANCE',
    response: 'Calling ambulance. Please stay calm and stay on the line.',
    priority: 'high',
  },
  {
    command: 'call_police',
    patterns: [
      /\b(call|need|send)\s*(the\s*)?(police|cops)\b/i,
      /\b(पुलिस)\s*(बुलाओ|को फोन करो)\b/i,
    ],
    action: 'CALL_POLICE',
    response: 'Connecting you to police. Your location is being shared.',
    priority: 'high',
  },
  {
    command: 'fire_emergency',
    patterns: [
      /\b(fire|burning|flames)\b/i,
      /\b(आग|जल रहा)\b/i,
    ],
    action: 'FIRE_EMERGENCY',
    response: 'Fire emergency reported. Alerting fire services and nearby shelters.',
    priority: 'high',
  },
  
  // Information commands
  {
    command: 'get_alerts',
    patterns: [
      /\b(show|get|what|any)\s*(are\s*)?(the\s*)?(alerts?|warnings?|notifications?)\b/i,
      /\b(अलर्ट|चेतावनी)\s*(दिखाओ|क्या है)\b/i,
    ],
    action: 'GET_ALERTS',
    response: 'Fetching current alerts for your area.',
    priority: 'medium',
  },
  {
    command: 'get_weather',
    patterns: [
      /\b(what'?s?|get|show)\s*(the\s*)?(weather|forecast|temperature)\b/i,
      /\b(मौसम|तापमान)\s*(कैसा है|बताओ)\b/i,
    ],
    action: 'GET_WEATHER',
    response: 'Fetching current weather information.',
    priority: 'medium',
  },
  {
    command: 'find_shelter',
    patterns: [
      /\b(find|where|nearest|closest)\s*(is\s*)?(the\s*)?(shelter|refuge|safe\s*place)\b/i,
      /\b(आश्रय|शरण|सुरक्षित जगह)\s*(कहाँ है|खोजो)\b/i,
    ],
    action: 'FIND_SHELTER',
    response: 'Searching for nearest shelter. Navigation will start shortly.',
    priority: 'medium',
  },
  {
    command: 'find_hospital',
    patterns: [
      /\b(find|where|nearest|closest)\s*(is\s*)?(the\s*)?(hospital|clinic|medical)\b/i,
      /\b(अस्पताल|हॉस्पिटल)\s*(कहाँ है|खोजो)\b/i,
    ],
    action: 'FIND_HOSPITAL',
    response: 'Finding nearest hospital with emergency services.',
    priority: 'medium',
  },
  {
    command: 'evacuation_route',
    patterns: [
      /\b(evacuation|escape|exit)\s*(route|path|way)\b/i,
      /\b(निकासी|बचाव)\s*(रास्ता|मार्ग)\b/i,
    ],
    action: 'GET_EVACUATION_ROUTE',
    response: 'Calculating safest evacuation route from your location.',
    priority: 'medium',
  },
  
  // Status commands
  {
    command: 'report_safe',
    patterns: [
      /\b(i'?m|we'?re|we\s+are)\s*(safe|okay|ok|fine)\b/i,
      /\b(मैं|हम)\s*(सुरक्षित|ठीक)\s*(हूँ|हैं)\b/i,
    ],
    action: 'MARK_SAFE',
    response: 'Great! Marking you as safe. Your family will be notified.',
    priority: 'medium',
  },
  {
    command: 'need_help',
    patterns: [
      /\b(i|we)\s*(need|require)\s*(help|assistance|rescue)\b/i,
      /\b(मुझे|हमें)\s*(मदद|सहायता)\s*(चाहिए)\b/i,
    ],
    action: 'REQUEST_HELP',
    response: 'Help request registered. Rescue team has been notified of your location.',
    priority: 'high',
  },
  {
    command: 'people_trapped',
    patterns: [
      /\b(people|someone|trapped|stuck)\b.*\b(trapped|stuck|building)\b/i,
      /\b(लोग|कोई)\s*(फंसे|फंसा)\s*(हैं|है)\b/i,
    ],
    action: 'REPORT_TRAPPED',
    parameters: ['count', 'location'],
    response: 'Reporting trapped people. Please provide more details if possible.',
    priority: 'high',
  },
  
  // Navigation commands
  {
    command: 'start_navigation',
    patterns: [
      /\b(navigate|take\s+me|go)\s*(to)\b/i,
      /\b(नेविगेट|ले जाओ)\b/i,
    ],
    action: 'START_NAVIGATION',
    response: 'Starting navigation. Please follow the voice instructions.',
    priority: 'low',
  },
  {
    command: 'stop_navigation',
    patterns: [
      /\b(stop|cancel|end)\s*(navigation|directions)\b/i,
    ],
    action: 'STOP_NAVIGATION',
    response: 'Navigation stopped.',
    priority: 'low',
  },
  
  // Assistant commands
  {
    command: 'repeat',
    patterns: [
      /\b(repeat|say\s+that\s+again|what)\b/i,
    ],
    action: 'REPEAT_LAST',
    response: 'Repeating the last message.',
    priority: 'low',
  },
  {
    command: 'stop_listening',
    patterns: [
      /\b(stop|cancel|never\s+mind|quiet)\b/i,
    ],
    action: 'STOP_LISTENING',
    response: 'Voice assistant paused. Say "Hey Alert" to activate again.',
    priority: 'low',
  },
];

// Wake words for activation
const WAKE_WORDS = ['hey alert', 'rescue ping', 'help alert', 'emergency'];

// Voice Assistant Service Class
class VoiceAssistantService {
  private static instance: VoiceAssistantService;
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private currentLanguage: SupportedLanguage = 'en-IN';
  private lastResponse: string = '';
  private commandHistory: RecognitionResult[] = [];
  private onCommandCallback: ((action: string, data?: Record<string, unknown>) => void) | null = null;
  private onStatusChangeCallback: ((status: string) => void) | null = null;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeRecognition();
  }

  public static getInstance(): VoiceAssistantService {
    if (!VoiceAssistantService.instance) {
      VoiceAssistantService.instance = new VoiceAssistantService();
    }
    return VoiceAssistantService.instance;
  }

  /**
   * Initialize speech recognition
   */
  private initializeRecognition(): void {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition || 
                         (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage;
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = this.handleRecognitionResult.bind(this);
    this.recognition.onerror = this.handleRecognitionError.bind(this);
    this.recognition.onend = this.handleRecognitionEnd.bind(this);
  }

  /**
   * Handle recognition results
   */
  private handleRecognitionResult(event: SpeechRecognitionEvent): void {
    const results = event.results;
    
    for (let i = event.resultIndex; i < results.length; i++) {
      const result = results[i];
      const transcript = result[0].transcript.toLowerCase().trim();
      const confidence = result[0].confidence;
      
      const recognitionResult: RecognitionResult = {
        transcript,
        confidence,
        language: this.currentLanguage,
        timestamp: new Date(),
        isFinal: result.isFinal,
      };
      
      if (result.isFinal) {
        this.commandHistory.push(recognitionResult);
        this.processCommand(transcript);
      }
    }
  }

  /**
   * Process recognized command
   */
  private processCommand(transcript: string): void {
    // Check for wake word first
    const hasWakeWord = WAKE_WORDS.some(wake => transcript.includes(wake));
    
    if (hasWakeWord || this.isListening) {
      // Remove wake word from transcript
      let cleanTranscript = transcript;
      WAKE_WORDS.forEach(wake => {
        cleanTranscript = cleanTranscript.replace(wake, '').trim();
      });
      
      // Check for emergency keywords first (highest priority)
      const langConfig = LANGUAGE_CONFIG[this.currentLanguage];
      const hasEmergencyKeyword = langConfig.emergencyKeywords.some(kw => 
        transcript.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (hasEmergencyKeyword) {
        this.handleEmergencyCommand(transcript);
        return;
      }
      
      // Match against command patterns
      for (const command of VOICE_COMMANDS) {
        for (const pattern of command.patterns) {
          if (pattern.test(cleanTranscript)) {
            this.executeCommand(command, cleanTranscript);
            return;
          }
        }
      }
      
      // No command matched
      this.speak("I didn't understand that. Please try again or say 'help' for emergency assistance.");
    }
  }

  /**
   * Handle emergency commands
   */
  private handleEmergencyCommand(transcript: string): void {
    this.speak("Emergency detected! Activating emergency protocols.");
    
    if (this.onCommandCallback) {
      this.onCommandCallback('EMERGENCY_DETECTED', { transcript });
    }
    
    this.onStatusChangeCallback?.('emergency');
  }

  /**
   * Execute matched command
   */
  private executeCommand(command: VoiceCommand, transcript: string): void {
    // Speak response
    this.speak(command.response);
    this.lastResponse = command.response;
    
    // Extract parameters if needed
    const params: Record<string, string> = {};
    if (command.parameters) {
      // Simple parameter extraction
      const numbers = transcript.match(/\d+/g);
      if (numbers && command.parameters.includes('count')) {
        params.count = numbers[0];
      }
    }
    
    // Trigger callback
    if (this.onCommandCallback) {
      this.onCommandCallback(command.action, params);
    }
    
    this.onStatusChangeCallback?.(command.priority);
  }

  /**
   * Handle recognition errors
   */
  private handleRecognitionError(event: SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error:', event.error);
    
    switch (event.error) {
      case 'no-speech':
        // Silent error - just restart
        break;
      case 'audio-capture':
        this.speak('Microphone not available. Please check your audio settings.');
        break;
      case 'not-allowed':
        this.speak('Microphone access denied. Please enable microphone permissions.');
        break;
      default:
        this.speak('Voice recognition error. Please try again.');
    }
    
    this.onStatusChangeCallback?.('error');
  }

  /**
   * Handle recognition end
   */
  private handleRecognitionEnd(): void {
    // Restart if still supposed to be listening
    if (this.isListening && this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.log('Recognition restart failed:', e);
      }
    }
  }

  /**
   * Start listening
   */
  public startListening(): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      this.onStatusChangeCallback?.('listening');
      return true;
    } catch (e) {
      console.error('Failed to start recognition:', e);
      return false;
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      this.onStatusChangeCallback?.('stopped');
    }
  }

  /**
   * Speak text
   */
  public speak(text: string, priority: boolean = false): void {
    if (priority) {
      this.synthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Select appropriate voice
    const voices = this.synthesis.getVoices();
    const langVoice = voices.find(v => v.lang.startsWith(this.currentLanguage.split('-')[0]));
    if (langVoice) {
      utterance.voice = langVoice;
    }
    
    this.synthesis.speak(utterance);
    this.lastResponse = text;
  }

  /**
   * Set language
   */
  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): typeof LANGUAGE_CONFIG {
    return LANGUAGE_CONFIG;
  }

  /**
   * Set command callback
   */
  public onCommand(callback: (action: string, data?: Record<string, unknown>) => void): void {
    this.onCommandCallback = callback;
  }

  /**
   * Set status change callback
   */
  public onStatusChange(callback: (status: string) => void): void {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Get command history
   */
  public getHistory(): RecognitionResult[] {
    return [...this.commandHistory];
  }

  /**
   * Repeat last response
   */
  public repeatLast(): void {
    if (this.lastResponse) {
      this.speak(this.lastResponse);
    }
  }

  /**
   * Check if listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Export service instance
export const voiceAssistantService = VoiceAssistantService.getInstance();

// Styled components
const AssistantContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1000;
`;

const VoiceButton = styled.button<{ $isListening: boolean; $isEmergency: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.$isEmergency ? '#dc3545' : 
    props.$isListening ? '#28a745' : '#007bff'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }
  
  ${props => props.$isListening && `
    animation: pulse 1.5s infinite;
  `}
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(40, 167, 69, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
    }
  }
`;

const MicIcon = styled.svg`
  width: 30px;
  height: 30px;
  fill: currentColor;
`;

const StatusIndicator = styled.div<{ $status: string }>`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => 
    props.$status === 'listening' ? '#28a745' :
    props.$status === 'emergency' ? '#dc3545' :
    props.$status === 'error' ? '#ffc107' : '#6c757d'};
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TranscriptPanel = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
`;

const TranscriptText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
`;

const LanguageSelector = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const HelpText = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: #666;
`;

// Voice Assistant Component
interface VoiceAssistantProps {
  onCommand?: (action: string, data?: Record<string, unknown>) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('en-IN');
  const [showPanel, setShowPanel] = useState(false);
  const serviceRef = useRef(voiceAssistantService);

  useEffect(() => {
    const service = serviceRef.current;
    
    service.onCommand((action, data) => {
      setTranscript(action);
      if (action === 'EMERGENCY_DETECTED') {
        setIsEmergency(true);
        setTimeout(() => setIsEmergency(false), 5000);
      }
      onCommand?.(action, data);
    });
    
    service.onStatusChange((newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'listening') {
        setIsListening(true);
      } else if (newStatus === 'stopped') {
        setIsListening(false);
      } else if (newStatus === 'emergency') {
        setIsEmergency(true);
      }
    });
  }, [onCommand]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      serviceRef.current.stopListening();
      setShowPanel(false);
    } else {
      const started = serviceRef.current.startListening();
      if (started) {
        setShowPanel(true);
        serviceRef.current.speak('Voice assistant activated. How can I help?');
      }
    }
  }, [isListening]);

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLanguage;
    setLanguage(newLang);
    serviceRef.current.setLanguage(newLang);
    serviceRef.current.speak(`Language changed to ${LANGUAGE_CONFIG[newLang].name}`);
  }, []);

  return (
    <AssistantContainer>
      <TranscriptPanel $visible={showPanel}>
        <TranscriptText>
          {transcript || 'Listening for commands...'}
        </TranscriptText>
        <LanguageSelector value={language} onChange={handleLanguageChange}>
          {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
            <option key={code} value={code}>
              {config.nativeName} ({config.name})
            </option>
          ))}
        </LanguageSelector>
        <HelpText>
          Say "Help" or "Emergency" for immediate assistance
        </HelpText>
      </TranscriptPanel>
      
      <VoiceButton
        onClick={toggleListening}
        $isListening={isListening}
        $isEmergency={isEmergency}
        aria-label={isListening ? 'Stop voice assistant' : 'Start voice assistant'}
      >
        <StatusIndicator $status={status}>
          {status === 'listening' ? '●' : status === 'error' ? '!' : ''}
        </StatusIndicator>
        <MicIcon viewBox="0 0 24 24">
          {isListening ? (
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V21h-2v-5.07z"/>
          ) : (
            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
          )}
        </MicIcon>
      </VoiceButton>
    </AssistantContainer>
  );
};

export type { VoiceCommand, RecognitionResult, VoiceResponse, SupportedLanguage };
