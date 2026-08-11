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

  const selectedItems = useMemo(
    () => selectedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as ClothingItem[],
    [selectedIds, allItems]
  );

  async function handleGenerateImage() {
    setGenerating(true);
    try {
      const blob = await generateOutfitCanvas(selectedItems);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } finally {
      setGenerating(false);
    }
  }

  async function handleShare() {
    if (!imageBlob) return;
    setSharing(true);
    try {
      await shareOrDownloadOutfit(imageBlob);
    } finally {
      setSharing(false);
    }
  }

  if (selectedItems.length === 0) return null;

  const colClass = selectedItems.length >= 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="bg-zinc-800 rounded-2xl p-4 space-y-4">
      {/* Clothing grid */}
      <div className={`grid ${colClass} gap-2`}>
        {selectedItems.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden bg-zinc-700">
            <BlobImage blob={item.imageBlob} alt={item.name} className="w-full aspect-[3/4] object-cover" />
            <p className="text-[10px] text-zinc-400 text-center py-1 truncate px-1">{item.name}</p>
          </div>
        ))}
      </div>

      {note && (
        <div className="flex items-start gap-2 bg-zinc-700/50 rounded-xl px-3 py-2">
          <span className="text-sm">✨</span>
          <p className="text-zinc-300 text-sm italic">"{note}"</p>
        </div>
      )}

      {/* Generate image button */}
      {!previewUrl && (
        <button
          onClick={handleGenerateImage}
          disabled={generating}
          className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              Generando imagen...
            </>
          ) : (
            '🎨 Ver como imagen'
          )}
        </button>
      )}

      {/* Generated preview */}
      {previewUrl && (
        <div className="space-y-3">
          <img
            src={previewUrl}
            alt="Outfit generado"
            className="w-full rounded-2xl border border-zinc-700 shadow-xl"
          />
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50"
            >
              {sharing ? 'Compartiendo...' : '📤 Compartir'}
            </button>
            <button
              onClick={handleGenerateImage}
              disabled={generating}
              className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-xl text-sm transition-colors disabled:opacity-50"
              title="Regenerar"
            >
              🔄
            </button>
          </div>
        </div>
      )}

      {onSave && (
        <button
          onClick={onSave}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30"
        >
          💾 Guardar outfit
        </button>
      )}
    </div>
  );
}
