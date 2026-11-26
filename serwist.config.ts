export default {
  globPatterns: [
    '**/*.{js,css,html,png,svg,ico,woff2,webp,webmanifest}',
  ],
  globDirectory: '.next/server/app',
  globIgnore: [
    '**/manifest.webmanifest',
    '**/icons/*',
    '**/offline/**',
    '**/sw.js',
    '**/workbox-*.js',
  ],
  cleanupOutdatedCaches: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  navigateFallback: '/offline',
  navigateFallbackAllowlist: [/^(?!\/api).*/],
  runtimeCaching: [],
  skipWaiting: true,
  clientsClaim: true,
  additionalManifestEntries: [
    { url: '/offline', revision: '1' },
  ],
}