import type { Category } from '../types';
import { CATEGORIES } from '../types';

interface FilterBarProps {
  active: Category | 'all';
  onChange: (cat: Category | 'all') => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  const all = [{ value: 'all' as const, label: 'Todo', emoji: '🗂️' }, ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {all.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat.value
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
