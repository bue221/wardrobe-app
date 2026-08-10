import type { ClothingItem } from '../wardrobe/types';

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
    .map((i) => `- id:${i.id} | name:"${i.name}" | category:${i.category} | colors:${i.colors.join(',')}`)
    .join('\n');
}

export function buildOutfitPrompt(items: ClothingItem[]): string {
  const list = buildWardrobeList(items);
  return `You are a fashion stylist. Below is a wardrobe list. Select one item per needed category to form a cohesive outfit. Reply ONLY with valid JSON matching this exact schema (no markdown):
{"top":"<id or null>","bottom":"<id or null>","shoes":"<id or null>","outer":"<id or null>","accessory":"<id or null>","note":"<one sentence explaining why they work together>"}

Wardrobe:
${list}

Rules:
- top and bottom and shoes are required (pick from available items in those categories, or null if none exist)
- outer and accessory are optional
- Choose items whose colors complement each other
- Reply ONLY with the JSON object, nothing else`;
}

export function parseOutfitResponse(raw: string): OutfitSelection | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      top: parsed.top || undefined,
      bottom: parsed.bottom || undefined,
      shoes: parsed.shoes || undefined,
      outer: parsed.outer || undefined,
      accessory: parsed.accessory || undefined,
      note: parsed.note || 'An AI-curated outfit for you.',
    };
  } catch {
    return null;
  }
}
