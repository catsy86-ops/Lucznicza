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
  showFavoritesOnly: false
};

// Expose state globally for other modules
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
  // Restore theme from localStorage (dark, light, pogon)
  const savedTheme = localStorage.getItem('lucznicza_theme') || 'dark';
  applyTheme(savedTheme);

  // Bind core UI event listeners immediately without waiting for splash timeout
  initUI();

  // Splash screen — use requestAnimationFrame to avoid forced reflow
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    if (!splash || !app) return;

    const bar = document.getElementById('splashProgressBar') || splash.querySelector('.loader-bar');
    if (bar) bar.style.width = '100%';

    splash.classList.add('splash-exit');
    setTimeout(() => {
      splash.style.display = 'none';
      app.classList.remove('hidden');
      // Use class instead of inline styles to avoid forced layout
      app.classList.add('app-visible');
      requestAnimationFrame(() => {
        initMap();
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
  }, 2200);
});

// ===== DEEP LINK (#miejsce-X opens that place) =====
function handleDeepLink() {
  // Street View button now works with Mapillary fallback — no need to hide it

  const hash = window.location.hash;
  
  // Handle section navigation via hash
  const sectionMatch = hash.match(/^#(map|places|routes|bikes|info|transport|events|live|community|pogon|szczecin)$/);
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

    // Bounding box of Szczecin & Niebuszewo to prevent drifting while accommodating full bike network
    const NIEBUSZEWO_BOUNDS = [
      [53.4150, 14.4600], // SW (Wały Chrobrego, Jezioro Głębokie zachód, Stadion)
      [53.4900, 14.6100]  // NE (Jezioro Głębokie północ, Warszewo, Odra)
    ];

    // Initialize Leaflet map focused on Niebuszewo, Szczecin
    const map = L.map('map', {
      zoomControl: false,
      minZoom: 12,
      maxZoom: 19,
      maxBounds: NIEBUSZEWO_BOUNDS,
      maxBoundsViscosity: 0.85
    }).setView([53.4530, 14.5520], 15);

    // OpenStreetMap — 100% Free, zero API key required, pure open-source tiles
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    });

    // CyclOSM — 100% Free, modern urban & cycling map without any API keys
    const cyclosmLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      attribution: '© CyclOSM contributors, © OpenStreetMap',
      maxZoom: 19
    });

    // Esri Dark Gray Canvas — 100% Free, zero API key required, beautiful dark theme
    const darkLayer = L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 16
      }),
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16
      })
    ]);

    // OpenStreetMap standard light layer — clean, crisp, 100% free
    const lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    });

    // Esri satellite imagery with boundaries & street labels overlay (100% Free, 0 API keys)
    const satelliteLayer = L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18
      }),
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      })
    ]);

    // OpenTopoMap layer — topographic contours, elevation and forests (100% Free)
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap (CC-BY-SA)',
      maxZoom: 17
    });

    // Set Satellite as default base layer for rich, high-resolution aerial experience
    satelliteLayer.addTo(map);

    // Store layers for switching (100% free, zero API key required)
    state.baseLayers = {
      osm: osmLayer,
      satellite: satelliteLayer,
      dark: darkLayer,
      voyager: cyclosmLayer,
      cyclosm: cyclosmLayer,
      light: lightLayer,
      topo: topoLayer
    };
    state.currentBaseLayer = 'satellite';

    // Scale control (bottom-left)
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

    // Inverted Spotlight Mask — Dims outer area subtly so Niebuszewo satellite imagery stays crisp
    const worldOuter = [
      [-90, -180],
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180]
    ];

    const niebuszewoBoundaryCoords = [
      [53.4465, 14.5440], // Rondo Giedroycia / Kołłątaja
      [53.4470, 14.5410], // Lenartowicza / Staszica południe
      [53.4495, 14.5400], // Staszica / Krasińskiego
      [53.4525, 14.5380], // Niemierzyńska / Krasińskiego zachód
      [53.4570, 14.5405], // Krasińskiego / Przyjaciół Żołnierza
      [53.4615, 14.5460], // Przyjaciół Żołnierza (północ)
      [53.4630, 14.5540], // Przyjaciół Żołnierza / Warcisława
      [53.4600, 14.5620], // Wiadukt kolejowy / SKM Niebuszewo północ
      [53.4550, 14.5650], // Stacja Szczecin Niebuszewo wschód
      [53.4505, 14.5610], // Orzeszkowej / Kołłątaja wschód
      [53.4475, 14.5530], // Dworzec Niebuszewo powrót do Kołłątaja
      [53.4465, 14.5440]
    ];

    // Inverted mask polygon (outer world with gentle dark tint, keeping Niebuszewo vibrant)
    L.polygon([worldOuter, niebuszewoBoundaryCoords], {
      stroke: false,
      fillColor: '#070f1e',
      fillOpacity: 0.22,
      interactive: false
    }).addTo(map);

    // Outer glow polyline for crisp contrast on satellite
    L.polyline(niebuszewoBoundaryCoords, {
      color: '#001a3d',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Glowing boundary contour of Niebuszewo in Pogoń gold
    L.polyline(niebuszewoBoundaryCoords, {
      color: '#FFD700',
      weight: 2.5,
      opacity: 0.95,
      dashArray: '8, 5',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Park im. Stefana Kadziaka — Natural Green Zone Polygon
    const kadziakPolygon = L.polygon([
      [53.4502, 14.5440],
      [53.4538, 14.5460],
      [53.4532, 14.5505],
      [53.4510, 14.5518],
      [53.4496, 14.5480]
    ], {
      color: '#2ec4b6',
      weight: 2,
      fillColor: '#2ec4b6',
      fillOpacity: 0.18,
      dashArray: '3, 3'
    }).addTo(map);
    kadziakPolygon.bindTooltip('🌳 Park im. Stefana Kadziaka', { permanent: false, direction: 'center' });

    // Strefa Sportowo-Rekreacyjna Łucznicza (Boisko & Siłownia)
    const sportsPolygon = L.polygon([
      [53.4518, 14.5505],
      [53.4528, 14.5508],
      [53.4527, 14.5525],
      [53.4517, 14.5522]
    ], {
      color: '#ff9f1c',
      weight: 2,
      fillColor: '#ff9f1c',
      fillOpacity: 0.22
    }).addTo(map);
    sportsPolygon.bindTooltip('⚽ Kompleks Sportowy Łucznicza', { permanent: false, direction: 'center' });

    // Add POI markers (Smart clustering enabled by default to prevent overlapping)
    if (APP_DATA && APP_DATA.places) {
      if (typeof L.markerClusterGroup === 'function') {
        const cluster = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 48,
          spiderfyOnMaxZoom: true,
          spiderfyDistanceMultiplier: 1.5,
          disableClusteringAtZoom: 18,
          iconCreateFunction: c => {
            const count = c.getChildCount();
            let tier = 'cluster-small';
            if (count >= 25) tier = 'cluster-large';
            else if (count >= 10) tier = 'cluster-medium';
            return L.divIcon({
              html: `<div class="cluster-bubble ${tier}"><span>${count}</span></div>`,
              className: 'cluster-icon',
              iconSize: [44, 44],
              iconAnchor: [22, 22]
            });
          }
        });
        APP_DATA.places.forEach(place => {
          const marker = createPoiMarker(place);
          cluster.addLayer(marker);
          state.markers.push(marker);
        });
        map.addLayer(cluster);
        state.poiClusterGroup = cluster;
        if (window.MAP_ENHANCEMENTS) {
          window.MAP_ENHANCEMENTS.clusterGroup = cluster;
          window.MAP_ENHANCEMENTS.clusteringEnabled = true;
        }
      } else {
        APP_DATA.places.forEach(place => {
          const marker = createPoiMarker(place);
          marker.addTo(map);
          state.markers.push(marker);
        });
      }
    }

    // Add routes
    if (APP_DATA && APP_DATA.routes) {
      APP_DATA.routes.forEach(route => {
        const polyline = L.polyline(
          route.coords.map(coord => [coord[1], coord[0]]),
          { color: route.color, weight: 2.5, opacity: 0.15, dashArray: '6, 4', lineCap: 'round', lineJoin: 'round' }
        );
        polyline.routeId = route.id;
        polyline.addTo(map);
        state.routePolylines.push(polyline);
      });
    }

    // Store map in state and window
    state.map = map;
    window.map = map;
    window.state = state;
    initGoogleMapControls();

    // CRITICAL: force Leaflet to recalculate container size so tiles load.
    map.invalidateSize(true);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (mapContainer.clientHeight > 0) map.invalidateSize(true);
      });
      ro.observe(mapContainer);
    }
    setTimeout(() => map.invalidateSize(true), 100);
    setTimeout(() => map.invalidateSize(true), 500);
    setTimeout(() => map.invalidateSize(true), 1500);
    map.whenReady(() => setTimeout(() => map.invalidateSize(true), 50));
    window.addEventListener('resize', () => map.invalidateSize());

    // Initialize premium map features (style switcher, geolocation, etc.)
    if (window.mapPro && window.mapPro.init) {
      window.mapPro.init(map);
    }

    console.log('✨ Mapa Leaflet gotowa! Wysokość kontenera:', mapContainer.clientHeight);

  } catch (err) {
    console.error('❌ Błąd ładowania mapy:', err);
    showToast('❌ Błąd ładowania mapy');
  }
}

