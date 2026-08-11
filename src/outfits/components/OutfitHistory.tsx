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

const currentYear = new Date().getFullYear();

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    ...(d.getFullYear() !== currentYear ? { year: 'numeric' } : {}),
  });
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

  return (
    <div className="relative bg-zinc-800 rounded-2xl p-3 space-y-2">
      {/* Delete button */}
      <button
        onClick={() => onDelete(outfit.id)}
        className="absolute top-2 right-2 w-9 h-9 bg-zinc-700 hover:bg-red-600 rounded-full text-zinc-400 hover:text-white text-sm flex items-center justify-center transition-colors z-10"
        aria-label="Eliminar outfit"
      >
        ✕
      </button>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pr-10" style={{ touchAction: 'pan-x' }}>
        {items.map((item) => (
          <BlobImage
            key={item.id}
            blob={item.imageBlob}
            alt={item.name}
            className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
          />
        ))}
      </div>

      {outfit.aiNote && (
        <div className="flex items-start gap-1.5 bg-zinc-700/50 rounded-lg px-2.5 py-1.5">
          <span className="text-xs">✨</span>
          <p className="text-zinc-400 text-[11px] italic">"{outfit.aiNote}"</p>
        </div>
      )}

      <p className="text-zinc-500 text-xs">{formatDate(outfit.createdAt)}</p>
    </div>
  );
}

export function OutfitHistory({ outfits, allItems, onLoad, onDelete }: OutfitHistoryProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span className="text-6xl">🌟</span>
        <div>
          <p className="text-white font-semibold">Sin outfits guardados</p>
          <p className="text-zinc-500 text-sm mt-1">Generá un outfit y guardalo para verlo acá.</p>
        </div>
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
