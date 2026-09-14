/**
 * tester-feedback.js — System Zgłaszania Uwag i Błędów dla Testerów (Beta Feedback)
 * Zbiera uwagi od znajomych i testerów, automatycznie dołączając kontekst diagnostyczny
 * (urządzenie, sekcja, koordynaty mapy, stan sieci).
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
      appVersion: '1.7.0-beta'
    };
  }

  function openFeedbackModal() {
    let modal = document.getElementById('testerFeedbackModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'testerFeedbackModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    renderModal(modal);
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

  function renderModal(modal) {
    const diag = getDiagnosticInfo();

    modal.innerHTML = `
      <div class="modal-card feedback-modal-card">
        <div class="tf-header">
          <div>
            <span class="tf-badge">🧪 PROGRAM TESTÓW BETA</span>
            <h2 class="tf-title">Zgłoś uwagę lub błąd</h2>
            <p class="tf-sub">Pomóż ulepszyć przewodnik po Niebuszewie przed oficjalną premierą</p>
          </div>
          <button class="tf-close-btn" onclick="TesterFeedback.close()" aria-label="Zamknij">✕</button>
        </div>

        <form class="tf-body" id="tfForm" onsubmit="event.preventDefault(); TesterFeedback.submit();">
          <div class="tf-field">
            <label class="tf-label">Rodzaj zgłoszenia:</label>
            <div class="tf-type-selector">
              <button type="button" class="tf-type-btn active" data-type="bug">🐛 Błąd / Usterka</button>
              <button type="button" class="tf-type-btn" data-type="idea">💡 Nowy pomysł</button>
              <button type="button" class="tf-type-btn" data-type="content">📝 Treść / Literówka</button>
              <button type="button" class="tf-type-btn" data-type="ux">✨ Wygląd / Wygoda</button>
            </div>
            <input type="hidden" id="tfTypeInput" value="bug" />
          </div>

          <div class="tf-field">
            <label class="tf-label" for="tfComment">Twoja opinia / opis sytuacji:</label>
            <textarea id="tfComment" class="tf-textarea" required rows="4" 
              placeholder="Opisz co zauważyłeś, co warto zmienić lub co Ci się podobało..."></textarea>
          </div>

          <div class="tf-field">
            <label class="tf-label" for="tfAuthor">Twoje imię / ksywka (opcjonalnie):</label>
            <input type="text" id="tfAuthor" class="tf-input" placeholder="np. Marek, Kasia" />
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
        if (input) input.value = btn.dataset.type;
      });
    });
  }

  function submitFeedback() {
    const commentEl = document.getElementById('tfComment');
    const authorEl = document.getElementById('tfAuthor');
    const typeEl = document.getElementById('tfTypeInput');

    const comment = commentEl ? commentEl.value.trim() : '';
    if (!comment) {
      if (typeof window.showToast === 'function') window.showToast('⚠️ Wpisz treść uwagi');
      return;
    }

    const report = {
      id: Date.now(),
      type: typeEl ? typeEl.value : 'bug',
      comment,
      author: authorEl && authorEl.value.trim() ? authorEl.value.trim() : 'Tester',
      diagnostics: getDiagnosticInfo()
    };

    const reports = getReports();
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    if (typeof window.showToast === 'function') {
      window.showToast('🎉 Dziękujemy! Zgłoszenie zostało zapisane.');
    }

    closeFeedbackModal();
    return report;
  }

  function formatReportText() {
    const commentEl = document.getElementById('tfComment');
    const authorEl = document.getElementById('tfAuthor');
    const typeEl = document.getElementById('tfTypeInput');
    const diag = getDiagnosticInfo();

    const comment = commentEl ? commentEl.value.trim() : '(brak opisu)';
    const author = authorEl && authorEl.value.trim() ? authorEl.value.trim() : 'Tester';
    const type = typeEl ? typeEl.value : 'bug';

    return `[Raport z testów Niebuszewo Guide]\n` +
      `Autor: ${author}\n` +
      `Typ: ${type}\n` +
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
    if (navigator.clipboard) {
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
    const subject = encodeURIComponent(`[Niebuszewo Beta Feedback] ${type.toUpperCase()}`);
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
