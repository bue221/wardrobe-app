---
name: wardrobe-product
description: "Trigger: armario, outfit, WebLLM, IndexedDB, prenda, favoritos, landing copy. Apply Wardrobe domain; copy goes through i18n."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Wardrobe Product

## Activation Contract

Use when changing product flows, copy, routes, data, or AI generation — not for visual tokens (use `caldera-ui`).

## Hard Rules

- UI copy is `t()` from `src/i18n/messages.ts` (`es` default, `en` required). Commits stay English Conventional Commits.
- Local-first: clothing and outfits stay in IndexedDB. No accounts, no cloud photos.
- Routes: `/` landing (no DB). `/app` shell with tabs wardrobe | outfit | favorites.
- Do not add a router library until a third distinct route exists.
- Hide WebLLM CTA when WebGPU is unavailable; random generate remains.
- User photos only inside Product Photo Cards. Landing and empty states stay graphic.

## Decision Gates

| Change | Do |
|--------|----|
| New screen | Reuse existing tabs or landing sections; don't add chrome |
| Empty state | Display heading + body + Primary CTA (+ optional secondary) |
| AI failure | Surface card, i18n message; keep random generate |
| Persist item | Compress image, then `idb` — don't store original camera files |

## Execution Steps

1. Read `docs/PRD.md` for flow and out-of-scope.
2. Preserve IndexedDB contracts in `src/shared/db/wardrobeDB.ts`.
3. Keep generator parse/fallback behavior unless the task is to change it.
4. If copy changes, update `es` and `en` in `src/i18n/messages.ts`.

## Output Contract

Name the flow touched, locales updated, and whether data stays on-device.

## References

- `docs/PRD.md`
- `src/shared/db/wardrobeDB.ts`
