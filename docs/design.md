# Caldera — Style Reference (Wardrobe)

> forge fire on warm limestone. The canvas is raw warm plaster, and every orange element reads as glowing embers pressed into the surface.

**Theme:** light (default) and dark (Obsidian canvas). Both use the same named palette.  
**Source of truth:** this file. Every screen, component, canvas export, PWA chrome, and marketing surface uses these tokens. Do not invent colors, radii, shadows, or type weights.

Caldera runs on a warm limestone canvas flooded with molten orange. The interface is flat and unshadowed, letting ultrabold compressed type at near-architectural scale carry all structural weight. A single vivid orange (`#fc5000`) acts as the only aggressive chromatic accent against monochrome warm grays, with a violet plasma reserved for the hero halftone and a sulfur yellow for tags. The visual language is volcanic: condensed heavy letterforms, halftone dot patterns, 40px radii on cards and buttons, and 800px pill controls — heat contained within a soft, paper-like surface.

Wardrobe is a **mobile-first PWA**. Desktop is an enhancement of the phone layout, not a separate design. Type sizes clamp so the 189px display signature survives on large screens without overflowing a 360px viewport.

## Quick path

1. Read tokens (color, type, radius) before writing UI.
2. Compose with the named components below — do not invent new chrome.
3. Check Do's / Don'ts and the mobile clamp table before shipping.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember | `#fc5000` | `--color-ember` | Primary action buttons, featured stat cards, key visual highlights — the only aggressive chromatic accent |
| Plasma Violet | `#524ae9` | `--color-plasma-violet` | Hero halftone gradient base, single secondary card surface — never used for controls |
| Sulfur | `#f5f28e` | `--color-sulfur` | Tag and category badge backgrounds |
| Limestone | `#f7f6f2` | `--color-limestone` | Card surfaces, content block backgrounds, secondary button fills |
| Pumice | `#e2e2df` | `--color-pumice` | Page canvas, dominant background |
| Obsidian | `#070607` | `--color-obsidian` | Primary text, headings, link text, button borders |
| Chalk | `#ffffff` | `--color-chalk` | Dark-section text, input text on dark backgrounds |

Tailwind primitives: `bg-ember`, `text-obsidian`, `bg-limestone`, `bg-pumice`, `bg-sulfur`, `bg-plasma-violet`, `text-chalk`.

Semantic chrome (required for themed surfaces): `bg-canvas`, `bg-surface`, `text-ink`, `border-ink`, `bg-inverse`, `text-on-inverse`.

## Light and dark

Do not invent hex. Dark only remaps semantic roles onto existing tokens.

| Role | Light | Dark |
|------|-------|------|
| canvas (`--color-canvas`) | Pumice `#e2e2df` | Obsidian `#070607` |
| surface (`--color-surface`) | Limestone `#f7f6f2` | `color-mix(in srgb, Chalk 11%, Obsidian)` |
| ink (`--color-ink`) | Obsidian `#070607` | Chalk `#ffffff` |
| inverse block | Obsidian + Chalk | Limestone + Obsidian |
| Ember / Sulfur / Plasma | unchanged | unchanged |
| Ember CTA + Sulfur tag text | Obsidian | Obsidian |
| PWA `theme-color` | Pumice | Obsidian |

Preference: `light` \| `dark` \| `system` in `localStorage` key `wardrobe.theme`. `html[data-theme]` is `light` or `dark` after resolve.

Layer surfaces with color (canvas → surface → Ember), never shadows.

## Tokens — Typography

### Display — All headings and display text · `--font-display`

- **Primary:** PP Neue Corp Compact (`"ss06"`, `"ss10"`)
- **Substitute (this repo):** Bebas Neue (Anton / Druk Wide Bold as further fallbacks)
- **Weights:** 400 only
- **Tracking:** `+0.02em` at all display sizes — never negative
- **Transform:** uppercase
- **Role:** Structural headlines. Below 26px the face loses its industrial character; never go above 189px.

### DM Sans — Body, nav, buttons, supporting headings up to 30px · `--font-dm-sans`

- **Substitute:** Inter, Manrope
- **Weights:** 500 only (never Regular, never Bold)
- **Sizes:** 14px, 16px, 18px, 30px
- **Line height:** 1.20–1.55

