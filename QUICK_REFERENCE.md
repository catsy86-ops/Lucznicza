# 🚀 Quick Reference — Enhancements API

**Bookmark this for quick access to all enhancement APIs!**

---

## 📱 Mobile Navigation API

```javascript
// Haptic Feedback (vibration)
MobileNavEnhance.triggerHapticFeedback('light');   // 10ms
MobileNavEnhance.triggerHapticFeedback('medium');  // 20-10-20ms pattern
MobileNavEnhance.triggerHapticFeedback('heavy');   // 50-30-50ms pattern

// Nav Control
MobileNavEnhance.hideNav();    // Hide bottom navigation
MobileNavEnhance.showNav();    // Show bottom navigation

// Module Status
console.log(MobileNavEnhance); // View module state
```

---

## ⚡ Performance API

```javascript
// Device Information
const info = MobileOptimizations.getDeviceInfo();
console.log(info.isLowEnd);       // Boolean: low-end device?
console.log(info.reducedMotion);  // Boolean: prefers reduced motion?
console.log(info.connection);     // String: '3g', '4g', etc
console.log(info.memory);         // Number: GB or 'unknown'
console.log(info.cores);          // Number: CPU cores

// Check Capabilities
MobileOptimizations.isLowEnd();        // → boolean
MobileOptimizations.hasReducedMotion(); // → boolean

// Animation Control
MobileOptimizations.setAnimationOptimization(true);  // Enable/disable
```

---

## 👆 Gesture Events

```javascript
// Listen for Gestures
document.addEventListener('gesture:swipeleft', (e) => {
  console.log('User swiped left');
});

// Available Gestures:
// gesture:swipeleft     — swipe 50px left
// gesture:swiperight    — swipe 50px right
// gesture:swipeup       — swipe 50px up
// gesture:swipedown     — swipe 50px down
// gesture:longpress     — hold 500ms
// gesture:doubletap     — tap twice within 300ms
// gesture:zoomin        — pinch outward
// gesture:zoomout       — pinch inward
// gesture:drag          — drag element
```

---

## 🎨 UI Polish API

```javascript
// Tooltips
UIPolishEnhancements.showTooltip(element);
UIPolishEnhancements.hideTooltip(element);

// HTML Attribute Method
<button data-tooltip="Help text">Button</button>
<button data-tooltip="Success!" data-tooltip-variant="success">Done</button>

// Tooltip Variants
data-tooltip-variant="default"   // black background (default)
data-tooltip-variant="success"   // green background
data-tooltip-variant="error"     // red background
data-tooltip-variant="warning"   // yellow background
data-tooltip-variant="info"      // purple background
```

---

## 🎬 Animation Classes

```html
<!-- Use these classes for animations -->
<div class="card-animate">Animates on load</div>
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="scroll-reveal">Reveals on scroll</div>
<div class="attention-pulse">Pulses for attention</div>
<div class="attention-wiggle">Wiggles</div>
<button class="btn-pulse">Pulsing button</button>
<button class="btn-spin">Spinning button</button>
```

---

## ⚙️ Configuration

```javascript
// Mobile Navigation Config (in mobile-nav-enhance.js)
config.enableHaptics = true;           // Vibrations on/off
config.scrollThreshold = 80;           // px to scroll before hide
config.animationDuration = 250;        // ms for animations
config.mobileBreakpoint = 480;         // px for mobile/desktop

// Mobile Optimizations Config (in mobile-optimizations.js)
config.enableLazyLoad = true;          // Image lazy loading
config.enableAnimationOptimization = true;
config.reduceMotionOnLowEnd = true;
config.imageLazyLoadThreshold = '50px';

// Mobile Gestures Config (in mobile-gestures.js)
config.swipeThreshold = 50;            // px for swipe detection
config.longPressDelay = 500;           // ms for long press
config.doubleTapDelay = 300;           // ms between taps
config.pinchThreshold = 50;            // px for pinch detection
```

---

## 🧪 Quick Tests

```javascript
// Test All Modules
console.log('✅ MobileNavEnhance:', typeof MobileNavEnhance);
console.log('✅ MobileOptimizations:', typeof MobileOptimizations);
console.log('✅ MobileGestures:', typeof MobileGestures);
console.log('✅ UIPolishEnhancements:', typeof UIPolishEnhancements);

// Test Haptic Feedback
MobileNavEnhance.triggerHapticFeedback('heavy');
// Your device should vibrate

// Test Device Info
console.log(MobileOptimizations.getDeviceInfo());

// Test Animation
document.querySelector('.place-card').classList.add('card-animate');

// Test Gesture (on mobile)
document.addEventListener('gesture:swipeleft', () => {
  console.log('👈 Left swipe detected!');
});
```

---

## 🎯 Common Patterns

### Haptic Feedback on Custom Event
```javascript
document.addEventListener('gesture:doubletap', (e) => {
  MobileNavEnhance.triggerHapticFeedback('medium');
  // Do something on double-tap
});
```

