/**
 * gryfus-onboarding.js — Mini-Onboarding Gryfusa Szczecińskiego (Sprint 14 / QoL 4)
 * 3-etapowy, nienachalny przewodnik wprowadzający dla nowych użytkowników:
 * Etap 1: Ambient Status HUD (pogoda, jakość powietrza GIOS, tramwaje live)
 * Etap 2: Miejsca, Filtry i Trasy (82 punkty POI, trasy GPX)
 * Etap 3: Pogoń Szczecin & Niebuszewo Quest (Centrum kibica, śpiewnik, gra miejska)
 */
'use strict';

const GryfusOnboarding = (() => {
  const STORAGE_KEY = 'niebuszewo_onboarding_done';
  let currentStep = 1;
  const TOTAL_STEPS = 3;

  const STEPS = [
    {
      step: 1,
      icon: '🦅',
      badge: 'ETAP 1 / 3 · POWITANIE',
      title: 'Witaj na Niebuszewie!',
      body: 'Cześć! Jestem <b>Gryfus</b> — Twój szczeciński asystent. Na górze ekranu masz kapsułę <b>Ambient Status HUD</b>: sprawdza pogodę, czystość powietrza (GIOS) oraz odjazdy tramwajów ZDiTM na żywo.',
      highlightEl: '#ambientStatusCapsule',
      tip: 'Stuknij kapsułę, aby zobaczyć szczegóły mikroklimatu!'
    },
    {
      step: 2,
      icon: '🗺️',
      badge: 'ETAP 2 / 3 · EKSPLORACJA',
      title: '82 Miejsca i Trasy Rekreacyjne',
      body: 'Przeglądaj kawiarnie, puby, zieleń i rzemieślników. Sprawdzaj status godzin otwarcia 🟢🔴, kalkuluj kalorie i pobieraj pliki tras <b>GPX offline</b> do Garmina lub Komoot.',
      highlightEl: '#placesFilterBar, .quick-filter-chips',
      tip: 'W menu znajdziesz także trasy spacerowe i ścieżki Bike_S!'
    },
    {
      step: 3,
      icon: '⚓',
      badge: 'ETAP 3 / 3 · DUMA POMORZA',
      title: 'Fan Hub Pogoni & Gra Miejska',
      body: 'Dla kibiców: <b>Centrum Kibica Dumy Pomorza</b> ze śpiewnikiem audio, terminarzem i dojazdem na Stadion Krygiera. A na spacerze uruchom <b>Grę Miejską Niebuszewo Quest</b> i zbieraj punkty EXP!',
      highlightEl: '#section-pogon, [data-action="pogon"]',
      tip: 'Możesz wrócić do tego samouczka w dowolnej chwili z menu.'
    }
  ];

  function isDone() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function markDone() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  }

  function start(force = false) {
    if (!force && isDone()) return;
    currentStep = 1;
    renderCard();
  }

  function next() {
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      renderCard();
    } else {
      finish();
    }
  }

  function prev() {
    if (currentStep > 1) {
      currentStep--;
      renderCard();
    }
  }

  function skip() {
    markDone();
    removeCard();
    if (typeof showToast === 'function') {
      showToast('🦅 Wprowadzenie Gryfusa możesz włączyć w każdej chwili z menu.');
    }
  }

  function finish() {
    markDone();
    removeCard();
    if (typeof showToast === 'function') {
      showToast('🦅 Gryfus: Udanej wędrówki po Niebuszewie!');
    }
  }

  function removeCard() {
    const existing = document.getElementById('gryfusOnboardingCard');
    if (existing) {
      existing.classList.remove('visible');
      setTimeout(() => existing.remove(), 350);
    }
    // Remove any highlights
    document.querySelectorAll('.onboarding-highlight-pulse').forEach(el => {
      el.classList.remove('onboarding-highlight-pulse');
    });
  }

  function renderCard() {
    let container = document.getElementById('gryfusOnboardingCard');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gryfusOnboardingCard';
      container.className = 'gryfus-onboarding-card';
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-label', 'Przewodnik wprowadzający Gryfusa');
      document.body.appendChild(container);
    }

    const data = STEPS[currentStep - 1];

    // Manage highlights
    document.querySelectorAll('.onboarding-highlight-pulse').forEach(el => {
      el.classList.remove('onboarding-highlight-pulse');
    });
    if (data.highlightEl) {
      try {
        const target = document.querySelector(data.highlightEl);
        if (target) target.classList.add('onboarding-highlight-pulse');
      } catch {}
    }

    container.innerHTML = `
      <div class="goc-inner">
        <div class="goc-header">
          <div class="goc-avatar-wrap">
            <span class="goc-avatar">${data.icon}</span>
            <div class="goc-crest-aura"></div>
          </div>
          <div class="goc-meta">
            <span class="goc-badge">${data.badge}</span>
            <h3 class="goc-title">${data.title}</h3>
          </div>
          <button class="goc-close-btn" onclick="GryfusOnboarding.skip()" aria-label="Pomiń wprowadzenie">✕</button>
        </div>

        <div class="goc-body">
          <p class="goc-text">${data.body}</p>
          ${data.tip ? `
            <div class="goc-tip">
              <span class="goc-tip-icon">💡</span>
              <span class="goc-tip-text">${data.tip}</span>
            </div>
          ` : ''}
        </div>

        <div class="goc-footer">
          <div class="goc-progress">
            ${STEPS.map((s, idx) => `
              <span class="goc-dot ${idx + 1 === currentStep ? 'active' : (idx + 1 < currentStep ? 'passed' : '')}"></span>
            `).join('')}
          </div>

          <div class="goc-actions">
            ${currentStep > 1 ? `
              <button class="goc-btn secondary" onclick="GryfusOnboarding.prev()">
                ← Wstecz
              </button>
            ` : `
              <button class="goc-btn text" onclick="GryfusOnboarding.skip()">
                Pomiń
              </button>
            `}

            ${currentStep < TOTAL_STEPS ? `
              <button class="goc-btn primary" onclick="GryfusOnboarding.next()">
                Dalej →
              </button>
            ` : `
              <button class="goc-btn primary start" onclick="GryfusOnboarding.finish()">
                🚀 Rozpocznij zwiedzanie!
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      container.classList.add('visible');
    });
  }

  return {
    start,
    next,
    prev,
    skip,
    finish,
    isDone,
    getCurrentStep: () => currentStep,
    TOTAL_STEPS
  };
})();

// Expose globally
window.GryfusOnboarding = GryfusOnboarding;
