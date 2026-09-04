import type { ClothingItem } from '../types';
import { CATEGORIES } from '../types';
import { BlobImage } from '../../shared/components/BlobImage';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
  usageCount?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function ClothingCard({ item, onDelete, usageCount = 0, selected, onClick }: ClothingCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.value === item.category);

  return (
    <div
      onClick={onClick}
      style={{ touchAction: 'manipulation' }}
      className={`relative rounded-[40px] overflow-hidden bg-limestone cursor-pointer transition-transform duration-150 ${
        selected ? 'outline outline-[3px] outline-ember scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <BlobImage
        blob={item.imageBlob}
        alt={item.name}
        className="w-full aspect-[3/4] object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-obsidian/75 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pointer-events-none">
        <p className="font-body text-body-sm text-chalk truncate">{item.name}</p>
        <span className="font-caption text-chalk/70">{categoryInfo?.label}</span>
      </div>

      {usageCount > 0 && (
        <span className="absolute top-3 left-3 tag-sulfur !text-[11px]">
          {usageCount}x
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-3 right-3 w-11 h-11 bg-obsidian/70 rounded-full text-chalk text-sm flex items-center justify-center hover:bg-ember hover:text-obsidian transition-colors"
        aria-label="Eliminar prenda"
      >
        ✕
      </button>
    </div>
  );
}
