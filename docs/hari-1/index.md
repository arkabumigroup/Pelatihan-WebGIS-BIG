# Hari 1 - Dasar GIS, Web, dan Peta 2D

Hari pertama membangun dua hal sekaligus: pemahaman tentang apa yang sedang dikerjakan, dan perkakas untuk mengerjakannya. Praktik 1 menjelaskan GIS serta alur kerja WebGIS, lalu peserta mengolah data spasial di QGIS. Praktik 2 menurunkan data itu ke web, mulai dari HTML, CSS, dan JavaScript sampai menampilkan peta dengan Leaflet. Praktik 3 memindahkan pekerjaan yang sama ke dalam framework Next.js. Praktik 4 menutup hari dengan pengelolaan berkas proyek lewat GitHub.

## Jadwal Hari 1

| Waktu | Kegiatan | Materi |
|---|---|---|
| 09.00 - 10.00 | Dasar-dasar GIS, jenis data GIS, sistem koordinat dan transformasi. Alur kerja WebGIS dan komponennya | [Praktik 1](#praktik-1---dasar-gis-dan-webgis) |
| 10.15 - 12.00 | Dasar QGIS, digitasi, pengisian atribut, styling data, layanan WFS, WMS, WMTS, WCS | [Praktik 1](#praktik-1---dasar-gis-dan-webgis) |
| 13.00 - 14.00 | Dasar HTML, CSS, JS dan pengenalan Leaflet | [Praktik 2](#praktik-2---dasar-web-dan-leaflet) |
| 14.00 - 15.00 | Membuat berkas HTML, menampilkan peta Leaflet, data lokal dan layanan OGC, widget Leaflet | [Praktik 2](#praktik-2---dasar-web-dan-leaflet) |
| 15.15 - 16.00 | Penjelasan framework dan package pendukung, penyiapan proyek, serta GitHub | [Praktik 3](#praktik-3---dasar-framework-nextjs) dan [Praktik 4](#praktik-4---dasar-penggunaan-github) |

## Persiapan

Pasang seluruh perkakas sebelum praktik dimulai. Halaman [Instalasi Aplikasi](/hari-1/persiapan/instalasi-aplikasi) memuat Visual Studio Code, GitHub Desktop, Node.js, PostgreSQL, GeoServer, dan QGIS.

## Praktik 1 - Dasar GIS dan WebGIS

Sesi teori dan praktik desktop. Peserta mengenal jenis data spasial dan sistem koordinat, memahami komponen WebGIS, lalu mengolah data spasial sendiri di QGIS.

1. [Dasar-dasar GIS](/hari-1/praktik-1/dasar-gis) - jenis data vektor dan raster, atribut, serta sistem koordinat.
2. [Alur Kerja WebGIS](/hari-1/praktik-1/alur-kerja-webgis) - komponen WebGIS dan bagaimana data bergerak dari sumber sampai tampil di browser.
3. [Pengolahan Data dengan QGIS](/hari-1/praktik-1/pengolahan-data-qgis) - membuka data, membuat dan mengedit data spasial, styling, konversi format, serta mengambil data dari layanan WMS dan WFS.

## Praktik 2 - Dasar Web dan Leaflet

Peserta menulis halaman web pertama, lalu menampilkan peta di dalamnya.

1. [Dasar HTML, CSS, dan JavaScript](/hari-1/praktik-2/dasar-html-css-javascript) - struktur halaman, gaya tampilan, dan perilaku.
2. [Membuat Halaman Login](/hari-1/praktik-2/halaman-login) - latihan menggabungkan HTML, CSS, dan JavaScript menjadi satu halaman utuh.
3. [Dasar Leaflet dan Layanan OGC](/hari-1/praktik-2/dasar-leaflet) - menampilkan peta, menambahkan layer, dan mengambil data dari layanan WMS dan WFS.

## Praktik 3 - Dasar Framework Next.js

Pekerjaan yang tadi masih berupa berkas HTML tunggal dipindahkan ke dalam framework, supaya dapat tumbuh menjadi aplikasi.

1. [Persiapan dan Konfigurasi Framework](/hari-1/praktik-3/konfigurasi-framework) - membuat folder proyek, menginisialisasi Next.js, menghubungkan ke repositori GitHub, dan menjalankan aplikasi di `localhost`.
2. [Membuat Form Login](/hari-1/praktik-3/form-login) - komponen pertama, lengkap dengan pengelolaan isian dan penanganan kiriman.
3. [Membuat Halaman Profil dengan Material UI](/hari-1/praktik-3/halaman-profil) - memakai pustaka komponen siap pakai.
4. [Peta 2D: Perancangan dan Pembangunan Awal](/hari-1/praktik-3/peta-awal) - memasang Leaflet di dalam Next.js dan menampilkan peta dasar.
5. [Menampilkan Layer GeoJSON, KML, dan WMS](/hari-1/praktik-3/layer-geojson-kml-wms) - menambahkan layer vektor dan layer dari layanan peta.
6. [Menampilkan Data Raster](/hari-1/praktik-3/data-raster) - menampilkan data raster seperti GeoTIFF.
7. [Styling Layer dengan JavaScript](/hari-1/praktik-3/styling-layer) - mengatur warna, ukuran, dan popup tiap layer.

## Praktik 4 - Dasar Penggunaan GitHub

Berkas proyek disimpan dan dibagikan lewat GitHub. Peserta memakai GitHub Desktop, bukan perintah baris.

[Membuka Praktik 4 - Dasar-dasar GitHub](/hari-1/praktik-4/dasar-github)

## Yang Perlu Disiapkan Peserta

- Seluruh aplikasi pada halaman [Instalasi Aplikasi](/hari-1/persiapan/instalasi-aplikasi).
- Akun GitHub, dipakai pada Praktik 3 dan Praktik 4.
- Berkas data spasial dari instruktur, dipakai pada Praktik 1 dan Praktik 3.

## Hasil Akhir Hari 1

Di akhir hari, peserta memiliki proyek Next.js yang berjalan di perangkat sendiri, tersimpan di GitHub, dan menampilkan peta 2D berisi layer data spasial dengan tampilan yang sudah diatur lewat JavaScript.
