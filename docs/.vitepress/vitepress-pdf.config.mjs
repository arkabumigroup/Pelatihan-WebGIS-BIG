import { readdirSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE, sorter, pdfOptions, puppeteerLaunchOptions } from './pdf-bersama.mjs'

// Konfigurasi bawaan: hanya bagian Deployment Project pada sidebar Hari 3,
// yang berisi sembilan halaman. Dipakai oleh `npm run export-pdf`.
//
// Urutan halamannya tidak ditulis di sini. `sorter` pada pdf-bersama.mjs
// mengambilnya dari urutan sidebar, sehingga tidak perlu disamakan manual.

const AKAR_DOCS = join(dirname(fileURLToPath(import.meta.url)), '..')
const BAGIAN = 'hari-3/deployment-project'

// Pengekspor selalu menyisipkan "/**" di depan daftar pola, sehingga pola
// positif apa pun tidak pernah menyaring. Penyaringan hanya bisa dilakukan
// lewat pola negatif.
//
// Rute yang dibandingkan memuat base, jadi pengecualiannya pun harus memuat
// base. Daftarnya dibaca dari berkas di disk, bukan ditulis manual, supaya
// halaman yang ditambahkan kemudian ikut terkecuali dengan sendirinya.
function daftarHalaman(dir, akar, hasil = []) {
  for (const entri of readdirSync(dir, { withFileTypes: true })) {
    if (entri.name === '.vitepress' || entri.name === 'public') continue
    const jalur = join(dir, entri.name)
    if (entri.isDirectory()) {
      daftarHalaman(jalur, akar, hasil)
    } else if (entri.name.endsWith('.md')) {
      const rute = relative(akar, jalur).split(sep).join('/')
      hasil.push(rute.replace(/index\.md$/, 'index.html').replace(/\.md$/, '.html'))
    }
  }
  return hasil
}

const semuaHalaman = daftarHalaman(AKAR_DOCS, AKAR_DOCS)
const halamanBagian = semuaHalaman.filter((rute) => rute.startsWith(`${BAGIAN}/`))

if (halamanBagian.length === 0) {
  throw new Error(`Tidak ada halaman di bawah ${BAGIAN}/. Periksa nama foldernya.`)
}

/**
 * @type {import('vitepress-export-pdf').UserConfig}
 */
const config = {
  outFile: 'Panduan-Deployment-WebGIS-BIG.pdf',
  outDir: 'pdf',
  routePatterns: semuaHalaman
    .filter((rute) => !rute.startsWith(`${BAGIAN}/`))
    .map((rute) => `!${BASE}${rute}`),
  sorter,
  pdfOptions,
  puppeteerLaunchOptions,
}

export default config
