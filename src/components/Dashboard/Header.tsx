import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  AlertTriangle, 
  Settings, 
  User, 
  Bell, 
  Download,
  RefreshCw,
  MapPin,
  Wifi,
  WifiOff,
  Home,
  Activity,
  Eye,
  Route,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { enhancedLocationService, EnhancedLocationData } from '../../services/enhancedLocationService';

interface HeaderProps {
  location?: any;
  systemStatus?: 'online' | 'offline' | 'degraded';
  onRefresh?: () => void;
  onExport?: () => void;
  lastUpdated?: string;
}

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 11, 15, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 56px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  color: #9CA3AF;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: #EF4444;
    background: rgba(239, 68, 68, 0.1);
  }
  
  &.active {
    color: #EF4444;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: #EF4444;
      border-radius: 1px;
    }
  }
  
  span {
    white-space: nowrap;
  }
  
  @media (max-width: 1024px) {
    span {
      display: none;
    }
    
    padding: 0.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #F7F8FA;
  text-decoration: none;
  
  .icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    
    .icon {
      width: 32px;
      height: 32px;
    }
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  font-size: 13px;
  color: #F7F8FA;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .location-icon {
    color: #EF4444;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.15);
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusIndicator = styled.div<{ status: 'online' | 'offline' | 'degraded' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'online':
        return `
          background: rgba(104, 211, 145, 0.1);
          color: #68D391;
          border: 1px solid rgba(104, 211, 145, 0.3);
        `;
      case 'offline':
        return `
          background: rgba(252, 129, 129, 0.1);
          color: #FC8181;
          border: 1px solid rgba(252, 129, 129, 0.3);
        `;
      case 'degraded':
        return `
          background: rgba(246, 173, 85, 0.1);
          color: #F6AD55;
          border: 1px solid rgba(246, 173, 85, 0.3);
        `;
    }
  }}
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4FD1C7 0%, #38B2AC 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(79, 209, 199, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: #E2E8F0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    
    span {
      display: none;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #4FD1C7 0%, #38B2AC 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(79, 209, 199, 0.5);
  }
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: #A0AEC0;
  text-align: right;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Header: React.FC<HeaderProps> = ({ 
  location, 
  systemStatus = 'online', 
  onRefresh, 
  onExport,
  lastUpdated 
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [enhancedLocation, setEnhancedLocation] = useState<EnhancedLocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Load enhanced location on component mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        setLocationLoading(true);
        const locationData = await enhancedLocationService.getCurrentLocation();
        setEnhancedLocation(locationData);
      } catch (error) {
        console.error('Failed to load location:', error);
      } finally {
        setLocationLoading(false);
      }
    };

    loadLocation();
  }, []);

  const handleLocationRefresh = async () => {
    try {
      setLocationLoading(true);
      const locationData = await enhancedLocationService.refreshLocation();
      setEnhancedLocation(locationData);
    } catch (error) {
      console.error('Failed to refresh location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'online':
        return <Wifi size={14} />;
      case 'offline':
        return <WifiOff size={14} />;
      case 'degraded':
        return <RefreshCw size={14} />;
    }
  };

  const formatLocation = async () => {
    if (locationLoading) return 'Detecting location...';
    
    if (enhancedLocation) {
      return await enhancedLocationService.getLocationString(enhancedLocation);
    }
    
    // Fallback to original location prop
    if (location) {
      const parts = [];
      if (location.city && location.city !== 'Unknown') parts.push(location.city);
      if (location.state && location.state !== 'Unknown') parts.push(location.state);
      if (location.country && location.country !== 'Unknown') parts.push(location.country);
      
      return parts.length > 0 ? parts.join(', ') : 'Location unavailable';
    }
    
    return 'Location unavailable';
  };

  const [locationDisplay, setLocationDisplay] = useState('Detecting location...');

  useEffect(() => {
    const updateLocationDisplay = async () => {
      const display = await formatLocation();
      setLocationDisplay(display);
    };
    
    updateLocationDisplay();
  }, [enhancedLocation, locationLoading, location]);

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo>
          <div className="icon">
            <AlertTriangle size={18} />
          </div>
          <span>Rescue Ping</span>
        </Logo>
        
        <Navigation>
          <NavItem className="active">
            <Home size={16} />
            <span>Home</span>
          </NavItem>
          <NavItem>
            <Activity size={16} />
            <span>Dashboard</span>
          </NavItem>
          <NavItem>
            <Eye size={16} />
            <span>Predictions</span>
          </NavItem>
          <NavItem>
            <Bell size={16} />
            <span>Alerts</span>
          </NavItem>
          <NavItem>
            <Route size={16} />
            <span>Evacuation Routes</span>
          </NavItem>
        </Navigation>
      </LeftSection>
      
      <RightSection>
        <LocationInfo onClick={handleLocationRefresh} style={{ cursor: locationLoading ? 'wait' : 'pointer' }}>
          <MapPin size={14} className="location-icon" />
          <span>{locationDisplay}</span>
          {locationLoading && <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
        </LocationInfo>
        
        {lastUpdated && (
          <LastUpdated>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </LastUpdated>
        )}
        
        <StatusIndicator status={systemStatus}>
          {getStatusIcon()}
          <span>{systemStatus === 'degraded' ? 'Limited' : systemStatus}</span>
        </StatusIndicator>
        
        <ActionButton variant="secondary" onClick={onRefresh}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </ActionButton>
        
        <ActionButton variant="primary">
          <Settings size={14} />
          <span>System Verify</span>
        </ActionButton>
        
        <UserMenu>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <User size={18} />
          </UserButton>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;