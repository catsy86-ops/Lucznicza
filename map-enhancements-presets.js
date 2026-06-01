/**
 * map-enhancements-presets.js — Quick module presets/combinations
 * Pre-configured bundles for different use cases
 * One-click activation of module combinations
 */
'use strict';

const MapEnhancementsPresets = (() => {
  const cfg = {
    presets: {
      'nightMode': {
        name: '🌙 Tryb Nocny',
        description: 'Perfekcyjnie dla nocnych spacerów',
        emoji: '🌙',
        modules: ['weather', 'darkMode', 'notifications'],
        icon: '🌙',
        color: '#6c63ff'
      },
      'adventure': {
        name: '🥾 Przygoda',
        description: 'Dla turystów i podróżników',
        emoji: '🥾',
        modules: ['elevation', 'routes', 'hazards', 'history'],
        icon: '⛰️',
        color: '#ff6584'
      },
      'urban': {
        name: '🏙️ Odkrywca Miasta',
        description: 'Najlepsze miejsca w mieście',
        emoji: '🏙️',
        modules: ['ratings', 'drawing', 'history', 'notifications'],
        icon: '🏙️',
        color: '#43e97b'
      },
      'safety': {
        name: '⚠️ Bezpieczeństwo',
        description: 'Unikaj niebezpiecznych miejsc',
        emoji: '⚠️',
        modules: ['hazards', 'notifications', 'darkMode'],
        icon: '🛡️',
        color: '#ffd93d'
      },
      'weather': {
        name: '🌤️ Obserwator Pogody',
        description: 'Śledź zmiany pogody',
        emoji: '🌤️',
        modules: ['weather', 'elevation', 'notifications'],
        icon: '🌤️',
        color: '#4ecdc4'
      },
      'explorer': {
        name: '🔍 Eksplorator',
        description: 'Wszystko co potrzebujesz',
        emoji: '🔍',
        modules: ['elevation', 'weather', 'history', 'ratings', 'drawing'],
        icon: '🔍',
        color: '#a29bfe'
      },
      'minimal': {
        name: '⚡ Minimalistyczny',
        description: 'Szybkie i lekkie',
        emoji: '⚡',
        modules: ['history', 'drawing'],
        icon: '⚡',
        color: '#fd79a8'
      },
      'none': {
        name: '⭕ Czysta Mapa',
        description: 'Wyłącz wszystkie moduły',
        emoji: '⭕',
        modules: [],
        icon: '⭕',
        color: '#95a5a6'
      }
    },
    currentPreset: null,
    presetsPanel: null
  };

  /**
   * Initialize presets system
   */
  function init() {
    console.log('🎯 Inicjalizacja systemu presetów...');
    createPresetsPanel();
    loadLastPreset();
    console.log('✅ System presetów załadowany');
  }

  /**
   * Create presets panel UI
   */
  function createPresetsPanel() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'mapEnhancementsPresetsPanel';
    panel.className = 'enhancements-presets-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Presets szybkiego dostępu');

    // Title
    const title = document.createElement('div');
    title.className = 'presets-title';
    title.innerHTML = '<span>⚡ Szybkie Zestawy</span>';
    panel.appendChild(title);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'presets-buttons';
    buttonsContainer.id = 'presetsButtonsContainer';

    // Create button for each preset
    Object.entries(cfg.presets).forEach(([key, preset]) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.id = `preset-${key}`;
      btn.title = preset.description;
      btn.setAttribute('data-preset', key);
      btn.innerHTML = `
        <span class="preset-emoji">${preset.emoji}</span>
        <span class="preset-name">${preset.name}</span>
        <span class="preset-count">${preset.modules.length}</span>
      `;
      btn.style.setProperty('--preset-color', preset.color);
      btn.addEventListener('click', () => activatePreset(key));

      buttonsContainer.appendChild(btn);
    });

    panel.appendChild(buttonsContainer);

    // Info section
    const info = document.createElement('div');
    info.className = 'presets-info';
    info.id = 'presetsInfo';
    info.innerHTML = '<p>Kliknij preset aby go aktywować</p>';
    panel.appendChild(info);

    mapContainer.appendChild(panel);
    cfg.presetsPanel = panel;

    console.log('✅ Panel presetów utworzony');
  }

  /**
   * Activate a preset (enable/disable modules)
   */
  function activatePreset(presetKey) {
    const preset = cfg.presets[presetKey];
    if (!preset) return;

    console.log(`🎯 Aktywowanie presetu: ${preset.name}`);

    // Disable all modules first
    Object.keys(cfg.presets).forEach(key => {
      if (cfg.presets[key].modules) {
        cfg.presets[key].modules.forEach(moduleKey => {
          if (typeof MapEnhancementsUI !== 'undefined') {
            MapEnhancementsUI.disableModule(moduleKey);
          }
        });
      }
    });

    // Enable modules in this preset
    preset.modules.forEach(moduleKey => {
      if (typeof MapEnhancementsUI !== 'undefined') {
        MapEnhancementsUI.enableModule(moduleKey);
      }
    });

    // Update UI
    updatePresetsUI(presetKey);
    updatePresetsInfo(preset);
    saveCurrentPreset(presetKey);

    // Show toast
    if (typeof showToast === 'function') {
      showToast(`${preset.emoji} ${preset.name} aktywowany`);
    }

    cfg.currentPreset = presetKey;
  }

  /**
   * Update presets UI (highlight active preset)
   */
  function updatePresetsUI(activeKey) {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(btn => {
      const key = btn.dataset.preset;
      if (key === activeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Update info section
   */
  function updatePresetsInfo(preset) {
    const info = document.getElementById('presetsInfo');
    if (!info) return;

    const moduleNames = preset.modules
      .map(key => {
        const moduleBtn = document.getElementById(`enh-btn-${key}`);
        return moduleBtn ? moduleBtn.textContent.trim() : key;
      })
      .join(', ');

    info.innerHTML = `
      <div class="preset-active">
        <span class="preset-active-emoji">${preset.emoji}</span>
        <div>
          <strong>${preset.name}</strong>
          <p>${preset.description}</p>
          <small>Moduły: ${moduleNames || 'Brak'}</small>
        </div>
      </div>
    `;
  }

  /**
   * Get modules in current preset
   */
  function getPresetModules(presetKey) {
    const preset = cfg.presets[presetKey];
    return preset ? preset.modules : [];
  }

  /**
   * Create custom preset
   */
  function createCustomPreset(name, emoji, modules) {
    const customKey = `custom_${Date.now()}`;
    cfg.presets[customKey] = {
      name,
      description: `Własny preset: ${name}`,
      emoji,
      modules,
      icon: emoji,
      color: '#9999bb',
      custom: true
    };

    console.log(`✨ Stworzono własny preset: ${customKey}`);
    saveCurrentPreset(customKey);
    return customKey;
  }

  /**
   * Delete custom preset
   */
  function deleteCustomPreset(presetKey) {
    if (cfg.presets[presetKey]?.custom) {
      delete cfg.presets[presetKey];
      console.log(`🗑️ Usunięto preset: ${presetKey}`);
      return true;
    }
    return false;
  }

  /**
   * Save current preset to localStorage
   */
  function saveCurrentPreset(presetKey) {
    try {
      localStorage.setItem('mapEnhancementsCurrentPreset', presetKey);
    } catch (e) {
      console.warn('⚠️ Nie udało się zapisać presetu:', e);
    }
  }

  /**
   * Load last used preset
   */
  function loadLastPreset() {
    try {
      const saved = localStorage.getItem('mapEnhancementsCurrentPreset');
      if (saved && cfg.presets[saved]) {
        activatePreset(saved);
      }
    } catch (e) {
      console.warn('⚠️ Nie udało się załadować presetu:', e);
    }
  }

  /**
   * Get all presets
   */
  function getAllPresets() {
    return { ...cfg.presets };
  }

  /**
   * Get current active preset
   */
  function getCurrentPreset() {
    return cfg.currentPreset;
  }

  /**
   * Check if preset buttons are visible
   */
  function isVisible() {
    return cfg.presetsPanel && cfg.presetsPanel.style.display !== 'none';
  }

  /**
   * Toggle preset panel visibility
   */
  function togglePanel() {
    if (!cfg.presetsPanel) return;
    const isVisible = cfg.presetsPanel.style.display !== 'none';
    cfg.presetsPanel.style.display = isVisible ? 'none' : 'flex';
  }

  /**
   * Show preset panel
   */
  function showPanel() {
    if (!cfg.presetsPanel) return;
    cfg.presetsPanel.style.display = 'flex';
  }

  /**
   * Hide preset panel
   */
  function hidePanel() {
    if (!cfg.presetsPanel) return;
    cfg.presetsPanel.style.display = 'none';
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 500); // Wait for map to be ready
  });

  // Also try on map-ready event
  window.addEventListener('map-ready', () => {
    if (!cfg.presetsPanel) init();
  });

  return {
    init,
    activatePreset,
    createCustomPreset,
    deleteCustomPreset,
    getAllPresets,
    getCurrentPreset,
    getPresetModules,
    togglePanel,
    showPanel,
    hidePanel,
    isVisible,
    loadLastPreset,
    saveCurrentPreset
  };
})();

window.MapEnhancementsPresets = MapEnhancementsPresets;
