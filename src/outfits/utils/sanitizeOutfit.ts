import type { Category, ClothingItem } from '../../wardrobe/types';
import type { OutfitSelection } from '../../ai/outfitPrompt';

export const OUTFIT_SLOT_ORDER: Category[] = ['top', 'bottom', 'shoes', 'outer', 'accessory'];

const REQUIRED_SLOTS: Category[] = ['top', 'bottom', 'shoes'];

export function sortItemsByCategory(items: ClothingItem[]): ClothingItem[] {
  return [...items].sort(
    (a, b) => OUTFIT_SLOT_ORDER.indexOf(a.category) - OUTFIT_SLOT_ORDER.indexOf(b.category)
  );
}

/** Wear-order slots for the editorial lookboard (outer over top, then bottom, then shoes + accessory). */
export type LookboardSlots = Partial<Record<Category, ClothingItem>>;

export function groupLookboardSlots(items: ClothingItem[]): LookboardSlots {
  const slots: LookboardSlots = {};
  for (const item of items) {
    if (!slots[item.category]) slots[item.category] = item;
  }
  return slots;
}

export type LookboardRow = ClothingItem[];

export function lookboardRows(items: ClothingItem[]): LookboardRow[] {
  const { outer, top, bottom, shoes, accessory } = groupLookboardSlots(items);
  const rows: LookboardRow[] = [];
  if (outer) rows.push([outer]);
  if (top) rows.push([top]);
  if (bottom) rows.push([bottom]);
  if (shoes && accessory) rows.push([shoes, accessory]);
  else if (shoes) rows.push([shoes]);
  else if (accessory) rows.push([accessory]);
  return rows;
}

export function wardrobeHasCorePieces(items: ClothingItem[]): boolean {
  return REQUIRED_SLOTS.every((cat) => items.some((i) => i.category === cat));
}

export function randomOutfit(items: ClothingItem[]): ClothingItem[] {
  const picked: ClothingItem[] = [];
  const used = new Set<string>();

  for (const cat of OUTFIT_SLOT_ORDER) {
    const pool = items.filter((i) => i.category === cat && !used.has(i.id));
    if (pool.length === 0) continue;
    const item = pool[Math.floor(Math.random() * pool.length)];
    used.add(item.id);
    picked.push(item);
  }

  return picked;
}

export interface SanitizedOutfit {
  ids: string[];
  items: ClothingItem[];
  valid: boolean;
}

/**
 * Resolve AI slot IDs to one item per matching category, no duplicates.
 * Requires top + bottom + shoes when those categories exist in the wardrobe.
 */
export function sanitizeOutfitSelection(
  selection: Pick<OutfitSelection, Category>,
  items: ClothingItem[]
): SanitizedOutfit {
  const byId = new Map(items.map((i) => [i.id, i]));
  const used = new Set<string>();
  const resolved: ClothingItem[] = [];

  for (const cat of OUTFIT_SLOT_ORDER) {
    const id = selection[cat];
    if (!id || typeof id !== 'string') continue;
    const item = byId.get(id);
    if (!item || item.category !== cat || used.has(item.id)) continue;
    used.add(item.id);
    resolved.push(item);
  }

  const valid = REQUIRED_SLOTS.every((cat) => resolved.some((i) => i.category === cat));

  return {
    ids: resolved.map((i) => i.id),
    items: resolved,
    valid,
  };
}

/** Keep AI picks and fill any missing required slot from the wardrobe. */
export function completeOutfitSelection(
  selection: Pick<OutfitSelection, Category>,
  items: ClothingItem[],
): SanitizedOutfit {
  const first = sanitizeOutfitSelection(selection, items);
  if (first.valid) return first;
  if (first.items.length === 0) return first;

  const used = new Set(first.ids);
  const filled = [...first.items];

  for (const cat of REQUIRED_SLOTS) {
    if (filled.some((item) => item.category === cat)) continue;
    const pool = items.filter((item) => item.category === cat && !used.has(item.id));
    if (pool.length === 0) continue;
    const item = pool[Math.floor(Math.random() * pool.length)];
    used.add(item.id);
    filled.push(item);
  }

  const ordered = OUTFIT_SLOT_ORDER
    .map((cat) => filled.find((item) => item.category === cat))
    .filter((item): item is ClothingItem => Boolean(item));

  return {
    ids: ordered.map((item) => item.id),
    items: ordered,
    valid: REQUIRED_SLOTS.every((cat) => ordered.some((item) => item.category === cat)),
  };
}

const ENGLISH_HINT =
  /\b(the|and|are|is|with|for|you|your|only|required|items|complementing|colors?|outfit|curated|looks?|because|perfect|pair)\b/i;

export function buildGroundedNote(items: ClothingItem[]): string {
  const names = items.map((i) => i.name);
  const colors = [...new Set(items.flatMap((i) => i.colors))];
  const nameList =
    names.length <= 1
      ? names[0] ?? 'tus prendas'
      : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
  const colorHint =
    colors.length > 0
      ? ` combinan ${colors.length === 1 ? `el tono ${colors[0]}` : `los tonos ${colors.join(', ')}`}`
      : '';
  return `Elegí ${nameList}${colorHint}.`;
}

/** Keep model note only if Spanish-ish and mentions at least one selected garment. */
export function groundOutfitNote(note: string | undefined, items: ClothingItem[]): string {
  const trimmed = note?.trim() ?? '';
  if (!trimmed) return buildGroundedNote(items);

  const mentionsItem = items.some((item) =>
    trimmed.toLowerCase().includes(item.name.toLowerCase())
  );
  if (!mentionsItem) return buildGroundedNote(items);
  if (ENGLISH_HINT.test(trimmed)) return buildGroundedNote(items);

  return trimmed;
}
