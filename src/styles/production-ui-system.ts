/**
 * PRODUCTION COLOR PALETTE & UI POLISH SYSTEM
 * Enhanced with cinematic dark theme, professional gradients, and interactive states
 */

import { css } from 'styled-components';

// PRODUCTION COLOR PALETTE - Cinematic Dark Theme
export const productionColors = {
  // Primary Background Colors
  background: {
    primary: 'transparent',      // Let starfield show through
    secondary: '#16181D',     // Card background base
    tertiary: '#1C1F26',     // Card background elevated
    overlay: 'rgba(10, 11, 15, 0.95)', // Modal/overlay background
  },
  
  // Text Colors  
  text: {
    primary: '#F7F8FA',      // Primary text - near white
    secondary: '#D1D5DB',    // Secondary text - light gray
    tertiary: '#9CA3AF',     // Tertiary text - medium gray
    disabled: '#6B7280',     // Disabled text - dark gray
  },
  
  // Rescue Ping Brand Colors
  brand: {
    primary: '#EF4444',      // Rescue Ping red - primary brand
    secondary: '#DC2626',    // Darker red for accents
    light: '#FEE2E2',       // Light red for backgrounds
    dark: '#991B1B',        // Dark red for pressed states
  },
  
  // Status Colors
  status: {
    success: '#22C55E',      // Green for success states
    warning: '#FBBF24',      // Amber for warning states  
    error: '#EF4444',        // Red for error states
    info: '#3B82F6',         // Blue for info states
  },
  
  // Interactive Colors
  interactive: {
    hover: 'rgba(255, 255, 255, 0.05)',     // Subtle white overlay
    pressed: 'rgba(255, 255, 255, 0.02)',   // Pressed state
    focus: 'rgba(59, 130, 246, 0.15)',      // Blue focus ring
    disabled: 'rgba(255, 255, 255, 0.02)',  // Disabled state
  },
  
  // Border Colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',    // Primary borders
    secondary: 'rgba(255, 255, 255, 0.05)', // Subtle borders
    accent: 'rgba(239, 68, 68, 0.2)',       // Brand accent borders
    focus: 'rgba(59, 130, 246, 0.3)',       // Focus borders
  },
  
  // Gradient Colors
  gradients: {
    card: 'linear-gradient(135deg, #16181D 0%, #1C1F26 100%)',
    brand: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    status: {
      success: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      warning: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    }
  }
} as const;

// ENHANCED ANIMATION SYSTEM
export const productionAnimations = {
  // Timing Functions
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  
  // Duration Scale
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
  },
  
  // Keyframe Animations
  keyframes: {
    fadeIn: css`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideUp: css`
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `,
    pulse: css`
      @keyframes pulse {
        0%, 100% { 
          opacity: 1; 
        }
        50% { 
          opacity: 0.5; 
        }
      }
    `,
    spin: css`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    glow: css`
      @keyframes glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(239, 68, 68, 0.3); 
        }
        50% { 
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); 
        }
      }
    `
  }
} as const;

// INTERACTIVE STATE SYSTEM
export const interactiveStates = css`
  transition: all ${productionAnimations.duration.normal} ${productionAnimations.easing.smooth};
  cursor: pointer;
  
  &:hover {
    background: ${productionColors.interactive.hover};
    transform: translateY(-1px);
  }
  
  &:active {
    background: ${productionColors.interactive.pressed};
    transform: translateY(0);
  }
  
  &:focus-visible {
    outline: 2px solid ${productionColors.border.focus};
    outline-offset: 2px;
  }
  
  &:disabled {
    background: ${productionColors.interactive.disabled};
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }
`;

// ENHANCED CARD SYSTEM WITH PRODUCTION COLORS - MODERNIZED
export const productionCard = css`
  /* Enhanced for pure black (#000000) background */
  background: rgba(22, 24, 29, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  
  /* Enhanced shadow system for pure black background */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.7),
    0 4px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  /* Hover enhancement with glow effect */
  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.9),
      0 6px 24px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 0 0 1px rgba(239, 68, 68, 0.2);
    transform: translateY(-3px);
  }
  
  /* Focus state */
  &:focus-within {
    border-color: ${productionColors.border.focus};
    box-shadow: 
      0 0 0 3px ${productionColors.border.focus},
      0 12px 48px rgba(0, 0, 0, 0.9);
  }
  
  /* Smooth animation */
  transition: all ${productionAnimations.duration.normal} ${productionAnimations.easing.smooth};
`;

// PRODUCTION BUTTON SYSTEM
export const productionButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${productionAnimations.duration.normal} ${productionAnimations.easing.smooth};
  position: relative;
  overflow: hidden;
  
  background: ${productionColors.background.tertiary};
  color: ${productionColors.text.primary};
  border: 1px solid ${productionColors.border.primary};
  
  &:hover {
    background: ${productionColors.interactive.hover};
    border-color: ${productionColors.border.accent};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${productionColors.interactive.disabled};
    color: ${productionColors.text.disabled};
    border-color: ${productionColors.border.secondary};
    cursor: not-allowed;
    transform: none;
    opacity: 0.5;
  }
`;

// Button variants
export const primaryButton = css`
  ${productionButton}
  
  background: ${productionColors.gradients.brand};
  color: white;
  border: 1px solid ${productionColors.brand.secondary};
  
  &:hover {
    background: ${productionColors.brand.secondary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    background: ${productionColors.brand.dark};
  }
`;

export const secondaryButton = css`
  ${productionButton}
`;

export const ghostButton = css`
  ${productionButton}
  
  background: transparent;
  color: ${productionColors.text.secondary};
  border: 1px solid transparent;
  
  &:hover {
    background: ${productionColors.interactive.hover};
    color: ${productionColors.text.primary};
  }
`;

export const dangerButton = css`
  ${productionButton}
  
  background: ${productionColors.gradients.status.error};
  color: white;
  border: 1px solid ${productionColors.status.error};
  
  &:hover {
    background: #DC2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

// PRODUCTION BADGE SYSTEM
export const productionBadge = css<{ status?: 'success' | 'warning' | 'error' | 'info' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ status = 'neutral' }) => {
    switch (status) {
      case 'success':
        return css`
          background: rgba(34, 197, 94, 0.1);
          color: ${productionColors.status.success};
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      case 'warning':
        return css`
          background: rgba(251, 191, 36, 0.1);
          color: ${productionColors.status.warning};
          border: 1px solid rgba(251, 191, 36, 0.2);
        `;
      case 'error':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: ${productionColors.status.error};
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'info':
        return css`
          background: rgba(59, 130, 246, 0.1);
          color: ${productionColors.status.info};
          border: 1px solid rgba(59, 130, 246, 0.2);
        `;
      default:
        return css`
          background: ${productionColors.interactive.hover};
          color: ${productionColors.text.secondary};
          border: 1px solid ${productionColors.border.secondary};
        `;
    }
  }}
`;

// SCROLLBAR STYLING
export const productionScrollbar = css`
  /* Webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${productionColors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${productionColors.border.primary};
    border-radius: 3px;
    
    &:hover {
      background: ${productionColors.border.accent};
    }
  }
  
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${productionColors.border.primary} ${productionColors.background.secondary};
`;

// Export all styles as a named object to avoid ESLint warning
const productionUISystem = {
  productionColors,
  productionAnimations,
  interactiveStates,
  productionCard,
  productionButton,
  productionBadge,
  productionScrollbar
};

export default productionUISystem;