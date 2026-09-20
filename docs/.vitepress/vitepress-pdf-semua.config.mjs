import { sorter, pdfOptions, puppeteerLaunchOptions } from './pdf-bersama.mjs'

// Seluruh modul, untuk arsip instruktur. Dipakai oleh
// `npm run export-pdf:semua`.
//
// Halaman 404 tidak ikut. Halaman beranda ikut, karena memuat daftar isi.

/**
 * @type {import('vitepress-export-pdf').UserConfig}
 */
const config = {
  outFile: 'Pelatihan-WebGIS-BIG.pdf',
  outDir: 'pdf',
  routePatterns: ['/**', '!/404.html'],
  sorter,
  pdfOptions,
  puppeteerLaunchOptions,
}

export default config
