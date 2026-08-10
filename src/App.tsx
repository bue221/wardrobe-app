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
      className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
        active ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <span className="text-xl">{tab.emoji}</span>
      <span className="text-[10px] font-medium">{tab.label}</span>
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900 border-r border-slate-800 p-6 gap-2 sticky top-0 h-screen">
        <div className="mb-6">
          <h1 className="text-white font-bold text-lg">👗 Wardrobe</h1>
          <p className="text-slate-500 text-xs mt-1">Tu armario inteligente</p>
        </div>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-3xl w-full mx-auto">
          {activeTab === 'wardrobe' && <WardrobePage />}
          {activeTab === 'outfit' && <OutfitPage />}
          {activeTab === 'favorites' && <FavoritesPage />}
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around py-1 z-30">
          {TABS.map((tab) => (
            <NavItem
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </main>
    </div>
  );
}
