import type { ClothingItem } from '../../wardrobe/types';
import { lookboardRows } from '../../outfits/utils/sanitizeOutfit';
import { canvasPaint } from '../../theme/theme';
import { dateLocale, t } from '../../i18n/i18n';

const W = 1080;
const H = 1620;
const PAD = 48;
const GAP = 16;
const HEADER_H = 80;
const FOOTER_H = 52;
const LABEL_H = 44;
const RADIUS = 40;
const NOTE_LINE = 20;

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function drawRoundedRectTop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let clipped = text;
  while (clipped.length > 0 && ctx.measureText(`${clipped}…`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return clipped.length > 0 ? `${clipped}…` : '…';
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function rowWeight(row: ClothingItem[]): number {
  if (row.length === 2) return 0.9;
  const cat = row[0]?.category;
  if (cat === 'top') return 1.2;
  if (cat === 'bottom') return 1.05;
  return 0.85;
}

export async function generateOutfitCanvas(
  items: ClothingItem[],
  note?: string
): Promise<Blob> {
  const rows = lookboardRows(items);
  const uniqueItems = rows.flat();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const paint = canvasPaint();
  ctx.fillStyle = paint.canvas;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = paint.ember;
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + 36);
  ctx.lineTo(PAD + 18, PAD + 8);
  ctx.lineTo(PAD + 36, PAD + 36);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = paint.ink;
  ctx.font = '400 32px "Bebas Neue", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(t('outfit.mine'), PAD + 48, PAD + 34);

  const now = new Date().toLocaleDateString(dateLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(now, PAD + 48, PAD + 52);

  ctx.strokeStyle = paint.ink;
  ctx.setLineDash([1.5, 4]);
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + HEADER_H - 8);
  ctx.lineTo(W - PAD, PAD + HEADER_H - 8);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineCap = 'butt';

  const hasNote = Boolean(note?.trim());
  const noteBlockH = hasNote ? NOTE_LINE * 3 + 16 : 0;
  const contentTop = PAD + HEADER_H;
  const contentBottom = H - PAD - FOOTER_H - noteBlockH;
  const rowGapTotal = rows.length > 0 ? GAP * (rows.length - 1) : 0;
  const available = Math.max(contentBottom - contentTop - rowGapTotal, LABEL_H * Math.max(rows.length, 1));
  const weightSum = rows.reduce((sum, row) => sum + rowWeight(row), 0) || 1;

  const images = await Promise.all(uniqueItems.map((item) => loadImage(item.imageBlob)));
  const imageById = new Map(uniqueItems.map((item, i) => [item.id, images[i]]));

  let cursorY = contentTop;
  const contentW = W - PAD * 2;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowH = available * (rowWeight(row) / weightSum);
    const photoH = Math.max(rowH - LABEL_H, 80);
    const cellW = row.length === 2 ? (contentW - GAP) / 2 : contentW;

    for (let i = 0; i < row.length; i++) {
      const item = row[i];
      const img = imageById.get(item.id);
      if (!img) continue;
      const x = PAD + i * (cellW + GAP);
      const y = cursorY;

      ctx.fillStyle = paint.surface;
      drawRoundedRect(ctx, x, y, cellW, rowH, RADIUS);
      ctx.fill();

      ctx.save();
      drawRoundedRectTop(ctx, x, y, cellW, photoH, RADIUS);
      ctx.clip();
      drawCoverImage(ctx, img, x, y, cellW, photoH);
      ctx.restore();

      ctx.fillStyle = paint.ink;
      ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = ellipsize(ctx, item.name, cellW - 24);
      ctx.fillText(label, x + cellW / 2, y + photoH + LABEL_H / 2);
    }

    cursorY += rowH;
    if (r < rows.length - 1) cursorY += GAP;
  }

  if (hasNote) {
    ctx.fillStyle = paint.ink;
    ctx.font = '500 14px "DM Sans", ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapText(ctx, note!.trim(), contentW);
    let noteY = H - PAD - FOOTER_H - noteBlockH + 20;
    for (const line of lines) {
      ctx.fillText(line, PAD, noteY);
      noteY += NOTE_LINE;
    }
  }

  ctx.fillStyle = paint.ink;
  ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(t('outfit.canvasFooter'), W / 2, H - 32);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      'image/png'
    );
  });
}

export async function shareOrDownloadOutfit(blob: Blob) {
  const file = new File([blob], 'outfit.png', { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: t('outfit.shareTitle') });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'outfit.png';
  a.click();
  URL.revokeObjectURL(url);
}
