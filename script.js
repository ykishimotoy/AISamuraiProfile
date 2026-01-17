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
    const sections = activeWrapper.querySelectorAll('.hero, .about, .projects, .numbers, .philosophy, .personal, .contact');

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
  // Init
  // ============================================

  function init() {
    setLanguage(getSavedLanguage());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
