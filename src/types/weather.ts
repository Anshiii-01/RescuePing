// Enhanced Weather Data Types for Rescue Ping
// Supports both backend API and OpenWeatherMap responses

export interface BaseWeatherData {
  temperature: number;
  temperature_feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction?: number;
  pressure: number;
  conditions: string;
  visibility: number;
  last_updated: string;
  source: string;
  is_real: boolean;
  cached?: boolean;
}

export interface EnhancedWeatherData extends BaseWeatherData {
  // Optional OpenWeatherMap specific fields
  weather_icon?: string;
  precipitation?: number;
  uv_index?: number;
  regional_enhancement?: boolean;
  error?: string;
  
  // Raw OpenWeatherMap data for enhanced components
  weather?: Array<{
    id?: number;
    main?: string;
    description: string;
    icon?: string;
  }>;
  
  main?: {
    temp: number;
    feels_like: number;
    temp_min?: number;
    temp_max?: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  
  wind?: {
    speed: number;
    deg?: number;
    gust?: number;
  };
  
  sys?: {
    type?: number;
    id?: number;
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  
  // Allow any additional properties for flexibility
  [key: string]: any;
}

// OpenWeatherMap API Response (for type safety)
export interface OpenWeatherMapResponse {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Reverse geocoding response
export interface ReverseGeocodeResponse {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Weather API configuration
export interface WeatherApiConfig {
  maxRetries: number;
  retryDelay: number; // Base delay in ms
  timeout: number;    // Request timeout in ms
  exponentialBackoff: boolean;
}

export const DEFAULT_WEATHER_CONFIG: WeatherApiConfig = {
  maxRetries: 3,
  retryDelay: 1000,   // Start with 1 second
  timeout: 8000,      // 8 second timeout
  exponentialBackoff: true
};

// Weather service response with retry info
export interface WeatherServiceResponse {
  data: EnhancedWeatherData;
  retries: number;
  source: 'backend' | 'openweathermap' | 'fallback';
  timing: {
    start: number;
    end: number;
    duration: number;
  };
}

// Weather alert severity mapping
export enum WeatherAlertSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate', 
  SEVERE = 'severe',
  EXTREME = 'extreme'
}

// Weather condition categories for risk assessment
export enum WeatherConditionType {
  CLEAR = 'clear',
  CLOUDS = 'clouds',
  RAIN = 'rain',
  DRIZZLE = 'drizzle',
  THUNDERSTORM = 'thunderstorm',
  SNOW = 'snow',
  MIST = 'mist',
  SMOKE = 'smoke',
  HAZE = 'haze',
  DUST = 'dust',
  FOG = 'fog',
  SAND = 'sand',
  ASH = 'ash',
  SQUALL = 'squall',
  TORNADO = 'tornado'
}

// Utility function to classify weather conditions
export function classifyWeatherCondition(condition: string): WeatherConditionType {
  const lower = condition.toLowerCase();
  
  if (lower.includes('clear')) return WeatherConditionType.CLEAR;
  if (lower.includes('cloud')) return WeatherConditionType.CLOUDS;
  if (lower.includes('rain')) return WeatherConditionType.RAIN;
  if (lower.includes('drizzle')) return WeatherConditionType.DRIZZLE;
  if (lower.includes('thunder') || lower.includes('storm')) return WeatherConditionType.THUNDERSTORM;
  if (lower.includes('snow')) return WeatherConditionType.SNOW;
  if (lower.includes('mist')) return WeatherConditionType.MIST;
  if (lower.includes('smoke')) return WeatherConditionType.SMOKE;
  if (lower.includes('haze')) return WeatherConditionType.HAZE;
  if (lower.includes('dust')) return WeatherConditionType.DUST;
  if (lower.includes('fog')) return WeatherConditionType.FOG;
  if (lower.includes('sand')) return WeatherConditionType.SAND;
  if (lower.includes('ash')) return WeatherConditionType.ASH;
  if (lower.includes('squall')) return WeatherConditionType.SQUALL;
  if (lower.includes('tornado')) return WeatherConditionType.TORNADO;
  
  return WeatherConditionType.CLEAR; // Default fallback
}

// Weather-based risk factors for ML models
export interface WeatherRiskFactors {
  temperature_risk: number;    // 0-1 scale
  humidity_risk: number;       // 0-1 scale  
  wind_risk: number;          // 0-1 scale
  precipitation_risk: number;  // 0-1 scale
  visibility_risk: number;     // 0-1 scale
  pressure_risk: number;       // 0-1 scale
  overall_weather_risk: number; // Combined 0-1 scale
}

// Calculate weather risk factors from weather data
export function calculateWeatherRisk(weather: EnhancedWeatherData): WeatherRiskFactors {
  // Temperature risk (extreme temperatures increase risk)
  const tempRisk = Math.min(1, Math.max(0, 
    (Math.abs(weather.temperature - 20) / 30) // Risk increases as temp moves away from 20°C
  ));
  
  // Humidity risk (very low or very high humidity)
  const humidityRisk = Math.min(1, Math.max(0,
    Math.abs(weather.humidity - 50) / 50  // Risk increases as humidity moves away from 50%
  ));
  
  // Wind risk (high winds increase risk)
  const windRisk = Math.min(1, weather.wind_speed / 20); // Risk increases with wind speed
  
  // Visibility risk (low visibility increases risk)
  const visibilityRisk = Math.min(1, Math.max(0, (10 - weather.visibility) / 10));
  
  // Pressure risk (extreme pressure changes)
  const pressureRisk = Math.min(1, Math.max(0, Math.abs(weather.pressure - 1013) / 50));
  
  // Precipitation risk (if available)
  const precipitationRisk = weather.precipitation 
    ? Math.min(1, weather.precipitation / 50) // Heavy rain increases risk
    : 0;
  
  // Overall risk (weighted average)
  const overallRisk = (
    tempRisk * 0.2 +
    humidityRisk * 0.15 +
    windRisk * 0.25 +
    visibilityRisk * 0.15 +
    pressureRisk * 0.1 +
    precipitationRisk * 0.15
  );
  
  return {
    temperature_risk: tempRisk,
    humidity_risk: humidityRisk,
    wind_risk: windRisk,
    precipitation_risk: precipitationRisk,
    visibility_risk: visibilityRisk,
    pressure_risk: pressureRisk,
    overall_weather_risk: overallRisk
  };
}