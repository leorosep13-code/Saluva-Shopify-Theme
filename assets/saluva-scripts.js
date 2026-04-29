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
  initPdpCarousel();
  initPdpVariants();
  initPdpReviews();
  initPdpShare();
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
  const ytPlayers = {};

  // Load YouTube IFrame API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

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

  function destroyAllPlayers() {
    Object.keys(ytPlayers).forEach(key => {
      try { ytPlayers[key].destroy(); } catch(e) {}
      delete ytPlayers[key];
    });
  }

  function loadVideo(slideIndex) {
    const slide = slides[slideIndex];
    const videoId = slide.dataset.videoId;
    if (!videoId || videoId.trim() === '') return;

    const containerId = 'story-video-' + slideIndex;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '<div id="yt-player-' + slideIndex + '"></div>';

    function createPlayer() {
      if (ytPlayers[slideIndex]) {
        try { ytPlayers[slideIndex].destroy(); } catch(e) {}
      }
      ytPlayers[slideIndex] = new YT.Player('yt-player-' + slideIndex, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          vq: 'hd720'
        },
        events: {
          onReady: function(event) {
            event.target.setVolume(50);
            event.target.setPlaybackQuality('hd720');
            event.target.playVideo();
            // Hide poster once video starts
            const poster = slide.querySelector('.story-overlay__slide-img--poster');
            if (poster) setTimeout(() => { poster.style.display = 'none'; }, 500);
          },
          onStateChange: function(event) {
            // Video ended
            if (event.data === YT.PlayerState.ENDED) {
              if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
              }
            }
          }
        }
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Wait for API to load
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function() {
        if (prevCallback) prevCallback();
        createPlayer();
      };
    }
  }

  function stopVideo(slideIndex) {
    if (ytPlayers[slideIndex]) {
      try { ytPlayers[slideIndex].pauseVideo(); } catch(e) {}
    }
    // Reset poster
    const poster = slides[slideIndex].querySelector('.story-overlay__slide-img--poster');
    if (poster) poster.style.display = '';
  }

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    // Stop previous video
    stopVideo(currentSlide);

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

    const currentSlideEl = slides[index];
    const isVideo = currentSlideEl.dataset.mediaType === 'video';

    // Update header: avatar + title
    const titleEl = document.getElementById('story-overlay-title');
    const avatarEl = document.getElementById('story-overlay-avatar');
    if (titleEl) titleEl.textContent = currentSlideEl.dataset.storyTitle || '';
    if (avatarEl) {
      const thumb = currentSlideEl.dataset.storyThumb;
      avatarEl.style.backgroundImage = thumb ? 'url(' + thumb + ')' : '';
    }

    // Hide touch zones on video slides so YT controls are accessible
    const touchZones = document.querySelector('.story-overlay__touch-zones');
    if (touchZones) touchZones.style.display = isVideo ? 'none' : 'flex';

    // Show/hide nav arrows based on position
    const prevArrow = document.getElementById('story-prev');
    const nextArrow = document.getElementById('story-next');
    if (prevArrow) prevArrow.classList.toggle('story-overlay__nav--hidden', index === 0);
    if (nextArrow) nextArrow.classList.toggle('story-overlay__nav--hidden', index === slides.length - 1);

    if (isVideo) {
      clearInterval(progressInterval);
      loadVideo(index);
    } else {
      startProgress();
    }
  }

  function goPrev() {
    if (currentSlide > 0) showSlide(currentSlide - 1);
  }

  function goNext() {
    if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
    else closeOverlay();
  }

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += (TICK / STORY_DURATION) * 100;
      if (progressFills[currentSlide]) {
        progressFills[currentSlide].style.width = Math.min(progress, 100) + '%';
      }
      if (progress >= 100) {
        goNext();
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
    stopVideo(currentSlide);
    destroyAllPlayers();
    // Clear all video containers
    slides.forEach((s, i) => {
      const vc = document.getElementById('story-video-' + i);
      if (vc) vc.innerHTML = '';
      const poster = s.querySelector('.story-overlay__slide-img--poster');
      if (poster) poster.style.display = '';
    });
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open from card click
  bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      openOverlay(parseInt(bubble.dataset.storyIndex));
    });
  });

  // Close button + backdrop
  const closeBtn = document.getElementById('story-close-btn');
  const closeBg = document.getElementById('story-close-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  if (closeBg) closeBg.addEventListener('click', closeOverlay);

  // Desktop nav arrows
  const prevBtn = document.getElementById('story-prev');
  const nextBtn = document.getElementById('story-next');
  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Tap zones (Instagram style: left 30% = prev, right 70% = next)
  const touchPrev = document.getElementById('story-touch-prev');
  const touchNext = document.getElementById('story-touch-next');
  if (touchPrev) touchPrev.addEventListener('click', goPrev);
  if (touchNext) touchNext.addEventListener('click', goNext);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  // Swipe support - on entire overlay for easy swiping anywhere
  let touchStartX = 0;
  let touchStartY = 0;
  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) goNext();
      else goPrev();
    }
  }, { passive: true });
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

      // Render product cards with real product data
      if (productsEl) {
        productsEl.innerHTML = '';
        const products = result.products || [];
        products.forEach(p => {
          if (!p || !p.url) return;
          const card = document.createElement('a');
          card.href = p.url;
          card.className = 'quiz-product-card';
          let priceHtml = '<span class="quiz-product-card__price">' + p.price + '</span>';
          if (p.compare_price) {
            priceHtml += '<span class="quiz-product-card__compare">' + p.compare_price + '</span>';
          }
          card.innerHTML =
            '<div class="quiz-product-card__img">' +
              (p.image ? '<img src="' + p.image + '" alt="' + (p.title || '') + '" loading="lazy">' : '<div class="quiz-product-card__placeholder">🌿</div>') +
            '</div>' +
            '<div class="quiz-product-card__info">' +
              '<span class="quiz-product-card__name">' + (p.title || 'Producto Recomendado') + '</span>' +
              '<div class="quiz-product-card__prices">' + priceHtml + '</div>' +
              '<span class="quiz-product-card__cta">' + (p.available ? 'Ver Producto →' : 'Agotado') + '</span>' +
            '</div>';
          productsEl.appendChild(card);
        });
        // Fallback if no products configured
        if (productsEl.children.length === 0) {
          productsEl.innerHTML = '<p style="color: var(--color-text-muted); font-size: 14px;">Pronto agregaremos productos recomendados para ti.</p>';
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
  const selectors = '.animate-on-scroll, .anim-slide-left, .anim-slide-right, .anim-zoom, .anim-fade, .anim-bounce-up, .anim-flip, .anim-stagger';
  const elements = document.querySelectorAll(selectors);
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
  }, { threshold: 0.08 });

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
              let price = '';
              if (p.price) {
                const num = parseFloat(String(p.price).replace(/[^0-9.,-]/g, '').replace(',', '.'));
                if (!isNaN(num)) {
                  price = '$' + Math.round(num).toLocaleString('es-CO');
                }
              }
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

