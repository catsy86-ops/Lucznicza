/**
 * tester-feedback.js — System Zgłaszania Uwag, Nowych Miejsc i Błędów (Beta Feedback)
 * Zbiera uwagi od mieszkańców i testerów, umożliwia zgłaszanie nowych punktów POI,
 * integruje się z OfflineSyncService (outbox queue) oraz dołącza kontekst diagnostyczny.
 */
'use strict';

const TesterFeedback = (() => {
  const STORAGE_KEY = 'tester_feedback_reports';

  function getReports() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function getDiagnosticInfo() {
    const map = window.state?.map;
    const center = map ? map.getCenter() : null;
    const zoom = map ? map.getZoom() : null;

    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      currentSection: window.state?.currentSection || 'map',
      screen: `${window.innerWidth}x${window.innerHeight} (DPR: ${window.devicePixelRatio || 1})`,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      mapState: center ? `lat: ${center.lat.toFixed(5)}, lng: ${center.lng.toFixed(5)}, zoom: ${zoom}` : 'brak mapy',
      activeTheme: localStorage.getItem('lucznicza_theme') || 'dark',
      appVersion: '2.0.0-pwa'
    };
  }

  function openFeedbackModal(initialType = 'bug') {
    let modal = document.getElementById('testerFeedbackModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'testerFeedbackModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    renderModal(modal, initialType);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function closeFeedbackModal() {
    const modal = document.getElementById('testerFeedbackModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function renderModal(modal, initialType = 'bug') {
    const diag = getDiagnosticInfo();

    modal.innerHTML = `
      <div class="modal-card feedback-modal-card">
        <div class="tf-header">
          <div>
            <span class="tf-badge">💬 SPOŁECZNOŚĆ & TESTY</span>
            <h2 class="tf-title">Zgłoś miejsce lub uwagę</h2>
            <p class="tf-sub">Pomóż współtworzyć przewodnik po Niebuszewie i Szczecinie</p>
          </div>
          <button class="tf-close-btn" onclick="TesterFeedback.close()" aria-label="Zamknij">✕</button>
        </div>

        <form class="tf-body" id="tfForm" onsubmit="event.preventDefault(); TesterFeedback.submit();">
          <div class="tf-field">
            <label class="tf-label">Rodzaj zgłoszenia:</label>
            <div class="tf-type-selector">
              <button type="button" class="tf-type-btn ${initialType === 'place' ? 'active' : ''}" data-type="place">📍 Nowe miejsce (POI)</button>
              <button type="button" class="tf-type-btn ${initialType === 'bug' ? 'active' : ''}" data-type="bug">🐛 Błąd / Usterka</button>
              <button type="button" class="tf-type-btn ${initialType === 'idea' ? 'active' : ''}" data-type="idea">💡 Nowy pomysł</button>
              <button type="button" class="tf-type-btn ${initialType === 'content' ? 'active' : ''}" data-type="content">📝 Treść / Literówka</button>
              <button type="button" class="tf-type-btn ${initialType === 'ux' ? 'active' : ''}" data-type="ux">✨ Wygląd / Wygoda</button>
            </div>
            <input type="hidden" id="tfTypeInput" value="${initialType}" />
          </div>

          <!-- Pola dedykowane dla nowego miejsca -->
          <div id="tfPlaceFieldsWrap" style="display: ${initialType === 'place' ? 'block' : 'none'}; background: rgba(0,45,98,0.25); border: 1px dashed rgba(255,215,0,0.35); border-radius: 12px; padding: 12px; margin-bottom: 12px;">
            <div class="tf-field" style="margin-bottom: 8px;">
              <label class="tf-label" for="tfPlaceName">Nazwa proponowanego miejsca:*</label>
              <input type="text" id="tfPlaceName" class="tf-input" placeholder="np. Kawiarnia Na Rogu, Boisko Orlik" />
            </div>
            <div class="tf-field" style="margin-bottom: 8px;">
              <label class="tf-label" for="tfPlaceCat">Kategoria:</label>
              <select id="tfPlaceCat" class="tf-input" style="background: var(--surface2, #1e293b); color: inherit;">
                <option value="food">☕ Gastronomia / Kawiarnia / Pub</option>
                <option value="sport">⚽ Sport & Rekreacja</option>
                <option value="shop">🛍️ Sklep / Piekarnia</option>
                <option value="park">🌳 Park & Zieleń</option>
                <option value="service">✂️ Usługi / Rzemieślnik</option>
                <option value="edu">📚 Edukacja & Kultura</option>
                <option value="other">📍 Inne ciekawe miejsce</option>
              </select>
            </div>
            <div class="tf-field">
              <label class="tf-label" for="tfPlaceAddr">Adres lub wskazówki dojazdu:</label>
              <input type="text" id="tfPlaceAddr" class="tf-input" placeholder="np. ul. Łucznicza 15 / róg Tarczowej" />
            </div>
          </div>

          <div class="tf-field">
            <label class="tf-label" for="tfComment">Opis / Twoja opinia:*</label>
            <textarea id="tfComment" class="tf-textarea" required rows="3" 
              placeholder="Opisz to miejsce, co zauważyłeś, co warto dodać lub co warto zmienić..."></textarea>
          </div>

          <div class="tf-field">
            <label class="tf-label" for="tfAuthor">Twoje imię / ksywka (opcjonalnie):</label>
            <input type="text" id="tfAuthor" class="tf-input" placeholder="np. Marek, Sąsiad z Łuczniczej" />
          </div>

          <div class="tf-diag-box">
            <div class="tf-diag-header">
              <span>📱 Dołączone dane diagnostyczne urządzenia:</span>
            </div>
            <div class="tf-diag-content">
              <span>Sekcja: <b>${diag.currentSection}</b></span> ·
              <span>Ekran: <b>${diag.screen}</b></span> ·
              <span>Mapa: <b>${diag.mapState}</b></span>
            </div>
          </div>

          <div class="tf-actions">
            <button type="submit" class="tf-btn primary" id="tfSubmitBtn">
              💾 Zapisz zgłoszenie
            </button>
            <button type="button" class="tf-btn secondary" onclick="TesterFeedback.copyToClipboard()">
              📋 Kopiuj do schowka
            </button>
            <button type="button" class="tf-btn mail" onclick="TesterFeedback.sendViaEmail()">
              ✉️ Wyślij e-mail
            </button>
          </div>
        </form>
      </div>
    `;

    // Wire type button listeners
    modal.querySelectorAll('.tf-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.tf-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const input = document.getElementById('tfTypeInput');
        const placeFields = document.getElementById('tfPlaceFieldsWrap');
        if (input) input.value = btn.dataset.type;
        if (placeFields) {
          placeFields.style.display = btn.dataset.type === 'place' ? 'block' : 'none';
        }
      });
    });
  }

  function submitFeedback() {
    const commentEl = document.getElementById('tfComment');
    const authorEl = document.getElementById('tfAuthor');
    const typeEl = document.getElementById('tfTypeInput');
    const placeNameEl = document.getElementById('tfPlaceName');
    const placeCatEl = document.getElementById('tfPlaceCat');
    const placeAddrEl = document.getElementById('tfPlaceAddr');

    const comment = commentEl ? commentEl.value.trim() : '';
    if (!comment) {
      if (typeof window.showToast === 'function') window.showToast('⚠️ Wpisz treść opisu / uwagi');
      return;
    }

    const type = typeEl ? typeEl.value : 'bug';
    const placeName = placeNameEl ? placeNameEl.value.trim() : '';
    const placeCat = placeCatEl ? placeCatEl.value : '';
    const placeAddr = placeAddrEl ? placeAddrEl.value.trim() : '';

    const report = {
      id: Date.now(),
      type,
      comment,
      placeName,
      placeCat,
      placeAddr,
      author: authorEl && authorEl.value.trim() ? authorEl.value.trim() : 'Mieszkaniec',
      diagnostics: getDiagnosticInfo(),
      createdAt: Date.now()
    };

    const reports = getReports();
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    // Queue in OfflineSyncService (Sprint 13 / QoL 3)
    try {
      const offlineSync = (window.__SZCZECIN_APP__ && window.__SZCZECIN_APP__.offlineSync) ||
        (window.OfflineSyncService && typeof window.OfflineSyncService.getInstance === 'function' && window.OfflineSyncService.getInstance());
      if (offlineSync && typeof offlineSync.queueAction === 'function') {
        offlineSync.queueAction('feedback', report);
      }
    } catch (err) {
      console.warn('OfflineSyncService feedback enqueue notice:', err);
    }

    if (typeof window.showToast === 'function') {
      const msg = type === 'place' 
        ? '🎉 Dziękujemy za zgłoszenie nowego miejsca! Zapisano do synchronizacji.' 
        : '🎉 Dziękujemy! Zgłoszenie zostało zapisane (zsynchronizuje się automatycznie).';
      window.showToast(msg);
    }

    closeFeedbackModal();
    return report;
  }

  function formatReportText() {
    const commentEl = document.getElementById('tfComment');
    const authorEl = document.getElementById('tfAuthor');
    const typeEl = document.getElementById('tfTypeInput');
    const placeNameEl = document.getElementById('tfPlaceName');
    const diag = getDiagnosticInfo();

    const comment = commentEl ? commentEl.value.trim() : '(brak opisu)';
    const author = authorEl && authorEl.value.trim() ? authorEl.value.trim() : 'Tester';
    const type = typeEl ? typeEl.value : 'bug';
    const placeName = placeNameEl ? placeNameEl.value.trim() : '';

    return `[Raport z przewodnika Niebuszewo Guide]\n` +
      `Autor: ${author}\n` +
      `Typ: ${type}\n` +
      (placeName ? `Proponowane miejsce: ${placeName}\n` : '') +
      `Komentarz: ${comment}\n\n` +
      `--- Diagnostyka ---\n` +
      `Sekcja: ${diag.currentSection}\n` +
      `Ekran: ${diag.screen}\n` +
      `Mapa: ${diag.mapState}\n` +
      `Przeglądarka: ${diag.userAgent}\n` +
      `Czas: ${diag.timestamp}`;
  }

  function copyToClipboard() {
    const text = formatReportText();
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => {
        if (typeof window.showToast === 'function') window.showToast('📋 Skopiowano raport do schowka!');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (typeof window.showToast === 'function') window.showToast('📋 Skopiowano raport do schowka!');
    } catch (_) {
      alert(text);
    }
    document.body.removeChild(ta);
  }

  function sendViaEmail() {
    const text = formatReportText();
    const typeEl = document.getElementById('tfTypeInput');
    const type = typeEl ? typeEl.value : 'feedback';
    const subject = encodeURIComponent(`[Niebuszewo Przewodnik] ${type.toUpperCase()}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:kontakt@szczecin.pl?subject=${subject}&body=${body}`;
  }

  return {
    open: openFeedbackModal,
    close: closeFeedbackModal,
    submit: submitFeedback,
    getReports,
    copyToClipboard,
    sendViaEmail,
    getDiagnosticInfo
  };
})();

// Expose globally
window.TesterFeedback = TesterFeedback;
window.openFeedbackModal = (type) => TesterFeedback.open(type);
window.openPlaceSubmissionModal = () => TesterFeedback.open('place');
