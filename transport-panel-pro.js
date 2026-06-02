/**
 * transport-panel-pro.js — Professional Transport Panel UI
 * Shows departures side-by-side (89, 69, etc.) like senior engineer
 * Best practices: component-based, responsive, accessible, performant
 */

'use strict';

const TransportPanelPro = (() => {
  const config = {
    updateInterval: 60000,      // 1 minute
    maxDepartures: 5,           // Show top 5
    panelId: 'transportPanelPro',
    animationDuration: 300,
    isMobile: false
  };

  let currentDepartures = [];
  let updateTimer = null;

  // ===== COMPONENT: DEPARTURE CARD =====
  class DepartureCard {
    constructor(departure) {
      this.data = departure;
      this.element = null;
    }

    render() {
      const { line, dest, minsLeft, type, color } = this.data;
      
      const card = document.createElement('div');
      card.className = 'departure-card';
      card.setAttribute('role', 'status');
      card.setAttribute('aria-label', `${type} ${line} do ${dest}, odjazd za ${minsLeft} minut`);

      // Determine status
      const isLive = minsLeft <= 0;
      const isUrgent = minsLeft > 0 && minsLeft <= 2;
      const status = isLive ? 'now' : isUrgent ? 'urgent' : 'normal';

      card.dataset.status = status;
      card.dataset.line = line;

      // Color coding
      const bgColor = color || 'var(--surface)';

      card.innerHTML = `
        <div class="dc-header" style="background: ${bgColor}">
          <div class="dc-line">${line}</div>
          <div class="dc-type">${type === 'tram' ? '🚊' : '🚌'}</div>
        </div>
        <div class="dc-body">
          <div class="dc-dest">${dest}</div>
          <div class="dc-time-group">
            <div class="dc-label">Odjazd:</div>
            <div class="dc-time ${status === 'now' ? 'dc-time-now' : status === 'urgent' ? 'dc-time-urgent' : ''}">
              ${isLive ? '▶️ TERAZ' : `${minsLeft} min`}
            </div>
          </div>
        </div>
      `;

      this.element = card;
      return card;
    }
  }

  // ===== COMPONENT: TRANSPORT PANEL =====
  class TransportPanel {
    constructor(departures) {
      this.departures = departures || [];
      this.element = null;
    }

    render() {
      const panel = document.createElement('div');
      panel.id = config.panelId;
      panel.className = 'transport-panel-pro';
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-label', 'Panel transportu publicznego');

      // Header
      const header = document.createElement('div');
      header.className = 'tp-header';
      header.innerHTML = `
        <div class="tp-title">
          <span class="tp-icon">🚌</span>
          <span>Odjazdy — Łucznicza</span>
        </div>
        <div class="tp-subtitle">
          <span class="live-dot"></span>
          <span>Aktualne o</span>
          <span id="tpTime" class="tp-time">--:--</span>
        </div>
      `;

      // Content grid
      const content = document.createElement('div');
      content.className = 'tp-content';
      content.setAttribute('role', 'grid');

      // Render departure cards
      this.departures.slice(0, config.maxDepartures).forEach(dep => {
        const card = new DepartureCard(dep);
        content.appendChild(card.render());
      });

      // If no departures
      if (this.departures.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'tp-empty';
        empty.textContent = 'Brak dostępnych odjazdów';
        content.appendChild(empty);
      }

      // Footer with refresh
      const footer = document.createElement('div');
      footer.className = 'tp-footer';
      footer.innerHTML = `
        <button id="tpRefresh" class="tp-refresh-btn" aria-label="Odśwież odjazdy">
          🔄 Odśwież
        </button>
        <div class="tp-data-source">Źródło: ZDiTM Szczecin</div>
      `;

      panel.appendChild(header);
      panel.appendChild(content);
      panel.appendChild(footer);

      this.element = panel;
      return panel;
    }

    attachListeners() {
      const refreshBtn = this.element?.querySelector('#tpRefresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          refreshBtn.setAttribute('disabled', 'disabled');
          refreshBtn.innerHTML = '⏳ Ładowanie...';
          
          // Trigger refresh
          if (typeof generateTransportDepartures === 'function') {
            await generateTransportDepartures();
          }
          
          // Update time
          updateTime();
          
          refreshBtn.removeAttribute('disabled');
          refreshBtn.innerHTML = '🔄 Odśwież';
        });
      }
    }
  }

  // ===== INJECT PROFESSIONAL STYLES =====
  function injectStyles() {
    if (document.getElementById('transportPanelProStyle')) return;

    const style = document.createElement('style');
    style.id = 'transportPanelProStyle';
    style.textContent = `
      /* Transport Panel Container */
      .transport-panel-pro {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideUp 0.4s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Header */
      .tp-header {
        padding: 16px;
        background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%);
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tp-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 600;
        color: var(--text);
      }

      .tp-icon {
        font-size: 20px;
      }

      .tp-subtitle {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text2);
      }

      .tp-time {
        font-weight: 600;
        color: var(--accent);
        font-family: 'Courier New', monospace;
      }

      .live-dot {
        width: 8px;
        height: 8px;
        background: #ff4444;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Content Grid */
      .tp-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        padding: 16px;
      }

      /* Departure Card */
      .departure-card {
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .departure-card:hover {
        border-color: var(--accent);
        box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
        transform: translateY(-2px);
      }

      /* Status-based styling */
      .departure-card[data-status="now"] {
        border-color: #ff4444;
        background: rgba(255, 68, 68, 0.05);
      }

      .departure-card[data-status="urgent"] {
        border-color: #ffa500;
        background: rgba(255, 165, 0, 0.05);
      }

      /* Card Header (Line Number) */
      .dc-header {
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        font-weight: 600;
      }

      .dc-line {
        font-size: 20px;
        font-weight: 700;
      }

      .dc-type {
        font-size: 16px;
      }

      /* Card Body */
      .dc-body {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .dc-dest {
        font-size: 13px;
        font-weight: 600;
        color: var(--text);
        line-height: 1.3;
        min-height: 26px;
      }

      .dc-time-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        border-top: 1px solid var(--border);
      }

      .dc-label {
        font-size: 10px;
        color: var(--text3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .dc-time {
        font-size: 14px;
        font-weight: 700;
        color: var(--accent);
        font-family: 'Courier New', monospace;
      }

      .dc-time-now {
        color: #ff4444;
        font-size: 15px;
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%, 49%, 100% { opacity: 1; }
        50%, 99% { opacity: 0.6; }
      }

      .dc-time-urgent {
        color: #ffa500;
      }

      /* Empty state */
      .tp-empty {
        grid-column: 1 / -1;
        padding: 40px 20px;
        text-align: center;
        color: var(--text2);
        font-size: 14px;
      }

      /* Footer */
      .tp-footer {
        padding: 12px 16px;
        border-top: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg2);
      }

      .tp-refresh-btn {
        padding: 8px 12px;
        background: var(--accent);
        border: none;
        border-radius: 6px;
        color: white;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tp-refresh-btn:hover:not([disabled]) {
        background: var(--accent2);
        transform: scale(1.05);
      }

      .tp-refresh-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .tp-data-source {
        font-size: 11px;
        color: var(--text3);
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .transport-panel-pro {
          border-radius: 12px;
          margin: 12px;
        }

        .tp-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .tp-content {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          padding: 12px;
        }

        .dc-header {
          padding: 10px;
        }

        .dc-body {
          padding: 10px;
          gap: 6px;
        }

        .dc-dest {
          font-size: 12px;
        }

        .tp-footer {
          flex-direction: column;
          gap: 8px;
        }

        .tp-refresh-btn {
          width: 100%;
        }
      }

      /* Accessibility */
      .tp-refresh-btn:focus-visible {
        outline: 3px solid var(--accent);
        outline-offset: 2px;
      }

      .departure-card:focus-visible {
        outline: 3px solid var(--accent);
        outline-offset: 2px;
      }
    `;

    document.head.appendChild(style);
    console.log('🎨 Transport panel pro styles injected');
  }

  // ===== MOUNT PANEL =====
  function mountPanel(container, departures) {
    config.isMobile = window.innerWidth < 768;

    // Clear existing
    const existing = document.getElementById(config.panelId);
    if (existing) existing.remove();

    // Create and mount
    const panel = new TransportPanel(departures);
    const panelElement = panel.render();
    
    container.appendChild(panelElement);
    panel.attachListeners();

    updateTime();
    console.log('📍 Transport panel mounted');
  }

  // ===== UPDATE TIME DISPLAY =====
  function updateTime() {
    const timeEl = document.getElementById('tpTime');
    if (!timeEl) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${mins}`;
  }

  // ===== PUBLIC API =====
  function updateDepartures(departures) {
    currentDepartures = departures || [];
    
    // Find or create container
    let container = document.getElementById('transportPanelContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'transportPanelContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        z-index: 45;
        pointer-events: auto;
      `;
      document.body.appendChild(container);
    }

    mountPanel(container, currentDepartures);
  }

  // ===== INITIALIZATION =====
  function init() {
    console.log('🚌 Transport panel pro initializing...');

    injectStyles();

    // Update time every minute
    setInterval(updateTime, 60000);

    // Listen for departures updates
    window.addEventListener('departures-updated', (e) => {
      if (e.detail?.departures) {
        updateDepartures(e.detail.departures);
      }
    });

    console.log('✅ Transport panel pro ready');
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  return {
    init,
    updateDepartures,
    DepartureCard,
    TransportPanel
  };
})();

window.TransportPanelPro = TransportPanelPro;
