---
name: caldera-ui
description: "Trigger: UI, CSS, landing, button, card, Tailwind, restyle, design.md, Caldera. Apply Caldera tokens to every visual change."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Caldera UI

## Activation Contract

Use before writing or editing any visual surface: pages, components, CSS, canvas exports, toasts, PWA theme, favicon.

## Hard Rules

- Tokens and recipes live in `docs/design.md`. Do not invent colors, radii, shadows, or weights.
- Primary CTA: Ember fill, Obsidian text, `rounded-pill`, py-3 px-6, DM Sans 500.
- Secondary: 1.5px ink border, `rounded-card` (40px), never pill.
- Plasma Violet is hero/halftone only — never controls.
- DM Sans `font-medium` (500) only. Display face: Bebas Neue, uppercase, `tracking-[0.02em]`, ≥26px.
- No `shadow-*`, no `bg-zinc-*`, no violet/fuchsia gradients, no system red error fills.
- Reuse `src/shared/ui/Button`, `Tag`, `HalftoneBlock`, `PrefsBar`.
- Themed chrome: `bg-canvas`, `bg-surface`, `text-ink`, `border-ink`. Ember/Sulfur keep `text-obsidian`.

## Decision Gates

| Surface | Treatment |
|---------|-----------|
| Main action | Primary Ember pill |
| Alternate action | Secondary 40px outline |
| Metric highlight | Ember stat card, Chalk type |
| Article / empty / form sheet | Surface content card |
| Category / status chip | Sulfur pill tag |
| Hero / brand artwork | Halftone on Plasma→Ember |
| Error | Surface card + ink copy; Ember only if urgent |

## Execution Steps

1. Open `docs/design.md` and match an existing component.
2. Use `@theme` tokens from `src/index.css` (`bg-canvas`, `bg-surface`, `bg-ember`, `rounded-card`, `font-display`).
3. Clamp display type; do not hard-code 189px on mobile.
4. Grep the diff for `shadow`, `zinc-`, `violet-`, `fuchsia-`, `font-bold`, `font-normal`, hardcoded UI strings.

## Output Contract

Return the Caldera component used and confirm: no shadows, palette-legal, DM Sans 500, radii 40/100/800 only.

## References

- `docs/design.md`
- `src/index.css`
