/**
 * map-modules-init.js — Centralized initialization of all map enhancement modules
 * Listens for 'map-ready' event from app.js and initializes each module in order.
 * This keeps app.js clean and avoids coupling between modules.
 */
'use strict';

(function initMapModules() {
  // Modules that need map instance passed to their init()
  const MAP_MODULES = [
    { name: 'MapElevation',         ref: () => window.MapElevation         },
    { name: 'MapWeatherOverlay',    ref: () => window.MapWeatherOverlay     },
    { name: 'MapHistory',           ref: () => window.MapHistory            },
    { name: 'MapRatingsHeatmap',    ref: () => window.MapRatingsHeatmap     },
    { name: 'MapPopularRoutes',     ref: () => window.MapPopularRoutes      },
    { name: 'MapHazardZones',       ref: () => window.MapHazardZones        },
    { name: 'MapDrawing',           ref: () => window.MapDrawing            },
    { name: 'MapNotificationsRadar',ref: () => window.MapNotificationsRadar },
    { name: 'MapDarkMode',          ref: () => window.MapDarkMode           },
    { name: 'MapEnhancementsUI',    ref: () => window.MapEnhancementsUI     },
  ];

  function initAll(map) {
    MAP_MODULES.forEach(({ name, ref }) => {
      const mod = ref();
      if (!mod) {
        console.warn(`⚠️ ${name} not loaded — skipping init`);
        return;
      }
      if (typeof mod.init !== 'function') return;
      try {
        mod.init(map);
        console.log(`✅ ${name} initialized`);
      } catch (err) {
        console.error(`❌ ${name} init failed:`, err);
      }
    });

    // MapEnhancementsMobile uses its own DOM-ready init, but pass map anyway
    if (window.MapEnhancementsMobile?.detectDevice) {
      window.MapEnhancementsMobile.detectDevice();
    }

    // Presets and real-data integration auto-init, but trigger early if ready
    setTimeout(() => {
      if (window.MapEnhancementsPresets?.loadLastPreset) {
        window.MapEnhancementsPresets.loadLastPreset();
      }
      if (window.MapRealDataIntegration && !window.MapRealDataIntegration.isDataAvailable()) {
        window.MapRealDataIntegration.init();
      }
    }, 300);
  }

  // Listen for map-ready event dispatched by app.js
  window.addEventListener('map-ready', (e) => {
    const map = e.detail?.map || window.map || window.state?.map;
    if (!map) {
      console.warn('⚠️ map-ready fired but no map found in event detail');
      return;
    }
    console.log('🗺️ map-ready received — initializing enhancement modules...');
    initAll(map);
  });

  // Fallback: poll for map if event was missed (e.g. script loaded late)
  let pollAttempts = 0;
  const poll = setInterval(() => {
    pollAttempts++;
    const map = window.map || window.state?.map;
    if (map && typeof map.getCenter === 'function') {
      clearInterval(poll);
      // Only init if modules haven't already been initialized
      if (!window._mapModulesInited) {
        window._mapModulesInited = true;
        console.log('🗺️ map detected via poll — initializing enhancement modules...');
        initAll(map);
      }
    }
    if (pollAttempts > 30) clearInterval(poll); // give up after 15s
  }, 500);

  // Set flag on event to prevent double-init from poll fallback
  window.addEventListener('map-ready', () => {
    window._mapModulesInited = true;
  });
})();
