"""Traces the CSC Screeding logo into separate vector parts for the preloader, header and favicon.

The live site only serves the logo as a raster (csc_logo_2017_large.jpg, 3508x768, white ground). Its two inks are
split by colour: royal blue (sampled median #100E9F) for "screeding" and the lower swoosh, concrete grey (#9A989B)
for "CSC" and the upper swoosh. Every shape is found as a connected component and traced with potrace. Output:
  lib/logo.ts                 one path per part, grouped: csc (3 letters), screeding (9 letters), swoosh (grey, blue)
  public/brand/logo.svg       full colour, transparent ground (for light backgrounds)
  public/brand/logo-white.svg white letters, swooshes white and white at 45% (for dark backgrounds)
  app/icon.svg                favicon: the two swooshes and "CSC" on a royal tile
Run: python3 scripts/logo.py (needs potrace, numpy, scipy, Pillow)
"""
import json, os, re, subprocess, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_scrape/replit_csc_logo_2017_large-cguYLzER.jpg")
ROYAL, CONCRETE = "#100E9F", "#9A999B"

px = np.asarray(Image.open(SRC).convert("RGB")).astype(int)
r, g, b = px[..., 0], px[..., 1], px[..., 2]
masks = {
    "blue": ndimage.binary_opening(b - r > 60),
    "grey": ndimage.binary_opening((b - r <= 60) & (r < 215) & (np.abs(r - b) < 30)),
}

# Crop to the artwork plus a small margin; every path is written in cropped coordinates.
ys, xs = np.where(masks["blue"] | masks["grey"])
PAD = 8
X0, Y0 = xs.min() - PAD, ys.min() - PAD
W, H = xs.max() + PAD - X0, ys.max() + PAD - Y0


def components(mask):
    labels, _ = ndimage.label(mask)
    out = []
    for i, sl in enumerate(ndimage.find_objects(labels)):
        part = labels[sl] == i + 1
        if part.sum() < 300:
            continue
        out.append(dict(mask=labels == i + 1, x0=sl[1].start, x1=sl[1].stop, y0=sl[0].start, y1=sl[0].stop))
    return sorted(out, key=lambda p: p["x0"])


def trace(mask):
    with tempfile.TemporaryDirectory() as d:
        Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).save(f"{d}/a.bmp")
        subprocess.run(["potrace", f"{d}/a.bmp", "-s", "-o", f"{d}/a.svg", "--flat", "-a", "1", "-O", "0.4", "-u", "10"], check=True)
        return " ".join(re.findall(r'<path d="([^"]+)"', open(f"{d}/a.svg").read()))


def bake(d, h):
    """potrace writes in 0.1px units with y flipped; convert to absolute, cropped pixel coordinates."""
    tokens = re.findall(r"[a-zA-Z]|-?\d*\.?\d+", d)
    out, i, cmd = [], 0, None
    cx = cy = sx = sy = 0.0
    def pt(x, y): return (x / 10.0 - X0, h - y / 10.0 - Y0)
    while i < len(tokens):
        t = tokens[i]
        if re.match(r"[a-zA-Z]", t):
            cmd = t; i += 1
        if cmd in "Mm":
            x, y = float(tokens[i]), float(tokens[i + 1]); i += 2
            if cmd == "m": x += cx; y += cy
            cx, cy = sx, sy = x, y
            p = pt(x, y); out.append(f"M{p[0]:.1f} {p[1]:.1f}"); cmd = "l" if cmd == "m" else "L"
        elif cmd in "Ll":
            x, y = float(tokens[i]), float(tokens[i + 1]); i += 2
            if cmd == "l": x += cx; y += cy
            cx, cy = x, y; p = pt(x, y); out.append(f"L{p[0]:.1f} {p[1]:.1f}")
        elif cmd in "Cc":
            v = [float(tokens[i + k]) for k in range(6)]; i += 6
            if cmd == "c": v = [v[0] + cx, v[1] + cy, v[2] + cx, v[3] + cy, v[4] + cx, v[5] + cy]
            a, bb, c = pt(v[0], v[1]), pt(v[2], v[3]), pt(v[4], v[5]); cx, cy = v[4], v[5]
            out.append(f"C{a[0]:.1f} {a[1]:.1f} {bb[0]:.1f} {bb[1]:.1f} {c[0]:.1f} {c[1]:.1f}")
        elif cmd in "Zz":
            out.append("Z"); cx, cy = sx, sy
        else:
            raise ValueError(cmd)
    return "".join(out)


