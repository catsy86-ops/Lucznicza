/**
 * mobile-optimizations.js — Mobile performance & animation enhancements
 * Handles: lazy loading, smooth animations, viewport optimizations, touch performance
 */
'use strict';

const MobileOptimizations = (() => {
  const config = {
    enableLazyLoad: true,
    enableAnimationOptimization: true,
    enableVirtualScrolling: true,
    reduceMotionOnLowEnd: true,
    imageLazyLoadThreshold: '50px',
  };

  let isLowEndDevice = false;
  let reducedMotion = false;

  /**
   * Initialize all mobile optimizations
   */
  function init() {
    console.log('⚡ Mobile optimizations initializing...');
    
    detectDeviceCapabilities();
    setupLazyLoading();
    optimizeAnimations();
    optimizeImagesForMobile();
    setupViewportOptimizations();
    optimizeTouchPerformance();
    
    console.log('✅ Mobile optimizations ready');
  }

  /**
   * Detect if device is low-end (old phone, slow CPU)
   */
  function detectDeviceCapabilities() {
    // Check for prefers-reduced-motion
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Simple heuristic: check device memory if available
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      isLowEndDevice = true;
      console.log('🔧 Low-end device detected — reducing animations');
    }

    // Check for low connection
    if (navigator.connection) {
      const connection = navigator.connection;
      if (connection.effectiveType === '4g' || connection.effectiveType === '3g') {
        if (connection.effectiveType === '3g') {
          console.log('📡 Slow connection detected (3G)');
        }
      }
    }
  }

  /**
   * Setup lazy loading for images and content
   */
  function setupLazyLoading() {
    if (!config.enableLazyLoad) return;

    // Native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      console.log('📦 Using native lazy loading');
      return;
    }

    // Fallback: Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: config.imageLazyLoadThreshold
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      console.log('🖼️ Lazy loading with IntersectionObserver ready');
    }
  }

  /**
   * Optimize animations based on device capability
   */
  function optimizeAnimations() {
    if (!config.enableAnimationOptimization) return;

    let animationStyle = document.querySelector('style[data-mobile-animation-opt]');
    
    if (!animationStyle) {
      animationStyle = document.createElement('style');
      animationStyle.setAttribute('data-mobile-animation-opt', 'true');
      document.head.appendChild(animationStyle);
    }

    const optimizations = `
      /* Smooth animations with will-change */
      .bnav-btn {
        will-change: transform, opacity;
      }

      /* Reduce animation on low-end devices */
      ${isLowEndDevice ? `
        * {
          animation-duration: 0.15s !important;
        }
        .rippleEffect {
          animation-duration: 0.3s !important;
        }
      ` : ''}

      /* Respect prefers-reduced-motion */
      ${reducedMotion ? `
        * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      ` : ''}

      /* Enable GPU acceleration for smooth animations */
      .sidebar,
      .bottom-nav,
      .modal {
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
      }

      /* Optimize scrolling performance */
      .places-grid,
      .routes-list,
      .info-cards {
        -webkit-overflow-scrolling: touch;
      }

      /* Reduce paint areas */
      .map-popup {
        contain: layout style paint;
      }

      /* High-frequency event optimization */
      .bottom-nav {
        contain: layout;
      }
    `;

    animationStyle.textContent = optimizations;
    console.log('🎨 Animation optimizations applied');
  }

  /**
   * Optimize images for mobile viewing
   */
  function optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Skip if already optimized
      if (img.dataset.optimized) return;

      // Add loading="lazy" attribute
      if ('loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
      }

      // Add decoding="async" for non-blocking rendering
      if ('decoding' in HTMLImageElement.prototype) {
        img.decoding = 'async';
      }

      // Responsive images hint
      if (!img.srcset && img.src) {
        img.dataset.optimized = 'true';
      }
    });

    console.log('🖼️ Image optimizations applied');
  }

  /**
   * Viewport optimizations for mobile
   */
  function setupViewportOptimizations() {
    // Add support for viewport-fit for notch devices
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta && !viewportMeta.content.includes('viewport-fit')) {
      viewportMeta.content += ', viewport-fit=cover';
    }

    // Disable zoom on iOS for better performance
    viewportMeta.content = viewportMeta.content.replace(
      /user-scalable=\w+/,
      'user-scalable=yes'
    );

    console.log('📱 Viewport optimizations applied');
  }

  /**
   * Optimize touch event performance
   */
  function optimizeTouchPerformance() {
    // Use passive event listeners where possible
    const touchElements = document.querySelectorAll(
      '.bnav-btn, .bottom-nav, .sidebar, .modal'
    );

    touchElements.forEach(el => {
      // Remove old listeners and add passive ones
      ['touchstart', 'touchmove', 'touchend'].forEach(event => {
        el.addEventListener(event, () => {}, { passive: true, once: false });
      });
    });

    // Reduce 300ms tap delay on mobile
    document.addEventListener('click', (e) => {
      if (e.target.matches('.bnav-btn, button, a')) {
        e.target.classList.add('active');
        setTimeout(() => e.target.classList.remove('active'), 100);
      }
    });

    console.log('👆 Touch performance optimized');
  }

  /**
   * Get device capabilities info
   */
  function getDeviceInfo() {
    return {
      isLowEnd: isLowEndDevice,
      reducedMotion,
      connection: navigator.connection?.effectiveType || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
    };
  }

  /**
   * Toggle animation optimization (useful for debugging)
   */
  function setAnimationOptimization(enabled) {
    config.enableAnimationOptimization = enabled;
    if (enabled) {
      optimizeAnimations();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    getDeviceInfo,
    setAnimationOptimization,
    isLowEnd: () => isLowEndDevice,
    hasReducedMotion: () => reducedMotion,
  };
})();

window.MobileOptimizations = MobileOptimizations;
