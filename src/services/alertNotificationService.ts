/**
 * ALERT NOTIFICATION SERVICE WITH SOUND & HAPTIC FEEDBACK
 * Provides multi-sensory alerts for critical disaster notifications
 * Issue #15 Implementation
 */

export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AlertNotificationPreferences {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  volume: number; // 0-1
}

// Default user preferences
const DEFAULT_PREFERENCES: AlertNotificationPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  volume: 0.8,
};

const STORAGE_KEY = 'alert-notification-preferences';

/**
 * Alert Notification Service Class
 */
class AlertNotificationService {
  private audioContext: AudioContext | null = null;
  private preferences: AlertNotificationPreferences;
  
  constructor() {
    this.preferences = this.loadPreferences();
    this.initializeAudioContext();
  }
  
  /**
   * Load user preferences from localStorage
   */
  private loadPreferences(): AlertNotificationPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('[AlertNotification] Failed to load preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  }
  
  /**
   * Save user preferences to localStorage
   */
  public savePreferences(prefs: Partial<AlertNotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('[AlertNotification] Failed to save preferences:', error);
    }
  }
  
  /**
   * Get current preferences
   */
  public getPreferences(): AlertNotificationPreferences {
    return { ...this.preferences };
  }
  
  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.error('[AlertNotification] Failed to initialize AudioContext:', error);
    }
  }
  
  /**
   * Trigger alert notification with appropriate sound and haptic feedback
   */
  public async triggerAlert(level: AlertLevel, title: string, message?: string): Promise<void> {
    console.log(`🔔 [AlertNotification] Triggering ${level} alert: ${title}`);
    
    // Trigger sound if enabled
    if (this.preferences.soundEnabled) {
      await this.playAlertSound(level);
    }
    
    // Trigger haptic feedback if enabled
    if (this.preferences.hapticEnabled) {
      await this.triggerHapticFeedback(level);
    }
    
    // Show browser notification if permissions granted
    await this.showBrowserNotification(level, title, message);
  }
  
  /**
   * Play alert sound based on severity level
   */
  private async playAlertSound(level: AlertLevel): Promise<void> {
    if (!this.audioContext) {
      console.warn('[AlertNotification] AudioContext not available');
      return;
    }
    
    try {
      // Resume AudioContext if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      const config = this.getSoundConfig(level);
      
      // Create oscillator for tone
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Configure sound based on alert level
      oscillator.type = config.waveform;
      oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
      
      // Set volume with user preference
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.preferences.volume * config.volume,
        this.audioContext.currentTime + 0.1
      );
      
      // Start sound
      oscillator.start(this.audioContext.currentTime);
      
      // Handle pattern (beeps for alerts)
      if (config.pattern.length > 1) {
        this.playPattern(oscillator, gainNode, config);
      } else {
        // Single continuous tone
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + config.duration
        );
        oscillator.stop(this.audioContext.currentTime + config.duration);
      }
      
      console.log(`🔊 [AlertNotification] Playing ${level} alert sound`);
    } catch (error) {
      console.error('[AlertNotification] Failed to play sound:', error);
    }
  }
  
  /**
   * Play patterned sound (for HIGH and MEDIUM alerts)
   */
  private playPattern(
    oscillator: OscillatorNode,
    gainNode: GainNode,
    config: SoundConfig
  ): void {
    if (!this.audioContext) return;
    
    let time = this.audioContext.currentTime;
    
    config.pattern.forEach((duration, index) => {
      if (index % 2 === 0) {
        // On
        gainNode.gain.setValueAtTime(
          this.preferences.volume * config.volume,
          time
        );
      } else {
        // Off
        gainNode.gain.setValueAtTime(0, time);
      }
      time += duration;
    });
    
    oscillator.stop(time);
  }
  
  /**
   * Get sound configuration based on alert level
   */
  private getSoundConfig(level: AlertLevel): SoundConfig {
    switch (level) {
      case 'CRITICAL':
        return {
          frequency: 880, // A5 - high pitched, urgent
          waveform: 'square',
          volume: 1.0,
          duration: 3.0,
          pattern: [0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1], // Continuous alarm
        };
        
      case 'HIGH':
        return {
          frequency: 659, // E5 - moderately high
          waveform: 'sine',
          volume: 0.8,
          duration: 1.5,
          pattern: [0.3, 0.2, 0.3, 0.2, 0.3], // Three beeps
        };
        
      case 'MEDIUM':
        return {
          frequency: 523, // C5 - middle tone
          waveform: 'sine',
          volume: 0.6,
          duration: 0.5,
          pattern: [0.5], // Single beep
        };
        
      case 'LOW':
        return {
          frequency: 440, // A4 - low tone
          waveform: 'sine',
          volume: 0.4,
          duration: 0.3,
          pattern: [0.3], // Brief notification
        };
    }
  }
  
  /**
   * Trigger haptic feedback based on alert level
   */
  private async triggerHapticFeedback(level: AlertLevel): Promise<void> {
    if (!('vibrate' in navigator)) {
      console.warn('[AlertNotification] Vibration API not supported');
      return;
    }
    
    try {
      const pattern = this.getHapticPattern(level);
      navigator.vibrate(pattern);
      console.log(`📳 [AlertNotification] Triggered ${level} haptic feedback`);
    } catch (error) {
      console.error('[AlertNotification] Failed to trigger haptic:', error);
    }
  }
  
  /**
   * Get haptic vibration pattern based on alert level
   */
  private getHapticPattern(level: AlertLevel): number[] {
    switch (level) {
      case 'CRITICAL':
        // Continuous vibration pattern
        return [200, 100, 200, 100, 200, 100, 200, 100, 200];
        
      case 'HIGH':
        // Three strong bursts
        return [400, 200, 400, 200, 400];
        
      case 'MEDIUM':
        // Single vibration
        return [300];
        
      case 'LOW':
        // Silent (no vibration)
        return [];
    }
  }
  
  /**
   * Show browser notification
   */
  private async showBrowserNotification(
    level: AlertLevel,
    title: string,
    message?: string
  ): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('[AlertNotification] Notifications API not supported');
      return;
    }
    
    try {
      // Request permission if not granted
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      if (Notification.permission === 'granted') {
        const icon = this.getNotificationIcon(level);
        const urgency = this.getNotificationUrgency(level);
        
        new Notification(title, {
          body: message || `${level} severity alert`,
          icon: icon,
          badge: '/logo192.png',
          tag: `alert-${level}-${Date.now()}`,
          requireInteraction: level === 'CRITICAL', // Stay on screen for critical alerts
          data: { level, urgency },
        } as NotificationOptions);
        
        console.log(`🔔 [AlertNotification] Browser notification shown: ${title}`);
      }
    } catch (error) {
      console.error('[AlertNotification] Failed to show notification:', error);
    }
  }
  
  /**
   * Get notification icon based on alert level
   */
  private getNotificationIcon(level: AlertLevel): string {
    switch (level) {
      case 'CRITICAL':
        return '🚨';
      case 'HIGH':
        return '⚠️';
      case 'MEDIUM':
        return '⚡';
      case 'LOW':
        return 'ℹ️';
    }
  }
  
  /**
   * Get notification urgency
   */
  private getNotificationUrgency(level: AlertLevel): 'critical' | 'high' | 'normal' {
    switch (level) {
      case 'CRITICAL':
        return 'critical';
      case 'HIGH':
        return 'high';
      default:
        return 'normal';
    }
  }
  
  /**
   * Request notification permissions
   */
  public async requestPermissions(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[AlertNotification] Failed to request permissions:', error);
      return false;
    }
  }
  
  /**
   * Check if notifications are supported and enabled
   */
  public isNotificationSupported(): boolean {
    return 'Notification' in window;
  }
  
  /**
   * Check if vibration is supported
   */
  public isVibrationSupported(): boolean {
    return 'vibrate' in navigator;
  }
  
  /**
   * Test alert at specific level
   */
  public async testAlert(level: AlertLevel): Promise<void> {
    await this.triggerAlert(
      level,
      `Test ${level} Alert`,
      'This is a test notification'
    );
  }
}

// Sound configuration interface
interface SoundConfig {
  frequency: number;
  waveform: OscillatorType;
  volume: number;
  duration: number;
  pattern: number[]; // On/off pattern in seconds
}

// Export singleton instance
export const alertNotificationService = new AlertNotificationService();

export default alertNotificationService;
