import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { AlertTriangle, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, Heading, Text, StatusIndicator, Flex, Button } from '../../styles/components';
import { useCurrentAlerts } from '../../hooks/useDashboard';
import { useNotifications } from '../../contexts/NotificationContext';
import { enhancedSpacing, enhancedShadows } from '../../styles/enhanced-design-system';
import { ActiveAlert } from '../../services/apiService';
import alertNotificationService, { AlertLevel } from '../../services/alertNotificationService';

const AlertsContainer = styled(Card)`
  max-height: 320px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface.elevated}; /* Dark card surface */
  border: 1px solid ${({ theme }) => theme.colors.border.default}; /* Dark border */
  border-radius: ${({ theme }) => theme.borderRadius.md}; /* 12px rounded */
  box-shadow: ${enhancedShadows.default}; /* Enhanced professional shadow */
  padding: ${enhancedSpacing[6]}; /* 24px enhanced padding */
  color: ${({ theme }) => theme.colors.text.primary}; /* High-contrast text */
  
  /* Enhanced hover interactions */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    box-shadow: ${enhancedShadows.hover};
    background: ${({ theme }) => theme.colors.surface.hover}; /* Subtle dark hover */
    transform: translateY(-1px); /* Subtle lift */
  }
`;

const AlertsHeader = styled(Flex)`
  margin-bottom: ${enhancedSpacing[4]}; /* 16px enhanced margin */
  padding-bottom: ${enhancedSpacing[3]}; /* 12px enhanced padding */
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.border}; /* Subtle separator */
`;

const AlertItem = styled.div<{ severity: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${enhancedSpacing[3]}; /* 12px enhanced gap */
  padding: ${enhancedSpacing[4]}; /* 16px enhanced padding */
  margin-bottom: ${enhancedSpacing[3]}; /* 12px enhanced margin */
  border-radius: ${({ theme }) => theme.borderRadius.md}; /* 12px rounded */
  background: ${({ theme }) => theme.colors.surface.default}; /* Dark card background */
  border: 1px solid ${({ theme }) => theme.colors.border.default}; /* Dark border */
  color: ${({ theme }) => theme.colors.text.primary}; /* High-contrast text */
  position: relative;
  overflow: hidden;
  
  /* Enhanced micro-interactions */
  transition: all 0.2s ease;
  &:hover {
    box-shadow: ${enhancedShadows.xs};
    transform: translateX(2px); /* Subtle slide */
    background: ${({ theme }) => theme.colors.surface.hover}; /* Subtle dark hover */
  }
  
  /* Red accent stripe for severity - STRATEGIC USE ONLY */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${({ severity, theme }) => {
      switch (severity) {
        case 'Critical': return theme.colors.primary[600]; /* Vivid red for dark mode */
        case 'High': return theme.colors.primary[500];     /* Coral for high */
        case 'Medium': return theme.colors.warning[500];   /* Amber for medium */
        default: return theme.colors.success[500];         /* Green for low */
      }
    }};
  }
`;

const AlertIcon = styled.div<{ severity: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ severity, theme }) => {
    switch (severity) {
      case 'Critical':
        return theme.colors.primary[500]; /* Coral for critical */
      case 'High':
        return theme.colors.primary[400]; /* Light coral for high */
      case 'Medium':
        return theme.colors.info[500];
      default:
        return theme.colors.success[500];
    }
  }};
  box-shadow: ${({ theme }) => theme.shadows.sm}; /* Elevated icons */
  color: ${({ theme }) => theme.colors.text.inverse};
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlertMeta = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing[1]};
  opacity: 0.8;
`;

const TimeStamp = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  
  svg {
    width: 10px;
    height: 10px;
  }
