/**
 * bus89-widget.js — Mini-widget "Następny autobus 89"
 * Wyświetla odliczanie do najbliższego odjazdu linii 89
 * z przystanku Kołłątaja/Łucznicza na mapie głównej.
 */
'use strict';

const Bus89Widget = (() => {

  // Rozkład jazdy linii 89 — przysatok Kołłątaja / Łucznicza (Niebuszewo)
  const SCHEDULE = {
    weekday: [
      '05:02','05:32','05:58','06:22','06:47','07:12','07:37','08:02','08:32','09:02',
      '09:32','10:02','10:32','11:02','11:32','12:02','12:32','13:02','13:32','14:02',
      '14:32','15:02','15:32','16:02','16:32','17:02','17:32','18:02','18:32','19:02',
      '19:32','20:02','20:32','21:02','21:32','22:05','22:35','23:05','23:35'
    ],
    saturday: [
      '05:32','06:02','06:32','07:02','07:32','08:02','08:32','09:02','09:32','10:02',
      '10:32','11:02','11:32','12:02','12:32','13:02','13:32','14:02','14:32','15:02',
      '15:32','16:02','16:32','17:02','17:32','18:02','18:32','19:02','19:32','20:02',
      '20:32','21:05','21:35','22:05','22:35','23:05'
    ],
    sunday: [
      '06:02','06:42','07:22','08:02','08:42','09:22','10:02','10:42','11:22','12:02',
      '12:42','13:22','14:02','14:42','15:22','16:02','16:42','17:22','18:02','18:42',
      '19:22','20:02','20:42','21:22','22:02','22:42','23:12'
    ]
  };

  let _intervalId = null;
  let _visible = false;

  function getDayType() {
    const day = new Date().getDay();
    if (day === 0) return 'sunday';
    if (day === 6) return 'saturday';
    return 'weekday';
  }

  function getNextDeparture() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const schedule = SCHEDULE[getDayType()];
    for (const time of schedule) {
      const [h, m] = time.split(':').map(Number);
      const depMinutes = h * 60 + m;
      if (depMinutes > currentMinutes) {
        return { time, diffMin: depMinutes - currentMinutes };
      }
    }
    return { time: SCHEDULE[getDayType()][0], diffMin: null, nextDay: true };
  }

  function formatCountdown(diffMin) {
    if (diffMin === null) return 'jutro';
    if (diffMin <= 1) return '~1 min';
    if (diffMin < 60) return diffMin + ' min';
    return Math.floor(diffMin / 60) + 'h ' + (diffMin % 60) + 'm';
  }

  function getUrgencyColor(diffMin) {
    if (diffMin === null || diffMin > 15) return '#43e97b';
    if (diffMin > 5) return '#ffd93d';
    return '#ff6584';
  }

  function render() {
    const el = document.getElementById('bus89Widget');
    if (!el) return;
    const { time, diffMin, nextDay } = getNextDeparture();
    const color = getUrgencyColor(diffMin);
    const countdown = formatCountdown(diffMin);
    const urgency = (diffMin !== null && diffMin <= 3) ? '🏃 BIEGNIJ!' :
                    (diffMin !== null && diffMin <= 7) ? '⚡ Pośpiesz się!' : '';
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-size:16px;">🚌</span>' +
        '<div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.6);line-height:1;margin-bottom:2px;">Linia 89 · Kołłątaja</div>' +
          '<div style="font-size:13px;font-weight:800;color:' + color + ';line-height:1;">' +
            (nextDay ? '▸ jutro ' + time : 'za ' + countdown) +
          '</div>' +
        '</div>' +
        (urgency
          ? '<div style="font-size:10px;font-weight:900;color:' + color + ';">' + urgency + '</div>'
          : '<div style="font-size:11px;color:rgba(255,255,255,0.5);">' + time + '</div>') +
      '</div>';
    el.style.borderColor = color + '66';
  }

  function show() {
    if (_visible) return;
    _visible = true;
    let widget = document.getElementById('bus89Widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'bus89Widget';
      widget.title = 'Kliknij → rozkład jazdy (Transport)';
      widget.onclick = function() { if (typeof navigateTo === 'function') navigateTo('transport'); };
      widget.style.cssText = [
        'position:fixed',
        'bottom:calc(var(--bnav-h, 64px) + 80px)',
        'right:12px',
        'background:rgba(10,18,35,0.92)',
        'backdrop-filter:blur(12px)',
        '-webkit-backdrop-filter:blur(12px)',
        'border:1.5px solid rgba(67,233,123,0.4)',
        'border-radius:16px',
        'padding:8px 14px',
        'cursor:pointer',
        'z-index:200',
        'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
        'transition:border-color 0.4s ease',
        'font-family:inherit',
        'animation:toastIn 0.4s cubic-bezier(0.16,1,0.3,1)'
      ].join(';');
      document.body.appendChild(widget);
    }
    render();
    _intervalId = setInterval(render, 30000);
  }

  function hide() {
    _visible = false;
    clearInterval(_intervalId);
    const el = document.getElementById('bus89Widget');
    if (el) el.remove();
  }

  function toggle() { _visible ? hide() : show(); }

  function initAutoVisibility() {
    const observer = new MutationObserver(function() {
      const section = document.body.getAttribute('data-active-section');
      if (section === 'map' || !section) { show(); } else { hide(); }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-active-section'] });
    const section = document.body.getAttribute('data-active-section');
    if (section === 'map' || !section) show();
  }

  document.addEventListener('DOMContentLoaded', initAutoVisibility);

  return { show: show, hide: hide, toggle: toggle, render: render };
})();

window.Bus89Widget = Bus89Widget;
