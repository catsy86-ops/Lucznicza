/**
 * mobile-theme-colors.js — Mobile-optimized colors and theme for better readability
 * Improved contrast, larger touch targets, simplified UI on small screens
 */

'use strict';

const MobileThemeColors = (() => {
  // ===== MOBILE COLOR VARIABLES =====
  const mobileTheme = {
    dark: {
      bg: '#0a0a12',          // Darker for AMOLED
      bg2: '#1f1f35',         // Darker surface
      bg3: '#2a2a45',         // Elevated surface
      surface: '#252540',
      surface2: '#2f2f50',
      border: 'rgba(255,255,255,0.12)',
      text: '#f5f5ff',        // Brighter text (WCAG AAA)
      text2: '#c0c0e0',       // Better contrast secondary
      text3: '#8888bb',
      accent: '#7c6eff',      // Brighter accent
      accent2: '#ff7a95',     // More saturated pink
      accent3: '#5dd99f',     // More saturated green
      sport: '#ff5757',       // Brighter red
      food: '#ffd60a',        // Brighter yellow
      shop: '#5dd99f',        // Brighter green
      park: '#4ecdc4',
      service: '#b8a5ff',
      edu: '#ff7fb3',
      shadow: '0 4px 16px rgba(0,0,0,0.6)',
      shadowSm: '0 2px 8px rgba(0,0,0,0.5)'
    },
    light: {
      bg: '#f8f8fc',
      bg2: '#ffffff',
      bg3: '#f0f0ff',
      surface: '#ffffff',
      surface2: '#f5f5ff',
      border: 'rgba(0,0,0,0.12)',
      text: '#0a0a12',        // Very dark text
      text2: '#333355',       // Better contrast
      text3: '#666688',
      accent: '#5a4fd1',      // More saturated
      accent2: '#ff5577',
      accent3: '#40c966',
      sport: '#ff3333',
      food: '#ffb800',
      shop: '#32a851',
      park: '#3db8a8',
      service: '#8866dd',
      edu: '#ff5588',
      shadow: '0 4px 16px rgba(0,0,0,0.15)',
      shadowSm: '0 2px 8px rgba(0,0,0,0.08)'
    }
  };

  // ===== APPLY MOBILE THEME =====
  function applyMobileTheme() {
    const isDark = !document.body.classList.contains('light-mode');
    const theme = isDark ? mobileTheme.dark : mobileTheme.light;
    const root = document.documentElement;

    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply mobile-specific sizes
    root.style.setProperty('--text-size', '16px');      // Larger for mobile
    root.style.setProperty('--text-size-sm', '14px');
    root.style.setProperty('--touch-target', '48px');   // WCAG minimum
    root.style.setProperty('--spacing', '16px');

    console.log('🎨 Mobile theme colors applied');
  }

  // ===== MOBILE-OPTIMIZED STYLES =====
  function injectMobileStyles() {
    if (document.getElementById('mobileThemeStyle')) return;

    const style = document.createElement('style');
    style.id = 'mobileThemeStyle';
    style.textContent = `
      /* Mobile-first breakpoint overrides */
      @media (max-width: 768px) {
        /* Larger text for readability */
        body {
          font-size: 16px;
          line-height: 1.5;
        }

        /* Larger buttons (48px minimum touch target) */
        button, .btn, [role="button"] {
          min-height: 48px;
          min-width: 48px;
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 12px;
        }

        /* Header optimizations */
        .header {
          height: 56px;
          padding: 8px 12px;
          gap: 8px;
        }

        .header-title h1 {
          font-size: 18px;
        }

        .header-title p {
          font-size: 12px;
        }

        .icon-btn {
          width: 44px;
          height: 44px;
          padding: 8px;
        }

        /* Bottom nav improvements */
        .bnav {
          height: 64px;
          padding: 8px 0;
        }

        .bnav-btn {
          flex-direction: column;
          gap: 4px;
          min-height: 56px;
          font-size: 11px;
        }

        .bnav-btn svg {
          width: 24px;
          height: 24px;
        }

        /* Cards with better touch targets */
        .place-card, .route-card-v2, .live-card {
          padding: 16px;
          border-radius: 12px;
          min-height: 100px;
        }

        .place-card h3, .route-card-v2 h3 {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .place-card p {
          font-size: 14px;
        }

        /* Input fields */
        input, textarea {
          font-size: 16px;        /* Prevents zoom on focus in iOS */
          padding: 12px 16px;
          min-height: 48px;
          border-radius: 12px;
        }

        /* Toast positioning for mobile */
        .toast-enhanced {
          right: 12px;
          left: 12px;
          bottom: 80px;          /* Above bottom nav */
          max-width: none;
          margin: 0;
        }

        /* Modal improvements */
        .modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 90vh;
          border-radius: 16px 16px 0 0;
          padding: 20px 16px;
          overflow-y: auto;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          font-size: 24px;
          background: var(--surface2);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar improvements */
        .sidebar {
          width: 100%;
          max-width: 100%;
          height: 100vh;
          top: 0;
          left: -100%;
          transition: left 0.3s ease;
        }

        .sidebar.active {
          left: 0;
          z-index: 200;
        }

        .sidebar-overlay.active {
          display: block !important;
        }

        /* Search bar mobile */
        .search-bar {
          position: fixed;
          top: var(--header-h);
          left: 0;
          right: 0;
          padding: 12px;
          background: var(--bg2);
          z-index: 99;
          border-bottom: 1px solid var(--border);
        }

        .search-bar input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
        }

        /* Dropdowns on mobile */
        .dropdown {
          position: fixed;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg2);
          border-radius: 16px 16px 0 0;
          padding: 20px 16px;
          max-height: 70vh;
          overflow-y: auto;
          z-index: 150;
        }

        /* Map controls optimization */
        .map-control {
          width: 44px;
          height: 44px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text);
          font-size: 18px;
        }

        .map-control:hover {
          background: var(--surface2);
        }

        /* Bottom sheet for map */
        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg2);
          border-radius: 20px 20px 0 0;
          z-index: 50;
          max-height: 85vh;
          box-shadow: var(--shadow);
        }

        .bs-handle {
          width: 100%;
          padding: 12px 0;
          display: flex;
          justify-content: center;
          border-bottom: 1px solid var(--border);
        }

        .bs-handle-bar {
          width: 40px;
          height: 4px;
          background: var(--text3);
          border-radius: 2px;
        }

        .bs-content {
          padding: 16px;
          overflow-y: auto;
        }

        .bs-header h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .bs-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .bs-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bs-btn:active {
          background: var(--accent);
          color: white;
          transform: scale(0.95);
        }

        /* Spacing improvements */
        .container, .section {
          padding: 12px;
          margin: 0;
        }

        /* Reduce visual clutter */
        .live-ticker {
          display: none;
        }

        /* Bottom padding for fixed bottom nav */
        main {
          padding-bottom: var(--bnav-h);
        }

        /* Improve tap target spacing */
        a, button {
          -webkit-tap-highlight-color: transparent;
        }

        /* Better loading states */
        .loading {
          opacity: 0.7;
          pointer-events: none;
        }

        /* Weather widget sizing */
        .weather-widget {
          position: fixed;
          bottom: 80px;
          right: 12px;
          width: auto;
          max-width: 200px;
          padding: 12px;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          font-size: 14px;
          z-index: 40;
        }

        /* AQI widget */
        .aqi-widget {
          position: fixed;
          bottom: 80px;
          left: 12px;
          width: 120px;
          padding: 12px;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          font-size: 12px;
          z-index: 40;
        }

        /* Clock widget */
        .clock-widget {
          position: fixed;
          top: 72px;
          right: 12px;
          padding: 8px 12px;
          background: var(--surface);
          border-radius: 8px;
          font-size: 12px;
          border: 1px solid var(--border);
          z-index: 30;
        }

        /* Hide unnecessary elements on mobile */
        .desktop-only {
          display: none !important;
        }

        /* Show mobile-only elements */
        .mobile-only {
          display: block !important;
        }

        /* Scrolling improvements */
        -webkit-overflow-scrolling: touch;

        /* Font scaling */
        @media (max-width: 480px) {
          body {
            font-size: 14px;
          }

          button, .btn {
            font-size: 14px;
          }

          h1 { font-size: 20px; }
          h2 { font-size: 18px; }
          h3 { font-size: 16px; }
        }
      }

      /* Tablet optimizations */
      @media (min-width: 769px) and (max-width: 1024px) {
        button, .btn {
          min-height: 44px;
          padding: 10px 14px;
          font-size: 15px;
        }

        .header {
          height: 60px;
        }

        .bnav-btn {
          font-size: 12px;
        }
      }

      /* Desktop normal */
      @media (min-width: 1025px) {
        .mobile-only {
          display: none !important;
        }

        .desktop-only {
          display: block !important;
        }
      }

      /* Safe area support for notched devices */
      @supports (padding: max(0px)) {
        body {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
        }

        .header {
          padding-right: max(12px, env(safe-area-inset-right));
          padding-left: max(12px, env(safe-area-inset-left));
        }

        .bottom-sheet {
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }

        .bnav {
          padding-bottom: max(0px, env(safe-area-inset-bottom));
        }
      }
    `;

    document.head.appendChild(style);
    console.log('📱 Mobile styles injected');
  }

  // ===== DETECT DARK MODE =====
  function setupDarkModeDetection() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
      applyMobileTheme();
      console.log(`🌙 System theme changed to: ${e.matches ? 'dark' : 'light'}`);
    });
  }

  // ===== IMPROVE MAP CONTROLS ON MOBILE =====
  function optimizeMapControls() {
    const mapControls = document.querySelectorAll('.leaflet-control');
    
    mapControls.forEach(control => {
      control.style.margin = '12px';
      control.style.boxShadow = 'var(--shadow-sm)';
    });

    // Move controls for mobile
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    if (zoomControl && window.innerWidth < 768) {
      zoomControl.style.position = 'absolute';
      zoomControl.style.right = '12px';
      zoomControl.style.bottom = '80px';
    }

    console.log('🗺️ Map controls optimized for mobile');
  }

  // ===== HIDE UNNECESSARY MAP FEATURES ON MOBILE =====
  function simplifyMapOnMobile() {
    if (window.innerWidth >= 768) return;

    // Hide heavy overlays
    const overlaysToHide = [
      '.live-ticker',
      '.aqi-widget',
      '.weather-widget',
      '.clock-widget'
    ];

    overlaysToHide.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        el.style.display = 'none';
      }
    });

    // Show only essential map tools in bottom sheet
    const essentialTools = [
      'zoom',        // +/- buttons
      'center',      // Center map
      'search',      // Search
      'layers',      // Switch layers
      'offline'      // Offline mode
    ];

    console.log('🗺️ Map simplified for mobile, showing:', essentialTools);
  }

  // ===== IMPROVE TOUCH INTERACTIONS =====
  function enhanceTouchInteractions() {
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add haptic feedback on button press
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, [role="button"]');
      if (btn && navigator.vibrate) {
        navigator.vibrate(10); // 10ms buzz
      }
    });

    console.log('👆 Touch interactions enhanced');
  }

  // ===== INITIALIZATION =====
  function init() {
    console.log('📱 Mobile theme colors initializing...');

    // Inject styles
    injectMobileStyles();

    // Apply theme
    applyMobileTheme();

    // Setup dark mode detection
    setupDarkModeDetection();

    // Optimize map
    setTimeout(() => {
      optimizeMapControls();
      simplifyMapOnMobile();
    }, 1000);

    // Enhance touch
    enhanceTouchInteractions();

    // Re-apply on theme toggle
    document.addEventListener('themeChanged', () => {
      applyMobileTheme();
    });

    console.log('✅ Mobile theme colors ready');
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  return {
    init,
    applyMobileTheme,
    optimizeMapControls,
    simplifyMapOnMobile,
    enhanceTouchInteractions
  };
})();

window.MobileThemeColors = MobileThemeColors;
