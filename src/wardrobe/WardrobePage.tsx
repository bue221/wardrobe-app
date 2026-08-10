import { useState } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { useStats } from '../shared/hooks/useStats';
import { ClothingGrid } from './components/ClothingGrid';
import { FilterBar } from './components/FilterBar';
import { UploadForm } from './components/UploadForm';
import { Toast } from '../shared/components/Toast';
import type { Category } from './types';

export function WardrobePage() {
  const { items, loading, addItem, removeItem } = useWardrobe();
  const { usageMap, totalOutfits, topItemId } = useStats();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = items.filter((i) => {
    const matchesCategory = filter === 'all' || i.category === filter;
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topItem = items.find((i) => i.id === topItemId);

  async function handleAdd(file: File, name: string, category: Category, colors: string[]) {
    await addItem(file, name, category, colors);
    setToast('Prenda guardada ✓');
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Mi Armario</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30"
        >
          + Agregar
        </button>
      </div>

      {/* Stats strip */}
      {!loading && items.length > 0 && (
        <div className="flex gap-3 text-xs text-zinc-500">
          <span>{items.length} {items.length === 1 ? 'prenda' : 'prendas'}</span>
          {totalOutfits > 0 && (
            <>
              <span>·</span>
              <span>{totalOutfits} {totalOutfits === 1 ? 'outfit guardado' : 'outfits guardados'}</span>
            </>
          )}
          {topItem && (
            <>
              <span>·</span>
              <span>⭐ {topItem.name}</span>
            </>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
        <input
          type="search"
          placeholder="Buscar prenda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <FilterBar active={filter} onChange={setFilter} />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : (
        <ClothingGrid items={filtered} usageMap={usageMap} onDelete={removeItem} />
      )}

      {showUpload && (
        <UploadForm onAdd={handleAdd} onClose={() => setShowUpload(false)} />
      )}

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
