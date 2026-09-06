import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Mobile Navigation, Satellite Default Basemap & Widget Lifecycle Tests', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const uxEnhancementsJs = fs.readFileSync(path.join(rootDir, 'ux-enhancements.js'), 'utf8');
  const mobileNavJs = fs.readFileSync(path.join(rootDir, 'mobile-nav-enhance.js'), 'utf8');

  it('verifies satellite is set as the default basemap in app.js', () => {
    expect(appJs).toContain("state.currentBaseLayer = 'satellite';");
    expect(appJs).toContain('satelliteLayer.addTo(map);');
    expect(appJs).toContain('https://a.tile.openstreetmap.org/15/17709/10762.png');
    expect(appJs).toContain("thumbLabel.textContent = 'MAPA';");
  });

  it('verifies duplicate bottom navigation is eliminated from index.html', () => {
    const bottomNavMatches = indexHtml.match(/<nav class="bottom-nav"/g);
    expect(bottomNavMatches).not.toBeNull();
    expect(bottomNavMatches!.length).toBe(1);
    expect(indexHtml).toContain('<nav class="bottom-nav" id="bottomNav"');
  });

  it('verifies bottom sheet is toggled hidden on non-map sections', () => {
    expect(appJs).toContain("sheet.classList.remove('hidden');");
    expect(appJs).toContain("sheet.classList.add('hidden');");
    expect(styleCss).toContain('.modern-bottom-sheet.hidden');
  });

  it('verifies mobile nav swipe up does not hide bottom navigation', () => {
    expect(mobileNavJs).not.toContain('swipeDistance > 0');
    expect(mobileNavJs).toContain('keeps nav always visible');
  });

  it('verifies widgets have close buttons and widgetRestoreDock exists', () => {
    expect(indexHtml).toContain('id="weatherCloseBtn"');
    expect(indexHtml).toContain('id="clockCloseBtn"');
    expect(indexHtml).toContain('id="aqiCloseBtn"');
    expect(indexHtml).toContain('id="widgetRestoreDock"');
    expect(indexHtml).toContain('id="wrdTriggerBtn"');
    expect(indexHtml).toContain('id="wrdRestoreAllBtn"');
  });

  it('verifies WidgetDragManager implements close, restore, and restore dock updates', () => {
    expect(uxEnhancementsJs).toContain('closeWidget(widgetId)');
    expect(uxEnhancementsJs).toContain('restoreWidget(widgetId)');
    expect(uxEnhancementsJs).toContain('restoreAllWidgets()');
    expect(uxEnhancementsJs).toContain('updateRestoreDock()');
    expect(uxEnhancementsJs).toContain("setProperty('position', 'fixed', 'important')");
  });

  it('verifies mobile map controls stack is elevated above bottom sheet peek (182px)', () => {
    expect(styleCss).toContain('bottom: 184px !important;');
    expect(styleCss).toContain('bottom: 240px !important;');
    expect(styleCss).toContain('bottom: 296px !important;');
  });

  it('verifies bottom nav has high z-index (1200) to never be trapped under sheets', () => {
    expect(styleCss).toContain('z-index: 1200;');
  });

  it('verifies Centrum Dzielnicy (mapStatsPanel) clears category filter bar without collision on mobile', () => {
    expect(styleCss).toContain('top: calc(var(--header-h, 64px) + 56px)');
    expect(styleCss).toContain('height: 42px !important;');
    expect(styleCss).toContain('body:has(#mapPresetsBar:not(.collapsed)) .map-stats-panel');
    expect(styleCss).toContain('.msp-toggle-btn');
    expect(styleCss).toContain('touch-action: none !important;');
  });

  it('verifies Touch Drag System with passive: false, preventDefault, and dual position keys', () => {
    expect(uxEnhancementsJs).toContain("handle.addEventListener('touchstart'");
    expect(uxEnhancementsJs).toContain("handle.addEventListener('touchmove'");
    expect(uxEnhancementsJs).toContain("handle.addEventListener('touchend'");
    expect(uxEnhancementsJs).toContain('{ passive: false }');
    expect(uxEnhancementsJs).toContain('e.cancelable');
    expect(uxEnhancementsJs).toContain('e.preventDefault()');
    expect(uxEnhancementsJs).toContain('lucznicza_widget_pos_');
    expect(uxEnhancementsJs).toContain('justDragged');
  });
});
