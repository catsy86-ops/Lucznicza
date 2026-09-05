import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Map Controls Dock, 6 Basemap Modes & Category Scroll Tests', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const uxJs = fs.readFileSync(path.join(rootDir, 'ux-enhancements.js'), 'utf8');

  it('verifies high-visibility Map Left Dock exists with center, GPS, style and fullscreen buttons', () => {
    expect(indexHtml).toContain('id="mapLeftDock"');
    expect(indexHtml).toContain('id="mapStyleQuickBtn"');
    expect(indexHtml).toContain('id="fabReset"');
    expect(indexHtml).toContain('id="googleLocateBtn"');
    expect(indexHtml).toContain('id="fabFullscreen"');
    expect(styleCss).toContain('.map-left-dock');
    expect(styleCss).toContain('.mld-btn');
  });

  it('verifies 6 Map Modes Popover in index.html and app.js', () => {
    expect(indexHtml).toContain('id="mapModesPopover"');
    expect(indexHtml).toContain('data-style="satellite"');
    expect(indexHtml).toContain('data-style="osm"');
    expect(indexHtml).toContain('data-style="cyclosm"');
    expect(indexHtml).toContain('data-style="dark"');
    expect(indexHtml).toContain('data-style="light"');
    expect(indexHtml).toContain('data-style="topo"');

    expect(appJs).toContain('switchMapLayer(styleKey)');
    expect(appJs).toContain('topo: topoLayer');
    expect(styleCss).toContain('.map-modes-popover');
    expect(styleCss).toContain('.map-mode-chip');
  });

  it('verifies category filter horizontal scroll and touch-action in ux-enhancements.js and style.css', () => {
    expect(uxJs).toContain('initCategoryFilterScroll');
    expect(uxJs).toContain('scrollBy');
    expect(uxJs).toContain('scrollStartLeft');
    expect(styleCss).toContain('.category-filter');
    expect(styleCss).toContain('cursor: grab');
  });

  it('verifies widget drag, minimize and close handling with event stopPropagation', () => {
    expect(uxJs).toContain('el.querySelectorAll(\'.widget-min-btn, .w-minimize-btn\')');
    expect(uxJs).toContain('el.querySelectorAll(\'.widget-close-btn, .msp-close-btn\')');
    expect(uxJs).toContain('e.stopPropagation()');
    expect(uxJs).toContain('el.setPointerCapture');
    expect(styleCss).toContain('.widget-close-btn:hover');
  });
});
