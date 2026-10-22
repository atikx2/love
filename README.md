# Atik & Punom — A love, forever.

A mobile-first, midnight-black/gold/rose love story for Punom: scroll-triggered portrait drawing, a breathing envelope, an animated Bengali letter, floating hearts, and browser-aware music playback. The original letter wording is unchanged.

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
- `assets/portrait-gold.webp` is the optimized transparent portrait for the dark background (about 141 KB vs 751 KB for the source PNG). The old rose variant is retained as a source asset only.
- `assets/portrait.png` is an AI-created illustration based on the supplied photo; it is not an exact photographic likeness. `assets/portrait.svg` contains its traced outlines. The original private photo is **not** included in this repository or deployment. This is a public site: its illustration, names and message are public.
- To regenerate SVG after editing the illustration, install `opencv-python-headless` in a Python virtual environment and run `scripts/trace-portrait.py` from the repository root.

No third-party runtime scripts, remote fonts, analytics, or tracking. Bengali text uses a bundled Noto Sans Bengali font (SIL Open Font License, included in `assets/fonts/OFL.txt`). Music attempts autoplay when the browser allows it; otherwise the sound button says **Tap for music** and the first genuine tap/Enter/Space unlocks it. Explicitly muting keeps it muted during subsequent interactions. Music pauses in background tabs. Reduced-motion preferences are respected. The letter supports Escape, focus trapping and keyboard controls via a native dialog.

## Audio configuration

The supplied YouTube Shorts link has **not** been downloaded or used as audio. The requested audio file has not been supplied yet. The current music is the original locally generated music-box placeholder, not the sound from that video.

Once Atik supplies an audio file he is allowed to publish, add it under `assets/` and set `window.LOVE_AUDIO_URL` in `memories.js` to its relative path (MP3/M4A recommended). This uses a looping HTML audio player instead of the placeholder. A YouTube watch/Shorts URL is not an audio-file URL. Audible autoplay remains subject to browser policy: no code can promise sound on page opening in every mobile browser. Blocked autoplay gets a real-gesture fallback, with no fake playing indicator.

## Mobile performance

- No full-screen backdrop blur, animated filters, or canvas render loop.
- Static decorative stars/ambient gradients; only the envelope and active sound bars loop.
- Photo reveal uses opacity/transform, not an animated clipping mask.
- Animation timing checks run every 100 ms, not every display frame, and stop offscreen or when complete. The SVG drawing itself uses CSS animation.
- Finished SVG path animations are removed; the completed portrait is a compressed WebP.
- Floating-heart burst reduced to 10 elements; continuous decorative motion pauses in background tabs and the envelope pauses offscreen.

## Tests

```sh
npm ci
npx playwright install chromium
npm test
```