// ===== CREATE RICH POI MARKER =====
function createPoiMarker(place) {
  const PE = window.placesEnhanced;
  const status = PE ? PE.getOpenStatus(place) : null;
  const statusDot = status
    ? `<span class="mk-status ${status.open ? 'open' : 'closed'}"></span>`
    : '';

  const iconHtml = `
    <div class="google-pin-marker" data-cat="${place.cat}">
      <div class="google-pin-head pin-${place.cat}">
        <span class="google-pin-icon">${place.emoji}</span>
      </div>
      <div class="google-pin-pulse"></div>
    </div>
  `;
  const icon = L.divIcon({
    html: iconHtml,
    iconSize: [26, 32],
    iconAnchor: [13, 30],
    popupAnchor: [0, -29],
    className: 'leaflet-marker-google-style'
  });

  const marker = L.marker([place.coords[1], place.coords[0]], {
    icon: icon,
    riseOnHover: true
  });
  marker.placeData = place;

  const stars = PE ? PE.renderStars(place.rating || 0) : '';
  const statusBadge = status
    ? `<span class="pp-status ${status.open ? 'open' : 'closed'}">${status.open ? '🟢 Otwarte' : '🔴 Zamknięte'}</span>`
    : '';

  const popupHtml = `
    <div class="map-popup">
      <div class="pp-head" style="background:${place.gradient || CAT_COLORS[place.cat]}">
        <span class="pp-emoji">${place.emoji}</span>
        ${statusBadge}
      </div>
      <div class="pp-body">
        <div class="pp-cat" style="color:${CAT_COLORS[place.cat]}">${place.cat.toUpperCase()}</div>
        <div class="pp-name">${place.name}</div>
        <div class="pp-rating"><span class="pp-stars">${stars}</span> <b>${place.rating || '–'}</b></div>
        <div class="pp-addr">📍 ${place.addr}</div>
        <div class="pp-actions">
          <button class="pp-btn primary" onclick="openPlaceModal(${place.id})">Szczegóły</button>
          <button class="pp-btn" onclick="openGoogleMaps(${place.coords[1]},${place.coords[0]})">🧭</button>
        </div>
      </div>
    </div>
  `;

  // On desktop screens bind traditional popup; on mobile prefer bottom sheet to prevent double UI
  if (typeof window !== 'undefined' && window.innerWidth > 768) {
    marker.bindPopup(popupHtml, { maxWidth: 260, minWidth: 220, closeButton: true, className: 'map-popup-wrapper' });
  }

  marker.on('click', () => {
    showGooglePlaceSheet(place);
  });

  return marker;
}

// ===== GOOGLE PLACE PEEK SHEET CONTROLLER =====
let activePlaceForSheet = null;

