import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGeolocation } from '../Location/GeolocationManager';
import { RescuePingAPIService } from '../../services/apiService';
import OpenWeatherMapService from '../../services/openWeatherMapService';
import Header from './Header';
import CinematicHero from './CinematicHero';
import RiskScoreCard from './cards/RiskScoreCard';
import DisasterTypeCards from './cards/DisasterTypeCards';
import ModelAccuracyCard from './cards/ModelAccuracyCard';
import EnhancedWeatherCard from './cards/EnhancedWeatherCard';
import IncidentTimelineCard from './cards/IncidentTimelineCard';
import ResourceCard from './cards/ResourceCard';
import AlertsCard from './cards/AlertsCard';
import EvacuationCard from './cards/EvacuationCard';
import MapCard from './cards/MapCard';

const DashboardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #0F1115;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #F7FAFC;
  font-size: clamp(14px, 2vw, 17px);
  line-height: 1.6;
  font-weight: 400;
  overflow-x: hidden;
  
  /* Enhanced typography for readability */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: clamp(16px, 3vw, 32px);
  padding: clamp(16px, 4vw, 32px);
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  
  /* Mobile first - single column */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 12px;
  }
  
  /* Small tablets - 1-2 columns */
  @media (min-width: 641px) and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px 16px;
  }
  
  /* Tablets - 2 columns */
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 24px;
  }
  
  /* Small desktop - 2-3 columns */
  @media (min-width: 1025px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 28px;
    padding: 28px;
  }
  
  /* Medium desktop - 3 columns */
  @media (min-width: 1281px) and (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    padding: 32px;
  }
  
  /* Large desktop - 3-4 columns */
  @media (min-width: 1441px) and (max-width: 1920px) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 32px;
    padding: 32px;
  }
  
  /* Extra large - 4+ columns */
  @media (min-width: 1921px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding: 40px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 17, 21, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const LoadingSpinner = styled.div`
  width: clamp(50px, 10vw, 60px);
  height: clamp(50px, 10vw, 60px);
  border: 3px solid #2d3748;
  border-top: 3px solid #4fd1c7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    border-width: 2px;
  }
`;

interface DashboardData {
  weather: any;
  prediction: any;
  alerts: any;
  location: any;
  incidents: any[];
  resources: any;
  evacuation: any;
  evacuationRoutes: any[];
}

// Generate instant mock data for initial render
const generateInstantMockData = (lat?: number, lon?: number): DashboardData => {
  const temp = 20 + Math.random() * 10;
  return {
    weather: {
      temperature: temp,
      condition: 'Partly Cloudy',
      humidity: 60,
      windSpeed: 15,
      pressure: 1013,
      visibility: 10,
      description: 'Loading...'
    },
    prediction: {
      overall_risk: 30,
      risk_level: 'Medium',
      confidence: 0.75,
      disaster_probabilities: {
        earthquake: 20,
        flood: 25,
        fire: 15,
        storm: 40
      },
      recommendations: ['Loading current recommendations...'],
      is_real: false
    },
    alerts: {
      alerts: [],
      count: 0
    },
    location: {
      city: 'Loading...',
      state: '',
      country: '',
      source: 'Initial'
    },
    incidents: [],
    resources: {
      shelters: [],
      hospitals: [],
      emergencyServices: []
    },
    evacuation: {
      routes: [],
      zones: []
    },
    evacuationRoutes: []
  };
};

const CinematicDashboard: React.FC = () => {
  const { location: geolocation, isLoading: locationLoading } = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    generateInstantMockData() // Instant initial data
  );
  const [loading, setLoading] = useState(false); // Start with false since we have mock data
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'degraded'>('online');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [enhancedLocation, setEnhancedLocation] = useState<any>(null);

  // Use currentLocation if available, otherwise fall back to geolocation
  const location = currentLocation || geolocation;

  // Hoisted fetch function so handlers can call it (refresh, export, etc.)
  const fetchDashboardData = async () => {
    if (!location) {
      console.log('⚠️ No location available for data fetch');
      return;
    }
    
    console.log('📊 Fetching dashboard data for location:', location);

    try {
      // Only show loading overlay if this is the first real data load
      // (mock data will have 'Loading...' as city name)
      const isFirstLoad = !dashboardData || dashboardData.location.city === 'Loading...';
      if (isFirstLoad) {
        setLoading(true);
      }
      setError(null);

      // Start timer for performance monitoring
      const startTime = performance.now();

      // Fetch only critical data in parallel (weather, prediction, alerts)
      // Skip location geocoding since we already have location from LocationContext
      const [weather, prediction, alerts] = await Promise.all([
        RescuePingAPIService.getWeatherData(location.latitude, location.longitude).catch(err => {
          console.warn('Weather fetch failed, using fallback');
          return null;
        }),
        RescuePingAPIService.getPredictions(location.latitude, location.longitude).catch(err => {
          console.warn('Prediction fetch failed, using fallback');
          return null;
        }),
        RescuePingAPIService.getAlerts(location.latitude, location.longitude).catch(err => {
          console.warn('Alerts fetch failed, using fallback');
          return { alerts: [], count: 0 };
        })
      ]);

      const loadTime = performance.now() - startTime;
      console.log(`✅ Dashboard data loaded in ${loadTime.toFixed(0)}ms`);

      // Use existing location data (already geocoded by LocationContext)
      const locationInfo = {
        city: location.city || 'Unknown',
        state: location.state || '',
        country: location.country || 'Unknown',
        latitude: location.latitude,
        longitude: location.longitude,
        source: 'LocationContext Cache',
        is_real: true
      };

      // Mock data for incidents and resources - replace with real API calls
      const incidents = [
        { type: 'flood', time: Date.now() - 86400000, severity: 'moderate' },
        { type: 'storm', time: Date.now() - 172800000, severity: 'high' },
        { type: 'earthquake', time: Date.now() - 259200000, severity: 'low' }
      ];

      const resources = {
        water: { available: 85, total: 100, status: 'good' },
        medical: { available: 67, total: 80, status: 'moderate' },
        evacuation: { points: 12, capacity: 5000, status: 'ready' }
      };

      const evacuationRoutes = [
        { name: 'North Emergency Route', distance: '2.3 km', status: 'clear' },
        { name: 'Central Shelter Path', distance: '1.8 km', status: 'congested' },
        { name: 'South Safe Zone', distance: '3.1 km', status: 'clear' }
      ];

      const evacuation = {
        routes: [
          { name: "Highway 101 North", status: "open", capacity: 500, current: 125, distance: "8.2 km", eta: "12 min" },
          { name: "Coastal Route West", status: "busy", capacity: 300, current: 280, distance: "6.5 km", eta: "18 min" },
          { name: "Mountain Pass East", status: "closed", capacity: 200, current: 0, distance: "12.1 km", eta: "--" }
        ],
        shelters: [
          { name: "Community Center", type: "Primary Shelter", capacity: 800, available: 600, resources: ["Medical", "Food", "Communications"] },
          { name: "High School Gymnasium", type: "Secondary Shelter", capacity: 400, available: 380, resources: ["Food", "Bedding"] },
          { name: "Sports Complex", type: "Emergency Shelter", capacity: 600, available: 450, resources: ["Medical", "Bedding", "Pet Care"] }
        ]
      };

      setDashboardData({
        weather,
        prediction,
        alerts,
        location: locationInfo,
        incidents,
        resources,
        evacuation,
        evacuationRoutes
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Listen for location changes and refresh data IMMEDIATELY
  useEffect(() => {
    const handleLocationChange = (event: any) => {
      console.log('🔄 Location changed event received, refreshing data silently...', event.detail);
      
      // Update BOTH enhanced location AND current location coordinates
      if (event.detail) {
        setEnhancedLocation(event.detail);
        setCurrentLocation(event.detail); // This is KEY - update the location used for API calls
        console.log('📍 Updated currentLocation to:', event.detail);
      }
      
      // Keep current data visible, update location info immediately
      setDashboardData(prev => prev ? {
        ...prev,
        location: {
          city: event.detail?.city || 'Updating...',
          state: event.detail?.state || '',
          country: event.detail?.country || '',
          source: 'LocationContext'
        }
      } : generateInstantMockData(event.detail?.lat, event.detail?.lon));
      
      // Fetch new data in background without loading overlay
      setTimeout(() => {
        fetchDashboardData();
      }, 100);
    };

    // Add event listener
    window.addEventListener('location-changed', handleLocationChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('location-changed', handleLocationChange);
    };
  }, [location]);

  // Sync currentLocation with geolocation when it first loads
  useEffect(() => {
    if (geolocation && !currentLocation) {
      console.log('📍 Initial geolocation loaded:', geolocation);
      setCurrentLocation(geolocation);
    }
  }, [geolocation, currentLocation]);

  // Initial data fetch when location is available
  useEffect(() => {
    if (!location) {
      console.log('⏳ Waiting for location to be available...');
      return;
    }
    
    console.log('📍 Location available, fetching real data in background:', location);
    // Don't set loading to true - we already have mock data showing
    // Just fetch real data silently in the background
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleExport = () => {
    if (!dashboardData) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      location: enhancedLocation || location,
      weather: dashboardData.weather,
      predictions: dashboardData.prediction,
      alerts: dashboardData.alerts,
      systemStatus,
      lastUpdated,
      dataSource: 'Rescue Ping Dashboard v2.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rescue-ping-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (locationLoading || loading) {
    return (
      <DashboardContainer>
        <Header 
          location={enhancedLocation}
          systemStatus="offline"
          onRefresh={handleRefresh}
          onExport={handleExport}
          lastUpdated={lastUpdated}
        />
        <LoadingOverlay>
          <LoadingSpinner />
          {retryCount > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: '#A0AEC0',
              textAlign: 'center'
            }}>
              Retrying... (Attempt {retryCount + 1})
            </div>
          )}
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header 
          location={enhancedLocation}
          systemStatus="offline"
          onRefresh={handleRefresh}
          onExport={handleExport}
          lastUpdated={lastUpdated}
        />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 80px)',
          gap: 'clamp(1rem, 3vw, 2rem)',
          padding: 'clamp(1rem, 4vw, 2rem)'
        }}>
          <div style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#FC8181',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            {error}
          </div>
          <button
            onClick={handleRefresh}
            style={{
              padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)',
              background: 'linear-gradient(135deg, #4FD1C7 0%, #38B2AC 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: 'clamp(14px, 2vw, 16px)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              touchAction: 'manipulation'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Retry Now
          </button>
        </div>
      </DashboardContainer>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardContainer>
        <Header 
          location={enhancedLocation}
          systemStatus="offline"
          onRefresh={handleRefresh}
          onExport={handleExport}
          lastUpdated={lastUpdated}
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 80px)',
          fontSize: '1.2rem',
          color: '#A0AEC0'
        }}>
          No data available
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header 
        location={enhancedLocation || dashboardData.location}
        systemStatus={systemStatus}
        onRefresh={handleRefresh}
        onExport={handleExport}
        lastUpdated={lastUpdated}
      />
      
      <CinematicHero 
        location={enhancedLocation || dashboardData.location}
        weather={dashboardData.weather}
        prediction={dashboardData.prediction}
        alerts={dashboardData.alerts}
      />
      
      <DashboardGrid>
        <RiskScoreCard prediction={dashboardData.prediction} />
        <DisasterTypeCards prediction={dashboardData.prediction} />
        <ModelAccuracyCard prediction={dashboardData.prediction} />
        <EnhancedWeatherCard weather={dashboardData.weather} />
        <IncidentTimelineCard incidents={dashboardData.incidents} />
        <ResourceCard resources={dashboardData.resources} />
        <AlertsCard alerts={dashboardData.alerts} />
        <EvacuationCard evacuation={dashboardData.evacuation} />
        <MapCard mapData={{ 
          incidents: dashboardData.incidents,
          routes: dashboardData.evacuationRoutes,
          location: enhancedLocation || dashboardData.location
        }} />
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default CinematicDashboard;