import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Control Hub Pro - Desktop & Mobile Map Hub Upgrade', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const mapLayersJs = fs.readFileSync(path.join(rootDir, 'map-layers.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');

  it('verifies 4-tab segmented structure in map-layers.js', () => {
    expect(mapLayersJs).toContain('mch-tab-bar');
    expect(mapLayersJs).toContain('data-tab="explore"');
    expect(mapLayersJs).toContain('data-tab="presets"');
    expect(mapLayersJs).toContain('data-tab="layers"');
    expect(mapLayersJs).toContain('data-tab="tools"');
    expect(mapLayersJs).toContain('mchPane_explore');
    expect(mapLayersJs).toContain('mchPane_presets');
    expect(mapLayersJs).toContain('mchPane_layers');
    expect(mapLayersJs).toContain('mchPane_tools');
  });

  it('verifies Explore tab with category search and chips', () => {
    expect(mapLayersJs).toContain('mchCategorySearch');
    expect(mapLayersJs).toContain('msp-cats-grid');
    expect(mapLayersJs).toContain('msp-cat-chip');
    expect(mapLayersJs).toContain('msp-summary-badge');
  });

  it('verifies Camera presets and cinematic tour button', () => {
    expect(mapLayersJs).toContain('mch-preset-item');
    expect(mapLayersJs).toContain('data-preset="full-district"');
    expect(mapLayersJs).toContain('data-preset="lucznicza-axis"');
    expect(mapLayersJs).toContain('data-preset="kadziak-park"');
    expect(mapLayersJs).toContain('data-preset="station-hub"');
    expect(mapLayersJs).toContain('data-preset="kollataja-hub"');
    expect(mapLayersJs).toContain('mchTourBtn');
    expect(mapLayersJs).toContain('startTour');
  });

  it('verifies Layer cards and live status badges', () => {
    expect(mapLayersJs).toContain('mch-layers-grid');
    expect(mapLayersJs).toContain('mch-layer-card');
    expect(mapLayersJs).toContain('mchBadgeStops');
    expect(mapLayersJs).toContain('mchBadgeBike');
    expect(mapLayersJs).toContain('mchBadgeZones');
    expect(mapLayersJs).toContain('mchBadgeRain');
    expect(mapLayersJs).toContain('mchBadge3D');
    expect(mapLayersJs).toContain('mchBadgeHeat');
  });

  it('verifies Tools tab with Pogoń Szczecin, Dzik Alert, and widget layout reset', () => {
    expect(mapLayersJs).toContain('mchToolPogon');
    expect(mapLayersJs).toContain('mchToolDzik');
    expect(mapLayersJs).toContain('mchToolArea');
    expect(mapLayersJs).toContain('mchToolIso');
    expect(mapLayersJs).toContain('mspBtnResetWidgets');
    expect(mapLayersJs).toContain('Reset układu');
    expect(mapLayersJs).toContain('mspBtnZen');
  });

  it('verifies Control Hub Pro CSS styles and animations', () => {
    expect(styleCss).toContain('.mch-tab-bar');
    expect(styleCss).toContain('.mch-tab-btn.active');
    expect(styleCss).toContain('.mch-tab-pane.active');
    expect(styleCss).toContain('.mch-preset-item:hover');
    expect(styleCss).toContain('.mch-layer-card.active');
    expect(styleCss).toContain('[data-theme="pogon"] .msp-card');
    expect(styleCss).toContain('[data-theme="light"] .msp-card');
  });
});
