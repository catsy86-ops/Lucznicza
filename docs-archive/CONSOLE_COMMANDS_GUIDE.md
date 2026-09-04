# 🖥️ Console Commands Guide — Developer Tools

Use these commands in the browser console (F12 → Console tab) to test and debug enhancements.

---

## 📱 Mobile Navigation

### Test Haptic Feedback
```javascript
// Light vibration (10ms)
MobileNavEnhance.triggerHapticFeedback('light');

// Medium vibration (20-10-20ms pattern)
MobileNavEnhance.triggerHapticFeedback('medium');

// Heavy vibration (50-30-50ms pattern)
MobileNavEnhance.triggerHapticFeedback('heavy');
```

### Control Navigation
```javascript
// Hide navigation bar
MobileNavEnhance.hideNav();

// Show navigation bar
MobileNavEnhance.showNav();

// Check module status
console.log(MobileNavEnhance);
```

### Test Navigation Buttons
```javascript
// Trigger button click with haptic
document.querySelector('.bnav-btn').click();

// Get all nav buttons
document.querySelectorAll('.bnav-btn').forEach((btn, i) => {
  console.log(`Button ${i}:`, btn.getAttribute('data-section'));
});
```

---

## ⚡ Performance Optimization

### Check Device Capabilities
```javascript
// Get device info
const info = MobileOptimizations.getDeviceInfo();
console.log('Device Info:', info);

// Check if low-end device
console.log('Low-end device:', MobileOptimizations.isLowEnd());

// Check motion preference
console.log('Reduced motion:', MobileOptimizations.hasReducedMotion());
```

### Monitor Performance Metrics
```javascript
// Get page load metrics
const metrics = PerfMonitor.getMetrics();
console.log('Performance Metrics:', metrics);

// Check real-time FPS (run during animation)
let frameCount = 0;
function countFrames() {
  frameCount++;
  requestAnimationFrame(countFrames);
}
countFrames();
setTimeout(() => console.log(`FPS: ${frameCount / 2}`), 2000); // ~FPS over 2 seconds
```

### Test Lazy Loading
```javascript
// Find lazy-loaded images
const lazyImages = document.querySelectorAll('img[data-src]');
console.log(`Lazy images found: ${lazyImages.length}`);

// Manually trigger lazy load
lazyImages.forEach(img => {
  img.src = img.dataset.src;
  img.removeAttribute('data-src');
});
```

---

## 👆 Mobile Gestures

### Test Swipe Gestures
```javascript
// Listen for all swipes
document.addEventListener('gesture:swipeleft', (e) => console.log('👈 Swiped left'));
document.addEventListener('gesture:swiperight', (e) => console.log('👉 Swiped right'));
document.addEventListener('gesture:swipeup', (e) => console.log('⬆️ Swiped up'));
document.addEventListener('gesture:swipedown', (e) => console.log('⬇️ Swiped down'));

// Test: swipe on the screen and check console
```

### Test Long Press
```javascript
// Listen for long press
document.addEventListener('gesture:longpress', (e) => {
  console.log('🤚 Long press detected on:', e.target);
});

// Test: long-press an element and check console
```

### Test Double Tap
```javascript
// Listen for double tap
document.addEventListener('gesture:doubletap', (e) => {
  console.log('👉 Double tap detected on:', e.target);
});

// Test: double-tap the screen and check console
```

### Test Pinch/Zoom
```javascript
// Listen for zoom gestures
document.addEventListener('gesture:zoomin', (e) => console.log('🔍 Zoom in'));
document.addEventListener('gesture:zoomout', (e) => console.log('🔍 Zoom out'));

// Test: pinch outward (zoom in) or inward (zoom out) on a touch device
```

### Trigger Haptic on Gesture
```javascript
// Haptic feedback on gesture
document.addEventListener('gesture:longpress', (e) => {
  MobileNavEnhance.triggerHapticFeedback('heavy');
});

// Test: long-press should vibrate heavily
```

---

## 🎨 UI Polish

### Show Tooltips
```javascript
// Find an element with tooltip
const btn = document.querySelector('[data-tooltip]');

// Show tooltip
UIPolishEnhancements.showTooltip(btn);

// Hide tooltip (after a delay)
setTimeout(() => UIPolishEnhancements.hideTooltip(btn), 2000);

// Create tooltip on element
btn.setAttribute('data-tooltip', 'Custom tooltip text');
UIPolishEnhancements.showTooltip(btn);
```

