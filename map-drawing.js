/**
 * map-drawing.js — Drawing & sketching mode on map
 * Create custom routes, mark points, save as notes
 */
'use strict';

const MapDrawing = (() => {
  const cfg = {
    enabled: false,
    mode: 'draw', // draw | erase | select
    points: [],
    drawings: [],
    currentLayer: null,
    map: null
  };

  const DRAWINGS_KEY = 'lucznicza_custom_drawings';

  function init(map) {
    cfg.map = map;
    console.log('🖍️ Inicjalizacja trybu rysowania...');
    loadDrawings();
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
    cfg.points = [];
    createDrawingLayer();

    map.on('click', onMapClick);
    L.DomUtil.addClass(map._container, 'drawing-mode');

    showToast('🖍️ Tryb rysowania włączony - klikaj aby rysować');
  }

  function disable() {
    const map = cfg.map;
    if (!map) return;

    cfg.enabled = false;
    map.off('click', onMapClick);
    L.DomUtil.removeClass(map._container, 'drawing-mode');

    if (cfg.points.length > 0) {
      offerSaveDrawing();
    }

    showToast('🖍️ Tryb rysowania wyłączony');
  }

  function createDrawingLayer() {
    if (cfg.currentLayer) {
      cfg.map.removeLayer(cfg.currentLayer);
    }

    cfg.currentLayer = L.layerGroup();
    cfg.currentLayer.addTo(cfg.map);
  }

  function onMapClick(e) {
    if (!cfg.enabled) return;

    const point = e.latlng;
    cfg.points.push(point);

    // Draw point
    const circle = L.circleMarker(point, {
      radius: 6,
      color: '#6c63ff',
      fillColor: '#6c63ff',
      fillOpacity: 0.8,
      weight: 2
    });
    circle.addTo(cfg.currentLayer);

    // Draw connecting line
    if (cfg.points.length > 1) {
      const prevPoint = cfg.points[cfg.points.length - 2];
      const line = L.polyline([prevPoint, point], {
        color: '#6c63ff',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5'
      });
      line.addTo(cfg.currentLayer);
    }

    showToast(`🖍️ Punkt ${cfg.points.length} dodany`);
  }

  function offerSaveDrawing() {
    if (cfg.points.length < 2) {
      showToast('⚠️ Narysuj co najmniej 2 punkty aby zapisać');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="modal-content">
          <h3>💾 Zapisz rysunek</h3>
          <input type="text" id="drawingName" placeholder="Nazwa rysunku..." style="width:100%; padding:8px; border:1px solid var(--border); border-radius:6px; margin:10px 0;">
          <textarea id="drawingNote" placeholder="Notatka (opcjonalnie)..." style="width:100%; height:60px; padding:8px; border:1px solid var(--border); border-radius:6px; margin:10px 0; font-family:inherit;"></textarea>
          <button onclick="MapDrawing.saveDrawing()" style="width:100%; padding:10px; background:var(--accent); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600;">
            Zapisz
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('drawingName').focus();
  }

  function saveDrawing() {
    const name = document.getElementById('drawingName').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!name) {
      showToast('⚠️ Wpisz nazwę rysunku');
      return;
    }

    const drawing = {
      id: Date.now(),
      name: name,
      note: note,
      points: cfg.points.map(p => ({ lat: p.lat, lng: p.lng })),
      created: new Date().toLocaleDateString('pl'),
      length: calculateLength(cfg.points)
    };

    cfg.drawings.push(drawing);
    saveDrawings();

    document.querySelector('.modal-overlay')?.remove();
    cfg.points = [];
    createDrawingLayer();

    showToast(`💾 Rysunek "${name}" zapisany`);
  }

  function calculateLength(points) {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = (points[i + 1].lat - points[i].lat) * 111;
      const dy = (points[i + 1].lng - points[i].lng) * 111 * Math.cos(points[i].lat * Math.PI / 180);
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length.toFixed(2);
  }

  function displaySavedDrawings() {
    if (cfg.drawings.length === 0) {
      showToast('📝 Brak zapisanych rysunków');
      return;
    }

    const html = cfg.drawings.map((d, idx) => `
      <div class="saved-drawing" onclick="MapDrawing.loadDrawing(${d.id})">
        <div style="flex:1">
          <strong>${d.name}</strong><br>
          <small>${d.created} · ${d.length}km</small>
          ${d.note ? `<div style="font-size:11px; color:var(--text2); margin-top:4px">${d.note}</div>` : ''}
        </div>
        <button onclick="event.stopPropagation(); MapDrawing.deleteDrawing(${d.id})" style="background:#f44336; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">
          ✕
        </button>
      </div>
    `).join('');

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:400px">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="modal-content">
          <h3>📝 Zapisane rysunki</h3>
          <div style="max-height:400px; overflow-y:auto;">${html}</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function loadDrawing(drawingId) {
    const drawing = cfg.drawings.find(d => d.id === drawingId);
    if (!drawing) return;

    // Clear current
    if (cfg.currentLayer) cfg.map.removeLayer(cfg.currentLayer);
    createDrawingLayer();

    // Draw saved points and lines
    const points = drawing.points.map(p => L.latLng(p.lat, p.lng));

    points.forEach((point, idx) => {
      const circle = L.circleMarker(point, {
        radius: 6,
        color: '#4ade80',
        fillColor: '#4ade80',
        fillOpacity: 0.8,
        weight: 2
      });
      circle.addTo(cfg.currentLayer);

      if (idx > 0) {
        const line = L.polyline([points[idx - 1], point], {
          color: '#4ade80',
          weight: 3,
          opacity: 0.7
        });
        line.addTo(cfg.currentLayer);
      }
    });

    // Fit to bounds
    const bounds = L.latLngBounds(points);
    cfg.map.fitBounds(bounds, { padding: [60, 60] });

    document.querySelector('.modal-overlay')?.remove();
    showToast(`📝 Załadowano: "${drawing.name}"`);
  }

  function deleteDrawing(drawingId) {
    cfg.drawings = cfg.drawings.filter(d => d.id !== drawingId);
    saveDrawings();
    showToast('🗑️ Rysunek usunięty');
  }

  function setMode(newMode) {
    cfg.mode = newMode;
    showToast(`🖍️ Tryb: ${newMode === 'draw' ? 'Rysowanie' : newMode === 'erase' ? 'Gumka' : 'Zaznaczanie'}`);
  }

  function saveDrawings() {
    try {
      localStorage.setItem(DRAWINGS_KEY, JSON.stringify(cfg.drawings));
    } catch (e) {
      console.warn('Błąd zapisu rysunków:', e);
    }
  }

  function loadDrawings() {
    try {
      const saved = localStorage.getItem(DRAWINGS_KEY);
      if (saved) {
        cfg.drawings = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Błąd wczytywania rysunków:', e);
      cfg.drawings = [];
    }
  }

  function clear() {
    cfg.points = [];
    if (cfg.currentLayer) {
      cfg.map.removeLayer(cfg.currentLayer);
      createDrawingLayer();
    }
    showToast('🗑️ Czyszczenie rysunku');
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    setMode,
    saveDrawing,
    loadDrawing,
    deleteDrawing,
    displaySavedDrawings,
    clear,
    getDrawings: () => cfg.drawings
  };
})();

window.MapDrawing = MapDrawing;
