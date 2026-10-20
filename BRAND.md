# UK LTD Registration — Brand Kit

> Single source of truth for brand identity. Derived from `tailwind.config.js`
> and `public/css/output.css`. Do not hardcode colour values in templates —
> consume the Tailwind tokens listed here.

## Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| `brand.navy` | `#002b5c` | Header, footer, deep surfaces |
| `brand.blue` | `#0056b3` | Primary accent, links, primary CTAs |
| `brand.green` | `#28a745` | Success states, confirmations |
| Ink | `#111827` | Primary body text |
| Muted | `#6b7280` | Supporting / secondary text |
| Line | `#e5e7eb` | Hairline borders and dividers |
| Paper | `#f9fafb` | Light section background |
| Slate | `#0f172a` | Dark section background |

Supporting blues used in gradients and surfaces: `#2563eb`, `#3b82f6`,
`#60a5fa`, `#dbeafe`, `#eff6ff`.

## Typography

| Role | Stack |
|---|---|
| Primary | `Inter, sans-serif` (`font-sans`) |
| Monospace | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` |

## Assets

| Asset | Path | Notes |
|---|---|---|
| Logo | `/images/logo.png` | Referenced by `Organization` JSON-LD |
| Favicon | `/favicon.ico` | Multi-size (16/32/48 px) |
| Apple touch icon | `/images/apple-touch-icon.png` | iOS home-screen |
| Social card | `/images/favicon-1200.webp` | 1200×630 OpenGraph/Twitter card |
| OG/hero | `/images/hero-home.webp` | Homepage hero, `1200×630` with explicit dimensions |

## Usage Rules

1. Never substitute a generic or unbranded icon for the logo.
2. The primary CTA colour is `brand.blue` (`#0056b3`).
3. Legal and compliance pages share the same header/footer — no unbranded standalone pages.
4. Every new page must include the shared `partials/header` and `partials/footer`.
5. Colours are consumed as Tailwind tokens (`bg-brand-blue`, `text-brand-navy`).
   Do not hardcode hex values in EJS templates.
6. Imagery must carry descriptive `alt` text; decorative images use empty `alt=""`.
