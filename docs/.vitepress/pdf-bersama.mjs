import vitepressConfig from './config.mjs'

// Rute yang dilihat pengekspor memuat base, misalnya
// /Pelatihan-WebGIS-BIG/hari-1/index.html. Tautan sidebar tidak memuatnya,
// jadi base harus ditambahkan lebih dahulu.
export const BASE = vitepressConfig.base ?? '/'

export function keRute(tautan) {
  const bersih = tautan.replace(/^\//, '')
  return bersih.endsWith('/') ? `${BASE}${bersih}index.html` : `${BASE}${bersih}.html`
}

// Urutan halaman pada PDF mengikuti urutan sidebar, bukan urutan abjad.
function kumpulkanTautan(items, hasil = []) {
  for (const item of items ?? []) {
    if (item.link) hasil.push(item.link)
    if (item.items) kumpulkanTautan(item.items, hasil)
  }
  return hasil
}

const urutan = kumpulkanTautan(vitepressConfig.themeConfig.sidebar).map(keRute)

// Halaman yang tidak ada di sidebar ditaruh di belakang, tetap urut abjad.
export function sorter(a, b) {
  const ia = urutan.indexOf(a.path)
  const ib = urutan.indexOf(b.path)
  if (ia === -1 && ib === -1) return a.path.localeCompare(b.path)
  if (ia === -1) return 1
  if (ib === -1) return -1
  return ia - ib
}

export const pdfOptions = {
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
}

export const puppeteerLaunchOptions = {
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
}
