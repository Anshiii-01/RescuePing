import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// Toast Types
export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

// Animations
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutToRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled Components
const ToastContainer = styled.div`
  position: fixed;
  top: 90px; /* Below header */
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

const ToastCard = styled.div<{ type: ToastType; isExiting: boolean }>`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success[500];
      case 'warning': return theme.colors.warning[500];
      case 'error': return theme.colors.error[500];
      case 'info': return theme.colors.info[500];
      default: return theme.colors.border.default;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 320px;
  ${({ isExiting }) => isExiting ? css`animation: ${slideOutToRight} 0.3s cubic-bezier(0.4, 0, 0.2, 1);` : css`animation: ${slideInFromRight} 0.3s cubic-bezier(0.4, 0, 0.2, 1);`}
  display: flex;
  align-items: flex-start;
  gap: 12px;
  backdrop-filter: blur(12px);
  
  /* Glowing border effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme, type }) => {
      switch (type) {
        case 'success': return theme.colors.gradients.success;
        case 'warning': return theme.colors.gradients.warning;
        case 'error': return theme.colors.gradients.error;
        case 'info': return theme.colors.gradients.info;
        default: return theme.colors.gradients.primary;
      }
    }};
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }
`;

const IconWrapper = styled.div<{ type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success[100];
      case 'warning': return theme.colors.warning[100];
      case 'error': return theme.colors.error[100];
      case 'info': return theme.colors.info[100];
    }
  }};
  color: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success[600];
      case 'warning': return theme.colors.warning[600];
      case 'error': return theme.colors.error[600];
      case 'info': return theme.colors.info[600];
    }
  }};
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary[400]};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  animation: progressCountdown ${({ duration }) => duration}ms linear forwards;
  
  @keyframes progressCountdown {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Toast Component
const ToastComponent: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'info': return <Info size={16} />;
    }
  };

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (!toast.persistent && toast.duration) {
      const timer = setTimeout(handleDismiss, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, handleDismiss]);

  return (
    <ToastCard type={toast.type} isExiting={isExiting}>
      <IconWrapper type={toast.type}>
        {getIcon(toast.type)}
      </IconWrapper>
      <ToastContent>
        <ToastTitle>{toast.title}</ToastTitle>
        {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
      </ToastContent>
      <CloseButton onClick={handleDismiss}>
        <X size={16} />
      </CloseButton>
      {!toast.persistent && toast.duration && (
        <ProgressBar duration={toast.duration} />
      )}
    </ToastCard>
  );
};

// Toast Context
interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};