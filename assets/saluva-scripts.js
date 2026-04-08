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
  initScrollToTop();
  initAnimateOnScroll();
  initSearchOverlay();
  initSaleBannerCountdown();
  initFeaturedProductCarousel();
  initDigitalProductModals();
  initMegaMenuMobile();
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
        // Close mobile menu if open
        const nav = document.getElementById('main-nav');
        if (nav) nav.classList.remove('open');
      }
      // If section not found on this page, navigate to home with hash
      else if (sectionId) {
        window.location.href = '/#' + sectionId;
      }
    });
  });

  // On page load, scroll to hash target if present
  if (window.location.hash) {
    const hashTarget = document.getElementById(window.location.hash.substring(1));
    if (hashTarget) {
      setTimeout(() => {
        hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
}

/* ── Stories ── */
function initStories() {
  const overlay = document.getElementById('story-overlay');
  const slides = document.querySelectorAll('.story-overlay__slide');
  const progressFills = document.querySelectorAll('.story-overlay__progress-fill');
  const bubbles = document.querySelectorAll('.story-card');

  if (!overlay || slides.length === 0) return;

  let currentSlide = 0;
  let progressInterval = null;
  let progress = 0;
  const STORY_DURATION = 5000;
  const TICK = 50;
  const viewedStories = JSON.parse(localStorage.getItem('saluva_viewed_stories') || '[]');

  // Mark viewed stories visually
  bubbles.forEach((bubble, i) => {
    if (viewedStories.includes(i)) {
      bubble.classList.add('story-card--viewed');
    }
  });

  function markViewed(index) {
    if (!viewedStories.includes(index)) {
      viewedStories.push(index);
      localStorage.setItem('saluva_viewed_stories', JSON.stringify(viewedStories));
      if (bubbles[index]) bubbles[index].classList.add('story-card--viewed');
    }
  }

  function showSlide(index) {
    currentSlide = index;
    progress = 0;
    markViewed(index);

    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    progressFills.forEach((f, i) => {
      f.classList.remove('active', 'complete');
      f.style.width = '0%';
      if (i < index) {
        f.classList.add('complete');
        f.style.width = '100%';
      }
    });

    // Handle video slides
    const currentSlideEl = slides[index];
    const iframe = currentSlideEl.querySelector('iframe');
    const isVideo = currentSlideEl.dataset.mediaType === 'video';

    // Pause all other videos
    slides.forEach((s, i) => {
      if (i !== index) {
        const otherIframe = s.querySelector('iframe');
        if (otherIframe) otherIframe.src = otherIframe.src;
      }
    });

    if (isVideo && iframe) {
      clearInterval(progressInterval);
    } else {
      startProgress();
    }

    // Update story title
    const titleEl = document.getElementById('story-overlay-title');
    if (titleEl && currentSlideEl.dataset.storyTitle) {
      titleEl.textContent = currentSlideEl.dataset.storyTitle;
    }
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
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showSlide(index);
  }

  function closeOverlay() {
    clearInterval(progressInterval);
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
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

  // Swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  const storyCard = document.getElementById('story-card');
  if (storyCard) {
    storyCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    storyCard.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0 && currentSlide < slides.length - 1) {
          showSlide(currentSlide + 1);
        } else if (diffX > 0 && currentSlide > 0) {
          showSlide(currentSlide - 1);
        }
      }
    }, { passive: true });
  }
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

      items.forEach((item, i) => {
        const show = filter === 'all' || item.dataset.type === filter;
        item.classList.toggle('hidden', !show);
        if (show) {
          item.style.animationDelay = (i * 50) + 'ms';
        }
      });
    });
  });

  // Sort functionality
  const sortSelect = document.getElementById('tienda-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.getElementById('tienda-grid');
      if (!grid) return;
      const itemsArr = Array.from(grid.querySelectorAll('.tienda-grid__item'));
      const val = sortSelect.value;

      itemsArr.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price || 0);
        const priceB = parseFloat(b.dataset.price || 0);
        const dateA = parseInt(a.dataset.date || 0);
        const dateB = parseInt(b.dataset.date || 0);

        if (val === 'price-asc') return priceA - priceB;
        if (val === 'price-desc') return priceB - priceA;
        if (val === 'newest') return dateB - dateA;
        return 0;
      });

      itemsArr.forEach(item => grid.appendChild(item));
    });
  }
}

