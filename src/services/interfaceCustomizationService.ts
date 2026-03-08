/**
 * Interface Customization Service - Issue #178 Implementation
 * 
 * Provides comprehensive UI customization capabilities for disaster response
 * applications including theme management, layout configuration, component
 * customization, and branding options.
 */

// Type definitions
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ComponentVariant = 'default' | 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
type LayoutType = 'fixed' | 'fluid' | 'responsive' | 'adaptive';
type BrandingLevel = 'minimal' | 'standard' | 'full' | 'white_label';

// Theme interfaces
interface Theme {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'light' | 'dark' | 'high_contrast' | 'custom';
  isSystem: boolean;
  isDefault: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  breakpoints: ThemeBreakpoints;
  components: ComponentStyles;
  metadata: ThemeMetadata;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ThemeColors {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    link: string;
    linkHover: string;
  };
  border: {
    default: string;
    light: string;
    dark: string;
    focus: string;
  };
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  headings: {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    h4: TypographyStyle;
    h5: TypographyStyle;
    h6: TypographyStyle;
  };
}

interface TypographyStyle {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  fontFamily?: string;
  textTransform?: string;
}

interface ThemeSpacing {
  unit: number;
  scale: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };
}

interface ThemeBorders {
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  width: {
    none: string;
    thin: string;
    medium: string;
    thick: string;
  };
}

interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  focus: string;
}

interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
}

interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

interface ComponentStyles {
  button: ButtonStyles;
  input: InputStyles;
  card: CardStyles;
  modal: ModalStyles;
  alert: AlertStyles;
  badge: BadgeStyles;
  table: TableStyles;
  navigation: NavigationStyles;
}

interface ButtonStyles {
  sizes: Record<ComponentSize, { height: string; padding: string; fontSize: string }>;
  variants: Record<ComponentVariant, { background: string; text: string; border: string }>;
  borderRadius: string;
  fontWeight: number;
}

interface InputStyles {
  sizes: Record<ComponentSize, { height: string; padding: string; fontSize: string }>;
  borderRadius: string;
  borderColor: string;
  focusBorderColor: string;
  backgroundColor: string;
  placeholderColor: string;
}

interface CardStyles {
  borderRadius: string;
  shadow: string;
  padding: string;
  backgroundColor: string;
  borderColor: string;
}

interface ModalStyles {
  borderRadius: string;
  shadow: string;
  overlayColor: string;
  overlayOpacity: number;
  maxWidth: Record<ComponentSize, string>;
}

interface AlertStyles {
  borderRadius: string;
  padding: string;
  variants: Record<'success' | 'warning' | 'error' | 'info', { background: string; border: string; text: string; icon: string }>;
}

interface BadgeStyles {
  sizes: Record<ComponentSize, { padding: string; fontSize: string }>;
  borderRadius: string;
}

interface TableStyles {
  headerBackground: string;
  rowHoverBackground: string;
  borderColor: string;
  stripedBackground: string;
  cellPadding: string;
}

interface NavigationStyles {
  backgroundColor: string;
  textColor: string;
  activeColor: string;
  hoverBackground: string;
  borderColor: string;
  height: string;
}

interface ThemeMetadata {
  author: string;
  license: string;
  tags: string[];
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    colorContrast: boolean;
    reducedMotion: boolean;
  };
  compatibility: string[];
}

