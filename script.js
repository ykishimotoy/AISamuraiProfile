/**
 * Language Switching & Interactive Components
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'preferred-language';
  const DEFAULT_LANG = 'ja';

  const LANGUAGES = {
    ja: { htmlLang: 'ja', title: '岸本悠佑 | AI × 教育 × コミュニティ' },
    en: { htmlLang: 'en', title: 'Yusuke Kishimoto | AI × Education × Community' },
    zh: { htmlLang: 'zh-CN', title: '岸本悠佑 | AI × 教育 × 社群' }
  };

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

    Object.keys(LANGUAGES).forEach(function(key) {
      const content = document.getElementById('content-' + key);
      const btn = document.getElementById('lang-' + key);
      if (content) content.style.display = key === lang ? 'block' : 'none';
      if (btn) btn.classList.toggle('active', key === lang);
    });

    document.documentElement.lang = LANGUAGES[lang].htmlLang;
    document.title = LANGUAGES[lang].title;
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES[saved]) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  Object.keys(LANGUAGES).forEach(function(key) {
    const btn = document.getElementById('lang-' + key);
    if (btn) btn.addEventListener('click', () => setLanguage(key));
  });

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
