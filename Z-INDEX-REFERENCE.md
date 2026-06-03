# 🎨 Z-INDEX COMPLETE REFERENCE & VISUAL GUIDE

## 📐 Z-INDEX HIERARCHY CHART

```
┌──────────────────────────────────────────────────┐
│                    99999                         │
│             Skip Link (Accessibility)            │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    9999                          │
│         Splash Screen (Loading)                  │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    500+                          │
│  Network Status, Critical System Messages        │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    400+                          │
│  Toast Notifications (360)                      │
│  Alert Messages                                 │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    350+                          │
│  Transport Panel (350) ← CRITICAL FIX            │
│  Floating Dialogs                               │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    300+                          │
│  Main Modals (300)                              │
│  Pull-to-Refresh (250)                          │
│  Modal Overlays (299)                           │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    200+                          │
│  Sidebar (201)                                  │
│  Sidebar Overlay (200)                          │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    100                           │
│  MAIN STRUCTURE - Header & Bottom Nav           │
│  (Cannot be overridden by content)              │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    95                            │
│  Search Bar (when visible)                      │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    50-60                         │
│  Minimal Controls (50)                          │
│  Clean Info Card (49)                           │
├──────────────────────────────────────────────────┤
│  These float above map widgets                  │
│  Can be repositioned on mobile                  │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    30-49                         │
│  Info Cards, Hover States                       │
│  Dynamic Content                                │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    20-29                         │
│  Category Filter (20)                           │
│  Map Tools (25)                                 │
│  Tool Groups & Menus                           │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    10-20                         │
│  Map Widgets:                                   │
│  - Map Legend (11)                              │
│  - Map Stats (12)                               │
│  - Weather Widget (13)                          │
│  - Clock Widget (14)                            │
│  - AQI Widget (15)                              │
│  - Map Controls (16)                            │
└──────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────┐
│                    0-9                           │
│  Leaflet Map Tiles & Base Layers                │
└──────────────────────────────────────────────────┘
```

---

## 📋 COMPLETE Z-INDEX TABLE

| Z-Index | Element | Purpose | Notes |
|---------|---------|---------|-------|
| 99999 | `.skip-link` | Accessibility | Top-most, hidden until focused |
| 9999 | `#splash` | Splash screen | Loading animation |
| 500 | `.network-status` | Network indicator | Online/offline status |
| 400-499 | `.toast` (z-360) | Toast notifications | User feedback (z-360 above transport) |
| 350 | `#transportPanelContainer` | Transport panel | Departures display ⭐ FIXED |
| 300 | `.modal-overlay` (z-299) | Modal overlay | Semi-transparent background |
| 300 | `.modal` | Modal dialog | Above overlay |
| 301 | `.modal-close` | Modal close button | Must be above modal content |
| 250 | `.pull-refresh-indicator` | Pull-to-refresh | Refresh indicator |
| 201 | `.sidebar` | Navigation sidebar | Slides in from left |
| 200 | `.sidebar-overlay` | Sidebar overlay | Darkens background |
| 100 | `.header` | Main header | Fixed top navigation |
| 100 | `.bottom-nav` | Bottom navigation | Fixed bottom navigation |
| 95 | `.search-bar` | Search bar | Below header, above content |
| 50 | `.minimal-controls` | Map controls | Zoom, center, location buttons |
| 49 | `.clean-info-card` | Info card | Szczecin info badge |
| 45 | ~~`.transportPanelContainer`~~ | ~~OLD~~ | **DEPRECATED - now z-350** |
| 40 | ~~`.minimal-controls`~~ | ~~OLD~~ | **DEPRECATED - now z-50** |
| 35 | ~~`.clean-info-card`~~ | ~~OLD~~ | **DEPRECATED - now z-49** |
| 25 | `.map-tools-panel` | Advanced tools | Map tool menu |
| 20 | `.category-filter` | Category filter | Bottom center filter bar |
| 16 | `.map-controls` | Map buttons | Fly, Street View, 3D (hidden on mobile) |
| 15 | `.aqi-widget` | Air quality | Bottom-left AQI indicator |
| 14 | `.clock-widget` | Clock | Time display (hidden on mobile) |
| 13 | `.weather-widget` | Weather | Temperature, conditions |
| 12 | `.map-stats` | Statistics | Place/route/stop counts |
| 11 | `.map-legend` | Legend | Category indicators |
| 10 | Various | Map widgets | Generic map overlays |
| 0-9 | Leaflet tiles | Base map | OpenStreetMap tiles |

---

## 🔧 WHEN TO ADJUST Z-INDEX

