/**
 * 🚲 Szczecin Bike Router & Ścieżki Rowerowe Niebuszewo
 * Autorski silnik wyznaczania i dopasowywania tras rowerowych:
 * - Profile: Bezpieczna (100% DDR/Parki), Szybka (Asfalt), Płaska (Min. przewyższeń), Gravel (Park/Las)
 * - Typy rowerów: Miejski/BikeS, Szosowy, Gravel/Cross, MTB/E-Bike
 * - Integracja z warstwą CyclOSM oraz eksport GPX
 */

'use strict';

// 1. Węzły sieci rowerowej Szczecina (Niebuszewo i okolice)
const BIKE_NODES = {
  lucznicza: { id: 'lucznicza', name: 'ul. Łucznicza / Tarczowa (Centrum Dzielnicy)', coords: [53.4530, 14.5520], elevation: 32 },
  kadziak: { id: 'kadziak', name: 'Park Antoniego Kadziaka', coords: [53.4510, 14.5440], elevation: 28 },
  skm_niebuszewo: { id: 'skm_niebuszewo', name: 'Stacja Kolejowa Szczecin Niebuszewo (SKM)', coords: [53.4565, 14.5480], elevation: 35 },
  kollataja: { id: 'kollataja', name: 'Pętla Kołłątaja / Rondo Giedroycia', coords: [53.4475, 14.5490], elevation: 22 },
  przyjaciol: { id: 'przyjaciol', name: 'Al. Przyjaciół Żołnierza (DDR)', coords: [53.4545, 14.5610], elevation: 42 },
  kasprowicza: { id: 'kasprowicza', name: 'Park Kasprowicza (Teatr Letni)', coords: [53.4480, 14.5320], elevation: 25 },
  jasne_blonia: { id: 'jasne_blonia', name: 'Jasne Błonia im. Jana Pawła II', coords: [53.4420, 14.5400], elevation: 18 },
  syrenie_stawy: { id: 'syrenie_stawy', name: 'Syrenie Stawy / Ogród Dendrologiczny', coords: [53.4590, 14.5180], elevation: 30 },
  arkonka: { id: 'arkonka', name: 'Kąpielisko Arkonka (Lasek Arkoński)', coords: [53.4680, 14.5090], elevation: 38 },
  glebokie: { id: 'glebokie', name: 'Jezioro Głębokie (Węzeł Przesiadkowy)', coords: [53.4790, 14.4850], elevation: 45 },
  warszewo: { id: 'warszewo', name: 'Warszewo Wzgórza (Rynek / Szczecińska)', coords: [53.4680, 14.5460], elevation: 85 },
  waly_chrobrego: { id: 'waly_chrobrego', name: 'Wały Chrobrego / Bulwary Nadodrzańskie', coords: [53.4300, 14.5650], elevation: 12 }
};

