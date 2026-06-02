// Generates PWA icons as SVG files (browsers accept SVG for PWA icons)
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const svgTemplate = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#050d1a"/>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#grad)" opacity="0.15"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0b429;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="${size/2}" y="${size * 0.72}" font-size="${size * 0.55}" text-anchor="middle" font-family="Arial, sans-serif">🏆</text>
</svg>`

const sizes = [192, 512]

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`
  writeFileSync(join(publicDir, filename), svgTemplate(size))
  console.log(`Generated ${filename}`)
})

// Also generate maskable icon (with padding for safe zone)
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#050d1a"/>
  <text x="256" y="340" font-size="240" text-anchor="middle" font-family="Arial, sans-serif">🏆</text>
</svg>`

writeFileSync(join(publicDir, 'icon-maskable.svg'), maskable)
console.log('Generated icon-maskable.svg')
