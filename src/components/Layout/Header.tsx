import React, { useState } from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, Settings, Home, BarChart3, AlertTriangle, MapPin, Shield } from 'lucide-react';
import { Flex, Text, Button } from '../../styles/components';
import { NotificationTraySystem } from '../Notifications/NotificationTray';
import { LocationDisplay } from '../Location/LocationDisplay';
import { useLocation } from '../../contexts/LocationContext';
import { enhancedSpacing, enhancedShadows } from '../../styles/enhanced-design-system';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  background: ${({ theme }) => theme.colors.background.secondary}; /* Dark slate header */
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default}; /* Dark separator */
  box-shadow: ${enhancedShadows.lg}; /* Enhanced professional shadow */
  padding: 0 ${enhancedSpacing[6]}; /* 24px enhanced padding */
  display: flex;
  align-items: center;
  gap: ${enhancedSpacing[5]}; /* 20px perfect gaps */
  backdrop-filter: blur(12px); /* Enhanced glass effect */
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  color: ${({ theme }) => theme.colors.text.primary}; /* High-contrast text */
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${enhancedSpacing[3]}; /* 12px enhanced gap */
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[600]}; /* Vivid red for dark mode */
  border-radius: ${({ theme }) => theme.borderRadius.lg}; /* 16px rounded */
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary}; /* High-contrast white */
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  box-shadow: ${enhancedShadows.default};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Enhanced easing */
  
  /* Enhanced brand interaction */
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${enhancedShadows.hover};
    background: ${({ theme }) => theme.colors.primary[500]}; /* Brighter on hover */
    background: ${({ theme }) => theme.colors.primary[500]}; /* Brighter on hover */
  }
`;

const BrandName = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']}; /* 26px */
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.brand}; /* Coral brand accent */
  margin: 0;
  letter-spacing: -0.02em; /* Tighter spacing for modern look */
`;

const Navigation = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ isActive, theme }) => 
    isActive ? theme.colors.surface.stripe : 'transparent' /* Subtle active background */
  };
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.text.brand : theme.colors.text.secondary
  };
  border: 1px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary[300] : 'transparent' /* Coral border */
  };
  border-radius: ${({ theme }) => theme.borderRadius.xl}; /* More rounded */
  font-size: ${({ theme }) => theme.typography.fontSize.base}; /* Larger text */
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold}; /* More emphasis */
  transition: ${({ theme }) => theme.transitions.bounce}; /* Bouncy feel */
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]}; /* Light coral hover */
    color: ${({ theme }) => theme.colors.primary[600]}; /* Coral hover text */
    border-color: ${({ theme }) => theme.colors.primary[200]}; /* Coral hover border */
    transform: translateY(-1px); /* Lift effect */
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const IconButton = styled.button`
  width: 44px; /* Slightly larger */
  height: 44px;
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]}; /* Coral border */
  border-radius: ${({ theme }) => theme.borderRadius.xl}; /* More rounded */
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.bounce}; /* Bouncy feel */
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm}; /* Elevated */
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]}; /* Light coral hover */
    color: ${({ theme }) => theme.colors.primary[600]}; /* Coral hover text */
    border-color: ${({ theme }) => theme.colors.primary[400]}; /* Coral hover border */
    transform: translateY(-2px); /* More lift */
    box-shadow: ${({ theme }) => theme.shadows.warmGlow}; /* Warm glow */
    border-color: ${({ theme }) => theme.colors.border.light};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.border.light};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.gradients.chart};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// Enhanced Location Section with Change Location Button
const LocationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .location-icon {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  .location-text {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const ChangeLocationButton = styled.button`
  padding: 4px 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

// Enhanced Location Section Component
const EnhancedLocationSection: React.FC = () => {
  const { currentLocation, requestLocationChange } = useLocation();
  
  if (!currentLocation) {
    return (
      <LocationSection>
        <LocationInfo>
          <MapPin size={16} className="location-icon" />
          <span className="location-text">Loading location...</span>
        </LocationInfo>
      </LocationSection>
    );
  }
  
  // Format location for display
  const formatLocation = (location: typeof currentLocation) => {
    if (location.address) {
      // Extract city and state from full address
      const parts = location.address.split(',');
      if (parts.length >= 2) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
      }
      return location.address;
    }
    return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
  };
  
  return (
    <LocationSection>
      <LocationInfo>
        <MapPin size={16} className="location-icon" />
        <span className="location-text">{formatLocation(currentLocation)}</span>
      </LocationInfo>
      <ChangeLocationButton onClick={requestLocationChange}>
        Change
      </ChangeLocationButton>
    </LocationSection>
  );
};

const Header: React.FC = () => {
  const routerLocation = useRouterLocation();
  
  const navItems = [
    { id: 'Home', label: 'Home', icon: Home, path: '/' },
    { id: 'Dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'Predictions', label: 'Predictions', icon: AlertTriangle, path: '/' },
    { id: 'Alerts', label: 'Alerts', icon: Bell, path: '/' },
    { id: 'Evacuation', label: 'Evacuation Routes', icon: MapPin, path: '/' },
    { id: 'Verify', label: 'System Verify', icon: Shield, path: '/verify' }
  ];

  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon><AlertTriangle size={16} /></LogoIcon>
        <BrandName>Rescue Ping</BrandName>
      </Logo>
      
      <Navigation>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = routerLocation.pathname === item.path;
          return (
            <NavItem
              key={item.id}
              to={item.path}
              isActive={isActive}
            >
              <IconComponent />
              {item.label}
            </NavItem>
          );
        })}
      </Navigation>
      
      <EnhancedLocationSection />
      
      <UserSection>
        <NotificationTraySystem />
        <IconButton>
          <Settings />
        </IconButton>
        <UserProfile>
          <Avatar>JD</Avatar>
          <Flex direction="column" gap="2px">
            <Text size="sm" weight="medium">John Doe</Text>
            <Text size="xs" color="secondary">Admin</Text>
          </Flex>
        </UserProfile>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;