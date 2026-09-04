import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to ensure root scripts and PWA assets are available in dist for standalone deployment
function copyLegacyScripts() {
  return {
    name: 'copy-legacy-scripts',
    closeBundle() {
      const distDir = resolve(import.meta.dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const filesToCopy = [
        'data.js',
        'error-handler.js',
        'offline-store.js',
        'zditm-live.js',
        'sync-manager.js',
        'performance.js',
        'places-enhanced.js',
        'community-data.js',
        'community-ui.js',
        'map-enhancements.js',
        'map-improvements.js',
        'map-pro.js',
        'map-layers.js',
        'map-vehicles.js',
        'map-extras.js',
        'map-extras2.js',
        'navigation.js',
        'search.js',
        'place-images.js',
        'user-profile.js',
        'routes-meetup.js',
        'ux-enhancements.js',
        'pwa.js',
        'pull-refresh.js',
        'pogon-mascot.js',
        'app.js',
        'live.js',
        'sw.js',
        'offline.html',
        'manifest.json'
      ];

      for (const file of filesToCopy) {
        const src = resolve(import.meta.dirname, file);
        const dest = resolve(distDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }
    }
  };
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true
  },
  plugins: [copyLegacyScripts()],
  server: {
    port: 3000,
    open: false
  }
});