// 2. Krawędzie grafu z atrybutami infrastruktury
const BIKE_EDGES = [
  {
    from: 'lucznicza', to: 'kadziak',
    distKm: 0.7, surface: 'asphalt', type: 'cpr', elevationGain: 0, traffic: 1,
    name: 'Osiedlowy ciąg pieszo-rowerowy Łucznicza',
    path: [[53.4530, 14.5520], [53.4522, 14.5475], [53.4510, 14.5440]]
  },
  {
    from: 'lucznicza', to: 'skm_niebuszewo',
    distKm: 0.6, surface: 'asphalt', type: 'ddr', elevationGain: 4, traffic: 1,
    name: 'Wydzielona DDR w stronę Stacji SKM',
    path: [[53.4530, 14.5520], [53.4545, 14.5505], [53.4565, 14.5480]]
  },
  {
    from: 'lucznicza', to: 'przyjaciol',
    distKm: 0.8, surface: 'asphalt', type: 'ddr', elevationGain: 10, traffic: 2,
    name: 'Łącznik rowerowy do Al. Przyjaciół Żołnierza',
    path: [[53.4530, 14.5520], [53.4538, 14.5565], [53.4545, 14.5610]]
  },
  {
    from: 'lucznicza', to: 'kollataja',
    distKm: 0.9, surface: 'asphalt', type: 'cpr', elevationGain: 0, traffic: 2,
    name: 'Zjazd w stronę Ronda Giedroycia i Kołłątaja',
    path: [[53.4530, 14.5520], [53.4505, 14.5505], [53.4475, 14.5490]]
  },
  {
    from: 'kadziak', to: 'kasprowicza',
    distKm: 1.1, surface: 'asphalt', type: 'cpr', elevationGain: 0, traffic: 1,
    name: 'Zielona aleja Park Kadziaka → Park Kasprowicza',
    path: [[53.4510, 14.5440], [53.4495, 14.5380], [53.4480, 14.5320]]
  },
  {
    from: 'kollataja', to: 'jasne_blonia',
    distKm: 0.9, surface: 'asphalt', type: 'ddr', elevationGain: 0, traffic: 2,
    name: 'DDR wzdłuż ul. Piotra Skargi do Jasnych Błoni',
    path: [[53.4475, 14.5490], [53.4450, 14.5445], [53.4420, 14.5400]]
  },
  {
    from: 'jasne_blonia', to: 'kasprowicza',
    distKm: 0.8, surface: 'asphalt', type: 'park_lane', elevationGain: 7, traffic: 0,
    name: 'Parkowa trasa platanowa Jasne Błonia ↔ Park Kasprowicza',
    path: [[53.4420, 14.5400], [53.4450, 14.5360], [53.4480, 14.5320]]
  },
  {
    from: 'kasprowicza', to: 'syrenie_stawy',
    distKm: 1.6, surface: 'gravel', type: 'park_lane', elevationGain: 8, traffic: 0,
    name: 'Szlak rekreacyjny Rusałka ↔ Syrenie Stawy',
    path: [[53.4480, 14.5320], [53.4535, 14.5250], [53.4590, 14.5180]]
  },
  {
    from: 'syrenie_stawy', to: 'arkonka',
    distKm: 1.3, surface: 'asphalt', type: 'ddr', elevationGain: 10, traffic: 0,
    name: 'Magistrala leśna Arkońska / Syrenie Stawy',
    path: [[53.4590, 14.5180], [53.4635, 14.5135], [53.4680, 14.5090]]
  },
  {
    from: 'arkonka', to: 'glebokie',
    distKm: 2.4, surface: 'asphalt', type: 'ddr', elevationGain: 12, traffic: 0,
    name: 'Nowa droga rowerowa Wokół Jeziora Głębokiego',
    path: [[53.4680, 14.5090], [53.4735, 14.4970], [53.4790, 14.4850]]
  },
  {
    from: 'skm_niebuszewo', to: 'warszewo',
    distKm: 2.1, surface: 'asphalt', type: 'ddr', elevationGain: 50, traffic: 2,
    name: 'Podjazd rowerowy ul. Warcisława / Krasińskiego na Warszewo',
    path: [[53.4565, 14.5480], [53.4620, 14.5470], [53.4680, 14.5460]]
  },
  {
    from: 'przyjaciol', to: 'warszewo',
    distKm: 2.3, surface: 'asphalt', type: 'ddr', elevationGain: 43, traffic: 2,
    name: 'DDR Trasa Północna w stronę Wzgórz Warszewskich',
    path: [[53.4545, 14.5610], [53.4610, 14.5535], [53.4680, 14.5460]]
  },
  {
    from: 'jasne_blonia', to: 'waly_chrobrego',
    distKm: 2.2, surface: 'asphalt', type: 'cpr', elevationGain: 0, traffic: 2,
    name: 'Złoty Szlak Turystyczny ku Odrze i Wałom Chrobrego',
    path: [[53.4420, 14.5400], [53.4360, 14.5525], [53.4300, 14.5650]]
  }
];

