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
    '--color-bg': '#f6f4f1',
    '--color-bg-card': '#fefdfb',
    '--color-bg-hover': '#edeae5',
    '--color-bg-elevated': '#f2efeb',
    '--color-gold': '#4d4538',
    '--color-gold-dim': '#363026',
    '--color-text': '#2a2622',
    '--color-text-dim': '#8a8478',
    '--color-correct': '#2e8b3a',
    '--color-incorrect': '#d43030',
    '--color-amber': '#d48806',
    '--shadow-card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.03)',
    '--shadow-card-hover': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
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
