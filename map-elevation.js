/**
 * map-elevation.js — Elevation/Terrain visualization
 * Contour lines, height indicators, terrain overlays
 */
'use strict';

const MapElevation = (() => {
  const cfg = {
    enabled: false,
    layer: null,
    mode: 'contours', // contours | relief | hillshade
    opacity: 0.5
  };

  // Simulated elevation data for Szczecin area
  // (In production, would use SRTM or OpenElevation API)
  const elevationZones = [
    // High points
    { center: [53.4510, 14.5437], radius: 150, height: 45, name: 'Park Kadziaka - Wyżyzna' },
    { center: [53.4520, 14.5510], radius: 100, height: 42, name: 'Boisko - Wyniesienie' },
    { center: [53.4505, 14.5552], radius: 120, height: 41, name: 'Szkoła - Wzgórze' },
    
    // Low points (valleys)
    { center: [53.4548, 14.5519], radius: 180, height: 35, name: 'Dolina Handlowa' },
    { center: [53.4537, 14.5636], radius: 150, height: 38, name: 'Depresja Tarczowa' }
  ];

  function init(map) {
    cfg.map = map;
    console.log('🏔️ Inicjalizacja warstwy wysokości...');
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
    
    if (cfg.mode === 'contours') {
      drawContours();
    } else if (cfg.mode === 'relief') {
      drawRelief();
    } else if (cfg.mode === 'hillshade') {
      drawHillshade();
    }

    showToast(`🏔️ Warstwa wysokości: ${cfg.mode}`);
  }

  function disable() {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    map.removeLayer(cfg.layer);
    cfg.layer = null;
    cfg.enabled = false;
    showToast('🏔️ Warstwa wysokości wyłączona');
  }

  function drawContours() {
    const map = cfg.map;
    const group = L.layerGroup();

    // Draw contour circles at different elevations
    const contourLines = [
      { height: 40, color: '#8B4513', weight: 2, opacity: 0.6 },
      { height: 43, color: '#A0522D', weight: 2, opacity: 0.5 },
      { height: 45, color: '#CD853F', weight: 1.5, opacity: 0.4 }
    ];

    contourLines.forEach(contour => {
      elevationZones.forEach(zone => {
        if (zone.height >= contour.height - 1 && zone.height <= contour.height + 1) {
          // Draw contour line
          const circle = L.circle(zone.center, {
            radius: zone.radius,
            color: contour.color,
            weight: contour.weight,
            opacity: contour.opacity,
            fill: false,
            dashArray: '4, 4'
          });
          circle.bindTooltip(`Wysokość: ${zone.height}m`);
          group.addLayer(circle);
        }
      });
    });

    // Add elevation points
    elevationZones.forEach(zone => {
      const marker = L.marker(zone.center, {
        icon: L.divIcon({
          html: `<div class="elev-marker"><span class="elev-num">${zone.height}m</span></div>`,
          className: 'elevation-marker',
          iconSize: null
        })
      });
      marker.bindPopup(`<strong>${zone.name}</strong><br>Wysokość: ${zone.height}m`);
      group.addLayer(marker);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function drawRelief() {
    const map = cfg.map;
    const group = L.layerGroup();

    // Draw relief with color gradients
    const colorScale = {
      low: '#e8f4f8',      // Light blue (low)
      medium: '#90ee90',   // Light green (medium)
      high: '#8b4513'      // Brown (high)
    };

    elevationZones.forEach(zone => {
      const progress = (zone.height - 35) / (45 - 35); // Normalize 35-45m range
      let color;
      if (progress < 0.33) {
        color = colorScale.low;
      } else if (progress < 0.66) {
        color = colorScale.medium;
      } else {
        color = colorScale.high;
      }

      const circle = L.circle(zone.center, {
        radius: zone.radius * (0.8 + progress * 0.4), // Size varies with height
        color: color,
        weight: 2,
        opacity: 0.7,
        fillColor: color,
        fillOpacity: 0.5 + progress * 0.3
      });

      circle.bindPopup(`
        <strong>${zone.name}</strong><br>
        Wysokość: ${zone.height}m<br>
        Typ: ${progress > 0.66 ? 'Wyniesienie' : progress > 0.33 ? 'Zbocze' : 'Dolina'}
      `);

      group.addLayer(circle);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function drawHillshade() {
    const map = cfg.map;
    const group = L.layerGroup();

    // Simulated hillshade (shadow effect based on height)
    const sunAngle = 45; // degrees (NE direction)
    
    elevationZones.forEach(zone => {
      // Calculate shade based on position and height
      const shadeIntensity = (zone.height - 35) / (45 - 35);
      const shadowOpacity = 0.3 + shadeIntensity * 0.4;

      // Illuminated side (NE)
      const illuminated = L.circle(zone.center, {
        radius: zone.radius * 0.6,
        color: 'transparent',
        fillColor: '#ffeb3b',
        fillOpacity: 0.2 + shadeIntensity * 0.2,
        interactive: false
      });

      // Shadow side (SW)
      const shadow = L.circle(zone.center, {
        radius: zone.radius * 0.4,
        color: 'transparent',
        fillColor: '#3f3f3f',
        fillOpacity: shadowOpacity * 0.3,
        interactive: false
      });

      group.addLayer(illuminated);
      group.addLayer(shadow);

      // Height label
      const marker = L.marker(zone.center, {
        icon: L.divIcon({
          html: `<div class="hillshade-label">${zone.height}m</div>`,
          className: 'hillshade-marker',
          iconSize: null
        })
      });
      group.addLayer(marker);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function setMode(newMode) {
    if (cfg.enabled) disable();
    cfg.mode = newMode;
    if (cfg.enabled) enable();
  }

  function getProfile(start, end) {
    // Calculate elevation profile between two points
    const distance = calculateDistance(start[0], start[1], end[0], end[1]);
    
    // Interpolate elevation along path
    const profile = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const lat = start[0] + (end[0] - start[0]) * (i / steps);
      const lng = start[1] + (end[1] - start[1]) * (i / steps);
      
      // Find closest zone
      let closestHeight = 40;
      let closestDist = Infinity;
      
      elevationZones.forEach(zone => {
        const d = calculateDistance(lat, lng, zone.center[0], zone.center[1]);
        if (d < closestDist) {
          closestDist = d;
          closestHeight = zone.height - (d / zone.radius) * 5; // Simulate gradients
        }
      });
      
      profile.push({
        distance: distance * (i / steps),
        elevation: Math.max(35, closestHeight)
      });
    }
    
    return profile;
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    setMode,
    getProfile,
    getZones: () => elevationZones
  };
})();

window.MapElevation = MapElevation;
