/**
 * map-notifications-radar.js — Real-time notifications radar
 * Alerts for nearby places, events, weather changes, new content
 */
'use strict';

const MapNotificationsRadar = (() => {
  const cfg = {
    enabled: false,
    radius: 1000, // meters - scan area
    updateInterval: 30000, // 30 seconds
    notifyTypes: {
      newPlaces: true,
      events: true,
      weather: true,
      hazards: true,
      popular: true
    },
    notificationQueue: [],
    radarCenter: null
  };

  // Simulated new content
  const newContent = [
    {
      id: 1,
      type: 'place',
      emoji: '🍕',
      title: 'Nowa pizzeria: Sicilia',
      description: 'Otwarcie dzisiaj o 11:00',
      location: [53.4520, 14.5510],
      distance: 0.3
    },
    {
      id: 2,
      type: 'event',
      emoji: '🎉',
      title: 'Festyn osiedlowy',
      description: 'Jutro o 14:00 w Parku Kadziaka',
      location: [53.4510, 14.5437],
      distance: 0.5
    },
    {
      id: 3,
      type: 'place',
      emoji: '☕',
      title: 'Nowa kawiarnia: Coffee Zone',
      description: 'Miła atmosfera, WiFi gratis',
      location: [53.4548, 14.5519],
      distance: 0.2
    }
  ];

  function init(map, userLocation = null) {
    cfg.map = map;
    cfg.radarCenter = userLocation || map.getCenter();
    console.log('📢 Inicjalizacja radaru powiadomień...');
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
    startScan();
    showToast('📢 Radar powiadomień włączony');
  }

  function disable() {
    cfg.enabled = false;
    stopScan();
    showToast('📢 Radar powiadomień wyłączony');
  }

  function startScan() {
    // Scan for new content
    scanNewContent();

    // Periodic scanning
    cfg.scanTimer = setInterval(() => {
      if (cfg.enabled) {
        scanNewContent();
      }
    }, cfg.updateInterval);
  }

  function stopScan() {
    if (cfg.scanTimer) {
      clearInterval(cfg.scanTimer);
      cfg.scanTimer = null;
    }
  }

  function scanNewContent() {
    if (!cfg.enabled) return;

    const center = cfg.map.getCenter();
    const radiusKm = cfg.radius / 1000;

    // Check for nearby new places
    if (cfg.notifyTypes.newPlaces) {
      newContent.filter(c => c.type === 'place').forEach(place => {
        const dist = calculateDistance(center.lat, center.lng, place.location[0], place.location[1]);
        if (dist <= radiusKm) {
          queueNotification({
            type: 'place',
            title: place.title,
            description: place.description,
            emoji: place.emoji,
            distance: dist
          });
        }
      });
    }

    // Check for nearby events
    if (cfg.notifyTypes.events) {
      newContent.filter(c => c.type === 'event').forEach(event => {
        const dist = calculateDistance(center.lat, center.lng, event.location[0], event.location[1]);
        if (dist <= radiusKm) {
          queueNotification({
            type: 'event',
            title: event.title,
            description: event.description,
            emoji: event.emoji,
            distance: dist
          });
        }
      });
    }

    // Weather alerts
    if (cfg.notifyTypes.weather) {
      checkWeatherAlerts();
    }

    // Hazard alerts
    if (cfg.notifyTypes.hazards) {
      checkNearbyHazards();
    }

    // Process queue
    processNotificationQueue();
  }

  function checkWeatherAlerts() {
    // Simulate weather alerts
    const alerts = [
      { emoji: '🌧️', title: 'Prognoza deszczu', desc: 'Prawdopodobieństwo 70%' },
      { emoji: '💨', title: 'Ostrzeżenie przed wiatrem', desc: 'Porywy do 25 km/h' }
    ];

    if (Math.random() > 0.7) {
      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      queueNotification({
        type: 'weather',
        title: alert.title,
        description: alert.desc,
        emoji: alert.emoji
      });
    }
  }

  function checkNearbyHazards() {
    // Use MapHazardZones if available
    if (window.MapHazardZones) {
      const hazards = window.MapHazardZones.getNearbyHazards([cfg.map.getCenter().lat, cfg.map.getCenter().lng], 1);
      hazards.slice(0, 1).forEach(hazard => {
        queueNotification({
          type: 'hazard',
          title: hazard.name,
          description: hazard.description,
          emoji: '⚠️'
        });
      });
    }
  }

  function queueNotification(notification) {
    // Prevent duplicates
    const isDuplicate = cfg.notificationQueue.some(n =>
      n.title === notification.title && n.type === notification.type
    );

    if (!isDuplicate) {
      cfg.notificationQueue.push({
        ...notification,
        id: Date.now(),
        timestamp: new Date()
      });
    }
  }

  function processNotificationQueue() {
    if (cfg.notificationQueue.length === 0) return;

    // Show first notification
    const notification = cfg.notificationQueue.shift();
    displayNotification(notification);
  }

  function displayNotification(notification) {
    const container = document.getElementById('notificationRadarContainer') ||
      createNotificationContainer();

    const card = document.createElement('div');
    card.className = 'notification-radar-card';
    card.innerHTML = `
      <div class="nrc-icon">${notification.emoji}</div>
      <div class="nrc-content">
        <div class="nrc-title">${notification.title}</div>
        <div class="nrc-desc">${notification.description}</div>
        ${notification.distance ? `<div class="nrc-dist">📍 ${notification.distance.toFixed(2)} km</div>` : ''}
      </div>
      <button class="nrc-close" onclick="this.closest('.notification-radar-card').remove()">✕</button>
    `;

    container.appendChild(card);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      card.classList.add('fadeout');
      setTimeout(() => card.remove(), 300);
      processNotificationQueue();
    }, 6000);
  }

  function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationRadarContainer';
    container.className = 'notification-radar-container';
    document.body.appendChild(container);
    return container;
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

  function setRadius(radiusMeters) {
    cfg.radius = radiusMeters;
    showToast(`📢 Promień radaru: ${radiusMeters}m`);
  }

  function setUpdateInterval(intervalSeconds) {
    cfg.updateInterval = intervalSeconds * 1000;
    if (cfg.enabled) {
      stopScan();
      startScan();
    }
  }

  function toggleNotificationType(type, enabled) {
    cfg.notifyTypes[type] = enabled;
    showToast(`📢 ${type}: ${enabled ? 'włączone' : 'wyłączone'}`);
  }

  function getNotificationQueue() {
    return cfg.notificationQueue;
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    setRadius,
    setUpdateInterval,
    toggleNotificationType,
    getNotificationQueue,
    getNewContent: () => newContent
  };
})();

window.MapNotificationsRadar = MapNotificationsRadar;
