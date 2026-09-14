/**
 * custom-route-builder.js — Generator Własnej Trasy / Trasa Skrojona na Miarę (Krok 5)
 * Pozwala użytkownikowi skomponować spersonalizowaną trasę spacerową/rowerową
 * z wybranych punktów POI, oblicza dystans, szacowany czas, kalorie i generuje plik GPX.
 */
'use strict';

const CustomRouteBuilder = (() => {
  const state = {
    isOpen: false,
    selectedPoiIds: [],
    routeType: 'walk', // 'walk' | 'bike' | 'run'
    routeName: 'Moja Własna Trasa po Niebuszewie',
    generatedRoute: null
  };

  function openBuilder() {
    state.isOpen = true;
    const modal = document.getElementById('customRouteModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    renderPoiSelector();
    recalculateRoute();
  }

  function closeBuilder() {
    state.isOpen = false;
    const modal = document.getElementById('customRouteModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function togglePoi(poiId) {
    const idx = state.selectedPoiIds.indexOf(poiId);
    if (idx > -1) {
      state.selectedPoiIds.splice(idx, 1);
    } else {
      if (state.selectedPoiIds.length >= 8) {
        if (typeof window.showToast === 'function') {
          window.showToast('⚠️ Maksymalnie 8 punktów w jednej trasie');
        }
        return;
      }
      state.selectedPoiIds.push(poiId);
    }
    renderPoiSelector();
    recalculateRoute();
  }

  function setRouteType(type) {
    state.routeType = type;
    document.querySelectorAll('.crb-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    recalculateRoute();
  }

  function renderPoiSelector() {
    const container = document.getElementById('crbPoiList');
    if (!container) return;

    const places = window.APP_DATA?.places || [];
    if (!places.length) {
      container.innerHTML = '<p style="color:var(--text2)">Brak punktów do wyboru</p>';
      return;
    }

    container.innerHTML = places.map(p => {
      const isSelected = state.selectedPoiIds.includes(p.id);
      const orderIdx = state.selectedPoiIds.indexOf(p.id);
      return `
        <button class="crb-poi-chip ${isSelected ? 'selected' : ''}" onclick="CustomRouteBuilder.togglePoi(${p.id})">
          <span class="crb-poi-order">${isSelected ? (orderIdx + 1) : '+'}</span>
          <span class="crb-poi-emoji">${p.emoji || '📍'}</span>
          <span class="crb-poi-name">${p.name}</span>
        </button>
      `;
    }).join('');
  }

  function calcHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function recalculateRoute() {
    const places = window.APP_DATA?.places || [];
    const selected = state.selectedPoiIds.map(id => places.find(p => p.id === id)).filter(Boolean);

    let totalDistKm = 0;
    const coords = [];
    const stops = [];

    for (let i = 0; i < selected.length; i++) {
      const p = selected[i];
      coords.push([p.coords[0], p.coords[1]]); // [lng, lat]
      stops.push({ name: p.name, addr: p.addr || '', emoji: p.emoji || '📍', coords: [p.coords[1], p.coords[0]] });

      if (i > 0) {
        const prev = selected[i - 1];
        totalDistKm += calcHaversine(prev.coords[1], prev.coords[0], p.coords[1], p.coords[0]);
      }
    }

    // Korekta o współczynnik krętości ulic (1.35x odległość po prostej)
    if (selected.length > 1) {
      totalDistKm = totalDistKm * 1.35;
    }

    const distNum = parseFloat(totalDistKm.toFixed(1));
    const speedKmH = state.routeType === 'bike' ? 14 : state.routeType === 'run' ? 9 : 4.5;
    const timeMinutes = Math.max(Math.round((distNum / speedKmH) * 60), selected.length ? 10 : 0);
    const met = state.routeType === 'bike' ? 6.0 : state.routeType === 'run' ? 9.0 : 3.5;
    const calories = Math.round(met * 70 * (timeMinutes / 60));

    state.generatedRoute = {
      id: 999,
      name: state.routeName,
      emoji: state.routeType === 'bike' ? '🚴' : state.routeType === 'run' ? '🏃' : '🚶',
      type: state.routeType,
      color: '#00c6ff',
      distance: `${distNum} km`,
      distanceNum: distNum,
      time: `${timeMinutes} min`,
      timeMin: timeMinutes,
      difficulty: distNum < 2 ? 'Łatwa' : distNum < 4 ? 'Średnia' : 'Wymagająca',
      difficultyLevel: distNum < 2 ? 1 : distNum < 4 ? 2 : 3,
      calories: calories,
      terrain: 'Mieszana (chodniki, ścieżki)',
      desc: `Własna trasa po Niebuszewie łącząca ${selected.length} punktów.`,
      stops: stops,
      coords: coords
    };

    // Aktualizacja podsumowania w UI
    const distEl = document.getElementById('crbDist');
    const timeEl = document.getElementById('crbTime');
    const kcalEl = document.getElementById('crbKcal');
    const stopsCountEl = document.getElementById('crbStopsCount');
    const actionBtn = document.getElementById('crbStartBtn');
    const gpxBtn = document.getElementById('crbGpxBtn');

    if (distEl) distEl.textContent = `${distNum} km`;
    if (timeEl) timeEl.textContent = `${timeMinutes} min`;
    if (kcalEl) kcalEl.textContent = `${calories} kcal`;
    if (stopsCountEl) stopsCountEl.textContent = selected.length;

    const hasEnoughPoints = selected.length >= 2;
    if (actionBtn) actionBtn.disabled = !hasEnoughPoints;
    if (gpxBtn) gpxBtn.disabled = !hasEnoughPoints;
  }

  function startCustomRoute() {
    if (!state.generatedRoute || state.selectedPoiIds.length < 2) {
      if (typeof window.showToast === 'function') {
        window.showToast('⚠️ Wybierz przynajmniej 2 punkty na trasie');
      }
      return;
    }

    closeBuilder();

    // Dodaj trasę do APP_DATA.routes jeśli jeszcze nie ma
    const existingIdx = window.APP_DATA.routes.findIndex(r => r.id === 999);
    if (existingIdx > -1) {
      window.APP_DATA.routes[existingIdx] = state.generatedRoute;
    } else {
      window.APP_DATA.routes.push(state.generatedRoute);
    }

    if (typeof window.startRouteGuide === 'function') {
      window.startRouteGuide(999);
    } else if (typeof window.showRouteOnMap === 'function') {
      window.showRouteOnMap(999);
    }
  }

  function downloadCustomGpx() {
    if (!state.generatedRoute || state.selectedPoiIds.length < 2) return;
    const app = window.__SZCZECIN_APP__;
    if (app && app.gpxExporter) {
      app.gpxExporter.downloadGpx(state.generatedRoute);
    } else if (typeof window.downloadRouteGpx === 'function') {
      // Pobieranie jako plik GPX
      const xml = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="NiebuszewoGuide"><trk><name>${state.generatedRoute.name}</name><trkseg>${state.generatedRoute.coords.map(c => `<trkpt lat="${c[1]}" lon="${c[0]}"></trkpt>`).join('')}</trkseg></trk></gpx>`;
      const blob = new Blob([xml], { type: 'application/gpx+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wlasna_trasa_niebuszewo.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    if (typeof window.showToast === 'function') {
      window.showToast('📥 Pobrano plik GPX własnej trasy!');
    }
  }

  return {
    open: openBuilder,
    close: closeBuilder,
    togglePoi,
    setRouteType,
    startCustomRoute,
    downloadCustomGpx,
    getState: () => ({ ...state })
  };
})();

window.CustomRouteBuilder = CustomRouteBuilder;
window.openCustomRouteBuilder = () => CustomRouteBuilder.open();
window.closeCustomRouteBuilder = () => CustomRouteBuilder.close();
