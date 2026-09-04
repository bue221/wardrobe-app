import { useEffect, useMemo, useRef, useState } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import { BlobImage } from '../../shared/components/BlobImage';
import { generateOutfitCanvas, shareOrDownloadOutfit } from '../../shared/utils/outfitCanvas';
import { Button } from '../../shared/ui/Button';
import { Mark } from '../../shared/ui/Mark';
import { Tag } from '../../shared/ui/Tag';
import { lookboardRows } from '../utils/sanitizeOutfit';
import type { OutfitSource } from '../hooks/useOutfitGenerator';
import { dateLocale, t } from '../../i18n/i18n';
import { useI18n } from '../../i18n/I18nProvider';
import { categoryLabel } from '../../i18n/labels';

interface OutfitDisplayProps {
  selectedIds: string[];
  allItems: ClothingItem[];
  note?: string;
  source?: OutfitSource;
  onSave?: () => void;
}

function photoAspect(item: ClothingItem, paired: boolean): string {
  if (paired) return 'aspect-square';
  if (item.category === 'outer') return 'aspect-[2/1]';
  if (item.category === 'shoes' || item.category === 'accessory') return 'aspect-[4/3]';
  return 'aspect-[4/5]';
}

function LookboardPiece({ item, paired }: { item: ClothingItem; paired: boolean }) {
  return (
    <article className="overflow-hidden rounded-card bg-canvas">
      <BlobImage
        blob={item.imageBlob}
        alt={item.name}
        className={`${photoAspect(item, paired)} w-full object-cover`}
      />
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
          {item.name}
        </p>
        <Tag>{categoryLabel(item.category)}</Tag>
      </div>
    </article>
  );
}

export function OutfitDisplay({
  selectedIds,
  allItems,
  note,
  source = 'random',
  onSave,
}: OutfitDisplayProps) {
  const { locale } = useI18n();
  const [preview, setPreview] = useState<{ key: string; url: string; blob: Blob } | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<{ key: string; message: string } | null>(null);
  const genToken = useRef(0);

  const selectedItems = useMemo(() => {
    const found = selectedIds
      .map((id) => allItems.find((i) => i.id === id))
      .filter(Boolean) as ClothingItem[];
    return found;
  }, [selectedIds, allItems]);

  const rows = useMemo(() => lookboardRows(selectedItems), [selectedItems]);
  const dateLabel = new Date().toLocaleDateString(dateLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const selectionKey = `${selectedIds.join('|')}|${note ?? ''}`;

  const previewUrl = preview?.key === selectionKey ? preview.url : null;
  const imageBlob = preview?.key === selectionKey ? preview.blob : null;
  const generating = generatingFor === selectionKey;
  const errorMessage = error?.key === selectionKey ? error.message : null;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  async function handleGenerateImage() {
    const token = ++genToken.current;
    const key = selectionKey;
    setGeneratingFor(key);
    setError(null);
    try {
      const blob = await generateOutfitCanvas(selectedItems, note);
      if (token !== genToken.current) return;
      const url = URL.createObjectURL(blob);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { key, url, blob };
      });
    } catch (err) {
      console.error('Failed to generate outfit image', err);
      if (token !== genToken.current) return;
      setError({ key, message: t('outfit.imageFailed') });
    } finally {
      if (token === genToken.current) setGeneratingFor(null);
    }
  }

  async function handleShare() {
    if (!imageBlob) return;
    setSharing(true);
    setError(null);
    try {
      await shareOrDownloadOutfit(imageBlob);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('Failed to share outfit', err);
      setError({ key: selectionKey, message: t('outfit.shareFailed') });
    } finally {
      setSharing(false);
    }
  }

  if (selectedItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-card bg-surface p-6 md:p-10">
      <header className="flex items-center gap-3">
        <Mark className="size-8" />
        <div className="flex min-w-0 flex-col">
          <h2 className="font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
            {t('outfit.mine')}
          </h2>
          <p key={locale} className="font-system text-caption leading-caption text-ink/70">
            {dateLabel}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const paired = row.length === 2;
          return (
            <div
              key={row.map((item) => item.id).join('-')}
              className={paired ? 'grid grid-cols-2 gap-3' : undefined}
            >
              {row.map((item) => (
                <LookboardPiece key={item.id} item={item} paired={paired} />
              ))}
            </div>
          );
        })}
      </div>

      {note && (
        <div className="flex flex-col items-start gap-2">
          {source === 'ai' && <Tag>{t('outfit.tagAi')}</Tag>}
          <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ink">{note}</p>
        </div>
      )}

      {errorMessage && (
        <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ember" role="alert">
          {errorMessage}
        </p>
      )}

      {!previewUrl && (
        <Button variant="secondary" onClick={handleGenerateImage} disabled={generating} className="w-full">
          {generating ? t('outfit.generatingImage') : t('outfit.viewImage')}
        </Button>
      )}

      {previewUrl && (
        <div className="flex flex-col gap-3">
          <img src={previewUrl} alt={t('outfit.generatedAlt')} className="w-full rounded-card" />
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleShare} disabled={sharing}>
              {sharing ? t('outfit.sharing') : t('outfit.share')}
            </Button>
            <Button variant="secondary" onClick={handleGenerateImage} disabled={generating} aria-label={t('outfit.regenerate')}>
              ↻
            </Button>
          </div>
        </div>
      )}

      {onSave && (
        <Button className="w-full" onClick={onSave}>
          {t('outfit.save')}
        </Button>
      )}
    </div>
  );
}
