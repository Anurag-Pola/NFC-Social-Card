#!/usr/bin/env python3
"""
Build downloadable, print-ready artwork for the Serene Resort & Convention
NFC card.

Same pipeline and same geometry as build-print.py, pointed at the Serene
design doc and writing to its own output folder — the Victory files are not
read, rewritten or deleted by this script.

Single-sourced: the four card faces are extracted straight out of
"Serene Resort NFC Card.dc.html", so the print files can never drift from the
design doc. Nothing about the card is re-typed here.

Card spec
  trim   85 x 55 mm  (ISO 7810 ID-1 / standard business card)
  bleed  3 mm on every side  ->  91 x 61 mm page
  safe   inner content stays >= 4 mm off trim

The design box is 560 x 362.35 px. 362.35 = 560 * 55/85, i.e. the design
width mapped to the true 85:55 card ratio, so the uniform scale to trim
introduces no distortion. (The doc uses 360px for on-screen balance; the
2.35px difference is absorbed by the centred/absolute layout.)

One folder per cardholder, into ./downloads/serene/<slug>/:
  serene-card-<opt>-midnight-obsidian.pdf   2 pages, front + back, with bleed
  serene-card-<opt>-marble-editorial.pdf    2 pages, front + back, with bleed
  serene-nfc-cards-all.pdf                  all 4 faces
  png/*-bleed.png                           600 dpi, 2150 x 1441
  png/*-trim.png                            600 dpi, 2008 x 1299
  serene-nfc-cards-<slug>.zip               everything above

Run:  python3 print/build-print-serene.py
"""
import pathlib
import re
import shutil
import subprocess
import zipfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "Serene Resort NFC Card.dc.html"
OUT = ROOT / "downloads" / "serene"
WORK = ROOT / "print" / ".work-serene"

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# ---- geometry -------------------------------------------------------------
TRIM_W_MM, TRIM_H_MM = 85.0, 55.0
BLEED_MM = 3.0
PAGE_W_MM = TRIM_W_MM + 2 * BLEED_MM
PAGE_H_MM = TRIM_H_MM + 2 * BLEED_MM

DESIGN_W = 560.0
DESIGN_H = DESIGN_W * TRIM_H_MM / TRIM_W_MM  # 362.35

PX_PER_MM = 96.0 / 25.4
SCALE = (TRIM_W_MM * PX_PER_MM) / DESIGN_W

# 600 dpi, flattened. Chrome's --print-to-pdf references Cormorant/JetBrains/
# Inter by name but does NOT embed the font programs (FontFile: 0), so a
# printer without those faces installed would silently substitute. Rasterising
# at 2x the 300 dpi print standard removes the font dependency entirely.
DPI = 600
DEVICE_SCALE = DPI / 96.0

# One design doc holds every cardholder; each gets its own block ids and its
# own output folder, so a printer can be handed one person's set on its own.
CARDS = (
    {"slug": "vittal-jadhav", "name": "Vittal Jadhav",
     "options": (("2a", "midnight-obsidian"), ("2b", "marble-editorial"))},
    {"slug": "pawan-s-rana", "name": "Pawan S Rana",
     "options": (("3a", "midnight-obsidian"), ("3b", "marble-editorial"))},
)


