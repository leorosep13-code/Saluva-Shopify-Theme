/* ═══════════════════════════════════════════
   SALUVA THEME — Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initPromoCountdown();
  initStickyHeader();
  initSmoothScroll();
  initStories();
  initTiendaFilters();
  initQuiz();
  initMobileMenu();
});

/* ── Promo Countdown ── */
function initPromoCountdown() {
  const bar = document.getElementById('promo-bar');
  if (!bar) return;

  const endDate = bar.dataset.endDate;
  if (!endDate) return;

  const target = new Date(endDate).getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('countdown-days');
    const hEl = document.getElementById('countdown-hours');
    const mEl = document.getElementById('countdown-mins');
    const sEl = document.getElementById('countdown-secs');

    if (dEl) dEl.innerHTML = String(d).padStart(2, '0') + '<small>d</small>';
    if (hEl) hEl.innerHTML = String(h).padStart(2, '0') + '<small>h</small>';
    if (mEl) mEl.innerHTML = String(m).padStart(2, '0') + '<small>m</small>';
    if (sEl) sEl.innerHTML = String(s).padStart(2, '0') + '<small>s</small>';
  }

  update();
  setInterval(update, 1000);
}

/* ── Sticky Header ── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link.nav-anchor');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ── Smooth Scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('.nav-anchor').forEach(link => {
    link.addEventListener('click', (e) => {
      const sectionId = link.dataset.section;
      const target = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Stories ── */
function initStories() {
  const overlay = document.getElementById('story-overlay');
  const slides = document.querySelectorAll('.story-overlay__slide');
  const progressFills = document.querySelectorAll('.story-overlay__progress-fill');
  const bubbles = document.querySelectorAll('.story-bubble');

  if (!overlay || slides.length === 0) return;

  let currentSlide = 0;
  let progressInterval = null;
  let progress = 0;
  const STORY_DURATION = 5000; // 5 seconds per story
  const TICK = 50;

  function showSlide(index) {
    currentSlide = index;
    progress = 0;

    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    progressFills.forEach((f, i) => {
      f.classList.remove('active', 'complete');
      f.style.width = '0%';
      if (i < index) {
        f.classList.add('complete');
        f.style.width = '100%';
      }
    });

    startProgress();
  }

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += (TICK / STORY_DURATION) * 100;
      if (progressFills[currentSlide]) {
        progressFills[currentSlide].style.width = Math.min(progress, 100) + '%';
      }
      if (progress >= 100) {
        if (currentSlide < slides.length - 1) {
          showSlide(currentSlide + 1);
        } else {
          closeOverlay();
        }
      }
    }, TICK);
  }

  function openOverlay(index) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    showSlide(index);
  }

  function closeOverlay() {
    clearInterval(progressInterval);
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const idx = parseInt(bubble.dataset.storyIndex);
      openOverlay(idx);
    });
  });

  const closeBtn = document.getElementById('story-close-btn');
  const closeBg = document.getElementById('story-close-backdrop');
  const prevBtn = document.getElementById('story-prev');
  const nextBtn = document.getElementById('story-next');

  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  if (closeBg) closeBg.addEventListener('click', closeOverlay);
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(Math.max(0, currentSlide - 1)));
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
    else closeOverlay();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'ArrowLeft') showSlide(Math.max(0, currentSlide - 1));
    if (e.key === 'ArrowRight') {
      if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
      else closeOverlay();
    }
  });
}

/* ── Tienda Filters ── */
function initTiendaFilters() {
  const filters = document.querySelectorAll('.tienda-filter');
  const items = document.querySelectorAll('.tienda-grid__item');

  if (filters.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ── Quiz ── */
function initQuiz() {
  const startBtn = document.getElementById('quiz-start');
  const intro = document.getElementById('quiz-intro');
  const container = document.getElementById('quiz-container');
  const resultSection = document.getElementById('quiz-result');
  const restartBtn = document.getElementById('quiz-restart');

  if (!startBtn || !intro) return;

  const questions = document.querySelectorAll('.quiz-question');
  const progressFills = document.querySelectorAll('.quiz-progress__fill');
  let currentQuestion = 0;
  let answers = [];

  startBtn.addEventListener('click', () => {
    intro.style.display = 'none';
    container.style.display = 'block';
    currentQuestion = 0;
    answers = [];
    showQuestion(0);
  });

  function showQuestion(index) {
    questions.forEach((q, i) => {
      q.style.display = i === index ? 'block' : 'none';
    });
    progressFills.forEach((f, i) => {
      f.classList.toggle('active', i <= index);
    });
  }

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      const qIdx = parseInt(option.dataset.question);
      const aIdx = parseInt(option.dataset.answer);
      answers[qIdx] = aIdx;

      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
      } else {
        showResult();
      }
    });
  });

  function showResult() {
    container.style.display = 'none';
    resultSection.style.display = 'block';

    // Map first answer to result
    const firstAnswer = answers[0] || 0;
    const results = window.__quizResults || {};
    const resultKey = String(firstAnswer);
    const result = results[resultKey];

    const iconEl = document.getElementById('quiz-result-icon');
    const nameEl = document.getElementById('quiz-result-name');

    if (result) {
      if (iconEl) iconEl.textContent = result.emoji || '✨';
      if (nameEl) nameEl.textContent = result.title || 'Tu Pack Ideal';
    }
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      resultSection.style.display = 'none';
      intro.style.display = 'block';
      currentQuestion = 0;
      answers = [];
    });
  }
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });
}

/* ── AJAX Add to Cart ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-card__add-btn');
  if (!btn || btn.disabled) return;

  e.preventDefault();
  const form = btn.closest('form');
  if (!form) return;

  const formData = new FormData(form);

  btn.textContent = 'Agregando...';
  btn.disabled = true;

  fetch('/cart/add.js', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      btn.textContent = '✓ Agregado';
      btn.style.background = 'var(--color-primary)';
      btn.style.color = '#fff';

      // Update cart count
      const countEl = document.getElementById('cart-count');
      if (countEl) {
        fetch('/cart.js')
          .then(r => r.json())
          .then(cart => { countEl.textContent = cart.item_count; });
      }

      setTimeout(() => {
        btn.textContent = 'Agregar al Carrito';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    })
    .catch(() => {
      btn.textContent = 'Error';
      setTimeout(() => {
        btn.textContent = 'Agregar al Carrito';
        btn.disabled = false;
      }, 1500);
    });
});
