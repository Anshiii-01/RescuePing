import React, { useState, useEffect, useCallback } from 'react';
import { LocationPermissionModal } from './LocationPermissionModal';
import { ManualLocationInput } from './ManualLocationInput';
import { useNotifications } from '../../contexts/NotificationContext';
import { LocationData } from './types';

// LocationData interface now imported from types.ts

interface GeolocationContextType {
  // New Interface
  locationState: {
    coordinates: LocationData | null;
    loading: boolean;
    error: string | null;
    displayString: string | null;
  };
  refreshLocation: () => void;
  setManualLocation: (location: { latitude: number; longitude: number; city?: string; country?: string }) => void;
  isLive: boolean;
  isGPSEnabled: boolean;
  lastUpdated: Date;
  
  // Shared / Old Interface
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

// Create context for location data
const GeolocationContext = React.createContext<GeolocationContextType | null>(null);

export const useGeolocation = () => {
  const context = React.useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within GeolocationProvider');
  }
  return context;
};

interface GeolocationProviderProps {
  children: React.ReactNode;
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const { addNotification } = useNotifications();

  // Debug modal state changes
  useEffect(() => {
    console.log('📍 Location modal state changed:', { showPermissionModal, showManualInput });
  }, [showPermissionModal, showManualInput]);

  // Load existing location from localStorage on mount - with 1 hour cache
  useEffect(() => {
    const savedLocation = localStorage.getItem('rescueping-location');
    const locationPrompted = localStorage.getItem('rescueping-location-prompted');
    
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        // Check if location is less than 1 hour old
        const age = Date.now() - (locationData.timestamp || 0);
        if (age < 60 * 60 * 1000) {
          console.log('📍 Using cached location (less than 1 hour old):', locationData);
          setLocation(locationData);
          return;
        } else {
          console.log('📍 Cached location expired, will request fresh location');
        }
      } catch (error) {
        console.warn('Failed to parse saved location:', error);
      }
    }
    
    // Only show modal if user hasn't been prompted in this session
    if (!locationPrompted) {
      console.log('🎯 Requesting fresh device location');
      setTimeout(() => {
        setShowPermissionModal(true);
      }, 500);
    } else if (savedLocation) {
      // Use saved location even if stale
      try {
        const locationData = JSON.parse(savedLocation);
        console.log('📍 Using saved location from previous session');
        setLocation(locationData);
      } catch (error) {
        console.warn('Failed to parse saved location:', error);
      }
    }
  }, []);

  // Listen for location changes from other components (like NavigationBar)
  useEffect(() => {
    const handleLocationChange = (event: any) => {
      console.log('📍 GeolocationManager detected location change from external source:', event.detail);
      if (event.detail) {
        setLocation(event.detail);
        setError(null);
      }
    };

    window.addEventListener('location-changed', handleLocationChange);
    
    return () => {
      window.removeEventListener('location-changed', handleLocationChange);
    };
  }, []);

  const requestLocation = useCallback(() => {
    setIsLoading(true);
    setShowPermissionModal(true);
  }, []);

  const handleLocationGranted = useCallback((locationData: LocationData) => {
    console.log('📍 GeolocationManager: Location granted', locationData);
    setLocation(locationData);
    setIsLoading(false);
    setShowPermissionModal(false);
    setShowManualInput(false);
    setError(null);
    
    // Mark that user has been prompted
    localStorage.setItem('rescueping-location-prompted', 'true');
    localStorage.setItem('rescueping-location', JSON.stringify(locationData));
    
    // Broadcast location change event
    window.dispatchEvent(new CustomEvent('location-changed', { detail: locationData }));
    
    // Show success notification
    addNotification({
      type: 'success',
      title: 'Location Detected',
      message: `${locationData.city}, ${locationData.state}`,
      duration: 4000
    });
  }, [addNotification]);

  const handleLocationDenied = useCallback(() => {
    setIsLoading(false);
    setShowPermissionModal(false);
    setError('Location access denied');
    
    // Mark that user has been prompted
    localStorage.setItem('rescueping-location-prompted', 'true');
    
    // Show info about manual entry
    addNotification({
      type: 'info',
      title: 'Location Access Denied',
      message: 'You can still use Rescue Ping by entering your location manually in settings.',
      duration: 6000
    });
  }, [addNotification]);

  const handleManualEntry = useCallback(() => {
    setShowPermissionModal(false);
    setShowManualInput(true);
  }, []);

  const handleManualInputClose = useCallback(() => {
    setShowManualInput(false);
    // If no location set and user closes manual input, mark as prompted
    if (!location) {
      localStorage.setItem('rescueping-location-prompted', 'true');
    }
  }, [location]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    localStorage.removeItem('rescueping-location');
    localStorage.removeItem('rescueping-location-prompted');
  }, []);

  const setManualLocation = useCallback((loc: { latitude: number; longitude: number; city?: string; country?: string }) => {
    const newLoc: LocationData = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      city: loc.city || 'Unknown',
      state: '',
      country: loc.country || 'Unknown',
      timestamp: Date.now(),
      isManual: true
    };
    handleLocationGranted(newLoc);
  }, [handleLocationGranted]);

  const contextValue: GeolocationContextType = {
    // New Interface
    locationState: {
      coordinates: location,
      loading: isLoading,
      error: error,
      displayString: location ? `${location.city}, ${location.state}` : null
    },
    refreshLocation: requestLocation,
    setManualLocation,
    isLive: !!location,
    isGPSEnabled: location ? !location.isManual : false,
    lastUpdated: location ? new Date(location.timestamp) : new Date(),
    
    // Shared / Old Interface
    location,
    isLoading,
    error,
    requestLocation,
    clearLocation
  };

  return (
    <GeolocationContext.Provider value={contextValue}>
      {children}
      
      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
        onManualEntry={handleManualEntry}
      />
      
      {/* Manual Location Input */}
      <ManualLocationInput
        isOpen={showManualInput}
        onLocationSelected={handleLocationGranted}
        onClose={handleManualInputClose}
      />
    </GeolocationContext.Provider>
  );
};

// Main GeolocationManager component (for compatibility)
const GeolocationManager: React.FC = () => {
  // This component now exists mainly for backwards compatibility
  // The actual logic is in the provider above
  return null;
};

export default GeolocationManager;