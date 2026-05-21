"""Generate transparent PNG and ICO app icons from public/nacho-icon.png."""

import io
import struct
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "nacho-icon.png"


def make_edge_white_transparent(img: Image.Image, threshold: int = 238) -> Image.Image:
    img = img.convert("RGBA")
    width, height = img.size
    pixels = img.load()
    seen: set[tuple[int, int]] = set()
    stack: list[tuple[int, int]] = []

    for x in range(width):
        stack.extend([(x, 0), (x, height - 1)])
    for y in range(height):
        stack.extend([(0, y), (width - 1, y)])

    while stack:
        x, y = stack.pop()
        if (x, y) in seen or x < 0 or y < 0 or x >= width or y >= height:
            continue
        seen.add((x, y))

        red, green, blue, alpha = pixels[x, y]
        if not (alpha > 0 and red >= threshold and green >= threshold and blue >= threshold):
            continue

        pixels[x, y] = (255, 255, 255, 0)
        stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return img


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


def resized_icon(source: Image.Image, size: int) -> Image.Image:
    resized = source.resize((size, size), Image.Resampling.LANCZOS)
    return make_edge_white_transparent(resized)


def main() -> None:
    source = make_edge_white_transparent(Image.open(SOURCE))

    source.save(ROOT / "public" / "nacho-icon.png", format="PNG")
    source.save(ROOT / "src" / "app" / "icon.png", format="PNG")
    resized_icon(source, 180).save(ROOT / "src" / "app" / "apple-icon.png", format="PNG")

    ico_sizes = [16, 32, 48, 64, 128, 256]
    ico_images = [resized_icon(source, size) for size in ico_sizes]
    (ROOT / "src" / "app" / "favicon.ico").write_bytes(build_ico(ico_images))


if __name__ == "__main__":
    main()
