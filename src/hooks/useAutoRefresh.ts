import { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from './useDashboard';

interface AutoRefreshOptions {
  interval?: number; // minutes
  enabled?: boolean;
  onRefresh?: () => void;
}

// Enhanced auto-refresh hook with configurable intervals
export const useAutoRefresh = (options: AutoRefreshOptions = {}) => {
  const { interval = 3, enabled = true, onRefresh } = options;
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use ref to avoid dependency on refreshData causing infinite loops
  const dashboardRef = useRef(useDashboard());
  dashboardRef.current = useDashboard();
  
  // Use ref for callback to prevent re-creation
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const performRefresh = useCallback(async () => {
    setIsRefreshing(prev => {
      if (prev) return prev; // Already refreshing, don't start again
      
      console.log(`🔄 Auto-refresh triggered (every ${interval} minutes)`);
      
      // Use timeout to avoid blocking render
      setTimeout(async () => {
        try {
          await dashboardRef.current.refreshData();
          onRefreshRef.current?.();
          
          setLastRefresh(new Date());
          setIsRefreshing(false);
          console.log('✅ Auto-refresh completed successfully');
        } catch (error) {
          console.error('❌ Auto-refresh failed:', error);
          setIsRefreshing(false);
        }
      }, 0);
      
      return true; // Set refreshing to true
    });
  }, [interval]); // Only depend on interval, not on functions

  useEffect(() => {
    if (!enabled) {
      setNextRefresh(null);
      return;
    }

    const intervalMs = interval * 60 * 1000; // Convert to milliseconds
    
    // Set next refresh time
    setNextRefresh(new Date(Date.now() + intervalMs));
    
    const refreshInterval = setInterval(() => {
      performRefresh();
    }, intervalMs);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [enabled, interval, performRefresh]);

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    performRefresh();
  }, [performRefresh]);

  return {
    lastRefresh,
    nextRefresh,
    isRefreshing,
    manualRefresh,
    intervalMinutes: interval,
  };
};

// Hook for managing refresh settings
export const useRefreshSettings = () => {
  const [refreshInterval, setRefreshInterval] = useState(3); // Default 3 minutes
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  // Load settings from localStorage
  useEffect(() => {
    const savedInterval = localStorage.getItem('rescuePing.refreshInterval');
    const savedEnabled = localStorage.getItem('rescuePing.autoRefreshEnabled');
    
    if (savedInterval) setRefreshInterval(parseInt(savedInterval));
    if (savedEnabled !== null) setAutoRefreshEnabled(savedEnabled === 'true');
  }, []);

  // Save settings to localStorage
  const updateInterval = useCallback((minutes: number) => {
    setRefreshInterval(minutes);
    localStorage.setItem('rescuePing.refreshInterval', minutes.toString());
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    const newState = !autoRefreshEnabled;
    setAutoRefreshEnabled(newState);
    localStorage.setItem('rescuePing.autoRefreshEnabled', newState.toString());
  }, [autoRefreshEnabled]);

  return {
    refreshInterval,
    autoRefreshEnabled,
    updateInterval,
    toggleAutoRefresh,
  };
};