import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Real-Time Open/Closed POI Filter Tests (Krok 6)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const placesEnhancedJs = fs.readFileSync(path.join(rootDir, 'places-enhanced.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');

  it('verifies getOpenStatus function exists and supports 24h, closed, open and closing soon formats', () => {
    expect(placesEnhancedJs).toContain('function getOpenStatus(place)');
    expect(placesEnhancedJs).toContain("range === '0-24'");
    expect(placesEnhancedJs).toContain("range === 'zamkn'");
    expect(placesEnhancedJs).toContain('formatHour(closeH)');
    expect(placesEnhancedJs).toContain('window.placesEnhanced =');
  });

  it('verifies "catOpenNowBtn" pill on map and "openNowToggleBtn" on places list in index.html', () => {
    expect(indexHtml).toContain('id="catOpenNowBtn"');
    expect(indexHtml).toContain('id="openNowToggleBtn"');
    expect(indexHtml).toContain('Otwarte teraz');
  });

  it('verifies state.showOnlyOpenNow and bidirectional synchronization between map and list filters', () => {
    expect(appJs).toContain('showOnlyOpenNow: false');
    expect(appJs).toContain('state.showOnlyOpenNow = !state.showOnlyOpenNow;');
    expect(appJs).toContain("document.getElementById('catOpenNowBtn')");
    expect(appJs).toContain("document.getElementById('openNowToggleBtn')");
    expect(appJs).toContain('if (state.showOnlyOpenNow && PE)');
  });

  it('verifies openNowToggleBtn styling in style.css', () => {
    expect(styleCss).toContain('.places-toolbar');
    expect(styleCss).toContain('.places-tool-btn');
    expect(styleCss).toContain('.places-tool-btn.active');
  });
});
