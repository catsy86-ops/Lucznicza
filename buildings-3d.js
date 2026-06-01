/**
 * buildings-3d.js — Realistyczne budynki 3D na mapie Leaflet
 * Renderuje budynki z OSM jako ekstrudowane bryły 3D na canvas overlay.
 * Projekcja footprintów do pikseli ekranu + ekstruzja w górę = efekt 3D.
 * Skupione na okolicy Łucznicza 43, Szczecin.
 */
'use strict';

const Buildings3D = (() => {
  const cfg = {
    enabled: false,
    loading: false,
    canvas: null,
    ctx: null,
    map: null,
    buildingsData: [],
    metersPerPixelCache: 1,
    heightScale: 1.8,
    extrudeX: 0,
    extrudeY: -1,
    zoomThreshold: 14,   // niższy próg — budynki widoczne już od zoom 14
    colorScheme: 'realistic',
    selectedBuilding: null,
    center: { lat: 53.4525, lon: 14.5490 },  // centrum Łucznicza 43
  };

  // Kolory budynków wg typu (ściana jasna, ściana ciemna, dach)
  const TYPE_COLORS = {
    apartments:  { light: '#e8c9a0', dark: '#b8966a', roof: '#9c6b42' },
    residential: { light: '#e6c9a8', dark: '#bb9a72', roof: '#a0682f' },
    house:       { light: '#f0dcb8', dark: '#c4a572', roof: '#b5763a' },
    detached:    { light: '#f2e3c8', dark: '#c8a87e', roof: '#c47b3a' },
    commercial:  { light: '#c4d4e4', dark: '#8ba6c0', roof: '#5a7da0' },
    retail:      { light: '#bcd6e8', dark: '#82a4c0', roof: '#4a6da0' },
    industrial:  { light: '#d0d0d0', dark: '#9a9a9a', roof: '#707070' },
    garage:      { light: '#c0c0c0', dark: '#909090', roof: '#686868' },
    garages:     { light: '#c0c0c0', dark: '#909090', roof: '#686868' },
    school:      { light: '#f5d9a8', dark: '#d0a860', roof: '#cc7a1a' },
    church:      { light: '#f5ecc8', dark: '#d4bf80', roof: '#b8941a' },
    office:      { light: '#dcd6f5', dark: '#aaa0d8', roof: '#7060c0' },
    yes:         { light: '#dcdcdc', dark: '#a8a8a8', roof: '#888888' },
  };

  function getHeightColors(levels) {
    if (levels <= 1) return { light: '#a8e6a8', dark: '#7ac07a', roof: '#4a9c4a' };
    if (levels <= 2) return { light: '#b8e890', dark: '#90c068', roof: '#5a9c2a' };
    if (levels <= 4) return { light: '#ffe070', dark: '#d0b040', roof: '#c08a1a' };
    if (levels <= 6) return { light: '#ffb060', dark: '#d08030', roof: '#c05a1a' };
    return { light: '#ff8070', dark: '#d05040', roof: '#c0301a' };
  }

  function getColors(b) {
    if (cfg.colorScheme === 'height') return getHeightColors(b.levels);
    if (cfg.colorScheme === 'type') return TYPE_COLORS[b.type] || TYPE_COLORS.yes;
    // realistic
    if (b.color && b.color.charAt(0) === '#') {
      return { light: b.color, dark: shade(b.color, 0.75), roof: shade(b.color, 0.6) };
    }
    return TYPE_COLORS[b.type] || TYPE_COLORS.yes;
  }

  function shade(hex, factor) {
    if (!hex || hex.charAt(0) !== '#') return hex || '#999';
    const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
    const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
    const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
    return `rgb(${r},${g},${b})`;
  }

  // ===== TOGGLE =====
  async function toggle() {
    if (cfg.enabled) { disable(); return; }
    await enable();
  }

  async function enable() {
    const map = window.state?.map;
    if (!map) {
      if (typeof showToast === 'function') showToast('⚠️ Mapa jeszcze się ładuje, spróbuj za chwilę...');
      console.warn('Buildings3D: map not ready yet (window.state.map is undefined)');
      return;
    }
    if (cfg.loading) return;
    cfg.map = map;
    cfg.loading = true;

    if (typeof showToast === 'function') showToast('🏢 Ładowanie budynków 3D...');

    try {
      const data = await fetchBuildings(cfg.center.lat, cfg.center.lon, 400);
      cfg.buildingsData = (data.elements && data.elements.length)
        ? data.elements
        : getHardcodedBuildings();
    } catch (err) {
      console.warn('Buildings 3D fetch error:', err);
      cfg.buildingsData = getHardcodedBuildings();
    }

    cfg.loading = false;
    cfg.enabled = true;

    createCanvas();
    bindMapEvents();
    updateSunPosition();

    // Fly to Łucznicza 43 area at a good 3D zoom
    map.flyTo([cfg.center.lat, cfg.center.lon], 16, { animate: true, duration: 1.5 });
    map.once('moveend', render);
    setTimeout(render, 200);

    buildControls();

    if (typeof showToast === 'function') {
      showToast(`🏢 ${cfg.buildingsData.length} budynków 3D — Łucznicza 43 i okolice`);
    }
  }

  function disable() {
    unbindMapEvents();
    if (cfg.canvas) { cfg.canvas.remove(); cfg.canvas = null; cfg.ctx = null; }
    cfg.enabled = false;
    cfg.selectedBuilding = null;
    removeControls();
    const popup = document.getElementById('b3dInfoPopup');
    if (popup) popup.remove();
    if (typeof showToast === 'function') showToast('🏢 Budynki 3D wyłączone');
  }

  // ===== CANVAS SETUP =====
  function createCanvas() {
    const map = cfg.map;
    const size = map.getSize();

    // Attach canvas directly to the map container (fixed to viewport, not panned)
    // We re-project all buildings on every move event, so the canvas stays at 0,0.
    const container = map.getContainer();
    const canvas = L.DomUtil.create('canvas', 'buildings-3d-canvas');
    canvas.width = size.x;
    canvas.height = size.y;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 400;
    container.appendChild(canvas);

    cfg.canvas = canvas;
    cfg.ctx = canvas.getContext('2d');

    // Click detection on the map (canvas itself is pointer-events:none)
    map.on('click', onMapClick);
  }

  function repositionCanvas() {
    const map = cfg.map;
    if (!cfg.canvas) return;
    const size = map.getSize();
    if (cfg.canvas.width !== size.x) cfg.canvas.width = size.x;
    if (cfg.canvas.height !== size.y) cfg.canvas.height = size.y;
    // Canvas is fixed at 0,0 in the container — no repositioning needed.
    // All buildings are projected via latLngToContainerPoint on each render.
  }

  // ===== RENDER =====
  // RAF-throttled render for smooth panning
  let rafPending = false;
  function renderThrottled() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      render();
    });
  }

  function render() {
    if (!cfg.enabled || !cfg.ctx || !cfg.map) return;
    const map = cfg.map;

    repositionCanvas();

    const ctx = cfg.ctx;
    ctx.clearRect(0, 0, cfg.canvas.width, cfg.canvas.height);

    const zoom = map.getZoom();
    if (zoom < cfg.zoomThreshold) {
      // too zoomed out — show hint
      ctx.fillStyle = 'rgba(108,99,255,0.9)';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏢 Przybliż mapę aby zobaczyć budynki 3D', cfg.canvas.width / 2, 40);
      return;
    }

    // Height scale grows with zoom for stronger 3D effect when close
    const zoomFactor = Math.pow(2, zoom - 17);
    const hScale = cfg.heightScale * zoomFactor;

    const W = cfg.canvas.width;
    const H = cfg.canvas.height;
    const margin = 100; // pixels off-screen still rendered (for tall buildings)

    // Build render list with projected points + depth (for painter's algo)
    // Viewport culling: skip buildings entirely off-screen
    const renderList = [];
    for (const b of cfg.buildingsData) {
      const pts = b.coords.map(c => {
        const p = map.latLngToContainerPoint([c[0], c[1]]);
        return [p.x, p.y];
      });
      // Bounding box check
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of pts) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      }
      if (maxX < -margin || minX > W + margin || maxY < -margin || minY > H + margin) {
        continue; // off-screen — skip
      }
      const centroid = centroidOf(pts);
      renderList.push({ b, pts, centroid });
    }

    // Painter's algorithm: draw far (top of screen) first, near (bottom) last
    renderList.sort((a, b) => a.centroid[1] - b.centroid[1]);

    renderList.forEach(({ b, pts }) => {
      drawBuilding(ctx, b, pts, hScale);
    });
  }

  function drawBuilding(ctx, b, basePts, hScale) {
    if (basePts.length < 3) return;

    const levels = b.levels || 3;
    const heightPx = Math.max(4, levels * 3 * hScale); // metry → piksele
    const colors = getColors(b);

    const isSelected = cfg.selectedBuilding && cfg.selectedBuilding.id === b.id;

    // Roof points = base points moved up by heightPx
    const roofPts = basePts.map(p => [p[0] + cfg.extrudeX * heightPx, p[1] + cfg.extrudeY * heightPx]);

    // 1) Draw ground shadow (offset down-right)
    ctx.beginPath();
    const shadowOffset = heightPx * 0.25;
    basePts.forEach((p, i) => {
      const x = p[0] + shadowOffset, y = p[1] + shadowOffset * 0.5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fill();

    // 2) Draw walls (sides). Draw far walls first, near walls last (painter's).
    // Use modulo to always close the polygon (handles both closed & open rings).
    const bCentroid = centroidOf(basePts);
    const n = basePts.length;
    const wallEdges = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      // Skip degenerate closing edge if ring is already closed (last == first)
      if (i === n - 1 &&
          basePts[i][0] === basePts[0][0] &&
          basePts[i][1] === basePts[0][1]) continue;
      wallEdges.push({ i, j, baseY: Math.max(basePts[i][1], basePts[j][1]) });
    }
    wallEdges.sort((a, b) => a.baseY - b.baseY); // far (low y) first

    wallEdges.forEach(({ i, j }) => {
      const b1 = basePts[i];
      const b2 = basePts[j];
      const r1 = roofPts[i];
      const r2 = roofPts[j];

      // Front walls (lower edge of building, facing viewer) are brighter
      const isFront = (b1[1] + b2[1]) / 2 >= bCentroid[1];

      ctx.beginPath();
      ctx.moveTo(b1[0], b1[1]);
      ctx.lineTo(b2[0], b2[1]);
      ctx.lineTo(r2[0], r2[1]);
      ctx.lineTo(r1[0], r1[1]);
      ctx.closePath();

      ctx.fillStyle = isFront ? colors.light : colors.dark;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 3) Draw roof (top face)
    ctx.beginPath();
    roofPts.forEach((p, i) => {
      i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.fillStyle = isSelected ? '#6c63ff' : colors.roof;
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#fff' : 'rgba(0,0,0,0.3)';
    ctx.lineWidth = isSelected ? 2 : 0.8;
    ctx.stroke();

    // 4) Label for taller/named buildings when zoomed in
    if (cfg.map.getZoom() >= 18 && (b.address?.trim() || b.name)) {
      const c = centroidOf(roofPts);
      const label = (b.address?.trim() || b.name).replace('ul. ', '');
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 2.5;
      ctx.strokeText(label, c[0], c[1]);
      ctx.fillText(label, c[0], c[1]);
    }
  }

  function centroidOf(pts) {
    let x = 0, y = 0;
    pts.forEach(p => { x += p[0]; y += p[1]; });
    return [x / pts.length, y / pts.length];
  }

  // ===== CLICK DETECTION =====
  function onMapClick(e) {
    if (!cfg.enabled) return;
    const map = cfg.map;
    const clickPt = map.latLngToContainerPoint(e.latlng);

    // Check which building footprint contains the click
    for (const b of cfg.buildingsData) {
      const pts = b.coords.map(c => {
        const p = map.latLngToContainerPoint([c[0], c[1]]);
        return [p.x, p.y];
      });
      if (pointInPolygon([clickPt.x, clickPt.y], pts)) {
        selectBuilding(b, e.latlng);
        return;
      }
    }
  }

  function pointInPolygon(point, vs) {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function selectBuilding(b, latlng) {
    cfg.selectedBuilding = b;
    render();

    const typeLabel = {
      apartments: 'Blok mieszkalny', residential: 'Budynek mieszkalny',
      house: 'Dom', detached: 'Dom wolnostojący', commercial: 'Budynek handlowy',
      retail: 'Sklep', industrial: 'Budynek przemysłowy', garage: 'Garaż',
      garages: 'Garaże', school: 'Szkoła', church: 'Kościół', office: 'Biurowiec',
      yes: 'Budynek'
    }[b.type] || 'Budynek';

    // Estimate energy efficiency based on construction year
    const estimatedYear = b.year || getEstimatedYear(b.type);
    const energyLabel = getEnergyLabel(estimatedYear);

    const label = b.address?.trim() || b.name || 'Budynek';
    const height = Math.round(b.levels * 3);

    const content = `
      <div class="b3d-popup">
        <div class="b3d-popup-header">🏢 ${label}</div>
        <div class="b3d-popup-body">
          <div class="b3d-info-row"><span>📋</span> ${typeLabel}</div>
          <div class="b3d-info-row"><span>🏗️</span> ${b.levels} pięter (~${height}m)</div>
          ${estimatedYear ? `<div class="b3d-info-row"><span>📅</span> ok. ${estimatedYear} roku</div>` : ''}
          <div class="b3d-info-row energy-info">
            <span>${energyLabel.emoji}</span>
            <span style="font-weight:500">${energyLabel.label}</span>
          </div>
          ${b.name ? `<div class="b3d-info-row"><span>🏷️</span> ${b.name}</div>` : ''}
          ${b.id < 100000 ? '' : `<div class="b3d-info-row"><span>🔗</span> <a href="https://www.openstreetmap.org/way/${b.id}" target="_blank" rel="noopener" style="color:#2980b9">OpenStreetMap</a></div>`}
          <div class="b3d-info-tip">💡 Dane ze zbiorów OpenStreetMap</div>
        </div>
      </div>
    `;

    L.popup({ className: 'building-3d-popup', maxWidth: 260 })
      .setLatLng(latlng)
      .setContent(content)
      .openOn(cfg.map);
  }

  function getEstimatedYear(buildingType) {
    const typeYears = {
      apartments: 1973, residential: 1975, house: 1980,
      commercial: 1990, retail: 1995, industrial: 1970,
      school: 1975, office: 2000
    };
    return typeYears[buildingType] || null;
  }

  function getEnergyLabel(year) {
    if (!year) return { emoji: '🔋', label: 'Brak danych' };
    if (year < 1960) return { emoji: '🔴', label: 'Niska efektywność' };
    if (year < 1980) return { emoji: '🟠', label: 'Średnia efektywność' };
    if (year < 2000) return { emoji: '🟡', label: 'Dobra efektywność' };
    if (year < 2010) return { emoji: '🟢', label: 'Wysoka efektywność' };
    return { emoji: '🟢', label: 'Nowoczesna' };
  }

  // ===== MAP EVENTS =====
  function bindMapEvents() {
    const map = cfg.map;
    map.on('move', renderThrottled);
    map.on('zoom', renderThrottled);
    map.on('moveend', render);
    map.on('zoomend', render);
    map.on('resize', render);
  }

  function unbindMapEvents() {
    const map = cfg.map;
    if (!map) return;
    map.off('move', renderThrottled);
    map.off('zoom', renderThrottled);
    map.off('moveend', render);
    map.off('zoomend', render);
    map.off('resize', render);
    map.off('click', onMapClick);
  }

  // ===== SUN POSITION (affects extrude direction slightly) =====
  function updateSunPosition() {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    // Slight horizontal lean based on time of day (morning lean right, evening lean left)
    if (hour < 12) {
      cfg.extrudeX = 0.15; // morning — buildings lean right
    } else {
      cfg.extrudeX = -0.15; // afternoon — lean left
    }
    cfg.extrudeY = -1;
  }

  // ===== FETCH =====
  async function fetchBuildings(lat, lon, radius) {
    const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);

    if (!isLocal) {
      try {
        const res = await fetch(`/api/buildings?lat=${lat}&lon=${lon}&radius=${radius}`);
        if (res.ok) {
          const data = await res.json();
          if (data.elements && data.elements.length) return data;
        }
      } catch (e) { console.warn('Buildings API failed:', e); }
    }

    // Direct Overpass fallback (works on localhost too)
    try {
      const latD = radius / 111320;
      const lonD = radius / (111320 * Math.cos(lat * Math.PI / 180));
      const query = `[out:json][timeout:25];(way["building"](${lat-latD},${lon-lonD},${lat+latD},${lon+lonD}););out body geom;`;

      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });

      if (res.ok) {
        const data = await res.json();
        const elements = (data.elements || []).map(el => ({
          id: el.id,
          coords: (el.geometry || []).map(g => [g.lat, g.lon]),
          levels: parseInt(el.tags?.['building:levels']) || guessLevels(el.tags?.building),
          height: parseFloat(el.tags?.height) || 0,
          name: el.tags?.name || '',
          address: ((el.tags?.['addr:street'] || '') + ' ' + (el.tags?.['addr:housenumber'] || '')).trim(),
          type: el.tags?.building || 'yes',
          color: el.tags?.['building:colour'] || ''
        })).filter(b => b.coords.length >= 3);
        return { elements };
      }
    } catch (e) { console.warn('Direct Overpass failed:', e); }

    return { elements: [] };
  }

  function guessLevels(type) {
    const m = { apartments: 5, residential: 4, house: 2, detached: 2, commercial: 3, retail: 2, industrial: 2, garage: 1, garages: 1, school: 3, church: 4, office: 4, yes: 3 };
    return m[type] || 3;
  }

  // ===== CONTROLS =====
  function buildControls() {
    const mapEl = document.getElementById('map');
    if (!mapEl || document.getElementById('b3dControls')) return;

    const ctrl = document.createElement('div');
    ctrl.id = 'b3dControls';
    ctrl.className = 'b3d-controls';
    ctrl.innerHTML = `
      <div class="b3d-ctrl-header">
        <span>🏢 Budynki 3D</span>
        <button class="b3d-close" id="b3dCloseBtn" title="Zamknij">✕</button>
      </div>
      <div class="b3d-ctrl-body">
        <div class="b3d-fly-btns">
          <button class="b3d-fly-btn active" id="b3dFlyMain" title="Leć do Łuczniczej 43">🏢 Łucznicza 43</button>
          <button class="b3d-fly-btn" id="b3dFlySchool" title="Leć do szkoły">🏫 Szkoła</button>
          <button class="b3d-fly-btn" id="b3dFlyTarczowa" title="Leć do Tarczowej">🏘️ Tarczowa</button>
        </div>
        <label class="b3d-label">Kolorowanie:</label>
        <select id="b3dColorScheme" class="b3d-select">
          <option value="realistic">🎨 Realistyczne</option>
          <option value="height">📊 Wg wysokości</option>
          <option value="type">🏷️ Wg typu</option>
        </select>
        <label class="b3d-label">Skala wysokości:</label>
        <input type="range" id="b3dHeight" min="50" max="400" value="${cfg.heightScale * 100}" class="b3d-range" />
        <div class="b3d-stats" id="b3dStats">
          📊 ${cfg.buildingsData.length} budynków
          · ${cfg.buildingsData.filter(b => b.type === 'apartments' || b.type === 'residential').length} bloków
          · ${cfg.buildingsData.filter(b => b.type === 'garages').length} garaży
        </div>
        <div class="b3d-hint">👆 Kliknij budynek aby zobaczyć szczegóły</div>
      </div>
    `;
    mapEl.appendChild(ctrl);

    // Close
    document.getElementById('b3dCloseBtn').addEventListener('click', () => {
      disable();
      ['btnQuick3D', 'btnBuildings3D', 'buildings3dFab'].forEach(id => {
        document.getElementById(id)?.classList.remove('active');
      });
    });

    // Fly-to buttons
    document.getElementById('b3dFlyMain').addEventListener('click', () => {
      cfg.map.flyTo([53.4525, 14.5490], 17, { animate: true, duration: 1.2 });
      document.querySelectorAll('.b3d-fly-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('b3dFlyMain').classList.add('active');
    });
    document.getElementById('b3dFlySchool').addEventListener('click', () => {
      cfg.map.flyTo([53.4530, 14.5510], 17, { animate: true, duration: 1.2 });
      document.querySelectorAll('.b3d-fly-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('b3dFlySchool').classList.add('active');
    });
    document.getElementById('b3dFlyTarczowa').addEventListener('click', () => {
      cfg.map.flyTo([53.4515, 14.5500], 17, { animate: true, duration: 1.2 });
      document.querySelectorAll('.b3d-fly-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('b3dFlyTarczowa').classList.add('active');
    });

    // Color scheme
    document.getElementById('b3dColorScheme').value = cfg.colorScheme;
    document.getElementById('b3dColorScheme').addEventListener('change', (e) => {
      cfg.colorScheme = e.target.value;
      render();
    });

    // Height scale
    document.getElementById('b3dHeight').addEventListener('input', (e) => {
      cfg.heightScale = parseInt(e.target.value) / 100;
      render();
    });
  }

  function removeControls() {
    document.getElementById('b3dControls')?.remove();
  }

  // ===== HARDCODED BUILDINGS — Łucznicza 43 i okolice (rozbudowane) =====
  // Współrzędne oparte na rzeczywistym układzie ulic Łucznicza / Tarczowa / Bandurskiego
  // Każdy budynek ma dokładny kształt wielokąta, liczbę pięter, kolor i typ.
  function getHardcodedBuildings() {
    return [

      // ══════════════════════════════════════════════
      // BLOKI PRZY UL. ŁUCZNICZEJ (strona nieparzysta)
      // ══════════════════════════════════════════════

      // Łucznicza 43 — główny budynek (11-kondygnacyjny wieżowiec)
      {
        id: 1001,
        coords: [
          [53.45410, 14.54718], [53.45410, 14.54782],
          [53.45392, 14.54782], [53.45392, 14.54718],
          [53.45410, 14.54718]
        ],
        levels: 11, name: 'Łucznicza 43', address: 'ul. Łucznicza 43',
        type: 'apartments', color: '#c8b89a'
      },

      // Łucznicza 41 — blok 5-piętrowy
      {
        id: 1002,
        coords: [
          [53.45432, 14.54718], [53.45432, 14.54782],
          [53.45414, 14.54782], [53.45414, 14.54718],
          [53.45432, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 41',
        type: 'apartments', color: '#d4c4a8'
      },

      // Łucznicza 39 — blok 5-piętrowy
      {
        id: 1003,
        coords: [
          [53.45454, 14.54718], [53.45454, 14.54782],
          [53.45436, 14.54782], [53.45436, 14.54718],
          [53.45454, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 39',
        type: 'apartments', color: '#d4c4a8'
      },

      // Łucznicza 37 — blok 5-piętrowy
      {
        id: 1004,
        coords: [
          [53.45476, 14.54718], [53.45476, 14.54782],
          [53.45458, 14.54782], [53.45458, 14.54718],
          [53.45476, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 37',
        type: 'apartments', color: '#c8b89a'
      },

      // Łucznicza 35 — blok 5-piętrowy
      {
        id: 1005,
        coords: [
          [53.45498, 14.54718], [53.45498, 14.54782],
          [53.45480, 14.54782], [53.45480, 14.54718],
          [53.45498, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 35',
        type: 'apartments', color: '#d4c4a8'
      },

      // Łucznicza 45 — blok 5-piętrowy
      {
        id: 1006,
        coords: [
          [53.45388, 14.54718], [53.45388, 14.54782],
          [53.45370, 14.54782], [53.45370, 14.54718],
          [53.45388, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 45',
        type: 'apartments', color: '#c8b89a'
      },

      // Łucznicza 47 — blok 5-piętrowy
      {
        id: 1007,
        coords: [
          [53.45366, 14.54718], [53.45366, 14.54782],
          [53.45348, 14.54782], [53.45348, 14.54718],
          [53.45366, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 47',
        type: 'apartments', color: '#d4c4a8'
      },

      // Łucznicza 49 — blok 5-piętrowy
      {
        id: 1008,
        coords: [
          [53.45344, 14.54718], [53.45344, 14.54782],
          [53.45326, 14.54782], [53.45326, 14.54718],
          [53.45344, 14.54718]
        ],
        levels: 5, name: '', address: 'ul. Łucznicza 49',
        type: 'apartments', color: '#c8b89a'
      },

      // ══════════════════════════════════════════════
      // BLOKI PRZY UL. ŁUCZNICZEJ (strona parzysta)
      // ══════════════════════════════════════════════

      // Łucznicza 44 — blok 4-piętrowy (naprzeciwko 43)
      {
        id: 1010,
        coords: [
          [53.45410, 14.54670], [53.45410, 14.54710],
          [53.45392, 14.54710], [53.45392, 14.54670],
          [53.45410, 14.54670]
        ],
        levels: 4, name: '', address: 'ul. Łucznicza 44',
        type: 'apartments', color: '#bfb09a'
      },

      // Łucznicza 42
      {
        id: 1011,
        coords: [
          [53.45432, 14.54670], [53.45432, 14.54710],
          [53.45414, 14.54710], [53.45414, 14.54670],
          [53.45432, 14.54670]
        ],
        levels: 4, name: '', address: 'ul. Łucznicza 42',
        type: 'apartments', color: '#c8b89a'
      },

      // Łucznicza 40
      {
        id: 1012,
        coords: [
          [53.45454, 14.54670], [53.45454, 14.54710],
          [53.45436, 14.54710], [53.45436, 14.54670],
          [53.45454, 14.54670]
        ],
        levels: 4, name: '', address: 'ul. Łucznicza 40',
        type: 'apartments', color: '#bfb09a'
      },

      // Łucznicza 46
      {
        id: 1013,
        coords: [
          [53.45388, 14.54670], [53.45388, 14.54710],
          [53.45370, 14.54710], [53.45370, 14.54670],
          [53.45388, 14.54670]
        ],
        levels: 4, name: '', address: 'ul. Łucznicza 46',
        type: 'apartments', color: '#c8b89a'
      },

      // Łucznicza 48
      {
        id: 1014,
        coords: [
          [53.45366, 14.54670], [53.45366, 14.54710],
          [53.45348, 14.54710], [53.45348, 14.54670],
          [53.45366, 14.54670]
        ],
        levels: 4, name: '', address: 'ul. Łucznicza 48',
        type: 'apartments', color: '#bfb09a'
      },

      // ══════════════════════════════════════════════
      // BLOKI PRZY UL. TARCZOWEJ
      // ══════════════════════════════════════════════

      // Tarczowa 8 — blok 5-piętrowy
      {
        id: 1020,
        coords: [
          [53.45480, 14.54800], [53.45480, 14.54860],
          [53.45462, 14.54860], [53.45462, 14.54800],
          [53.45480, 14.54800]
        ],
        levels: 5, name: '', address: 'ul. Tarczowa 8',
        type: 'residential', color: '#c4b8a0'
      },

      // Tarczowa 10
      {
        id: 1021,
        coords: [
          [53.45458, 14.54800], [53.45458, 14.54860],
          [53.45440, 14.54860], [53.45440, 14.54800],
          [53.45458, 14.54800]
        ],
        levels: 5, name: '', address: 'ul. Tarczowa 10',
        type: 'residential', color: '#d0c4aa'
      },

      // Tarczowa 12
      {
        id: 1022,
        coords: [
          [53.45436, 14.54800], [53.45436, 14.54860],
          [53.45418, 14.54860], [53.45418, 14.54800],
          [53.45436, 14.54800]
        ],
        levels: 5, name: '', address: 'ul. Tarczowa 12',
        type: 'residential', color: '#c4b8a0'
      },

      // Tarczowa 14
      {
        id: 1023,
        coords: [
          [53.45414, 14.54800], [53.45414, 14.54860],
          [53.45396, 14.54860], [53.45396, 14.54800],
          [53.45414, 14.54800]
        ],
        levels: 5, name: '', address: 'ul. Tarczowa 14',
        type: 'residential', color: '#d0c4aa'
      },

      // Tarczowa 16
      {
        id: 1024,
        coords: [
          [53.45392, 14.54800], [53.45392, 14.54860],
          [53.45374, 14.54860], [53.45374, 14.54800],
          [53.45392, 14.54800]
        ],
        levels: 4, name: '', address: 'ul. Tarczowa 16',
        type: 'residential', color: '#c4b8a0'
      },

      // Tarczowa 18
      {
        id: 1025,
        coords: [
          [53.45370, 14.54800], [53.45370, 14.54860],
          [53.45352, 14.54860], [53.45352, 14.54800],
          [53.45370, 14.54800]
        ],
        levels: 4, name: '', address: 'ul. Tarczowa 18',
        type: 'residential', color: '#d0c4aa'
      },

      // ══════════════════════════════════════════════
      // WIEŻOWCE — DOMINANTY ARCHITEKTONICZNE
      // ══════════════════════════════════════════════

      // Wieżowiec przy Bandurskiego — 11 pięter
      {
        id: 1030,
        coords: [
          [53.45530, 14.54620], [53.45530, 14.54670],
          [53.45510, 14.54670], [53.45510, 14.54620],
          [53.45530, 14.54620]
        ],
        levels: 11, name: 'Wieżowiec Bandurskiego', address: 'ul. Bandurskiego',
        type: 'apartments', color: '#a8b8c8'
      },

      // Wieżowiec przy Łuczniczej — 9 pięter
      {
        id: 1031,
        coords: [
          [53.45320, 14.54718], [53.45320, 14.54782],
          [53.45302, 14.54782], [53.45302, 14.54718],
          [53.45320, 14.54718]
        ],
        levels: 9, name: '', address: 'ul. Łucznicza 51',
        type: 'apartments', color: '#b8c4d0'
      },

      // ══════════════════════════════════════════════
      // SZKOŁA PODSTAWOWA NR 47
      // ══════════════════════════════════════════════
      {
        id: 1040,
        coords: [
          [53.45510, 14.54630], [53.45510, 14.54720],
          [53.45490, 14.54720], [53.45490, 14.54630],
          [53.45510, 14.54630]
        ],
        levels: 3, name: 'SP nr 47', address: 'ul. Łucznicza (Szkoła)',
        type: 'school', color: '#e8d4a0'
      },

      // Sala gimnastyczna szkoły
      {
        id: 1041,
        coords: [
          [53.45510, 14.54720], [53.45510, 14.54760],
          [53.45495, 14.54760], [53.45495, 14.54720],
          [53.45510, 14.54720]
        ],
        levels: 2, name: 'Sala gimnastyczna', address: 'ul. Łucznicza',
        type: 'school', color: '#e0cc98'
      },

      // ══════════════════════════════════════════════
      // USŁUGI I HANDEL
      // ══════════════════════════════════════════════

      // Sklep spożywczy
      {
        id: 1050,
        coords: [
          [53.45468, 14.54740], [53.45468, 14.54790],
          [53.45456, 14.54790], [53.45456, 14.54740],
          [53.45468, 14.54740]
        ],
        levels: 1, name: 'Sklep', address: 'ul. Łucznicza',
        type: 'retail', color: '#f0e0b0'
      },

      // Apteka / usługi
      {
        id: 1051,
        coords: [
          [53.45468, 14.54790], [53.45468, 14.54830],
          [53.45456, 14.54830], [53.45456, 14.54790],
          [53.45468, 14.54790]
        ],
        levels: 1, name: 'Apteka', address: 'ul. Łucznicza',
        type: 'retail', color: '#e8f0d8'
      },

      // Pawilon handlowy
      {
        id: 1052,
        coords: [
          [53.45500, 14.54790], [53.45500, 14.54840],
          [53.45484, 14.54840], [53.45484, 14.54790],
          [53.45500, 14.54790]
        ],
        levels: 1, name: 'Pawilon', address: 'ul. Tarczowa',
        type: 'commercial', color: '#d8e8f0'
      },

      // ══════════════════════════════════════════════
      // GARAŻE I BUDYNKI GOSPODARCZE
      // ══════════════════════════════════════════════

      // Garaże przy Łuczniczej 43
      {
        id: 1060,
        coords: [
          [53.45380, 14.54790], [53.45380, 14.54820],
          [53.45368, 14.54820], [53.45368, 14.54790],
          [53.45380, 14.54790]
        ],
        levels: 1, name: 'Garaże', address: '',
        type: 'garages', color: '#b0b0b0'
      },

      {
        id: 1061,
        coords: [
          [53.45364, 14.54790], [53.45364, 14.54820],
          [53.45352, 14.54820], [53.45352, 14.54790],
          [53.45364, 14.54790]
        ],
        levels: 1, name: 'Garaże', address: '',
        type: 'garages', color: '#b0b0b0'
      },

      {
        id: 1062,
        coords: [
          [53.45348, 14.54790], [53.45348, 14.54820],
          [53.45336, 14.54820], [53.45336, 14.54790],
          [53.45348, 14.54790]
        ],
        levels: 1, name: 'Garaże', address: '',
        type: 'garages', color: '#b0b0b0'
      },

      // Garaże przy Tarczowej
      {
        id: 1063,
        coords: [
          [53.45500, 14.54860], [53.45500, 14.54890],
          [53.45488, 14.54890], [53.45488, 14.54860],
          [53.45500, 14.54860]
        ],
        levels: 1, name: 'Garaże', address: '',
        type: 'garages', color: '#b0b0b0'
      },

      {
        id: 1064,
        coords: [
          [53.45484, 14.54860], [53.45484, 14.54890],
          [53.45472, 14.54890], [53.45472, 14.54860],
          [53.45484, 14.54860]
        ],
        levels: 1, name: 'Garaże', address: '',
        type: 'garages', color: '#b0b0b0'
      },

      // ══════════════════════════════════════════════
      // ALTANY I MAŁE OBIEKTY
      // ══════════════════════════════════════════════

      // Altana przy Łuczniczej 43
      {
        id: 1070,
        coords: [
          [53.45402, 14.54800], [53.45402, 14.54820],
          [53.45394, 14.54820], [53.45394, 14.54800],
          [53.45402, 14.54800]
        ],
        levels: 1, name: 'Altana', address: '',
        type: 'yes', color: '#90c890'
      },

      // Wiata śmietnikowa
      {
        id: 1071,
        coords: [
          [53.45420, 14.54800], [53.45420, 14.54812],
          [53.45412, 14.54812], [53.45412, 14.54800],
          [53.45420, 14.54800]
        ],
        levels: 1, name: 'Wiata', address: '',
        type: 'yes', color: '#a0a0a0'
      },

      // Transformator / stacja energetyczna
      {
        id: 1072,
        coords: [
          [53.45440, 14.54800], [53.45440, 14.54812],
          [53.45432, 14.54812], [53.45432, 14.54800],
          [53.45440, 14.54800]
        ],
        levels: 1, name: 'Stacja trafo', address: '',
        type: 'industrial', color: '#c0c0c0'
      },

      // ══════════════════════════════════════════════
      // BUDYNKI PRZY UL. BANDURSKIEGO (dalsze otoczenie)
      // ══════════════════════════════════════════════

      // Bandurskiego 1 — blok 5-piętrowy
      {
        id: 1080,
        coords: [
          [53.45540, 14.54680], [53.45540, 14.54740],
          [53.45522, 14.54740], [53.45522, 14.54680],
          [53.45540, 14.54680]
        ],
        levels: 5, name: '', address: 'ul. Bandurskiego 1',
        type: 'apartments', color: '#c8c0b0'
      },

      // Bandurskiego 3
      {
        id: 1081,
        coords: [
          [53.45518, 14.54680], [53.45518, 14.54740],
          [53.45500, 14.54740], [53.45500, 14.54680],
          [53.45518, 14.54680]
        ],
        levels: 5, name: '', address: 'ul. Bandurskiego 3',
        type: 'apartments', color: '#d0c8b8'
      },

      // Bandurskiego 5
      {
        id: 1082,
        coords: [
          [53.45496, 14.54680], [53.45496, 14.54740],
          [53.45478, 14.54740], [53.45478, 14.54680],
          [53.45496, 14.54680]
        ],
        levels: 5, name: '', address: 'ul. Bandurskiego 5',
        type: 'apartments', color: '#c8c0b0'
      },

      // ══════════════════════════════════════════════
      // BUDYNKI PRZY UL. RUGIAŃSKIEJ (dalsze otoczenie)
      // ══════════════════════════════════════════════

      // Rugiańska 1 — blok 4-piętrowy
      {
        id: 1090,
        coords: [
          [53.45300, 14.54780], [53.45300, 14.54840],
          [53.45282, 14.54840], [53.45282, 14.54780],
          [53.45300, 14.54780]
        ],
        levels: 4, name: '', address: 'ul. Rugiańska 1',
        type: 'residential', color: '#c0b8a8'
      },

      // Rugiańska 3
      {
        id: 1091,
        coords: [
          [53.45278, 14.54780], [53.45278, 14.54840],
          [53.45260, 14.54840], [53.45260, 14.54780],
          [53.45278, 14.54780]
        ],
        levels: 4, name: '', address: 'ul. Rugiańska 3',
        type: 'residential', color: '#c8c0b0'
      },

    ];
  }

  // ===== PUBLIC API =====
  return {
    toggle, enable, disable,
    isEnabled: () => cfg.enabled,
    setColorScheme: (s) => { cfg.colorScheme = s; if (cfg.enabled) render(); },
    render,
  };
})();

window.Buildings3D = Buildings3D;

// ===== AUTO-WIRE 3D BUTTONS (robust event delegation) =====
// Używamy delegacji zdarzeń na document, więc działa niezależnie od tego,
// kiedy przyciski pojawią się w DOM (np. po splash screen).

function handle3DToggle() {
  console.log('🏢 3D toggle clicked');
  if (!window.Buildings3D) {
    if (typeof showToast === 'function') showToast('⚠️ Moduł 3D jeszcze się ładuje...');
    return;
  }
  window.Buildings3D.toggle();
  const isOn = window.Buildings3D.isEnabled();
  // Synchronizuj wszystkie przyciski 3D
  ['buildings3dFab', 'btnQuick3D', 'btnBuildings3D'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle('active', isOn);
  });
}

// Delegacja: łapie kliknięcia na dowolnym przycisku 3D, nawet jeśli dodany później
document.addEventListener('click', (e) => {
  const target = e.target.closest('#buildings3dFab, #btnQuick3D, #btnBuildings3D');
  if (target) {
    e.stopPropagation();
    e.preventDefault();
    handle3DToggle();
  }
}, true); // capture phase — uruchamia się przed Leaflet

// Dodatkowo wyłącz propagację kliknięć Leaflet na FAB gdy się pojawi
document.addEventListener('DOMContentLoaded', () => {
  const tryDisableProp = () => {
    const fab = document.getElementById('buildings3dFab');
    if (fab && typeof L !== 'undefined' && L.DomEvent) {
      L.DomEvent.disableClickPropagation(fab);
      L.DomEvent.disableScrollPropagation(fab);
      return true;
    }
    return false;
  };
  // Próbuj kilka razy, bo FAB pojawia się po splash screen
  if (!tryDisableProp()) {
    let tries = 0;
    const wait = setInterval(() => {
      tries++;
      if (tryDisableProp() || tries > 30) clearInterval(wait);
    }, 300);
  }
});

