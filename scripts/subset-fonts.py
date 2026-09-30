"""Rebuild src/fonts/*.woff2 from Google's latin woff2 files. Usage: python scripts/subset-fonts.py <dir-with-source-woff2>
Sources (OFL): Bricolage Grotesque, Instrument Sans, JetBrains Mono, via next/font/google's latin subset.
Subset = Basic Latin + the handful of non-ASCII characters the site uses (nbsp, (c), middle dot, dashes, quotes, ellipsis, arrow, rupee); weight axis narrowed to what the CSS uses."""
import sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

src = sys.argv[1]
UNICODES = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2192, 0x20B9, 0x2122]
JOBS = [  # (source file, output, wght: a number pins one weight, a tuple keeps a narrowed variable range)
    ("017d9bea37084d9b-s.p.41rroleoq1br7.woff2", "bricolage-grotesque.woff2", 600),
    ("f06bf9da926bae75-s.p.2874ccu1_u7jf.woff2", "instrument-sans.woff2", 400),
    ("70bc3e132a0a741e-s.p.3t6q91iet4nsy.woff2", "jetbrains-mono.woff2", 400),
]
for name, out, wght in JOBS:
    font = TTFont(f"{src}/{name}")
    font = instancer.instantiateVariableFont(font, {"wght": wght})
    import io; buf = io.BytesIO(); font.save(buf); buf.seek(0); font = TTFont(buf)  # reload: instancer leaves lazy glyph tables the subsetter cannot read
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["kern", "ccmp", "mark", "mkmk", "tnum"]  # no ligatures: labels and body do not use them
    opts.name_IDs = [1, 2, 3, 4, 6]; opts.notdef_outline = True
    s = subset.Subsetter(opts); s.populate(unicodes=UNICODES); s.subset(font)
    font.flavor = "woff2"; font.save(f"src/fonts/{out}")
    import os; print(out, os.path.getsize(f"src/fonts/{out}"), "bytes", len(font.getGlyphOrder()), "glyphs")

# Bricolage Grotesque display cut (V3): the stock files above are pinned instances. The display face is now built from the full variable file
# (github.com/google/fonts ofl/bricolagegrotesque, axes opsz 12-96, wght 200-800, wdth 75-100, all verified exposed 1 Oct 2026):
#   instancer.instantiateVariableFont(font, {"opsz": 96, "wght": (600, 800), "wdth": 75})  -> 20 KB woff2, hinting off, layout features kern+ccmp
# Only wdth 75 ships: the two-axis range costs 42 KB, about +0.1 s simulated LCP. Weight is variable 600-800 via font-weight.
