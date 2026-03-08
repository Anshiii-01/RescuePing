import React, { useCallback, useState, useEffect, Suspense, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { spacing, breakpoints } from '../../styles/spacing';
import { enhancedSpacing, enhancedGrid } from '../../styles/enhanced-design-system';
import {
  productionColors,
  productionAnimations,
  productionCard,
  productionScrollbar
} from '../../styles/production-ui-system';
import CurrentAlerts from './CurrentAlerts';
import MLPredictionAccuracy from './MLPredictionAccuracy';
import ActionButtons from './ActionButtons';
import SevenDayForecast from './SevenDayForecast';
import AIMLSummary from './AIMLSummary';
import GeolocationManager from '../Location/GeolocationManager';
import EmergencyResponsePanel from '../Emergency/EmergencyResponsePanel';
import EvacuationSafetyModule from '../Safety/EvacuationSafetyModule';
import ResourceManagementDashboard from '../Resources/ResourceManagementDashboard';
import CommunicationHub from '../Communication/CommunicationHub';
import EnhancedWeatherWidget from '../Dashboard/EnhancedWeatherWidget';
import AirQualityWidget from './AirQualityWidget';
import AlertNotificationSettings from '../Settings/AlertNotificationSettings';
import { SystemDiagnostics } from '../Diagnostics/SystemDiagnostics';
import { LoadingOverlay, SkeletonDashboard } from '../Layout/LoadingStates';
import { RealTimeIndicator } from '../common/RealTimeIndicator';
import { useAutoRefresh, useRefreshSettings } from '../../hooks/useAutoRefresh';
import { useLiveDataExport } from '../../services/liveDataExport';

import { enhancedLocationService } from '../../services/enhancedLocationService';
import SimpleWeatherService from '../../services/simpleWeatherService';
import enhancedForecastService from '../../services/enhancedForecastService';
import airQualityService, { AQIData } from '../../services/airQualityService';
import RiskCalculationService, { WeatherRiskFactors } from '../../services/riskCalculationService';
import logger from '../../utils/logger';
import GlobeRiskHero from './GlobeRiskHero';
import { ForecastData } from '../../types';
import ErrorBoundary from '../common/ErrorBoundary';
import { useCurrentAlerts } from '../../hooks/useDashboard';


// Alert risk severity weights for risk calculation
const SEVERITY_WEIGHTS = {
  critical: 10,
  high: 7,
  moderate: 5,
  low: 2,
  info: 1,
} as const;

/**
 * Calculate aggregated risk score from active alerts
 * @param alerts Array of current alerts
 * @returns Normalized risk score 0-10
 */
const calculateAlertRisk = (alerts: any[]): number => {
  if (!alerts || alerts.length === 0) return 0;

  const totalWeight = alerts.reduce((sum, alert) => {
    const severity = alert.severity?.toLowerCase() || 'low';
    const weight = SEVERITY_WEIGHTS[severity as keyof typeof SEVERITY_WEIGHTS] || 1;
    return sum + weight;
  }, 0);

  // Normalize to 0-10 scale based on average severity
  // Max possible average is 10 (all critical), min is 1 (all info)
  const averageWeight = totalWeight / alerts.length;
  const normalizedRisk = Math.min(averageWeight, 10);

  logger.log(`📊 Alert risk calculated: ${alerts.length} alerts, risk: ${normalizedRisk.toFixed(2)}`);

  return normalizedRisk;
};

const DashboardContainer = styled.main`
  min-height: 100vh;
  padding-top: 64px;
  background: transparent;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: ${productionColors.text.primary};
  position: relative;
  z-index: 1;
  
  /* Enhanced smooth scrolling */
  ${productionScrollbar}
`;

// ENHANCED 16/24px GRID SYSTEM - Zero overlapping guarantee
const DashboardGrid = styled.div`
  display: grid;
  gap: ${enhancedGrid.containerGap}; /* 24px perfect gaps */
  padding: ${enhancedGrid.containerPadding}; /* 24px container padding */
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  grid-auto-rows: minmax(0, auto); /* Prevent children from overflowing their grid cells */
  
  /* Desktop: 3-column layout (1200px+) */
  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 380px 1fr 380px; /* Fixed 380px sidebars, flexible center */
    grid-template-areas:
      "left center right"
      "weather weather weather"
      "diagnostics diagnostics diagnostics"
      "emergency emergency emergency"
      "evacuation evacuation evacuation"
      "resources resources resources"
      "communication communication communication";
    gap: 24px; /* 24px gap as requested */
  }
  
  /* Tablet: 2-column layout (768px-1199px) */
  @media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "left center"
      "right center"
      "weather weather"
      "diagnostics diagnostics"
      "emergency emergency"
      "evacuation resources"
      "communication communication";
    gap: ${enhancedGrid.cardGap}; /* 16px on tablet - enhanced grid compliant */
    padding: ${enhancedGrid.minMargin}; /* 16px padding on tablet */
  }
  
  /* Mobile: Single column (below 768px) */
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "center"
      "weather"
      "diagnostics"
      "left"
      "right"
      "emergency"
      "evacuation"
      "resources"
      "communication";
    gap: ${enhancedGrid.cardGap}; /* 16px on mobile - enhanced grid compliant */
    padding: ${enhancedGrid.minMargin}; /* 16px on mobile - enhanced grid compliant */
  }
`;

const LeftSidebar = styled.aside`
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: ${enhancedGrid.cardGap}; /* 16px between cards - enhanced grid compliant */
  min-height: 0; /* Prevent flex overflow */
  
  /* Mobile-specific alignment */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap on mobile */
    padding: 0; /* Remove any padding for consistent alignment */
    width: 100%;
  }
`;

const CenterArea = styled.section`
  grid-area: center;
  display: flex;
  flex-direction: column;
  gap: ${enhancedGrid.cardGap}; /* 16px between elements - enhanced grid compliant */
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  width: 100%;
  
  /* Mobile-specific alignment */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap on mobile */
    padding: 0; /* Remove any padding for consistent alignment */
  }
`;

const RightSidebar = styled.aside`
  grid-area: right;
  display: flex;
  flex-direction: column;
  gap: ${enhancedGrid.cardGap}; /* 16px between cards - enhanced grid compliant */
  min-height: 0;
  
  /* Mobile-specific alignment */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap on mobile */
    padding: 0; /* Remove any padding for consistent alignment */
    width: 100%;
  }
`;

// Remove the old VisualizationContainer as it's now integrated into GlobeRiskHero

// PRODUCTION CARD STYLING - Enhanced with cinematic animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DashboardCard = styled.div<{ animationDelay?: number }>`
  ${productionCard}
  
  /* Enhanced professional spacing */
  padding: ${enhancedSpacing[6]}; /* 24px internal padding */
  box-sizing: border-box;
  width: 100%;
  gap: ${enhancedSpacing[4]}; /* 16px internal element gaps */
  
  /* PRODUCTION POLISH: Prominent glowing shadow on pure black */
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.7);
  background: rgba(22, 24, 29, 0.95); /* Glassmorphism for pure black */
  backdrop-filter: blur(10px);
  
  /* Production animation system with stagger effect */
  ${css`animation: ${fadeInUp} ${productionAnimations.duration.slower} ${productionAnimations.easing.smooth};`}
  animation-delay: ${({ animationDelay }) => animationDelay || 0}ms;
  animation-fill-mode: both;
  
  /* ENHANCED HOVER: Stronger glow and lift */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${productionColors.border.accent};
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.52),
      0 6px 24px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 0 1px rgba(239, 68, 68, 0.15);
    transform: translateY(-6px);
  }
  
  /* Zero overlap guarantee */
  position: relative;
  z-index: 1;
  overflow: auto;
  
  /* Production text color */
  color: ${productionColors.text.primary};
  
  /* Mobile-specific styling for consistent alignment */
  @media (max-width: ${breakpoints.mobile}) {
    padding: ${enhancedSpacing[4]}; /* 16px padding on mobile for consistent spacing */
    margin: 0; /* Remove any margin to prevent misalignment */
    width: 100%;
    max-width: 100%;
    
    /* Ensure proper stacking on mobile */
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-2px); /* Reduced lift on mobile for better UX */
    }
  }
  
  /* Subtle inner glow - enhanced */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.15), transparent);
    pointer-events: none;
  }
