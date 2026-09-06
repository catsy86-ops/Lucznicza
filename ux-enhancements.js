/**
 * ux-enhancements.js — Przyjemne funkcje dla użytkownika
 * 1. Animowany splash z pogodą i powitaniem
 * 2. Konfetti przy zdobyciu odznaki
 * 3. "Zaskoczy mnie!" — losowe miejsce
 * 4. Animacje przejść między sekcjami
 * 5. "Dziś w dzielnicy" — widget na mapie
 * 6. Kolor temperatury na widgecie pogody
 * 7. "Przypomnij mi" dla wydarzeń
 * 8. Notatki do miejsc
 */
'use strict';

// ============================================================
// 1. ANIMOWANY SPLASH Z POGODĄ I POWITANIEM
// ============================================================

const TIPS = [
  '💡 Naciśnij Ctrl+K aby wyszukać cokolwiek',
  '🗺️ Kliknij prawym przyciskiem na mapie — menu kontekstowe',
  '🎯 Naciśnij L aby zlokalizować się na mapie',
  '❤️ Dodawaj miejsca do ulubionych klikając serce',
  '🏅 Odwiedzaj miejsca aby zdobywać odznaki',
  '🚶 Dołącz do trasy i umów spotkanie z innymi',
  '📅 Sprawdź sekcję "Na żywo" — prawdziwe dane ZDiTM',
  '🌙 Mapa automatycznie przełącza się na ciemny styl wieczorem',
  '📍 Kliknij na mapie aby skopiować współrzędne',
  '🔍 Wyszukiwarka przeszukuje miejsca, trasy i wydarzenia',
];

function initSplash() {
  const hour = new Date().getHours();

  // Greeting based on time of day (Pogoń Szczecin Royal Palette)
  const greetings = [
    { range: [5, 12],  text: 'Dzień dobry! ☀️',    bg: 'radial-gradient(circle at 50% 38%, #002D62 0%, #001738 55%, #000a18 100%)' },
    { range: [12, 17], text: 'Dobry dzień! 🌤️',    bg: 'radial-gradient(circle at 50% 38%, #003366 0%, #001a3d 55%, #000c1e 100%)' },
    { range: [17, 21], text: 'Dobry wieczór! 🌅',   bg: 'radial-gradient(circle at 50% 38%, #700018 0%, #001738 55%, #000a18 100%)' },
    { range: [21, 24], text: 'Dobranoc! 🌙',        bg: 'radial-gradient(circle at 50% 38%, #001a3d 0%, #001026 60%, #000612 100%)' },
    { range: [0, 5],   text: 'Nocna pora... 🌙',    bg: 'radial-gradient(circle at 50% 38%, #001738 0%, #000d20 60%, #00040a 100%)' },
  ];

  const g = greetings.find(g => hour >= g.range[0] && hour < g.range[1]) || greetings[0];

  const greetEl = document.getElementById('splashGreeting');
  const bgEl    = document.getElementById('splashBg');
  const tipEl   = document.getElementById('splashTip');

  if (greetEl) greetEl.textContent = g.text;
  if (bgEl) bgEl.style.background = g.bg;
  if (tipEl) tipEl.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];

  // Fetch weather for splash
  const LAT = 53.4530, LON = 14.5520;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=Europe/Warsaw`)
    .then(r => r.json())
    .then(data => {
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const WMO_ICONS = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',61:'🌧️',71:'🌨️',80:'🌦️',95:'⛈️' };
      const icon = WMO_ICONS[code] || WMO_ICONS[Math.floor(code/10)*10] || '🌡️';

      const weatherRow = document.getElementById('splashWeather');
      const wIcon = document.getElementById('splashWeatherIcon');
      const wTemp = document.getElementById('splashWeatherTemp');
      const wDesc = document.getElementById('splashWeatherDesc');

      if (weatherRow) weatherRow.style.display = 'flex';
      if (wIcon) wIcon.textContent = icon;
      if (wTemp) wTemp.textContent = `${temp}°C`;
      if (wDesc) wDesc.textContent = 'Niebuszewo';

      // Update splash icon only if not SVG crest
      const splashIcon = document.getElementById('splashIcon');
      if (splashIcon && !splashIcon.querySelector('svg')) splashIcon.textContent = icon;
    })
    .catch(() => {}); // silent fail — splash still works
}

// Call immediately
initSplash();

// ============================================================
// 2. KONFETTI PRZY ZDOBYCIU ODZNAKI
// ============================================================

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confettiCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#6c63ff','#ff6584','#43e97b','#ffd93d','#4ecdc4','#fd79a8','#ff6b6b','#a29bfe'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      opacity: 1
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vy += 0.08; // gravity
      if (frame > 80) p.opacity -= 0.015;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 140) requestAnimationFrame(animate);
    else canvas.remove();
  }
  animate();
}

// Hook into badge notification
const _origShowBadge = window.showBadgeNotification;
window.showBadgeNotification = function(badge) {
  if (_origShowBadge) _origShowBadge(badge);
  launchConfetti();
};

// ============================================================
// 3. "ZASKOCZY MNIE!" — LOSOWE MIEJSCE
// ============================================================

function surpriseMe() {
  if (!APP_DATA?.places?.length) return;
  const visited = window.userProfile?.getVisited?.() || [];
  // Prefer unvisited places
  let pool = APP_DATA.places.filter(p => !visited.includes(p.id));
  if (!pool.length) pool = APP_DATA.places; // all visited — pick any
  const place = pool[Math.floor(Math.random() * pool.length)];
  if (typeof openPlaceModal === 'function') openPlaceModal(place.id);
  if (typeof showToast === 'function') showToast(`🎲 Losowe miejsce: ${place.name}`);
}

// Add button to places section toolbar
function addSurpriseButton() {
  const toolbar = document.querySelector('.places-toolbar .places-tools');
  if (!toolbar || document.getElementById('surpriseBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'surpriseBtn';
  btn.className = 'places-tool-btn';
  btn.innerHTML = '🎲 Zaskoczy mnie!';
  btn.title = 'Losowe nieodwiedzone miejsce';
  btn.addEventListener('click', surpriseMe);
  toolbar.appendChild(btn);
}

// ============================================================
// 4. ANIMACJE PRZEJŚĆ MIĘDZY SEKCJAMI
// ============================================================

// Inject transition CSS once
const transitionStyle = document.createElement('style');
transitionStyle.textContent = `
  .section { animation: none; }
  .section.slide-in-right  { animation: slideInRight  0.28s cubic-bezier(0.4,0,0.2,1) both; }
  .section.slide-in-left   { animation: slideInLeft   0.28s cubic-bezier(0.4,0,0.2,1) both; }
  .section.slide-in-up     { animation: slideInUp2    0.28s cubic-bezier(0.4,0,0.2,1) both; }
  @keyframes slideInRight  { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:none; } }
  @keyframes slideInLeft   { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:none; } }
  @keyframes slideInUp2    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
