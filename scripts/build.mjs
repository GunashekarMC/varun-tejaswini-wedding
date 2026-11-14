import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

// GitHub Actions publishes dist/ to GitHub Pages.
// Copy the REAL wedding website (including its data/photos and data/videos),
// instead of regenerating the old Sprint demonstration placeholder page.
const source = 'site';
const destination = 'dist';
await stat(join(source, 'index.html')); // Fail with a helpful error if site is missing.
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });
console.log('Wedding website ready for deployment: dist/index.html');
