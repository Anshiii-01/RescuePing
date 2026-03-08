import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Search, MapPin, X } from 'lucide-react';
import { spacing } from '../../styles/spacing';
import { ExternalAPIService } from '../../services/externalAPIs';
import { LocationData } from './types';

// LocationData interface imported from ./types

interface ManualLocationInputProps {
  isOpen: boolean;
  onLocationSelected: (location: LocationData) => void;
  onClose: () => void;
}

interface PlaceResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  padding: ${spacing.xl};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 16px;
  padding: ${spacing['3xl']};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.xl};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${spacing.xl};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.lg} ${spacing.lg} ${spacing.lg} ${spacing['4xl']};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary[600]}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.caption};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const ResultsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface.default};
  margin-top: ${spacing.sm};
`;

const ResultItem = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultText = styled.div`
  flex: 1;
`;

const ResultTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 2px;
`;

const ResultSubtitle = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const LoadingMessage = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.danger[600]};
  background: ${({ theme }) => theme.colors.danger[50]};
  border-radius: 8px;
  margin-top: ${spacing.sm};
`;

const NoResults = styled.div`
  padding: ${spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ManualLocationInput: React.FC<ManualLocationInputProps> = ({
  isOpen,
  onLocationSelected,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search for locations using Google Maps Geocoding API
  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching for locations with enhanced geocoding:', searchQuery);
      
      // Use ExternalAPIService for geocoding
      const locationData = await ExternalAPIService.geocodeAddress(searchQuery);
      
      if (locationData) {
        // Convert to results format for display
        const mockResults = [{
          display_name: locationData.address || `${locationData.city}, ${locationData.state}, ${locationData.country}`,
          lat: locationData.latitude.toString(),
          lon: locationData.longitude.toString(),
          address: {
            city: locationData.city,
            state: locationData.state,
            country: locationData.country
          }
        }];
        setResults(mockResults);
        console.log('✅ Location found via Google Geocoding:', mockResults);
      } else {
        // Fallback to Nominatim if Google fails
        console.log('⚠️ Google geocoding failed, trying Nominatim fallback...');
        await searchWithNominatim(searchQuery);
      }

    } catch (err) {
      console.error('Location search failed:', err);
      // Try Nominatim as fallback
      await searchWithNominatim(searchQuery);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback search using Nominatim
  const searchWithNominatim = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=10&countrycodes=us,ca,mx,gb,au,de,fr,jp,in`, // Added India
        {
          headers: {
            'User-Agent': 'RescuePing-DisasterManagement/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data);
      console.log('✅ Fallback search completed via Nominatim');

    } catch (err) {
      console.error('Nominatim fallback failed:', err);
      setError('Failed to search locations. Please check your internet connection and try again.');
      setResults([]);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 500ms
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(newQuery);
    }, 500);
  };

  // Handle location selection
  const handleLocationSelect = (place: PlaceResult) => {
    const locationData: LocationData = {
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      city: place.address.city || place.address.town || place.address.village || 'Unknown City',
      state: place.address.state || 'Unknown State',
      country: place.address.country || 'Unknown Country',
      timestamp: Date.now()
    };

    // Store location in localStorage
    localStorage.setItem('rescueping-location', JSON.stringify(locationData));
    
    onLocationSelected(locationData);
  };

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent role="dialog" aria-labelledby="manual-location-title">
        <ModalHeader>
          <ModalTitle id="manual-location-title">
            <MapPin size={24} />
            Enter Your Location
          </ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close location input">
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Search for your city, state, or address..."
            value={query}
            onChange={handleInputChange}
            aria-label="Search for location"
          />

          {(results.length > 0 || isLoading || error) && (
            <ResultsList>
              {isLoading && (
                <LoadingMessage>Searching for locations...</LoadingMessage>
              )}

              {error && (
                <ErrorMessage>{error}</ErrorMessage>
              )}

              {!isLoading && !error && results.length === 0 && query.length >= 3 && (
                <NoResults>
                  No locations found. Try a different search term or include city and state.
                </NoResults>
              )}

              {!isLoading && !error && results.map((place, index) => (
                <ResultItem
                  key={`${place.lat}-${place.lon}-${index}`}
                  onClick={() => handleLocationSelect(place)}
                  role="option"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleLocationSelect(place);
                    }
                  }}
                >
                  <MapPin size={16} />
                  <ResultText>
                    <ResultTitle>
                      {place.address.city || place.address.town || place.address.village}
                      {place.address.state && `, ${place.address.state}`}
                    </ResultTitle>
                    <ResultSubtitle>{place.display_name}</ResultSubtitle>
                  </ResultText>
                </ResultItem>
              ))}
            </ResultsList>
          )}
        </SearchContainer>
      </ModalContent>
    </ModalOverlay>
  );
};