# 👨‍💻 Developer Guide — Advanced Implementation

**For**: Developers extending the app  
**Level**: Intermediate to Advanced  
**Updated**: June 2, 2026

---

## 🏗️ Architecture Overview

### Module Dependencies

```
App Initialization
│
├─ performance.js (Core metrics)
├─ error-handler.js (Global error handling)
│
├─ ux-animations.js (UX layer)
│  ├─ Animations
│  ├─ Toasts
│  └─ Keyboard shortcuts
│
├─ features-new.js (Features layer)
│  ├─ Offline cache (IndexedDB)
│  ├─ Favorites system
│  ├─ Route sharing
│  └─ PWA support
│
├─ optimization.js (Performance layer)
│  ├─ Code splitting
│  ├─ Lazy loading
│  ├─ Compression
│  └─ Monitoring
│
├─ tests.js (Testing layer)
│  ├─ Unit tests
│  ├─ E2E tests
│  ├─ Performance tests
│  └─ Accessibility tests
│
├─ pogon-mascot.js (UI enhancement)
│  └─ Interactive mascot
│
└─ app.js (Main app logic)
   └─ Core functionality
```

### Load Order (from index.html):
1. Performance monitoring
2. Error handler
3. Offline store
4. Core app modules
5. **ux-animations.js** ← NEW
6. **features-new.js** ← NEW
7. **optimization.js** ← NEW
8. **tests.js** ← NEW
9. Mascot & App

---

## 🔧 Extending UX Animations

### Add Custom Animation:

```javascript
// Extend UXAnimations with your animation
const customAnimation = {
  fadeBlur: 0.4,
  
  playCustom(element) {
    element.style.animation = `fadeBlur ${this.fadeBlur}s ease-out`;
  }
};

// Use it
customAnimation.playCustom(myElement);
```

### Add Custom Keyboard Shortcut:

```javascript
// Inside ux-animations.js, add to shortcuts object:
const shortcuts = {
  // ... existing shortcuts
  'Enter': (e) => {
    if (document.activeElement === searchInput) {
      performSearch();
    }
  }
};
```

### Create Custom Toast Type:

```javascript
// Add to showToastEnhanced function
const icons = {
  'custom': '🎨',
  'success': '✅',
  // ... etc
};

// Usage:
showToastEnhanced('Custom message', 'custom', 3000);
```

---

## 💾 Extending Offline Cache

### Use Different Store:

```javascript
// Add new store name in STORE_NAMES
const STORE_NAMES = ['places', 'routes', 'weather', 'api-cache', 'custom-data'];

// Use it
await NewFeatures.OfflineCache.save('custom-data', {
  id: 'custom-1',
  data: { /* your data */ },
  timestamp: Date.now()
});
```

### Query Multiple Stores:

```javascript
async function getallCachedData() {
  const places = await NewFeatures.OfflineCache.getAll('places');
  const routes = await NewFeatures.OfflineCache.getAll('routes');
  const custom = await NewFeatures.OfflineCache.getAll('custom-data');
  
  return { places, routes, custom };
}
```

### Implement Cache Strategies:

```javascript
// Cache-first strategy
async function getCacheFirst(url, storeName) {
  // Try cache first
  const cached = await NewFeatures.OfflineCache.get(storeName, url);
  if (cached) return cached.data;
  
  // Fall back to network
  const response = await fetch(url);
  const data = await response.json();
  
  // Save to cache
  await NewFeatures.OfflineCache.save(storeName, {
    id: url,
    data: data
  });
  
  return data;
}
```

### Clear Cache on Demand:

```javascript
// Clear specific store
await NewFeatures.OfflineCache.clear('places');

// Clear all
await NewFeatures.OfflineCache.clear('routes');
await NewFeatures.OfflineCache.clear('weather');

// Or use utility
async function clearAllCache() {
  const stores = ['places', 'routes', 'weather', 'api-cache'];
  for (const store of stores) {
    await NewFeatures.OfflineCache.clear(store);
  }
}
```

---

## ⭐ Extending Favorites System

### Custom Favorite Type:

```javascript
// Define custom type
const FAVORITE_TYPES = {
  'place': 'places',
  'route': 'routes',
  'stop': 'stops',
  'custom-item': 'custom-items'  // ← New type
};

// Use it
await NewFeatures.Favorites.addFavorite('custom-item', {
  id: 'custom-123',
  name: 'My Custom Item',
  data: { /* ... */ }
});
```

### Batch Favorite Operations:

```javascript
async function addManyFavorites(items) {
  const results = [];
  
  for (const item of items) {
    const fav = await NewFeatures.Favorites.addFavorite(
      item.type,
      item
    );
    results.push(fav);
  }
  
  console.log(`Added ${results.length} favorites`);
  return results;
}
```

### Export Favorites:

```javascript
async function exportFavoritesAsJSON() {
  const places = await NewFeatures.Favorites.getFavorites('place');
  const routes = await NewFeatures.Favorites.getFavorites('route');
  
  const data = {
    version: '1.0',
    exported: new Date().toISOString(),
    places: places,
    routes: routes
  };
  
  // Download JSON
  const blob = new Blob([JSON.stringify(data, null, 2)]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'favorites.json';
  a.click();
}
```

---

## 🔗 Advanced Route Sharing

### Custom Share Handler:

```javascript
async function shareCustom(route) {
  const share = NewFeatures.RouteSharing.generateShareCode(route);
  
  // Custom endpoint
  const response = await fetch('/api/share', {
    method: 'POST',
    body: JSON.stringify({
      route: route,
      shareCode: share.shortCode,
      url: share.url
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    showToastEnhanced('Route shared!', 'success');
    return result.shortUrl; // Use shortened URL
  }
}
```

### QR Code Integration:

```javascript
async function generateQRCode(route) {
  const share = NewFeatures.RouteSharing.generateShareCode(route);
  
  // Use QR code library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(share.url)}`;
  
  return qrCodeUrl;
}
```

---

## 🚀 Performance Optimization Advanced

### Implement Cache Strategies:

```javascript
// Stale-while-revalidate pattern
async function fetchWithCache(url, options = {}) {
  const cacheKey = `api:${url}`;
  const cached = window.cacheManager.get(cacheKey);
  
  if (cached) {
    // Return cached immediately
    showToastEnhanced('📦 From cache', 'info', 1000);
    
    // But fetch fresh in background
    fetch(url)
      .then(r => r.json())
      .then(fresh => {
        window.cacheManager.set(cacheKey, fresh);
        showToastEnhanced('✅ Updated', 'info', 1000);
      });
    
    return cached;
  }
  
  // No cache, fetch new
  const response = await fetch(url);
  const fresh = await response.json();
  window.cacheManager.set(cacheKey, fresh, options.ttl || 3600000);
  
  return fresh;
}
```

### Progressive Enhancement:

```javascript
// Load heavy features only when needed
const features = {
  '3d-buildings': () => Optimization.CodeSplitting.loadModule('map-3d'),
  'weather': () => Optimization.CodeSplitting.loadModule('weather-widget'),
  'live-tracker': () => Optimization.CodeSplitting.loadModule('live-tracker')
};

// User clicks feature
document.getElementById('enable3d').addEventListener('click', () => {
  features['3d-buildings']()
    .then(() => showToastEnhanced('3D Loaded!', 'success'))
    .catch(() => showToastEnhanced('Failed to load 3D', 'error'));
});
```

### Monitor Specific Metrics:

```javascript
// Custom metric tracking
const metricsCollector = {
  async trackUserAction(action, metadata = {}) {
    const metric = {
      action: action,
      timestamp: Date.now(),
      memory: performance.memory?.usedJSHeapSize,
      ...metadata
    };
    
    // Send to analytics
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric)
    });
  }
};

// Usage
metricsCollector.trackUserAction('route-shared', {
  routeId: '123',
  platform: 'whatsapp'
});
```

---

## ✅ Advanced Testing

### Write Custom Unit Test:

```javascript
// Add to UnitTests in tests.js
UnitTests.assert(
  typeof window.myCustomModule !== 'undefined',
  'Custom module loaded'
);

