import type { Category } from '../types';
import { seedLabel } from '../../i18n/labels';

export interface SeedGarment {
  id: string;
  category: Category;
  colors: string[];
  src: string;
}

export const SEED_GARMENTS: SeedGarment[] = [
  { id: 'remera-blanca', category: 'top', colors: ['blanco'], src: '/seed/remera-blanca.jpg' },
  { id: 'remera-ember', category: 'top', colors: ['naranja'], src: '/seed/remera-ember.jpg' },
  { id: 'jeans-azul', category: 'bottom', colors: ['azul'], src: '/seed/jeans-azul.jpg' },
  { id: 'pantalon-negro', category: 'bottom', colors: ['negro'], src: '/seed/pantalon-negro.jpg' },
  { id: 'zapatillas-blancas', category: 'shoes', colors: ['blanco'], src: '/seed/zapatillas-blancas.jpg' },
  { id: 'campera-beige', category: 'outer', colors: ['beige'], src: '/seed/campera-beige.jpg' },
  { id: 'tapado-negro', category: 'outer', colors: ['negro'], src: '/seed/tapado-negro.jpg' },
  { id: 'panuelo-sulfur', category: 'accessory', colors: ['amarillo'], src: '/seed/panuelo-sulfur.jpg' },
];

function seedName(id: string): string {
  return seedLabel(id);
}

async function fetchSeedFile(src: string, name: string): Promise<File> {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`No se pudo cargar la foto de ${name}`);
  }
  const blob = await res.blob();
  return new File([blob], `${name}.jpg`, { type: blob.type || 'image/jpeg' });
}

type AddItemFn = (file: File, name: string, category: Category, colors: string[]) => Promise<unknown>;

export async function seedWardrobe(
  addItem: AddItemFn,
  existingNames: string[] = [],
): Promise<{ added: number; skipped: number }> {
  const have = new Set(existingNames.map((n) => n.toLowerCase()));
  let added = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const def of SEED_GARMENTS) {
    const name = seedName(def.id);
    if (have.has(name.toLowerCase())) {
      skipped += 1;
      continue;
    }
    try {
      const file = await fetchSeedFile(def.src, name);
      await addItem(file, name, def.category, def.colors);
      added += 1;
    } catch (error) {
      console.error('Failed to seed garment', def.id, error);
      failures.push(name);
    }
  }

  if (added === 0 && failures.length > 0) {
    throw new Error('No se pudieron cargar las fotos de ejemplo');
  }

  return { added, skipped };
}
