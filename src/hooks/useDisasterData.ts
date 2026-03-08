import { useState, useEffect, useCallback } from 'react';
import { 
  RescuePingAPIService, 
  DisasterRiskPrediction, 
  WeatherData, 
  AlertsResponse, 
  APIError
} from '../services/apiService';
import { LocationData } from '../components/Location/types';
import { useNotifications } from '../contexts/NotificationContext';
import CoordinateResolver from '../services/coordinateResolver';

// Loading states
interface LoadingStates {
  riskPrediction: boolean;
  weather: boolean;
  alerts: boolean;
}

// Error states  
interface ErrorStates {
  riskPrediction: string | null;
  weather: string | null;
  alerts: string | null;
}

// Data states
interface DataStates {
  riskPrediction: DisasterRiskPrediction | null;
  weather: WeatherData | null;
  alerts: AlertsResponse | null;
}

// Real-time disaster data hook
export const useDisasterData = (location: LocationData | null) => {
  const [loading, setLoading] = useState<LoadingStates>({
    riskPrediction: false,
    weather: false,
    alerts: false,
  });

  const [errors, setErrors] = useState<ErrorStates>({
    riskPrediction: null,
    weather: null,
    alerts: null,
  });

  const [data, setData] = useState<DataStates>({
    riskPrediction: null,
    weather: null,
    alerts: null,
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Clear error for specific data type
  const clearError = useCallback((dataType: keyof ErrorStates) => {
    setErrors(prev => ({ ...prev, [dataType]: null }));
  }, []);

  // Handle API errors with user-friendly messages
  const handleApiError = useCallback((error: any, dataType: keyof ErrorStates) => {
    console.error(`${dataType} error:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error instanceof APIError) {
      switch (error.status) {
        case 0:
          message = 'Network connection lost. Please check your internet connection.';
          break;
        case 408:
          message = 'Request timed out. The server might be busy.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          message = 'Server error. Our team has been notified.';
          break;
        case 503:
          message = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          message = `Service error (${error.status}). Please try again.`;
      }
    } else if (error.message) {
      message = error.message;
    }

    setErrors(prev => ({ ...prev, [dataType]: message }));
    
    // Show critical errors as notifications
    if (dataType === 'riskPrediction' || dataType === 'alerts') {
      addNotification({
        title: `${dataType === 'riskPrediction' ? 'Risk Prediction' : 'Alerts'} Error`,
        message,
        type: 'error',
        duration: 8000,
      });
    }
  }, [addNotification]);

  // Fetch disaster risk prediction
  const fetchRiskPrediction = useCallback(async (locationData: LocationData) => {
    if (!locationData) return;

    setLoading(prev => ({ ...prev, riskPrediction: true }));
    clearError('riskPrediction');

    try {
      const prediction = await RescuePingAPIService.predictDisasterRisk(locationData, true);
      setData(prev => ({ ...prev, riskPrediction: prediction }));
      
      // Only show notification if this is real data (backend is working)
      if (prediction.is_real && typeof prediction.overall_risk === 'string' && (prediction.overall_risk === 'high' || prediction.overall_risk === 'critical')) {
        const severity = prediction.overall_risk === 'critical' ? 'critical' : 'high';
        addNotification({
          title: `${severity === 'critical' ? 'CRITICAL' : 'HIGH'} Risk Alert`,
          message: `Overall disaster risk is ${prediction.overall_risk} for your area`,
          type: severity === 'critical' ? 'error' : 'warning',
          duration: severity === 'critical' ? 0 : 10000, // Critical alerts don't auto-dismiss
        });
      }
      
      // Clear any previous errors since we got data (even if fallback)
      clearError('riskPrediction');
    } catch (error) {
      handleApiError(error, 'riskPrediction');
    } finally {
      setLoading(prev => ({ ...prev, riskPrediction: false }));
    }
  }, [clearError, handleApiError, addNotification]);

  // Fetch weather data
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(prev => ({ ...prev, weather: true }));
    clearError('weather');

    try {
      const weatherResponse = await RescuePingAPIService.getEnhancedWeatherData(lat, lon);
      setData(prev => ({ ...prev, weather: weatherResponse.data }));
    } catch (error) {
      handleApiError(error, 'weather');
    } finally {
      setLoading(prev => ({ ...prev, weather: false }));
    }
  }, [clearError, handleApiError]);

  // Fetch active alerts
  const fetchAlerts = useCallback(async (lat: number, lon: number) => {
    setLoading(prev => ({ ...prev, alerts: true }));
    clearError('alerts');

    try {
      const alerts = await RescuePingAPIService.getActiveAlerts(lat, lon);
      setData(prev => ({ ...prev, alerts }));
      
      // Trigger notifications for new critical alerts
      alerts.alerts.forEach(alert => {
        if (alert.severity === 'High' || alert.urgency === 'Immediate') {
          addNotification({
            title: `🚨 ${alert.title}`,
            message: alert.description.substring(0, 100) + (alert.description.length > 100 ? '...' : ''),
            type: 'error',
            duration: 0, // Don't auto-dismiss critical alerts
            actions: [
              {
                label: 'View Details',
                action: () => console.log('View alert details:', alert.id)
              }
            ]
          });
        }
      });
    } catch (error) {
      handleApiError(error, 'alerts');
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
    }
  }, [clearError, handleApiError, addNotification]);

  // Note: Forecast and model performance endpoints removed from backend
  // These functions are kept as stubs to prevent breaking changes

  // Refresh all data - stabilized to prevent infinite loops
  const refreshAllData = useCallback(() => {
    if (!location) return;

    console.log('🔄 Refreshing all disaster data...');
    setLastUpdated(new Date().toISOString());

    // Resolve coordinates once for all API calls to ensure consistency
    const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);

    // Derive coordinates for each API from the single resolved coordinate
    const weatherCoords = { lat: resolvedCoords.latitude, lon: resolvedCoords.longitude };
    const mlLocationData: LocationData = resolvedCoords.locationData || {
      latitude: resolvedCoords.latitude,
      longitude: resolvedCoords.longitude,
      city: 'Unknown City',
      state: 'Unknown State',
      country: 'Unknown Country',
      timestamp: Date.now()
    };
    const alertsCoords = { lat: resolvedCoords.latitude, lon: resolvedCoords.longitude };

    console.log('🎯 Using consistent coordinates for data refresh:', {
      summary: CoordinateResolver.getCoordinateSummary(resolvedCoords),
      weather: weatherCoords,
      alerts: alertsCoords
    });

    // Use setTimeout to prevent blocking and infinite loops
    setTimeout(() => {
      Promise.all([
        fetchRiskPrediction(mlLocationData),
        fetchWeather(weatherCoords.lat, weatherCoords.lon),
        fetchAlerts(alertsCoords.lat, alertsCoords.lon),
      ]).catch(error => {
        console.error('Error refreshing disaster data:', error);
      });
    }, 0);
  }, [location, fetchRiskPrediction, fetchWeather, fetchAlerts]);

  // Initial data load when location changes - debounced
  useEffect(() => {
    if (!location) return;
    
    const timeoutId = setTimeout(() => {
      refreshAllData();
    }, 100); // Small delay to prevent rapid successive calls

    return () => clearTimeout(timeoutId);
  }, [location, refreshAllData]);

  // Removed real-time auto-refresh to prevent infinite loops
  // Manual refresh only through user actions

  // Set up WebSocket for real-time alerts
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleRealTimeAlert = (alertData: any) => {
      console.log('📡 Real-time alert received:', alertData);
      
      if (alertData.type === 'new_alert' && location) {
        // Use consistent coordinates for alert refresh
        const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);
        fetchAlerts(resolvedCoords.latitude, resolvedCoords.longitude);
      }
    };

    // Real-time alerts will be handled via polling for now
    // TODO: Implement WebSocket alerts in future version

    return () => {
      // Cleanup if needed
    };
  }, [location, fetchAlerts]);

  return {
    // Data
    riskPrediction: data.riskPrediction,
    weather: data.weather,
    alerts: data.alerts,
    forecast: null, // Endpoint removed
    modelPerformance: null, // Endpoint removed
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Metadata
    lastUpdated,
    
    // Actions
    refreshAllData,
    clearError,
    
    // Individual refresh functions (using consistent coordinates)
    refreshRiskPrediction: () => {
      if (!location) return;
      const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);
      const mlLocationData: LocationData = resolvedCoords.locationData || {
        latitude: resolvedCoords.latitude,
        longitude: resolvedCoords.longitude,
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country',
        timestamp: Date.now()
      };
      fetchRiskPrediction(mlLocationData);
    },
    refreshWeather: () => {
      if (!location) return;
      const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);
      fetchWeather(resolvedCoords.latitude, resolvedCoords.longitude);
    },
    refreshAlerts: () => {
      if (!location) return;
      const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);
      fetchAlerts(resolvedCoords.latitude, resolvedCoords.longitude);
    },
    // No forecast or model performance refresh (endpoints removed)
  };
};

// Hook for API health monitoring
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastHealthCheck, setLastHealthCheck] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const health = await RescuePingAPIService.checkHealth();
      setIsHealthy(true);
      setLastHealthCheck(new Date().toISOString());
    } catch (error) {
      console.error('Health check failed:', error);
      setIsHealthy(false);
      setLastHealthCheck(new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health checks (every 2 minutes)
    const interval = setInterval(checkHealth, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    lastHealthCheck,
    checkHealth,
  };
};