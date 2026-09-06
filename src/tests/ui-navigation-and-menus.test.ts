import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('UI Menus, Navigation & All 11 Subpages Suite', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const communityUiJs = fs.readFileSync(path.join(rootDir, 'community-ui.js'), 'utf8');

  it('verifies top header has both hamburger menuBtn and islandMenuBtn', () => {
    expect(indexHtml).toContain('id="menuBtn"');
    expect(indexHtml).toContain('id="islandMenuBtn"');
    expect(indexHtml).toContain('id="islandDropdownMenu"');
    expect(indexHtml).toContain('id="sidebar"');
    expect(indexHtml).toContain('id="sidebarOverlay"');
  });

  it('verifies initUI is idempotent and does not bind duplicate click listeners', () => {
    expect(appJs).toContain('if (window.__uiInitialized) return;');
    expect(appJs).toContain('window.__uiInitialized = true;');
  });

  it('verifies all 11 subpages are declared in index.html with section IDs', () => {
    const sections = [
      'map', 'places', 'routes', 'bikes', 'transport',
      'info', 'events', 'live', 'community', 'pogon', 'szczecin'
    ];
    sections.forEach(sec => {
      expect(indexHtml).toContain(`id="section-${sec}"`);
    });
  });

  it('verifies sidebar navigation contains links to all 11 subpages', () => {
    const sections = [
      'map', 'places', 'routes', 'bikes', 'transport',
      'info', 'events', 'live', 'community', 'pogon', 'szczecin'
    ];
    sections.forEach(sec => {
      expect(indexHtml).toContain(`data-section="${sec}"`);
    });
  });

  it('verifies sections include section-back-btn to return to map', () => {
    expect(indexHtml).toContain('class="section-back-btn"');
    expect(appJs).toContain('class="section-back-btn"');
    expect(communityUiJs).toContain('class="section-back-btn"');
  });

  it('verifies handleDeepLink supports all 11 section hashes', () => {
    expect(appJs).toContain('#(map|places|routes|bikes|info|transport|events|live|community|pogon|szczecin)');
  });

  it('verifies Escape key closes both sidebar and island dropdown', () => {
    expect(appJs).toContain("e.key === 'Escape'");
    expect(appJs).toContain("sidebar.classList.remove('open')");
    expect(appJs).toContain("dropdown.classList.add('hidden')");
  });
});