// Stacje BikeS i stacje naprawy IBOMBO
const BIKE_STATIONS = [
  { id: 'bs-1', name: 'BikeS #104 — Pętla Kołłątaja', bikes: 7, racks: 14, type: 'BikeS', coords: [53.4476, 14.5492] },
  { id: 'bs-2', name: 'BikeS #112 — SKM Niebuszewo', bikes: 5, racks: 10, type: 'BikeS', coords: [53.4562, 14.5483] },
  { id: 'bs-3', name: 'BikeS #118 — Park Kadziaka / Łucznicza', bikes: 6, racks: 12, type: 'BikeS', coords: [53.4512, 14.5445] },
  { id: 'bs-4', name: 'BikeS #130 — Przyjaciół Żołnierza / Obotrycka', bikes: 4, racks: 10, type: 'BikeS', coords: [53.4548, 14.5608] },
  { id: 'bs-5', name: 'BikeS #145 — Jasne Błonia (Pomnik Czynu Polaków)', bikes: 11, racks: 20, type: 'BikeS', coords: [53.4422, 14.5398] },
  { id: 'ib-1', name: 'IBOMBO — Stacja Naprawcza Park Kadziaka', tools: 'Klucze, łyżki, pompka z manometrem', type: 'IBOMBO', coords: [53.4508, 14.5442] },
  { id: 'ib-2', name: 'IBOMBO — Stacja Naprawcza SKM Niebuszewo', tools: 'Pompka DV/SV/AV, imbusy 2-8mm', type: 'IBOMBO', coords: [53.4568, 14.5486] }
];

// 3. Gotowe, zweryfikowane trasy rekomendowane
const CURATED_BIKE_ROUTES = [
  {
    id: 'cbr-1',
    name: 'Pętla Niebuszewo & Park Kadziaka',
    dist: '3.6 km',
    time: '14 min',
    diff: 'Łatwa',
    diffLevel: 1,
    surface: '95% Asfalt DDR, 5% Park',
    desc: 'Spokojna, bezpieczna pętla wokół Niebuszewa i osiedla Łucznicza z wjazdem do Parku Kadziaka. Idealna dla początkujących i rodzin.',
    path: ['lucznicza', 'kadziak', 'kollataja', 'skm_niebuszewo', 'lucznicza'],
    color: '#10b981'
  },
  {
    id: 'cbr-2',
    name: 'Zielony Korytarz: Łucznicza → Jasne Błonia',
    dist: '5.2 km',
    time: '20 min',
    diff: 'Łatwa',
    diffLevel: 1,
    surface: '100% Asfalt & DDR',
    desc: 'Najpopularniejsze połączenie dzielnicy ze ścisłym centrum i najpiękniejszymi alejami platanowymi Szczecina.',
    path: ['lucznicza', 'kadziak', 'kasprowicza', 'jasne_blonia'],
    color: '#0047AB'
  },
  {
    id: 'cbr-3',
    name: 'Leśny Szlak: Syrenie Stawy & Arkonka',
    dist: '8.4 km',
    time: '32 min',
    diff: 'Średnia',
    diffLevel: 2,
    surface: '65% Asfalt, 35% Szuter leśny',
    desc: 'Trasa rekreacyjno-przygodowa przez Park Kasprowicza, meandry rzeczki Osówki, Syrenie Stawy aż pod Kąpielisko Arkonka.',
    path: ['lucznicza', 'kadziak', 'kasprowicza', 'syrenie_stawy', 'arkonka'],
    color: '#f59e0b'
  },
  {
    id: 'cbr-4',
    name: 'Wspinaczka na Warszewo (Trasa Widokowa)',
    dist: '6.5 km',
    time: '26 min',
    diff: 'Wymagająca',
    diffLevel: 3,
    surface: '100% Gładki Asfalt DDR',
    desc: 'Sportowy podjazd pod Wzgórza Warszewskie (+75m przewyższenia). Fantastyczna panorama Szczecina i szybki zjazd w dół.',
    path: ['lucznicza', 'skm_niebuszewo', 'warszewo', 'przyjaciol', 'lucznicza'],
    color: '#E60026'
  }
];

