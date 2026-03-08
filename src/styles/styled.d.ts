import 'styled-components';
import { Theme } from './theme';
import { ThemeConfig } from './themeConfig';

declare module 'styled-components' {
  // DefaultTheme merges the legacy dark theme (Theme) with the new switchable
  // theme config (ThemeConfig). The app passes ThemeConfig via StyledThemeProvider
  // while most styled components still use Theme properties.
  export interface DefaultTheme extends Theme, ThemeConfig {}
}