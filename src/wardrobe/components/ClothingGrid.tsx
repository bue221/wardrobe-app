import type { ClothingItem } from '../types';
import { ClothingCard } from './ClothingCard';

interface ClothingGridProps {
  items: ClothingItem[];
  onDelete: (id: string) => void;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}

export function ClothingGrid({ items, onDelete, selectedIds, onSelect }: ClothingGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
        <span className="text-5xl">👗</span>
        <p className="text-sm">Tu armario está vacío. ¡Empezá subiendo tu primera prenda!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          selected={selectedIds?.includes(item.id)}
          onClick={() => onSelect?.(item.id)}
        />
      ))}
    </div>
  );
}
