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
    await saveCurrentOutfit(status.ids, status.note);
    setToast('Outfit guardado ✓');
    reset();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-white text-xl font-bold">Generador de Outfits</h1>

      {items.length === 0 && (
        <div className="text-center text-zinc-500 py-12">
          <span className="text-5xl block mb-3">👕</span>
          <p className="text-sm">Primero agregá prendas en tu armario.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => generateRandom(items)}
              disabled={isLoading}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-semibold text-sm transition-colors disabled:opacity-40"
            >
              🎲 Outfit Aleatorio
            </button>

            {webGpuSupported === null && (
              <div className="w-full py-4 bg-zinc-800 rounded-2xl text-zinc-500 text-sm text-center">
                Detectando soporte de IA...
              </div>
            )}

            {webGpuSupported === true && (
              <button
                onClick={() => generateAI(items)}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-violet-900/30 disabled:opacity-40"
              >
                ✨ Generar con IA (WebLLM)
              </button>
            )}

            {webGpuSupported === false && (
              <div className="w-full py-3 bg-zinc-800 rounded-2xl text-zinc-500 text-xs text-center px-4">
                Tu navegador no soporta WebGPU. Usá Chrome/Edge en desktop para la IA.
              </div>
            )}
          </div>

          {/* Model loading progress */}
          {status.type === 'loading-model' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Cargando modelo de IA...</span>
                <span>{status.progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <p className="text-zinc-500 text-[11px] truncate">{status.text}</p>
              <p className="text-zinc-600 text-[10px]">Se descarga una sola vez (~600MB), luego queda en caché.</p>
            </div>
          )}

          {status.type === 'generating' && (
            <div className="text-center py-4 text-zinc-400 text-sm">
              <div className="inline-block w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mr-2" />
              La IA está eligiendo el outfit...
            </div>
          )}

          {status.type === 'error' && (
            <div className="bg-red-950 border border-red-800 rounded-2xl p-4 text-red-300 text-sm">
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

      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
}
