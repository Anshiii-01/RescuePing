import React, { useMemo, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Area, ComposedChart, Line } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Wind, Thermometer, AlertTriangle, Wifi, WifiOff, Sun, Cloud, CloudSun, CloudLightning, Droplets, CloudRain } from 'lucide-react';
import { Card, Heading, Text, Flex } from '../../styles/components';
import { ForecastData } from '../../types';
import { TemperatureConverter } from '../../utils/temperatureConverter';

// =====================================================
// ANIMATIONS
// =====================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

// =====================================================
// STYLED COMPONENTS
// =====================================================

const ForecastContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  background: linear-gradient(165deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.95) 50%, 
    rgba(15, 23, 42, 0.98) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  height: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
  }
`;

const ForecastHeader = styled(Flex)`
  padding: 16px 20px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.08), transparent);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
`;

const LiveIndicator = styled.div<{ isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ isLive }) => isLive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${({ isLive }) => isLive ? '#22c55e' : '#ef4444'};
  border: 1px solid ${({ isLive }) => isLive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 3px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active }) => active ? 'rgba(99, 102, 241, 0.3)' : 'transparent'};
  color: ${({ active }) => active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  
  &:hover {
    background: ${({ active }) => active ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 180px;
  max-height: 250px;
  padding: 12px 8px;
  position: relative;

  .recharts-wrapper {
    width: 100% !important;
    height: 100% !important;
  }
  
  @media (max-width: 768px) {
    min-height: 150px;
    max-height: 200px;
  }
`;

const DayCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding: 10px 12px;
  ${css`animation: ${slideIn} 0.4s ease-out;`}
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
    padding: 6px;
    overflow-x: auto;
    
    & > div {
      min-width: 60px;
    }
  }
`;

const DayCard = styled.div<{ riskLevel: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ riskLevel }) => 
    riskLevel === 'critical' ? 'rgba(239, 68, 68, 0.4)' :
    riskLevel === 'high' ? 'rgba(245, 158, 11, 0.4)' :
    riskLevel === 'medium' ? 'rgba(59, 130, 246, 0.4)' :
    'rgba(34, 197, 94, 0.3)'
  };
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 0, 0, 0.3);
  }
`;

const DayName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 6px;
`;

const WeatherIcon = styled.div<{ condition: string }>`
  font-size: 24px;
  margin: 4px 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ condition }) => 
      condition.includes('rain') || condition.includes('Rain') ? '#60a5fa' :
      condition.includes('cloud') || condition.includes('Cloud') ? '#94a3b8' :
      condition.includes('storm') || condition.includes('Storm') ? '#f59e0b' :
      '#fbbf24'
    };
  }
`;

const TempDisplay = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 4px 0;
`;

const TempRange = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
`;

const RiskBadge = styled.div<{ level: string }>`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 6px;
  background: ${({ level }) => 
    level === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
    level === 'high' ? 'rgba(245, 158, 11, 0.3)' :
    level === 'medium' ? 'rgba(59, 130, 246, 0.3)' :
    'rgba(34, 197, 94, 0.3)'
  };
  color: ${({ level }) => 
    level === 'critical' ? '#ef4444' :
    level === 'high' ? '#f59e0b' :
    level === 'medium' ? '#3b82f6' :
    '#22c55e'
  };
`;

const ForecastSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  background: rgba(0, 0, 0, 0.15);
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.08);
  
  svg {
    width: 16px;
    height: 16px;
    color: #6366f1;
  }
`;

const SummaryLabel = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
`;

const SummaryValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const CustomTooltipContainer = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  min-width: 180px;
  
  .tooltip-header {
    font-weight: 600;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .tooltip-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
    
    span:first-child {
      color: rgba(255, 255, 255, 0.6);
    }
    
    span:last-child {
      font-weight: 500;
    }
  }
`;

// LoadingState currently unused - kept for future loading UI
// const LoadingState = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   flex: 1;
//   gap: 16px;
//   padding: 40px;
//   
//   .spinner {
//     width: 40px;
//     height: 40px;
//     border: 3px solid rgba(99, 102, 241, 0.2);
//     border-top-color: #6366f1;
//     border-radius: 50%;
//     ${css`animation: ${pulse} 1s ease-in-out infinite;`}
//   }
// `;

// =====================================================
// INTERFACES
// =====================================================

