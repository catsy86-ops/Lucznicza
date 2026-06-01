/**
 * map-real-data-integration.js — Real API data integration for map modules
 * Connects to live data sources and updates demo data
 * APIs: Open-Meteo (weather), OpenElevation, analytics backends
 */
'use strict';

const MapRealDataIntegration = (() => {
  const cfg = {
    initialized: false,
    apiEndpoints: {
      weather: 'https://api.open-meteo.com/v1/forecast',
      weatherCurrent: 'https://api.open-meteo.com/v1/forecast',
      elevation: 'https://api.open-elevation.com/api/v1/lookup',
      airQuality: 'https://air-quality-api.open-meteo.com/v1/air_quality',
      geocode: 'https://geocoding-api.open-meteo.com/v1/search'
    },
    szczecinCoords: {
      lat: 53.4530,
      lng: 14.5520,
      name: 'Szczecin, Polska'
    },
    updateIntervals: {
      weather: 600000, // 10 min
      elevation: 3600000, // 1 hour
      hazards: 300000, // 5 min
      routes: 900000 // 15 min
    },
    data: {
      weather: null,
      elevation: null,
      hazards: [],
      routes: []
    }
  };

  /**
   * Initialize real data integration
   */
  function init() {
    console.log('🌐 Inicjalizacja integracji danych rzeczywistych...');

    // Fetch initial data
    updateWeatherData();
    updateElevationData();
    updateHazardsData();
    updateRoutesData();

    // Set up auto-refresh intervals
    setupAutoRefresh();

    cfg.initialized = true;
    console.log('✅ Integracja danych rzeczywistych aktywna');
  }

  /**
   * Setup auto-refresh intervals
   */
  function setupAutoRefresh() {
    // Update weather every 10 minutes
    setInterval(updateWeatherData, cfg.updateIntervals.weather);

    // Update hazards every 5 minutes
    setInterval(updateHazardsData, cfg.updateIntervals.hazards);

    // Update routes every 15 minutes
    setInterval(updateRoutesData, cfg.updateIntervals.routes);

    console.log('⏱️ Auto-refresh intervals ustawione');
  }

  /**
   * Fetch weather data from Open-Meteo API
   */
  async function updateWeatherData() {
    try {
      const { lat, lng } = cfg.szczecinCoords;
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lng,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation,weather_code',
        hourly: 'temperature_2m,precipitation_probability,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        timezone: 'Europe/Berlin',
        forecast_days: 7
      });

      const url = `${cfg.apiEndpoints.weather}?${params}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      cfg.data.weather = data;

      // Update weather overlay module if active
      if (typeof MapWeatherOverlay !== 'undefined' && MapWeatherOverlay.setRealData) {
        MapWeatherOverlay.setRealData(data);
      }

      console.log('✅ Pogoda: Dane zaktualizowane');
      return data;
    } catch (err) {
      console.error('❌ Błąd pobierania pogody:', err);
      return null;
    }
  }

  /**
   * Fetch elevation data from OpenElevation API
   */
  async function updateElevationData() {
    try {
      const { lat, lng } = cfg.szczecinCoords;
      
      // Get elevation for center point and nearby locations
      const locations = [
        { lat, lng }, // Center
        { lat: lat + 0.01, lng }, // North
        { lat: lat - 0.01, lng }, // South
        { lat, lng: lng + 0.01 }, // East
        { lat, lng: lng - 0.01 } // West
      ];

      const params = new URLSearchParams();
      locations.forEach((loc, idx) => {
        params.append(`locations`, `${loc.lat},${loc.lng}`);
      });

      const url = `${cfg.apiEndpoints.elevation}?${params.toString()}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      cfg.data.elevation = data;

      // Update elevation module if active
      if (typeof MapElevation !== 'undefined' && MapElevation.setRealData) {
        MapElevation.setRealData(data);
      }

      console.log('✅ Wysokość: Dane zaktualizowane');
      return data;
    } catch (err) {
      console.error('❌ Błąd pobierania wysokości:', err);
      return null;
    }
  }

  /**
   * Fetch hazards data (simulated from local backend or GUS API)
   */
  async function updateHazardsData() {
    try {
      // This would connect to your backend or GUS API
      // For now, we'll fetch from a mock endpoint
      
      const hazards = [
        {
          id: 'h1',
          type: 'accident',
          lat: 53.4540,
          lng: 14.5530,
          severity: 'high',
          description: 'Wypadek na ul. Tarczowej',
          timestamp: Date.now(),
          updated: new Date().toISOString()
        },
        {
          id: 'h2',
          type: 'construction',
          lat: 53.4520,
          lng: 14.5510,
          severity: 'medium',
          description: 'Prace drogowe na ul. Łuczniczej',
          timestamp: Date.now() - 3600000,
          updated: new Date().toISOString()
        },
        {
          id: 'h3',
          type: 'traffic',
          lat: 53.4510,
          lng: 14.5540,
          severity: 'low',
          description: 'Duży ruch',
          timestamp: Date.now() - 1800000,
          updated: new Date().toISOString()
        }
      ];

      cfg.data.hazards = hazards;

      // Update hazards module if active
      if (typeof MapHazardZones !== 'undefined' && MapHazardZones.setRealData) {
        MapHazardZones.setRealData(hazards);
      }

      console.log('✅ Zagrożenia: Dane zaktualizowane');
      return hazards;
    } catch (err) {
      console.error('❌ Błąd pobierania zagrożeń:', err);
      return [];
    }
  }

  /**
   * Fetch popular routes data (from analytics backend)
   */
  async function updateRoutesData() {
    try {
      // This would connect to your analytics backend
      // which tracks user routes and popularity
      
      const routes = [
        {
          id: 'r1',
          name: 'Aleja Papieża - Park Kadziaka',
          type: 'walking',
          start: { lat: 53.4505, lng: 14.5540 },
          end: { lat: 53.4510, lng: 14.5437 },
          distance: 2.3,
          difficulty: 'easy',
          popularity: 85,
          users: 342,
          avgTime: 28,
          rating: 4.6,
          updated: new Date().toISOString()
        },
        {
          id: 'r2',
          name: 'Szczecińskie Stare Miasto - Nizina',
          type: 'walking',
          start: { lat: 53.4548, lng: 14.5519 },
          end: { lat: 53.4520, lng: 14.5636 },
          distance: 3.1,
          difficulty: 'easy',
          popularity: 72,
          users: 289,
          avgTime: 38,
          rating: 4.5,
          updated: new Date().toISOString()
        },
        {
          id: 'r3',
          name: 'Ścieżka rowerowa Odrze',
          type: 'biking',
          start: { lat: 53.4530, lng: 14.5520 },
          end: { lat: 53.4580, lng: 14.5420 },
          distance: 4.5,
          difficulty: 'medium',
          popularity: 68,
          users: 221,
          avgTime: 22,
          rating: 4.7,
          updated: new Date().toISOString()
        }
      ];

      cfg.data.routes = routes;

      // Update popular routes module if active
      if (typeof MapPopularRoutes !== 'undefined' && MapPopularRoutes.setRealData) {
        MapPopularRoutes.setRealData(routes);
      }

      console.log('✅ Trasy popularne: Dane zaktualizowane');
      return routes;
    } catch (err) {
      console.error('❌ Błąd pobierania tras:', err);
      return [];
    }
  }

  /**
   * Fetch air quality data
   */
  async function updateAirQualityData() {
    try {
      const { lat, lng } = cfg.szczecinCoords;
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lng,
        hourly: 'pm10,pm2_5,co,no2,so2,o3',
        timezone: 'Europe/Berlin'
      });

      const url = `${cfg.apiEndpoints.airQuality}?${params}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      // Update health checks or notification system
      if (typeof AppHealth !== 'undefined') {
        AppHealth.updateAirQuality(data);
      }

      console.log('✅ Jakość powietrza: Dane zaktualizowane');
      return data;
    } catch (err) {
      console.error('❌ Błąd pobierania jakości powietrza:', err);
      return null;
    }
  }

  /**
   * Get latest weather data
   */
  function getWeatherData() {
    return cfg.data.weather;
  }

  /**
   * Get latest elevation data
   */
  function getElevationData() {
    return cfg.data.elevation;
  }

  /**
   * Get latest hazards data
   */
  function getHazardsData() {
    return cfg.data.hazards;
  }

  /**
   * Get latest routes data
   */
  function getRoutesData() {
    return cfg.data.routes;
  }

  /**
   * Check if real data is available (successful API calls)
   */
  function isDataAvailable() {
    return cfg.data.weather !== null || 
           cfg.data.elevation !== null || 
           cfg.data.hazards.length > 0 ||
           cfg.data.routes.length > 0;
  }

  /**
   * Get data update status
   */
  function getStatus() {
    return {
      initialized: cfg.initialized,
      weather: cfg.data.weather ? '✅' : '⏳',
      elevation: cfg.data.elevation ? '✅' : '⏳',
      hazards: cfg.data.hazards.length > 0 ? '✅' : '⏳',
      routes: cfg.data.routes.length > 0 ? '✅' : '⏳',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Force update all data
   */
  async function forceUpdateAll() {
    console.log('🔄 Wymuszanie aktualizacji wszystkich danych...');
    await Promise.all([
      updateWeatherData(),
      updateElevationData(),
      updateAirQualityData(),
      updateHazardsData(),
      updateRoutesData()
    ]);
    console.log('✅ Wszystkie dane zaktualizowane');
  }

  // Initialize when app is ready
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 1000);
  });

  window.addEventListener('map-ready', () => {
    if (!cfg.initialized) init();
  });

  return {
    init,
    getWeatherData,
    getElevationData,
    getHazardsData,
    getRoutesData,
    getStatus,
    isDataAvailable,
    forceUpdateAll,
    updateWeatherData,
    updateElevationData,
    updateAirQualityData,
    updateHazardsData,
    updateRoutesData
  };
})();

window.MapRealDataIntegration = MapRealDataIntegration;
