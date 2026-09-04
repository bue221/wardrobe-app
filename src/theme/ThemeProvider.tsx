import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getResolvedTheme,
  getThemePreference,
  initTheme,
  setThemePreference as commitTheme,
  subscribeTheme,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

interface ThemeContextValue {
  theme: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    initTheme();
    return getThemePreference();
  });
  const [resolved, setResolved] = useState<ResolvedTheme>(() => getResolvedTheme());

  useEffect(() => {
    return subscribeTheme(() => {
      setThemeState(getThemePreference());
      setResolved(getResolvedTheme());
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getThemePreference() === 'system') {
        commitTheme('system');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme: commitTheme }),
    [theme, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
