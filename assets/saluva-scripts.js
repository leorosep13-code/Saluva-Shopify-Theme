/* ═══════════════════════════════════════════
   MISOJI BEAUTY — Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
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
  initPdpPinchZoom();
  initPdpLightbox();
  initPdpVariants();
  initPdpShare();
  initReelsCarousel();
  initOfertasRail();
  initBeforeAfter();
  initStats();
  initReviewImages();
});

/* ── Ofertas rail (scroll horizontal con navegación) ── */
function initOfertasRail() {
  const rail = document.getElementById('ofertas-rail');
  if (!rail) return;
  const wrap = rail.closest('.ofertas-rail-wrap');
  if (!wrap) return;
  const prev = wrap.querySelector('.ofertas-rail__nav--prev');
  const next = wrap.querySelector('.ofertas-rail__nav--next');

  const scrollByCard = (dir) => {
    const card = rail.querySelector('.ofertas-rail__item');
    const step = card ? card.getBoundingClientRect().width + 18 : 240;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const updateNav = () => {
    if (!prev || !next) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth - 2;
    prev.toggleAttribute('disabled', rail.scrollLeft <= 2);
    next.toggleAttribute('disabled', rail.scrollLeft >= maxScroll);
  };

  if (prev) prev.addEventListener('click', () => scrollByCard(-1));
  if (next) next.addEventListener('click', () => scrollByCard(1));
  rail.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();
}

/* ── Carrusel "Aprende un poco más" (reels) ── */
function initReelsCarousel() {
  const wrap = document.querySelector('.saluva-reels__carousel-wrap');
  if (!wrap) return;

  const track = wrap.querySelector('.saluva-reels__track');
  const prev = wrap.querySelector('.saluva-reels__nav--prev');
  const next = wrap.querySelector('.saluva-reels__nav--next');
  if (!track) return;

  const scrollByCard = (dir) => {
    const card = track.querySelector('.saluva-reels__card');
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (prev) prev.addEventListener('click', () => scrollByCard(-1));
  if (next) next.addEventListener('click', () => scrollByCard(1));

  hydrateTikTokReels(track);
}

/* Resolver TikToks (URLs cortas y largas) via oEmbed oficial.
   El endpoint sigue redirecciones internamente y devuelve un blockquote +
   referencia al script embed.js que reemplaza el blockquote por iframe. */
function hydrateTikTokReels(scope) {
  const cards = scope.querySelectorAll('.saluva-reels__card[data-source="tiktok"][data-tiktok-url]');
  console.log('[saluva-reels] TikTok cards encontrados:', cards.length);
  if (!cards.length) return;

  let embedScriptInjected = false;
  const injectEmbedScript = () => {
    if (embedScriptInjected) return;
    if (document.querySelector('script[src*="tiktok.com/embed.js"]')) {
      embedScriptInjected = true;
      return;
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(s);
    embedScriptInjected = true;
  };

  cards.forEach(async (card) => {
    const url = card.dataset.tiktokUrl;
    const frame = card.querySelector('.saluva-reels__frame');
    const loading = card.querySelector('[data-tiktok-loading]');
    if (!url || !frame) return;

    try {
      const oembedUrl = 'https://www.tiktok.com/oembed?url=' + encodeURIComponent(url);
      const res = await fetch(oembedUrl);
      if (!res.ok) throw new Error('oEmbed HTTP ' + res.status);
      const data = await res.json();
      if (!data.html) throw new Error('oEmbed sin html');

      const wrapper = document.createElement('div');
      wrapper.className = 'saluva-reels__tt-wrap';
      wrapper.innerHTML = data.html;

      const inlineScript = wrapper.querySelector('script');
      if (inlineScript) inlineScript.remove();

      if (loading) loading.remove();
      frame.appendChild(wrapper);
      injectEmbedScript();

      if (window.tiktokEmbedLoad) window.tiktokEmbedLoad();
    } catch (err) {
      console.warn('[saluva-reels] No se pudo cargar TikTok', url, err);
      if (loading) {
        const span = loading.querySelector('span');
        if (span) span.textContent = 'No se pudo cargar';
      }
    }
  });
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
      const text = 'Mi resultado en el Quiz de misoji: ' + (nameEl ? nameEl.textContent : 'Mi Pack Ideal');
      if (navigator.share) {
        navigator.share({ title: 'Mi Quiz misoji', text: text, url: window.location.href });
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

/* ── Mega Menu Toggle (desktop + mobile) ── */
function initMegaMenuMobile() {
  const items = document.querySelectorAll('.header__nav-item--mega');
  if (!items.length) return;

  const closeAll = () => {
    items.forEach(item => {
      item.classList.remove('open');
      const l = item.querySelector('.header__nav-link');
      if (l) l.setAttribute('aria-expanded', 'false');
    });
  };

  items.forEach(item => {
    const link = item.querySelector('.header__nav-link');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const wasOpen = item.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        item.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__nav-item--mega')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
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
  const toggleBtns = document.querySelectorAll('.js-search-toggle, #search-toggle');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const backdrop = document.getElementById('search-close-backdrop');

  if (!toggleBtns.length || !overlay) return;

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

  toggleBtns.forEach(btn => btn.addEventListener('click', openSearch));
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
      updateCartCount();
      updateFloatingCheckout();
      openCartDrawer();
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
        updateCartCount();
        openCartDrawer();
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
      updateCartCount();
      openCartDrawer();

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

/* ── PDP Antes/Después (tabs + comparador con clip-path) ── */
function initBeforeAfter() {
  document.querySelectorAll('[data-ba-root]').forEach((root) => {
    /* Tabs de zona */
    const tabs = root.querySelectorAll('[data-ba-tab]');
    const panels = root.querySelectorAll('[data-ba-panel]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = tab.dataset.baTab;
        tabs.forEach((t) => {
          const on = t.dataset.baTab === idx;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach((p) => p.classList.toggle('active', p.dataset.baPanel === idx));
      });
    });

    /* Comparador de cada panel */
    root.querySelectorAll('[data-ba-compare]').forEach((compare) => {
      const before = compare.querySelector('[data-ba-before]');
      const handle = compare.querySelector('[data-ba-handle]');
      const range  = compare.querySelector('[data-ba-range]');
      if (!before || !handle || !range) return;

      function setPos(pct) {
        const v = Math.max(0, Math.min(100, pct));
        before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
        handle.style.left = v + '%';
      }
      range.addEventListener('input', () => setPos(parseFloat(range.value)));

      /* Permite arrastrar tocando cualquier punto del comparador */
      function pointerToPct(clientX) {
        const rect = compare.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }
      let dragging = false;
      compare.addEventListener('pointerdown', (e) => {
        dragging = true;
        const pct = pointerToPct(e.clientX);
        range.value = pct;
        setPos(pct);
      });
      window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const pct = pointerToPct(e.clientX);
        range.value = pct;
        setPos(pct);
      });
      window.addEventListener('pointerup', () => { dragging = false; });

      setPos(50);
    });
  });
}

/* ── Números clínicos (count-up al entrar en viewport) ── */
function initStats() {
  const nums = document.querySelectorAll('.saluva-stats__number[data-stat-target], .saluva-stats__number[data-stat-raw]');
  if (!nums.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Extrae prefijo, número, decimales y sufijo de un valor tipo "97%", "30 días", "1.5x"
  function parseRaw(el) {
    if (el.dataset.statRaw != null) {
      const raw = el.dataset.statRaw;
      const m = raw.match(/-?\d+(?:[.,]\d+)?/);
      if (!m) return null;
      const numStr = m[0].replace(',', '.');
      const decimals = numStr.indexOf('.') >= 0 ? numStr.split('.')[1].length : 0;
      return {
        target: parseFloat(numStr),
        decimals,
        prefix: raw.slice(0, m.index),
        suffix: raw.slice(m.index + m[0].length)
      };
    }
    return {
      target: parseFloat(el.dataset.statTarget),
      decimals: parseInt(el.dataset.statDecimals || '0', 10),
      prefix: '',
      suffix: ''
    };
  }

  function animate(el) {
    const cfg = parseRaw(el);
    if (!cfg || isNaN(cfg.target)) return;
    const render = (v) => { el.textContent = cfg.prefix + v.toFixed(cfg.decimals) + cfg.suffix; };

    if (reduce) { render(cfg.target); return; }

    const item = el.closest('.saluva-stats__item') || el;
    item.classList.add('is-counting');

    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      render(cfg.target * eased);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        render(cfg.target);
        item.classList.remove('is-counting');
        item.classList.add('is-done');
        /* el "pop" se reinicia para poder reproducirlo */
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
      }
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    nums.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
}

/* ── Reseñas locales: ampliar imagen en lightbox ── */
function initReviewImages() {
  const items = document.querySelectorAll('[data-review-img]');
  if (!items.length) return;

  let lightbox = null;
  function open(src) {
    lightbox = document.createElement('div');
    lightbox.className = 'pdp-review-lightbox';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    lightbox.addEventListener('click', close);
  }
  function close() {
    if (!lightbox) return;
    lightbox.remove();
    lightbox = null;
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  items.forEach((el) => {
    const src = el.dataset.reviewImg;
    if (!src) return;
    el.addEventListener('click', () => open(src));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(src); }
    });
  });
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
    /* Carrusel infinito: al pasar de la última vuelve a la primera y viceversa. */
    const n = slides.length;
    current = ((index % n) + n) % n;
    slides.forEach((s, i) => s.classList.toggle('pdp__carousel-slide--active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
    /* Centra la miniatura activa SOLO dentro de su tira (scrollLeft propio,
       nunca mueve la página ni en horizontal ni en vertical). */
    const activeThumb = thumbs[current];
    if (activeThumb) {
      const strip = activeThumb.parentElement;
      if (strip && strip.scrollWidth > strip.clientWidth) {
        const left = activeThumb.offsetLeft - (strip.clientWidth - activeThumb.clientWidth) / 2;
        strip.scrollTo({ left: left, behavior: 'smooth' });
      }
    }
  }

  dots.forEach(dot => dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index))));
  thumbs.forEach(thumb => thumb.addEventListener('click', () => goTo(parseInt(thumb.dataset.index))));

  /* Swipe táctil (se ignora con 2+ dedos: eso es pinch-zoom) */
  track.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) { isDragging = false; return; }
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

/* ── PDP Pinch-zoom directo sobre la imagen activa (estilo Instagram) ──
   Con dos dedos sobre la foto que se está viendo, se amplía sobre una capa
   flotante siguiendo el pellizco; al soltar, vuelve suavemente a su lugar. */
function initPdpPinchZoom() {
  const track = document.getElementById('pdp-carousel-track');
  if (!track || !('ontouchstart' in window)) return;

  let clone = null, backdrop = null;
  let startDist = 0, startMidX = 0, startMidY = 0;
  let pinching = false;

  function distance(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  track.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 2) return;
    const slide = track.querySelector('.pdp__carousel-slide--active');
    const img = slide ? slide.querySelector('img') : null;
    if (!img) return; // videos u otros: sin pinch

    pinching = true;
    const rect = img.getBoundingClientRect();
    startDist = distance(e.touches[0], e.touches[1]);
    startMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    startMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

    backdrop = document.createElement('div');
    backdrop.className = 'pdp-pinch-backdrop';
    document.body.appendChild(backdrop);

    clone = document.createElement('img');
    clone.src = img.currentSrc || img.src;
    clone.className = 'pdp-pinch-clone';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    document.body.appendChild(clone);
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!pinching || e.touches.length !== 2 || !clone) return;
    e.preventDefault(); // evita scroll/zoom del navegador durante el pellizco
    const d = distance(e.touches[0], e.touches[1]);
    const scale = Math.max(1, Math.min(d / startDist, 4));
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    const dx = midX - startMidX;
    const dy = midY - startMidY;
    clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
    backdrop.style.opacity = Math.min((scale - 1) * 0.6, 0.7);
  }, { passive: false });

  function endPinch() {
    if (!pinching) return;
    pinching = false;
    const c = clone, b = backdrop;
    if (c) {
      c.style.transition = 'transform 0.3s ease';
      c.style.transform = 'translate(0,0) scale(1)';
    }
    if (b) {
      b.style.transition = 'opacity 0.3s ease';
      b.style.opacity = '0';
    }
    setTimeout(() => {
      if (c && c.parentNode) c.parentNode.removeChild(c);
      if (b && b.parentNode) b.parentNode.removeChild(b);
    }, 320);
    clone = null;
    backdrop = null;
  }

  track.addEventListener('touchend', endPinch, { passive: true });
  track.addEventListener('touchcancel', endPinch, { passive: true });
}

