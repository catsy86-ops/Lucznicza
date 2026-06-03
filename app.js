/* ===== SZCZECIN GUIDE — MAIN APP (Leaflet Edition) ===== */
'use strict';

// ===== STATE =====
const state = {
  currentSection: 'map',
  currentCat: 'all',
  currentFilter: 'all',
  isDark: true,
  markers: [],
  leafletLayers: [],
  routePolylines: [],
  map: null,
  flyInterval: null,
  searchQuery: '',
  sortBy: 'default',      // default | rating | distance | name
  showFavoritesOnly: false,
  showOpenOnly: false,
  userMarker: null,
  userCircle: null
};

// Expose state globally so other modules (map-advanced, map-improvements, etc.) can access it
window.state = state;

// ===== CATEGORY COLORS =====
const CAT_COLORS = {
  sport: '#ff6b6b',
  food: '#ffd93d',
  shop: '#6bcb77',
  park: '#4ecdc4',
  service: '#a29bfe',
  edu: '#fd79a8'
};

const CAT_BG = {
  sport: 'rgba(255,107,107,0.15)',
  food: 'rgba(255,217,61,0.15)',
  shop: 'rgba(107,203,119,0.15)',
  park: 'rgba(78,205,196,0.15)',
  service: 'rgba(162,155,254,0.15)',
  edu: 'rgba(253,121,168,0.15)'
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Restore theme from localStorage
  const savedTheme = localStorage.getItem('lucznicza_theme');
  if (savedTheme) {
    state.isDark = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
  }

  // Splash screen — use requestAnimationFrame to avoid forced reflow
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    if (!splash || !app) return;

    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      splash.style.display = 'none';
      app.classList.remove('hidden');
      // Use class instead of inline styles to avoid forced layout
      app.classList.add('app-visible');
      requestAnimationFrame(() => {
        initMap();
        initUI();
        renderPlaces();
        renderRoutes();
        renderInfo();
        renderTransport();
        renderEvents();
        renderCommunity();
        updateStatTotal();
        handleDeepLink();
      });
    }, 500);
  }, 1000);
});