/* ── Quantity Buttons ── */
document.addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  if (!qtyBtn) return;
  const input = qtyBtn.parentElement.querySelector('input[type="number"]');
  if (!input) return;
  const current = parseInt(input.value) || 1;
  if (qtyBtn.dataset.action === 'minus' && current > 1) {
    input.value = current - 1;
  } else if (qtyBtn.dataset.action === 'plus') {
    input.value = current + 1;
  }
});

/* ── Product Page AJAX Add to Cart ── */
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[action="/cart/add"]');
  if (!form) return;
  const btn = form.querySelector('.product-add-btn');
  if (!btn) return;

  e.preventDefault();
  const formData = new FormData(form);
  const originalText = btn.textContent.trim();

  btn.innerHTML = '<span class="spinner"></span> Agregando...';
  btn.disabled = true;

  fetch('/cart/add.js', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(() => {
      btn.textContent = '✓ Agregado';
      showToast('Producto agregado al carrito', 'success');
      updateCartCount();
      updateFloatingCheckout();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    })
    .catch(() => {
      showToast('Error al agregar al carrito', 'error');
      btn.textContent = originalText;
      btn.disabled = false;
    });
});

/* ── AJAX Add to Cart with Toast (product cards) ── */
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
      .then(cart => {
        countEl.textContent = cart.item_count;
        updateFloatingCheckout(cart.item_count);
      });
  }
}