path = lambda m: bake(trace(m), px.shape[0])

blue, grey = components(masks["blue"]), components(masks["grey"])
# Grey: C, S, C and the upper swoosh (by far the widest shape). Blue: the lower swoosh is the widest shape; the rest
# are the letters of "screeding", with the dot of the i merged into its stem.
grey_swoosh = max(grey, key=lambda p: p["x1"] - p["x0"])
blue_swoosh = max(blue, key=lambda p: p["x1"] - p["x0"])
csc = [p for p in grey if p is not grey_swoosh]
letters = [p for p in blue if p is not blue_swoosh]
dot = min(letters, key=lambda p: p["y1"] - p["y0"])
stem = next(p for p in letters if p is not dot and abs(p["x0"] - dot["x0"]) < 20)
stem["mask"] = stem["mask"] | dot["mask"]; stem["y0"] = dot["y0"]
letters = [p for p in letters if p is not dot]
assert len(csc) == 3 and len(letters) == 9, (len(csc), len(letters))

parts = (
    [dict(group="csc", char=c, d=path(p["mask"])) for c, p in zip("CSC", csc)]
    + [dict(group="screeding", char=c, d=path(p["mask"])) for c, p in zip("screeding", letters)]
    + [dict(group="swoosh", char="grey", d=path(grey_swoosh["mask"])), dict(group="swoosh", char="blue", d=path(blue_swoosh["mask"]))]
)

ts = "// Generated by scripts/logo.py from the live site's csc_logo_2017_large.jpg (the only full-size copy). Do not edit.\n"
ts += f"export const LOGO_W = {W};\nexport const LOGO_H = {H};\n"
ts += 'export type LogoPart = { group: "csc" | "screeding" | "swoosh"; char: string; d: string };\n'
ts += "export const logoParts: LogoPart[] = " + json.dumps(parts, indent=1) + ";\n"
open(os.path.join(ROOT, "lib/logo.ts"), "w").write(ts)


def svg(fills, vb=f"0 0 {W} {H}", extra=""):
    body = "".join(f'<path fill="{fills(p)}" d="{p["d"]}"/>' for p in parts)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{extra}{body}</svg>'


colour = lambda p: CONCRETE if p["group"] == "csc" or p["char"] == "grey" else ROYAL
white = lambda p: "rgba(255,255,255,.45)" if p["char"] == "grey" else "#FFFFFF"
open(os.path.join(ROOT, "public/brand/logo.svg"), "w").write(svg(colour))
open(os.path.join(ROOT, "public/brand/logo-white.svg"), "w").write(svg(white))

# Favicon: "CSC" in white on a royal tile (the live favicon is a squashed copy of the whole wide logo).
cx0 = min(p["x0"] for p in csc) - X0; cx1 = max(p["x1"] for p in csc) - X0
cy0 = min(p["y0"] for p in csc) - Y0; cy1 = max(p["y1"] for p in csc) - Y0
side = (cx1 - cx0) * 1.24
ox, oy = (cx0 + cx1) / 2 - side / 2, (cy0 + cy1) / 2 - side / 2
icon = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{ox:.0f} {oy:.0f} {side:.0f} {side:.0f}">'
        f'<rect x="{ox:.0f}" y="{oy:.0f}" width="{side:.0f}" height="{side:.0f}" rx="{side * .18:.0f}" fill="{ROYAL}"/>'
        + "".join(f'<path fill="#FFFFFF" d="{p["d"]}"/>' for p in parts if p["group"] == "csc") + "</svg>")
open(os.path.join(ROOT, "app/icon.svg"), "w").write(icon)
print("parts", len(parts), "viewBox", W, H)
