/**
 * map-enhancements-ui.js — UI Controls for 9 New Map Enhancement Modules
 * Integrates elevation, weather, history, ratings, routes, hazards, drawing, notifications, and dark mode
 * Adds control buttons to the map toolbar with status indicators and quick toggle functionality
 */
'use strict';

const MapEnhancementsUI = (() => {
  const cfg = {
    enabled: true,
    modules: {
      elevation: { name: 'Wysokość', icon: '🏔️', enabled: false, fn: null },
      weather: { name: 'Pogoda', icon: '🌤️', enabled: false, fn: null },
      history: { name: 'Historia', icon: '↩️', enabled: false, fn: null },
      ratings: { name: 'Oceny', icon: '⭐', enabled: false, fn: null },
      routes: { name: 'Trasy popularne', icon: '🚶', enabled: false, fn: null },
      hazards: { name: 'Zagrożenia', icon: '⚠️', enabled: false, fn: null },
      drawing: { name: 'Rysowanie', icon: '✏️', enabled: false, fn: null },
      notifications: { name: 'Powiadomienia', icon: '🔔', enabled: false, fn: null },
      darkMode: { name: 'Tryb nocny', icon: '🌙', enabled: false, fn: null }
    },
    toolbar: null
  };

  /**
   * Initialize UI controls and bind module functions
   */
  function init(map) {
    cfg.map = map;
    console.log('🎚️ Inicjalizacja kontrolek ulepszeń mapy...');
    
    // Bind module toggle functions
    bindModuleFunctions();
    
    // Create and inject toolbar UI
    createToolbar();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    console.log('✅ Kontrolki ulepszeń mapy załadowane');
  }

  /**
   * Bind external module toggle functions
   */
  function bindModuleFunctions() {
    if (typeof MapElevation !== 'undefined' && MapElevation.toggle) {
      cfg.modules.elevation.fn = () => MapElevation.toggle();
    }
    if (typeof MapWeatherOverlay !== 'undefined' && MapWeatherOverlay.toggle) {
      cfg.modules.weather.fn = () => MapWeatherOverlay.toggle();
    }
    if (typeof MapHistory !== 'undefined' && MapHistory.toggle) {
      cfg.modules.history.fn = () => MapHistory.toggle();
    }
    if (typeof MapRatingsHeatmap !== 'undefined' && MapRatingsHeatmap.toggle) {
      cfg.modules.ratings.fn = () => MapRatingsHeatmap.toggle();
    }
    if (typeof MapPopularRoutes !== 'undefined' && MapPopularRoutes.toggle) {
      cfg.modules.routes.fn = () => MapPopularRoutes.toggle();
    }
    if (typeof MapHazardZones !== 'undefined' && MapHazardZones.toggle) {
      cfg.modules.hazards.fn = () => MapHazardZones.toggle();
    }
    if (typeof MapDrawing !== 'undefined' && MapDrawing.toggle) {
      cfg.modules.drawing.fn = () => MapDrawing.toggle();
    }
    if (typeof MapNotificationsRadar !== 'undefined' && MapNotificationsRadar.toggle) {
      cfg.modules.notifications.fn = () => MapNotificationsRadar.toggle();
    }
    if (typeof MapDarkMode !== 'undefined' && MapDarkMode.toggle) {
      cfg.modules.darkMode.fn = () => MapDarkMode.toggle();
    }
  }

  /**
   * Create floating toolbar with quick access buttons
   */
  function createToolbar() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Create toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = 'mapEnhancementsToolbar';
    toolbar.className = 'map-enhancements-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Narzędzia ulepszeń mapy');
    
    // Create toggle button (hamburger-style)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'enhancementsToggle';
    toggleBtn.className = 'enh-toggle-btn';
    toggleBtn.title = 'Pokaż/ukryj narzędzia ulepszeń';
    toggleBtn.innerHTML = '⚙️';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', () => toggleToolbar());

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'enhancements-buttons';
    buttonsContainer.className = 'enh-buttons-container';
    buttonsContainer.style.display = 'none';

    // Create button for each module
    Object.entries(cfg.modules).forEach(([key, module]) => {
      if (!module.fn) return; // Skip if function not bound

      const btn = document.createElement('button');
      btn.className = 'enh-btn';
      btn.id = `enh-btn-${key}`;
      btn.title = module.name;
      btn.innerHTML = `
        <span class="enh-btn-icon">${module.icon}</span>
        <span class="enh-btn-label">${module.name}</span>
        <span class="enh-btn-status"></span>
      `;
      btn.setAttribute('data-module', key);
      btn.addEventListener('click', () => toggleModule(key, btn));

      buttonsContainer.appendChild(btn);
    });

    // Create status summary
    const summary = document.createElement('div');
    summary.id = 'enhancements-summary';
    summary.className = 'enh-summary';
    summary.innerHTML = '<span id="enhCountBadge" class="enh-count-badge">0</span>';
    
    toolbar.appendChild(toggleBtn);
    toolbar.appendChild(summary);
    toolbar.appendChild(buttonsContainer);

    mapContainer.appendChild(toolbar);
    cfg.toolbar = toolbar;

    console.log('✅ Toolbar ulepszeń mapy utworzony');
  }

  /**
   * Toggle toolbar visibility
   */
  function toggleToolbar() {
    const container = document.getElementById('enhancements-buttons');
    const toggle = document.getElementById('enhancementsToggle');
    
    if (container.style.display === 'none') {
      container.style.display = 'flex';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
    } else {
      container.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
    }
  }

  /**
   * Toggle a specific module on/off
   */
  function toggleModule(key, btn) {
    const module = cfg.modules[key];
    if (!module || !module.fn) return;

    try {
      module.fn();
      module.enabled = !module.enabled;
      
      // Update button state
      if (module.enabled) {
        btn.classList.add('active');
        btn.querySelector('.enh-btn-status').textContent = '✓';
      } else {
        btn.classList.remove('active');
        btn.querySelector('.enh-btn-status').textContent = '';
      }

      // Update count badge
      updateCountBadge();

      // Show toast notification
      const action = module.enabled ? 'Włączone' : 'Wyłączone';
      if (typeof showToast === 'function') {
        showToast(`${module.icon} ${module.name}: ${action}`);
      }

      console.log(`${module.icon} ${key}: ${action}`);
    } catch (err) {
      console.error(`❌ Błąd przełączania ${key}:`, err);
      if (typeof showToast === 'function') {
        showToast(`⚠️ Błąd ładowania ${module.name}`);
      }
    }
  }

  /**
   * Update badge showing how many modules are active
   */
  function updateCountBadge() {
    const count = Object.values(cfg.modules).filter(m => m.enabled).length;
    const badge = document.getElementById('enhCountBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  /**
   * Add keyboard shortcuts for quick access
   * E = Elevation
   * W = Weather
   * H = History
   * R = Ratings
   * T = routes (Trasy)
   * Z = haZards
   * D = Drawing
   * N = Notifications
   * Y = darkmode (Year-round night mode)
   */
  function addKeyboardShortcuts() {
    const shortcuts = {
      'e': 'elevation',
      'w': 'weather',
      'h': 'history',
      'r': 'ratings',
      't': 'routes',
      'z': 'hazards',
      'd': 'drawing',
      'n': 'notifications',
      'y': 'darkMode'
    };

    document.addEventListener('keydown', (e) => {
      // Don't trigger in input fields
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (shortcuts[key] && !e.ctrlKey && !e.metaKey) {
        const moduleKey = shortcuts[key];
        const btn = document.getElementById(`enh-btn-${moduleKey}`);
        if (btn) {
          e.preventDefault();
          btn.click();
        }
      }
    });

    console.log('✅ Skróty klawiszowe ulepszeń mapy zarejestrowane');
  }

  /**
   * Enable a specific module programmatically
   */
  function enableModule(key) {
    const module = cfg.modules[key];
    if (module && !module.enabled) {
      const btn = document.getElementById(`enh-btn-${key}`);
      if (btn) toggleModule(key, btn);
    }
  }

  /**
   * Disable a specific module programmatically
   */
  function disableModule(key) {
    const module = cfg.modules[key];
    if (module && module.enabled) {
      const btn = document.getElementById(`enh-btn-${key}`);
      if (btn) toggleModule(key, btn);
    }
  }

  /**
   * Get status of all modules
   */
  function getStatus() {
    const status = {};
    Object.entries(cfg.modules).forEach(([key, module]) => {
      status[key] = {
        name: module.name,
        enabled: module.enabled
      };
    });
    return status;
  }

  /**
   * Save preferences to localStorage
   */
  function savePreferences() {
    const prefs = {};
    Object.entries(cfg.modules).forEach(([key, module]) => {
      prefs[key] = module.enabled;
    });
    try {
      localStorage.setItem('mapEnhancementsPrefs', JSON.stringify(prefs));
      console.log('💾 Preferencje ulepszeń mapy zapisane');
    } catch (e) {
      console.warn('⚠️ Nie udało się zapisać preferencji:', e);
    }
  }

  /**
   * Load preferences from localStorage
   */
  function loadPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem('mapEnhancementsPrefs') || '{}');
      Object.entries(prefs).forEach(([key, enabled]) => {
        if (enabled && cfg.modules[key]) {
          setTimeout(() => enableModule(key), 500);
        }
      });
      console.log('📂 Preferencje ulepszeń mapy załadowane');
    } catch (e) {
      console.warn('⚠️ Nie udało się załadować preferencji:', e);
    }
  }

  // Auto-save preferences on module toggle
  const originalToggleModule = toggleModule;
  toggleModule = function(key, btn) {
    originalToggleModule(key, btn);
    savePreferences();
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (window.map && typeof window.map.getCenter === 'function') {
      init(window.map);
      loadPreferences();
    }
  });

  // Also try to initialize when app.js loads the map
  window.addEventListener('map-ready', () => {
    if (window.map && !cfg.toolbar) {
      init(window.map);
      loadPreferences();
    }
  });

  return {
    init,
    toggleModule,
    enableModule,
    disableModule,
    getStatus,
    savePreferences,
    loadPreferences,
    toggleToolbar
  };
})();

window.MapEnhancementsUI = MapEnhancementsUI;
