/**
 * map-history.js — Map view history, bookmarks, and minimap
 * Navigate back/forward through map views, save bookmarks, view minimap
 */
'use strict';

const MapHistory = (() => {
  const cfg = {
    map: null,
    history: [],
    currentIndex: -1,
    maxHistory: 20,
    bookmarks: [],
    minimapEnabled: false,
    minimap: null
  };

  // Load bookmarks from localStorage
  const BOOKMARKS_KEY = 'lucznicza_map_bookmarks';
  const HISTORY_KEY = 'lucznicza_map_history';

  function init(map) {
    cfg.map = map;
    console.log('📍 Inicjalizacja historii mapy...');

    // Load from storage
    loadBookmarks();
    loadHistory();

    // Track map movements
    map.on('moveend', recordMapState);
  }

  function recordMapState() {
    const map = cfg.map;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const state = {
      lat: center.lat.toFixed(5),
      lng: center.lng.toFixed(5),
      zoom: zoom,
      timestamp: new Date().toLocaleTimeString('pl'),
      basemap: window.state?.currentBaseLayer || 'voyager'
    };

    // Remove any forward history if we've navigated back
    if (cfg.currentIndex < cfg.history.length - 1) {
      cfg.history = cfg.history.slice(0, cfg.currentIndex + 1);
    }

    // Check if state is different from last
    const lastState = cfg.history[cfg.history.length - 1];
    if (lastState && lastState.lat === state.lat && lastState.lng === state.lng && lastState.zoom === state.zoom) {
      return; // No change
    }

    // Add to history
    cfg.history.push(state);
    if (cfg.history.length > cfg.maxHistory) {
      cfg.history.shift();
    } else {
      cfg.currentIndex++;
    }

    saveHistory();
  }

  function goBack() {
    if (cfg.currentIndex <= 0) {
      showToast('📍 Już jesteś na początku historii');
      return;
    }

    cfg.currentIndex--;
    const state = cfg.history[cfg.currentIndex];
    restoreMapState(state);
    showToast('⬅️ Cofnięto do poprzedniego widoku');
  }

  function goForward() {
    if (cfg.currentIndex >= cfg.history.length - 1) {
      showToast('📍 Już jesteś na końcu historii');
      return;
    }

    cfg.currentIndex++;
    const state = cfg.history[cfg.currentIndex];
    restoreMapState(state);
    showToast('➡️ Przesunięto do następnego widoku');
  }

  function restoreMapState(state) {
    const map = cfg.map;
    if (!map) return;

    map.setView([parseFloat(state.lat), parseFloat(state.lng)], state.zoom, { animate: true, duration: 0.8 });
  }

  function addBookmark(name) {
    const map = cfg.map;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    const bookmark = {
      id: Date.now(),
      name: name || `Widok ${cfg.bookmarks.length + 1}`,
      lat: center.lat,
      lng: center.lng,
      zoom: zoom,
      timestamp: new Date().toLocaleDateString('pl'),
      emoji: '📍'
    };

    cfg.bookmarks.push(bookmark);
    saveBookmarks();
    showToast(`📌 Zakładka: "${bookmark.name}" dodana`);
    return bookmark;
  }

  function getBookmarks() {
    return cfg.bookmarks;
  }

  function removeBookmark(id) {
    cfg.bookmarks = cfg.bookmarks.filter(b => b.id !== id);
    saveBookmarks();
    showToast('📌 Zakładka usunięta');
  }

  function goToBookmark(id) {
    const bookmark = cfg.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      showToast('⚠️ Zakładka nie znaleziona');
      return;
    }

    const map = cfg.map;
    if (map) {
      map.setView([bookmark.lat, bookmark.lng], bookmark.zoom, { animate: true, duration: 1 });
      showToast(`📌 Przeskok do: "${bookmark.name}"`);
    }
  }

  function initMinimap() {
    const map = cfg.map;
    if (!map) return;

    // Create minimap
    const minimap = L.control({ position: 'bottomleft' });

    minimap.onAdd = function(map) {
      const container = L.DomUtil.create('div', 'minimap-container');
      container.id = 'minimap';
      container.style.width = '150px';
      container.style.height = '120px';
      container.style.border = '1px solid var(--border)';
      container.style.borderRadius = '8px';
      container.style.background = 'var(--bg2)';
      container.style.boxShadow = 'var(--shadow-sm)';
      container.style.zIndex = '400';
      container.style.position = 'relative';

      return container;
    };

    minimap.addTo(map);

    // Initialize minimap with Leaflet
    setTimeout(() => {
      const minimapContainer = document.getElementById('minimap');
      if (minimapContainer) {
        const minimapInstance = L.map('minimap', {
          center: map.getCenter(),
          zoom: map.getZoom() - 3,
          layers: [
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
              attribution: '',
              subdomains: 'abcd'
            })
          ],
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          keyboard: false
        });

        // Draw viewport rectangle
        const updateRect = () => {
          const bounds = map.getBounds();
          if (minimapInstance) {
            minimapInstance.fitBounds(bounds, { padding: [10, 10] });
          }
        };

        map.on('move', updateRect);
        updateRect();
      }
    }, 100);

    cfg.minimapEnabled = true;
    showToast('🗺️ Miniatura mapy włączona');
  }

  function disableMinimap() {
    const minimapContainer = document.getElementById('minimap');
    if (minimapContainer) {
      minimapContainer.remove();
    }
    cfg.minimapEnabled = false;
    showToast('🗺️ Miniatura mapy wyłączona');
  }

  function toggleMinimap() {
    if (cfg.minimapEnabled) {
      disableMinimap();
    } else {
      initMinimap();
    }
  }

  // Storage functions
  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(cfg.history));
    } catch (e) {
      console.warn('Nie można zapisać historii:', e);
    }
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        cfg.history = JSON.parse(saved);
        cfg.currentIndex = cfg.history.length - 1;
      }
    } catch (e) {
      console.warn('Nie można załadować historii:', e);
      cfg.history = [];
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(cfg.bookmarks));
    } catch (e) {
      console.warn('Nie można zapisać zakładek:', e);
    }
  }

  function loadBookmarks() {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        cfg.bookmarks = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Nie cannot załadować zakładek:', e);
      cfg.bookmarks = [];
    }
  }

  function clearHistory() {
    cfg.history = [];
    cfg.currentIndex = -1;
    saveHistory();
    showToast('🗑️ Historia wyczyszczona');
  }

  function clearBookmarks() {
    cfg.bookmarks = [];
    saveBookmarks();
    showToast('🗑️ Zakładki wyczyszczone');
  }

  // Public API
  return {
    init,
    goBack,
    goForward,
    addBookmark,
    removeBookmark,
    goToBookmark,
    getBookmarks,
    toggleMinimap,
    initMinimap,
    disableMinimap,
    clearHistory,
    clearBookmarks,
    getHistory: () => cfg.history,
    getCurrentIndex: () => cfg.currentIndex
  };
})();

window.MapHistory = MapHistory;
