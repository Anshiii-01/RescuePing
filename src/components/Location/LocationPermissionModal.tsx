/**
 * PRODUCTION-GRADE LOCATION PERMISSION MODAL
 * First-visit blocking modal with professional UX
 * Implements location access flow with fallback options
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { MapPin, AlertCircle, Navigation } from 'lucide-react';
import { enhancedSpacing } from '../../styles/enhanced-design-system';
import { LocationPermissionModalProps } from './types';
import { ExternalAPIService } from '../../services/externalAPIs';

// Animation keyframes (for future use)
// const slideUpFadeIn = keyframes`...`;
// const pulseGlow = keyframes`...`;// Permission states
export type LocationPermissionState = 'requesting' | 'granted' | 'denied' | 'manual_entry' | 'completed';

// Types now imported from types.ts

// Full-screen modal overlay
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  padding: ${enhancedSpacing[6]};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 16px;
  padding: ${enhancedSpacing[12]}; /* 48px */
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  transform: translateY(0);
  transition: all 0.3s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${enhancedSpacing[6]};
`;

const LocationIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${enhancedSpacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${enhancedSpacing[5]};
`;

const ModalDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  line-height: 1.6;
  margin-bottom: ${enhancedSpacing[8]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${enhancedSpacing[5]};
  flex-direction: column;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: 12px;
  padding: ${enhancedSpacing[5]} ${enhancedSpacing[8]};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${enhancedSpacing[2]};
  min-height: 48px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.surface.border};
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  padding: ${enhancedSpacing[5]} ${enhancedSpacing[8]};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.border.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger[50]};
  border: 1px solid ${({ theme }) => theme.colors.danger[300]};
  border-radius: 8px;
  padding: ${enhancedSpacing[4]};
  margin-top: ${enhancedSpacing[5]};
  color: ${({ theme }) => theme.colors.danger[600]};
  display: flex;
  align-items: center;
  gap: ${enhancedSpacing[2]};
`;

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onLocationGranted,
  onLocationDenied,
  onManualEntry
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🌍 Requesting location using enhanced API service...');
      
      // Use the enhanced browser location function from ExternalAPIService
      const locationData = await ExternalAPIService.getBrowserLocation();

      if (!locationData) {
        throw new Error('Unable to get location data');
      }

      // Store location in localStorage
      localStorage.setItem('rescueping-location', JSON.stringify(locationData));

      console.log('✅ Location obtained successfully:', locationData);
      onLocationGranted(locationData);

    } catch (error: any) {
      console.error('Location request failed:', error);
      
      let errorMessage = 'Failed to get your location. ';
      
      switch (error.code) {
        case GeolocationPositionError.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. You can still use Rescue Ping by entering your location manually.';
          break;
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please try manual entry.';
          break;
        case GeolocationPositionError.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again or use manual entry.';
          break;
        default:
          errorMessage = error.message || 'An unknown error occurred while getting your location.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationGranted]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onLocationDenied?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onLocationDenied]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent role="dialog" aria-labelledby="location-modal-title" aria-describedby="location-modal-description">
        <ModalHeader>
          <LocationIcon>
            <MapPin size={40} color="white" />
          </LocationIcon>
        </ModalHeader>
        
        <ModalTitle id="location-modal-title">
          Location Access Required
        </ModalTitle>
        
        <ModalDescription id="location-modal-description">
          Rescue Ping needs your location to provide accurate disaster predictions, weather alerts, and emergency response information for your area. 
          Your location data stays on your device and is only used for disaster predictions.
        </ModalDescription>

        {error && (
          <ErrorMessage>
            <AlertCircle size={20} />
            <span>{error}</span>
          </ErrorMessage>
        )}
        
        <ButtonGroup>
          <PrimaryButton 
            onClick={requestLocation} 
            disabled={isLoading}
            aria-label={error && error.includes('timed out') ? "Try location access again" : "Allow location access"}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation size={20} />
                {error && error.includes('timed out') ? 'Try Again' : 'Use This Location'}
              </>
            )}
          </PrimaryButton>
          
          <SecondaryButton 
            onClick={() => onManualEntry && onManualEntry()}
            aria-label="Enter location manually"
          >
            Enter Manually
          </SecondaryButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};