/* ── Quiz ── */
function initQuiz() {
  const startBtn = document.getElementById('quiz-start');
  const intro = document.getElementById('quiz-intro');
  const container = document.getElementById('quiz-container');
  const resultSection = document.getElementById('quiz-result');
  const restartBtn = document.getElementById('quiz-restart');
  const shareBtn = document.getElementById('quiz-share');

  if (!startBtn || !intro) return;

  const questions = document.querySelectorAll('.quiz-question');
  const progressBar = document.getElementById('quiz-progress-bar');
  let currentQuestion = 0;
  let scores = { energia: 0, belleza: 0, inmunidad: 0, digestion: 0 };

  startBtn.addEventListener('click', () => {
    intro.style.display = 'none';
    container.style.display = 'block';
    container.classList.add('quiz-fullscreen');
    currentQuestion = 0;
    scores = { energia: 0, belleza: 0, inmunidad: 0, digestion: 0 };
    showQuestion(0);
  });

  function showQuestion(index) {
    questions.forEach((q, i) => {
      q.classList.remove('quiz-slide-in', 'quiz-slide-out');
      if (i === index) {
        q.style.display = 'block';
        q.classList.add('quiz-slide-in');
      } else {
        q.style.display = 'none';
      }
    });
    if (progressBar) {
      const pct = ((index) / questions.length) * 100;
      progressBar.style.width = pct + '%';
    }
    // Update counter
    const counter = document.getElementById('quiz-counter');
    if (counter) {
      counter.textContent = 'Pregunta ' + (index + 1) + ' de ' + questions.length;
    }
  }

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      // Visual selection feedback
      const siblings = option.parentElement.querySelectorAll('.quiz-option');
      siblings.forEach(s => s.classList.remove('quiz-option--selected'));
      option.classList.add('quiz-option--selected');

      // Add points
      const ptsE = parseInt(option.dataset.ptsEnergia || 0);
      const ptsB = parseInt(option.dataset.ptsBelleza || 0);
      const ptsI = parseInt(option.dataset.ptsInmunidad || 0);
      const ptsD = parseInt(option.dataset.ptsDigestion || 0);
      scores.energia += ptsE;
      scores.belleza += ptsB;
      scores.inmunidad += ptsI;
      scores.digestion += ptsD;

      // Auto-advance after 600ms
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          showQuestion(currentQuestion);
        } else {
          showResult();
        }
      }, 600);
    });
  });

  // Back button
  const backBtn = document.getElementById('quiz-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });
  }

  function showResult() {
    container.style.display = 'none';
    container.classList.remove('quiz-fullscreen');
    resultSection.style.display = 'block';

    // Determine winner
    let maxCat = 'energia';
    let maxScore = 0;
    for (const cat in scores) {
      if (scores[cat] > maxScore) {
        maxScore = scores[cat];
        maxCat = cat;
      }
    }

    const results = window.__quizResults || {};
    const result = results[maxCat];

    const iconEl = document.getElementById('quiz-result-icon');
    const nameEl = document.getElementById('quiz-result-name');
    const descEl = document.getElementById('quiz-result-desc');
    const productsEl = document.getElementById('quiz-result-products');

    if (result) {
      if (iconEl) {
        iconEl.textContent = result.emoji || '✨';
        iconEl.classList.add('quiz-result__icon--animate');
      }
      if (nameEl) nameEl.textContent = result.title || 'Tu Pack Ideal';
      if (descEl) descEl.textContent = result.description || '';

      // Render product cards
      if (productsEl) {
        productsEl.innerHTML = '';
        [result.product_url_1, result.product_url_2].forEach(url => {
          if (url && url !== '') {
            const card = document.createElement('a');
            card.href = url;
            card.className = 'quiz-product-card';
            card.innerHTML = '<div class="quiz-product-card__img"><div class="quiz-product-card__placeholder">🌿</div></div><span class="quiz-product-card__cta">Ver Producto</span>';
            productsEl.appendChild(card);
          }
        });
        // Fallback placeholder cards
        if (productsEl.children.length === 0) {
          for (let i = 0; i < 2; i++) {
            const card = document.createElement('div');
            card.className = 'quiz-product-card';
            card.innerHTML = '<div class="quiz-product-card__img"><div class="quiz-product-card__placeholder">🌿</div></div><span class="quiz-product-card__name">Producto Recomendado</span><span class="quiz-product-card__cta">Pronto Disponible</span>';
            productsEl.appendChild(card);
          }
        }
      }
    }

    if (progressBar) progressBar.style.width = '100%';
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      resultSection.style.display = 'none';
      intro.style.display = 'block';
      currentQuestion = 0;
      scores = { energia: 0, belleza: 0, inmunidad: 0, digestion: 0 };
      if (progressBar) progressBar.style.width = '0%';
      const iconEl = document.getElementById('quiz-result-icon');
      if (iconEl) iconEl.classList.remove('quiz-result__icon--animate');
    });
  }

  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const nameEl = document.getElementById('quiz-result-name');
      const text = 'Mi resultado en el Quiz de Saluva: ' + (nameEl ? nameEl.textContent : 'Mi Pack Ideal');
      if (navigator.share) {
        navigator.share({ title: 'Mi Quiz Saluva', text: text, url: window.location.href });
      } else {
        navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
          showToast('Enlace copiado al portapapeles', 'success');
        });
      }
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

/* ── Mega Menu Mobile Toggle ── */
function initMegaMenuMobile() {
  if (window.innerWidth > 768) return;
  document.querySelectorAll('.header__nav-item--mega > .header__nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('mobile-open');
      }
    });
  });
}

