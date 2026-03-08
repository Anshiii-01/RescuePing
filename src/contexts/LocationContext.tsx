/**
 * LOCATION ACCESS MANAGER
 * Manages first-visit location flow and "Change Location" functionality
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { LocationData } from '../components/Location/EnhancedLocationPermissionModal';

interface LocationContextType {
  currentLocation: LocationData | null;
  isLocationLoaded: boolean;
  showLocationModal: boolean;
  requestLocationChange: () => void;
  setLocation: (location: LocationData) => void;
  skipLocationPermission: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  // Set default location immediately to allow app to load
  const defaultLocation: LocationData = {
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    isManual: true,
    timestamp: Date.now()
  };

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(defaultLocation);
  const [isLocationLoaded, setIsLocationLoaded] = useState(true); // Start as loaded with default
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  // Check for existing location on app startup - Request location only once
  useEffect(() => {
    // Prevent multiple location requests
    if (locationRequested) return;
    setLocationRequested(true);

    const checkExistingLocation = async () => {
      try {
        const savedLocation = localStorage.getItem('rescueping-location');
        const locationPrompted = localStorage.getItem('rescueping-location-prompted');
        
        // If we have a saved location that's less than 1 hour old, use it
        if (savedLocation) {
          try {
            const locationData: LocationData = JSON.parse(savedLocation);
            const age = Date.now() - (locationData.timestamp || 0);
            
            // Use cached location if less than 1 hour old
            if (age < 60 * 60 * 1000) {
              console.log('📍 Using cached location (less than 1 hour old)');
              setCurrentLocation(locationData);
              setIsLocationLoaded(true);
              return;
            }
          } catch (e) {
            console.warn('Failed to parse saved location:', e);
          }
        }
        
        // If user was already prompted and denied, don't ask again this session
        if (locationPrompted === 'denied') {
          console.log('📍 User previously denied location access');
          if (savedLocation) {
            const locationData: LocationData = JSON.parse(savedLocation);
            setCurrentLocation(locationData);
            setIsLocationLoaded(true);
          } else {
            setShowLocationModal(true);
          }
          return;
        }
        
        // Request fresh geolocation
        if ('geolocation' in navigator) {
          console.log('📍 LocationContext: Requesting live browser geolocation...');
          
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              
              console.log(`✅ LocationContext: Got live GPS location: ${lat}, ${lon}`);
              
              // Reverse geocode to get city, state, country
              const locationData = await reverseGeocode(lat, lon);
              
              console.log('📍 LocationContext: Reverse geocoded to:', locationData);
              
              setCurrentLocation(locationData);
              setIsLocationLoaded(true);
              setShowLocationModal(false);
              
              // Save to BOTH localStorage locations
              localStorage.setItem('rescueping-location', JSON.stringify(locationData));
              localStorage.setItem('enhanced-location-cache', JSON.stringify(locationData));
              localStorage.setItem('rescueping-location-prompted', 'granted');
              
              // Trigger custom event
              console.log('📡 LocationContext: Broadcasting location-changed event');
              window.dispatchEvent(new CustomEvent('location-changed', { detail: locationData }));
              
              // Dispatch again to ensure all listeners catch it
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('location-changed', { detail: locationData }));
              }, 100);
            },
            (error) => {
              console.warn('❌ LocationContext: Geolocation denied or failed:', error.message);
              
              // Mark as denied
              localStorage.setItem('rescueping-location-prompted', 'denied');
              
              // Fallback: use saved location if available
              if (savedLocation) {
                try {
                  const locationData: LocationData = JSON.parse(savedLocation);
                  console.log('📍 LocationContext: Using saved location fallback');
                  setCurrentLocation(locationData);
                  setIsLocationLoaded(true);
                } catch (e) {
                  // Use default location (New Delhi, India)
                  const defaultLocation: LocationData = {
                    latitude: 28.6139,
                    longitude: 77.2090,
                    city: 'New Delhi',
                    state: 'Delhi',
                    country: 'India',
                    isManual: true,
                    timestamp: Date.now()
                  };
                  console.log('📍 LocationContext: Using default location (New Delhi)');
                  setCurrentLocation(defaultLocation);
                  setIsLocationLoaded(true);
                  localStorage.setItem('rescueping-location', JSON.stringify(defaultLocation));
                }
              } else {
                // Use default location (New Delhi, India) instead of showing modal
                const defaultLocation: LocationData = {
                  latitude: 28.6139,
                  longitude: 77.2090,
                  city: 'New Delhi',
                  state: 'Delhi',
                  country: 'India',
                  isManual: true,
                  timestamp: Date.now()
                };
                console.log('📍 LocationContext: Using default location (New Delhi)');
                setCurrentLocation(defaultLocation);
                setIsLocationLoaded(true);
                localStorage.setItem('rescueping-location', JSON.stringify(defaultLocation));
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0 // Never use cached position
            }
          );
        } else {
          // Browser doesn't support geolocation - use default location
          console.warn('⚠️ Geolocation not supported');
          
          if (savedLocation) {
            const locationData: LocationData = JSON.parse(savedLocation);
            setCurrentLocation(locationData);
            setIsLocationLoaded(true);
          } else {
            // Use default location (New Delhi, India)
            const defaultLocation: LocationData = {
              latitude: 28.6139,
              longitude: 77.2090,
              city: 'New Delhi',
              state: 'Delhi',
              country: 'India',
              isManual: true,
              timestamp: Date.now()
            };
            console.log('📍 LocationContext: Using default location (New Delhi)');
            setCurrentLocation(defaultLocation);
            setIsLocationLoaded(true);
            localStorage.setItem('rescueping-location', JSON.stringify(defaultLocation));
          }
        }
      } catch (error) {
        console.error('Error in location initialization:', error);
        // Use default location on error instead of showing modal
        const defaultLocation: LocationData = {
          latitude: 28.6139,
          longitude: 77.2090,
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          isManual: true,
          timestamp: Date.now()
        };
        console.log('📍 LocationContext: Using default location due to error');
        setCurrentLocation(defaultLocation);
        setIsLocationLoaded(true);
        localStorage.setItem('rescueping-location', JSON.stringify(defaultLocation));
      }
    };

    // Reverse geocode using multiple API fallbacks for better accuracy
    const reverseGeocode = async (lat: number, lon: number): Promise<LocationData> => {
      // Try Nominatim FIRST (most accurate city names)
      try {
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'RescuePing-DisasterApp/1.0'
            }
          }
        );
        
        if (!nominatimResponse.ok) {
          throw new Error(`Nominatim geocoding failed: ${nominatimResponse.status}`);
        }
        
        const nominatimData = await nominatimResponse.json();
        
        if (nominatimData && nominatimData.address) {
          const addr = nominatimData.address;
          // Prioritize: city > town > village > suburb > municipality
          const cityName = addr.city || addr.town || addr.village || addr.suburb || 
                          addr.municipality || addr.county || 'Unknown City';
          console.log('✅ Nominatim reverse geocode success:', {
            city: cityName,
            state: addr.state,
            country: addr.country,
            fullAddress: nominatimData.display_name
          });
          return {
            latitude: lat,
            longitude: lon,
            city: cityName,
            state: addr.state || addr.state_district || '',
            country: addr.country || 'Unknown Country',
            address: nominatimData.display_name,
            isManual: false,
            timestamp: Date.now()
          };
        } else {
          throw new Error('Nominatim returned no address data');
        }
      } catch (nominatimError) {
        console.warn('⚠️ Nominatim geocoding failed, trying OpenWeatherMap...', nominatimError);
        
        // Fallback 1: Try OpenWeatherMap
        try {
          const API_KEY = '1801423b3942e324ab80f5b47afe0859';
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`OpenWeatherMap geocoding failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            const location = data[0];
            console.log('✅ OpenWeatherMap reverse geocode success:', location.name);
            return {
              latitude: lat,
              longitude: lon,
              city: location.name || 'Unknown City',
              state: location.state || '',
              country: location.country || 'Unknown Country',
              isManual: false,
              timestamp: Date.now()
            };
          } else {
            throw new Error('OpenWeatherMap returned no data');
          }
        } catch (owmError) {
          console.warn('⚠️ OpenWeatherMap geocoding failed, trying BigDataCloud...', owmError);
          
          // Fallback 2: Try BigDataCloud (free, no API key required)
          try {
            const bdcResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            
            if (!bdcResponse.ok) {
              throw new Error(`BigDataCloud geocoding failed: ${bdcResponse.status}`);
            }
            
            const bdcData = await bdcResponse.json();
            
            if (bdcData) {
              console.log('✅ BigDataCloud reverse geocode success:', bdcData.city);
              return {
                latitude: lat,
                longitude: lon,
                city: bdcData.city || bdcData.locality || 'Unknown City',
                state: bdcData.principalSubdivision || '',
                country: bdcData.countryName || 'Unknown Country',
                isManual: false,
                timestamp: Date.now()
              };
            } else {
              throw new Error('BigDataCloud returned no data');
            }
          } catch (bdcError) {
            console.error('❌ All reverse geocoding APIs failed:', bdcError);
            
            // Return basic location data with coordinates only
            return {
              latitude: lat,
              longitude: lon,
              city: `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
              state: '',
              country: 'Unknown Country',
              isManual: false,
              timestamp: Date.now()
            };
          }
        }
      }
    };

    checkExistingLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocation = (location: LocationData) => {
    console.log('📍 Setting new location:', location);
    
    // Add timestamp if not present
    const locationWithTimestamp = {
      ...location,
      timestamp: location.timestamp || Date.now()
    };
    
    setCurrentLocation(locationWithTimestamp);
    setIsLocationLoaded(true);
    setShowLocationModal(false);
    
    // Save to localStorage
    localStorage.setItem('rescueping-location', JSON.stringify(locationWithTimestamp));
    localStorage.setItem('rescueping-location-prompted', 'granted');
    
    // Trigger custom event for other components to refresh data
    console.log('📡 Broadcasting location-changed event');
    window.dispatchEvent(new CustomEvent('location-changed', { detail: locationWithTimestamp }));
  };

  const requestLocationChange = () => {
    setShowLocationModal(true);
  };

  const skipLocationPermission = () => {
    console.log('📍 User skipped location permission, using default location');
    setShowLocationModal(false);
    // The default location is already set, so we just close the modal
  };

  const contextValue: LocationContextType = {
    currentLocation,
    isLocationLoaded,
    showLocationModal,
    requestLocationChange,
    setLocation,
    skipLocationPermission,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;