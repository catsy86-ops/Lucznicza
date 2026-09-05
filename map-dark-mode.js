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

  // Tile layer URL configs — layers are created lazily inside init()
  // to avoid calling L.tileLayer before the map exists
  const LAYER_URLS = {
    darkMode:  { name: 'Ciemny',               url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri' },
    lightMode: { name: 'Jasny',                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors' },
    softDark:  { name: 'Miękki ciemny (noc)',  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri' },
    softLight: { name: 'Miękki jasny (dzień)', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors' }
  };

  // Actual L.tileLayer instances — populated in init()
  let mapLayers = {};

  function init(map) {
    cfg.map = map;
    console.log('🌙 Inicjalizacja trybu ciemnego...');

    // Create tile layers now that the map exists (lazy init)
    Object.entries(LAYER_URLS).forEach(([key, val]) => {
      mapLayers[key] = { name: val.name, layer: L.tileLayer(val.url, { attribution: val.attribution, maxZoom: 19 }) };
    });

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

  function useCustomLayer(layerId) {
    const entry = mapLayers[layerId];
    if (!entry) {
      showToast('⚠️ Warstwa nie znaleziona');
      return;
    }
    const map = cfg.map;
    if (!map) return;
    if (cfg.currentActiveLayer) map.removeLayer(cfg.currentActiveLayer);
    map.addLayer(entry.layer);
    cfg.currentActiveLayer = entry.layer;
    showToast(`🎨 Zmieniono na: ${entry.name}`);
  }

  function getLayerOptions() {
    return Object.entries(mapLayers).map(([key, value]) => ({
      id: key,
      name: value.name
    }));
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