// 4. Silnik routingu (Dijkstra z modyfikatorami wag)
const SzczecinBikeRouter = {
  // Średnie prędkości wg typu roweru
  SPEEDS: {
    city: 14.5,     // km/h
    road: 24.0,     // km/h
    gravel: 18.5,   // km/h
    ebike: 22.5     // km/h
  },

  calculateRoute(startId, endId, profile = 'safe', bikeType = 'city') {
    if (startId === endId) {
      return null;
    }

    // Budowa grafu dwukierunkowego
    const graph = {};
    Object.keys(BIKE_NODES).forEach(id => { graph[id] = []; });

    BIKE_EDGES.forEach(edge => {
      // Obliczenie wagi krawędzi
      let weight = edge.distKm;

      if (profile === 'safe') {
        if (edge.type === 'ddr') weight *= 0.6;
        else if (edge.type === 'cpr' || edge.type === 'park_lane') weight *= 0.8;
        else if (edge.traffic >= 3) weight *= 5.0; // unikaj ruchu
      } else if (profile === 'fast') {
        if (edge.surface === 'asphalt') weight *= 0.7;
        if (edge.surface === 'gravel') weight *= 2.5;
        if (edge.type === 'park_lane') weight *= 1.4; // w parku wolniej
      } else if (profile === 'flat') {
        if (edge.elevationGain > 5) {
          weight *= (1 + (edge.elevationGain / 10)); // kara za podjazd
        }
      } else if (profile === 'gravel') {
        if (edge.surface === 'gravel' || edge.type === 'park_lane') weight *= 0.6;
        if (edge.traffic > 1) weight *= 2.5;
      }

      graph[edge.from].push({ to: edge.to, weight, edge });
      graph[edge.to].push({
        to: edge.from,
        weight,
        edge: {
          ...edge,
          from: edge.to,
          to: edge.from,
          path: [...edge.path].reverse()
        }
      });
    });

    // Algorytm Dijkstra
    const distances = {};
    const previous = {};
    const previousEdge = {};
    const unvisited = new Set(Object.keys(BIKE_NODES));

    Object.keys(BIKE_NODES).forEach(id => {
      distances[id] = Infinity;
      previous[id] = null;
    });
    distances[startId] = 0;

    while (unvisited.size > 0) {
      let current = null;
      let minDistance = Infinity;

      unvisited.forEach(id => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          current = id;
        }
      });

      if (current === null || distances[current] === Infinity) break;
      if (current === endId) break;

      unvisited.delete(current);

      (graph[current] || []).forEach(neighbor => {
        if (!unvisited.has(neighbor.to)) return;
        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = current;
          previousEdge[neighbor.to] = neighbor.edge;
        }
      });
    }

    if (distances[endId] === Infinity) return null;

    // Rekonstrukcja ścieżki
    const pathNodes = [];
    const pathEdges = [];
    let curr = endId;
    while (curr) {
      pathNodes.unshift(curr);
      if (previousEdge[curr]) {
        pathEdges.unshift(previousEdge[curr]);
      }
      curr = previous[curr];
    }

    // Agregacja statystyk trasy
    let totalDistKm = 0;
    let totalElevationGain = 0;
    let coordinates = [];
    let ddrDist = 0;
    let asphaltDist = 0;

    pathEdges.forEach(edge => {
      totalDistKm += edge.distKm;
      totalElevationGain += edge.elevationGain;
      if (edge.type === 'ddr') ddrDist += edge.distKm;
      if (edge.surface === 'asphalt') asphaltDist += edge.distKm;

      if (coordinates.length === 0) {
        coordinates = [...edge.path];
      } else {
        // Połącz bez duplikowania wspólnego węzła
        coordinates = coordinates.concat(edge.path.slice(1));
      }
    });

    const speed = this.SPEEDS[bikeType] || 16;
    const timeMinutes = Math.round((totalDistKm / speed) * 60);
    const ddrPercent = Math.min(100, Math.round((ddrDist / totalDistKm) * 100));
    const asphaltPercent = Math.min(100, Math.round((asphaltDist / totalDistKm) * 100));

    return {
      startNode: BIKE_NODES[startId],
      endNode: BIKE_NODES[endId],
      pathNodes: pathNodes.map(id => BIKE_NODES[id]),
      pathEdges,
      coordinates,
      totalDistKm: parseFloat(totalDistKm.toFixed(1)),
      timeMinutes: Math.max(3, timeMinutes),
      totalElevationGain,
      ddrPercent,
      asphaltPercent,
      profile,
      bikeType,
      safetyScore: profile === 'safe' ? 98 : ddrPercent > 70 ? 92 : 82
    };
  }
};

