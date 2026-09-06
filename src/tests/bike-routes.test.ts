import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Szczecin Bike Router & Section', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
  const bikeJs = fs.readFileSync(path.join(rootDir, 'bike-routes.js'), 'utf-8');

  it('declares #section-bikes and script inclusion in index.html', () => {
    expect(indexHtml).toContain('id="section-bikes"');
    expect(indexHtml).toContain('data-section="bikes"');
    expect(indexHtml).toContain('src="bike-routes.js"');
  });

  it('implements SzczecinBikeRouter routing algorithm in bike-routes.js', () => {
    expect(bikeJs).toContain('SzczecinBikeRouter');
    expect(bikeJs).toContain('calculateRoute');
    expect(bikeJs).toContain('BIKE_NODES');
    expect(bikeJs).toContain('BIKE_EDGES');
    expect(bikeJs).toContain('CURATED_BIKE_ROUTES');
    expect(bikeJs).toContain('BIKE_STATIONS');
  });

  it('supports multiple profiles: safe, fast, flat, gravel', () => {
    expect(bikeJs).toContain("profile === 'safe'");
    expect(bikeJs).toContain("profile === 'fast'");
    expect(bikeJs).toContain("profile === 'flat'");
    expect(bikeJs).toContain("profile === 'gravel'");
  });

  it('calculates time based on bicycle type speed', () => {
    expect(bikeJs).toContain('city: 14.5');
    expect(bikeJs).toContain('road: 24.0');
    expect(bikeJs).toContain('gravel: 18.5');
    expect(bikeJs).toContain('ebike: 22.5');
  });

  it('provides GPX download and Leaflet CyclOSM map preview', () => {
    expect(bikeJs).toContain('exportGpx');
    expect(bikeJs).toContain('renderRouteOnLeaflet');
    expect(bikeJs).toContain('cyclosm');
  });

  it('contains styling for bike planner, cards, and stations in style.css', () => {
    expect(styleCss).toContain('.bike-hero');
    expect(styleCss).toContain('.bike-planner-card');
    expect(styleCss).toContain('.bike-calc-btn');
    expect(styleCss).toContain('.curated-routes-grid');
    expect(styleCss).toContain('.station-card');
  });

  it('integrates Bike_S stations & IBOMBO in map-layers.js', () => {
    const mapLayersJs = fs.readFileSync(path.join(rootDir, 'map-layers.js'), 'utf-8');
    expect(mapLayersJs).toContain('BIKE_STATIONS');
    expect(mapLayersJs).toContain('bike-station-marker');
    expect(mapLayersJs).toContain('window.toggleBikesLayer');
    expect(mapLayersJs).toContain('window.toggleTransitLayer');
  });

  it('implements Web Audio Dzik Grunt sound and boar radar with escape route to Pub Klatka', () => {
    const commUiJs = fs.readFileSync(path.join(rootDir, 'community-ui.js'), 'utf-8');
    expect(commUiJs).toContain('playDzikGruntSound');
    expect(commUiJs).toContain('showBoarRadarAndEscapePath');
    expect(commUiJs).toContain('Pub Klatka');
    expect(styleCss).toContain('.dzik-pulse');
    expect(styleCss).toContain('.escape-tooltip');
  });

  it('registers bike-routes.js and manifest shortcuts in PWA v7/v8', () => {
    const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf-8');
    const manifestJson = fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf-8');
    expect(swJs).toMatch(/const CACHE_VERSION = 'v[78]'/);
    expect(swJs).toContain("'/bike-routes.js'");
    expect(manifestJson).toContain('"short_name": "Rower"');
  });

  it('provides route calculation button, swap points, and floating route banner on map', () => {
    expect(bikeJs).toContain('calcBikeRouteBtn');
    expect(bikeJs).toContain('bikeSwapPointsBtn');
    expect(bikeJs).toContain('showCurrentOnMap');
    expect(bikeJs).toContain('bikeActiveRouteBanner');
    expect(bikeJs).toContain('clearActiveRoute');
    expect(bikeJs).toContain('backToPlanner');
    expect(styleCss).toContain('.bike-active-route-banner');
    expect(styleCss).toContain('.bike-swap-btn');
  });
});

