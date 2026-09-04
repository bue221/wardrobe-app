import { useMemo, useState } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import { BlobImage } from '../../shared/components/BlobImage';
import { generateOutfitCanvas, shareOrDownloadOutfit } from '../../shared/utils/outfitCanvas';
import { Button } from '../../shared/ui/Button';
import { Mark } from '../../shared/ui/Mark';
import { Tag } from '../../shared/ui/Tag';
import { sortItemsByCategory } from '../utils/sanitizeOutfit';
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

export function OutfitDisplay({
  selectedIds,
  allItems,
  note,
  source = 'random',
  onSave,
}: OutfitDisplayProps) {
  const { locale } = useI18n();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItems = useMemo(() => {
    const found = selectedIds
      .map((id) => allItems.find((i) => i.id === id))
      .filter(Boolean) as ClothingItem[];
    return sortItemsByCategory(found);
  }, [selectedIds, allItems]);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(dateLocale(), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [locale],
  );

  async function handleGenerateImage() {
    setGenerating(true);
    setError(null);
    try {
      const blob = await generateOutfitCanvas(selectedItems, note);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to generate outfit image', err);
      setError(t('outfit.imageFailed'));
    } finally {
      setGenerating(false);
    }
  }

  async function handleShare() {
    if (!imageBlob) return;
    setSharing(true);
    setError(null);
    try {
      await shareOrDownloadOutfit(imageBlob);
    } catch (err) {
      console.error('Failed to share outfit', err);
      setError(t('outfit.shareFailed'));
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
          <p className="font-system text-caption leading-caption text-ink/70">{dateLabel}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {selectedItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-card bg-canvas">
            <BlobImage
              blob={item.imageBlob}
              alt={item.name}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-3">
              <p className="truncate font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
                {item.name}
              </p>
              <Tag>{categoryLabel(item.category)}</Tag>
            </div>
          </article>
        ))}
      </div>

      {note && (
        <div className="flex flex-col items-start gap-2">
          {source === 'ai' && <Tag>{t('outfit.tagAi')}</Tag>}
          <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ink">{note}</p>
        </div>
      )}

      {error && (
        <p className="font-dm-sans font-medium text-body-sm leading-body-sm text-ember" role="alert">
          {error}
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
