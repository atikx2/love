# Atik & Punom — A love, forever.

A mobile-first, rose/peach/lavender love story for Punom: scroll-triggered portrait drawing, a breathing envelope, an animated Bengali letter, floating hearts, and optional music-box audio. The original letter wording is unchanged.

## View online

After GitHub Pages deployment: **https://atikx2.github.io/love/**

The current Pages source is **Deploy from a branch → arena/61a8aab7-love → / (root)**. Pushing this branch updates the public site automatically. No settings changes are needed. If you later switch Pages to **GitHub Actions**, the included **Deploy love story** workflow supports `main` and this Arena session branch and can also be run manually.

### One-time mobile setup if Pages is not enabled

The connected GitHub integration may not have permission to enable Pages. The repository owner can open **Settings → Pages**, choose **Deploy from a branch**, select **arena/61a8aab7-love**, choose **/ (root)**, and tap **Save**. GitHub then builds the same static site without needing to merge any branch. Allow a few minutes for the first deployment. Alternatively enable **GitHub Actions** as source and rerun the deployment workflow for this branch.

## Local preview

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open http://localhost:3000. Use a server rather than opening `index.html` directly because the SVG is fetched for its drawing animation.

## Personalize

- Names, dedication and the letter: `index.html`.
- Colors, layout and animation: `style.css`.
- Drawing, viewport visibility, replay, slideshow, hearts and opt-in synthesized music: `app.js`.
- Gallery entries: `memories.js`. Only one illustration has been supplied so far; no duplicate/fake memories are shown. Add approved photos to `assets/` and list their relative paths, alt text and captions here. New photos get a wipe/zoom reveal; entries with a `drawing` SVG get line animation.
- For multiple memories: swipe horizontally, use previous/next arrows, dot buttons, or focus the frame and press Left/Right. Autoplay changes slides eight seconds **after** each full reveal; it pauses offscreen, in background tabs, and while the letter is open. The pause button gives explicit control. Autoplay defaults off for reduced motion.
- Illustration assets are fetched only when at least 40% of the art is visible. Drawing pauses offscreen; the letter appears after the drawing and image crossfade finish. Replay hides the letter until completion again. Reduced-motion visitors get an immediate reveal on entering the viewport.
- `assets/portrait-rose.png` is the rose-ink, transparent version used on the light background.
- `assets/portrait.png` is an AI-created illustration based on the supplied photo; it is not an exact photographic likeness. `assets/portrait.svg` contains its traced outlines. The original private photo is **not** included in this repository or deployment. This is a public site: its illustration, names and message are public.
- To regenerate SVG after editing the illustration, install `opencv-python-headless` in a Python virtual environment and run `scripts/trace-portrait.py` from the repository root.

No third-party runtime scripts, remote fonts, analytics, or tracking. Bengali text uses a bundled Noto Sans Bengali font (SIL Open Font License, included in `assets/fonts/OFL.txt`). Sound is off until tapped. Reduced-motion preferences are respected. The letter supports Escape, focus trapping and keyboard controls via a native dialog.

## Tests

```sh
npm ci
npx playwright install chromium
npm test
```
