# Laze — Brand guidelines

Reference for building the **laze.london** site. Keep new work consistent with this.

## Palette
| Token | Hex | Use |
|---|---|---|
| `--green` | `#2C3D32` | Dark forest — dark sections (homepage hero, navbar, footer) |
| `--coral` | `#E0A7AF` | Dusty pink — text/icons on dark backgrounds |
| `--rust`  | `#7F4B52` | Muted pink — text/icons on light backgrounds (WCAG AA compliant, 5.4:1 on sage) |
| `--sage`  | `#E0E5E0` | Light sage — light sections (shop, product, service pages) |

Navbar tone rule: **dusty pink `#E0A7AF` on the green homepage**, **muted pink `#7F4B52` on the light sub-pages** (`.navbar--light`).

## Typography
- **Fustat** (Google Fonts), weights 400/500/600/700/800.
- Headings 500 weight, letter-spacing -0.01em.

## Icons
- Icons are sourced from the **Material Symbols** library.
- Render them in the brand colour via `currentColor` (so they inherit coral-on-dark / rust-on-light automatically).
- **Price-tag icon = Material Symbols `sell`** — used as a leading icon on the **furniture** and **fabrics** nav items to signal they're shops. Class `.nav-icon`. Inline SVG path:
  ```
  M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z
  ```
- When adding more icons, grab the SVG from Material Symbols (fill style), set `fill="currentColor"`, `aria-hidden="true"`.

## Voice & tone
- Never use em dashes (—) in copy. Use a comma, full stop, or parentheses instead.
- Laze is a one-woman studio. Write in first person singular ("I"), never "we".

## Social
- Instagram → https://www.instagram.com/laze.london/
- LinkedIn → https://www.linkedin.com/in/hniven/

## Page set
- `index.html` — homepage (green hero, about, services, contact)
- `furniture.html` / `fabrics.html` — shop listing pages
- `product.html` — product detail template
- `upholstery.html` / `restoration.html` / `sourcing.html` — individual service pages (from one template)
- Shared components: navbar, footer, and the **contact form** (injected by `main.js` into `<div data-contact>`).
