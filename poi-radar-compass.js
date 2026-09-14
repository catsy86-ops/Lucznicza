/**
 * poi-radar-compass.js — Inteligentny Kompas & Radar POI (Krok 3)
 * Śledzi pozycję GPS użytkownika, orientację kompasu (deviceorientation / compass heading)
 * i w czasie rzeczywistym wskazuje obracającą się igłą najbliższe miejsce w promieniu 500m.
 */
'use strict';

const PoiRadarCompass = (() => {
  const state = {
    userLat: null,
    userLng: null,
    userHeading: 0,
    nearestPoi: null,
    distanceMeters: null,
    bearingDeg: 0,
    radarAngle: 0,
    maxRadiusMeters: 500,
    active: true,
    watchId: null,
    hasOrientation: false
  };

  // Obliczenie odległości Haversine (w metrach)
  function calcDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Obliczenie azymutu / kąta geograficznego do celu (0-360 stopni)
  function calcBearingDeg(lat1, lon1, lat2, lon2) {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x =
      Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
      Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    let brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  }

  // Wyszukanie najbliższego POI z bazy danych
  function findNearestPoi(lat, lng) {
    const places = window.APP_DATA?.places || [];
    if (!places.length) return null;

    let closest = null;
    let minDistance = Infinity;

    for (const p of places) {
      if (!p.coords || p.coords.length < 2) continue;
      // p.coords: [lng, lat]
      const d = calcDistanceMeters(lat, lng, p.coords[1], p.coords[0]);
      if (d < minDistance) {
        minDistance = d;
        closest = p;
      }
    }

    return closest ? { place: closest, distance: minDistance } : null;
  }

  // Aktualizacja pozycji i kąta strzałki
  function updatePosition(lat, lng) {
    state.userLat = lat;
    state.userLng = lng;

    const result = findNearestPoi(lat, lng);
    const pill = document.getElementById('poiCompassPill');
    if (!pill) return;

    if (!result || result.distance > state.maxRadiusMeters) {
      // Jeśli w promieniu 500m nie ma POI, pokazujemy osiedlowe serce (Łucznicza 43) lub chowamy
      const fallbackDist = calcDistanceMeters(lat, lng, 53.4530, 14.5520);
      state.distanceMeters = fallbackDist;
      state.bearingDeg = calcBearingDeg(lat, lng, 53.4530, 14.5520);
      state.nearestPoi = { name: 'Centrum Osiedla', emoji: '🏹', coords: [14.5520, 53.4530] };
    } else {
      state.nearestPoi = result.place;
      state.distanceMeters = result.distance;
      state.bearingDeg = calcBearingDeg(lat, lng, result.place.coords[1], result.place.coords[0]);
    }

    renderPill();
  }

  // Odświeżenie widżetu DOM
  function renderPill() {
    const pill = document.getElementById('poiCompassPill');
    if (!pill || !state.nearestPoi) return;

    pill.classList.remove('hidden');

    const arrow = document.getElementById('poiCompassArrow');
    const nameEl = document.getElementById('poiCompassName');
    const distEl = document.getElementById('poiCompassDist');
    const emojiEl = document.getElementById('poiCompassEmoji');

    // Kąt strzałki = azymut celu minus azymut patrzenia użytkownika
    const relAngle = (state.bearingDeg - state.userHeading + 360) % 360;
    if (arrow) {
      arrow.style.transform = `rotate(${relAngle}deg)`;
    }

    if (nameEl) {
      nameEl.textContent = state.nearestPoi.name;
    }

    if (distEl) {
      distEl.textContent = state.distanceMeters < 1000
        ? `${state.distanceMeters}m`
        : `${(state.distanceMeters / 1000).toFixed(1)}km`;
    }

    if (emojiEl) {
      emojiEl.textContent = state.nearestPoi.emoji || '📍';
    }
  }

  // Kliknięcie w kompas centruje mapę na najbliższym punkcie
  function onPillClick() {
    if (!state.nearestPoi || !window.state?.map) return;
    const p = state.nearestPoi;
    const coords = [p.coords[1], p.coords[0]];
    window.state.map.flyTo(coords, 17, { animate: true, duration: 1 });
    if (typeof window.showToast === 'function') {
      window.showToast(`🎯 Najbliżej Ciebie: ${p.name} (${state.distanceMeters}m)`);
    }
    if (p.id && typeof window.openPlaceModal === 'function') {
      setTimeout(() => window.openPlaceModal(p.id), 600);
    }
  }

  // Inicjalizacja geolokalizacji i sensora kompasu
  function init() {
    const pill = document.getElementById('poiCompassPill');
    if (pill) {
      pill.addEventListener('click', onPillClick);
    }

    // Nasłuchiwanie orientacji urządzenia (żyroskop / magnetometr)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        if (e.webkitCompassHeading != null) {
          state.userHeading = e.webkitCompassHeading;
          state.hasOrientation = true;
          renderPill();
        } else if (e.alpha != null) {
          state.userHeading = (360 - e.alpha) % 360;
          state.hasOrientation = true;
          renderPill();
        }
      }, { passive: true });
    }

    // Geolokalizacja watchPosition
    if (navigator.geolocation) {
      state.watchId = navigator.geolocation.watchPosition(
        pos => {
          updatePosition(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Domyślna pozycja startowa na osiedlu Łucznicza
          updatePosition(53.4530, 14.5520);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 12000 }
      );
    } else {
      updatePosition(53.4530, 14.5520);
    }
  }

  return {
    init,
    updatePosition,
    calcDistanceMeters,
    calcBearingDeg,
    findNearestPoi,
    getState: () => ({ ...state })
  };
})();

window.PoiRadarCompass = PoiRadarCompass;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    PoiRadarCompass.init();
  }, 600);
});
