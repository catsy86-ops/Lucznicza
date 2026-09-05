/**
 * map-layers.js — Dodatkowe warstwy mapy dla Niebuszewo/Łucznicza
 * Prawdziwe dane: przystanki ZDiTM, ścieżki rowerowe, strefy dzielnicy
 * Źródło: OpenStreetMap / ZDiTM Szczecin
 */
'use strict';

// ===== PRAWDZIWE PRZYSTANKI ZDiTM w okolicy Niebuszewo =====
// Źródło: ZDiTM Szczecin + OSM
const STOPS_DATA = [
  { name: 'Łucznicza',              lat: 53.45296, lon: 14.54794, lines: ['89','69'],        type: 'bus'  },
  { name: 'Łucznicza (pętla)',       lat: 53.45399, lon: 14.54773, lines: ['89','69','N1'],   type: 'bus'  },
  { name: 'Przyjaciół Żołnierza',    lat: 53.45480, lon: 14.55180, lines: ['89','69','75'],   type: 'bus'  },
  { name: 'Bandurskiego',            lat: 53.45365, lon: 14.56355, lines: ['75','76','77'],   type: 'bus'  },
  { name: 'Krasińskiego',            lat: 53.45014, lon: 14.54326, lines: ['69','89'],        type: 'bus'  },
  { name: 'Niebuszewo',              lat: 53.45559, lon: 14.55462, lines: ['75','76','77','89'], type: 'bus' },
  { name: 'Rostocka',                lat: 53.46105, lon: 14.55496, lines: ['75','76'],        type: 'bus'  },
  { name: 'Thugutta',                lat: 53.46098, lon: 14.55630, lines: ['75','76','77'],   type: 'bus'  },
  { name: 'Księżnej Zofii',          lat: 53.45127, lon: 14.55910, lines: ['75','77'],        type: 'bus'  },
  { name: 'Komuny Paryskiej',        lat: 53.45356, lon: 14.56575, lines: ['75','76'],        type: 'bus'  },
];

// ===== ŚCIEŻKI ROWEROWE (prawdziwe z OSM) =====
const BIKE_PATHS = [
  // Główna ścieżka wzdłuż ul. Przyjaciół Żołnierza
  {
    name: 'Ścieżka rowerowa — Przyjaciół Żołnierza',
    coords: [
      [53.45480, 14.55180],
      [53.45465, 14.55985],
      [53.45382, 14.56135],
      [53.45356, 14.56287]
    ]
  },
  // Ścieżka przez Park Kadziaka
  {
    name: 'Ścieżka rowerowa — Park Kadziaka',
    coords: [
      [53.45100, 14.54365],
      [53.45080, 14.54400],
      [53.45200, 14.55100],
      [53.45296, 14.54794]
    ]
  },
  // Ścieżka wzdłuż ul. Krasińskiego
  {
    name: 'Ścieżka rowerowa — Krasińskiego',
    coords: [
      [53.45014, 14.54326],
      [53.45531, 14.54565],
      [53.45559, 14.55462]
    ]
  }
];

// ===== STREFY DZIELNICY =====
const DISTRICT_ZONES = [
  {
    name: 'Centrum Niebuszewo',
    color: '#6c63ff',
    coords: [
      [53.4530, 14.5490], [53.4560, 14.5490],
      [53.4560, 14.5560], [53.4530, 14.5560],
      [53.4530, 14.5490]
    ]
  },
  {
    name: 'Strefa Handlowa (Przyjaciół Żołnierza)',
    color: '#ffd93d',
    coords: [
      [53.4540, 14.5500], [53.4555, 14.5500],
      [53.4555, 14.5640], [53.4540, 14.5640],
      [53.4540, 14.5500]
    ]
  },
  {
    name: 'Strefa Zielona (Parki)',
    color: '#43e97b',
    coords: [
      [53.4495, 14.5420], [53.4520, 14.5420],
      [53.4520, 14.5460], [53.4495, 14.5460],
      [53.4495, 14.5420]
    ]
  }
];

