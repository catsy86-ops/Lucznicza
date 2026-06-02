/**
 * mobile-map-ui.js — Simplified map UI for mobile
 * Shows only essential controls, hides rest behind icon buttons
 * Bottom sheet for advanced features, vertical bar for quick access
 */

'use strict';

const MobileMapUI = (() => {
  // ===== ESSENTIAL VS HIDDEN FEATURES =====
  const features = {
    // Always visible (essential)
    essential: [
      { id: 'zoom', icon: '🔍', label: 'Zoom', action: 'zoom' },
      { id: 'center', icon: '🎯', label: 'Wycentruj', action: 'center' },
      { id: 'location', icon: '📍', label: 'Moja pozycja', action: 'location' },
      { id: 'layers', icon: '🗺️', label: 'Warstwy', action: 'layers' }
    ],
    
    // Hidden behind menu (advanced)
    advanced: [
      { id: 'search', icon: '🔎', label: 'Szukaj', action: 'search' },
      { id: 'route', icon: '🚶', label: 'Trasa', action: 'route' },
      { id: 'measure', icon: '📏', label: 'Zmierz', action: 'measure' },
      { id: 'draw', icon: '✏️', label: 'Rysuj', action: 'draw' },
      { id: 'poi', icon: '⭐', label: 'Miejsca', action: 'poi' },
      { id: 'vehicles', icon: '🚌', label: 'Pojazdy', action: 'vehicles' },
      { id: 'weather', icon: '🌤️', label: 'Pogoda', action: 'weather' },
      { id: 'offline', icon: '📡', label: 'Offline', action: 'offline' },
      { id: 'darkmode', icon: '🌙', label: 'Tryb ciemny', action: 'darkmode' },
      { id: 'settings', icon: '⚙️', label: 'Ustawienia', action: 'settings' }
    ]
  };

  // ===== CREATE MOBILE MAP TOOLBAR =====
  function createMobileToolbar() {
    const map = document.getElementById('map');
    if (!map) {
      console.warn('Map container not found');
      return;
    }

    // Create toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = 'mobileMapToolbar';
    toolbar.className = 'mobile-map-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Narzędzia mapy');

    // Essential buttons
    const essentialContainer = document.createElement('div');
    essentialContainer.className = 'toolbar-essential';
    
    features.essential.forEach(feature => {
      const btn = createToolButton(feature);
      essentialContainer.appendChild(btn);
    });

    // More button (shows advanced features)
    const moreBtn = document.createElement('button');
    moreBtn.id = 'moreMapTools';
    moreBtn.className = 'toolbar-more-btn';
    moreBtn.innerHTML = '⋮';
    moreBtn.setAttribute('aria-label', 'Więcej narzędzi');
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.addEventListener('click', () => {
      const isOpen = moreBtn.getAttribute('aria-expanded') === 'true';
      toggleAdvancedPanel(!isOpen);
      moreBtn.setAttribute('aria-expanded', !isOpen);
    });

    essentialContainer.appendChild(moreBtn);
    toolbar.appendChild(essentialContainer);

    // Advanced panel (bottom sheet)
    const advancedPanel = createAdvancedPanel();
    toolbar.appendChild(advancedPanel);

    map.appendChild(toolbar);
    console.log('✅ Mobile toolbar created');
  }

  // ===== CREATE TOOL BUTTON =====
  function createToolButton(feature) {
    const btn = document.createElement('button');
    btn.id = `tool-${feature.id}`;
    btn.className = 'toolbar-btn';
    btn.innerHTML = feature.icon;
    btn.setAttribute('title', feature.label);
    btn.setAttribute('aria-label', feature.label);
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleToolClick(feature.action);
    });

    return btn;
  }

  // ===== CREATE ADVANCED PANEL =====
  function createAdvancedPanel() {
    const panel = document.createElement('div');
    panel.id = 'advancedMapPanel';
    panel.className = 'mobile-advanced-panel hidden';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Zaawansowane narzędzia mapy');

    // Panel header
    const header = document.createElement('div');
    header.className = 'advanced-panel-header';
    header.innerHTML = `
      <h3>Narzędzia</h3>
      <button class="close-btn" aria-label="Zamknij">✕</button>
    `;
    header.querySelector('.close-btn').addEventListener('click', () => {
      toggleAdvancedPanel(false);
      document.getElementById('moreMapTools').setAttribute('aria-expanded', 'false');
    });

    // Grid of advanced buttons
    const grid = document.createElement('div');
    grid.className = 'advanced-buttons-grid';

    features.advanced.forEach(feature => {
      const btn = createAdvancedButton(feature);
      grid.appendChild(btn);
    });

    panel.appendChild(header);
    panel.appendChild(grid);

    return panel;
  }

  // ===== CREATE ADVANCED BUTTON =====
  function createAdvancedButton(feature) {
    const container = document.createElement('div');
    container.className = 'advanced-btn-item';

    const btn = document.createElement('button');
    btn.className = 'advanced-btn';
    btn.innerHTML = feature.icon;
    btn.setAttribute('title', feature.label);
    btn.setAttribute('aria-label', feature.label);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleToolClick(feature.action);
      toggleAdvancedPanel(false);
      document.getElementById('moreMapTools').setAttribute('aria-expanded', 'false');
    });

    const label = document.createElement('span');
    label.className = 'advanced-btn-label';
    label.textContent = feature.label;

    container.appendChild(btn);
    container.appendChild(label);

    return container;
  }

  // ===== TOGGLE ADVANCED PANEL =====
  function toggleAdvancedPanel(show) {
    const panel = document.getElementById('advancedMapPanel');
    if (!panel) return;

    if (show) {
      panel.classList.remove('hidden');
      panel.style.animation = 'slideUpPanel 0.3s ease';
    } else {
      panel.classList.add('hidden');
    }
  }

  // ===== HANDLE TOOL CLICKS =====
  function handleToolClick(action) {
    console.log(`🗺️ Tool clicked: ${action}`);

    switch (action) {
      case 'zoom':
        handleZoom();
        break;
      case 'center':
        centerMap();
        break;
      case 'location':
        getCurrentLocation();
        break;
      case 'layers':
        toggleLayers();
        break;
      case 'search':
        openSearch();
        break;
      case 'route':
        openRouting();
        break;
      case 'measure':
        openMeasure();
        break;
      case 'draw':
        openDraw();
        break;
      case 'poi':
        togglePOI();
        break;
      case 'vehicles':
        toggleVehicles();
        break;
      case 'weather':
        toggleWeather();
        break;
      case 'offline':
        toggleOfflineMode();
        break;
      case 'darkmode':
        toggleDarkMode();
        break;
      case 'settings':
        openSettings();
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  // ===== TOOL HANDLERS =====
  function handleZoom() {
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    if (!zoomControl) {
      // Fallback: show quick zoom buttons
      showZoomQuickAccess();
    }
  }

  function showZoomQuickAccess() {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 8px;
      display: flex;
      gap: 8px;
      z-index: 100;
    `;

    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '➕';
    zoomInBtn.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--surface2);
      color: var(--text);
      cursor: pointer;
      font-size: 18px;
    `;
    zoomInBtn.addEventListener('click', () => {
      if (typeof window.map !== 'undefined') {
        window.map.zoomIn();
        toast.remove();
      }
    });

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '➖';
    zoomOutBtn.style.cssText = zoomInBtn.style.cssText;
    zoomOutBtn.addEventListener('click', () => {
      if (typeof window.map !== 'undefined') {
        window.map.zoomOut();
        toast.remove();
      }
    });

    toast.appendChild(zoomInBtn);
    toast.appendChild(zoomOutBtn);
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  function centerMap() {
    if (typeof window.map === 'undefined') {
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('Mapa nie gotowa', 'warning');
      }
      return;
    }

    const center = [53.43, 14.55]; // Szczecin
    window.map.setView(center, 14);
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('🎯 Mapa wycentrowana', 'success', 2000);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('Geolokalizacja niedostępna', 'error');
      }
      return;
    }

    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('📍 Pobieranie lokalizacji...', 'info');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (typeof window.map !== 'undefined') {
          window.map.setView([latitude, longitude], 16);
          L.marker([latitude, longitude]).addTo(window.map)
            .bindPopup('📍 Tutaj jesteś!');
        }
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('✅ Lokalizacja znaleziona', 'success', 2000);
        }
      },
      (error) => {
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('❌ Błąd lokalizacji', 'error');
        }
      }
    );
  }

  function toggleLayers() {
    // Trigger layer switcher
    const layerBtn = document.querySelector('[data-layer-toggle]') ||
                     document.querySelector('.leaflet-control-layers');
    if (layerBtn) {
      layerBtn.click();
    } else {
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('Przełączniki warstw niedostępne', 'info');
      }
    }
  }

  function openSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      document.getElementById('searchBar')?.classList.remove('hidden');
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced('🔎 Szukaj w mapie...', 'info', 2000);
      }
    }
  }

  function openRouting() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('🚶 Planowanie trasy...', 'info');
    }
    // Trigger routing module
    if (typeof window.mapEnhancements !== 'undefined' && window.mapEnhancements.enableRouting) {
      window.mapEnhancements.enableRouting();
    }
  }

  function openMeasure() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('📏 Kliknij punkty do pomiaru', 'info');
    }
    if (typeof window.mapEnhancements !== 'undefined' && window.mapEnhancements.toggleMeasure) {
      window.mapEnhancements.toggleMeasure();
    }
  }

  function openDraw() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('✏️ Rysuj na mapie...', 'info');
    }
  }

  function togglePOI() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('⭐ Przełączanie POI', 'info', 2000);
    }
  }

  function toggleVehicles() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('🚌 Pojazdy na żywo', 'info', 2000);
    }
  }

  function toggleWeather() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('🌤️ Pogoda w Szczecinie', 'info', 2000);
    }
  }

  function toggleOfflineMode() {
    const isOnline = navigator.onLine;
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced(
        isOnline ? '📡 Tryb offline dostępny' : '✅ Wróciłeś online!',
        'info',
        2000
      );
    }
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('🌙 Tryb zmieniony', 'info', 2000);
    }
  }

  function openSettings() {
    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced('⚙️ Otwieranie ustawień...', 'info');
    }
  }

  // ===== INJECT STYLES =====
  function injectStyles() {
    if (document.getElementById('mobileMapUIStyle')) return;

    const style = document.createElement('style');
    style.id = 'mobileMapUIStyle';
    style.textContent = `
      /* Mobile Map Toolbar */
      @media (max-width: 768px) {
        .mobile-map-toolbar {
          position: fixed;
          bottom: 72px;
          right: 12px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toolbar-essential {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px;
          box-shadow: var(--shadow-sm);
        }

        .toolbar-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .toolbar-btn:active {
          background: var(--accent);
          color: white;
          transform: scale(0.9);
        }

        .toolbar-more-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--accent);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          -webkit-tap-highlight-color: transparent;
        }

        /* Advanced Panel (Bottom Sheet) */
        .mobile-advanced-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg2);
          border-radius: 20px 20px 0 0;
          border-top: 1px solid var(--border);
          max-height: 80vh;
          overflow-y: auto;
          z-index: 60;
          padding: 20px 16px 32px;
          animation: slideUpPanel 0.3s ease;
        }

        .mobile-advanced-panel.hidden {
          display: none !important;
        }

        @keyframes slideUpPanel {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .advanced-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .advanced-panel-header h3 {
          font-size: 18px;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .advanced-buttons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .advanced-btn-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .advanced-btn {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .advanced-btn:active {
          background: var(--accent);
          color: white;
          transform: scale(0.9);
        }

        .advanced-btn-label {
          font-size: 12px;
          text-align: center;
          color: var(--text2);
          line-height: 1.2;
          max-width: 60px;
          white-space: normal;
        }

        /* Hide on desktop */
        @media (min-width: 769px) {
          .mobile-map-toolbar {
            display: none !important;
          }
        }
      }

      /* Desktop - show normally */
      @media (min-width: 769px) {
        .mobile-map-toolbar {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('📱 Mobile map UI styles injected');
  }

  // ===== INITIALIZATION =====
  function init() {
    console.log('📱 Mobile map UI initializing...');

    // Only on mobile
    if (window.innerWidth >= 768) {
      console.log('💻 Desktop detected, skipping mobile map UI');
      return;
    }

    injectStyles();
    
    // Wait for map to be ready
    setTimeout(() => {
      createMobileToolbar();
      console.log('✅ Mobile map UI ready');
    }, 1000);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  return {
    init,
    createMobileToolbar,
    toggleAdvancedPanel,
    handleToolClick
  };
})();

window.MobileMapUI = MobileMapUI;
