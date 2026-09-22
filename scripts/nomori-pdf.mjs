// Menstempel judul dan nomor halaman pada PDF hasil ekspor.
//
// Kenapa tidak memakai headerTemplate dan footerTemplate milik Chromium saja:
// pengekspornya mencetak satu PDF untuk tiap halaman web, lalu menggabungkan
// PDF-PDF itu menjadi satu berkas. Kelas pageNumber dan totalPages karena itu
// menghitung halaman di dalam satu halaman web itu saja, bukan di dalam
// dokumen. Pada percobaan, halaman ke-40 dari 144 halaman tertulis
// "Halaman 24 dari 25".
//
// Berkas ini dijalankan sesudah penggabungan, jadi jumlah halamannya sudah
// final dan nomornya benar. Isinya menggambar di atas halaman yang sudah ada,
// bukan menyusun ulang, sehingga tata letak hasil ekspor tidak tersentuh.
//
// Pakai: node scripts/nomori-pdf.mjs <berkas.pdf> "<judul dokumen>"

import { readFile, writeFile } from 'node:fs/promises'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const BERKAS = process.argv[2]
const JUDUL = process.argv[3] ?? ''

if (!BERKAS) {
  console.error('Pakai: node scripts/nomori-pdf.mjs <berkas.pdf> "<judul dokumen>"')
  process.exit(1)
}

// Jarak dari tepi kertas. Nilainya sengaja disamakan dengan margin pada
// docs/.vitepress/pdf-bersama.mjs, supaya kaki halaman sejajar dengan tepi
// kiri dan kanan isinya.
const TEPI_SAMPING = (14 / 25.4) * 72
const TEPI_BAWAH = (16 / 25.4) * 72

const UKURAN_HURUF = 8

// Warna abu yang sama dengan #4b5563, senada dengan teks sekunder di modul.
const WARNA = rgb(75 / 255, 85 / 255, 99 / 255)

const dokumen = await PDFDocument.load(await readFile(BERKAS))
const huruf = await dokumen.embedFont(StandardFonts.Helvetica)

const halaman = dokumen.getPages()
const jumlah = halaman.length

halaman.forEach((hal, i) => {
  const { width } = hal.getSize()
  const nomor = `Halaman ${i + 1} dari ${jumlah}`
  // Dasar huruf ditaruh di tengah margin bawah, bukan di tepinya, supaya
  // tidak terpotong saat kertas dipotong atau dijilid.
  const y = TEPI_BAWAH / 2 - UKURAN_HURUF / 2

  if (JUDUL) {
    hal.drawText(JUDUL, { x: TEPI_SAMPING, y, size: UKURAN_HURUF, font: huruf, color: WARNA })
  }

  hal.drawText(nomor, {
    x: width - TEPI_SAMPING - huruf.widthOfTextAtSize(nomor, UKURAN_HURUF),
    y,
    size: UKURAN_HURUF,
    font: huruf,
    color: WARNA,
  })
})

await writeFile(BERKAS, await dokumen.save())

console.log(`Nomor halaman dipasang pada ${jumlah} halaman ${BERKAS}`)
if (!JUDUL) {
  console.log('  (judul dokumen kosong, hanya nomor halaman yang dipasang)')
}
