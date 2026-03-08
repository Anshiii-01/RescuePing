/**
 * PRODUCTION LOADING SYSTEM
 * Enhanced loading states with cinematic animations and production colors
 */

import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Loader2, AlertTriangle, Shield } from 'lucide-react';
import { 
  productionColors, 
  productionAnimations, 
  productionCard 
} from '../../styles/production-ui-system';

// Enhanced loading animations
const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const slideUpAnimation = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Loading overlay for full-screen loading
const LoadingOverlayContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${productionColors.background.overlay};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  opacity: ${({ $isVisible }) => $isVisible ? '1' : '0'};
  visibility: ${({ $isVisible }) => $isVisible ? 'visible' : 'hidden'};
  transition: all ${productionAnimations.duration.slow} ${productionAnimations.easing.smooth};
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px;
  background: ${productionColors.gradients.card};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  ${css`animation: ${slideUpAnimation} ${productionAnimations.duration.slow} ${productionAnimations.easing.smooth};`}
`;

const LoadingIcon = styled.div`
  width: 48px;
  height: 48px;
  color: ${productionColors.brand.primary};
  ${css`animation: ${spinAnimation} 2s linear infinite;`}
`;

const LoadingText = styled.h2`
  color: ${productionColors.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  color: ${productionColors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
  max-width: 300px;
`;

// Skeleton loading components
const SkeletonBase = styled.div`
  background: ${productionColors.background.secondary};
  background-image: linear-gradient(
    90deg,
    ${productionColors.background.secondary} 0px,
    rgba(255, 255, 255, 0.03) 40px,
    ${productionColors.background.secondary} 80px
  );
  background-size: 200px 100%;
  ${css`animation: ${shimmerAnimation} 1.5s infinite;`}
  border-radius: 4px;
`;

const SkeletonCard = styled.div`
  ${productionCard}
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 20px;
  width: 60%;
  margin-bottom: 8px;
`;

const SkeletonText = styled(SkeletonBase)<{ width?: string }>`
  height: 14px;
  width: ${({ width = '100%' }) => width};
  margin-bottom: 4px;
`;

const SkeletonButton = styled(SkeletonBase)`
  height: 36px;
  width: 120px;
  border-radius: 8px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
`;

// Inline loading spinner
const InlineSpinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  height: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  color: ${productionColors.brand.primary};
  ${css`animation: ${spinAnimation} 1s linear infinite;`}
  display: inline-block;
`;

// Loading button state
const LoadingButton = styled.button<{ $isLoading?: boolean; $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ $isLoading }) => $isLoading ? 'not-allowed' : 'pointer'};
  transition: all ${productionAnimations.duration.normal} ${productionAnimations.easing.smooth};
  
  background: ${({ $variant = 'primary', $isLoading }) => {
    if ($isLoading) return productionColors.interactive.disabled;
    return $variant === 'primary' 
      ? productionColors.gradients.brand
      : productionColors.background.tertiary;
  }};
  
  color: ${({ $variant = 'primary', $isLoading }) => {
    if ($isLoading) return productionColors.text.disabled;
    return $variant === 'primary' ? 'white' : productionColors.text.primary;
  }};
  
  border: 1px solid ${({ $variant = 'primary', $isLoading }) => {
    if ($isLoading) return productionColors.border.secondary;
    return $variant === 'primary' 
      ? productionColors.brand.secondary
      : productionColors.border.primary;
  }};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`;

// Error state component
const ErrorContainer = styled.div`
  ${productionCard}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
  border-color: ${productionColors.status.error};
  background: linear-gradient(135deg, 
    ${productionColors.background.secondary} 0%, 
    rgba(239, 68, 68, 0.05) 100%
  );
`;

const ErrorIcon = styled.div`
  width: 48px;
  height: 48px;
  color: ${productionColors.status.error};
  ${css`animation: ${pulseAnimation} 2s infinite;`}
`;

const ErrorTitle = styled.h3`
  color: ${productionColors.text.primary};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: ${productionColors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  max-width: 400px;
`;

// Component exports
export const FullScreenLoader: React.FC<{
  isVisible: boolean;
  title?: string;
  message?: string;
}> = ({ isVisible, title = "Loading Rescue Ping", message = "Please wait while we initialize your dashboard..." }) => (
  <LoadingOverlayContainer $isVisible={isVisible}>
    <LoadingContent>
      <LoadingIcon>
        <Shield size={48} />
      </LoadingIcon>
      <LoadingText>{title}</LoadingText>
      <LoadingSubtext>{message}</LoadingSubtext>
    </LoadingContent>
  </LoadingOverlayContainer>
);

export const SkeletonDashboard: React.FC = () => (
  <SkeletonGrid>
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonCard key={index}>
        <SkeletonTitle />
        <SkeletonText width="80%" />
        <SkeletonText width="60%" />
        <SkeletonText width="90%" />
        <div style={{ marginTop: '16px' }}>
          <SkeletonButton />
        </div>
      </SkeletonCard>
    ))}
  </SkeletonGrid>
);

export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
}> = ({ size = 'md' }) => (
  <InlineSpinner $size={size}>
    <Loader2 />
  </InlineSpinner>
);

export const LoadingButtonComponent: React.FC<{
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ isLoading, variant = 'primary', children, onClick, disabled }) => (
  <LoadingButton
    $isLoading={isLoading}
    $variant={variant}
    onClick={onClick}
    disabled={disabled || isLoading}
  >
    {isLoading && <Spinner size="sm" />}
    {children}
  </LoadingButton>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content. Please try again.",
  onRetry 
}) => (
  <ErrorContainer>
    <ErrorIcon>
      <AlertTriangle size={48} />
    </ErrorIcon>
    <ErrorTitle>{title}</ErrorTitle>
    <ErrorMessage>{message}</ErrorMessage>
    {onRetry && (
      <LoadingButtonComponent variant="secondary" onClick={onRetry}>
        Try Again
      </LoadingButtonComponent>
    )}
  </ErrorContainer>
);

// Legacy exports for backward compatibility
export const LoadingOverlay = FullScreenLoader;
export const SkeletonLoader = SkeletonDashboard;