// Layout interfaces
interface LayoutConfiguration {
  id: string;
  name: string;
  description: string;
  type: LayoutType;
  isDefault: boolean;
  structure: LayoutStructure;
  navigation: NavigationConfiguration;
  sidebar: SidebarConfiguration;
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  content: ContentConfiguration;
  responsive: ResponsiveConfiguration;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LayoutStructure {
  mode: 'sidebar-left' | 'sidebar-right' | 'sidebar-both' | 'no-sidebar' | 'horizontal';
  maxWidth: string;
  minWidth: string;
  padding: string;
  gap: string;
}

interface NavigationConfiguration {
  position: 'top' | 'left' | 'bottom';
  fixed: boolean;
  sticky: boolean;
  collapsible: boolean;
  defaultCollapsed: boolean;
  showBranding: boolean;
  showSearch: boolean;
  showNotifications: boolean;
  showUserMenu: boolean;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  action?: string;
  children?: MenuItem[];
  badge?: { text: string; variant: string };
  visible: boolean;
  requiredPermissions?: string[];
}

interface SidebarConfiguration {
  enabled: boolean;
  position: 'left' | 'right';
  width: string;
  collapsedWidth: string;
  collapsible: boolean;
  defaultCollapsed: boolean;
  showFooter: boolean;
  sections: SidebarSection[];
}

interface SidebarSection {
  id: string;
  title: string;
  collapsible: boolean;
  defaultCollapsed: boolean;
  items: MenuItem[];
}

interface HeaderConfiguration {
  enabled: boolean;
  height: string;
  fixed: boolean;
  showBreadcrumbs: boolean;
  showTitle: boolean;
  showActions: boolean;
  backgroundColor: string;
  borderBottom: boolean;
}

interface FooterConfiguration {
  enabled: boolean;
  height: string;
  fixed: boolean;
  content: { left?: string; center?: string; right?: string };
  showVersion: boolean;
  showCopyright: boolean;
  links: { label: string; url: string }[];
}

interface ContentConfiguration {
  padding: string;
  maxWidth: string;
  backgroundColor: string;
  scrollBehavior: 'auto' | 'smooth';
}

interface ResponsiveConfiguration {
  breakpoints: {
    mobile: ResponsiveBreakpoint;
    tablet: ResponsiveBreakpoint;
    desktop: ResponsiveBreakpoint;
    widescreen: ResponsiveBreakpoint;
  };
}

interface ResponsiveBreakpoint {
  minWidth: string;
  layout: Partial<LayoutStructure>;
  navigation?: Partial<NavigationConfiguration>;
  sidebar?: Partial<SidebarConfiguration>;
}

// Branding interfaces
interface BrandingConfiguration {
  id: string;
  organizationId: string;
  name: string;
  level: BrandingLevel;
  logo: LogoConfiguration;
  colors: BrandColors;
  typography: BrandTypography;
  assets: BrandAssets;
  messaging: BrandMessaging;
  customCss?: string;
  customJs?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LogoConfiguration {
  primary: { url: string; width: number; height: number };
  secondary?: { url: string; width: number; height: number };
  favicon: string;
  appIcon: { '192': string; '512': string };
  loadingSpinner?: string;
}

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  headerBackground?: string;
  headerText?: string;
  sidebarBackground?: string;
  sidebarText?: string;
}

interface BrandTypography {
  headingFont?: string;
  bodyFont?: string;
  customFonts?: { name: string; url: string }[];
}

interface BrandAssets {
  backgroundImage?: string;
  heroImage?: string;
  emptyStateImage?: string;
  errorPageImage?: string;
  loginBackground?: string;
}

interface BrandMessaging {
  appName: string;
  tagline?: string;
  welcomeMessage?: string;
  footerText?: string;
  copyrightText?: string;
  supportEmail?: string;
  supportPhone?: string;
  termsUrl?: string;
  privacyUrl?: string;
}

// Widget customization interfaces
interface WidgetConfiguration {
  id: string;
  widgetId: string;
  name: string;
  description: string;
  category: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  resizable: boolean;
  draggable: boolean;
  removable: boolean;
  configurable: boolean;
  settings: WidgetSettings;
  styles: WidgetStyles;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface WidgetSettings {
  refreshInterval?: number;
  dataSource?: string;
  filters?: Record<string, unknown>;
  customFields?: Record<string, unknown>;
  displayOptions?: Record<string, unknown>;
}

interface WidgetStyles {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  shadow?: string;
  padding?: string;
  headerColor?: string;
  headerBackground?: string;
}

// Sample data
const sampleThemes: Theme[] = [
  {
    id: 'theme-light',
    name: 'Rescue Ping Light',
    description: 'Default light theme for Rescue Ping',
    version: '1.0.0',
    type: 'light',
    isSystem: true,
    isDefault: true,
    colors: {
      primary: {
        50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
        400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
        800: '#3730A3', 900: '#312E81', main: '#6366F1', light: '#818CF8',
        dark: '#4F46E5', contrastText: '#FFFFFF'
      },
      secondary: {
        50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
        400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
        800: '#166534', 900: '#14532D', main: '#22C55E', light: '#4ADE80',
        dark: '#16A34A', contrastText: '#FFFFFF'
      },
      accent: {
        50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74',
        400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C',
        800: '#9A3412', 900: '#7C2D12', main: '#F97316', light: '#FB923C',
        dark: '#EA580C', contrastText: '#FFFFFF'
      },
      neutral: {
        50: '#FAFAFA', 100: '#F4F4F5', 200: '#E4E4E7', 300: '#D4D4D8',
        400: '#A1A1AA', 500: '#71717A', 600: '#52525B', 700: '#3F3F46',
        800: '#27272A', 900: '#18181B', main: '#71717A', light: '#A1A1AA',
        dark: '#52525B', contrastText: '#FFFFFF'
      },
      success: {
        50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
        400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
        800: '#166534', 900: '#14532D', main: '#22C55E', light: '#4ADE80',
        dark: '#16A34A', contrastText: '#FFFFFF'
      },
      warning: {
        50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
        400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
        800: '#92400E', 900: '#78350F', main: '#F59E0B', light: '#FBBF24',
        dark: '#D97706', contrastText: '#000000'
      },
      error: {
        50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5',
        400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
        800: '#991B1B', 900: '#7F1D1D', main: '#EF4444', light: '#F87171',
        dark: '#DC2626', contrastText: '#FFFFFF'
      },
      info: {
        50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
        400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
        800: '#1E40AF', 900: '#1E3A8A', main: '#3B82F6', light: '#60A5FA',
        dark: '#2563EB', contrastText: '#FFFFFF'
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#F4F4F5',
        tertiary: '#E4E4E7',
        inverse: '#18181B',
        overlay: 'rgba(0, 0, 0, 0.5)'
      },
      text: {
        primary: '#18181B',
        secondary: '#52525B',
        tertiary: '#71717A',
        disabled: '#A1A1AA',
        inverse: '#FFFFFF',
        link: '#6366F1',
        linkHover: '#4F46E5'
      },
      border: {
        default: '#E4E4E7',
        light: '#F4F4F5',
        dark: '#D4D4D8',
        focus: '#6366F1'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
        monospace: 'JetBrains Mono, monospace',
        display: 'Inter, system-ui, sans-serif'
      },
      fontSize: {
        xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem'
      },
      fontWeight: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
      lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.625, loose: 2 },
      letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em' },
      headings: {
        h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.025em' },
        h2: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.025em' },
        h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.375, letterSpacing: '0' },
        h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.375, letterSpacing: '0' },
        h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0' },
        h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0' }
      }
    },
    spacing: {
      unit: 4,
      scale: {
        0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
        5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem',
        12: '3rem', 16: '4rem', 20: '5rem', 24: '6rem'
      }
    },
    borders: {
      radius: {
        none: '0', sm: '0.125rem', md: '0.375rem',
        lg: '0.5rem', xl: '0.75rem', full: '9999px'
      },
      width: { none: '0', thin: '1px', medium: '2px', thick: '4px' }
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      focus: '0 0 0 3px rgba(99, 102, 241, 0.5)'
    },
    animations: {
      duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      transitions: {
        default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
    breakpoints: {
      xs: '0px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    },
    components: {
      button: {
        sizes: {
          xs: { height: '1.5rem', padding: '0 0.5rem', fontSize: '0.75rem' },
          sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
          md: { height: '2.5rem', padding: '0 1rem', fontSize: '1rem' },
          lg: { height: '3rem', padding: '0 1.5rem', fontSize: '1.125rem' },
          xl: { height: '3.5rem', padding: '0 2rem', fontSize: '1.25rem' }
        },
        variants: {
          default: { background: '#F4F4F5', text: '#18181B', border: '#E4E4E7' },
          primary: { background: '#6366F1', text: '#FFFFFF', border: '#6366F1' },
          secondary: { background: '#22C55E', text: '#FFFFFF', border: '#22C55E' },
          outlined: { background: 'transparent', text: '#6366F1', border: '#6366F1' },
          ghost: { background: 'transparent', text: '#18181B', border: 'transparent' },
          danger: { background: '#EF4444', text: '#FFFFFF', border: '#EF4444' }
        },
        borderRadius: '0.375rem',
        fontWeight: 500
      },
      input: {
        sizes: {
          xs: { height: '1.5rem', padding: '0 0.5rem', fontSize: '0.75rem' },
          sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
          md: { height: '2.5rem', padding: '0 1rem', fontSize: '1rem' },
          lg: { height: '3rem', padding: '0 1.25rem', fontSize: '1.125rem' },
          xl: { height: '3.5rem', padding: '0 1.5rem', fontSize: '1.25rem' }
        },
        borderRadius: '0.375rem',
        borderColor: '#E4E4E7',
        focusBorderColor: '#6366F1',
        backgroundColor: '#FFFFFF',
        placeholderColor: '#A1A1AA'
      },
      card: {
        borderRadius: '0.5rem',
        shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        borderColor: '#E4E4E7'
      },
      modal: {
        borderRadius: '0.5rem',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
        maxWidth: { xs: '20rem', sm: '24rem', md: '28rem', lg: '32rem', xl: '36rem' }
      },
      alert: {
        borderRadius: '0.375rem',
        padding: '1rem',
        variants: {
          success: { background: '#F0FDF4', border: '#22C55E', text: '#166534', icon: '#22C55E' },
          warning: { background: '#FFFBEB', border: '#F59E0B', text: '#92400E', icon: '#F59E0B' },
          error: { background: '#FEF2F2', border: '#EF4444', text: '#991B1B', icon: '#EF4444' },
          info: { background: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', icon: '#3B82F6' }
        }
      },
      badge: {
        sizes: {
          xs: { padding: '0 0.25rem', fontSize: '0.625rem' },
          sm: { padding: '0.125rem 0.375rem', fontSize: '0.75rem' },
          md: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
          lg: { padding: '0.375rem 0.625rem', fontSize: '1rem' },
          xl: { padding: '0.5rem 0.75rem', fontSize: '1.125rem' }
        },
        borderRadius: '9999px'
      },
      table: {
        headerBackground: '#F4F4F5',
        rowHoverBackground: '#FAFAFA',
        borderColor: '#E4E4E7',
        stripedBackground: '#FAFAFA',
        cellPadding: '0.75rem 1rem'
      },
      navigation: {
        backgroundColor: '#FFFFFF',
        textColor: '#52525B',
        activeColor: '#6366F1',
        hoverBackground: '#F4F4F5',
        borderColor: '#E4E4E7',
        height: '4rem'
      }
    },
    metadata: {
      author: 'Rescue Ping Team',
      license: 'MIT',
      tags: ['light', 'default', 'professional'],
      accessibility: { wcagLevel: 'AA', colorContrast: true, reducedMotion: true },
      compatibility: ['chrome', 'firefox', 'safari', 'edge']
    },
    createdBy: 'system',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

class InterfaceCustomizationService {
  private static instance: InterfaceCustomizationService;
  private themes: Map<string, Theme> = new Map();
  private layouts: Map<string, LayoutConfiguration> = new Map();
  private branding: Map<string, BrandingConfiguration> = new Map();
  private widgets: Map<string, WidgetConfiguration> = new Map();

  private activeTheme: string = 'theme-light';
  private activeLayout: string = 'layout-default';

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): InterfaceCustomizationService {
    if (!InterfaceCustomizationService.instance) {
      InterfaceCustomizationService.instance = new InterfaceCustomizationService();
    }
    return InterfaceCustomizationService.instance;
  }

  private initializeSampleData(): void {
    sampleThemes.forEach(t => this.themes.set(t.id, t));
  }

  // ==================== Theme Management ====================

  async createTheme(params: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>): Promise<Theme> {
    const theme: Theme = {
      ...params,
      id: `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.themes.set(theme.id, theme);
    return theme;
  }

  async getTheme(themeId: string): Promise<Theme | null> {
    return this.themes.get(themeId) || null;
  }

  async getThemes(params?: { type?: Theme['type']; isSystem?: boolean }): Promise<Theme[]> {
    let themes = Array.from(this.themes.values());

    if (params?.type) {
      themes = themes.filter(t => t.type === params.type);
    }

    if (params?.isSystem !== undefined) {
      themes = themes.filter(t => t.isSystem === params.isSystem);
    }

    return themes.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async updateTheme(themeId: string, updates: Partial<Theme>): Promise<Theme> {
    const theme = this.themes.get(themeId);
    if (!theme) throw new Error(`Theme not found: ${themeId}`);

    Object.assign(theme, updates);
    theme.updatedAt = new Date();
    return theme;
  }

  async deleteTheme(themeId: string): Promise<boolean> {
    const theme = this.themes.get(themeId);
    if (theme?.isSystem) throw new Error('Cannot delete system theme');
    return this.themes.delete(themeId);
  }

  async setActiveTheme(themeId: string): Promise<Theme> {
    const theme = await this.getTheme(themeId);
    if (!theme) throw new Error(`Theme not found: ${themeId}`);
    this.activeTheme = themeId;
    return theme;
  }

  getActiveTheme(): string {
    return this.activeTheme;
  }

  async getActiveThemeDetails(): Promise<Theme | null> {
    return this.themes.get(this.activeTheme) || null;
  }

  // ==================== Layout Management ====================

  async createLayout(params: Omit<LayoutConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<LayoutConfiguration> {
    const layout: LayoutConfiguration = {
      ...params,
      id: `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.layouts.set(layout.id, layout);
    return layout;
  }

  async getLayout(layoutId: string): Promise<LayoutConfiguration | null> {
    return this.layouts.get(layoutId) || null;
  }

  async getLayouts(): Promise<LayoutConfiguration[]> {
    return Array.from(this.layouts.values())
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }

  async updateLayout(layoutId: string, updates: Partial<LayoutConfiguration>): Promise<LayoutConfiguration> {
    const layout = this.layouts.get(layoutId);
    if (!layout) throw new Error(`Layout not found: ${layoutId}`);

    Object.assign(layout, updates);
    layout.updatedAt = new Date();
    return layout;
  }

  async setActiveLayout(layoutId: string): Promise<LayoutConfiguration> {
    const layout = await this.getLayout(layoutId);
    if (!layout) throw new Error(`Layout not found: ${layoutId}`);
    this.activeLayout = layoutId;
    return layout;
  }

  // ==================== Branding Management ====================

  async createBranding(params: Omit<BrandingConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandingConfiguration> {
    const branding: BrandingConfiguration = {
      ...params,
      id: `brand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.branding.set(branding.organizationId, branding);
    return branding;
  }

  async getBranding(organizationId: string): Promise<BrandingConfiguration | null> {
    return this.branding.get(organizationId) || null;
  }

  async updateBranding(organizationId: string, updates: Partial<BrandingConfiguration>): Promise<BrandingConfiguration> {
    const brand = this.branding.get(organizationId);
    if (!brand) throw new Error(`Branding not found for organization: ${organizationId}`);

    Object.assign(brand, updates);
    brand.updatedAt = new Date();
    return brand;
  }

  async updateLogo(organizationId: string, logo: LogoConfiguration): Promise<BrandingConfiguration> {
    const brand = this.branding.get(organizationId);
    if (!brand) throw new Error(`Branding not found for organization: ${organizationId}`);

    brand.logo = logo;
    brand.updatedAt = new Date();
    return brand;
  }

  // ==================== Widget Management ====================

  async createWidget(params: Omit<WidgetConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<WidgetConfiguration> {
    const widget: WidgetConfiguration = {
      ...params,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.widgets.set(widget.id, widget);
    return widget;
  }

  async getWidget(widgetId: string): Promise<WidgetConfiguration | null> {
    return this.widgets.get(widgetId) || null;
  }

  async getWidgets(category?: string): Promise<WidgetConfiguration[]> {
    let widgets = Array.from(this.widgets.values());

    if (category) {
      widgets = widgets.filter(w => w.category === category);
    }

    return widgets.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateWidget(widgetId: string, updates: Partial<WidgetConfiguration>): Promise<WidgetConfiguration> {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error(`Widget not found: ${widgetId}`);

    Object.assign(widget, updates);
    widget.updatedAt = new Date();
    return widget;
  }

  // ==================== CSS Variable Generation ====================

  generateCssVariables(theme: Theme): string {
    const lines: string[] = [':root {'];

    // Colors
    Object.entries(theme.colors).forEach(([category, colors]) => {
      if (typeof colors === 'object') {
        Object.entries(colors).forEach(([key, value]) => {
          if (typeof value === 'string') {
            lines.push(`  --color-${category}-${key}: ${value};`);
          }
        });
      }
    });

    // Typography
    lines.push(`  --font-family-primary: ${theme.typography.fontFamily.primary};`);
    lines.push(`  --font-family-secondary: ${theme.typography.fontFamily.secondary};`);
    lines.push(`  --font-family-monospace: ${theme.typography.fontFamily.monospace};`);

    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      lines.push(`  --font-size-${key}: ${value};`);
    });

    // Spacing
    Object.entries(theme.spacing.scale).forEach(([key, value]) => {
      lines.push(`  --spacing-${key}: ${value};`);
    });

    // Borders
    Object.entries(theme.borders.radius).forEach(([key, value]) => {
      lines.push(`  --radius-${key}: ${value};`);
    });

    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      lines.push(`  --shadow-${key}: ${value};`);
    });

    // Animations
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      lines.push(`  --duration-${key}: ${value};`);
    });

    lines.push('}');
    return lines.join('\n');
  }

  // ==================== Theme Export/Import ====================

  async exportTheme(themeId: string): Promise<string> {
    const theme = await this.getTheme(themeId);
    if (!theme) throw new Error(`Theme not found: ${themeId}`);
    return JSON.stringify(theme, null, 2);
  }

  async importTheme(data: string, userId: string): Promise<Theme> {
    try {
      const imported = JSON.parse(data);
      return this.createTheme({
        ...imported,
        id: undefined,
        name: `${imported.name} (Imported)`,
        isSystem: false,
        isDefault: false,
        createdBy: userId
      });
    } catch (error) {
      throw new Error('Invalid theme data format');
    }
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalThemes: number;
    systemThemes: number;
    customThemes: number;
    totalLayouts: number;
    totalBranding: number;
    totalWidgets: number;
    themesByType: { type: string; count: number }[];
    widgetsByCategory: { category: string; count: number }[];
  }> {
    const themes = Array.from(this.themes.values());
    const widgets = Array.from(this.widgets.values());

    const themeTypeCounts: Record<string, number> = {};
    themes.forEach(t => {
      themeTypeCounts[t.type] = (themeTypeCounts[t.type] || 0) + 1;
    });

    const widgetCategoryCounts: Record<string, number> = {};
    widgets.forEach(w => {
      widgetCategoryCounts[w.category] = (widgetCategoryCounts[w.category] || 0) + 1;
    });

    return {
      totalThemes: themes.length,
      systemThemes: themes.filter(t => t.isSystem).length,
      customThemes: themes.filter(t => !t.isSystem).length,
      totalLayouts: this.layouts.size,
      totalBranding: this.branding.size,
      totalWidgets: widgets.length,
      themesByType: Object.entries(themeTypeCounts).map(([type, count]) => ({ type, count })),
      widgetsByCategory: Object.entries(widgetCategoryCounts).map(([category, count]) => ({ category, count }))
    };
  }
}

export const interfaceCustomizationService = InterfaceCustomizationService.getInstance();
export default InterfaceCustomizationService;
