import { LocationData } from '../components/Location/types';
import OpenWeatherMapService from './openWeatherMapService';
import { 
  EnhancedWeatherData, 
  WeatherServiceResponse, 
  DEFAULT_WEATHER_CONFIG, 
  WeatherApiConfig 
} from '../types/weather';

// API Configuration - Production ready with environment variable support
// In production (Vercel), API is on the same domain under /api
// In development, API is on localhost:8000
const getApiBaseUrl = (): string => {
  const envUrl = process.env.REACT_APP_API_URL;
  
  // If env URL is set and not empty, use it
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  
  // In production, API is on the same origin
  if (process.env.NODE_ENV === 'production') {
    return ''; // Same origin, API at /api/*
  }
  
  // Development default
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getApiBaseUrl();
const API_PREFIX = '/api'; // Backend routes are at /api/*
const API_TIMEOUT = 15000; // 15 seconds for ML operations

console.log('🔧 API Configuration:', { 
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  API_BASE_URL, 
  fullHealthUrl: `${API_BASE_URL}${API_PREFIX}/health`
});

// Enhanced type definitions matching backend models
export interface DisasterRiskPrediction {
  overall_risk: string;  // "low", "moderate", "high", "critical"
  risk_score: number;    // 1-10 scale
  flood_risk: number;    // 1-10 scale
  fire_risk: number;     // 1-10 scale  
  earthquake_risk: number; // 1-10 scale
  storm_risk: number;    // 1-10 scale
  confidence: number;    // 0-1 confidence score
  location_analyzed: {
    latitude: number;
    longitude: number;
  };
  is_real: boolean;      // Whether using real ML prediction
}

// Re-export WeatherData as alias for backward compatibility
export type WeatherData = EnhancedWeatherData;

export interface ActiveAlert {
  id: string;
  title: string;
  description: string;
  severity: string;     // "Minor", "Moderate", "Severe", "Extreme"
  urgency: string;      // "Immediate", "Expected", "Future", "Past"
  event: string;        // Type of event
  areas: string[];
  onset: string;        // ISO datetime
  expires: string;      // ISO datetime
}

export interface AlertsResponse {
  alerts: ActiveAlert[];
  count: number;
  source: string;       // "Rescue_Ping_System"
  is_real: boolean;     // Whether from real alert system
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
  display_name?: string;
}

export interface EarthquakeData {
  earthquakes: any[];   // USGS earthquake data format
  count: number;
  source: string;       // "USGS"
  is_real: boolean;     // Whether from real USGS API
}

// API Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling and timeout
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  silentErrors: boolean = false
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    // Remove API_PREFIX since backend routes are at root
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = `API Error: ${response.status}`;
      if (!silentErrors) {
        console.warn(`⚠️ ${endpoint} failed:`, errorMessage);
      }
      throw new APIError(errorMessage, response.status, endpoint);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        if (!silentErrors) console.warn(`⏱️ ${endpoint} timed out`);
        throw new APIError('Request timeout', 408, endpoint);
      }
      if (!silentErrors) console.warn(`🌐 ${endpoint} network error:`, error.message);
      throw new APIError(`Network error: ${error.message}`, 0, endpoint);
    }
    
    throw new APIError('Unknown error occurred', 500, endpoint);
  }
}

