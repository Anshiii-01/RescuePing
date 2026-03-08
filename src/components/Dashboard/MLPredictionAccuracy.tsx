import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Target, Activity, Brain, Cpu, TrendingUp, Zap } from 'lucide-react';
import { Card, Text, Flex } from '../../styles/components';
import { getAccessibleChartColor } from '../../styles/colorblindAccessibility';

// Enhanced animations
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
`;

const AccuracyContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  background: linear-gradient(165deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.95) 50%, 
    rgba(15, 23, 42, 0.98) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #22c55e, #6366f1, #22c55e);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.08), transparent);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #22c55e;
  }
`;

const EnsembleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
  ${css`animation: ${pulseGlow} 3s ease-in-out infinite;`}
`;

const MainAccuracy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
`;

const AccuracyValue = styled.div`
  font-size: 42px;
  font-weight: 700;
  color: #22c55e;
  line-height: 1;
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
`;

const AccuracyLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px;
`;

const ModelCard = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ color }) => `${color}30`};
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: ${({ color }) => `${color}50`};
  }
`;

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const ModelName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModelAccuracy = styled.span<{ color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: linear-gradient(90deg, ${({ color }) => color}, ${({ color }) => color}dd);
  border-radius: 2px;
  transition: width 0.5s ease;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  background: rgba(0, 0, 0, 0.15);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
`;

const StatLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
`;

// Model data - colorblind-safe colors and increased accessibility
const MODELS = [
  { name: 'LSTM', accuracy: 94.2, color: getAccessibleChartColor(2), pattern: 'stripes' }, // Teal
  { name: 'XGBoost', accuracy: 91.5, color: getAccessibleChartColor(0), pattern: 'dots' }, // Blue
  { name: 'GNN', accuracy: 88.7, color: getAccessibleChartColor(5), pattern: 'horizontal' }, // Purple
  { name: 'Anomaly', accuracy: 89.8, color: getAccessibleChartColor(1), pattern: 'crosshatch' } // Orange
];

const MLPredictionAccuracy: React.FC = () => {
  // Calculate ensemble accuracy (weighted average)
  const ensembleAccuracy = useMemo(() => {
    const weights = [0.35, 0.30, 0.20, 0.15]; // LSTM has highest weight
    return MODELS.reduce((sum, model, i) => sum + model.accuracy * weights[i], 0);
  }, []);

  return (
    <AccuracyContainer>
      <Header>
        <HeaderTitle>
          <Target size={18} />
          <div>
            <Text size="sm" weight="semibold" style={{ margin: 0 }}>Model Accuracy</Text>
            <Text size="xs" color="secondary">Ensemble prediction</Text>
          </div>
        </HeaderTitle>
        <EnsembleBadge>
          <Brain size={10} />
          <span>4 Models</span>
        </EnsembleBadge>
      </Header>

      <MainAccuracy>
        <AccuracyValue>{ensembleAccuracy.toFixed(1)}%</AccuracyValue>
        <AccuracyLabel>Ensemble Accuracy</AccuracyLabel>
      </MainAccuracy>

      <ModelsGrid>
        {MODELS.map((model) => (
          <ModelCard key={model.name} color={model.color}>
            <ModelHeader>
              <ModelName>{model.name}</ModelName>
              <ModelAccuracy color={model.color}>{model.accuracy}%</ModelAccuracy>
            </ModelHeader>
            <ProgressBar>
              <ProgressFill width={model.accuracy} color={model.color} />
            </ProgressBar>
          </ModelCard>
        ))}
      </ModelsGrid>

      <StatsRow>
        <StatItem>
          <StatValue>
            <Flex align="center" gap="4px">
              <TrendingUp size={10} color="#22c55e" />
              +2.3%
            </Flex>
          </StatValue>
          <StatLabel>vs Last Week</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>
            <Flex align="center" gap="4px">
              <Activity size={10} color="#6366f1" />
              1.2ms
            </Flex>
          </StatValue>
          <StatLabel>Avg Latency</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>
            <Flex align="center" gap="4px">
              <Zap size={10} color="#f59e0b" />
              24/7
            </Flex>
          </StatValue>
          <StatLabel>Uptime</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatValue>
            <Flex align="center" gap="4px">
              <Cpu size={10} color="#8b5cf6" />
              Real-time
            </Flex>
          </StatValue>
          <StatLabel>Processing</StatLabel>
        </StatItem>
      </StatsRow>
    </AccuracyContainer>
  );
};

export default MLPredictionAccuracy;
