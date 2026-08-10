import { useMemo } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import { BlobImage } from '../../shared/components/BlobImage';

interface OutfitDisplayProps {
  selectedIds: string[];
  allItems: ClothingItem[];
  note?: string;
  onSave?: () => void;
}

export function OutfitDisplay({ selectedIds, allItems, note, onSave }: OutfitDisplayProps) {
  const selectedItems = useMemo(
    () => selectedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ClothingItem[],
    [selectedIds, allItems]
  );

  if (selectedItems.length === 0) return null;

  return (
    <div className="bg-zinc-800 rounded-2xl p-4 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {selectedItems.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden bg-zinc-700">
            <BlobImage blob={item.imageBlob} alt={item.name} className="w-full aspect-square object-cover" />
            <p className="text-[11px] text-zinc-400 text-center py-1 truncate px-1">{item.name}</p>
          </div>
        ))}
      </div>

      {note && (
        <p className="text-zinc-300 text-sm italic border-l-2 border-violet-500 pl-3">
          "{note}"
        </p>
      )}

      {onSave && (
        <button
          onClick={onSave}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30"
        >
          💾 Guardar outfit
        </button>
      )}
    </div>
  );
}