### ✅ DO THIS (Correct Approach)
1. Check current Z-index hierarchy
2. Find appropriate layer for new element
3. Use `!important` for overrides
4. Update documentation
5. Run tests: `UIUXTestSuite.runAll()`

### ❌ DON'T DO THIS
- Don't use arbitrary z-index like 999 or 1000
- Don't avoid `!important` when necessary
- Don't skip testing after changes
- Don't add elements above header/bottom nav
- Don't forget mobile responsiveness

---

## 🚨 COMMON Z-INDEX PROBLEMS

### Problem 1: Element Behind Map
**Symptom**: Widget appears but is clickable through from below  
**Cause**: Z-index lower than map (10)  
**Fix**: Set z-index > 10

```javascript
// WRONG
.my-widget { z-index: 5; } // Behind map

// RIGHT
.my-widget { z-index: 20; } // Above map widgets
```

### Problem 2: Element Behind Modal
**Symptom**: Modal open but element still visible/clickable  
**Cause**: Z-index higher than modal (300)  
**Fix**: Set z-index < 300 OR above if intentional

```javascript
// WRONG
.overlay { z-index: 9999; } // Above modal

// RIGHT
.overlay { z-index: 250; } // Below modal
```

### Problem 3: Mobile Overlaps
**Symptom**: Different overlaps on mobile vs desktop  
**Cause**: No media queries for responsive z-index  
**Fix**: Add mobile-specific z-index rules

```javascript
// Mobile fix
@media (max-width: 640px) {
  .my-widget { z-index: 55; } // Move above bottom nav
}
```

### Problem 4: Stacking Context Issues
**Symptom**: Z-index doesn't work as expected  
**Cause**: Parent element creates new stacking context  
**Fix**: Check parent `position`, `transform`, `opacity`

```javascript
// PROBLEM: Parent with position creates context
.container {
  position: relative; z-index: 10;
}
.child {
  z-index: 9999; // Still below .container's siblings
}

// SOLUTION: Move z-index to container
.container { z-index: 50; }
```

---

## 📱 RESPONSIVE Z-INDEX CHANGES

### Mobile < 640px
```css
/* Elements move above bottom nav */
.minimal-controls { 
  top: auto !important; 
  bottom: 80px !important;
  z-index: 55 !important; /* Increased from 50 */
}

.clean-info-card {
  top: 80px !important;
  z-index: 54 !important; /* Increased from 49 */
}

/* Elements hidden */
.map-legend { display: none !important; }
.map-stats { display: none !important; }
.clock-widget { display: none !important; }
```

### Tablet 641-1024px
```css
/* Standard positioning */
.weather-widget { position: fixed; top: 80px; z-index: 13; }
.map-legend { position: fixed; bottom: 88px; z-index: 11; }
.clock-widget { display: block; z-index: 14; }
```

### Desktop 1025px+
```css
/* Full layout */
.weather-widget { position: fixed; top: 80px; z-index: 13; }
.clock-widget { position: fixed; top: 220px; z-index: 14; }
.aqi-widget { position: fixed; bottom: 88px; z-index: 15; }
```

---

## 🧪 TESTING Z-INDEX

### Visual Test
```javascript
// Highlight all positioned elements
UIUXTestSuite.debug(true)

// Should see red borders on all z-indexed elements
// No overlaps = Good!
```

### Programmatic Test
```javascript
// Check specific elements
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');

const headerZ = window.getComputedStyle(header).zIndex;
const modalZ = window.getComputedStyle(modal).zIndex;

console.log(`Header: ${headerZ}, Modal: ${modalZ}`);
// Output: Header: 100, Modal: 300
```

### Conflict Detection
```javascript
// Find z-index conflicts
UIUXTestSuite.highlightZIndexConflicts()

// Shows all z-indexes sorted from highest to lowest
// If duplicates in same layer, there's a conflict
```

---

## 📏 POSITIONING + Z-INDEX REFERENCE

### Fixed Elements (Always Visible)
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
```

### Floating Panels
```css
.modal {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-end;
}

#transportPanelContainer {
  position: fixed;
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 350;
}
```

### Map Widgets (Absolute within Map)
```css
.weather-widget {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 13;
}

.map-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 11;
}
```

---

## 🎯 BEST PRACTICES

### 1. Use Consistent Increments
```javascript
// GOOD: Clear spacing
10, 15, 20, 25, 30... (diff: 5)
100, 150, 200, 250... (diff: 50)

