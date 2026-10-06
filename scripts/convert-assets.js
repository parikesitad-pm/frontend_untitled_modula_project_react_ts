import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const crestPath = 'C:/Users/drvc-/.gemini/antigravity/brain/4091926c-c564-430d-931f-4d4189e1406a/.user_uploaded/media_1791250027889_38ff6b27.png';
const fullLogoPath = 'C:/Users/drvc-/.gemini/antigravity/brain/4091926c-c564-430d-931f-4d4189e1406a/.user_uploaded/media_1791250027897_227f6bd4.png';

const publicDir = path.resolve('public');
const brandDir = path.resolve('public/brand');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

async function convert() {
  console.log('Converting assets...');

  // 1. Owl Crest (Favicon & Icon)
  const crestImg = sharp(crestPath);
  
  // Favicons
  await crestImg.clone().resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));
  await crestImg.clone().resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48.png'));
  await crestImg.clone().resize(180, 180).png().toFile(path.join(brandDir, 'apple-touch-icon.png'));
  await crestImg.clone().resize(192, 192).png().toFile(path.join(brandDir, 'icon-192.png'));
  await crestImg.clone().resize(512, 512).png().toFile(path.join(brandDir, 'icon-512.png'));
  
  // WebP versions
  await crestImg.clone().resize(128, 128).webp({ quality: 90 }).toFile(path.join(brandDir, 'modula-owl-128.webp'));
  await crestImg.clone().resize(256, 256).webp({ quality: 90 }).toFile(path.join(brandDir, 'modula-owl-256.webp'));
  await crestImg.clone().webp({ quality: 90 }).toFile(path.join(brandDir, 'modula-owl.webp'));

  // Copy 32x32 png to favicon.ico (most modern browsers accept png format with .ico extension or link tag)
  fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(publicDir, 'favicon.ico'));

  // 2. Full Logo (Wordmark + Owl)
  const logoImg = sharp(fullLogoPath);
  await logoImg.clone().webp({ quality: 92 }).toFile(path.join(brandDir, 'untitled-logo.webp'));
  await logoImg.clone().resize(600).webp({ quality: 90 }).toFile(path.join(brandDir, 'untitled-logo-600.webp'));
  await logoImg.clone().resize(300).webp({ quality: 90 }).toFile(path.join(brandDir, 'untitled-logo-300.webp'));

  console.log('Asset conversion complete!');
  const files = fs.readdirSync(brandDir);
  for (const f of files) {
    const stat = fs.statSync(path.join(brandDir, f));
    console.log(`- brand/${f}: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

convert().catch(err => {
  console.error('Error converting assets:', err);
  process.exit(1);
});

