/**
 * ui-fix-overlapping.js — Z-Index management + accessibility only
 *
 * Positioning of map widgets is handled entirely by map-layout-grid.css.
 * This file only:
 *  1. Sets the z-index hierarchy for structural elements (header, nav, modals…)
 *  2. Fixes the transport panel z-index when it is created dynamically
 *  3. Manages keyboard focus inside modals
 *  4. Applies body data-layout attribute for CSS breakpoint hooks
 */

'use strict';

const UIFixOverlapping = (() => {

  // ── Z-Index values ──────────────────────────────────────
  const Z = {
    header:        100,
    bottomNav:     100,
    searchBar:      95,
    sidebarOverlay:200,
    sidebar:       201,
    pullRefresh:   250,
    modalOverlay:  299,
    modal:         300,
    modalClose:    301,
    toast:         400,
    networkStatus: 500,
    splash:       9999,
    skipLink:    99999,
  };

  // ── 1. Inject minimal z-index overrides ─────────────────
  function injectZIndexStyles() {
    if (document.getElementById('uiFixZIndexStyle')) return;
    const s = document.createElement('style');
    s.id = 'uiFixZIndexStyle';
    s.textContent = `
      /* structural */
      .header          { z-index: ${Z.header}        !important; }
      .bottom-nav      { z-index: ${Z.bottomNav}     !important; }
      .search-bar      { z-index: ${Z.searchBar}     !important; }
      .sidebar-overlay { z-index: ${Z.sidebarOverlay}!important; }
      .sidebar         { z-index: ${Z.sidebar}       !important; }

      /* overlays */
      .pull-refresh-indicator { z-index: ${Z.pullRefresh}   !important; }
      .modal-overlay          { z-index: ${Z.modalOverlay}  !important; }
      .modal                  { z-index: ${Z.modal}         !important; }
      .modal-close            { z-index: ${Z.modalClose}    !important; position: sticky !important; }
      .toast                  { z-index: ${Z.toast}         !important; }
      .network-status         { z-index: ${Z.networkStatus} !important; }
      .skip-link              { z-index: ${Z.skipLink}      !important; }

      /* transport panel created by transport-panel-pro.js */
      #transportPanelContainer,
      .transport-panel-container {
        z-index: 40 !important;
      }

      /* focus ring */
      .minimal-controls *:focus-visible,
      .modal *:focus-visible {
        outline: 3px solid var(--accent) !important;
        outline-offset: 2px !important;
      }

      /* debug helper */
      body.debug-ui [class],
      body.debug-ui [id] {
        outline: 1px dashed rgba(255,60,60,.4) !important;
      }
    `;
    document.head.appendChild(s);
  }

  // ── 2. Re-apply transport panel z-index whenever it spawns ─
  function watchTransportPanel() {
    const apply = () => {
      const el = document.getElementById('transportPanelContainer')
               || document.querySelector('.transport-panel-container');
      if (el) el.style.setProperty('z-index', '40', 'important');
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.body, { childList: true, subtree: false });
  }

  // ── 3. Focus trap for modals ─────────────────────────────
  function setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay:not(.hidden)');
        if (modal) { modal.classList.add('hidden'); document.body.focus(); }
      }

      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal:not(.hidden)');
        if (!modal) return;
        const focusable = Array.from(modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first)  { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  // ── 4. Set data-layout on body ───────────────────────────
  function setLayoutAttr() {
    const w = window.innerWidth;
    document.body.setAttribute('data-layout',
      w < 768 ? 'mobile' : w < 1025 ? 'tablet' : 'desktop');
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    injectZIndexStyles();
    watchTransportPanel();
    setupFocusManagement();
    setLayoutAttr();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setLayoutAttr, 200);
    });

    console.log('✅ ui-fix-overlapping: z-index + focus ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  return { init, Z };
})();

window.UIFixOverlapping = UIFixOverlapping;