// BAD: Chaotic
10, 40, 15, 9999, 100, 25...
```

### 2. Document Your Layers
```javascript
const Z_INDEX = {
  mapTiles: 0,
  mapWidgets: 10,
  controls: 50,
  header: 100,
  modal: 300,
  toast: 400,
  skipLink: 99999
};
```

### 3. Use !important Judiciously
```javascript
// GOOD: Override for critical fixes
z-index: 350 !important; // Transport panel

// BAD: Overriding everything
* { z-index: 9999 !important; }
```

### 4. Test Responsive
```javascript
// Always test on multiple viewports
// Mobile: 320px, 375px, 640px
// Tablet: 768px, 1024px
// Desktop: 1280px, 1920px
```

### 5. Keep Documentation Updated
```javascript
// When adding new element:
// 1. Assign z-index in correct layer
// 2. Add to this reference
// 3. Run tests
// 4. Document why (if non-obvious)
```

---

## 🔍 DEBUGGING STEPS

### Step 1: Check Visibility
```javascript
const el = document.querySelector('.my-element');
const style = window.getComputedStyle(el);

console.log('Z-Index:', style.zIndex);
console.log('Display:', style.display);
console.log('Position:', style.position);
console.log('Visibility:', style.visibility);
console.log('Opacity:', style.opacity);
```

### Step 2: Check Positioning
```javascript
const rect = el.getBoundingClientRect();
console.log(`Top: ${rect.top}, Left: ${rect.left}`);
console.log(`Bottom: ${rect.bottom}, Right: ${rect.right}`);
console.log(`Width: ${rect.width}, Height: ${rect.height}`);
```

### Step 3: Check Stacking Context
```javascript
const parent = el.parentElement;
const parentStyle = window.getComputedStyle(parent);

console.log('Parent Position:', parentStyle.position);
console.log('Parent Z-Index:', parentStyle.zIndex);
console.log('Parent Transform:', parentStyle.transform);
console.log('Parent Opacity:', parentStyle.opacity);
```

### Step 4: Compare With Others
```javascript
// Find what's blocking your element
const allZIndexed = document.querySelectorAll('[style*="z-index"]');
const sorted = Array.from(allZIndexed)
  .map(el => ({
    selector: el.className,
    zIndex: window.getComputedStyle(el).zIndex
  }))
  .sort((a, b) => b.zIndex - a.zIndex);

console.table(sorted);
```

---

## ✅ VALIDATION CHECKLIST

- [ ] Element has correct z-index for its layer
- [ ] Z-index is higher than elements it should cover
- [ ] Z-index is lower than elements that should cover it
- [ ] Mobile responsive z-index in place
- [ ] No z-index conflicts in same layer
- [ ] No arbitrary high numbers (999, 9999)
- [ ] Documentation updated
- [ ] Tests passing: `UIUXTestSuite.runAll()`
- [ ] Visual test complete
- [ ] No CSS specificity issues

---

## 📞 COMMON QUESTIONS

### Q: Why use !important?
A: To override existing styles precisely. Use sparingly but necessary for UI fixes.

### Q: Can I use higher z-index?
A: Only if needed. Use lowest z-index that works (minimizes conflicts).

### Q: What if I need 3000+?
A: You probably don't. Review your stacking context. Most apps use 0-10000.

### Q: Why can't my button click?
A: Likely covered by element with higher z-index. Check z-index hierarchy.

### Q: Mobile z-index wrong?
A: Add media query. Mobile layout often needs different z-index values.

---

## 🎓 LEARNING RESOURCES

### Understanding Stacking Context
- Positioned elements create context
- Opacity < 1 creates context
- Transform creates context
- Z-index within context, not globally

### Z-Index Best Practices
1. Use layered approach (0-9, 10-99, 100-999, etc.)
2. Document each layer
3. Avoid numbers > 1000 unless necessary
4. Use !important sparingly
5. Test all viewports

### Tools for Debugging
```javascript
// Browser DevTools
- Inspect Element
- Computed Styles
- Element Picker

// Console Commands
UIUXTestSuite.highlightZIndexConflicts()
UIUXTestSuite.debug(true)
UIUXTestSuite.runAll()
```

---

## 🏁 FINAL NOTES

**This reference is the source of truth for the app's z-index system.**

If you're adding a new element:
1. Check this table
2. Assign appropriate z-index
3. Add media queries if needed
4. Update this documentation
5. Run: `UIUXTestSuite.runAll()`
6. Verify: `UIUXTestSuite.testZIndexLayering()`

**Consistency = Predictability = Fewer Bugs**

---

**Version**: 1.0 Final  
**Last Updated**: June 2, 2026  
**Maintained By**: UI/UX Engineering  
**Status**: ✅ Production Reference
