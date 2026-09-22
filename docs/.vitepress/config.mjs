import { defineConfig } from 'vitepress'

const hari = (text, link, items) => ({ text, link, collapsed: true, items })

// https://vitepress.dev/reference/site-config
import temaGelapAsli from '@shikijs/themes/github-dark'
import temaTerangAsli from '@shikijs/themes/github-light'

// Warna komentar pada tema github-dark adalah #6a737d. Di atas latar blok kode
// situs ini, yaitu #1d2025, kontrasnya hanya 3,4:1 dan tidak lulus WCAG AA.
// Pada modul ini komentar di dalam perintah justru sering dibaca, karena di
// situlah keterangan tiap baris berada, jadi warnanya dinaikkan menjadi 7,0:1.
// Sisanya tidak diubah.
const perbaikiKomentar = (tema, warna) => ({
  ...tema,
  name: tema.name + '-webgis',
  tokenColors: [
    ...tema.tokenColors.filter((x) => !JSON.stringify(x.scope || '').includes('comment')),
    { scope: ['comment', 'punctuation.definition.comment', 'string.comment'], settings: { foreground: warna } },
  ],
})

const temaKodeGelap = perbaikiKomentar(temaGelapAsli, '#9aa4b2')
const temaKodeTerang = perbaikiKomentar(temaTerangAsli, '#5c6370')