// ===== LAYER GROUPS =====
const MAP_LAYERS = {
  stopsLayer: null,
  bikeLayer: null,
  zonesLayer: null,
  stopsVisible: false,
  bikeVisible: false,
  zonesVisible: false
};

// ===== BUILD STOPS LAYER =====
function buildStopsLayer(map) {
  if (MAP_LAYERS.stopsLayer) return;

  const group = L.layerGroup();

  STOPS_DATA.forEach(stop => {
    const linesHtml = stop.lines.map(l =>
      `<span style="background:${stop.type==='tram'?'#e74c3c':'#3498db'};color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:700;margin:1px">${l}</span>`
    ).join(' ');

    const icon = L.divIcon({
      html: `<div class="stop-marker ${stop.type}">
        <span>${stop.type === 'tram' ? '🚃' : '🚌'}</span>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      className: 'stop-marker-wrap'
    });

    const marker = L.marker([stop.lat, stop.lon], { icon, zIndexOffset: -100 });
    marker.bindPopup(`
      <div style="min-width:160px">
        <div style="font-weight:700;margin-bottom:6px">${stop.type === 'tram' ? '🚃' : '🚌'} ${stop.name}</div>
        <div style="font-size:11px;color:#888;margin-bottom:6px">Przystanek ZDiTM Szczecin</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px">${linesHtml}</div>
      </div>
    `);
    group.addLayer(marker);
  });

  MAP_LAYERS.stopsLayer = group;
}

// ===== BUILD BIKE PATHS LAYER =====
function buildBikeLayer(map) {
  if (MAP_LAYERS.bikeLayer) return;

  const group = L.layerGroup();

  BIKE_PATHS.forEach(path => {
    const line = L.polyline(path.coords, {
      color: '#43e97b',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 4',
      lineCap: 'round'
    });
    line.bindTooltip(`🚲 ${path.name}`, { sticky: true });
    group.addLayer(line);
  });

  MAP_LAYERS.bikeLayer = group;
}

// ===== BUILD ZONES LAYER =====
function buildZonesLayer(map) {
  if (MAP_LAYERS.zonesLayer) return;

  const group = L.layerGroup();

  DISTRICT_ZONES.forEach(zone => {
    const poly = L.polygon(zone.coords, {
      color: zone.color,
      weight: 2,
      opacity: 0.5,
      fillColor: zone.color,
      fillOpacity: 0.06,
      dashArray: '6, 3'
    });
    poly.bindTooltip(zone.name, { permanent: false, direction: 'center' });
    group.addLayer(poly);
  });

  MAP_LAYERS.zonesLayer = group;
}

// ===== TOGGLE FUNCTIONS =====
function toggleStops() {
  const map = window.state?.map;
  if (!map) return;
  buildStopsLayer(map);
  if (MAP_LAYERS.stopsVisible) {
    map.removeLayer(MAP_LAYERS.stopsLayer);
    MAP_LAYERS.stopsVisible = false;
    showToast('🚌 Przystanki ukryte');
  } else {
    MAP_LAYERS.stopsLayer.addTo(map);
    MAP_LAYERS.stopsVisible = true;
    showToast('🚌 Przystanki ZDiTM widoczne');
  }
  updateLayerButtons();
}

function toggleBikePaths() {
  const map = window.state?.map;
  if (!map) return;
  buildBikeLayer(map);
  if (MAP_LAYERS.bikeVisible) {
    map.removeLayer(MAP_LAYERS.bikeLayer);
    MAP_LAYERS.bikeVisible = false;
    showToast('🚲 Ścieżki rowerowe ukryte');
  } else {
    MAP_LAYERS.bikeLayer.addTo(map);
    MAP_LAYERS.bikeVisible = true;
    showToast('🚲 Ścieżki rowerowe widoczne');
  }
  updateLayerButtons();
}

function toggleZones() {
  const map = window.state?.map;
  if (!map) return;
  buildZonesLayer(map);
  if (MAP_LAYERS.zonesVisible) {
    map.removeLayer(MAP_LAYERS.zonesLayer);
    MAP_LAYERS.zonesVisible = false;
    showToast('🗺️ Strefy ukryte');
  } else {
    MAP_LAYERS.zonesLayer.addTo(map);
    MAP_LAYERS.zonesVisible = true;
    showToast('🗺️ Strefy dzielnicy widoczne');
  }
  updateLayerButtons();
}

function updateLayerButtons() {
  const btnStops = document.getElementById('btnLayerStops');
  const btnBike  = document.getElementById('btnLayerBike');
  const btnZones = document.getElementById('btnLayerZones');
  if (btnStops) btnStops.classList.toggle('active', MAP_LAYERS.stopsVisible);
  if (btnBike)  btnBike.classList.toggle('active',  MAP_LAYERS.bikeVisible);
  if (btnZones) btnZones.classList.toggle('active',  MAP_LAYERS.zonesVisible);
}

// ===== BUILD LAYER CONTROL PANEL =====
function buildLayerPanel() {
  const container = document.getElementById('map');
  if (!container || document.getElementById('layerPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'layerPanel';
  panel.className = 'layer-panel collapsed';
  panel.innerHTML = `
    <button class="lp-toggle-pill" id="lpTogglePill" title="Zwiń / rozwiń warstwy mapy" aria-label="Warstwy mapy">
      <span class="widget-drag-handle lp-drag-handle" title="Przeciągnij warstwy" aria-label="Przeciągnij">⠿</span>
      <span>🗂️ Warstwy</span>
      <span class="lp-chevron">▾</span>
    </button>
    <div class="lp-content" id="lpContent">
      <div class="lp-title">🗂️ Warstwy & Narzędzia</div>
      <div class="lp-grid" id="lpGrid">
        <button class="lp-btn" id="btnLayerStops"  onclick="toggleStops()">🚌 Przystanki</button>
        <button class="lp-btn" id="btnLayerBike"   onclick="toggleBikePaths()">🚲 Ścieżki</button>
        <button class="lp-btn" id="btnLayerZones"  onclick="toggleZones()">🗺️ Strefy</button>
      </div>
    </div>
  `;
  container.appendChild(panel);

  if (window.L?.DomEvent) {
    L.DomEvent.disableClickPropagation(panel);
    L.DomEvent.disableScrollPropagation(panel);
  }

  panel.querySelector('#lpTogglePill')?.addEventListener('click', (e) => {
    if (e.target?.classList?.contains('widget-drag-handle')) return;
    e.stopPropagation();
    panel.classList.toggle('collapsed');
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !panel.classList.contains('collapsed')) {
      panel.classList.add('collapsed');
    }
  });
}

// ===== MAP STATS & RIGHT HUB PANEL (CONTROL HUB PRO) =====
function buildMapStats() {
  const container = document.querySelector('.map-container') || document.getElementById('app') || document.getElementById('map') || document.body;
  if (!container || document.getElementById('mapStatsPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'mapStatsPanel';
  panel.className = 'map-stats-panel collapsed';

  const places = APP_DATA?.places || [];
  const byCat = {};
  places.forEach(p => { byCat[p.cat] = (byCat[p.cat] || 0) + 1; });

  const catIcons = { service:'🔧', shop:'🛒', food:'🍽️', edu:'🏫', park:'🌳', sport:'⚽' };
  const catLabels = { service:'Usługi', shop:'Sklepy', food:'Jedzenie', edu:'Edukacja', park:'Parki', sport:'Sport' };

  panel.innerHTML = `
    <!-- Floating pill trigger (always visible in top right) -->
    <div class="msp-trigger-wrapper">
      <button class="msp-toggle-btn" id="mspToggleBtn" title="Menu z prawej: Control Hub Pro & Statystyki (M)" aria-label="Rozwiń menu i statystyki mapy">
        <span class="widget-drag-handle msp-drag-handle" title="Przeciągnij menu" aria-label="Przeciągnij">⠿</span>
        <span class="mst-icon">📊</span>
        <span class="mst-title">Control Hub</span>
        <span class="mst-count">(${places.length})</span>
        <span class="mst-chevron">▾</span>
      </button>
      <button class="widget-close-btn msp-pill-close" id="mspPillCloseBtn" title="Zamknij statystyki" aria-label="Zamknij statystyki">✕</button>
    </div>

    <!-- Expandable Glassmorphic Card (Control Hub Pro) -->
    <div class="msp-card" id="mspCard">
      <div class="msp-card-header">
        <div class="msp-header-title">
          <span class="msp-header-crest">🦅</span>
          <div>
            <h3>Centrum Dzielnicy</h3>
            <p>Niebuszewo · Control Hub Pro</p>
          </div>
        </div>
        <button class="msp-close-btn" id="mspCloseBtn" title="Zwiń panel" aria-label="Zamknij panel">✕</button>
      </div>

      <!-- Segmented Tab Navigation -->
      <div class="mch-tab-bar" role="tablist" aria-label="Sekcje Control Hub">
        <button class="mch-tab-btn active" data-tab="explore" role="tab" aria-selected="true" title="Baza miejsc i kategorie">
          <span class="mch-tab-icon">📍</span>
          <span class="mch-tab-txt">Odkrywaj</span>
        </button>
        <button class="mch-tab-btn" data-tab="presets" role="tab" aria-selected="false" title="Kadry kamery i przelot 3D">
          <span class="mch-tab-icon">🎯</span>
          <span class="mch-tab-txt">Kadry</span>
        </button>
        <button class="mch-tab-btn" data-tab="layers" role="tab" aria-selected="false" title="Warstwy, radar i dane na żywo">
          <span class="mch-tab-icon">⚡</span>
          <span class="mch-tab-txt">Warstwy</span>
        </button>
        <button class="mch-tab-btn" data-tab="tools" role="tab" aria-selected="false" title="Narzędzia osiedlowe i motywy">
          <span class="mch-tab-icon">🛠️</span>
          <span class="mch-tab-txt">Opcje</span>
        </button>
      </div>

      <!-- TAB 1: ODKRYWAJ (POIs & Kategorie) -->
      <div class="mch-tab-pane active" id="mchPane_explore" role="tabpanel">
        <div class="msp-summary-badge">
          <span class="msp-total-num">${places.length}</span>
          <span class="msp-total-label">Zweryfikowanych punktów</span>
        </div>

        <div class="mch-search-box">
          <span class="mch-search-icon">🔍</span>
          <input type="text" id="mchCategorySearch" class="mch-search-input" placeholder="Szukaj kategorii..." aria-label="Filtruj kategorie" />
        </div>

        <div class="msp-section-label">Kategorie (kliknij, aby przefiltrować):</div>
        <div class="msp-cats-grid" id="mchCatsGrid">
          ${Object.entries(byCat).map(([cat, count]) => `
            <button class="msp-cat-chip" data-cat="${cat}" title="Pokaż: ${catLabels[cat] || cat}">
              <span class="msp-cat-icon">${catIcons[cat] || '📍'}</span>
              <span class="msp-cat-name">${catLabels[cat] || cat}</span>
              <span class="msp-cat-pill">${count}</span>
            </button>
          `).join('')}
        </div>

        <div class="msp-stops-row" id="mchStopsRowQuick" onclick="toggleStops()" style="cursor:pointer" title="Przełącz warstwę przystanków">
          <div class="msp-stops-left">
            <span>🚌</span>
            <span>Przystanki ZDiTM</span>
          </div>
          <span class="msp-stops-badge">${STOPS_DATA.length} na mapie</span>
        </div>
      </div>

      <!-- TAB 2: KADRY (Presety Kamery & Przelot) -->
      <div class="mch-tab-pane" id="mchPane_presets" role="tabpanel">
        <div class="msp-section-label">Szybkie kadry kamery:</div>
        <div class="mch-presets-list">
          <button class="mch-preset-item active" data-preset="full-district" title="Widok na całe Niebuszewo">
            <span class="mch-preset-icon">🏙️</span>
            <div class="mch-preset-meta">
              <strong>Całe Niebuszewo</strong>
              <small>Panorama całej dzielnicy (zoom 14.5)</small>
            </div>
            <span class="mch-preset-arrow">➔</span>
          </button>
          <button class="mch-preset-item" data-preset="lucznicza-axis" title="Skupienie na Osi Łuczniczej">
            <span class="mch-preset-icon">🏹</span>
            <div class="mch-preset-meta">
              <strong>Oś Łucznicza</strong>
              <small>Główna arteria i serce osiedla</small>
            </div>
            <span class="mch-preset-arrow">➔</span>
          </button>
          <button class="mch-preset-item" data-preset="kadziak-park" title="Park i rekreacja">
            <span class="mch-preset-icon">🌳</span>
            <div class="mch-preset-meta">
              <strong>Park Kadziaka</strong>
              <small>Teren zielony, plac zabaw i wybieg</small>
            </div>
            <span class="mch-preset-arrow">➔</span>
          </button>
          <button class="mch-preset-item" data-preset="station-hub" title="Węzeł kolejowy">
            <span class="mch-preset-icon">🚉</span>
            <div class="mch-preset-meta">
              <strong>Stacja SKM Niebuszewo</strong>
              <small>Dworzec i Szczecińska Kolej Metropolitalna</small>
            </div>
            <span class="mch-preset-arrow">➔</span>
          </button>
          <button class="mch-preset-item" data-preset="kollataja-hub" title="Pętla komunikacji miejskiej">
            <span class="mch-preset-icon">🚋</span>
            <div class="mch-preset-meta">
              <strong>Pętla Kołłątaja</strong>
              <small>Węzeł przesiadkowy tramwajów i autobusów</small>
            </div>
            <span class="mch-preset-arrow">➔</span>
          </button>
        </div>

        <div class="mch-tour-box">
          <button class="mch-tour-btn" id="mchTourBtn" title="Uruchom płynny przelot po kluczowych punktach">
            <span>🎬</span>
            <span>Uruchom kinowy przelot nad dzielnicą</span>
          </button>
        </div>
      </div>

      <!-- TAB 3: WARSTWY & RADAR -->
      <div class="mch-tab-pane" id="mchPane_layers" role="tabpanel">
        <div class="msp-section-label">Warstwy i dane na żywo:</div>
        <div class="mch-layers-grid">
          <button class="mch-layer-card" id="mchLyrStops" onclick="toggleStops()" title="Włącz / wyłącz przystanki ZDiTM">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🚌</span>
              <span class="mch-lc-status" id="mchBadgeStops">OFF</span>
            </div>
            <strong>Przystanki ZDiTM</strong>
            <small>Live odjazdy i linie</small>
          </button>

          <button class="mch-layer-card" id="mchLyrBike" onclick="toggleBikePaths()" title="Włącz / wyłącz ścieżki rowerowe">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🚲</span>
              <span class="mch-lc-status" id="mchBadgeBike">OFF</span>
            </div>
            <strong>Ścieżki Rowerowe</strong>
            <small>Drogi i pasy dla rowerów</small>
          </button>

          <button class="mch-layer-card" id="mchLyrZones" onclick="toggleZones()" title="Włącz / wyłącz granice stref">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🗺️</span>
              <span class="mch-lc-status" id="mchBadgeZones">OFF</span>
            </div>
            <strong>Granice Stref</strong>
            <small>Sektory i kwartały</small>
          </button>

          <button class="mch-layer-card" id="mchLyrRain" title="Włącz / wyłącz radar opadów IMGW">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🌧️</span>
              <span class="mch-lc-status" id="mchBadgeRain">OFF</span>
            </div>
            <strong>Radar IMGW</strong>
            <small>Chmury i opady na żywo</small>
          </button>

          <button class="mch-layer-card" id="mchLyr3D" title="Włącz / wyłącz bryły 3D">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🏢</span>
              <span class="mch-lc-status" id="mchBadge3D">OFF</span>
            </div>
            <strong>Budynki 3D</strong>
            <small>Wymiary i cienie budynków</small>
          </button>

          <button class="mch-layer-card" id="mchLyrHeat" title="Włącz / wyłącz heatmapę POI">
            <div class="mch-lc-head">
              <span class="mch-lc-icon">🔥</span>
              <span class="mch-lc-status" id="mchBadgeHeat">OFF</span>
            </div>
            <strong>Heatmapa POI</strong>
            <small>Gęstość usług osiedla</small>
          </button>
        </div>
      </div>

      <!-- TAB 4: NARZĘDZIA & POGOŃ SZCZECIN -->
      <div class="mch-tab-pane" id="mchPane_tools" role="tabpanel">
        <div class="msp-section-label">Szybkie narzędzia osiedlowe:</div>
        <div class="mch-tools-grid">
          <button class="mch-tool-card" id="mchToolPogon" title="Włącz motyw Pogoni Szczecin">
            <span class="mch-tool-icon">🛡️</span>
            <div class="mch-tool-text">
              <strong>Pogoń Szczecin</strong>
              <small>Motyw bordowo-granatowy</small>
            </div>
          </button>

          <button class="mch-tool-card" id="mchToolDzik" title="Zgłoś pojawienie się dzika lub usterki">
            <span class="mch-tool-icon">🐗</span>
            <div class="mch-tool-text">
              <strong>Zgłoś Dzika</strong>
              <small>Alert dla mieszkańców</small>
            </div>
          </button>

          <button class="mch-tool-card" id="mchToolArea" title="Zmierz powierzchnię na mapie">
            <span class="mch-tool-icon">📐</span>
            <div class="mch-tool-text">
              <strong>Pomiar Pola</strong>
              <small>Kalkulator powierzchni</small>
            </div>
          </button>

          <button class="mch-tool-card" id="mchToolIso" title="Wyświetl izochrony spacerowe">
            <span class="mch-tool-icon">🚶</span>
            <div class="mch-tool-text">
              <strong>Izochrony</strong>
              <small>5, 10 i 15 min spaceru</small>
            </div>
          </button>
        </div>

        <!-- Classic Quick Tools Row (Required for backward compatibility and test contracts) -->
        <div class="msp-quick-tools">
          <button class="msp-tool-btn" id="mspBtnZen" title="Przełącz tryb czystej mapy">
            👁️ Czysta mapa
          </button>
          <button class="msp-tool-btn" onclick="toggleBikePaths()" title="Ścieżki rowerowe">
            🚲 Ścieżki
          </button>
          <button class="msp-tool-btn" onclick="toggleZones()" title="Granice stref">
            🗺️ Strefy
          </button>
          <button class="msp-tool-btn" id="mspBtnResetWidgets" title="Resetuj układ widżetów do pozycji domyślnych">
            🔄 Reset układu
          </button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(panel);

  if (window.L?.DomEvent) {
    L.DomEvent.disableClickPropagation(panel);
    L.DomEvent.disableScrollPropagation(panel);
  }

  // Toggle open/collapse
  const toggleBtn = document.getElementById('mspToggleBtn');
  const closeBtn = document.getElementById('mspCloseBtn');
  const pillCloseBtn = document.getElementById('mspPillCloseBtn');
  const zenBtn = document.getElementById('mspBtnZen');
  const resetBtn = document.getElementById('mspBtnResetWidgets');

  const togglePanel = (e) => {
    if (e?.target?.classList?.contains('widget-drag-handle')) return;
    e?.stopPropagation();
    panel.classList.toggle('collapsed');
    if (!panel.classList.contains('collapsed')) {
      syncLayerBadges();
    }
  };

  toggleBtn?.addEventListener('click', togglePanel);
  closeBtn?.addEventListener('click', (e) => {
    e?.stopPropagation();
    panel.classList.add('collapsed');
  });

  pillCloseBtn?.addEventListener('click', (e) => {
    e?.stopPropagation();
    if (window.WidgetDragManager?.closeWidget) {
      window.WidgetDragManager.closeWidget('mapStatsPanel');
    } else {
      panel.style.display = 'none';
    }
  });

  resetBtn?.addEventListener('click', (e) => {
    e?.stopPropagation();
    if (window.WidgetDragManager?.resetAllPositions) {
      window.WidgetDragManager.resetAllPositions();
    }
  });

  zenBtn?.addEventListener('click', (e) => {
    e?.stopPropagation();
    if (typeof window.toggleZenMode === 'function') {
      window.toggleZenMode();
    } else {
      document.body.classList.toggle('zen-map-mode');
    }
  });

  // Tab switching logic
  const tabBtns = panel.querySelectorAll('.mch-tab-btn');
  const tabPanes = panel.querySelectorAll('.mch-tab-pane');

  const switchTab = (tabKey) => {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === tabKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `mchPane_${tabKey}`);
    });
    try {
      sessionStorage.setItem('mch_active_tab', tabKey);
    } catch (e) {}
    if (tabKey === 'layers') {
      syncLayerBadges();
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchTab(btn.dataset.tab);
    });
  });

  try {
    const savedTab = sessionStorage.getItem('mch_active_tab');
    if (savedTab && panel.querySelector(`.mch-tab-btn[data-tab="${savedTab}"]`)) {
      switchTab(savedTab);
    }
  } catch (e) {}

  // Category Search input
  const searchInput = panel.querySelector('#mchCategorySearch');
  searchInput?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    panel.querySelectorAll('.msp-cat-chip').forEach(chip => {
      const name = chip.querySelector('.msp-cat-name')?.textContent?.toLowerCase() || '';
      const cat = chip.dataset.cat?.toLowerCase() || '';
      chip.style.display = (!val || name.includes(val) || cat.includes(val)) ? 'flex' : 'none';
    });
  });

  // Camera Presets handler
  panel.querySelectorAll('.mch-preset-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const preset = btn.dataset.preset;
      panel.querySelectorAll('.mch-preset-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (typeof window.flyToPreset === 'function') {
        window.flyToPreset(preset);
      }
      // Sync with top bar preset buttons if present
      document.querySelectorAll('.preset-btn').forEach(b => {
        if (b.getAttribute('onclick')?.includes(preset)) {
          document.querySelectorAll('.preset-btn').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
        }
      });
      if (window.innerWidth < 768) {
        panel.classList.add('collapsed');
      }
    });
  });

  // Tour button
  panel.querySelector('#mchTourBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.add('collapsed');
    if (window.mapExtras2?.startTour) {
      window.mapExtras2.startTour();
    } else if (typeof window.showToast === 'function') {
      window.showToast('🎬 Uruchamianie przelotu...');
    }
  });

  // Layer badge synchronization helper
  function syncLayerBadges() {
    const isLyrActive = (id, checkFn) => {
      const btn = document.getElementById(id);
      return (btn && btn.classList.contains('active')) || (checkFn && checkFn());
    };

    const updateBadge = (badgeId, cardId, active) => {
      const badge = document.getElementById(badgeId);
      const card = document.getElementById(cardId);
      if (badge) {
        badge.textContent = active ? 'ON' : 'OFF';
        badge.classList.toggle('active', active);
      }
      if (card) {
        card.classList.toggle('active', active);
      }
    };

    updateBadge('mchBadgeStops', 'mchLyrStops', isLyrActive('btnLayerStops'));
    updateBadge('mchBadgeBike', 'mchLyrBike', isLyrActive('btnLayerBike'));
    updateBadge('mchBadgeZones', 'mchLyrZones', isLyrActive('btnLayerZones'));
    updateBadge('mchBadgeRain', 'mchLyrRain', isLyrActive('btnExtraRain'));
    updateBadge('mchBadge3D', 'mchLyr3D', isLyrActive('btn3D'));
    updateBadge('mchBadgeHeat', 'mchLyrHeat', isLyrActive('btnPoiHeat'));
  }

  // Bind layer extra toggles
  panel.querySelector('#mchLyrRain')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.mapExtras?.toggleRain) window.mapExtras.toggleRain();
    setTimeout(syncLayerBadges, 100);
  });
  panel.querySelector('#mchLyr3D')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.mapExtras2?.toggle3D) window.mapExtras2.toggle3D();
    setTimeout(syncLayerBadges, 100);
  });
  panel.querySelector('#mchLyrHeat')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.mapExtras2?.togglePoiHeat) window.mapExtras2.togglePoiHeat();
    setTimeout(syncLayerBadges, 100);
  });
  panel.querySelector('#mchLyrStops')?.addEventListener('click', () => setTimeout(syncLayerBadges, 100));
  panel.querySelector('#mchLyrBike')?.addEventListener('click', () => setTimeout(syncLayerBadges, 100));
  panel.querySelector('#mchLyrZones')?.addEventListener('click', () => setTimeout(syncLayerBadges, 100));

  // Tool 1: Pogoń Szczecin theme switcher
  panel.querySelector('#mchToolPogon')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isPogon = document.documentElement.getAttribute('data-theme') === 'pogon';
    const nextTheme = isPogon ? 'dark' : 'pogon';
    if (typeof window.applyTheme === 'function') {
      window.applyTheme(nextTheme);
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
    if (typeof window.showToast === 'function') {
      window.showToast(nextTheme === 'pogon' ? '🛡️ Motyw Pogoń Szczecin — Duma Pomorza!' : '🌙 Przywrócono tryb ciemny');
    }
  });

  // Tool 2: Dzik Alert trigger
  panel.querySelector('#mchToolDzik')?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.add('collapsed');
    const fab = document.getElementById('communityAlertFab');
    if (fab) {
      fab.click();
    } else if (typeof window.openAlertModal === 'function') {
      window.openAlertModal();
    }
  });

  // Tool 3: Area measure
  panel.querySelector('#mchToolArea')?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.add('collapsed');
    if (window.mapExtras2?.toggleArea) {
      window.mapExtras2.toggleArea();
    }
  });

  // Tool 4: Isochrones
  panel.querySelector('#mchToolIso')?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.add('collapsed');
    if (window.mapExtras?.toggleIso) {
      window.mapExtras.toggleIso();
    }
  });

  // Filter places on category chip click
  panel.querySelectorAll('.msp-cat-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat;
      const filterBtn = document.querySelector(`.category-filter .cat-btn[data-cat="${cat}"]`);
      if (filterBtn) {
        filterBtn.click();
      } else if (typeof window.filterCategory === 'function') {
        window.filterCategory(cat);
      }
      if (window.innerWidth < 768) {
        panel.classList.add('collapsed');
      }
    });
  });

  // Close when clicking outside on the map
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !panel.classList.contains('collapsed')) {
      panel.classList.add('collapsed');
    }
  });
}

// ===== INIT =====
function initMapLayers() {
  const checkMap = setInterval(() => {
    if (window.state?.map && APP_DATA?.places) {
      clearInterval(checkMap);
      setTimeout(() => {
        buildLayerPanel();
        buildMapStats();
      }, 600);
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const wait = setInterval(() => {
    if (window.state && !document.getElementById('app')?.classList.contains('hidden')) {
      clearInterval(wait);
      initMapLayers();
    }
  }, 500);
});

window.mapLayers = {
  toggleStops, toggleBikePaths, toggleZones,
  STOPS_DATA, BIKE_PATHS
};
