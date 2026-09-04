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
    setToast('Prenda guardada');
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedWardrobe(addItem);
      setToast('8 prendas de ejemplo cargadas');
    } finally {
      setSeeding(false);
    }
  }

  const isEmpty = !loading && items.length === 0;
  const noResults = !loading && items.length > 0 && filtered.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="font-display text-[32px] md:text-[48px] leading-[1] tracking-[0.64px] text-obsidian">
            MI ARMARIO
          </h1>
          {!loading && items.length > 0 && (
            <p className="font-caption text-obsidian/55 mt-1">
              {items.length} {items.length === 1 ? 'prenda' : 'prendas'}
              {totalOutfits > 0 && ` · ${totalOutfits} outfits`}
            </p>
          )}
        </div>
        <button type="button" onClick={() => setShowUpload(true)} className="btn-primary shrink-0">
          + Agregar
        </button>
      </div>

      {!loading && items.length > 0 && topItem && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag-sulfur">Top · {topItem.name}</span>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="ml-auto font-caption text-obsidian/50 hover:text-obsidian transition-colors disabled:opacity-50"
          >
            {seeding ? 'Cargando...' : '+ ejemplos'}
          </button>
        </div>
      )}

      <div className="relative">
        <input
          type="search"
          placeholder="Buscar prenda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !py-3 !px-5"
          aria-label="Buscar prenda"
        />
      </div>

      <FilterBar active={filter} onChange={setFilter} />

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-limestone rounded-[40px] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="card-limestone flex flex-col items-center justify-center py-12 gap-5 text-center">
          <div className="halftone-block w-24 h-24" aria-hidden="true" />
          <div>
            <p className="font-display text-[26px] tracking-[0.02em] text-obsidian">
              ARMARIO VACÍO
            </p>
            <p className="font-body text-body-sm text-obsidian/65 mt-2 max-w-xs mx-auto">
              Subí tu primera prenda o cargá ejemplos para probar el flujo.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <button type="button" onClick={() => setShowUpload(true)} className="btn-primary w-full">
              + Agregar prenda
            </button>
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              className="btn-secondary w-full"
            >
              {seeding ? 'Cargando ejemplos...' : 'Cargar prendas de ejemplo'}
            </button>
          </div>
        </div>
      )}

      {noResults && (
        <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
          <p className="font-display text-[26px] text-obsidian">SIN RESULTADOS</p>
          <p className="font-body text-body-sm text-obsidian/55">No hay prendas en esta categoría</p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setSearch('');
            }}
            className="btn-ghost mt-2 text-ember"
          >
            Limpiar filtros
          </button>
        </div>
      )}

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
