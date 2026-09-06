/**
 * category-filter-enhancements.js
 * Ulepszenia paska filtrów kategorii:
 *  1. Scroll kółkiem myszy (poziomy)
 *  2. Persist offsetu dragu w sessionStorage
 *  3. Auto-scroll aktywnej pigułki do widoku
 *  4. Toggle ścieżek rowerowych (przycisk 🚲)
 */
'use strict';

(function () {
  // ── Helpers ────────────────────────────────────────────────────────────────

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // ── 1. Scroll kółkiem myszy (poziomy) ──────────────────────────────────────
  function setupWheelScroll(filter) {
    filter.addEventListener('wheel', (e) => {
      // Jeśli pasek ma scrollbar poziomy — pozwól mu scrollować
      if (filter.scrollWidth > filter.clientWidth) {
        e.preventDefault();
        filter.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
      }
    }, { passive: false });
  }

  // ── 2. Persist offsetu drag w sessionStorage ───────────────────────────────
  const STORAGE_KEY = 'cat-filter-transform';

  function persistDragOffset(filter) {
    // Przywróć zapisaną pozycję (jeśli jest)
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        filter.style.transform = `translate(${x}px, ${y}px)`;
      } catch (_) { /* ignore */ }
    }

    // Nasłuchuj na zakończenie dragu — gesture:drag nie wystarczy,
    // korzystamy z pointermove + pointerup na poziomie dokumentu.
    // Zamiast tego reagujemy na mutacje stylu transform.
    const observer = new MutationObserver(() => {
      const t = filter.style.transform || '';
      const match = t.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
      if (match) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
        }));
      }
    });
    observer.observe(filter, { attributes: true, attributeFilter: ['style'] });
  }

  // ── 3. Auto-scroll aktywnej pigułki do widoku ─────────────────────────────
  function scrollActiveIntoView(filter) {
    const active = filter.querySelector('.cat-btn.active');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  function setupAutoScrollOnActivate(filter) {
    filter.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      // Poczekaj chwilę, aż klasa .active zostanie ustawiona przez app.js
      requestAnimationFrame(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      });
    });
  }

  // ── 4. Toggle ścieżek rowerowych ──────────────────────────────────────────
  function setupBikeRoutesToggle() {
    const btn = document.getElementById('catBikeRoutesBtn');
    if (!btn) return;

    let bikeVisible = false;

    // Sprawdź czy BikeSectionManager istnieje (może być załadowany asynchronicznie)
    function getBSM() {
      return window.BikeSectionManager;
    }

    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', () => {
      bikeVisible = !bikeVisible;
      btn.setAttribute('aria-pressed', String(bikeVisible));
      btn.classList.toggle('active', bikeVisible);

      const bsm = getBSM();
      if (bsm) {
        if (bikeVisible) {
          // Pokaż domyślną warstwę sieci tras rowerowych (tryb widoku, nie planowania)
          if (typeof bsm.showNetworkLayer === 'function') {
            bsm.showNetworkLayer();
          } else if (bsm.routeLayer && window.state?.map) {
            bsm.routeLayer.addTo(window.state.map);
          } else {
            // Fallback: przełącz na CyclOSM jeśli brak dedykowanej warstwy
            if (window.MapPro?.setStyle) {
              window.MapPro.setStyle('cyclosm');
            } else if (typeof switchMapStyle === 'function') {
              switchMapStyle('cyclosm');
            }
            if (typeof showToast === 'function') {
              showToast('🚲 Widok rowerowy CyclOSM włączony');
            }
          }
        } else {
          if (typeof bsm.clearActiveRoute === 'function') {
            bsm.clearActiveRoute();
          } else if (bsm.routeLayer && window.state?.map) {
            window.state.map.removeLayer(bsm.routeLayer);
          } else {
            if (window.MapPro?.setStyle) {
              window.MapPro.setStyle('satellite');
            } else if (typeof switchMapStyle === 'function') {
              switchMapStyle('satellite');
            }
            if (typeof showToast === 'function') {
              showToast('🗺️ Widok rowerowy wyłączony');
            }
          }
        }
      } else {
        // BikeSectionManager nie załadowany — przełącz styl mapy
        if (bikeVisible) {
          if (typeof switchMapStyle === 'function') switchMapStyle('cyclosm');
          if (typeof showToast === 'function') showToast('🚲 Widok rowerowy CyclOSM włączony');
        } else {
          if (typeof switchMapStyle === 'function') switchMapStyle('satellite');
          if (typeof showToast === 'function') showToast('🗺️ Widok standardowy przywrócony');
        }
      }
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  ready(() => {
    const filter = document.querySelector('.category-filter[data-draggable]');
    if (!filter) return;

    setupWheelScroll(filter);
    persistDragOffset(filter);
    setupAutoScrollOnActivate(filter);
    scrollActiveIntoView(filter); // Na start

    setupBikeRoutesToggle();
  });

})();
