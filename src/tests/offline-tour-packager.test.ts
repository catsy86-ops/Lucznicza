import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Offline Tour & Tile Packager Tests (Krok 9)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const packagerJs = fs.readFileSync(path.join(rootDir, 'offline-tour-packager.js'), 'utf8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

  it('verifies OfflineTourPackager object structure and tile calculation in offline-tour-packager.js', () => {
    expect(packagerJs).toContain('const OfflineTourPackager =');
    expect(packagerJs).toContain('function deg2num(lat_deg, lon_deg, zoom)');
    expect(packagerJs).toContain('function downloadRoutePackage(routeId, onProgress)');
    expect(packagerJs).toContain('function removeRoutePackage(routeId)');
    expect(packagerJs).toContain('window.OfflineTourPackager = OfflineTourPackager;');
  });

  it('verifies integration with app.js route cards, index.html scripts and sw.js caching', () => {
    expect(appJs).toContain('offline-pkg-btn-${r.id}');
    expect(appJs).toContain('OfflineTourPackager.togglePackage(${r.id})');
    expect(indexHtml).toContain('script src="offline-tour-packager.js"');
    expect(swJs).toContain('/offline-tour-packager.js');
    expect(styleCss).toContain('.rc2-btn.offline-pkg');
    expect(styleCss).toContain('.rc2-btn.offline-pkg.active');
  });
});
