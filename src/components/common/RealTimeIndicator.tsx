/**
 * Real-Time Update Indicator
 * Shows live status, last update time, and sync indicators
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { productionColors } from '../../styles/production-ui-system';

interface RealTimeIndicatorProps {
  lastUpdated?: Date;
  isLive?: boolean;
  isConnected?: boolean;
  onRefresh?: () => void;
  autoRefreshInterval?: number; // in seconds
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid ${productionColors.border.secondary};
  font-size: 14px;
`;

const LiveBadge = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$isLive 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(148, 163, 184, 0.2)'};
  color: ${props => props.$isLive ? '#22C55E' : '#94A3B8'};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$isLive ? '#22C55E' : '#94A3B8'};
    animation: ${props => props.$isLive ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

const ConnectionStatus = styled.div<{ $isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$isConnected 
    ? productionColors.status.success 
    : productionColors.status.error};
  font-size: 12px;
`;

const LastUpdatedText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${productionColors.text.tertiary};
  font-size: 12px;
`;

const RefreshButton = styled.button<{ $isRefreshing: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${productionColors.border.secondary};
  background: rgba(255, 255, 255, 0.05);
  color: ${productionColors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    animation: ${props => props.$isRefreshing ? spin : 'none'} 1s linear infinite;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${productionColors.brand.primary};
    color: ${productionColors.brand.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CountdownText = styled.span`
  font-size: 11px;
  color: ${productionColors.text.tertiary};
  font-weight: 500;
`;

export const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  lastUpdated,
  isLive = true,
  isConnected = true,
  onRefresh,
  autoRefreshInterval = 300 // 5 minutes default
}) => {
  const [timeAgo, setTimeAgo] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(autoRefreshInterval);

  // Format time ago
  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

      if (diff < 10) {
        setTimeAgo('Just now');
      } else if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      } else if (diff < 86400) {
        setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
      } else {
        setTimeAgo(`${Math.floor(diff / 86400)}d ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Auto-refresh countdown
  useEffect(() => {
    if (!isLive || !autoRefreshInterval) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (onRefresh) {
            handleRefresh();
          }
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, autoRefreshInterval, onRefresh]);

  const handleRefresh = async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    setCountdown(autoRefreshInterval);
    
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Container>
      <LiveBadge $isLive={isLive}>
        {isLive ? 'LIVE' : 'OFFLINE'}
      </LiveBadge>

      <ConnectionStatus $isConnected={isConnected}>
        {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
      </ConnectionStatus>

      {lastUpdated && (
        <LastUpdatedText>
          <Clock size={12} />
          {timeAgo}
        </LastUpdatedText>
      )}

      {isLive && autoRefreshInterval > 0 && (
        <CountdownText>
          Next: {formatCountdown(countdown)}
        </CountdownText>
      )}

      {onRefresh && (
        <RefreshButton
          onClick={handleRefresh}
          disabled={isRefreshing}
          $isRefreshing={isRefreshing}
          title="Refresh data"
        >
          <RefreshCw size={16} />
        </RefreshButton>
      )}
    </Container>
  );
};

// Compact version for smaller spaces
const CompactContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const CompactBadge = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$isLive 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(148, 163, 184, 0.2)'};
  color: ${props => props.$isLive ? '#22C55E' : '#94A3B8'};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.$isLive ? '#22C55E' : '#94A3B8'};
    animation: ${props => props.$isLive ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

interface CompactRealTimeIndicatorProps {
  isLive?: boolean;
  lastUpdated?: Date;
  showTime?: boolean;
}

export const CompactRealTimeIndicator: React.FC<CompactRealTimeIndicatorProps> = ({
  isLive = true,
  lastUpdated,
  showTime = true
}) => {
  const [timeAgo, setTimeAgo] = useState<string>('now');

  useEffect(() => {
    if (!lastUpdated || !showTime) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

      if (diff < 10) {
        setTimeAgo('now');
      } else if (diff < 60) {
        setTimeAgo(`${diff}s`);
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m`);
      } else {
        setTimeAgo(`${Math.floor(diff / 3600)}h`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);

    return () => clearInterval(interval);
  }, [lastUpdated, showTime]);

  return (
    <CompactContainer>
      <CompactBadge $isLive={isLive}>
        {isLive ? 'LIVE' : 'OFF'}
      </CompactBadge>
      {showTime && lastUpdated && (
        <span style={{ color: productionColors.text.tertiary }}>
          {timeAgo}
        </span>
      )}
    </CompactContainer>
  );
};

export default RealTimeIndicator;