### Test Button States
```javascript
// Get a button
const btn = document.querySelector('button');

// Add loading state
btn.classList.add('loading');
setTimeout(() => btn.classList.remove('loading'), 2000);

// Add success state
btn.classList.add('success');
setTimeout(() => btn.classList.remove('success'), 2000);

// Add error state
btn.classList.add('error');
setTimeout(() => btn.classList.remove('error'), 2000);

// Disable button
btn.disabled = true;
setTimeout(() => btn.disabled = false, 2000);
```

### Test Smooth Scroll
```javascript
// Scroll to element smoothly
const target = document.querySelector('#map');
target.scrollIntoView({ behavior: 'smooth' });

// Or use instant scroll
target.scrollIntoView({ behavior: 'auto' });
```

---

## 🎬 Animation Testing

### Play Animations
```javascript
// Get element
const el = document.querySelector('.place-card');

// Add animation class
el.classList.add('card-animate');

// Remove after animation
setTimeout(() => el.classList.remove('card-animate'), 500);

// Available animation classes:
// - card-animate
// - hover-lift
// - hover-scale
// - scroll-reveal
// - attention-pulse
// - attention-wiggle
// - attention-shake
```

### Test Scroll Reveal
```javascript
// Find scroll-reveal elements
const reveals = document.querySelectorAll('.scroll-reveal');

// Manually trigger visibility
reveals.forEach(el => el.classList.add('visible'));

// Clear visibility
reveals.forEach(el => el.classList.remove('visible'));
```

### Create Custom Animation
```javascript
// Add element
const div = document.createElement('div');
div.textContent = '🎉 Animated!';
div.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #6bcb77;
  color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 9999;
  animation: slideInUp 400ms ease-out forwards;
`;
document.body.appendChild(div);

// Remove after animation
setTimeout(() => div.remove(), 1000);
```

---

## 🗺️ Map Interactions

### Control Map
```javascript
// Get map instance
const map = window.map;

// Zoom controls
map.zoomIn();    // Zoom in one level
map.zoomOut();   // Zoom out one level
map.setZoom(15); // Set specific zoom level

// Pan to location
map.setView([53.4530, 14.5520], 15);

// Fly to location (with animation)
map.flyTo([53.4530, 14.5520], 15, { duration: 2 });

// Get current center and zoom
console.log('Center:', map.getCenter());
console.log('Zoom:', map.getZoom());
```

### Test Marker Interactions
```javascript
// Find all markers
const markers = window.state.markers;
console.log(`Found ${markers.length} markers`);

// Click a marker to open popup
if (markers.length > 0) {
  markers[0].openPopup();
}

// Get marker data
markers.forEach((marker, i) => {
  console.log(`Marker ${i}:`, marker.placeData);
});
```

---

## 📊 State Management

### Check App State
```javascript
// Get full app state
console.log('App State:', window.state);

// Check specific properties
console.log('Current Section:', window.state.currentSection);
console.log('Current Category:', window.state.currentCat);
console.log('Dark Mode:', window.state.isDark);
console.log('User Location:', {
  lat: window.state.userMarker ? window.state.userMarker.getLatLng() : null
});
```

### Navigate to Section
```javascript
// Go to different sections
navigateTo('map');       // Map
navigateTo('places');    // Places
navigateTo('routes');    // Routes
navigateTo('info');      // Info
navigateTo('transport'); // Transport
navigateTo('events');    // Events
navigateTo('community'); // Community
```

### Filter Markers
```javascript
// Filter by category
filterMarkers('all');      // Show all
filterMarkers('sport');    // Sports
filterMarkers('food');     // Food & Dining
filterMarkers('shop');     // Shopping
filterMarkers('park');     // Parks
filterMarkers('service');  // Services
filterMarkers('edu');      // Education
```

---

## 🎯 Debugging Commands

### Check for Errors
```javascript
// See all console errors
console.log(window.__errors__ || 'No recorded errors');

// Monitor for future errors
window.addEventListener('error', (e) => {
  console.error('❌ Error:', e.error);
});
```

### Monitor Performance in Real-time
```javascript
// Start performance monitoring
console.time('App Initialization');

// ... do something ...

// End timing
console.timeEnd('App Initialization');

