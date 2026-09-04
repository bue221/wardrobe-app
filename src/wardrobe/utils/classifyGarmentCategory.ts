import type { Category } from '../types';

const MODEL_ID = 'Xenova/clip-vit-base-patch32';

const CATEGORY_LABELS: Record<Category, string> = {
  top: 'a clothing photo of a shirt, t-shirt, blouse, sweater, or tank top',
  bottom: 'a clothing photo of pants, jeans, trousers, shorts, or a skirt',
  shoes: 'a clothing photo of shoes, sneakers, boots, or sandals',
  outer: 'a clothing photo of a jacket, coat, hoodie, blazer, or cardigan',
  accessory: 'a clothing photo of a hat, bag, scarf, belt, or accessory',
};

const LABEL_TO_CATEGORY = new Map(
  (Object.entries(CATEGORY_LABELS) as Array<[Category, string]>).map(([category, label]) => [label, category]),
);

const MIN_SCORE = 0.22;
const MIN_MARGIN = 0.04;

type ZeroShotHit = { label: string; score: number };
type ZeroShotClassifier = (image: Blob, labels: string[]) => Promise<ZeroShotHit[]>;

let classifierPromise: Promise<ZeroShotClassifier> | null = null;

async function loadClassifier(): Promise<ZeroShotClassifier> {
  const { pipeline, env } = await import('@huggingface/transformers');
  env.allowLocalModels = false;
  const pipe = await pipeline('zero-shot-image-classification', MODEL_ID, {
    dtype: 'q8',
    device: 'wasm',
  });
  return (image, labels) => pipe(image, labels) as Promise<ZeroShotHit[]>;
}

function getClassifier(): Promise<ZeroShotClassifier> {
  if (!classifierPromise) {
    classifierPromise = loadClassifier().catch((err: unknown) => {
      classifierPromise = null;
      throw err;
    });
  }
  return classifierPromise;
}

function pickCategory(hits: ZeroShotHit[]): Category | null {
  const ranked = [...hits].sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const second = ranked[1];
  if (!top || top.score < MIN_SCORE) return null;
  if (second && top.score - second.score < MIN_MARGIN) return null;
  return LABEL_TO_CATEGORY.get(top.label) ?? null;
}

export async function classifyGarmentCategory(file: File): Promise<Category | null> {
  try {
    const classifier = await getClassifier();
    const labels = Object.values(CATEGORY_LABELS);
    const hits = await classifier(file, labels);
    return pickCategory(hits);
  } catch (err) {
    console.error('Garment category classifier failed', err);
    return null;
  }
}