`;
document.head.appendChild(transitionStyle);

const SECTION_ORDER = ['map','places','routes','info','transport','events','live','community'];

function getSectionAnimation(from, to) {
  const fi = SECTION_ORDER.indexOf(from);
  const ti = SECTION_ORDER.indexOf(to);
  if (fi === -1 || ti === -1) return 'slide-in-up';
  return ti > fi ? 'slide-in-right' : 'slide-in-left';
}

// Wrap navigateTo to add animations
let _lastSection = 'map';
const _origNavigateTo = window.navigateTo;
window.navigateTo = function(section) {
  const anim = getSectionAnimation(_lastSection, section);
  _lastSection = section;
  if (typeof _origNavigateTo === 'function') _origNavigateTo(section);
  // Apply animation to newly active section
  requestAnimationFrame(() => {
    const el = document.getElementById(`section-${section}`);
    if (el) {
      el.classList.remove('slide-in-right','slide-in-left','slide-in-up');
      void el.offsetWidth; // reflow
      el.classList.add(anim);
    }
  });
};

// ============================================================
// 5. "DZIŚ W DZIELNICY" — WIDGET NA MAPIE
// ============================================================

function buildTodayWidget() {
  const mapEl = document.getElementById('map');
  if (!mapEl || document.getElementById('todayWidget')) return;

  const widget = document.createElement('div');
  widget.id = 'todayWidget';
  widget.className = 'today-widget';
  mapEl.appendChild(widget);
  updateTodayWidget();
  setInterval(updateTodayWidget, 60 * 1000);
}

function updateTodayWidget() {
  const widget = document.getElementById('todayWidget');
  if (!widget) return;

  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}`;

  // Count today's events
  const todayEvents = (APP_DATA?.events || []).filter(e => {
    const months = {CZE:6,LIP:7,SIE:8,MAJ:5,KWI:4,MAR:3,LUT:2,STY:1,WRZ:9,PAŹ:10,LIS:11,GRU:12};
    const m = months[e.month] || 0;
    return m === now.getMonth()+1 && parseInt(e.day) === now.getDate();
  });

  // Count route participants
  let totalParticipants = 0;
  if (window.routesMeetup) {
    (APP_DATA?.routes || []).forEach(r => {
      totalParticipants += window.routesMeetup.getJoined(r.id).length;
    });
  }

  // Count upcoming meetups today
  let todayMeetups = 0;
  if (window.routesMeetup) {
    (APP_DATA?.routes || []).forEach(r => {
      window.routesMeetup.getMeetups(r.id).forEach(m => {
        if (m.date === now.toISOString().split('T')[0]) todayMeetups++;
      });
    });
  }

  const items = [];
  if (todayEvents.length) items.push(`🎉 ${todayEvents.length} wydarzenie${todayEvents.length > 1 ? 'ń' : ''} dziś`);
  if (totalParticipants) items.push(`👥 ${totalParticipants} na trasach`);
  if (todayMeetups) items.push(`📅 ${todayMeetups} spotkanie${todayMeetups > 1 ? 'ń' : ''} dziś`);
  if (!items.length) items.push(`📍 ${APP_DATA?.places?.length || 45} miejsc w okolicy`);

  widget.innerHTML = `
    <div class="tw-date">${todayStr}</div>
    <div class="tw-items">
      ${items.map(i => `<div class="tw-item">${i}</div>`).join('')}
    </div>
  `;
}