### System sans-serif — Captions, meta, dates · `--font-system`

- **Weights:** 400
- **Size:** 12px only
- **Line height:** 1.20

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.55 | — | `--text-body` |
| subheading | 26px | 1.2 | — | `--text-subheading` |
| heading-sm | 30px | 1.5 | — | `--text-heading-sm` |
| heading | 32px | 1 | 0.64px | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| heading-2xl | 80px | 1.1 | — | `--text-heading-2xl` |
| heading-3xl | 96px | 0.95 | — | `--text-heading-3xl` |
| display | 189px | 0.94 | 0.02em | `--text-display` |

### Mobile clamp (required)

189px on a phone overflows. Implement the scale with `clamp()` so mobile hits the floor and desktop hits the Caldera ceiling.

| Role | Mobile floor | Desktop ceiling |
|------|----------------|-----------------|
| display | 64px | 189px |
| heading-3xl | 48px | 96px |
| heading-2xl | 40px | 80px |
| heading-lg | 32px | 48px |
| heading | 26px | 32px |
| heading-sm / body / caption | unchanged | unchanged |

---

## Tokens — Spacing & Shapes

**Density:** comfortable

Map Caldera spacing onto Tailwind’s default 4px grid (`p-1` = 4px … `p-10` = 40px). Do not override `--spacing-4` through `--spacing-16` in `@theme` (that would collapse Tailwind’s scale). Add only non-grid values: `--spacing-9`, `--spacing-18`, `--spacing-92`.

| Name | Value | Tailwind |
|------|-------|----------|
| 4 | 4px | `1` |
| 8 | 8px | `2` |
| 9 | 9px | `gap-9` custom |
| 12 | 12px | `3` |
| 16 | 16px | `4` |
| 20 | 20px | `5` |
| 24 | 24px | `6` |
| 32 | 32px | `8` |
| 40 | 40px | `10` |
| 48 | 48px | `12` |
| 64 | 64px | `16` |
| 80 | 80px | `20` |

### Border Radius

| Element | Value | Token / class |
|---------|-------|----------------|
| cards, content blocks, secondary buttons | 40px | `--radius-card` / `rounded-card` |
| pills, primary CTAs, tags, nav shells | 800px | `--radius-pill` / `rounded-pill` |
| inputs | 100px | `--radius-input` / `rounded-input` |
| small | 16px | `--radius-small` |
| medium | 20px | `--radius-medium` |

### Layout

| Token | Mobile | Desktop |
|-------|--------|---------|
| Page max-width | 100% | 1280px |
| Section gap | 48px | 80px |
| Card padding | 24px | 40px |
| Element gap | 16px | 16px |
| App content inset | 16px + safe-area | 32px |

---

## Components

### Primary CTA Button

Filled Ember (`#fc5000`) with Obsidian (`#070607`) text. 800px radius (full pill). Padding 12px / 24px. DM Sans 500 at 16px. No shadow. Never rectangular.

### Secondary Pill Button

Transparent or Limestone fill, 1.5px Obsidian border, Obsidian text. **40px** radius (not 800px). Padding 16px. DM Sans 500 at 16px. Solid border, not dotted.

### Outlined Ghost Link

Transparent, no border, Obsidian text. 800px radius. Padding 0 / 12px. Nav items and inline links.

### Stat Feature Card

Ember background, Chalk text. 40px radius. Padding 24px mobile / 40px desktop. Metric in display face at heading-2xl. Label in DM Sans 500 at 14–16px.

### Content Card

Limestone background, no border, no shadow. 40px radius. Padding 24px / 40px. Sulfur tag, display headline 26–32px, 12px system caption.

### Product Photo Card (Wardrobe-only)

User clothing photos are **product content**, not brand imagery. Limestone surface, 40px radius, **no drop shadow**. Image flush to the top radius; caption block below (name in display ≥26px, Sulfur category tag, 12px meta). Do not use dark cinematic gradients as the primary treatment.

### Plasma Hero Card

Plasma Violet with white/orange halftone overlay. 40px radius. Used once per page as the signature anchor. No shadow. Never a button.

### Category Tag Badge