function showGooglePlaceSheet(place) {
  activePlaceForSheet = place;
  const sheet = document.getElementById('googlePlaceSheet');
  if (!sheet) return;

  const PE = window.placesEnhanced;
  const status = PE ? PE.getOpenStatus(place) : null;

  const emojiEl = document.getElementById('gpsEmoji');
  const titleEl = document.getElementById('gpsTitle');
  const statusEl = document.getElementById('gpsStatus');
  const ratingEl = document.getElementById('gpsRating');
  const distEl = document.getElementById('gpsDist');
  const addrEl = document.getElementById('gpsAddr');

  if (emojiEl) emojiEl.textContent = place.emoji || '📍';
  if (titleEl) titleEl.textContent = place.name;
  if (addrEl) addrEl.textContent = place.addr;
  if (ratingEl) ratingEl.textContent = `⭐ ${place.rating || '–'}`;

  if (statusEl) {
    if (status) {
      statusEl.textContent = status.open ? '🟢 Otwarte teraz' : '🔴 Zamknięte';
      statusEl.className = `gps-status ${status.open ? 'open' : 'closed'}`;
    } else {
      statusEl.textContent = '🟢 Otwarte';
    }
  }

  // Calculate distance from user position if available
  if (distEl) {
    if (navigator.geolocation) {
      distEl.textContent = '📍 Sprawdzanie dystansu...';
      navigator.geolocation.getCurrentPosition(pos => {
        const d = calculateDistance(pos.coords.latitude, pos.coords.longitude, place.coords[1], place.coords[0]);
        distEl.textContent = d < 1 ? `📍 ${Math.round(d * 1000)} m stąd` : `📍 ${d.toFixed(1)} km stąd`;
      }, () => {
        distEl.textContent = '📍 Niebuszewo';
      }, { timeout: 3000, maximumAge: 60000 });
    } else {
      distEl.textContent = '📍 Niebuszewo';
    }
  }

  sheet.classList.remove('hidden');

  // Center slightly offset to accommodate the sheet
  if (state.map) {
    state.map.panTo([place.coords[1], place.coords[0]], { animate: true, duration: 0.5 });
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function initGooglePlaceSheetEvents() {
  const sheet = document.getElementById('googlePlaceSheet');
  const closeBtn = document.getElementById('gpsClose');
  const navBtn = document.getElementById('gpsNavigateBtn');
  const detailsBtn = document.getElementById('gpsDetailsBtn');
  const shareBtn = document.getElementById('gpsShareBtn');

  if (closeBtn && sheet) {
    closeBtn.addEventListener('click', () => {
      sheet.classList.add('hidden');
    });
  }

  if (navBtn) {
    navBtn.addEventListener('click', () => {
      if (!activePlaceForSheet) return;
      if (typeof startNavigation === 'function') {
        startNavigation(activePlaceForSheet.coords[1], activePlaceForSheet.coords[0], activePlaceForSheet.name);
      } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${activePlaceForSheet.coords[1]},${activePlaceForSheet.coords[0]}`, '_blank');
      }
    });
  }

  if (detailsBtn) {
    detailsBtn.addEventListener('click', () => {
      if (!activePlaceForSheet) return;
      openPlaceModal(activePlaceForSheet.id);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (!activePlaceForSheet) return;
      const shareData = {
        title: activePlaceForSheet.name,
        text: `Sprawdź ${activePlaceForSheet.name} na Niebuszewie w aplikacji Niebuszewo Guide!`,
        url: window.location.origin + window.location.pathname + `#miejsce-${activePlaceForSheet.id}`
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch {}
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        showToast('🔗 Skopiowano link do schowka!');
      }
    });
  }
}

let showOnlyOpenNow = false;

// ===== FILTER MARKERS (Leaflet, cluster-aware) =====
function filterMarkers(cat) {
  if (!state.map) return;
  if (cat !== undefined && cat !== null) {
    state.currentCat = cat;
  }
  const currentCat = state.currentCat || 'all';

  const PE = window.placesEnhanced;
  const clusterGroup = (window.mapEnhancements && window.mapEnhancements.getClusterGroup)
    ? (window.mapEnhancements.getClusterGroup() || state.poiClusterGroup)
    : state.poiClusterGroup;

  state.markers.forEach(marker => {
    const place = marker.placeData;
    if (!place) return;
    let show = (currentCat === 'all' || place.cat === currentCat);

    // Apply 'open now' filter
    if (show && showOnlyOpenNow && PE) {
      const status = PE.getOpenStatus(place);
      if (status && !status.open) {
        show = false;
      }
    }

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
}

// ===== MAP CONTROLS (Leaflet-compatible) =====
function initMapControls() {
  const map = state.map;
  if (!map) return;

  initGooglePlaceSheetEvents();

  // 'Otwarte teraz' toggle button
  const openNowBtn = document.getElementById('catOpenNowBtn');
  if (openNowBtn) {
    openNowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showOnlyOpenNow = !showOnlyOpenNow;
      openNowBtn.classList.toggle('active', showOnlyOpenNow);
      filterMarkers();
      showToast(showOnlyOpenNow ? '🟢 Filtruję: Tylko otwarte teraz' : '⚪ Pokazuję wszystkie godziny');
    });
  }

  // Category filter buttons (excluding toggles like open-now and layers)
  document.querySelectorAll('.cat-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMarkers(btn.dataset.cat);
    });
  });

  // Layer Switcher Modal handling
  const layerModalBtn = document.getElementById('mapLayersModalBtn');
  const layerModalOverlay = document.getElementById('mapLayersModalOverlay');
  const layerModalClose = document.getElementById('mapLayersModalClose');

  if (layerModalBtn && layerModalOverlay) {
    layerModalBtn.addEventListener('click', () => {
      layerModalOverlay.classList.remove('hidden');
    });
    if (layerModalClose) {
      layerModalClose.addEventListener('click', () => {
        layerModalOverlay.classList.add('hidden');
      });
    }
    layerModalOverlay.addEventListener('click', (e) => {
      if (e.target === layerModalOverlay) layerModalOverlay.classList.add('hidden');
    });

    // Wire layer toggles
    document.getElementById('layerToggleZditm')?.addEventListener('change', (e) => {
      window.toggleTransitLayer?.(e.target.checked);
    });
    document.getElementById('layerToggleBikes')?.addEventListener('change', (e) => {
      window.toggleBikesLayer?.(e.target.checked);
    });
    document.getElementById('layerToggleParks')?.addEventListener('change', (e) => {
      window.toggleParksLayer?.(e.target.checked);
    });
    document.getElementById('layerToggleAlerts')?.addEventListener('change', (e) => {
      window.toggleAlertsLayer?.(e.target.checked);
    });
    document.getElementById('layerToggleDogs')?.addEventListener('change', (e) => {
      window.toggleDogsLayer?.(e.target.checked);
    });
  }
}

// ===== UI INIT =====
function initUI() {
  if (window.__uiInitialized) return;
  window.__uiInitialized = true;

  initMapControls();

  // Menu button
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.add('hidden');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar?.classList.contains('open');
      if (isOpen) {
        closeSidebar();
      } else {
        sidebar?.classList.add('open');
        overlay?.classList.remove('hidden');
      }
    });
  }

  document.getElementById('closeSidebar')?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // Sidebar nav (event delegation + individual listeners for 100% reliability)
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav) {
    sidebarNav.addEventListener('click', e => {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      e.preventDefault();
      const sec = item.dataset.section;
      if (sec) {
        navigateTo(sec);
        closeSidebar();
      }
    });
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      if (item.dataset.section) {
        navigateTo(item.dataset.section);
        closeSidebar();
      }
    });
  });

  // Bottom nav with haptic feedback
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
      navigateTo(btn.dataset.section);
    });
  });

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

  // Theme toggle with Pogoń Szczecin theme
  document.getElementById('themeBtn').addEventListener('click', () => {
    cycleTheme();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    
    // Number keys 1-8 for section navigation
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const sections = ['map', 'places', 'routes', 'bikes', 'info', 'transport', 'events', 'live'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= sections.length) {
        navigateTo(sections[num - 1]);
        return;
      }
      // 't' for theme toggle
      if (e.key === 't' || e.key === 'T') {
        cycleTheme();
      }
    }
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  initPlacesToolbar();
  initBottomSheet();
  initSzczecinIsland();

  // Pre-render dynamic sections immediately so they are instantly available
  try {
    if (window.BikeSectionManager?.init) window.BikeSectionManager.init();
    if (window.PogonFeature?.render) window.PogonFeature.render();
    if (window.SzczecinLocalFlavor?.render) window.SzczecinLocalFlavor.render(true);
  } catch (_) {}
}

