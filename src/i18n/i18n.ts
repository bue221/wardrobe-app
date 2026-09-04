import { DATE_LOCALES, LOCALES, messages, type Locale, type MessageKey } from './messages';

export const LOCALE_STORAGE_KEY = 'wardrobe.locale';

let currentLocale: Locale = 'es';
const listeners = new Set<() => void>();

export function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* private mode */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'es';
  return nav.toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function getLocale(): Locale {
  return currentLocale;
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: Locale) {
  if (next === currentLocale) {
    applyDocumentLocale(next);
    return;
  }
  currentLocale = next;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* ignore quota */
  }
  applyDocumentLocale(next);
  listeners.forEach((fn) => fn());
}

export function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale === 'en' ? 'en' : 'es';
  document.title = messages[locale]['meta.title'];
}

export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key]),
  );
}

export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const table = messages[currentLocale] ?? messages.es;
  return interpolate(table[key] ?? messages.es[key] ?? key, vars);
}

export function dateLocale(): string {
  return DATE_LOCALES[currentLocale];
}

export function initLocale() {
  currentLocale = detectLocale();
  applyDocumentLocale(currentLocale);
}

export type { Locale, MessageKey };