interface SevenDayForecastProps {
  forecast?: ForecastData[];
  isLive?: boolean;
  source?: string;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getWeatherIcon = (conditions?: string) => {
  if (!conditions) return <Sun />;
  const lower = conditions.toLowerCase();
  if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain />;
  if (lower.includes('thunder') || lower.includes('storm')) return <CloudLightning />;
  if (lower.includes('cloud') && lower.includes('sun')) return <CloudSun />;
  if (lower.includes('cloud') || lower.includes('overcast')) return <Cloud />;
  return <Sun />;
};

const getRiskLevel = (score: number): string => {
  if (score >= 8) return 'critical';
  if (score >= 6.5) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

const getBarColor = (riskScore: number) => {
  if (riskScore >= 8) return '#dc2626';
  if (riskScore >= 6.5) return '#f59e0b';
  if (riskScore >= 4) return '#3b82f6';
  return '#22c55e';
};

// =====================================================
// COMPONENT
// =====================================================

const SevenDayForecast: React.FC<SevenDayForecastProps> = React.memo(({ 
  forecast,
  isLive = true,
  source = 'OpenWeatherMap'
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');
  
  // Generate fallback forecast data if none provided
  const displayForecast = useMemo(() => {
    if (forecast && forecast.length > 0) return forecast;
    
    // Generate 7-day fallback data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    return Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (today + i) % 7;
      // Deterministic values based on day index
      const baseTemp = 25 + (dayIndex * 1.5) % 8;
      const baseRisk = 3 + (dayIndex * 0.8) % 5;
      
      return {
        day: days[dayIndex],
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        temperature: baseTemp,
        precipitation: (dayIndex * 2.5) % 15,
        windSpeed: 10 + (dayIndex * 1.2) % 10,
        humidity: 55 + (dayIndex * 3) % 25,
        riskScore: baseRisk,
        conditions: i % 3 === 0 ? 'Partly Cloudy' : i % 3 === 1 ? 'Clear' : 'Light Rain'
      };
    });
  }, [forecast]);
  
  // Calculate summary stats
  const stats = useMemo(() => {
    if (!displayForecast || displayForecast.length === 0) return null;
    
    const validDays = displayForecast.filter(day => day.riskScore !== undefined && day.temperature !== undefined);
    if (validDays.length === 0) return null;
    
    const avgRisk = validDays.reduce((sum, day) => sum + (day.riskScore || 0), 0) / validDays.length;
    const maxRisk = Math.max(...validDays.map(day => day.riskScore || 0));
    const avgTemp = validDays.reduce((sum, day) => sum + (day.temperature || 0), 0) / validDays.length;
    const totalPrecip = validDays.reduce((sum, day) => sum + (day.precipitation || 0), 0);
    const avgWind = validDays.reduce((sum, day) => sum + (day.windSpeed || 0), 0) / validDays.length;
    const trendDirection = (validDays[validDays.length - 1]?.riskScore || 0) > (validDays[0]?.riskScore || 0) ? 'up' : 'down';
    
    return { avgRisk, maxRisk, avgTemp, totalPrecip, avgWind, trendDirection };
  }, [displayForecast]);

  // Determine if using fallback data
  const usingFallback = !forecast || forecast.length === 0;

  // Format tooltip
  const formatCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <CustomTooltipContainer>
          <div className="tooltip-header">{data.day} Forecast</div>
          <div className="tooltip-row">
            <span>Risk Score</span>
            <span style={{ color: getBarColor(data.riskScore || 0) }}>{(data.riskScore || 0).toFixed(1)}</span>
          </div>
          <div className="tooltip-row">
            <span>Temperature</span>
            <span>{TemperatureConverter.formatForDisplay(data.temperature || 0, 'C')}</span>
          </div>
          <div className="tooltip-row">
            <span>Precipitation</span>
            <span>{(data.precipitation || 0).toFixed(1)}mm</span>
          </div>
          <div className="tooltip-row">
            <span>Wind Speed</span>
            <span>{(data.windSpeed || 0).toFixed(0)} km/h</span>
          </div>
        </CustomTooltipContainer>
      );
    }
    return null;
  };

  return (
    <ForecastContainer>
      <ForecastHeader justify="between" align="center">
        <Flex align="center" gap="12px">
          <Calendar size={18} style={{ color: '#6366f1' }} />
          <div>
            <Heading level={5} weight="semibold" style={{ margin: 0 }}>7-Day Weather Forecast</Heading>
            <Text size="xs" color="secondary" style={{ marginTop: '2px' }}>{source}</Text>
          </div>
        </Flex>
        
        <Flex align="center" gap="12px">
          <ViewToggle>
            <ToggleButton active={viewMode === 'chart'} onClick={() => setViewMode('chart')}>
              Chart
            </ToggleButton>
            <ToggleButton active={viewMode === 'cards'} onClick={() => setViewMode('cards')}>
              Cards
            </ToggleButton>
          </ViewToggle>
          
          <LiveIndicator isLive={isLive && !usingFallback}>
            {isLive && !usingFallback ? <Wifi /> : <WifiOff />}
            <span>{usingFallback ? 'Demo' : isLive ? 'LIVE' : 'Cached'}</span>
          </LiveIndicator>
          
          {stats && (
            <Flex align="center" gap="4px" style={{ 
              padding: '4px 10px', 
              borderRadius: '12px',
              background: stats.trendDirection === 'up' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'
            }}>
              {stats.trendDirection === 'up' ? 
                <TrendingUp size={12} style={{ color: '#ef4444' }} /> : 
                <TrendingDown size={12} style={{ color: '#22c55e' }} />
              }
              <Text size="xs" style={{ color: stats.trendDirection === 'up' ? '#ef4444' : '#22c55e' }}>
                {stats.trendDirection === 'up' ? 'Rising' : 'Falling'}
              </Text>
            </Flex>
          )}
        </Flex>
      </ForecastHeader>
      
      {viewMode === 'chart' ? (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayForecast} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.6)' }}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'rgba(255, 255, 255, 0.5)' }}
                width={25}
              />
              <Tooltip content={formatCustomTooltip} />
              <Area
                type="monotone"
                dataKey="riskScore"
                stroke="transparent"
                fill="url(#riskGradient)"
              />
              <Bar 
                dataKey="riskScore" 
                radius={[4, 4, 0, 0]}
                barSize={28}
              >
                {displayForecast.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.riskScore)} />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="riskScore" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth={1.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <DayCardsContainer>
          {displayForecast.map((day, index) => {
            const riskLevel = getRiskLevel(day.riskScore || 0);
            return (
              <DayCard key={index} riskLevel={riskLevel}>
                <DayName>{day.day}</DayName>
                <WeatherIcon condition={day.conditions || 'clear'}>
                  {getWeatherIcon(day.conditions)}
                </WeatherIcon>
                <TempDisplay>{TemperatureConverter.formatForDisplay(day.temperature || 0, 'C')}</TempDisplay>
                <TempRange>{(day.precipitation || 0).toFixed(1)}mm | {(day.windSpeed || 0).toFixed(0)}km/h</TempRange>
                <RiskBadge level={riskLevel}>
                  Risk: {(day.riskScore || 0).toFixed(1)}
                </RiskBadge>
              </DayCard>
            );
          })}
        </DayCardsContainer>
      )}
      
      {stats && (
        <ForecastSummary>
          <SummaryCard>
            <AlertTriangle />
            <SummaryLabel>Avg Risk</SummaryLabel>
            <SummaryValue style={{ color: getBarColor(stats.avgRisk || 0) }}>
              {(stats.avgRisk || 0).toFixed(1)}
            </SummaryValue>
          </SummaryCard>
          
          <SummaryCard>
            <Thermometer />
            <SummaryLabel>Avg Temp</SummaryLabel>
            <SummaryValue>{TemperatureConverter.formatForDisplay(stats.avgTemp || 0, 'C')}</SummaryValue>
          </SummaryCard>
          
          <SummaryCard>
            <Droplets />
            <SummaryLabel>Total Precip</SummaryLabel>
            <SummaryValue>{(stats.totalPrecip || 0).toFixed(1)}mm</SummaryValue>
          </SummaryCard>
          
          <SummaryCard>
            <Wind />
            <SummaryLabel>Avg Wind</SummaryLabel>
            <SummaryValue>{(stats.avgWind || 0).toFixed(0)} km/h</SummaryValue>
          </SummaryCard>
        </ForecastSummary>
      )}
    </ForecastContainer>
  );
});

// Also export the forecast data type for use in Dashboard
export { SevenDayForecast };
export type { ForecastData };
export default SevenDayForecast;