// ============================================================
// 6. KOLOR TEMPERATURY NA WIDGECIE POGODY
// ============================================================

function applyTemperatureColor(temp) {
  const widget = document.getElementById('weatherWidget');
  if (!widget) return;

  let color, bg;
  if (temp <= 0)       { color = '#74b9ff'; bg = 'rgba(116,185,255,0.12)'; }
  else if (temp <= 8)  { color = '#a29bfe'; bg = 'rgba(162,155,254,0.12)'; }
  else if (temp <= 15) { color = '#55efc4'; bg = 'rgba(85,239,196,0.12)'; }
  else if (temp <= 22) { color = '#43e97b'; bg = 'rgba(67,233,123,0.12)'; }
  else if (temp <= 28) { color = '#ffd93d'; bg = 'rgba(255,217,61,0.12)'; }
  else if (temp <= 33) { color = '#fd79a8'; bg = 'rgba(253,121,168,0.12)'; }
  else                 { color = '#ff6b6b'; bg = 'rgba(255,107,107,0.12)'; }

  widget.style.borderColor = color;
  widget.style.background  = `rgba(15,15,26,0.92)`;
  widget.style.boxShadow   = `0 0 16px ${bg}`;

  const tempEl = document.getElementById('wTemp');
  if (tempEl) tempEl.style.color = color;
}

// Hook into weather widget render
const _origRenderWeatherWidget = window.renderWeatherWidget;
window.renderWeatherWidget = function(c) {
  if (_origRenderWeatherWidget) _origRenderWeatherWidget(c);
  applyTemperatureColor(Math.round(c.temperature_2m));
};

// ============================================================
// 7. "PRZYPOMNIJ MI" DLA WYDARZEŃ
// ============================================================

const REMINDERS_KEY = 'event_reminders';

function getReminders() {
  try { return JSON.parse(localStorage.getItem(REMINDERS_KEY) || '[]'); } catch { return []; }
}

function toggleEventReminder(eventId, eventName, eventDay, eventMonth) {
  const reminders = getReminders();
  const idx = reminders.findIndex(r => r.id === eventId);

  if (idx !== -1) {
    reminders.splice(idx, 1);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    if (typeof showToast === 'function') showToast('🔕 Przypomnienie usunięte');
    return false;
  }

  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        addReminder(eventId, eventName, eventDay, eventMonth, reminders);
      } else {
        if (typeof showToast === 'function') showToast('⚠️ Zezwól na powiadomienia w ustawieniach przeglądarki');
      }
    });
  } else {
    addReminder(eventId, eventName, eventDay, eventMonth, reminders);
  }
  return true;
}