// Or create new test file
const CustomTests = {
  async runTests() {
    console.log('🧪 Running custom tests...');
    
    // Test 1
    const result1 = await myFunction();
    UnitTests.assert(result1 === expected, 'Test 1');
    
    // Test 2
    const result2 = await anotherFunction();
    UnitTests.assert(result2.success, 'Test 2');
    
    console.log('✅ Custom tests complete');
  }
};

// Run it
CustomTests.runTests();
```

### E2E Test Helper:

```javascript
async function testUserFlow() {
  console.log('🎯 Testing user flow...');
  
  // Step 1: Search
  const search = document.getElementById('searchInput');
  search.value = 'Pogoń';
  search.dispatchEvent(new Event('input'));
  
  // Wait for results
  await new Promise(r => setTimeout(r, 1000));
  
  // Step 2: Click result
  const firstResult = document.querySelector('.search-result');
  firstResult?.click();
  
  // Verify modal opened
  const modal = document.getElementById('placeModal');
  UnitTests.assert(modal && !modal.classList.contains('hidden'), 'Modal opened');
  
  console.log('✅ User flow test passed');
}

// Run
testUserFlow();
```

### Performance Benchmark:

```javascript
async function benchmarkFeature(featureName, fn, iterations = 100) {
  console.log(`⚡ Benchmarking ${featureName} (${iterations} iterations)...`);
  
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  console.log(`📊 Results for ${featureName}:`);
  console.log(`   Average: ${avg.toFixed(2)}ms`);
  console.log(`   Min: ${min.toFixed(2)}ms`);
  console.log(`   Max: ${max.toFixed(2)}ms`);
  
  return { avg, min, max };
}

// Usage
benchmarkFeature('render-places', async () => {
  // Your render logic
  renderPlaces(places);
}, 50);
```

---

## 🦆 Extending Mascot

### Add Custom Mood:

```javascript
// In pogon-mascot.js changeMood function
case 'angry':
  mouth.setAttribute('d', 'M 55 48 Q 60 45 65 48');
  glow.setAttribute('fill', '#FF0000');
  showBubble('Nie podoba mi się! 😠');
  
  // Shake animation
  svg.style.animation = 'shake 0.5s';
  break;

case 'cool':
  mouth.setAttribute('d', 'M 55 45 Q 60 48 65 45');
  glow.setAttribute('fill', '#00FFFF');
  showBubble('Cool! 😎');
  break;
```

### Add Custom Reaction:

```javascript
// Add new reaction on click
const reactions = [
  // ... existing
  () => showBubble('To jest działa? 🤔'),
  () => showBubble('Hej! Zwróć mi uwagę! 👀'),
  () => showBubble('Lecimy! 🚀')
];
```

### Programmatic Mascot Control:

```javascript
// Create mascot controller
const mascotController = {
  celebrateGoal() {
    window.pogonMascot.click(); // Trigger click
    MASCOT.mood = 'dancing';
    changeMood(); // Apply dancing animation
    showBubble('GOOOOOOL! 🎉⚽');
  },
  
  sadAnimation() {
    MASCOT.mood = 'sleepy';
    changeMood();
    showBubble('Smutnie mi... 😢');
  },
  
  randomDance() {
    triggerDance();
    showBubble('Tańczę! 💃');
  }
};

// Use it
mascotController.celebrateGoal();
```

---

## 🔐 Security Considerations

### Validate Cache Data:

```javascript
// Always validate data from cache
async function getValidatedCache(storeName, id, validator) {
  const cached = await NewFeatures.OfflineCache.get(storeName, id);
  
  if (!cached) return null;
  
  // Validate structure
  try {
    validator(cached.data);
    return cached.data;
  } catch (e) {
    console.warn('Invalid cached data:', e);
    await NewFeatures.OfflineCache.delete(storeName, id);
    return null;
  }
}

// Usage
const validator = (data) => {
  if (!data.id || !data.name) throw new Error('Invalid place');
};

