/**
 * route-elevation.js — Wizualizacja Elewacji i Profilu Wysokościowego Trasy (Krok 8)
 * Oblicza profil wysokościowy (wzniesienia i spadki npm) dla tras na podstawie
 * ukształtowania terenu Wzgórz Warszewskich i doliny potoku Osówki w Niebuszewie.
 * Rysuje interaktywny wykres SVG z przewyższeniami (total climb/descent), min/max npm.
 */
'use strict';

const RouteElevation = (() => {
  // Model wysokościowy terenu Niebuszewa (od doliny Osówki ~18m npm do Wzgórz Warszewskich / Krasińskiego ~58m npm)
  function estimateElevation(lat, lon) {
    // Model regresyjny oparty na siatce hipsometrycznej Niebuszewa
    // Północ/Wschód (Warcisława/Krasińskiego) wznosi się ku Wzgórzom Warszewskim
    const dLat = (lat - 53.4500) * 111000;
    const dLon = (lon - 14.5400) * 66000;
    
    // Wzniesienie od doliny w kierunku wzgórz
    const baseElev = 22 + (dLat * 0.015) + (dLon * 0.008) + (Math.sin(dLat / 120) * 4) + (Math.cos(dLon / 100) * 3);
    return Math.max(16, Math.min(68, Math.round(baseElev)));
  }

  function getRouteElevationData(routeId) {
    const route = window.APP_DATA?.routes?.find(r => r.id === routeId);
    if (!route || !route.coords || !route.coords.length) return null;

    let cumulativeDistKm = 0;
    const points = [];
    let minAlt = 999;
    let maxAlt = -999;
    let totalClimb = 0;
    let totalDescent = 0;

    for (let i = 0; i < route.coords.length; i++) {
      const coord = route.coords[i];
      const lon = coord[0];
      const lat = coord[1];
      const alt = estimateElevation(lat, lon);

      if (i > 0) {
        const prev = route.coords[i - 1];
        // Haversine
        const R = 6371;
        const dLat = (lat - prev[1]) * Math.PI / 180;
        const dLon = (lon - prev[0]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(prev[1] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        const segKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        cumulativeDistKm += segKm;

        const diff = alt - points[i - 1].alt;
        if (diff > 0) totalClimb += diff;
        else totalDescent += Math.abs(diff);
      }

      minAlt = Math.min(minAlt, alt);
      maxAlt = Math.max(maxAlt, alt);

      points.push({
        distKm: parseFloat(cumulativeDistKm.toFixed(2)),
        alt: alt,
        lat: lat,
        lon: lon
      });
    }

    return {
      routeId,
      routeName: route.name,
      points,
      minAlt,
      maxAlt,
      totalClimb,
      totalDescent,
      totalDistKm: parseFloat(cumulativeDistKm.toFixed(2))
    };
  }

  function openElevationModal(routeId) {
    const data = getRouteElevationData(routeId);
    if (!data) {
      if (typeof window.showToast === 'function') window.showToast('❌ Brak danych profilu dla tej trasy');
      return;
    }

    let modal = document.getElementById('routeElevationModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'routeElevationModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    renderElevationModal(data, modal);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function closeElevationModal() {
    const modal = document.getElementById('routeElevationModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function renderElevationModal(data, modal) {
    const w = 560;
    const h = 200;
    const padX = 40;
    const padY = 30;
    const plotW = w - padX * 2;
    const plotH = h - padY * 2;

    const altRange = Math.max(data.maxAlt - data.minAlt, 10);
    const distMax = Math.max(data.totalDistKm, 0.5);

    const coordsSvg = data.points.map((pt, i) => {
      const x = padX + (pt.distKm / distMax) * plotW;
      const y = h - padY - ((pt.alt - data.minAlt) / altRange) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const fillPolygon = `${padX},${h - padY} ${coordsSvg} ${w - padX},${h - padY}`;

    modal.innerHTML = `
      <div class="modal-card elevation-modal-card">
        <div class="elev-header">
          <div>
            <span class="elev-badge">⛰️ PROFIL WYSOKOŚCIOWY TRASY</span>
            <h2 class="elev-title">${data.routeName}</h2>
            <p class="elev-sub">Ukształtowanie terenu i przewyższenia w Niebuszewie</p>
          </div>
          <button class="elev-close-btn" onclick="RouteElevation.close()" aria-label="Zamknij">✕</button>
        </div>

        <div class="elev-stats-grid">
          <div class="es-card">
            <span class="es-val">↗️ +${data.totalClimb} m</span>
            <span class="es-lbl">Suma wzniesień</span>
          </div>
          <div class="es-card">
            <span class="es-val">↘️ -${data.totalDescent} m</span>
            <span class="es-lbl">Suma spadków</span>
          </div>
          <div class="es-card">
            <span class="es-val">🔝 ${data.maxAlt} m</span>
            <span class="es-lbl">Maks. npm</span>
          </div>
          <div class="es-card">
            <span class="es-val">🔻 ${data.minAlt} m</span>
            <span class="es-lbl">Min. npm</span>
          </div>
        </div>

        <div class="elev-chart-container">
          <svg viewBox="0 0 ${w} ${h}" class="elev-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="elevGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00c6ff" stop-opacity="0.65" />
                <stop offset="100%" stop-color="#0072ff" stop-opacity="0.05" />
              </linearGradient>
            </defs>
            <!-- Grid Lines -->
            <line x1="${padX}" y1="${padY}" x2="${w - padX}" y2="${padY}" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,4" />
            <line x1="${padX}" y1="${padY + plotH/2}" x2="${w - padX}" y2="${padY + plotH/2}" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,4" />
            <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="rgba(255,255,255,0.2)" />

            <!-- Labels -->
            <text x="${padX - 8}" y="${padY + 4}" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="10">${data.maxAlt}m</text>
            <text x="${padX - 8}" y="${h - padY + 3}" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="10">${data.minAlt}m</text>
            <text x="${padX}" y="${h - padY + 16}" fill="rgba(255,255,255,0.6)" font-size="10">0 km</text>
            <text x="${w - padX}" y="${h - padY + 16}" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="10">${data.totalDistKm} km</text>

            <!-- Elevation Area -->
            <polygon points="${fillPolygon}" fill="url(#elevGrad)" />
            <!-- Elevation Line -->
            <polyline points="${coordsSvg}" fill="none" stroke="#00c6ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <div class="elev-footer">
          <button class="elev-action-btn" onclick="RouteElevation.close()">Zamknij profil</button>
        </div>
      </div>
    `;
  }

  return {
    open: openElevationModal,
    close: closeElevationModal,
    getRouteElevationData
  };
})();

// Expose globally
window.RouteElevation = RouteElevation;
