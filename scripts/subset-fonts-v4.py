"""V4 font build. Usage: python scripts/subset-fonts-v4.py <dir-with-ttf>
Needs (OFL, github.com/google/fonts): BricolageGrotesque[opsz,wdth,wght].ttf saved as bric.ttf and InstrumentSerif-Regular.ttf saved as iserif.ttf.
Bricolage keeps the wdth 75-100 and wght 200-800 axes (opsz pinned at 96, the display cut); Instrument Serif is roman only."""
import io, os, sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

src = sys.argv[1]
UNICODES = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2192, 0x2197, 0x20B9, 0x2122]

def build(name, out, limits=None):
    font = TTFont(f"{src}/{name}")
    if limits:
        font = instancer.instantiateVariableFont(font, limits)
        buf = io.BytesIO(); font.save(buf); buf.seek(0); font = TTFont(buf)  # reload: instancer leaves lazy tables the subsetter cannot read
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["kern", "ccmp", "mark", "mkmk"]
    opts.name_IDs = [1, 2, 3, 4, 6]; opts.notdef_outline = True; opts.hinting = False
    s = subset.Subsetter(opts); s.populate(unicodes=UNICODES); s.subset(font)
    font.flavor = "woff2"; font.save(f"src/fonts/{out}")
    print(out, os.path.getsize(f"src/fonts/{out}"), "bytes")

build("bric.ttf", "bricolage-grotesque.woff2", {"opsz": 96, "wght": (200, 800), "wdth": (75, 100)})
build("iserif.ttf", "instrument-serif.woff2")
build("jb.ttf", "jetbrains-mono.woff2", {"wght": 500})  # labels are weight 500 only
