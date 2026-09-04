import { t, getLocale, type MessageKey } from '../../i18n/i18n';
import { colorLabel } from '../../i18n/labels';
import type { Category } from '../types';

const PIECE_KEYS: Record<Category, MessageKey> = {
  top: 'upload.piece.top',
  bottom: 'upload.piece.bottom',
  shoes: 'upload.piece.shoes',
  outer: 'upload.piece.outer',
  accessory: 'upload.piece.accessory',
};

type Gender = 'm' | 'f' | 'mp';

const PIECE_GENDER: Record<Category, Gender> = {
  top: 'f',
  bottom: 'm',
  shoes: 'mp',
  outer: 'f',
  accessory: 'm',
};

const ES_COLOR_FORMS: Record<string, Record<Gender, string>> = {
  negro: { m: 'negro', f: 'negra', mp: 'negros' },
  blanco: { m: 'blanco', f: 'blanca', mp: 'blancos' },
  gris: { m: 'gris', f: 'gris', mp: 'grises' },
  azul: { m: 'azul', f: 'azul', mp: 'azules' },
  rojo: { m: 'rojo', f: 'roja', mp: 'rojos' },
  verde: { m: 'verde', f: 'verde', mp: 'verdes' },
  amarillo: { m: 'amarillo', f: 'amarilla', mp: 'amarillos' },
  rosa: { m: 'rosa', f: 'rosa', mp: 'rosa' },
  marron: { m: 'marrón', f: 'marrón', mp: 'marrones' },
  beige: { m: 'beige', f: 'beige', mp: 'beige' },
  naranja: { m: 'naranja', f: 'naranja', mp: 'naranja' },
};

function colorForName(raw: string, category: Category): string {
  if (getLocale() === 'en') return colorLabel(raw);
  const forms = ES_COLOR_FORMS[raw.trim().toLowerCase()];
  if (forms) return forms[PIECE_GENDER[category]];
  return colorLabel(raw).toLowerCase();
}

export function suggestGarmentName(category: Category, colors: string[]): string {
  const piece = t(PIECE_KEYS[category]);
  const raw = colors[0];
  if (!raw) return piece;
  return t('upload.autoName', { piece, color: colorForName(raw, category) });
}
