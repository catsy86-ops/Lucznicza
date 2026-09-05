import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Map Refactoring & UI/UX Designer Upgrade Test Suite', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const mapProJs = fs.readFileSync(path.join(rootDir, 'map-pro.js'), 'utf8');
  const mapLayersJs = fs.readFileSync(path.join(rootDir, 'map-layers.js'), 'utf8');
  const mapExtrasJs = fs.readFileSync(path.join(rootDir, 'map-extras.js'), 'utf8');
  const mapExtras2Js = fs.readFileSync(path.join(rootDir, 'map-extras2.js'), 'utf8');
  const mapDarkModeJs = fs.readFileSync(path.join(rootDir, 'map-dark-mode.js'), 'utf8');
  const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

  // 1. Zero 'API key required' Tile Layers
  it('ensures all map tile layers are 100% free and do not use cartocdn requiring API keys', () => {
    // OpenStreetMap as default
    expect(appJs).toContain('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    // Esri Satellite & Dark Canvas (100% free, 0 API keys)
    expect(appJs).toContain('World_Imagery/MapServer');
    expect(appJs).toContain('World_Dark_Gray_Base/MapServer');
    expect(appJs).toContain('tile-cyclosm.openstreetmap.fr');
    expect(appJs).not.toContain('basemaps.cartocdn.com');

    // map-dark-mode.js uses keyless Esri and OSM
    expect(mapDarkModeJs).toContain('World_Dark_Gray_Base');
    expect(mapDarkModeJs).not.toContain('basemaps.cartocdn.com');

    // map-pro.js includes keyless styles
    expect(mapProJs).toContain('Ciemna (Esri)');
    expect(mapProJs).toContain('Rowerowa');
    expect(mapProJs).toContain('OpenStreetMap');

    // Service Worker caches open providers
    expect(swJs).toContain('tile.openstreetmap.org');
    expect(swJs).toContain('cyclosm.openstreetmap.fr');
    expect(swJs).toContain('arcgisonline.com/ArcGIS');
  });

  // 2. UI/UX: Zero Collision Layout & Sizing
  it('verifies non-colliding layout coordinates for all map floating elements', () => {
    // Top stack: Search (top: 10px), Categories (top: 52px), Presets (top: 92px)
    expect(styleCss).toContain('top: 10px; left: 50%');
    expect(styleCss).toContain('top: 52px; left: 50%');
    expect(styleCss).toContain('top: 92px;');

    // Top-left: Weather widget compact
    expect(styleCss).toContain('calc(var(--header-h, 64px) + 12px); left: 14px;');

    // Top-right: Clock widget compact & Stats panel
    expect(styleCss).toContain('calc(var(--header-h, 64px) + 12px); right: 14px;');
    expect(styleCss).toContain('top: 48px;');

    // Bottom-left: Layer panel & AQI
    expect(styleCss).toContain('bottom: 76px; left: 14px;');

    // Bottom-right: locate, transport, alert, fab group
    expect(styleCss).toContain('bottom: 120px;');
    expect(styleCss).toContain('bottom: 168px;');

    // Layer panel grid layout
    expect(styleCss).toContain('.lp-grid');
    expect(styleCss).toContain('grid-template-columns: 1fr 1fr');

    // Live ticker hidden on map to prevent button intersection
    expect(styleCss).toContain('body:has(#section-map.active) .live-ticker');
  });

  // 3. Compact Widget Sizes & Aesthetics
  it('verifies compact dimensions for widgets so they do not swallow screen space', () => {
    // Weather widget has restrained max-width
    expect(styleCss).toContain('.weather-widget {');
    expect(styleCss).toContain('max-width: 220px');
    expect(styleCss).toContain('border-radius: 18px');

    // Clock widget has compact padding
    expect(styleCss).toContain('.clock-widget {');
    expect(styleCss).toContain('padding: 6px 12px');

    // AQI widget has compact capsule
    expect(styleCss).toContain('.aqi-widget {');
    expect(styleCss).toContain('max-width: 150px');
  });

  // 4. Safe Module Initialization & Event Propagation
  it('verifies safe global initialization and Leaflet click propagation prevention', () => {
    // map-extras2.js safe initialization
    expect(mapExtras2Js).toContain('window.mapExtras2 = window.mapExtras2 || {};');
    expect(mapExtras2Js).toContain('window.mapExtras2.startTour');
    expect(mapExtras2Js).toContain('window.mapExtras2.togglePoiHeat');
    expect(mapExtras2Js).toContain('window.mapExtras2.toggle3D');
    expect(mapExtras2Js).toContain('window.mapExtras2.toggleArea');

    // map-extras.js safe initialization
    expect(mapExtrasJs).toContain('window.mapExtras = window.mapExtras || {};');
    expect(mapExtrasJs).toContain('toggleRain');
    expect(mapExtrasJs).toContain('toggleIso');
    expect(mapExtrasJs).toContain('toggleSwipe');

    // map-layers.js click propagation prevention
    expect(mapLayersJs).toContain('L.DomEvent.disableClickPropagation');
    expect(mapLayersJs).toContain('L.DomEvent.disableScrollPropagation');
    expect(mapLayersJs).toContain('lpGrid');
  });

  // 5. Leaflet Map Controls Hygiene
  it('verifies Leaflet map controls are cleanly initialized without redundant clashing zoom control', () => {
    // Zoom control was removed from bottomright so it does not collide with GPS button
    expect(appJs).not.toContain("L.control.zoom({ position: 'bottomright' }).addTo(map)");
    // Scale control remains present
    expect(appJs).toContain("L.control.scale({ position: 'bottomleft'");
  });
});
