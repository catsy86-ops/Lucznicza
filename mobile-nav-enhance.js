/* ===== ENHANCED MOBILE NAVIGATION ===== */
'use strict';

/**
 * Mobile Navigation Enhancement Module
 * Provides smooth interactions, haptic feedback, and improved UX for bottom nav
 */
const MobileNavEnhance = (() => {
  const config = {
    enableHaptics: true,
    scrollThreshold: 80,
    animationDuration: 250,
    mobileBreakpoint: 480,
  };

  let lastScrollY = 0;
  let isNavHidden = false;
  let touchStart = 0;
  let touchEnd = 0;

  /**
   * Initialize mobile nav enhancements
   */
  function init() {
    console.log('📱 Inicjalizacja ulepszonej nawigacji mobilnej...');
    
    setupNavButtons();
    // Disable scroll-based hide on mobile - just use manual control
    // setupScrollBehavior();
    setupTouchGestures();
    setupResponsiveness();
    setupAccessibility();
    
    // Sync nav state on page load
    syncNavState();
    
    console.log('✨ Ulepszona nawigacja mobilna gotowa!');
  }

  /**
   * Setup button interactions with haptic feedback
   */
  function setupNavButtons() {
    const navButtons = document.querySelectorAll('.bnav-btn');
    
    navButtons.forEach(btn => {
      // Haptic feedback on click
      btn.addEventListener('click', (e) => {
        triggerHapticFeedback('light');
        
        // Add ripple effect
        const ripple = createRippleElement(e);
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });

      // Prevent double-tap zoom on mobile via CSS (touch-action: manipulation)
      // but don't preventDefault here as it might block click events
      btn.addEventListener('touchend', (e) => {
        // e.preventDefault(); // Removed to allow click events
      });

      // Enhanced hover state for touch devices
      btn.addEventListener('touchstart', () => {
        btn.style.opacity = '0.9';
      });

      btn.addEventListener('touchend', () => {
        btn.style.opacity = '1';
      });
    });
  }

  /**
   * Create ripple effect element
   */
  function createRippleElement(event) {
    const ripple = document.createElement('span');
    ripple.className = 'nav-ripple';
    
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      pointer-events: none;
      animation: rippleEffect 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;
    
    return ripple;
  }

  /**
   * Scroll behavior - hide nav on scroll down, show on scroll up
   * DISABLED when sidebar is open to prevent conflicts
   */
  function setupScrollBehavior() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      // Don't auto-hide nav when sidebar is open
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        return;
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY;
          const deltaScroll = Math.abs(currentScrollY - lastScrollY);

          // Only hide/show if scrolled enough to avoid jitter
          if (deltaScroll > config.scrollThreshold) {
            if (isScrollingDown && !isNavHidden) {
              hideNav(nav);
              isNavHidden = true;
            } else if (!isScrollingDown && isNavHidden) {
              showNav(nav);
              isNavHidden = false;
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Hide navigation with animation
   */
  function hideNav(nav) {
    if (!nav) return;
    nav.style.transition = `transform ${config.animationDuration}ms cubic-bezier(0.34,1.56,0.64,1)`;
    nav.style.transform = 'translateY(100%)';
  }

  /**
   * Show navigation with animation
   */
  function showNav(nav) {
    if (!nav) return;
    nav.style.transition = `transform ${config.animationDuration}ms cubic-bezier(0.34,1.56,0.64,1)`;
    nav.style.transform = 'translateY(0)';
  }

  /**
   * Setup touch swipe gestures for nav
   */
  function setupTouchGestures() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav || !('ontouchstart' in window)) return;

    nav.addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].clientY;
    }, { passive: true });

    nav.addEventListener('touchend', (e) => {
      touchEnd = e.changedTouches[0].clientY;
      handleSwipe();
    }, { passive: true });
  }

  /**
   * Handle swipe gestures - keeps nav always visible and accessible
   */
  function handleSwipe() {
    const nav = document.querySelector('.bottom-nav');
    if (nav && isNavHidden) {
      showNav(nav);
      isNavHidden = false;
    }
  }

  /**
   * Responsive adjustments
   */
  function setupResponsiveness() {
    const mediaQuery = window.matchMedia(`(max-width: ${config.mobileBreakpoint}px)`);
    
    function handleMediaChange(e) {
      if (e.matches) {
        // Mobile
        optimizeForMobile();
      } else {
        // Desktop
        optimizeForDesktop();
      }
    }

    mediaQuery.addListener(handleMediaChange);
    handleMediaChange(mediaQuery);
  }

  /**
   * Mobile-specific optimizations
   */
  function optimizeForMobile() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    // Add mobile-specific attributes
    nav.setAttribute('data-mobile', 'true');

    // Ensure touch target sizes are adequate
    document.querySelectorAll('.bnav-btn').forEach(btn => {
      const computedStyle = window.getComputedStyle(btn);
      const height = parseFloat(computedStyle.minHeight);
      if (height < 44) {
        btn.style.minHeight = '44px';
      }
    });
  }

  /**
   * Desktop-specific optimizations
   */
  function optimizeForDesktop() {
    const nav = document.querySelector('.bottom-nav');
    if (nav) {
      nav.removeAttribute('data-mobile');
      nav.style.transform = 'translateY(0)';
    }
  }

  /**
   * Accessibility enhancements
   */
  function setupAccessibility() {
    document.querySelectorAll('.bnav-btn').forEach((btn, index) => {
      // Ensure proper keyboard navigation
      btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
      
      // Add aria-current for active button
      const section = btn.dataset.section;
      // Check if state exists and currentSection matches
      if (section && typeof window.state !== 'undefined' && window.state.currentSection === section) {
        btn.setAttribute('aria-current', 'page');
      }

      // Keyboard support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Update aria-current when navigation changes
    window.addEventListener('nav-changed', (e) => {
      document.querySelectorAll('.bnav-btn').forEach(btn => {
        btn.removeAttribute('aria-current');
      });
      const activeBtn = document.querySelector(`.bnav-btn[data-section="${e.detail.section}"]`);
      if (activeBtn) {
        activeBtn.setAttribute('aria-current', 'page');
      }
    });

    // Ensure nav is visible when sidebar closes
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const showNav = document.querySelector('.bottom-nav');
      
      // When sidebar opens, show nav
      const observeOpen = new MutationObserver(() => {
        if (sidebar.classList.contains('open')) {
          if (showNav) showNav.style.transform = 'translateY(0)';
        }
      });
      
      observeOpen.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /**
   * Sync nav state with current section
   */
  function syncNavState() {
    if (window.state && window.state.currentSection) {
      const currentBtn = document.querySelector(`.bnav-btn[data-section="${window.state.currentSection}"]`);
      if (currentBtn) {
        currentBtn.click();
      }
    }
  }

  /**
   * Haptic feedback (vibration)
   */
  function triggerHapticFeedback(type = 'light') {
    if (!config.enableHaptics || !navigator.vibrate) return;

    const patterns = {
      light: 10,
      medium: [20, 10, 20],
      heavy: [50, 30, 50],
    };

    navigator.vibrate(patterns[type] || 10);
  }

  /**
   * Add ripple animation CSS if not already present
   */
  function addRippleStyles() {
    if (document.querySelector('style[data-mobile-nav-ripple]')) return;

    const style = document.createElement('style');
    style.setAttribute('data-mobile-nav-ripple', 'true');
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      .bnav-btn {
        position: relative;
        overflow: hidden;
      }

      .nav-ripple {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  // Public API
  return {
    init,
    triggerHapticFeedback,
    hideNav: () => hideNav(document.querySelector('.bottom-nav')),
    showNav: () => showNav(document.querySelector('.bottom-nav')),
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    MobileNavEnhance.init();
  });
} else {
  MobileNavEnhance.init();
}

// Expose globally for external access
window.MobileNavEnhance = MobileNavEnhance;
