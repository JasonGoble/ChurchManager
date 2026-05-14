/**
 * Generates all app icon variants from the source SVGs in public/.
 *
 * Run: npm run generate:icons
 *
 * Outputs (opaque = parchment background #f7f3eb):
 *   icon-192.png           — PWA manifest (Android)
 *   icon-512.png           — PWA manifest (splash)
 *   apple-touch-icon.png   — iOS home screen
 *   favicon.ico            — legacy browsers (16 + 32 px layers)
 *
 * Transparent variants (same sizes, no background rect):
 *   icon-192-transparent.png
 *   icon-512-transparent.png
 *   apple-touch-icon-transparent.png
 */

import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const opaqueSvg      = readFileSync(join(publicDir, 'icon.svg'));
const transparentSvg = readFileSync(join(publicDir, 'icon-transparent.svg'));

const PARCHMENT  = { r: 247, g: 243, b: 235, alpha: 1 };
const CLEAR      = { r: 0,   g: 0,   b: 0,   alpha: 0 };

async function svgToPng(svgBuffer, size, background) {
  return sharp(svgBuffer, { density: 300 })
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toBuffer();
}

async function generate() {
  const targets = [
    // Opaque
    { out: 'icon-192.png',                    size: 192, svg: opaqueSvg,      bg: PARCHMENT },
    { out: 'icon-512.png',                    size: 512, svg: opaqueSvg,      bg: PARCHMENT },
    { out: 'apple-touch-icon.png',            size: 180, svg: opaqueSvg,      bg: PARCHMENT },
    // Transparent
    { out: 'icon-192-transparent.png',        size: 192, svg: transparentSvg, bg: CLEAR },
    { out: 'icon-512-transparent.png',        size: 512, svg: transparentSvg, bg: CLEAR },
    { out: 'apple-touch-icon-transparent.png',size: 180, svg: transparentSvg, bg: CLEAR },
  ];

  for (const { out, size, svg, bg } of targets) {
    const buf = await svgToPng(svg, size, bg);
    writeFileSync(join(publicDir, out), buf);
    console.log(`  ✓ ${out}`);
  }

  // favicon.ico — two PNG layers (16 and 32 px), opaque
  const [ico16, ico32] = await Promise.all([
    svgToPng(opaqueSvg, 16,  PARCHMENT),
    svgToPng(opaqueSvg, 32,  PARCHMENT),
  ]);
  const ico = await toIco([ico16, ico32]);
  writeFileSync(join(publicDir, 'favicon.ico'), ico);
  console.log('  ✓ favicon.ico');

  console.log('\nAll icons generated.');
}

generate().catch(err => { console.error(err); process.exit(1); });
