# Hari 3 - Backend, Autentikasi, dan Deployment

Hari ketiga menutup rantai pengembangan. Sesi pagi menghubungkan aplikasi ke basis data, membangun CRUD API, lalu mengamankan API itu dengan NextAuth. Sesi siang memindahkan seluruh aplikasi dari laptop ke server: membuat VM di Google Cloud, membangun image Docker, menjalankan GeoServer serta Nginx di dalamnya, dan memasang Reverse Proxy.

## Jadwal Hari 3

Mengacu pada susunan acara pelatihan periode 15 sampai 18 September 2026.

| Waktu | Kegiatan | Materi di halaman ini |
|---|---|---|
| 08.00 - 10.00 | Membuat koneksi database dengan ORM, membuat CRUD API | [Backend dan Autentikasi](#backend-dan-autentikasi) |
| 10.15 - 12.00 | Penjelasan NextAuth, session, hashing, enkripsi. Membuat session, logika hak akses, konfigurasi middleware | [Backend dan Autentikasi](#backend-dan-autentikasi) |
| 13.00 - 14.30 | Penjelasan GCP, VM, Docker dan Nginx | [Deployment ke Google Cloud](#deployment-ke-google-cloud) |
| 14.45 - 16.00 | Pembuatan VM dan Artifact Registry, build project Next.js di Docker, konfigurasi Reverse Proxy Nginx | [Deployment ke Google Cloud](#deployment-ke-google-cloud) |

::: warning Dua blok belum punya berkas materi
Penjelasan CRUD API pada blok pagi dan penjelasan GCP, VM, Docker serta Nginx sebelum sesi praktik belum punya halaman di repositori ini. Keduanya saat ini disampaikan langsung oleh instruktur. Halaman ini akan diperbarui begitu materinya tersedia.
:::

## Backend dan Autentikasi

Bagian ini menghubungkan aplikasi Next.js ke basis data dan menambahkan sistem login.

1. [Konfigurasi Prisma dan Membuat API Login](/hari-3/backend-auth/prisma-api-login) - memasang Prisma ORM, menyambungkannya ke PostgreSQL, dan membuat endpoint login.
2. [Konfigurasi Access Token dan NextAuth](/hari-3/backend-auth/nextauth-access-token) - membuat session, mengatur hak akses, dan mengonfigurasi middleware.

## Deployment ke Google Cloud

Halaman-halaman berikut adalah satu rangkaian. Berkas yang dibuat pada tahap pertama dipakai pada tahap kedua, dan konfigurasi Nginx yang dibuat pada tahap pertama baru berguna setelah sertifikat pada tahap ketiga terbit.

1. [Konfigurasi Project](/hari-3/praktik-11-deploy/konfigurasi-project) - menyiapkan `docker-compose.yml`, `nginx.conf`, `.env.example`, dan pemeriksa konfigurasi di repositori proyek.
2. [Google Cloud Platform](/hari-3/praktik-11-deploy/google-cloud-platform) - menyiapkan Cloud Shell, service account, VM, IP statis, Docker, lalu menjalankan GeoServer dan Nginx.
3. [Penambahan Subdomain](/hari-3/praktik-11-deploy/subdomain) - mengarahkan subdomain ke IP statis VM dan menerbitkan sertifikat Let's Encrypt.

## Yang Perlu Disiapkan Peserta

- Akses ke Google Cloud project dari koordinator, beserta identitas peserta untuk `PARTICIPANT_ID`.
- Akun GitHub berisi fork repositori proyek. Berkas `cloudbuild.yaml` dan pemeriksa konfigurasi diambil dari sana.
- Domain dari penyelenggara beserta subdomain yang sudah ditetapkan, dipakai pada [Penambahan Subdomain](/hari-3/praktik-11-deploy/subdomain).
- Berkas `.env.example` dari instruktur, dipakai pada [Konfigurasi Project](/hari-3/praktik-11-deploy/konfigurasi-project).

## Hasil Akhir Hari 3

Di akhir hari, Geoportal sudah berjalan di alamat `http://IP_EKSTERNAL_VM/portal`, sistem login berfungsi, dan GeoServer dapat diakses dari halaman yang sama. Setelah tahap subdomain selesai, alamat itu berubah menjadi `https://SUBDOMAIN/portal` dan sertifikatnya dipercaya browser.
