# Map Enhancements UI Integration Guide

## Overview

The **Map Enhancements UI** (`map-enhancements-ui.js`) is a unified control panel that manages all 9 advanced map visualization modules. It provides a floating toolbar at the bottom-left of the map with quick-access buttons and keyboard shortcuts for seamless interaction.

## Components

### 1. Floating Toolbar
- **Location**: Bottom-left corner of the map
- **Status**: Collapsible/expandable via ⚙️ toggle button
- **Features**:
  - Module activity badge (shows count of active modules)
  - Smooth animations and transitions
  - Responsive design (labels hidden on mobile)
  - Persistent localStorage saving

### 2. Module Buttons (9 total)

Each module is represented by an emoji icon and label:

| Icon | Module | Key | Description |
|------|--------|-----|-------------|
| 🏔️ | **Elevation** | E | Contour lines, relief shading, terrain overlays |
| 🌤️ | **Weather** | W | Precipitation radar, temperature zones, wind |
| ↩️ | **History** | H | Navigation history, map state bookmarks |
| ⭐ | **Ratings** | R | Heatmap aggregation by user ratings |
| 🚶 | **Popular Routes** | T | Community-trending walking/biking/running routes |
| ⚠️ | **Hazards** | Z | Road hazards, accidents, construction zones |
| ✏️ | **Drawing** | D | Freehand route drawing and saving |
| 🔔 | **Notifications** | N | Real-time alerts for nearby events |
| 🌙 | **Dark Mode** | Y | Automatic day/night theme switching |

### 3. Keyboard Shortcuts

Press a single key (when not in text input) to toggle a module:

```
E — Elevation Layer
W — Weather Overlay
H — History & Bookmarks
R — Ratings Heatmap
T — Trasy (Popular Routes)
Z — haZards
D — Drawing Mode
N — Notifications Radar
Y — darkmode (Night theme)
```

**Note**: Shortcuts only work when the map is focused and the input field is not active.

## UI Elements

### Toggle Button (⚙️)
- **Click** to expand/collapse the module buttons
- **Active state** shows blue accent when expanded
- **Badge**: Shows count of active modules (0-9)

### Module Buttons
- **Default state**: Gray button with icon and label
- **Active state**: Blue accent background with checkmark (✓) status indicator
- **Hover**: Lighter background for better visibility
- **Mobile**: Labels hidden, only icons visible (44px square)