# ---- extract the four faces from the design doc ---------------------------
def match_div(text, start):
    """Return (inner_html, end_index) for the <div> opening at `start`."""
    i = text.index(">", start) + 1
    depth, j = 1, i
    for m in re.finditer(r"<(/?)div\b", text[i:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            j = i + m.start()
            return text[i:j], text.index(">", i + m.end()) + 1
    raise ValueError("unbalanced <div>")


def split_style(style):
    """Separate the card's surface styling from its layout styling."""
    decls = [d.strip() for d in style.split(";") if d.strip()]
    surface_keys = {"background"}
    # Dropped for print:
    #   width/height/position/overflow — supplied by the print geometry
    #   border-radius   — corner rounding is a die/finishing step, and a
    #                     rounded bleed layer would leak white page corners
    #   box-shadow      — an on-screen depth cue, not ink
    drop = {"width", "height", "position", "overflow", "border-radius", "box-shadow"}
    surface, layout = [], []
    for d in decls:
        key = d.split(":", 1)[0].strip()
        if key in drop:
            continue
        (surface if key in surface_keys else layout).append(d)
    return "; ".join(surface), "; ".join(layout)


def extract_faces(doc, options):
    faces = []
    for option, label in options:
        block_start = doc.index(f'<div id="{option}"')
        block, _ = match_div(doc, block_start)
        for side in ("FRONT", "BACK"):
            at = block.index(f"<!-- {side} -->")
            div_at = block.index("<div ", at)
            inner, _ = match_div(block, div_at)
            style = re.search(r'style="([^"]*)"', block[div_at : block.index(">", div_at)]).group(1)
            surface, layout = split_style(style)
            faces.append(
                {
                    "id": f"{option}-{label}-{side.lower()}",
                    "option": option,
                    "title": f"{option.upper()} {label.replace('-', ' ')} — {side.lower()}",
                    "surface": surface,
                    "layout": layout,
                    "inner": inner,
                }
            )
    return faces


# ---- html -----------------------------------------------------------------
HEAD = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page {{ size: {PAGE_W_MM}mm {PAGE_H_MM}mm; margin: 0; }}
  html, body {{ margin: 0; padding: 0; background: #fff; }}
  .page {{
    position: relative; width: {PAGE_W_MM}mm; height: {PAGE_H_MM}mm;
    overflow: hidden; break-after: page; page-break-after: always;
  }}
  .page:last-child {{ break-after: auto; page-break-after: auto; }}
  /* full-bleed surface: the card background runs to the paper edge */
  .bleed {{ position: absolute; inset: 0; }}
  /* trim box: content is positioned against the 85x55 cut line, as designed */
  .trim {{
    position: absolute; left: {BLEED_MM}mm; top: {BLEED_MM}mm;
    width: {TRIM_W_MM}mm; height: {TRIM_H_MM}mm;
  }}
  /* `zoom` (not `transform: scale`) — a scaled transform makes Chrome
     flatten the subtree to a bitmap, which rasterises every glyph. `zoom`
     re-runs layout at the target size, so type stays live vector in the PDF. */
  .design {{
    position: absolute; inset: 0;
    width: {DESIGN_W:.2f}px; height: {DESIGN_H:.2f}px;
    zoom: {SCALE:.6f};
  }}
  .sr-mark {{ display: block; width: auto; }}
  /* print proofs are static; the tap pulse would render as a stray ring */
  * {{ animation: none !important; }}
  img {{ image-rendering: -webkit-optimize-contrast; }}
</style></head><body>
"""


# Edge-anchored bands must continue through the bleed, otherwise a cut that
# drifts outward leaves a bare sliver along the card edge. Each entry
# continues one of the design's gold edge stripes out to the paper edge.
GOLD_BAND = "linear-gradient(90deg, #b48a3d, #e6c67a, #b48a3d)"
# Keyed on variant+side rather than the full face id, because the same two
# faces recur under a different option letter for every cardholder.
BLEED_BANDS = {
    # "<variant>-<side>" -> (edge, band height in *design* px)
    "marble-editorial-front": ("top", 6),
    "marble-editorial-back": ("bottom", 10),
}


def band_html(face):
    spec = BLEED_BANDS.get(face["id"].split("-", 1)[1])
    if not spec:
        return ""
    edge, design_px = spec
    band_mm = design_px * TRIM_W_MM / DESIGN_W
    depth = band_mm + BLEED_MM
    side = f"{edge}: 0;"
    # The gradient keeps its 85mm run and is pinned to the trim box; the flat
    # #b48a3d underneath fills the left/right bleed with the gradient's own
    # end colour, so the seam is invisible.
    return (
        f'<div style="position:absolute; left:0; right:0; {side} height:{depth:.3f}mm;'
        f' background: {GOLD_BAND} {BLEED_MM}mm 0 / {TRIM_W_MM}mm 100% no-repeat, #b48a3d;"></div>'
    )


def page_html(face):
    return (
        f'<div class="page" data-id="{face["id"]}">'
        f'<div class="bleed" style="{face["surface"]}"></div>'
        f"{band_html(face)}"
        f'<div class="trim"><div class="design" style="{face["layout"]}">{face["inner"]}</div></div>'
        f"</div>\n"
    )


def write_doc(path, faces):
    body = "".join(page_html(f) for f in faces)
    # The print HTML is generated into print/.work-serene/, so doc-relative
    # asset paths would dangle. Pin them to absolute file:// URLs.
    body = body.replace('src="./assets/', f'src="file://{ROOT}/assets/')
    path.write_text(HEAD + body + "</body></html>", encoding="utf-8")


# ---- chrome ---------------------------------------------------------------
def chrome(*args):
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
         "--allow-file-access-from-files", "--virtual-time-budget=8000", *args],
        check=True, capture_output=True,
    )


def pdf_from_pngs(pngs, dest):
    """Assemble a print PDF from the 600 dpi bleed rasters.

    Page size is derived from pixels/DPI, so each page measures exactly
    91 x 61 mm and needs no fonts present on the printer's machine.
    """
    pages = [Image.open(p).convert("RGB") for p in pngs]
    pages[0].save(dest, "PDF", save_all=True, append_images=pages[1:],
                  resolution=float(DPI))


def to_png(face, dest_bleed, dest_trim):
    single = WORK / f"{face['id']}.html"
    write_doc(single, [face])
    px = lambda mm: mm / 25.4 * DPI

    # Window is sized up to the next whole CSS pixel so the page is never
    # clipped; the surplus is cropped off below rather than scaled in, which
    # would otherwise drag a sliver of white body into the bleed edge.
    chrome(f"--screenshot={dest_bleed}",
           f"--window-size={-(-PAGE_W_MM * PX_PER_MM // 1):.0f},{-(-PAGE_H_MM * PX_PER_MM // 1):.0f}",
           f"--force-device-scale-factor={DEVICE_SCALE}", f"file://{single}")

    W, H = round(px(PAGE_W_MM)), round(px(PAGE_H_MM))
    im = Image.open(dest_bleed).convert("RGB")
    if im.width < W or im.height < H:
        raise SystemExit(f"{face['id']}: shot {im.size} smaller than page {(W, H)}")
    im = im.crop((0, 0, W, H))
    im.save(dest_bleed, dpi=(DPI, DPI))

    b = round(px(BLEED_MM))
    im.crop((b, b, b + round(px(TRIM_W_MM)), b + round(px(TRIM_H_MM)))) \
      .save(dest_trim, dpi=(DPI, DPI))


SPEC = f"""SERENE RESORT & CONVENTION — NFC BUSINESS CARD
Print specification — {{name}}

CARD
  Trim          {TRIM_W_MM:.0f} x {TRIM_H_MM:.0f} mm (standard business card, ISO 7810 ID-1)
  Bleed         {BLEED_MM:.0f} mm all round  ->  supplied page is {PAGE_W_MM:.0f} x {PAGE_H_MM:.0f} mm
  Safe margin   4 mm inside trim (see NOTES)
  Resolution    {DPI} dpi, flattened RGB
  Corners       square as supplied; round to 3 mm radius at finishing if wanted
  Orientation   landscape, front and back supplied as separate pages

FILES  (this folder holds {{name}}'s set only)
  serene-card-{{a}}-midnight-obsidian.pdf   Option {{A}} - p1 front, p2 back
  serene-card-{{b}}-marble-editorial.pdf    Option {{B}} - p1 front, p2 back
  serene-nfc-cards-all.pdf               all four faces, one file
  png/*-bleed.png                        {round(PAGE_W_MM / 25.4 * DPI)} x {round(PAGE_H_MM / 25.4 * DPI)} px, includes bleed - USE THIS TO PRINT
  png/*-trim.png                         {round(TRIM_W_MM / 25.4 * DPI)} x {round(TRIM_H_MM / 25.4 * DPI)} px, cut size - for on-screen preview only

  Print from the PDFs or the *-bleed.png files. The PDFs are flattened
  raster at {DPI} dpi, so no fonts need to be installed to output them.

LAYOUT
  Front         Cardholder's details, NFC tap mark top-right
  Back          Serene Resort & Convention brand face, with the QR

STOCK & FINISH (as designed)
  {{A}}  soft-touch laminated black, 400 gsm; gold foil stamp; spot UV on back
  {{B}}  uncoated warm ivory, 380 gsm; gilded top edge; gold edge paint

NFC
  Chip          NTAG-213, 144 byte, re-writable
  Placement     embed centred behind the tap mark, top-right of the front
  Keep the antenna clear of any foil stamping - metal detunes the coil.
  Payload       smart URL -> hosted landing card (vCard, WhatsApp, booking)

QR
  Encodes the same smart URL as the chip
  (assets/serene/build-serene-qr.py holds the URL).
  Printed size  12.1 mm square, on a light panel on the back
  Module        ~0.49 mm - above the practical floor, do not scale down
  Print the code as flat process black. No foil, no spot UV, no metallic
  ink on the modules or the light panel around them: both kill the contrast
  a scanner needs. The panel's pad is the quiet zone - keep it empty.

NOTES / DECISIONS FOR YOU
  1. Colour is RGB. If your printer wants CMYK, ask them to convert to their
     own profile - do not convert twice. The golds sit around #b48a3d-#e6c67a
     and will shift slightly in CMYK; a metallic gold foil (Pantone 871/872)
     will match the intent far better than 4-colour process.
  2. Safe-margin encroachments on Option {{A}}, all deliberate edge detailing:
       gold hairline frame    2.12 mm from trim
       corner ornaments       3.04 mm from trim
       reservations line      2.12 mm from trim
     These are inside the usual 4 mm safe zone. They will still print, but a
     cut drifting +/-0.5 mm will make the frame look uneven side to side.
     Either accept it, ask for tighter guillotine tolerance, or have the
     inset moved out to 4 mm. Option {{B}} has no encroachments.
  3. The logo is vector throughout - it was traced from the site artwork by
     assets/serene/build-serene-assets.py, so it holds up at any size,
     including a foil stamping die.
"""


def build_card(doc, card):
    """Render one cardholder's four faces into downloads/serene/<slug>/."""
    out = OUT / card["slug"]
    (out / "png").mkdir(parents=True, exist_ok=True)
    (a, _), (b, _) = card["options"]

    print(f"{card['name']}  ->  downloads/serene/{card['slug']}/")
    faces = extract_faces(doc, card["options"])
    assert len(faces) == 4, f"expected 4 faces, got {len(faces)}"

    # Rasters first — the PDFs are assembled from them.
    for f in faces:
        f["bleed_png"] = out / "png" / f"{f['id']}-bleed.png"
        to_png(f, f["bleed_png"], out / "png" / f"{f['id']}-trim.png")
        print(f"  png/{f['id']}-{{bleed,trim}}.png")

    groups = [
        (f"serene-card-{a}-midnight-obsidian.pdf", [f for f in faces if f["option"] == a]),
        (f"serene-card-{b}-marble-editorial.pdf", [f for f in faces if f["option"] == b]),
        ("serene-nfc-cards-all.pdf", faces),
    ]
    for name, group in groups:
        pdf_from_pngs([f["bleed_png"] for f in group], out / name)
        print(f"  {name}  ({len(group)} page{'s' if len(group) > 1 else ''})")

    (out / "PRINT-SPEC.txt").write_text(
        SPEC.format(name=card["name"], a=a, b=b, A=a.upper(), B=b.upper()),
        encoding="utf-8",
    )
    print("  PRINT-SPEC.txt")

    zip_path = out / f"serene-nfc-cards-{card['slug']}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob("*")):
            if p.is_file() and p != zip_path:
                z.write(p, p.relative_to(out))
    print(f"  {zip_path.name}\n")


def main():
    if not pathlib.Path(CHROME).exists():
        raise SystemExit(f"Google Chrome not found at {CHROME}")

    WORK.mkdir(parents=True, exist_ok=True)
    doc = SRC.read_text(encoding="utf-8")
    for card in CARDS:
        build_card(doc, card)

    shutil.rmtree(WORK, ignore_errors=True)


if __name__ == "__main__":
    main()
