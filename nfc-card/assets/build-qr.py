#!/usr/bin/env python3
"""
Build the QR mark carried on the card fronts.

The QR encodes the *same* smart URL the NFC chip carries, so a scan and a
tap land on the identical hosted landing card. Change PAYLOAD here and
re-run — nothing else in the design references the URL.

Error correction is M (~15%). Higher levels only add modules, and the code
sits on a clean printed panel, not on a surface that gets scuffed.

Output: assets/victory-qr.svg
  dark modules, transparent background, zero built-in quiet zone. The card
  supplies the quiet zone as light panel padding, which keeps the SVG's box
  equal to the code itself so `height: Npx` in the design means exactly that.

Run:  python3 assets/build-qr.py
"""
import pathlib

import segno

HERE = pathlib.Path(__file__).resolve().parent

PAYLOAD = "https://victoryhotels.in/vj"
DARK = "#17140f"  # the design's ink black


def main():
    qr = segno.make(PAYLOAD, error="m")
    dest = HERE / "victory-qr.svg"
    qr.save(
        dest,
        kind="svg",
        scale=1,
        border=0,          # quiet zone comes from the card's panel padding
        dark=DARK,
        light=None,        # transparent — the panel behind it shows through
        svgclass=None,
        lineclass=None,
        omitsize=False,
        title="Victory Hotels — scan to save contact",
    )
    size = qr.symbol_size(scale=1, border=0)[0]
    print(f"victory-qr.svg  version {qr.version} · {size}x{size} modules · {PAYLOAD}")


if __name__ == "__main__":
    main()
