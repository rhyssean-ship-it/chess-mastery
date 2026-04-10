import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const themes = {
  dark: {
    '--color-bg': '#0f1117',
    '--color-bg-card': '#181b22',
    '--color-bg-hover': '#252a35',
    '--color-bg-elevated': '#2a303c',
    '--color-gold': '#C9A84C',
    '--color-gold-dim': '#a68a3a',
    '--color-text': '#E8E4DC',
    '--color-text-dim': '#8A8680',
    '--color-correct': '#4CAF50',
    '--color-incorrect': '#E57373',
    '--color-amber': '#FFA726',
    '--shadow-card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '--shadow-card-hover': '0 10px 30px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  light: {
    '--color-bg': '#f5f3f0',
    '--color-bg-card': '#ffffff',
    '--color-bg-hover': '#eae7e2',
    '--color-bg-elevated': '#f0ede8',
    '--color-gold': '#7a6118',
    '--color-gold-dim': '#5c490f',
    '--color-text': '#1a1a1a',
    '--color-text-dim': '#6b6560',
    '--color-correct': '#2e7d32',
    '--color-incorrect': '#c62828',
    '--color-amber': '#e65100',
    '--shadow-card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    '--shadow-card-hover': '0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
  },
};

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    const vars = themes[theme] || themes.dark;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
