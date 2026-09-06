/**
 * map-enhancements-mobile.js — Mobile-first bottom sheet UI for map enhancements
 * Adaptive layout: bottom sheet on mobile, toolbar on desktop
 * Features: gesture controls, swipe-up/down, snap points, smooth animations
 */
'use strict';

const MapEnhancementsMobile = (() => {
  const cfg = {
    enabled: true,
    isMobile: false,
    isTablet: false,
    bottomSheet: null,
    dragState: {
      startY: 0,
      currentY: 0,
      isDragging: false,
      velocity: 0
    },
    snapPoints: {
      desktop: null,
      mobile: [
        { name: 'collapsed', height: 60, threshold: 0.3 },
        { name: 'half', height: 300, threshold: 0.5 },
        { name: 'full', height: window.innerHeight * 0.85, threshold: 0.7 }
      ]
    }
  };

  /**
   * Detect device type based on viewport
   */
  function detectDevice() {
    const width = window.innerWidth;
    cfg.isMobile = width < 768;
    cfg.isTablet = width >= 768 && width < 1024;
    return { isMobile: cfg.isMobile, isTablet: cfg.isTablet };
  }

  /**
   * Initialize mobile-adaptive UI
   */
  function init() {
    detectDevice();
    console.log(`📱 Device detected: ${cfg.isMobile ? 'Mobile' : cfg.isTablet ? 'Tablet' : 'Desktop'}`);

    // Apply adaptive layout
    if (cfg.isMobile || cfg.isTablet) {
      createBottomSheet();
      attachGestureHandlers();
    } else {
      // Desktop: toolbar stays as is
      adaptDesktopToolbar();
    }

    // Handle window resize (responsive)
    window.addEventListener('resize', () => {
      const prev = cfg.isMobile;
      detectDevice();
      if (prev !== cfg.isMobile) {
        console.log('📱 Layout changed due to resize');
        const toolbar = document.getElementById('mapEnhancementsToolbar');
        if (toolbar) toolbar.style.display = cfg.isMobile ? 'none' : 'flex';
        if (window.map) {
          window.map.invalidateSize();
        } else if (window.state?.map) {
          window.state.map.invalidateSize();
        }
      }
    });
  }

  /**
   * Create bottom sheet UI for mobile/tablet
   */
  function createBottomSheet() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Create bottom sheet container
    const sheet = document.createElement('div');
    sheet.id = 'mapEnhancementsBottomSheet';
    sheet.className = 'bottom-sheet';
    sheet.innerHTML = `
      <div class="bs-handle">
        <div class="bs-handle-bar"></div>
      </div>
      <div class="bs-content">
        <div class="bs-header">
          <h3>🎚️ Narzędzia Mapy</h3>
          <span class="bs-close-hint">Przeciągnij w dół aby zamknąć</span>
        </div>
        <div class="bs-buttons" id="bsButtons"></div>
      </div>
    `;

    mapContainer.appendChild(sheet);
    cfg.bottomSheet = sheet;

    // Move buttons from toolbar to bottom sheet
    transferButtonsToBottomSheet();

    // Set initial state
    setSnapPoint('collapsed');

    console.log('✅ Bottom sheet created');
  }

  /**
   * Transfer buttons from desktop toolbar to mobile bottom sheet
   */
  function transferButtonsToBottomSheet() {
    const desktopContainer = document.getElementById('enhancements-buttons');
    const mobileContainer = document.getElementById('bsButtons');

    if (!desktopContainer || !mobileContainer) return;

    // Move buttons into bottom sheet to preserve all JS event listeners
    const buttons = desktopContainer.querySelectorAll('.enh-btn');
    buttons.forEach(btn => {
      mobileContainer.appendChild(btn);
    });

    // Hide desktop toolbar on mobile
    if (cfg.isMobile) {
      const toolbar = document.getElementById('mapEnhancementsToolbar');
      if (toolbar) toolbar.style.display = 'none';
    }
  }

  /**
   * Attach gesture handlers to bottom sheet
   */
  function attachGestureHandlers() {
    const sheet = cfg.bottomSheet;
    if (!sheet) return;

    // Touch events
    let touchStartY = 0;
    let touchStartTime = 0;

    sheet.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      cfg.dragState.isDragging = true;
      sheet.classList.add('dragging');
    }, { passive: true });

    sheet.addEventListener('touchmove', (e) => {
      if (!cfg.dragState.isDragging) return;
      if (e.cancelable) e.preventDefault();

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;

      // Calculate velocity
      const timeDiff = Date.now() - touchStartTime;
      cfg.dragState.velocity = diff / timeDiff;

      // Update position
      const content = sheet.querySelector('.bs-content');
      const currentHeight = parseInt(content.style.height || cfg.snapPoints.mobile[0].height);
      const newHeight = Math.max(60, currentHeight + diff);

      content.style.transform = `translateY(${diff}px)`;
    }, { passive: false });

    sheet.addEventListener('touchend', (e) => {
      cfg.dragState.isDragging = false;
      sheet.classList.remove('dragging');

      // Snap to nearest point
      const content = sheet.querySelector('.bs-content');
      const currentY = e.changedTouches[0].clientY;
      const diff = currentY - touchStartY;

      snapToNearest(diff);
    });

    // Click on handle to toggle
    const handle = sheet.querySelector('.bs-handle');
    if (handle) {
      handle.addEventListener('click', () => {
        const current = getCurrentSnapPoint();
        const next = current === 'collapsed' ? 'half' : current === 'half' ? 'full' : 'collapsed';
        setSnapPoint(next);
      });
    }

    console.log('✅ Gesture handlers attached');
  }

  /**
   * Snap to nearest snap point
   */
  function snapToNearest(dragDistance) {
    const content = cfg.bottomSheet.querySelector('.bs-content');
    const current = parseInt(content.style.height || cfg.snapPoints.mobile[0].height);
    const threshold = Math.abs(dragDistance) / window.innerHeight;

    let nearest = cfg.snapPoints.mobile[0];
    let minDist = Math.abs(current - nearest.height);

    cfg.snapPoints.mobile.forEach(point => {
      const dist = Math.abs(current - point.height);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    });

    // Check if velocity suggests swipe
    if (cfg.dragState.velocity > 0.5 && dragDistance > 50) {
      setSnapPoint('collapsed');
    } else if (cfg.dragState.velocity < -0.5 && dragDistance < -50) {
      setSnapPoint('full');
    } else {
      setSnapPoint(nearest.name);
    }
  }

  /**
   * Set snap point for bottom sheet
   */
  function setSnapPoint(pointName) {
    const point = cfg.snapPoints.mobile.find(p => p.name === pointName);
    if (!point) return;

    const content = cfg.bottomSheet.querySelector('.bs-content');
    const sheet = cfg.bottomSheet;

    content.style.height = `${point.height}px`;
    content.style.transform = 'translateY(0)';

    // Update handle visibility
    const handle = sheet.querySelector('.bs-handle-bar');
    handle.style.opacity = pointName === 'collapsed' ? '1' : '0.5';

    // Update header hint
    const hint = sheet.querySelector('.bs-close-hint');
    if (hint) {
      hint.style.display = pointName === 'full' ? 'none' : 'block';
    }

    console.log(`📌 Snapped to: ${pointName} (${point.height}px)`);
    if (window.map) {
      window.map.invalidateSize();
    } else if (window.state?.map) {
      window.state.map.invalidateSize();
    }
  }

  /**
   * Get current snap point
   */
  function getCurrentSnapPoint() {
    const content = cfg.bottomSheet.querySelector('.bs-content');
    const height = parseInt(content.style.height || cfg.snapPoints.mobile[0].height);

    for (let i = cfg.snapPoints.mobile.length - 1; i >= 0; i--) {
      if (height >= cfg.snapPoints.mobile[i].height * 0.8) {
        return cfg.snapPoints.mobile[i].name;
      }
    }
    return 'collapsed';
  }

  /**
   * Adapt desktop toolbar for better layout
   */
  function adaptDesktopToolbar() {
    const toolbar = document.getElementById('mapEnhancementsToolbar');
    if (!toolbar) return;

    // Make toolbar more compact on desktop
    toolbar.classList.add('desktop-optimized');

    // Add horizontal layout option
    const container = document.getElementById('enhancements-buttons');
    if (container && window.innerWidth > 1200) {
      container.classList.add('horizontal');
    }

    console.log('✅ Desktop toolbar optimized');
  }

  /**
   * Toggle bottom sheet programmatically
   */
  function toggleBottomSheet() {
    if (!cfg.bottomSheet) return;
    const current = getCurrentSnapPoint();
    const next = current === 'collapsed' ? 'half' : 'collapsed';
    setSnapPoint(next);
  }

  /**
   * Close bottom sheet (snap to collapsed)
   */
  function closeBottomSheet() {
    if (!cfg.bottomSheet) return;
    setSnapPoint('collapsed');
  }

  /**
   * Expand bottom sheet fully
   */
  function expandBottomSheet() {
    if (!cfg.bottomSheet) return;
    setSnapPoint('full');
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    toggleBottomSheet,
    closeBottomSheet,
    expandBottomSheet,
    getCurrentSnapPoint,
    setSnapPoint,
    detectDevice
  };
})();

window.MapEnhancementsMobile = MapEnhancementsMobile;