/* ── Floating Checkout Button ── */
function updateFloatingCheckout(count) {
  const btn = document.getElementById('floating-checkout');
  const countEl = document.getElementById('floating-checkout-count');
  const stickyPay = document.getElementById('pdp-sticky-pay');
  const stickyPayCount = document.getElementById('pdp-sticky-pay-count');

  if (count === undefined) {
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => {
        updateFloatingCheckout(cart.item_count);
      });
    return;
  }

  /* PAGAR integrado en la barra del PDP (móvil) */
  if (stickyPay) {
    if (stickyPayCount) stickyPayCount.textContent = count;
    stickyPay.classList.toggle('visible', count > 0);
  }

  /* Botón flotante global (resto de páginas) */
  if (!btn) return;
  if (countEl) countEl.textContent = count;
  if (count > 0) {
    btn.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        btn.classList.add('visible');
      });
    });
  } else {
    btn.classList.remove('visible');
    setTimeout(() => { btn.style.display = 'none'; }, 400);
  }
}

// Initialize floating checkout on page load
document.addEventListener('DOMContentLoaded', () => {
  updateFloatingCheckout();
});

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

/* ── Hero Parallax (desktop only — móvil estático para evitar bandas negras) ── */
window.addEventListener('scroll', () => {
  if (window.innerWidth <= 768) return;
  const hero = document.querySelector('.landing-hero--fullscreen');
  if (hero) {
    const bgImg = hero.querySelector('.landing-hero__bg-image');
    if (bgImg) {
      const scroll = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const offset = Math.min(scroll * 0.25, heroHeight * 0.1);
      bgImg.style.transform = 'translateY(' + offset + 'px)';
    }
  }
});

/* ── PDP Carrusel de imágenes/videos ── */
function initPdpCarousel() {
  const track = document.getElementById('pdp-carousel-track');
  const dots = document.querySelectorAll('.pdp__carousel-dot');
  const thumbs = document.querySelectorAll('.pdp__thumb');

  if (!track) return;

  const slides = track.querySelectorAll('.pdp__carousel-slide');
  let current = 0;
  let startX = 0;
  let isDragging = false;

  function goTo(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index))));
  thumbs.forEach(thumb => thumb.addEventListener('click', () => goTo(parseInt(thumb.dataset.index))));

  /* Swipe táctil */
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });
}

