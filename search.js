/**
 * search.js — Globalna wyszukiwarka aplikacji (Command Palette / Spotlight)
 * Przeszukuje: miejsca, trasy, transport ZDiTM, wydarzenia, historię oraz szybkie akcje
 * Skrót: Ctrl+K / Cmd+K lub przycisk lupy w headerze
 */
'use strict';

const SEARCH_STATE = {
  open: false,
  query: '',
  category: 'all',
  timeout: null,
  history: []
};

const HISTORY_KEY = 'search_history';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function addToHistory(q) {
  if (!q.trim()) return;
  let h = getHistory().filter(x => x !== q);
  h.unshift(q);
  h = h.slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

// ===== QUICK COMMANDS & ACTIONS =====
const SPOTLIGHT_ACTIONS = [
  {
    id: 'act-alert',
    type: 'action',
    title: '📢 Zgłoś Alert (Dzik / Usterka / Awaria)',
    sub: 'Otwórz formularz obywatelskiego alertu osiedlowego',
    icon: '🐗',
    badge: 'Akcja',
    badgeColor: '#EF4444',
    action: () => {
      closeGlobalSearch();
      const fab = document.getElementById('communityAlertFab');
      if (fab) fab.click();
    }
  },
  {
    id: 'act-theme',
    type: 'action',
    title: '🌓 Przełącz motyw (Ciemny / Jasny)',
    sub: 'Zmień tryb wizualny aplikacji',
    icon: '🎨',
    badge: 'Narzędzie',
    badgeColor: '#FFD700',
    action: () => {
      closeGlobalSearch();
      const btn = document.getElementById('themeBtn');
      if (btn) btn.click();
    }
  },
  {
    id: 'act-zen',
    type: 'action',
    title: '👁️ Przełącz tryb czystej mapy (Zen Mode)',
    sub: 'Ukryj lub przywróć wszystkie pływające widżety (skrót: Z)',
    icon: '🧘',
    badge: 'Narzędzie',
    badgeColor: '#10B981',
    action: () => {
      closeGlobalSearch();
      const btn = document.getElementById('zenMapBtn');
      if (btn) btn.click();
    }
  },
  {
    id: 'act-gps',
    type: 'action',
    title: '🎯 Zlokalizuj mnie na mapie (GPS)',
    sub: 'Wyśrodkuj widok mapy na Twojej aktualnej pozycji',
    icon: '🧭',
    badge: 'Nawigacja',
    badgeColor: '#3B82F6',
    action: () => {
      closeGlobalSearch();
      const btn = document.getElementById('googleLocateBtn');
      if (btn) btn.click();
    }
  },
  {
    id: 'act-center',
    type: 'action',
    title: '🏹 Wyśrodkuj na Łuczniczą 43 / Centrum',
    sub: 'Powrót kamery do serca Niebuszewa',
    icon: '📍',
    badge: 'Nawigacja',
    badgeColor: '#FFD700',
    action: () => {
      closeGlobalSearch();
      const btn = document.getElementById('fabReset');
      if (btn) btn.click();
    }
  },
  {
    id: 'act-zditm',
    type: 'action',
    title: '🚏 Sprawdź odjazdy ZDiTM na żywo',
    sub: 'Najbliższe autobusy i tramwaje z przystanku Łucznicza i Kołłątaja',
    icon: '🚌',
    badge: 'ZDiTM',
    badgeColor: '#0EA5E9',
    action: () => {
      closeGlobalSearch();
      navigateTo('transport');
    }
  },
  {
    id: 'act-bike',
    type: 'action',
    title: '🚲 Pokaż trasy rowerowe i stojaki Bike_S',
    sub: 'Włącz ścieżki rowerowe CyclOSM na mapie',
    icon: '🚲',
    badge: 'Rower',
    badgeColor: '#10B981',
    action: () => {
      closeGlobalSearch();
      navigateTo('bikes');
    }
  }
];

// ===== BUILD SEARCH OVERLAY =====
function buildGlobalSearch() {
  if (document.getElementById('globalSearch')) return;

  const overlay = document.createElement('div');
  overlay.id = 'globalSearch';
  overlay.className = 'gs-overlay hidden';
  overlay.innerHTML = `
    <div class="gs-modal" role="dialog" aria-modal="true" aria-label="Wyszukiwarka Spotlight">
      <div class="gs-header">
        <span class="gs-icon">⚡</span>
        <input type="text" id="gsInput" class="gs-input"
          placeholder="Szukaj miejsc, linii ZDiTM, tras, akcji... (lub Esc)"
          autocomplete="off" autocorrect="off" spellcheck="false" />
        <kbd class="gs-esc">Esc</kbd>
        <button class="gs-close" id="gsClose" aria-label="Zamknij wyszukiwarkę">✕</button>
      </div>

      <!-- Quick category filter pills -->
      <div class="gs-filter-tabs" id="gsFilterTabs">
        <button class="gs-filter-pill active" data-cat="all">Wszystko</button>
        <button class="gs-filter-pill" data-cat="place">📍 Miejsca</button>
        <button class="gs-filter-pill" data-cat="transport">🚌 Transport</button>
        <button class="gs-filter-pill" data-cat="route">🚶 Trasy</button>
        <button class="gs-filter-pill" data-cat="action">⚡ Akcje</button>
      </div>

      <div class="gs-body" id="gsBody">
        <div class="gs-section" id="gsHistory"></div>
        <div class="gs-section" id="gsResults"></div>
      </div>
      <div class="gs-footer">
        <div class="gs-footer-shortcuts">
          <span><kbd class="gs-kbd">↑</kbd><kbd class="gs-kbd">↓</kbd> Wybierz</span>
          <span><kbd class="gs-kbd">↵</kbd> Otwórz</span>
          <span><kbd class="gs-kbd">Esc</kbd> Zamknij</span>
        </div>
        <div class="gs-footer-brand">⚓ Niebuszewo Spotlight</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = document.getElementById('gsInput');
  const body  = document.getElementById('gsBody');

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeGlobalSearch();
  });
  document.getElementById('gsClose').addEventListener('click', closeGlobalSearch);

  // Category filter tabs
  const tabs = overlay.querySelectorAll('.gs-filter-pill');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      SEARCH_STATE.category = tab.dataset.cat || 'all';
      if (SEARCH_STATE.query) {
        runSearch(SEARCH_STATE.query);
      } else {
        renderHistory();
      }
    });
  });

  // Input handler
  input.addEventListener('input', () => {
    const q = input.value.trim();
    SEARCH_STATE.query = q;
    clearTimeout(SEARCH_STATE.timeout);
    if (!q) { renderHistory(); return; }
    SEARCH_STATE.timeout = setTimeout(() => runSearch(q), 150);
  });

  // Keyboard navigation
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeGlobalSearch(); return; }
    if (e.key === 'Enter') {
      const active = body.querySelector('.gs-item.active');
      if (active) {
        active.click();
      } else {
        const first = body.querySelector('.gs-item');
        if (first) first.click();
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateResults(e.key === 'ArrowDown' ? 1 : -1);
    }
  });

  renderHistory();
}

function openGlobalSearch() {
  buildGlobalSearch();
  const overlay = document.getElementById('globalSearch');
  const input   = document.getElementById('gsInput');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));
  setTimeout(() => {
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
  SEARCH_STATE.open = true;
  if (!SEARCH_STATE.query) renderHistory();
}

function closeGlobalSearch() {
  const overlay = document.getElementById('globalSearch');
  if (!overlay) return;
  overlay.classList.remove('visible');
  setTimeout(() => overlay.classList.add('hidden'), 250);
  SEARCH_STATE.open = false;
}

// ===== SEARCH ENGINE =====
function runSearch(q) {
  const ql = q.toLowerCase();
  const cat = SEARCH_STATE.category || 'all';
  let results = [];

  // 1. Places
  if (cat === 'all' || cat === 'place') {
    (APP_DATA?.places || []).forEach(p => {
      const score = scoreMatch(ql, [p.name, p.addr, p.desc, ...(p.tags || [])]);
      if (score > 0) results.push({
        type: 'place', score, icon: p.emoji,
        title: p.name, sub: `📍 ${p.addr} · ⭐ ${p.rating || '–'}`,
        badge: (p.cat || 'miejsce').toUpperCase(), badgeColor: getBadgeColor(p.cat),
        action: () => { closeGlobalSearch(); flyToPlace(p.id); }
      });
    });
  }

  // 2. Routes
  if (cat === 'all' || cat === 'route') {
    (APP_DATA?.routes || []).forEach(r => {
      const score = scoreMatch(ql, [r.name, r.desc, ...(r.tags || [])]);
      if (score > 0) results.push({
        type: 'route', score, icon: r.emoji,
        title: r.name, sub: `🚶 ${r.distance} · ⏱️ ${r.time}`,
        badge: r.type.toUpperCase(), badgeColor: r.color || '#FFD700',
        action: () => { closeGlobalSearch(); navigateTo('routes'); setTimeout(() => { if (typeof showRouteOnMap === 'function') showRouteOnMap(r.id); }, 300); }
      });
    });
  }

  // 3. Transport & Live departures
  if (cat === 'all' || cat === 'transport') {
    (APP_DATA?.transport || []).forEach(t => {
      const lineNums = (t.lines || []).map(l => l.num).join(' ');
      const stopNames = (t.stops || []).map(s => s.name).join(' ');
      const score = scoreMatch(ql, [t.title, t.subtitle, lineNums, stopNames]);
      if (score > 0) results.push({
        type: 'transport', score, icon: t.icon,
        title: `${t.title} (${lineNums})`, sub: `🚏 ${stopNames.substring(0, 50)}...`,
        badge: 'ZDiTM', badgeColor: '#0EA5E9',
        action: () => { closeGlobalSearch(); navigateTo('transport'); }
      });
    });
  }

  // 4. Quick Actions
  if (cat === 'all' || cat === 'action') {
    SPOTLIGHT_ACTIONS.forEach(act => {
      const score = scoreMatch(ql, [act.title, act.sub, act.badge]);
      if (score > 0) results.push({
        ...act,
        score: score + 15 // slight boost for explicit commands
      });
    });
  }

  // 5. Events
  if (cat === 'all') {
    (APP_DATA?.events || []).forEach(ev => {
      const score = scoreMatch(ql, [ev.name, ev.place, ev.desc, ev.tag]);
      if (score > 0) results.push({
        type: 'event', score, icon: '🎉',
        title: ev.name, sub: `📅 ${ev.day} ${ev.month} · ${ev.place}`,
        badge: ev.tag || 'WYDARZENIE', badgeColor: '#A855F7',
        action: () => { closeGlobalSearch(); navigateTo('events'); }
      });
    });
  }

  // 6. Info & History
  if (cat === 'all') {
    (APP_DATA?.info || []).forEach(item => {
      const score = scoreMatch(ql, [item.title, item.text, ...(item.facts || [])]);
      if (score > 0) results.push({
        type: 'info', score, icon: item.icon,
        title: item.title, sub: item.text.substring(0, 60) + '...',
        badge: 'HISTORIA', badgeColor: '#F59E0B',
        action: () => { closeGlobalSearch(); navigateTo('info'); }
      });
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  renderResults(q, results.slice(0, 15));
}

function scoreMatch(query, fields) {
  let score = 0;
  const qn = normalize(query);
  const words = qn.split(/\s+/).filter(Boolean);
  fields.forEach(f => {
    if (!f) return;
    const fn = normalize(f);
    if (fn === qn) score += 120;
    else if (fn.startsWith(qn)) score += 60;
    else if (fn.includes(qn)) score += 35;
    else if (qn.length > 3 && fuzzyMatch(qn, fn)) score += 20;
    words.forEach(w => {
      if (fn.includes(w)) score += 15;
      else if (w.length > 3 && fuzzyMatch(w, fn)) score += 8;
    });
  });
  return score;
}

// Normalize Polish diacritics for accurate matching
function normalize(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/Ą/g, 'a').replace(/Ć/g, 'c').replace(/Ę/g, 'e')
    .replace(/Ł/g, 'l').replace(/Ń/g, 'n').replace(/Ó/g, 'o')
    .replace(/Ś/g, 's').replace(/Ź/g, 'z').replace(/Ż/g, 'z');
}

// Fuzzy matching for typo tolerance
function fuzzyMatch(query, text) {
  if (query.length < 3) return false;
  const maxErrors = Math.floor(query.length / 4);
  for (let i = 0; i <= text.length - query.length + maxErrors; i++) {
    let errors = 0;
    let qi = 0;
    for (let ti = i; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) {
        qi++;
      } else {
        errors++;
        if (errors > maxErrors) break;
        qi++;
      }
    }
    if (qi >= query.length - maxErrors) return true;
  }
  return false;
}

function getBadgeColor(cat) {
  const colors = {
    sport: '#EF4444',
    food: '#F59E0B',
    shop: '#10B981',
    park: '#059669',
    service: '#3B82F6',
    edu: '#EC4899',
    legend: '#FFD700',
    transport: '#0EA5E9'
  };
  return colors[cat] || '#FFD700';
}

// ===== RENDER =====
function renderHistory() {
  const histEl = document.getElementById('gsHistory');
  const resEl  = document.getElementById('gsResults');
  if (!histEl || !resEl) return;
  resEl.innerHTML = '';

  const cat = SEARCH_STATE.category || 'all';

  // If action tab selected without search query, show actions directly!
  if (cat === 'action') {
    histEl.innerHTML = `
      <div class="gs-section-title">⚡ Szybkie Akcje i Narzędzia</div>
      ${SPOTLIGHT_ACTIONS.map((act, i) => `
        <div class="gs-item ${i === 0 ? 'active' : ''}" tabindex="0" onclick="handleSearchAction(${i})">
          <span class="gs-item-icon">${act.icon}</span>
          <div class="gs-item-body">
            <div class="gs-item-title">${act.title}</div>
            <div class="gs-item-sub">${act.sub}</div>
          </div>
          <span class="gs-item-badge" style="background:${act.badgeColor}22;color:${act.badgeColor};border:1px solid ${act.badgeColor}44">${act.badge}</span>
        </div>
      `).join('')}
    `;
    window._spotlightCurrentActions = SPOTLIGHT_ACTIONS;
    return;
  }

  // Default initial view: Quick Actions + History + Visited
  let recentSections = [];
  try { recentSections = JSON.parse(localStorage.getItem('recent_sections') || '[]'); } catch (_) {}
  const history = getHistory();

  let html = '';

  // Quick suggestions
  html += `
    <div class="gs-section-title">⚡ Polecane Akcje</div>
    ${SPOTLIGHT_ACTIONS.slice(0, 3).map((act, i) => `
      <div class="gs-item ${i === 0 ? 'active' : ''}" tabindex="0" onclick="handleSearchAction(${i})">
        <span class="gs-item-icon">${act.icon}</span>
        <div class="gs-item-body">
          <div class="gs-item-title">${act.title}</div>
          <div class="gs-item-sub">${act.sub}</div>
        </div>
        <span class="gs-item-badge" style="background:${act.badgeColor}22;color:${act.badgeColor};border:1px solid ${act.badgeColor}44">${act.badge}</span>
      </div>
    `).join('')}
  `;
  window._spotlightCurrentActions = SPOTLIGHT_ACTIONS.slice(0, 3);

  if (history.length) {
    html += `<div class="gs-section-title" style="margin-top:14px">🔎 Ostatnie wyszukiwania</div>`;
    html += history.map(h => `
      <div class="gs-item gs-history-item" onclick="fillSearch('${h.replace(/'/g, "\\'")}')">
        <span class="gs-item-icon">🕐</span>
        <span class="gs-item-title">${h}</span>
        <span class="gs-item-arrow">→</span>
      </div>
    `).join('');
    html += `<button class="gs-clear-history" onclick="clearSearchHistory()">🗑️ Wyczyść historię wyszukiwania</button>`;
  }

  if (recentSections.length) {
    html += `<div class="gs-section-title" style="margin-top:14px">🧭 Ostatnio odwiedzone działy</div>`;
    html += recentSections.map(s => `
      <div class="gs-item gs-history-item" onclick="closeGlobalSearch(); navigateTo('${s.id}')">
        <span class="gs-item-icon">${s.icon}</span>
        <span class="gs-item-title">${s.label}</span>
        <span class="gs-item-arrow">→</span>
      </div>
    `).join('');
  }

  histEl.innerHTML = html;
}

window.handleSearchAction = function(idx) {
  const actions = window._spotlightCurrentActions || SPOTLIGHT_ACTIONS;
  const act = actions[idx];
  if (act && act.action) {
    act.action();
  }
};

function renderResults(q, results) {
  const histEl = document.getElementById('gsHistory');
  const resEl  = document.getElementById('gsResults');
  if (!histEl || !resEl) return;
  histEl.innerHTML = '';

  if (!results.length) {
    resEl.innerHTML = `
      <div class="gs-empty">
        <div style="font-size:36px;margin-bottom:8px">🔍</div>
        <div style="font-size:15px;font-weight:700;color:var(--text, #fff)">Brak wyników dla "<strong>${q}</strong>"</div>
        <div style="font-size:12px;color:#94A3B8;margin-top:4px">Wpisz inną frazę, np. "apteka", "linia 89", "trasa" lub "alert".</div>
      </div>`;
    return;
  }

  const typeLabels = {
    action: '⚡ Szybkie Akcje',
    place: '📍 Miejsca i Punkty',
    transport: '🚌 Komunikacja ZDiTM',
    route: '🚶 Trasy Spacerowe & Biegowe',
    event: '🎉 Wydarzenia',
    info: '📖 O Dzielnicy'
  };

  const grouped = {};
  results.forEach(r => { (grouped[r.type] = grouped[r.type] || []).push(r); });

  let isFirstItem = true;

  resEl.innerHTML = Object.entries(grouped).map(([type, items]) => `
    <div class="gs-section-title">${typeLabels[type] || type} (${items.length})</div>
    ${items.map((item) => {
      const globalIdx = results.indexOf(item);
      const activeClass = isFirstItem ? 'active' : '';
      isFirstItem = false;
      return `
      <div class="gs-item ${activeClass}" tabindex="0" onclick="handleSearchResult(${globalIdx}, '${q}')">
        <span class="gs-item-icon">${item.icon}</span>
        <div class="gs-item-body">
          <div class="gs-item-title">${highlightMatch(item.title, q)}</div>
          <div class="gs-item-sub">${item.sub}</div>
        </div>
        <span class="gs-item-badge" style="background:${item.badgeColor}22;color:${item.badgeColor};border:1px solid ${item.badgeColor}44">${item.badge}</span>
      </div>`;
    }).join('')}
  `).join('');

  // Store flat results for keyboard and mouse trigger
  window._searchResults = results;
}

window.handleSearchResult = function(globalIdx, q) {
  const results = window._searchResults || [];
  const item = results[globalIdx];
  if (item?.action) {
    addToHistory(q);
    item.action();
  }
};

window.fillSearch = function(q) {
  const input = document.getElementById('gsInput');
  if (input) {
    input.value = q;
    input.dispatchEvent(new Event('input'));
    input.focus();
  }
};

window.clearSearchHistory = function() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
};

function highlightMatch(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark class="gs-mark">$1</mark>');
}

function navigateResults(dir) {
  const items = document.querySelectorAll('#gsBody .gs-item');
  if (!items.length) return;
  const active = document.querySelector('#gsBody .gs-item.active');
  let idx = active ? Array.from(items).indexOf(active) + dir : (dir > 0 ? 0 : items.length - 1);
  idx = Math.max(0, Math.min(items.length - 1, idx));
  items.forEach(i => i.classList.remove('active'));
  items[idx].classList.add('active');
  items[idx].scrollIntoView({ block: 'nearest' });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  // Global Ctrl+K / Cmd+K or "/" when not in input
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    SEARCH_STATE.open ? closeGlobalSearch() : openGlobalSearch();
    return;
  }
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !SEARCH_STATE.open) {
    e.preventDefault();
    openGlobalSearch();
    return;
  }
  if (e.key === 'Escape' && SEARCH_STATE.open) {
    closeGlobalSearch();
  }
});

// ===== WIRE UP SEARCH BUTTONS IN APP =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('searchBtn');
  if (btn) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openGlobalSearch();
    });
  }

  // Also wire mobile search trigger if present
  const mobSearchBtn = document.getElementById('mobileSearchBtn');
  if (mobSearchBtn) {
    mobSearchBtn.addEventListener('click', e => {
      e.stopPropagation();
      openGlobalSearch();
    });
  }
});

window.globalSearch = {
  open: openGlobalSearch,
  close: closeGlobalSearch,
  runSearch: runSearch
};
