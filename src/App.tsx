import { useState } from 'react';
import { WardrobePage } from './wardrobe/WardrobePage';
import { OutfitPage } from './outfits/OutfitPage';
import { FavoritesPage } from './outfits/FavoritesPage';

type Tab = 'wardrobe' | 'outfit' | 'favorites';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'wardrobe', label: 'Armario', emoji: '👗' },
  { id: 'outfit', label: 'Outfit', emoji: '✨' },
  { id: 'favorites', label: 'Guardados', emoji: '⭐' },
];

function NavItem({ tab, active, onClick }: { tab: typeof TABS[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl transition-all ${
        active ? 'text-violet-400 bg-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <span className="text-xl">{tab.emoji}</span>
      <span className="text-[11px] font-medium">{tab.label}</span>
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe');

  return (
    <div className="min-h-dvh bg-zinc-950 text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-zinc-900 border-r border-zinc-800 p-6 gap-2 sticky top-0 h-screen">
        <div className="mb-6">
          <h1 className="font-bold text-lg bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            👗 Wardrobe
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Tu armario inteligente</p>
        </div>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-900/30'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-dvh md:min-h-0">
        <div className="p-4 md:p-8 pb-28 md:pb-8 max-w-3xl w-full mx-auto">
          {activeTab === 'wardrobe' && <WardrobePage />}
          {activeTab === 'outfit' && <OutfitPage />}
          {activeTab === 'favorites' && <FavoritesPage />}
        </div>
      </main>

      {/* Mobile bottom nav — fixed, outside main so it never affects layout */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex justify-around pt-1 z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {TABS.map((tab) => (
          <NavItem
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </nav>
    </div>
  );
}