/* ── PDP Lightbox con zoom ── */
function initPdpLightbox() {
  const lightbox = document.getElementById('pdp-lightbox');
  const stage    = document.getElementById('pdp-lightbox-stage');
  const img      = document.getElementById('pdp-lightbox-img');
  const closeBtn = document.getElementById('pdp-lightbox-close');
  const prevBtn  = document.getElementById('pdp-lightbox-prev');
  const nextBtn  = document.getElementById('pdp-lightbox-next');
  const counter  = document.getElementById('pdp-lightbox-counter');
  const carousel = document.getElementById('pdp-carousel-track');
  if (!lightbox || !img || !stage || !carousel) return;

  const slides = carousel.querySelectorAll('.pdp__carousel-slide');
  const items = [];

  slides.forEach((slide) => {
    if (slide.querySelector('video, iframe')) return; // saltar videos
    const slideImg = slide.querySelector('img');
    if (!slideImg) return;
    const idx = items.length;
    items.push({
      src: slideImg.dataset.zoom || slideImg.src,
      alt: slideImg.alt || ''
    });
    slide.style.cursor = 'zoom-in';
    slide.addEventListener('click', (e) => {
      // Evitar abrir si fue un swipe (mover > 8px)
      if (slide._wasSwipe) { slide._wasSwipe = false; return; }
      e.preventDefault();
      open(idx);
    });
    // Detectar swipe vs tap en táctil para no abrir lightbox tras swipe
    let tStartX = 0, tStartY = 0;
    slide.addEventListener('touchstart', (ev) => {
      tStartX = ev.touches[0].clientX;
      tStartY = ev.touches[0].clientY;
      slide._wasSwipe = false;
    }, { passive: true });
    slide.addEventListener('touchend', (ev) => {
      const dx = Math.abs(ev.changedTouches[0].clientX - tStartX);
      const dy = Math.abs(ev.changedTouches[0].clientY - tStartY);
      slide._wasSwipe = dx > 10 || dy > 10;
    }, { passive: true });
  });

  if (items.length === 0) return;

  let current = 0;
  let zoom    = 1;
  let panX    = 0, panY = 0;
  let isPanning = false;
  let panStartX = 0, panStartY = 0;
  let panStartTX = 0, panStartTY = 0;
  let pinchStartDist = 0, pinchStartZoom = 1;
  let touchStartX = 0, touchStartY = 0;

  function applyTransform() {
    img.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoom + ')';
    lightbox.classList.toggle('is-zoomed', zoom > 1);
  }

  function resetZoom() {
    zoom = 1; panX = 0; panY = 0;
    applyTransform();
  }

  function show(i) {
    current = (i + items.length) % items.length;
    img.src = items[current].src;
    img.alt = items[current].alt;
    if (counter) counter.textContent = (current + 1) + ' / ' + items.length;
    resetZoom();
  }

  function open(i) {
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  if (nextBtn)  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  if (items.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // Clic fuera de la imagen cierra
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === stage) close();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Zoom con rueda
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0025;
    zoom = Math.max(1, Math.min(4, zoom + delta));
    if (zoom === 1) { panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  // Doble clic alterna zoom
  stage.addEventListener('dblclick', () => {
    zoom = zoom === 1 ? 2.5 : 1;
    panX = 0; panY = 0;
    applyTransform();
  });

  // Pan con mouse cuando hay zoom
  stage.addEventListener('mousedown', (e) => {
    if (zoom <= 1) return;
    isPanning = true;
    panStartX = e.clientX; panStartY = e.clientY;
    panStartTX = panX;     panStartTY = panY;
    lightbox.classList.add('is-panning');
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = panStartTX + (e.clientX - panStartX);
    panY = panStartTY + (e.clientY - panStartY);
    applyTransform();
  });
  document.addEventListener('mouseup', () => {
    isPanning = false;
    lightbox.classList.remove('is-panning');
  });

  // Táctil: pinch para zoom, drag para pan, swipe para navegar (sin zoom)
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist = Math.hypot(dx, dy);
      pinchStartZoom = zoom;
    } else if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      panStartTX = panX;
      panStartTY = panY;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinchStartDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      zoom = Math.max(1, Math.min(4, pinchStartZoom * (dist / pinchStartDist)));
      if (zoom === 1) { panX = 0; panY = 0; }
      applyTransform();
    } else if (e.touches.length === 1 && zoom > 1) {
      panX = panStartTX + (e.touches[0].clientX - touchStartX);
      panY = panStartTY + (e.touches[0].clientY - touchStartY);
      applyTransform();
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    pinchStartDist = 0;
    if (zoom === 1 && e.changedTouches.length === 1 && items.length > 1) {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 60) {
        if (diff < 0) show(current + 1);
        else show(current - 1);
      }
    }
  });
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

        /* Sincronizar galería con la imagen de la variante */
        const media = match.featured_media || match.featured_image;
        if (media && media.position) {
          const slideIndex = media.position - 1;
          const dot = document.querySelector('.pdp__carousel-dot[data-index="' + slideIndex + '"]');
          if (dot) {
            dot.click();
          } else {
            const thumb = document.querySelector('.pdp__thumb[data-index="' + slideIndex + '"]');
            if (thumb) thumb.click();
          }
        }
      }
    });
  });

  function formatMoney(cents) {
    return '$' + (cents / 100).toLocaleString('es-CO', { minimumFractionDigits: 0 });
  }
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

