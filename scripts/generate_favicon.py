"""
Convert the generated nacho icon PNG to a proper multi-resolution favicon.ico.
Uses struct to manually build the ICO file format since Pillow's ICO save
only stores a single resolution.
"""
import io
import os
import struct
from PIL import Image


def build_ico(images):
    """
    Build an ICO file from a list of PIL Image objects.
    Each image is stored as a PNG inside the ICO container.
    """
    num = len(images)

    # ICO header: 3 x uint16 (reserved=0, type=1 for ICO, count)
    header = struct.pack("<HHH", 0, 1, num)

    # Each directory entry is 16 bytes
    # After header + all directory entries, the image data begins
    data_offset = 6 + 16 * num

    entries = []
    png_datas = []

    for img in images:
        w, h = img.size
        # Save image as PNG to bytes
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        png_bytes = buf.getvalue()

        # Width and height: 0 means 256
        bw = w if w < 256 else 0
        bh = h if h < 256 else 0

        entry = struct.pack(
            "<BBBBHHII",
            bw,           # width
            bh,           # height
            0,            # color palette count
            0,            # reserved
            1,            # color planes
            32,           # bits per pixel
            len(png_bytes),  # size of PNG data
            data_offset,  # offset to PNG data
        )
        entries.append(entry)
        png_datas.append(png_bytes)
        data_offset += len(png_bytes)

    # Assemble the file
    ico = header
    for e in entries:
        ico += e
    for d in png_datas:
        ico += d

    return ico


def main():
    source = os.path.join(
        os.path.expanduser("~"),
        ".gemini", "antigravity", "brain",
        "9e0994f7-6abd-415f-b836-54f23ed629ce",
        "nacho_icon_big_1779315432250.png",
    )

    print(f"Loading source: {source}")
    img = Image.open(source).convert("RGBA")
    print(f"Source size: {img.size}")

    # Generate favicon sizes
    sizes = [16, 32, 48, 64, 128, 256]
    resized = []
    for sz in sizes:
        r = img.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.append(r)
        print(f"  Resized to {sz}x{sz}")

    # Build proper multi-resolution ICO
    ico_bytes = build_ico(resized)
    target_ico = os.path.join("src", "app", "favicon.ico")
    with open(target_ico, "wb") as f:
        f.write(ico_bytes)
    print(f"\nSaved favicon.ico: {len(ico_bytes):,} bytes ({len(sizes)} sizes)")

    # Save as 512x512 PNG for Next.js icon metadata
    target_png = os.path.join("src", "app", "icon.png")
    icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(target_png, format="PNG")
    print(f"Saved icon.png: {os.path.getsize(target_png):,} bytes")

    # 180x180 apple-touch-icon
    target_apple = os.path.join("src", "app", "apple-icon.png")
    apple = img.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save(target_apple, format="PNG")
    print(f"Saved apple-icon.png: {os.path.getsize(target_apple):,} bytes")

    print("\nDone!")


if __name__ == "__main__":
    main()
