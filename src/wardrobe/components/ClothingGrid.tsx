import type { ClothingItem } from '../types';
import { ClothingCard } from './ClothingCard';

interface ClothingGridProps {
  items: ClothingItem[];
  onDelete: (id: string) => void;
  usageMap?: Record<string, number>;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}

export function ClothingGrid({ items, onDelete, usageMap, selectedIds, onSelect }: ClothingGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <ClothingCard
            item={item}
            onDelete={onDelete}
            usageCount={usageMap?.[item.id] ?? 0}
            selected={selectedIds?.includes(item.id)}
            onClick={() => onSelect?.(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