/* ═══════════════════════════════════════════
   CART DRAWER — slide-in lateral derecho
   ═══════════════════════════════════════════ */
function formatMoney(cents) {
  if (window.Shopify && Shopify.formatMoney) {
    try { return Shopify.formatMoney(cents, "${{amount}}"); } catch (e) {}
  }
  const value = (cents / 100).toFixed(0);
  return '$' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!drawer || !backdrop) return;
  loadCartDrawer();
  drawer.classList.add('open');
  backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-drawer-open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!drawer || !backdrop) return;
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-drawer-open');
}

function loadCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  if (!body) return;
  body.innerHTML = '<div class="cart-drawer__loading"><span class="spinner"></span></div>';
  if (footer) footer.hidden = true;

  fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
    .then(r => r.json())
    .then(cart => renderCartDrawer(cart))
    .catch(() => {
      body.innerHTML = '<div class="cart-drawer__empty">No se pudo cargar el carrito.</div>';
    });
}

function renderCartDrawer(cart) {
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  const subtotalEl = document.getElementById('cart-drawer-subtotal');
  if (!body) return;

  if (!cart.items || cart.items.length === 0) {
    body.innerHTML = '<div class="cart-drawer__empty"><div class="cart-drawer__empty-icon">🛒</div>Tu carrito está vacío</div>';
    if (footer) footer.hidden = true;
    return;
  }

  const items = cart.items.map((item, index) => {
    const lineNumber = index + 1;
    const img = item.image
      ? `<img src="${item.image.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original)\./, '_200x.')}" alt="" class="cart-drawer__item-img" loading="lazy">`
      : '<div class="cart-drawer__item-img"></div>';
    const variant = (item.variant_title && item.variant_title !== 'Default Title')
      ? `<div class="cart-drawer__item-variant">${item.variant_title}</div>`
      : '';
    const compare = (item.original_line_price && item.original_line_price > item.line_price)
      ? `<del>${formatMoney(item.original_price)}</del>`
      : '';
    return `
      <li class="cart-drawer__item" data-line="${lineNumber}" data-key="${item.key}">
        <a href="${item.url}">${img}</a>
        <div class="cart-drawer__item-info">
          <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
          ${variant}
          <div class="cart-drawer__item-price">${compare}${formatMoney(item.final_price)}</div>
          <div class="cart-drawer__item-controls">
            <div class="cart-drawer__qty">
              <button type="button" class="cart-drawer__qty-btn" data-action="minus" aria-label="Disminuir">−</button>
              <span class="cart-drawer__qty-value">${item.quantity}</span>
              <button type="button" class="cart-drawer__qty-btn" data-action="plus" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="cart-drawer__remove" aria-label="Eliminar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </li>`;
  }).join('');

  body.innerHTML = `<ul class="cart-drawer__items">${items}</ul>`;
  if (subtotalEl) subtotalEl.textContent = formatMoney(cart.items_subtotal_price || cart.total_price);
  if (footer) footer.hidden = false;
}

