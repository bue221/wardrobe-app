import type { PresetColorKey } from '../types';

const SAMPLE_MAX = 96;
const CENTER_INSET = 0.12;
const BG_DISTANCE = 42;
const BG_SKIP_MAX_RATIO = 0.85;
const MIN_SHARE = 0.1;
const MIN_RELATIVE = 0.35;
const MAX_COLORS = 3;

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function mapRgbToPreset(r: number, g: number, b: number): PresetColorKey {
  const { h, s, l } = rgbToHsl(r, g, b);
  if (l > 0.75 && s < 0.32) return 'blanco';
  if (l < 0.2 && s < 0.28) return 'negro';
  if (s < 0.14) {
    if (l < 0.22) return 'negro';
    if (l > 0.82) return 'blanco';
    return 'gris';
  }
  if (h < 12 || h >= 345) {
    if (l > 0.62 && s < 0.55) return 'rosa';
    return 'rojo';
  }
  if (h < 28) {
    if (l < 0.4) return 'marron';
    return 'naranja';
  }
  if (h < 42) {
    if (l < 0.38) return 'marron';
    if (l > 0.62 && s < 0.45) return 'beige';
    return 'naranja';
  }
  if (h < 55) {
    if (l > 0.65 && s < 0.4) return 'beige';
    if (l < 0.4) return 'marron';
    return 'amarillo';
  }
  if (h < 72) return 'amarillo';
  if (h < 165) return 'verde';
  if (h < 255) return 'azul';
  if (h < 310) return l > 0.45 ? 'rosa' : 'azul';
  return l < 0.35 ? 'rojo' : 'rosa';
}

function rgbDistance(a: [number, number, number], r: number, g: number, b: number): number {
  const dr = a[0] - r;
  const dg = a[1] - g;
  const db = a[2] - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function medianRgb(pixels: Array<[number, number, number]>): [number, number, number] {
  if (pixels.length === 0) return [255, 255, 255];
  const sorted = [...pixels].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  return sorted[Math.floor(sorted.length / 2)];
}

function readRgb(data: Uint8ClampedArray, x: number, y: number, width: number): [number, number, number] | null {
  const i = (y * width + x) * 4;
  if (data[i + 3] < 128) return null;
  return [data[i], data[i + 1], data[i + 2]];
}

function whiteBalance(
  r: number,
  g: number,
  b: number,
  bg: [number, number, number],
): [number, number, number] {
  const mean = (bg[0] + bg[1] + bg[2]) / 3;
  if (mean < 40) return [r, g, b];
  const target = Math.min(240, mean);
  return [
    Math.min(255, r * (target / Math.max(bg[0], 8))),
    Math.min(255, g * (target / Math.max(bg[1], 8))),
    Math.min(255, b * (target / Math.max(bg[2], 8))),
  ];
}

function sampleCorners(data: Uint8ClampedArray, width: number, height: number): [number, number, number] {
  const patch = Math.max(2, Math.round(Math.min(width, height) * 0.08));
  const pixels: Array<[number, number, number]> = [];
  const origins: Array<[number, number]> = [
    [0, 0],
    [width - patch, 0],
    [0, height - patch],
    [width - patch, height - patch],
  ];
  for (const [ox, oy] of origins) {
    for (let y = oy; y < oy + patch; y += 1) {
      for (let x = ox; x < ox + patch; x += 1) {
        const rgb = readRgb(data, x, y, width);
        if (rgb) pixels.push(rgb);
      }
    }
  }
  return medianRgb(pixels);
}

export function colorsFromImageData(imageData: ImageData): PresetColorKey[] {
  const { data, width, height } = imageData;
  const background = sampleCorners(data, width, height);
  const x0 = Math.floor(width * CENTER_INSET);
  const x1 = Math.ceil(width * (1 - CENTER_INSET));
  const y0 = Math.floor(height * CENTER_INSET);
  const y1 = Math.ceil(height * (1 - CENTER_INSET));

  const counts = new Map<PresetColorKey, number>();
  let sampled = 0;
  let skippedBg = 0;

  const visit = (skipBackground: boolean) => {
    counts.clear();
    sampled = 0;
    skippedBg = 0;
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const rgb = readRgb(data, x, y, width);
        if (!rgb) continue;
        sampled += 1;
        if (skipBackground && rgbDistance(background, rgb[0], rgb[1], rgb[2]) < BG_DISTANCE) {
          skippedBg += 1;
          continue;
        }
        const balanced = whiteBalance(rgb[0], rgb[1], rgb[2], background);
        const key = mapRgbToPreset(balanced[0], balanced[1], balanced[2]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  };

  visit(true);
  if (sampled === 0 || skippedBg / sampled > BG_SKIP_MAX_RATIO) {
    visit(false);
  }

  const kept = sampled - skippedBg;
  if (kept <= 0) return [];

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const topCount = ranked[0]?.[1] ?? 0;
  const filtered = ranked
    .filter(([, count]) => count / kept >= MIN_SHARE && count >= topCount * MIN_RELATIVE)
    .slice(0, MAX_COLORS)
    .map(([key]) => key);

  if (filtered.length === 0) {
    return ranked[0] ? [ranked[0][0]] : [];
  }
  return filtered;
}

export async function extractPresetColorsFromFile(file: File): Promise<PresetColorKey[]> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const scale = SAMPLE_MAX / Math.max(bitmap.width, bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * Math.min(1, scale)));
    const height = Math.max(1, Math.round(bitmap.height * Math.min(1, scale)));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2d unavailable');
    ctx.drawImage(bitmap, 0, 0, width, height);
    return colorsFromImageData(ctx.getImageData(0, 0, width, height));
  } finally {
    bitmap?.close();
  }
}