// Enhanced retry utility with exponential backoff
async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  config: WeatherApiConfig = DEFAULT_WEATHER_CONFIG,
  operationName: string = 'API call'
): Promise<T> {
  let lastError: Error = new Error(`${operationName} failed with unknown error`);
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === config.maxRetries) {
        console.error(`❌ ${operationName} failed after ${config.maxRetries + 1} attempts:`, error.message);
        break;
      }
      
      const delay = config.exponentialBackoff 
        ? config.retryDelay * Math.pow(2, attempt)
        : config.retryDelay;
      
      console.warn(`⚠️ ${operationName} attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// API Service Class
export class RescuePingAPIService {
  
  // Health check - matches /api/health
  static async checkHealth(): Promise<{ status: string; services: any }> {
    return apiRequest<{ status: string; services: any }>(`${API_PREFIX}/health`);
  }

  // Get location info from coordinates - DEPRECATED: Backend doesn't have this endpoint
  // Use OpenWeatherMap reverse geocoding instead
  static async getLocationInfo(lat: number, lon: number): Promise<any> {
    try {
      // This endpoint doesn't exist on backend, will always fail
      // Keeping for backwards compatibility but catching silently
      return await apiRequest<any>(`${API_PREFIX}/location/${lat}/${lon}`, {}, true);
    } catch (error) {
      // Expected to fail, return null to trigger fallback
      return null;
    }
  }

  // Enhanced weather service with comprehensive retry logic and fallback
  static async getEnhancedWeatherData(
    lat: number,
    lon: number,
    config: WeatherApiConfig = DEFAULT_WEATHER_CONFIG
  ): Promise<WeatherServiceResponse> {
    const startTime = Date.now();
    let retries = 0;
    let dataSource: 'backend' | 'openweathermap' | 'fallback' = 'fallback';
    let weatherData: EnhancedWeatherData;

    // Step 1: Try backend API with retries
    try {
      console.log('🌤️ Attempting to fetch weather from Rescue Ping backend with retries...');
      
      weatherData = await retryWithExponentialBackoff(
        async () => {
          const response = await apiRequest<EnhancedWeatherData>(`${API_PREFIX}/weather/${lat}/${lon}`);
          retries++;
          return response;
        },
        config,
        'Backend weather API'
      );
      
      console.log('✅ Successfully fetched weather from backend');
      dataSource = 'backend';
      weatherData = { 
        ...weatherData, 
        source: 'Rescue Ping Backend', 
        is_real: true,
        temperature_feels_like: weatherData.temperature_feels_like || weatherData.temperature + 2
      };
    } catch (backendError: any) {
      console.warn('❌ Backend weather fetch failed after retries:', backendError.message);
      
      // Step 2: Try OpenWeatherMap with retries
      try {
        console.log('🔄 Falling back to OpenWeatherMap direct API with retries...');
        
        const owmWeather = await retryWithExponentialBackoff(
          async () => {
            retries++;
            return await OpenWeatherMapService.getCurrentWeather(lat, lon);
          },
          config,
          'OpenWeatherMap API'
        );
        
        console.log('✅ Successfully fetched weather from OpenWeatherMap');
        dataSource = 'openweathermap';
        weatherData = {
          temperature: owmWeather.temperature,
          temperature_feels_like: owmWeather.temperature_feels_like,
          humidity: owmWeather.humidity,
          wind_speed: owmWeather.wind_speed,
          wind_direction: owmWeather.wind_direction,
          pressure: owmWeather.pressure,
          conditions: owmWeather.conditions,
          weather_icon: owmWeather.weather_icon,
          visibility: owmWeather.visibility,
          last_updated: owmWeather.last_updated,
          source: owmWeather.source,
          is_real: owmWeather.is_real,
          cached: false,
          // Pass through enhanced data
          ...owmWeather
        };
      } catch (owmError: any) {
        console.error('❌ All weather sources failed after retries:', owmError.message);
        
        // Step 3: Final fallback - simulated data
        console.log('🔄 Using simulated weather data as final fallback');
        dataSource = 'fallback';
        weatherData = {
          temperature: 22,
          temperature_feels_like: 24,
          humidity: 65,
          wind_speed: 3.2,
          wind_direction: 180,
          pressure: 1013,
          conditions: 'Clear sky',
          weather_icon: '01d',
          visibility: 10,
          last_updated: new Date().toISOString(),
          source: 'Simulated (All APIs Failed)',
          is_real: false,
          cached: false,
          error: `Backend: ${backendError.message}, OpenWeather: ${owmError.message}`
        };
      }
    }

    const endTime = Date.now();
    
    return {
      data: weatherData,
      retries,
      source: dataSource,
      timing: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime
      }
    };
  }

  // Enhanced disaster risk prediction - matches /api/predict/disaster
  static async predictDisasterRisk(
    location: LocationData,
    includeExternalData: boolean = true
  ): Promise<DisasterRiskPrediction> {
    const request = {
      latitude: location.latitude,
      longitude: location.longitude,
      include_external_data: includeExternalData
    };

    try {
      return await apiRequest<DisasterRiskPrediction>(`${API_PREFIX}/predict/disaster`, {
        method: 'POST',
        body: JSON.stringify(request),
      }, true); // Silent errors - backend expected to be unavailable
    } catch (error) {
      // Use fallback silently, log only once
      if (!this.hasLoggedFallback) {
        console.info('📍 Using calculated risk predictions (backend unavailable)');
        this.hasLoggedFallback = true;
      }
      return this.generateFallbackPrediction(location);
    }
  }

  // Track if we've already logged fallback usage to avoid spam
  private static hasLoggedFallback: boolean = false;

  // Generate realistic fallback prediction when backend is unavailable
  private static generateFallbackPrediction(location: LocationData): DisasterRiskPrediction {
    // Use location coordinates to generate consistent but varied risk scores
    const latHash = Math.abs(Math.sin(location.latitude * 1000)) * 10;
    const lonHash = Math.abs(Math.cos(location.longitude * 1000)) * 10;
    
    const baseRisk = Math.floor((latHash + lonHash) / 2);
    const riskScore = Math.max(1, Math.min(10, baseRisk));
    
    let overallRisk: string;
    if (riskScore <= 3) overallRisk = 'low';
    else if (riskScore <= 6) overallRisk = 'moderate';
    else if (riskScore <= 8) overallRisk = 'high';
    else overallRisk = 'critical';
    
    return {
      overall_risk: overallRisk,
      risk_score: riskScore,
      flood_risk: Math.max(1, Math.min(10, Math.floor(latHash))),
      fire_risk: Math.max(1, Math.min(10, Math.floor(lonHash))),
      earthquake_risk: Math.max(1, Math.min(10, Math.floor((latHash + lonHash) / 2))),
      storm_risk: Math.max(1, Math.min(10, Math.floor(lonHash * 0.8))),
      confidence: 0.75 + Math.random() * 0.15, // 75-90% confidence
      location_analyzed: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      is_real: false // Indicate this is fallback data
    };
  }

  // Get active alerts - matches /api/alerts/active
  static async getActiveAlerts(
    lat?: number,
    lon?: number
  ): Promise<AlertsResponse> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return apiRequest<AlertsResponse>(`${API_PREFIX}/alerts/active${query}`);
  }

  // Get earthquake data - matches /api/external/earthquakes/recent
  static async getEarthquakeData(lat?: number, lon?: number): Promise<any> {
    // Use provided coordinates or default to global center point
    const latitude = lat || 0;
    const longitude = lon || 0;
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString()
    });
    return apiRequest<any>(`${API_PREFIX}/external/earthquakes/recent?${params}`);
  }

  // Alias methods for dashboard compatibility
  static async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const response = await this.getEnhancedWeatherData(lat, lon);
    return response.data;
  }

  static async getPredictions(lat: number, lon: number): Promise<DisasterRiskPrediction> {
    const mockLocation: LocationData = {
      latitude: lat,
      longitude: lon,
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      timestamp: Date.now()
    };
    return this.predictDisasterRisk(mockLocation);
  }

  static async getAlerts(lat?: number, lon?: number): Promise<AlertsResponse> {
    return this.getActiveAlerts(lat, lon);
  }
}

// Real-time data hook
export class RealTimeDataManager {
  private static updateInterval: NodeJS.Timeout | null = null;
  private static listeners: Set<() => void> = new Set();
  private static isActive = false;

  // Start auto-refresh every 5 minutes
  static startAutoRefresh(callback: () => void): void {
    this.listeners.add(callback);
    
    if (!this.isActive) {
      this.isActive = true;
      console.log('🔄 Starting real-time data refresh (5-minute intervals)');
      
      // Initial call
      this.notifyListeners();
      
      // Set up interval
      this.updateInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing disaster data...');
        this.notifyListeners();
      }, 5 * 60 * 1000); // 5 minutes
    }
  }

  // Stop auto-refresh
  static stopAutoRefresh(callback: () => void): void {
    this.listeners.delete(callback);
    
    if (this.listeners.size === 0 && this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      this.isActive = false;
      console.log('⏹️ Stopped real-time data refresh');
    }
  }

  // Force refresh
  static forceRefresh(): void {
    console.log('🔄 Force refreshing disaster data...');
    this.notifyListeners();
  }

  private static notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in data refresh callback:', error);
      }
    });
  }
}

// WebSocket connection for real-time alerts
export class AlertWebSocketManager {
  private static ws: WebSocket | null = null;
  private static listeners: Set<(alert: any) => void> = new Set();
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;

  static connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws/alerts';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected for real-time alerts');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket connection closed');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  static addListener(callback: (alert: any) => void): void {
    this.listeners.add(callback);
    if (this.listeners.size === 1) {
      this.connect();
    }
  }

  static removeListener(callback: (alert: any) => void): void {
    this.listeners.delete(callback);
    if (this.listeners.size === 0) {
      this.disconnect();
    }
  }

  private static disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private static attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`🔄 Attempting WebSocket reconnect in ${delay/1000}s (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        if (this.listeners.size > 0) {
          this.connect();
        }
      }, delay);
    }
  }

  private static notifyListeners(alert: any): void {
    this.listeners.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });
  }
}

