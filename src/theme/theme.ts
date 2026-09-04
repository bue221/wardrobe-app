export const THEMES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEMES)[number];
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'wardrobe.theme';
export const THEME_COLOR_LIGHT = '#e2e2df';
export const THEME_COLOR_DARK = '#070607';

let preference: ThemePreference = 'system';
let resolved: ResolvedTheme = 'light';
const listeners = new Set<() => void>();

export function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyResolvedTheme(next: ResolvedTheme) {
  resolved = next;
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
  const status = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (status) status.setAttribute('content', next === 'dark' ? 'black-translucent' : 'default');
}

export function getThemePreference(): ThemePreference {
  return preference;
}

export function getResolvedTheme(): ResolvedTheme {
  return resolved;
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemePreference(next: ThemePreference) {
  preference = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* ignore quota */
  }
  applyResolvedTheme(resolveTheme(next));
  listeners.forEach((fn) => fn());
}

export function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) return stored;
  } catch {
    /* private mode */
  }
  return 'system';
}

export function initTheme() {
  preference = readStoredTheme();
  applyResolvedTheme(resolveTheme(preference));
}

export function canvasPaint(theme: ResolvedTheme = resolved) {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => {
    const value = styles.getPropertyValue(name).trim();
    return value || fallback;
  };
  if (theme === 'dark') {
    return {
      canvas: read('--color-canvas', THEME_COLOR_DARK),
      surface: read('--color-surface', '#1f1e1e'),
      ink: read('--color-ink', '#ffffff'),
      ember: read('--color-ember', '#fc5000'),
    };
  }
  return {
    canvas: read('--color-canvas', THEME_COLOR_LIGHT),
    surface: read('--color-surface', '#f7f6f2'),
    ink: read('--color-ink', THEME_COLOR_DARK),
    ember: read('--color-ember', '#fc5000'),
  };
}
