import { t, type MessageKey } from './i18n';
import type { Category } from '../wardrobe/types';

const COLOR_ALIASES: Record<string, MessageKey> = {
  negro: 'color.negro',
  black: 'color.negro',
  blanco: 'color.blanco',
  white: 'color.blanco',
  gris: 'color.gris',
  gray: 'color.gris',
  grey: 'color.gris',
  azul: 'color.azul',
  blue: 'color.azul',
  rojo: 'color.rojo',
  red: 'color.rojo',
  verde: 'color.verde',
  green: 'color.verde',
  amarillo: 'color.amarillo',
  yellow: 'color.amarillo',
  rosa: 'color.rosa',
  pink: 'color.rosa',
  marron: 'color.marron',
  marrón: 'color.marron',
  brown: 'color.marron',
  beige: 'color.beige',
  naranja: 'color.naranja',
  orange: 'color.naranja',
};

const CATEGORY_KEYS: Record<Category, MessageKey> = {
  top: 'category.top',
  bottom: 'category.bottom',
  shoes: 'category.shoes',
  outer: 'category.outer',
  accessory: 'category.accessory',
};

export function categoryLabel(category: Category): string {
  return t(CATEGORY_KEYS[category]);
}

export function colorLabel(raw: string): string {
  const key = COLOR_ALIASES[raw.trim().toLowerCase()];
  return key ? t(key) : raw;
}

export function seedLabel(id: string): string {
  const key = `seed.${id}` as MessageKey;
  return t(key);
}