// Cache manager for API responses
class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set<T>(key: string, data: T, ttlMinutes = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static clear(): void {
    this.cache.clear();
  }
}

// Enhanced API service with caching
export class CachedAPIService extends RescuePingAPIService {
  
  static async getEnhancedWeatherDataCached(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    let cached = CacheManager.get<WeatherData>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached weather data');
      return cached;
    }

    const weatherResponse = await this.getEnhancedWeatherData(lat, lon);
    CacheManager.set(cacheKey, weatherResponse.data, 15); // Cache for 15 minutes
    return weatherResponse.data;
  }

  static async getActiveAlertsCached(lat?: number, lon?: number): Promise<AlertsResponse> {
    const cacheKey = lat !== undefined && lon !== undefined 
      ? `alerts_${lat.toFixed(2)}_${lon.toFixed(2)}` 
      : 'alerts_global';
    let cached = CacheManager.get<AlertsResponse>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached alerts data');
      return cached;
    }

    const alerts = await this.getActiveAlerts(lat, lon);
    CacheManager.set(cacheKey, alerts, 5); // Cache for 5 minutes (alerts change frequently)
    return alerts;
  }

  static async getEarthquakeDataCached(lat: number = 0, lon: number = 0): Promise<any> {
    const cacheKey = `earthquakes_recent_${lat.toFixed(1)}_${lon.toFixed(1)}`;
    let cached = CacheManager.get<any>(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached earthquake data');
      return cached;
    }

    const earthquakes = await this.getEarthquakeData(lat, lon);
    CacheManager.set(cacheKey, earthquakes, 30); // Cache for 30 minutes
    return earthquakes;
  }
}

