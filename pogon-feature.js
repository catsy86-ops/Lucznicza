/**
 * pogon-feature.js — Pogoń Szczecin & Matchday Feature Module
 * Duma Pomorza, Tryb Dnia Meczowego, Nawigator Niebuszewo -> Stadion Krygiera,
 * Syntezator dopingu Web Audio, Gastro-mecz ("Gdzie na giętą"), Skład i Ekstraklasa.
 */
'use strict';

const PogonFeature = (() => {

  // ── Dane klubu i stadionu ───────────────────────────────
  const CLUB = {
    name: 'Pogoń Szczecin',
    founded: 1948,
    stadium: 'Stadion Miejski im. Floriana Krygiera',
    stadiumCapacity: 21163,
    stadiumCoords: [53.4300, 14.5440],
    colors: ['#002D62', '#8B0000', '#FFD700'],
    league: 'PKO BP Ekstraklasa',
    city: 'Szczecin',
    website: 'pogonszczecin.pl',
    motto: 'Duma Pomorza — Morski Klub Sportowy',
    badge: '⚓',
  };

  const SEASON = {
    year: '2025/26',
    position: 3,
    played: 32,
    won: 18,
    drawn: 8,
    lost: 6,
    goalsFor: 54,
    goalsAgainst: 31,
    points: 62,
  };

  const NEXT_MATCH = {
    opponent: 'Legia Warszawa',
    dateStr: 'Sobota, 17:30',
    venue: 'Stadion Florian Krygier, Szczecin',
    home: true,
    ticketsAvailable: true,
    expectedCrowd: 'Komplet widzów (21 163)'
  };

  // Tabela Ekstraklasy
  const STANDINGS = [
    { pos: 1, team: 'Jagiellonia Białystok', played: 32, w: 20, d: 7, l: 5, gf: 64, ga: 32, pts: 67, trend: '📈' },
    { pos: 2, team: 'Raków Częstochowa',    played: 32, w: 19, d: 8, l: 5, gf: 58, ga: 30, pts: 65, trend: '📈' },
    { pos: 3, team: 'Pogoń Szczecin',       played: 32, w: 18, d: 8, l: 6, gf: 54, ga: 31, pts: 62, trend: '🔥', highlight: true },
    { pos: 4, team: 'Lech Poznań',          played: 32, w: 16, d: 7, l: 9, gf: 52, ga: 38, pts: 55, trend: '➡️' },
    { pos: 5, team: 'Legia Warszawa',       played: 32, w: 15, d: 8, l: 9, gf: 50, ga: 40, pts: 53, trend: '📉' },
    { pos: 6, team: 'Górnik Zabrze',        played: 32, w: 14, d: 7, l: 11, gf: 46, ga: 42, pts: 49, trend: '➡️' },
    { pos: 7, team: 'Cracovia',             played: 32, w: 12, d: 9, l: 11, gf: 43, ga: 45, pts: 45, trend: '📉' },
    { pos: 8, team: 'Widzew Łódź',          played: 32, w: 12, d: 7, l: 13, gf: 41, ga: 46, pts: 43, trend: '➡️' },
  ];

  // Skład
  const SQUAD = [
    { no: 11, name: 'Kamil Grosicki',   pos: 'FW', age: 36, nat: '🇵🇱', goals: 11, assists: 9, captain: true },
    { no: 9,  name: 'Efthymis Koulouris',pos: 'FW',age: 30, nat: '🇬🇷', goals: 16, assists: 3 },
    { no: 10, name: 'Wahan Biczachczian',pos: 'MF', age: 26, nat: '🇦🇲', goals: 8, assists: 6 },
    { no: 77, name: 'Valentin Cojocaru', pos: 'GK', age: 30, nat: '🇷🇴', appearances: 30, cleanSheets: 11 },
    { no: 28, name: 'Linus Wahlqvist',  pos: 'DF', age: 28, nat: '🇸🇪', appearances: 29 },
    { no: 33, name: 'Mariusz Malec',    pos: 'DF', age: 29, nat: '🇵🇱', appearances: 28 },
    { no: 21, name: 'Patryk Paryzek',   pos: 'FW', age: 19, nat: '🇵🇱', goals: 4, assists: 2 },
    { no: 8,  name: 'Fredrik Ulvestad', pos: 'MF', age: 32, nat: '🇳🇴', goals: 5, assists: 4 },
    { no: 22, name: 'Vahan Bichakhchyan',pos:'MF', age: 26, nat: '🇦🇲', goals: 7, assists: 5 },
    { no: 61, name: 'Kacper Smoliński', pos: 'MF', age: 24, nat: '🇵🇱', goals: 2, assists: 2 }
  ];

  // Punkty Gastro-Mecz ("Gdzie na giętą")
  const GASTRO_MATCHDAY = [
    {
      name: 'Grill Kibica pod Stadionem',
      addr: 'ul. Twardowskiego / Karłowicza',
      specialty: 'Kultowa gięta z rusztu, chleb ze smalcem, musztarda sarepska',
      badge: '🌭 Klasyk Meczowy',
      desc: 'Niezbędny punkt zbiórki przed wejściem na trybuny. Dym z grilla i zapach pieczonej kiełbasy czuć już od Witkiewicza.',
      coords: [53.4305, 14.5428]
    },
    {
      name: 'Pub Klatka — Baza Niebuszewo',
      addr: 'ul. Łucznicza 43, Szczecin',
      specialty: 'Zimne piwo na klatce, dyskusje o taktyce i składzie',
      badge: '🍻 Przedmeczowa Zbiórka',
      desc: 'Osiedlowy punkt zbiórki kibiców z Łuczniczej i Tarczowej przed wspólnym wymarszem na tramwaj 2.',
      coords: [53.45405, 14.54752]
    },
    {
      name: 'Zapiekanki z Pieca Manhattan',
      addr: 'Plac Kołłątaja / Targowisko Manhattan',
      specialty: 'Półmetrowa zapiekanka z pieczarkami i sosem szczypiorowym',
      badge: '🥖 Węglowodany na Trasę',
      desc: 'Idealny przystanek przy przesiadce na pętli Kołłątaja. Działa od lat 90.',
      coords: [53.4478, 14.5520]
    },
    {
      name: 'Bar Rab — Frytburger Po Meczu',
      addr: 'ul. Krzywoustego 1, Szczecin',
      specialty: 'Szczeciński Frytburger z sosem czosnkowym',
      badge: '🍟 Tradycja po 90 minutach',
      desc: 'Klasyczna dogrywka po wygranym meczu w drodze powrotnej z Pogodna do centrum.',
      coords: [53.4285, 14.5480]
    }
  ];

  // ── Syntezator Web Audio API: Stadionowy Beat Pogoni ──────
  let audioCtx = null;
  let isPlayingChant = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playStadiumDrumBeat() {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isPlayingChant) {
      if (typeof showToast === 'function') showToast('🥁 Doping już wybrzmiewa na stadionie!');
      return;
    }
    isPlayingChant = true;

    // Pattern klaskania / bębna Dumy Pomorza:
    // [Bum, Bum, Bum-Bum-Bum, POGOŃ SZCZECIN!]
    const pattern = [
      { time: 0.0, freq: 85, dur: 0.18, type: 'drum' },
      { time: 0.45, freq: 85, dur: 0.18, type: 'drum' },
      { time: 0.90, freq: 85, dur: 0.18, type: 'drum' },
      { time: 1.15, freq: 85, dur: 0.18, type: 'drum' },
      { time: 1.40, freq: 95, dur: 0.25, type: 'drum' },
      // Fanfara akordu Dumy Pomorza:
      { time: 1.90, freq: 261.6, dur: 0.35, type: 'horn' },
      { time: 2.10, freq: 329.6, dur: 0.35, type: 'horn' },
      { time: 2.30, freq: 392.0, dur: 0.55, type: 'horn' },
      { time: 2.50, freq: 523.2, dur: 0.75, type: 'horn' },
    ];

    const now = ctx.currentTime;

    pattern.forEach(step => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (step.type === 'drum') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step.freq, now + step.time);
        osc.frequency.exponentialRampToValueAtTime(35, now + step.time + step.dur);
        gain.gain.setValueAtTime(0.7, now + step.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + step.time + step.dur);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(step.freq, now + step.time);
        gain.gain.setValueAtTime(0.3, now + step.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + step.time + step.dur);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + step.time);
      osc.stop(now + step.time + step.dur + 0.05);
    });

    if (typeof showToast === 'function') {
      showToast('🥁 ⚽ MY PORTOWCY! — Rozbrzmiewa stadionowy doping Pogoni!');
    }

    // Odblokuj odznakę "12. Zawodnik Pogoni"
    if (window.__SZCZECIN_APP__?.explorerBadges) {
      const res = window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-matchday-pogon');
      if (res.success && typeof showToast === 'function') {
        setTimeout(() => {
          showToast(`🏆 Odblokowano nową odznakę: ⚽ ${res.badge.title} (+${res.badge.points} pkt)!`);
        }, 3200);
      }
    }

    setTimeout(() => {
      isPlayingChant = false;
    }, 3500);
  }

  // ── Przełącznik Trybu Dnia Meczowego ─────────────────────
  function toggleMatchdayMode() {
    const isPogonTheme = document.documentElement.getAttribute('data-theme') === 'pogon';
    const newTheme = isPogonTheme ? 'dark' : 'pogon';
    
    if (typeof applyTheme === 'function') {
      applyTheme(newTheme);
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('lucznicza_theme', newTheme);
    }

    if (newTheme === 'pogon') {
      playStadiumDrumBeat();
      if (typeof showToast === 'function') {
        showToast('⚓ AKTYWOWANO TRYB DNIA MECZOWEGO! Granatowo-bordowe barwy Dumy Pomorza.');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('🌙 Powrócono do standardowego trybu nocnego.');
      }
    }
    render();
  }

  // ── Rysowanie Trasy Meczowej na Mapie ─────────────────────
  let matchdayRouteLayer = null;

  function drawMatchdayRouteOnMap(startKey = 'kollataja') {
    const map = window.state?.map;
    if (!map) {
      if (typeof showToast === 'function') showToast('❌ Mapa nie jest jeszcze zainicjalizowana');
      return;
    }

    // Punkty trasy tranzytowej: Kołłątaja -> Brama Portowa -> Plac Kościuszki -> Stadion
    const coordsMap = {
      lucznicza: [
        [53.45405, 14.54752], // Pub Klatka / Łucznicza 43
        [53.4510, 14.5485],
        [53.4475, 14.5518],   // Pętla Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4270, 14.5385],   // Plac Kościuszki
        [53.4300, 14.5440]    // Stadion Miejski Florian Krygier
      ],
      kollataja: [
        [53.4475, 14.5518],   // Pętla Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4270, 14.5385],   // Plac Kościuszki
        [53.4300, 14.5440]    // Stadion Miejski
      ],
      dworzec: [
        [53.4554, 14.5587],   // Dworzec SKM Niebuszewo
        [53.4475, 14.5518],   // Kołłątaja
        [53.4385, 14.5535],   // Plac Rodła
        [53.4248, 14.5528],   // Brama Portowa
        [53.4300, 14.5440]    // Stadion
      ]
    };

    const routeCoords = coordsMap[startKey] || coordsMap.kollataja;

    if (typeof navigateTo === 'function') {
      navigateTo('map');
    }

    setTimeout(() => {
      if (matchdayRouteLayer) {
        map.removeLayer(matchdayRouteLayer);
      }

      // Granatowo-bordowa świecąca polilinia
      matchdayRouteLayer = L.layerGroup().addTo(map);

      // Otoczka złota
      const casing = L.polyline(routeCoords, {
        color: '#FFD700',
        weight: 9,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(matchdayRouteLayer);

      // Wnętrze granatowo-bordowe
      const core = L.polyline(routeCoords, {
        color: '#002D62',
        weight: 5,
        opacity: 1,
        dashArray: '8, 6'
      }).addTo(matchdayRouteLayer);

      // Marker Startu
      const startCoord = routeCoords[0];
      const startIcon = L.divIcon({
        html: `<div style="background:#002D62; border:2.5px solid #FFD700; color:#fff; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 12px rgba(0,45,98,0.6);">🚩</div>`,
        iconSize: [38, 38], iconAnchor: [19, 19], className: ''
      });
      L.marker(startCoord, { icon: startIcon })
        .addTo(matchdayRouteLayer)
        .bindPopup(`<strong>Zbiórka na Niebuszewie</strong><br>Stąd ruszamy tramwajem linii 2 na Twardowskiego!`);

      // Marker Stadionu
      const endCoord = routeCoords[routeCoords.length - 1];
      const stadiumIcon = L.divIcon({
        html: `<div style="background:#8B0000; border:3px solid #FFD700; color:#fff; border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 6px 16px rgba(139,0,0,0.7); animation:badge-pulse 1.8s infinite;">🏟️</div>`,
        iconSize: [48, 48], iconAnchor: [24, 24], className: ''
      });
      const endMarker = L.marker(endCoord, { icon: stadiumIcon })
        .addTo(matchdayRouteLayer)
        .bindPopup(`<strong>${CLUB.stadium}</strong><br>Duma Pomorza vs ${NEXT_MATCH.opponent}<br>Pojemność: ${CLUB.stadiumCapacity.toLocaleString('pl-PL')} widzów!`);

      map.fitBounds(casing.getBounds(), { padding: [60, 60] });
      endMarker.openPopup();

      if (typeof showToast === 'function') {
        showToast('🗺️ Wyznaczono granatowo-bordową trasę meczową na Stadion Krygiera!');
      }

      // Odblokuj odznakę
      if (window.__SZCZECIN_APP__?.explorerBadges) {
        window.__SZCZECIN_APP__.explorerBadges.unlockBadge('badge-matchday-pogon');
      }
    }, 350);
  }

  // ── Style CSS sekcji ─────────────────────────────────────
  const CSS_STYLES = `
    #section-pogon {
      background: linear-gradient(180deg, rgba(0, 45, 98, 0.05) 0%, rgba(139, 0, 0, 0.05) 100%);
    }
    #section-pogon .section-content {
      padding-bottom: 50px;
      max-width: 960px;
      margin: 0 auto;
    }
    .pogon-matchday-banner {
      background: linear-gradient(135deg, #002D62 0%, #001838 50%, #7A0026 100%);
      border: 2px solid #FFD700;
      border-radius: 16px;
      padding: 24px 20px;
      color: #ffffff;
      margin-bottom: 24px;
      box-shadow: 0 8px 28px rgba(0, 45, 98, 0.35);
      position: relative;
      overflow: hidden;
    }
    .pmb-shimmer {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%);
      pointer-events: none;
    }
    .pmb-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }
    .pmb-badge {
      background: #FFD700;
      color: #002D62;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .pmb-date {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
    }
    .pmb-match {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin: 16px 0;
      position: relative;
      z-index: 1;
    }
    .pmb-team {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .pmb-vs {
      font-size: 14px;
      color: #FFD700;
      font-weight: 900;
      background: rgba(0,0,0,0.3);
      padding: 4px 10px;
      border-radius: 8px;
    }
    .pmb-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
      position: relative;
      z-index: 1;
    }
    .pmb-btn-primary {
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      color: #002D62;
      border: none;
      font-weight: 800;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(255, 215, 0, 0.3);
    }
    .pmb-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255, 215, 0, 0.45);
    }
    .pmb-btn-secondary {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-weight: 700;
      font-size: 13px;
      padding: 10px 16px;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .pmb-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: #FFD700;
    }
    .matchday-nav-card {
      background: var(--surface, #1e293b);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .mnc-title {
      font-size: 16px;
      font-weight: 800;
      color: #FFD700;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .mnc-routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .mnc-route-box {
      background: var(--surface2, rgba(255,255,255,0.04));
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 10px;
      padding: 14px;
      position: relative;
    }
    .mnc-route-tag {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
      background: #002D62;
      color: #FFD700;
      display: inline-block;
      margin-bottom: 6px;
      border: 1px solid rgba(255,215,0,0.3);
    }
    .mnc-route-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text1, #fff);
      margin-bottom: 4px;
    }
    .mnc-route-desc {
      font-size: 12px;
      color: var(--text2, #94a3b8);
      line-height: 1.45;
      margin-bottom: 10px;
    }
    .mnc-map-draw-btn {
      background: #002D62;
      color: #FFD700;
      border: 1px solid #FFD700;
      font-weight: 700;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    .mnc-map-draw-btn:hover {
      background: #7A0026;
      color: #fff;
    }
    .pogon-gastro-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-top: 12px;
    }
    .gastro-card {
      background: var(--surface, #1e293b);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .gastro-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }
    .gastro-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--text1, #fff);
    }
    .gastro-badge {
      font-size: 10px;
      background: #7A0026;
      color: #FFD700;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 700;
      white-space: nowrap;
    }
    .gastro-addr {
      font-size: 11px;
      color: var(--text2, #94a3b8);
      margin-bottom: 6px;
    }
    .gastro-spec {
      font-size: 12px;
      color: #FFD700;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .gastro-desc {
      font-size: 12px;
      color: var(--text2, #94a3b8);
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .gastro-map-btn {
      background: transparent;
      border: 1px solid var(--border, rgba(255,255,255,0.2));
      color: var(--text1, #fff);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gastro-map-btn:hover {
      border-color: #FFD700;
      color: #FFD700;
    }
  `;

  function injectStyles() {
    if (document.getElementById('pogonFeatureStyle')) return;
    const s = document.createElement('style');
    s.id = 'pogonFeatureStyle';
    s.textContent = CSS_STYLES;
    document.head.appendChild(s);
  }

  // ── Render Matchday Banner ───────────────────────────────
  function renderMatchdayBanner() {
    const isPogonTheme = document.documentElement.getAttribute('data-theme') === 'pogon';
    return `
      <div class="pogon-matchday-banner">
        <div class="pmb-shimmer"></div>
        <div class="pmb-top">
          <span class="pmb-badge">🔥 Najbliższy Mecz Dumy Pomorza</span>
          <span class="pmb-date">📅 ${NEXT_MATCH.dateStr}</span>
        </div>
        <div class="pmb-match">
          <div class="pmb-team">⚽ Pogoń Szczecin</div>
          <div class="pmb-vs">VS</div>
          <div class="pmb-team">${NEXT_MATCH.opponent}</div>
        </div>
        <div style="font-size:12px; opacity:0.9; margin-bottom: 12px;">
          📍 ${NEXT_MATCH.venue} · 🎟️ ${NEXT_MATCH.expectedCrowd}
        </div>
        <div class="pmb-actions">
          <button class="pmb-btn-primary" onclick="PogonFeature.toggleMatchdayMode()">
            ${isPogonTheme ? '🛡️ Wyłącz Tryb Meczowy' : '⚓ Włącz Tryb Dnia Meczowego (Barwy Klubu)'}
          </button>
          <button class="pmb-btn-secondary" onclick="PogonFeature.playStadiumDrumBeat()">
            🥁 Ryk Portowców (Audio)
          </button>
          <button class="pmb-btn-secondary" onclick="PogonFeature.drawMatchdayRouteOnMap('kollataja')">
            🗺️ Rysuj Trasę Meczową na Mapie
          </button>
        </div>
      </div>
    `;
  }

  // ── Render Matchday Navigator Card ───────────────────────
  function renderMatchdayNavigator() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🚇</span>
          <span>Nawigator Meczowy: Jak z Niebuszewa na Stadion Krygiera?</span>
        </div>
        <p style="font-size:13px; color:var(--text2, #94a3b8); margin-bottom:12px;">
          Wybierz najdogodniejszy punkt startu w okolicy Łuczniczej, aby wygodnie i na czas dotrzeć na trybuny przy ul. Twardowskiego.
        </p>

        <div class="mnc-routes-grid">
          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚋 Tramwaj ZDiTM · 21 min</span>
            <div class="mnc-route-name">Start: Pętla Kołłątaja</div>
            <div class="mnc-route-desc">
              Tramwaj linii <strong>2</strong> z Pętli Kołłątaja do Bramy Portowej, przesiadka w linię <strong>7</strong> lub <strong>5</strong> pod bramy stadionu.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('kollataja')">
              🗺️ Pokaż tę trasę na mapie
            </button>
          </div>

          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚶 Marsz Kibiców · 55 min · 4.8 km</span>
            <div class="mnc-route-name">Start: Łucznicza 43 (Pub Klatka)</div>
            <div class="mnc-route-desc">
              Malownicza zbiórka pod 43, przemarsz przez Park Kadziaka, Jasne Błonia, al. Wojska Polskiego wprost na Pogodno pod wejście główne.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('lucznicza')">
              🗺️ Pokaż spacer na mapie
            </button>
          </div>

          <div class="mnc-route-box">
            <span class="mnc-route-tag">🚉 SKM + Tramwaj · 24 min</span>
            <div class="mnc-route-name">Start: Dworzec SKM Niebuszewo</div>
            <div class="mnc-route-desc">
              Połączenie SKM w stronę centrum lub autobus 87 do al. Wojska Polskiego, idealne dla mieszkańców wschodniej części dzielnicy.
            </div>
            <button class="mnc-map-draw-btn" onclick="PogonFeature.drawMatchdayRouteOnMap('dworzec')">
              🗺️ Pokaż tę trasę na mapie
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Render Gastro Matchday ("Gdzie na giętą") ────────────
  function renderGastroMatchday() {
    return `
      <div style="margin-bottom: 28px;">
        <div class="pogon-section-title" style="font-size:16px; font-weight:800; color:#FFD700; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
          <span>🌭</span>
          <span>Gastro-Mecz: Gdzie na giętą, piwo i frytburgera?</span>
        </div>
        <div class="pogon-gastro-grid">
          ${GASTRO_MATCHDAY.map(g => `
            <div class="gastro-card">
              <div>
                <div class="gastro-header">
                  <span class="gastro-title">${g.name}</span>
                  <span class="gastro-badge">${g.badge}</span>
                </div>
                <div class="gastro-addr">📍 ${g.addr}</div>
                <div class="gastro-spec">⭐ ${g.specialty}</div>
                <p class="gastro-desc">${g.desc}</p>
              </div>
              <button class="gastro-map-btn" onclick="PogonFeature.flyToCoord(${g.coords[0]}, ${g.coords[1]}, '${g.name}')">
                🗺️ Namierz na mapie
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Render Squad & Stats ─────────────────────────────────
  function renderSquadTable() {
    return `
      <div class="matchday-nav-card" style="margin-bottom: 24px;">
        <div class="mnc-title">
          <span>👥</span>
          <span>Kadra Dumy Pomorza — Sezon ${SEASON.year}</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="border-bottom:2px solid #002D62; color:#FFD700;">
                <th style="padding:8px;">#</th>
                <th style="padding:8px;">Zawodnik</th>
                <th style="padding:8px;">Poz</th>
                <th style="padding:8px;">Wiek</th>
                <th style="padding:8px;">Gole</th>
                <th style="padding:8px;">Asysty</th>
              </tr>
            </thead>
            <tbody>
              ${SQUAD.map(p => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                  <td style="padding:8px; font-weight:800; color:#FFD700;">${p.no}</td>
                  <td style="padding:8px; font-weight:700;">${p.name} ${p.captain ? '👑 (C)' : ''}</td>
                  <td style="padding:8px; opacity:0.8;">${p.pos}</td>
                  <td style="padding:8px; opacity:0.8;">${p.age}</td>
                  <td style="padding:8px; color:#10b981; font-weight:700;">${p.goals || (p.cleanSheets ? p.cleanSheets + ' czystych kont' : '—')}</td>
                  <td style="padding:8px; color:#38bdf8;">${p.assists || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── Render Ekstraklasa Standings ─────────────────────────
  function renderStandingsTable() {
    return `
      <div class="matchday-nav-card">
        <div class="mnc-title">
          <span>🏆</span>
          <span>Tabela PKO BP Ekstraklasy — Pogoń na Podium</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead>
              <tr style="border-bottom:2px solid #7A0026; color:#FFD700;">
                <th style="padding:8px;">M</th>
                <th style="padding:8px;">Klub</th>
                <th style="padding:8px; text-align:center;">Mecze</th>
                <th style="padding:8px; text-align:center;">Bilans</th>
                <th style="padding:8px; text-align:right;">Punkty</th>
              </tr>
            </thead>
            <tbody>
              ${STANDINGS.map(s => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06); ${s.highlight ? 'background:rgba(0,45,98,0.35); font-weight:800; border-left:4px solid #FFD700;' : ''}">
                  <td style="padding:8px; color:${s.highlight ? '#FFD700' : 'inherit'};">${s.pos}</td>
                  <td style="padding:8px;">${s.highlight ? '⚓ ' : ''}${s.team}</td>
                  <td style="padding:8px; text-align:center;">${s.played}</td>
                  <td style="padding:8px; text-align:center;">${s.gf}:${s.ga}</td>
                  <td style="padding:8px; text-align:right; font-weight:800; color:${s.highlight ? '#FFD700' : '#10b981'};">${s.pts} pkt</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function flyToCoord(lat, lng, name) {
    const map = window.state?.map;
    if (!map) return;
    if (typeof navigateTo === 'function') navigateTo('map');
    setTimeout(() => {
      map.flyTo([lat, lng], 17, { animate: true, duration: 1.2 });
      L.popup().setLatLng([lat, lng]).setContent(`<strong>${name}</strong>`).openOn(map);
    }, 300);
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const container = document.querySelector('#section-pogon .section-content');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size:24px; font-weight:900; color:#FFD700; margin-bottom:4px; display:flex; align-items:center; gap:10px;">
          <span>⚓</span>
          <span>Pogoń Szczecin & Dzień Meczowy</span>
        </h2>
        <p style="font-size:13px; color:var(--text2, #94a3b8);">
          Duma Pomorza — strefa kibica Niebuszewa, dojazd na stadion, gastro-przewodnik i doping.
        </p>
      </div>

      ${renderMatchdayBanner()}
      ${renderMatchdayNavigator()}
      ${renderGastroMatchday()}
      ${renderSquadTable()}
      ${renderStandingsTable()}
    `;
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    injectStyles();
    render();
    const section = document.querySelector('#section-pogon');
    if (section) {
      const obs = new MutationObserver(() => {
        if (section.classList.contains('active')) render();
      });
      obs.observe(section, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  return {
    init,
    render,
    toggleMatchdayMode,
    playStadiumDrumBeat,
    drawMatchdayRouteOnMap,
    flyToCoord
  };
})();

window.PogonFeature = PogonFeature;
