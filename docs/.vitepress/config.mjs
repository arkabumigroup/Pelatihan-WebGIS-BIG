import { defineConfig } from 'vitepress'

const hari = (text, link, items) => ({ text, link, collapsed: true, items })

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
    // Berkas pendukung yang bisa diunduh (docker-compose.yml, nginx.conf,
    // env.example) berada di folder gambar halaman. VitePress menyajikannya
    // sebagai aset statis, bukan sebagai halaman, sehingga pemeriksa tautan
    // mati perlu dikecualikan untuk berkas jenis ini.
    /\/(docker-compose\.yml|nginx\.conf|env\.example)$/
  ],
  base: '/Pelatihan-WebGIS-BIG/',
  title: "Pelatihan WebGIS Tingkat Dasar Hingga Lanjutan - BIG & Arkabumi",
  head: [
    ['link', { rel: 'icon', href: '/Pelatihan-WebGIS-BIG/favicon.ico' }]
  ],
  description: "Materi pelatihan WebGIS tinggat dasar hingga lanjutan yang diselenggarakan oleh Arkabumi dan PPKIG BIG",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'Pelatihan WebGIS',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Materi Pelatihan', link: '/materi-pelatihan' }
    ],

    sidebar: [
      hari('Hari 1 - Dasar GIS, QGIS, dan Peta 2D', '/hari-1/', [
        { text: 'Ringkasan Hari 1', link: '/hari-1/' },
        {
          text: 'Persiapan Lingkungan',
          collapsed: true,
          items: [
            { text: 'Instalasi Aplikasi', link: '/hari-1/persiapan-lingkungan/instalasi-aplikasi' },
            { text: 'Persiapan dan Konfigurasi Framework', link: '/hari-1/persiapan-lingkungan/konfigurasi-framework' }
          ]
        },
        {
          text: 'Peta 2D dengan Leaflet',
          collapsed: true,
          items: [
            { text: 'Perancangan dan Pembangunan Awal Peta 2D', link: '/hari-1/peta-2d-leaflet/peta-awal' },
            { text: 'Menampilkan Layer GeoJSON, KML dan WMS Geoserver', link: '/hari-1/peta-2d-leaflet/layer-geojson-kml-wms' },
            { text: 'Menampilkan Data Raster', link: '/hari-1/peta-2d-leaflet/data-raster' },
            { text: 'Styling Layer Dengan Javascript', link: '/hari-1/peta-2d-leaflet/styling-layer' }
          ]
        }
      ]),

      hari('Hari 2 - Peta 3D, Basis Data Spasial, dan GeoServer', '/hari-2/', [
        { text: 'Ringkasan Hari 2', link: '/hari-2/' },
        {
          text: 'Peta 3D dengan CesiumJS',
          collapsed: true,
          items: [
            { text: 'Konfigurasi Cesium Viewer', link: '/hari-2/peta-3d-cesium/konfigurasi-viewer' },
            { text: 'Impor dan Pengelolaan Aset 3D dan 3D Tiles', link: '/hari-2/peta-3d-cesium/aset-3d-tiles' },
            { text: 'Terrain dan Citra', link: '/hari-2/peta-3d-cesium/terrain-citra' },
            { text: 'Kontrol Kamera dan Navigasi', link: '/hari-2/peta-3d-cesium/kontrol-kamera' },
            { text: 'Visualisasi Data 2D dan 3D', link: '/hari-2/peta-3d-cesium/visualisasi-2d-3d' },
            { text: 'Interaksi Pengguna', link: '/hari-2/peta-3d-cesium/interaksi-pengguna' }
          ]
        },
        {
          text: 'Basis Data Spasial',
          collapsed: true,
          items: [
            { text: 'Instalasi dan Konfigurasi Basis Data Local', link: '/hari-2/database-spasial/basis-data-lokal' },
            { text: 'Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver', link: '/hari-2/database-spasial/cloud-postgresql' }
          ]
        },
        {
          text: 'GeoServer',
          collapsed: true,
          items: [
            { text: 'Instalasi GeoServer di VM', link: '/hari-2/geoserver/instalasi-geoserver-vm' },
            { text: 'Koneksi PostgreSQL ke GeoServer sebagai Data Store', link: '/hari-2/geoserver/koneksi-postgis' }
          ]
        }
      ]),

      hari('Hari 3 - Backend, Autentikasi, dan Deployment', '/hari-3/', [
        { text: 'Ringkasan Hari 3', link: '/hari-3/' },
        {
          text: 'Backend dan Autentikasi',
          collapsed: true,
          items: [
            { text: 'Konfigurasi Prisma dan Membuat API Login', link: '/hari-3/backend-auth/prisma-api-login' },
            { text: 'Konfigurasi Access Token dan NextAuth', link: '/hari-3/backend-auth/nextauth-access-token' }
          ]
        },
        {
          text: 'Deployment Project',
          collapsed: true,
          items: [
            { text: '1. Peserta dan Project', link: '/hari-3/deployment-project/peserta-project' },
            { text: '2. Konfigurasi Project', link: '/hari-3/deployment-project/konfigurasi-project' },
            { text: '3. Skema Database', link: '/hari-3/deployment-project/skema-database' },
            { text: '4. Google Cloud Platform', link: '/hari-3/deployment-project/google-cloud-platform' },
            { text: '5. Penambahan Subdomain', link: '/hari-3/deployment-project/subdomain' },
            { text: '6. Menyiapkan GeoServer di VM', link: '/hari-3/deployment-project/siapkan-geoserver-vm' }
          ]
        }
      ]),

      hari('Hari 4 - Penyempurnaan dan Studi Kasus', '/hari-4/', [
        { text: 'Ringkasan Hari 4', link: '/hari-4/' }
      ])
    ],
  }
})
