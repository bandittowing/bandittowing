/* =============================================
   BANDIT TOWING — MAIN JS
   Photos stored in Cloudinary, URLs in localStorage
   ============================================= */

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('solid', window.scrollY > 80);
}, { passive: true });

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
hamburger?.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

// ---- Scroll reveal ----
const revealTargets = document.querySelectorAll(
  '.svc-card, .price-card, .review-card, .about-list li, .area-tags span, .cd-row'
);
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 0.08}s`;
});
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ============================================
// GALLERY — photos are [{url, public_id, caption}]
// ============================================
const PHOTOS_KEY = 'bandit_photos_v2';
const VIDEOS_KEY = 'bandit_videos';
const HOME_LIMIT = 12;

function loadPhotos() { try { return JSON.parse(localStorage.getItem(PHOTOS_KEY)) || []; } catch { return []; } }
function loadVideos() { try { return JSON.parse(localStorage.getItem(VIDEOS_KEY)) || []; } catch { return []; } }

// ---- Render home gallery (max HOME_LIMIT) ----
function renderGallery() {
  const photos  = loadPhotos();
  const grid    = document.getElementById('photoGallery');
  const empty   = document.getElementById('galleryEmpty');
  const viewAll = document.getElementById('galleryViewAll');
  if (!grid) return;

  grid.querySelectorAll('.gallery-item').forEach(el => el.remove());

  if (!photos.length) {
    if (empty)   empty.style.display   = '';
    if (viewAll) viewAll.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';

  const preview = photos.slice(0, HOME_LIMIT);
  preview.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${p.url}" alt="${p.caption || 'Bandit Towing'}" loading="lazy" />
      <div class="gallery-item-overlay"><span>🔍</span></div>
    `;
    div.addEventListener('click', () => openLb(i));
    grid.appendChild(div);
  });

  if (viewAll) viewAll.style.display = photos.length > HOME_LIMIT ? '' : 'none';
}

// ---- Lightbox ----
let lbIdx = 0;
const lb    = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');

document.getElementById('lbClose')?.addEventListener('click', closeLb);
document.getElementById('lbPrev')?.addEventListener('click',  () => stepLb(-1));
document.getElementById('lbNext')?.addEventListener('click',  () => stepLb(1));
lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLb();
  if (e.key === 'ArrowLeft')   stepLb(-1);
  if (e.key === 'ArrowRight')  stepLb(1);
});

function openLb(i) {
  const photos = loadPhotos();
  if (!photos.length) return;
  lbIdx = i;
  lbImg.src = photos[i].url;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb?.classList.remove('active');
  document.body.style.overflow = '';
  if (lbImg) lbImg.src = '';
}
function stepLb(d) {
  const photos = loadPhotos();
  lbIdx = (lbIdx + d + photos.length) % photos.length;
  lbImg.src = photos[lbIdx].url;
}

// ---- Videos ----
function renderVideos() {
  const videos = loadVideos();
  const grid   = document.getElementById('videoGrid');
  if (!grid) return;

  grid.querySelectorAll('.video-item').forEach(el => el.remove());
  const empty = grid.querySelector('.gallery-empty');
  if (!videos.length) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  videos.forEach(v => {
    const div = document.createElement('div');
    div.className = 'video-item';
    div.innerHTML = `<iframe src="${v.embed}" allowfullscreen loading="lazy" title="${v.caption || 'Bandit Towing'}"></iframe>`;
    grid.appendChild(div);
  });
}

// ============================================
// AMAZON SLIDESHOW
// ============================================
// ↓ UPDATE THIS NUMBER to match how many amazon-X.jpg files you have
const AMAZON_PHOTO_COUNT = 14;
const AMAZON_ROTATE_MS   = 15000; // 15 seconds

(function initAmazonSlideshow() {
  const allPhotos = [];
  for (let i = 1; i <= AMAZON_PHOTO_COUNT; i++) {
    allPhotos.push(`images/amazon-${i}.jpg`);
  }

  if (allPhotos.length < 3) return;

  const slots  = [
    document.getElementById('amzSlot0'),
    document.getElementById('amzSlot1'),
    document.getElementById('amzSlot2'),
  ];
  const dotsWrap = document.getElementById('amzDots');

  if (!slots[0]) return;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build groups of 3 from shuffled photos
  let allGroups = [];
  function buildGroups() {
    const shuffled = shuffle(allPhotos);
    allGroups = [];
    for (let i = 0; i < shuffled.length; i += 3) {
      const group = shuffled.slice(i, i + 3);
      while (group.length < 3) {
        group.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
      }
      allGroups.push(group);
    }
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    allGroups.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'amz-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { clearInterval(timer); showGroup(i); startTimer(); });
      dotsWrap.appendChild(dot);
    });
  }

  let currentGroup = 0;

  function setSlotImage(slot, src) {
    const img = slot.querySelector('.amz-slide-img');
    const fallback = slot.querySelector('.amz-fallback');
    if (!img) return;

    // Fade out
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.7s ease';

    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      img.style.display = 'block';
      if (fallback) fallback.style.display = 'none';
      // Small delay then fade in
      setTimeout(() => { img.style.opacity = '1'; }, 50);
    };
    newImg.onerror = () => {
      img.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
    };
    newImg.src = src;
  }

  function showGroup(groupIdx) {
    currentGroup = groupIdx % allGroups.length;
    const group  = allGroups[currentGroup];
    slots.forEach((slot, i) => setSlotImage(slot, group[i]));

    // Update dots
    document.querySelectorAll('.amz-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentGroup);
    });
  }

  function nextGroup() {
    showGroup((currentGroup + 1) % allGroups.length);
  }

  let timer;
  function startTimer() {
    timer = setInterval(nextGroup, AMAZON_ROTATE_MS);
  }

  // Pause on hover
  const slideshow = document.getElementById('amazonSlideshow');
  if (slideshow) {
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', startTimer);
  }

  // Init — set initial opacity on all slide imgs
  slots.forEach(slot => {
    const img = slot.querySelector('.amz-slide-img');
    if (img) { img.style.opacity = '0'; img.style.transition = 'opacity 0.7s ease'; }
  });

  buildGroups();
  buildDots();
  showGroup(0);
  startTimer();
})();

