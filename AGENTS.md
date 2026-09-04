# Wardrobe — agent contract

Mobile-first PWA. UI copy via i18n (`es` + `en`). Light/dark Caldera. Local-first IndexedDB.

## Read first

| Need | File |
|------|------|
| Product | `docs/PRD.md` |
| Visual tokens, light + dark, components, don'ts | `docs/design.md` |
| UI implementation | `.cursor/skills/caldera-ui/SKILL.md` |
| Phone layout, PWA, safe areas | `.cursor/skills/wardrobe-mobile/SKILL.md` |
| Domain (armario, outfits, WebLLM) | `.cursor/skills/wardrobe-product/SKILL.md` |
| Copy + theme | `.cursor/skills/wardrobe-i18n-theme/SKILL.md` |

## Hard rules

- Do not invent colors, shadows, radii, or type weights. If it is not in `docs/design.md`, do not ship it.
- Phone layout first (360–430px). Desktop is a wider version of the same composition.
- Never hardcode UI copy. Add `es` and `en` in `src/i18n/messages.ts` and use `t()`. Commits stay English Conventional Commits.
- Page chrome uses `bg-canvas` / `bg-surface` / `text-ink`. Ember/Sulfur controls keep Obsidian text. Both themes must work.
- Keep clothing photos as product content inside photo cards. Brand surfaces stay graphic (halftone / Ember / Plasma).

## Routes

- `/` — marketing landing (no IndexedDB)
- `/app` — armario / outfit / guardados
