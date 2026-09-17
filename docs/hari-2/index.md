# Hari 2 - Peta 3D, Basis Data Spasial, dan GeoServer

Hari kedua menyambungkan tiga hal yang sebelumnya berdiri sendiri: tampilan 3D di browser, tempat data disimpan, dan layanan yang menyajikan data itu. Sesi pagi membangun peta 3D dengan CesiumJS. Sesi siang membangun basis data spasial dan menghubungkannya ke GeoServer.

## Jadwal Hari 2

Mengacu pada susunan acara pelatihan periode 15 sampai 18 September 2026.

| Waktu | Kegiatan | Materi di halaman ini |
|---|---|---|
| 08.00 - 10.00 | Penjelasan CesiumJS, membuat tampilan 3D dan memuat layer 3D, kontrol kamera dan navigasi | [Peta 3D dengan CesiumJS](#peta-3d-dengan-cesiumjs) |
| 10.15 - 12.00 | Database, tabel spasial dan non-spasial, relasi tabel, schema spasial, digitasi lewat database | [Basis Data Spasial](#basis-data-spasial) |
| 13.00 - 14.30 | GeoServer workspace, store, layer dan style, store dari PostGIS, publish tabel dan menampilkan layer di Leaflet | [GeoServer](#geoserver) |
| 14.45 - 16.00 | Penjelasan ORM Prisma, HTTP request, dan App Routes Next.js | Belum tersedia |

::: warning Tiga blok belum punya berkas materi
Penjelasan CesiumJS pembuka, materi tabel spasial dan non-spasial, serta penjelasan ORM Prisma dan App Routes belum punya halaman di repositori ini. Ketiganya saat ini disampaikan langsung oleh instruktur. Halaman ini akan diperbarui begitu materinya tersedia.
:::

## Peta 3D dengan CesiumJS

Enam praktik membangun peta 3D, dari viewer kosong sampai objek 3D yang bisa diklik.

1. [Konfigurasi Cesium Viewer](/hari-2/peta-3d-cesium/konfigurasi-viewer) - memuat library CesiumJS dan membuat viewer dengan basemap.
2. [Impor dan Pengelolaan Aset 3D dan 3D Tiles](/hari-2/peta-3d-cesium/aset-3d-tiles) - mengunggah model 3D dan menampilkannya sebagai 3D Tiles.
3. [Terrain dan Citra: Integrasi Data Elevasi serta Drapping Citra Satelit](/hari-2/peta-3d-cesium/terrain-citra) - mengaktifkan terrain dan menempelkan citra satelit di atasnya.
4. [Kontrol Kamera dan Navigasi](/hari-2/peta-3d-cesium/kontrol-kamera) - mengatur posisi kamera dengan `flyTo` dan `setView`.
5. [Visualisasi Data 2D dan 3D](/hari-2/peta-3d-cesium/visualisasi-2d-3d) - menampilkan data vektor 2D bersama objek 3D dalam satu tampilan.
6. [Interaksi Pengguna](/hari-2/peta-3d-cesium/interaksi-pengguna) - menangani klik dan hover, lalu menampilkan informasi objek.

## Basis Data Spasial

1. [Instalasi dan Konfigurasi Basis Data Local](/hari-2/database-spasial/basis-data-lokal) - memasang PostgreSQL dan PostGIS di perangkat sendiri.
2. [Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver](/hari-2/database-spasial/cloud-postgresql) - menyiapkan basis data di Supabase dan menghubungkannya dari DBeaver maupun QGIS.

## GeoServer

1. [Instalasi GeoServer di VM](/hari-2/geoserver/instalasi-geoserver-vm) - menjalankan GeoServer di dalam VM memakai Docker.
2. [Koneksi PostgreSQL ke GeoServer sebagai Data Store](/hari-2/geoserver/koneksi-postgis) - mendaftarkan basis data sebagai data store, mempublikasikan layer, dan mengatur style.

## Yang Perlu Disiapkan Peserta

- Token Cesium ion, dipakai pada [Impor dan Pengelolaan Aset 3D dan 3D Tiles](/hari-2/peta-3d-cesium/aset-3d-tiles).
- Akun Supabase untuk basis data cloud, dipakai pada [Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver](/hari-2/database-spasial/cloud-postgresql).
- Virtual Machine dari Hari 3 bila GeoServer dijalankan di VM. Bila VM belum siap, GeoServer bisa dijalankan di perangkat sendiri lebih dahulu.

## Hasil Akhir Hari 2

Di akhir hari, peserta memiliki basis data spasial berisi tabel PostGIS, satu instance GeoServer yang menyajikan layer dari basis data itu, dan halaman Next.js yang menampilkan globe 3D dengan terrain serta objek 3D yang dapat diklik.
