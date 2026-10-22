# Atik & Punom — A love, forever.

A mobile-first love letter for Punom: a hand-drawn-style animated couple portrait, a personal Bengali letter, floating hearts, and optional music-box audio.

## View online

After GitHub Pages deployment: **https://atikx2.github.io/love/**

GitHub → Actions → **Deploy love story** shows deployment progress. Pages must use **GitHub Actions** as its source (Settings → Pages → Build and deployment). The workflow supports `main` and this Arena session branch.

## Local preview

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open http://localhost:3000. Use a server rather than opening `index.html` directly because the SVG is fetched for its drawing animation.

## Personalize

- Names, dedication and the letter: `index.html`.
- Colors, layout and animation: `style.css`.
- Drawing, replay, hearts and opt-in synthesized music: `app.js`.
- `assets/portrait.png` is an AI-created illustration based on the supplied photo; it is not an exact photographic likeness. `assets/portrait.svg` contains its traced outlines. The original private photo is **not** included in this repository or deployment. This is a public site: its illustration, names and message are public.
- To regenerate SVG after editing the illustration, install `opencv-python-headless` in a Python virtual environment and run `scripts/trace-portrait.py` from the repository root.

No third-party runtime scripts, remote fonts, analytics, or tracking. Bengali text uses a bundled Noto Sans Bengali font (SIL Open Font License, included in `assets/fonts/OFL.txt`). Sound is off until tapped. Reduced-motion preferences are respected. The letter supports Escape, focus trapping and keyboard controls via a native dialog.

## Tests

```sh
npm ci
npx playwright install chromium
npm test
```
