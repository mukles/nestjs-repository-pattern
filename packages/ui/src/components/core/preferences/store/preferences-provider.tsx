import React, { createContext, useState } from 'react';
import { updateThemeClass, updateThemePreset } from '../lib';
import {
  ContentLayout,
  NavbarStyle,
  SidebarCollapsible,
  SidebarVariant,
  ThemeMode,
  ThemePreset,
} from '../utils';
import { Coords, Key, PreferencesStoreProviderState } from './type';

const PREFERENCE_DEFAULTS = {
  resolvedThemeMode: 'light' as 'light' | 'dark',
  themeMode: 'light' as ThemeMode,
  themePreset: 'default' as ThemePreset,
  collapsible: 'icon' as SidebarCollapsible,
  contentLayout: 'centered' as ContentLayout,
  navbarStyle: 'scroll' as NavbarStyle,
  variant: 'sidebar' as SidebarVariant,
  fontSize: 'medium' as import('../utils').FontSize,
};

const initialState: PreferencesStoreProviderState = {
  ...PREFERENCE_DEFAULTS,
  handleValueChange: () => {},
};

export const PreferencesStoreContext =
  createContext<PreferencesStoreProviderState>(initialState);

export const PreferencesStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const STORAGE_KEYS = {
    themeMode: 'preferences.themeMode',
    themePreset: 'preferences.themePreset',
    contentLayout: 'preferences.contentLayout',
    navbarStyle: 'preferences.navbarStyle',
    collapsible: 'preferences.collapsible',
    variant: 'preferences.variant',
    fontSize: 'preferences.fontSize',
  };

  const getSystemThemeMode = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  const [preferencesStore, setPreferencesStore] = useState<
    Omit<
      PreferencesStoreProviderState,
      'handleValueChange' | 'resolvedThemeMode'
    > & { resolvedThemeMode: ThemeMode }
  >({
    ...initialState,
    resolvedThemeMode: getSystemThemeMode(),
  });

  React.useEffect(() => {
    const stored: Partial<typeof PREFERENCE_DEFAULTS> = {};
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const value = localStorage.getItem(storageKey);
      switch (key) {
        case 'themeMode':
          stored.themeMode =
            (value as ThemeMode) || PREFERENCE_DEFAULTS.themeMode;
          break;
        case 'themePreset':
          stored.themePreset =
            (value as ThemePreset) || PREFERENCE_DEFAULTS.themePreset;
          break;
        case 'collapsible':
          stored.collapsible =
            (value as SidebarCollapsible) || PREFERENCE_DEFAULTS.collapsible;
          break;
        case 'contentLayout':
          stored.contentLayout =
            (value as ContentLayout) || PREFERENCE_DEFAULTS.contentLayout;
          break;
        case 'navbarStyle':
          stored.navbarStyle =
            (value as NavbarStyle) || PREFERENCE_DEFAULTS.navbarStyle;
          break;
        case 'variant':
          stored.variant =
            (value as SidebarVariant) || PREFERENCE_DEFAULTS.variant;
          break;
        case 'fontSize':
          stored.fontSize =
            (value as import('../utils').FontSize) ||
            PREFERENCE_DEFAULTS.fontSize;
          break;
        default:
          break;
      }
    });
    const resolvedThemeMode = stored.themeMode === 'dark' ? 'dark' : 'light';
    setPreferencesStore({
      ...PREFERENCE_DEFAULTS,
      ...stored,
      resolvedThemeMode,
    });
    updateThemeClass(stored.themeMode as ThemeMode);
    updateThemePreset(stored.themePreset as ThemePreset);
    // apply stored font size
    if (stored.fontSize) {
      const mapping: Record<import('../utils').FontSize, string> = {
        small: '14px',
        medium: '16px',
        large: '18px',
      };
      document.documentElement.style.fontSize = mapping[stored.fontSize];
    }
  }, []);

  const setPreference = React.useCallback(
    <T extends keyof typeof STORAGE_KEYS>(key: T, value: any) => {
      localStorage.setItem(STORAGE_KEYS[key], value);
      setPreferencesStore((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Specialized setter for themeMode (with transition)
  const setThemeMode = React.useCallback((mode: ThemeMode, coords?: Coords) => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let newMode = mode;
    if (newMode === 'system') {
      newMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    localStorage.setItem(STORAGE_KEYS.themeMode, mode);
    setPreferencesStore((prev) => ({
      ...prev,
      themeMode: mode,
      resolvedThemeMode: mode,
    }));
    if (!document.startViewTransition || prefersReducedMotion) {
      updateThemeClass(mode);
      return;
    }
    if (coords) {
      root.style.setProperty('--x', `${coords.x}px`);
      root.style.setProperty('--y', `${coords.y}px`);
      document.startViewTransition(() => {
        updateThemeClass(mode);
      });
    } else {
      updateThemeClass(mode);
    }
  }, []);

  const setThemePreset = React.useCallback(
    (preset: ThemePreset) => {
      setPreference('themePreset', preset);
      updateThemePreset(preset);
    },
    [setPreference],
  );

  const setContentLayout = React.useCallback(
    (layout: ContentLayout) => {
      setPreference('contentLayout', layout);
    },
    [setPreference],
  );

  const setNavbarStyle = React.useCallback(
    (style: NavbarStyle) => {
      setPreference('navbarStyle', style);
    },
    [setPreference],
  );

  const setCollapsible = React.useCallback(
    (collapsible: SidebarCollapsible) => {
      setPreference('collapsible', collapsible);
    },
    [setPreference],
  );

  const setVariant = React.useCallback(
    (variant: SidebarVariant) => {
      setPreference('variant', variant);
    },
    [setPreference],
  );

  const setFontSize = React.useCallback(
    (size: import('../utils').FontSize) => {
      setPreference('fontSize', size);
      const mapping: Record<import('../utils').FontSize, string> = {
        small: '14px',
        medium: '16px',
        large: '18px',
      };
      document.documentElement.style.fontSize = mapping[size];
    },
    [setPreference],
  );

  const preferenceHandlers: Record<Key, (value: any, coords?: Coords) => void> =
    {
      theme_mode: setThemeMode,
      theme_preset: setThemePreset,
      content_layout: setContentLayout,
      navbar_style: setNavbarStyle,
      sidebar_collapsible: setCollapsible,
      sidebar_variant: setVariant,
      font_size: setFontSize,
    };

  const handleValueChange = React.useCallback(
    (key: Key, value: any, coords?: Coords) => {
      const handler = preferenceHandlers[key];
      if (handler) handler(value, coords);
    },
    [preferenceHandlers],
  );

  const value: PreferencesStoreProviderState = {
    ...PREFERENCE_DEFAULTS,
    ...preferencesStore,
    handleValueChange,
    resolvedThemeMode:
      preferencesStore.resolvedThemeMode === 'light' ||
      preferencesStore.resolvedThemeMode === 'dark'
        ? preferencesStore.resolvedThemeMode
        : initialState.resolvedThemeMode,
  };

  return (
    <PreferencesStoreContext.Provider value={value}>
      {children}
    </PreferencesStoreContext.Provider>
  );
};
