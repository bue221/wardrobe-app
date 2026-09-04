import { useEffect, useState } from 'react';
import { LandingPage } from './landing/LandingPage';
import { WardrobePage } from './wardrobe/WardrobePage';
import { OutfitPage } from './outfits/OutfitPage';
import { FavoritesPage } from './outfits/FavoritesPage';
import { LogoWordmark } from './shared/components/Logo';

type View = 'landing' | 'app';
type Tab = 'wardrobe' | 'outfit' | 'favorites';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'wardrobe', label: 'Armario', icon: 'A' },
  { id: 'outfit', label: 'Outfit', icon: 'O' },
  { id: 'favorites', label: 'Guardados', icon: 'G' },
];

function readViewFromHash(): View {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/app') ? 'app' : 'landing';
}

function readTabFromHash(): Tab {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.includes('/outfit')) return 'outfit';
  if (hash.includes('/favorites')) return 'favorites';
  return 'wardrobe';
}

function tabToHash(tab: Tab): string {
  if (tab === 'outfit') return '#/app/outfit';
  if (tab === 'favorites') return '#/app/favorites';
  return '#/app';
}

function NavIcon({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-body transition-colors ${
        active ? 'bg-ember text-obsidian' : 'bg-limestone text-obsidian/70'
      }`}
    >
      {label}
    </span>
  );
}

function AppShell({
  activeTab,
  onTabChange,
  onBackHome,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onBackHome: () => void;
}) {
  return (
    <div className="min-h-dvh bg-pumice text-obsidian flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 sticky top-0 h-screen p-6 gap-3">
        <div className="card-limestone !p-5 mb-2 space-y-2">
          <LogoWordmark onClick={onBackHome} className="text-left" />
          <p className="font-body text-body-sm text-obsidian/60">
            Tu armario inteligente
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-5 py-3 text-left font-body text-body transition-colors ${
                  active
                    ? 'bg-ember text-obsidian rounded-[40px]'
                    : 'bg-transparent text-obsidian hover:bg-limestone rounded-[40px]'
                }`}
              >
                <NavIcon label={tab.icon} active={active} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onBackHome}
          className="btn-ghost mt-auto self-start text-obsidian/70 hover:text-obsidian"
        >
          ← Landing
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-dvh md:min-h-0">
        <div className="md:hidden sticky top-0 z-20 bg-pumice/95 backdrop-blur-sm px-4 pt-3 pb-2">
          <div className="nav-pill justify-between">
            <LogoWordmark onClick={onBackHome} />
            <button type="button" onClick={onBackHome} className="btn-ghost text-body-sm">
              Home
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8 pb-28 md:pb-8 max-w-3xl w-full mx-auto">
          {activeTab === 'wardrobe' && <WardrobePage />}
          {activeTab === 'outfit' && <OutfitPage />}
          {activeTab === 'favorites' && <FavoritesPage />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pt-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="nav-pill justify-around !px-2 !py-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 min-w-[72px] py-1.5 px-3 rounded-[800px] transition-colors ${
                  active ? 'bg-ember' : 'bg-transparent'
                }`}
              >
                <NavIcon label={tab.icon} active={active} />
                <span className="font-body text-[11px] text-obsidian">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>(() =>
    typeof window !== 'undefined' ? readViewFromHash() : 'landing'
  );
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    typeof window !== 'undefined' ? readTabFromHash() : 'wardrobe'
  );

  useEffect(() => {
    function onHashChange() {
      setView(readViewFromHash());
      setActiveTab(readTabFromHash());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function enterApp(tab: Tab = 'wardrobe') {
    window.location.hash = tabToHash(tab);
    setView('app');
    setActiveTab(tab);
  }

  function goLanding() {
    window.location.hash = '#/';
    setView('landing');
  }

  function changeTab(tab: Tab) {
    window.location.hash = tabToHash(tab);
    setActiveTab(tab);
  }

  if (view === 'landing') {
    return <LandingPage onEnterApp={() => enterApp('wardrobe')} />;
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={changeTab}
      onBackHome={goLanding}
    />
  );
}
