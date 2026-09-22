// Pembangkit docs/.vitepress/theme/data/peserta.js dari rekap batch 1 dan CSV batch 2.
//
// Berkas ini dijalankan sekali saat menambahkan batch baru, bukan bagian dari
// proses build. Isinya ditulis ulang seluruhnya setiap kali dijalankan, jadi
// jangan menyunting peserta.js secara manual tanpa memindahkan perubahan itu
// ke sini.
//
// Cara pakai, dari akar repositori:
//   node scripts/bangkitkan-peserta.mjs
//
// Menambah batch berikutnya: letakkan CSV-nya di scripts/data/, lalu tambahkan
// satu blok di bagian BATCH berikut.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR_SCRIPTS = dirname(fileURLToPath(import.meta.url))
const AKAR = join(DIR_SCRIPTS, '..')
const BERKAS_PESERTA = join(AKAR, 'docs/.vitepress/theme/data/peserta.js')
const CSV_BATCH_2 = join(DIR_SCRIPTS, 'data/peserta-batch-2.csv')

// Slug batch 2. Tidak ada di CSV, karena Nama Peserta adalah slug yang
// disepakati peserta dengan penyelenggara, bukan turunan otomatis. Nilai di
// bawah diturunkan dari awalan email, tanpa angka, maksimal 12 karakter, dan
// sudah diperiksa tidak bertabrakan dengan slug batch 1.
const SLUG_BATCH_2 = {
  'Fadillah Ibnu M': 'extraharrom',
  'Yana Oktaviana': 'yanaoktav',
  'Muhammad Adnan Shafry Untoro': 'adnshafry',
  'Rohullah Ragajaya': 'ragajaya',
  'Tri Widowati': 'widoge',
  'Sarah Leila Hanief': 'sarahleil',
  'Emir Muhamad Zaid': 'zaidemirm',
  'Didit S': 'diditseti',
  'Irfan Tri Anggoro': 'irfantria',
  'Rendi Dewantara': 'rendidewa',
  'Rizky Fadzilah Nur': 'fadzilahnur',
  'I Wayan Gede Krisna Arimjaya': 'krisnaarim',
  'Putra Setiawan': 'psetiawan',
  'Arif Rahman': 'arman',
  'ROFIQOH': 'rofiqoh',
  'Puji Nurhidayah': 'pujinhida',
  'Dias Eramudadi': 'diaseramu',
  'Nandia Putri': 'nandiaput',
  'Muhammad Reza Muzadhin': 'mrezamuz',
  'Ilham Sulaeman': 'ilhansula',
  'Andyan Putra Prajamandana': 'andyanput',
  'Imam Sholichin': 'imamjakar',
  'Suci Tresna Novianti': 'sucitresn',
  'Arum Suryandari': 'arumsurya',
  'Abdurrohman Attirmidzi': 'abdurrohm',
  'Sozanolo Ndruru': 'ozan',
  'Bisma Jaja Zakaria': 'bismajz',
  'M Faozi Nasrulloh': 'faozinasr',
  'Inggit Diah Novitaningrum': 'inggitdiah',
  'Putri Laila K.N': 'putrikart',
  'Fadhil Abryanto Nugraha': 'fadhilabr',
  'Murdaningsih': 'daning',
  'Faqih Rohmatulloh': 'faqihrohm',
  'Mica Alphabettika': 'micaa',
  'Muhammad Wildan': 'muhammadwi',
  'Ziyadatul Rofita': 'zydta',
  'Winda Agustin': 'windaagus',
  'Fernanda Rusmayanti': 'rusmayant',
  'Tri Raharjo': 'triraharj',
  'Ria Purnama Putri': 'riapurnam',
  'Yulia Ira Amelia': 'yuliamelia',
}

// Nama akun master yang ditampilkan, dalam urutan yang dipakai situs.
//
// Nama orangnya berbeda antara batch 1 dan batch 2 untuk dua akun, sedangkan
// akunnya sama. Yang ditampilkan di sini nama orang pada batch 1, karena
// sebagian besar peserta masih dari batch itu. Nama pada batch 2 tetap
// tersimpan pada kolom batch-nya masing-masing di catatan sumber.
const MASTER = [
  { akun: 'kerjaanaldira', master: 'Hifnie (kerjaanaldira)', project: { a: 'geoportal-kelompok-a-a1ad9', b: 'geoportal-kelompok-b-a1ad9', c: 'geoportal-kelompok-c-a1ad9' } },
  { akun: 'arkabumihd1', master: 'Dhany (arkabumihd1)', project: { a: 'geoportal-kelompok-a-92650', b: 'geoportal-kelompok-b-92650', c: 'geoportal-kelompok-c-92650' } },
  { akun: 'baimonml', master: 'Reza (baimonml)', project: { a: 'geoportal-kelompok-a-d8290', b: 'geoportal-kelompok-b-d8290', c: 'geoportal-kelompok-c-d8290' } },
  { akun: 'baimongenshin', master: 'Yovita (baimongenshin)', project: { a: 'geoportal-kelompok-a-be8bf', b: 'geoportal-kelompok-b-be8bf', c: 'geoportal-kelompok-c-be8bf' } },
]

// --- baca batch sebelumnya dari git ---------------------------------------
//
// Batch sebelumnya dibaca dari revisi berkas yang sudah di-commit, bukan dari
// berkas di disk. Alasannya, berkas di disk berisi hasil penggabungan, dan
// membacanya kembali akan menghitung batch baru dua kali: sekali sebagai batch
// sebelumnya dan sekali sebagai batch baru. Dijalankan dua kali, cara itu
// menghasilkan 123 peserta, bukan 82.
//
// Revisinya yang lama, bukan HEAD, karena HEAD sudah memuat batch baru setelah
// ditambahkan. Untuk menambah batch ketiga nanti: ubah BATCH_BARU menjadi 3,
// tunjuk REVISI ke commit yang memuat batch 1 dan 2, lalu letakkan CSV-nya di
// scripts/data/.

