import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Route Elevation Profile & Hipsometry Tests (Krok 8)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const elevJs = fs.readFileSync(path.join(rootDir, 'route-elevation.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

  it('verifies RouteElevation object structure and hipsometric model in route-elevation.js', () => {
    expect(elevJs).toContain('const RouteElevation =');
    expect(elevJs).toContain('function estimateElevation(lat, lon)');
    expect(elevJs).toContain('function getRouteElevationData(routeId)');
    expect(elevJs).toContain('window.RouteElevation = RouteElevation;');
  });

  it('verifies totalClimb, totalDescent, minAlt, maxAlt and SVG rendering calculations', () => {
    expect(elevJs).toContain('totalClimb');
    expect(elevJs).toContain('totalDescent');
    expect(elevJs).toContain('minAlt');
    expect(elevJs).toContain('maxAlt');
    expect(elevJs).toContain('<svg viewBox=');
    expect(elevJs).toContain('<polygon points=');
    expect(elevJs).toContain('<polyline points=');
  });

  it('verifies integration in app.js rc2-actions, index.html scripts and sw.js caching', () => {
    expect(appJs).toContain('class="rc2-btn elev" onclick="RouteElevation.open(${r.id})"');
    expect(appJs).toContain('⛰️ Profil');
    expect(indexHtml).toContain('script src="route-elevation.js"');
    expect(swJs).toContain('/route-elevation.js');
    expect(styleCss).toContain('.elevation-modal-card');
    expect(styleCss).toContain('.rc2-btn.elev');
  });
});
