import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Szczecin Island and Header Polish', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf-8');

  it('contains #szczecinIsland with all required buttons in index.html', () => {
    expect(indexHtml).toContain('id="szczecinIsland"');
    expect(indexHtml).toContain('id="searchBtn"');
    expect(indexHtml).toContain('id="zenMapBtn"');
    expect(indexHtml).toContain('id="themeBtn"');
    expect(indexHtml).toContain('id="islandMenuBtn"');
    expect(indexHtml).toContain('id="islandDropdownMenu"');
  });

  it('contains dropdown quick actions in #islandDropdownMenu', () => {
    expect(indexHtml).toContain('data-action="bikes"');
    expect(indexHtml).toContain('data-action="zditm"');
    expect(indexHtml).toContain('data-action="alert"');
    expect(indexHtml).toContain('data-action="widgets"');
    expect(indexHtml).toContain('data-action="pogon"');
  });

  it('has styling for .szczecin-island and .island-dropdown-menu in style.css', () => {
    expect(styleCss).toContain('.szczecin-island');
    expect(styleCss).toContain('.island-dropdown-menu');
    expect(styleCss).toContain('body:not(.is-map-view):not([data-active-section="pogon"]) #pogonMascot');
  });

  it('handles island dropdown menu and shortcuts in app.js', () => {
    expect(appJs).toContain('initSzczecinIsland');
    expect(appJs).toContain('islandMenuBtn');
    expect(appJs).toContain('islandDropdownMenu');
    expect(appJs).toContain("document.body.setAttribute('data-active-section', section);");
  });

  it('keeps widgets properly positioned below the header', () => {
    expect(styleCss).toContain('calc(var(--header-h, 64px) + 12px)');
  });
});
