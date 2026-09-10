/**
 * Language Switching & Interactive Components
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'preferred-language';
  const DEFAULT_LANG = 'ja';

  const LANGUAGES = {
    ja: { htmlLang: 'ja',    title: '岸本悠佑 | AI × 教育 × コミュニティ' },
    en: { htmlLang: 'en',    title: 'Yusuke Kishimoto | AI × Education × Community' },
    zh: { htmlLang: 'zh-CN', title: '岸本悠佑 | AI × 教育 × 社群' },
    fr: { htmlLang: 'fr',    title: 'Yusuke Kishimoto | IA × Éducation × Communauté' },
    de: { htmlLang: 'de',    title: 'Yusuke Kishimoto | KI × Bildung × Community' }
  };

  let currentLang = DEFAULT_LANG;

  // ============================================
  // Language Switching
  // ============================================

  function setLanguage(lang) {
    if (!LANGUAGES[lang]) lang = DEFAULT_LANG;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Fall back on pages that don't have this language's content
    if (!document.getElementById('content-' + lang)) lang = DEFAULT_LANG;
    currentLang = lang;

    let activeContent = null;
    Object.keys(LANGUAGES).forEach(function(key) {
      const content = document.getElementById('content-' + key);
      const btn = document.getElementById('lang-' + key);
      if (content) content.style.display = key === lang ? 'block' : 'none';
      if (btn) btn.classList.toggle('active', key === lang);
      if (key === lang) activeContent = content;
    });

    const activeBtn = document.getElementById('lang-' + lang);
    const current = document.getElementById('lang-current');
    if (current && activeBtn) current.textContent = activeBtn.dataset.short || lang.toUpperCase();

    document.documentElement.lang = LANGUAGES[lang].htmlLang;
    document.title = (activeContent && activeContent.dataset.title) || LANGUAGES[lang].title;
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES[saved]) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  // ?lang=xx in the URL overrides the saved preference (e.g. index.html?lang=en#portfolio).
  // The parameter is removed from the address bar after it has been applied so that
  // later manual switches are not undone by a reload.
  function getLanguageFromUrl() {
    let lang = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const value = (params.get('lang') || '').toLowerCase();
      if (LANGUAGES[value]) {
        lang = value;
        params.delete('lang');
        const query = params.toString();
        const cleanUrl = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
        history.replaceState(history.state, '', cleanUrl);
      }
    } catch (e) {}
    return lang;
  }

  // ============================================
  // Language Dropdown
  // ============================================

  function initLanguageMenu() {
    const nav = document.querySelector('.lang-nav');
    const toggle = document.getElementById('lang-toggle');
    if (!nav || !toggle) return;

    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains('open'));
    });

    Object.keys(LANGUAGES).forEach(function(key) {
      const btn = document.getElementById('lang-' + key);
      if (btn) btn.addEventListener('click', function() {
        setLanguage(key);
        setOpen(false);
      });
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.lang-nav')) setOpen(false);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ============================================
  // In-page anchors (per-language sections)
  // ============================================
  // Each language wrapper contains its own copy of a section, so anchors are
  // resolved against the currently visible wrapper via data-anchor="name".

  function findAnchor(name) {
    if (!name) return null;
    const wrapper = document.getElementById('content-' + currentLang);
    const scope = wrapper || document;
    let target = null;
    try {
      target = scope.querySelector('[data-anchor="' + name + '"]');
    } catch (e) {}
    return target;
  }

  function scrollToAnchor(name, smooth) {
    const target = findAnchor(name);
    if (!target) return false;
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    return true;
  }

  function initAnchors() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const name = link.getAttribute('href').slice(1);
      if (!findAnchor(name)) return;
      e.preventDefault();
      scrollToAnchor(name, true);
      try { history.pushState(null, '', '#' + name); } catch (err) {}
    });

    window.addEventListener('hashchange', function() {
      scrollToAnchor(decodeURIComponent(window.location.hash.slice(1)), true);
    });

    const initial = decodeURIComponent(window.location.hash.slice(1));
    if (initial && findAnchor(initial)) {
      // Jump now, and again once images/fonts have settled the layout.
      scrollToAnchor(initial, false);
      window.addEventListener('load', function() {
        setTimeout(function() { scrollToAnchor(initial, false); }, 50);
      });
    }
  }

  // ============================================
  // Number Tooltip Toggle
  // ============================================

  function initTooltipToggle() {
    const numberItems = document.querySelectorAll('.number-item');

    numberItems.forEach(item => {
      item.addEventListener('click', function(e) {
        const wasActive = this.classList.contains('active');

        // Close all other tooltips
        numberItems.forEach(other => other.classList.remove('active'));

        // Toggle this one
        if (!wasActive) {
          this.classList.add('active');
        }
      });
    });

    // Close tooltip when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.number-item')) {
        numberItems.forEach(item => item.classList.remove('active'));
      }
    });
  }

  // ============================================
  // Portfolio Embedded Playback
  // ============================================

  function initPortfolioPlayback() {
    const cards = document.querySelectorAll('.portfolio-card[data-youtube-id]');

    function playCard(card) {
      const thumb = card.querySelector('.portfolio-thumb');
      const videoId = card.dataset.youtubeId;
      if (!thumb || !videoId || thumb.querySelector('iframe')) return;

      const iframe = document.createElement('iframe');
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const params = new URLSearchParams({
        autoplay: '1',
        mute: isTouchDevice ? '1' : '0',
        playsinline: '1',
        rel: '0',
        enablejsapi: '1',
        origin: window.location.origin
      });

      function sendYouTubeCommand(func, args) {
        iframe.contentWindow?.postMessage(JSON.stringify({
          event: 'command',
          func: func,
          args: args || []
        }), 'https://www.youtube.com');
      }

      iframe.className = 'portfolio-embed';
      iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?' + params.toString();
      iframe.title = card.querySelector('h3')?.textContent || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.addEventListener('load', function() {
        const playAttempts = [0, 250, 700, 1200];
        playAttempts.forEach(function(delay) {
          setTimeout(function() {
            sendYouTubeCommand('setVolume', [33]);
            if (!isTouchDevice) {
              sendYouTubeCommand('unMute');
            }
            sendYouTubeCommand('playVideo');
          }, delay);
        });
      });

      thumb.replaceChildren(iframe);
      card.classList.add('is-playing');
      card.removeAttribute('role');
      card.removeAttribute('tabindex');
    }

    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.source-work')) return;
        playCard(this);
      });

      card.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('.source-work')) return;
        e.preventDefault();
        playCard(this);
      });
    });
  }

  // ============================================
  // PDF Modal
  // ============================================

  function initPdfModal() {
    const modal = document.getElementById('pdf-modal');
    if (!modal) return;

    const iframe = document.getElementById('pdf-modal-iframe');
    const image = document.getElementById('pdf-modal-img');
    const content = modal.querySelector('.pdf-modal-content');
    const overlay = modal.querySelector('.pdf-modal-overlay');
    const closeBtn = modal.querySelector('.pdf-modal-close');

    function openModal(src) {
      const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(src);
      if (isImage && image) {
        image.src = src;
        content.classList.add('image-mode');
      } else {
        iframe.src = src + '#view=Fit';
        content.classList.remove('image-mode');
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() {
        iframe.src = '';
        if (image) image.src = '';
      }, 300);
    }

    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('.modal-trigger');
      if (trigger) {
        e.preventDefault();
        openModal(trigger.dataset.src);
      }
    });

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ============================================
  // Init
  // ============================================

  function init() {
    setLanguage(getLanguageFromUrl() || getSavedLanguage());
    initLanguageMenu();
    initAnchors();
    initTooltipToggle();
    initPortfolioPlayback();
    initPdfModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
