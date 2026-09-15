import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Ambient Status Capsule & Desktop Split-View Test Suite (Etap 1)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const liveJs = fs.readFileSync(path.join(rootDir, 'live.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

  // 1. Ambient Status Capsule Markup & Components
  it('verifies Ambient Status Capsule HUD elements in index.html', () => {
    expect(indexHtml).toContain('id="ambientStatusCapsule"');
    expect(indexHtml).toContain('id="ascPillBtn"');
    expect(indexHtml).toContain('id="ascWeatherChip"');
    expect(indexHtml).toContain('id="ascWeatherIcon"');
    expect(indexHtml).toContain('id="ascWeatherTemp"');
    expect(indexHtml).toContain('id="ascAqiChip"');
    expect(indexHtml).toContain('id="ascAqiDot"');
    expect(indexHtml).toContain('id="ascAqiText"');
    expect(indexHtml).toContain('id="ascTimeChip"');
    expect(indexHtml).toContain('id="ascTime"');
    expect(indexHtml).toContain('id="ascDropdown"');
    expect(indexHtml).toContain('id="ascCloseBtn"');
    expect(indexHtml).toContain('id="ascRefreshBtn"');
    expect(indexHtml).toContain('id="ascFeels"');
    expect(indexHtml).toContain('id="ascWind"');
    expect(indexHtml).toContain('id="ascHumidity"');
    expect(indexHtml).toContain('id="ascPressure"');
  });

  // 2. Ambient Status Capsule Controller & Synchronization
  it('verifies Ambient Status Capsule logic and sync in live.js', () => {
    expect(liveJs).toContain('initAmbientStatusCapsule');
    expect(liveJs).toContain('ascWeatherTemp');
    expect(liveJs).toContain('ascAqiText');
    expect(liveJs).toContain('ascTime');
    expect(liveJs).toContain('toggleDropdown');
    expect(liveJs).toContain('window.initAmbientStatusCapsule = initAmbientStatusCapsule');
  });

  // 3. Desktop Split-View Master-Detail Panel Markup
  it('verifies Desktop Split-View Panel elements in index.html', () => {
    expect(indexHtml).toContain('id="desktopSplitPanel"');
    expect(indexHtml).toContain('id="dspTabPlaces"');
    expect(indexHtml).toContain('id="dspTabRoutes"');
    expect(indexHtml).toContain('id="dspTabZditm"');
    expect(indexHtml).toContain('id="dspCloseBtn"');
    expect(indexHtml).toContain('id="dspSearchInput"');
    expect(indexHtml).toContain('id="dspCountBadge"');
    expect(indexHtml).toContain('id="dspContent"');
  });

  // 4. Desktop Split-View Controller in app.js
  it('verifies Desktop Split-View controller functions and event handlers in app.js', () => {
    expect(appJs).toContain('function openDesktopSplitView');
    expect(appJs).toContain('function closeDesktopSplitView');
    expect(appJs).toContain('function switchSplitViewTab');
    expect(appJs).toContain('function initDesktopSplitView');
    expect(appJs).toContain('window.openDesktopSplitView = openDesktopSplitView');
    expect(appJs).toContain('initDesktopSplitView()');
  });

  // 5. CSS Styling for Capsule HUD and Split-View Panel
  it('verifies CSS styling and responsive rules in style.css', () => {
    expect(styleCss).toContain('.ambient-status-capsule');
    expect(styleCss).toContain('.asc-pill-btn');
    expect(styleCss).toContain('.asc-dropdown');
    expect(styleCss).toContain('.asc-context-card');
    expect(styleCss).toContain('.asc-giedroyc-card');
    expect(styleCss).toContain('.asc-matchday-card');
    expect(styleCss).toContain('.desktop-split-panel');
    expect(styleCss).toContain('.dsp-item-card');
    expect(styleCss).toContain('.dsp-tab.active');
    expect(styleCss).toContain('@keyframes dspSlideIn');
    expect(styleCss).toContain('body.zen-map-mode .ambient-status-capsule');
  });

  // 6. Contextual & QoL HUD Integration in index.html and live.js
  it('verifies Contextual, Giedroyc, and Matchday cards in index.html and live.js', () => {
    expect(indexHtml).toContain('id="ascContextCard"');
    expect(indexHtml).toContain('id="ascGiedroycCard"');
    expect(indexHtml).toContain('id="ascMatchdayCard"');
    expect(liveJs).toContain('updateContextualAndGiedroycHUD');
    expect(liveJs).toContain('window.updateContextualAndGiedroycHUD = updateContextualAndGiedroycHUD');
  });
});

