import type { Category, ClothingItem } from '../wardrobe/types';
import { CATEGORIES } from '../wardrobe/types';
import { t } from '../i18n/i18n';
import { colorLabel } from '../i18n/labels';

export interface OutfitSelection {
  top?: string;
  bottom?: string;
  shoes?: string;
  outer?: string;
  accessory?: string;
  note: string;
}

const SHORT_PREFIX: Record<Category, string> = {
  top: 't',
  bottom: 'b',
  shoes: 's',
  outer: 'o',
  accessory: 'a',
};

const EMPTY_TOKENS = new Set(['', 'null', 'undefined', 'none', 'nil', '-']);

export interface WardrobeIndex {
  items: ClothingItem[];
  listText: string;
  realByShort: Map<string, ClothingItem>;
  byId: Map<string, ClothingItem>;
  byName: Map<string, ClothingItem>;
}

export function indexWardrobe(items: ClothingItem[]): WardrobeIndex {
  const seq: Record<Category, number> = {
    top: 0,
    bottom: 0,
    shoes: 0,
    outer: 0,
    accessory: 0,
  };
  const realByShort = new Map<string, ClothingItem>();
  const byId = new Map<string, ClothingItem>();
  const byName = new Map<string, ClothingItem>();
  const lines: string[] = [];

  for (const item of items) {
    seq[item.category] += 1;
    const short = `${SHORT_PREFIX[item.category]}${seq[item.category]}`;
    realByShort.set(short, item);
    byId.set(item.id, item);
    byName.set(item.name.trim().toLowerCase(), item);
    const colors = item.colors.map(colorLabel).join(',') || '-';
    lines.push(`- ${short} | ${item.name} | ${item.category} | ${colors}`);
  }

  return {
    items,
    listText: lines.join('\n'),
    realByShort,
    byId,
    byName,
  };
}

export function buildOutfitPrompt(index: WardrobeIndex): string {
  return t('ai.prompt', { list: index.listText });
}

export function buildRetryPrompt(): string {
  return t('ai.retry');
}

export function buildOutfitJsonSchema(index: WardrobeIndex): string {
  const enumsFor = (category: Category, optional: boolean) => {
    const ids = [...index.realByShort.entries()]
      .filter(([, item]) => item.category === category)
      .map(([short]) => short);
    if (optional) return [...ids, 'none'];
    return ids.length > 0 ? ids : ['none'];
  };

  const schema = {
    type: 'object',
    properties: {
      top: { type: 'string', enum: enumsFor('top', false) },
      bottom: { type: 'string', enum: enumsFor('bottom', false) },
      shoes: { type: 'string', enum: enumsFor('shoes', false) },
      outer: { type: 'string', enum: enumsFor('outer', true) },
      accessory: { type: 'string', enum: enumsFor('accessory', true) },
      note: { type: 'string' },
    },
    required: ['top', 'bottom', 'shoes', 'note'],
  };

  return JSON.stringify(schema);
}

function coerceId(value: unknown): string | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed || EMPTY_TOKENS.has(trimmed.toLowerCase())) return undefined;
  return trimmed;
}

function stripCodeFences(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

function extractBalancedObject(raw: string): string | null {
  const start = raw.indexOf('{');
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < raw.length; i += 1) {
    const ch = raw[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return raw.slice(start, i + 1);
    }
  }
  return null;
}

function repairJson(raw: string): string {
  let next = raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  next = next.replace(/,\s*([}\]])/g, '$1');
  return next;
}

function selectionFromRecord(parsed: Record<string, unknown>): OutfitSelection {
  const note =
    typeof parsed.note === 'string' && parsed.note.trim()
      ? parsed.note.trim()
      : t('ai.defaultNote');
  return {
    top: coerceId(parsed.top),
    bottom: coerceId(parsed.bottom),
    shoes: coerceId(parsed.shoes),
    outer: coerceId(parsed.outer),
    accessory: coerceId(parsed.accessory),
    note,
  };
}

function parseLooseSlots(raw: string): OutfitSelection | null {
  const found: Record<string, unknown> = {};
  for (const slot of CATEGORIES) {
    const match = raw.match(
      new RegExp(`["']?${slot}["']?\\s*[:=]\\s*["']?([A-Za-z0-9_-]+)["']?`, 'i'),
    );
    if (match?.[1]) found[slot] = match[1];
  }
  if (!found.top && !found.bottom && !found.shoes) return null;
  const noteMatch = raw.match(/["']?note["']?\s*[:=]\s*["']([^"']+)["']/i);
  if (noteMatch?.[1]) found.note = noteMatch[1];
  return selectionFromRecord(found);
}

export function parseOutfitResponse(raw: string): OutfitSelection | null {
  const cleaned = stripCodeFences(raw);
  const objectText = extractBalancedObject(cleaned) ?? cleaned.match(/\{[\s\S]*\}/)?.[0];
  if (objectText) {
    try {
      const parsed = JSON.parse(repairJson(objectText)) as Record<string, unknown>;
      return selectionFromRecord(parsed);
    } catch {
      /* fall through to loose parse */
    }
  }
  return parseLooseSlots(cleaned);
}

export function resolveOutfitSelection(
  selection: OutfitSelection,
  index: WardrobeIndex,
): OutfitSelection {
  const resolve = (value: string | undefined, category: Category): string | undefined => {
    if (!value) return undefined;
    const key = value.trim();
    const short = index.realByShort.get(key) ?? index.realByShort.get(key.toLowerCase());
    if (short?.category === category) return short.id;

    const byId = index.byId.get(key);
    if (byId?.category === category) return byId.id;

    const byName = index.byName.get(key.toLowerCase());
    if (byName?.category === category) return byName.id;

    const named = index.items.find(
      (item) =>
        item.category === category &&
        (item.name.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(item.name.toLowerCase())),
    );
    if (named) return named.id;

    return undefined;
  };

  return {
    top: resolve(selection.top, 'top'),
    bottom: resolve(selection.bottom, 'bottom'),
    shoes: resolve(selection.shoes, 'shoes'),
    outer: resolve(selection.outer, 'outer'),
    accessory: resolve(selection.accessory, 'accessory'),
    note: selection.note,
  };
}
