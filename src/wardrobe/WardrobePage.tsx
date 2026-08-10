import { useState } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { ClothingGrid } from './components/ClothingGrid';
import { FilterBar } from './components/FilterBar';
import { UploadForm } from './components/UploadForm';
import { Toast } from '../shared/components/Toast';
import type { Category } from './types';

export function WardrobePage() {
  const { items, loading, addItem, removeItem } = useWardrobe();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  async function handleAdd(file: File, name: string, category: Category, colors: string[]) {
    await addItem(file, name, category, colors);
    setToast('Prenda guardada ✓');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Mi Armario</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          + Agregar
        </button>
      </div>

      <FilterBar active={filter} onChange={setFilter} />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : (
        <ClothingGrid items={filtered} onDelete={removeItem} />
      )}

      {showUpload && (
        <UploadForm onAdd={handleAdd} onClose={() => setShowUpload(false)} />
      )}

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