Sulfur background, Obsidian text. 800px radius. DM Sans 500 at 12–14px. Padding ~4px / 10px.

### Navigation Bar

- **Landing / desktop app:** Limestone pill (`rounded-pill`) on Pumice. Logo left, links + CTA right. DM Sans 500 at 16px, 9px item gaps.
- **Mobile app:** the same Limestone pill, docked to the bottom with `max(16px, safe-area-inset-bottom)` clearance. Active item uses Ember text or an Ember fill with Obsidian label — never Plasma Violet.

### Hero Halftone Block

Rounded rectangle, Plasma Violet → Ember gradient, orange halftone dots, 40px radius. On mobile it is **full content width**, not 50vw. Signature motif of the system.

### Input Field

- **Dark sections:** transparent, 1.5px Chalk border, 100px radius, Chalk text, padding 24px / 32px.
- **Light app forms:** Limestone or Pumice fill, 1.5px Obsidian border, 100px radius, Obsidian text. Same radii and type. Do not introduce a third input style.

### Partner Logo Strip

Limestone card, 40px radius, 40px padding. Monochrome marks, 1.5px Obsidian **dotted** vertical dividers.

### Dotted Divider

1.5px dotted Obsidian. Vertical in nav/partner strips; horizontal as section breaks. Dotted, never dashed, never solid.

---

## Do's and Don'ts

### Do

- Use display type at 26px+ for any heading that must feel structural
- Apply 40px radius to cards and non-pill buttons
- Apply 800px radius to primary CTAs, tags, nav shells
- Primary CTA = Ember fill + Obsidian text, pill, 12/24 padding
- Body = DM Sans 500 only
- Use the halftone as the hero/signature treatment
- Layer surfaces with color (canvas → surface → Ember), never shadows
- Design the phone layout first; scale up

### Don't

- Do not add drop shadows anywhere (including canvas exports and toasts)
- Do not use rectangular / low-radius buttons
- Do not add accent colors beyond Ember, Plasma Violet, and Sulfur (no red error fills, no zinc, no violet-fuchsia gradients)
- Do not use DM Sans Regular or Bold
- Do not set headings below 26px or above 189px
- Do not use Plasma Violet for buttons or controls
- Do not apply negative letter-spacing to the display face
- Do not use photography, 3D, or lifestyle imagery on brand surfaces (landing, empty states, heroes)
- Do not ship a desktop-only layout and “squash” it for mobile

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | Pumice light / Obsidian dark | Page background |
| 1 | Surface | Limestone light / Chalk 11% on Obsidian dark | Cards, sheets, nav pill |
| 2 | Ember Feature | `#fc5000` | Stats, primary CTA, emphasis |
| 3 | Plasma Hero | `#524ae9` | Hero halftone only |

## Elevation

Deliberately shadowless. Hierarchy = color contrast + 40px radii.

## Imagery

Brand imagery is graphic: halftone, solid Ember blocks, Plasma surfaces. Icons are small, monochrome, minimal. User-uploaded clothing photos appear only inside Product Photo Cards.

## PWA chrome

| Surface | Value |
|---------|-------|
| `theme-color` | Light: Pumice `#e2e2df`. Dark: Obsidian `#070607` |
| `background_color` | `#e2e2df` (manifest fallback) |
| Status bar | `default` on light; `black-translucent` on dark |
| Touch targets | ≥44px |
| Bottom nav | above `safe-area-inset-bottom` |

## Agent prompt guide — copy these, don’t improvise

1. **Primary Action Button:** Ember fill, Obsidian text, 800px radius, 12/24 padding.
2. **Stat Row:** Ember cards, 40px radius, DM Sans 14px label, display 80px metric, Chalk text.
3. **Content Card:** Limestone, 40px radius, Sulfur pill tag, 32px display headline, 12px caption.
4. **Dark Input Section:** Inverse canvas, Chalk (or ink) pill input 100px radius, Ember submit pill.
5. **Themed chrome:** `bg-canvas` page, `bg-surface` cards, `text-ink` copy, `border-ink` 1.5px strokes.

## CSS custom properties

See `src/index.css` `@theme` block. Tokens there must stay 1:1 with this file.
