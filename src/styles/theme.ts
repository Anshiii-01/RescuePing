// Professional Rescue Ping Theme - Near-Black Specification
// Updated to match user requirements: #0F1115, #16181D, #1C1E24, #FFFFFF, #EF4444

export const theme = {
  // DEEPER BLACK Color System - Enhanced Production Dark Theme
  colors: {
    // Deeper black background system with gradients
    background: {
      primary: '#08090C',       // Deepest black - main background
      secondary: '#0E1014',     // Dark cards base
      tertiary: '#16181C',      // Elevated elements
      elevated: '#0E1014',      // Cards and elevated surfaces
      gradient: 'linear-gradient(135deg, #08090C 0%, #16181C 100%)',  // Hero gradients
    },
    
    // Dark Mode Surface Colors - True Black Theme
    surface: {
      default: '#12141A',       // Default surface - secondary background
      elevated: '#1A1D24',      // Elevated surfaces - tertiary background
      panel: '#12141A',         // Panel backgrounds - secondary
      hover: '#1F2229',         // Hover states
      pressed: '#0F1115',       // Pressed states
      disabled: '#0A0B0F',      // Disabled state - primary background
      border: '#2A2E38',        // Borders on surfaces
      stripe: '#EF4444',        // Red accent for stripes
    },
    
    // Professional Text Colors - High Contrast for True Black
    text: {
      primary: '#F8F9FA',       // High-contrast white text
      secondary: '#B4B8BF',     // Light grey secondary text
      tertiary: '#6C727F',      // Medium grey muted text
      brand: '#EF4444',         // Red brand text
      inverse: '#0A0B0F',       // Dark text for light backgrounds
      disabled: '#4A4E57',      // Disabled text
      placeholder: '#6C727F',   // Placeholder text
      caption: '#6C727F',       // Caption text
      muted: '#6C727F',         // Muted text
    },
    
    // Primary Red Color System - Updated to match spec
    primary: {
      50: '#1F1415',         // Very dark red tint for dark backgrounds
      100: '#2A1A1C',        // Dark red for dark hover states
      200: '#352024',        // Dark-medium red for dark elements
      300: '#5A343A',        // Medium dark red for secondary dark elements
      400: '#8B4A50',        // Medium red for dark UI states
      500: '#EF4444',        // Main red - matches spec
      600: '#DC2626',        // Vivid red for primary actions on dark
      700: '#B91C1C',        // Bold red for critical alerts on dark
      800: '#991B1B',        // Deep red for pressed states on dark
      900: '#7F1D1D',        // Darkest red for emergency states
    },
    
    // Dark-Optimized Status Colors
    success: {
      50: '#1B2E1C',         // Very dark green for dark backgrounds
      100: '#223B24',        // Dark green for dark hover states
      200: '#2A482C',        // Dark-medium green for dark elements
      300: '#4A6B4D',        // Medium dark green for secondary elements
      400: '#15803D',        // Medium green for borders
      500: '#22C55E',        // Bright green - excellent on dark
      600: '#16A34A',        // Deep green for actions on dark
      700: '#15803D',        // Darker green for pressed states
    },
    
    warning: {
      50: '#2E1F0A',         // Very dark amber for dark backgrounds
      100: '#3B2910',        // Dark amber for dark hover states
      200: '#483216',        // Dark-medium amber for dark elements
      300: '#6B4423',        // Medium dark amber for secondary elements
      400: '#D97706',        // Medium amber for borders
      500: '#F59E0B',        // Bright amber - excellent on dark
      600: '#D97706',        // Deep amber for actions on dark
      700: '#B45309',        // Darker amber for pressed states
    },
    
    danger: {
      50: '#2E1B1F',         // Very dark red for dark backgrounds
      100: '#3D252A',        // Dark red for dark hover states
      200: '#4D2F35',        // Dark-medium red for dark elements
      300: '#7A4449',        // Medium dark red for secondary elements
      400: '#DC2626',        // Medium red for critical states
      500: '#EF4444',        // Bright red - excellent on dark
      600: '#DC2626',        // Deep red for actions on dark
      700: '#B91C1C',        // Darker red for pressed states
    },
    
    // Error colors (alias for danger for semantic consistency)
    error: {
      50: '#2E1B1F',         // Very dark red for dark backgrounds
      100: '#3D252A',        // Dark red for dark hover states
      200: '#4D2F35',        // Dark-medium red for dark elements
      300: '#7A4449',        // Medium dark red for secondary elements
      400: '#DC2626',        // Medium red for critical states
      500: '#EF4444',        // Bright red - excellent on dark
      600: '#DC2626',        // Deep red for actions on dark
      700: '#B91C1C',        // Darker red for pressed states
    },
    
    // Info colors for informational states
    info: {
      50: '#1C1E2E',         // Very dark blue for dark backgrounds
      100: '#252A3D',        // Dark blue for dark hover states
      200: '#2E364D',        // Dark-medium blue for dark elements
      300: '#4A5568',        // Medium dark blue for secondary elements
      400: '#3B82F6',        // Medium blue for informational states
      500: '#3B82F6',        // Bright blue - excellent on dark
      600: '#2563EB',        // Deep blue for actions on dark
      700: '#1976D2',        // Darker blue for pressed states
    },
    
    // Accent color for legacy compatibility  
    accent: '#D72638',         // Primary red accent
    
    // Dark Mode Border Colors - True Black Theme
    border: {
      default: '#2A2E38',     // Subtle border for true black theme
      light: '#1F2229',       // Very dark border
      medium: '#333640',      // Medium dark border
      strong: '#42454F',      // Strong dark border
      accent: '#EF4444',      // Red accent border
      primary: '#EF4444',     // Red primary border
    },
    
    // Dark Mode Overlay Colors - True Black
    overlay: {
      default: 'rgba(10, 11, 15, 0.8)',      // True black overlay
      strong: 'rgba(10, 11, 15, 0.95)',      // Strong black overlay
      backdrop: 'rgba(0, 0, 0, 0.6)',        // Modal backdrop
      medium: 'rgba(10, 11, 15, 0.85)',      // Medium overlay
    },
    
    // Updated gradients for deeper black theme
    gradients: {
      primary: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      primaryHover: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
      coral: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      hero: 'linear-gradient(135deg, #08090C 0%, #16181C 100%)',    // Deeper black gradient
      danger: 'linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%)',
      chart: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      button: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      success: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      // ANIMATED HEADING GRADIENTS
      headingRed: 'linear-gradient(135deg, #EF4444 0%, #F97316 50%, #EF4444 100%)',
      headingGreen: 'linear-gradient(135deg, #22C55E 0%, #10B981 50%, #22C55E 100%)',
      headingBlue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #3B82F6 100%)',
      headingGold: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 50%, #F59E0B 100%)',
    },
  },
  
  // Professional Inter Typography System
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',        // 12px - Backwards compatibility
      sm: '0.875rem',       // 14px - Backwards compatibility
      lg: '1.25rem',        // 20px - Backwards compatibility
      caption: '0.75rem',   // 12px - Small captions
      small: '0.875rem',    // 14px - Supporting text
      base: '1.1rem',       // 17.6px - Body text (bumped from 1rem)
      body: '1.1rem',       // 17.6px - Alias for base
      large: '1.25rem',     // 20px - Large body text
      xl: '1.375rem',       // 22px - Subheadings
      '2xl': '1.625rem',    // 26px - Section titles
      '3xl': '2rem',        // 32px - Page headlines
      '4xl': '2.5rem',      // 40px - Hero titles
      '5xl': '3.25rem',     // 52px - Display headings
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Enhanced Shadow System - Production Polish
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.24)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.24)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.24)',
    // PRODUCTION GLOWING SHADOWS
    glow: '0 8px 36px rgba(0, 0, 0, 0.42)',  // Prominent card glow
    glowStrong: '0 12px 48px rgba(0, 0, 0, 0.52)',  // Strong glow
    glowRed: '0 8px 36px rgba(239, 68, 68, 0.3)',  // Red accent glow
    glowGreen: '0 8px 36px rgba(34, 197, 94, 0.3)',  // Green accent glow
    glowBlue: '0 8px 36px rgba(59, 130, 246, 0.3)',  // Blue accent glow
    focusRing: '0 0 0 3px rgba(239, 68, 68, 0.2)',
    soft: '0 2px 8px rgba(0, 0, 0, 0.15)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.24)',
    warmGlow: '0 0 20px rgba(239, 68, 68, 0.3)',
    subtle: '0 1px 4px rgba(0, 0, 0, 0.15)',
  },
  
  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    default: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'all 0.2s ease-in-out',
    fast: 'all 0.15s ease-out',
    normal: 'all 0.3s ease',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    notification: 1070,
  },
  
  // Direct color access for legacy compatibility
  danger: '#D72638',
  warning: '#FFC107',
  success: '#4CAF50',
  
} as const;

export type Theme = typeof theme;