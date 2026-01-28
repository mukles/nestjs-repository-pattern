import '@repo/ui/main.css';
import type { Metadata } from 'next';
import { APP_CONFIG } from '@/config/app-config';
import { fontVars } from '@/lib/fonts/registry';
import { PREFERENCE_DEFAULTS } from '@/lib/preferences/preferences-config';
import { PreferencesStoreProvider } from '@/stores/preferences/preferences-provider';
import { ThemeBootScript } from '@/scripts/theme-boot';

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const {
    theme_mode,
    theme_preset,
    content_layout,
    navbar_style,
    sidebar_variant,
    sidebar_collapsible,
    font,
  } = PREFERENCE_DEFAULTS;

  return (
    <html
      lang="en"
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      suppressHydrationWarning
    >
      <head>
        <ThemeBootScript />
      </head>
      <body className={`${fontVars} min-h-screen antialiased`}>
        <PreferencesStoreProvider
          themeMode={theme_mode}
          themePreset={theme_preset}
          contentLayout={content_layout}
          navbarStyle={navbar_style}
          font={font}
        >
          {children}
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
