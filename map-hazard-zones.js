/**
 * map-hazard-zones.js — Safety hazard visualization
 * Accident hotspots, construction zones, dangerous intersections, etc.
 */
'use strict';

const MapHazardZones = (() => {
  const cfg = {
    enabled: false,
    layer: null,
    showType: 'all' // all | accidents | construction | traffic | utilities
  };

  // Hazard data for the area
  const hazards = [
    {
      id: 1,
      type: 'accidents',
      severity: 'high',
      name: 'Skrzyżowanie ul. Łuczniczej i Tarczowej',
      location: [53.4548, 14.5519],
      radius: 80,
      incidents: 12,
      lastIncident: '2 dni temu',
      description: 'Kolizja boczna, utrudniony ruch',
      emoji: '⚠️'
    },
    {
      id: 2,
      type: 'construction',
      severity: 'medium',
      name: 'Roboty drogowe: ul. Tarczowa',
      location: [53.4537, 14.5636],
      radius: 120,
      until: 'do 30 czerwca',
      description: 'Utrudniony przejazd, brak chodnika',
      emoji: '🚧'
    },
    {
      id: 3,
      type: 'traffic',
      severity: 'medium',
      name: 'Węzeł komunikacyjny',
      location: [53.4520, 14.5510],
      radius: 100,
      avgSpeed: '15 km/h',
      peakHours: '7:30-9:00, 16:00-18:00',
      description: 'Duży ruch w godzinach szczytu',
      emoji: '🚗'
    },
    {
      id: 4,
      type: 'utilities',
      severity: 'low',
      name: 'Prace konserwacyjne: przewody',
      location: [53.4505, 14.5552],
      radius: 60,
      startDate: '5 czerwca',
      description: 'Mogą być przerwy w dostawie',
      emoji: '⚡'
    },
    {
      id: 5,
      type: 'accidents',
      severity: 'medium',
      name: 'Punkt zdań: skrzyżowanie Bandurskiego',
      location: [53.4537, 14.5636],
      radius: 100,
      incidents: 7,
      description: 'Wypadki rowerowe i piesze',
      emoji: '🚴'
    },
    {
      id: 6,
      type: 'traffic',
      severity: 'low',
      name: 'Obszar szkolny - zwolnij',
      location: [53.4505, 14.5552],
      radius: 150,
      avgSpeed: '20 km/h',
      description: 'Strefa przy szkole - ostrożnie!',
      emoji: '🏫'
    }
  ];

  function init(map) {
    cfg.map = map;
    console.log('⚠️ Inicjalizacja stref zagrożenia...');
  }

  function toggle() {
    if (cfg.enabled) {
      disable();
    } else {
      enable();
    }
  }

  function enable() {
    const map = cfg.map;
    if (!map) return;

    cfg.enabled = true;
    drawHazards();
    showToast('⚠️ Strefy niebezpieczeństwa włączone');
  }

  function disable() {
    const map = cfg.map;
    if (!map || !cfg.layer) return;

    map.removeLayer(cfg.layer);
    cfg.layer = null;
    cfg.enabled = false;
    showToast('⚠️ Strefy niebezpieczeństwa wyłączone');
  }

  function drawHazards() {
    const map = cfg.map;
    const group = L.layerGroup();

    const filtered = hazards.filter(h => cfg.showType === 'all' || h.type === cfg.showType);

    filtered.forEach(hazard => {
      const color = getSeverityColor(hazard.severity);
      const icon = getHazardIcon(hazard.type);

      // Draw hazard circle
      const circle = L.circle(hazard.location, {
        radius: hazard.radius,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.2,
        dashArray: '6, 4',
        interactive: true
      });

      // Detailed popup
      const popupContent = buildHazardPopup(hazard);
      circle.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'hazard-popup-wrapper'
      });

      // Add marker with icon
      const marker = L.marker(hazard.location, {
        icon: L.divIcon({
          html: `<div class="hazard-marker" data-severity="${hazard.severity}">${hazard.emoji}</div>`,
          className: `hazard-marker-${hazard.type}`,
          iconSize: null
        })
      });

      group.addLayer(circle);
      group.addLayer(marker);
    });

    // Add warning banner if high-severity hazards
    const highSeverity = filtered.filter(h => h.severity === 'high');
    if (highSeverity.length > 0) {
      showToast(`⚠️ UWAGA! ${highSeverity.length} stref wysokiego zagrożenia na mapie`, 'warning');
    }

    group.addTo(map);
    cfg.layer = group;
  }

  function buildHazardPopup(hazard) {
    let details = ``;

    switch (hazard.type) {
      case 'accidents':
        details = `
          <div class="hz-stat">📊 Liczba incydentów: <strong>${hazard.incidents}</strong></div>
          <div class="hz-stat">📅 Ostatni: <strong>${hazard.lastIncident}</strong></div>
        `;
        break;
      case 'construction':
        details = `
          <div class="hz-stat">📅 Koniec prac: <strong>${hazard.until}</strong></div>
          <div class="hz-warning">⚠️ Unikaj tego obszaru lub jedź ostrożnie</div>
        `;
        break;
      case 'traffic':
        details = `
          <div class="hz-stat">🚗 Średnia prędkość: <strong>${hazard.avgSpeed}</strong></div>
          <div class="hz-stat">⏰ Szczyty ruchu: <strong>${hazard.peakHours}</strong></div>
        `;
        break;
      case 'utilities':
        details = `
          <div class="hz-stat">📅 Data rozpoczęcia: <strong>${hazard.startDate}</strong></div>
          <div class="hz-warning">ℹ️ Mogą być przerwy w dostawie</div>
        `;
        break;
    }

    return `
      <div class="hazard-popup">
        <div class="hz-header">
          <span>${hazard.emoji}</span>
          <strong>${hazard.name}</strong>
        </div>
        <div class="hz-body">
          <div class="hz-severity ${hazard.severity}">
            Poważność: ${hazard.severity === 'high' ? '🔴 Wysoka' : hazard.severity === 'medium' ? '🟠 Średnia' : '🟡 Niska'}
          </div>
          <div class="hz-description">${hazard.description}</div>
          ${details}
        </div>
        <div class="hz-footer">
          <button class="hz-btn" onclick="MapHazardZones.reportHazard(${hazard.id})">
            Zgłoś problem 📢
          </button>
        </div>
      </div>
    `;
  }

  function getSeverityColor(severity) {
    switch (severity) {
      case 'high': return '#ef4444';    // Red
      case 'medium': return '#f97316';  // Orange
      case 'low': return '#eab308';     // Yellow
      default: return '#999';
    }
  }

  function getHazardIcon(type) {
    const icons = {
      accidents: '⚠️',
      construction: '🚧',
      traffic: '🚗',
      utilities: '⚡'
    };
    return icons[type] || '📍';
  }

  function reportHazard(hazardId) {
    const hazard = hazards.find(h => h.id === hazardId);
    if (!hazard) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="modal-content">
          <h3>📢 Zgłoś zagrożenie</h3>
          <p>Pomagasz nam robić mapę bezpieczniejszą!</p>
          <textarea id="hazardReport" placeholder="Opisz problem..." style="width:100%; height:100px; padding:8px; border:1px solid var(--border); border-radius:6px; margin:10px 0; font-family:inherit;"></textarea>
          <button onclick="MapHazardZones.submitHazardReport(${hazardId})" style="width:100%; padding:10px; background:var(--accent); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600;">
            Wyślij zgłoszenie
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  function submitHazardReport(hazardId) {
    const textarea = document.getElementById('hazardReport');
    const report = textarea?.value;

    if (!report || report.trim().length === 0) {
      showToast('⚠️ Proszę opisać problem');
      return;
    }

    // Save report (would be sent to server in production)
    try {
      const reports = JSON.parse(localStorage.getItem('hazard_reports') || '[]');
      reports.push({
        hazardId,
        report,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('hazard_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Błąd zapisywania zgłoszenia:', e);
    }

    document.querySelector('.modal-overlay')?.remove();
    showToast('✅ Dziękujemy za zgłoszenie! Twoja opinia pomaga nam poprawiać mapę.');
  }

  function getNearbyHazards(center, radiusKm = 0.5) {
    return hazards.filter(h => {
      const dist = Math.sqrt(
        Math.pow(h.location[0] - center[0], 2) +
        Math.pow(h.location[1] - center[1], 2)
      ) * 111; // Rough conversion to km
      return dist <= radiusKm;
    });
  }

  function setFilter(filterType) {
    cfg.showType = filterType;
    if (cfg.enabled) {
      if (cfg.layer) cfg.map.removeLayer(cfg.layer);
      drawHazards();
    }
  }

  function getStatistics() {
    return {
      totalHazards: hazards.length,
      highSeverity: hazards.filter(h => h.severity === 'high').length,
      byType: {
        accidents: hazards.filter(h => h.type === 'accidents').length,
        construction: hazards.filter(h => h.type === 'construction').length,
        traffic: hazards.filter(h => h.type === 'traffic').length,
        utilities: hazards.filter(h => h.type === 'utilities').length
      }
    };
  }

  // Public API
  return {
    init,
    toggle,
    enable,
    disable,
    reportHazard,
    submitHazardReport,
    setFilter,
    getNearbyHazards,
    getStatistics,
    getHazards: () => hazards
  };
})();

window.MapHazardZones = MapHazardZones;