/* ── PDP Variantes ── */
function initPdpVariants() {
  const jsonEl = document.getElementById('pdp-variants-json');
  const optionBtns = document.querySelectorAll('.pdp__option-btn');

  if (!jsonEl || optionBtns.length === 0) return;

  let variants;
  try { variants = JSON.parse(jsonEl.textContent); } catch(e) { return; }

  const selectedOptions = {};

  /* Inicializar con la primera variante */
  optionBtns.forEach(btn => {
    if (btn.classList.contains('active')) {
      selectedOptions[btn.dataset.optionIndex] = btn.dataset.value;
    }
  });

  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.optionIndex;
      const val = btn.dataset.value;

      /* Actualizar botón activo */
      btn.parentElement.querySelectorAll('.pdp__option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      /* Actualizar label */
      const label = document.getElementById('pdp-option-' + idx + '-selected');
      if (label) label.textContent = val;

      selectedOptions[idx] = val;

      /* Buscar variante que coincida */
      const optionValues = Object.keys(selectedOptions).sort().map(k => selectedOptions[k]);
      const match = variants.find(v => {
        return v.options.every((opt, i) => opt === optionValues[i]);
      });

      if (match) {
        /* Actualizar precios */
        const priceEl = document.getElementById('pdp-price');
        const compareEl = document.getElementById('pdp-compare');
        const savingsEl = document.getElementById('pdp-savings');

        if (priceEl) priceEl.textContent = formatMoney(match.price);
        if (compareEl) {
          if (match.compare_at_price && match.compare_at_price > match.price) {
            compareEl.textContent = formatMoney(match.compare_at_price);
            compareEl.style.display = '';
          } else {
            compareEl.style.display = 'none';
          }
        }
        if (savingsEl) {
          if (match.compare_at_price && match.compare_at_price > match.price) {
            const pct = Math.round((match.compare_at_price - match.price) / match.compare_at_price * 100);
            const saved = formatMoney(match.compare_at_price - match.price);
            savingsEl.querySelector('span:last-child').textContent = pct + '% OFF — Ahorras ' + saved;
            savingsEl.style.display = '';
          } else {
            savingsEl.style.display = 'none';
          }
        }

        /* Actualizar variant IDs en ambos forms */
        const idDesktop = document.getElementById('pdp-variant-id-desktop');
        const idMobile = document.getElementById('pdp-variant-id-mobile');
        if (idDesktop) idDesktop.value = match.id;
        if (idMobile) idMobile.value = match.id;

        /* Actualizar botones de agregar */
        document.querySelectorAll('.pdp__add-btn').forEach(addBtn => {
          if (match.available) {
            addBtn.disabled = false;
            addBtn.textContent = 'Agregar al Carrito';
          } else {
            addBtn.disabled = true;
            addBtn.textContent = 'Agotado';
          }
        });
      }
    });
  });

  function formatMoney(cents) {
    return '$' + (cents / 100).toLocaleString('es-CO', { minimumFractionDigits: 0 });
  }
}

/* ── PDP Reviews (localStorage) ── */
/* Lightbox para imágenes de reviews */
function openReviewLightbox(src) {
  var overlay = document.createElement('div');
  overlay.className = 'pdp-review-lightbox';
  overlay.innerHTML = '<img src="' + src + '" alt="Foto de reseña">';
  overlay.addEventListener('click', function() { overlay.remove(); });
  document.body.appendChild(overlay);
}

