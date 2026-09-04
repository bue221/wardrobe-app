import { useEffect, useMemo } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../types';
import { BlobImage } from '../../shared/components/BlobImage';
import { EmptyState } from '../../shared/ui/EmptyState';
import { Tag } from '../../shared/ui/Tag';
import { sortItemsByCategory } from '../utils/sanitizeOutfit';
import { dateLocale, t } from '../../i18n/i18n';
import { useI18n } from '../../i18n/I18nProvider';

interface OutfitHistoryProps {
  outfits: SavedOutfit[];
  allItems: ClothingItem[];
  onLoad: () => void;
  onDelete: (id: string) => void;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const currentYear = new Date().getFullYear();
  return d.toLocaleDateString(dateLocale(), {
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
  const { locale } = useI18n();
  const items = useMemo(() => {
    const found = outfit.clothingIds
      .map((id) => allItems.find((i) => i.id === id))
      .filter(Boolean) as ClothingItem[];
    return sortItemsByCategory(found);
  }, [outfit.clothingIds, allItems]);

  return (
    <article className="relative flex flex-col gap-3 rounded-card bg-surface p-6">
      <button
        type="button"
        onClick={() => onDelete(outfit.id)}
        className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
        aria-label={t('favorites.deleteAria')}
      >
        ✕
      </button>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pr-12" style={{ touchAction: 'pan-x' }}>
        {items.map((item) => (
          <BlobImage
            key={item.id}
            blob={item.imageBlob}
            alt={item.name}
            className="h-28 w-20 flex-shrink-0 rounded-card object-cover"
          />
        ))}
      </div>

      {outfit.aiNote && (
        <div className="flex flex-col gap-2">
          <Tag>{t('outfit.tagAi')}</Tag>
          <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ink">
            {outfit.aiNote}
          </p>
        </div>
      )}

      <p className="font-system text-caption leading-caption text-ink" key={locale}>
        {formatDate(outfit.createdAt)}
      </p>
    </article>
  );
}

export function OutfitHistory({ outfits, allItems, onLoad, onDelete }: OutfitHistoryProps) {
  const { t: translate } = useI18n();

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (outfits.length === 0) {
    return (
      <EmptyState title={translate('favorites.emptyTitle')} body={translate('favorites.emptyBody')} />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} allItems={allItems} onDelete={onDelete} />
      ))}
    </div>
  );
}