// ===== DEEP LINK (#miejsce-X opens that place) =====
function handleDeepLink() {
  // Street View button now works with Mapillary fallback — no need to hide it

  const hash = window.location.hash;
  
  // Handle section navigation via hash
  const sectionMatch = hash.match(/^#(map|places|routes|info|transport|events|live|community)$/);
  if (sectionMatch) {
    navigateTo(sectionMatch[1]);
    return;
  }

  // Handle place deep link
  const placeMatch = hash.match(/#miejsce-(\d+)/);
  if (placeMatch) {
    const id = parseInt(placeMatch[1]);
    navigateTo('places');
    setTimeout(() => openPlaceModal(id), 400);
    return;
  }

  // Handle route deep link
  const routeMatch = hash.match(/#trasa-(\d+)/);
  if (routeMatch) {
    const id = parseInt(routeMatch[1]);
    navigateTo('routes');
    setTimeout(() => {
      toggleRouteCard(id);
      const card = document.getElementById(`rcard-${id}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  }
}

// Listen for hash changes (back/forward navigation)
window.addEventListener('hashchange', handleDeepLink);

// ===== MAP INIT (Leaflet + OpenStreetMap) =====
function initMap() {
  console.log('🗺️ Inicjalizacja mapy Leaflet...');

  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('❌ Brak kontenera mapy!');
    return;
  }

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.log('⚠️ Leaflet nie załadowany, czekam...');
    setTimeout(initMap, 500);
    return;
  }

  try {
    // Clear any fallback content
    mapContainer.style.background = '';
    mapContainer.style.animation = '';
    mapContainer.innerHTML = '';

    // Initialize Leaflet map centered on Niebuszewo, Szczecin
    const map = L.map('map', {
      zoomControl: false,
      zoomSnap: 0.5,            // płynniejszy zoom (półstopnie)
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 100, // łagodniejszy zoom kółkiem
      maxBoundsViscosity: 0.7,  // "miękkie" odbicie od granic
      minZoom: 12,
      maxZoom: 20,
      tap: true,
      inertia: true,
    }).setView([53.4530, 14.5520], 15);

    // Ogranicz przewijanie do okolic Szczecina (z marginesem)
    map.setMaxBounds([[53.30, 14.35], [53.60, 14.75]]);

    // Base tile layers — NO crossOrigin (it breaks tile display if the
    // tile server doesn't send CORS headers → tiles load but show blank/gray).
    // detectRetina = ostrzejsze kafelki na ekranach HiDPI/Retina.
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19, detectRetina: true
    });

    // CARTO Voyager — colourful, modern default
    const voyagerLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 20, detectRetina: true
    }).addTo(map);

    // CARTO Dark — for night / dark theme
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 20, detectRetina: true
    });

    // CARTO Light — clean, minimal
    const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 20, detectRetina: true
    });

    // Esri satellite imagery
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 18, detectRetina: true
    });

    // If Voyager fails to load tiles, fall back to OSM
    let voyagerErrors = 0;
    voyagerLayer.on('tileerror', () => {
      voyagerErrors++;
      if (voyagerErrors === 4 && !map.hasLayer(osmLayer)) {
        console.warn('⚠️ CARTO tiles failing, switching to OpenStreetMap');
        map.removeLayer(voyagerLayer);
        osmLayer.addTo(map);
        state.currentBaseLayer = 'osm';
        if (typeof showToast === 'function') showToast('🗺️ Przełączono na OpenStreetMap (kafelki CARTO niedostępne)');
      }
    });

    // Tile loading indicator — subtle progress feedback
    let tilesLoading = 0;
    function onTileLoadStart() {
      tilesLoading++;
      const el = document.getElementById('mapLoadingBar');
      if (el) el.classList.add('active');
    }
    function onTileLoadEnd() {
      tilesLoading = Math.max(0, tilesLoading - 1);
      if (tilesLoading === 0) {
        const el = document.getElementById('mapLoadingBar');
        if (el) el.classList.remove('active');
      }
    }
    [osmLayer, voyagerLayer, darkLayer, lightLayer, satelliteLayer].forEach(layer => {
      layer.on('loading', onTileLoadStart);
      layer.on('load', onTileLoadEnd);
    });

    // Store layers for switching (keys used by the style switcher UI)
    state.baseLayers = {
      voyager: voyagerLayer,
      dark: darkLayer,
      light: lightLayer,
      satellite: satelliteLayer,
      osm: osmLayer
    };
    state.currentBaseLayer = 'voyager';

    // Add controls
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

    // Area highlight rectangle — Niebuszewo
    L.rectangle(
      [[53.4472, 14.5431], [53.4623, 14.5710]],
      { color: '#6c63ff', weight: 2, opacity: 0.4, fill: true, fillColor: '#6c63ff', fillOpacity: 0.04, dashArray: '4, 2', interactive: false }
    ).addTo(map);

    // Central landmark — Łucznicza 43 (subtle, non-intrusive)
    const landmarkIcon = L.divIcon({
      html: '<div class="map-landmark"><span class="ml-pin">🏹</span><span class="ml-label">Łucznicza 43</span></div>',
      iconSize: null,
      className: 'map-landmark-icon'
    });
    L.marker([53.4541, 14.5475], { icon: landmarkIcon, interactive: false, zIndexOffset: -500 }).addTo(map);

    // Add POI markers — with subtle staggered drop-in
    if (APP_DATA && APP_DATA.places) {
      APP_DATA.places.forEach((place, i) => {
        const marker = createPoiMarker(place);
        marker.addTo(map);
        state.markers.push(marker);
        // Staggered fade-in via marker element
        const el = marker.getElement && marker.getElement();
        if (el) {
          el.style.opacity = '0';
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.transform = 'translateY(-12px)';
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 200 + i * 40);
        }
      });
    }

    // Add routes — interactive with hover + popups
    if (APP_DATA && APP_DATA.routes) {
      const typeEmoji = { walk: '🚶', bike: '🚴', run: '🏃' };
      APP_DATA.routes.forEach(route => {
        const latlngs = route.coords.map(coord => [coord[1], coord[0]]);
        const polyline = L.polyline(latlngs, {
          color: route.color, weight: 5, opacity: 0.75,
          dashArray: '10, 6', lineCap: 'round', lineJoin: 'round'
        });
        polyline.routeId = route.id;

        // Popup z informacjami o trasie
        polyline.bindPopup(`
          <div class="route-map-popup">
            <div class="rmp-head" style="border-left:4px solid ${route.color}">
              <span class="rmp-emoji">${route.emoji || typeEmoji[route.type] || '🚶'}</span>
              <div>
                <div class="rmp-name">${route.name}</div>
                <div class="rmp-meta">${route.distance} · ${route.time} · ${route.difficulty}</div>
              </div>
            </div>
            <div class="rmp-body">
              <div class="rmp-stat">🔥 ${route.calories} kcal</div>
              <div class="rmp-stat">🛤️ ${route.terrain}</div>
              <div class="rmp-stat">⏰ Najlepiej: ${route.bestTime}</div>
            </div>
            <button class="rmp-btn" onclick="showRouteOnMap(${route.id})">Pokaż szczegóły trasy</button>
          </div>
        `, { maxWidth: 260, className: 'route-popup-wrapper' });

        // Hover — podświetl trasę
        polyline.on('mouseover', function() {
          this.setStyle({ weight: 8, opacity: 1, dashArray: null });
        });
        polyline.on('mouseout', function() {
          this.setStyle({ weight: 5, opacity: 0.75, dashArray: '10, 6' });
        });

        polyline.addTo(map);
        state.routePolylines.push(polyline);
      });
    }

    // Store map in state
    state.map = map;

    // CRITICAL: force Leaflet to recalculate container size so tiles load.
    map.invalidateSize(true);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (mapContainer.clientHeight > 0) map.invalidateSize(true);
      });
      ro.observe(mapContainer);
    }
    // One delayed call covers the splash-screen reveal; ResizeObserver handles the rest.
    map.whenReady(() => setTimeout(() => map.invalidateSize(true), 100));
    window.addEventListener('resize', () => map.invalidateSize());

    // Initialize premium map features (style switcher, geolocation, etc.)
    if (window.mapPro && window.mapPro.init) {
      window.mapPro.init(map);
    }

    // Initialize advanced map features (zones, heatmap, search)
    if (window.mapAdvanced && window.mapAdvanced.init) {
      window.mapAdvanced.init(map);
    }

    // Expose map globally and dispatch map-ready event for other modules
    window.map = map;
    window.dispatchEvent(new CustomEvent('map-ready', { detail: { map } }));

    console.log('✨ Mapa Leaflet gotowa! Wysokość kontenera:', mapContainer.clientHeight);

  } catch (err) {
    console.error('❌ Błąd ładowania mapy:', err);
    showToast('❌ Błąd ładowania mapy');
  }
}

// ===== CREATE RICH POI MARKER (IMPROVED) =====
function createPoiMarker(place) {
  const PE = window.placesEnhanced;
  const status = PE ? PE.getOpenStatus(place) : null;
  
  // Better status indicator - always show
  const statusDot = `<span class="mk-status ${status?.open ? 'open' : 'closed'}" title="${status?.open ? 'Otwarte' : 'Zamknięte'}"></span>`;
  
  // Category badge for better visibility
  const categoryBadge = {
    sport: '⚽',
    food: '🍽️',
    shop: '🛒',
    park: '🌳',
    service: '🔧',
    edu: '📚'
  }[place.cat] || place.emoji;

  const iconHtml = `
    <div class="mk-wrap" data-cat="${place.cat}">
      <div class="mk-pin mk-pin-${place.cat}" style="background:${CAT_COLORS[place.cat]}; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <span class="mk-emoji">${place.emoji}</span>
        <span class="mk-badge">${place.rating ? '⭐' : ''}</span>
      </div>
      ${statusDot}
      <div class="mk-pulse" style="border-color:${CAT_COLORS[place.cat]}"></div>
    </div>
  `;
  
  const icon = L.divIcon({
    html: iconHtml,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -54],
    className: 'leaflet-marker-custom'
  });

  const marker = L.marker([place.coords[1], place.coords[0]], {
    icon: icon,
    riseOnHover: true,
    zIndexOffset: place.rating ? 100 : 0  // Rated places on top
  });
  
  marker.placeData = place;

  // Enhanced popup with better layout
  const stars = PE ? PE.renderStars(place.rating || 0) : '';
  const statusBadge = status
    ? `<span class="pp-status ${status.open ? 'open' : 'closed'}">${status.open ? '🟢 Otwarte' : '🔴 Zamknięte'}</span>`
    : '';

  const popupContent = `
    <div class="map-popup">
      <div class="pp-head" style="background:linear-gradient(135deg, ${CAT_COLORS[place.cat]}, ${CAT_COLORS[place.cat]}dd)">
        <div class="pp-head-inner">
          <span class="pp-emoji">${place.emoji}</span>
          <div class="pp-head-text">
            <div class="pp-name">${place.name}</div>
            ${statusBadge}
          </div>
        </div>
      </div>
      <div class="pp-body">
        <div class="pp-meta">
          <span class="pp-cat" style="color:${CAT_COLORS[place.cat]}; background:${CAT_COLORS[place.cat]}22; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:600;">
            ${place.cat.toUpperCase()}
          </span>
          ${place.rating ? `<span class="pp-rating">⭐ ${place.rating}</span>` : ''}
        </div>
        <div class="pp-addr">📍 ${place.addr}</div>
        ${place.phone ? `<div class="pp-phone">📞 <a href="tel:${place.phone}" class="pp-link">${place.phone}</a></div>` : ''}
        ${place.hours ? `<div class="pp-hours">🕐 ${place.hours}</div>` : ''}
        <div class="pp-actions">
          <button class="pp-btn primary" onclick="openPlaceModal(${place.id})">Szczegóły</button>
          <button class="pp-btn secondary" onclick="openGoogleMaps(${place.coords[1]},${place.coords[0]})">🧭 Nawigacja</button>
          <button class="pp-btn secondary" onclick="togglePlaceFav(${place.id}, this)">${PE && PE.isFavorite(place.id) ? '❤️' : '🤍'}</button>
        </div>
      </div>
    </div>
  `;

  marker.bindPopup(popupContent, { 
    maxWidth: 300, 
    minWidth: 240, 
    closeButton: true, 
    className: 'map-popup-wrapper',
    autoPan: true
  });

  // Add click event for better UX
  marker.on('click', function() {
    setTimeout(() => {
      marker.openPopup();
    }, 100);
  });

  return marker;
}

// Helper function for favorite toggle in popup
function togglePlaceFav(placeId, btn) {
  if (window.placesEnhanced && window.placesEnhanced.toggleFavorite) {
    window.placesEnhanced.toggleFavorite(placeId);
    const isFav = window.placesEnhanced.isFavorite(placeId);
    btn.textContent = isFav ? '❤️' : '🤍';
    if (typeof showToast === 'function') {
      showToast(isFav ? '❤️ Dodano do ulubionych' : '🤍 Usunięto z ulubionych');
    }
    // Sync the places grid if visible
    if (typeof renderPlaces === 'function' && state.currentSection === 'places') {
      renderPlaces(state.searchQuery || '');
    }
  }
}

// ===== FILTER MARKERS (Leaflet, cluster-aware) =====
function filterMarkers(cat) {
  if (!state.map) return;
  state.currentCat = cat;

  const clusterGroup = (window.mapEnhancements && window.mapEnhancements.getClusterGroup)
    ? window.mapEnhancements.getClusterGroup()
    : null;

  let visibleCount = 0;
  state.markers.forEach(marker => {
    const place = marker.placeData;
    if (!place) return;
    const show = (cat === 'all' || place.cat === cat);
    if (show) visibleCount++;

    if (clusterGroup) {
      // Cluster mode: add/remove from the cluster group
      if (show) {
        if (!clusterGroup.hasLayer(marker)) clusterGroup.addLayer(marker);
      } else {
        if (clusterGroup.hasLayer(marker)) clusterGroup.removeLayer(marker);
      }
    } else {
      // Normal mode: add/remove from map
      if (show) {
        if (!state.map.hasLayer(marker)) marker.addTo(state.map);
      } else {
        if (state.map.hasLayer(marker)) state.map.removeLayer(marker);
      }
    }
  });

  if (clusterGroup && clusterGroup.refreshClusters) clusterGroup.refreshClusters();

  // Keep the Places section filter in sync with the map filter
  state.currentFilter = cat;
  syncPlacesFilterUI(cat);

  // Feedback when no markers match
  if (visibleCount === 0 && cat !== 'all') {
    showToast('📍 Brak miejsc w tej kategorii w okolicy');
  }
}

// Sync the Places-section filter tabs UI with a given category
function syncPlacesFilterUI(cat) {
  document.querySelectorAll('#placesFilter .filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === cat);
  });
  // Re-render places grid if the section exists
  if (typeof renderPlaces === 'function') renderPlaces(state.searchQuery || '');
}

// ===== MAP CONTROLS (Leaflet-compatible) =====
function initMapControls() {
  const map = state.map;
  if (!map) return;

  // 3D toggle — removed (handled via style switcher / Street View)

  // Fly animation (rotate around center)
  const btnFly = document.getElementById('btnFly');
  if (btnFly) {
    btnFly.addEventListener('click', () => {
      if (state.flyInterval) {
        clearInterval(state.flyInterval);
        state.flyInterval = null;
        btnFly.classList.remove('active');
        showToast('✈️ Animacja zatrzymana');
        return;
      }
      btnFly.classList.add('active');
      showToast('✈️ Lot wokół dzielnicy uruchomiony');
      let zoom = map.getZoom();
      let step = 0;
      const center = [53.4530, 14.5520];
      const radius = 0.003;
      state.flyInterval = setInterval(() => {
        step += 0.02;
        const lat = center[0] + radius * Math.sin(step);
        const lng = center[1] + radius * Math.cos(step);
        map.setView([lat, lng], zoom, { animate: false });
      }, 50);
    });
  }

  // Street View (Google Maps) — or Mapillary fallback
  const btnStreetView = document.getElementById('btnStreetView');
  if (btnStreetView) {
    btnStreetView.addEventListener('click', () => {
      if (window.GOOGLE_MAPS_FAILED) {
        // Fallback: open Mapillary street-level imagery for the area
        const center = state.map ? state.map.getCenter() : { lat: 53.4530, lng: 14.5520 };
        const mapillaryUrl = `https://www.mapillary.com/app/?lat=${center.lat}&lng=${center.lng}&z=17`;
        window.open(mapillaryUrl, '_blank');
        showToast('📸 Otwieranie Mapillary (alternatywa Street View)');
        return;
      }
      if (window.googleMapsAPI && window.googleMapsAPI.toggleStreetView && GOOGLE_MAPS && GOOGLE_MAPS.panorama) {
        window.googleMapsAPI.toggleStreetView();
        showToast('📸 Google Street View');
      } else {
        showToast('⚠️ Street View jeszcze się ładuje lub jest niedostępny');
      }
    });
  }

  // Quick 3D Buildings button — handled by delegation in buildings-3d.js
  // (no listener here to avoid double-toggle)

  // FAB button is wired in buildings-3d.js directly (with L.DomEvent.disableClickPropagation)

  // Category filter buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMarkers(btn.dataset.cat);
    });
  });

  // Advanced map layer controls
  const mapContainer = document.getElementById('map');
  if (mapContainer && !document.getElementById('layerControl')) {
    const layerCtrl = document.createElement('div');
    layerCtrl.id = 'layerControl';
    layerCtrl.className = 'map-layer-control';
    layerCtrl.innerHTML = `
      <button class="mlc-toggle" id="lcToggle" title="Przełącznik warstw" onclick="toggleLayerPanel()">🎨</button>
      <div id="lcPanel" class="mlc-options" style="display: none;">
        <button class="mlc-option" onclick="window.mapAdvanced.toggleLayer('geofence')" title="Strefy zainteresowania">
          <span class="mlc-icon">🎯</span> Strefy
        </button>
        <button class="mlc-option" onclick="window.mapAdvanced.toggleLayer('heat')" title="Mapa ciepła aktywności">
          <span class="mlc-icon">🔥</span> Heatmapa
        </button>
        <button class="mlc-option" onclick="window.printMap()" title="Drukuj mapę">
          <span class="mlc-icon">🖨️</span> Drukuj
        </button>
      </div>
    `;
    mapContainer.appendChild(layerCtrl);
    
    window.toggleLayerPanel = function() {
      const panel = document.getElementById('lcPanel');
      const toggle = document.getElementById('lcToggle');
      if (panel.style.display === 'none') {
        panel.style.display = 'flex';
        toggle.classList.add('active');
      } else {
        panel.style.display = 'none';
        toggle.classList.remove('active');
      }
    };
  }
}

