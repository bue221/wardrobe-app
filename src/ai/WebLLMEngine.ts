const CDN = 'https://esm.sh/@mlc-ai/web-llm@0.2.84';
const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MLCEngine = any;
type InitProgressReport = { progress?: number; text?: string };

let engine: MLCEngine | null = null;
let loadingPromise: Promise<MLCEngine> | null = null;

export async function getEngine(
  onProgress: (report: InitProgressReport) => void
): Promise<MLCEngine> {
  if (engine) return engine;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { CreateMLCEngine } = await import(/* @vite-ignore */ CDN);
    const e = await CreateMLCEngine(MODEL_ID, { initProgressCallback: onProgress });
    engine = e;
    loadingPromise = null;
    return e;
  })();

  return loadingPromise;
}

export function resetEngine() {
  engine = null;
  loadingPromise = null;
}
