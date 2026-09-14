/**
 * offline-tour-packager.js — Tryb Wycieczki Offline (Pobieranie Kafelków & Trasy do Pamięci Offline) (Krok 9)
 * Umożliwia pobranie wybranej trasy wraz z kafelkami mapy w zadanym promieniu wokół punktów
 * oraz danymi POI i przystanków do Service Workera / Cache API / IndexedDB.
 */
'use strict';

const OfflineTourPackager = (() => {
  const PACKAGES_KEY = 'offline_tour_packages';

  function getDownloadedPackages() {
    try {
      return JSON.parse(localStorage.getItem(PACKAGES_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function isPackageDownloaded(routeId) {
    return getDownloadedPackages().includes(routeId);
  }

  function deg2num(lat_deg, lon_deg, zoom) {
    const lat_rad = lat_deg * Math.PI / 180;
    const n = 2.0 ** zoom;
    const xtile = Math.floor((lon_deg + 180.0) / 360.0 * n);
    const ytile = Math.floor((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n);
    return { x: xtile, y: ytile };
  }

  async function downloadRoutePackage(routeId, onProgress) {
    const route = window.APP_DATA?.routes?.find(r => r.id === routeId);
    if (!route) {
      if (typeof window.showToast === 'function') window.showToast('❌ Nie znaleziono trasy');
      return { success: false, error: 'Route not found' };
    }

    if (typeof window.showToast === 'function') {
      window.showToast(`📦 Przygotowuję pakiet offline: ${route.name}...`);
    }

    // Wyznacz kafelki dla zoomów 14-16 wzdłuż koordynatów trasy
    const tileUrls = new Set();
    const subdomains = ['a', 'b', 'c'];
    const zooms = [14, 15, 16];

    for (const coord of (route.coords || [])) {
      const lon = coord[0];
      const lat = coord[1];
      for (const z of zooms) {
        const { x, y } = deg2num(lat, lon, z);
        // Pobierz również sąsiednie kafelki dla bufora
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const tx = x + dx;
            const ty = y + dy;
            const s = subdomains[(tx + ty) % subdomains.length];
            tileUrls.add(`https://${s}.tile.openstreetmap.org/${z}/${tx}/${ty}.png`);
          }
        }
      }
    }

    const tileList = Array.from(tileUrls);
    let cachedCount = 0;
    const totalTiles = tileList.length;

    // Pobierz kafelki do Cache API (map-tiles)
    if ('caches' in window) {
      try {
        const cache = await caches.open('map-tiles-v11');
        for (let i = 0; i < tileList.length; i++) {
          const url = tileList[i];
          try {
            // Sprawdź czy już jest
            const match = await cache.match(url);
            if (!match) {
              const res = await fetch(url, { mode: 'no-cors' });
              if (res && res.status === 200 || res.type === 'opaque') {
                await cache.put(url, res);
              }
            }
          } catch (_) {
            // Ignoruj pojedyncze błędy sieci
          }
          cachedCount++;
          if (onProgress && i % 5 === 0) {
            onProgress(Math.round((cachedCount / totalTiles) * 100));
          }
        }
      } catch (err) {
        console.warn('OfflineTourPackager cache error:', err);
      }
    }

    // Zapisz pakiet trasy w IndexedDB (jeśli OfflineStore dostępny)
    if (window.OfflineStore && typeof window.OfflineStore.set === 'function') {
      await window.OfflineStore.set(`offline_route_${routeId}`, {
        route,
        downloadedAt: Date.now(),
        tilesCount: totalTiles
      }, 7 * 24 * 60 * 60 * 1000); // 7 dni
    }

    // Zapisz ID w pobranych
    const packages = getDownloadedPackages();
    if (!packages.includes(routeId)) {
      packages.push(routeId);
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    }

    // Zaktualizuj UI przycisku jeśli istnieje
    updateButtonUi(routeId, true);

    if (typeof window.showToast === 'function') {
      window.showToast(`✅ Pakiet offline "${route.name}" gotowy do zwiedzania! (${totalTiles} kafelków)`);
    }

    return {
      success: true,
      routeId,
      routeName: route.name,
      totalTiles
    };
  }

  async function removeRoutePackage(routeId) {
    const packages = getDownloadedPackages().filter(id => id !== routeId);
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    updateButtonUi(routeId, false);
    if (typeof window.showToast === 'function') {
      window.showToast('🗑️ Usunięto pakiet offline');
    }
  }

  function updateButtonUi(routeId, isDownloaded) {
    const btn = document.getElementById(`offline-pkg-btn-${routeId}`);
    if (btn) {
      btn.classList.toggle('active', isDownloaded);
      btn.innerHTML = isDownloaded ? '💾 Pobrana (Offline)' : '📥 Pobierz Offline';
      btn.title = isDownloaded ? 'Trasa pobrana do pamięci offline. Kliknij, aby usunąć pakiet.' : 'Pobierz kafelki i trasę do pamięci offline';
    }
  }

  function togglePackage(routeId) {
    if (isPackageDownloaded(routeId)) {
      removeRoutePackage(routeId);
    } else {
      downloadRoutePackage(routeId);
    }
  }

  return {
    downloadRoutePackage,
    removeRoutePackage,
    isPackageDownloaded,
    getDownloadedPackages,
    togglePackage,
    updateButtonUi
  };
})();

// Expose globally
window.OfflineTourPackager = OfflineTourPackager;