function initPdpReviews() {
  const form = document.getElementById('pdp-review-form');
  const toggleBtn = document.getElementById('pdp-review-toggle');
  const formWrap = document.getElementById('pdp-review-form-wrap');
  const list = document.getElementById('pdp-reviews-list');
  const emptyMsg = document.getElementById('pdp-reviews-empty');
  const starBtns = document.querySelectorAll('.pdp-reviews__star-btn');
  const ratingSummary = document.getElementById('pdp-rating-summary');

  const imageInput = document.getElementById('review-image-input');
  const imagePreview = document.getElementById('review-image-preview');
  const imagePreviewImg = document.getElementById('review-image-preview-img');
  const imageRemoveBtn = document.getElementById('review-image-remove');

  if (!form || !list) return;

  const productHandle = window.location.pathname.split('/').pop();
  const STORAGE_KEY = 'saluva_reviews_' + productHandle;
  let selectedRating = 0;
  let reviewImageData = null;

  /* Cargar reviews */
  function getReviews() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function renderStars(rating, size) {
    size = size || 14;
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating ? 'var(--color-accent)' : 'none';
      html += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + filled + '" stroke="var(--color-accent)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    return html;
  }

  function renderReviews() {
    const reviews = getReviews();
    list.innerHTML = '';

    if (reviews.length === 0) {
      if (emptyMsg) emptyMsg.style.display = '';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    reviews.forEach(r => {
      const isOwner = r.isOwner;
      const card = document.createElement('div');
      card.className = 'pdp-review-card' + (isOwner ? ' pdp-review-card--owner' : '');
      let imageHtml = '';
      if (r.image) {
        imageHtml = '<div class="pdp-review-card__image" onclick="this.querySelector(\'img\') && openReviewLightbox(this.querySelector(\'img\').src)"><img src="' + r.image + '" alt="Foto de reseña" loading="lazy"></div>';
      }
      card.innerHTML =
        '<div class="pdp-review-card__header">' +
          '<span class="pdp-review-card__name">' + escapeHtml(r.name) + (isOwner ? '<span class="pdp-review-card__badge">Saluva</span>' : '') + '</span>' +
          '<span class="pdp-review-card__date">' + r.date + '</span>' +
        '</div>' +
        '<div class="pdp-review-card__stars">' + renderStars(r.rating) + '</div>' +
        '<p class="pdp-review-card__text">' + escapeHtml(r.comment) + '</p>' +
        imageHtml;
      list.appendChild(card);
    });

    /* Actualizar rating summary */
    updateRatingSummary(reviews);
  }

  function updateRatingSummary(reviews) {
    if (!ratingSummary || reviews.length === 0) return;

    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const rounded = Math.round(avg * 10) / 10;
    const starsEl = ratingSummary.querySelector('.pdp__stars');
    const countEl = ratingSummary.querySelector('.pdp__rating-count');

    if (starsEl) starsEl.setAttribute('data-rating', Math.round(avg));
    if (countEl) countEl.textContent = rounded.toFixed(1) + ' (' + reviews.length + ')';

    /* Rellenar estrellas */
    if (starsEl) {
      starsEl.innerHTML = renderStars(Math.round(avg), 16);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* Toggle formulario */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const visible = formWrap.style.display !== 'none';
      formWrap.style.display = visible ? 'none' : 'block';
      if (!visible) formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* Star selection */
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.star);
      starBtns.forEach((b, i) => {
        b.classList.toggle('active', i < selectedRating);
      });
    });
  });

  /* Image upload handling */
  if (imageInput) {
    imageInput.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast('La imagen debe ser menor a 2MB', 'error');
        this.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        reviewImageData = e.target.result;
        if (imagePreviewImg) imagePreviewImg.src = reviewImageData;
        if (imagePreview) imagePreview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  }

  if (imageRemoveBtn) {
    imageRemoveBtn.addEventListener('click', function() {
      reviewImageData = null;
      if (imageInput) imageInput.value = '';
      if (imagePreviewImg) imagePreviewImg.src = '';
      if (imagePreview) imagePreview.classList.remove('has-image');
    });
  }

  /* Submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('review-name').value.trim();
    const comment = document.getElementById('review-comment').value.trim();

    if (!name || !comment || selectedRating === 0) {
      showToast('Completa todos los campos y selecciona una valoración', 'error');
      return;
    }

    const reviewData = {
      name: name,
      rating: selectedRating,
      comment: comment,
      date: new Date().toLocaleDateString('es-CO'),
      isOwner: false
    };

    if (reviewImageData) {
      reviewData.image = reviewImageData;
    }

    const reviews = getReviews();
    reviews.unshift(reviewData);

    saveReviews(reviews);
    renderReviews();

    /* Reset form */
    form.reset();
    selectedRating = 0;
    reviewImageData = null;
    starBtns.forEach(b => b.classList.remove('active'));
    if (imagePreview) imagePreview.classList.remove('has-image');
    if (imagePreviewImg) imagePreviewImg.src = '';
    formWrap.style.display = 'none';
    showToast('¡Gracias por tu reseña!', 'success');
  });

  renderReviews();
}

/* ── PDP Share ── */
function initPdpShare() {
  const btn = document.getElementById('pdp-share');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const title = document.querySelector('.pdp__title');
    const text = title ? title.textContent.trim() : document.title;

    if (navigator.share) {
      navigator.share({ title: text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Enlace copiado', 'success');
      });
    }
  });
}
