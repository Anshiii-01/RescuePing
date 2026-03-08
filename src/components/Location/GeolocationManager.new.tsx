import React, { useState, useEffect, useCallback } from 'react';
import { LocationPermissionModal } from './LocationPermissionModal';
import { ManualLocationInput } from './ManualLocationInput';
import { useNotifications } from '../../contexts/NotificationContext';
import { LocationData } from './types';

// LocationData interface now imported from types.ts

interface GeolocationContextType {
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

  // Load existing location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('rescueping-location');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        // Check if location is less than 24 hours old
        if (Date.now() - locationData.timestamp < 24 * 60 * 60 * 1000) {
          setLocation(locationData);
          return;
        }
      } catch (error) {
        console.warn('Failed to parse saved location:', error);
      }
    }
    
    // If no valid saved location, show permission modal on first visit
    const hasSeenModal = localStorage.getItem('rescueping-location-prompted');
    if (!hasSeenModal) {
      // Show modal after a brief delay to let the app load
      setTimeout(() => {
        setShowPermissionModal(true);
      }, 1500);
    }
  }, []);

  const requestLocation = useCallback(() => {
    setShowPermissionModal(true);
  }, []);

  const handleLocationGranted = useCallback((locationData: LocationData) => {
    setLocation(locationData);
    setShowPermissionModal(false);
    setShowManualInput(false);
    setError(null);
    
    // Mark that user has been prompted
    localStorage.setItem('rescueping-location-prompted', 'true');
    
    // Show success notification
    addNotification({
      type: 'success',
      title: 'Location Detected',
      message: `${locationData.city}, ${locationData.state}`,
      duration: 4000
    });
  }, [addNotification]);

  const handleLocationDenied = useCallback(() => {
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

  const contextValue: GeolocationContextType = {
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