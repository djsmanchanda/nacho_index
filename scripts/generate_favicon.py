"""Generate transparent app icons from public/nacho-icon.png.

The source logo was generated as a rounded-square app icon. For the site header
and favicon we keep only the nacho mark, removing the baked-in dark plate.
"""

import io
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "nacho-icon.png"


def build_triangle_mask(size: tuple[int, int]) -> Image.Image:
    width, height = size
    scale = 4
    mask = Image.new("L", (width * scale, height * scale), 0)
    draw = ImageDraw.Draw(mask)
    points = [
        (0.50 * width * scale, 0.155 * height * scale),
        (0.135 * width * scale, 0.765 * height * scale),
        (0.865 * width * scale, 0.765 * height * scale),
    ]
    draw.polygon(points, fill=255)
    return mask.resize(size, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.25))


def isolate_nacho_mark(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    width, height = img.size
    mask = build_triangle_mask((width, height))
    output = Image.new("RGBA", img.size, (0, 0, 0, 0))
    source_pixels = img.load()
    output_pixels = output.load()
    mask_pixels = mask.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = source_pixels[x, y]
            mask_alpha = mask_pixels[x, y]
            if alpha == 0 or mask_alpha == 0:
                continue

            warm_chip_or_cheese = red > blue + 5 and green > blue - 4 and red > 24
            white_background = red > 238 and green > 238 and blue > 238
            if not warm_chip_or_cheese or white_background:
                continue

            output_pixels[x, y] = (red, green, blue, int(alpha * mask_alpha / 255))

    return output


def square_with_padding(img: Image.Image, padding_ratio: float = 0.18) -> Image.Image:
    bbox = img.getbbox()
    if bbox is None:
        raise ValueError("Logo isolation produced an empty image")

    cropped = img.crop(bbox)
    side = int(max(cropped.size) * (1 + padding_ratio))
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.alpha_composite(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    return square


def build_ico(images: list[Image.Image]) -> bytes:
    header = struct.pack("<HHH", 0, 1, len(images))
    data_offset = 6 + 16 * len(images)
    entries: list[bytes] = []
    png_datas: list[bytes] = []

    for img in images:
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        png_bytes = buffer.getvalue()
        width, height = img.size
        entries.append(
            struct.pack(
                "<BBBBHHII",
                width if width < 256 else 0,
                height if height < 256 else 0,
                0,
                0,
                1,
                32,
                len(png_bytes),
                data_offset,
            )
        )
        png_datas.append(png_bytes)
        data_offset += len(png_bytes)

    return header + b"".join(entries) + b"".join(png_datas)


def main() -> None:
    mark = square_with_padding(isolate_nacho_mark(Image.open(SOURCE)))

    for target, size in [
        (ROOT / "public" / "nacho-icon.png", 512),
        (ROOT / "src" / "app" / "icon.png", 512),
        (ROOT / "src" / "app" / "apple-icon.png", 180),
    ]:
        mark.resize((size, size), Image.Resampling.LANCZOS).save(target, format="PNG")

    ico_sizes = [16, 32, 48, 64, 128, 256]
    ico_images = [mark.resize((size, size), Image.Resampling.LANCZOS) for size in ico_sizes]
    (ROOT / "src" / "app" / "favicon.ico").write_bytes(build_ico(ico_images))


if __name__ == "__main__":
    main()