export default defineConfig({
  // Tautan ke localhost hanya muncul sebagai contoh di dalam blok kode, yang
  // tetap diperiksa pemeriksa tautan VitePress.
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  base: '/Pelatihan-WebGIS-BIG/',
  title: "Pelatihan WebGIS Tingkat Dasar Hingga Lanjutan - BIG & Arkabumi",
  head: [
    ['link', { rel: 'icon', href: '/Pelatihan-WebGIS-BIG/favicon.ico' }]
  ],
  description: "Materi pelatihan WebGIS tinggat dasar hingga lanjutan yang diselenggarakan oleh Arkabumi dan PPKIG BIG",

  // Tabel dibungkus wadah bergulir.
  //
  // Alasannya: tabel yang dapat digulir mendatar harus memakai display block,
  // dan pada mode itu kolomnya tidak ikut melebar sehingga menyisakan bidang
  // kosong di kanan. Dengan wadah terpisah, tabelnya kembali menjadi tabel
  // biasa yang lebarnya penuh, sedangkan gulir mendatarnya ditangani wadah.
  markdown: {
    theme: { light: temaKodeTerang, dark: temaKodeGelap },
    config: (md) => {
      const token = (self, tokens, idx, options) => self.renderToken(tokens, idx, options)
      const buka = md.renderer.rules.table_open || ((t, i, o, e, s) => token(s, t, i, o))
      const tutup = md.renderer.rules.table_close || ((t, i, o, e, s) => token(s, t, i, o))

      md.renderer.rules.table_open = (...a) => '<div class="tabel-gulir">' + buka(...a)
      md.renderer.rules.table_close = (...a) => tutup(...a) + '</div>'
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'Pelatihan WebGIS',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Materi Pelatihan', link: '/materi-pelatihan' }
    ],

    // Pencarian lokal VitePress. Indeksnya dibangun saat situs dibangun, jadi
    // tidak ada layanan luar yang perlu dihubungi dan pencarian tetap bekerja
    // pada koneksi pelatihan yang buruk.
    //
    // Seluruh labelnya diterjemahkan karena bawaan VitePress berbahasa Inggris,
    // sedangkan materi ini berbahasa Indonesia.
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Cari materi',
            buttonAriaLabel: 'Cari di materi pelatihan'
          },
          modal: {
            displayDetails: 'Tampilkan daftar lengkap',
            resetButtonTitle: 'Hapus pencarian',
            backButtonTitle: 'Tutup pencarian',
            noResultsText: 'Tidak ada hasil untuk',
            footer: {
              selectText: 'untuk membuka',
              selectKeyAriaLabel: 'enter',
              navigateText: 'untuk berpindah',
              navigateUpKeyAriaLabel: 'panah atas',
              navigateDownKeyAriaLabel: 'panah bawah',
              closeText: 'untuk menutup',
              closeKeyAriaLabel: 'escape'
            }
          }
        }
      }
    },

    sidebar: [
      hari('Hari 1 - Dasar GIS, Web, dan Peta 2D', '/hari-1/', [
        { text: 'Ringkasan Hari 1', link: '/hari-1/' },
        {
          text: 'Persiapan',
          collapsed: true,
          items: [
            { text: 'Instalasi Aplikasi', link: '/hari-1/persiapan/instalasi-aplikasi' }
          ]
        },
        {
          text: 'Praktik 1 - Dasar GIS dan WebGIS',
          collapsed: true,
          items: [
            { text: '1.1 Dasar-dasar GIS', link: '/hari-1/praktik-1/dasar-gis' },
            { text: '1.2 Alur Kerja WebGIS', link: '/hari-1/praktik-1/alur-kerja-webgis' },
            { text: '1.3 Pengolahan Data dengan QGIS', link: '/hari-1/praktik-1/pengolahan-data-qgis' }
          ]
        },
        {
          text: 'Praktik 2 - Dasar Web dan Leaflet',
          collapsed: true,
          items: [
            { text: '2.1 Dasar HTML, CSS, dan JavaScript', link: '/hari-1/praktik-2/dasar-html-css-javascript' },
            { text: '2.2 Membuat Halaman Login', link: '/hari-1/praktik-2/halaman-login' },
            { text: '2.3 Dasar Leaflet dan Layanan OGC', link: '/hari-1/praktik-2/dasar-leaflet' }
          ]
        },
        {
          text: 'Praktik 3 - Dasar Framework Next.js',
          collapsed: true,
          items: [
            { text: '3.1 Persiapan dan Konfigurasi Framework', link: '/hari-1/praktik-3/konfigurasi-framework' },
            { text: '3.2 Membuat Form Login', link: '/hari-1/praktik-3/form-login' },
            { text: '3.3 Membuat Halaman Profil dengan Material UI', link: '/hari-1/praktik-3/halaman-profil' },
            { text: '3.4 Peta 2D: Perancangan dan Pembangunan Awal', link: '/hari-1/praktik-3/peta-awal' },
            { text: '3.5 Menampilkan Layer GeoJSON, KML, dan WMS', link: '/hari-1/praktik-3/layer-geojson-kml-wms' },
            { text: '3.6 Menampilkan Data Raster', link: '/hari-1/praktik-3/data-raster' },
            { text: '3.7 Styling Layer dengan JavaScript', link: '/hari-1/praktik-3/styling-layer' }
          ]
        },
        {
          text: 'Praktik 4 - Dasar Penggunaan GitHub',
          collapsed: true,
          items: [
            { text: '4.1 Dasar-dasar GitHub', link: '/hari-1/praktik-4/dasar-github' }
          ]
        }
      ]),

      hari('Hari 2 - Peta 3D, Basis Data Spasial, dan GeoServer', '/hari-2/', [
        { text: 'Ringkasan Hari 2', link: '/hari-2/' },
        {
          text: 'Praktik 5 - Peta 3D dengan CesiumJS',
          collapsed: true,
          items: [
            { text: '5.1 Konfigurasi Cesium Viewer', link: '/hari-2/praktik-5/konfigurasi-viewer' },
            { text: '5.2 Impor dan Pengelolaan Aset 3D dan 3D Tiles', link: '/hari-2/praktik-5/aset-3d-tiles' },
            { text: '5.3 Terrain dan Citra', link: '/hari-2/praktik-5/terrain-citra' },
            { text: '5.4 Kontrol Kamera dan Navigasi', link: '/hari-2/praktik-5/kontrol-kamera' },
            { text: '5.5 Visualisasi Data 2D dan 3D', link: '/hari-2/praktik-5/visualisasi-2d-3d' },
            { text: '5.6 Interaksi Pengguna', link: '/hari-2/praktik-5/interaksi-pengguna' }
          ]
        },
        {
          text: 'Praktik 6 - PostgreSQL dan PostGIS',
          collapsed: true,
          items: [
            { text: '6.1 Instalasi dan Konfigurasi Basis Data', link: '/hari-2/praktik-6/basis-data-lokal' },
            { text: '6.2 Membuat Tabel, Primary Key, dan Foreign Key', link: '/hari-2/praktik-6/tabel-dan-relasi' },
            { text: '6.3 Management Database Spasial', link: '/hari-2/praktik-6/database-spasial' }
          ]
        },
        {
          text: 'Praktik 7 - GeoServer',
          collapsed: true,
          items: [
            { text: '7.1 Instalasi GeoServer di VM', link: '/hari-2/praktik-7/instalasi-geoserver-vm' },
            { text: '7.2 Koneksi PostgreSQL dan Publish Layer', link: '/hari-2/praktik-7/koneksi-postgis' }
          ]
        }
      ]),

      hari('Hari 3 - Backend dan Autentikasi', '/hari-3/', [
        { text: 'Ringkasan Hari 3', link: '/hari-3/' },
        {
          text: 'Praktik 8 - Database Cloud dan Prisma ORM',
          collapsed: true,
          items: [
            { text: '8.1 Setup Cloud PostgreSQL dan PostGIS di Supabase', link: '/hari-3/praktik-8/cloud-postgresql' },
            { text: '8.2 Konfigurasi Prisma dan Membuat API Login', link: '/hari-3/praktik-8/prisma-api-login' }
          ]
        },
        {
          text: 'Praktik 9 - API dan Backend',
          collapsed: true,
          items: [
            { text: '9.1 Konsep Dasar API dan Backend', link: '/hari-3/praktik-9/konsep-api-backend' },
            { text: '9.2 Membuat CRUD API Users', link: '/hari-3/praktik-9/crud-api-users' }
          ]
        },
        {
          text: 'Praktik 10 - Autentikasi NextAuth',
          collapsed: true,
          items: [
            { text: '10.1 Konfigurasi NextAuth dan Access Token', link: '/hari-3/praktik-10/nextauth-access-token' }
          ]
        }
      ]),

      hari('Hari 4 - Deployment Project', '/hari-4/', [
        { text: 'Ringkasan Hari 4', link: '/hari-4/' },
        {
          text: 'Praktik 11 - Deployment Project',
          collapsed: true,
          items: [
            { text: '11.1 Peserta dan Project', link: '/hari-4/praktik-11/peserta-project' },
            { text: '11.2 Kit Identitas Peserta', link: '/hari-4/praktik-11/kit-identitas' },
            { text: '11.3 Konfigurasi Project', link: '/hari-4/praktik-11/konfigurasi-project' },
            { text: '11.4 Skema Database', link: '/hari-4/praktik-11/skema-database' },
            { text: '11.5 Persiapan Repositori', link: '/hari-4/praktik-11/persiapan-repositori' },
            { text: '11.6 Menyiapkan Project dan VM', link: '/hari-4/praktik-11/google-cloud-platform' },
            { text: '11.7 Menyiapkan Aplikasi di VM', link: '/hari-4/praktik-11/aplikasi-di-vm' },
            { text: '11.8 Otomatisasi Cloud Build', link: '/hari-4/praktik-11/cloud-build' },
            { text: '11.9 Penambahan Subdomain', link: '/hari-4/praktik-11/subdomain' },
            { text: '11.10 Menyiapkan GeoServer di VM', link: '/hari-4/praktik-11/siapkan-geoserver-vm' }
          ]
        },
        { text: 'Gaussian Splatting', link: '/hari-4/gaussian-splatting' }
      ])
    ],
  }
})
