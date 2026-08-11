import { useState } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { useStats } from '../shared/hooks/useStats';
import { ClothingGrid } from './components/ClothingGrid';
import { FilterBar } from './components/FilterBar';
import { UploadForm } from './components/UploadForm';
import { Toast } from '../shared/components/Toast';
import { seedWardrobe } from './utils/seedWardrobe';
import type { Category } from './types';

export function WardrobePage() {
  const { items, loading, addItem, removeItem } = useWardrobe();
  const { usageMap, totalOutfits, topItemId } = useStats();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

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

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedWardrobe(addItem);
      setToast('8 prendas de ejemplo cargadas ✓');
    } finally {
      setSeeding(false);
    }
  }

  const isEmpty = !loading && items.length === 0;
  const noResults = !loading && items.length > 0 && filtered.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-white text-xl font-bold">Mi Armario</h1>
          {!loading && items.length > 0 && (
            <p className="text-zinc-500 text-xs mt-0.5">
              {items.length} {items.length === 1 ? 'prenda' : 'prendas'}
              {totalOutfits > 0 && ` · ${totalOutfits} outfits`}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30"
        >
          + Agregar
        </button>
      </div>

      {/* Stats strip (only when items exist) */}
      {!loading && items.length > 0 && topItem && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="bg-zinc-800 text-zinc-400 text-[11px] px-2.5 py-1 rounded-full">
            ⭐ {topItem.name}
          </span>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="ml-auto text-zinc-600 hover:text-zinc-400 text-[11px] transition-colors disabled:opacity-50"
          >
            {seeding ? 'Cargando...' : '+ ejemplos'}
          </button>
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

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty wardrobe */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-14 gap-5">
          <span className="text-7xl">👗</span>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Tu armario está vacío</p>
            <p className="text-zinc-400 text-sm mt-1">Subí tu primera prenda o cargá ejemplos para probar</p>
          </div>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowUpload(true)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-900/30"
            >
              + Agregar prenda
            </button>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {seeding ? '⏳ Cargando ejemplos...' : '🧪 Cargar prendas de ejemplo'}
            </button>
          </div>
        </div>
      )}

      {/* No filter results */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-14 gap-2 text-zinc-500">
          <span className="text-4xl">🔍</span>
          <p className="text-sm">Sin prendas en esta categoría</p>
          <button
            onClick={() => { setFilter('all'); setSearch(''); }}
            className="text-violet-400 text-xs hover:underline mt-1"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <ClothingGrid items={filtered} usageMap={usageMap} onDelete={removeItem} />
      )}

      {showUpload && (
        <UploadForm onAdd={handleAdd} onClose={() => setShowUpload(false)} />
      )}

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
