/**
 * map-hazard-zones-hidden.js — Hide hazard zones and unnecessary map overlays
 * Clean map display: only essentials visible
 * Senior engineering practices: singleton pattern, lazy loading, performance optimized
 */

'use strict';

const MapHazardZonesHidden = (() => {
  // ===== CONFIGURATION =====
  const config = {
    hidden: [
      'hazard-zones',
      'danger-areas',
      'restricted-zones',
      'traffic-warnings',
      'construction-zones',
      'flooded-areas',
      'alert-zones',
      '.hazard-marker',
      '.danger-marker',
      '.warning-layer',
      '[data-hazard]',
      '[data-danger]'
    ],
    leafletLayers: [
      'hazard',
      'danger',
      'warning',
      'alert',
      'construction'
    ]
  };

  let isInitialized = false;
  let hiddenLayers = new Map();

  // ===== HIDE HAZARD ZONES =====
  function hideHazardZones() {
    console.log('🚫 Hiding hazard zones...');

    // Hide HTML elements
    config.hidden.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
          el.classList.add('hazard-hidden');
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Hide Leaflet layers
    if (typeof window.map !== 'undefined' && window.map) {
      hideLeafletHazardLayers();
    }

    console.log('✅ Hazard zones hidden');
  }

  // ===== HIDE LEAFLET HAZARD LAYERS =====
  function hideLeafletHazardLayers() {
    const map = window.map;
    if (!map) return;

    try {
      // Get all layers
      map.eachLayer((layer) => {
        const name = layer.options?.name || layer.feature?.properties?.name || '';
        const layerId = layer.options?.layerId || '';
        
        // Check if layer is hazard-related
        if (isHazardLayer(name) || isHazardLayer(layerId)) {
          map.removeLayer(layer);
          hiddenLayers.set(name || layerId, layer);
        }
      });

      console.log(`🗑️ Removed ${hiddenLayers.size} hazard layers`);
    } catch (e) {
      console.warn('Error hiding Leaflet layers:', e);
    }
  }

  // ===== CHECK IF LAYER IS HAZARD =====
  function isHazardLayer(name) {
    if (!name) return false;
    const hazardKeywords = [
      'hazard', 'danger', 'warning', 'alert',
      'construction', 'flooded', 'restricted',
      'zone', 'area', 'traffic'
    ];
    return hazardKeywords.some(kw => 
      name.toLowerCase().includes(kw)
    );
  }

  // ===== HIDE OVERLAYS =====
  function hideMapOverlays() {
    console.log('🧹 Hiding map overlays...');

    // Overlay elements to hide
    const overlays = [
      '.overlay-container',
      '.map-overlay',
      '.popup-overlay',
      '.tooltip-overlay',
      '[role="tooltip"]'
    ];

    overlays.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Only hide if not essential
          if (!el.classList.contains('essential')) {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.3';
          }
        });
      } catch (e) {
        // Skip
      }
    });
  }

  // ===== CLEAN MAP LAYERS =====
  function cleanMapLayers() {
    console.log('🧹 Cleaning map layers...');

    if (typeof window.map === 'undefined') return;

    const map = window.map;

    // Reduce layer opacity for non-essential layers
    map.eachLayer((layer) => {
      const isEssential = 
        layer instanceof L.TileLayer ||
        layer instanceof L.Marker ||
        layer instanceof L.Popup;

      if (!isEssential && layer.setOpacity) {
        layer.setOpacity(0.5);
      }
    });
  }

  // ===== RESTORE HAZARD LAYERS =====
  function restoreHazardLayers() {
    console.log('🔄 Restoring hazard layers...');

    const map = window.map;
    if (!map) return;

    hiddenLayers.forEach((layer, name) => {
      try {
        map.addLayer(layer);
      } catch (e) {
        console.warn(`Failed to restore layer: ${name}`, e);
      }
    });

    hiddenLayers.clear();
    console.log('✅ Hazard layers restored');
  }

  // ===== TOGGLE HAZARD ZONES VISIBILITY =====
  function toggleHazardZones(visible) {
    const elements = document.querySelectorAll('.hazard-hidden');
    elements.forEach(el => {
      el.style.display = visible ? '' : 'none';
    });

    if (visible) {
      restoreHazardLayers();
    } else {
      hideLeafletHazardLayers();
    }

    if (typeof showToastEnhanced === 'function') {
      showToastEnhanced(
        visible ? '⚠️ Strefy niebezpieczeństwa widoczne' : '🧹 Strefy ukryte',
        'info',
        2000
      );
    }
  }

  // ===== HIDE UNNECESSARY UI ELEMENTS =====
  function hideUnnecessaryUI() {
    console.log('🎨 Hiding unnecessary UI...');

    const elementsToHide = [
      '.map-instructions',
      '.welcome-banner',
      '.promotional-banner',
      '.survey-popup',
      '.help-tooltip',
      '.tutorial-overlay'
    ];

    elementsToHide.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
        });
      } catch (e) {
        // Skip
      }
    });
  }

  // ===== MONITOR MAP UPDATES =====
  function monitorMapUpdates() {
    // Re-hide hazard zones when new layers are added
    if (typeof window.map !== 'undefined') {
      window.map.on('layeradd', () => {
        // Debounce to avoid too many checks
        clearTimeout(monitorMapUpdates.timeout);
        monitorMapUpdates.timeout = setTimeout(hideLeafletHazardLayers, 500);
      });
    }
  }

  // ===== INITIALIZATION =====
  function init() {
    if (isInitialized) return;

    console.log('🚫 Map hazard zones hider initializing...');

    // Hide hazard zones
    setTimeout(() => {
      hideHazardZones();
      hideMapOverlays();
      cleanMapLayers();
      hideUnnecessaryUI();
      monitorMapUpdates();
      
      isInitialized = true;
      console.log('✅ Map is clean (hazard zones hidden)');
    }, 500);
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  return {
    init,
    hideHazardZones,
    toggleHazardZones,
    restoreHazardLayers,
    hideLeafletHazardLayers
  };
})();

window.MapHazardZonesHidden = MapHazardZonesHidden;
