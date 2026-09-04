# Wardrobe — PRD (mobile-first Caldera)

Wardrobe es una PWA mobile-first: el armario vive en el teléfono, los outfits se forjan on-device, y cada pixel sigue `docs/design.md` (Caldera).

## Quick path

1. Entrar por la landing (`/`) — hero Caldera, CTA Ember.
2. Abrir la app (`/app`) — armario, generador, guardados.
3. Verificar en un viewport de 390px: tipo clamp, nav pill inferior, cero sombras.

## Producto

| Tema | Decisión |
|------|----------|
| Qué | Armario digital local + generador de outfits (aleatorio y WebLLM) |
| Quién | Una persona que viste su propia ropa y quiere looks rápidos, privados |
| Dónde | PWA en el teléfono primero; desktop es la misma UI ensanchada |
| Datos | IndexedDB (`idb`). Sin cuenta, sin nube, fotos comprimidas en el dispositivo |
| Visual | Caldera light + dark — semantic canvas/surface/ink, Ember CTA, halftone de marca, sin sombras |
| Idioma UI | `es` (es-AR, default) y `en` vía `src/i18n/messages.ts`. Sin copy hardcodeado. |

## Alcance de esta entrega

| In | Out |
|----|-----|
| `docs/design.md` como única fuente visual | Backend, auth, sync |
| Landing de marca en `/` | Fotografía de lifestyle |
| App restyleada en `/app` | Nuevo modelo de IA |
| Skills + reglas Cursor para no driftar del sistema | Store listings |
| Nav pill Caldera (bottom mobile / top desktop) | Rediseño de la lógica IndexedDB/WebLLM |

## Flujos

| Flujo | Comportamiento |
|-------|----------------|
| Landing → App | CTA primario navega a `/app` sin recargar datos |
| Armario vacío | Estado editorial (tipo display + CTA Ember + secundario “ejemplos”). Sin ilustraciones stock |
| Agregar prenda | Sheet inferior en mobile (`items-end`), card 40px en desktop. Input pill 100px |
| Filtrar | Pills: activo Ember+Obsidian, inactivo Limestone |
| Generar outfit | Primario Ember = IA (si hay WebGPU). Secundario 40px = aleatorio |
| Guardados | Content cards Limestone, caption 12px, tag Sulfur si hay nota IA |
| Error | Texto ink en card surface; urgencia con Ember — nunca rojo de sistema |
| Share canvas | Export con paleta Caldera (Pumice/Limestone/Ember/Obsidian), sin sombra |

## Requisitos no funcionales

| Área | Barra |
|------|--------|
| Mobile | Layout pensado en 360–430px. Tap ≥44px. `viewport-fit=cover` + safe areas |
| Performance | Grid de fotos con `loading="lazy"`. Modelo WebLLM se descarga una vez |
| Offline | Service worker sirve shell; `/` y `/app` deben funcionar como SPA |
| Accesibilidad | Contraste ink sobre canvas/surface; Ember+Obsidian en CTAs; labels en botones de borrar; ambos temas |
| Consistencia | Si un componente no está en `design.md`, no se inventa: se reusa Primary / Secondary / Card / Tag / Halftone |

## IA y errores

| Capa | Qué ve la persona | Qué se registra |
|------|-------------------|-----------------|
| UI | Frase corta vía i18n. Error de generación en card surface, no un toast rojo | — |
| Generación | Fallback aleatorio si el parseo JSON falla (comportamiento actual) | `console` solo para SW / fallos irrecuperables |
| Red / GPU | Si no hay WebGPU, se oculta el CTA de IA; queda el aleatorio | — |

## Arquitectura (contratos)

```
/            LandingPage     marca, no lee IndexedDB
/app         AppShell        tabs: wardrobe | outfit | favorites
IndexedDB    clothing + outfits (blobs locales)
WebLLM       opcional, on-device
```

No añadir React Router salvo que las rutas crezcan. `pushState` + `popstate` alcanza.

## Checklist de aceptación

- [ ] `docs/design.md` listado en AGENTS.md como fuente visual
- [ ] Landing mobile 390px: headline clamp, halftone 40px, CTA pill Ember, cero box-shadow
- [ ] App mobile: bottom Limestone pill, contenido no tapado por nav ni home indicator
- [ ] App desktop: top Limestone pill, max-width 1280px
- [ ] DM Sans 500 en body/botones; Bebas Neue en headings; sin `font-bold` de body
- [ ] Paleta restringida a Ember / Plasma / Sulfur / Limestone / Pumice / Obsidian / Chalk (dark solo remapea canvas/surface/ink)
- [ ] Copy en `es` y `en`; `t()` en UI; tema light/dark/system
- [ ] Fotos de prendas solo dentro de Product Photo Cards
- [ ] Toast y canvas de share sin sombras y sin zinc/violet legacy

## Next step

Implementar tokens en `src/index.css`, primitives en `src/shared/ui/`, landing, y restyle de páginas. Cualquier UI nueva abre `docs/design.md` y `.cursor/skills/caldera-ui/SKILL.md` antes de codear.
