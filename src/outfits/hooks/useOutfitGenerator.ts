import { useState, useCallback } from 'react';
import type { ClothingItem } from '../../wardrobe/types';
import type { SavedOutfit } from '../types';
import { getEngine, resetEngine, toAiErrorKey } from '../../ai/WebLLMEngine';
import {
  buildOutfitJsonSchema,
  buildOutfitPrompt,
  buildRetryPrompt,
  indexWardrobe,
  parseOutfitResponse,
  resolveOutfitSelection,
} from '../../ai/outfitPrompt';
import { saveOutfit, getAllOutfits, deleteOutfit } from '../../shared/db/wardrobeDB';
import { t } from '../../i18n/i18n';
import {
  groundOutfitNote,
  wardrobeHasCorePieces,
  randomOutfit,
  completeOutfitSelection,
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

      const index = indexWardrobe(items);
      const prompt = buildOutfitPrompt(index);
      const schema = buildOutfitJsonSchema(index);
      engine.resetChat();

      const messages = [{ role: 'user' as const, content: prompt }];
      const baseRequest = {
        messages,
        temperature: 0.2,
        max_tokens: 220,
      };

      let usedSchema = true;
      let response;
      try {
        response = await engine.chat.completions.create({
          ...baseRequest,
          response_format: { type: 'json_object', schema },
        });
      } catch (schemaErr) {
        console.error('WebLLM JSON schema unavailable, retrying unconstrained', schemaErr);
        usedSchema = false;
        engine.resetChat();
        response = await engine.chat.completions.create(baseRequest);
      }

      let raw = response.choices[0]?.message?.content ?? '';
      let selection = parseOutfitResponse(raw);

      if (!selection) {
        try {
          const retry = await engine.chat.completions.create({
            messages: [
              ...messages,
              { role: 'assistant', content: raw || '{}' },
              { role: 'user', content: buildRetryPrompt() },
            ],
            temperature: 0.1,
            max_tokens: 220,
            ...(usedSchema ? { response_format: { type: 'json_object' as const, schema } } : {}),
          });
          raw = retry.choices[0]?.message?.content ?? '';
          selection = parseOutfitResponse(raw);
        } catch (retryErr) {
          console.error('WebLLM outfit retry failed', retryErr);
        }
      }

      if (!selection) {
        applyRandomFallback(t('outfit.aiFallback'));
        return;
      }

      const resolved = resolveOutfitSelection(selection, index);
      const sanitized = completeOutfitSelection(resolved, items);
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
