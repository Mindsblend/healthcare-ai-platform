import sharp from 'sharp'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const inputPath = resolve('public/images/logo.svg')
const outputDir = resolve('public/icons')

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

const sizes = [
  { name: 'icon-192.png', size: 192, purpose: 'any' },
  { name: 'icon-512.png', size: 512, purpose: 'any' },
  { name: 'icon-512-maskable.png', size: 512, purpose: 'maskable' },
  { name: 'apple-touch-icon-180.png', size: 180, purpose: 'any' },
  { name: 'badge-72.png', size: 72, purpose: 'any', monochrome: true },
]

async function generateIcons() {
  const svgBuffer = await sharp(inputPath)
    .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()

  for (const { name, size, purpose, monochrome } of sizes) {
    let pipeline = sharp(svgBuffer).resize(size, size, {
      fit: purpose === 'maskable' ? 'contain' : 'cover',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })

    if (monochrome) {
      pipeline = pipeline.greyscale().threshold(128)
    }

    if (purpose === 'maskable') {
      // Add safe zone padding for maskable icon (40% safe zone)
      const padding = Math.floor(size * 0.1)
      pipeline = pipeline.extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 27, g: 32, b: 36, alpha: 1 }, // theme color #1B2024
      }).resize(size, size)
    }

    const output = await pipeline.png().toBuffer()
    writeFileSync(resolve(outputDir, name), output)
    console.log(`✓ Generated ${name} (${size}x${size})${purpose === 'maskable' ? ' [maskable]' : ''}${monochrome ? ' [monochrome]' : ''}`)
  }

  // Also copy logo.svg as icon.svg for reference
  console.log('\nAll icons generated in public/icons/')
}

generateIcons().catch(console.error)