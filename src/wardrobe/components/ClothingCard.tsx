import type { ClothingItem } from '../types';
import { BlobImage } from '../../shared/components/BlobImage';
import { Tag } from '../../shared/ui/Tag';
import { useI18n } from '../../i18n/I18nProvider';
import { categoryLabel } from '../../i18n/labels';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
  usageCount?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function ClothingCard({ item, onDelete, usageCount = 0, selected, onClick }: ClothingCardProps) {
  const { t } = useI18n();

  return (
    <article
      onClick={onClick}
      style={{ touchAction: 'manipulation' }}
      className={`relative overflow-hidden rounded-card bg-surface ${selected ? 'outline-3 outline-ember' : ''}`}
    >
      <BlobImage
        blob={item.imageBlob}
        alt={item.name}
        className="aspect-[3/4] w-full object-cover"
      />
      <div className="flex flex-col gap-2 p-4">
        <p className="truncate font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
          {item.name}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{categoryLabel(item.category)}</Tag>
          {usageCount > 0 && (
            <span className="font-system text-caption leading-caption text-ink">
              {t('wardrobe.looks', { n: usageCount })}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-pill bg-surface font-dm-sans font-medium text-ink"
        aria-label={t('wardrobe.deleteAria', { name: item.name })}
      >
        ✕
      </button>
    </article>
  );
}
