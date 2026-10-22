// Add only photos Atik has chosen to publish. Relative paths work on GitHub Pages.
// New photo example: { image: 'assets/memory-02.jpg', alt: 'Our beautiful day', caption: 'Another day, another reason to choose you.' }
// Each photo gets a reveal animation; SVG entries get the line-drawing animation.
window.LOVE_MEMORIES = [
  {
    image: 'assets/portrait-gold.webp',
    drawing: 'assets/portrait.svg',
    alt: 'Line-art portrait of Atik and Punom, drawn from their photo',
    caption: 'My favourite place is beside you.'
  },
  {
    image: 'assets/portraits/memory-01.webp',
    drawing: 'assets/portraits/memory-01.svg',
    alt: 'Line-art portrait of Atik and Punom smiling together, dressed in pale green',
    caption: 'তোমার হাসিতেই আমার পৃথিবী রঙিন।'
  },
  {
    image: 'assets/portraits/memory-02.webp',
    drawing: 'assets/portraits/memory-02.svg',
    alt: 'Line-art portrait of Atik and Punom leaning close together in an evening selfie',
    caption: 'পাশে তুমি থাকলেই, সব মুহূর্ত সুন্দর।'
  },
  {
    image: 'assets/portraits/memory-03.webp',
    drawing: 'assets/portraits/memory-03.svg',
    alt: 'Line-art portrait of Atik kissing Punom on the forehead outdoors, with pink flowers in the foreground',
    caption: 'এই আদরটুকু, শুধু তোমার জন্য।'
  },
  {
    image: 'assets/portraits/memory-04.webp',
    drawing: 'assets/portraits/memory-04.svg',
    alt: 'Line-art portrait of Punom playfully making bunny ears behind Atik in a field',
    caption: 'তোমার সঙ্গে একটু দুষ্টুমি, অনেকটা ভালোবাসা।'
  },
  {
    image: 'assets/portraits/memory-05.webp',
    drawing: 'assets/portraits/memory-05.svg',
    alt: 'A close-up line-art portrait of Atik and Punom resting their heads together',
    caption: 'তোমার কাছেই আমার শান্তি।'
  },
  {
    image: 'assets/portraits/memory-06.webp',
    drawing: 'assets/portraits/memory-06.svg',
    alt: 'Line-art portrait of Atik kissing Punom on the forehead in a close-up selfie',
    caption: 'হাজার কথার চেয়েও বেশি, এই একটুখানি আদর।'
  },
  {
    image: 'assets/portraits/memory-07.webp',
    drawing: 'assets/portraits/memory-07.svg',
    alt: 'Line-art portrait of Punom in pink and white, with Atik in a red shirt behind her outdoors',
    caption: 'আমার প্রতিটা গল্পে, তুমি।'
  },
  {
    image: 'assets/portraits/memory-08.webp',
    drawing: 'assets/portraits/memory-08.svg',
    alt: 'Line-art portrait of Atik and Punom smiling close together beside a green tree under a blue sky',
    caption: 'আজও তুমি, আগামীকালও তুমি।'
  }
];

// Uploaded song. Encode the filename so # characters are not treated as URL fragments.
window.LOVE_AUDIO_URL = 'assets/' + encodeURIComponent('Yung Kai - Blue (Lyrics) #blue #liveperformance #shorts #shortsfeed #viralvideo.mp3');
