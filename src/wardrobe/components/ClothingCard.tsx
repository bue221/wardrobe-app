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
      className={`relative rounded-2xl overflow-hidden bg-zinc-800 shadow-md cursor-pointer transition-all duration-150 ${
        selected ? 'ring-2 ring-violet-400 scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <BlobImage
        blob={item.imageBlob}
        alt={item.name}
        className="w-full aspect-[3/4] object-cover"
      />

      {/* Gradient overlay for name readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Name + category overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-3 pointer-events-none">
        <p className="text-white text-xs font-semibold truncate drop-shadow-sm">{item.name}</p>
        <span className="text-white/60 text-[10px]">
          {categoryInfo?.emoji} {categoryInfo?.label}
        </span>
      </div>

      {usageCount > 0 && (
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          🔥 {usageCount}
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="absolute top-2 right-2 w-11 h-11 bg-black/60 rounded-full text-white text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label="Eliminar prenda"
      >
        ✕
      </button>
    </div>
  );
}
