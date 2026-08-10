export type Category = 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'top', label: 'Tops', emoji: '👕' },
  { value: 'bottom', label: 'Bottoms', emoji: '👖' },
  { value: 'shoes', label: 'Zapatos', emoji: '👟' },
  { value: 'outer', label: 'Abrigos', emoji: '🧥' },
  { value: 'accessory', label: 'Accesorios', emoji: '👜' },
];

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  colors: string[];
  imageBlob: Blob;
  createdAt: number;
}
