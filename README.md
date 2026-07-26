# laze

Marketing / portfolio site for **Laze** — a one-woman upholstery and furniture
restoration studio in West London (Heather).

Static site: plain HTML, CSS, and a little JavaScript. No build step, no
dependencies — open `index.html` and it runs.

## Structure

| File | What it is |
|------|------------|
| `index.html` | The homepage (nav, hero, about, services, contact, footer) |
| `styles.css` | All styling. Palette + type scale live in `:root` at the top |
| `main.js` | Mobile menu, services image hover-swap, contact-form validation |
| `assets/` | Images. The `*.svg` files are **placeholders** — swap for real photos |

## Design tokens (from Figma)

```
--green #2C3D32   dark forest (dark sections)
--coral #E0A7AF   dusty pink (text on dark)
--rust  #7F4B52   muted pink (text on light)
--sage  #E0E5E0   light sage (light sections)
Font: Fustat (Google Fonts)
```

## Run it locally

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

## To do later

- Replace placeholder images in `assets/` with Heather's real photography
  (interior, portrait, upholstery details). Re-generate placeholders any time with
  `python3 assets/make-placeholders.py`.
- Swap the text wordmark in the nav/footer for the real **laze** logo SVG.
- Wire the contact form to a backend (e.g. Formspree / Netlify Forms) — see the
  note in `main.js`.

## Deploy (free)

Push to `main`, then in the repo on GitHub: **Settings → Pages → Build from
branch → `main` / root**. The site goes live at
`https://laze-london.github.io/laze-london/`.
