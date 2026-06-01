/**
 * quick-reference.js — Quick reference guide & helpful tips for Szczecin/Łucznicza
 * Shows helpful information cards with tips, warnings, and useful facts
 */
'use strict';

const QuickReference = (() => {
  
  const tips = [
    {
      category: 'transport',
      emoji: '🚌',
      title: 'Szybkie przejazdy',
      text: 'Tramwaj nr 3 to najszybsza opcja do centrum. Aut obusowy nr 69 jeździ nocą.',
      time: 'Poniedziałek–Piątek'
    },
    {
      category: 'food',
      emoji: '🍽️',
      title: 'Gdzie zjeść',
      text: 'Bar Mleczny "Strzała" - tradycyjne dania. Otwarte od 1980 roku!',
      time: '7:00–19:00'
    },
    {
      category: 'sport',
      emoji: '💪',
      title: 'Aktywność na świeżym powietrzu',
      text: 'Siłownia plenerowa przy Parku Tarczowa - bezpłatna 24/7',
      time: 'Całą dobę'
    },
    {
      category: 'park',
      emoji: '🌳',
      title: 'Spacery w przyrodzie',
      text: 'Park Niebuszewo - idealne miejsce do spacerów z pieskami',
      time: 'Cały rok'
    },
    {
      category: 'shop',
      emoji: '🛒',
      title: 'Shopping',
      text: 'Małe sklepy przy Łuczniczej otwarte 7 dni w tygodniu',
      time: '8:00–22:00'
    },
    {
      category: 'service',
      emoji: '⚕️',
      title: 'Zdravotnictví',
      text: 'Przychodnia POZ dostępna z rejestracją online. Dyżur 24/7',
      time: 'Zawsze dostępne'
    }
  ];

  const warnings = [
    {
      emoji: '⚠️',
      title: 'Jazda na rowerze',
      text: 'Noś kamizelkę odblaskową. Ścieżki rowerowe mogą być mokre po deszczu.'
    },
    {
      emoji: '🌡️',
      title: 'Zima',
      text: 'Czara i schody mogą być ślizgawe. Używaj antypoślizgowych podeszew.'
    },
    {
      emoji: '📱',
      title: 'Bezpieczeństwo',
      text: 'Zawsze miej przy sobie telefon. WiFi dostępny w wielu miejscach.'
    },
    {
      emoji: '🚗',
      title: 'Parkowanie',
      text: 'Strefy parkowania są ograniczone. Patrz na znaki drogowe.'
    }
  ];

  const funFacts = [
    {
      emoji: '🏹',
      fact: 'Nazwa "Łucznicza" pochodzi od starego sportu - łucznictwa popularnego w XVI wieku'
    },
    {
      emoji: '🏗️',
      fact: '334 budynki 3D w naszej aplikacji to rzeczywiste dane z OpenStreetMap'
    },
    {
      emoji: '🚃',
      fact: 'Tramwaj nr 3 kursuje przez Łuczniczą od ponad 50 lat'
    },
    {
      emoji: '🌍',
      fact: 'Szczecin jest ostatnią aglomeracją miejską na zachodzie Polski'
    },
    {
      emoji: '📊',
      fact: 'W aplikacji jest 50+ miejsc kategoryzowanych wg typów'
    },
    {
      emoji: '🗺️',
      fact: 'Mapa obsługuje 5 różnych stylów kafelków (OSM, CARTO, Satelita)'
    }
  ];

  function showQuickTip() {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const card = createTipCard(tip);
    showNotification(card);
  }

  function showWarning(type) {
    const warning = warnings.find(w => w.title.toLowerCase().includes(type.toLowerCase())) 
                   || warnings[Math.floor(Math.random() * warnings.length)];
    const card = createWarningCard(warning);
    showNotification(card, 'warning');
  }

  function showFunFact() {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    showToast(`${fact.emoji} ${fact.fact}`);
  }

  function createTipCard(tip) {
    return `
      <div class="qr-card qr-tip">
        <div class="qr-header" style="border-left-color: var(--${tip.category})">
          <span class="qr-emoji">${tip.emoji}</span>
          <div>
            <div class="qr-title">${tip.title}</div>
            <div class="qr-time">⏰ ${tip.time}</div>
          </div>
        </div>
        <div class="qr-body">
          <p>${tip.text}</p>
        </div>
      </div>
    `;
  }

  function createWarningCard(warning) {
    return `
      <div class="qr-card qr-warning">
        <div class="qr-header" style="border-left-color: #ff9800">
          <span class="qr-emoji">${warning.emoji}</span>
          <div class="qr-title">${warning.title}</div>
        </div>
        <div class="qr-body">
          <p>${warning.text}</p>
        </div>
      </div>
    `;
  }

  function showNotification(html, type = 'tip') {
    let container = document.getElementById('quickRefContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'quickRefContainer';
      container.className = 'quick-ref-container';
      document.body.appendChild(container);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'qr-notification';
    wrapper.innerHTML = html;

    container.appendChild(wrapper);

    setTimeout(() => {
      wrapper.classList.add('visible');
    }, 50);

    setTimeout(() => {
      wrapper.classList.remove('visible');
      setTimeout(() => wrapper.remove(), 300);
    }, 5000);
  }

  // Info panel in sidebar
  function createInfoPanel() {
    return `
      <div class="quick-reference-panel">
        <div class="qrp-header">
          <h4>💡 Szybkie Porady</h4>
          <button onclick="QuickReference.showQuickTip()" class="qrp-btn" title="Pokaż radę">🔄</button>
        </div>
        <div class="qrp-tips">
          ${tips.slice(0, 3).map(t => `
            <div class="qrp-tip">
              <span>${t.emoji}</span>
              <div>
                <strong>${t.title}</strong>
                <small>${t.text.substring(0, 40)}...</small>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="qrp-more-btn" onclick="QuickReference.showQuickTip()">
          Pokaż więcej 🎲
        </button>
      </div>
    `;
  }

  // Public API
  return {
    showQuickTip,
    showWarning,
    showFunFact,
    createInfoPanel,
    getTips: () => tips,
    getWarnings: () => warnings,
    getFunFacts: () => funFacts
  };
})();

// Expose to window
window.QuickReference = QuickReference;

// Show a tip every 10 minutes (optional)
document.addEventListener('DOMContentLoaded', () => {
  // Show initial fun fact after app loads
  setTimeout(() => {
    QuickReference.showFunFact();
  }, 3000);
});