const place = await getValidatedCache('places', 'place-1', validator);
```

### Sanitize Shared URLs:

```javascript
// Validate before sharing
function validateShareURL(url) {
  try {
    const urlObj = new URL(url);
    
    // Only allow same domain
    if (urlObj.hostname !== window.location.hostname) {
      throw new Error('Different domain');
    }
    
    // Prevent javascript: protocol
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      throw new Error('Invalid protocol');
    }
    
    return url;
  } catch (e) {
    console.error('Invalid URL:', e);
    return null;
  }
}

// Use before sharing
const validURL = validateShareURL(shareURL);
if (validURL) {
  NewFeatures.RouteSharing.copyToClipboard(validURL);
}
```

---

## 📊 Monitoring & Analytics

### Setup Custom Analytics:

```javascript
const Analytics = {
  events: [],
  
  track(event, data = {}) {
    const entry = {
      event: event,
      data: data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.events.push(entry);
    
    // Send to server
    if (this.events.length >= 10) {
      this.flush();
    }
  },
  
  async flush() {
    if (this.events.length === 0) return;
    
    const batch = this.events.splice(0, 10);
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch })
      });
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }
};

// Track events
Analytics.track('route-shared', { route_id: '123', platform: 'whatsapp' });
Analytics.track('favorite-added', { item_id: 'place-456' });
Analytics.track('offline-mode-active', { duration: 300000 });
```

---

## 🚀 Deployment Checklist

### Before Deploy:
- [ ] Run all tests: `TestSuite.runAllTests()`
- [ ] Check performance: `Optimization.PerformanceMonitoring.getMetrics()`
- [ ] Verify bundle size: `Optimization.BundleAnalysis.analyzePageSize()`
- [ ] Test offline mode
- [ ] Test on mobile
- [ ] Check accessibility: `TestSuite.AccessibilityTests.runTests()`

### Deployment:
```bash
git add .
git commit -m "Your message"
git push
# Vercel auto-deploys from main
```

### Post-Deployment:
- [ ] Verify all features work in production
- [ ] Check Console for errors (F12)
- [ ] Test keyboard shortcuts
- [ ] Verify mascot loads
- [ ] Test offline functionality
- [ ] Monitor analytics

---

## 📚 File Structure

```
szn/
├── ux-animations.js          (351 LOC) UX/Animation
├── features-new.js           (420 LOC) Offline/Favorites/Share
├── optimization.js           (380 LOC) Performance
├── tests.js                  (480 LOC) Testing framework
├── pogon-mascot.js          (356 LOC) Mascot (existing)
│
├── Documentation/
│   ├── QUICK_START_NEW_FEATURES.md
│   ├── DEVELOPER_GUIDE.md (this file)
│   ├── INTEGRATION_SESSION_SUMMARY.md
│   └── POGON_MASCOT_GUIDE.md
│
└── (other app files...)
```

---

## 🔗 API Summary

```javascript
// UX
showToastEnhanced(msg, type, duration)
UXAnimations.showHelpDialog()

// Offline
NewFeatures.OfflineCache.save(store, data)
NewFeatures.OfflineCache.get(store, id)
NewFeatures.OfflineCache.getAll(store)
NewFeatures.OfflineCache.clear(store)

// Favorites
NewFeatures.Favorites.addFavorite(type, item)
NewFeatures.Favorites.getFavorites(type)
NewFeatures.Favorites.isFavorite(type, id)

// Sharing
NewFeatures.RouteSharing.generateShareCode(route)
NewFeatures.RouteSharing.shareVia(platform, route)
NewFeatures.RouteSharing.shareNative(route)

// Performance
Optimization.CodeSplitting.loadModule(name)
Optimization.PerformanceMonitoring.trackAPICall(name, duration)
Optimization.PerformanceMonitoring.getMetrics()

// Tests
TestSuite.runAllTests()
TestSuite.UnitTests.runTests()
TestSuite.PerformanceTests.runTests()

// Mascot
window.pogonMascot.toggle()
window.pogonMascot.changeMood()
window.pogonMascot.click()
```

---

**Next Section**: Check `QUICK_START_NEW_FEATURES.md` for user guide

**Questions?** Run tests to verify setup: `TestSuite.runAllTests()`

