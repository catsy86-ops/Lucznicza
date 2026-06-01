/**
 * accessibility-enhancements.js — A11y & UX improvements for Łucznicza Guide
 * - Better keyboard navigation
 * - Screen reader optimizations
 * - Touch-friendly UI tweaks
 * - Reduced motion support
 */
'use strict';

const AccessibilityEnhancements = (() => {
  
  const cfg = {
    prefersReducedMotion: false,
    keyboardNavigationActive: false,
    lastFocusedSection: null
  };

  function init() {
    detectMotionPreference();
    setupKeyboardShortcuts();
    enhanceFormAccessibility();
    setupAriaLiveRegions();
    improveColorContrast();
    setupTouchTargetSizes();
  }

  // Detect if user prefers reduced motion
  function detectMotionPreference() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cfg.prefersReducedMotion = true;
      document.documentElement.style.setProperty('--motion-duration', '0.05s');
      document.documentElement.setAttribute('data-reduce-motion', 'true');
      console.log('🎬 Zmniejszona animacja (prefers-reduced-motion: reduce)');
    }
  }

  // Setup keyboard shortcuts for faster navigation
  function setupKeyboardShortcuts() {
    const shortcuts = {
      'm': () => navigateTo('map'),           // M for Map
      'p': () => navigateTo('places'),        // P for Places
      'r': () => navigateTo('routes'),        // R for Routes
      'i': () => navigateTo('info'),          // I for Info
      't': () => navigateTo('transport'),     // T for Transport
      'e': () => navigateTo('events'),        // E for Events
      'l': () => navigateTo('live'),          // L for Live
      'c': () => navigateTo('community'),     // C for Community
      '/': () => document.getElementById('searchInput')?.focus(),  // / for Search
      'shift+d': () => toggleDarkMode(),      // Shift+D for Dark mode toggle
      '?': () => showKeyboardHelp()            // ? for Help
    };

    document.addEventListener('keydown', (e) => {
      // Ignore if focus is on input, textarea or contenteditable
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
        return;
      }

      // Don't trigger on Ctrl/Cmd key combos (except Shift+D)
      if ((e.ctrlKey || e.metaKey) && e.key !== 'Shift') return;

      const key = e.shiftKey && e.key !== 'Shift' ? `shift+${e.key.toLowerCase()}` : e.key.toLowerCase();
      const handler = shortcuts[key];

      if (handler) {
        e.preventDefault();
        handler();
      }
    });
  }

  function toggleDarkMode() {
    const btn = document.getElementById('themeBtn');
    if (btn) btn.click();
  }

  function showKeyboardHelp() {
    const helpContent = `
      <div class="keyboard-help">
        <h3>⌨️ Skróty klawiszowe</h3>
        <div class="help-grid">
          <div class="help-item"><kbd>M</kbd><span>Mapa</span></div>
          <div class="help-item"><kbd>P</kbd><span>Miejsca</span></div>
          <div class="help-item"><kbd>R</kbd><span>Trasy</span></div>
          <div class="help-item"><kbd>I</kbd><span>O dzielnicy</span></div>
          <div class="help-item"><kbd>T</kbd><span>Transport</span></div>
          <div class="help-item"><kbd>E</kbd><span>Wydarzenia</span></div>
          <div class="help-item"><kbd>L</kbd><span>Na żywo</span></div>
          <div class="help-item"><kbd>C</kbd><span>Społeczność</span></div>
          <div class="help-item"><kbd>/</kbd><span>Szukaj</span></div>
          <div class="help-item"><kbd>Shift+D</kbd><span>Motyw</span></div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:400px">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="modal-content">${helpContent}</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Enhance form inputs with better ARIA labels
  function enhanceFormAccessibility() {
    // Add aria-labels to inputs without labels
    document.querySelectorAll('input[type="text"], input[type="search"], select, textarea').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.closest('label')) {
        const placeholder = input.placeholder || input.name;
        if (placeholder) {
          input.setAttribute('aria-label', placeholder);
        }
      }
    });

    // Improve button accessibility
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.getAttribute('aria-label') && btn.innerHTML.trim().length < 50) {
        // If button only has emoji or short text, add aria-label for clarity
        if (btn.innerHTML.includes('🤍') || btn.innerHTML.includes('❤️')) {
          btn.setAttribute('aria-label', 'Ulubione');
        }
      }
    });
  }

  // Setup ARIA live regions for announcements
  function setupAriaLiveRegions() {
    // Toast notifications should use aria-live
    const toast = document.getElementById('toast');
    if (toast) {
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
    }

    // Live region for map updates
    if (!document.getElementById('mapAnnouncements')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'mapAnnouncements';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
  }

  // Improve color contrast for better readability
  function improveColorContrast() {
    // Add high-contrast mode support
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
      console.log('🎨 Wyskoki kontrast (prefers-contrast: more)');
    }
  }

  // Ensure touch targets are at least 44x44px (WCAG 2.1 AAA)
  function setupTouchTargetSizes() {
    // This is handled via CSS, but we can add JS validation if needed
    const touchButtons = document.querySelectorAll('button, a, input[type="button"], label');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      touchButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          // Add padding via JS if needed
          if (!btn.classList.contains('no-padding-touch')) {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
            btn.style.display = 'inline-flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
          }
        }
      });
    }
  }

  // Announce section changes for screen readers
  function announceNavigation(sectionName) {
    const announcement = document.getElementById('mapAnnouncements');
    if (announcement) {
      const sectionLabels = {
        map: 'Mapa interaktywna',
        places: 'Lista miejsc w okolicy',
        routes: 'Trasy spacerowe',
        info: 'Informacje o dzielnicy',
        transport: 'Transport publiczny',
        events: 'Wydarzenia',
        live: 'Dane na żywo',
        community: 'Społeczność'
      };
      const label = sectionLabels[sectionName] || sectionName;
      announcement.textContent = `Przeszedłeś do sekcji: ${label}`;
    }
  }

  // Provide feedback for actions
  function announceAction(message) {
    const announcement = document.getElementById('mapAnnouncements');
    if (announcement) {
      announcement.textContent = message;
    }
  }

  // Public API
  return {
    init,
    announceNavigation,
    announceAction
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AccessibilityEnhancements !== 'undefined') {
    AccessibilityEnhancements.init();
  }
});

window.AccessibilityEnhancements = AccessibilityEnhancements;
