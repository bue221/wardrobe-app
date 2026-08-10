import { useEffect, useMemo } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../types';
import { BlobImage } from '../../shared/components/BlobImage';

interface OutfitHistoryProps {
  outfits: SavedOutfit[];
  allItems: ClothingItem[];
  onLoad: () => void;
  onDelete: (id: string) => void;
}

function OutfitCard({ outfit, allItems, onDelete }: {
  outfit: SavedOutfit;
  allItems: ClothingItem[];
  onDelete: (id: string) => void;
}) {
  const items = useMemo(
    () => outfit.clothingIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ClothingItem[],
    [outfit.clothingIds, allItems]
  );

  const date = new Date(outfit.createdAt).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short',
  });

  return (
    <div className="bg-slate-800 rounded-2xl p-3 space-y-2">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <BlobImage
            key={item.id}
            blob={item.imageBlob}
            alt={item.name}
            className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>
      {outfit.aiNote && (
        <p className="text-slate-400 text-[11px] italic">" {outfit.aiNote} "</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-slate-500 text-[10px]">{date}</span>
        <button
          onClick={() => onDelete(outfit.id)}
          className="text-slate-500 hover:text-red-400 text-xs transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export function OutfitHistory({ outfits, allItems, onLoad, onDelete }: OutfitHistoryProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
        <span className="text-5xl">🌟</span>
        <p className="text-sm text-center">Todavía no guardaste ningún outfit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} allItems={allItems} onDelete={onDelete} />
      ))}
    </div>
  );
}
