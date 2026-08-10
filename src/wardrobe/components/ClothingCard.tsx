import type { ClothingItem } from '../types';
import { CATEGORIES } from '../types';
import { BlobImage } from '../../shared/components/BlobImage';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
  selected?: boolean;
  onClick?: () => void;
}

export function ClothingCard({ item, onDelete, selected, onClick }: ClothingCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.value === item.category);

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden bg-slate-800 shadow-md cursor-pointer transition-all duration-150 ${
        selected ? 'ring-2 ring-violet-400 scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <BlobImage
        blob={item.imageBlob}
        alt={item.name}
        className="w-full aspect-[3/4] object-cover"
      />
      <div className="p-2">
        <p className="text-white text-xs font-medium truncate">{item.name}</p>
        <span className="text-slate-400 text-[10px]">
          {categoryInfo?.emoji} {categoryInfo?.label}
        </span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label="Eliminar prenda"
      >
        ✕
      </button>
    </div>
  );
}