const BATCH_BARU = 2
const REVISI = 'eb6066e'
const BERKAS_DI_GIT = 'docs/.vitepress/theme/data/peserta.js'

const isiSebelumnya = execFileSync('git', ['show', `${REVISI}:${BERKAS_DI_GIT}`], { cwd: AKAR, encoding: 'utf8' })
const awal = isiSebelumnya.indexOf('[')
const akhir = isiSebelumnya.lastIndexOf(']')
const kelompokSebelumnya = JSON.parse(isiSebelumnya.slice(awal, akhir + 1))

// Penjagaan: revisi itu harus belum memuat batch baru, supaya tidak dihitung
// dua kali. Peserta tanpa kolom batch dianggap batch 1.
const sudahAda = kelompokSebelumnya.some((k) => k.peserta.some((p) => p.batch === BATCH_BARU))
if (sudahAda) {
  throw new Error(
    `Revisi ${REVISI} sudah memuat batch ${BATCH_BARU}, sehingga batch itu akan dihitung dua kali. ` +
      'Arahkan REVISI ke revisi yang belum memuatnya.'
  )
}

const batch1 = kelompokSebelumnya.map((k) => ({
  ...k,
  peserta: k.peserta.map((p) => ({ ...p, batch: p.batch || 1 })),
}))

// --- baca batch 2 dari CSV ----------------------------------------------

const baris = readFileSync(CSV_BATCH_2, 'utf8').trim().split('\n').slice(1)
const batch2 = baris.map((b) => {
  // Koma di dalam nilai tidak ada di berkas ini, jadi pemisahan sederhana
  // sudah cukup. Spasi di ujung tiap kolom dibuang, karena beberapa baris
  // memuatnya.
  const k = b.split(',').map((x) => x.trim())
  const nama = k[0]
  const slug = SLUG_BATCH_2[nama]
  if (!slug) throw new Error(`Slug untuk "${nama}" belum ditetapkan.`)

  // Huruf kelompok diambil dari Project ID, bukan dari karakter terakhirnya.
  // Project ID berbentuk geoportal-kelompok-a-92650, dan karakter terakhirnya
  // adalah angka akhir suffix, bukan huruf kelompoknya.
  const kelompok = k[3].match(/-kelompok-([abc])-/)
  if (!kelompok) throw new Error(`Project ID "${k[3]}" tidak memuat huruf kelompok.`)

  return {
    nama,
    email: k[1],
    namaPeserta: slug,
    bagian: kelompok[1],
    batch: 2,
    master: k[2],
  }
})

// --- gabungkan ------------------------------------------------------------

const hasil = []
let total = 0
for (const m of MASTER) {
  const dariBatch1 = batch1.find((k) => k.akun === m.akun)
  if (!dariBatch1) throw new Error(`Batch 1 tidak memuat akun master ${m.akun}.`)
  // Batch dari revisi sebelumnya dipakai apa adanya. Bila revisi itu belum
  // memuat kolom batch, peserta di sana dianggap batch 1.
  const peserta = dariBatch1.peserta.map((p) => ({ ...p, batch: p.batch || 1 }))

  for (const p of batch2) {
    // Akun master pada CSV ditulis sebagai "akun (Nama)", sedangkan kunci di
    // sini akunnya saja.
    const akun = p.master.replace(/\s*\(.*\)$/, '')
    if (akun !== m.akun) continue
    peserta.push({
      nama: p.nama,
      email: p.email,
      namaPeserta: p.namaPeserta,
      bagian: p.bagian,
      batch: 2,
    })
  }

  peserta.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
  total += peserta.length
  hasil.push({ master: m.master, akun: m.akun, project: m.project, peserta })
}

// --- tulis ----------------------------------------------------------------

const kepala = `// Data pemetaan peserta ke project, untuk dua batch.
//
// Sumber: rekapitulasi penugasan project per akun master, ditambah CSV
// "webGIS Training Batch 2 - akun_gcp.csv". Kolom saran dan masukan dari
// formulir TIDAK disertakan, karena isinya masukan pribadi peserta, bukan data
// yang perlu dipublikasikan.
//
// Berkas ini dibangkitkan, bukan ditulis manual, supaya tidak ada nama atau
// email yang salah ketik. Batch 2 dibangkitkan oleh
// scripts/bangkitkan-peserta.mjs, yang membaca CSV-nya dan menggabungkannya
// dengan batch 1 pada berkas ini.
//
// Kolom "batch" menandai asal peserta. Satu akun master dan satu project
// dipakai bersama oleh kedua batch, sedangkan nama orang pada akun master itu
// dapat berbeda antar batch.

`

const isi = kepala + 'export const kelompokPeserta = ' + JSON.stringify(hasil, null, 2) + '\n'
writeFileSync(BERKAS_PESERTA, isi)

const b1 = hasil.flatMap((k) => k.peserta).filter((p) => p.batch === 1).length
const b2 = hasil.flatMap((k) => k.peserta).filter((p) => p.batch === 2).length
console.log(`peserta.js ditulis: ${total} peserta (batch 1: ${b1}, batch 2: ${b2})`)
for (const k of hasil) {
  const c = k.peserta.reduce((n, p) => { n[p.batch] = (n[p.batch] || 0) + 1; return n }, {})
  console.log(`  ${k.master.padEnd(26)} ${String(k.peserta.length).padStart(2)} peserta  (batch 1: ${c[1] || 0}, batch 2: ${c[2] || 0})`)
}
