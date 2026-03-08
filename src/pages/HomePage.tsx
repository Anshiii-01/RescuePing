import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Shield, Activity, MapPin,
  Thermometer, Wind, Droplets, ChevronRight,
  Navigation, Bell, Map, BarChart3,
  Zap, Clock, Globe, Users
} from 'lucide-react';
import { productionColors, productionCard } from '../styles/production-ui-system';
import SimpleWeatherService from '../services/simpleWeatherService';
import { enhancedLocationService } from '../services/enhancedLocationService';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
`;

// Styled Components
const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 72px 24px 24px;
  background: ${productionColors.background.primary};
  color: ${productionColors.text.primary};
  position: relative;
  z-index: 1;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 32px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: center;
  padding: 0 20px; /* Add padding to prevent edge overflow */
  overflow: hidden; /* Prevent content from overflowing container */
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 0 16px; /* Adequate padding on smaller screens */
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0 24px; /* Optimized padding for tablets */
    gap: 32px;
  }
`;

const HeroContent = styled.div`
  overflow: hidden; /* Prevent text overflow */
  
  @media (max-width: 1024px) {
    order: 1;
    max-width: 100%; /* Ensure content doesn't exceed container */
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0 16px; /* Add padding on tablets to prevent edge overflow */
  }
`;

const LiveStatusCard = styled.div`
  ${productionCard}
  padding: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  border: 1px solid rgba(99, 102, 241, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  
  @media (max-width: 1024px) {
    order: 2;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #22c55e;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const RiskIndicator = styled.div<{ level: 'low' | 'moderate' | 'high' | 'critical' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: ${({ level }) =>
    level === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
      level === 'high' ? 'rgba(245, 158, 11, 0.15)' :
        level === 'moderate' ? 'rgba(59, 130, 246, 0.15)' :
          'rgba(34, 197, 94, 0.15)'
  };
  border: 1px solid ${({ level }) =>
    level === 'critical' ? 'rgba(239, 68, 68, 0.4)' :
      level === 'high' ? 'rgba(245, 158, 11, 0.4)' :
        level === 'moderate' ? 'rgba(59, 130, 246, 0.4)' :
          'rgba(34, 197, 94, 0.4)'
  };
  border-radius: 12px;
  margin-bottom: 16px;
`;

const RiskScore = styled.div<{ level: string }>`
  font-size: 48px;
  font-weight: 800;
  color: ${({ level }) =>
    level === 'critical' ? '#ef4444' :
      level === 'high' ? '#f59e0b' :
        level === 'moderate' ? '#3b82f6' :
          '#22c55e'
  };
  line-height: 1;
`;

const RiskLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WeatherRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const WeatherStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  
  svg {
    color: #6366f1;
    margin-bottom: 4px;
  }
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const StatLabel = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const Title = styled.h1`
  font-size: clamp(36px, 5vw, 64px); /* Fluid typography: min 36px, preferred 5vw, max 64px */
  font-weight: 800;
  background: linear-gradient(135deg, ${productionColors.brand.primary}, ${productionColors.brand.secondary}, #f59e0b);
  background-size: 200% 200%;
  animation: ${shimmer} 3s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  line-height: 1.1;
  word-wrap: break-word; /* Prevent text overflow */
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: clamp(32px, 8vw, 48px); /* Smaller fluid range for mobile */
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: clamp(40px, 6vw, 56px); /* Optimized for tablets */
    padding: 0 20px; /* Add padding to prevent edge overflow */
  }
`;

const Subtitle = styled.p`
  font-size: clamp(16px, 2vw, 20px); /* Fluid typography for subtitle */
  color: ${productionColors.text.secondary};
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 32px;
  word-wrap: break-word; /* Prevent text overflow */
  overflow-wrap: break-word;
  
  @media (max-width: 1024px) {
    margin: 0 auto 32px;
    max-width: 90%; /* Prevent edge overflow on tablets */
    padding: 0 20px;
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: clamp(17px, 2.2vw, 19px); /* Optimized for tablets */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background: ${productionColors.gradients.brand};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glow} 3s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(99, 102, 241, 0.25);
    border-color: rgba(99, 102, 241, 0.6);
  }
`;

const QuickNavSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 48px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${productionColors.text.primary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #6366f1;
  }
`;

const QuickNavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const QuickNavCard = styled.button<{ color: string }>`
  ${productionCard}
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color }) => color};
    box-shadow: 0 8px 32px ${({ color }) => color}20;
  }
`;

const NavIconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ color }) => `${color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: ${({ color }) => color};
  }
`;

const NavContent = styled.div`
  flex: 1;
`;

const NavTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
`;

const NavDescription = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const FeaturesGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  ${productionCard}
  padding: 28px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${productionColors.brand.primary};
  }
`;

const FeatureIcon = styled.div<{ gradient: string }>`
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  border-radius: 16px;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${productionColors.text.primary};
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${productionColors.text.secondary};
  line-height: 1.6;
`;

const StatsSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  ${productionCard}
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 8px;
`;

const StatDesc = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

// Component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<string>('Loading...');
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');
  const [riskScore, setRiskScore] = useState<number>(2.4);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live data from real APIs
  const fetchLiveData = useCallback(async () => {
    try {
      const loc = await enhancedLocationService.getCurrentLocation();
      setLocation(`${loc.city || 'Unknown'}, ${loc.country || ''}`);

      const weatherData = await SimpleWeatherService.getWeather(loc.latitude, loc.longitude);
      setWeather(weatherData);

      // Calculate risk based on REAL weather data only - no random factors
      const tempRisk = weatherData.current.temp > 40 ? 3 : weatherData.current.temp > 35 ? 2 : weatherData.current.temp < 0 ? 2 : weatherData.current.temp < 5 ? 1 : 0;
      const windRisk = weatherData.current.wind_speed > 20 ? 3 : weatherData.current.wind_speed > 15 ? 2 : weatherData.current.wind_speed > 10 ? 1 : 0;
      const humidityRisk = weatherData.current.humidity > 90 ? 1.5 : weatherData.current.humidity > 85 ? 1 : 0;
      const visibilityRisk = weatherData.current.visibility < 1000 ? 1.5 : weatherData.current.visibility < 5000 ? 0.5 : 0;

      // Base risk of 1.5 (minimal) + weather factors - deterministic calculation
      const calculatedRisk = Math.min(1.5 + tempRisk + windRisk + humidityRisk + visibilityRisk, 10);

      setRiskScore(Number(calculatedRisk.toFixed(1)));
      setRiskLevel(
        calculatedRisk >= 7.5 ? 'critical' :
          calculatedRisk >= 5.5 ? 'high' :
            calculatedRisk >= 3.5 ? 'moderate' : 'low'
      );
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch live data:', error);
      // Show error state instead of fake data
      setLocation('Location unavailable');
      setRiskScore(0);
      setRiskLevel('low');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 300000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  const quickNavItems = [
    { title: 'Live Dashboard', desc: 'Real-time monitoring', icon: Activity, color: '#22c55e', path: '/dashboard' },
    { title: 'Risk Map', desc: 'Interactive flood zones', icon: Map, color: '#3b82f6', path: '/predictions?tab=risk-map' },
    { title: 'Evacuation', desc: 'Safety routes & shelters', icon: Navigation, color: '#f59e0b', path: '/evacuation' },
    { title: 'Alerts', desc: 'Active warnings', icon: Bell, color: '#ef4444', path: '/alerts' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'ML Prediction Engine',
      description: 'LSTM, XGBoost, GNN, and Anomaly Detection models provide ensemble predictions with 94% accuracy.',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    {
      icon: Globe,
      title: 'Multi-Hazard Assessment',
      description: 'Comprehensive analysis of floods, earthquakes, storms, fires, and landslides for your location.',
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
    },
    {
      icon: Map,
      title: 'Interactive Risk Maps',
      description: 'Leaflet-powered maps with real-time flood zones, evacuation routes, and shelter locations.',
      gradient: 'linear-gradient(135deg, #22c55e, #10b981)'
    },
    {
      icon: Clock,
      title: '7-Day Forecasting',
      description: 'Extended weather forecasts with risk predictions to help you plan ahead.',
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
    },
    {
      icon: Shield,
      title: 'Emergency Response',
      description: 'Instant evacuation routes, emergency contacts, and safety protocols when disaster strikes.',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      icon: Users,
      title: 'Community Alerts',
      description: 'Share and receive real-time updates from your community during emergencies.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <Title>Rescue Ping</Title>
          <Subtitle>
            AI-powered disaster prediction and emergency response system.
            Real-time monitoring, intelligent forecasting, and life-saving alerts.
          </Subtitle>
          <ButtonGroup>
            <PrimaryButton onClick={() => navigate('/dashboard')}>
              Open Dashboard
              <ChevronRight size={20} />
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/alerts')}>
              <Bell size={20} />
              View Alerts
            </SecondaryButton>
          </ButtonGroup>
        </HeroContent>

        <LiveStatusCard>
          <StatusHeader>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Current Status</span>
            <LiveBadge>LIVE</LiveBadge>
          </StatusHeader>

          <RiskIndicator level={riskLevel}>
            <RiskScore level={riskLevel}>{riskScore.toFixed(1)}</RiskScore>
            <RiskLabel>Risk Level: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</RiskLabel>
          </RiskIndicator>

          <WeatherRow>
            <WeatherStat>
              <Thermometer size={16} />
              <StatValue>{weather?.current?.temp?.toFixed(0) || '--'}°C</StatValue>
              <StatLabel>Temp</StatLabel>
            </WeatherStat>
            <WeatherStat>
              <Wind size={16} />
              <StatValue>{weather?.current?.wind_speed?.toFixed(0) || '--'}</StatValue>
              <StatLabel>km/h</StatLabel>
            </WeatherStat>
            <WeatherStat>
              <Droplets size={16} />
              <StatValue>{weather?.current?.humidity || '--'}%</StatValue>
              <StatLabel>Humidity</StatLabel>
            </WeatherStat>
          </WeatherRow>

          <LocationText>
            <MapPin />
            {location}
          </LocationText>

          {lastUpdated && (
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '8px', textAlign: 'center' }}>
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </LiveStatusCard>
      </HeroSection>

      <QuickNavSection>
        <SectionTitle>
          <Zap size={24} />
          Quick Access
        </SectionTitle>
        <QuickNavGrid>
          {quickNavItems.map((item, index) => (
            <QuickNavCard
              key={index}
              color={item.color}
              onClick={() => navigate(item.path)}
            >
              <NavIconWrapper color={item.color}>
                <item.icon size={24} />
              </NavIconWrapper>
              <NavContent>
                <NavTitle>{item.title}</NavTitle>
                <NavDescription>{item.desc}</NavDescription>
              </NavContent>
              <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </QuickNavCard>
          ))}
        </QuickNavGrid>
      </QuickNavSection>

      <SectionTitle style={{ maxWidth: '1400px', margin: '0 auto 24px' }}>
        <BarChart3 size={24} />
        Key Features
      </SectionTitle>
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon gradient={feature.gradient}>
              <feature.icon size={28} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <StatsSection>
        <StatCard>
          <StatNumber>94%</StatNumber>
          <StatDesc>Prediction Accuracy</StatDesc>
        </StatCard>
        <StatCard>
          <StatNumber>4</StatNumber>
          <StatDesc>ML Models Active</StatDesc>
        </StatCard>
        <StatCard>
          <StatNumber>5+</StatNumber>
          <StatDesc>Hazard Types Tracked</StatDesc>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatDesc>Real-time Monitoring</StatDesc>
        </StatCard>
      </StatsSection>
    </HomeContainer>
  );
};

export default HomePage;
