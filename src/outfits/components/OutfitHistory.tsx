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

function OutfitCard({
  outfit,
  allItems,
  onDelete,
}: {
  outfit: SavedOutfit;
  allItems: ClothingItem[];
  onDelete: (id: string) => void;
}) {
  const items = useMemo(
    () => outfit.clothingIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ClothingItem[],
    [outfit.clothingIds, allItems]
  );

  return (
    <article className="relative card-limestone !p-4 space-y-3">
      <button
        type="button"
        onClick={() => onDelete(outfit.id)}
        className="absolute top-3 right-3 w-10 h-10 bg-pumice hover:bg-ember rounded-full text-obsidian text-sm flex items-center justify-center transition-colors z-10"
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
            className="w-20 h-28 object-cover rounded-[16px] flex-shrink-0"
          />
        ))}
      </div>

      {outfit.aiNote && (
        <div className="rounded-[16px] bg-pumice px-3 py-2">
          <p className="font-body text-[11px] text-obsidian/65 italic">&ldquo;{outfit.aiNote}&rdquo;</p>
        </div>
      )}

      <p className="font-caption text-obsidian/50">{formatDate(outfit.createdAt)}</p>
    </article>
  );
}

export function OutfitHistory({ outfits, allItems, onLoad, onDelete }: OutfitHistoryProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (outfits.length === 0) {
    return (
      <div className="card-limestone flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="halftone-block w-16 h-16" aria-hidden="true" />
        <div>
          <p className="font-display text-[26px] text-obsidian">SIN GUARDADOS</p>
          <p className="font-body text-body-sm text-obsidian/60 mt-2 max-w-xs">
            Generá un outfit y guardalo para verlo acá.
          </p>
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
