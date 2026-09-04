---
name: wardrobe-mobile
description: "Trigger: mobile, PWA, safe-area, bottom nav, viewport, landing layout, responsive. Build phone-first Wardrobe layouts."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Wardrobe Mobile

## Activation Contract

Use when changing layout, navigation, landing composition, manifest, viewport, or any screen that must work on a phone.

## Hard Rules

- Compose at 360–430px first. `md:` / `lg:` only widen or add columns.
- Bottom app nav is a surface `rounded-pill`. Keep it clear of `safe-area-inset-bottom`.
- Main app padding-bottom must exceed nav height + safe area (home indicator must not cover CTAs).
- Touch targets ≥44px. Filter chips may be shorter visually but hit area stays 44px.
- Landing hero: stacked display lines + full-width halftone. Do not use 50vw blocks on small screens.
- Sheets/modals: bottom sheet on mobile, centered card on `md+`.
- PWA `theme-color`: Pumice `#e2e2df` in light, Obsidian `#070607` in dark.

## Decision Gates

| Breakpoint | Nav | Grid | Card padding | Section gap |
|------------|-----|------|--------------|-------------|
| default | Bottom pill | 2 cols | 24px (`p-6`) | 48px |
| `md+` | Top pill | 3–4 cols | 40px (`p-10`) | 80px |

## Execution Steps

1. Implement the phone layout and safe areas.
2. Add `md:` enhancements without changing mobile structure.
3. Verify `/` and `/app` at ~390px: type does not overflow, nav does not hide actions.

## Output Contract

State viewport assumed, nav placement, and safe-area handling.

## References

- `docs/design.md` (mobile clamp + PWA chrome)
- `docs/PRD.md`
