# Hari 1 - Dasar GIS, QGIS, dan Peta 2D

Hari pertama membangun dua hal sekaligus: pemahaman tentang apa yang sedang dikerjakan, dan perkakas untuk mengerjakannya. Sesi pagi menjelaskan GIS serta alur kerja WebGIS, lalu peserta mengolah data spasial di QGIS. Sesi siang menurunkan data itu ke web, mulai dari HTML/CSS/JavaScript sampai menampilkan peta di browser dengan Leaflet.

Hari ini juga menjadi titik masuk untuk menyiapkan lingkungan kerja: Visual Studio Code, Node.js, Next.js, dan Git.

## Jadwal Hari 1

Mengacu pada susunan acara pelatihan periode 15 sampai 18 September 2026.

| Waktu | Kegiatan | Materi di halaman ini |
|---|---|---|
| 09.00 - 10.00 | Dasar-dasar GIS, jenis data GIS, sistem koordinat dan transformasi. Alur kerja WebGIS dan komponennya | Belum tersedia |
| 10.15 - 12.00 | Dasar QGIS, digitasi, pengisian atribut, styling data, layanan WFS, WMS, WMTS, WCS | Belum tersedia |
| 13.00 - 14.00 | Dasar HTML, CSS, JS dan pengenalan Leaflet | [Peta 2D dengan Leaflet](#peta-2d-dengan-leaflet) |
| 14.00 - 15.00 | Praktik 2: membuat file HTML, menampilkan peta Leaflet, data lokal dan OGC service, widget Leaflet | [Peta 2D dengan Leaflet](#peta-2d-dengan-leaflet) |
| 15.15 - 16.00 | Penjelasan framework, package pendukung (Leaflet, Cesium, Material UI), GitHub | [Persiapan Lingkungan](#persiapan-lingkungan) |

::: warning Materi teori dan QGIS belum tersedia
Dua blok pertama Hari 1 (09.00 - 12.00) belum punya berkas materi di repositori ini. Sesi teori dasar GIS dan praktik QGIS saat ini masih disampaikan langsung oleh instruktur melalui slide, bukan melalui halaman ini. Halaman ini akan diperbarui begitu materinya tersedia.
:::

## Persiapan Lingkungan

Peserta menyiapkan perkakas sebelum menulis kode. Ada dua tahap:

1. [Instalasi Aplikasi](/hari-1/persiapan-lingkungan/instalasi-aplikasi) - memasang Visual Studio Code, Git, dan Node.js.
2. [Persiapan dan Konfigurasi Framework](/hari-1/persiapan-lingkungan/konfigurasi-framework) - membuat folder proyek, menginisialisasi Next.js, menghubungkan proyek ke repositori GitHub, dan menjalankan aplikasi di `localhost`.

## Peta 2D dengan Leaflet

Empat praktik membangun peta 2D secara bertahap. Mulai dari peta kosong, menambah layer, sampai mengubah tampilan layer lewat JavaScript.

1. [Perancangan dan Pembangunan Awal Peta 2D](/hari-1/peta-2d-leaflet/peta-awal) - memasang Leaflet di dalam Next.js dan menampilkan peta dasar.
2. [Menampilkan Layer GeoJSON, KML dan WMS Geoserver](/hari-1/peta-2d-leaflet/layer-geojson-kml-wms) - menambahkan layer vektor dan layer dari layanan peta.
3. [Menampilkan Data Raster](/hari-1/peta-2d-leaflet/data-raster) - menampilkan data raster seperti GeoTIFF.
4. [Styling Layer Dengan Javascript](/hari-1/peta-2d-leaflet/styling-layer) - mengatur warna, ukuran, dan popup tiap layer.

## Yang Perlu Disiapkan Peserta

- Node.js dan npm, dipasang mengikuti [Instalasi Aplikasi](/hari-1/persiapan-lingkungan/instalasi-aplikasi).
- Akun GitHub, dipakai pada [Persiapan dan Konfigurasi Framework](/hari-1/persiapan-lingkungan/konfigurasi-framework).
- Berkas data spasial dari instruktur, dipakai pada praktik QGIS dan pada praktik layer peta.

## Hasil Akhir Hari 1

Di akhir hari, peserta memiliki proyek Next.js yang berjalan di perangkat sendiri dan menampilkan peta 2D berisi layer data spasial, dengan tampilan layer yang sudah diatur lewat JavaScript.
