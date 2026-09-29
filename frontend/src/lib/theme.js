const STORAGE_KEY = 'hushbin-theme';

export function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  // No manual override yet — follow the browser/OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}