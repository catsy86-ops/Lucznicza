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
});
