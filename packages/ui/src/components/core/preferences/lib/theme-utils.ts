export type Theme = 'dark' | 'light' | 'system';

export const updateThemeClass = (mode: Theme) => {
  const root = document.documentElement;
  if (mode === 'light') {
    root.classList.remove('dark');
  } else if (mode === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    root.classList.add(systemTheme);
    return;
  } else {
    root.classList.add('dark');
  }
};

export function updateThemePreset(value: string) {
  document.documentElement.setAttribute('data-theme-preset', value);
}
