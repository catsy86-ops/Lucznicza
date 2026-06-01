/**
 * map-popular-routes.js — Popular routes overlay, route recommendations
 * Shows most-traveled routes, highlights weekend favorites, routing suggestions
 */
'use strict';

const MapPopularRoutes = (() => {
  const cfg = {
    enabled: false,
    layer: null,
    opacity: 0.7,
    filterType: 'all' // all | weekend | daily | evening
  };

  // Simulated popular routes data
  const popularRoutes = [
    {
      id: 1,
      name: 'Park Kadziaka - Boisko',
      coords: [[53.4510, 14.5437], [53.4520, 14.5510]],
      popularity: 95,
      avgTime: 15,
      type: 'walk',
      weekendPopular: true,
      totalUsers: 342,
      emoji: '🚶'
    },
    {
      id: 2,
      name: 'Szkoła - Centrum Handlowe',
      coords: [[53.4505, 14.5552], [53.4548, 14.5519]],
      popularity: 88,
      avgTime: 12,
      type: 'walk',
      weekendPopular: false,
      totalUsers: 298,
      emoji: '🚶'
    },
    {
      id: 3,
      name: 'Tarczowa - Park - Łucznicza',
      coords: [[53.4537, 14.5636], [53.4510, 14.5437], [53.4548, 14.5519]],
      popularity: 82,
      avgTime: 35,
      type: 'bike',
      weekendPopular: true,
      totalUsers: 215,
      emoji: '🚴'
    },
    {
      id: 4,
      name: 'Trasa joggingowa: Park Loop',
      coords: [[53.4510, 14.5437], [53.4520, 14.5510], [53.4510, 14.5437]],
      popularity: 75,
      avgTime: 20,
      type: 'run',
      weekendPopular: true,
      totalUsers: 156,
      emoji: '🏃'
    },
    {
      id: 5,
      name: 'Wieczorny spacer: Zielona Strefa',
      coords: [[53.4510, 14.5437], [53.4505, 14.5552]],
      popularity: 68,
      avgTime: 25,
      type: 'walk',
      weekendPopular: false,
      totalUsers: 142,
      emoji: '🚶'
    }
  ];

  function init(map) {
    cfg.map = map;
    console.log('🛣️ Inicjalizacja popularnych tras...');
  }

  function toggle() {
    if (cfg.enabled) {
      disable();
    } else {
      enable();
    }
  }

  function enable() {
    const map = cfg.map;
    if (!map) return;

    cfg.enabled = true;
    drawPopularRoutes();
    showToast('🛣️ Popularne trasy włączone');
  }

  function disable() {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    map.removeLayer(cfg.layer);
    cfg.layer = null;
    cfg.enabled = false;
    showToast('🛣️ Popularne trasy wyłączone');
  }

  function drawPopularRoutes() {
    const map = cfg.map;
    const group = L.layerGroup();

    const filteredRoutes = filterRoutes(popularRoutes);

    filteredRoutes.forEach((route, idx) => {
      // Draw polyline
      const latlngs = route.coords.map(c => [c[0], c[1]]);
      const weight = 2 + (route.popularity / 100) * 3; // Thicker = more popular
      const opacity = 0.5 + (route.popularity / 100) * 0.4;

      const polyline = L.polyline(latlngs, {
        color: getRouteColor(route.type),
        weight: weight,
        opacity: opacity,
        dashArray: route.weekendPopular ? '8, 4' : 'none',
        lineCap: 'round',
        lineJoin: 'round',
        interactive: true
      });

      // Popup with route info
      const popupContent = `
        <div class="popular-route-popup">
          <div class="prp-header">
            <span>${route.emoji}</span>
            <strong>${route.name}</strong>
          </div>
          <div class="prp-body">
            <div class="prp-stat">
              <span>🔥 Popularność:</span>
              <div class="popularity-bar">
                <div class="popularity-fill" style="width: ${route.popularity}%"></div>
              </div>
              ${route.popularity}%
            </div>
            <div class="prp-stat">
              <span>👥 Użytkowników:</span>
              <strong>${route.totalUsers}</strong>
            </div>
            <div class="prp-stat">
              <span>⏱️ Średni czas:</span>
              <strong>${route.avgTime} min</strong>
            </div>
            <div class="prp-stat">
              <span>📍 Typ:</span>
              <strong>${route.type === 'walk' ? 'Spacer' : route.type === 'bike' ? 'Rower' : 'Bieg'}</strong>
            </div>
            ${route.weekendPopular ? '<div class="prp-badge">⭐ Popularna weekendowo</div>' : ''}
            <button class="prp-btn" onclick="MapPopularRoutes.navigateRoute(${route.id})">
              Nawiguj 🧭
            </button>
          </div>
        </div>
      `;

      polyline.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'popular-route-popup-wrapper'
      });

      group.addLayer(polyline);

      // Add start/end markers
      const startMarker = L.marker(latlngs[0], {
        icon: L.divIcon({
          html: `<div class="route-start-marker">${route.emoji}</div>`,
          className: 'route-marker-start',
          iconSize: null
        })
      });

      const endMarker = L.marker(latlngs[latlngs.length - 1], {
        icon: L.divIcon({
          html: `<div class="route-end-marker">✓</div>`,
          className: 'route-marker-end',
          iconSize: null
        })
      });

      group.addLayer(startMarker);
      group.addLayer(endMarker);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function filterRoutes(routes) {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isWeekend = day === 0 || day === 6;
    const isEvening = hour >= 18 || hour < 6;

    return routes.filter(route => {
      if (cfg.filterType === 'all') return true;
      if (cfg.filterType === 'weekend') return route.weekendPopular;
      if (cfg.filterType === 'daily') return !route.weekendPopular;
      if (cfg.filterType === 'evening') return isEvening;
      return true;
    });
  }

  function getRouteColor(type) {
    const colors = {
      walk: '#4ecdc4',   // Teal
      bike: '#ff6b6b',   // Red
      run: '#ffd93d'     // Yellow
    };
    return colors[type] || '#999';
  }

  function getTopRoutes(limit = 3) {
    return popularRoutes
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  function navigateRoute(routeId) {
    const route = popularRoutes.find(r => r.id === routeId);
    if (!route || !cfg.map) return;

    // Fit map bounds to route
    const latlngs = route.coords.map(c => [c[0], c[1]]);
    const bounds = L.latLngBounds(latlngs);
    cfg.map.fitBounds(bounds, { padding: [60, 60] });

    showToast(`🧭 Nawigacja: ${route.name}`);
  }

  function setFilter(filterType) {
    cfg.filterType = filterType;
    if (cfg.enabled) {
      if (cfg.layer) cfg.map.removeLayer(cfg.layer);
      drawPopularRoutes();
    }
  }

  function getRouteStats() {
    return {
      totalRoutes: popularRoutes.length,
      avgPopularity: (popularRoutes.reduce((sum, r) => sum + r.popularity, 0) / popularRoutes.length).toFixed(1),
      totalUsers: popularRoutes.reduce((sum, r) => sum + r.totalUsers, 0),
      topRoute: popularRoutes.sort((a, b) => b.popularity - a.popularity)[0]
    };
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    navigateRoute,
    setFilter,
    getTopRoutes,
    getRouteStats,
    getRoutes: () => popularRoutes
  };
})();

window.MapPopularRoutes = MapPopularRoutes;
