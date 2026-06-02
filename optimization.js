/**
 * optimization.js — Performance optimization: code splitting, lazy loading, compression
 * Monitors and optimizes app performance metrics
 */

'use strict';

const Optimization = (() => {
  // ===== CODE SPLITTING & LAZY LOADING =====
  const CodeSplitting = {
    // Lazy load heavy modules
    lazyModules: {
      'google-maps': false,
      'map-3d': false,
      'weather-widget': false,
      'live-tracker': false
    },

    async loadModule(name) {
      if (this.lazyModules[name]) {
        return; // Already loaded
      }

      const scripts = {
        'google-maps': 'google-maps.js',
        'map-3d': 'buildings-3d.js',
        'weather-widget': 'map-weather-overlay.js',
        'live-tracker': 'zditm-live.js'
      };

      if (!scripts[name]) {
        console.warn(`Module ${name} not found`);
        return;
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scripts[name];
        script.async = true;
        script.onload = () => {
          this.lazyModules[name] = true;
          console.log(`✅ Lazy loaded: ${name}`);
          resolve();
        };
        script.onerror = () => {
          console.error(`❌ Failed to load: ${name}`);
          reject();
        };
        document.body.appendChild(script);
      });
    },

    // Load on visibility
    observeElementsForLazyLoad() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const module = entry.target.dataset.lazyModule;
            if (module) {
              this.loadModule(module);
              observer.unobserve(entry.target);
            }
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('[data-lazy-module]').forEach(el => {
        observer.observe(el);
      });
    }
  };

  // ===== IMAGE OPTIMIZATION =====
  const ImageOptimization = {
    setupImageLazyLoading() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Load actual image from data attribute
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              
              // Load WebP variant if supported
              if (img.dataset.srcWebp) {
                const picture = img.closest('picture');
                if (picture) {
                  const source = document.createElement('source');
                  source.srcset = img.dataset.srcWebp;
                  source.type = 'image/webp';
                  picture.insertBefore(source, img);
                }
              }
              
              imageObserver.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    },

    async convertToWebP(imageUrl) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/webp'));
        };
        img.src = imageUrl;
      });
    }
  };

  // ===== COMPRESSION & CACHING =====
  const Compression = {
    enableGzipCaching() {
      // This is typically done on server, but we can hint the browser
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://cdnjs.cloudflare.com';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      console.log('📦 Gzip caching hints enabled');
    },

    compressJSON(obj) {
      // Simple JSON compression by removing whitespace
      return JSON.stringify(obj);
    },

    // Use localforage for better caching
    setupLocalStorageOptimization() {
      window.cacheManager = {
        cache: new Map(),
        maxSize: 5 * 1024 * 1024, // 5MB
        currentSize: 0,

        set(key, value, ttl = 3600000) { // 1 hour default
          const data = {
            value: value,
            expires: Date.now() + ttl,
            size: JSON.stringify(value).length
          };

          // Check if exceeds max size
          if (this.currentSize + data.size > this.maxSize) {
            this.evictOldest();
          }

          this.cache.set(key, data);
          this.currentSize += data.size;

          try {
            localStorage.setItem(`cache:${key}`, JSON.stringify(data));
          } catch (e) {
            console.warn('LocalStorage quota exceeded');
          }
        },

        get(key) {
          let data = this.cache.get(key);

          // Try localStorage if not in memory
          if (!data) {
            try {
              data = JSON.parse(localStorage.getItem(`cache:${key}`));
              if (data) this.cache.set(key, data);
            } catch (e) {
              return null;
            }
          }

          // Check if expired
          if (data && data.expires < Date.now()) {
            this.delete(key);
            return null;
          }

          return data?.value || null;
        },

        delete(key) {
          const data = this.cache.get(key);
          if (data) {
            this.currentSize -= data.size;
            this.cache.delete(key);
          }
          localStorage.removeItem(`cache:${key}`);
        },

        clear() {
          this.cache.clear();
          this.currentSize = 0;
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache:')) {
              localStorage.removeItem(key);
            }
          });
        },

        evictOldest() {
          let oldest = null;
          let oldestTime = Infinity;

          for (const [key, data] of this.cache) {
            if (data.expires < oldestTime) {
              oldest = key;
              oldestTime = data.expires;
            }
          }

          if (oldest) {
            this.delete(oldest);
          }
        }
      };
    }
  };

  // ===== PERFORMANCE MONITORING =====
  const PerformanceMonitoring = {
    metrics: {
      apiCalls: [],
      renders: [],
      memoryUsage: []
    },

    initCoreWebVitals() {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`📊 LCP: ${Math.round(lastEntry.renderTime)}ms`);
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) { /* not supported */ }
      }

      // First Input Delay
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
              console.log(`⚡ FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
            });
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) { /* not supported */ }
      }

      // Cumulative Layout Shift
      if ('PerformanceObserver' in window) {
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let cls = 0;
            list.getEntries().forEach(entry => {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            });
            console.log(`✨ CLS: ${Math.round(cls * 1000) / 1000}`);
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) { /* not supported */ }
      }
    },

    trackAPICall(name, duration) {
      this.metrics.apiCalls.push({
        name: name,
        duration: duration,
        timestamp: Date.now()
      });

      if (duration > 1000) {
        console.warn(`⚠️ Slow API: ${name} took ${duration}ms`);
      }
    },

    getMetrics() {
      const memoryInfo = performance.memory || {};
      return {
        apiCalls: this.metrics.apiCalls.slice(-10),
        memoryUsage: {
          jsHeapSizeLimit: Math.round(memoryInfo.jsHeapSizeLimit / 1048576),
          totalJSHeapSize: Math.round(memoryInfo.totalJSHeapSize / 1048576),
          usedJSHeapSize: Math.round(memoryInfo.usedJSHeapSize / 1048576)
        }
      };
    }
  };

  // ===== BUNDLE ANALYSIS =====
  const BundleAnalysis = {
    analyzePageSize() {
      const resources = performance.getEntriesByType('resource');
      const summary = {
        scripts: 0,
        styles: 0,
        images: 0,
        other: 0
      };

      let totalSize = 0;

      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        totalSize += size;

        if (resource.name.endsWith('.js')) summary.scripts += size;
        else if (resource.name.endsWith('.css')) summary.styles += size;
        else if (/\\.(jpg|png|gif|webp|svg)/.test(resource.name)) summary.images += size;
        else summary.other += size;
      });

      return {
        total: Math.round(totalSize / 1024),
        breakdown: {
          scripts: Math.round(summary.scripts / 1024),
          styles: Math.round(summary.styles / 1024),
          images: Math.round(summary.images / 1024),
          other: Math.round(summary.other / 1024)
        }
      };
    }
  };

  // ===== INITIALIZATION =====
  function init() {
    // Setup lazy loading
    CodeSplitting.observeElementsForLazyLoad();

    // Setup image optimization
    ImageOptimization.setupImageLazyLoading();

    // Setup compression
    Compression.enableGzipCaching();
    Compression.setupLocalStorageOptimization();

    // Monitor performance
    PerformanceMonitoring.initCoreWebVitals();

    console.log('🚀 Optimization initialized');
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    CodeSplitting,
    ImageOptimization,
    Compression,
    PerformanceMonitoring,
    BundleAnalysis,
    init
  };
})();

window.Optimization = Optimization;
