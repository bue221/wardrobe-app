export type Category = 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';

export const CATEGORIES: Category[] = ['top', 'bottom', 'shoes', 'outer', 'accessory'];

export const PRESET_COLOR_KEYS = [
  'negro',
  'blanco',
  'gris',
  'azul',
  'rojo',
  'verde',
  'amarillo',
  'rosa',
  'marron',
  'beige',
  'naranja',
] as const;

export type PresetColorKey = (typeof PRESET_COLOR_KEYS)[number];

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  colors: string[];
  imageBlob: Blob;
  createdAt: number;
}
