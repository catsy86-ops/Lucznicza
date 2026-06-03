/**
 * ui-ux-polish.js — Senior Designer UI/UX Improvements
 * Cleans up map UI, hides unnecessary elements, optimizes layout for clarity
 * Desktop-first with mobile responsiveness
 */

'use strict';

const UIUXPolish = (() => {
  // ===== UI ELEMENTS TO OPTIMIZE =====
  const elementsConfig = {
    // Hide on both but show in menu
    hidden: [
      '.map-legend',              // Legend → move to menu
      '.map-stats',               // Stats → move to menu
      '.pano-controls',           // Street view → advanced menu
      '.pov-display',             // POV display → info tooltip
      '.position-display',        // Position → status bar
      '.poi-street-view-info',    // POI info → modal
      '.street-view-navigation',  // Navigation → advanced
      '.street-view-links',       // Links → advanced
      '.category-filter',         // Categories → sidebar
      '.live-ticker',             // Ticker → sidebar
      '.tools-panel',             // Tools → bottom sheet
      '.tools-toggle-btn'         // Will be replaced
    ],
    
    // Keep visible (essential)
    essential: [
      '#map',                     // Map itself
      '.header',                  // Header
      '.bnav',                    // Bottom navigation
      '.weather-widget',          // Weather (top-right)
      '.aqi-widget',              // AQI (top-left)
      '.clock-widget'             // Clock
    ],
    
    // Show only on desktop
    desktopOnly: [
      '.sidebar',
      '.search-bar'
    ],
    
    // Show only on mobile
    mobileOnly: [
      '.mobile-map-toolbar',
      '.mobile-advanced-panel'
    ]
  };

  // ===== HIDE CLUTTERED ELEMENTS =====
  function hideClutteredElements() {
    elementsConfig.hidden.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
        el.classList.add('ui-hidden-by-polish');
      });
    });

    console.log('🧹 Cluttered elements hidden');
  }

  // ===== CREATE CLEAN MAP HEADER =====
  function createCleanMapHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Make header cleaner on map
    header.style.backdropFilter = 'blur(30px)';
    header.style.borderBottomColor = 'rgba(255,255,255,0.05)';

    // Reduce header elements clutter
    const headerElements = header.querySelectorAll('*');
    headerElements.forEach(el => {
      if (el.classList.contains('header-title')) {
        el.style.fontSize = '14px';
        el.style.fontWeight = '600';
      }
    });

    console.log('✨ Map header cleaned');
  }

  // ===== CREATE MINIMAL MAP CONTROLS =====
  function createMinimalMapControls() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Create minimal control bar
    const controlBar = document.createElement('div');
    controlBar.id = 'minimalMapControls';
    controlBar.className = 'minimal-controls';
    controlBar.setAttribute('role', 'toolbar');
    controlBar.setAttribute('aria-label', 'Sterowanie mapą');

    controlBar.innerHTML = `
      <div class="controls-group">
        <!-- Zoom buttons -->
        <button class="control-btn zoom-in" title="Powiększ (++)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <button class="control-btn zoom-out" title="Pomniejsz (--)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>

      <div class="controls-group">
        <!-- Center button -->
        <button class="control-btn center-map" title="Wycentruj">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="8"/>
            <path d="M12 2v3M12 19v3M4 12H1M23 12h-3"/>
          </svg>
        </button>

        <!-- Location button -->
        <button class="control-btn location-btn" title="Moja pozycja">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </button>
      </div>

      <div class="controls-group">
        <!-- Menu button (shows all tools) -->
        <button class="control-btn menu-btn" title="Więcej narzędzi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
      </div>
    `;

    mapContainer.appendChild(controlBar);

    // Add event listeners
    attachControlListeners(controlBar);

    console.log('🎛️ Minimal map controls created');
  }

  // ===== ATTACH CONTROL LISTENERS =====
  function attachControlListeners(controlBar) {
    controlBar.querySelector('.zoom-in').addEventListener('click', () => {
      if (typeof window.map !== 'undefined') {
        window.map.zoomIn();
      }
    });

    controlBar.querySelector('.zoom-out').addEventListener('click', () => {
      if (typeof window.map !== 'undefined') {
        window.map.zoomOut();
      }
    });

    controlBar.querySelector('.center-map').addEventListener('click', () => {
      if (typeof window.map !== 'undefined') {
        window.map.setView([53.43, 14.55], 14);
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('🎯 Mapa wycentrowana', 'success', 1500);
        }
      }
    });

    controlBar.querySelector('.location-btn').addEventListener('click', () => {
      if (!navigator.geolocation) {
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('Geolokalizacja niedostępna', 'error');
        }
        return;
      }

      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('📍 Lokalizuję...', 'info');
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (typeof window.map !== 'undefined') {
            window.map.setView([latitude, longitude], 16);
          }
          if (typeof showToastEnhanced === 'function') {
            showToastEnhanced('✅ Znaleziono!', 'success', 1500);
          }
        },
        () => {
          if (typeof showToastEnhanced === 'function') {
            showToastEnhanced('❌ Błąd lokalizacji', 'error');
          }
        }
      );
    });

    controlBar.querySelector('.menu-btn').addEventListener('click', () => {
      // Trigger advanced tools menu
      const moreBtn = document.getElementById('moreMapTools') ||
                     document.querySelector('.toolbar-more-btn');
      if (moreBtn) {
        moreBtn.click();
      } else {
        showMapToolsMenu();
      }
    });
  }

  // ===== CREATE CLEAN INFO CARD =====
  // ===== HIDE DESKTOP ELEMENTS ON MOBILE =====
  function setupResponsiveUI() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Hide desktop-only
      elementsConfig.desktopOnly.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
        });
      });

      // Show mobile-only
      elementsConfig.mobileOnly.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'block';
        });
      });
    } else {
      // Show desktop
      elementsConfig.desktopOnly.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'block';
        });
      });

      // Hide mobile
      elementsConfig.mobileOnly.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
        });
      });
    }

    console.log(`📱 Responsive UI setup (${isMobile ? 'mobile' : 'desktop'})`);
  }

  // ===== INJECT PROFESSIONAL STYLES =====
  function injectProfessionalStyles() {
    if (document.getElementById('uiUxPolishStyle')) return;

    const style = document.createElement('style');
    style.id = 'uiUxPolishStyle';
    style.textContent = `
      /* ===== MINIMAL MAP CONTROLS ===== */
      .minimal-controls {
        position: fixed;
        top: 72px;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 40;
        pointer-events: auto;
      }

      .controls-group {
        display: flex;
        gap: 6px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 6px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      }

      .control-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: transparent;
        border: none;
        color: var(--text);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        padding: 0;
      }

      .control-btn:hover {
        background: var(--surface2);
        color: var(--accent);
      }

      .control-btn:active {
        background: var(--accent);
        color: white;
        transform: scale(0.95);
      }

      .control-btn svg {
        width: 20px;
        height: 20px;
      }

      /* Clean Info Card */
      .clean-info-card {
        position: fixed;
        top: 72px;
        left: 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        z-index: 35;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .info-card-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .info-card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
      }

      .info-card-details {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .info-badge {
        font-size: 12px;
        padding: 4px 8px;
        background: var(--surface2);
        border-radius: 6px;
        color: var(--text2);
      }

      .info-card-close {
        background: transparent;
        border: none;
        color: var(--text2);
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .info-card-close:hover {
        color: var(--accent);
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .minimal-controls {
          top: auto;
          bottom: 80px;
          right: 12px;
          flex-direction: row;
          gap: 4px;
        }

        .controls-group {
          gap: 4px;
          padding: 4px;
        }

        .control-btn {
          width: 36px;
          height: 36px;
        }

        .control-btn svg {
          width: 18px;
          height: 18px;
        }

        .clean-info-card {
          top: auto;
          bottom: 80px;
          left: 12px;
          right: 12px;
          padding: 10px 12px;
          gap: 8px;
        }

        .info-card-details {
          gap: 4px;
        }

        .info-badge {
          font-size: 11px;
          padding: 3px 6px;
        }
      }

      /* Hide elements */
      .ui-hidden-by-polish {
        display: none !important;
      }

      /* Reduce element opacity if needed */
      .leaflet-control-layers,
      .leaflet-top,
      .leaflet-bottom {
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }

      .leaflet-control-layers:hover,
      .leaflet-top:hover,
      .leaflet-bottom:hover {
        opacity: 1;
      }

      /* Clean map background */
      .map-container {
        background: var(--bg);
      }

      /* Improve map controls visibility */
      .leaflet-control {
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
      }

      /* Smooth map transitions */
      .leaflet-tile {
        transition: opacity 0.3s ease;
      }

      /* Professional borders */
      .leaflet-marker-pane,
      .leaflet-overlay-pane {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      /* Status bar styling */
      @media (min-width: 1025px) {
        body::after {
          content: '';
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.5;
          pointer-events: none;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('🎨 Professional styles injected');
  }

  // ===== SHOW MAP TOOLS MENU =====
  function showMapToolsMenu() {
    const menu = document.createElement('div');
    menu.className = 'map-tools-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', 'Narzędzia mapy');

    menu.innerHTML = `
      <div class="menu-overlay"></div>
      <div class="menu-content">
        <div class="menu-header">
          <h3>Narzędzia Mapy</h3>
          <button class="menu-close">✕</button>
        </div>
        <div class="menu-grid">
          <button class="menu-item" data-tool="layers">
            <span class="menu-icon">🗺️</span>
            <span>Warstwy</span>
          </button>
          <button class="menu-item" data-tool="legend">
            <span class="menu-icon">📋</span>
            <span>Legenda</span>
          </button>
          <button class="menu-item" data-tool="stats">
            <span class="menu-icon">📊</span>
            <span>Statystyki</span>
          </button>
          <button class="menu-item" data-tool="export">
            <span class="menu-icon">📥</span>
            <span>Pobierz</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(menu);

    // Style
    const style = document.createElement('style');
    style.textContent = `
      .map-tools-menu {
        position: fixed;
        inset: 0;
        z-index: 500;
        display: flex;
        align-items: flex-end;
      }

      .menu-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
      }

      .menu-content {
        position: relative;
        background: var(--bg2);
        width: 100%;
        max-width: 600px;
        border-radius: 20px 20px 0 0;
        padding: 24px 16px;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
      }

      .menu-header h3 {
        margin: 0;
        font-size: 18px;
      }

      .menu-close {
        background: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text);
      }

      .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 12px;
      }

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text);
      }

      .menu-item:hover {
        background: var(--surface2);
        border-color: var(--accent);
      }

      .menu-item:active {
        transform: scale(0.95);
      }

      .menu-icon {
        font-size: 24px;
      }

      .menu-item span:last-child {
        font-size: 12px;
        text-align: center;
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    menu.querySelector('.menu-close').addEventListener('click', () => {
      menu.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => menu.remove(), 300);
    });

    menu.querySelector('.menu-overlay').addEventListener('click', () => {
      menu.querySelector('.menu-close').click();
    });

    menu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const tool = item.dataset.tool;
        handleToolSelection(tool);
        menu.querySelector('.menu-close').click();
      });
    });
  }

  // ===== HANDLE TOOL SELECTION =====
  function handleToolSelection(tool) {
    switch (tool) {
      case 'layers':
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('🗺️ Warstwy mapy', 'info', 1500);
        }
        break;
      case 'legend':
        showLegend();
        break;
      case 'stats':
        showStats();
        break;
      case 'export':
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('📥 Pobieranie mapy...', 'info');
        }
        break;
    }
  }

  // ===== SHOW LEGEND =====
  function showLegend() {
    const legend = document.querySelector('.map-legend');
    if (legend) {
      legend.classList.remove('ui-hidden-by-polish');
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('📋 Legenda', 'info', 2000);
      }
    }
  }

  // ===== SHOW STATS =====
  function showStats() {
    const stats = document.querySelector('.map-stats');
    if (stats) {
      stats.classList.remove('ui-hidden-by-polish');
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('📊 Statystyki', 'info', 2000);
      }
    }
  }

  // ===== INITIALIZATION =====
  function init() {
    console.log('🎨 UI/UX Polish initializing...');

    // Inject styles
    injectProfessionalStyles();

    // Setup responsive UI
    setupResponsiveUI();

    // Hide cluttered elements
    setTimeout(() => {
      hideClutteredElements();
      createCleanMapHeader();
      createMinimalMapControls();
      console.log('✅ UI/UX Polish complete');
    }, 500);

    // Responsive on resize
    window.addEventListener('resize', setupResponsiveUI);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  return {
    init,
    hideClutteredElements,
    createMinimalMapControls,
    setupResponsiveUI
  };
})();

window.UIUXPolish = UIUXPolish;
