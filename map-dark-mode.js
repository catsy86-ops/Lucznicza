/**
 * map-dark-mode.js — Advanced dark/light mode for map
 * Synchronized with app theme, eye-friendly, automatic day/night switching
 */
'use strict';

const MapDarkMode = (() => {
  const cfg = {
    enabled: false,
    mode: 'auto', // auto | light | dark
    autoSwitchTime: true,
    sunriseTime: '06:00',
    sunsetTime: '21:00',
    layers: {
      dark: null,
      light: null,
      auto: null
    },
    currentActiveLayer: null,
    map: null
  };

  // Tile layer configurations
  const mapLayers = {
    // DARK MODE LAYERS
    darkMode: {
      name: 'Ciemny',
      layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
      })
    },
    
    // LIGHT MODE LAYERS
    lightMode: {
      name: 'Jasny',
      layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
      })
    },

    // SOFT DARK (eye-friendly for night)
    softDark: {
      name: 'Miękki ciemny (noc)',
      layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
      })
    },

    // SOFT LIGHT (eye-friendly for day)
    softLight: {
      name: 'Miękki jasny (dzień)',
      layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
      })
    }
  };

  function init(map) {
    cfg.map = map;
    console.log('🌙 Inicjalizacja trybu ciemnego...');

    // Listen to app theme changes
    observeAppThemeChange();

    // Start auto mode if enabled
    if (cfg.autoSwitchTime) {
      startAutoSwitch();
    }

    // Apply initial mode
    applyMode(cfg.mode);
  }

  function toggle() {
    if (cfg.enabled) {
      disable();
    } else {
      enable();
    }
  }

  function enable() {
    cfg.enabled = true;
    applyMode(cfg.mode);
    showToast('🌙 Tryb ciemny mapy włączony');
  }

  function disable() {
    cfg.enabled = false;
    showToast('☀️ Tryb jasny mapy włączony');
  }

  function applyMode(mode) {
    const map = cfg.map;
    if (!map) return;

    cfg.mode = mode;

    // Remove previous layer
    if (cfg.currentActiveLayer) {
      map.removeLayer(cfg.currentActiveLayer);
    }

    let layerToAdd;

    if (mode === 'auto') {
      // Auto-detect based on time or app theme
      const appIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
      layerToAdd = appIsDark ? mapLayers.softDark.layer : mapLayers.softLight.layer;
    } else if (mode === 'dark') {
      layerToAdd = mapLayers.darkMode.layer;
    } else if (mode === 'light') {
      layerToAdd = mapLayers.lightMode.layer;
    }

    if (layerToAdd) {
      map.addLayer(layerToAdd);
      cfg.currentActiveLayer = layerToAdd;
    }

    // Update overlay colors for dark mode
    updateOverlayColors(mode === 'dark' || (mode === 'auto' && document.documentElement.getAttribute('data-theme') === 'dark'));
  }

  function setMode(mode) {
    cfg.mode = mode;
    applyMode(mode);
    showToast(`🌙 Tryb mapy: ${mode === 'auto' ? 'Automatyczny' : mode === 'dark' ? 'Ciemny' : 'Jasny'}`);
  }

  function updateOverlayColors(isDark) {
    // Update popup and tooltip colors for contrast
    const popups = document.querySelectorAll('.leaflet-popup-content-wrapper');
    const tooltips = document.querySelectorAll('.leaflet-tooltip');

    popups.forEach(popup => {
      if (isDark) {
        popup.style.backgroundColor = 'var(--bg2)';
        popup.style.color = 'var(--text)';
      }
    });

    tooltips.forEach(tooltip => {
      if (isDark) {
        tooltip.style.backgroundColor = 'var(--surface2)';
        tooltip.style.color = 'var(--text)';
      }
    });
  }

  function startAutoSwitch() {
    cfg.autoSwitchInterval = setInterval(() => {
      if (cfg.mode === 'auto') {
        applyMode('auto');
      }
    }, 60000); // Check every minute
  }

  function stopAutoSwitch() {
    if (cfg.autoSwitchInterval) {
      clearInterval(cfg.autoSwitchInterval);
      cfg.autoSwitchInterval = null;
    }
  }

  function observeAppThemeChange() {
    // Watch for data-theme attribute changes
    const observer = new MutationObserver(() => {
      if (cfg.mode === 'auto' && cfg.enabled) {
        applyMode('auto');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  function getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      isDaytime: isCurrentlyDaytime()
    };
  }

  function isCurrentlyDaytime() {
    const now = new Date();
    const hours = now.getHours();

    // Parse times
    const [sunriseHour, sunriseMin] = cfg.sunriseTime.split(':').map(Number);
    const [sunsetHour, sunsetMin] = cfg.sunsetTime.split(':').map(Number);

    const sunriseTotal = sunriseHour * 60 + sunriseMin;
    const sunsetTotal = sunsetHour * 60 + sunsetMin;
    const currentTotal = hours * 60 + now.getMinutes();

    return currentTotal >= sunriseTotal && currentTotal < sunsetTotal;
  }

  function setSunTimes(sunrise, sunset) {
    cfg.sunriseTime = sunrise;
    cfg.sunsetTime = sunset;
    showToast(`🌅 Czasy słoneczne zmienione: ${sunrise}-${sunset}`);
  }

  function getLayerOptions() {
    return Object.entries(mapLayers).map(([key, value]) => ({
      id: key,
      name: value.name
    }));
  }

  function useCustomLayer(layerId) {
    const layer = mapLayers[layerId];
    if (!layer) {
      showToast('⚠️ Warstwa nie znaleziona');
      return;
    }

    const map = cfg.map;
    if (cfg.currentActiveLayer) {
      map.removeLayer(cfg.currentActiveLayer);
    }

    map.addLayer(layer.layer);
    cfg.currentActiveLayer = layer.layer;
    showToast(`🎨 Zmieniono na: ${layer.name}`);
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    setMode,
    setSunTimes,
    getLayerOptions,
    useCustomLayer,
    getCurrentTime,
    isCurrentlyDaytime,
    getMode: () => cfg.mode
  };
})();

window.MapDarkMode = MapDarkMode;
