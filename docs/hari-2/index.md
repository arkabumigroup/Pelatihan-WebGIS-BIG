# Hari 2 - Peta 3D, Basis Data Spasial, dan GeoServer

Hari kedua menyambungkan tiga hal yang sebelumnya berdiri sendiri: tampilan 3D di browser, tempat data disimpan, dan layanan yang menyajikan data itu. Praktik 5 membangun peta 3D dengan CesiumJS. Praktik 6 membangun basis data spasial. Praktik 7 menghubungkan basis data itu ke GeoServer dan menerbitkannya sebagai layer.

## Jadwal Hari 2

| Waktu | Kegiatan | Materi |
|---|---|---|
| 08.00 - 10.00 | Penjelasan CesiumJS, membuat tampilan 3D dan memuat layer 3D, kontrol kamera dan navigasi | [Praktik 5](#praktik-5-peta-3d-dengan-cesiumjs) |
| 10.15 - 12.00 | Basis data, tabel spasial dan non-spasial, relasi tabel, schema spasial, digitasi lewat basis data | [Praktik 6](#praktik-6-postgresql-dan-postgis) |
| 13.00 - 14.30 | GeoServer workspace, store, layer dan style, store dari PostGIS, publish tabel dan menampilkan layer di Leaflet | [Praktik 7](#praktik-7-geoserver) |
| 14.45 - 16.00 | Penjelasan ORM Prisma, HTTP request, dan App Routes Next.js | [Praktik 8](/hari-3/praktik-8/prisma-api-login) dan [Praktik 9](/hari-3/praktik-9/konsep-api-backend) |

Materi blok terakhir dikerjakan pada Hari 3, karena di sanalah aplikasi Next.js dan basis datanya sudah tersambung. Halamannya ada pada Praktik 8 dan Praktik 9.

## Praktik 5 - Peta 3D dengan CesiumJS

Enam modul membangun peta 3D, dari viewer kosong sampai objek 3D yang bisa diklik.

1. [Konfigurasi Cesium Viewer](/hari-2/praktik-5/konfigurasi-viewer) - memuat pustaka CesiumJS dan membuat viewer dengan basemap.
2. [Impor dan Pengelolaan Aset 3D dan 3D Tiles](/hari-2/praktik-5/aset-3d-tiles) - mengunggah model 3D dan menampilkannya sebagai 3D Tiles.
3. [Terrain dan Citra](/hari-2/praktik-5/terrain-citra) - mengaktifkan terrain dan menempelkan citra satelit di atasnya.
4. [Kontrol Kamera dan Navigasi](/hari-2/praktik-5/kontrol-kamera) - mengatur posisi kamera dengan `flyTo` dan `setView`.
5. [Visualisasi Data 2D dan 3D](/hari-2/praktik-5/visualisasi-2d-3d) - menampilkan data vektor 2D bersama objek 3D dalam satu tampilan.
6. [Interaksi Pengguna](/hari-2/praktik-5/interaksi-pengguna) - menangani klik dan hover, lalu menampilkan informasi objek.

## Praktik 6 - PostgreSQL dan PostGIS

Basis data di perangkat sendiri, dari pemasangan sampai pengelolaan tabelnya.

1. [Instalasi dan Konfigurasi Basis Data](/hari-2/praktik-6/basis-data-lokal) - memasang PostgreSQL dan PostGIS.
2. [Membuat Tabel, Primary Key, dan Foreign Key](/hari-2/praktik-6/tabel-dan-relasi) - membuat tabel, mengimpor data, dan menghubungkan antar tabel.
3. [Management Database Spasial](/hari-2/praktik-6/database-spasial) - membuat tabel spasial, mengisi geometri, dan menghubungkannya ke QGIS.

Basis data cloud disiapkan kemudian pada [Praktik 8](/hari-3/praktik-8/cloud-postgresql), setelah aplikasi Next.js siap.

## Praktik 7 - GeoServer

1. [Instalasi GeoServer di VM](/hari-2/praktik-7/instalasi-geoserver-vm) - menjalankan GeoServer di dalam VM memakai Docker.
2. [Koneksi PostgreSQL dan Publish Layer](/hari-2/praktik-7/koneksi-postgis) - mendaftarkan basis data sebagai data store, menerbitkan layer, dan mengatur style.

## Yang Perlu Disiapkan Peserta

- Token Cesium ion, dipakai pada [Impor dan Pengelolaan Aset 3D dan 3D Tiles](/hari-2/praktik-5/aset-3d-tiles).
- PostgreSQL dan PostGIS yang sudah terpasang, dipakai mulai [Praktik 6](/hari-2/praktik-6/basis-data-lokal).
- Virtual Machine dari Praktik 11 bila GeoServer dijalankan di VM. Bila VM belum siap, GeoServer dapat dijalankan di perangkat sendiri lebih dahulu.

## Hasil Akhir Hari 2

Di akhir hari, peserta memiliki basis data spasial berisi tabel PostGIS, satu instance GeoServer yang menyajikan layer dari basis data itu, dan halaman Next.js yang menampilkan globe 3D dengan terrain serta objek 3D yang dapat diklik.