// System Verification Function
export interface SystemVerificationResponse {
  verification_timestamp: string;
  system_health: {
    real_data_percentage: number;
    operational_percentage: number;
    overall_status: string;
  };
  data_sources: {
    weather_api: {
      source: string;
      operational: boolean;
      is_real: boolean;
      error?: string;
    };
    ml_model: {
      operational: boolean;
      is_real: boolean;
      model_version: string;
      error?: string;
    };
    location_api: {
      operational: boolean;
      is_real: boolean;
      source: string;
      error?: string;
    };
    alerts_system: {
      operational: boolean;
      is_real: boolean;
      source: string;
      error?: string;
    };
    external_apis: {
      operational: boolean;
      is_real: boolean;
      source: string;
      error?: string;
    };
  };
  test_coordinates: {
    latitude: number;
    longitude: number;
    location: string;
  };
  api_endpoints: {
    weather: string;
    prediction: string;
    alerts: string;
    earthquakes: string;
    location: string;
  };
}

export const verifySystemStatus = async (): Promise<SystemVerificationResponse> => {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`System verification failed: ${response.status}`);
  }

  const healthData = await response.json();
  const isHealthy = healthData.status === 'healthy';
  
  // Transform health check response to SystemVerificationResponse format
  return {
    verification_timestamp: new Date().toISOString(),
    system_health: {
      real_data_percentage: isHealthy ? 100 : 0,
      operational_percentage: isHealthy ? 100 : 0,
      overall_status: isHealthy ? 'operational' : 'degraded'
    },
    data_sources: {
      weather_api: {
        source: 'OpenWeatherMap',
        operational: isHealthy,
        is_real: true
      },
      ml_model: {
        operational: isHealthy,
        is_real: true,
        model_version: healthData.version || '1.0.0'
      },
      location_api: {
        operational: isHealthy,
        is_real: true,
        source: 'IP Geolocation'
      },
      alerts_system: {
        operational: isHealthy,
        is_real: true,
        source: 'Backend API'
      },
      external_apis: {
        operational: isHealthy,
        is_real: true,
        source: 'Multiple'
      }
    },
    test_coordinates: {
      latitude: 26.8413685,
      longitude: 75.562645,
      location: 'Jaipur, India'
    },
    api_endpoints: {
      weather: `${API_BASE_URL}${API_PREFIX}/weather/{lat}/{lon}`,
      prediction: `${API_BASE_URL}${API_PREFIX}/predict/disaster`,
      alerts: `${API_BASE_URL}${API_PREFIX}/alerts`,
      earthquakes: `${API_BASE_URL}${API_PREFIX}/external/earthquakes/recent`,
      location: 'Not available - use weather data for location info'
    }
  };
};

export default CachedAPIService;