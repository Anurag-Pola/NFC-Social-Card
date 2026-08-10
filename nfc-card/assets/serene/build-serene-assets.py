#!/usr/bin/env python3
"""
Build the Serene Resort & Convention brand assets for the NFC card.

The supplied artwork (serene-logo-source.png, taken from sereneresort.in) is a
flat single-colour silhouette on transparency, 500x500 with the mark occupying
only 342x234 of it. Used as-is it would sit at roughly 285 dpi at the largest
size the card asks for — right on the print floor. So it is traced to vector
once, here, and every downstream use is resolution-independent.

Tracing, not redrawing: the outline comes from the supplied alpha channel, so
the shapes are the shapes. The alpha is upsampled 4x before tracing purely so
the curve fitter has sub-pixel edges to follow, then the paths are divided
back down — no detail is invented.

Colour: the card system is the Victory Hotels one, so the mark carries that
system's brushed gold rather than the site's copper. Victory's supplied emblem
is a real gold-gradient artwork, not a flat fill, so the traced Serene paths
get the same treatment — a flat gold beside it would read as a different
finish on the same card.

Outputs (into assets/serene/):
  serene-emblem.svg        lotus mark + flourish rule, brushed gold
  serene-emblem-light.svg  same, ivory — for a reversed/mono use
  serene-wordmark.svg      SERENE / RESORT & CONVENTION, brushed gold
  serene-lockup.svg        full logo, brushed gold
  serene-lockup-light.svg  full logo, ivory

Run:  python3 assets/serene/build-serene-assets.py
"""
import html
import pathlib

import numpy as np
import potrace
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "serene-logo-source.png"

# Brushed gold, the Victory card system's own foil ramp (#b48a3d..#e6c67a).
# Run diagonally so the highlight crosses the mark the way a foil stamp
# catches light, instead of banding flatly left to right.
GOLD = (
    '<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">'
    '<stop offset="0" stop-color="#a8823a"/>'
    '<stop offset="0.38" stop-color="#e6c67a"/>'
    '<stop offset="0.66" stop-color="#d9b56a"/>'
    '<stop offset="1" stop-color="#b48a3d"/>'
    "</linearGradient>"
)
# The card's warm off-white, for the mark reversed out to a single tone.
IVORY = "#f2ead8"

# Alpha >= this counts as ink. 128 sits mid-slope on the anti-aliased edge, so
# the traced outline lands on the shape's true edge rather than inside or
# outside it.
INK = 128
SUPERSAMPLE = 4

# Source bands, in px of the 500x500 original (found from the alpha row
# profile: three runs of ink separated by clear rows).
BANDS = {
    "emblem": (138, 253),    # lotus + the horizontal flourish beneath it
    "wordmark": (258, 370),  # SERENE + RESORT & CONVENTION
    "lockup": (138, 370),    # everything
}


def trace(crop):
    """Trace one alpha crop to a list of SVG path `d` strings, in crop px."""
    big = crop.resize(
        (crop.width * SUPERSAMPLE, crop.height * SUPERSAMPLE), Image.LANCZOS
    )
    # Two potrace conventions to respect, both silent if you get them wrong:
    #   - the mask must be dtype bool. Anything else is re-thresholded against
    #     255*blacklevel, which collapses a 0/1 array to uniformly false.
    #   - Bitmap() inverts on construction, so the array passed in marks the
    #     *background*. Hence `< INK`: transparent pixels in, ink traced out.
    bitmap = potrace.Bitmap(np.asarray(big) < INK)
    # turdsize drops speck artefacts left by the source's own JPEG-ish edges;
    # 2 source px squared is far below any real feature of this mark.
    path = bitmap.trace(turdsize=2 * SUPERSAMPLE**2, alphamax=1.0)

    # potrace hands back a tree: an outer contour owns the contours nested
    # inside it (a letter's counter, the gaps between the lotus strokes).
    # Flatten it — every contour becomes a subpath, and evenodd fill turns
    # the alternating nesting back into holes.
    def flatten(curves, acc):
        for c in curves or ():
            acc.append(c)
            flatten(c.children, acc)
        return acc

    s = float(SUPERSAMPLE)
    p = lambda pt: f"{pt.x / s:.3f},{pt.y / s:.3f}"
    out = []
    for curve in flatten(path, []):
        d = [f"M{p(curve.start_point)}"]
        for seg in curve:
            if seg.is_corner:
                d.append(f"L{p(seg.c)}L{p(seg.end_point)}")
            else:
                d.append(f"C{p(seg.c1)} {p(seg.c2)} {p(seg.end_point)}")
        d.append("Z")
        out.append("".join(d))
    return out


def write_svg(dest, paths, w, h, fill, title):
    """`fill` is either a colour string or the GOLD gradient definition."""
    # fill-rule evenodd so the counters (the gaps inside E, O, R, and the
    # lotus outlines) stay open instead of filling solid.
    body = "".join(f'<path d="{d}"/>' for d in paths)
    title = html.escape(title, quote=True)  # the brand name carries an "&"
    gradient = fill.startswith("<")
    # Each file is its own document when loaded through <img>, so the fixed
    # "gold" id cannot collide with the other marks on the same page.
    defs = f"<defs>{fill}</defs>" if gradient else ""
    paint = "url(#gold)" if gradient else fill
    dest.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{defs}"
        f'<g fill="{paint}" fill-rule="evenodd">{body}</g></svg>\n',
        encoding="utf-8",
    )
    print(f"  {dest.name}  {w}x{h} · {len(paths)} paths · "
          f"{'brushed gold' if gradient else fill}")


def main():
    if not SRC.exists():
        raise SystemExit(f"missing source artwork: {SRC}")

    alpha = Image.open(SRC).convert("RGBA").split()[3]
    # Trim the source's empty left/right padding once, so every output shares
    # one horizontal origin and the emblem stays centred over the wordmark.
    x0, _, x1, _ = alpha.getbbox()

    traced = {}
    for name, (y0, y1) in BANDS.items():
        crop = alpha.crop((x0, y0, x1, y1))
        traced[name] = (trace(crop), crop.width, crop.height)

    for name in ("emblem", "wordmark", "lockup"):
        paths, w, h = traced[name]
        write_svg(HERE / f"serene-{name}.svg", paths, w, h, GOLD,
                  "Serene Resort & Convention")

    for name in ("emblem", "lockup"):
        paths, w, h = traced[name]
        write_svg(HERE / f"serene-{name}-light.svg", paths, w, h, IVORY,
                  "Serene Resort & Convention")


if __name__ == "__main__":
    main()
