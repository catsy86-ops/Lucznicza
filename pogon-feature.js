/**
 * pogon-feature.js — Pogoń Szczecin Feature Module
 * Sekcja z wynikami, składem, mapą stadionu, statystykami drużyny, maskotkę, tabele
 */
'use strict';

const PogonFeature = (() => {

  // ── Dane drużyny ───────────────────────────────────────
  const CLUB = {
    name: 'Pogoń Szczecin',
    founded: 1906,
    stadium: 'Stadion Florian Krygier',
    stadiumCapacity: 22537,
    stadiumCoords: [53.4300, 14.5440],
    colors: ['#E84C3D', '#1A1A2E'],
    league: 'PKO BP Ekstraklasa',
    city: 'Szczecin',
    website: 'pogonszczecin.pl',
    motto: 'Port Royal — Duma Szczecina',
    badge: '⚽',
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

  // Tabela ligi
  const STANDINGS = [
    { pos:1,  team:'Legia Warszawa',      played:32, w:24, d:4, l:4, gf:68, ga:28, pts:76, trend:'📈' },
    { pos:2,  team:'Raków Częstochowa',   played:32, w:22, d:5, l:5, gf:61, ga:34, pts:71, trend:'📈' },
    { pos:3,  team:'Pogoń Szczecin',      played:32, w:18, d:8, l:6, gf:54, ga:31, pts:62, trend:'➡️', highlight:true },
    { pos:4,  team:'Jagiellonia Białystok',played:32, w:17, d:6, l:9, gf:52, ga:39, pts:57, trend:'📉' },
    { pos:5,  team:'Cracovia',            played:32, w:16, d:5, l:11, gf:49, ga:42, pts:53, trend:'➡️' },
    { pos:6,  team:'Lech Poznań',         played:32, w:14, d:9, l:9, gf:51, ga:38, pts:51, trend:'📈' },
    { pos:7,  team:'Górnik Zabrze',       played:32, w:13, d:8, l:11, gf:48, ga:45, pts:47, trend:'📉' },
    { pos:8,  team:'Wisła Kraków',        played:32, w:12, d:7, l:13, gf:44, ga:48, pts:43, trend:'📉' },
  ];

  const SQUAD = [
    { no:1,  name:'Dante Stipica',    pos:'GK', age:35, nat:'🇭🇷', appearances:30 },
    { no:2,  name:'Kamil Grosicki',   pos:'FW', age:36, nat:'🇵🇱', goals:9, assists:3 },
    { no:7,  name:'Kacper Kozłowski', pos:'MF', age:22, nat:'🇵🇱', goals:6, assists:4 },
    { no:9,  name:'Efthymis Koulouris',pos:'FW',age:30, nat:'🇬🇷', goals:14, assists:2 },
    { no:10, name:'Wahan Biczachczian',pos:'MF', age:26, nat:'🇦🇲', goals:7, assists:5 },
    { no:11, name:'Benedikt Zech',    pos:'DF', age:26, nat:'🇩🇪', appearances:28 },
    { no:16, name:'Mariusz Fornalczyk',pos:'FW',age:23, nat:'🇵🇱', goals:5, assists:1 },
    { no:18, name:'Jakub Bartkowski', pos:'DF', age:28, nat:'🇵🇱', appearances:31 },
    { no:23, name:'Rafał Kurzawa',    pos:'MF', age:30, nat:'🇵🇱', goals:4, assists:6 },
    { no:25, name:'Michał Kucharczyk',pos:'FW', age:30, nat:'🇵🇱', goals:8, assists:2 },
    { no:32, name:'Sebastian Kowalczyk',pos:'MF',age:27,nat:'🇵🇱', goals:5, assists:3 },
  ];

  const FIXTURES = [
    { date:'2026-06-07', home:true,  opp:'Jagiellonia Białystok', result:'3:1', won:true, venue:'Stadion Florian Krygier' },
    { date:'2026-06-14', home:false, opp:'Legia Warszawa',         result:null, venue:'Stadion Narodowy, Warszawa' },
    { date:'2026-06-21', home:true,  opp:'Cracovia',               result:null, venue:'Stadion Florian Krygier' },
    { date:'2026-06-28', home:false, opp:'Raków Częstochowa',      result:null, venue:'Stadion Miejski, Częstochowa' },
  ];


  // ── CSS Stylesheet ────────────────────────────────────
  const CSS_STYLES = `
    #section-pogon .section-content{padding-bottom:40px;background:linear-gradient(135deg,rgba(232,76,61,.02) 0%,rgba(26,26,46,.02) 100%)}
    .pogon-hero{background:linear-gradient(135deg,#E84C3D 0%,#1a1a2e 60%);border-radius:var(--radius);padding:28px 20px;margin-bottom:20px;display:flex;align-items:center;gap:20px;position:relative;overflow:hidden;box-shadow:0 8px 24px rgba(232,76,61,.2)}
    .pogon-hero::before{content:"⚽";position:absolute;right:-10px;top:-10px;font-size:120px;opacity:.06;pointer-events:none}
    .pogon-hero-badge{font-size:56px;line-height:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5));animation:badge-pulse 2s ease-in-out infinite}
    @keyframes badge-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    .pogon-hero-info{flex:1}
    .pogon-hero-name{font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;letter-spacing:.5px}
    .pogon-hero-sub{font-size:13px;color:rgba(255,255,255,.8);line-height:1.5}
    .pogon-hero-pos{background:#E84C3D;border:3px solid rgba(255,255,255,.3);border-radius:50%;width:64px;height:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.3);flex-shrink:0}
    .pogon-hero-pos-num{font-size:28px;font-weight:900;line-height:1}
    .pogon-hero-pos-lbl{font-size:9px;opacity:.9;letter-spacing:1px;margin-top:2px}
    .pogon-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
    @media(min-width:600px){.pogon-stats-grid{grid-template-columns:repeat(6,1fr)}}
    .pogon-stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 10px;text-align:center;transition:all .3s ease;cursor:pointer;position:relative;overflow:hidden}
    .pogon-stat-card:hover{border-color:#E84C3D;background:var(--surface2);transform:translateY(-2px)}
    .pogon-stat-card:focus-visible{outline:2px solid #E84C3D;outline-offset:2px;border-color:#E84C3D}
    .pogon-stat-card::before{content:"";position:absolute;top:0;left:0;width:100%;height:3px;background:#E84C3D;opacity:0;transition:opacity .3s ease}
    .pogon-stat-card:hover::before{opacity:1}
    .psc-val{font-size:24px;font-weight:800;color:#E84C3D;display:block}
    .psc-lbl{font-size:10px;color:var(--text2);margin-top:4px;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
    .pogon-section-title{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#E84C3D;margin:24px 0 14px;display:flex;align-items:center;gap:10px}
    .pogon-section-title::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,#E84C3D,rgba(232,76,61,.1))}
    #pogonMascot{position:fixed;bottom:100px;right:20px;width:80px;height:80px;pointer-events:auto;z-index:9999;filter:drop-shadow(0 4px 12px rgba(232,76,61,.4));cursor:grab;user-select:none}
    #pogonMascot:active{cursor:grabbing}
    .pogon-mascot-container{position:relative;width:100%;height:180px;background:linear-gradient(180deg,#FFD70022 0%,#E84C3D11 100%);border:2px dashed #E84C3D44;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:20px}
    .pogon-mascot-svg{width:100px;height:100px;filter:drop-shadow(0 4px 12px rgba(232,76,61,.3));animation:mascot-bounce 3s ease-in-out infinite}
    @keyframes mascot-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    .pogon-table-container{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:auto;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
    .pogon-table{width:100%;border-collapse:collapse;font-size:13px}
    .pogon-table thead{background:linear-gradient(135deg,var(--surface2) 0%,var(--surface2)dd 100%);border-bottom:2px solid #E84C3D}
    .pogon-table th{padding:14px 12px;text-align:left;font-weight:800;color:#E84C3D;text-transform:uppercase;letter-spacing:.6px;font-size:11px;scope:col}
    .pogon-table tbody tr{border-bottom:1px solid var(--border);transition:all .2s ease}
    .pogon-table tbody tr:hover{background:var(--surface2)}
    .pogon-table tbody tr.highlight-row{background:linear-gradient(90deg,rgba(232,76,61,.1) 0%,rgba(232,76,61,.02) 100%);border-left:3px solid #E84C3D}
    .pogon-table td{padding:11px 12px;color:var(--text2)}
    .pogon-table-num{font-weight:800;color:#E84C3D;font-size:14px}
    .pogon-table-name{font-weight:700;color:var(--text1)}
    .pogon-table-goal{color:#FFD700;font-weight:700}
    .pogon-table-pos{background:#E84C3D22;color:#E84C3D;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:800;display:inline-block}
    .pogon-table-trend{font-size:14px;font-weight:800}
    .pogon-squad-item{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;transition:all .2s ease}
    .pogon-squad-item:hover{border-color:#E84C3D;background:var(--surface2);transform:translateX(2px)}
    .pogon-squad-item:focus-visible{outline:2px solid #E84C3D;outline-offset:2px}
    .pogon-squad-pos{width:32px;height:32px;border-radius:8px;background:var(--border);color:#E84C3D;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .pogon-squad-name{font-size:13px;font-weight:600;flex:1}
    .pogon-squad-stat{font-size:12px;color:#FFD700;font-weight:700}
    .pogon-fixture-item{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;transition:all .2s ease}
    .pogon-fixture-item:hover{border-color:#E84C3D;background:var(--surface2)}
    .pogon-fixture-date{font-size:11px;color:var(--text2);min-width:40px;font-weight:700}
    .pogon-fixture-badge{font-size:10px;background:var(--accent);color:#fff;padding:2px 8px;border-radius:4px;flex-shrink:0;font-weight:700}
    .pogon-fixture-opponents{font-size:13px;font-weight:600;flex:1}
    .pogon-fixture-result{font-size:13px;font-weight:800;text-align:right;min-width:40px}
    .pogon-fixture-result.won{color:#43e97b}
    .pogon-fixture-result.draw{color:#ffd93d}
    .pogon-fixture-result.lost{color:#ff6584}
    .pogon-stadium-card{background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .3s ease}
    .pogon-stadium-card:hover{border-color:#E84C3D;box-shadow:0 4px 12px rgba(232,76,61,.2)}
    .pogon-stadium-content{padding:16px;display:flex;align-items:center;gap:14px}
    .pogon-stadium-icon{font-size:36px;flex-shrink:0}
    .pogon-stadium-info{flex:1}
    .pogon-stadium-name{font-size:15px;font-weight:700;color:var(--text1)}
    .pogon-stadium-meta{font-size:12px;color:var(--text2);margin-top:2px}
    .pogon-stadium-btn{background:#E84C3D;color:#fff;border:none;border-radius:var(--radius-sm);padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s ease;flex-shrink:0}
    .pogon-stadium-btn:hover{background:#d63528;transform:scale(1.05)}
    .pogon-stadium-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
    .pogon-standings-table{width:100%;border-collapse:collapse;font-size:12px}
    .pogon-standings-table thead{background:linear-gradient(135deg,var(--surface2) 0%,var(--surface2)dd 100%);border-bottom:2px solid #E84C3D}
    .pogon-standings-table th{padding:12px 8px;text-align:center;font-weight:800;color:#E84C3D;text-transform:uppercase;letter-spacing:.6px;font-size:10px;scope:col}
    .pogon-standings-table th:first-child{text-align:left}
    .pogon-standings-table tbody tr{border-bottom:1px solid var(--border);transition:all .2s ease}
    .pogon-standings-table tbody tr:hover{background:var(--surface2)}
    .pogon-standings-table tbody tr.highlight-row{background:linear-gradient(90deg,rgba(232,76,61,.1) 0%,rgba(232,76,61,.02) 100%);border-left:3px solid #E84C3D;font-weight:700}
    .pogon-standings-table td{padding:10px 8px;text-align:center;color:var(--text2)}
    .pogon-standings-table td:first-child{text-align:left}
    .pogon-standings-table .st-pos{font-weight:800;color:var(--text1);font-size:12px}
    .pogon-standings-table .st-team{font-weight:700;color:var(--text1);text-align:left}
    .pogon-standings-table .st-pts{font-weight:800;color:#E84C3D}
  `;

  // ── Styles ────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pogonFeatureStyle')) return;
    const s = document.createElement('style');
    s.id = 'pogonFeatureStyle';
    s.textContent = CSS_STYLES;
    document.head.appendChild(s);
  }


  // ── Render helpers ────────────────────────────────────
  function renderHero() {
    return `
      <div class="pogon-hero" role="region" aria-label="Informacje o drużynie Pogoń Szczecin">
        <div class="pogon-hero-badge" aria-label="Godło drużyny">🔴⚪</div>
        <div class="pogon-hero-info">
          <div class="pogon-hero-name">${CLUB.name}</div>
          <div class="pogon-hero-sub">
            ${CLUB.league} · Sezon ${SEASON.year}<br>
            🏟️ ${CLUB.stadium}
          </div>
        </div>
        <div class="pogon-hero-pos" aria-label="Aktualna pozycja w lidze">
          <div class="pogon-hero-pos-num">${SEASON.position}</div>
          <div class="pogon-hero-pos-lbl">MIEJSCE</div>
        </div>
      </div>`;
  }

  function renderStats() {
    const goalDiff = SEASON.goalsFor - SEASON.goalsAgainst;
    const stats = [
      { val: SEASON.points,      lbl: 'Pkt'     },
      { val: SEASON.played,      lbl: 'Mecze'   },
      { val: SEASON.won,         lbl: 'Zwycz.'  },
      { val: SEASON.drawn,       lbl: 'Remisy'  },
      { val: SEASON.goalsFor,    lbl: 'Gole Z'  },
      { val: (goalDiff > 0 ? '+' : '') + goalDiff, lbl: 'Bilans' },
    ];
    return `
      <div class="pogon-stats-grid" role="region" aria-label="Główne statystyki sezonu">
        ${stats.map(s => `
          <div class="pogon-stat-card" tabindex="0" role="button" aria-label="${s.lbl}: ${s.val}">
            <div class="psc-val">${s.val}</div>
            <div class="psc-lbl">${s.lbl}</div>
          </div>`).join('')}
      </div>`;
  }

  function renderStandings() {
    return `
      <div class="pogon-section-title">📊 Tabela Ligi</div>
      <div class="pogon-table-container">
        <table class="pogon-standings-table" role="table" aria-label="Tabela klasyfikacyjna ligi">
          <thead>
            <tr>
              <th scope="col" style="width:30px;">Pos</th>
              <th scope="col" style="text-align:left;">Drużyna</th>
              <th scope="col">M</th>
              <th scope="col">W</th>
              <th scope="col">R</th>
              <th scope="col">P</th>
              <th scope="col">Gf</th>
              <th scope="col">Ga</th>
              <th scope="col">Pkt</th>
              <th scope="col">Trend</th>
            </tr>
          </thead>
          <tbody>
            ${STANDINGS.map(team => `
              <tr ${team.highlight ? 'class="highlight-row"' : ''} ${team.highlight ? 'aria-current="true"' : ''}>
                <td><span class="st-pos">${team.pos}</span></td>
                <td class="st-team">${team.team}</td>
                <td>${team.played}</td>
                <td>${team.w}</td>
                <td>${team.d}</td>
                <td>${team.l}</td>
                <td>${team.gf}</td>
                <td>${team.ga}</td>
                <td><span class="st-pts">${team.pts}</span></td>
                <td><span class="pogon-table-trend" aria-label="${team.trend === '📈' ? 'Wzrost' : team.trend === '📉' ? 'Spadek' : 'Bez zmian'}">${team.trend}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderSquad() {
    const posOrder = { GK:0, DF:1, MF:2, FW:3 };
    const posLabel = { GK:'Bramkarz', DF:'Obrońca', MF:'Pomocnik', FW:'Napastnik' };
    const posColor = { GK:'#4ecdc4', DF:'#6c63ff', MF:'#43e97b', FW:'#ff6b6b' };
    const sorted = [...SQUAD].sort((a,b) => posOrder[a.pos] - posOrder[b.pos]);
    return `
      <div class="pogon-section-title">⚽ Skład</div>
      <div style="display:flex;flex-direction:column;gap:8px;" role="region" aria-label="Lista składu drużyny">
        ${sorted.map(p => `
          <div class="pogon-squad-item" tabindex="0" role="button" aria-label="${p.nat} ${p.name}, numer ${p.no}, ${posLabel[p.pos]}, ${p.age} lat">
            <span class="pogon-squad-pos" style="background:${posColor[p.pos]}22;color:${posColor[p.pos]};" title="${posLabel[p.pos]}">
              ${posLabel[p.pos].slice(0,3).toUpperCase()}
            </span>
            <div class="pogon-squad-name">${p.nat} #${p.no} ${p.name}</div>
            <span style="font-size:11px;color:var(--text2);">${p.age} lat</span>
            ${p.goals ? `<span class="pogon-squad-stat" aria-label="${p.goals} goli">⚽ ${p.goals}</span>` : ''}
            ${p.assists ? `<span class="pogon-squad-stat" aria-label="${p.assists} asyst">🎯 ${p.assists}</span>` : ''}
            ${p.appearances && !p.goals ? `<span style="font-size:11px;color:var(--text2);" aria-label="${p.appearances} występów">🎭 ${p.appearances}</span>` : ''}
          </div>`).join('')}
      </div>`;
  }

  function renderFixtures() {
    return `
      <div class="pogon-section-title">📅 Terminarz</div>
      <div style="display:flex;flex-direction:column;gap:8px;" role="region" aria-label="Nadchodzące i rozegrane mecze">
        ${FIXTURES.map(f => {
          const d = new Date(f.date);
          const label = d.toLocaleDateString('pl-PL', { day:'numeric', month:'short' });
          const played = !!f.result;
          const [gh, ga] = played ? f.result.split(':').map(Number) : [];
          const resultClass = played ? (f.won ? 'won' : gh===ga ? 'draw' : 'lost') : '';
          return `
            <div class="pogon-fixture-item" tabindex="0" role="button" aria-label="${label}, ${f.home ? 'Dom' : 'Wyjazd'}, ${f.home ? 'Pogoń vs ' + f.opp : f.opp + ' vs Pogoń'}${played ? ', wynik ' + f.result : ''}">
              <span class="pogon-fixture-date">${label}</span>
              <span class="pogon-fixture-badge" title="${f.home ? 'Mecz domowy' : 'Mecz wyjazdowy'}">${f.home ? '🏠 DOM' : '✈️ WYJ'}</span>
              <span class="pogon-fixture-opponents">
                ${f.home ? `Pogoń vs ${f.opp}` : `${f.opp} vs Pogoń`}
              </span>
              <span class="pogon-fixture-result ${resultClass}" aria-label="${played ? 'Wynik: ' + f.result : 'Mecz jeszcze się nie odbył'}">
                ${played ? f.result : '–:–'}
              </span>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderMascotBtn() {
    return `
      <div class="pogon-section-title">🦆 Maskotka Pogoń — Kaczuś</div>
      <div class="pogon-mascot-container">
        <svg class="pogon-mascot-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kaczuś - interaktywna maskotka Pogoń Szczecin">
          <!-- Duck Body -->
          <ellipse cx="60" cy="70" rx="35" ry="40" fill="#FFD700"/>
          <!-- Duck Head -->
          <circle cx="60" cy="35" r="22" fill="#FFD700"/>
          <!-- Duck Beak -->
          <polygon points="75,30 85,25 75,40" fill="#FF6B00"/>
          <!-- Eyes -->
          <circle cx="52" cy="30" r="4" fill="#000"/>
          <circle cx="68" cy="30" r="4" fill="#000"/>
          <!-- Eye shine -->
          <circle cx="53" cy="29" r="1.5" fill="#fff"/>
          <circle cx="69" cy="29" r="1.5" fill="#fff"/>
          <!-- Wings (left & right) -->
          <path d="M 35 65 Q 20 60 25 75 Q 30 70 35 75" fill="#FFA500" opacity="0.7"/>
          <path d="M 85 65 Q 100 60 95 75 Q 90 70 85 75" fill="#FFA500" opacity="0.7"/>
          <!-- Pogoń Badge -->
          <circle cx="60" cy="85" r="8" fill="#E84C3D"/>
          <text x="60" y="87" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">P</text>
          <!-- Feet -->
          <line x1="50" y1="105" x2="50" y2="115" stroke="#FF6B00" stroke-width="2"/>
          <line x1="70" y1="105" x2="70" y2="115" stroke="#FF6B00" stroke-width="2"/>
          <ellipse cx="50" cy="118" rx="4" ry="3" fill="#FF6B00"/>
          <ellipse cx="70" cy="118" rx="4" ry="3" fill="#FF6B00"/>
        </svg>
      </div>
      <div style="
        background:linear-gradient(135deg,#FFD70033,#E84C3D22);
        border:1px solid #E84C3D55;border-radius:var(--radius);
        padding:14px;display:flex;align-items:center;gap:14px;
      ">
        <span style="font-size:36px;" aria-hidden="true">🦆</span>
        <div style="flex:1;font-size:13px;">
          <div style="font-weight:700;color:var(--text1);">Kaczuś — Interaktywna Maskotka</div>
          <div style="font-size:11px;color:var(--text2);margin-top:2px;">
            👆 Klikaj i ciągnij · Podąża za kursorem · M = toggle
          </div>
        </div>
        <button id="pogonMascotToggle" aria-label="Przełącz widoczność maskotki Kaczuś" style="
          background:#E84C3D;color:#fff;border:none;
          border-radius:var(--radius-sm);padding:8px 12px;
          font-size:12px;font-weight:700;cursor:pointer;
          transition:all 0.2s ease;flex-shrink:0;
        ">
          🦆 Pokaż
        </button>
      </div>`;
  }

  function renderDataTable() {
    return `
      <div class="pogon-section-title">👥 Zawodnicy — Statystyki</div>
      <div class="pogon-table-container">
        <table class="pogon-table" role="table" aria-label="Statystyki zawodników Pogoń Szczecin">
          <thead>
            <tr>
              <th scope="col" style="width:40px;">#</th>
              <th scope="col" style="min-width:140px;">Zawodnik</th>
              <th scope="col" style="width:50px;">Pos</th>
              <th scope="col" style="width:40px;">Wiek</th>
              <th scope="col" style="width:30px;">🌍</th>
              <th scope="col" style="width:40px;">⚽</th>
              <th scope="col" style="width:40px;">🎯</th>
              <th scope="col" style="width:40px;">🎭</th>
            </tr>
          </thead>
          <tbody>
            ${SQUAD.map(p => `
              <tr>
                <td><span class="pogon-table-num">${p.no}</span></td>
                <td><span class="pogon-table-name">${p.name}</span></td>
                <td><span class="pogon-table-pos" title="Pozycja: ${['GK', 'DF', 'MF', 'FW'].includes(p.pos) ? p.pos : 'Nieznana'}">${p.pos}</span></td>
                <td>${p.age}</td>
                <td style="text-align:center;" title="Kraj">${p.nat}</td>
                <td><span class="pogon-table-goal" aria-label="${p.goals ? p.goals + ' goli' : 'Brak goli'}">${p.goals ? p.goals : '—'}</span></td>
                <td aria-label="${p.assists ? p.assists + ' asyst' : 'Brak asyst'}">${p.assists ? p.assists : '—'}</td>
                <td aria-label="${p.appearances ? p.appearances + ' występów' : 'Brak informacji'}">${p.appearances ? p.appearances : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function renderMapBtn() {
    return `
      <div class="pogon-section-title">🏟️ Stadion Pogoń</div>
      <div class="pogon-stadium-card">
        <div class="pogon-stadium-content">
          <span class="pogon-stadium-icon" aria-hidden="true">🏟️</span>
          <div class="pogon-stadium-info">
            <div class="pogon-stadium-name">${CLUB.stadium}</div>
            <div class="pogon-stadium-meta">
              Pojemność: ${CLUB.stadiumCapacity.toLocaleString('pl-PL')} miejsc · ${CLUB.city}
            </div>
          </div>
          <button id="pogonFlyToStadium" class="pogon-stadium-btn" aria-label="Pokaż stadion Pogoń na mapie interaktywnej">
            🗺️ Pokaż
          </button>
        </div>
      </div>`;
  }

  // ── Build full section HTML ───────────────────────────
  function buildHTML() {
    return `
      ${renderHero()}
      ${renderStats()}
      ${renderMascotBtn()}
      ${renderStandings()}
      ${renderDataTable()}
      ${renderFixtures()}
      ${renderSquad()}
      ${renderMapBtn()}
      <div style="height:16px;"></div>
    `;
  }

  // ── Inject into #section-pogon .section-content ──────
  function render() {
    const container = document.querySelector('#section-pogon .section-content');
    if (!container) return;
    container.innerHTML = buildHTML();
    attachEvents();
  }

  function attachEvents() {
    try {
      // Fly to stadium on map
      const flyBtn = document.getElementById('pogonFlyToStadium');
      if (flyBtn) {
        flyBtn.addEventListener('click', () => {
          try {
            const map = window.state?.map || window.map;
            if (!map) {
              if (typeof showToast === 'function') showToast('❌ Mapa nie załadowana');
              return;
            }
            const [lat, lng] = CLUB.stadiumCoords;
            if (typeof navigateTo === 'function') {
              navigateTo('map');
            }
            setTimeout(() => {
              try {
                map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
                // Add temporary stadium marker
                if (typeof L !== 'undefined') {
                  const icon = L.divIcon({
                    html: `<div style="
                      background:#E84C3D;border:3px solid #fff;
                      border-radius:50%;width:44px;height:44px;
                      display:flex;align-items:center;justify-content:center;
                      font-size:22px;box-shadow:0 4px 12px rgba(0,0,0,.4);">🏟️</div>`,
                    iconSize: [44, 44], iconAnchor: [22, 22], className: ''
                  });
                  const marker = L.marker([lat, lng], { icon }).addTo(map);
                  marker.bindPopup(`
                    <div style="text-align:center;padding:10px;">
                      <div style="font-size:32px;margin-bottom:8px;">🏟️</div>
                      <div style="font-weight:700;font-size:14px;">${CLUB.stadium}</div>
                      <div style="font-size:12px;color:#666;margin-top:4px;">
                        Pogoń Szczecin<br>${CLUB.stadiumCapacity.toLocaleString('pl-PL')} miejsc
                      </div>
                    </div>`).openPopup();
                  setTimeout(() => {
                    try { 
                      map.removeLayer(marker); 
                    } catch(e) {
                      console.warn('Error removing marker:', e);
                    }
                  }, 8000);
                }
              } catch (err) {
                console.error('Error flying to stadium:', err);
                if (typeof showToast === 'function') showToast('❌ Błąd podczas otwierania mapy');
              }
            }, 300);
            if (typeof showToast === 'function') showToast('🏟️ Stadion Pogoń na mapie');
          } catch (err) {
            console.error('Error in fly to stadium click handler:', err);
          }
        });
      }

      // Mascot toggle
      const mascotBtn = document.getElementById('pogonMascotToggle');
      if (mascotBtn) {
        mascotBtn.addEventListener('click', () => {
          try {
            if (window.pogonMascot) {
              window.pogonMascot.toggle();
              const mascotEl = document.getElementById('pogonMascot');
              const visible = mascotEl && mascotEl.style.display !== 'none';
              mascotBtn.textContent = visible ? '🦆 Ukryj' : '🦆 Pokaż';
              mascotBtn.setAttribute('aria-pressed', visible ? 'true' : 'false');
              if (typeof showToast === 'function') {
                showToast(visible ? '🦆 Kaczuś pojawił się!' : '🦆 Kaczuś schował się');
              }
            }
          } catch (err) {
            console.error('Error in mascot toggle:', err);
          }
        });
      }
    } catch (err) {
      console.error('Error attaching Pogoń events:', err);
    }
  }

  // ── Interactive Mascot (follow mouse) ──────────────────
  // NOTE: pogon-mascot.js już obsługuje maskę. Ta funkcja jest backup.
  function initMascot() {
    // Sprawdź czy mascot już istnieje z pogon-mascot.js
    if (window.pogonMascot || document.getElementById('pogonMascot')) {
      // Mascot już załadowany
      return;
    }
    
    // Fallback mascot jeśli pogon-mascot.js nie załadował się
    if (document.getElementById('pogonMascotFallback')) return;
    
    const mascot = document.createElement('div');
    mascot.id = 'pogonMascotFallback';
    mascot.style.display = 'none'; // Ukryte, jeśli mascot-mascot.js załaduje się
    mascot.innerHTML = '🦆';
    mascot.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 80px;
      height: 80px;
      pointer-events: auto;
      z-index: 9999;
      filter: drop-shadow(0 4px 12px rgba(232, 76, 61, 0.4));
      cursor: grab;
      user-select: none;
      font-size: 48px;
      line-height: 1;
      opacity: 0.9;
    `;
    document.body.appendChild(mascot);
  }


  // ── Init ─────────────────────────────────────────────
  function init() {
    console.log('🦆 PogonFeature initializing...');
    injectStyles();
    initMascot();
    
    // Render immediately if section exists and is active
    const section = document.querySelector('#section-pogon');
    if (section) {
      if (section.classList.contains('active')) {
        render();
      }
      
      // Watch for when section becomes active
      const observer = new MutationObserver(() => {
        if (section.classList.contains('active')) {
          render();
        }
      });
      
      observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Also listen for custom navigate events (if they're dispatched)
    window.addEventListener('navigate', (e) => {
      if (e.detail?.section === 'pogon') {
        console.log('🦆 Navigate event received');
        render();
      }
    });
    
    console.log('✅ pogon-feature ready — Mascot ready: 🦆');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  return { init, render, initMascot };
})();

window.PogonFeature = PogonFeature;
