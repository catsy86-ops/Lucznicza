/**
 * mobile-gestures.js — Advanced touch gesture recognition for mobile
 * Handles: swipe, pinch, long-press, double-tap, drag gestures
 */
'use strict';

const MobileGestures = (() => {
  const config = {
    swipeThreshold: 50,
    longPressDelay: 500,
    doubleTapDelay: 300,
    pinchThreshold: 50,
  };

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let longPressTimer = null;
  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;

  /**
   * Initialize gesture handlers
   */
  function init() {
    console.log('👆 Mobile gestures initializing...');
    
    setupSwipeDetection();
    setupLongPressDetection();
    setupDoubleTapDetection();
    setupPinchDetection();
    setupDragHandling();
    
    console.log('✅ Mobile gestures ready');
  }

  /**
   * Setup swipe gesture detection
   */
  function setupSwipeDetection() {
    const swipeableElements = document.querySelectorAll(
      '[data-swipeable], .bottom-nav, .sidebar, .modal-content'
    );

    swipeableElements.forEach(el => {
      el.addEventListener('touchstart', handleSwipeStart, { passive: true });
      el.addEventListener('touchend', handleSwipeEnd, { passive: true });
    });

    function handleSwipeStart(e) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      touchStartTime = Date.now();
    }

    function handleSwipeEnd(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // Determine swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > config.swipeThreshold) {
          dispatchGestureEvent('swipeleft', e.target);
        } else if (diffX < -config.swipeThreshold) {
          dispatchGestureEvent('swiperight', e.target);
        }
      } else {
        // Vertical swipe
        if (diffY > config.swipeThreshold) {
          dispatchGestureEvent('swipeup', e.target);
        } else if (diffY < -config.swipeThreshold) {
          dispatchGestureEvent('swipedown', e.target);
        }
      }
    }
  }

  /**
   * Setup long press gesture detection
   */
  function setupLongPressDetection() {
    document.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        if (e.target.matches('[data-long-press]')) {
          dispatchGestureEvent('longpress', e.target);
          triggerHapticFeedback('medium');
        }
      }, config.longPressDelay);
    }, { passive: true });

    document.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });

    document.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });
  }

  /**
   * Setup double-tap gesture detection
   */
  function setupDoubleTapDetection() {
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      const tapDelay = now - lastTapTime;

      const touchX = e.changedTouches[0].clientX;
      const touchY = e.changedTouches[0].clientY;
      
      const tapDistance = Math.sqrt(
        Math.pow(touchX - lastTapX, 2) + Math.pow(touchY - lastTapY, 2)
      );

      if (tapDelay < config.doubleTapDelay && tapDistance < 30) {
        // Double tap detected
        dispatchGestureEvent('doubletap', e.target);
        triggerHapticFeedback('light');
        lastTapTime = 0; // Reset to avoid triple-tap
      } else {
        lastTapTime = now;
        lastTapX = touchX;
        lastTapY = touchY;
      }
    }, { passive: true });
  }

  /**
   * Setup pinch gesture detection (zoom)
   */
  function setupPinchDetection() {
    let lastDistance = 0;

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 2) return;

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      if (lastDistance !== 0) {
        const diff = distance - lastDistance;

        if (Math.abs(diff) > config.pinchThreshold) {
          const scale = diff > 0 ? 'zoomin' : 'zoomout';
          dispatchGestureEvent(scale, document);
        }
      }

      lastDistance = distance;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        lastDistance = 0;
      }
    }, { passive: true });
  }

  /**
   * Setup drag handling for draggable elements
   */
  function setupDragHandling() {
    const draggableElements = document.querySelectorAll('[data-draggable]');

    draggableElements.forEach(el => {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let offsetX = 0;
      let offsetY = 0;
      let hasMoved = false;

      // Touch events (mobile)
      el.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        el.style.cursor = 'grabbing';
      }, { passive: true });

      el.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        offsetX = currentX - startX;
        offsetY = currentY - startY;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        dispatchGestureEvent('drag', el, {
          offsetX,
          offsetY,
          deltaX: currentX - startX,
          deltaY: currentY - startY,
        });
      }, { passive: true });

      el.addEventListener('touchend', () => {
        isDragging = false;
        el.style.cursor = 'grab';
        if (Math.abs(offsetX) < 30 && Math.abs(offsetY) < 30) {
          el.style.transform = 'translate(0, 0)';
        }
      }, { passive: true });

      // Pointer events (desktop mouse/pen)
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return; // primary button only
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        el.style.cursor = 'grabbing';
        e.stopPropagation();
      });

      el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        offsetX = currentX - startX;
        offsetY = currentY - startY;
        if (!hasMoved && (Math.abs(offsetX) > 3 || Math.abs(offsetY) > 3)) {
          hasMoved = true;
          el.classList.add('is-dragging');
        }
        if (!hasMoved) return;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        dispatchGestureEvent('drag', el, {
          offsetX,
          offsetY,
          deltaX: offsetX,
          deltaY: offsetY,
        });
      });

      el.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        el.style.cursor = 'grab';
        el.classList.remove('is-dragging');
        if (Math.abs(offsetX) < 30 && Math.abs(offsetY) < 30) {
          el.style.transform = 'translate(0, 0)';
        }
      });

      el.addEventListener('pointercancel', () => {
        isDragging = false;
        el.style.cursor = 'grab';
        el.classList.remove('is-dragging');
      });
    });
  }

  /**
   * Dispatch custom gesture event
   */
  function dispatchGestureEvent(gestureName, target, detail = {}) {
    const event = new CustomEvent(`gesture:${gestureName}`, {
      bubbles: true,
      cancelable: true,
      detail: {
        gesture: gestureName,
        timestamp: Date.now(),
        ...detail,
      }
    });
    
    if (target) {
      target.dispatchEvent(event);
    }

    // Log gesture for debugging
    console.log(`👆 Gesture detected: ${gestureName}`);
  }

  /**
   * Trigger haptic feedback
   */
  function triggerHapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;

    const patterns = {
      light: 10,
      medium: [20, 10, 20],
      heavy: [50, 30, 50],
    };

    navigator.vibrate(patterns[type] || 10);
  }

  /**
   * Listen for gesture events and handle them
   */
  function setupGestureHandlers() {
    // Handle swipe on sidebar
    document.addEventListener('gesture:swipeleft', (e) => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });

    // Handle swipe on bottom nav
    document.addEventListener('gesture:swipeup', (e) => {
      if (e.target.closest('.bottom-nav')) {
        if (window.MobileNavEnhance && window.MobileNavEnhance.hideNav) {
          window.MobileNavEnhance.hideNav();
        }
      }
    });

    document.addEventListener('gesture:swipedown', (e) => {
      if (e.target.closest('.bottom-nav')) {
        if (window.MobileNavEnhance && window.MobileNavEnhance.showNav) {
          window.MobileNavEnhance.showNav();
        }
      }
    });

    // Handle double-tap for zoom
    document.addEventListener('gesture:doubletap', (e) => {
      if (e.target.closest('#map')) {
        if (window.map && window.map.zoomIn) {
          window.map.zoomIn();
        }
      }
    });

    // ── Swipe right from left edge → go back to previous section ──
    let _edgeSwipeStartX = 0;
    let _edgeSwipeStartY = 0;
    let _edgeSwipeActive = false;

    document.addEventListener('touchstart', (e) => {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      _edgeSwipeStartX = x;
      _edgeSwipeStartY = y;
      // Only activate edge swipe if touch starts within 30px of left edge
      _edgeSwipeActive = x <= 30;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!_edgeSwipeActive) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - _edgeSwipeStartX;
      const diffY = Math.abs(endY - _edgeSwipeStartY);
      // Must be mostly horizontal swipe of at least 80px
      if (diffX > 80 && diffY < 60) {
        // Navigate to previous section
        try {
          const recent = JSON.parse(localStorage.getItem('recent_sections') || '[]');
          const currentSection = document.body.getAttribute('data-active-section');
          const prev = recent.find(r => r.id !== currentSection);
          if (prev && typeof navigateTo === 'function') {
            navigateTo(prev.id);
            if (typeof showToast === 'function') showToast('← ' + prev.label);
            if (window.navigator && window.navigator.vibrate) navigator.vibrate(15);
          }
        } catch (_) {}
      }
      _edgeSwipeActive = false;
    }, { passive: true });

    console.log('🎯 Gesture handlers setup complete');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setupGestureHandlers();
    });
  } else {
    init();
    setupGestureHandlers();
  }

  // Public API
  return {
    init,
    triggerHapticFeedback,
  };
})();

window.MobileGestures = MobileGestures;
