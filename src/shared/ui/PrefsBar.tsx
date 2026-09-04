import { LOCALES, type Locale } from '../../i18n/messages';
import { useI18n } from '../../i18n/I18nProvider';
import { THEMES, type ThemePreference } from '../../theme/theme';
import { useTheme } from '../../theme/ThemeProvider';

function QuietToggle({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      className="min-h-11 min-w-11 px-2 font-system text-caption leading-caption text-ink/50 transition-colors duration-200 hover:text-ember"
    >
      {value}
    </button>
  );
}

function nextOf<T extends string>(list: readonly T[], current: T): T {
  const i = list.indexOf(current);
  return list[(i + 1) % list.length];
}

export function PrefsBar() {
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();

  const localeLabel: Record<Locale, string> = {
    es: t('prefs.localeEs'),
    en: t('prefs.localeEn'),
  };
  const themeLabel: Record<ThemePreference, string> = {
    light: t('prefs.themeLight'),
    dark: t('prefs.themeDark'),
    system: t('prefs.themeSystem'),
  };

  return (
    <div className="flex items-center">
      <QuietToggle
        label={t('prefs.language')}
        value={localeLabel[locale]}
        onClick={() => setLocale(nextOf(LOCALES, locale))}
      />
      <span className="h-3 w-px border-l-[1.5px] border-dotted border-ink/40" aria-hidden />
      <QuietToggle
        label={t('prefs.theme')}
        value={themeLabel[theme]}
        onClick={() => setTheme(nextOf(THEMES, theme))}
      />
    </div>
  );
}
