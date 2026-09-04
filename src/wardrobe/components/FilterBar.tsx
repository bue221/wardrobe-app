import type { Category } from '../types';
import { CATEGORIES } from '../types';

interface FilterBarProps {
  active: Category | 'all';
  onChange: (cat: Category | 'all') => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  const all = [{ value: 'all' as const, label: 'Todo' }, ...CATEGORIES.map((c) => ({ value: c.value, label: c.label }))];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ touchAction: 'pan-x' }}>
      {all.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-[800px] font-body text-body-sm transition-colors ${
              isActive
                ? 'bg-ember text-obsidian'
                : 'bg-limestone text-obsidian hover:bg-obsidian/5'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