### Status Indicator
- **Position**: Top-left of each button
- **Shows**: ✓ when module is enabled
- **Color**: Bright green (#43e97b)

## Features

### Auto-Detection & Binding
The UI automatically detects and binds to the following module functions:
- `MapElevation.toggle()`
- `MapWeatherOverlay.toggle()`
- `MapHistory.toggle()`
- `MapRatingsHeatmap.toggle()`
- `MapPopularRoutes.toggle()`
- `MapHazardZones.toggle()`
- `MapDrawing.toggle()`
- `MapNotificationsRadar.toggle()`
- `MapDarkMode.toggle()`

If a module is not loaded or doesn't expose a `.toggle()` function, its button is skipped.

### localStorage Persistence
User preferences are automatically saved and restored:
- **Key**: `mapEnhancementsPrefs`
- **Format**: JSON object with boolean flags for each module
- **Auto-save**: Triggered after each module toggle
- **Auto-load**: Runs on page initialization

```json
{
  "elevation": false,
  "weather": true,
  "history": false,
  "ratings": true,
  "routes": true,
  "hazards": false,
  "drawing": false,
  "notifications": true,
  "darkMode": false
}
```

### Toast Notifications
Each module toggle shows a toast message:
- **Format**: `[emoji] [module-name]: [status]`
- **Example**: `🌤️ Pogoda: Włączone` (Weather: Enabled)
- **Duration**: 3 seconds (auto-dismiss)
- **Falls back gracefully** if `showToast()` function is unavailable

## Programmatic Control

### API Methods

```javascript
// Initialize the toolbar and bind modules
MapEnhancementsUI.init(map);

// Toggle a specific module
MapEnhancementsUI.toggleModule(key, buttonElement);

// Enable a module
MapEnhancementsUI.enableModule('weather');

// Disable a module
MapEnhancementsUI.disableModule('hazards');

// Get status of all modules
const status = MapEnhancementsUI.getStatus();
// Returns: { elevation: {name, enabled}, weather: {...}, ... }

// Save preferences to localStorage
MapEnhancementsUI.savePreferences();

// Load preferences from localStorage
MapEnhancementsUI.loadPreferences();

// Toggle toolbar visibility
MapEnhancementsUI.toggleToolbar();
```

### Example Usage

```javascript
// Enable weather and routes on page load
window.addEventListener('map-ready', () => {
  MapEnhancementsUI.enableModule('weather');
  MapEnhancementsUI.enableModule('routes');
});

// Monitor active modules
setInterval(() => {
  const status = MapEnhancementsUI.getStatus();
  console.log('Active modules:', 
    Object.entries(status)
      .filter(([_, m]) => m.enabled)
      .map(([_, m]) => m.name)
  );
}, 5000);
```

## Integration Timeline

1. **DOM Ready** (DOMContentLoaded)
   - Toolbar HTML created
   - Buttons initialized
   - Keyboard shortcuts registered

2. **Map Ready** (map-ready event or window.map available)
   - Modules bound and initialized
   - Preferences loaded from localStorage

3. **User Interaction**
   - Click button → toggle module
   - Press keyboard shortcut → toggle module
   - Module state changes → save to localStorage

## Styling & Customization

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.map-enhancements-toolbar` | Container |
| `.enh-toggle-btn` | Toggle button (⚙️) |
| `.enh-buttons-container` | Buttons wrapper |
| `.enh-btn` | Individual module button |
| `.enh-btn.active` | Active state styling |
| `.enh-count-badge` | Activity counter |

### CSS Variables (from style.css)
```css
--accent: #6c63ff;        /* Primary color (blue) */
--surface: #1e1e35;       /* Button background */
--surface2: #252545;      /* Hover background */
--border: rgba(255,255,255,0.08);
--text: #e8e8f0;
--text2: #9999bb;
--radius-sm: 10px;
--transition: 0.3s cubic-bezier(0.4,0,0.2,1);
```

### Dark & Light Themes
The UI automatically respects the app's theme setting:
- **Dark Mode** (default): Blue toggle, dark buttons
- **Light Mode** ([data-theme="light"]): Adjusted colors for readability

### Mobile Responsive
- **Desktop (>480px)**: Full labels + icons
- **Mobile (≤480px)**: Icons only, buttons 44x44px

## Troubleshooting

### Issue: Module button doesn't toggle
**Solution**: Check browser console for errors. Verify module's `.toggle()` function exists.
```javascript
console.log(window.MapElevation); // Should show an object with toggle method
```

### Issue: Preferences not saving
**Solution**: Verify localStorage is not full or disabled:
```javascript
try {
  localStorage.setItem('test', 'value');
  localStorage.removeItem('test');
  console.log('✅ localStorage available');
} catch (e) {
  console.error('❌ localStorage error:', e);
}
```

### Issue: Keyboard shortcuts not working
**Solution**: Ensure the map element is focused (not an input field):
```javascript
// Test: press 'E' while this runs
document.addEventListener('keydown', (e) => {
  console.log(`Key pressed: ${e.key}, Target: ${e.target.tagName}`);
});
```

### Issue: Toolbar not appearing
**Solution**: Verify the script loaded and map element exists:
```javascript
console.log('Toolbar exists:', document.getElementById('mapEnhancementsToolbar'));
console.log('Map exists:', document.getElementById('map'));
console.log('MapEnhancementsUI:', window.MapEnhancementsUI);
```

## Performance Considerations

- **Lightweight**: ~8KB JavaScript + ~3KB CSS
- **No DOM thrashing**: Uses efficient event delegation
- **Lazy initialization**: Modules only initialized when toggled
- **localStorage quota**: ~5-10KB for typical preferences
- **Browser support**: All modern browsers (ES6+)

## Accessibility

- **ARIA attributes**: `role="toolbar"`, `aria-expanded`, `aria-label`
- **Keyboard navigation**: Full keyboard shortcut support
- **Focus management**: Proper focus states for keyboard users
- **Screen readers**: Descriptive labels and status updates
- **Color contrast**: WCAG AA compliant colors

## File Structure

```
├── map-enhancements-ui.js (350 lines)
│   ├── Module detection & binding
│   ├── Toolbar creation
│   ├── Button event handling
│   ├── Keyboard shortcuts
│   └── localStorage persistence
│
├── style.css (additions)
│   ├── .map-enhancements-toolbar
│   ├── .enh-toggle-btn
│   ├── .enh-btn
│   └── Responsive & theme variants
│
└── index.html
    └── <script src="map-enhancements-ui.js" defer></script>
```

## Integration Checklist

- ✅ `map-enhancements-ui.js` created and linked
- ✅ CSS styles added to `style.css`
- ✅ Script loaded in `index.html` (after map modules, before `app.js`)
- ✅ All 9 map modules present and loaded
- ✅ `showToast()` function available in `app.js`
- ✅ `map` object exposed globally after `initMap()`

## Next Steps

1. **Test in browser**:
   - Open DevTools (F12)
   - Click ⚙️ button to expand toolbar
   - Click each module button (should see toast notification)
   - Press keyboard shortcuts (E, W, H, R, T, Z, D, N, Y)

2. **Verify localStorage**:
   - Open DevTools → Application → localStorage
   - Look for `mapEnhancementsPrefs` key
   - Enable/disable modules, refresh page
   - Preferences should persist

3. **Monitor performance**:
   - Open DevTools → Performance tab
   - Record interaction (toggle modules)
   - Check for smooth 60fps transitions

4. **User feedback**:
   - Test with actual users
   - Collect feedback on keyboard shortcuts
   - Iterate on UI/UX if needed

## Version History

- **v1.0** (June 2026): Initial release
  - 9 module integration
  - Keyboard shortcuts (E, W, H, R, T, Z, D, N, Y)
  - localStorage persistence
  - Responsive mobile design
  - Dark/light theme support

## Author & License

Part of Szczecin/Łucznicza Interactive Guide (2026)
Open-source contribution for local community mapping.
