# Materi Pelatihan WebGIS

Materi ini disusun sebagai panduan belajar WebGIS (Web Geographic Information System) secara bertahap, dari tingkat dasar sampai lanjutan. Penyampaiannya menekankan praktik langsung, sehingga peserta dapat mengulang setiap tahap secara mandiri.

Materi dibagi menurut **hari pelaksanaan**, mengikuti susunan acara pelatihan periode 15 sampai 18 September 2026. Setiap halaman hari memuat jadwal sesi, daftar materi, dan penanda bagian yang belum tersedia.

## Materi per Hari

[**Hari 1 - Dasar GIS, QGIS, dan Peta 2D**](hari-1/index.md)

Teori dasar GIS dan alur kerja WebGIS, pengolahan data spasial di QGIS, dasar HTML/CSS/JavaScript, serta peta 2D dengan Leaflet. Termasuk penyiapan lingkungan kerja: Visual Studio Code, Node.js, Next.js, dan Git.

[**Hari 2 - Peta 3D, Basis Data Spasial, dan GeoServer**](hari-2/index.md)

Peta 3D dengan CesiumJS, basis data PostgreSQL dan PostGIS, serta GeoServer sebagai layanan penyaji data spasial.

[**Hari 3 - Backend, Autentikasi, dan Deployment**](hari-3/index.md)

Prisma ORM, CRUD API, NextAuth, lalu deployment ke Google Cloud Platform: VM, Docker, Nginx, dan HTTPS.

[**Hari 4 - Penyempurnaan dan Studi Kasus**](hari-4/index.md)

Penyempurnaan aplikasi, implementasi data Gaussian Splatting, dan review alur WebGIS.

## Status Kelengkapan

Sebagian sesi pada susunan acara belum punya berkas materi di repositori ini, dan saat ini disampaikan langsung oleh instruktur. Bagian yang belum tersedia ditandai di halaman masing-masing hari, bukan dikosongkan tanpa keterangan.

| Hari | Sesi yang sudah tersedia | Sesi yang belum tersedia |
|---|---|---|
| Hari 1 | Persiapan lingkungan, peta 2D dengan Leaflet | Teori dasar GIS, praktik QGIS |
| Hari 2 | Peta 3D dengan CesiumJS, basis data spasial, GeoServer | Penjelasan ORM Prisma dan App Routes |
| Hari 3 | Prisma dan API login, NextAuth, deployment ke GCP | Penjelasan CRUD API, penjelasan GCP dan Docker |
| Hari 4 | Belum ada | Seluruh sesi Hari 4 |

## Berkas Pendukung

Beberapa halaman menyertakan berkas yang bisa diunduh langsung, misalnya `docker-compose.yml`, `nginx.conf`, dan `.env.example` pada [Konfigurasi Project](hari-3/deployment-project/konfigurasi-project.md). Berkas lain dibagikan instruktur melalui folder berkas pelatihan.
