import { useState } from 'react';
import { WardrobePage } from '../wardrobe/WardrobePage';
import { OutfitPage } from '../outfits/OutfitPage';
import { FavoritesPage } from '../outfits/FavoritesPage';
import { Wordmark } from '../shared/ui/Mark';
import { Button } from '../shared/ui/Button';
import { PrefsBar } from '../shared/ui/PrefsBar';
import { useI18n } from '../i18n/I18nProvider';

type Tab = 'wardrobe' | 'outfit' | 'favorites';

interface AppShellProps {
  onHome: () => void;
}

export function AppShell({ onHome }: AppShellProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'wardrobe', label: t('nav.wardrobe') },
    { id: 'outfit', label: t('nav.outfit') },
    { id: 'favorites', label: t('nav.favorites') },
  ];

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="hidden px-6 pt-6 md:block">
        <nav className="mx-auto flex max-w-[1280px] items-center gap-4 rounded-pill bg-surface py-2 pr-2 pl-4">
          <button type="button" onClick={onHome} className="shrink-0" aria-label={t('nav.homeAria')}>
            <Wordmark />
          </button>
          <div className="flex flex-1 items-center gap-9">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-11 rounded-pill px-3 font-dm-sans font-medium text-base ${
                  activeTab === tab.id ? 'text-ember' : 'text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <PrefsBar />
          <Button variant="ghost" onClick={onHome}>
            {t('nav.home')}
          </Button>
        </nav>
      </header>

      <header className="flex items-center justify-between px-4 pt-4 md:hidden">
        <button type="button" onClick={onHome} aria-label={t('nav.homeAria')}>
          <Wordmark />
        </button>
        <PrefsBar />
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:px-8 md:pt-10 md:pb-16">
        {activeTab === 'wardrobe' && <WardrobePage />}
        {activeTab === 'outfit' && <OutfitPage />}
        {activeTab === 'favorites' && <FavoritesPage />}
      </main>

      <nav
        className="fixed right-4 left-4 z-30 md:hidden"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
        aria-label={t('nav.sections')}
      >
        <div className="flex justify-around rounded-pill bg-surface p-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-11 min-w-11 flex-1 rounded-pill px-3 font-dm-sans font-medium text-body-sm leading-body-sm ${
                  active ? 'bg-ember text-obsidian' : 'text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
