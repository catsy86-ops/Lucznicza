import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('PWA & Service Worker Configuration', () => {
  const rootDir = path.resolve(__dirname, '../..');

  it('validates web app manifest.json integrity and required fields', () => {
    const manifestPath = path.join(rootDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    expect(manifest.name).toContain('Niebuszewo');
    expect(manifest.short_name).toBe('Niebuszewo');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(manifest.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(3);
  });

  it('validates sw.js service worker implementation and caching strategies', () => {
    const swPath = path.join(rootDir, 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain("self.addEventListener('install'");
    expect(swContent).toContain("self.addEventListener('activate'");
    expect(swContent).toContain("self.addEventListener('fetch'");
    expect(swContent).toContain('tileStrategy');
    expect(swContent).toContain('apiStrategy');
    expect(swContent).toContain('networkFirstStrategy');
  });

  it('validates offline.html fallback availability', () => {
    const offlinePath = path.join(rootDir, 'offline.html');
    expect(fs.existsSync(offlinePath)).toBe(true);

    const html = fs.readFileSync(offlinePath, 'utf8');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Tryb offline');
    expect(html).toContain('location.reload()');
  });
});
