/**
 * features-new.js — New features: offline cache, PWA, route sharing, favorites
 * Comprehensive feature additions for enhanced user experience
 */

'use strict';

const NewFeatures = (() => {
  // ===== OFFLINE CACHE MANAGER =====
  const OfflineCache = {
    DB_NAME: 'szn-app-db',
    STORE_NAMES: ['places', 'routes', 'weather', 'api-cache'],

    async init() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(this.DB_NAME, 1);
        
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);
        
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          this.STORE_NAMES.forEach(store => {
            if (!db.objectStoreNames.contains(store)) {
              db.createObjectStore(store, { keyPath: 'id' });
            }
          });
        };
      });
    },

    async save(storeName, data) {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        
        const item = {
          id: data.id || Date.now().toString(),
          data: data,
          timestamp: Date.now()
        };
        
        store.put(item);
        tx.oncomplete = () => resolve(item.id);
        tx.onerror = () => reject(tx.error);
      });
    },

    async get(storeName, id) {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    },

    async getAll(storeName) {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    },

    async clear(storeName) {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
        
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  };

  // ===== FAVORITES MANAGER =====
  const Favorites = {
    async addFavorite(type, item) {
      const favorite = {
        id: `${type}-${item.id}`,
        type: type, // 'place', 'route', 'stop'
        item: item,
        addedAt: Date.now()
      };
      
      await OfflineCache.save('places', favorite);
      
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced(`⭐ Dodano do ulubionych`, 'success');
      }
      
      return favorite;
    },

    async removeFavorite(type, itemId) {
      const id = `${type}-${itemId}`;
      // Note: Full delete would require more complex indexedDB operations
      await OfflineCache.save('places', {
        id: id,
        deleted: true,
        deletedAt: Date.now()
      });
      
      if (typeof showToastEnhanced === 'function') {
        showToastEnhanced(`Usunięto z ulubionych`, 'info');
      }
    },

    async getFavorites(type) {
      const all = await OfflineCache.getAll('places');
      return all.filter(item => 
        item.data?.type === type && !item.data?.deleted
      );
    },

    async isFavorite(type, itemId) {
      const fav = await OfflineCache.get('places', `${type}-${itemId}`);
      return fav && !fav.data?.deleted;
    }
  };

  // ===== ROUTE SHARING =====
  const RouteSharing = {
    generateShareCode(route) {
      // Create shareable link with route data encoded
      const routeData = {
        name: route.name,
        waypoints: route.waypoints,
        distance: route.distance,
        duration: route.duration,
        created: Date.now()
      };
      
      const encoded = btoa(JSON.stringify(routeData));
      const shareUrl = `${window.location.origin}?route=${encoded}`;
      
      return {
        url: shareUrl,
        shortCode: encoded.substring(0, 8).toUpperCase()
      };
    },

    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToastEnhanced === 'function') {
            showToastEnhanced('📋 Skopiowano do schowka', 'success');
          }
        });
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (typeof showToastEnhanced === 'function') {
          showToastEnhanced('📋 Skopiowano', 'success');
        }
      }
    },

    shareVia(platform, route) {
      const share = this.generateShareCode(route);
      const text = `Sprawdź tę trasę: ${route.name}`;
      
      const urls = {
        'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(share.url)}`,
        'twitter': `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(share.url)}`,
        'whatsapp': `https://wa.me/?text=${encodeURIComponent(text + ' ' + share.url)}`,
        'email': `mailto:?subject=${encodeURIComponent(route.name)}&body=${encodeURIComponent(text + '\n' + share.url)}`
      };
      
      if (urls[platform]) {
        window.open(urls[platform], '_blank');
      }
    },

    shareNative(route) {
      if (navigator.share) {
        const share = this.generateShareCode(route);
        navigator.share({
          title: route.name,
          text: `Sprawdź tę trasę: ${route.name}`,
          url: share.url
        }).catch(err => console.log('Share cancelled:', err));
      } else {
        this.copyToClipboard(this.generateShareCode(route).url);
      }
    }
  };

  // ===== PWA ENHANCEMENTS =====
  const PWAEnhancements = {
    async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('sw.js');
          console.log('✅ Service Worker registered:', reg);
          return reg;
        } catch (err) {
          console.error('❌ Service Worker registration failed:', err);
        }
      }
    },

    async installPrompt() {
      let deferredPrompt;
      
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
          installBtn.style.display = 'flex';
          installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = 'none';
          });
        }
      });
    },

    checkAppInstalled() {
      // Check if app is installed
      if (window.navigator.standalone === true) {
        console.log('✅ App is running in standalone mode');
        return true;
      }
      
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ App is in standalone display mode');
        return true;
      }
      
      return false;
    },

    enableOfflineIndicator() {
      const indicator = document.createElement('div');
      indicator.id = 'offlineIndicator';
      indicator.setAttribute('aria-live', 'polite');
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #10b981, #14b8a6);
        transform: translateY(-4px);
        transition: transform 0.3s ease;
        z-index: 9999;
      `;
      
      document.body.appendChild(indicator);
      
      window.addEventListener('online', () => {
        indicator.style.transform = 'translateY(-4px)';
      });
      
      window.addEventListener('offline', () => {
        indicator.style.transform = 'translateY(0)';
      });
    }
  };

  // ===== INITIALIZATION =====
  function init() {
    // Initialize offline cache
    OfflineCache.init().then(() => {
      console.log('💾 Offline cache initialized');
    }).catch(err => {
      console.warn('⚠️ IndexedDB not available:', err);
    });

    // Setup PWA features
    PWAEnhancements.registerServiceWorker();
    PWAEnhancements.installPrompt();
    PWAEnhancements.enableOfflineIndicator();

    console.log('🎁 New features initialized');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    OfflineCache,
    Favorites,
    RouteSharing,
    PWAEnhancements,
    init
  };
})();

window.NewFeatures = NewFeatures;
