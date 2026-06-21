/**
 * Language Switching & Scroll Animations
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'preferred-language';
  const DEFAULT_LANG = 'ja';

  const langJaBtn = document.getElementById('lang-ja');
  const langEnBtn = document.getElementById('lang-en');
  const contentJa = document.getElementById('content-ja');
  const contentEn = document.getElementById('content-en');

  // ============================================
  // Language Switching
  // ============================================

  function setLanguage(lang) {
    if (lang === 'en') {
      contentJa.style.display = 'none';
      contentEn.style.display = 'block';
      langJaBtn.classList.remove('active');
      langEnBtn.classList.add('active');
      document.documentElement.lang = 'en';
      document.title = 'Yusuke Kishimoto | AI × Education × Community';
    } else {
      contentJa.style.display = 'block';
      contentEn.style.display = 'none';
      langJaBtn.classList.add('active');
      langEnBtn.classList.remove('active');
      document.documentElement.lang = 'ja';
      document.title = '岸本悠佑 | AI × 教育 × コミュニティ';
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Re-trigger animations for new content
    setTimeout(initScrollAnimations, 50);
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ja' || saved === 'en') return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  langJaBtn.addEventListener('click', () => setLanguage('ja'));
  langEnBtn.addEventListener('click', () => setLanguage('en'));

  // ============================================
  // Scroll Animations
  // ============================================

  function initScrollAnimations() {
    const activeWrapper = document.querySelector('.content-wrapper[style*="block"], .content-wrapper:not([style*="none"])');
    if (!activeWrapper) return;

    // Select sections that should animate
    const sections = activeWrapper.querySelectorAll('.hero, .about, .projects, .portfolio, .numbers, .philosophy, .personal, .contact');

    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
      section.classList.remove('visible');
      observer.observe(section);
    });

    // Hero is always visible immediately
    const hero = activeWrapper.querySelector('.hero');
    if (hero) hero.classList.add('visible');
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
      const params = new URLSearchParams({
        autoplay: '1',
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
        sendYouTubeCommand('setVolume', [33]);
        sendYouTubeCommand('unMute');
        sendYouTubeCommand('playVideo');
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
    const overlay = modal.querySelector('.pdf-modal-overlay');
    const closeBtn = modal.querySelector('.pdf-modal-close');

    function openModal(src) {
      iframe.src = src + '#view=Fit';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { iframe.src = ''; }, 300);
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
    setLanguage(getSavedLanguage());
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
