# 🔧 Mobile Navigation — Configuration Guide

## Quick Start

Moduł ładuje się automatycznie z `index.html`. Nie wymaga żadnej konfiguracji.

```html
<script src="mobile-nav-enhance.js" defer></script>
```

## Configuration Options

Otwórz `mobile-nav-enhance.js` i edytuj `config` object:

```javascript
const config = {
  enableHaptics: true,           // Włącz/wyłącz wibracje (boolean)
  scrollThreshold: 80,           // Min pixel scroll do hide/show nav (number)
  animationDuration: 250,        // Czas animacji w ms (number)
  mobileBreakpoint: 480,         // Mobile/desktop breakpoint w px (number)
};
```

### Detailing Each Option

#### `enableHaptics: true` 
Włącza wibracje (haptic feedback) na urządzeniach, które je wspierają.

**Możliwe wartości:**
- `true` — Włączone (domyślnie)
- `false` — Wyłączone

**Wpływ:**
- Light click: 10ms vibration
- Medium action: 20-10-20ms pattern
- Heavy action: 50-30-50ms pattern

---

#### `scrollThreshold: 80`
Minimalna liczba pixeli scroll do aktywacji hide/show.

**Możliwe wartości:**
- `40` — Wrażliwy (pokaż/schowaj co 40px)
- `80` — Normalny (domyślnie, co 80px)
- `150` — Nieczuły (co 150px)

**Wpływ:**
- Mniejsza wartość = bardziej responsywny
- Większa wartość = mniej "flickering"

---

#### `animationDuration: 250`
Czas trwania animacji pokazania/schowania nawigacji.

**Możliwe wartości:**
- `150` — Szybko
- `250` — Normalnie (domyślnie)
- `400` — Powoli

**Wpływ:**
- Mniejsza wartość = bardziej snappy
- Większa wartość = bardziej smooth

---

#### `mobileBreakpoint: 480`
Punkt przejścia z mobile na desktop.

**Możliwe wartości:**
- `480` — iPhone standard (domyślnie)
- `768` — iPad portrait
- `600` — Custom breakpoint

**Wpływ:**
- Pod tym breakpointem = mobile UI
- Nad tym breakpointem = desktop UI

---

## API Reference

### Methods

#### `MobileNavEnhance.init()`
Inicjalizuje moduł. Uruchamia się automatycznie.

```javascript
MobileNavEnhance.init();
```

---

#### `MobileNavEnhance.triggerHapticFeedback(type)`
Wyzwala wibracje ręcznie.

```javascript
MobileNavEnhance.triggerHapticFeedback('light');      // 10ms
MobileNavEnhance.triggerHapticFeedback('medium');     // 20-10-20ms
MobileNavEnhance.triggerHapticFeedback('heavy');      // 50-30-50ms
```

**Parametry:**
- `type` (string): `'light'`, `'medium'`, `'heavy'`

**Returns:** `undefined`

---

#### `MobileNavEnhance.hideNav()`
Schowa nawigację z animacją.

```javascript
MobileNavEnhance.hideNav();
```

**Returns:** `undefined`

---

#### `MobileNavEnhance.showNav()`
Pokaże nawigację z animacją.

```javascript
MobileNavEnhance.showNav();
```

**Returns:** `undefined`

---

## CSS Classes & Selectors

### Bottom Navigation
```css
.bottom-nav              /* Main container */
.bnav-btn                /* Individual button */
.bnav-btn.active         /* Active state */
.bnav-btn:hover          /* Hover state */
.bnav-btn:active         /* Pressed state */
```

### Custom Styles

Override style.css properties:

```css
/* Zmień kolor aktywnego przycisku */
:root {
  --accent: #6c63ff; /* Zmień tutaj */
}

/* Zmień wysokość nawigacji */
.bottom-nav {
  height: 80px !important; /* Nowa wysokość */
}

/* Zmień animację */
.bnav-btn {
  transition: all 0.5s ease !important; /* Nowa duration */
}
```

---

## Events

### Custom Event: `nav-changed`

Wyemiittowany gdy zmienia się sekcja nawigacji.

```javascript
window.addEventListener('nav-changed', (e) => {
  console.log('Obecna sekcja:', e.detail.section);
});
```

---

## Advanced Usage

### Disable Auto Hide/Show

Jeśli chcesz wyłączyć scroll-based hide/show:

```javascript
// W mobile-nav-enhance.js, zakomentuj:
// setupScrollBehavior();
```

### Custom Animation Timing

```javascript
// Edytuj w config:
config.animationDuration = 400;  // Bardziej smooth

// Albo zmień CSS:
.bottom-nav {
  transition: transform 400ms cubic-bezier(...) !important;
}
```

### Customize Haptic Patterns

```javascript
// W setupNavButtons() zmień:
triggerHapticFeedback('medium');  // Na 'light' lub 'heavy'
```

---

## Debugging

### Enable Debug Logs

W console (F12):

```javascript
// Check if module initialized
console.log(MobileNavEnhance);

// Trigger actions manually
MobileNavEnhance.showNav();
MobileNavEnhance.hideNav();

// Test haptic feedback
MobileNavEnhance.triggerHapticFeedback('heavy');
```

### Check Browser Support

```javascript
// Check vibration API
console.log('Haptic support:', !!navigator.vibrate);

// Check backdrop-filter support
const div = document.createElement('div');
console.log('Backdrop-filter:', 
  CSS.supports('backdrop-filter', 'blur(20px)')
);
```

---

## Performance Tuning

### Reduce Animation Duration
```javascript
config.animationDuration = 150;  // Faster
```

### Increase Scroll Threshold
```javascript
config.scrollThreshold = 150;  // Less sensitive
```

### Disable Haptics on Low Battery
```javascript
if (navigator.getBattery) {
  navigator.getBattery().then(battery => {
    config.enableHaptics = battery.level > 0.2;
  });
}
```

---

## Troubleshooting

### Nav doesn't hide on scroll
✅ Check if `scrollThreshold` is too high
✅ Verify `enableHaptics` doesn't interfere
✅ Check console for errors

### Haptic feedback not working
✅ Check if device supports it: `navigator.vibrate`
✅ Check if `enableHaptics: true`
✅ On iPhone: Settings → Sounds & Haptics

### Buttons not responding
✅ Check if scroll behavior is active
✅ Try `MobileNavEnhance.showNav()`
✅ Refresh page and test again

---

## Mobile Devices

### iPhone
- ✅ Haptic feedback: Supported (via Taptic Engine)
- ✅ Gestures: Full support
- ✅ Animations: Smooth 60fps

### Android
- ✅ Haptic feedback: Supported (if device has vibrator)
- ✅ Gestures: Full support
- ✅ Animations: Smooth 60fps

### iPad
- ✅ All features supported
- ✅ Optimized for tablet size
- ✅ Touch targets properly sized

---

## Production Checklist

- [ ] `enableHaptics` set correctly for your audience
- [ ] `scrollThreshold` tuned for app speed
- [ ] `animationDuration` feels natural
- [ ] Test on actual devices
- [ ] Verify accessibility (keyboard, screen readers)
- [ ] Check performance on low-end devices
- [ ] Test with network throttling
- [ ] Monitor console for errors

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `MOBILE_NAV_ENHANCEMENT.md` for full documentation
3. Test in browser console with `MobileNavEnhance` API
4. Check browser compatibility

---

**Last Updated:** June 3, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
