/**
 * ENHANCED LOCATION PERMISSION MODAL
 * Production-grade first-visit modal with professional UX
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { MapPin, AlertTriangle, Search, Loader } from 'lucide-react';
import LocationResolver from '../../services/locationResolver';

// Enhanced animation keyframes
const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
`;

// Modal overlay - blocks entire dashboard
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

// Modal content container with enhanced shadows
const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.30), 0 16px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  
  ${css`animation: ${slideUpFadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);`}
  position: relative;
  
  @media (max-width: 480px) {
    margin: 16px;
    padding: 24px;
    border-radius: 16px;
  }
`;

// Header with animated icon
const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  ${css`animation: ${pulseGlow} 2s ease-in-out infinite;`}
  
  svg {
    width: 36px;
    height: 36px;
    color: white;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

// Button containers
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18), 0 6px 12px rgba(0, 0, 0, 0.08);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${({ theme }) => theme.colors.surface.hover};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  padding: 16px 32px;
  font-size: 0.95rem;
  border-radius: 12px;
  cursor: pointer;
  
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

// Manual location input
const ManualLocationContainer = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`;

const LocationInput = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.caption};
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.danger[600]};
  font-size: 0.875rem;
  margin-top: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.danger[50]};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.danger[200]};
`;

// Types
export type LocationPermissionState = 'requesting' | 'granted' | 'denied' | 'manual_entry' | 'completed';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  timestamp: number;
  address?: string;
  accuracy?: number;
  isManual: boolean;
}

interface EnhancedLocationPermissionModalProps {
  isOpen: boolean;
  onLocationGranted: (location: LocationData) => void;
  onClose?: () => void;
  onSkip?: () => void;
}

export const EnhancedLocationPermissionModal: React.FC<EnhancedLocationPermissionModalProps> = ({
  isOpen,
  onLocationGranted,
  onClose,
  onSkip
}) => {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('requesting');
  const [isLoading, setIsLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Request GPS location permission
  const requestLocationPermission = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Use LocationResolver for comprehensive reverse geocoding
      let locationDetails;
      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      
      try {
        console.log('🔍 Resolving location name for coordinates:', { latitude, longitude });
        locationDetails = await LocationResolver.getLocationDetails(latitude, longitude);
        address = locationDetails.fullAddress;
        console.log('✅ Location resolved successfully:', locationDetails);
      } catch (geocodeError) {
        console.warn('LocationResolver failed, using fallback:', geocodeError);
        // Fallback to basic OpenStreetMap reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          address = data.display_name;
          
          // Extract basic location components as fallback
          locationDetails = {
            city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
            state: data.address?.state || data.address?.region || 'Unknown State',
            country: data.address?.country || 'Unknown Country',
            fullAddress: data.display_name
          };
        } catch (fallbackError) {
          console.warn('Fallback reverse geocoding also failed:', fallbackError);
          locationDetails = {
            city: 'Unknown City',
            state: 'Unknown State', 
            country: 'Unknown Country',
            fullAddress: address
          };
        }
      }

      const locationData: LocationData = {
        latitude,
        longitude,
        city: locationDetails.city,
        state: locationDetails.state,
        country: locationDetails.country,
        address: address,
        accuracy,
        timestamp: Date.now(),
        isManual: false
      };

      // Store in localStorage
      localStorage.setItem('rescueping-location', JSON.stringify(locationData));
      
      setPermissionState('granted');
      onLocationGranted(locationData);

    } catch (error: any) {
      console.error('Location permission error:', error);
      
      if (error.code === 1) { // PERMISSION_DENIED
        setPermissionState('denied');
        setError('Location access was denied. Please enable location or enter your city manually.');
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        setError('Location information is unavailable. Please enter your city manually.');
        setPermissionState('manual_entry');
      } else if (error.code === 3) { // TIMEOUT
        setError('Location request timed out. Please try again or enter your city manually.');
        setPermissionState('manual_entry');
      } else {
        setError('Failed to get location. Please enter your city manually.');
        setPermissionState('manual_entry');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual location entry
  const handleManualLocationSubmit = async () => {
    if (!manualLocation.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching for manual location:', manualLocation);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualLocation)}&format=json&limit=1`
      );
      
      const results = await response.json();
      
      if (results.length === 0) {
        throw new Error('Location not found. Please try a different city or address.');
      }

      const result = results[0];
      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);
      
      // Use LocationResolver for detailed location information
      let locationDetails;
      try {
        console.log('🔍 Resolving detailed location for manual entry:', { latitude, longitude });
        locationDetails = await LocationResolver.getLocationDetails(latitude, longitude);
        console.log('✅ Manual location resolved successfully:', locationDetails);
      } catch (resolverError) {
        console.warn('LocationResolver failed for manual entry, using basic data:', resolverError);
        
        // Extract basic location components from Nominatim response
        const address = result.address || {};
        locationDetails = {
          city: address.city || address.town || address.village || 'Unknown City',
          state: address.state || address.region || 'Unknown State',
          country: address.country || 'Unknown Country',
          fullAddress: result.display_name
        };
      }

      const locationData: LocationData = {
        latitude,
        longitude,
        city: locationDetails.city,
        state: locationDetails.state,
        country: locationDetails.country,
        address: locationDetails.fullAddress,
        timestamp: Date.now(),
        isManual: true
      };

      // Store in localStorage
      localStorage.setItem('rescueping-location', JSON.stringify(locationData));

      setPermissionState('completed');
      onLocationGranted(locationData);

    } catch (error: any) {
      setError(error.message || 'Failed to find location. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPermissionState('requesting');
      setError(null);
      setManualLocation('');
      setIsLoading(false);
    }
  }, [isOpen]);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <ModalContent>
        <ModalHeader>
          <IconContainer>
            <MapPin />
          </IconContainer>
          <ModalTitle>Enable Location for Better Alerts</ModalTitle>
          <ModalDescription>
            Rescue Ping works best with your location to provide accurate, hyperlocal disaster risk predictions and emergency alerts for your area. You can skip this for now and use a default location, or enable location access anytime from settings.
          </ModalDescription>
        </ModalHeader>

        {permissionState === 'requesting' && (
          <ButtonGroup>
            <PrimaryButton
              onClick={requestLocationPermission}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading">
                  <Loader size={16} className="animate-spin" />
                  Getting Location...
                </div>
              ) : (
                <>
                  <MapPin size={16} />
                  Allow Location Access
                </>
              )}
            </PrimaryButton>

            <SecondaryButton onClick={() => setPermissionState('manual_entry')}>
              <Search size={16} />
              Enter City Manually
            </SecondaryButton>

            {onSkip && (
              <SecondaryButton onClick={onSkip}>
                Skip for Now
              </SecondaryButton>
            )}
          </ButtonGroup>
        )}

        {(permissionState === 'denied' || permissionState === 'manual_entry') && (
          <>
            {error && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {error}
              </ErrorMessage>
            )}
            
            <ManualLocationContainer>
              <LocationInput
                type="text"
                placeholder="Enter your city, state, or address..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualLocationSubmit();
                  }
                }}
                autoFocus
              />
              
              <ButtonGroup style={{ marginTop: '16px' }}>
                <PrimaryButton 
                  onClick={handleManualLocationSubmit}
                  disabled={isLoading || !manualLocation.trim()}
                >
                  {isLoading ? (
                    <div className="loading">
                      <Loader size={16} />
                      Finding Location...
                    </div>
                  ) : (
                    <>
                      <Search size={16} />
                      Use This Location
                    </>
                  )}
                </PrimaryButton>
                
                {permissionState === 'denied' && (
                  <SecondaryButton onClick={requestLocationPermission}>
                    <MapPin size={16} />
                    Try GPS Again
                  </SecondaryButton>
                )}
              </ButtonGroup>
            </ManualLocationContainer>
          </>
        )}

        {error && permissionState === 'requesting' && (
          <ErrorMessage>
            <AlertTriangle size={16} />
            {error}
          </ErrorMessage>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default EnhancedLocationPermissionModal;