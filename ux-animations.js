/**
 * ux-animations.js — Page transitions, toast improvements, keyboard shortcuts
 * Smooth animations, enhanced notifications, keyboard navigation
 */

'use strict';

const UXAnimations = (() => {
  // Page transition animations
  const transitions = {
    fadeIn: 0.3,  // seconds
    slideIn: 0.4,
    scaleIn: 0.25
  };

  // Initialize animations
  function init() {
    setupTransitionAnimations();
    setupEnhancedToasts();
    setupKeyboardShortcuts();
    setupResponsiveAnimations();
    console.log('✨ UX animations initialized');
  }

  // ===== PAGE TRANSITIONS =====
  function setupTransitionAnimations() {
    // Add CSS animations if not present
    if (!document.getElementById('uxAnimStyle')) {
      const style = document.createElement('style');
      style.id = 'uxAnimStyle';
      style.textContent = `
        /* Fade animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* Slide animations */
        @keyframes slideInUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Scale animations */
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Pulse animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Bounce animations */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Shake animations */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Enhanced toast styles */
        .toast-enhanced {
          animation: slideInUp 0.3s ease-out;
        }

        .toast-dismiss {
          animation: slideInDown 0.3s ease-in reverse;
        }

        /* Button hover animations */
        button:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }

        button:active {
          transform: translateY(0);
        }

        /* Modal animations */
        .modal-open {
          animation: scaleIn 0.25s ease-out;
        }

        /* Responsive animations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeIn ${transitions.fadeIn}s ease-out`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all section elements
    document.querySelectorAll('section, .card, .panel').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== ENHANCED TOASTS =====
  function setupEnhancedToasts() {
    window.showToastEnhanced = function(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      const toastId = `toast-${Date.now()}`;
      
      toast.id = toastId;
      toast.className = `toast-enhanced toast-${type}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      
      // Icon based on type
      const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
      };
      
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${
          type === 'success' ? '#10b981' :
          type === 'error' ? '#ef4444' :
          type === 'warning' ? '#f59e0b' :
          '#3b82f6'
        };
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        animation: slideInUp 0.3s ease-out;
        max-width: 400px;
      `;
      
      toast.innerHTML = `
        <span style="font-size: 18px;">${icons[type] || '📢'}</span>
        <span>${message}</span>
        <button style="
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          margin-left: auto;
        " aria-label="Zamknij powiadomienie">✕</button>
      `;
      
      const closeBtn = toast.querySelector('button');
      closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideInDown 0.3s ease-in reverse';
        setTimeout(() => toast.remove(), 300);
      });
      
      document.body.appendChild(toast);
      
      // Auto dismiss
      setTimeout(() => {
        if (document.getElementById(toastId)) {
          toast.style.animation = 'slideInDown 0.3s ease-in reverse';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
      
      return toastId;
    };
  }

  // ===== KEYBOARD SHORTCUTS =====
  function setupKeyboardShortcuts() {
    const shortcuts = {
      // M: Toggle mascot (handled in pogon-mascot.js)
      // ? - Show help
      '?': () => showHelpDialog(),
      // Esc - Close dialogs
      'Escape': () => closeAllDialogs(),
      // / - Focus search
      '/': (e) => {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="search" i]') ||
                           document.querySelector('#search');
        if (searchInput) searchInput.focus();
      },
      // 1-3 - Quick nav
      '1': () => navigateToSection('places'),
      '2': () => navigateToSection('routes'),
      '3': () => navigateToSection('live'),
      // + / - : Zoom controls
      '+': () => zoomMap(1),
      '-': () => zoomMap(-1),
      // S - Settings
      's': () => toggleSettings(),
      // D - Dark mode toggle
      'd': () => toggleDarkMode()
    };

    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        // Except for Escape
        if (e.key === 'Escape') closeAllDialogs();
        return;
      }

      if (shortcuts[e.key]) {
        shortcuts[e.key](e);
      }
    });

    console.log('⌨️ Keyboard shortcuts enabled: ?, Esc, /, 1-3, +, -, s, d');
  }

  // ===== RESPONSIVE ANIMATIONS =====
  function setupResponsiveAnimations() {
    // Detect if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      console.log('♿ Reduced motion mode detected');
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Handle mobile gestures
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swiped left
          navigateNext();
        } else {
          // Swiped right
          navigatePrev();
        }
      }
    }
  }

  // ===== HELPER FUNCTIONS =====
  function showHelpDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    dialog.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        animation: scaleIn 0.25s ease-out;
      ">
        <h2>⌨️ Skróty Klawiszowe</h2>
        <div style="display: grid; gap: 12px; margin-top: 16px; font-size: 14px;">
          <div><kbd>?</kbd> — Pomoc</div>
          <div><kbd>Esc</kbd> — Zamknij dialogi</div>
          <div><kbd>/</kbd> — Szukaj</div>
          <div><kbd>1-3</kbd> — Miejsca / Trasy / Live</div>
          <div><kbd>+/-</kbd> — Zoom mapy</div>
          <div><kbd>S</kbd> — Ustawienia</div>
          <div><kbd>D</kbd> — Tryb ciemny</div>
          <div><kbd>M</kbd> — Przełącz maskotę</div>
        </div>
        <button onclick="this.closest('div').parentElement.parentElement.remove()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        ">Zamknij</button>
      </div>
    `;
    
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.remove();
    });
    
    document.body.appendChild(dialog);
  }

  function closeAllDialogs() {
    document.querySelectorAll('[style*="position: fixed"]').forEach(el => {
      if (el.style.background && el.style.background.includes('rgba')) {
        el.remove();
      }
    });
  }

  function navigateToSection(section) {
    const sections = {
      'places': 'placesPanel',
      'routes': 'routesPanel',
      'live': 'livePanel'
    };
    const el = document.getElementById(sections[section]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced(`📍 ${section.toUpperCase()}`);
      }
    }
  }

  function navigateNext() {
    console.log('➡️ Swipe next');
  }

  function navigatePrev() {
    console.log('⬅️ Swipe prev');
  }

  function zoomMap(direction) {
    if (typeof window.map !== 'undefined' && window.map) {
      window.map.setZoom(window.map.getZoom() + direction);
    }
  }

  function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel) {
      settingsPanel.style.display = 
        settingsPanel.style.display === 'none' ? 'block' : 'none';
    }
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { 
    init,
    showHelpDialog,
    closeAllDialogs,
    navigateToSection
  };
})();

window.UXAnimations = UXAnimations;
