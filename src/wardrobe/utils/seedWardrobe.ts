import type { Category } from '../types';

interface SeedDef {
  name: string;
  category: Category;
  colors: string[];
  bgColor: string;
  fgColor: string;
  emoji: string;
}

const SEED_DATA: SeedDef[] = [
  { name: 'Remera blanca básica', category: 'top',       colors: ['Blanco'], bgColor: '#E8E4D8', fgColor: '#444', emoji: '👕' },
  { name: 'Remera negra lisa',    category: 'top',       colors: ['Negro'],  bgColor: '#1E1E1E', fgColor: '#ccc', emoji: '👕' },
  { name: 'Jeans azul clásico',   category: 'bottom',    colors: ['Azul'],   bgColor: '#3A5280', fgColor: '#ddd', emoji: '👖' },
  { name: 'Pantalón gris',        category: 'bottom',    colors: ['Gris'],   bgColor: '#5A5A5A', fgColor: '#eee', emoji: '👖' },
  { name: 'Zapatillas blancas',   category: 'shoes',     colors: ['Blanco'], bgColor: '#EDEDEA', fgColor: '#555', emoji: '👟' },
  { name: 'Campera beige',        category: 'jacket',    colors: ['Beige'],  bgColor: '#BEA07A', fgColor: '#333', emoji: '🧥' },
  { name: 'Vestido verde',        category: 'dress',     colors: ['Verde'],  bgColor: '#2B5130', fgColor: '#ddd', emoji: '👗' },
  { name: 'Bufanda roja',         category: 'accessory', colors: ['Rojo'],   bgColor: '#7A1F1F', fgColor: '#eee', emoji: '🧣' },
];

function drawCanvas(def: SeedDef): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = 300, H = 400;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = def.bgColor;
    ctx.fillRect(0, 0, W, H);

    // Subtle diagonal texture
    ctx.save();
    ctx.strokeStyle = def.fgColor + '14';
    ctx.lineWidth = 1;
    for (let x = -H; x < W + H; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + H, H);
      ctx.stroke();
    }
    ctx.restore();

    // Emoji
    ctx.font = '96px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(def.emoji, W / 2, H * 0.42);

    // Bottom gradient for name readability
    const grad = ctx.createLinearGradient(0, H * 0.65, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.65, W, H * 0.35);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(def.name, W / 2, H - 14);

    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/jpeg',
      0.88,
    );
  });
}

type AddItemFn = (file: File, name: string, category: Category, colors: string[]) => Promise<unknown>;

export async function seedWardrobe(addItem: AddItemFn): Promise<void> {
  for (const def of SEED_DATA) {
    const blob = await drawCanvas(def);
    const file = new File([blob], `${def.name}.jpg`, { type: 'image/jpeg' });
    await addItem(file, def.name, def.category, def.colors);
  }
}
