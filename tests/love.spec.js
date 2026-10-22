const {test,expect}=require('@playwright/test');
const letterText = 'পুনম,তোমাকে ভালোবাসি—কথাটা ছোট, কিন্তু এর ভেতরেই আমার পুরো পৃথিবীটা লুকিয়ে আছে। তোমার হাসি, তোমার পাশে থাকা, তোমার সঙ্গে কাটানো ছোট্ট ছোট্ট মুহূর্তগুলোই আমার সবচেয়ে বড় পাওয়া।সব দিন একরকম হবে না। তবু প্রতিটা দিন, প্রতিটা গল্পে, আমি তোমার হাতটাই ধরে রাখতে চাই। আজ, আগামীকাল, আর আমাদের সবগুলো আগামীতে।তুমি শুধু আমার ভালোবাসা নও,তুমি আমার ঘর।';
async function revealPortrait(page) {
  await page.locator('#portrait').scrollIntoViewIfNeeded();
  await expect(page.locator('#portrait')).toHaveClass(/started/);
}
test('art starts only in view, letter waits for completion, replay resets it',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page).toHaveTitle(/Atik & Punom/);
 if (testInfo.project.name === 'mobile') {
   await page.waitForTimeout(500);
   expect(await page.locator('#portrait svg').count()).toBe(0);
   await expect(page.locator('#open-letter')).toBeHidden();
 }
 await revealPortrait(page);
 await expect(page.locator('#open-letter')).toBeHidden();
 expect(await page.locator('#portrait path').count()).toBeGreaterThan(30);
 await expect(page.locator('#open-letter')).toBeVisible({timeout:12000});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'A little letter for you'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('.letter-copy')).toHaveText(letterText);
 expect(await page.locator('.letter-copy p.letter-reveal').count()).toBe(4);
 await page.getByRole('button',{name:'Close letter'}).click();
 await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('#replay').click();
 await expect(page.locator('#open-letter')).toBeHidden();
 await expect(page.locator('#drawing-status')).toHaveText('Drawing our little forever…');
 if (await page.locator('#sound').getAttribute('aria-pressed') === 'true') await page.locator('#sound').click();
 await page.locator('#sound').click();
 await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');
 await page.locator('#sound').click();
 await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');
 expect(errors).toEqual([]);
});
test('reduced motion reveals immediately on arrival and dialog supports Escape',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await revealPortrait(page);
 await expect(page.locator('#portrait')).toHaveClass(/done/);
 await expect(page.locator('#open-letter')).toBeVisible();
 await page.locator('#open-letter').click();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
 await expect(page.locator('#previous-memory')).toBeEnabled();
 await expect(page.locator('#next-memory')).toBeEnabled();
 await expect(page.locator('#gallery-count')).toHaveText('01 / 09');
});
async function multiMemoryFixture(page) {
 await page.route('**/memories.js',route=>route.fulfill({contentType:'application/javascript',body:`window.LOVE_MEMORIES=[{image:'assets/portrait-rose.png',drawing:'assets/portrait.svg',alt:'First memory',caption:'First memory'},{image:'assets/portrait-rose.png',alt:'Second memory',caption:'Second memory'}];`}));
}
test('multiple photos support arrows, swipe and replay without fake production slides',async({page})=>{
 await multiMemoryFixture(page);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await revealPortrait(page);
 await page.locator('#next-memory').click();
 await expect(page.locator('#portrait')).toHaveClass(/is-photo/);
 await expect(page.locator('#portrait')).toHaveClass(/done/);
 await expect(page.locator('#gallery-count')).toHaveText('02 / 02');
 await expect(page.locator('#portrait')).toHaveAttribute('aria-label','Second memory');
 await page.locator('#portrait').evaluate(el => {
   const start = new Event('touchstart'); Object.defineProperty(start,'touches',{value:[{clientX:300,clientY:400}]});el.dispatchEvent(start);
   const end = new Event('touchend'); Object.defineProperty(end,'changedTouches',{value:[{clientX:100,clientY:402}]});el.dispatchEvent(end);
 });
 await expect(page.locator('#gallery-count')).toHaveText('01 / 02');
 await expect(page.locator('#portrait')).toHaveClass(/done/);
 await page.locator('#previous-memory').click();
 await expect(page.locator('#gallery-count')).toHaveText('02 / 02');
 await expect(page.locator('#open-letter')).toBeVisible();
 await page.locator('#replay').click();
 await expect(page.locator('#open-letter')).toBeVisible();
});
test('autoplay waits until reveal is complete and can be paused',async({page})=>{
 await multiMemoryFixture(page);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await revealPortrait(page);
 await expect(page.locator('#open-letter')).toBeVisible();
 await page.clock.install();
 await page.locator('#gallery-autoplay').click();
 await page.clock.runFor(7000);
 await expect(page.locator('#gallery-count')).toHaveText('01 / 02');
 await page.clock.runFor(1600);
 await expect(page.locator('#gallery-count')).toHaveText('02 / 02');
 await expect(page.locator('#portrait')).toHaveClass(/done/);
 await page.locator('#gallery-autoplay').click();
 await page.clock.runFor(15000);
 await expect(page.locator('#gallery-count')).toHaveText('02 / 02');
});
test('offscreen drawing pauses instead of finishing before you see it',async({page})=>{
 await page.goto('/');await revealPortrait(page);
 await page.waitForTimeout(300);
 await page.evaluate(()=>{document.body.style.paddingBottom='1800px';window.scrollTo(0,document.body.scrollHeight);});
 await expect(page.locator('#portrait')).not.toHaveClass(/is-playing/);
 await page.clock.install();await page.clock.runFor(10000);
 await expect(page.locator('#open-letter')).toBeHidden();
 await page.locator('#portrait').scrollIntoViewIfNeeded();
 await expect(page.locator('#portrait')).toHaveClass(/is-playing/);
});
test('failed SVG falls back to an animated image and still reveals the letter',async({page})=>{
 await page.route('**/assets/portrait.svg',route=>route.abort());
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await revealPortrait(page);
 await expect(page.locator('#portrait')).toHaveClass(/is-photo/);
 await expect(page.locator('#open-letter')).toBeVisible();
});
async function audioFixture(page, allowAutoplay) {
 await page.addInitScript(({allowAutoplay}) => {
   window.__audioStats = {attempts:0,pauses:0,playing:false};
   window.Audio = class {
     constructor(src) {this.src=src;}
     play() {
       window.__audioStats.attempts++;
       if (!allowAutoplay && !navigator.userActivation.isActive) return Promise.reject(new DOMException('Tap required','NotAllowedError'));
       window.__audioStats.playing=true;return Promise.resolve();
     }
     pause() {window.__audioStats.pauses++;window.__audioStats.playing=false;}
   };
 }, {allowAutoplay});
 await page.route('**/memories.js',route=>route.fulfill({contentType:'application/javascript',body:`window.LOVE_MEMORIES=[{image:'assets/portrait-gold.webp',drawing:'assets/portrait.svg',alt:'Our portrait',caption:'Our forever'}];window.LOVE_AUDIO_URL='assets/test-song.mp3';`}));
}
test('configured song attempts autoplay and falls back to a genuine tap; mute stays muted',async({page})=>{
 await audioFixture(page,false);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('#sound-label')).toHaveText('Tap for music');
 expect(await page.evaluate(()=>window.__audioStats.attempts)).toBe(1);
 await page.locator('.discover-link').click();
 await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');
 await page.locator('#sound').click();
 await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');
 await page.locator('#replay').click();
 await expect(page.locator('#sound-label')).toHaveText('Sound off');
 expect(await page.evaluate(()=>window.__audioStats.playing)).toBe(false);
});
test('configured song starts immediately when autoplay is permitted',async({page})=>{
 await audioFixture(page,true);
 await page.goto('/');
 await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>window.__audioStats.playing)).toBe(true);
 await page.locator('#sound').click();
 expect(await page.evaluate(()=>window.__audioStats.playing)).toBe(false);
});
test('all eight supplied photos decode, preserve full framing and wrap back to the portrait', async({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await revealPortrait(page);
 await expect(page.locator('#gallery-dots button')).toHaveCount(9);
 for (let i=1;i<=8;i++) {
   await page.locator('#next-memory').click();
   await expect(page.locator('#gallery-count')).toHaveText(`${String(i+1).padStart(2,'0')} / 09`);
   await expect(page.locator('#portrait')).toHaveClass(/done/);
   const image=page.locator('#portrait .portrait-finished');
   await expect(image).toHaveAttribute('src',`assets/memories/memory-${String(i).padStart(2,'0')}.webp`);
   expect(await image.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
   await expect(image).toHaveCSS('object-fit','contain');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.locator('#next-memory').click();
 await expect(page.locator('#gallery-count')).toHaveText('01 / 09');
 await expect(page.locator('#portrait svg')).toBeAttached();
 await expect(page.locator('#portrait')).toHaveClass(/done/);
});
test('nine-dot gallery fits small phones and does not eagerly download the whole album',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({reducedMotion:'reduce'});
 const photos=[];
 page.on('request',req=>{if(req.url().includes('/assets/memories/'))photos.push(req.url());});
 await page.goto('/');
 expect(photos).toEqual([]);
 await revealPortrait(page);
 await expect(page.locator('#open-letter')).toBeVisible();
 expect(new Set(photos).size).toBeLessThanOrEqual(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('#gallery-dots button')).toHaveCount(9);
});
