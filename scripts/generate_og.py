from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "og-image.jpg"
PHOTO = ROOT / "photos" / "bebeklik.jpeg"

W, H = 1200, 630
BG = (251, 246, 240)
BURGUNDY = (114, 47, 55)
GOLD = (201, 168, 76)
MUTED = (122, 101, 101)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# subtle vignette bands
for y in range(H):
    t = abs(y - H / 2) / (H / 2)
    shade = int(8 * t)
    draw.line([(0, y), (W, y)], fill=(BG[0] - shade, BG[1] - shade, BG[2] - shade))

# decorative frame area
frame_w, frame_h = 280, 360
frame_x = 120
frame_y = (H - frame_h) // 2
draw.rectangle(
    [frame_x - 8, frame_y - 8, frame_x + frame_w + 8, frame_y + frame_h + 8],
    outline=GOLD,
    width=3,
)
draw.rectangle(
    [frame_x - 3, frame_y - 3, frame_x + frame_w + 3, frame_y + frame_h + 3],
    outline=(232, 213, 163),
    width=1,
)

photo = Image.open(PHOTO).convert("RGB")
# Alttaki telefon arayüzünü kırp
pw, ph = photo.size
photo = photo.crop((0, 0, pw, int(ph * 0.92)))
photo = photo.resize((frame_w, frame_h), Image.Resampling.LANCZOS)
img.paste(photo, (frame_x, frame_y))

# right side text block
try:
    serif = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 72)
    serif_sm = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 34)
    sans = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)
    sans_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)
except OSError:
    serif = ImageFont.load_default()
    serif_sm = ImageFont.load_default()
    sans = ImageFont.load_default()
    sans_sm = ImageFont.load_default()

text_x = 470
draw.text((text_x, 150), "DAVETİYE", fill=GOLD, font=sans_sm)
draw.text((text_x, 195), "Naz & Yakup", fill=BURGUNDY, font=serif)

draw.line([(text_x, 290), (text_x + 280, 290)], fill=GOLD, width=2)
draw.text((text_x, 320), "2 Ekim · Kına Gecesi", fill=MUTED, font=sans)
draw.text((text_x, 365), "3 Ekim · Yemekli Eğlence", fill=MUTED, font=sans)
draw.text((text_x, 430), "İzmir · 2026", fill=GOLD, font=sans_sm)

# corner ornaments
for corner in [(40, 40), (W - 90, 40), (40, H - 90), (W - 90, H - 90)]:
    x, y = corner
    draw.line([(x, y), (x + 50, y)], fill=GOLD, width=2)
    draw.line([(x, y), (x, y + 50)], fill=GOLD, width=2)

img.save(OUT, "JPEG", quality=92, optimize=True)
print(f"Created {OUT}")
