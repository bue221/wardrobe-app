import { useState, useCallback } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../types';
import { getEngine } from '../../ai/WebLLMEngine';
import { buildOutfitPrompt, parseOutfitResponse } from '../../ai/outfitPrompt';
import { saveOutfit, getAllOutfits, deleteOutfit } from '../../shared/db/wardrobeDB';

type InitProgressReport = { progress?: number; text?: string };

export type GeneratorStatus =
  | { type: 'idle' }
  | { type: 'loading-model'; progress: number; text: string }
  | { type: 'generating' }
  | { type: 'done'; ids: string[]; note: string }
  | { type: 'error'; message: string };

function randomOutfit(items: ClothingItem[]): string[] {
  const pick = (cat: ClothingItem['category']) => {
    const pool = items.filter((i) => i.category === cat);
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  };
  return [pick('top'), pick('bottom'), pick('shoes'), pick('outer'), pick('accessory')]
    .filter(Boolean)
    .map((i) => i!.id);
}

export function useOutfitGenerator() {
  const [status, setStatus] = useState<GeneratorStatus>({ type: 'idle' });
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  const loadSavedOutfits = useCallback(async () => {
    const all = await getAllOutfits();
    setSavedOutfits(all);
  }, []);

  const generateRandom = useCallback((items: ClothingItem[]) => {
    const ids = randomOutfit(items);
    if (ids.length < 2) {
      setStatus({ type: 'error', message: 'Agregá al menos un top, un bottom y unos zapatos.' });
      return;
    }
    setStatus({ type: 'done', ids, note: 'Outfit aleatorio generado.' });
  }, []);

  const generateAI = useCallback(async (items: ClothingItem[]) => {
    if (items.length < 3) {
      setStatus({ type: 'error', message: 'Necesitás al menos 3 prendas para usar la IA.' });
      return;
    }

    const onProgress = (report: InitProgressReport) => {
      const progress = Math.round((report.progress ?? 0) * 100);
      setStatus({ type: 'loading-model', progress, text: report.text ?? 'Cargando modelo...' });
    };

    try {
      setStatus({ type: 'loading-model', progress: 0, text: 'Iniciando modelo...' });
      const engine = await getEngine(onProgress);
      setStatus({ type: 'generating' });

      const prompt = buildOutfitPrompt(items);
      const response = await engine.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 256,
      });

      const raw = response.choices[0]?.message?.content ?? '';
      const selection = parseOutfitResponse(raw);

      if (!selection) {
        const fallbackIds = randomOutfit(items);
        setStatus({ type: 'done', ids: fallbackIds, note: 'La IA no pudo responder correctamente. Acá va un outfit random.' });
        return;
      }

      const ids = [selection.top, selection.bottom, selection.shoes, selection.outer, selection.accessory]
        .filter((id): id is string => !!id && items.some((i) => i.id === id));

      setStatus({ type: 'done', ids, note: selection.note });
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message ?? 'Error al cargar la IA.' });
    }
  }, []);

  const saveCurrentOutfit = useCallback(async (ids: string[], note?: string) => {
    const outfit: SavedOutfit = {
      id: crypto.randomUUID(),
      clothingIds: ids,
      aiNote: note,
      createdAt: Date.now(),
    };
    await saveOutfit(outfit);
    setSavedOutfits((prev) => [outfit, ...prev]);
  }, []);

  const removeSavedOutfit = useCallback(async (id: string) => {
    await deleteOutfit(id);
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const reset = useCallback(() => setStatus({ type: 'idle' }), []);

  return {
    status,
    savedOutfits,
    generateRandom,
    generateAI,
    saveCurrentOutfit,
    loadSavedOutfits,
    removeSavedOutfit,
    reset,
  };
}