function addReminder(id, name, day, month, reminders) {
  const months = {CZE:6,LIP:7,SIE:8,MAJ:5,KWI:4,MAR:3,LUT:2,STY:1,WRZ:9,PAŹ:10,LIS:11,GRU:12};
  const m = months[month] || new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const eventDate = new Date(year, m - 1, parseInt(day), 10, 0, 0);
  const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1h before

  reminders.push({ id, name, day, month, reminderDate: reminderDate.toISOString() });
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));

  const msUntil = reminderDate - Date.now();
  if (msUntil > 0 && msUntil < 7 * 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('🎉 Wydarzenie za godzinę!', {
          body: `${name} — ${day} ${month}`,
          tag: 'event-' + id
        });
      }
    }, msUntil);
  }

  if (typeof showToast === 'function') showToast(`🔔 Przypomnę Ci o "${name}" godzinę wcześniej`);
}

function isReminderSet(eventId) {
  return getReminders().some(r => r.id === eventId);
}

// Expose globally
window.toggleEventReminder = toggleEventReminder;
window.isReminderSet = isReminderSet;

// ============================================================
// 8. NOTATKI DO MIEJSC
// ============================================================

const NOTES_KEY = 'place_notes';

function getNote(placeId) {
  try {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    return notes[placeId] || '';
  } catch { return ''; }
}

