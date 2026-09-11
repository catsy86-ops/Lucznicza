import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to ensure all root scripts, data, and PWA assets are available in dist for standalone deployment
function copyLegacyScripts() {
  return {
    name: 'copy-legacy-scripts',
    closeBundle() {
      const rootDir = import.meta.dirname || process.cwd();
      const distDir = resolve(rootDir, 'dist');
      if (!fs.existsSync(distDir)) return;

      const rootFiles = fs.readdirSync(rootDir);
      for (const file of rootFiles) {
        if (file === 'dist' || file === 'node_modules' || file === 'src' || file.startsWith('.')) continue;
        const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
        if (['.js', '.json', '.png', '.svg', '.ico', '.webp', '.jpg', '.jpeg', '.css'].includes(ext) || file === 'offline.html') {
          const src = resolve(rootDir, file);
          const dest = resolve(distDir, file);
          try {
            if (fs.statSync(src).isFile()) {
              fs.copyFileSync(src, dest);
            }
          } catch (_) {}
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