// ===== THEME CONTROLLER (Dark / Light / Pogoń Szczecin) =====
function applyTheme(themeName) {
  state.currentTheme = themeName;
  state.isDark = themeName !== 'light';
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('lucznicza_theme', themeName);
  
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    if (themeName === 'pogon') {
      themeBtn.innerHTML = `<span style="font-size: 15px; line-height: 1;">🛡️</span>`;
      themeBtn.setAttribute('title', 'Motyw Pogoń Szczecin (Duma Pomorza)');
    } else if (themeName === 'light') {
      themeBtn.innerHTML = `<svg class="island-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      themeBtn.setAttribute('title', 'Tryb jasny');
    } else {
      themeBtn.innerHTML = `<svg class="island-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      themeBtn.setAttribute('title', 'Tryb ciemny');
    }
  }
}

function cycleTheme() {
  const current = state.currentTheme || (state.isDark ? 'dark' : 'light');
  let next = 'dark';
  if (current === 'dark') next = 'light';
  else if (current === 'light') next = 'pogon';
  else next = 'dark';

  applyTheme(next);
  if (next === 'pogon') {
    showToast('🛡️ Motyw Pogoń Szczecin — Duma Pomorza!');
  } else if (next === 'light') {
    showToast('☀️ Tryb jasny');
  } else {
    showToast('🌙 Tryb ciemny');
  }
}

window.applyTheme = applyTheme;
window.cycleTheme = cycleTheme;

// ===== SZCZECIN ISLAND ACTION CAPSULE LOGIC =====
function executeIslandAction(action) {
  if (!action) return;
  switch (action) {
    case 'map':
      navigateTo('map');
      showToast('🗺️ Widok główny mapy Niebuszewa');
      break;
    case 'bikes':
      navigateTo('bikes');
      showToast('🚲 Wybrano ścieżki i trasy rowerowe Szczecina');
      break;
    case 'zditm':
      navigateTo('transport');
      showToast('🚏 Odjazdy ZDiTM na żywo');
      break;
    case 'alert':
      const alertFab = document.querySelector('.community-alert-fab');
      if (alertFab) {
        alertFab.click();
      } else {
        showToast('🐗 Ostrzeżenia osiedlowe i alerty dzików');
      }
      break;
    case 'widgets':
      if (window.WidgetDragManager && typeof window.WidgetDragManager.restoreAllWidgets === 'function') {
        window.WidgetDragManager.restoreAllWidgets();
        showToast('🧩 Przywrócono wszystkie widżety');
      } else {
        const dock = document.getElementById('widgetRestoreDock');
        if (dock) dock.classList.toggle('open');
      }
      break;
    case 'pogon':
      applyTheme('pogon');
      navigateTo('pogon');
      showToast('🛡️ Aktywowano motyw Pogoń Szczecin — Duma Pomorza!');
      break;
    case 'matchday':
      navigateTo('pogon');
      if (window.PogonFeature) {
        window.PogonFeature.toggleMatchdayMode();
      }
      break;
    case 'pasztecik':
      navigateTo('szczecin');
      setTimeout(() => {
        const el = document.getElementById('sfGastroRadar');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('highlight-section');
          setTimeout(() => el.classList.remove('highlight-section'), 2000);
        }
      }, 250);
      showToast('🥟 Pasztecik & Frytburger Radar');
      break;
    case 'gwara':
      navigateTo('szczecin');
      if (window.SzczecinLocalFlavor) {
        window.SzczecinLocalFlavor.toggleSzczecinDialect();
      }
      setTimeout(() => {
        const el = document.getElementById('sfDictionary');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('highlight-section');
          setTimeout(() => el.classList.remove('highlight-section'), 2000);
        }
      }, 250);
      showToast('🗣️ Słownik & Gwara Szczecińska');
      break;
    case 'giedroyc':
      navigateTo('szczecin');
      setTimeout(() => {
        const el = document.querySelector('.sf-giedroyc-indicator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      showToast('🚦 Stan przejazdu na Rondzie Giedroycia');
      break;
    case 'klatka':
      navigateTo('community');
      setTimeout(() => {
        const el = document.getElementById('comm-klatka');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      showToast('🍻 Witaj w Pubie Klatka pod 39! Zimne piwko czeka!');
      break;
    case 'ogloszenia':
      navigateTo('szczecin');
      setTimeout(() => {
        const el = document.getElementById('sfAnnounceWrap');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
      showToast('📜 Ogłoszenia z Klatki pod 43');
      break;
  }
}

function initSzczecinIsland() {
  const menuBtn = document.getElementById('islandMenuBtn');
  const dropdown = document.getElementById('islandDropdownMenu');
  if (!menuBtn || !dropdown) return;

  function toggleDropdown(forceState) {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', !shouldOpen);
    menuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  // Event delegation on dropdown for all items (reliable even with nested spans/divs)
  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.idm-item');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(false);
    executeIslandAction(item.dataset.action);
  });

  // Individual click listeners as additional guarantee
  dropdown.querySelectorAll('.idm-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(false);
      executeIslandAction(item.dataset.action);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  // Keyboard shortcut Ctrl+K / Cmd+K and Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay?.classList.add('hidden');
      }
      if (!dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) searchBtn.click();
    }
  });
}

// ===== MODERN BOTTOM SHEET LOGIC =====
function initBottomSheet() {
  const sheet = document.getElementById('modernBottomSheet');
  const handleBar = document.getElementById('sheetHandleBar');
  const toggleBtn = document.getElementById('sheetToggleBtn');
  const peekArea = document.getElementById('sheetPeek');
  if (!sheet) return;

  function toggleSheet() {
    if (sheet.classList.contains('state-half')) {
      sheet.classList.remove('state-half');
      sheet.classList.add('state-full');
      if (toggleBtn) toggleBtn.textContent = 'Zwiń 🔽';
    } else if (sheet.classList.contains('state-full')) {
      sheet.classList.remove('state-full');
      sheet.classList.remove('state-half');
      if (toggleBtn) toggleBtn.textContent = 'Rozwiń 🔼';
    } else {
      sheet.classList.add('state-half');
      if (toggleBtn) toggleBtn.textContent = 'Więcej 🔼';
    }
  }

  if (handleBar) handleBar.addEventListener('click', toggleSheet);
  if (toggleBtn) toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSheet();
  });
  if (peekArea) peekArea.addEventListener('click', (e) => {
    if (e.target !== toggleBtn) toggleSheet();
  });

  // Touch swipe gesture physics for mobile
  let startY = 0;
  let currentY = 0;
  let isSwiping = false;

  const dragArea = handleBar || sheet;
  dragArea.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (touch) {
      startY = touch.clientY;
      currentY = startY;
      isSwiping = true;
    }
  }, { passive: true });

  dragArea.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const touch = e.touches[0];
    if (touch) currentY = touch.clientY;
  }, { passive: true });

  dragArea.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const deltaY = startY - currentY; // positive = swipe up, negative = swipe down
    if (Math.abs(deltaY) < 35) return;

    if (deltaY > 35) {
      // Swiped UP
      if (!sheet.classList.contains('state-half') && !sheet.classList.contains('state-full')) {
        sheet.classList.add('state-half');
        if (toggleBtn) toggleBtn.textContent = 'Więcej 🔼';
      } else if (sheet.classList.contains('state-half')) {
        sheet.classList.remove('state-half');
        sheet.classList.add('state-full');
        if (toggleBtn) toggleBtn.textContent = 'Zwiń 🔽';
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
    } else if (deltaY < -35) {
      // Swiped DOWN
      if (sheet.classList.contains('state-full')) {
        sheet.classList.remove('state-full');
        sheet.classList.add('state-half');
        if (toggleBtn) toggleBtn.textContent = 'Więcej 🔼';
      } else if (sheet.classList.contains('state-half')) {
        sheet.classList.remove('state-half');
        if (toggleBtn) toggleBtn.textContent = 'Rozwiń 🔼';
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
    }
  }, { passive: true });
}

