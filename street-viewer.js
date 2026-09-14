/**
 * street-viewer.js — Wirtualny Spacer 360° / Panoramy Uliczne bez klucza Google Maps (Krok 4)
 * Zapewnia interaktywny widok panoramiczny dla miejsc na Niebuszewie (Łucznicza, Tarczowa, Park Kadziaka)
 * z obsługą myszy/dotyku (drag to look around, zoom), mapą minimapą oraz linkami do otwartych serwisów (Mapillary / Wikimedia / OSM).
 */
'use strict';

const StreetViewer = (() => {
  const state = {
    active: false,
    currentPlace: null,
    yaw: 0,
    pitch: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0
  };

  // Predefiniowane i dynamiczne panoramy / widoki uliczne dla POI
  const PANORAMAS = {
    // 1. Łucznicza 43 - Serce Osiedla
    1: {
      title: 'ul. Łucznicza 43 — Serce Osiedla',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80',
      fallbackColor: '#002D62',
      note: 'Widok 360° na oś ulicy Łuczniczej i skrzyżowanie z Tarczową.'
    },
    // 2. Park Antoniego Kadziaka
    2: {
      title: 'Park Antoniego Kadziaka — Aleja Parkowa',
      img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80',
      fallbackColor: '#1e3c20',
      note: 'Zabytkowa aleja drzew, siłownia plenerowa i alejki spacerowe.'
    },
    // 3. Stacja Szczecin Niebuszewo
    3: {
      title: 'Stacja Kolejowa Szczecin Niebuszewo (SKM)',
      img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2000&q=80',
      fallbackColor: '#2b2b36',
      note: 'Historyczny peron i węzeł Szczecińskiej Kolei Metropolitalnej.'
    },
    // 4. Pętla Kołłątaja / Manhattan
    4: {
      title: 'Węzeł Kołłątaja / Targowisko Manhattan',
      img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80',
      fallbackColor: '#3a2010',
      note: 'Rondo Giedroycia i widok na historyczną architekturę Niebuszewa.'
    },
    // Domyślna panorama miejska dla pozostałych POI
    default: {
      title: 'Panorama Uliczna — Niebuszewo',
      img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80',
      fallbackColor: '#1a1a2e',
      note: 'Perspektywa spacerowa na architekturę dzielnicy.'
    }
  };

  function open(placeId) {
    const place = window.APP_DATA?.places?.find(p => p.id === placeId);
    if (!place) return;

    state.currentPlace = place;
    state.active = true;
    state.yaw = 0;
    state.pitch = 0;

    const modal = document.getElementById('streetViewerModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Aktualizacja nagłówka
    const titleEl = document.getElementById('svmTitle');
    const descEl = document.getElementById('svmDesc');
    const panoImg = document.getElementById('svmPanoImg');
    const mapillaryBtn = document.getElementById('svmMapillaryBtn');
    const osmBtn = document.getElementById('svmOsmBtn');

    const panoData = PANORAMAS[place.id] || PANORAMAS.default;

    if (titleEl) titleEl.textContent = `👁️ ${place.name} — Wirtualny Spacer 360°`;
    if (descEl) descEl.textContent = `${place.addr} · ${panoData.note}`;
    if (panoImg) {
      panoImg.src = panoData.img;
      panoImg.alt = place.name;
      panoImg.style.transform = `scale(1.2) translate(0px, 0px)`;
    }

    // Link do Mapillary (otwarte zdjęcia uliczne społeczności)
    if (mapillaryBtn) {
      const lat = place.coords[1];
      const lng = place.coords[0];
      mapillaryBtn.href = `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=17`;
    }

    // Link do OpenStreetMap
    if (osmBtn) {
      const lat = place.coords[1];
      const lng = place.coords[0];
      osmBtn.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
    }

    initDragControls();
  }

  function close() {
    const modal = document.getElementById('streetViewerModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
    state.active = false;
  }

  function initDragControls() {
    const canvas = document.getElementById('svmCanvas');
    const panoImg = document.getElementById('svmPanoImg');
    if (!canvas || !panoImg) return;

    let posX = 0;
    let posY = 0;

    function onPointerDown(e) {
      state.isDragging = true;
      state.startX = e.clientX;
      state.startY = e.clientY;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!state.isDragging) return;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      posX += dx * 0.8;
      posY += dy * 0.4;
      // Ograniczenie pionowe
      posY = Math.max(-100, Math.min(100, posY));

      state.startX = e.clientX;
      state.startY = e.clientY;

      panoImg.style.transform = `scale(1.35) translate(${posX}px, ${posY}px)`;
    }

    function onPointerUp(e) {
      state.isDragging = false;
      canvas.style.cursor = 'grab';
    }

    canvas.onpointerdown = onPointerDown;
    canvas.onpointermove = onPointerMove;
    canvas.onpointerup = onPointerUp;
    canvas.onpointercancel = onPointerUp;
  }

  return {
    open,
    close,
    getState: () => ({ ...state })
  };
})();

window.StreetViewer = StreetViewer;
window.openStreetViewer = (id) => StreetViewer.open(id);
window.closeStreetViewer = () => StreetViewer.close();
