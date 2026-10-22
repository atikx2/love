"""Trace an illustrated portrait into animated SVG outlines.

Requires opencv-python-headless. Handles PNG and WebP with transparency.
Examples:
    python scripts/trace-portrait.py
    python scripts/trace-portrait.py --source assets/portraits/memory-01.webp --output assets/portraits/memory-01.svg --threshold 65
"""
import argparse
from pathlib import Path
import cv2


def trace(source, output, threshold=95):
    image = cv2.imread(str(source), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise ValueError(f'Cannot decode portrait: {source}')
    height, width = image.shape[:2]
    if image.ndim == 3 and image.shape[2] == 4:
        alpha = image[:, :, 3:4].astype('float32') / 255
        image = (image[:, :, :3] * alpha).astype('uint8')
    gray = image if image.ndim == 2 else cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(
        [c for c in contours if cv2.arcLength(c, True) > 30],
        key=lambda c: cv2.boundingRect(c)[1],
    )
    paths = []
    for i, contour in enumerate(contours):
        points = cv2.approxPolyDP(contour, 0.65, True).reshape(-1, 2)
        d = 'M' + ' L'.join(f'{x},{y}' for x, y in points) + ' Z'
        delay = i / max(len(contours) - 1, 1) * 3
        paths.append(f'<path d="{d}" pathLength="1" style="--delay:{delay:.3f}s"/>')
    if not paths:
        raise ValueError(f'No usable outline paths found: {source}')
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        'fill="none" stroke="currentColor" stroke-width="1.25" '
        'stroke-linejoin="round" stroke-linecap="round">' + ''.join(paths) + '</svg>'
    )
    print(f'{output}: {len(paths)} animated paths')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', default='assets/portrait.png')
    parser.add_argument('--output', default='assets/portrait.svg')
    parser.add_argument('--threshold', type=int, default=95)
    args = parser.parse_args()
    trace(args.source, args.output, args.threshold)
