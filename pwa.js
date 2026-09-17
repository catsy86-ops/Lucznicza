/**
 * pwa.js — PWA Install Banner + Service Worker registration + iOS Install Guide
 * Handles beforeinstallprompt, shows custom install UI, detects iOS Safari,
 * registers SW for offline support and background sync.
 */
'use strict';

// ===== PWA INSTALL BANNER & PROMPT =====
let deferredPrompt = null;

function isIosSafari() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isStandalone = ('standalone' in navigator && navigator.standalone) ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  return isIos && !isStandalone;
}

function isAppInstalled() {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem('pwaInstalled') === '1') return true;
  if ('standalone' in navigator && navigator.standalone) return true;
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  window.deferredInstallPrompt = e;

  // Show banner after 3 seconds if not dismissed recently and not installed
  const dismissedUntil = parseInt(localStorage.getItem('pwaDismissedUntil') || '0', 10);
  if (!isAppInstalled() && Date.now() > dismissedUntil) {
    setTimeout(showInstallBanner, 3000);
  }
});

// For iOS Safari users, display install hint banner after brief delay if not dismissed
if (isIosSafari() && !isAppInstalled()) {
  const dismissedUntil = parseInt(localStorage.getItem('pwaDismissedUntil') || '0', 10);
  if (Date.now() > dismissedUntil) {
    setTimeout(showInstallBanner, 4000);
  }
}

window.addEventListener('appinstalled', () => {
  localStorage.setItem('pwaInstalled', '1');
  deferredPrompt = null;
  window.deferredInstallPrompt = null;
  hideInstallBanner();
  if (typeof showToast === 'function') showToast('✅ Aplikacja zainstalowana na ekranie głównym!');
});

function showInstallBanner() {
  if (document.getElementById('pwaBanner') || isAppInstalled()) return;
  const banner = document.createElement('div');
  banner.id = 'pwaBanner';
  banner.className = 'pwa-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Instalacja aplikacji PWA');
  banner.innerHTML = `
    <div class="pwa-banner-icon">🏹</div>
    <div class="pwa-banner-text">
      <div class="pwa-banner-title">Zainstaluj aplikację</div>
      <div class="pwa-banner-sub">Dodaj do ekranu głównego — działa offline</div>
    </div>
    <button class="pwa-banner-install" id="pwaInstallBtn">Zainstaluj</button>
    <button class="pwa-banner-close" id="pwaDismissBtn" aria-label="Zamknij">✕</button>
  `;
  document.body.appendChild(banner);
  // Animate in
  requestAnimationFrame(() => banner.classList.add('visible'));

  document.getElementById('pwaInstallBtn').addEventListener('click', () => {
    installPWA();
  });

  document.getElementById('pwaDismissBtn').addEventListener('click', () => {
    // Dismiss for 7 days
    localStorage.setItem('pwaDismissedUntil', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    hideInstallBanner();
  });
}

function hideInstallBanner() {
  const banner = document.getElementById('pwaBanner');
  if (!banner) return;
  banner.classList.remove('visible');
  setTimeout(() => banner.remove(), 400);
}

function showIosInstallGuide() {
  let modal = document.getElementById('iosInstallModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'iosInstallModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card ios-install-card" style="max-width: 440px; padding: 24px; text-align: center; border: 1.5px solid rgba(255, 215, 0, 0.45); background: rgba(0, 23, 56, 0.96); backdrop-filter: blur(20px); border-radius: 18px; box-shadow: 0 12px 36px rgba(0,0,0,0.6);">
      <div style="font-size: 48px; margin-bottom: 8px;">📲</div>
      <h3 style="font-size: 19px; font-weight: 800; color: #FFD700; margin-bottom: 8px;">
        Zainstaluj na iPhone / iPad
      </h3>
      <p style="font-size: 13.5px; color: var(--text2, #cbd5e1); line-height: 1.5; margin-bottom: 16px;">
        Dodaj przewodnik do ekranu początkowego, aby korzystać z pełnego ekranu i trybu offline:
      </p>
      <div style="background: rgba(0,45,98,0.5); border: 1px solid rgba(255,215,0,0.3); border-radius: 14px; padding: 14px; text-align: left; margin-bottom: 20px; font-size: 13px; line-height: 1.6; color: #f8fafc;">
        <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 800; color: #FFD700;">1.</span>
          <span>Stuknij ikonę <b>Udostępnij</b> <span style="font-size: 16px;">⎋</span> na dolnym pasku Safari.</span>
        </div>
        <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 800; color: #FFD700;">2.</span>
          <span>Przewiń w dół i wybierz <b>Do ekranu początkowego</b> <span style="font-size: 16px;">➕</span>.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 800; color: #FFD700;">3.</span>
          <span>Stuknij <b>Dodaj</b> w prawym górnym rogu. Gotowe!</span>
        </div>
      </div>
      <button class="btn-primary" id="closeIosInstallGuideBtn" style="width: 100%; padding: 12px; border-radius: 24px; font-weight: 800; cursor: pointer; background: linear-gradient(135deg, #002D62, #990024); border: 1.5px solid #FFD700; color: #FFD700;">
        Rozumiem
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';
  modal.classList.remove('hidden');

  const closeBtn = document.getElementById('closeIosInstallGuideBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.remove());
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

async function installPWA() {
  if (isAppInstalled()) {
    if (typeof showToast === 'function') showToast('✅ Aplikacja jest już zainstalowana!');
    return;
  }

  const promptEvent = deferredPrompt || window.deferredInstallPrompt;
  if (promptEvent) {
    try {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwaInstalled', '1');
      }
      deferredPrompt = null;
      window.deferredInstallPrompt = null;
      hideInstallBanner();
    } catch {
      hideInstallBanner();
    }
  } else if (isIosSafari()) {
    showIosInstallGuide();
  } else {
    // Other browser / desktop
    if (typeof showToast === 'function') {
      showToast('💡 Kliknij ikonę instalacji w pasku adresu przeglądarki');
    }
  }
}

// Expose global methods
window.installPWA = installPWA;
window.isIosSafari = isIosSafari;
window.showIosInstallGuide = showIosInstallGuide;
window.isAppInstalled = isAppInstalled;

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('✅ SW registered:', reg.scope);
        // Actively check for SW updates
        reg.update().catch(() => {});
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner();
            }
          });
        });
      })
      .catch(err => console.warn('SW registration failed:', err));
  });
}

function showUpdateBanner() {
  if (typeof showToast === 'function') {
    showToast('🔄 Nowa wersja dostępna — odśwież stronę');
  }
  // Create update banner
  const banner = document.createElement('div');
  banner.id = 'updateBanner';
  banner.className = 'update-banner';
  banner.innerHTML = `
    <span>🔄 Dostępna nowa wersja aplikacji</span>
    <button onclick="location.reload()">Odśwież</button>
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));
}

// ===== ONLINE/OFFLINE STATUS =====
function updateOnlineStatus() {
  const isOnline = navigator.onLine;
  if (!isOnline) {
    if (typeof showToast === 'function') showToast('📵 Tryb offline — dane mogą być nieaktualne');
    document.body.classList.add('offline');
  } else {
    document.body.classList.remove('offline');
  }
}

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
