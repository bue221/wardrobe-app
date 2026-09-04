import { useMemo, useState } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import { BlobImage } from '../../shared/components/BlobImage';
import { generateOutfitCanvas, shareOrDownloadOutfit } from '../../shared/utils/outfitCanvas';

interface OutfitDisplayProps {
  selectedIds: string[];
  allItems: ClothingItem[];
  note?: string;
  onSave?: () => void;
}

export function OutfitDisplay({ selectedIds, allItems, note, onSave }: OutfitDisplayProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItems = useMemo(
    () => selectedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ClothingItem[],
    [selectedIds, allItems]
  );

  async function handleGenerateImage() {
    setGenerating(true);
    setError(null);
    try {
      const blob = await generateOutfitCanvas(selectedItems);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to generate outfit image', err);
      setError('No se pudo generar la imagen del outfit');
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
      setError('No se pudo compartir. Intentá descargar de nuevo.');
    } finally {
      setSharing(false);
    }
  }

  if (selectedItems.length === 0) return null;

  const colClass = selectedItems.length >= 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="card-limestone !p-5 md:!p-8 space-y-4">
      <div className={`grid ${colClass} gap-2`}>
        {selectedItems.map((item) => (
          <div key={item.id} className="rounded-[20px] overflow-hidden bg-pumice">
            <BlobImage blob={item.imageBlob} alt={item.name} className="w-full aspect-[3/4] object-cover" />
            <p className="font-caption text-obsidian/55 text-center py-1.5 truncate px-1">{item.name}</p>
          </div>
        ))}
      </div>

      {note && (
        <div className="rounded-[20px] bg-pumice px-4 py-3">
          <p className="font-body text-body-sm text-obsidian/80 italic">&ldquo;{note}&rdquo;</p>
        </div>
      )}

      {error && (
        <p className="font-body text-body-sm text-ember" role="alert">
          {error}
        </p>
      )}

      {!previewUrl && (
        <button
          type="button"
          onClick={handleGenerateImage}
          disabled={generating}
          className="btn-secondary w-full"
        >
          {generating ? 'Generando imagen...' : 'Ver como imagen'}
        </button>
      )}

      {previewUrl && (
        <div className="space-y-3">
          <img
            src={previewUrl}
            alt="Outfit generado"
            className="w-full rounded-[40px]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="btn-primary flex-1"
            >
              {sharing ? 'Compartiendo...' : 'Compartir'}
            </button>
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={generating}
              className="btn-secondary !px-4"
              title="Regenerar"
              aria-label="Regenerar imagen"
            >
              ↻
            </button>
          </div>
        </div>
      )}

      {onSave && (
        <button type="button" onClick={onSave} className="btn-primary w-full">
          Guardar outfit
        </button>
      )}
    </div>
  );
}
