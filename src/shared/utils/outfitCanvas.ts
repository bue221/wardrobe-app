import type { ClothingItem } from '../../wardrobe/types';
import { sortItemsByCategory } from '../../outfits/utils/sanitizeOutfit';
import { canvasPaint } from '../../theme/theme';
import { dateLocale, t } from '../../i18n/i18n';

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
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
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
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
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

export async function generateOutfitCanvas(
  items: ClothingItem[],
  note?: string
): Promise<Blob> {
  const ordered = sortItemsByCategory(items);
  const COLS = Math.min(ordered.length, 3);
  const ROWS = Math.ceil(ordered.length / COLS);

  const CARD_W = 260;
  const CARD_H = 320;
  const LABEL_H = 44;
  const GAP = 16;
  const PAD = 40;
  const HEADER_H = 72;
  const FOOTER_H = 48;
  const NOTE_LINE = 20;
  const RADIUS = 40;

  // Measure note height after we have a temp context — approximate first
  const noteBlockH = note?.trim() ? NOTE_LINE * 3 + 16 : 0;

  const W = PAD * 2 + COLS * CARD_W + (COLS - 1) * GAP;
  const H =
    PAD +
    HEADER_H +
    ROWS * (CARD_H + LABEL_H) +
    (ROWS - 1) * GAP +
    noteBlockH +
    FOOTER_H;

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
  ctx.fillText(t('outfit.mine'), PAD + 48, PAD + 34);

  const now = new Date().toLocaleDateString(dateLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(now, PAD + 48, PAD + 52);

  // Dotted divider (Caldera: dotted, not dashed)
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

  const images = await Promise.all(ordered.map((item) => loadImage(item.imageBlob)));

  for (let i = 0; i < ordered.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CARD_W + GAP);
    const y = PAD + HEADER_H + row * (CARD_H + LABEL_H + GAP);

    ctx.fillStyle = paint.surface;
    drawRoundedRect(ctx, x, y, CARD_W, CARD_H + LABEL_H, RADIUS);
    ctx.fill();

    ctx.save();
    drawRoundedRectTop(ctx, x, y, CARD_W, CARD_H, RADIUS);
    ctx.clip();

    const img = images[i];
    const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (CARD_W - dw) / 2;
    const dy = y + (CARD_H - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    const name =
      ordered[i].name.length > 20 ? ordered[i].name.slice(0, 18) + '…' : ordered[i].name;
    ctx.fillStyle = paint.ink;
    ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + CARD_W / 2, y + CARD_H + 27);
  }

  let cursorY = PAD + HEADER_H + ROWS * (CARD_H + LABEL_H) + (ROWS - 1) * GAP + 20;

  if (note?.trim()) {
    ctx.fillStyle = paint.ink;
    ctx.font = '500 14px "DM Sans", ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    const lines = wrapText(ctx, note.trim(), W - PAD * 2);
    for (const line of lines) {
      ctx.fillText(line, PAD, cursorY);
      cursorY += NOTE_LINE;
    }
    cursorY += 8;
  }

  ctx.fillStyle = paint.ink;
  ctx.font = '500 12px "DM Sans", ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('outfit.canvasFooter'), W / 2, H - FOOTER_H + 20);

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
