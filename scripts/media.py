"""Builds public/media from the raw downloads in _scrape/ (see README, "Where the images came from").

Photos: resized to the largest size the layout shows them at, saturation eased to 90% so they sit calmly beside
the palette (still in full colour, never tinted), saved as WebP.
Client logos: each one becomes a single-colour mark on a transparent ground. The background colour is read from the
corners, and every pixel's alpha is its distance from that colour, so dark-on-light and light-on-dark logos (Curo)
both come out as clean Ink silhouettes.
The full Maverick film is re-encoded to 720p for the on-page player.
Run: python3 scripts/media.py (needs Pillow and numpy; ffmpeg for the film)
"""
import os, subprocess
import numpy as np
from PIL import Image, ImageEnhance
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, "_scrape"), os.path.join(ROOT, "public/media")
os.makedirs(OUT, exist_ok=True)

PHOTOS = {
    # name: (source file, max width, optional crop box as fractions l, t, r, b)
    "fleet": ("replit_dji_0027-DdiIfVWb.jpg", 1800, None),
    "commercial": ("replit_George Liquid Screed - JPL_1749572145663-XTNJNR2O.jpg", 1290, None),
    "residential": ("replit_WhatsApp_Image_2026-02-10_at_13.30.01_1770730408107-CG3VCr6y.jpeg", 1600, None),
    "spencer": ("replit_Spencer home page website-B6o_rSY1.jpg", 1600, None),
    "controls": ("replit_Photo 24-02-2025_ 12 19 18-DbgiHHQO.jpg", 1800, None),
    "arundel": ("replit_Arundel great court-C1o8XB2a.jpeg", 1290, None),
    "project-twickenham": ("gcs_686e1d15038ba87c3a400297.jpeg", 1366, None),
    "project-kingston": ("gcs_686e1d15b860ef257715f399.jpeg", 1366, None),
    "project-beaconsfield": ("gcs_686e1d15879662d9c743fe4f.jpeg", 1366, None),
    "project-royal-berkshire": ("gcs_686e1d15000e731978e3ed56.jpeg", 1366, None),
    "project-centre-square": ("gcs_686e1d15b860eff12215f397.jpeg", 1366, None),
    "project-c20": ("gcs_686e1d1587966291da43fe4e.jpeg", 1366, None),
    "article-quotes": ("gcs_686e1d15038ba81b3d400296.jpeg", 1000, None),
    "article-questions": ("gcs_686e1d15000e73d544e3ed57.jpeg", 1000, None),
    "article-signoff": ("gcs_686e1d15000e73a11ee3ed55.jpeg", 1000, None),
    "watford": ("replit_Watford_RegionalPartner_3-CLj1_mhV.jpg", 680, None),
}

LOGOS = {
    # Curo's file is light lettering in a black box on a transparent ground: its box counts as background.
    "curo": ("replit_Curo logo-4x2-XF9O.png", 0),
    "collins": "replit_collins_social_400x400-Dl0PPPyZ.jpg",
    "beard": "replit_Beard Construction-Dx_VhXEc.png",
    "morgan-sindall": "replit_morgan-sindall-customer-logo-BP8Zx0jV.png",
    "forum": "replit_Forum-Logo-1-DvU30UDL.png",
    "princebuild": "replit_Princebuild-Logo-DJdJJt0W.jpg",
    "kingerlee": "replit_Kingerlee Logo-BBSdrCjT.jpg",
    "volker-fitzpatrick": "replit_Volker-Fitzpatrick-logo-DDkA-qYk.png",
}
INK = (12, 11, 36)


def photo(name, src, width, crop):
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.9)
    im.save(os.path.join(OUT, f"{name}.webp"), quality=78, method=6)
    return im.size


def logo(name, src):
    src, ground = src if isinstance(src, tuple) else (src, 255)
    im = Image.open(os.path.join(SRC, src)).convert("RGBA")
    a = np.asarray(im).astype(float)
    rgb, alpha = a[..., :3], a[..., 3] / 255
    rgb = rgb * alpha[..., None] + ground * (1 - alpha[..., None])  # flatten any transparency onto the ground
    corners = np.full(3, ground) if ground == 0 else np.array([rgb[2, 2], rgb[2, -3], rgb[-3, 2], rgb[-3, -3]]).mean(axis=0)
    dist = np.sqrt(((rgb - corners) ** 2).sum(axis=-1))
    mask = np.clip((dist - 24) / 90, 0, 1)
    if ground == 0:  # keep only what is inside the box: its antialiased outer edge is not part of the mark
        inside = ndimage.binary_erosion(alpha > 0.98, iterations=6)
        mask = mask * inside
    ys, xs = np.where(mask > 0.05)
    mask = mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    out = np.zeros(mask.shape + (4,), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = (mask * 255).astype(np.uint8)
    img = Image.fromarray(out)
    if img.height > 120:
        img = img.resize((round(img.width * 120 / img.height), 120), Image.LANCZOS)
    img.save(os.path.join(OUT, f"client-{name}.png"), optimize=True)
    return img.size


for name, (src, width, crop) in PHOTOS.items():
    print(name, photo(name, src, width, crop))
for name, src in LOGOS.items():
    print("logo", name, logo(name, src))

film = os.path.join(SRC, "film-v8h5CIaImbg.mp4")
audio = os.path.join(SRC, "film-v8h5CIaImbg.m4a")
if os.path.exists(film) and os.path.exists(audio):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", film, "-i", audio, "-map", "0:v", "-map", "1:a",
                    "-vf", "scale=1280:720", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", os.path.join(OUT, "maverick-film.mp4")], check=True)
    print("film", os.path.getsize(os.path.join(OUT, "maverick-film.mp4")) // 1024, "KB")
