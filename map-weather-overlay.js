/**
 * map-weather-overlay.js — Weather overlay & integrated weather display on map
 * Rain radar, temperature zones, wind indicators, alerts
 */
'use strict';

const MapWeatherOverlay = (() => {
  const cfg = {
    enabled: false,
    layer: null,
    mode: 'precipitation', // precipitation | temperature | wind | alerts
    opacity: 0.6,
    updateInterval: null,
    lastUpdate: null
  };

  // Simulated weather data for Szczecin area
  const weatherZones = [
    { center: [53.4510, 14.5437], radius: 200, temp: 22, precip: 0.1, wind: 5 },
    { center: [53.4520, 14.5510], radius: 150, temp: 23, precip: 0.05, wind: 6 },
    { center: [53.4548, 14.5519], radius: 180, temp: 21, precip: 0.15, wind: 4 },
    { center: [53.4505, 14.5552], radius: 120, temp: 20, precip: 0.2, wind: 7 },
    { center: [53.4537, 14.5636], radius: 150, temp: 19, precip: 0.12, wind: 5 }
  ];

  // Weather alerts for the area
  const alerts = [
    { type: 'wind', severity: 'low', message: 'Wiatr do 15 km/h', center: [53.4510, 14.5437], radius: 500 },
    { type: 'rain', severity: 'medium', message: 'Możliwe opady', center: [53.4505, 14.5552], radius: 400 }
  ];

  function init(map) {
    cfg.map = map;
    console.log('🌦️ Inicjalizacja nakładki pogody...');
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
    
    if (cfg.mode === 'precipitation') {
      drawPrecipitation();
    } else if (cfg.mode === 'temperature') {
      drawTemperature();
    } else if (cfg.mode === 'wind') {
      drawWind();
    } else if (cfg.mode === 'alerts') {
      drawAlerts();
    }

    // Auto-update every 10 minutes
    cfg.updateInterval = setInterval(() => {
      if (cfg.enabled) {
        disable();
        enable();
      }
    }, 600000);

    showToast(`🌦️ Warstwa pogody: ${cfg.mode}`);
  }

  function disable() {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    map.removeLayer(cfg.layer);
    cfg.layer = null;
    cfg.enabled = false;

    if (cfg.updateInterval) {
      clearInterval(cfg.updateInterval);
      cfg.updateInterval = null;
    }

    showToast('🌦️ Warstwa pogody wyłączona');
  }

  function drawPrecipitation() {
    const map = cfg.map;
    const group = L.layerGroup();

    // Color scale: blue = rain, light = dry
    const colorScale = (precip) => {
      if (precip > 0.15) return '#0033cc'; // Heavy rain
      if (precip > 0.10) return '#0066ff'; // Rain
      if (precip > 0.05) return '#66b3ff'; // Light rain
      return 'transparent';
    };

    weatherZones.forEach(zone => {
      const circle = L.circle(zone.center, {
        radius: zone.radius,
        color: colorScale(zone.precip),
        weight: 0,
        fillColor: colorScale(zone.precip),
        fillOpacity: cfg.opacity,
        interactive: true
      });

      const precipPercent = Math.round(zone.precip * 100);
      circle.bindPopup(`
        <strong>Opady</strong><br>
        Prawdopodobieństwo: ${precipPercent}%<br>
        Typ: ${zone.precip > 0.15 ? 'Deszcz' : zone.precip > 0.05 ? 'Przelotnie' : 'Bez opadów'}
      `);

      group.addLayer(circle);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function drawTemperature() {
    const map = cfg.map;
    const group = L.layerGroup();

    // Color scale: blue = cold, red = hot
    const colorScale = (temp) => {
      if (temp > 25) return '#ff0000'; // Hot
      if (temp > 20) return '#ff6600'; // Warm
      if (temp > 15) return '#ffcc00'; // Mild
      if (temp > 10) return '#00ff00'; // Cool
      return '#0099ff'; // Cold
    };

    weatherZones.forEach(zone => {
      const circle = L.circle(zone.center, {
        radius: zone.radius,
        color: colorScale(zone.temp),
        weight: 1,
        fillColor: colorScale(zone.temp),
        fillOpacity: cfg.opacity * 0.7,
        interactive: true
      });

      circle.bindPopup(`
        <strong>Temperatura</strong><br>
        ${zone.temp}°C<br>
        Odczuwalna: ${Math.round(zone.temp - 2)}°C
      `);

      // Add temperature label
      const label = L.marker(zone.center, {
        icon: L.divIcon({
          html: `<div class="temp-label">${zone.temp}°</div>`,
          className: 'temp-marker',
          iconSize: null
        })
      });

      group.addLayer(circle);
      group.addLayer(label);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function drawWind() {
    const map = cfg.map;
    const group = L.layerGroup();

    weatherZones.forEach(zone => {
      // Wind arrow direction (simulated)
      const windDirection = Math.random() * 360;

      // Draw wind intensity circles
      const circle = L.circle(zone.center, {
        radius: zone.radius * (zone.wind / 10),
        color: '#666',
        weight: 2,
        fillColor: '#999',
        fillOpacity: 0.1,
        interactive: true,
        dashArray: '4, 4'
      });

      circle.bindPopup(`
        <strong>Wiatr</strong><br>
        Prędkość: ${zone.wind} m/s (${(zone.wind * 3.6).toFixed(1)} km/h)<br>
        Kierunek: ${getWindDirection(windDirection)}<br>
        Poryw: ${Math.round(zone.wind * 1.5)} m/s
      `);

      // Wind direction arrow
      const angle = windDirection * Math.PI / 180;
      const offset = zone.radius * 0.6;
      const arrowEnd = [
        zone.center[0] + offset * Math.sin(angle) / 111,
        zone.center[1] + offset * Math.cos(angle) / 111
      ];

      const arrow = L.polyline([zone.center, arrowEnd], {
        color: '#ff6b6b',
        weight: 2,
        opacity: 0.7,
        interactive: false
      });

      group.addLayer(circle);
      group.addLayer(arrow);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function drawAlerts() {
    const map = cfg.map;
    const group = L.layerGroup();

    const colorByType = {
      wind: '#ff9800',
      rain: '#2196f3',
      fog: '#9e9e9e',
      hail: '#f44336'
    };

    alerts.forEach(alert => {
      const severityAlpha = alert.severity === 'high' ? 0.8 : alert.severity === 'medium' ? 0.6 : 0.4;

      const circle = L.circle(alert.center, {
        radius: alert.radius,
        color: colorByType[alert.type],
        weight: 2,
        fillColor: colorByType[alert.type],
        fillOpacity: severityAlpha * 0.3,
        dashArray: alert.severity === 'high' ? '8, 4' : '4, 4',
        interactive: true
      });

      const icon = alert.type === 'wind' ? '💨' : alert.type === 'rain' ? '🌧️' : '🌫️';
      
      circle.bindPopup(`
        <strong>${icon} Alert - ${alert.type.toUpperCase()}</strong><br>
        ${alert.message}<br>
        <span style="color: ${alert.severity === 'high' ? 'red' : 'orange'}">
          Poważność: ${alert.severity === 'high' ? '🔴 WYSOKA' : '🟠 ŚREDNIA'}
        </span>
      `);

      group.addLayer(circle);
    });

    group.addTo(map);
    cfg.layer = group;
  }

  function setMode(newMode) {
    if (cfg.enabled) disable();
    cfg.mode = newMode;
    if (cfg.enabled) enable();
  }

  function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    setMode,
    getAlerts: () => alerts,
    getWeatherZones: () => weatherZones
  };
})();

window.MapWeatherOverlay = MapWeatherOverlay;
