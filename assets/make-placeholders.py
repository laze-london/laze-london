#!/usr/bin/env python3
"""Generate palette-matched placeholder images for the Laze homepage.
These are temporary — swap the .svg references in index.html for Heather's
real photography when it's ready. Re-run: python3 assets/make-placeholders.py
"""
import os

# (filename, width, height, base hex, caption)
PLACEHOLDERS = [
    ("service-upholstery.svg", 560, 560, "#243A6A", "Upholstery detail"),
    ("service-restoration.svg", 560, 560, "#4A3526", "Restoration"),
    ("service-sourcing.svg", 560, 560, "#3A4A3C", "Sourcing"),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{cap}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{base}"/>
      <stop offset="1" stop-color="#1B3620"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#g)"/>
  <g fill="none" stroke="#D8876E" stroke-opacity="0.14" stroke-width="1">
    {lines}
  </g>
  <text x="50%" y="50%" fill="#D8876E" fill-opacity="0.65" font-family="Fustat, system-ui, sans-serif"
        font-size="20" font-weight="500" text-anchor="middle" dominant-baseline="middle">{cap}</text>
</svg>
"""

def hatch(w, h, step=44):
    out = []
    x = -h
    while x < w:
        out.append(f'<line x1="{x}" y1="0" x2="{x+h}" y2="{h}"/>')
        x += step
    return "\n    ".join(out)

here = os.path.dirname(os.path.abspath(__file__))
for fn, w, h, base, cap in PLACEHOLDERS:
    svg = TEMPLATE.format(w=w, h=h, base=base, cap=cap, lines=hatch(w, h))
    with open(os.path.join(here, fn), "w") as f:
        f.write(svg)
    print("wrote", fn)
