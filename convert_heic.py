#!/usr/bin/env python3
"""Convert HEIC/HEIF photos to JPEG or PNG.

Install once:
    py -m pip install Pillow pillow-heif

Examples:
    py convert_heic.py "C:\\Photos" --format jpeg
    py convert_heic.py "C:\\Photos\\image.heic" --format png
    py convert_heic.py "C:\\Photos" --format jpeg --output "C:\\Converted"
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
    import pillow_heif
except ImportError:
    print("Missing required packages. Install them with:")
    print("  py -m pip install Pillow pillow-heif")
    raise SystemExit(1)


HEIF_EXTENSIONS = {".heic", ".heif"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert HEIC/HEIF photos to JPEG or PNG."
    )
    parser.add_argument("source", type=Path, help="A HEIC/HEIF file or a folder of photos")
    parser.add_argument(
        "--format", "-f", choices=("jpeg", "png"), default="jpeg",
        help="Output format (default: jpeg)",
    )
    parser.add_argument(
        "--output", "-o", type=Path,
        help="Destination folder. Defaults to a 'converted' folder beside the source.",
    )
    parser.add_argument(
        "--quality", "-q", type=int, default=95,
        help="JPEG quality from 1 to 100 (default: 95; ignored for PNG)",
    )
    parser.add_argument(
        "--overwrite", action="store_true",
        help="Replace an existing converted file instead of skipping it.",
    )
    return parser.parse_args()


def output_folder(source: Path, requested: Path | None) -> Path:
    if requested:
        return requested
    return (source.parent if source.is_file() else source) / "converted"


def photos_to_convert(source: Path) -> list[Path]:
    if source.is_file():
        return [source] if source.suffix.lower() in HEIF_EXTENSIONS else []
    return [path for path in source.rglob("*") if path.is_file() and path.suffix.lower() in HEIF_EXTENSIONS]


def convert(source: Path, destination: Path, image_format: str, quality: int) -> None:
    pillow_heif.register_heif_opener()
    with Image.open(source) as image:
        # Apply the iPhone camera orientation before saving the new file.
        image = ImageOps.exif_transpose(image)
        if image_format == "jpeg":
            # JPEG cannot store transparency.
            if image.mode not in ("RGB", "L"):
                background = Image.new("RGB", image.size, "white")
                if "A" in image.getbands():
                    background.paste(image, mask=image.getchannel("A"))
                else:
                    background.paste(image.convert("RGB"))
                image = background
            image.save(destination, "JPEG", quality=quality, optimize=True, exif=image.getexif())
        else:
            image.save(destination, "PNG", optimize=True)

    # Keep the source photo's modified timestamp where the operating system permits it.
    stat = source.stat()
    os.utime(destination, (stat.st_atime, stat.st_mtime))


def main() -> int:
    args = parse_args()
    source = args.source.expanduser().resolve()
    if not source.exists():
        print(f"Source not found: {source}", file=sys.stderr)
        return 2
    if not 1 <= args.quality <= 100:
        print("--quality must be between 1 and 100.", file=sys.stderr)
        return 2

    photos = photos_to_convert(source)
    if not photos:
        print("No .heic or .heif files found.")
        return 0

    target_root = output_folder(source, args.output).expanduser().resolve()
    extension = ".jpg" if args.format == "jpeg" else ".png"
    converted = skipped = failed = 0

    for photo in photos:
        relative_parent = photo.parent.relative_to(source) if source.is_dir() else Path()
        destination = target_root / relative_parent / f"{photo.stem}{extension}"
        destination.parent.mkdir(parents=True, exist_ok=True)

        if destination.exists() and not args.overwrite:
            print(f"Skipped (already exists): {destination}")
            skipped += 1
            continue
        try:
            convert(photo, destination, args.format, args.quality)
            print(f"Converted: {photo.name} -> {destination}")
            converted += 1
        except Exception as exc:  # Continue processing the remaining photos.
            print(f"Failed: {photo} ({exc})", file=sys.stderr)
            failed += 1

    print(f"\nDone: {converted} converted, {skipped} skipped, {failed} failed.")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