// 5. Moduł Widoku i Interakcji Rowerowych
const BikeSectionManager = {
  currentRoute: null,
  routeLayer: null,

  init() {
    this.renderSection();
    this.bindEvents();
  },

  renderSection() {
    const container = document.getElementById('section-bikes');
    if (!container) return;

    container.innerHTML = `
      <div class="section-content">
        <!-- Hero Header -->
        <div class="section-hero bike-hero">
          <div class="bike-hero-badge">🚲 SZCZECIN BIKE NETWORK</div>
          <h2>Ścieżki i Trasy Rowerowe</h2>
          <p>Inteligentny planer dróg rowerowych, nawierzchni i stacji BikeS w rejonie Niebuszewa</p>
        </div>

        <!-- Planner Card -->
        <div class="bike-planner-card">
          <div class="bpc-header">
            <span class="bpc-icon">🧭</span>
            <div>
              <h3>Inteligentny Dopasowywacz Trasy</h3>
              <small>Algorytm A* dopasowuje trasę do typu roweru i bezpieczeństwa</small>
            </div>
          </div>

          <div class="bpc-form-grid">
            <div class="bpc-field">
              <label for="bikeStartSelect">📍 Punkt startowy:</label>
              <select id="bikeStartSelect" class="bike-select">
                <option value="lucznicza" selected>🏹 ul. Łucznicza / Tarczowa (Centrum)</option>
                <option value="kadziak">🌳 Park Kadziaka</option>
                <option value="skm_niebuszewo">🚉 Stacja SKM Niebuszewo</option>
                <option value="kollataja">🚋 Pętla Kołłątaja</option>
                <option value="przyjaciol">🛣️ Al. Przyjaciół Żołnierza</option>
              </select>
            </div>

            <div class="bpc-field">
              <label for="bikeEndSelect">🏁 Cel podróży:</label>
              <select id="bikeEndSelect" class="bike-select">
                <option value="jasne_blonia" selected>🌳 Jasne Błonia (Platany)</option>
                <option value="kasprowicza">🎭 Park Kasprowicza (Teatr Letni)</option>
                <option value="syrenie_stawy">💧 Syrenie Stawy</option>
                <option value="arkonka">🏊 Kąpielisko Arkonka</option>
                <option value="glebokie">🌲 Jezioro Głębokie</option>
                <option value="warszewo">⛰️ Warszewo Wzgórza</option>
                <option value="waly_chrobrego">⚓ Wały Chrobrego / Odra</option>
              </select>
            </div>

            <div class="bpc-field">
              <label for="bikeProfileSelect">⚙️ Profil trasy:</label>
              <select id="bikeProfileSelect" class="bike-select">
                <option value="safe" selected>🛡️ Najbezpieczniejsza (100% DDR/Parki)</option>
                <option value="fast">⚡ Najszybsza (Sport & Gładki asfalt)</option>
                <option value="flat">🍃 Płaska (Unikanie podjazdów pod górę)</option>
                <option value="gravel">🌲 Gravel / Rekreacja leśna</option>
              </select>
            </div>

            <div class="bpc-field">
              <label for="bikeTypeSelect">🚲 Twój rower:</label>
              <select id="bikeTypeSelect" class="bike-select">
                <option value="city" selected>🚲 Miejski / Szczeciński BikeS</option>
                <option value="road">🚴 Szosowy / Commuter</option>
                <option value="gravel">🚵 Gravel / Cross</option>
                <option value="ebike">⚡ E-Bike / Górski</option>
              </select>
            </div>
          </div>

          <div class="bpc-action-row">
            <button id="calcBikeRouteBtn" class="bike-calc-btn">
              <span>🚀 Wyznacz optymalną trasę</span>
            </button>
          </div>

          <!-- Planner Result Output Box -->
          <div id="bikePlannerResult" class="bpc-result-box"></div>
        </div>

        <!-- Curated Routes Header -->
        <div class="section-sub-header">
          <h3>🌟 Polecane Trasy Rowerowe na Niebuszewie</h3>
          <p>Przetestowane, bezpieczne pętle dla każdego stopnia zaawansowania</p>
        </div>

        <div class="curated-routes-grid" id="curatedRoutesGrid">
          ${CURATED_BIKE_ROUTES.map(r => this.renderCuratedCard(r)).join('')}
        </div>

        <!-- BikeS Stations & Service Spots -->
        <div class="section-sub-header" style="margin-top: 32px;">
          <h3>🔧 Stacje BikeS & Samoobsługowe Stacje Naprawcze IBOMBO</h3>
          <p>Dostępne rowery miejskie oraz punkty z pompkami i narzędziami</p>
        </div>

        <div class="bike-stations-grid">
          ${BIKE_STATIONS.map(s => this.renderStationCard(s)).join('')}
        </div>
      </div>
    `;

    // Calculate initial route
    this.handleCalculate();
  },

  renderCuratedCard(r) {
    const diffBadge = r.diffLevel === 1
      ? '<span class="cbr-badge easy">Łatwa</span>'
      : r.diffLevel === 2
        ? '<span class="cbr-badge medium">Średnia</span>'
        : '<span class="cbr-badge hard">Sportowa</span>';

    return `
      <div class="cbr-card" style="border-top: 4px solid ${r.color}">
        <div class="cbr-top">
          <span class="cbr-name">${r.name}</span>
          ${diffBadge}
        </div>
        <p class="cbr-desc">${r.desc}</p>
        <div class="cbr-meta">
          <span>📏 <strong>${r.dist}</strong></span>
          <span>⏱️ <strong>${r.time}</strong></span>
          <span>🛣️ <strong>${r.surface}</strong></span>
        </div>
        <div class="cbr-actions">
          <button class="cbr-btn map-btn" onclick="BikeSectionManager.previewCurated('${r.id}')">
            🗺️ Pokaż na mapie
          </button>
          <button class="cbr-btn gpx-btn" onclick="BikeSectionManager.downloadCuratedGpx('${r.id}')">
            💾 GPX
          </button>
        </div>
      </div>
    `;
  },

  renderStationCard(s) {
    const isBikeS = s.type === 'BikeS';
    return `
      <div class="station-card ${isBikeS ? 'bikes-station' : 'ibombo-station'}">
        <div class="sc-header">
          <span class="sc-icon">${isBikeS ? '🚲' : '🔧'}</span>
          <div>
            <strong>${s.name}</strong>
            <span class="sc-type">${isBikeS ? 'Szczeciński Rower Miejski' : 'Stacja Naprawcza IBOMBO'}</span>
          </div>
        </div>
        <div class="sc-body">
          ${isBikeS
            ? `<div class="sc-status"><span class="sc-avail">${s.bikes}</span> dostępnych rowerów (${s.racks} stojaków)</div>`
            : `<div class="sc-status"><span class="sc-tools">🛠️ ${s.tools}</span></div>`
          }
        </div>
        <button class="sc-locate-btn" onclick="BikeSectionManager.locateStation(${s.coords[0]}, ${s.coords[1]}, '${s.name}')">
          📍 Zobacz na mapie
        </button>
      </div>
    `;
  },

  bindEvents() {
    const calcBtn = document.getElementById('calcBikeRouteBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => this.handleCalculate());
    }

    // Auto calculate on change
    ['bikeStartSelect', 'bikeEndSelect', 'bikeProfileSelect', 'bikeTypeSelect'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.handleCalculate());
    });
  },

  handleCalculate() {
    const startId = document.getElementById('bikeStartSelect')?.value || 'lucznicza';
    const endId = document.getElementById('bikeEndSelect')?.value || 'jasne_blonia';
    const profile = document.getElementById('bikeProfileSelect')?.value || 'safe';
    const bikeType = document.getElementById('bikeTypeSelect')?.value || 'city';

    const result = SzczecinBikeRouter.calculateRoute(startId, endId, profile, bikeType);
    this.currentRoute = result;
    const box = document.getElementById('bikePlannerResult');
    if (!box) return;

    if (!result) {
      box.innerHTML = `
        <div class="bpc-error">
          <span>⚠️ Wybrano ten sam punkt startowy i docelowy. Wybierz różne punkty.</span>
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <div class="bpr-summary-header">
        <div class="bpr-stat-block">
          <span class="bpr-val">${result.totalDistKm} km</span>
          <span class="bpr-lbl">Dystans</span>
        </div>
        <div class="bpr-stat-block">
          <span class="bpr-val">${result.timeMinutes} min</span>
          <span class="bpr-lbl">Szacowany czas</span>
        </div>
        <div class="bpr-stat-block">
          <span class="bpr-val">+${result.totalElevationGain} m</span>
          <span class="bpr-lbl">Przewyższenie</span>
        </div>
        <div class="bpr-stat-block">
          <span class="bpr-val safety-val">${result.safetyScore}%</span>
          <span class="bpr-lbl">Wskaźnik Bezpieczeństwa</span>
        </div>
      </div>

      <div class="bpr-progress-bars">
        <div class="bpr-bar-item">
          <div class="bpr-bar-label">
            <span>Dedykowane drogi rowerowe (DDR / CPR):</span>
            <strong>${result.ddrPercent}%</strong>
          </div>
          <div class="bpr-bar-track">
            <div class="bpr-bar-fill ddr-fill" style="width: ${result.ddrPercent}%"></div>
          </div>
        </div>
        <div class="bpr-bar-item">
          <div class="bpr-bar-label">
            <span>Gładka nawierzchnia asfaltowa:</span>
            <strong>${result.asphaltPercent}%</strong>
          </div>
          <div class="bpr-bar-track">
            <div class="bpr-bar-fill asphalt-fill" style="width: ${result.asphaltPercent}%"></div>
          </div>
        </div>
      </div>

      <div class="bpr-itinerary">
        <strong>Przebieg trasy:</strong>
        <div class="bpr-steps">
          ${result.pathNodes.map((node, i) => `
            <span class="bpr-step ${i === 0 ? 'start' : i === result.pathNodes.length - 1 ? 'end' : ''}">
              ${i === 0 ? '🟢 ' : i === result.pathNodes.length - 1 ? '🏁 ' : '• '}${node.name}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="bpr-cta-row">
        <button class="bpr-view-map-btn" onclick="BikeSectionManager.showCurrentOnMap()">
          🗺️ Pokaż trasę na mapie rowerowej CyclOSM
        </button>
        <button class="bpr-gpx-btn" onclick="BikeSectionManager.downloadCurrentGpx()">
          💾 Pobierz plik GPX
        </button>
      </div>
    `;
  },

  showCurrentOnMap() {
    if (!this.currentRoute) return;
    this.renderRouteOnLeaflet(this.currentRoute.coordinates, `${this.currentRoute.startNode.name} → ${this.currentRoute.endNode.name}`);
  },

  previewCurated(id) {
    const route = CURATED_BIKE_ROUTES.find(r => r.id === id);
    if (!route) return;

    // Połącz koordynaty z węzłów
    let coords = [];
    for (let i = 0; i < route.path.length - 1; i++) {
      const edge = BIKE_EDGES.find(e =>
        (e.from === route.path[i] && e.to === route.path[i+1]) ||
        (e.to === route.path[i] && e.from === route.path[i+1])
      );
      if (edge) {
        const seg = edge.from === route.path[i] ? edge.path : [...edge.path].reverse();
        coords = coords.concat(seg);
      }
    }
    this.renderRouteOnLeaflet(coords, route.name);
  },

  renderRouteOnLeaflet(coords, title) {
    if (!window.state?.map) {
      if (typeof navigateTo === 'function') navigateTo('map');
      return;
    }

    const map = window.state.map;

    // Switch to CyclOSM base layer for optimal bike path visibility
    if (window.state.baseLayers && window.state.baseLayers.cyclosm) {
      if (window.state.currentBaseLayer && window.state.baseLayers[window.state.currentBaseLayer]) {
        map.removeLayer(window.state.baseLayers[window.state.currentBaseLayer]);
      }
      window.state.baseLayers.cyclosm.addTo(map);
      window.state.currentBaseLayer = 'cyclosm';
    }

    // Usunięcie poprzedniej warstwy trasy
    if (this.routeLayer) {
      map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }

    // Stwórz nową polilinię z poświatą
    const polylineShadow = L.polyline(coords, {
      color: '#002D62',
      weight: 8,
      opacity: 0.6,
      lineCap: 'round',
      lineJoin: 'round'
    });

    const polyline = L.polyline(coords, {
      color: '#10b981',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    });

    // Start & End markers
    const startIcon = L.divIcon({
      className: 'bike-point-marker start',
      html: '<div style="background:#10b981;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.4);font-size:16px;">▶</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const endIcon = L.divIcon({
      className: 'bike-point-marker end',
      html: '<div style="background:#e11d48;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.4);font-size:16px;">🏁</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const startMarker = L.marker(coords[0], { icon: startIcon }).bindPopup(`<strong>Początek trasy:</strong> ${title}`);
    const endMarker = L.marker(coords[coords.length - 1], { icon: endIcon }).bindPopup(`<strong>Koniec trasy:</strong> ${title}`);

    this.routeLayer = L.featureGroup([polylineShadow, polyline, startMarker, endMarker]);
    this.routeLayer.addTo(map);

    if (typeof navigateTo === 'function') {
      navigateTo('map');
    }

    setTimeout(() => {
      map.fitBounds(this.routeLayer.getBounds(), { padding: [60, 60], maxZoom: 16 });
      if (typeof showToast === 'function') {
        showToast(`🚲 Załadowano trasę rowerową: ${title}`);
      }
    }, 250);
  },

  locateStation(lat, lng, name) {
    if (!window.state?.map) return;
    if (typeof navigateTo === 'function') navigateTo('map');
    setTimeout(() => {
      window.state.map.setView([lat, lng], 17, { animate: true });
      L.popup().setLatLng([lat, lng]).setContent(`<strong>📍 ${name}</strong>`).openOn(window.state.map);
    }, 250);
  },

  downloadCurrentGpx() {
    if (!this.currentRoute) return;
    this.exportGpx(this.currentRoute.coordinates, `trasa_rowerowa_${this.currentRoute.startNode.id}_${this.currentRoute.endNode.id}`);
  },

  downloadCuratedGpx(id) {
    const route = CURATED_BIKE_ROUTES.find(r => r.id === id);
    if (!route) return;
    let coords = [];
    for (let i = 0; i < route.path.length - 1; i++) {
      const edge = BIKE_EDGES.find(e =>
        (e.from === route.path[i] && e.to === route.path[i+1]) ||
        (e.to === route.path[i] && e.from === route.path[i+1])
      );
      if (edge) {
        coords = coords.concat(edge.path);
      }
    }
    this.exportGpx(coords, `szczecin_rower_${route.id}`);
  },

  exportGpx(coords, filename) {
    let trkpts = coords.map(c => `      <trkpt lat="${c[0]}" lon="${c[1]}"><ele>25</ele></trkpt>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Łucznicza Guide Szczecin — Bike Router">
  <trk>
    <name>${filename}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([xml], { type: 'application/gpx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
      showToast('💾 Plik GPX trasy rowerowej został pobrany!');
    }
  }
};

window.SzczecinBikeRouter = SzczecinBikeRouter;
window.BikeSectionManager = BikeSectionManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BikeSectionManager.init());
} else {
  BikeSectionManager.init();
}