function changeCartLine(lineNumber, quantity) {
  return fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ line: lineNumber, quantity: quantity })
  })
    .then(r => r.json())
    .then(cart => {
      renderCartDrawer(cart);
      const countEl = document.getElementById('cart-count');
      if (countEl) countEl.textContent = cart.item_count;
      if (typeof updateFloatingCheckout === 'function') updateFloatingCheckout(cart.item_count);
      return cart;
    });
}

function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const closeBtn = document.getElementById('cart-drawer-close');
  if (!drawer) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeCartDrawer();
  });

  // Delegated handlers para items dinámicos
  drawer.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('.cart-drawer__qty-btn');
    const removeBtn = e.target.closest('.cart-drawer__remove');
    const item = e.target.closest('.cart-drawer__item');
    if (!item) return;
    const line = parseInt(item.dataset.line, 10);
    const qtyEl = item.querySelector('.cart-drawer__qty-value');
    const currentQty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

    if (qtyBtn) {
      const action = qtyBtn.dataset.action;
      const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);
      qtyBtn.disabled = true;
      changeCartLine(line, newQty).catch(() => { qtyBtn.disabled = false; });
    } else if (removeBtn) {
      removeBtn.disabled = true;
      changeCartLine(line, 0).catch(() => { removeBtn.disabled = false; });
    }
  });

  // Abrir drawer al click en el ícono de carrito del header
  document.querySelectorAll('a.header__cart, a[href="/cart"].floating-checkout').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
}

