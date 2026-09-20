import vitepressConfig from './config.mjs'

// Urutan halaman pada PDF mengikuti urutan sidebar, bukan urutan abjad.
// Tautan sidebar ditulis tanpa akhiran .html, sedangkan rute yang dilihat
// pengekspor memakai akhiran itu.
function kumpulkanTautan(items, hasil = []) {
  for (const item of items ?? []) {
    if (item.link) hasil.push(item.link)
    if (item.items) kumpulkanTautan(item.items, hasil)
  }
  return hasil
}

const urutan = ['/index.html', '/materi-pelatihan.html'].concat(
  kumpulkanTautan(vitepressConfig.themeConfig.sidebar).map((tautan) =>
    tautan.endsWith('/') ? `${tautan}index.html` : `${tautan}.html`
  )
)

/**
 * @type {import('vitepress-export-pdf').UserConfig}
 */
const config = {
  outFile: 'Pelatihan-WebGIS-BIG.pdf',
  outDir: 'pdf',

  // Halaman 404 tidak ikut. Halaman beranda ikut, karena memuat daftar isi.
  routePatterns: ['/**', '!/404.html'],

  // Halaman yang tidak ada di sidebar ditaruh di belakang, tetap urut abjad.
  sorter: (a, b) => {
    const ia = urutan.indexOf(a.path)
    const ib = urutan.indexOf(b.path)
    if (ia === -1 && ib === -1) return a.path.localeCompare(b.path)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  },

  pdfOptions: {
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
  },

  puppeteerLaunchOptions: {
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  },
}

export default config