`;

// Emergency section spans full width
const EmergencySection = styled.section`
  grid-area: emergency;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg}; /* 16px gap */
  
  /* Mobile-specific styling */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap */
    padding: 0;
    margin: 0;
  }
`;

const EvacuationSection = styled.section`
  grid-area: evacuation;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  
  /* Mobile-specific styling */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap */
    padding: 0;
    margin: 0;
  }
`;

const ResourcesSection = styled.section`
  grid-area: resources;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  
  /* Mobile-specific styling */
  @media (max-width: ${breakpoints.mobile}) {
    gap: ${enhancedGrid.cardGap}; /* Consistent 16px gap */
    padding: 0;
    margin: 0;
  }
`;

const CommunicationSection = styled.section`
  grid-area: communication;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  
  /* Mobile-specific styling */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 0;
    margin: 0;
  }
`;

const WeatherSection = styled.section`
  grid-area: weather;
`;

const DiagnosticsSection = styled.section`
  grid-area: diagnostics;
`;



const Dashboard: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const [globalRiskScore, setGlobalRiskScore] = useState<number>(0);
  const [isCalculatingRisk, setIsCalculatingRisk] = useState(true);
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
  const [forecastError, setForecastError] = useState<boolean>(false);
  const [forecastSource, setForecastSource] = useState<string>('OpenWeatherMap');
  const [forecastIsLive, setForecastIsLive] = useState<boolean>(true);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [aqiLoading, setAqiLoading] = useState(false);

  const [aqiError, setAqiError] = useState<boolean>(false);

  // Ref for emergency section scroll
  const emergencySectionRef = useRef<HTMLDivElement>(null);

  const { data: alerts } = useCurrentAlerts();
  const { refreshInterval, autoRefreshEnabled } = useRefreshSettings();
  const { exportBothFormats } = useLiveDataExport();

  // Scroll to emergency section
  const scrollToEmergency = useCallback(() => {
    emergencySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Fetch 7-day forecast data with enhanced service (30-min cache, multiple APIs)
  const fetchForecastData = useCallback(async () => {
    try {
      setForecastError(false);
      const loc = await enhancedLocationService.getCurrentLocation();
      const forecast = await enhancedForecastService.getForecast(loc.latitude, loc.longitude);

      // Convert to component format
      const convertedForecast = forecast.forecast.map(day => ({
        day: day.day,
        riskScore: day.riskScore,
        precipitation: day.precipitation,
        temperature: day.temperature,
        windSpeed: day.wind_speed,
        conditions: day.conditions,
      }));

      setForecastData(convertedForecast);
      setForecastSource(forecast.cached ? `${forecast.source} (cached)` : forecast.source);
      setForecastIsLive(forecast.is_real);

      logger.log('📅 Enhanced 7-day forecast loaded:', {
        days: convertedForecast.length,
        source: forecast.source,
        cached: forecast.cached,
        is_real: forecast.is_real,
        city: forecast.location.city
      });
    } catch (error) {
      logger.error('❌ Enhanced forecast fetch failed:', error);
      setForecastData(null);
      setForecastError(true);
      setForecastIsLive(false);
    }
  }, []);

  // Fetch air quality data
  const fetchAQIData = useCallback(async () => {
    try {
      setAqiLoading(true);
      setAqiError(false);
      const loc = await enhancedLocationService.getCurrentLocation();
      const aqi = await airQualityService.getAirQuality(loc.latitude, loc.longitude);

      setAqiData(aqi);

      logger.log('🌬️ Air quality data loaded:', {
        aqi: aqi.aqi,
        level: aqi.level,
        description: aqi.description,
        shouldAlert: airQualityService.shouldAlert(aqi.aqi)
      });
    } catch (error) {
      logger.error('❌ AQI fetch failed:', error);
      setAqiData(null);
      setAqiError(true);
    } finally {
      setAqiLoading(false);
    }
  }, []);

  // Calculate global risk score from live data
  const calculateGlobalRisk = useCallback(async () => {
    try {
      setIsCalculatingRisk(true);

      // Fetch live weather data using simple reliable service
      const loc = await enhancedLocationService.getCurrentLocation();
      const weatherData = await SimpleWeatherService.getWeather(loc.latitude, loc.longitude);

      const weatherFactors: WeatherRiskFactors = {
        temp: weatherData.current.temp,
        feelsLike: weatherData.current.feels_like,
        condition: weatherData.current.weather[0].main,
        humidity: weatherData.current.humidity,
        windSpeed: Math.round(weatherData.current.wind_speed * 3.6), // m/s to km/h
        pressure: weatherData.current.pressure,
        visibility: weatherData.current.visibility,
        uvIndex: weatherData.current.uvi
      };

      // Calculate weather risk
      const weatherRisk = RiskCalculationService.calculateWeatherRisk(weatherFactors);

      // Calculate alert risk from current alerts
      const alertRisk = calculateAlertRisk(alerts || []);

      // Get pollution risk factor (0-1) and convert to 0-10 scale
      const pollutionRisk = aqiData
        ? airQualityService.getPollutionRiskFactor(aqiData.aqi) * 10
        : 0;

      // Calculate global risk with pollution factor
      const baseGlobalRisk = RiskCalculationService.calculateGlobalRisk(weatherRisk, alertRisk);
      const globalRisk = Math.min(10, baseGlobalRisk + (pollutionRisk * 0.3)); // Pollution adds up to 30% boost

      setGlobalRiskScore(globalRisk);
      logger.log('🎯 Global risk calculated:', {
        weather: weatherRisk,
        alerts: alertRisk,
        pollution: pollutionRisk,
        global: globalRisk,
        location: `${loc.city}, ${loc.state || loc.country}`
      });
    } catch (error) {
      logger.error('❌ Risk calculation failed:', error);
      setGlobalRiskScore(0); // Default to low risk on error
    } finally {
      setIsCalculatingRisk(false);
    }
  }, [aqiData, alerts]);

  // Unified refresh function
  const refreshAllData = useCallback(async () => {
    logger.log('🔄 Refreshing all dashboard data...');
    await Promise.all([
      fetchForecastData(),
      fetchAQIData(),
      calculateGlobalRisk()
    ]);
  }, [fetchForecastData, fetchAQIData, calculateGlobalRisk]);

  const { lastRefresh, isRefreshing, manualRefresh } = useAutoRefresh({
    interval: Math.max(refreshInterval, 5), // Minimum 5 minutes to prevent excessive API calls
    enabled: autoRefreshEnabled,
    onRefresh: refreshAllData
  });

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboard = async () => {
      await refreshAllData();

      // Simulate component initialization
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDashboardLoaded(true);

      // Remove loading overlay after smooth transition
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 300);
    };

    loadDashboard();
    // Note: Periodic refresh is now handled entirely by useAutoRefresh hook
  }, []); // Run only once on mount

  // Recalculate risk when AQI data or Alerts change (but don't fetch AQI again)
  useEffect(() => {
    if ((aqiData || alerts) && dashboardLoaded) {
      calculateGlobalRisk();
    }
  }, [aqiData, alerts, dashboardLoaded]);



  const handleDownloadReport = useCallback(() => {
    logger.log('📄 Downloading comprehensive live data report...');
    exportBothFormats(); // Export both PDF and CSV
  }, [exportBothFormats]);

  const handleRefreshData = useCallback(() => {
    logger.log('🔄 Manual dashboard refresh triggered...');
    manualRefresh();
  }, [manualRefresh]);

  // Show loading screen during initial load
  if (isInitialLoading) {
    return (
      <DashboardContainer>
        <LoadingOverlay
          message="Initializing Rescue Ping Dashboard..."
          fullScreen={false}
        />
        {!dashboardLoaded && <SkeletonDashboard />}
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Real-Time Status Indicator */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 100
      }}>
        <RealTimeIndicator
          lastUpdated={lastRefresh}
          isLive={autoRefreshEnabled}
          isConnected={!isRefreshing}
          onRefresh={handleRefreshData}
          autoRefreshInterval={refreshInterval * 60}
        />
      </div>

      <GeolocationManager />

      <DashboardGrid className="dashboard-grid" style={{ paddingTop: '32px' }}> {/* Account for status bar */}
        {/* Left Sidebar - Alerts & Controls */}
        <LeftSidebar>
          <DashboardCard animationDelay={100}>
            <ErrorBoundary componentName="Current Alerts">
              <CurrentAlerts onEmergencyClick={scrollToEmergency} />
            </ErrorBoundary>
          </DashboardCard>

          <DashboardCard animationDelay={200}>
            <ErrorBoundary componentName="ML Prediction">
              <MLPredictionAccuracy />
            </ErrorBoundary>
          </DashboardCard>

          <DashboardCard animationDelay={300}>
            <ErrorBoundary componentName="Action Buttons">
              <ActionButtons
                onDownloadReport={handleDownloadReport}
                onRefreshData={handleRefreshData}
              />
            </ErrorBoundary>
          </DashboardCard>
        </LeftSidebar>

        {/* Center Area - Merged Globe + Risk Hero */}
        <CenterArea>
          <ErrorBoundary componentName="Globe Visualization">
            <Suspense fallback={<LoadingOverlay message="Loading Globe..." />}>
              <GlobeRiskHero
                score={globalRiskScore}
                isCalculating={isCalculatingRisk}
                alerts={alerts || []}
              />
            </Suspense>
          </ErrorBoundary>
        </CenterArea>

        {/* Right Sidebar - AI Summary & Forecast */}
        <RightSidebar>
          <DashboardCard animationDelay={150}>
            <ErrorBoundary componentName="AI/ML Summary">
              <AIMLSummary floodProbability={globalRiskScore} />
            </ErrorBoundary>
          </DashboardCard>

          <DashboardCard animationDelay={250}>
            <ErrorBoundary componentName="Weather Forecast">
              {forecastError ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
                  Unable to load forecast data. Please try again later.
                </div>
              ) : (
                <SevenDayForecast
                  forecast={forecastData || undefined}
                  isLive={forecastIsLive}
                  source={forecastSource}
                />
              )}
            </ErrorBoundary>
          </DashboardCard>

          {/* Alert Notification Settings */}
          <DashboardCard animationDelay={300}>
            <ErrorBoundary componentName="Alert Notification Settings">
              <AlertNotificationSettings />
            </ErrorBoundary>
          </DashboardCard>
        </RightSidebar>

        {/* Weather Dashboard - Full Width with Enhanced Widget */}
        <WeatherSection>
          <ErrorBoundary componentName="Weather Widget">
            <EnhancedWeatherWidget />
          </ErrorBoundary>
          <ErrorBoundary componentName="Air Quality Widget">
            {aqiError ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '16px' }}>
                Unable to load air quality data.
              </div>
            ) : (
              <AirQualityWidget aqiData={aqiData} loading={aqiLoading} />
            )}
          </ErrorBoundary>
        </WeatherSection>

        {/* System Diagnostics - Full Width */}
        <DiagnosticsSection>
          <DashboardCard animationDelay={375}>
            <ErrorBoundary componentName="System Diagnostics">
              <SystemDiagnostics />
            </ErrorBoundary>
          </DashboardCard>
        </DiagnosticsSection>

        {/* Emergency Response - Full Width */}
        <EmergencySection ref={emergencySectionRef}>
          <DashboardCard animationDelay={400}>
            <ErrorBoundary componentName="Emergency Response">
              <EmergencyResponsePanel />
            </ErrorBoundary>
          </DashboardCard>
        </EmergencySection>

        {/* Evacuation & Safety */}
        <EvacuationSection>
          <DashboardCard animationDelay={450}>
            <ErrorBoundary componentName="Evacuation Safety">
              <EvacuationSafetyModule />
            </ErrorBoundary>
          </DashboardCard>
        </EvacuationSection>

        {/* Resource Management */}
        <ResourcesSection>
          <DashboardCard animationDelay={500}>
            <ErrorBoundary componentName="Resource Management">
              <ResourceManagementDashboard />
            </ErrorBoundary>
          </DashboardCard>
        </ResourcesSection>

        {/* Communication Hub */}
        <CommunicationSection>
          <DashboardCard animationDelay={550}>
            <ErrorBoundary componentName="Communication Hub">
              <CommunicationHub />
            </ErrorBoundary>
          </DashboardCard>
        </CommunicationSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;