### Optimize for Low-End Devices
```javascript
if (MobileOptimizations.isLowEnd()) {
  console.log('Running on low-end device');
  // Use simpler animations, reduce content
}
```

### Respect Motion Preferences
```javascript
if (MobileOptimizations.hasReducedMotion()) {
  // Disable animations or use simpler ones
  element.style.animation = 'none';
}
```

### Add Custom Tooltip
```javascript
const btn = document.querySelector('button');
btn.setAttribute('data-tooltip', 'Click me!');
btn.setAttribute('data-tooltip-variant', 'success');
```

### Listen for Multiple Gestures
```javascript
['swipeleft', 'swiperight', 'swipeup', 'swipedown'].forEach(gesture => {
  document.addEventListener(`gesture:${gesture}`, (e) => {
    console.log(`User performed: ${gesture}`);
  });
});
```

---

## 📊 Performance Metrics

```javascript
// Get Performance Metrics
const metrics = PerfMonitor.getMetrics();
console.log(metrics.pageLoad);     // ms - total page load time
console.log(metrics.firstPaint);   // ms - DOM ready time
console.log(metrics.lcp);          // ms - Largest Contentful Paint
console.log(metrics.fid);          // ms - First Input Delay
console.log(metrics.cls);          // number - Cumulative Layout Shift
console.log(metrics.apiCalls);     // array - tracked API calls
```

---

## 🔍 Debugging Tips

```javascript
// Enable debugging for module
window.DEBUG_ENHANCEMENTS = true;

// Check module initialization order
const scripts = document.querySelectorAll('script[defer]');
scripts.forEach(s => console.log(s.src)); // Shows load order

// Monitor FPS in real-time
let frame = 0;
const startTime = performance.now();
function countFps() {
  frame++;
  requestAnimationFrame(countFps);
}
countFps();
setTimeout(() => {
  const elapsed = performance.now() - startTime;
  console.log(`FPS: ${(frame / (elapsed / 1000)).toFixed(0)}`);
}, 1000);

// Monitor touch events
document.addEventListener('touchstart', (e) => {
  console.log(`👇 Touch: ${e.touches.length} fingers`);
}, true);
```

---

## 🚨 Error Handling

```javascript
// All modules have built-in error handling
// If something fails, it logs to console but doesn't crash

// Check for errors
try {
  MobileNavEnhance.triggerHapticFeedback('light');
} catch (e) {
  console.error('Haptic feedback failed:', e);
}

// Fallback if module not loaded
if (typeof MobileNavEnhance !== 'undefined') {
  MobileNavEnhance.triggerHapticFeedback('light');
} else {
  console.warn('MobileNavEnhance not loaded');
}
```

---

## 📱 Mobile-Specific

```javascript
// Check if touch device
const isTouch = () => {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
};

// Get viewport height (accounting for mobile keyboard)
const viewportHeight = window.innerHeight;
const viewportWidth = window.innerWidth;

// Detect orientation
const isPortrait = window.innerHeight > window.innerWidth;
const isLandscape = window.innerWidth > window.innerHeight;

// Listen for orientation change
window.addEventListener('orientationchange', () => {
  console.log('Orientation:', window.orientation);
  // 0: portrait, ±90: landscape
});
```

---

## 🎮 Control Flow

```javascript
// Typical User Flow with Enhancements
1. Page loads → all modules auto-initialize
2. Device capabilities auto-detected
3. Animations auto-optimized based on device
4. User touches → haptic feedback + ripple
5. User swipes → gesture event dispatched
6. Module responds → haptic + visual feedback
7. Animation plays → smooth 60fps
8. Mobile preference respected → animations adapt
```

---

## 📚 Resources

- **Full Documentation:** `ENHANCEMENTS_SUMMARY_2024.md`
- **Console Commands:** `CONSOLE_COMMANDS_GUIDE.md`
- **Testing Guide:** `FINAL_ENHANCEMENTS_CHECKLIST.md`
- **User Guide:** `MOBILE_NAV_START_HERE.md`

---

## 🎯 Cheat Sheet

| Want To... | Code |
|-----------|------|
| Vibrate phone | `MobileNavEnhance.triggerHapticFeedback('light')` |
| Hide nav | `MobileNavEnhance.hideNav()` |
| Check device | `MobileOptimizations.getDeviceInfo()` |
| Listen for swipe | `document.addEventListener('gesture:swipeleft', ...)` |
| Show tooltip | `UIPolishEnhancements.showTooltip(element)` |
| Animate element | `element.classList.add('card-animate')` |
| Check FPS | Check DevTools Performance tab |
| Debug module | Open console, call `console.log(MobileNavEnhance)` |

---

**Print this page as reference! 📋**

---

*Last Updated: June 3, 2026*  
*Part of Niebuszewo Guide v2.0.0 - Enhanced Edition*
