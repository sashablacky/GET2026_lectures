import { useLayoutEffect, useState } from 'react';

const THEME_KEY = 'todo-app.theme';

export const PALETTE_PRESETS = [
  { name: 'Sky', bg: '#f3f4f6', sky: '#97e6ff', accent: '#3fb6f0' },
  { name: 'Sunset', bg: '#fbf3ee', sky: '#ffc6a8', accent: '#f0805e' },
  { name: 'Forest', bg: '#eef3ef', sky: '#b4e2c3', accent: '#3f9a6b' },
  { name: 'Lavender', bg: '#f4f2fb', sky: '#d3c8ff', accent: '#8b6cf0' },
  { name: 'Midnight', bg: '#0a0e24', sky: '#1d3b8f', accent: '#7dd3fc' },
  { name: 'Ember', bg: '#16100e', sky: '#7a2e1c', accent: '#ffad7a' },
];

const DEFAULT_THEME = {
  mode: 'light',
  custom: { bg: '#f4f2fb', sky: '#d3c8ff', accent: '#8b6cf0' },
};

// Relative luminance (WCAG) of a #rrggbb color, 0 = black, 1 = white.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function applyTheme(theme) {
  const root = document.documentElement;
  const customProps = ['--bg', '--sky', '--accent'];
  customProps.forEach((prop) => root.style.removeProperty(prop));

  if (theme.mode !== 'custom') {
    root.dataset.theme = theme.mode;
    return;
  }

  // A custom palette builds on the light or dark base, depending on its background.
  const { bg, sky, accent } = theme.custom;
  root.dataset.theme = luminance(bg) < 0.18 ? 'dark' : 'light';
  root.style.setProperty('--bg', bg);
  root.style.setProperty('--sky', sky);
  root.style.setProperty('--accent', accent);
}

function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY));
    return saved ? { ...DEFAULT_THEME, ...saved } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme);

  useLayoutEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  return [theme, setTheme];
}
