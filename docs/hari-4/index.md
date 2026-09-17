# Hari 4 - Penyempurnaan dan Studi Kasus

Hari keempat menutup pelatihan. Aplikasi yang sudah berjalan di server disempurnakan, satu teknik visualisasi baru ditambahkan, lalu seluruh alur WebGIS ditinjau ulang bersama.

## Jadwal Hari 4

Mengacu pada susunan acara pelatihan periode 15 sampai 18 September 2026.

| Waktu | Kegiatan | Materi di halaman ini |
|---|---|---|
| 08.00 - 10.00 | Penyempurnaan WebGIS | Belum tersedia |
| 10.15 - 11.30 | Implementasi data Gaussian Splatting | Belum tersedia |
| 13.30 - 15.00 | Review alur WebGIS dan diskusi | Belum tersedia |
| 15.00 - 15.30 | Post-Test | Tidak memerlukan materi |
| 15.30 - 16.15 | Penutupan Pelatihan | Tidak memerlukan materi |

::: warning Seluruh materi Hari 4 belum tersedia
Belum ada berkas materi untuk Hari 4 di repositori ini. Seluruh sesi pada hari tersebut saat ini disampaikan langsung oleh instruktur. Halaman ini akan diperbarui begitu materinya tersedia.

Status ini dicatat apa adanya supaya peserta tidak menyimpulkan bahwa halamannya hilang atau tautannya rusak.
:::

## Gambaran Sesi

Bagian ini menjelaskan apa yang dikerjakan pada tiap sesi, tanpa memuat langkah teknis. Langkah teknisnya menyusul setelah materinya tersedia.

**Penyempurnaan WebGIS.** Peserta meninjau kembali aplikasi yang sudah berjalan dan memperbaiki bagian yang belum selesai. Cakupannya bergantung pada keadaan tiap peserta, sehingga instruktur menetapkan prioritas pada awal sesi.

**Implementasi data Gaussian Splatting.** Sesi ini menambahkan satu cara baru menampilkan objek 3D, yaitu Gaussian Splatting, sebagai pelengkap 3D Tiles yang sudah dikerjakan pada Hari 2. Bentuk datanya berbeda, dan cara memuatnya di CesiumJS juga berbeda.

**Review alur WebGIS dan diskusi.** Seluruh rantai kerja ditinjau ulang: data spasial diolah, disimpan di basis data, disajikan GeoServer, ditampilkan di web sebagai peta 2D dan 3D, diamankan dengan autentikasi, lalu dijalankan di server. Sesi ini menutup rangkaian tersebut menjadi satu gambaran utuh.

## Yang Sudah Dimiliki Peserta Sebelum Hari 4

Setelah Hari 1 sampai Hari 3, peserta sudah memiliki:

- Repositori GitHub berisi proyek Next.js, terhubung ke Cloud Build.
- Basis data PostgreSQL dengan PostGIS, dan GeoServer yang menyajikan layernya.
- Geoportal yang berjalan di alamat HTTPS dengan subdomain sendiri.
- Sistem login dan hak akses berbasis NextAuth.