// ===== UI INIT =====
function initUI() {
  initMapControls();

  // Map Tools Panel
  const toolsToggle = document.getElementById('toolsToggle');
  const toolsPanel = document.getElementById('mapToolsPanel');
  const toolsClose = document.getElementById('toolsClose');

  if (toolsToggle && toolsPanel) {
    toolsToggle.addEventListener('click', () => {
      toolsPanel.classList.toggle('hidden');
      toolsToggle.style.background = toolsPanel.classList.contains('hidden')
        ? 'rgba(26,26,46,0.9)'
        : 'var(--accent)';
    });
  }
  if (toolsClose && toolsPanel) {
    toolsClose.addEventListener('click', () => {
      toolsPanel.classList.add('hidden');
      if (toolsToggle) toolsToggle.style.background = 'rgba(26,26,46,0.9)';
    });
  }

  // Map enhancement tool buttons
  const btnHeatmap = document.getElementById('btnHeatmap');
  if (btnHeatmap) {
    btnHeatmap.addEventListener('click', () => {
      if (window.mapEnhancements) window.mapEnhancements.toggleHeatmap();
      btnHeatmap.classList.toggle('active');
    });
  }

  const btnClustering = document.getElementById('btnClustering');
  if (btnClustering) {
    btnClustering.addEventListener('click', () => {
      if (window.mapEnhancements) window.mapEnhancements.enableClustering();
      btnClustering.classList.toggle('active');
    });
  }

  const btnGeofences = document.getElementById('btnGeofences');
  if (btnGeofences) {
    btnGeofences.addEventListener('click', () => {
      if (window.mapEnhancements) window.mapEnhancements.geofences();
      btnGeofences.classList.toggle('active');
    });
  }

  // Buildings 3D button — handled by delegation in buildings-3d.js
  // (no listener here to avoid double-toggle)

  // Routing
  const btnCalculateRoute = document.getElementById('btnCalculateRoute');
  if (btnCalculateRoute) {
    btnCalculateRoute.addEventListener('click', () => {
      const startId = parseInt(document.getElementById('routeStart').value);
      const endId = parseInt(document.getElementById('routeEnd').value);
      if (startId && endId && window.mapEnhancements) {
        window.mapEnhancements.routing(startId, endId);
      } else {
        showToast('⚠️ Wybierz początek i koniec trasy');
      }
    });
  }

  // Populate route selects
  const selects = ['routeStart', 'routeEnd'];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (select && APP_DATA && APP_DATA.places) {
      APP_DATA.places.forEach(place => {
        const option = document.createElement('option');
        option.value = place.id;
        option.textContent = place.name;
        select.appendChild(option);
      });
    }
  });

  // Measurement button
  const btnMeasure = document.getElementById('btnMeasure');
  if (btnMeasure) {
    btnMeasure.addEventListener('click', () => {
      if (window.mapEnhancements) window.mapEnhancements.measurement();
      btnMeasure.classList.toggle('active');
    });
  }

  // Export button
  const btnExportMap = document.getElementById('btnExportMap');
  if (btnExportMap) {
    btnExportMap.addEventListener('click', () => {
      if (window.mapEnhancements) window.mapEnhancements.export();
    });
  }

  // Menu button
  document.getElementById('menuBtn').addEventListener('click', () => {
    openSidebar();
  });

  document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // Keyboard support: Escape to close sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    }
  });

  function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.add('open');
    overlay.classList.remove('hidden');
    // Add ripple effect to menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
      menuBtn.style.transform = 'scale(0.95)';
      setTimeout(() => { menuBtn.style.transform = ''; }, 100);
    }
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = 'hidden';
    // Sync active nav item with current section
    document.querySelectorAll('.nav-item').forEach(i => {
      i.classList.toggle('active', i.dataset.section === state.currentSection);
    });
    // Start sidebar clock
    startSidebarClock();
    // Populate sidebar weather
    updateSidebarWeather();
  }

  function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.add('hidden');
    stopSidebarClock();
    // Restore body scroll
    document.body.style.overflow = '';
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.transform = 'translateY(0)';
  }

  // ── Sidebar clock ──────────────────────────────────────
  let _sidebarClockInterval = null;
  function startSidebarClock() {
    updateSidebarClock();
    _sidebarClockInterval = setInterval(updateSidebarClock, 1000);
  }
  function stopSidebarClock() {
    clearInterval(_sidebarClockInterval);
  }
  function updateSidebarClock() {
    const now = new Date();
    const timeEl = document.getElementById('sidebarTime');
    const dateEl = document.getElementById('sidebarDate');
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  }

  // ── Sidebar weather ────────────────────────────────────
  function updateSidebarWeather() {
    const el = document.getElementById('sidebarWeather');
    if (!el) return;
    // Try to reuse existing weather data from weather widget
    const tempEl = document.getElementById('weatherTemp') || document.querySelector('[data-weather-temp]');
    const iconEl = document.getElementById('weatherIcon') || document.querySelector('[data-weather-icon]');
    if (tempEl) {
      const icon = iconEl ? iconEl.textContent.trim() : '🌡️';
      const temp = tempEl.textContent.trim();
      el.textContent = `${icon} ${temp}`;
    } else {
      // Light fetch
      fetch('https://api.open-meteo.com/v1/forecast?latitude=53.43&longitude=14.55&current=temperature_2m,weather_code&timezone=Europe/Warsaw')
        .then(r => r.json())
        .then(d => {
          if (d.current) {
            const t = Math.round(d.current.temperature_2m);
            const wmo = d.current.weather_code;
            const icon = wmo <= 3 ? '☀️' : wmo <= 48 ? '🌤️' : wmo <= 67 ? '🌧️' : wmo <= 77 ? '❄️' : '⛈️';
            el.textContent = `${icon} ${t}°C`;
          }
        })
        .catch(() => { el.textContent = '🌡️ --°C'; });
    }
  }

  // ── Swipe to close sidebar ─────────────────────────────
  (function setupSidebarSwipe() {
    const sidebar = document.getElementById('sidebar');
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;

    sidebar.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = false;
    }, { passive: true });

    sidebar.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      // Only treat as horizontal swipe
      if (dx < -10 && dy < 60) {
        isDragging = true;
        const clamp = Math.max(-280, Math.min(0, dx));
        sidebar.style.transform = `translateX(${clamp}px)`;
        // Fade overlay with drag
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.style.opacity = String(1 - Math.abs(clamp) / 280);
      }
    }, { passive: true });

    sidebar.addEventListener('touchend', e => {
      sidebar.style.transform = '';
      const overlay = document.getElementById('sidebarOverlay');
      if (overlay) overlay.style.opacity = '';
      if (!isDragging) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx < -60) closeSidebar();
      isDragging = false;
    }, { passive: true });
  })();

  // ── Settings panel (replaces footer tools) ─────────────
  const settingsBtn = document.getElementById('sidebarSettingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      closeSidebar();
      showSettingsPanel();
    });
  }

  function showSettingsPanel() {
    if (document.getElementById('settingsPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'settingsPanel';
    panel.className = 'settings-panel-overlay';
    panel.innerHTML = `
      <div class="settings-panel" role="dialog" aria-modal="true" aria-label="Ustawienia">
        <div class="settings-header">
          <h3>Ustawienia</h3>
          <button class="settings-close" aria-label="Zamknij">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="settings-body">
          <div class="settings-section-title">Dane</div>
          <button class="settings-item" onclick="SyncManager.downloadBackup()">
            <span class="settings-item-icon">💾</span>
            <div>
              <div class="settings-item-name">Pobierz backup</div>
              <div class="settings-item-desc">Zapisz ulubione i ustawienia</div>
            </div>
          </button>
          <button class="settings-item" onclick="SyncManager.uploadBackup()">
            <span class="settings-item-icon">📂</span>
            <div>
              <div class="settings-item-name">Przywróć backup</div>
              <div class="settings-item-desc">Wczytaj z pliku</div>
            </div>
          </button>
          <button class="settings-item" onclick="SyncManager.shareViaUrl()">
            <span class="settings-item-icon">🔗</span>
            <div>
              <div class="settings-item-name">Udostępnij ulubione</div>
              <div class="settings-item-desc">Sync przez URL</div>
            </div>
          </button>
          <div class="settings-section-title" style="margin-top:16px">Wygląd</div>
          <button class="settings-item" id="settingsThemeToggle">
            <span class="settings-item-icon">🌙</span>
            <div>
              <div class="settings-item-name">Tryb ciemny / jasny</div>
              <div class="settings-item-desc">Aktualny: ${document.documentElement.getAttribute('data-theme') === 'light' ? 'Jasny' : 'Ciemny'}</div>
            </div>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.querySelector('.settings-panel').classList.add('open'));

    const close = () => {
      panel.querySelector('.settings-panel').classList.remove('open');
      setTimeout(() => panel.remove(), 300);
    };
    panel.querySelector('.settings-close').addEventListener('click', close);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    panel.querySelector('#settingsThemeToggle').addEventListener('click', () => {
      document.getElementById('themeBtn').click();
      close();
    });
  }

  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      // Add ripple effect
      addRipple(item, e);
      setTimeout(() => {
        navigateTo(item.dataset.section);
        closeSidebar();
      }, 150);
    });
  });

  // Ripple effect helper
  function addRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event.clientX || event.touches?.[0]?.clientX || 0) - rect.left - size / 2;
    const y = (event.clientY || event.touches?.[0]?.clientY || 0) - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(108, 99, 255, 0.3);
      border-radius: 50%;
      top: ${y}px;
      left: ${x}px;
      pointer-events: none;
      animation: rippleEffect 0.6s ease-out;
      z-index: 1;
    `;
    element.style.position = 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Bottom nav
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.section) navigateTo(btn.dataset.section);
    });
  });

  // "Więcej" button — opens sidebar with all sections
  const bnavMore = document.getElementById('bnavMore');
  if (bnavMore) {
    bnavMore.addEventListener('click', () => {
      openSidebar();
    });
  }

  // Search
  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('searchBar').classList.remove('hidden');
    document.getElementById('searchInput').focus();
  });
  document.getElementById('searchClose').addEventListener('click', () => {
    document.getElementById('searchBar').classList.add('hidden');
    document.getElementById('searchInput').value = '';
    renderPlaces();
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase();
    renderPlaces(state.searchQuery);
  });
  // Enter → fly map to matching results
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = state.searchQuery.trim();
      if (!q) return;
      const matches = APP_DATA.places.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.addr && p.addr.toLowerCase().includes(q)) ||
        p.cat.toLowerCase().includes(q)
      );
      if (matches.length && state.map) {
        navigateTo('map');
        document.getElementById('searchBar').classList.add('hidden');
        if (matches.length === 1) {
          const m = matches[0];
          state.map.flyTo([m.coords[1], m.coords[0]], 17, { animate: true, duration: 1.2 });
          setTimeout(() => {
            const marker = state.markers.find(mk => mk.placeData.id === m.id);
            if (marker) marker.openPopup();
          }, 1300);
        } else {
          const bounds = L.latLngBounds(matches.map(m => [m.coords[1], m.coords[0]]));
          state.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
        }
        showToast(`🔍 Znaleziono ${matches.length} ${matches.length === 1 ? 'miejsce' : 'miejsc'}`);
      } else {
        showToast('❌ Brak wyników na mapie');
      }
    }
  });

  // Theme toggle
  document.getElementById('themeBtn').addEventListener('click', () => {
    state.isDark = !state.isDark;
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    localStorage.setItem('lucznicza_theme', state.isDark ? 'dark' : 'light');
    showToast(state.isDark ? '🌙 Tryb ciemny' : '☀️ Tryb jasny');

    // Zsynchronizuj styl mapy z motywem (tylko gdy używamy podstawowych stylów,
    // nie zmieniaj jeśli użytkownik wybrał satelitę).
    if (state.map && state.baseLayers && state.currentBaseLayer !== 'satellite') {
      const targetStyle = state.isDark ? 'dark' : 'voyager';
      if (window.mapPro && window.mapPro.setStyle) {
        window.mapPro.setStyle(targetStyle);
      }
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    
    // Number keys 1-7 for section navigation
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const sections = ['map', 'places', 'routes', 'info', 'transport', 'events', 'live'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        navigateTo(sections[num - 1]);
        return;
      }
      // 't' for theme toggle
      if (e.key === 't' || e.key === 'T') {
        state.isDark = !state.isDark;
        document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
        showToast(state.isDark ? '🌙 Tryb ciemny' : '☀️ Tryb jasny');
      }
    }
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  initPlacesToolbar();
}

// ===== PLACES TOOLBAR (sort + favorites + distance) =====
function initPlacesToolbar() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sortBy = sortSelect.value;
      if (state.sortBy === 'distance') {
        requestUserLocation(() => renderPlaces(state.searchQuery));
      } else {
        renderPlaces(state.searchQuery);
      }
    });
  }

  const favToggleBtn = document.getElementById('favToggleBtn');
  if (favToggleBtn) {
    favToggleBtn.addEventListener('click', () => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
      favToggleBtn.classList.toggle('active', state.showFavoritesOnly);
      favToggleBtn.innerHTML = state.showFavoritesOnly ? '❤️ Ulubione' : '🤍 Ulubione';
      renderPlaces(state.searchQuery);
    });
  }

  const openNowBtn = document.getElementById('openNowBtn');
  if (openNowBtn) {
    openNowBtn.addEventListener('click', () => {
      state.showOpenOnly = !state.showOpenOnly;
      openNowBtn.classList.toggle('active', state.showOpenOnly);
      renderPlaces(state.searchQuery);
      showToast(state.showOpenOnly ? '🕐 Pokazuję tylko otwarte miejsca' : '🕐 Pokazuję wszystkie miejsca');
    });
  }

  const distSortBtn = document.getElementById('distSortBtn');
  if (distSortBtn) {
    distSortBtn.addEventListener('click', () => {
      requestUserLocation(() => {
        state.sortBy = 'distance';
        if (sortSelect) sortSelect.value = 'distance';
        distSortBtn.classList.add('active');
        renderPlaces(state.searchQuery);
        showToast('📍 Posortowano wg odległości od Ciebie');
      });
    });
  }
}

