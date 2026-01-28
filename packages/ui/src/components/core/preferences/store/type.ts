import {
  ContentLayout,
  NavbarStyle,
  SidebarCollapsible,
  SidebarVariant,
  ThemeMode,
  ThemePreset,
} from '../utils';

export type Coords = { x: number; y: number };

export type Key =
  | 'theme_mode'
  | 'theme_preset'
  | 'content_layout'
  | 'navbar_style'
  | 'sidebar_collapsible'
  | 'sidebar_variant'
  | 'font_size';

export type PreferencesStoreProviderState = {
  resolvedThemeMode: 'light' | 'dark';
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  contentLayout: ContentLayout;
  navbarStyle: NavbarStyle;
  fontSize: import('../utils').FontSize;
  handleValueChange: (key: Key, value: any, coords?: Coords) => void;
};
