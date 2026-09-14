/**
 * navigation.js — Nawigacja krok po kroku w aplikacji
 * Używa OSRM (Open Source Routing Machine) — bezpłatne, bez klucza
 * Pokazuje trasę pieszą z instrukcjami krok po kroku
 */
'use strict';

const NAV_STATE = {
  active: false,
  routeLayer: null,
  startMarker: null,
  endMarker: null,
  steps: [],
  currentStep: 0,
  watchId: null,
  destination: null,
  panel: null,
  voiceEnabled: true,
  lastSpokenText: '',
  activeRoute: null,
  activeRouteStopIndex: 0,
  visitedStops: new Set()
};

// Voice synthesis helper for Polish speech
function speakGuidance(text, force = false) {
  if (!NAV_STATE.voiceEnabled && !force) return;
  if (!text || text === NAV_STATE.lastSpokenText) return;
  NAV_STATE.lastSpokenText = text;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'pl-PL';
      utt.rate = 1.0;
      utt.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const plVoice = voices.find(v => v.lang.startsWith('pl'));
      if (plVoice) utt.voice = plVoice;
      window.speechSynthesis.speak(utt);
    } catch (e) {
      console.warn('[Navigation Voice] Speech synthesis error:', e);
    }
  }
}

function toggleVoiceGuidance() {
  NAV_STATE.voiceEnabled = !NAV_STATE.voiceEnabled;
  if (!NAV_STATE.voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const voiceBtn = document.getElementById('npVoiceBtn');
  if (voiceBtn) {
    voiceBtn.textContent = NAV_STATE.voiceEnabled ? '🔊 Dźwięk' : '🔇 Wycisz';
    voiceBtn.classList.toggle('muted', !NAV_STATE.voiceEnabled);
  }
  showToast(NAV_STATE.voiceEnabled ? '🔊 Lektor głosowy włączony' : '🔇 Lektor wyciszony');
}
window.toggleVoiceGuidance = toggleVoiceGuidance;
window.speakGuidance = speakGuidance;

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

// ===== START NAVIGATION =====
async function startNavigation(destLat, destLon, destName) {
  const map = window.state?.map;
  if (!map) return;

  if (!navigator.geolocation) {
    showToast('❌ Geolokalizacja niedostępna');
    return;
  }

  showToast('🔄 Pobieranie lokalizacji...');

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      await buildRoute(lat, lon, destLat, destLon, destName);
    },
    () => {
      // Fallback: use district center as start
      buildRoute(53.4530, 14.5520, destLat, destLon, destName);
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
  );
}

