import type { Category } from '../types';
import { CATEGORIES } from '../types';
import { useI18n } from '../../i18n/I18nProvider';
import { categoryLabel } from '../../i18n/labels';

interface FilterBarProps {
  active: Category | 'all';
  onChange: (cat: Category | 'all') => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  const { t } = useI18n();
  const options: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: t('category.all') },
    ...CATEGORIES.map((value) => ({ value, label: categoryLabel(value) })),
  ];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" style={{ touchAction: 'pan-x' }}>
      {options.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`min-h-11 flex-shrink-0 rounded-pill px-4 font-dm-sans font-medium text-body-sm leading-body-sm ${
              isActive ? 'bg-ember text-obsidian' : 'bg-surface text-ink'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
