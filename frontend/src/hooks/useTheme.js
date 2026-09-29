import { useEffect, useState } from 'react';
import { getInitialTheme, applyTheme, saveTheme } from '../lib/theme';

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      return next;
    });
  }

  return { theme, toggleTheme };
}