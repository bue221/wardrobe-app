import { useState } from 'react';
import { useWardrobe } from '../wardrobe/hooks/useWardrobe';
import { useOutfitGenerator } from './hooks/useOutfitGenerator';
import { useWebGPU } from '../shared/hooks/useWebGPU';
import { OutfitDisplay } from './components/OutfitDisplay';
import { Toast } from '../shared/components/Toast';

export function OutfitPage() {
  const { items } = useWardrobe();
  const webGpuSupported = useWebGPU();
  const { status, generateRandom, generateAI, saveCurrentOutfit, reset } = useOutfitGenerator();
  const [toast, setToast] = useState<string | null>(null);

  const isLoading = status.type === 'loading-model' || status.type === 'generating';
  const isDone = status.type === 'done';

  async function handleSave() {
    if (status.type !== 'done') return;
    try {
      await saveCurrentOutfit(status.ids, status.note);
      setToast('Outfit guardado');
      reset();
    } catch (err) {
      console.error('Failed to save outfit', err);
      setToast('No se pudo guardar el outfit');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[32px] md:text-[48px] leading-[1] tracking-[0.64px] text-obsidian">
        GENERADOR
      </h1>

      {items.length === 0 && (
        <div className="card-limestone flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-ember" aria-hidden="true" />
          <div>
            <p className="font-display text-[26px] text-obsidian">SIN PRENDAS</p>
            <p className="font-body text-body-sm text-obsidian/60 mt-2 max-w-xs">
              Primero agregá ropa en tu armario para poder generar outfits.
            </p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => generateRandom(items)}
              disabled={isLoading}
              className="btn-secondary w-full !py-4"
            >
              Outfit aleatorio
            </button>

            {webGpuSupported === true && (
              <button
                type="button"
                onClick={() => generateAI(items)}
                disabled={isLoading}
                className="btn-primary w-full !py-4"
              >
                Generar con IA (WebLLM)
              </button>
            )}
          </div>

          {status.type === 'loading-model' && (
            <div className="card-limestone !p-6 space-y-3">
              <div className="flex justify-between font-caption text-obsidian/60">
                <span>Cargando modelo de IA...</span>
                <span>{status.progress}%</span>
              </div>
              <div className="w-full bg-pumice rounded-[800px] h-2 overflow-hidden">
                <div
                  className="bg-ember h-2 rounded-[800px] transition-all duration-300"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <p className="font-caption text-obsidian/45 truncate">{status.text}</p>
              <p className="font-caption text-obsidian/40">
                Se descarga una sola vez (~600MB), luego queda en caché.
              </p>
            </div>
          )}

          {status.type === 'generating' && (
            <div className="text-center py-4 font-body text-body-sm text-obsidian/65">
              <span
                className="inline-block w-5 h-5 border-2 border-ember border-t-transparent rounded-full animate-spin mr-2 align-middle"
                aria-hidden="true"
              />
              La IA está eligiendo el outfit...
            </div>
          )}

          {status.type === 'error' && (
            <div className="rounded-[40px] bg-obsidian text-chalk p-5 font-body text-body-sm" role="alert">
              {status.message}
            </div>
          )}

          {isDone && (
            <OutfitDisplay
              selectedIds={status.ids}
              allItems={items}
              note={status.note}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast}
          type={toast.includes('No se pudo') ? 'error' : 'success'}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
