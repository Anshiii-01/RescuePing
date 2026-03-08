/**
 * RiskTrendChart - Historical and Predictive Risk Visualization
 * Uses pure CSS/SVG for beautiful animated charts
 */

import React, { useState, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { productionColors } from '../../styles/production-ui-system';
import { getAccessibleChartColor } from '../../styles/colorblindAccessibility';

interface DataPoint {
  timestamp: Date;
  value: number;
  predicted?: boolean;
}

interface RiskTrendChartProps {
  data?: DataPoint[];
  title?: string;
  unit?: string;
  height?: number;
  showPrediction?: boolean;
  riskThresholds?: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drawLine = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`;

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.6; }
`;

// Styled Components
const ChartContainer = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 16px;
  padding: 20px;
  ${css`animation: ${fadeIn} 0.5s ease-out;`}
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: ${productionColors.text.primary};
  margin: 0;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 6px;
`;

const TimeButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.$active ? productionColors.brand.primary : productionColors.border.secondary};
  background: ${props => props.$active ? 'rgba(239, 68, 68, 0.15)' : 'transparent'};
  color: ${props => props.$active ? productionColors.brand.primary : productionColors.text.secondary};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${productionColors.brand.primary};
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ChartSVG = styled.svg`
  width: 100%;
  display: block;
`;

const GridLine = styled.line`
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 1;
`;

const ThresholdLine = styled.line<{ $level: string }>`
  stroke: ${props => {
    switch (props.$level) {
      case 'critical': return getAccessibleChartColor(3); // Magenta
      case 'high': return getAccessibleChartColor(1); // Orange
      case 'moderate': return getAccessibleChartColor(4); // Yellow
      default: return getAccessibleChartColor(2); // Teal
    }
  }};
  stroke-width: 2;
  stroke-dasharray: 4, 4;
  opacity: 0.9;
`;

const ThresholdLabel = styled.text<{ $level: string }>`
  fill: ${props => {
    switch (props.$level) {
      case 'critical': return getAccessibleChartColor(3);
      case 'high': return getAccessibleChartColor(1);
      case 'moderate': return getAccessibleChartColor(4);
      default: return getAccessibleChartColor(2);
    }
  }};
  font-size: 14px;
  font-weight: 600;
`;

const DataPath = styled.path<{ $isPrediction?: boolean }>`
  fill: none;
  stroke: ${props => props.$isPrediction ? getAccessibleChartColor(5) : getAccessibleChartColor(0)};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: ${props => props.$isPrediction ? '8, 4' : 'none'};
  ${css`animation: ${drawLine} 1.5s ease-out forwards;`}
  stroke-dashoffset: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const AreaGradient = styled.path<{ $isPrediction?: boolean }>`
  fill: url(${props => props.$isPrediction ? '#predictionGradient' : '#areaGradient'});
  opacity: 0.3;
`;

const DataDot = styled.circle<{ $isLast?: boolean; $isPrediction?: boolean }>`
  fill: ${props => props.$isPrediction ? getAccessibleChartColor(5) : getAccessibleChartColor(0)};
  stroke: #fff;
  stroke-width: 2;
  ${props => props.$isLast && css`animation: ${pulseDot} 2s ease-in-out infinite;`}
  r: 5;
`;

const TooltipGroup = styled.g`
  pointer-events: all;
  cursor: crosshair;
`;

const TooltipLine = styled.line`
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 1;
  stroke-dasharray: 3, 3;
`;

const AxisLabel = styled.text`
  fill: ${productionColors.text.tertiary};
  font-size: 14px;
  font-weight: 500;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${productionColors.border.secondary};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${productionColors.text.secondary};
`;

const LegendLine = styled.span<{ $dashed?: boolean; $color: string }>`
  width: 24px;
  height: 3px;
  background: ${props => props.$color};
  border-radius: 2px;
  ${props => props.$dashed && `
    background: linear-gradient(90deg, ${props.$color} 60%, transparent 60%);
    background-size: 8px 100%;
  `}
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const StatCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${productionColors.border.secondary};
  border-radius: 10px;
  padding: 12px;
  text-align: center;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.$color || productionColors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${productionColors.text.tertiary};
  text-transform: uppercase;
  margin-top: 4px;
`;

const RiskTrendChart: React.FC<RiskTrendChartProps> = ({
  data,
  title = 'Risk Trend Analysis',
  unit = '%',
  height = 280,
  showPrediction = true,
  riskThresholds = { low: 0.3, moderate: 0.5, high: 0.7, critical: 0.85 },
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Generate sample data if none provided
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;

    const points: DataPoint[] = [];
    const now = new Date();
    const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    
    for (let i = hoursBack; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      // Generate realistic-looking trend
      const baseValue = 0.35;
      const trend = Math.sin(i / 12) * 0.15;
      const noise = (Math.random() - 0.5) * 0.1;
      const value = Math.max(0, Math.min(1, baseValue + trend + noise));
      points.push({ timestamp, value, predicted: false });
    }

    // Add prediction points
    if (showPrediction) {
      for (let i = 1; i <= 12; i++) {
        const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
        const lastValue = points[points.length - 1].value;
        const drift = (Math.random() - 0.3) * 0.05;
        const value = Math.max(0, Math.min(1, lastValue + drift * i * 0.5));
        points.push({ timestamp, value, predicted: true });
      }
    }

    return points;
  }, [data, timeRange, showPrediction]);

  // Chart dimensions
  const padding = { top: 20, right: 60, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const xScale = (index: number) => 
    padding.left + (index / (chartData.length - 1)) * innerWidth;
  
  const yScale = (value: number) => 
    padding.top + innerHeight - (value * innerHeight);

  // Generate path data
  const historicalData = chartData.filter(d => !d.predicted);
  const predictionData = chartData.filter(d => d.predicted);

  const createPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    
    const startIndex = chartData.indexOf(points[0]);
    return points.map((point, i) => {
      const x = xScale(startIndex + i);
      const y = yScale(point.value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };

  const createAreaPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    
    const startIndex = chartData.indexOf(points[0]);
    const linePath = points.map((point, i) => {
      const x = xScale(startIndex + i);
      const y = yScale(point.value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const lastX = xScale(startIndex + points.length - 1);
    const firstX = xScale(startIndex);
    
    return `${linePath} L ${lastX} ${yScale(0)} L ${firstX} ${yScale(0)} Z`;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const values = historicalData.map(d => d.value);
    const current = values[values.length - 1] || 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return { current, avg, max, min };
  }, [historicalData]);

  const getRiskColor = (value: number) => {
    if (value >= riskThresholds.critical) return '#EF4444';
    if (value >= riskThresholds.high) return '#F97316';
    if (value >= riskThresholds.moderate) return '#FBBF24';
    return '#22C55E';
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          📈 {title}
        </ChartTitle>
        <TimeRangeSelector>
          <TimeButton $active={timeRange === '24h'} onClick={() => setTimeRange('24h')}>24H</TimeButton>
          <TimeButton $active={timeRange === '7d'} onClick={() => setTimeRange('7d')}>7D</TimeButton>
          <TimeButton $active={timeRange === '30d'} onClick={() => setTimeRange('30d')}>30D</TimeButton>
        </TimeRangeSelector>
      </ChartHeader>

      <ChartWrapper>
        <ChartSVG viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={productionColors.brand.primary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={productionColors.brand.primary} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="predictionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((value, i) => (
            <GridLine
              key={i}
              x1={padding.left}
              y1={yScale(value)}
              x2={chartWidth - padding.right}
              y2={yScale(value)}
            />
          ))}

          {/* Threshold Lines */}
          <ThresholdLine
            $level="critical"
            x1={padding.left}
            y1={yScale(riskThresholds.critical)}
            x2={chartWidth - padding.right}
            y2={yScale(riskThresholds.critical)}
          />
          <ThresholdLabel
            $level="critical"
            x={chartWidth - padding.right + 5}
            y={yScale(riskThresholds.critical) + 3}
          >
            Critical
          </ThresholdLabel>

          <ThresholdLine
            $level="high"
            x1={padding.left}
            y1={yScale(riskThresholds.high)}
            x2={chartWidth - padding.right}
            y2={yScale(riskThresholds.high)}
          />
          <ThresholdLabel
            $level="high"
            x={chartWidth - padding.right + 5}
            y={yScale(riskThresholds.high) + 3}
          >
            High
          </ThresholdLabel>

          <ThresholdLine
            $level="moderate"
            x1={padding.left}
            y1={yScale(riskThresholds.moderate)}
            x2={chartWidth - padding.right}
            y2={yScale(riskThresholds.moderate)}
          />
          <ThresholdLabel
            $level="moderate"
            x={chartWidth - padding.right + 5}
            y={yScale(riskThresholds.moderate) + 3}
          >
            Moderate
          </ThresholdLabel>

          {/* Y Axis Labels */}
          {[0, 25, 50, 75, 100].map((value, i) => (
            <AxisLabel
              key={i}
              x={padding.left - 8}
              y={yScale(value / 100) + 4}
              textAnchor="end"
            >
              {value}{unit}
            </AxisLabel>
          ))}

          {/* Area Fills */}
          <AreaGradient d={createAreaPath(historicalData)} />
          {showPrediction && predictionData.length > 0 && (
            <AreaGradient d={createAreaPath([historicalData[historicalData.length - 1], ...predictionData])} $isPrediction />
          )}

          {/* Data Lines */}
          <DataPath d={createPath(historicalData)} />
          {showPrediction && predictionData.length > 0 && (
            <DataPath d={createPath([historicalData[historicalData.length - 1], ...predictionData])} $isPrediction />
          )}

          {/* Data Dots */}
          {chartData.map((point, i) => {
            // Only show dots at intervals or for the last point
            if (i % Math.ceil(chartData.length / 12) !== 0 && i !== chartData.length - 1 && i !== historicalData.length - 1) return null;
            
            return (
              <DataDot
                key={i}
                cx={xScale(i)}
                cy={yScale(point.value)}
                r={i === historicalData.length - 1 ? 6 : 4}
                $isLast={i === historicalData.length - 1}
                $isPrediction={point.predicted}
              />
            );
          })}

          {/* X Axis Labels */}
          {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((point, i, arr) => {
            const index = chartData.indexOf(point);
            return (
              <AxisLabel
                key={i}
                x={xScale(index)}
                y={chartHeight - 10}
                textAnchor="middle"
              >
                {point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </AxisLabel>
            );
          })}

          {/* Hover Tooltip */}
          {hoveredPoint !== null && (
            <TooltipGroup>
              <TooltipLine
                x1={xScale(hoveredPoint)}
                y1={padding.top}
                x2={xScale(hoveredPoint)}
                y2={chartHeight - padding.bottom}
              />
            </TooltipGroup>
          )}
        </ChartSVG>
      </ChartWrapper>

      <Legend>
        <LegendItem>
          <LegendLine $color={productionColors.brand.primary} />
          Historical Data
        </LegendItem>
        {showPrediction && (
          <LegendItem>
            <LegendLine $color="#8B5CF6" $dashed />
            ML Prediction
          </LegendItem>
        )}
      </Legend>

      <StatsRow>
        <StatCard>
          <StatValue $color={getRiskColor(stats.current)}>
            {(stats.current * 100).toFixed(1)}{unit}
          </StatValue>
          <StatLabel>Current</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{(stats.avg * 100).toFixed(1)}{unit}</StatValue>
          <StatLabel>Average</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color={getRiskColor(stats.max)}>
            {(stats.max * 100).toFixed(1)}{unit}
          </StatValue>
          <StatLabel>Peak</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color={getRiskColor(stats.min)}>
            {(stats.min * 100).toFixed(1)}{unit}
          </StatValue>
          <StatLabel>Low</StatLabel>
        </StatCard>
      </StatsRow>
    </ChartContainer>
  );
};

export default RiskTrendChart;
