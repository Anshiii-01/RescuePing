import ProjectShowcase from "./pages/ProjectShowcase";

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider, useLocation } from './contexts/LocationContext';
import { ThemeProvider, useTheme as useThemeContext } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './styles/themeConfig';
import { GeolocationProvider } from './components/Location/GeolocationManager';
import { ToastProvider } from './components/Notifications/ToastSystem';
import './i18n'; // Initialize i18n
import Starfield from './components/Starfield/Starfield';
import { NavigationBar } from './components/navigation/NavigationBar';
import Dashboard from './components/Dashboard/Dashboard';
import HomePage from './pages/HomePage';
import PredictionsPage from './pages/PredictionsPage';
import AlertsPage from './pages/AlertsPage';
import EvacuationPage from './pages/EvacuationPage';
import FloodForecastPage from './pages/FloodForecastPageV2';
import VerificationDashboard from './components/Verification/VerificationDashboard';
import EnhancedLocationPermissionModal from './components/Location/EnhancedLocationPermissionModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import logger from './utils/logger';
import { productionColors } from './styles/production-ui-system';
import './utils/locationOverride';
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ScrollToTop from "./components/ScrollToTop";
// Skip to content link for accessibility
const SkipToContent = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${productionColors.brand.primary};
  color: ${productionColors.text.primary};
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
  border-radius: 0 0 4px 0;
  font-weight: 600;

  &:focus {
    top: 0;
    outline: 2px solid ${productionColors.border.accent};
    outline-offset: 2px;
  }
`;

// Utility function to clean up old/invalid location caches (runs only when needed)
const cleanupInvalidCaches = () => {
  try {
    // Only remove clearly invalid or corrupted cache entries
    const keysToCheck = ['enhanced-location-cache', 'location-override'];
    
    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          JSON.parse(value);
        } catch (e) {
          // Remove corrupted cache
          logger.warn(`Removing corrupted cache: ${key}`);
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    logger.warn('Failed to cleanup caches:', error);
  }
};

// Main App Content Component with theme bridge
const AppContent: React.FC = () => {
  const { showLocationModal, setLocation } = useLocation();
  const { theme: themeMode } = useThemeContext();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  
  // Get the appropriate theme based on mode
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  
  // Derive current page from the URL path
  const currentPage = React.useMemo(() => {
    const path = routerLocation.pathname.replace('/', '') || 'home';
    return path;
  }, [routerLocation.pathname]);

  // Handle navigation using React Router (no page reload)
  const handleNavigate = React.useCallback((page: string) => {
    const targetPath = page === 'home' ? '/' : `/${page}`;
    navigate(targetPath);
  }, [navigate]);
  
  return (
    <StyledThemeProvider theme={currentTheme as unknown as typeof theme}>
      <SkipToContent href="#main-content">
        Skip to main content
      </SkipToContent>
      <div className="App" id="main-content">
        <NavigationBar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <ErrorBoundary componentName="MainContent">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flood-forecast" element={<FloodForecastPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/evacuation" element={<EvacuationPage />} />
            <Route path="/verify" element={<VerificationDashboard />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/showcase" element={<ProjectShowcase />} />
          </Routes>
          <Footer />
        </ErrorBoundary>
      </div>
      
      {/* Location Permission Modal - Blocks dashboard until location is set */}
      <EnhancedLocationPermissionModal
        isOpen={showLocationModal}
        onLocationGranted={setLocation}
        onClose={() => {}} // No close - modal is required
      />
    </StyledThemeProvider>
  );
};

function App() {
  // Clean up invalid caches only on mount (not clearing valid data)
  useEffect(() => {
    cleanupInvalidCaches();
    logger.log('✅ App mounted - location will be managed by LocationProvider');
  }, []);

  return (
    <ThemeProvider>
      <GlobalStyles theme={theme} />
      <ToastProvider>
        <NotificationProvider>
          <LocationProvider>
            <GeolocationProvider>
              <Router>
                {/* Global starfield sits behind everything */}
                <Starfield />
                <AppContent />
              </Router>
              <ScrollToTop />
            </GeolocationProvider>
          </LocationProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
