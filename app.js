'use strict';
const portrait = document.querySelector('#portrait');
const statusText = document.querySelector('#drawing-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const invitation = document.querySelector('#open-letter');
const letter = document.querySelector('#letter');
const memories = window.LOVE_MEMORIES || [];
const previousButton = document.querySelector('#previous-memory');
const nextButton = document.querySelector('#next-memory');
const autoplayButton = document.querySelector('#gallery-autoplay');
const dots = document.querySelector('#gallery-dots');
let index = 0, inView = false, ready = false, loading = false, failed = false;
let elapsed = 0, lastFrame = 0, frameId = 0, renderVersion = 0;
let drawingDuration = 6200, revealDuration = 7300;
let autoplay = !reducedMotion.matches, completed = false;
portrait.setAttribute('aria-busy', 'false');
function updateNavigation() {
  previousButton.disabled = nextButton.disabled = memories.length < 2;
  autoplayButton.hidden = memories.length < 2;
  autoplayButton.setAttribute('aria-pressed', String(autoplay));
  autoplayButton.setAttribute('aria-label', autoplay ? 'Pause automatic slideshow' : 'Resume automatic slideshow');
  autoplayButton.textContent = autoplay ? 'Ⅱ' : '▷';
  document.querySelector('#gallery-count').textContent = `${String(index + 1).padStart(2,'0')} / ${String(memories.length).padStart(2,'0')}`;
  dots.replaceChildren();
  memories.forEach((memory, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `View memory ${i+1}`);
    dot.setAttribute('aria-current', String(i === index));
    dot.addEventListener('click', () => selectMemory(i));
    dots.append(dot);
  });
  document.querySelector('#gallery-hint').textContent = memories.length > 1 ? 'Swipe to wander through our memories' : 'One moment. A thousand feelings.';
}
function pauseDrawing() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  lastFrame = 0;
  portrait.classList.remove('is-playing');
}
function finishDrawing() {
  portrait.classList.add('done');
  if (!completed && elapsed >= revealDuration) {
    completed = true;
    invitation.hidden = false;
    portrait.setAttribute('aria-busy', 'false');
    statusText.textContent = 'You & me. A beautiful forever.';
  }
}
function tick(now) {
  frameId = 0;
  if (!inView || document.hidden || letter.open || !ready) {pauseDrawing(); return;}
  if (lastFrame) elapsed += Math.min(now - lastFrame, 100);
  lastFrame = now;
  if (reducedMotion.matches) elapsed = Math.max(elapsed, revealDuration);
  if (elapsed >= drawingDuration) finishDrawing();
  if (completed && autoplay && memories.length > 1 && elapsed >= revealDuration + 8000) {
    selectMemory(index + 1); return;
  }
  if (!completed || (autoplay && memories.length > 1)) frameId = requestAnimationFrame(tick);
  else lastFrame = 0;
}
function resumeDrawing() {
  if (!inView || !ready || document.hidden || letter.open) return;
  portrait.classList.add('started', 'is-playing');
  if (!frameId) { lastFrame = 0; frameId = requestAnimationFrame(tick); }
}
async function loadMemory() {
  if (loading || !memories.length) return;
  loading = true;
  const version = ++renderVersion;
  const memory = memories[index];
  ready = false; failed = false; completed = false; elapsed = 0;
  pauseDrawing();
  invitation.hidden = true;
  portrait.className = 'portrait-art';
  portrait.replaceChildren();
  portrait.setAttribute('aria-label', memory.alt);
  portrait.setAttribute('aria-busy', 'true');
  statusText.textContent = 'Preparing our little moment…';
  document.querySelector('.portrait-caption p').textContent = memory.caption;
  const image = new Image();
  image.src = memory.image;
  image.alt = '';
  image.className = 'portrait-finished';
  // Decode the image before starting; never use network time as animation time.
  const imageReady = image.decode().then(() => true).catch(() => false);
  let svg;
  if (memory.drawing) {
    try {
      const response = await fetch(memory.drawing);
      if (!response.ok) throw new Error('Portrait unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (doc.documentElement.localName === 'svg') svg = document.importNode(doc.documentElement, true);
    } catch { /* The illustrated image still has a reveal animation offline. */ }
  }
  const hasImage = await imageReady;
  if (version !== renderVersion) return;
  if (svg) portrait.append(svg);
  if (hasImage) portrait.append(image);
  if (!svg && !hasImage) {
    failed = true;
    statusText.textContent = 'This moment could not load. Tap Replay to retry.';
    portrait.setAttribute('aria-busy', 'false');
    loading = false;
    return;
  }
  if (!hasImage) portrait.classList.add('svg-only');
  if (!svg) portrait.classList.add('is-photo');
  drawingDuration = svg ? 6200 : 3000;
  revealDuration = drawingDuration + 1100;
  ready = true; loading = false;
  statusText.textContent = inView ? (svg ? 'Drawing our little forever…' : 'A memory, unfolding…') : 'Scroll to draw our little forever';
  resumeDrawing();
}
function selectMemory(nextIndex) {
  index = (nextIndex + memories.length) % memories.length;
  // Cancel any pending decode/fetch before changing slides.
  renderVersion++;
  loading = false;
  updateNavigation();
  loadMemory();
}
const observer = new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .4;
  if (inView) {
    if (!ready && !loading && !failed) loadMemory();
    else resumeDrawing();
  } else pauseDrawing();
}, {threshold:[0,.4]});
observer.observe(portrait);
updateNavigation();
document.querySelector('#replay').addEventListener('click', () => {
  if (!ready || failed) { loading = false; loadMemory(); return; }
  pauseDrawing();
  elapsed = 0; completed = false; invitation.hidden = true;
  portrait.classList.remove('done','started');
  // Reinsert the artwork to restart both line and photographic reveal animations.
  Array.from(portrait.children).forEach(child => child.replaceWith(child.cloneNode(true)));
  statusText.textContent = portrait.classList.contains('is-photo') ? 'A memory, unfolding…' : 'Drawing our little forever…';
  resumeDrawing();
});
previousButton.addEventListener('click', () => selectMemory(index - 1));
nextButton.addEventListener('click', () => selectMemory(index + 1));
autoplayButton.addEventListener('click', () => {autoplay = !autoplay; elapsed = Math.min(elapsed, revealDuration); updateNavigation(); resumeDrawing();});
document.querySelector('.portrait-frame').addEventListener('keydown', event => {
  if (memories.length < 2 || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault(); selectMemory(index + (event.key === 'ArrowRight' ? 1 : -1));
});
let touchStart;
portrait.addEventListener('touchstart', event => {
  if (event.touches.length === 1) touchStart = {x:event.touches[0].clientX,y:event.touches[0].clientY};
}, {passive:true});
portrait.addEventListener('touchend', event => {
  if (!touchStart || memories.length < 2) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)*1.3) selectMemory(index + (dx < 0 ? 1 : -1));
}, {passive:true});
portrait.addEventListener('touchcancel', () => {touchStart = null;}, {passive:true});
const stars = document.querySelector('#stars');
for (let i = 0; i < 36; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.cssText = `left:${(i*37.71)%100}%;top:${(i*23.13)%100}%;animation-delay:-${i%5}s`;
  stars.append(star);
}
function celebrate() {
  if (reducedMotion.matches) return;
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart'; heart.textContent = i%2 ? '♡' : '♥';
    heart.style.cssText = `left:${Math.random()*100}%;font-size:${12+Math.random()*20}px;--drift:${Math.random()*140-70}px;animation-delay:${Math.random()*.8}s`;
    document.querySelector('#celebration').append(heart);
    setTimeout(() => heart.remove(),4500);
  }
}
const letterParts = letter.querySelectorAll('.letter-decoration,.eyebrow,h2,.letter-copy p,.letter-sign,.letter-end');
invitation.addEventListener('click', () => {
  pauseDrawing();
  letterParts.forEach((part,i) => {
    part.style.setProperty('--letter-delay',`${.15+i*.19}s`);
    part.classList.add('letter-reveal');
  });
  letter.showModal(); letter.scrollTop = 0;
  document.body.classList.add('modal-open');
  celebrate();
});
document.querySelector('#close-letter').addEventListener('click', () => letter.close());
letter.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  letterParts.forEach(part => part.classList.remove('letter-reveal'));
  resumeDrawing();
});
letter.addEventListener('click', event => {
  const rect = letter.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) letter.close();
});
document.addEventListener('visibilitychange', () => {if (document.hidden) pauseDrawing(); else resumeDrawing();});
reducedMotion.addEventListener('change', () => {if (reducedMotion.matches) {autoplay = false; updateNavigation();} resumeDrawing();});
// A quiet original music-box motif, generated locally. No tracking, audio files or autoplay.
let audioContext, melodyTimer;
const activeNotes = new Set();
const soundButton = document.querySelector('#sound');
const melody = [261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,329.63,392,440,392,329.63,293.66,261.63];
let noteIndex = 0;
function playNote() {
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.value = melody[noteIndex++ % melody.length];
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(.065, now+.025);
  gain.gain.exponentialRampToValueAtTime(.001, now+1.8);
  osc.connect(gain).connect(audioContext.destination);
  activeNotes.add(osc);
  osc.onended = () => {activeNotes.delete(osc); osc.disconnect(); gain.disconnect();};
  osc.start(now); osc.stop(now+1.9);
}
function stopMusic() {
  clearInterval(melodyTimer);
  activeNotes.forEach(osc => { try { osc.stop(); } catch {} });
  soundButton.setAttribute('aria-pressed', 'false');
  document.querySelector('#sound-label').textContent = 'Sound off';
}
soundButton.addEventListener('click', async () => {
  if (soundButton.getAttribute('aria-pressed') === 'true') {stopMusic(); return;}
  try {
    const AudioAPI = window.AudioContext || window.webkitAudioContext;
    if (!AudioAPI) throw new Error('Audio is unavailable');
    audioContext ||= new AudioAPI();
    await audioContext.resume();
    soundButton.setAttribute('aria-pressed', 'true');
    document.querySelector('#sound-label').textContent = 'Sound on';
    playNote();
    melodyTimer = setInterval(playNote, 650);
  } catch {
    document.querySelector('#sound-label').textContent = 'Sound unavailable';
    soundButton.setAttribute('aria-pressed','false');
  }
});
document.addEventListener('visibilitychange', () => {if (document.hidden) stopMusic();});