async function buildRoute(startLat, startLon, endLat, endLon, destName) {
  const map = window.state?.map;
  if (!map) return;

  try {
    showToast('🗺️ Obliczanie trasy...');

    // OSRM foot routing
    const url = `${OSRM_BASE}/foot/${startLon},${startLat};${endLon},${endLat}?steps=true&geometries=geojson&overview=full&annotations=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM error');
    const data = await res.json();

    if (!data.routes?.length) throw new Error('No route found');

    const route = data.routes[0];
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    const steps = route.legs[0].steps;
    const distKm = (route.distance / 1000).toFixed(2);
    const timeMin = Math.round(route.duration / 60);

    // Clear previous route
    stopNavigation(false);

    // Draw route on map
    NAV_STATE.routeLayer = L.polyline(coords, {
      color: '#4285f4',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Start marker
    NAV_STATE.startMarker = L.marker([startLat, startLon], {
      icon: L.divIcon({
        html: '<div class="nav-start-marker">📍</div>',
        iconSize: [32, 32], iconAnchor: [16, 16], className: ''
      })
    }).addTo(map).bindPopup('📍 Start');

    // End marker
    NAV_STATE.endMarker = L.marker([endLat, endLon], {
      icon: L.divIcon({
        html: '<div class="nav-end-marker">🏁</div>',
        iconSize: [32, 32], iconAnchor: [16, 16], className: ''
      })
    }).addTo(map).bindPopup(`🏁 ${destName}`);

    // Fit bounds
    map.fitBounds(L.latLngBounds(coords), { padding: [60, 60] });

    // Parse steps
    NAV_STATE.steps = steps.map(s => ({
      instruction: translateInstruction(s.maneuver.type, s.maneuver.modifier, s.name),
      distance: s.distance,
      duration: s.duration,
      icon: getManeuverIcon(s.maneuver.type, s.maneuver.modifier)
    }));
    NAV_STATE.currentStep = 0;
    NAV_STATE.destination = { lat: endLat, lon: endLon, name: destName };
    NAV_STATE.active = true;

    // Show navigation panel
    showNavPanel(destName, distKm, timeMin);

    // Start tracking
    startTracking();

    showToast(`🗺️ Trasa do ${destName}: ${distKm} km, ~${timeMin} min`);

  } catch (err) {
    console.warn('Navigation error:', err);
    showToast('❌ Nie udało się obliczyć trasy. Sprawdź połączenie.');
  }
}

// ===== NAVIGATION PANEL =====
function showNavPanel(destName, distKm, timeMin) {
  let panel = document.getElementById('navPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'navPanel';
    panel.className = 'nav-panel';
    document.getElementById('map')?.appendChild(panel);
  }
  NAV_STATE.panel = panel;
  renderNavPanel(destName, distKm, timeMin);
}

function renderNavPanel(destName, distKm, timeMin) {
  const panel = NAV_STATE.panel;
  if (!panel) return;
  const step = NAV_STATE.steps[NAV_STATE.currentStep];
  const remaining = NAV_STATE.steps.slice(NAV_STATE.currentStep);
  const remDist = (remaining.reduce((s, r) => s + r.distance, 0) / 1000).toFixed(2);

  panel.innerHTML = `
    <div class="np-header">
      <div class="np-dest">🏁 ${destName}</div>
      <div class="np-meta">${remDist} km · ~${Math.round(remaining.reduce((s,r)=>s+r.duration,0)/60)} min</div>
      <button id="npVoiceBtn" class="np-voice-btn ${NAV_STATE.voiceEnabled ? '' : 'muted'}" onclick="toggleVoiceGuidance()" title="Włącz/wyłącz lektora">
        ${NAV_STATE.voiceEnabled ? '🔊 Głos' : '🔇 Wycisz'}
      </button>
      <button class="np-close" onclick="stopNavigation(true)">✕</button>
    </div>
    ${step ? `
      <div class="np-step">
        <div class="np-step-icon">${step.icon}</div>
        <div class="np-step-body">
          <div class="np-step-instruction">${step.instruction}</div>
          <div class="np-step-dist">${step.distance < 1000 ? Math.round(step.distance) + ' m' : (step.distance/1000).toFixed(1) + ' km'}</div>
        </div>
      </div>
    ` : '<div class="np-arrived">🎉 Dotarłeś do celu!</div>'}
    ${NAV_STATE.activeRoute ? `
      <div class="np-route-story" id="npRouteStory">
        <span class="np-story-badge">🎧 Audioprzewodnik Trasy</span>
        <span class="np-story-stop">Punkt: ${NAV_STATE.activeRoute.stops?.[NAV_STATE.activeRouteStopIndex]?.name || 'Trasa'}</span>
      </div>
    ` : ''}
    <div class="np-steps-list">
      ${NAV_STATE.steps.slice(NAV_STATE.currentStep, NAV_STATE.currentStep + 3).map((s, i) => `
        <div class="np-step-mini ${i === 0 ? 'current' : ''}">
          <span>${s.icon}</span>
          <span>${s.instruction}</span>
          <span class="np-step-mini-dist">${s.distance < 1000 ? Math.round(s.distance)+'m' : (s.distance/1000).toFixed(1)+'km'}</span>
        </div>
      `).join('')}
    </div>
    <div class="np-progress">
      <div class="np-progress-bar" style="width:${Math.round((NAV_STATE.currentStep / Math.max(NAV_STATE.steps.length-1, 1)) * 100)}%"></div>
    </div>
  `;
}

// ===== TRACKING & POSITION UPDATE =====
function startTracking() {
  if (NAV_STATE.watchId) navigator.geolocation.clearWatch(NAV_STATE.watchId);
  NAV_STATE.watchId = navigator.geolocation.watchPosition(
    pos => updatePosition(pos.coords.latitude, pos.coords.longitude),
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );
}

function updatePosition(lat, lon) {
  if (!NAV_STATE.active || !NAV_STATE.destination) return;
  const map = window.state?.map;

  // Check if arrived at main destination
  const dist = calcNavDist(lat, lon, NAV_STATE.destination.lat, NAV_STATE.destination.lon);
  if (dist < 0.03) { // 30m
    speakGuidance(`Dotarłeś do celu: ${NAV_STATE.destination.name}! Gratulacje.`);
    showToast('🎉 Dotarłeś do celu!');
    stopNavigation(true);
    return;
  }

  // Active Route Guided Tour Proximity Check (Stops along the route)
  if (NAV_STATE.activeRoute && Array.isArray(NAV_STATE.activeRoute.stops)) {
    NAV_STATE.activeRoute.stops.forEach((stop, idx) => {
      if (!NAV_STATE.visitedStops.has(stop.name)) {
        const sDist = calcNavDist(lat, lon, stop.coords[0], stop.coords[1]);
        if (sDist < 0.035) { // 35m proximity
          NAV_STATE.visitedStops.add(stop.name);
          NAV_STATE.activeRouteStopIndex = idx;
          const speechText = `Zbliżasz się do punktu: ${stop.name}. ${stop.desc || stop.addr || ''}`;
          speakGuidance(speechText);
          showToast(`🎧 ${stop.emoji || '📍'} Punkt trasy: ${stop.name}`);
          const storyEl = document.getElementById('npRouteStory');
          if (storyEl) {
            storyEl.innerHTML = `<span class="np-story-badge">🎧 Dotarłeś do: ${stop.name}</span>`;
          }
        }
      }
    });
  }

  // Update navigation step based on proximity
  if (NAV_STATE.steps.length > NAV_STATE.currentStep + 1) {
    const nextStep = NAV_STATE.steps[NAV_STATE.currentStep + 1];
    NAV_STATE.currentStep++;
    if (NAV_STATE.panel) renderNavPanel(NAV_STATE.destination.name, dist.toFixed(2), Math.round(dist * 12));
    if (nextStep && nextStep.instruction) {
      speakGuidance(nextStep.instruction);
    }
  }
}

// ===== ACTIVE ROUTE AUDIO GUIDE: "IDŹ ZE MNĄ" =====
async function startRouteGuide(routeId) {
  const route = window.APP_DATA?.routes?.find(r => r.id === routeId);
  if (!route) {
    showToast('❌ Nie znaleziono trasy');
    return;
  }

  if (!route.stops || !route.stops.length) {
    showToast('⚠️ Ta trasa nie ma zdefiniowanych punktów kontrolnych');
    return;
  }

  if (window.navigateTo) window.navigateTo('map');

  const firstStop = route.stops[0];
  const lastStop = route.stops[route.stops.length - 1];

  NAV_STATE.activeRoute = route;
  NAV_STATE.activeRouteStopIndex = 0;
  NAV_STATE.visitedStops = new Set();

  showToast(`🎧 Uruchomiono tryb "Idź ze mną": ${route.name}`);
  speakGuidance(`Rozpoczynamy przewodnik po trasie: ${route.name}. Udaj się do pierwszego punktu: ${firstStop.name}.`, true);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        await buildRoute(lat, lon, lastStop.coords[0], lastStop.coords[1], `${route.name} (Meta)`);
      },
      async () => {
        // Fallback from first stop to last stop
        await buildRoute(firstStop.coords[0], firstStop.coords[1], lastStop.coords[0], lastStop.coords[1], `${route.name} (Meta)`);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  } else {
    await buildRoute(firstStop.coords[0], firstStop.coords[1], lastStop.coords[0], lastStop.coords[1], `${route.name} (Meta)`);
  }
}
window.startRouteGuide = startRouteGuide;

function calcNavDist(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ===== STOP NAVIGATION =====
function stopNavigation(showMsg = true) {
  const map = window.state?.map;
  if (NAV_STATE.routeLayer && map) map.removeLayer(NAV_STATE.routeLayer);
  if (NAV_STATE.startMarker && map) map.removeLayer(NAV_STATE.startMarker);
  if (NAV_STATE.endMarker && map) map.removeLayer(NAV_STATE.endMarker);
  if (NAV_STATE.watchId) navigator.geolocation.clearWatch(NAV_STATE.watchId);
  if (NAV_STATE.panel) NAV_STATE.panel.remove();

  NAV_STATE.active = false;
  NAV_STATE.routeLayer = null;
  NAV_STATE.startMarker = null;
  NAV_STATE.endMarker = null;
  NAV_STATE.watchId = null;
  NAV_STATE.panel = null;
  NAV_STATE.steps = [];
  NAV_STATE.activeRoute = null;
  NAV_STATE.activeRouteStopIndex = 0;
  NAV_STATE.visitedStops.clear();
  NAV_STATE.lastSpokenText = '';
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch {}
  }

  if (showMsg) showToast('🗺️ Nawigacja zakończona');
}

// ===== INSTRUCTION TRANSLATION =====
function translateInstruction(type, modifier, name) {
  const street = name && name !== '' ? ` w ${name}` : '';
  const modMap = {
    left: 'w lewo', right: 'w prawo', straight: 'prosto',
    'slight left': 'lekko w lewo', 'slight right': 'lekko w prawo',
    'sharp left': 'ostro w lewo', 'sharp right': 'ostro w prawo',
    uturn: 'zawróć'
  };
  const mod = modMap[modifier] || modifier || '';

  switch (type) {
    case 'depart':    return `Ruszaj${street}`;
    case 'arrive':    return `Dotarłeś do celu${street}`;
    case 'turn':      return `Skręć ${mod}${street}`;
    case 'continue':  return `Kontynuuj prosto${street}`;
    case 'merge':     return `Wjedź${street}`;
    case 'fork':      return `Na rozwidleniu idź ${mod}${street}`;
    case 'roundabout':return `Na rondzie${street}`;
    case 'exit roundabout': return `Zjedź z ronda${street}`;
    case 'end of road': return `Na końcu drogi skręć ${mod}${street}`;
    default:          return `${type} ${mod}${street}`;
  }
}

function getManeuverIcon(type, modifier) {
  if (type === 'arrive') return '🏁';
  if (type === 'depart') return '▶️';
  if (type === 'roundabout' || type === 'exit roundabout') return '🔄';
  if (modifier === 'left' || modifier === 'sharp left') return '⬅️';
  if (modifier === 'right' || modifier === 'sharp right') return '➡️';
  if (modifier === 'slight left') return '↖️';
  if (modifier === 'slight right') return '↗️';
  if (modifier === 'uturn') return '↩️';
  return '⬆️';
}

// ===== EXPOSE =====
window.startNavigation = startNavigation;
window.stopNavigation = stopNavigation;