// ===== GEOLOCATION HELPER =====
function requestUserLocation(callback) {
  const PE = window.placesEnhanced;
  if (!navigator.geolocation || !PE) {
    showToast('❌ Geolokalizacja niedostępna');
    if (callback) callback();
    return;
  }
  showToast('🔄 Pobieranie lokalizacji...');
  navigator.geolocation.getCurrentPosition(
    pos => {
      PE.setUserLocation(pos.coords.latitude, pos.coords.longitude);
      showUserOnMap(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      if (callback) callback();
    },
    () => {
      // Fallback: use district center
      PE.setUserLocation(53.4530, 14.5520);
      showToast('📍 Używam centrum dzielnicy jako punktu odniesienia');
      if (callback) callback();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }  // 10s timeout — nie wisi w nieskończoność
  );
}

// Show "You are here" marker on the map
function showUserOnMap(lat, lng, accuracy = 50) {
  if (!state.map || typeof L === 'undefined') return;

  // Remove previous marker/circle
  if (state.userMarker) state.map.removeLayer(state.userMarker);
  if (state.userCircle) state.map.removeLayer(state.userCircle);

  const userIcon = L.divIcon({
    html: '<div class="user-dot"><div class="user-dot-core"></div><div class="user-dot-pulse"></div></div>',
    iconSize: [24, 24], iconAnchor: [12, 12], className: 'user-location-icon'
  });

  state.userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(state.map);
  state.userMarker.bindPopup(`<b>📍 Twoja lokalizacja</b><br>Dokładność: ±${Math.round(accuracy)}m`);

  state.userCircle = L.circle([lat, lng], {
    radius: accuracy, color: '#4285f4', weight: 1,
    fillColor: '#4285f4', fillOpacity: 0.12
  }).addTo(state.map);
}

// ===== NEAREST PLACES — quick panel of closest POIs =====
function showNearestPlaces() {
  const PE = window.placesEnhanced;
  if (!PE) return;

  const render = () => {
    const withDist = APP_DATA.places
      .map(p => ({ p, dist: PE.distanceToPlace(p) }))
      .filter(x => x.dist != null)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6);

    let panel = document.getElementById('nearestPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'nearestPanel';
      panel.className = 'nearest-panel';
      document.getElementById('map')?.appendChild(panel);
    }

    panel.innerHTML = `
      <div class="np2-header">
        <span>📍 Najbliżej Ciebie</span>
        <button class="np2-close" onclick="document.getElementById('nearestPanel').remove()">✕</button>
      </div>
      <div class="np2-list">
        ${withDist.map(({ p, dist }) => `
          <button class="np2-item" onclick="flyToPlace(${p.id});document.getElementById('nearestPanel')?.remove()">
            <span class="np2-emoji">${p.emoji}</span>
            <span class="np2-info">
              <span class="np2-name">${p.name}</span>
              <span class="np2-cat">${p.cat}</span>
            </span>
            <span class="np2-dist">${PE.formatDistance(dist)}</span>
          </button>
        `).join('')}
      </div>
    `;
  };

  // Need user location first
  const hasLoc = PE.distanceToPlace(APP_DATA.places[0]) != null;
  if (hasLoc) {
    render();
  } else {
    requestUserLocation(() => render());
  }
}
window.showNearestPlaces = showNearestPlaces;

// ===== NAVIGATION =====
function navigateTo(section) {
  state.currentSection = section;

  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const target = document.getElementById(`section-${section}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
    // Smooth scroll to top of section
    target.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.section === section);
  });
  document.querySelectorAll('.bnav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === section);
  });

  // Sections not in the bottom nav (transport, community, info) → highlight "Więcej"
  const bnavSections = ['map', 'places', 'routes', 'live'];
  const bnavMore = document.getElementById('bnavMore');
  if (bnavMore) {
    bnavMore.classList.toggle('active', !bnavSections.includes(section));
  }

  // If map section, invalidate size so Leaflet redraws tiles
  if (section === 'map' && state.map) {
    setTimeout(() => state.map.invalidateSize(), 100);
  }

  // Hide search bar when leaving places/map (keeps UI clean)
  if (section !== 'places' && section !== 'map') {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.classList.add('hidden');
  }

  // Update URL hash for deep linking (without triggering hashchange)
  if (history.replaceState) {
    history.replaceState(null, '', `#${section}`);
  }
}

