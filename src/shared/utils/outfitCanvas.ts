import type { ClothingItem } from '../../wardrobe/types';

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawRoundedRectTop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

export async function generateOutfitCanvas(items: ClothingItem[]): Promise<Blob> {
  const COLS = Math.min(items.length, 3);
  const ROWS = Math.ceil(items.length / COLS);

  const CARD_W = 260;
  const CARD_H = 320;
  const LABEL_H = 44;
  const GAP = 14;
  const PAD = 28;
  const HEADER_H = 72;
  const FOOTER_H = 48;

  const W = PAD * 2 + COLS * CARD_W + (COLS - 1) * GAP;
  const H = PAD + HEADER_H + ROWS * (CARD_H + LABEL_H) + (ROWS - 1) * GAP + FOOTER_H;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1c1917'); // warm dark
  bg.addColorStop(1, '#09090b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Header title
  ctx.fillStyle = '#a78bfa'; // violet-400
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('👗', PAD, PAD + 32);

  ctx.fillStyle = '#f4f4f5';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('Mi Outfit', PAD + 36, PAD + 32);

  const now = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#71717a'; // zinc-500
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(now, PAD + 36, PAD + 52);

  // Separator line
  const lineGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  lineGrad.addColorStop(0, '#7c3aed');
  lineGrad.addColorStop(1, '#a855f7');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + HEADER_H - 8);
  ctx.lineTo(W - PAD, PAD + HEADER_H - 8);
  ctx.stroke();

  // Load images in parallel
  const images = await Promise.all(items.map((item) => loadImage(item.imageBlob)));

  // Draw cards
  for (let i = 0; i < items.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CARD_W + GAP);
    const y = PAD + HEADER_H + row * (CARD_H + LABEL_H + GAP);

    // Card shadow (approximate with a slightly bigger dark rect)
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    drawRoundedRect(ctx, x + 3, y + 3, CARD_W, CARD_H + LABEL_H, 16);
    ctx.fill();

    // Card background
    ctx.fillStyle = '#27272a'; // zinc-800
    drawRoundedRect(ctx, x, y, CARD_W, CARD_H + LABEL_H, 16);
    ctx.fill();

    // Image clipped to top rounded area
    ctx.save();
    drawRoundedRectTop(ctx, x, y, CARD_W, CARD_H, 16);
    ctx.clip();

    const img = images[i];
    const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (CARD_W - dw) / 2;
    const dy = y + (CARD_H - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // Label area
    const name = items[i].name.length > 20 ? items[i].name.slice(0, 18) + '…' : items[i].name;
    ctx.fillStyle = '#e4e4e7'; // zinc-200
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + CARD_W / 2, y + CARD_H + 27);
  }

  // Footer
  const footerY = H - FOOTER_H + 20;
  ctx.fillStyle = '#52525b'; // zinc-600
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Wardrobe App · Tu armario inteligente', W / 2, footerY);

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
    await navigator.share({ files: [file], title: 'Mi outfit de hoy 👗' });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'outfit.png';
  a.click();
  URL.revokeObjectURL(url);
}
