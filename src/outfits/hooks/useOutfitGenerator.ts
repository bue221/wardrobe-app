import { useState, useCallback } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../types';
import { getEngine, resetEngine, toAiErrorKey } from '../../ai/WebLLMEngine';
import { buildOutfitPrompt, buildRetryPrompt, parseOutfitResponse } from '../../ai/outfitPrompt';
import { saveOutfit, getAllOutfits, deleteOutfit } from '../../shared/db/wardrobeDB';
import { t } from '../../i18n/i18n';
import {
  groundOutfitNote,
  wardrobeHasCorePieces,
  randomOutfit,
  sanitizeOutfitSelection,
} from '../utils/sanitizeOutfit';

type InitProgressReport = { progress?: number; text?: string };

export type OutfitSource = 'ai' | 'random';

export type GeneratorStatus =
  | { type: 'idle' }
  | { type: 'loading-model'; progress: number; text: string }
  | { type: 'generating' }
  | { type: 'done'; ids: string[]; note: string; source: OutfitSource }
  | { type: 'error'; message: string };

export function useOutfitGenerator() {
  const [status, setStatus] = useState<GeneratorStatus>({ type: 'idle' });
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  const loadSavedOutfits = useCallback(async () => {
    const all = await getAllOutfits();
    setSavedOutfits(all);
  }, []);

  const generateRandom = useCallback((items: ClothingItem[]) => {
    if (!wardrobeHasCorePieces(items)) {
      setStatus({
        type: 'error',
        message: t('outfit.needCore'),
      });
      return;
    }
    const picked = randomOutfit(items);
    setStatus({
      type: 'done',
      ids: picked.map((i) => i.id),
      note: t('outfit.randomNote'),
      source: 'random',
    });
  }, []);

  const generateAI = useCallback(async (items: ClothingItem[]) => {
    if (!wardrobeHasCorePieces(items)) {
      setStatus({
        type: 'error',
        message: t('outfit.needCoreAi'),
      });
      return;
    }

    const onProgress = (report: InitProgressReport) => {
      const progress = Math.round((report.progress ?? 0) * 100);
      setStatus({ type: 'loading-model', progress, text: report.text ?? t('outfit.progressLoad') });
    };

    const applyRandomFallback = (note: string) => {
      const picked = randomOutfit(items);
      setStatus({
        type: 'done',
        ids: picked.map((i) => i.id),
        note,
        source: 'random',
      });
    };

    try {
      setStatus({ type: 'loading-model', progress: 0, text: t('outfit.progressInit') });
      const engine = await getEngine(onProgress);
      setStatus({ type: 'generating' });

      const prompt = buildOutfitPrompt(items);
      const response = await engine.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 320,
      });

      let raw = response.choices[0]?.message?.content ?? '';
      let selection = parseOutfitResponse(raw);

      if (!selection) {
        const retry = await engine.chat.completions.create({
          messages: [
            { role: 'user', content: prompt },
            { role: 'assistant', content: raw || '{}' },
            { role: 'user', content: buildRetryPrompt() },
          ],
          temperature: 0.1,
          max_tokens: 320,
        });
        raw = retry.choices[0]?.message?.content ?? '';
        selection = parseOutfitResponse(raw);
      }

      if (!selection) {
        applyRandomFallback(t('outfit.aiFallback'));
        return;
      }

      const sanitized = sanitizeOutfitSelection(selection, items);
      if (!sanitized.valid) {
        applyRandomFallback(t('outfit.aiFallback'));
        return;
      }

      const note = groundOutfitNote(selection.note, sanitized.items);
      setStatus({
        type: 'done',
        ids: sanitized.ids,
        note,
        source: 'ai',
      });
    } catch (err) {
      resetEngine();
      setStatus({ type: 'error', message: t(toAiErrorKey(err)) });
    }
  }, []);

  const saveCurrentOutfit = useCallback(async (ids: string[], note?: string, source?: OutfitSource) => {
    const outfit: SavedOutfit = {
      id: crypto.randomUUID(),
      clothingIds: ids,
      // Only persist AI notes so history Tag IA stays accurate
      aiNote: source === 'ai' ? note : undefined,
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