// ===== RENDER PLACES (ENHANCED) =====
function renderPlaces(query = '') {
  const grid = document.getElementById('placesGrid');
  if (!grid) return;
  const PE = window.placesEnhanced;
  let places = [...APP_DATA.places];

  // Filter by category
  if (state.currentFilter !== 'all') {
    places = places.filter(p => p.cat === state.currentFilter);
  }
  // Filter favorites
  if (state.showFavoritesOnly && PE) {
    places = places.filter(p => PE.isFavorite(p.id));
  }
  // Filter open now
  if (state.showOpenOnly && PE) {
    places = places.filter(p => {
      const status = PE.getOpenStatus(p);
      return status && status.open;
    });
  }
  // Search
  if (query) {
    places = places.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.cat.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Sorting
  if (state.sortBy === 'rating') {
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (state.sortBy === 'name') {
    places.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  } else if (state.sortBy === 'distance' && PE) {
    places.sort((a, b) => {
      const da = PE.distanceToPlace(a), db = PE.distanceToPlace(b);
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  } else {
    // default: featured first, then popular, then rating
    places.sort((a, b) => {
      if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if ((b.popular ? 1 : 0) !== (a.popular ? 1 : 0)) return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  // Update toolbar button states
  const favBtn = document.getElementById('favToggleBtn');
  const openBtn = document.getElementById('openNowBtn');
  if (favBtn) favBtn.classList.toggle('active', state.showFavoritesOnly);
  if (openBtn) openBtn.classList.toggle('active', state.showOpenOnly);

  // Lazy render — show first 12 immediately, load rest on scroll
  const INITIAL_BATCH = 12;
  const firstBatch = places.slice(0, INITIAL_BATCH);
  const remaining = places.slice(INITIAL_BATCH);

  grid.innerHTML = firstBatch.map(p => renderPlaceCard(p)).join('');

  // Lazy load remaining cards when user scrolls near bottom
  if (remaining.length > 0) {
    const sentinel = document.createElement('div');
    sentinel.className = 'lazy-sentinel';
    sentinel.id = 'placesLazySentinel';
    grid.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        sentinel.remove();
        // Render remaining in chunks for smooth scrolling
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = remaining.map(p => renderPlaceCard(p)).join('');
        while (tempDiv.firstChild) {
          grid.appendChild(tempDiv.firstChild);
        }
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
  }

  // Update count
  const countEl = document.getElementById('placesCount');
  if (countEl) {
    countEl.textContent = `${places.length} ${places.length === 1 ? 'miejsce' : (places.length < 5 ? 'miejsca' : 'miejsc')}`;
  }

  if (places.length === 0) {
    let msg;
    if (state.showOpenOnly) {
      msg = 'Brak otwartych miejsc w tej chwili. Spróbuj wyłączyć filtr „Otwarte".';
    } else if (state.showFavoritesOnly) {
      msg = 'Nie masz jeszcze ulubionych miejsc. Kliknij ❤️ na karcie miejsca.';
    } else {
      msg = `Brak wyników dla "${query}"`;
    }
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text2)">
      <div style="font-size:48px;margin-bottom:12px">🔍</div>
      <p>${msg}</p>
    </div>`;
  }

  // Filter tabs
  document.querySelectorAll('#placesFilter .filter-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('#placesFilter .filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderPlaces(state.searchQuery);

      // Sync map markers + map category buttons
      state.currentCat = tab.dataset.filter;
      document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === tab.dataset.filter);
      });
      if (state.map) {
        // Update markers without re-triggering syncPlacesFilterUI loop
        const cat = tab.dataset.filter;
        const clusterGroup = (window.mapEnhancements && window.mapEnhancements.getClusterGroup)
          ? window.mapEnhancements.getClusterGroup() : null;
        state.markers.forEach(marker => {
          const place = marker.placeData;
          if (!place) return;
          const show = (cat === 'all' || place.cat === cat);
          if (clusterGroup) {
            if (show) { if (!clusterGroup.hasLayer(marker)) clusterGroup.addLayer(marker); }
            else { if (clusterGroup.hasLayer(marker)) clusterGroup.removeLayer(marker); }
          } else {
            if (show) { if (!state.map.hasLayer(marker)) marker.addTo(state.map); }
            else { if (state.map.hasLayer(marker)) state.map.removeLayer(marker); }
          }
        });
        if (clusterGroup && clusterGroup.refreshClusters) clusterGroup.refreshClusters();
      }
    };
  });
}

// ===== RENDER SINGLE PLACE CARD =====
function renderPlaceCard(p) {
  const PE = window.placesEnhanced;
  const status = PE ? PE.getOpenStatus(p) : null;
  const fav = PE ? PE.isFavorite(p.id) : false;
  const dist = PE ? PE.distanceToPlace(p) : null;
  const stars = PE ? PE.renderStars(p.rating || 0) : '';
  const price = PE ? PE.renderPriceLevel(p.price) : '';

  const tagsHtml = (p.tags || []).slice(0, 3).map(t =>
    `<span class="card-tag">#${t}</span>`).join('');

  return `
    <div class="place-card ${p.featured ? 'is-featured' : ''}" onclick="openPlaceModal(${p.id})">
      ${p.featured ? '<span class="featured-ribbon">⭐ POLECANE</span>' : ''}
      <button class="fav-btn ${fav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFav(${p.id}, this)" title="Dodaj do ulubionych">
        ${fav ? '❤️' : '🤍'}
      </button>
      <div class="place-card-header" style="background:${p.gradient || CAT_BG[p.cat]}">
        ${p.image ? `<img src="${p.image}" class="place-card-img" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <span style="font-size:52px;position:relative;z-index:1">${p.emoji}</span>
        <span class="place-card-badge badge-${p.cat}">${p.cat}</span>
        ${status ? `<span class="status-badge ${status.open ? 'is-open' : 'is-closed'}">${status.open ? '🟢' : '🔴'} ${status.label}</span>` : ''}
      </div>
      <div class="place-card-body">
        <div class="place-card-name">${p.name}</div>
        <div class="card-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">${p.rating || '–'}</span>
          ${p.reviewCount ? `<span class="review-count">(${p.reviewCount})</span>` : ''}
          ${price ? `<span class="card-price">${price}</span>` : ''}
        </div>
        <div class="place-card-addr">📍 ${p.addr}${dist != null ? ` · <strong>${PE.formatDistance(dist)}</strong>` : ''}</div>
        <div class="place-card-desc">${p.desc.substring(0, 80)}...</div>
        <div class="card-tags">${tagsHtml}</div>
      </div>
      <div class="place-card-footer">
        <span class="place-card-hours ${status && !status.open ? 'closed' : ''}">⏰ ${status ? status.sub : p.hours}</span>
        <button class="place-card-btn" onclick="event.stopPropagation(); flyToPlace(${p.id})">
          🗺️ Na mapie
        </button>
      </div>
    </div>
  `;
}

// ===== TOGGLE FAVORITE =====
function toggleFav(id, btn) {
  const PE = window.placesEnhanced;
  if (!PE) return;
  const isFav = PE.toggleFavorite(id);
  btn.textContent = isFav ? '❤️' : '🤍';
  btn.classList.toggle('active', isFav);
  showToast(isFav ? '❤️ Dodano do ulubionych' : '🤍 Usunięto z ulubionych');
  if (state.showFavoritesOnly) renderPlaces(state.searchQuery);
}

// ===== FLY TO PLACE (Leaflet) =====
function flyToPlace(id) {
  const place = APP_DATA.places.find(p => p.id === id);
  if (!place || !state.map) return;
  navigateTo('map');
  setTimeout(() => {
    state.map.setView([place.coords[1], place.coords[0]], 17, { animate: true, duration: 1.5 });
    // Open popup for matching marker
    state.markers.forEach(marker => {
      if (marker.placeData && marker.placeData.id === id) {
        setTimeout(() => marker.openPopup(), 800);
      }
    });
  }, 200);
}

function updateStatTotal() {
  const el = document.getElementById('statTotal');
  if (el) el.textContent = APP_DATA.places.length;
  const elR = document.getElementById('statRoutes');
  if (elR) elR.textContent = APP_DATA.routes.length;
}

// ===== RENDER ROUTES (ENHANCED) =====
const ROUTE_FAVS_KEY = 'lucznicza_route_favs';
const routeState = { filter: 'all', activeTimer: null, timerRouteId: null, timerStart: null };

function getRouteFavs() {
  try { return JSON.parse(localStorage.getItem(ROUTE_FAVS_KEY) || '[]'); } catch { return []; }
}
function toggleRouteFav(id) {
  let favs = getRouteFavs();
  favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem(ROUTE_FAVS_KEY, JSON.stringify(favs));
  return favs.includes(id);
}

function renderRoutes() {
  const container = document.getElementById('section-routes');
  if (!container) return;

  // Build the full section HTML
  container.querySelector('.section-content').innerHTML = `
    <div class="section-hero">
      <h2>🚶 Trasy spacerowe</h2>
      <p>Odkryj dzielnicę pieszo, rowerem lub biegiem</p>
    </div>

    <!-- Stats bar -->
    <div class="routes-stats-bar">
      <div class="rst-item"><span class="rst-num">${APP_DATA.routes.length}</span><span class="rst-label">Tras</span></div>
      <div class="rst-item"><span class="rst-num">${APP_DATA.routes.filter(r=>r.type==='walk').length}</span><span class="rst-label">Spacerowych</span></div>
      <div class="rst-item"><span class="rst-num">${APP_DATA.routes.filter(r=>r.type==='bike').length}</span><span class="rst-label">Rowerowych</span></div>
      <div class="rst-item"><span class="rst-num">${APP_DATA.routes.filter(r=>r.type==='run').length}</span><span class="rst-label">Biegowych</span></div>
      <div class="rst-item"><span class="rst-num" id="totalParticipants">0</span><span class="rst-label">Uczestników</span></div>
    </div>

    <!-- Filter tabs -->
    <div class="routes-filter-tabs" id="routesFilterTabs">
      <button class="rft-btn active" data-type="all">🗺️ Wszystkie</button>
      <button class="rft-btn" data-type="walk">🚶 Spacer</button>
      <button class="rft-btn" data-type="bike">🚴 Rower</button>
      <button class="rft-btn" data-type="run">🏃 Bieg</button>
      <button class="rft-btn" data-type="fav">❤️ Ulubione</button>
    </div>

    <!-- Routes list -->
    <div class="routes-list" id="routesList"></div>
  `;

  // Wire filter tabs
  container.querySelectorAll('.rft-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.rft-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      routeState.filter = btn.dataset.type;
      renderRouteCards();
    });
  });

  renderRouteCards();
  // Update total participants count
  setTimeout(() => {
    if (window.routesMeetup) {
      const total = APP_DATA.routes.reduce((sum, r) => sum + window.routesMeetup.getJoined(r.id).length, 0);
      const el = document.getElementById('totalParticipants');
      if (el) el.textContent = total;
    }
  }, 100);
}

function renderRouteCards() {
  const list = document.getElementById('routesList');
  if (!list) return;
  const favs = getRouteFavs();
  let routes = APP_DATA.routes;

  if (routeState.filter === 'fav') {
    routes = routes.filter(r => favs.includes(r.id));
  } else if (routeState.filter !== 'all') {
    routes = routes.filter(r => r.type === routeState.filter);
  }

  if (!routes.length) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2)">
      <div style="font-size:48px;margin-bottom:12px">🗺️</div>
      <p>Brak tras w tej kategorii</p>
    </div>`;
    return;
  }

  list.innerHTML = routes.map(r => renderRouteCard(r, favs.includes(r.id))).join('');
}

function renderRouteCard(r, isFav) {
  const typeIcon = { walk: '🚶', bike: '🚴', run: '🏃' }[r.type] || '🗺️';
  const typeLabel = { walk: 'Spacer', bike: 'Rower', run: 'Bieg' }[r.type] || '';
  const diffColor = r.difficultyLevel === 1 ? '#43e97b' : r.difficultyLevel === 2 ? '#ffd93d' : '#ff6584';
  const diffDots = '●'.repeat(r.difficultyLevel) + '○'.repeat(3 - r.difficultyLevel);
  const tagsHtml = (r.tags || []).map(t => `<span class="route-tag-pill">#${t}</span>`).join('');
  const highlightsHtml = (r.highlights || []).map(h => `<li>${h}</li>`).join('');
  const stopsHtml = (r.stops || []).map((s, i) => `
    <div class="route-stop-item ${i === 0 ? 'start' : i === (r.stops.length-1) ? 'end' : ''}">
      <div class="rsi-dot" style="background:${r.color}">
        ${i === 0 ? '▶' : i === (r.stops.length-1) ? '🏁' : (i+1)}
      </div>
      <div class="rsi-info">
        <span class="rsi-emoji">${s.emoji}</span>
        <div>
          <div class="rsi-name">${s.name}</div>
          <div class="rsi-addr">${s.addr}</div>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="route-card-v2" id="rcard-${r.id}">
      <!-- Hero -->
      <div class="rc2-hero" style="background:linear-gradient(135deg,${r.color}dd,${r.color}88)">
        <div class="rc2-hero-left">
          <span class="rc2-emoji">${r.emoji}</span>
          <div>
            <div class="rc2-type-badge">${typeIcon} ${typeLabel}</div>
            <div class="rc2-name">${r.name}</div>
          </div>
        </div>
        <button class="rc2-fav ${isFav ? 'active' : ''}" onclick="toggleRouteCardFav(${r.id}, this)">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <!-- Quick stats -->
      <div class="rc2-stats">
        <div class="rc2-stat">
          <span class="rc2-stat-icon">📏</span>
          <span class="rc2-stat-val">${r.distance}</span>
          <span class="rc2-stat-lbl">Dystans</span>
        </div>
        <div class="rc2-stat">
          <span class="rc2-stat-icon">⏱️</span>
          <span class="rc2-stat-val">${r.time}</span>
          <span class="rc2-stat-lbl">Czas</span>
        </div>
        <div class="rc2-stat">
          <span class="rc2-stat-icon">🔥</span>
          <span class="rc2-stat-val">${r.calories}</span>
          <span class="rc2-stat-lbl">kcal</span>
        </div>
        <div class="rc2-stat">
          <span class="rc2-stat-icon" style="color:${diffColor}">${diffDots}</span>
          <span class="rc2-stat-val" style="color:${diffColor}">${r.difficulty}</span>
          <span class="rc2-stat-lbl">Poziom</span>
        </div>
      </div>

      <!-- Difficulty bar -->
      <div class="rc2-diff-bar">
        <div class="rc2-diff-fill" style="width:${r.difficultyLevel * 33.3}%;background:${diffColor}"></div>
      </div>

      <!-- Tags -->
      <div class="rc2-tags">${tagsHtml}</div>

      <!-- Description (collapsed by default) -->
      <div class="rc2-body" id="rbody-${r.id}" style="display:none">
        <p class="rc2-desc">${r.desc}</p>

        ${r.highlights ? `
          <div class="rc2-section-title">✨ Atrakcje na trasie</div>
          <ul class="rc2-highlights">${highlightsHtml}</ul>
        ` : ''}

        <div class="rc2-section-title">📍 Punkty trasy</div>
        <div class="rc2-stops">${stopsHtml}</div>

        <div class="rc2-meta-row">
          <span>🌍 ${r.terrain}</span>
          <span>🕐 Najlepiej: ${r.bestTime}</span>
        </div>

        <!-- Calorie calculator -->
        <div class="rc2-calc">
          <div class="rc2-calc-title">🔥 Kalkulator kalorii</div>
          <div class="rc2-calc-row">
            <label>Waga (kg):</label>
            <input type="number" class="rc2-weight-input" id="weight-${r.id}" value="70" min="30" max="200" />
            <button class="rc2-calc-btn" onclick="calcRouteCalories(${r.id}, ${r.distanceNum})">Oblicz</button>
          </div>
          <div class="rc2-calc-result" id="calc-result-${r.id}"></div>
        </div>

        <!-- Action buttons -->
        <div class="rc2-actions">
          <button class="rc2-btn primary" onclick="showRouteOnMap(${r.id})">
            🗺️ Pokaż na mapie
          </button>
          <button class="rc2-btn timer ${routeState.timerRouteId === r.id ? 'active' : ''}" id="timer-btn-${r.id}" onclick="toggleRouteTimer(${r.id})">
            ${routeState.timerRouteId === r.id ? '⏹ Stop' : '▶ Start trasy'}
          </button>
          <button class="rc2-btn share" onclick="shareRoute(${r.id})">
            🔗 Udostępnij
          </button>
        </div>

        <!-- Timer display -->
        <div class="rc2-timer hidden" id="timer-display-${r.id}">
          <span class="timer-icon">⏱️</span>
          <span class="timer-time" id="timer-time-${r.id}">00:00</span>
          <span class="timer-label">czas trasy</span>
        </div>

        <!-- ===== MEETUP SECTION ===== -->
        ${window.routesMeetup ? window.routesMeetup.renderMeetupSection(r.id, r.color) : ''}

      </div>

      <!-- Toggle button -->
      <button class="rc2-toggle" onclick="toggleRouteCard(${r.id})" id="rtoggle-${r.id}">
        <span>Szczegóły trasy</span>
        <span class="rc2-arrow" id="rarrow-${r.id}">›</span>
      </button>
    </div>
  `;
}

function toggleRouteCard(id) {
  const body = document.getElementById(`rbody-${id}`);
  const arrow = document.getElementById(`rarrow-${id}`);
  const toggle = document.getElementById(`rtoggle-${id}`);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '›' : '⌄';
  if (toggle) toggle.querySelector('span').textContent = isOpen ? 'Szczegóły trasy' : 'Zwiń';
}

function toggleRouteCardFav(id, btn) {
  const isFav = toggleRouteFav(id);
  btn.textContent = isFav ? '❤️' : '🤍';
  btn.classList.toggle('active', isFav);
  showToast(isFav ? '❤️ Trasa dodana do ulubionych' : '🤍 Usunięto z ulubionych');
  if (routeState.filter === 'fav') renderRouteCards();
}

function calcRouteCalories(routeId, distanceKm) {
  const input = document.getElementById(`weight-${routeId}`);
  const result = document.getElementById(`calc-result-${routeId}`);
  if (!input || !result) return;
  const weight = parseFloat(input.value) || 70;
  const route = APP_DATA.routes.find(r => r.id === routeId);
  const MET = { walk: 3.5, bike: 6.0, run: 9.0 }[route?.type] || 3.5;
  const timeH = (route?.timeMin || 20) / 60;
  const kcal = Math.round(MET * weight * timeH);
  result.innerHTML = `<span class="calc-kcal">🔥 ${kcal} kcal</span> <span class="calc-note">dla ${weight}kg · ${route?.time}</span>`;
}

// ===== ROUTE TIMER =====
function toggleRouteTimer(routeId) {
  const btn = document.getElementById(`timer-btn-${routeId}`);
  const display = document.getElementById(`timer-display-${routeId}`);
  const timeEl = document.getElementById(`timer-time-${routeId}`);

  if (routeState.timerRouteId === routeId) {
    // Stop timer
    clearInterval(routeState.activeTimer);
    routeState.activeTimer = null;
    routeState.timerRouteId = null;
    if (btn) { btn.textContent = '▶ Start trasy'; btn.classList.remove('active'); }
    if (display) display.classList.add('hidden');
    const elapsed = Math.round((Date.now() - routeState.timerStart) / 1000);
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    showToast(`✅ Trasa ukończona! Czas: ${m}:${String(s).padStart(2,'0')}`);
  } else {
    // Stop any existing timer
    if (routeState.activeTimer) {
      clearInterval(routeState.activeTimer);
      const oldBtn = document.getElementById(`timer-btn-${routeState.timerRouteId}`);
      const oldDisp = document.getElementById(`timer-display-${routeState.timerRouteId}`);
      if (oldBtn) { oldBtn.textContent = '▶ Start trasy'; oldBtn.classList.remove('active'); }
      if (oldDisp) oldDisp.classList.add('hidden');
    }
    // Start new timer
    routeState.timerRouteId = routeId;
    routeState.timerStart = Date.now();
    if (btn) { btn.textContent = '⏹ Stop'; btn.classList.add('active'); }
    if (display) display.classList.remove('hidden');
    routeState.activeTimer = setInterval(() => {
      const elapsed = Math.round((Date.now() - routeState.timerStart) / 1000);
      const m = Math.floor(elapsed / 60), s = elapsed % 60;
      if (timeEl) timeEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
    showToast('▶ Timer trasy uruchomiony!');
    showRouteOnMap(routeId);
  }
}

function shareRoute(id) {
  const route = APP_DATA.routes.find(r => r.id === id);
  if (!route) return;
  const text = `${route.emoji} ${route.name} — ${route.distance}, ${route.time}. Sprawdź w przewodniku Łucznicza & Tarczowa!`;
  const url = window.location.href.split('#')[0] + '#trasa-' + id;
  if (navigator.share) {
    navigator.share({ title: route.name, text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('🔗 Link skopiowany!')).catch(() => showToast('🔗 ' + url));
  }
}

function showRouteOnMap(id) {
  const route = APP_DATA.routes.find(r => r.id === id);
  if (!route || !state.map) return;
  navigateTo('map');

  setTimeout(() => {
    // Dim all route polylines
    state.routePolylines.forEach(polyline => {
      polyline.setStyle({ weight: 3, opacity: 0.2, dashArray: '8, 4' });
    });

    // Fit bounds to route
    const latLngs = route.coords.map(c => [c[1], c[0]]);
    state.map.fitBounds(L.latLngBounds(latLngs), { padding: [60, 60], animate: true });

    // Animate route drawing
    if (window.mapImprovements?.animateRoute) {
      setTimeout(() => window.mapImprovements.animateRoute(id), 400);
    }

    showToast(`${route.emoji} ${route.name} · ${route.distance}`);
  }, 200);
}

// ===== RENDER INFO (ENHANCED) =====
function renderInfo() {
  const section = document.getElementById('section-info');
  if (!section) return;
  const content = section.querySelector('.section-content');
  if (!content) return;

  content.innerHTML = `

    <!-- Hero banner z informacjami o Szczecinie -->
    <div class="info-hero">
      <div class="info-hero-bg"></div>
      <div class="info-hero-content">
        <div class="info-hero-badge">🏹 Szczecin — Miasto nad Odrą</div>
        <h1 class="info-hero-title">Łucznicza & Tarczowa</h1>
        <p class="info-hero-sub">Dzielnica mieszkaniowa · Szczecin Zachód · Odkryj naszą okolicę</p>
        <div class="info-hero-stats">
          <div class="ihs-item"><span class="ihs-num" data-target="4250">0</span><span class="ihs-label">Mieszkańców</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="55">0</span><span class="ihs-label">Lat historii</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="30">0</span><span class="ihs-label">% Zieleni</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="2">0</span><span class="ihs-label">km² Powierzchni</span></div>
        </div>
      </div>
    </div>

    <!-- Szczecin — Miasto -->
    <div id="info-szczecin-section" class="info-szczecin-section">
      <div class="info-section-title">🏰 Szczecin — Miasto Zabytkowe</div>
      <div class="szczecin-info-grid">
        <div class="szczecin-info-card">
          <div class="sic-emoji">🏛️</div>
          <div class="sic-content">
            <h4>Historia i Zabytkowy Charakter</h4>
            <p>Szczecin to jedno z najstarszych miast Polski z ponad 800-letką historią. Miasto broniło się w II wojnie światowej i zostało niemal całkowicie zniszczone. Po wojnie odbudowano je jako jedno z pierwszych polskich miast, tworząc architekturę nowoczesną obok pozostałości zabytków.</p>
          </div>
        </div>

        <div class="szczecin-info-card">
          <div class="sic-emoji">👥</div>
          <div class="sic-content">
            <h4>Liczba Mieszkańców i Położenie</h4>
            <p><strong>Ponad 400 000 mieszkańców</strong> czyni Szczecin piątym co do wielkości miastem w Polsce. Leży nad Odrą, która od wieków stanowiła naturalne granice i was handlowy. Miasto jest ostatnią aglomeracją miejską na Polskim Uniwersytecie Zachodnim.</p>
          </div>
        </div>

        <div class="szczecin-info-card">
          <div class="sic-emoji">⛵</div>
          <div class="sic-content">
            <h4>Port i Transport Wodny</h4>
            <p>Szczecin jest istotnym portem w Polsce z dostępem do Morza Bałtyckiego. Rzeka Odra stanowi ważny szlak transportu wodnego, a spacery nad brzegiem są ulubioną aktywnością mieszkańców.</p>
          </div>
        </div>

        <div class="szczecin-info-card">
          <div class="sic-emoji">🎓</div>
          <div class="sic-content">
            <h4>Ośrodek Edukacji i Kultury</h4>
            <p>Szczecin jest ważnym ośrodkiem naukowym — znajduje się tu kilka uniwersytetów i instytutów badawczych. Miasto tętni kulturalnym życiem z teatrami, galeriami i regularnie organizowanymi festiwalami.</p>
          </div>
        </div>

        <div class="szczecin-info-card">
          <div class="sic-emoji">🌳</div>
          <div class="sic-content">
            <h4>Zieleń i Natura</h4>
            <p>Szczecin otoczony jest zielenią — parkami i lasami. Dzielnica Łucznicza-Tarczowa jest częścią tej zielonej strategii miasta. Miasto regularnie organizuje akcje ekologiczne i wspiera tereny zielone.</p>
          </div>
        </div>

        <div class="szczecin-info-card">
          <div class="sic-emoji">🚀</div>
          <div class="sic-content">
            <h4>Innowacje i Przyszłość</h4>
            <p>Szczecin dynamicznie się rozwija — inwestycje w infrastrukturę, zielone technologie i smart city. Miasta planuje być liderem zrównoważonego rozwoju w regionie.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick nav pills -->
    <div class="info-nav-pills">
      <button class="inp-btn active" onclick="scrollToInfoSection('info-cards-section', event)">📋 Informacje</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-timeline-section', event)">📅 Historia</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-facts-section', event)">💡 Ciekawostki</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-contact-section', event)">📞 Kontakt</button>
    </div>

    <!-- Info cards -->
    <div id="info-cards-section">
      <div class="info-section-title">📋 O Łuczniczej i Tarczowej</div>
      <div class="info-cards" id="infoCards">
        ${APP_DATA.info.map(item => renderInfoCard(item)).join('')}
      </div>
    </div>

    <!-- Timeline -->
    <div id="info-timeline-section">
      <div class="info-section-title">📅 Historia Łuczniczej i Tarczowej</div>
      <div class="info-timeline">
        ${APP_DATA.timeline.map((t, i) => `
          <div class="tl-item ${t.year === '2026' ? 'tl-current' : ''}" style="animation-delay:${i * 0.05}s">
            <div class="tl-year">${t.year}</div>
            <div class="tl-dot">${t.icon}</div>
            <div class="tl-content">
              <div class="tl-title">${t.title}</div>
              <div class="tl-desc">${t.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Fun facts -->
    <div id="info-facts-section">
      <div class="info-section-title">💡 Czy wiesz, że...</div>
      <div class="info-facts-grid">
        ${APP_DATA.funFacts.map((f, i) => `
          <div class="fact-card" style="animation-delay:${i * 0.08}s">
            <span class="fact-emoji">${f.emoji}</span>
            <p class="fact-text">${f.text}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Contact / Council -->
    <div id="info-contact-section">
      <div class="info-section-title">📞 Kontakt i Zasoby</div>
      <div class="info-contact-grid">
        <div class="contact-card">
          <div class="cc-icon">🏛️</div>
          <div class="cc-body">
            <div class="cc-title">Rada Osiedla Łucznicza-Tarczowa</div>
            <div class="cc-detail">📧 rada.lucznicza@szczecin.pl</div>
            <div class="cc-detail">📞 +48 91 424 50 00</div>
            <div class="cc-detail">🕐 Dyżury: wt. i czw. 17:00–19:00</div>
          </div>
        </div>
        <div class="contact-card">
          <div class="cc-icon">🏙️</div>
          <div class="cc-body">
            <div class="cc-title">Urząd Miasta Szczecin</div>
            <div class="cc-detail">🌐 szczecin.eu</div>
            <div class="cc-detail">📞 +48 91 424 50 00</div>
            <div class="cc-detail">📍 pl. Armii Krajowej 1</div>
          </div>
        </div>
        <div class="contact-card">
          <div class="cc-icon">🚨</div>
          <div class="cc-body">
            <div class="cc-title">Numery alarmowe</div>
            <div class="cc-detail">🚒 Straż pożarna: <strong>998</strong></div>
            <div class="cc-detail">🚑 Pogotowie: <strong>999</strong></div>
            <div class="cc-detail">👮 Policja: <strong>997</strong> · Ogólny: <strong>112</strong></div>
          </div>
        </div>
        <div class="contact-card">
          <div class="cc-icon">🌐</div>
          <div class="cc-body">
            <div class="cc-title">Przydatne linki</div>
            <a class="cc-link" href="https://www.szczecin.eu" target="_blank" rel="noopener">🏙️ szczecin.eu</a>
            <a class="cc-link" href="https://www.zditm.szczecin.pl" target="_blank" rel="noopener">🚌 ZDiTM Szczecin</a>
            <a class="cc-link" href="https://www.bike-s.pl" target="_blank" rel="noopener">🚲 Bike_S Szczecin</a>
          </div>
        </div>
      </div>
    </div>

  `;

  // Animate counters
  animateInfoCounters();
}

function renderInfoCard(item) {
  const factsHtml = (item.facts || []).map(f => `
    <li class="ic2-fact"><span class="ic2-check">✓</span>${f}</li>
  `).join('');

  const statsHtml = item.stats.map(s => `
    <div class="ic2-stat">
      <span class="ic2-stat-icon">${s.icon || ''}</span>
      <span class="ic2-stat-num">${s.num}</span>
      <span class="ic2-stat-label">${s.label}</span>
    </div>
  `).join('');

  return `
    <div class="info-card-v2" id="icard-${item.id}">
      <div class="ic2-header" style="background:linear-gradient(135deg,${item.color}33,${item.color}11);border-left:4px solid ${item.color}">
        <span class="ic2-icon">${item.icon}</span>
        <h3 class="ic2-title">${item.title}</h3>
        <button class="ic2-toggle" onclick="toggleInfoCard('${item.id}')" id="ictoggle-${item.id}">⌄</button>
      </div>
      <div class="ic2-body" id="icbody-${item.id}" style="display:block">
        <p class="ic2-text">${item.text}</p>
        ${factsHtml ? `<ul class="ic2-facts">${factsHtml}</ul>` : ''}
        <div class="ic2-stats">${statsHtml}</div>
      </div>
    </div>
  `;
}

function toggleInfoCard(id) {
  const body = document.getElementById(`icbody-${id}`);
  const btn = document.getElementById(`ictoggle-${id}`);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.textContent = isOpen ? '›' : '⌄';
}

function scrollToInfoSection(id, ev) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Update active pill
  document.querySelectorAll('.inp-btn').forEach(b => b.classList.remove('active'));
  const target = (ev && ev.target) || (typeof event !== 'undefined' && event.target);
  if (target) target.classList.add('active');
}

// Animate number counters in the hero
function animateInfoCounters() {
  const els = document.querySelectorAll('.ihs-num[data-target]');
  els.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString('pl');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ===== RENDER TRANSPORT =====
function renderTransport() {
  const container = document.getElementById('transportGrid');
  if (!container) return;

  // Live departures panel at the top (fed by live.js)
  let livePanel = document.getElementById('transportLivePanel');
  if (!livePanel) {
    const section = document.getElementById('section-transport');
    const hero = section?.querySelector('.section-hero');
    if (hero) {
      livePanel = document.createElement('div');
      livePanel.id = 'transportLivePanel';
      livePanel.className = 'transport-live-panel';
      livePanel.innerHTML = `
        <div class="tlp-header">
          <span class="tlp-icon">📡</span>
          <div>
            <div class="tlp-title">Odjazdy na żywo — Łucznicza</div>
            <div class="tlp-sub"><span class="live-dot"></span> ZDiTM Szczecin · aktualizacja co minutę</div>
          </div>
          <button class="tlp-refresh" id="transportLiveRefresh" title="Odśwież">🔄</button>
        </div>
        <div id="transportLiveList" class="tlp-list">
          <div class="live-skeleton"></div>
        </div>
      `;
      hero.after(livePanel);

      const refreshBtn = document.getElementById('transportLiveRefresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          if (typeof generateTransportDepartures === 'function') generateTransportDepartures();
        });
      }
    }
  }

  // Trigger a live departures fetch when viewing transport
  if (typeof generateTransportDepartures === 'function') {
    setTimeout(generateTransportDepartures, 100);
  }

  container.innerHTML = APP_DATA.transport.map(t => `
    <div class="transport-card">
      <div class="transport-header">
        <div class="transport-icon" style="background:${t.color}22">${t.icon}</div>
        <div>
          <div class="transport-title">${t.title}</div>
          <div class="transport-sub">${t.subtitle}</div>
        </div>
      </div>
      ${t.lines.length > 0 ? `
        <div class="lines-list">
          ${t.lines.map(l => `<span class="line-badge ${l.color}">${l.num}</span>`).join('')}
        </div>
      ` : ''}
      <div class="stop-info">
        ${t.stops.map(s => `
          <div class="stop-row">
            <span class="stop-name">🚏 ${s.name}</span>
            <span class="stop-dist">${s.dist}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ===== RENDER EVENTS =====
function renderEvents() {
  const container = document.getElementById('eventsList');
  if (!container) return;

  // Get unique months and tags for filtering
  const months = [...new Set(APP_DATA.events.map(e => e.month))];
  const tags = [...new Set(APP_DATA.events.map(e => e.tag))];

  // Build filter UI
  const section = document.getElementById('section-events');
  const hero = section.querySelector('.section-hero');
  
  // Add filter tabs if not already present
  if (!document.getElementById('eventsFilterTabs')) {
    const filterDiv = document.createElement('div');
    filterDiv.id = 'eventsFilterTabs';
    filterDiv.className = 'events-filter-tabs';
    filterDiv.innerHTML = `
      <button class="eft-btn active" data-filter="all">📅 Wszystkie</button>
      ${tags.map(t => `<button class="eft-btn" data-filter="${t}">${t}</button>`).join('')}
    `;
    hero.after(filterDiv);

    filterDiv.querySelectorAll('.eft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterDiv.querySelectorAll('.eft-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderEventCards(btn.dataset.filter);
      });
    });
  }

  renderEventCards('all');
}

function renderEventCards(filter = 'all') {
  const container = document.getElementById('eventsList');
  if (!container) return;

  let events = APP_DATA.events;
  if (filter !== 'all') {
    events = events.filter(e => e.tag === filter);
  }

  container.innerHTML = events.map((e, i) => {
    const eventId = `${e.day}-${e.month}`;
    const hasReminder = window.isReminderSet ? window.isReminderSet(eventId) : false;
    return `
    <div class="event-card" style="animation-delay:${i * 0.05}s">
      <div class="event-date">
        <div class="event-day">${e.day}</div>
        <div class="event-month">${e.month}</div>
      </div>
      <div class="event-body">
        <div class="event-name">${e.name}</div>
        <div class="event-place">📍 ${e.place}</div>
        <div class="event-desc">${e.desc}</div>
        <div class="event-footer">
          <span class="event-tag">${e.tag}</span>
          <button class="event-remind-btn ${hasReminder ? 'active' : ''}"
            onclick="toggleEventReminder('${eventId}','${e.name.replace(/'/g,"\\'")}','${e.day}','${e.month}');this.classList.toggle('active')"
            title="${hasReminder ? 'Usuń przypomnienie' : 'Przypomnij mi'}">
            ${hasReminder ? '🔔' : '🔕'} ${hasReminder ? 'Przypomnę' : 'Przypomnij'}
          </button>
        </div>
      </div>
    </div>
  `}).join('');

  if (events.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2)">
      <div style="font-size:48px;margin-bottom:12px">🎉</div>
      <p>Brak wydarzeń w tej kategorii</p>
    </div>`;
  }
}

// ===== MODAL =====
function openPlaceModal(id) {
  const place = APP_DATA.places.find(p => p.id === id);
  if (!place) return;
  const PE = window.placesEnhanced;
  const status = PE ? PE.getOpenStatus(place) : null;
  const fav = PE ? PE.isFavorite(place.id) : false;
  const stars = PE ? PE.renderStars(place.rating || 0) : '';
  const price = PE ? PE.renderPriceLevel(place.price) : '';
  const dist = PE ? PE.distanceToPlace(place) : null;

  // Weekly hours table
  const dayNames = { mon: 'Pon', tue: 'Wt', wed: 'Śr', thu: 'Czw', fri: 'Pt', sat: 'Sob', sun: 'Ndz' };
  const todayKey = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  let hoursTable = '';
  if (place.hoursWeek) {
    hoursTable = Object.keys(dayNames).map(d => {
      const v = place.hoursWeek[d];
      let label = v === '0-24' ? 'Całą dobę' : v === 'zamkn' ? 'Zamknięte' : v === 'dyżur' ? 'Dyżur' : v.replace('-', ':00–') + ':00';
      label = label.replace('7.5:00', '7:30');
      return `<div class="hours-row ${d === todayKey ? 'today' : ''}">
        <span>${dayNames[d]}${d === todayKey ? ' (dziś)' : ''}</span>
        <span class="${v === 'zamkn' ? 'closed' : ''}">${label}</span>
      </div>`;
    }).join('');
  }

  // Reviews
  let reviewsHtml = '';
  if (place.reviews && place.reviews.length) {
    reviewsHtml = `
      <div class="modal-section-title">💬 Opinie (${place.reviews.length})</div>
      <div class="reviews-block">
        ${place.reviews.map(r => `
          <div class="review-item">
            <div class="review-head">
              <span class="review-avatar">${r.name.charAt(0)}</span>
              <div>
                <div class="review-name">${r.name}</div>
                <div class="review-date">${r.date}</div>
              </div>
              <span class="review-stars">${PE ? PE.renderStars(r.rating) : ''}</span>
            </div>
            <div class="review-text">${r.text}</div>
          </div>
        `).join('')}
      </div>
      <button class="add-review-btn" onclick="addReviewPrompt(${place.id})">✍️ Dodaj opinię</button>
    `;
  }

  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="modal-hero" style="background:${place.gradient || CAT_BG[place.cat]}">
      <span class="modal-hero-emoji">${place.emoji}</span>
      <button class="modal-fav-btn ${fav ? 'active' : ''}" onclick="toggleFav(${place.id}, this); syncModalFav(${place.id})">
        ${fav ? '❤️' : '🤍'}
      </button>
      ${status ? `<span class="modal-status ${status.open ? 'is-open' : 'is-closed'}">${status.open ? '🟢' : '🔴'} ${status.label}</span>` : ''}
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin:14px 0 6px;flex-wrap:wrap">
      <span class="place-card-badge badge-${place.cat}" style="position:static">${place.cat}</span>
      ${price ? `<span class="modal-price">${price}</span>` : ''}
      ${place.featured ? '<span class="modal-featured">⭐ POLECANE</span>' : ''}
    </div>
    <h2 class="modal-title">${place.name}</h2>
    <div class="modal-rating">
      <span class="stars-lg">${stars}</span>
      <span class="rating-big">${place.rating || '–'}</span>
      <span class="rating-out">/ 5</span>
      ${place.reviewCount ? `<span class="review-count">· ${place.reviewCount} opinii</span>` : ''}
    </div>
    <p class="modal-addr">📍 ${place.addr}${dist != null ? ` · ${PE.formatDistance(dist)} od Ciebie` : ''}</p>
    <p class="modal-desc">${place.desc}</p>

    ${hoursTable ? `
      <div class="modal-section-title">⏰ Godziny otwarcia</div>
      <div class="hours-table">${hoursTable}</div>
    ` : ''}

    <div class="modal-details">
      ${place.phone ? `
        <div class="modal-detail">
          <span class="modal-detail-icon">📞</span>
          <span><strong>Telefon:</strong> <a href="tel:${place.phone}" style="color:var(--accent)">${place.phone}</a></span>
        </div>
      ` : ''}
      ${place.website ? `
        <div class="modal-detail">
          <span class="modal-detail-icon">🌐</span>
          <span><strong>Strona:</strong> <a href="https://${place.website}" target="_blank" style="color:var(--accent)">${place.website}</a></span>
        </div>
      ` : ''}
      ${place.tags ? `
        <div class="modal-detail" style="flex-wrap:wrap;gap:6px">
          <span class="modal-detail-icon">🏷️</span>
          ${place.tags.map(t => `<span style="background:var(--surface2);padding:3px 10px;border-radius:50px;font-size:12px">#${t}</span>`).join('')}
        </div>
      ` : ''}
    </div>

    ${reviewsHtml}

    <div class="modal-actions">
      <button class="modal-action-btn btn-primary" onclick="flyToPlace(${place.id});closeModal()">
        🗺️ Pokaż na mapie
      </button>
      <button class="modal-action-btn btn-secondary" onclick="startNavigation(${place.coords[1]},${place.coords[0]},'${place.name.replace(/'/g,"\\'")}');closeModal()">
        🧭 Nawiguj
      </button>
    </div>
    <div class="modal-actions" style="margin-top:8px">
      <button class="modal-action-btn btn-secondary" onclick="sharePlace(${place.id})">
        🔗 Udostępnij
      </button>
      <button class="modal-action-btn btn-secondary" onclick="showQRCode(${place.id})">
        📱 Kod QR
      </button>
      ${place.phone ? `<button class="modal-action-btn btn-secondary" onclick="window.location.href='tel:${place.phone}'">📞 Zadzwoń</button>` : ''}
    </div>
    <div id="qrContainer" class="qr-container hidden"></div>

    <!-- Notatka prywatna -->
    ${window.placeNotes ? window.placeNotes.renderNoteSection(place.id) : ''}
  `;

  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('modalOverlay').style.display = 'flex';

  // Reset scroll to top (so reopening a modal doesn't show mid-scroll)
  const modalEl = document.getElementById('placeModal') || content;
  if (modalEl) modalEl.scrollTop = 0;
  content.scrollTop = 0;

  // Accessibility: trap focus in modal
  state._lastFocusedElement = document.activeElement;
  document.addEventListener('keydown', trapModalFocus);
  // Focus the close button
  setTimeout(() => {
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

// Sync favorite button between modal and re-render the grid
function syncModalFav(id) {
  if (state.currentSection === 'places') renderPlaces(state.searchQuery);
}

// Add a review (stored in localStorage, prepended to reviews)
function addReviewPrompt(id) {
  const place = APP_DATA.places.find(p => p.id === id);
  if (!place) return;

  // Build review modal
  let overlay = document.getElementById('reviewModalOverlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'reviewModalOverlay';
  overlay.className = 'review-modal-overlay';
  overlay.innerHTML = `
    <div class="review-modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle">
      <button class="review-modal-close" id="reviewModalClose" aria-label="Zamknij">✕</button>
      <h3 id="reviewModalTitle" class="review-modal-title">✍️ Twoja opinia</h3>
      <p class="review-modal-place">${place.emoji || '📍'} ${place.name}</p>

      <div class="review-stars" id="reviewStars" role="radiogroup" aria-label="Ocena">
        ${[1,2,3,4,5].map(n => `<button class="rev-star" data-val="${n}" aria-label="${n} gwiazdek">★</button>`).join('')}
      </div>
      <div class="review-rating-label" id="reviewRatingLabel">Wybierz ocenę</div>

      <textarea id="reviewText" class="review-textarea" rows="4"
        placeholder="Napisz co sądzisz o tym miejscu..." maxlength="500"></textarea>
      <div class="review-char-count"><span id="reviewCharCount">0</span>/500</div>

      <div class="review-modal-actions">
        <button class="rev-btn cancel" id="reviewCancel">Anuluj</button>
        <button class="rev-btn submit" id="reviewSubmit">Wyślij opinię</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  let selectedRating = 0;
  const labels = { 1:'😞 Słabo', 2:'😐 Może być', 3:'🙂 Dobrze', 4:'😀 Bardzo dobrze', 5:'🤩 Rewelacja!' };
  const starBtns = overlay.querySelectorAll('.rev-star');
  const ratingLabel = overlay.querySelector('#reviewRatingLabel');

  function paintStars(val) {
    starBtns.forEach((s, i) => s.classList.toggle('filled', i < val));
  }

  starBtns.forEach(btn => {
    const val = parseInt(btn.dataset.val);
    btn.addEventListener('mouseenter', () => paintStars(val));
    btn.addEventListener('click', () => {
      selectedRating = val;
      paintStars(val);
      ratingLabel.textContent = labels[val];
    });
  });
  overlay.querySelector('#reviewStars').addEventListener('mouseleave', () => paintStars(selectedRating));

  // Char counter
  const textArea = overlay.querySelector('#reviewText');
  const charCount = overlay.querySelector('#reviewCharCount');
  textArea.addEventListener('input', () => { charCount.textContent = textArea.value.length; });

  function close() { overlay.remove(); }
  overlay.querySelector('#reviewModalClose').addEventListener('click', close);
  overlay.querySelector('#reviewCancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  overlay.querySelector('#reviewSubmit').addEventListener('click', () => {
    const text = textArea.value.trim();
    if (selectedRating === 0) { showToast('⭐ Wybierz ocenę (1–5 gwiazdek)'); return; }
    if (!text) { showToast('✍️ Napisz kilka słów opinii'); return; }

    if (!place.reviews) place.reviews = [];
    place.reviews.unshift({ name: 'Ty', rating: selectedRating, text, date: 'przed chwilą' });
    place.reviewCount = place.reviews.length;

    // Persist
    try {
      const key = 'lucznicza_reviews_' + id;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.unshift({ name: 'Ty', rating: selectedRating, text, date: new Date().toLocaleDateString('pl') });
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {}

    close();
    showToast('✅ Dziękujemy za opinię!');
    openPlaceModal(id); // refresh modal
  });

  // Focus textarea
  setTimeout(() => textArea.focus(), 100);
}

// Share place
function sharePlace(id) {
  const place = APP_DATA.places.find(p => p.id === id);
  if (!place) return;
  const shareData = {
    title: place.name,
    text: `${place.name} — ${place.addr}. Sprawdź w przewodniku Łucznicza & Tarczowa!`,
    url: window.location.href.split('#')[0] + '#miejsce-' + id
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast('🔗 Link skopiowany do schowka');
    }).catch(() => showToast('🔗 ' + shareData.url));
  }
}

// Show QR code for the place (free QR API)
function showQRCode(id) {
  const place = APP_DATA.places.find(p => p.id === id);
  if (!place) return;
  const container = document.getElementById('qrContainer');
  if (!container) return;

  if (!container.classList.contains('hidden')) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  // Deep link to this place in the app — scanning opens the app directly to the place
  const appUrl = window.location.href.split('#')[0] + '#miejsce-' + id;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(appUrl)}`;
  container.innerHTML = `
    <div class="qr-inner">
      <img src="${qrSrc}" alt="Kod QR — ${place.name}" width="220" height="220"
        onerror="this.style.display='none';this.nextElementSibling.textContent='⚠️ Nie udało się wygenerować kodu QR';" />
      <p>📱 Zeskanuj telefonem, aby otworzyć<br><strong>${place.name}</strong><br>w przewodniku</p>
      <button class="qr-nav-btn" onclick="openGoogleMaps(${place.coords[1]},${place.coords[0]})">🧭 Nawiguj zamiast tego</button>
    </div>
  `;
  container.classList.remove('hidden');
}

// ===== PROXIMITY NOTIFICATIONS (near me alerts) =====
function initProximityAlerts() {
  if (!navigator.geolocation) return;
  const PE = window.placesEnhanced;
  if (!PE) return;

  // Request notification permission (non-blocking)
  if ('Notification' in window && Notification.permission === 'default') {
    // Don't ask immediately — wait for user interaction
    document.addEventListener('click', function requestNotifPermission() {
      Notification.requestPermission();
      document.removeEventListener('click', requestNotifPermission);
    }, { once: true });
  }

  const notified = new Set();
  const PROXIMITY_THRESHOLD = 0.15; // 150m

  navigator.geolocation.watchPosition(
    pos => {
      PE.setUserLocation(pos.coords.latitude, pos.coords.longitude);
      APP_DATA.places.forEach(p => {
        const d = PE.distanceToPlace(p);
        if (d != null && d < PROXIMITY_THRESHOLD && !notified.has(p.id)) {
          notified.add(p.id);
          notifyNearby(p, Math.round(d * 1000));
        }
      });
    },
    () => {},
    { enableHighAccuracy: false, maximumAge: 60000, timeout: 30000 }
  );
}

function notifyNearby(place, meters) {
  const msg = `📍 Jesteś ${meters}m od: ${place.name}`;
  showToast(msg);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Łucznicza & Tarczowa', {
      body: `${place.emoji} ${place.name} — ${meters}m od Ciebie`,
      tag: 'nearby-' + place.id
    });
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.getElementById('modalOverlay').style.display = 'none';
  // Restore focus to the element that opened the modal
  if (state._lastFocusedElement) {
    state._lastFocusedElement.focus();
    state._lastFocusedElement = null;
  }
  // Remove keyboard trap
  document.removeEventListener('keydown', trapModalFocus);
}

// Focus trap for modal (accessibility)
function trapModalFocus(e) {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab') return;
  
  const modal = document.getElementById('placeModal');
  if (!modal) return;
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openGoogleMaps(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast toast-${type}`;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.className = 'toast hidden';
      toast.style.display = 'none';
    }, 300);
  }, 3000);
}

// ===== RENDER COMMUNITY (handled by community-ui.js auto-init) =====
// community-ui.js defines and exports window.renderCommunity — do not redefine here

// ===== EXPORT STATE =====
window.state = state;