// Monitor specific function
console.time('fetchData');
// fetch data...
console.timeEnd('fetchData');
```

### Test Accessibility
```javascript
// Check all interactive elements for accessibility
document.querySelectorAll('button, a, input').forEach(el => {
  const hasAriaLabel = el.hasAttribute('aria-label');
  const hasTitle = el.hasAttribute('title');
  const hasContent = el.textContent.trim() !== '';
  
  if (!hasAriaLabel && !hasTitle && !hasContent) {
    console.warn('⚠️ Element lacks accessibility info:', el);
  }
});

// Check focus management
console.log('Can you tab through all interactive elements?');
console.log('Focus moves logically? (should follow visual order)');
console.log('Focus indicators visible? (usually outline or border)');
```

---

## 🔧 Module Status

### Check Module Initialization
```javascript
// Check if modules are loaded
console.log('MobileNavEnhance:', typeof MobileNavEnhance !== 'undefined' ? '✅' : '❌');
console.log('MobileOptimizations:', typeof MobileOptimizations !== 'undefined' ? '✅' : '❌');
console.log('MobileGestures:', typeof MobileGestures !== 'undefined' ? '✅' : '❌');
console.log('UIPolishEnhancements:', typeof UIPolishEnhancements !== 'undefined' ? '✅' : '❌');
console.log('PerfMonitor:', typeof PerfMonitor !== 'undefined' ? '✅' : '❌');
```

### Test All Modules
```javascript
// Run quick tests on all modules
console.log('=== Module Tests ===');

// Mobile Nav
console.log('1. Mobile Nav — triggering haptic...');
MobileNavEnhance.triggerHapticFeedback('light');
console.log('✓ Mobile Nav OK');

// Optimizations
console.log('2. Optimizations — checking device...');
const info = MobileOptimizations.getDeviceInfo();
console.log('Device:', info);
console.log('✓ Optimizations OK');

// Gestures
console.log('3. Gestures — listening for events...');
document.addEventListener('gesture:swipeleft', () => console.log('Swipe detected'));
console.log('✓ Gestures OK');

// UI Polish
console.log('4. UI Polish — testing tooltips...');
const btn = document.querySelector('button');
if (btn) UIPolishEnhancements.showTooltip(btn);
console.log('✓ UI Polish OK');

console.log('=== All Modules OK ===');
```

---

## 💡 Pro Tips

### Quick Performance Check
```javascript
// Copy-paste this one-liner for quick performance summary
console.log(`📊 Performance: ${performance.timing.loadEventEnd - performance.timing.navigationStart}ms load | ${navigator.deviceMemory || '?'}GB memory | ${navigator.hardwareConcurrency || '?'} cores`);
```

### Disable Animations for Testing
```javascript
// Temporarily disable all animations (useful for testing)
document.documentElement.style.setProperty('--animation-duration', '0s');

// Re-enable animations
document.documentElement.style.removeProperty('--animation-duration');
```

### Monitor Touch Events
```javascript
// Log all touch events
['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(event => {
  document.addEventListener(event, (e) => {
    console.log(`📱 ${event}:`, e.touches.length, 'touches');
  });
});
```

### Simulate Low-End Device
```javascript
// Force low-end device detection
Object.defineProperty(navigator, 'deviceMemory', { value: 2 });

// Then reload modules
MobileOptimizations.init();
```

---

## 🚀 Testing Workflow

1. **Open DevTools:** F12 or Ctrl+Shift+I
2. **Go to Console tab**
3. **Copy-paste any command above**
4. **Press Enter to execute**
5. **Check results in console output**

---

## 📝 Common Use Cases

### "I want to test haptic feedback on my phone"
```javascript
// Run in console on phone (with browser DevTools over USB or local proxy)
MobileNavEnhance.triggerHapticFeedback('medium');
// Your phone should vibrate
```

### "I want to see if animations are smooth"
```javascript
// Open DevTools → Performance tab → Record
// Perform animations (scroll, click, etc)
// Stop recording → check FPS (should be 60fps)
```

### "I want to debug gesture recognition"
```javascript
// Add listeners
['gesture:swipeleft', 'gesture:swiperight', 'gesture:swipeup', 'gesture:swipedown'].forEach(event => {
  document.addEventListener(event, (e) => console.log('🎯 Gesture:', e.detail.gesture));
});
// Now perform gestures and see console output
```

### "I want to test on a real device"
```javascript
// On desktop: Get local IP (ipconfig /all on Windows)
// On device: Open http://[your-ip]:3000 in browser
// Use console commands same way as desktop
```

---

**Happy debugging! 🐛✨**

---

*Last Updated: June 3, 2026*  
*For latest updates, check browser console for version info*
