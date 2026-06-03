/**
 * desktop-layout-live.js — Desktop Layout Optimization for Live Section
 *
 * "Czas na żywo" jest teraz kartą wewnątrz sekcji Na żywo (nie floating overlay).
 * Ten plik tylko uruchamia zegar w tej karcie i dodaje ikony nawigacyjne po prawej.
 */

'use strict';

const DesktopLayoutLive = (() => {

  // ── Style dla karty zegara + ikon stack ─────────────────
  function injectStyles() {
    if (document.getElementById('desktopLayoutLiveStyle')) return;
    const s = document.createElement('style');
    s.id = 'desktopLayoutLiveStyle';
    s.textContent = `
      /* ── Karta "Czas na żywo" ─────────────── */
      .live-clock-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 16px 24px;
        gap: 6px;
      }
      .live-clock-time {
        font-size: 48px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: 2px;
        color: var(--text);
        line-height: 1;
      }
      .live-clock-date {
        font-size: 14px;
        color: var(--text2);
        letter-spacing: 0.5px;
      }

      /* ── Desktop icons stack (right side) ─── */
      .desktop-icons-stack { display: none; }

      @media (min-width: 1025px) {
        .desktop-icons-stack {
          position: fixed;
          top: calc(76px + 44px + 8px);
          right: 12px;
          z-index: 33;
          display: flex;
          flex-direction: column;
          gap: 5px;
          pointer-events: auto;
        }
        .desktop-icon-btn {
          width: 28px;
          height: 28px;
          background: rgba(15,15,26,0.85);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 1px 6px rgba(0,0,0,.3);
        }
        .desktop-icon-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
          transform: scale(1.12);
        }
        [data-theme="light"] .desktop-icon-btn {
          background: rgba(255,255,255,0.88);
          border-color: rgba(0,0,0,0.08);
        }
      }
    `;
    document.head.appendChild(s);
  }

  // ── Zegar w karcie #liveClockCard ───────────────────────
  function startLiveClock() {
    const tick = () => {
      const timeEl = document.getElementById('liveClockTime');
      const dateEl = document.getElementById('liveClockDate');
      if (!timeEl || !dateEl) return;

      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      dateEl.textContent = now.toLocaleDateString('pl-PL', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    };

    tick();
    setInterval(tick, 1000);
  }

  // ── Ikony nawigacyjne po prawej (tylko desktop) ─────────
  function createIconsStack() {
    if (document.getElementById('desktopIconsStack')) return;
    if (window.innerWidth < 1025) return;

    const nav = [
      { id: 'btnLive',      icon: '📡', label: 'Na żywo',     section: 'live'      },
      { id: 'btnPlaces',    icon: '📍', label: 'Miejsca',     section: 'places'    },
      { id: 'btnRoutes',    icon: '🚶', label: 'Trasy',       section: 'routes'    },
      { id: 'btnCommunity', icon: '👥', label: 'Społeczność', section: 'community' },
    ];

    const stack = document.createElement('div');
    stack.id = 'desktopIconsStack';
    stack.className = 'desktop-icons-stack';
    stack.setAttribute('role', 'toolbar');
    stack.setAttribute('aria-label', 'Szybka nawigacja');

    nav.forEach(({ id, icon, label, section }) => {
      const btn = document.createElement('button');
      btn.id = id;
      btn.className = 'desktop-icon-btn';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.textContent = icon;
      btn.addEventListener('click', () => {
        const target = document.querySelector(`[data-section="${section}"]`);
        if (target) target.click();
      });
      stack.appendChild(btn);
    });

    document.body.appendChild(stack);
  }

  // ── Resize ───────────────────────────────────────────────
  function handleResize() {
    if (window.innerWidth < 1025) {
      const stack = document.getElementById('desktopIconsStack');
      if (stack) stack.remove();
    } else {
      createIconsStack();
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    injectStyles();
    startLiveClock();

    if (window.innerWidth >= 1025) {
      setTimeout(createIconsStack, 400);
    }

    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(handleResize, 200);
    });

    console.log('✅ desktop-layout-live ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  return { init };
})();

window.DesktopLayoutLive = DesktopLayoutLive;
