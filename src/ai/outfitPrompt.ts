import type { ClothingItem } from '../wardrobe/types';
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

function buildWardrobeList(items: ClothingItem[]): string {
  return items
    .map(
      (i) =>
        `- id:${i.id} | name:"${i.name}" | category:${i.category} | colors:${i.colors.map(colorLabel).join(',')}`,
    )
    .join('\n');
}

export function buildOutfitPrompt(items: ClothingItem[]): string {
  return t('ai.prompt', { list: buildWardrobeList(items) });
}

export function buildRetryPrompt(): string {
  return t('ai.retry');
}

function coerceId(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return undefined;
  return trimmed;
}

function stripCodeFences(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

export function parseOutfitResponse(raw: string): OutfitSelection | null {
  try {
    const cleaned = stripCodeFences(raw);
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
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
  } catch {
    return null;
  }
}
