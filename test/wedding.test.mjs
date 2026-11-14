import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

test('Wedding page and essential media exist for GitHub Pages', async () => {
  const html = await readFile('site/index.html', 'utf8');
  assert.match(html, /K\. S\. Varun/);
  assert.match(html, /C\. S\. Tejaswini/);
  for (const file of [
    'site/styles.css',
    'site/script.js',
    'site/data/gallery-manifest.js',
    'site/data/videos/film-02.mp4',
    'site/data/videos/hero-mobile.mp4',
    'site/data/posters/hero-desktop.jpg',
    'site/data/posters/hero-mobile.jpg',
  ]) {
    const info = await stat(file);
    assert.ok(info.size > 0, `${file} should not be empty`);
  }
});