/* ── Scroll to Top ── */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Animate on Scroll ── */
function initAnimateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ── Search Overlay ── */
function initSearchOverlay() {
  const toggleBtn = document.getElementById('search-toggle');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const backdrop = document.getElementById('search-close-backdrop');

  if (!toggleBtn || !overlay) return;

  let debounceTimer = null;

  function openSearch() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 100);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
  }

  toggleBtn.addEventListener('click', openSearch);
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeSearch();
  });

  if (input) {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = input.value.trim();

      if (query.length < 2) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=4')
          .then(r => r.json())
          .then(data => {
            const products = data.resources && data.resources.results && data.resources.results.products
              ? data.resources.results.products
              : [];

            if (products.length === 0) {
              resultsContainer.innerHTML = '<div class="search-overlay__no-results">No se encontraron resultados para "' + query + '"</div>';
              resultsContainer.style.display = 'block';
              return;
            }

            resultsContainer.innerHTML = products.map(p => {
              const img = p.image ? '<img src="' + p.image + '" alt="' + p.title + '" class="search-overlay__result-img" loading="lazy">' : '<div class="search-overlay__result-img"></div>';
              const price = p.price ? ('$' + (parseFloat(p.price) / 100).toLocaleString()) : '';
              return '<a href="' + p.url + '" class="search-overlay__result-item">' + img + '<div class="search-overlay__result-info"><div class="search-overlay__result-title">' + p.title + '</div><div class="search-overlay__result-price">' + price + '</div></div></a>';
            }).join('');
            resultsContainer.style.display = 'block';
          })
          .catch(() => {
            resultsContainer.innerHTML = '<div class="search-overlay__no-results">Error al buscar. Intenta de nuevo.</div>';
            resultsContainer.style.display = 'block';
          });
      }, 300);
    });
  }
}

/* ── Sale Banner Countdown ── */
function initSaleBannerCountdown() {
  const banner = document.getElementById('sale-banner');
  if (!banner) return;

  const endDate = banner.dataset.endDate;
  if (!endDate) return;

  const target = new Date(endDate).getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const setEl = (id, val, label) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<span class="sale-countdown__number">' + String(val).padStart(2, '0') + '</span><span class="sale-countdown__label">' + label + '</span>';
    };

    setEl('sale-days', d, 'Dias');
    setEl('sale-hours', h, 'Horas');
    setEl('sale-mins', m, 'Min');
    setEl('sale-secs', s, 'Seg');
  }

  update();
  setInterval(update, 1000);
}

/* ── Featured Product Carousel ── */
function initFeaturedProductCarousel() {
  const track = document.getElementById('fp-carousel-track');
  const dots = document.querySelectorAll('.fp-carousel__dot');
  const prevBtn = document.getElementById('fp-carousel-prev');
  const nextBtn = document.getElementById('fp-carousel-next');

  if (!track) return;

  const slides = track.querySelectorAll('.fp-carousel__slide');
  let current = 0;

  function goTo(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}

/* ── Digital Product Modals ── */
function initDigitalProductModals() {
  document.querySelectorAll('.digital-card[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.digital-modal__close, .digital-modal__backdrop').forEach(el => {
    el.addEventListener('click', () => {
      const modal = el.closest('.digital-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.digital-modal.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ── AJAX Add to Cart with Toast ── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-card__add-btn, .quick-add-btn');
  if (!btn || btn.disabled) return;

  e.preventDefault();
  const form = btn.closest('form');
  if (!form) {
    // Quick add button with data-variant-id
    const variantId = btn.dataset.variantId;
    if (!variantId) return;
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: parseInt(variantId), quantity: 1 })
    })
      .then(r => r.json())
      .then(() => {
        showToast('Producto agregado al carrito', 'success');
        updateCartCount();
        btn.innerHTML = '✓';
        setTimeout(() => {
          btn.innerHTML = '+';
          btn.disabled = false;
        }, 1500);
      })
      .catch(() => {
        showToast('Error al agregar al carrito', 'error');
        btn.innerHTML = '+';
        btn.disabled = false;
      });
    return;
  }

  const formData = new FormData(form);
  const originalText = btn.textContent;

  btn.innerHTML = '<span class="spinner"></span> Agregando...';
  btn.disabled = true;

  fetch('/cart/add.js', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(() => {
      btn.textContent = '✓ Agregado';
      btn.style.background = 'var(--color-primary)';
      btn.style.color = '#fff';
      showToast('Producto agregado al carrito', 'success');
      updateCartCount();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    })
    .catch(() => {
      showToast('Error al agregar al carrito', 'error');
      btn.textContent = originalText;
      btn.disabled = false;
    });
});

/* ── Update Cart Count ── */
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => { countEl.textContent = cart.item_count; });
  }
}

/* ── Toast Helper ── */
function showToast(message, type) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast--' + (type || 'success');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── Hero Parallax ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.landing-hero--fullscreen');
  if (hero) {
    const bgImg = hero.querySelector('.landing-hero__bg-image');
    if (bgImg) {
      const scroll = window.scrollY;
      bgImg.style.transform = 'translateY(' + (scroll * 0.3) + 'px)';
    }
  }
});
