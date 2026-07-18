# Rutacafetal Design System

**Product:** Marketplace de trabajo cafetalero para Jaén  
**Design dials:** variance 4/10, motion 3/10, density 5/10

## Direction

Rutacafetal debe sentirse confiable, rural y contemporáneo. La jerarquía es directa, el contenido pesa más que la decoración y cada pantalla debe funcionar en Android básico con conexión irregular. Evitar morados, gradientes, vidrio, ilustraciones genéricas y animación decorativa.

## Tokens

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#F8FAF7` | `#101712` |
| Surface | `#FFFFFF` | `#172019` |
| Foreground | `#17251C` | `#EDF4ED` |
| Muted text | `#53645A` | `#B7C5BA` |
| Primary | `#24513A` | `#8FB99B` |
| Primary strong | `#173624` | `#D9EADC` |
| Primary soft | `#E7F0E5` | `#203529` |
| Accent | `#A64B2F` | `#DF8B69` |
| Border | `#CBD5CC` | `#3D5142` |
| Danger | `#9F3030` | `#F2A2A2` |

- Typeface: Geist for UI and content; Geist Mono only for credentials and compact values.
- Radius: 8px fields, 12px cards/actions, 16px featured media.
- Spacing: 4, 8, 16, 24, 32, 48 and 64px.
- Shadow: one subtle level, `0 4px 8px rgb(23 54 36 / 8%)`.

## Components

- Inputs and buttons are at least 48px tall; touch targets never below 44px.
- Primary actions use solid green. Secondary actions use a border. Destructive actions use red outline.
- Cards use a 1px border and white surface, not floating stacks of shadows.
- Status uses text plus color. Never rely on color alone.
- Forms group related fields, show one clear next action and preserve visible labels.

## Motion and accessibility

Use exact-property transitions of 150–180ms with `cubic-bezier(.23,1,.32,1)`. Active presses may scale to `0.97`; no layout-shifting hover. Respect `prefers-reduced-motion`. Maintain WCAG 2.2 AA contrast, visible focus, semantic landmarks, keyboard access and responsive checks at 375, 768, 1024 and 1440px.
