import type { InitProgressCallback, MLCEngineInterface } from '@mlc-ai/web-llm';
import type { MessageKey } from '../i18n/messages';

const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

let engine: MLCEngineInterface | null = null;
let loadingPromise: Promise<MLCEngineInterface> | null = null;

export function toAiErrorKey(err: unknown): MessageKey {
  const raw = err instanceof Error ? err.message : String(err);
  console.error('WebLLM failed', err);

  if (/createRequire|not defined|module is not defined/i.test(raw)) {
    return 'ai.error.init';
  }
  if (/webgpu|gpu|adapter/i.test(raw)) {
    return 'ai.error.webgpu';
  }
  if (/fetch|network|failed to load|Load model/i.test(raw)) {
    return 'ai.error.network';
  }
  return 'ai.error.generic';
}

async function loadWebLLMRuntime() {
  const mod = await import('@mlc-ai/web-llm');
  if (typeof mod.CreateMLCEngine !== 'function') {
    throw new Error('WebLLM runtime is incomplete');
  }
  return mod;
}

export async function getEngine(onProgress: InitProgressCallback): Promise<MLCEngineInterface> {
  if (engine) return engine;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const { CreateMLCEngine } = await loadWebLLMRuntime();
      const next = await CreateMLCEngine(MODEL_ID, { initProgressCallback: onProgress });
      engine = next;
      return next;
    } catch (err) {
      engine = null;
      throw err;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

export function resetEngine() {
  engine = null;
  loadingPromise = null;
}