document.addEventListener('DOMContentLoaded', initCartDrawer);

/* ───────────────────────────────────────────
   Reels de video nativos (PDP) — controles propios
   play/pausa, mute, barra de avance (seek), autoplay al ver
   ─────────────────────────────────────────── */
function initVideoReels() {
  const reels = document.querySelectorAll('[data-vreel]');
  if (!reels.length) return;

  reels.forEach((reel) => {
    const video = reel.querySelector('.vreel__video');
    const toggleBtn = reel.querySelector('[data-vreel-toggle]');
    const muteBtn = reel.querySelector('[data-vreel-mute]');
    const media = reel.querySelector('.vreel__media');
    const progress = reel.querySelector('[data-vreel-progress]');
    const fill = reel.querySelector('[data-vreel-fill]');
    if (!video) return;

    // Estado inicial: silenciado (requisito para autoplay)
    video.muted = true;

    const playVideo = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    video.addEventListener('play', () => reel.classList.add('is-playing'));
    video.addEventListener('pause', () => reel.classList.remove('is-playing'));

    // Play / Pausa (botón central y tap sobre el video)
    const togglePlay = (e) => {
      if (e) e.stopPropagation();
      if (video.paused) playVideo(); else video.pause();
    };
    if (toggleBtn) toggleBtn.addEventListener('click', togglePlay);
    if (media) {
      media.addEventListener('click', (e) => {
        // Ignora clics sobre los controles (mute / barra)
        if (e.target.closest('[data-vreel-mute]') || e.target.closest('[data-vreel-progress]') || e.target.closest('[data-vreel-toggle]')) return;
        togglePlay();
      });
    }

    // Mute / unmute
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        reel.classList.toggle('is-unmuted', !video.muted);
      });
    }

    // Barra de progreso
    video.addEventListener('timeupdate', () => {
      if (!video.duration || !isFinite(video.duration)) return;
      if (fill) fill.style.width = ((video.currentTime / video.duration) * 100) + '%';
    });

    // Seek (click + arrastre) sobre la barra
    if (progress) {
      let seeking = false;
      const seekTo = (clientX) => {
        const rect = progress.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = ratio * video.duration;
          if (fill) fill.style.width = (ratio * 100) + '%';
        }
      };
      progress.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        seeking = true;
        reel.classList.add('is-seeking');
        progress.setPointerCapture(e.pointerId);
        seekTo(e.clientX);
      });
      progress.addEventListener('pointermove', (e) => {
        if (seeking) seekTo(e.clientX);
      });
      const endSeek = () => { seeking = false; reel.classList.remove('is-seeking'); };
      progress.addEventListener('pointerup', endSeek);
      progress.addEventListener('pointercancel', endSeek);
    }
  });

  // Autoplay (silenciado) del reel visible; pausa los que salen de vista
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('.vreel__video');
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: [0, 0.6, 1] });
    reels.forEach((reel) => io.observe(reel));
  }
}

document.addEventListener('DOMContentLoaded', initVideoReels);
