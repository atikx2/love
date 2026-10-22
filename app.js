'use strict';
const portrait = document.querySelector('#portrait');
const statusText = document.querySelector('#drawing-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let drawingTimer;
function animatePortrait() {
  clearTimeout(drawingTimer);
  portrait.classList.remove('done');
  const svg = portrait.querySelector('svg');
  if (!svg) return;
  // Reinsert the paths to restart their stroke animation without a page reload.
  const fresh = svg.cloneNode(true);
  svg.replaceWith(fresh);
  statusText.textContent = reducedMotion.matches ? 'You & me. A beautiful forever.' : 'Drawing our little forever…';
  drawingTimer = setTimeout(() => {
    portrait.classList.add('done');
    statusText.textContent = 'You & me. A beautiful forever.';
  }, reducedMotion.matches ? 0 : 6200);
}
fetch('assets/portrait.svg').then(response => {
  if (!response.ok) throw new Error('Portrait could not load');
  return response.text();
}).then(svg => {
  portrait.innerHTML = svg;
  const finished = new Image();
  finished.src = 'assets/portrait.png';
  finished.alt = '';
  finished.className = 'portrait-finished';
  portrait.append(finished);
  animatePortrait();
}).catch(() => {
  const image = new Image();
  image.src = 'assets/portrait.png';
  image.alt = 'Illustrated portrait of Atik and Punom';
  image.style.cssText = 'width:100%;mix-blend-mode:screen';
  portrait.append(image);
  statusText.textContent = 'You & me. A beautiful forever.';
});
document.querySelector('#replay').addEventListener('click', animatePortrait);
const stars = document.querySelector('#stars');
for (let i = 0; i < 42; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.cssText = `left:${(i * 37.71) % 100}%;top:${(i * 23.13) % 100}%;animation-delay:-${i % 5}s`;
  stars.append(star);
}
const letter = document.querySelector('#letter');
function celebrate() {
  if (reducedMotion.matches) return;
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = i % 2 ? '♡' : '♥';
    heart.style.cssText = `left:${Math.random()*100}%;font-size:${12+Math.random()*20}px;--drift:${Math.random()*140-70}px;animation-delay:${Math.random()*.8}s`;
    document.querySelector('#celebration').append(heart);
    setTimeout(() => heart.remove(), 4500);
  }
}
document.querySelector('#open-letter').addEventListener('click', () => {
  letter.showModal();
  document.body.classList.add('modal-open');
  celebrate();
});
document.querySelector('#close-letter').addEventListener('click', () => letter.close());
letter.addEventListener('close', () => document.body.classList.remove('modal-open'));
letter.addEventListener('click', event => {
  const rect = letter.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) letter.close();
});
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
