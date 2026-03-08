import React, { useState } from 'react';
import styled from 'styled-components';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { LocationPermissionModal } from './Location/LocationPermissionModal';
import { useGeolocation } from './Location/GeolocationManager';

const TestContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 250px;
`;

const TestButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const StatusText = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  background: ${({ type }) => 
    type === 'success' ? '#dcfce7' : 
    type === 'error' ? '#fef2f2' : '#f0f9ff'};
  color: ${({ type }) => 
    type === 'success' ? '#166534' : 
    type === 'error' ? '#dc2626' : '#1e40af'};
`;

const LocationDebugTool: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { location, isLoading, error, clearLocation } = useGeolocation();
  
  const clearLocalStorage = () => {
    localStorage.removeItem('rescueping-location');
    localStorage.removeItem('rescueping-location-prompted');
    clearLocation();
    console.log('Location data cleared from localStorage');
  };

  const testGeolocationAPI = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    console.log('Testing geolocation API...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Geolocation success:', position.coords);
        alert(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        alert(`Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleLocationGranted = (locationData: any) => {
    console.log('Location granted:', locationData);
    setShowModal(false);
  };

  const handleLocationDenied = () => {
    console.log('Location denied');
    setShowModal(false);
  };

  const handleManualEntry = () => {
    console.log('Manual entry requested');
    setShowModal(false);
  };

  return (
    <>
      <TestContainer>
        <h4 style={{ margin: 0, fontSize: '14px' }}>Location Debug</h4>
        
        {location && (
          <StatusText type="success">
            📍 {location.city}, {location.state}
            <br />
            <small>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</small>
          </StatusText>
        )}
        
        {error && (
          <StatusText type="error">
            ❌ {error}
          </StatusText>
        )}
        
        {isLoading && (
          <StatusText type="info">
            ⏳ Loading location...
          </StatusText>
        )}
        
        <TestButton onClick={() => setShowModal(true)}>
          <Navigation size={16} />
          Show Location Modal
        </TestButton>
        
        <TestButton onClick={testGeolocationAPI}>
          <MapPin size={16} />
          Test Browser API
        </TestButton>
        
        <TestButton onClick={clearLocalStorage}>
          <AlertCircle size={16} />
          Clear Storage
        </TestButton>
        
        <StatusText type="info">
          Modal prompted: {localStorage.getItem('rescueping-location-prompted') || 'false'}
        </StatusText>
      </TestContainer>

      <LocationPermissionModal
        isOpen={showModal}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
        onManualEntry={handleManualEntry}
      />
    </>
  );
};

export default LocationDebugTool;