// ===== GOOGLE MAP EXPERIENCE CONTROLS =====
function initGoogleMapControls() {
  const thumbBtn = document.getElementById('googleLayerThumbBtn');
  const thumbLabel = document.getElementById('googleLayerThumbLabel');

  if (thumbBtn && state.baseLayers) {
    // Initial state: satellite is active, so thumbnail shows alternate 'MAPA' layer
    if (state.currentBaseLayer === 'satellite') {
      thumbBtn.style.backgroundImage = "url('https://a.tile.openstreetmap.org/15/17709/10762.png')";
      if (thumbLabel) thumbLabel.textContent = 'MAPA';
    } else {
      thumbBtn.style.backgroundImage = "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/10762/17709')";
      if (thumbLabel) thumbLabel.textContent = 'SATELITA';
    }

    thumbBtn.onclick = () => {
      const map = state.map;
      if (!map || !state.baseLayers) return;

      if (state.currentBaseLayer === 'satellite') {
        if (map.hasLayer(state.baseLayers.satellite)) {
          map.removeLayer(state.baseLayers.satellite);
        }
        state.baseLayers.osm.addTo(map);
        state.currentBaseLayer = 'osm';
        thumbBtn.style.backgroundImage = "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/10762/17709')";
        if (thumbLabel) thumbLabel.textContent = 'SATELITA';
        showToast('🗺️ Widok Mapy (OpenStreetMap)');
      } else {
        const currentLayer = state.baseLayers[state.currentBaseLayer];
        if (currentLayer && map.hasLayer(currentLayer)) {
          map.removeLayer(currentLayer);
        }
        state.baseLayers.satellite.addTo(map);
        state.currentBaseLayer = 'satellite';
        thumbBtn.style.backgroundImage = "url('https://a.tile.openstreetmap.org/15/17709/10762.png')";
        if (thumbLabel) thumbLabel.textContent = 'MAPA';
        showToast('🛰️ Widok Satelitarny HD (Esri)');
      }
    };
  }

  // Google Locate GPS Action Button with Blue Dot & Heading Tracking
  let userGpsMarker = null;
  let userGpsCircle = null;
  let isTrackingUser = false;

  const gLocateBtn = document.getElementById('googleLocateBtn');
  if (gLocateBtn) {
    gLocateBtn.onclick = () => {
      const map = state.map;
      if (!map) return;

      if (!navigator.geolocation) {
        showToast('⚠️ Geolokalizacja nie jest wspierana');
        return;
      }

      showToast('🎯 Lokalizowanie pozycji...');

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng, accuracy, heading } = pos.coords;

          if (userGpsMarker) {
            map.removeLayer(userGpsMarker);
          }
          if (userGpsCircle) {
            map.removeLayer(userGpsCircle);
          }

          // Accuracy circle
          userGpsCircle = L.circle([lat, lng], {
            radius: Math.min(accuracy || 30, 100),
            color: '#1a73e8',
            weight: 1,
            fillColor: '#1a73e8',
            fillOpacity: 0.12
          }).addTo(map);

          // Google Blue Dot marker with pulse & heading cone
          const blueDotHtml = `
            <div class="google-blue-dot-wrap">
              <div class="gbd-heading-cone" style="transform: rotate(${heading || 0}deg);"></div>
              <div class="gbd-pulse"></div>
              <div class="gbd-core"></div>
            </div>
          `;
          const blueDotIcon = L.divIcon({
            html: blueDotHtml,
            className: 'custom-blue-dot-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          userGpsMarker = L.marker([lat, lng], { icon: blueDotIcon, zIndexOffset: 2000 }).addTo(map);
          userGpsMarker.bindPopup('<b>📍 Twoja pozycja</b><br>Dokładność: ±' + Math.round(accuracy || 15) + ' m');

          map.flyTo([lat, lng], 16.5, { animate: true, duration: 1.2 });
          showToast('📍 Wycentrowano na Twojej pozycji');

          // Reverse geocoding — show street name via Nominatim
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pl`, {
            headers: { 'Accept': 'application/json', 'User-Agent': 'NiebuszewoGuide/1.5' }
          }).then(r => r.json()).then(data => {
            const addr = data.address || {};
            const road = addr.road || addr.pedestrian || addr.path || '';
            const suburb = addr.suburb || addr.neighbourhood || addr.city_district || '';
            const num = addr.house_number ? ' ' + addr.house_number : '';
            if (road) {
              const label = road + num + (suburb ? ', ' + suburb : '');
              showToast('📍 Jesteś na: ' + label);
              if (userGpsMarker) {
                userGpsMarker.setPopupContent(`<b>📍 Twoja pozycja</b><br>${label}<br>Dokładność: ±${Math.round(accuracy || 15)} m`);
              }
            }
          }).catch(() => {}); // silent fail

          // Device orientation support for heading beam on mobile
          if (window.DeviceOrientationEvent && !isTrackingUser) {
            isTrackingUser = true;
            window.addEventListener('deviceorientation', (e) => {
              if (e.webkitCompassHeading != null || e.alpha != null) {
                const angle = e.webkitCompassHeading || (360 - e.alpha);
                const cone = document.querySelector('.gbd-heading-cone');
                if (cone) cone.style.transform = `rotate(${angle}deg)`;
              }
            }, { passive: true });
          }
        },
        () => showToast('⚠️ Nie udało się pobrać lokalizacji GPS'),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    };
  }

  // Centralized Center button (Łucznicza 43)
  const centerBtn = document.getElementById('btnCenterLucznicza');
  if (centerBtn) {
    centerBtn.onclick = () => {
      const map = state.map;
      if (!map) return;
      map.flyTo([53.4530, 14.5520], 15, { animate: true, duration: 1.2 });
      showToast('🏹 Powrót do centrum (Łucznicza 43)');
    };
  }

  // Wire fabReset to center function
  const fabReset = document.getElementById('fabReset');
  if (fabReset) {
    fabReset.onclick = () => {
      const map = state.map;
      if (!map) return;
      map.flyTo([53.4530, 14.5520], 15, { animate: true, duration: 1.2 });
      showToast('🏹 Powrót do centrum (Łucznicza 43)');
    };
  }

  // Fullscreen button
  const fsBtn = document.getElementById('fabFullscreen');
  if (fsBtn) {
    fsBtn.onclick = () => {
      if (typeof toggleFullscreen === 'function') {
        toggleFullscreen();
      } else {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    };
  }

  // Wire Map Style Quick Button and Modes Popover
  const styleQuickBtn = document.getElementById('mapStyleQuickBtn');
  const modesPopover = document.getElementById('mapModesPopover');
  const modesClose = document.getElementById('mapModesClose');

  if (styleQuickBtn && modesPopover) {
    styleQuickBtn.onclick = (e) => {
      e.stopPropagation();
      modesPopover.classList.toggle('hidden');
    };

    if (modesClose) {
      modesClose.onclick = (e) => {
        e.stopPropagation();
        modesPopover.classList.add('hidden');
      };
    }

    document.querySelectorAll('.map-mode-chip').forEach(chip => {
      chip.onclick = (e) => {
        e.stopPropagation();
        const style = chip.dataset.style;
        if (style) {
          switchMapLayer(style);
          modesPopover.classList.add('hidden');
        }
      };
    });

    document.addEventListener('click', (e) => {
      if (modesPopover && !modesPopover.contains(e.target) && e.target !== styleQuickBtn) {
        modesPopover.classList.add('hidden');
      }
    });
  }
}

// Global base layer switcher supporting 6 modes
function switchMapLayer(styleKey) {
  const map = state.map;
  if (!map || !state.baseLayers || !state.baseLayers[styleKey]) return;

  if (state.baseLayers[state.currentBaseLayer] && map.hasLayer(state.baseLayers[state.currentBaseLayer])) {
    map.removeLayer(state.baseLayers[state.currentBaseLayer]);
  }
  state.baseLayers[styleKey].addTo(map);
  if (state.baseLayers[styleKey].bringToBack) {
    state.baseLayers[styleKey].bringToBack();
  }
  state.currentBaseLayer = styleKey;
  try {
    localStorage.setItem('lucznicza_map_style', styleKey);
  } catch {}

  const thumbBtn = document.getElementById('googleLayerThumbBtn');
  const thumbLabel = document.getElementById('googleLayerThumbLabel');
  if (thumbBtn && thumbLabel) {
    if (styleKey === 'satellite') {
      thumbBtn.style.backgroundImage = "url('https://a.tile.openstreetmap.org/15/17709/10762.png')";
      thumbLabel.textContent = 'MAPA';
    } else {
      thumbBtn.style.backgroundImage = "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/10762/17709')";
      thumbLabel.textContent = 'SATELITA';
    }
  }

  const styleNames = {
    satellite: { icon: '🛰️', label: 'Satelita HD' },
    osm:       { icon: '🗺️', label: 'Standard' },
    cyclosm:   { icon: '🚲', label: 'Rowerowa' },
    dark:      { icon: '🌙', label: 'Nocna' },
    light:     { icon: '☀️', label: 'Jasna' },
    topo:      { icon: '🏔️', label: 'Topograficzna' }
  };
  const iconEl = document.getElementById('mapStyleQuickIcon');
  const labelEl = document.getElementById('mapStyleQuickLabel');
  if (iconEl && styleNames[styleKey]) iconEl.textContent = styleNames[styleKey].icon;
  if (labelEl && styleNames[styleKey]) labelEl.textContent = styleNames[styleKey].label;

  document.querySelectorAll('.map-mode-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === styleKey);
  });

  const name = styleNames[styleKey]?.label || styleKey;
  const icon = styleNames[styleKey]?.icon || '🗺️';
  showToast(`${icon} Styl mapy: ${name}`);
}
window.switchMapLayer = switchMapLayer;

// ===== NIEBUSZEWO CAMERA FOCUS PRESETS =====
function flyToPreset(presetId) {
  const map = state.map;
  if (!map) return;

  const presets = {
    'full-district': { center: [53.4530, 14.5520], zoom: 15, toast: '🏙️ Całe Osiedle Niebuszewo' },
    'lucznicza-axis': { center: [53.4535, 14.5505], zoom: 16.5, toast: '🏹 Oś Ulicy Łuczniczej' },
    'kadziak-park': { center: [53.4530, 14.5520], zoom: 17, toast: '🌳 Park Stefana Kadziaka' },
    'station-hub': { center: [53.4554, 14.5587], zoom: 16.5, toast: '🚉 Dworzec Szczecin Niebuszewo' },
    'kollataja-hub': { center: [53.4475, 14.5518], zoom: 16.5, toast: '🚋 Pętla Kołłątaja & Manhattan' }
  };

  const target = presets[presetId];
  if (target) {
    map.flyTo(target.center, target.zoom, { animate: true, duration: 1.0 });
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = document.querySelector(`.preset-btn[onclick*="${presetId}"]`);
    if (clickedBtn) clickedBtn.classList.add('active');
    showToast(target.toast);
  }
}
window.flyToPreset = flyToPreset;

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
      if (callback) callback();
    },
    () => {
      // Fallback: use district center
      PE.setUserLocation(53.4530, 14.5520);
      showToast('📍 Używam centrum dzielnicy jako punktu odniesienia');
      if (callback) callback();
    }
  );
}

// ===== NAVIGATION =====
function navigateTo(section) {
  state.currentSection = section;
  document.body.classList.toggle('is-map-view', section === 'map');
  document.body.setAttribute('data-active-section', section);

  // Track recently visited sections (skip 'map' — too frequent)
  if (section !== 'map') {
    try {
      const SECTION_LABELS = {
        places:'Miejsca', routes:'Trasy', bikes:'Rowery', transport:'Transport',
        info:'Informacje', events:'Wydarzenia', live:'Na żywo', community:'Społeczność',
        pogon:'Pogoń Szczecin', szczecin:'Szczecińskie Klasyki'
      };
      const SECTION_ICONS = {
        places:'📍', routes:'🗺️', bikes:'🚲', transport:'🚌',
        info:'ℹ️', events:'🎉', live:'📡', community:'🏘️',
        pogon:'🛡️', szczecin:'🥟'
      };
      let recent = JSON.parse(localStorage.getItem('recent_sections') || '[]');
      recent = recent.filter(r => r.id !== section);
      recent.unshift({ id: section, label: SECTION_LABELS[section] || section, icon: SECTION_ICONS[section] || '📌' });
      recent = recent.slice(0, 5);
      localStorage.setItem('recent_sections', JSON.stringify(recent));
    } catch (_) {}
  }

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

    // Render dynamic sections: pogon|szczecin and bikes
    if (/pogon|szczecin/.test(section) || section === 'bikes') {
      if (section === 'pogon') {
        if (window.PogonFeature?.render) window.PogonFeature.render();
      } else if (section === 'szczecin') {
        if (window.SzczecinLocalFlavor?.render) window.SzczecinLocalFlavor.render(true);
      } else if (section === 'bikes') {
        if (window.BikeSectionManager?.init) {
          window.BikeSectionManager.init();
        }
      }
    }
  }

  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.section === section);
  });
  document.querySelectorAll('.bnav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === section);
  });

  // Highlight matching item in island dropdown menu
  const sectionToAction = {
    map: 'map', bikes: 'bikes', transport: 'zditm',
    community: 'klatka', pogon: 'pogon', szczecin: 'pasztecik'
  };
  const dropdown = document.getElementById('islandDropdownMenu');
  if (dropdown) {
    dropdown.querySelectorAll('.idm-item').forEach(i => i.classList.remove('idm-active'));
    const matchAction = sectionToAction[section];
    if (matchAction) {
      const match = dropdown.querySelector(`[data-action="${matchAction}"]`);
      if (match) match.classList.add('idm-active');
    }
  }

  // Bottom sheet only appears on map section
  const sheet = document.getElementById('modernBottomSheet');
  if (sheet) {
    if (section === 'map') {
      sheet.classList.remove('hidden');
    } else {
      sheet.classList.add('hidden');
      sheet.classList.remove('state-half', 'state-full');
      const toggleBtn = document.getElementById('sheetToggleBtn');
      if (toggleBtn) toggleBtn.textContent = 'Rozwiń 🔼';
    }
  }

  // Restore dock visibility
  const restoreDock = document.getElementById('widgetRestoreDock');
  if (restoreDock) {
    if (section === 'map') {
      if (window.WidgetDragManager && window.WidgetDragManager.getClosedCount() > 0) {
        restoreDock.classList.remove('hidden');
      }
    } else {
      restoreDock.classList.add('hidden');
    }
  }

  // If map section, invalidate size so Leaflet redraws tiles
  if (section === 'map' && state.map) {
    setTimeout(() => state.map.invalidateSize(), 100);
  }

  // Sync bikeActiveRouteBanner visibility
  const bikeBanner = document.getElementById('bikeActiveRouteBanner');
  if (bikeBanner) {
    bikeBanner.style.display = (section === 'map' && window.BikeSectionManager?.routeLayer) ? 'flex' : 'none';
  }

  // Update URL hash for deep linking (without triggering hashchange)
  if (history.replaceState) {
    history.replaceState(null, '', `#${section}`);
  }
}

window.navigateTo = navigateTo;

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
    const msg = state.showFavoritesOnly
      ? 'Nie masz jeszcze ulubionych miejsc. Kliknij ❤️ na karcie miejsca.'
      : `Brak wyników dla "${query}"`;
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
    const targetMarker = state.markers.find(m => m.placeData && m.placeData.id === id);
    const cluster = state.poiClusterGroup || (window.MAP_ENHANCEMENTS && window.MAP_ENHANCEMENTS.clusterGroup);
    if (targetMarker && cluster && typeof cluster.zoomToShowLayer === 'function') {
      cluster.zoomToShowLayer(targetMarker, () => {
        setTimeout(() => targetMarker.openPopup(), 150);
      });
    } else {
      state.map.setView([place.coords[1], place.coords[0]], 17, { animate: true, duration: 1.5 });
      if (targetMarker) {
        setTimeout(() => targetMarker.openPopup(), 800);
      }
    }
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

function downloadRouteGpx(id) {
  const route = APP_DATA.routes.find(r => r.id === id);
  if (!route) return;

  const app = window.__SZCZECIN_APP__;
  if (app && app.gpxExporter) {
    app.gpxExporter.downloadGpx(route);
  } else {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1"><trk><name>${route.name}</name></trk></gpx>`;
    const blob = new Blob([xml], { type: 'application/gpx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trasa_${route.id}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
window.downloadRouteGpx = downloadRouteGpx;

function renderRoutes() {
  const container = document.getElementById('section-routes');
  if (!container) return;

  // Build the full section HTML
  container.querySelector('.section-content').innerHTML = `
    <div class="section-back-bar">
      <button class="section-back-btn" onclick="navigateTo('map')">← Wróć do mapy</button>
    </div>
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
          <button class="rc2-btn gpx" onclick="downloadRouteGpx(${r.id})" title="Pobierz plik GPX do Garmina, Stravy lub Komoot">
            📥 GPX
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
    <div class="section-back-bar">
      <button class="section-back-btn" onclick="navigateTo('map')">← Wróć do mapy</button>
    </div>
    <!-- Hero banner -->
    <div class="info-hero">
      <div class="info-hero-bg"></div>
      <div class="info-hero-content">
        <div class="info-hero-badge">🏹 Szczecin</div>
        <h1 class="info-hero-title">Łucznicza & Tarczowa</h1>
        <p class="info-hero-sub">Dzielnica mieszkaniowa · Szczecin Zachód</p>
        <div class="info-hero-stats">
          <div class="ihs-item"><span class="ihs-num" data-target="8000">0</span><span class="ihs-label">Mieszkańców</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="50">0</span><span class="ihs-label">Lat historii</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="12">0</span><span class="ihs-label">Miejsc POI</span></div>
          <div class="ihs-item"><span class="ihs-num" data-target="6">0</span><span class="ihs-label">Tras</span></div>
        </div>
      </div>
    </div>

    <!-- Quick nav pills -->
    <div class="info-nav-pills">
      <button class="inp-btn active" onclick="scrollToInfoSection('info-cards-section')">📋 Informacje</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-timeline-section')">📅 Historia</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-facts-section')">💡 Ciekawostki</button>
      <button class="inp-btn" onclick="scrollToInfoSection('info-contact-section')">📞 Kontakt</button>
    </div>

    <!-- Info cards -->
    <div id="info-cards-section">
      <div class="info-section-title">📋 O dzielnicy</div>
      <div class="info-cards" id="infoCards">
        ${APP_DATA.info.map(item => renderInfoCard(item)).join('')}
      </div>
    </div>

    <!-- Timeline -->
    <div id="info-timeline-section">
      <div class="info-section-title">📅 Historia dzielnicy</div>
      <div class="info-timeline">
        ${APP_DATA.timeline.map((t, i) => `
          <div class="tl-item ${t.year === '2026' ? 'tl-current' : ''}">
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
      <div class="info-section-title">📞 Kontakt z dzielnicą</div>
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
            <a class="cc-link" href="https://www.szczecin.eu" target="_blank">🏙️ szczecin.eu</a>
            <a class="cc-link" href="https://www.zditm.szczecin.pl" target="_blank">🚌 ZDiTM Szczecin</a>
            <a class="cc-link" href="https://www.bike-s.pl" target="_blank">🚲 Bike_S Szczecin</a>
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
        <button class="ic2-toggle" onclick="toggleInfoCard('${item.id}')" id="ictoggle-${item.id}">›</button>
      </div>
      <div class="ic2-body" id="icbody-${item.id}" style="display:none">
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

function scrollToInfoSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Update active pill
  document.querySelectorAll('.inp-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
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
          ${e.source ? `<span class="event-tag" style="background:rgba(65,175,187,0.15);color:#41afbb;border:1px solid rgba(65,175,187,0.3)">🌐 ${e.source}</span>` : ''}
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
  const text = prompt('Twoja opinia o "' + place.name + '":');
  if (!text || !text.trim()) return;
  const ratingStr = prompt('Ocena 1–5:', '5');
  const rating = Math.max(1, Math.min(5, parseInt(ratingStr) || 5));
  if (!place.reviews) place.reviews = [];
  place.reviews.unshift({ name: 'Ty', rating, text: text.trim(), date: 'przed chwilą' });
  place.reviewCount = place.reviews.length;
  // persist user reviews
  try {
    const key = 'lucznicza_reviews_' + id;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.unshift({ name: 'Ty', rating, text: text.trim(), date: new Date().toLocaleDateString('pl') });
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {}
  showToast('✅ Dziękujemy za opinię!');
  openPlaceModal(id); // refresh modal
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

  // Google Maps navigation link encoded in QR
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coords[1]},${place.coords[0]}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(navUrl)}`;
  container.innerHTML = `
    <div class="qr-inner">
      <img src="${qrSrc}" alt="Kod QR — nawigacja do ${place.name}" width="180" height="180" />
      <p>📱 Zeskanuj telefonem, aby nawigować do<br><strong>${place.name}</strong></p>
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
  // Click to dismiss early
  toast.onclick = () => {
    clearTimeout(toast._timeout);
    toast.style.opacity = '0';
    setTimeout(() => { toast.className = 'toast hidden'; toast.style.display = 'none'; }, 300);
  };
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.className = 'toast hidden';
      toast.style.display = 'none';
    }, 300);
  }, 2400);
}

// ===== RENDER COMMUNITY (handled by community-ui.js auto-init) =====
// community-ui.js defines and exports window.renderCommunity — do not redefine here

// ===== ZEN MAP MODE (CZYSTA MAPA) =====
function toggleZenMode(explicitState) {
  const isCurrentlyZen = document.body.classList.contains('zen-map-mode');
  const targetState = typeof explicitState === 'boolean' ? explicitState : !isCurrentlyZen;

  document.body.classList.toggle('zen-map-mode', targetState);
  
  const restorePill = document.getElementById('zenRestorePill');
  if (restorePill) {
    restorePill.classList.toggle('hidden', !targetState);
  }
  
  const zenBtn = document.getElementById('zenMapBtn');
  if (zenBtn) {
    zenBtn.classList.toggle('active', targetState);
    const badge = zenBtn.querySelector('.zen-btn-badge');
    if (badge) badge.textContent = targetState ? 'ON' : 'Zen';
  }

  // Handle map overlay layers in Zen mode
  const map = window.state?.map;
  if (map) {
    if (targetState) {
      if (window.VEHICLES?.layer && map.hasLayer(window.VEHICLES.layer)) {
        map.removeLayer(window.VEHICLES.layer);
        window.VEHICLES._hiddenForZen = true;
      }
      if (window.MAP_LAYERS?.stopsLayer && map.hasLayer(window.MAP_LAYERS.stopsLayer)) {
        map.removeLayer(window.MAP_LAYERS.stopsLayer);
        window.MAP_LAYERS._hiddenForZen = true;
      }
    } else {
      if (window.VEHICLES?._hiddenForZen && window.VEHICLES?.layer) {
        window.VEHICLES.layer.addTo(map);
        window.VEHICLES._hiddenForZen = false;
      }
      if (window.MAP_LAYERS?._hiddenForZen && window.MAP_LAYERS?.stopsLayer) {
        window.MAP_LAYERS.stopsLayer.addTo(map);
        window.MAP_LAYERS._hiddenForZen = false;
      }
    }
  }

  localStorage.setItem('lucznicza_zen_mode', targetState ? '1' : '0');
  showToast(targetState ? '👁️ Tryb czystej mapy włączony (skrót: Z)' : '👁️ Przywrócono pełny interfejs', 'info');
}

window.toggleZenMode = toggleZenMode;

// Initialize Zen mode and widget minimization listeners
document.addEventListener('DOMContentLoaded', () => {
  const zenBtn = document.getElementById('zenMapBtn');
  const restorePill = document.getElementById('zenRestorePill');
  const weatherMinimizeBtn = document.getElementById('weatherMinimizeBtn');
  const weatherWidget = document.getElementById('weatherWidget');

  zenBtn?.addEventListener('click', () => toggleZenMode());
  restorePill?.addEventListener('click', () => toggleZenMode(false));

  weatherMinimizeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.WidgetDragManager?.toggleMinimize) {
      window.WidgetDragManager.toggleMinimize('weatherWidget');
    } else if (weatherWidget) {
      const isMin = weatherWidget.classList.toggle('minimized');
      weatherMinimizeBtn.textContent = isMin ? '▸' : '▾';
    }
  });

  const catPresetsToggle = document.getElementById('catPresetsToggle');
  const presetsBar = document.getElementById('mapPresetsBar');
  catPresetsToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (presetsBar) {
      const isCollapsed = presetsBar.classList.toggle('collapsed');
      catPresetsToggle.textContent = isCollapsed ? '🏙️ Widoki ▾' : '🏙️ Widoki ▴';
      catPresetsToggle.classList.toggle('active', !isCollapsed);
    }
  });

  // Keyboard shortcut: 'Z' or 'z' toggles Zen Map Mode
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      toggleZenMode();
    }
  });

  // Restore saved Zen state
  if (localStorage.getItem('lucznicza_zen_mode') === '1') {
    setTimeout(() => toggleZenMode(true), 800);
  }
});
