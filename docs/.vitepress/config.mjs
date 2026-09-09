import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pelatihan WebGIS",
  description: "Materi pelatihan WebGIS tinggat dasar hingga lanjutan yang diselenggarakan oleh PPKIG BIG dan bekerjasama dengan Arkabumi",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Materi Pelatihan', link: '/Training WebGIS BIG' }
    ],

    sidebar: [
      {
        text: 'Modul 1 - Persiapan dan Konfigurasi',
        link: '/Training WebGIS BIG/Modul 1 - Persiapan dan Konfigurasi',
        collapsed: true,
        items: [
          { text: 'Instalasi Aplikasi', link: '/Training WebGIS BIG/Modul 1 - Persiapan dan Konfigurasi/Instalasi Aplikasi' },
          { text: 'Persiapan dan Konfigurasi Framework', link: '/Training WebGIS BIG/Modul 1 - Persiapan dan Konfigurasi/Persiapan dan Konfigurasi Framework' }
        ]
      },
      {
        text: 'Modul 2 - Pengembangan Frontend Peta 2D',
        link: '/Training WebGIS BIG/Modul 2 - Pengembangan Frontend Peta 2D',
        collapsed: true,
        items: [
          { text: 'Menampilkan Data Raster', link: '/Training WebGIS BIG/Modul 2 - Pengembangan Frontend Peta 2D/Menampilkan Data Raster' },
          { text: 'Menampilkan Layer GeoJSON, KML dan WMS Geoserver', link: '/Training WebGIS BIG/Modul 2 - Pengembangan Frontend Peta 2D/Menampilkan Layer GeoJSON, KML dan WMS Geoserver' },
          { text: 'Perancangan dan Pembangunan Awal Peta 2D', link: '/Training WebGIS BIG/Modul 2 - Pengembangan Frontend Peta 2D/Perancangan dan Pembangunan Awal Peta 2D' },
          { text: 'Styling Layer Dengan Javascript - 1', link: '/Training WebGIS BIG/Modul 2 - Pengembangan Frontend Peta 2D/Styling Layer Dengan Javascript - 1' }
        ]
      },
      {
        text: 'Modul 3 - Pengembangan Frontend Peta Web 3D',
        link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D',
        collapsed: true,
        items: [
          { text: 'Impor dan Pengelolaan Aset 3D dan 3D Tiles', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Impor dan Pengelolaan Aset 3D dan 3D Tiles' },
          { text: 'Interaksi Pengguna', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Interaksi Pengguna' },
          { text: 'Konfigurasi Cesium Viewer', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Konfigurasi Cesium Viewer' },
          { text: 'Kontrol Kamera dan Navigasi Penggunaan flyto, set', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Kontrol Kamera dan Navigasi Penggunaaan flyto, set' },
          { text: 'Terrain dan Citra Integrasi Data Elevasi serta Dra', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Terrain dan Citra Integrasi Data Elevasi serta Dra' },
          { text: 'Visualisasi Data 2D dan 3D', link: '/Training WebGIS BIG/Modul 3 - Pengembangan Frontend Peta Web 3D/Visualisasi Data 2D dan 3D' }
        ]
      },
      {
        text: 'Modul 4 - Basis data dan Konektivitas',
        link: '/Training WebGIS BIG/Modul 4 - Basis data dan Konektivitas',
        collapsed: true,
        items: [
          { text: 'Instalasi dan Konfigurasi Basis Data Local', link: '/Training WebGIS BIG/Modul 4 - Basis data dan Konektivitas/Instalasi dan Konfigurasi Basis Data Local' },
          { text: 'Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver', link: '/Training WebGIS BIG/Modul 4 - Basis data dan Konektivitas/Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver' }
        ]
      },
      {
        text: 'Modul 5 - Setup Deployment',
        link: '/Training WebGIS BIG/Modul 5 - Setup Deployment',
        collapsed: true,
        items: [
          { text: 'Deploy NextJS di VM Google Cloud dengan Docker', link: '/Training WebGIS BIG/Modul 5 - Setup Deployment/Deploy NextJS di VM Google Cloud dengan Docker' },
          { text: 'Modul Membuat VM Google Cloud', link: '/Training WebGIS BIG/Modul 5 - Setup Deployment/Modul Membuat VM Google Cloud' },
          { text: 'Pembuatan Google Cloud Project', link: '/Training WebGIS BIG/Modul 5 - Setup Deployment/Pembuatan Google Cloud Project' },
          { text: 'Setup Build Trigger dan Domain SSL (HTTPS)', link: '/Training WebGIS BIG/Modul 5 - Setup Deployment/Setup Build Trigger dan Domain SSL (HTTPS)' }
        ]
      },
      {
        text: 'Modul 6 - Pengembangan Akhir',
        link: '/Training WebGIS BIG/Modul 6 - Pengembangan Akhir',
        collapsed: true,
        items: [
          { text: 'Instalasi Geoserver di VM', link: '/Training WebGIS BIG/Modul 6 - Pengembangan Akhir/Instalasi Geoserver di VM' },
          { text: 'Koneksi PostgreSQL ke Geoserver sebagai Data Store', link: '/Training WebGIS BIG/Modul 6 - Pengembangan Akhir/Koneksi PostgreSQL ke Geoserver sebagai Data Store' },
          { text: 'Konfigurasi Access Token dan Next Auth', link: '/Training WebGIS BIG/Modul 6 - Pengembangan Akhir/Konfigurasi Access Token dan Next Auth' },
          { text: 'Konfigurasi Prisma dan Membuat API Login', link: '/Training WebGIS BIG/Modul 6 - Pengembangan Akhir/Konfigurasi Prisma dan Membuat API Login' }
        ]
      },
    ],

    footer: {
      message: 'Dibuat untuk Pelatihan WebGIS Tingkat Dasar Hingga Lanjutan',
      copyright: 'Copyright © 2026 Arkabumi & PPKIG BIG'
    }
  }
})