`;

interface CurrentAlertsProps {
  onEmergencyClick?: () => void;
}



const CurrentAlerts: React.FC<CurrentAlertsProps> = ({ onEmergencyClick }) => {
  const { data: alertsData, loading, error, refetch } = useCurrentAlerts();
  const { addNotification } = useNotifications();
  const previousAlertsRef = useRef<Set<string>>(new Set());

  // alertsData is already an array of alerts from useDashboard
  const displayAlerts: ActiveAlert[] = useMemo(() => {
    if (!alertsData) return [];
    const alertsArray = Array.isArray(alertsData) ? alertsData : [];
    return alertsArray.filter((alert: ActiveAlert) => {
      if (!alert.expires) return true;
      return new Date(alert.expires) > new Date();
    });
  }, [alertsData]);

  // Map severity to AlertLevel
  const mapSeverityToAlertLevel = (severity: string): AlertLevel => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'CRITICAL';
      case 'high':
        return 'HIGH';
      case 'medium':
      case 'moderate':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  };

  // Trigger alert notifications for new critical/high alerts
  useEffect(() => {
    if (displayAlerts && displayAlerts.length > 0) {
      displayAlerts.forEach(alert => {
        // Check if this is a new alert we haven't notified about
        const alertId = alert.id || `${alert.event}-${alert.onset}`;
        
        if (!previousAlertsRef.current.has(alertId)) {
          // This is a new alert - trigger notification
          previousAlertsRef.current.add(alertId);
          
          // Trigger sound and haptic feedback for critical/high alerts
          if (alert.severity === 'Critical' || alert.severity === 'High') {
            const level = mapSeverityToAlertLevel(alert.severity);
            const areaText = alert.areas && alert.areas.length > 0 ? alert.areas.join(', ') : 'your area';
            
            alertNotificationService.triggerAlert(
              level,
              `${alert.severity} Alert: ${alert.event}`,
              `${alert.description} in ${areaText}`
            );
          }
          
          // Add to notification center
          if (alert.severity === 'Critical' || alert.severity === 'High') {
            const areaText = alert.areas && alert.areas.length > 0 ? alert.areas.join(', ') : 'your area';
            addNotification({
              type: alert.severity === 'Critical' ? 'error' : 'warning',
              title: `${alert.severity} Alert`,
              message: `${alert.description} in ${areaText}`,
              priority: alert.severity === 'Critical' ? 'critical' : 'high',
              source: 'Emergency Alert System',
              actions: [
                {
                  label: 'View Details',
                  action: () => console.log('View alert details:', alert.id)
                },
                {
                  label: 'Mark Safe',
                  action: () => console.log('Mark location safe:', areaText)
                }
              ]
            });
          }
        }
      });
    }
  }, [displayAlerts, addNotification]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const getSeverityStatus = (severity: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (severity) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      default:
        return 'success';
    }
  };

  if (loading && !displayAlerts) {
    return (
      <AlertsContainer>
        <AlertsHeader justify="between" align="center">
          <Heading level={5} weight="semibold">Current Alerts</Heading>
          <StatusIndicator status="info" size="sm" />
        </AlertsHeader>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text size="sm" color="secondary">Loading alerts...</Text>
        </div>
      </AlertsContainer>
    );
  }

  if (error && (!displayAlerts || displayAlerts.length === 0)) {
    return (
      <AlertsContainer>
        <AlertsHeader justify="between" align="center">
          <Heading level={5} weight="semibold">Current Alerts</Heading>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw size={14} />
          </Button>
        </AlertsHeader>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text size="sm" color="secondary">Unable to load real-time alerts</Text>
          <Button variant="outline" size="sm" onClick={refetch} style={{ marginTop: '10px' }}>
            Retry
          </Button>
        </div>
      </AlertsContainer>
    );
  }

  return (
    <AlertsContainer>
      <AlertsHeader justify="between" align="center">
        <Heading level={5} weight="semibold">Current Alerts</Heading>
        <Flex align="center" gap="8px">
          <StatusIndicator status={displayAlerts && displayAlerts.length > 0 ? "warning" : "success"} size="sm" />
          {loading && <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />}
        </Flex>
      </AlertsHeader>
      
      <div>
        {displayAlerts && displayAlerts.length > 0 ? (
          displayAlerts.slice(0, 5).map((alert) => (
            <AlertItem 
              key={alert.id} 
              severity={alert.severity}
              onClick={onEmergencyClick}
              style={{ cursor: onEmergencyClick ? 'pointer' : 'default' }}
            >
              <AlertIcon severity={alert.severity}>
                <AlertTriangle />
              </AlertIcon>
              <AlertContent>
                <Text size="sm" weight="medium">{alert.title || alert.description}</Text>
                <AlertMeta justify="between" align="center">
                  <Flex align="center" gap="4px">
                    <StatusIndicator status={getSeverityStatus(alert.severity)} size="sm" />
                    <Text size="xs" color="secondary">{alert.areas && alert.areas.length > 0 ? alert.areas.join(', ') : 'No area specified'}</Text>
                  </Flex>
                  <TimeStamp>
                    <Clock />
                    {formatTimeAgo(alert.onset)}
                  </TimeStamp>
                </AlertMeta>
              </AlertContent>
              {onEmergencyClick && (
                <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              )}
            </AlertItem>
          ))
        ) : (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#22c55e', marginBottom: '12px', fontSize: '32px' }}>✓</div>
            <Text size="sm" weight="semibold" style={{ marginBottom: '4px' }}>All Clear</Text>
            <Text size="xs" color="secondary">No active weather alerts for your area</Text>
          </div>
        )}
      </div>
    </AlertsContainer>
  );
};

export default CurrentAlerts;