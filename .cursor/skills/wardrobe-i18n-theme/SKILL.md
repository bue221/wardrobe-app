---
name: wardrobe-i18n-theme
description: "Trigger: copy, texto, traducción, i18n, idioma, theme, dark, light, UI string. Keep every string translated and every UI surface themed."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Wardrobe i18n + theme

## Activation Contract

Use before any user-visible string, toast, aria-label, placeholder, canvas label, AI prompt, or visual/UI change.

## Hard Rules

- Never hardcode UI copy in JSX. Add the key to `src/i18n/messages.ts` in **both** `es` and `en`, then call `t('key')` or `useI18n().t`.
- Default locale is Spanish (es-AR). English is the second locale. Persist via `wardrobe.locale`.
- Surfaces use semantic tokens: `bg-canvas`, `bg-surface`, `text-ink`, `border-ink`, `bg-inverse`, `text-on-inverse`. Do not paint pages with raw `bg-pumice` / `text-obsidian` except Ember/Sulfur controls (`text-obsidian` on Ember) and overlays (`bg-obsidian/60`).
- Theme is `light` | `dark` | `system` (`wardrobe.theme`). Dark remaps canvas/surface/ink only; Ember, Sulfur, Plasma stay. No new hex, no shadows.
- Dates use `dateLocale()`. Category/color labels use `src/i18n/labels.ts`.
- Keep `html lang`, `document.title`, and `theme-color` in sync via i18n/theme modules.

## Decision Gates

| Change | Do |
|--------|----|
| New string | Add `es` + `en` keys first; render with `t()` |
| Edit existing copy | Update both locales; do not leave English-only or Spanish-only |
| New UI surface | `bg-canvas` page, `bg-surface` cards/nav, `text-ink` copy, `border-ink` strokes |
| Ember CTA / Sulfur tag | Keep `text-obsidian` on chromatic fills |
| AI / canvas / toast | Translate through message keys; canvas reads `canvasPaint()` |
| Prefs chrome | Reuse `PrefsBar`; do not invent a third language or a fourth theme |

## Execution Steps

1. If the diff includes copy, open `src/i18n/messages.ts` and add matching keys.
2. If the diff includes layout/color, use semantic tokens and verify light + dark contrast (ink on canvas/surface).
3. Grep the diff for quoted Spanish/English UI strings and for `bg-pumice` / `bg-limestone` / `text-obsidian` on page chrome.

## Output Contract

State locales updated, theme tokens used, and that no hardcoded UI copy remains.

## References

- `src/i18n/messages.ts`
- `src/theme/theme.ts`
- `docs/design.md` (light + dark remap)
- `.cursor/skills/caldera-ui/SKILL.md`
