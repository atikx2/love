"""Turn the illustrated portrait into lightweight paths for a real drawing animation.
Requires opencv-python-headless. The original personal photo is not stored here.
"""
from pathlib import Path
import cv2
img = cv2.imread('assets/portrait.png', cv2.IMREAD_UNCHANGED)
if img.shape[2] == 4:
    alpha = img[:, :, 3:4].astype('float32') / 255
    img = (img[:, :, :3] * alpha).astype('uint8')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, mask = cv2.threshold(gray, 95, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
contours = sorted([c for c in contours if cv2.arcLength(c, True) > 35], key=lambda c: cv2.boundingRect(c)[1])
paths = []
for i, c in enumerate(contours):
    c = cv2.approxPolyDP(c, 0.65, True)
    pts = c.reshape(-1,2)
    d = 'M' + ' L'.join(f'{x},{y}' for x,y in pts) + ' Z'
    paths.append(f'<path d="{d}" pathLength="1" style="--delay:{i/max(len(contours)-1,1)*3:.3f}s"/>')
Path('assets/portrait.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">'+''.join(paths)+'</svg>')
print(f'Traced {len(paths)} portrait paths')
