import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Pogoń Logo, Zen Mode & Draggable Minimizable Widgets System', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const uxJs = fs.readFileSync(path.join(rootDir, 'ux-enhancements.js'), 'utf8');
  const mapLayersJs = fs.readFileSync(path.join(rootDir, 'map-layers.js'), 'utf8');

  // 1. Pogoń Szczecin Animated Logo
  it('verifies Pogoń Szczecin animated vector crest logo in index.html and style.css', () => {
    expect(indexHtml).toContain('header-brand-logo');
    expect(indexHtml).toContain('pogon-crest-svg');
    expect(indexHtml).toContain('crest-shield-base');
    expect(indexHtml).toContain('crest-crown');
    expect(indexHtml).toContain('crest-gryf');
    expect(indexHtml).toContain('crest-shimmer-ray');
    expect(indexHtml).toContain('crest-glow-ring');
    expect(indexHtml).toContain('SZCZECIN · DUMA POMORZA');

    expect(styleCss).toContain('.header-brand-logo');
    expect(styleCss).toContain('.pogon-crest-svg');
    expect(styleCss).toContain('crestShimmerSweep');
    expect(styleCss).toContain('crestPulseAura');
  });

  // 2. Zen Mode (Czysta Mapa)
  it('verifies Zen Mode elements and CSS transitions', () => {
    expect(indexHtml).toContain('id="zenMapBtn"');
    expect(indexHtml).toContain('id="zenRestorePill"');
    expect(styleCss).toContain('body.zen-map-mode');
    expect(styleCss).toContain('.zen-restore-pill');
    expect(styleCss).toContain('body.zen-map-mode .weather-widget');
    expect(styleCss).toContain('body.zen-map-mode .clock-widget');
    expect(styleCss).toContain('body.zen-map-mode .map-stats-panel');
  });

  // 3. Draggable Widgets Markup & Styling
  it('verifies draggable widget handles and styles', () => {
    expect(indexHtml).toContain('widget-drag-handle');
    expect(mapLayersJs).toContain('widget-drag-handle');
    expect(styleCss).toContain('.draggable-widget');
    expect(styleCss).toContain('.widget-drag-handle');
    expect(styleCss).toContain('.is-dragging');
    expect(styleCss).toContain('cursor: grab');
    expect(styleCss).toContain('cursor: grabbing');
  });

  // 4. Minimizable / Shrinkable Widgets
  it('verifies minimizable / shrinkable states for widgets', () => {
    expect(styleCss).toContain('.weather-widget.minimized');
    expect(styleCss).toContain('.clock-widget.minimized');
    expect(styleCss).toContain('.aqi-widget.minimized');
    expect(styleCss).toContain('.widget-min-btn');
    expect(indexHtml).toContain('weatherMinimizeBtn');
    expect(indexHtml).toContain('clockMinimizeBtn');
    expect(indexHtml).toContain('aqiMinimizeBtn');
  });

  // 5. WidgetDragManager Implementation & Persistence
  it('verifies WidgetDragManager logic in ux-enhancements.js', () => {
    expect(uxJs).toContain('WidgetDragManager');
    expect(uxJs).toContain('weatherWidget');
    expect(uxJs).toContain('clockWidget');
    expect(uxJs).toContain('aqiWidget');
    expect(uxJs).toContain('mapStatsPanel');
    expect(uxJs).toContain('layerPanel');
    expect(uxJs).toContain('widget_pos_');
    expect(uxJs).toContain('widget_min_');
    expect(uxJs).toContain('resetAllPositions');
    expect(uxJs).toContain('toggleMinimize');
  });

  // 6. Right Hub & Reset Control
  it('verifies Right Hub stats and widget layout reset button in map-layers.js', () => {
    expect(mapLayersJs).toContain("'mapStatsPanel'");
    expect(mapLayersJs).toContain('mspBtnResetWidgets');
    expect(mapLayersJs).toContain('Reset układu');
  });
});
