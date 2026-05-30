/**
 * map-advanced.js — Advanced Map Features & Optimizations
 * Smart layer management, geofencing, route analysis, performance enhancements
 */
'use strict';

const MAP_ADVANCED = (() => {
  const config = {
    enableGeofences: true,
    enableHeatmap: true,
    enableRouteProfile: true,
    markerClusterRadius: 60,
    geofenceOpacity: 0.15,
  };

  // ===== ZONE DEFINITIONS =====
  const zones = [
    {
      id: 'sport',
      name: 'Strefa Sportowa',
      center: [53.4520, 14.5510],
      radius: 250,
      color: '#ff6b6b',
      icon: '⚽',
      desc: 'Boiska i siłownia plenerowa'
    },
    {
      id: 'retail',
      name: 'Strefa Handlowa',
      center: [53.4548, 14.5519],
      radius: 200,
      color: '#ffd93d',
      icon: '🛒',
      desc: 'Sklepy i usługi'
    },
    {
      id: 'green',
      name: 'Strefa Zielona',
      center: [53.4510, 14.5437],
      radius: 300,
      color: '#4ecdc4',
      icon: '🌳',
      desc: 'Parki i tereny rekreacyjne'
    },
    {
      id: 'school',
      name: 'Strefa Edukacyjna',
      center: [53.4505, 14.5552],
      radius: 150,
      color: '#fd79a8',
      icon: '📚',
      desc: 'Szkoły i obiekty edukacyjne'
    }
  ];

  // ===== INITIALIZE ADVANCED FEATURES =====
  function init(map) {
    if (!map) return;
    
    console.log('🗺️ Inicjalizacja zaawansowanych funkcji mapy...');
    
    // Initialize features
    if (config.enableGeofences) initGeofences(map);
    if (config.enableHeatmap) initActivityHeatmap(map);
    initRouteProfiles(map);
    initMapSearch(map);
    initLayerControl(map);
    initMapPrintMode(map);
    
    console.log('✅ Zaawansowane funkcje mapy zaladowane');
  }

  // ===== GEOFENCES (Smart Zones) =====
  function initGeofences(map) {
    const geofenceLayer = L.layerGroup();
    
    zones.forEach(zone => {
      // Draw circle
      const circle = L.circle(zone.center, {
        radius: zone.radius,
        color: zone.color,
        weight: 2,
        opacity: 0.6,
        fillColor: zone.color,
        fillOpacity: config.geofenceOpacity,
        dashArray: '6, 3'
      }).addTo(geofenceLayer);
      
      // Add label
      const label = L.marker(zone.center, {
        icon: L.divIcon({
          html: `<div class="zone-label"><span class="zone-icon">${zone.icon}</span><span class="zone-name">${zone.name}</span></div>`,
          iconSize: null,
          className: 'zone-marker'
        })
      }).addTo(geofenceLayer);
      
      // Popup on click
      circle.bindPopup(`
        <div class="zone-popup">
          <div class="zp-header">${zone.icon} ${zone.name}</div>
          <div class="zp-desc">${zone.desc}</div>
          <div class="zp-stats">
            <span>📍 Promień: ${zone.radius}m</span>
            <span>📊 Obszar: ${(Math.PI * zone.radius * zone.radius / 1000).toFixed(2)} km²</span>
          </div>
        </div>
      `, { 
        maxWidth: 280,
        className: 'zone-popup-wrapper'
      });
    });
    
    map.addLayer(geofenceLayer);
    map.geofenceLayer = geofenceLayer;
  }

  // ===== ACTIVITY HEATMAP =====
  function initActivityHeatmap(map) {
    const heatLayer = L.layerGroup();
    
    // Simulated activity points (based on place density)
    const activityPoints = [
      { lat: 53.4520, lng: 14.5510, intensity: 0.95 }, // Boisko
      { lat: 53.4548, lng: 14.5519, intensity: 0.88 }, // Handlowa
      { lat: 53.4510, lng: 14.5437, intensity: 0.92 }, // Park
      { lat: 53.4505, lng: 14.5552, intensity: 0.75 }, // Szkoła
      { lat: 53.4537, lng: 14.5636, intensity: 0.70 }, // Sklepy
      { lat: 53.4461, lng: 14.5479, intensity: 0.60 }, // Ogólnie
    ];
    
    activityPoints.forEach(point => {
      const radius = point.intensity * 120;
      const color = `hsl(${(1 - point.intensity) * 240}, 100%, 50%)`;
      
      L.circle([point.lat, point.lng], {
        radius: radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: point.intensity * 0.25,
        interactive: false,
        className: 'heatmap-circle'
      }).addTo(heatLayer);
    });
    
    map.heatLayer = heatLayer;
  }

  // ===== ROUTE PROFILES (Analysis) =====
  function initRouteProfiles(map) {
    if (!APP_DATA || !APP_DATA.routes) return;
    
    APP_DATA.routes.forEach(route => {
      if (!route.stats) {
        // Calculate route stats
        let distance = 0;
        for (let i = 0; i < route.coords.length - 1; i++) {
          const c1 = route.coords[i];
          const c2 = route.coords[i + 1];
          distance += calculateDistance(c1[1], c1[0], c2[1], c2[0]);
        }
        
        route.stats = {
          distance: distance,
          duration: Math.round(distance * 12), // ~12 min per km walking
          difficulty: distance > 5 ? 'trudna' : distance > 3 ? 'średnia' : 'łatwa'
        };
      }
    });
  }

  // ===== MAP SEARCH =====
  function initMapSearch(map) {
    // This will be triggered by the search bar in app.js
    // Just ensure map can handle searches
    window.searchMap = function(query) {
      if (!query || !APP_DATA || !APP_DATA.places) return;
      
      const results = APP_DATA.places.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.addr.toLowerCase().includes(query.toLowerCase())
      );
      
      if (results.length === 0) {
        showToast('❌ Brak wyników dla: ' + query);
        return;
      }
      
      // Fit map to results
      const bounds = L.latLngBounds(
        results.map(p => [p.coords[1], p.coords[0]])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
      
      showToast(`🔍 Znaleziono ${results.length} wyników`);
      
      // Highlight markers
      state.markers.forEach(marker => {
        const isResult = results.some(r => r.id === marker.placeData.id);
        marker.setOpacity(isResult ? 1 : 0.3);
      });
    };
  }

  // ===== LAYER CONTROL (Smart Toggle) =====
  function initLayerControl(map) {
    window.toggleMapLayer = function(layerId) {
      const layers = {
        'geofence': map.geofenceLayer,
        'heat': map.heatLayer,
        'routes': state.routePolylines ? L.featureGroup(state.routePolylines) : null,
        'markers': state.markers ? L.featureGroup(state.markers) : null
      };
      
      const layer = layers[layerId];
      if (!layer) return;
      
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        showToast(`👁️ ${layerId} ukryty`);
      } else {
        map.addLayer(layer);
        showToast(`👁️ ${layerId} widoczny`);
      }
    };
  }

  // ===== PRINT MODE =====
  function initMapPrintMode(map) {
    window.printMap = function() {
      const printWindow = window.open('', '', 'width=1200,height=800');
      const mapDiv = document.getElementById('map');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Mapa - Niebuszewo Guide</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            #map { width: 100vw; height: 100vh; }
            .print-header { position: absolute; top: 10px; left: 10px; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 1000; }
            .print-header h2 { margin: 0; font-size: 18px; }
            .print-header p { margin: 4px 0; font-size: 12px; color: #666; }
            @media print {
              .leaflet-control { display: none; }
              .print-header { background: transparent; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>🗺️ Niebuszewo Guide</h2>
            <p>Szczecin · Łucznicza & Tarczowa</p>
            <p>${new Date().toLocaleDateString('pl-PL')}</p>
          </div>
          <div id="map"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
          <script>
            const map = L.map('map').setView([53.4530, 14.5520], 15);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap © CARTO',
              subdomains: 'abcd'
            }).addTo(map);
            setTimeout(() => window.print(), 1000);
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    };
  }

  // ===== UTILITY: Distance calculation =====
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ===== PUBLIC API =====
  return {
    init,
    zones,
    config,
    toggleLayer: (id) => window.toggleMapLayer(id),
    printMap: () => window.printMap(),
    searchMap: (q) => window.searchMap(q)
  };
})();

window.mapAdvanced = MAP_ADVANCED;
