#!/usr/bin/env python3
"""
Derive cropped logo variants from the supplied Victory Hotels SVG.

The source file (assets/victory-logo.svg) is a masked raster export: two
identical-size PNGs, one used as a luminance mask, one as the visible art.
Its <clipPath> cuts at y=1095.9 user units, which lands above the wordmark
band, so the file as supplied renders the emblem only.

These variants reuse the *exact* embedded PNG payloads — nothing is
re-encoded — and only adjust the root viewBox and drop the clip so each
variant frames the intended part of the artwork.

Run:  python3 assets/build-logo-assets.py
"""
import base64
import io
import pathlib
import re

import numpy as np
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "victory-logo.svg"

# Placement of the <image> elements inside the SVG user-coordinate space.
SX, SY = 0.862031, 0.862129
TX, TY = 72.226551, 356.398437

PAD = 6.0  # user units of breathing room around each crop


def load_mask(svg_text):
    hrefs = re.findall(r'xlink:href="data:image/\w+;base64,([^"]+)"', svg_text)
    if len(hrefs) != 2:
        raise SystemExit(f"expected 2 embedded images, found {len(hrefs)}")
    return np.asarray(
        Image.open(io.BytesIO(base64.b64decode(hrefs[0]))).convert("L")
    ).astype(int)


def ink_bands(mask, threshold=96, min_gap=5, min_px=2):
    """Split the artwork into vertically separated bands of ink."""
    on = mask > threshold
    rows = np.nonzero(on.sum(1) > min_px)[0]
    bands, start, prev = [], rows[0], rows[0]
    for r in rows[1:]:
        if r - prev > min_gap:
            bands.append((start, prev))
            start = r
        prev = r
    bands.append((start, prev))

    out = []
    for y0, y1 in bands:
        cols = np.nonzero(on[y0 : y1 + 1].sum(0) > 1)[0]
        out.append((int(cols[0]), int(y0), int(cols[-1]), int(y1)))
    return out


def to_user_units(px_box):
    x0, y0, x1, y1 = px_box
    return (TX + x0 * SX, TY + y0 * SY, TX + x1 * SX, TY + y1 * SY)


def make_variant(svg_text, box, title):
    """Re-frame the source SVG to `box` (user units) without touching the art."""
    x0, y0, x1, y1 = box
    vx, vy = x0 - PAD, y0 - PAD
    vw, vh = (x1 - x0) + 2 * PAD, (y1 - y0) + 2 * PAD

    out = svg_text

    # Drop the clip that truncates the artwork; the viewBox now does the framing.
    out = out.replace(' clip-path="url(#af2c864a37)"', "", 1)

    # Re-frame: intrinsic size follows the crop so `height:Npx` scales correctly.
    out = re.sub(r'\swidth="2000"', f' width="{vw:.2f}"', out, count=1)
    out = re.sub(r'\sheight="2000"', f' height="{vh:.2f}"', out, count=1)
    out = re.sub(
        r'\sviewBox="[^"]*"',
        f' viewBox="{vx:.2f} {vy:.2f} {vw:.2f} {vh:.2f}"',
        out,
        count=1,
    )

    # Accessible name for the <img>/inline consumers (XML-escaped).
    safe = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    out = out.replace("><defs>", f"><title>{safe}</title><defs>", 1)
    return out


def main():
    svg = SRC.read_text(encoding="utf-8")
    mask = load_mask(svg)
    bands = ink_bands(mask)
    if len(bands) < 2:
        raise SystemExit(f"expected emblem + wordmark bands, found {len(bands)}")

    emblem_px, wordmark_px = bands[0], bands[-1]
    emblem = to_user_units(emblem_px)
    lockup = to_user_units(
        (
            min(emblem_px[0], wordmark_px[0]),
            emblem_px[1],
            max(emblem_px[2], wordmark_px[2]),
            wordmark_px[3],
        )
    )

    targets = [
        ("victory-emblem.svg", emblem, "Victory Hotels emblem"),
        ("victory-lockup.svg", lockup, "Victory Hotels & Resorts"),
    ]
    for name, box, title in targets:
        (HERE / name).write_text(make_variant(svg, box, title), encoding="utf-8")
        w, h = box[2] - box[0], box[3] - box[1]
        print(f"{name:22s} crop {w:7.1f} x {h:6.1f}  ratio {w / h:.3f}")


if __name__ == "__main__":
    main()
