import { readdirSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE, sorter, pdfOptions, puppeteerLaunchOptions } from './pdf-bersama.mjs'

// Konfigurasi bawaan: hanya bagian Deployment Project pada sidebar Hari 4,
// yaitu Praktik 11 beserta lanjutannya Praktik 12. Dipakai oleh
// `npm run export-pdf`.
//
// Urutan halamannya tidak ditulis di sini. `sorter` pada pdf-bersama.mjs
// mengambilnya dari urutan sidebar, sehingga tidak perlu disamakan manual.

const AKAR_DOCS = join(dirname(fileURLToPath(import.meta.url)), '..')

// Praktik 12 ikut karena isinya melanjutkan deployment yang sama. Setelah
// aplikasinya berjalan, yang tersisa justru yang paling mudah terlupakan:
// mencadangkan datanya dan memantau layanannya. Peserta menerima keduanya
// dalam satu sesi Hari 4, jadi keduanya harus ada di panduan yang sama.
const BAGIAN = ['hari-4/praktik-11', 'hari-4/praktik-12']

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

const diDalamBagian = (rute) => BAGIAN.some((bagian) => rute.startsWith(`${bagian}/`))
const halamanBagian = semuaHalaman.filter(diDalamBagian)

if (halamanBagian.length === 0) {
  throw new Error(`Tidak ada halaman di bawah ${BAGIAN.join(' atau ')}/. Periksa nama foldernya.`)
}

/**
 * @type {import('vitepress-export-pdf').UserConfig}
 */
const config = {
  outFile: 'Panduan-Deployment-WebGIS-BIG.pdf',
  outDir: 'pdf',
  routePatterns: semuaHalaman
    .filter((rute) => !diDalamBagian(rute))
    .map((rute) => `!${BASE}${rute}`),
  sorter,
  pdfOptions,
  puppeteerLaunchOptions,
}

export default config