function saveNote(placeId, text) {
  try {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    if (text.trim()) notes[placeId] = text.trim();
    else delete notes[placeId];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {}
}

function renderNoteSection(placeId) {
  const note = getNote(placeId);
  return `
    <div class="place-note-section" id="note-section-${placeId}">
      <div class="pns-title">📝 Moja notatka <span class="pns-private">🔒 prywatna</span></div>
      <textarea class="pns-textarea" id="note-input-${placeId}"
        placeholder="Dodaj prywatną notatkę... (widoczna tylko dla Ciebie)"
        maxlength="300">${note}</textarea>
      <div class="pns-footer">
        <span class="pns-count" id="note-count-${placeId}">${note.length}/300</span>
        <button class="pns-save" onclick="handleSaveNote(${placeId})">💾 Zapisz</button>
        ${note ? `<button class="pns-delete" onclick="handleDeleteNote(${placeId})">🗑️</button>` : ''}
      </div>
    </div>
  `;
}

window.handleSaveNote = function(placeId) {
  const input = document.getElementById(`note-input-${placeId}`);
  if (!input) return;
  saveNote(placeId, input.value);
  if (typeof showToast === 'function') showToast('💾 Notatka zapisana');
  // Refresh note section
  const section = document.getElementById(`note-section-${placeId}`);
  if (section) section.outerHTML = renderNoteSection(placeId);
};

window.handleDeleteNote = function(placeId) {
  saveNote(placeId, '');
  if (typeof showToast === 'function') showToast('🗑️ Notatka usunięta');
  const section = document.getElementById(`note-section-${placeId}`);
  if (section) section.outerHTML = renderNoteSection(placeId);
};

// Live character counter
document.addEventListener('input', e => {
  if (e.target.id?.startsWith('note-input-')) {
    const id = e.target.id.replace('note-input-','');
    const counter = document.getElementById(`note-count-${id}`);
    if (counter) counter.textContent = `${e.target.value.length}/300`;
  }
});

// Expose
window.placeNotes = { getNote, saveNote, renderNoteSection };

// ============================================================
// 9. WIDGET DRAG & MINIMIZE SYSTEM (Tryb Przeciągania i Zmniejszania Widżetów)
// ============================================================

const WidgetDragManager = {
  registeredWidgets: [
    { id: 'weatherWidget', name: 'Pogoda', icon: '☀️', minClass: 'minimized', hasMinBtn: true, canClose: true },
    { id: 'clockWidget', name: 'Zegar', icon: '⏰', minClass: 'minimized', hasMinBtn: true, canClose: true },
    { id: 'aqiWidget', name: 'Jakość powietrza', icon: '🌿', minClass: 'minimized', hasMinBtn: true, canClose: true },
    { id: 'mapStatsPanel', name: 'Centrum Dzielnicy', icon: '📊', minClass: 'collapsed', hasMinBtn: false, canClose: true },
    { id: 'layerPanel', name: 'Warstwy', icon: '🗺️', minClass: 'collapsed', hasMinBtn: false, canClose: false }
  ],

  init() {
    this.initRestoreDock();
    this.bindWidgets();
    this.initCategoryFilterScroll();
    // Re-check for dynamically created widgets (mapStatsPanel, layerPanel)
    let checks = 0;
    const checkInterval = setInterval(() => {
      this.bindWidgets();
      checks++;
      if (checks > 20) clearInterval(checkInterval);
    }, 600);

    // Keep widgets inside screen on window resize
    window.addEventListener('resize', () => this.handleResize());
  },

  initRestoreDock() {
    const dock = document.getElementById('widgetRestoreDock');
    const trigger = document.getElementById('wrdTriggerBtn');
    const dropdown = document.getElementById('wrdDropdown');
    const restoreAllBtn = document.getElementById('wrdRestoreAllBtn');

    if (trigger && dropdown) {
      trigger.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      };

      document.addEventListener('click', (e) => {
        if (dock && !dock.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    }

    if (restoreAllBtn) {
      restoreAllBtn.onclick = (e) => {
        e.stopPropagation();
        this.restoreAllWidgets();
        if (dropdown) dropdown.classList.add('hidden');
      };
    }

    this.updateRestoreDock();
  },

  bindWidgets() {
    this.registeredWidgets.forEach(wConfig => {
      const el = document.getElementById(wConfig.id);
      if (!el) return;

      // Check if closed in localStorage
      const isClosed = localStorage.getItem(`widget_closed_${wConfig.id}`) === '1';
      if (isClosed) {
        el.classList.add('widget-hidden');
      }

      if (!el.dataset.dragInitialized) {
        el.dataset.dragInitialized = 'true';
        el.classList.add('draggable-widget');

        if (window.L?.DomEvent) {
          try {
            L.DomEvent.disableClickPropagation(el);
            L.DomEvent.disableScrollPropagation(el);
          } catch {}
        }

        // Inject handle and minimize button if not present
        this.ensureControls(el, wConfig);

        // Restore saved position
        this.restorePosition(el);

        // Restore saved minimize state
        this.restoreMinimizeState(el, wConfig);

        // Attach pointer drag listeners
        this.attachDragEvents(el);
      }
    });

    this.updateRestoreDock();
  },

  ensureControls(el, config) {
    // If widget doesn't have a drag handle yet, prepend or inject one
    if (!el.querySelector('.widget-drag-handle')) {
      const handle = document.createElement('span');
      handle.className = 'widget-drag-handle';
      handle.title = 'Przeciągnij widżet';
      handle.setAttribute('aria-label', 'Przeciągnij widżet');
      handle.textContent = '⠿';

      const targetHeader = el.querySelector('.w-top, .msp-toggle-btn, .lp-toggle-pill, .widget-header-controls');
      if (targetHeader) {
        targetHeader.prepend(handle);
      } else {
        const topRow = document.createElement('div');
        topRow.className = 'widget-header-controls';
        topRow.appendChild(handle);
        el.prepend(topRow);
      }
    }

    // If widget should have a minimize button and doesn't have one
    if (config.hasMinBtn && !el.querySelector('.widget-min-btn, .w-minimize-btn')) {
      const minBtn = document.createElement('button');
      minBtn.className = 'widget-min-btn';
      minBtn.title = 'Zwiń / rozwiń widżet';
      minBtn.setAttribute('aria-label', 'Zwiń lub rozwiń');
      minBtn.textContent = '▾';
      const topRow = el.querySelector('.widget-header-controls') || el.querySelector('.w-top');
      if (topRow) {
        topRow.appendChild(minBtn);
      }
    }

    // Attach robust listeners to all minimize buttons on this widget
    el.querySelectorAll('.widget-min-btn, .w-minimize-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.toggleMinimize(config.id);
      };
      btn.onpointerdown = (e) => e.stopPropagation();
      btn.ontouchstart = (e) => e.stopPropagation();
      btn.onmousedown = (e) => e.stopPropagation();
    });

    // Attach robust listeners to all close buttons on this widget
    el.querySelectorAll('.widget-close-btn, .msp-close-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.closeWidget(config.id);
      };
      btn.onpointerdown = (e) => e.stopPropagation();
      btn.ontouchstart = (e) => e.stopPropagation();
      btn.onmousedown = (e) => e.stopPropagation();
    });

    // Double click header or handle to toggle minimize
    el.addEventListener('dblclick', (e) => {
      if (['BUTTON', 'INPUT', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) return;
      e.stopPropagation();
      this.toggleMinimize(config.id);
    });
  },

  closeWidget(widgetId) {
    const config = this.registeredWidgets.find(w => w.id === widgetId);
    const el = document.getElementById(widgetId);
    if (!el || !config) return;

    el.classList.add('widget-hidden');
    try {
      localStorage.setItem(`widget_closed_${widgetId}`, '1');
    } catch {}

    this.updateRestoreDock();

    if (typeof showToast === 'function') {
      showToast(`Ukryto widżet: ${config.name}. Możesz go przywrócić w doku widżetów.`);
    }
  },

  restoreWidget(widgetId) {
    const config = this.registeredWidgets.find(w => w.id === widgetId);
    const el = document.getElementById(widgetId);
    if (!el || !config) return;

    el.classList.remove('widget-hidden');
    try {
      localStorage.removeItem(`widget_closed_${widgetId}`);
    } catch {}

    this.updateRestoreDock();

    if (typeof showToast === 'function') {
      showToast(`Przywrócono widżet: ${config.name}`);
    }
  },

  restoreAllWidgets() {
    this.registeredWidgets.forEach(config => {
      const el = document.getElementById(config.id);
      if (el) {
        el.classList.remove('widget-hidden');
      }
      try {
        localStorage.removeItem(`widget_closed_${config.id}`);
      } catch {}
    });

    this.updateRestoreDock();

    if (typeof showToast === 'function') {
      showToast('Wszystkie widżety zostały przywrócone');
    }
  },

  getClosedCount() {
    return this.registeredWidgets.filter(w => {
      const el = document.getElementById(w.id);
      return el && el.classList.contains('widget-hidden');
    }).length;
  },

  updateRestoreDock() {
    const dock = document.getElementById('widgetRestoreDock');
    const badge = document.getElementById('wrdBadge');
    const list = document.getElementById('wrdList');
    if (!dock) return;

    const closedWidgets = this.registeredWidgets.filter(w => {
      const el = document.getElementById(w.id);
      return el && el.classList.contains('widget-hidden');
    });

    const count = closedWidgets.length;
    if (badge) badge.textContent = count;

    if (list) {
      if (count === 0) {
        list.innerHTML = '<div class="wrd-empty">Wszystkie widżety są widoczne</div>';
      } else {
        list.innerHTML = closedWidgets.map(w => `
          <div class="wrd-item">
            <span class="wrd-item-name">${w.icon || '📌'} ${w.name}</span>
            <button class="wrd-item-restore-btn" onclick="WidgetDragManager.restoreWidget('${w.id}')">Przywróć</button>
          </div>
        `).join('');
      }
    }

    const currentSection = window.state?.currentSection || 'map';
    if (count > 0 && currentSection === 'map') {
      dock.classList.remove('hidden');
    } else {
      dock.classList.add('hidden');
    }
  },

  attachDragEvents(el) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let pointerId = null;
    let hasMoved = false;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons, links, inputs, or interactive items
      const isInteractive = e.target.closest('button, a, input, select, textarea, .msp-cat-chip, .msp-close-btn, .widget-close-btn, .cat-btn, .w-minimize-btn, .widget-min-btn');
      const isHandle = e.target.closest('.widget-drag-handle');

      if (isInteractive && !isHandle) return;

      // Only primary mouse button or touch
      if (e.button !== undefined && e.button !== 0) return;

      e.stopPropagation();
      if (window.L?.DomEvent) {
        try { L.DomEvent.stopPropagation(e); } catch {}
      }

      isDragging = true;
      hasMoved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      try {
        el.setPointerCapture(pointerId);
      } catch {}
    };

    const onPointerMove = (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        hasMoved = true;
        el.classList.add('is-dragging');
      }

      if (!hasMoved) return;

      e.stopPropagation();
      if (window.L?.DomEvent) {
        try { L.DomEvent.stopPropagation(e); } catch {}
      }
      if (e.cancelable) e.preventDefault();

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      // Viewport bounds
      const minLeft = 6;
      const maxLeft = Math.max(minLeft, window.innerWidth - el.offsetWidth - 6);
      const minTop = 52; // beneath header
      const maxTop = Math.max(minTop, window.innerHeight - el.offsetHeight - 52);

      newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
      newTop = Math.min(Math.max(minTop, newTop), maxTop);

      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', `${Math.round(newLeft)}px`, 'important');
      el.style.setProperty('top', `${Math.round(newTop)}px`, 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
    };

    const onPointerUp = (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;

      isDragging = false;
      el.classList.remove('is-dragging');

      try {
        el.releasePointerCapture(pointerId);
      } catch {}

      if (hasMoved) {
        el.dataset.justDragged = 'true';
        setTimeout(() => {
          el.dataset.justDragged = 'false';
        }, 350);

        // Save position to localStorage
        const pos = {
          left: parseFloat(el.style.left),
          top: parseFloat(el.style.top)
        };
        try {
          localStorage.setItem(`widget_pos_${el.id}`, JSON.stringify(pos));
          localStorage.setItem(`lucznicza_widget_pos_${el.id}`, JSON.stringify(pos));
        } catch {}
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    // Dedicated Touch Drag System for mobile devices
    const handles = el.querySelectorAll('.widget-drag-handle');
    handles.forEach(handle => {
      handle.style.touchAction = 'none';

      handle.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        isDragging = true;
        hasMoved = false;
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = el.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        e.stopPropagation();
      }, { passive: false });

      handle.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (!hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          hasMoved = true;
          el.classList.add('is-dragging');
        }

        if (!hasMoved) return;

        // Prevent browser scrolling and map panning while dragging
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        const minLeft = 6;
        const maxLeft = Math.max(minLeft, window.innerWidth - el.offsetWidth - 6);
        const minTop = 52;
        const maxTop = Math.max(minTop, window.innerHeight - el.offsetHeight - 52);

        newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
        newTop = Math.min(Math.max(minTop, newTop), maxTop);

        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('left', `${Math.round(newLeft)}px`, 'important');
        el.style.setProperty('top', `${Math.round(newTop)}px`, 'important');
        el.style.setProperty('right', 'auto', 'important');
        el.style.setProperty('bottom', 'auto', 'important');
      }, { passive: false });

      const onTouchEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        el.classList.remove('is-dragging');

        if (hasMoved) {
          el.dataset.justDragged = 'true';
          setTimeout(() => {
            el.dataset.justDragged = 'false';
          }, 350);

          const pos = {
            left: parseFloat(el.style.left),
            top: parseFloat(el.style.top)
          };
          try {
            localStorage.setItem(`widget_pos_${el.id}`, JSON.stringify(pos));
            localStorage.setItem(`lucznicza_widget_pos_${el.id}`, JSON.stringify(pos));
          } catch {}
        }
      };

      handle.addEventListener('touchend', onTouchEnd, { passive: true });
      handle.addEventListener('touchcancel', onTouchEnd, { passive: true });
    });
  },

  toggleMinimize(widgetId, forceState) {
    const config = this.registeredWidgets.find(w => w.id === widgetId);
    const el = document.getElementById(widgetId);
    if (!el || !config) return;

    const minClass = config.minClass || 'minimized';
    const isMin = forceState !== undefined ? forceState : !el.classList.contains(minClass);

    el.classList.toggle(minClass, isMin);
    try {
      localStorage.setItem(`widget_min_${widgetId}`, isMin ? '1' : '0');
    } catch {}

    // Update minimize button text/symbol
    const btn = el.querySelector('.widget-min-btn, .w-minimize-btn');
    if (btn) {
      btn.textContent = isMin ? '▸' : '▾';
    }

    if (typeof showToast === 'function') {
      const nameMap = {
        weatherWidget: 'Pogoda',
        clockWidget: 'Zegar',
        aqiWidget: 'Jakość powietrza',
        mapStatsPanel: 'Statystyki',
        layerPanel: 'Warstwy'
      };
      const label = nameMap[widgetId] || 'Widżet';
      showToast(`${label}: ${isMin ? 'zwinięty' : 'rozwinięty'}`);
    }
  },

  restorePosition(el) {
    try {
      const raw = localStorage.getItem(`widget_pos_${el.id}`) || localStorage.getItem(`lucznicza_widget_pos_${el.id}`);
      if (!raw) return;
      const pos = JSON.parse(raw);
      if (typeof pos.left === 'number' && typeof pos.top === 'number') {
        const minLeft = 8;
        const maxLeft = Math.max(minLeft, window.innerWidth - (el.offsetWidth || 150) - 8);
        const minTop = 56;
        const maxTop = Math.max(minTop, window.innerHeight - (el.offsetHeight || 60) - 56);

        const left = Math.min(Math.max(minLeft, pos.left), maxLeft);
        const top = Math.min(Math.max(minTop, pos.top), maxTop);

        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('left', `${Math.round(left)}px`, 'important');
        el.style.setProperty('top', `${Math.round(top)}px`, 'important');
        el.style.setProperty('right', 'auto', 'important');
        el.style.setProperty('bottom', 'auto', 'important');
      }
    } catch {}
  },

  restoreMinimizeState(el, config) {
    try {
      const raw = localStorage.getItem(`widget_min_${el.id}`);
      if (raw === null) return;
      const isMin = raw === '1';
      const minClass = config.minClass || 'minimized';
      el.classList.toggle(minClass, isMin);
      const btn = el.querySelector('.widget-min-btn, .w-minimize-btn');
      if (btn) btn.textContent = isMin ? '▸' : '▾';
    } catch {}
  },

  handleResize() {
    this.registeredWidgets.forEach(config => {
      const el = document.getElementById(config.id);
      if (!el || el.style.position !== 'fixed') return;

      const rect = el.getBoundingClientRect();
      const minLeft = 8;
      const maxLeft = Math.max(minLeft, window.innerWidth - rect.width - 8);
      const minTop = 56;
      const maxTop = Math.max(minTop, window.innerHeight - rect.height - 56);

      let curLeft = parseFloat(el.style.left) || rect.left;
      let curTop = parseFloat(el.style.top) || rect.top;

      let adjusted = false;
      if (curLeft > maxLeft) { curLeft = maxLeft; adjusted = true; }
      if (curLeft < minLeft) { curLeft = minLeft; adjusted = true; }
      if (curTop > maxTop) { curTop = maxTop; adjusted = true; }
      if (curTop < minTop) { curTop = minTop; adjusted = true; }

      if (adjusted) {
        el.style.setProperty('left', `${Math.round(curLeft)}px`, 'important');
        el.style.setProperty('top', `${Math.round(curTop)}px`, 'important');
      }
    });
  },

  resetAllPositions() {
    this.registeredWidgets.forEach(config => {
      try {
        localStorage.removeItem(`widget_pos_${config.id}`);
        localStorage.removeItem(`lucznicza_widget_pos_${config.id}`);
        localStorage.removeItem(`widget_min_${config.id}`);
        localStorage.removeItem(`widget_closed_${config.id}`);
      } catch {}
      const el = document.getElementById(config.id);
      if (el) {
        el.classList.remove('widget-hidden');
        el.style.removeProperty('position');
        el.style.removeProperty('left');
        el.style.removeProperty('top');
        el.style.removeProperty('right');
        el.style.removeProperty('bottom');

        // Default collapse/minimize
        if (config.id === 'mapStatsPanel' || config.id === 'layerPanel') {
          el.classList.add('collapsed');
        } else {
          el.classList.remove('minimized');
        }

        const btn = el.querySelector('.widget-min-btn, .w-minimize-btn');
        if (btn) btn.textContent = '▾';
      }
    });

    this.updateRestoreDock();

    if (typeof showToast === 'function') {
      showToast('🔄 Przywrócono domyślny układ widżetów na mapie');
    }
  },

  initCategoryFilterScroll() {
    const filter = document.querySelector('.category-filter');
    if (!filter || filter.dataset.scrollBound) return;
    filter.dataset.scrollBound = 'true';

    // Horizontal mouse wheel scrolling
    filter.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        filter.scrollBy({ left: e.deltaY * 1.6, behavior: 'smooth' });
      }
    }, { passive: false });

    // Smooth drag-to-scroll on desktop mouse
    let isDown = false;
    let startX = 0;
    let scrollStartLeft = 0;

    filter.addEventListener('mousedown', (e) => {
      if (e.target.closest('.cat-btn')) return;
      isDown = true;
      filter.classList.add('is-panning');
      startX = e.pageX - filter.offsetLeft;
      scrollStartLeft = filter.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - filter.offsetLeft;
      const walk = (x - startX) * 1.5;
      filter.scrollLeft = scrollStartLeft - walk;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        filter.classList.remove('is-panning');
      }
    });
  }
};

window.WidgetDragManager = WidgetDragManager;

// ============================================================
// INIT — wire everything up after app loads
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const waitForApp = setInterval(() => {
    if (window.state && !document.getElementById('app')?.classList.contains('hidden')) {
      clearInterval(waitForApp);
      setTimeout(() => {
        addSurpriseButton();
        buildTodayWidget();
        WidgetDragManager.init();
      }, 800);
    }
  }, 300);

  // Also initialize WidgetDragManager right away for static widgets
  setTimeout(() => {
    WidgetDragManager.init();
  }, 500);
});
