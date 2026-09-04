import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Responsiveness Standards Verification (Desktop & Mobile)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const styleCss = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  it('verifies index.html has correct responsive viewport meta tag', () => {
    expect(indexHtml).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"');
  });

  it('verifies style.css contains breakpoint media queries for desktop and mobile tiers', () => {
    expect(styleCss).toContain('@media (min-width: 768px)');
    expect(styleCss).toContain('@media (max-width: 768px)');
    expect(styleCss).toContain('@media (max-width: 480px)');
  });

  it('verifies touch target and safe area support in CSS', () => {
    // Should have safe area or touch padding support
    const hasSafeArea = styleCss.includes('safe-area-inset') || styleCss.includes('--bottom-nav-h');
    expect(hasSafeArea).toBe(true);
  });

  it('verifies accessibility and reduced motion responsiveness', () => {
    expect(styleCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styleCss).toContain(':focus-visible');
  });
});
