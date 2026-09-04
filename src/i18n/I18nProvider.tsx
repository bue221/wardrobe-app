import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getLocale,
  initLocale,
  setLocale as commitLocale,
  subscribeLocale,
  t as translate,
  type Locale,
  type MessageKey,
} from './i18n';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    initLocale();
    return getLocale();
  });

  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: commitLocale,
      t: translate,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
