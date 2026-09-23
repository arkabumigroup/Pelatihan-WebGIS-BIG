# Persiapan Repositori dan Database

Bagian pertama [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). Pekerjaannya ada di laptop: menyiapkan repositori proyek, lalu membuat database Supabase yang akan dipakai portal.

## Tahap 1. Fork dan clone repositori

Halaman ini memeriksa file yang sudah ada di repositori, jadi repositori itu harus ada di laptop Anda lebih dahulu. Seluruh pekerjaan repositori pada pelatihan ini memakai **GitHub Desktop**.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### Fork repositori

1. Buka `https://github.com/dhanyyudi/personal-geoportal-peserta` pada browser.
2. Pilih **Fork**, lalu pilih akun GitHub Anda sebagai tujuan.
3. Biarkan nama fork apa adanya, yaitu `personal-geoportal-peserta`, supaya seluruh contoh perintah pada halaman ini cocok.
4. Pastikan branch default fork adalah `main`.

### Clone fork Anda ke laptop

1. Buka GitHub Desktop, lalu pilih **File > Clone repository**.
2. Pilih tab **GitHub.com**, lalu pilih `personal-geoportal-peserta` milik akun Anda. **Pastikan yang dipilih adalah fork Anda**, bukan repositori sumbernya.
3. Tentukan folder tujuan, lalu klik **Clone**.

### Buka terminal pada folder proyek

Beberapa perintah di halaman ini dijalankan di terminal. Buka lewat **Repository > Open in Terminal** pada GitHub Desktop, supaya terminalnya langsung berada di folder proyek yang benar.

### Pasang dependensi

```bash
npm install
```

Perintah itu memuat paket yang dipakai aplikasi, termasuk Prisma dan skrip pemeriksa di folder `scripts`.

### Periksa isi repositori

Pastikan file-file berikut ada. Bila salah satunya tidak ada, berarti clone Anda belum lengkap.

```bash
ls docker-compose.yml nginx.conf .env.example Dockerfile cloudbuild.yaml
ls scripts/check-config.mjs scripts/periksa-nginx.mjs
```

### Yang tidak perlu Anda ubah

Empat file ini tidak perlu diubah. Alasan tiap baris ada di kolom terakhir, supaya tidak perlu ditanyakan lagi.

| File | Perlu diedit? | Alasan |
|---|---|---|
| `docker-compose.yml` | Tidak | Tidak ada nilai yang berbeda antar peserta. Nama service seperti `geoserver` dipakai antar container di dalam VM yang sama |
| `nginx.conf` | Tidak | Alamat tujuan memakai nama service internal, bukan alamat peserta |
| `cloudbuild.yaml` | Tidak | Seluruh nilai yang berbeda antar peserta diisi sebagai substitution variable pada trigger Cloud Build, bukan di file ini |
| `.env.example` | Tidak | File contoh. Yang diisi adalah `.env`, dan itu dibuat di VM |

Yang memang harus berbeda antar peserta, yaitu nama VM, nama image, dan subdomain, diatur pada trigger Cloud Build. Caranya ada di halaman [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build).

## Tahap 2. Siapkan database Supabase

Portal memerlukan database. Tanpanya aplikasi tetap berjalan, tetapi halaman login selalu gagal. Tahap ini dikerjakan sebelum file konfigurasi, karena `DATABASE_URL` dari sini dipakai pada Tahap 5.

<p class="dijalankan dijalankan--layanan">Dijalankan di: <strong>SQL Editor Supabase</strong></p>

Database yang dipakai adalah **Supabase**, layanan PostgreSQL yang berjalan di cloud. Peserta memakai project Supabase masing-masing.

### Buat project Supabase

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard), lalu masuk atau daftar.
2. Buat project baru dengan pilihan berikut.

    | Kolom | Nilai |
    |---|---|
    | Name | Bebas, misalnya `geoportal-nama-anda` |
    | Database Password | Buat kata sandi, lalu **simpan**. Nilainya dibutuhkan pada Tahap 5 |
    | Region | Southeast Asia (Singapore), supaya dekat dengan VM nanti |

3. Tunggu sekitar dua menit sampai project selesai dibuat.

::: warning Batas dua project pada paket gratis
Satu akun Supabase dibatasi dua project aktif. Jadi satu akun untuk satu peserta, jangan membuat beberapa project untuk satu peserta. Bila kuota habis, hapus atau pause project yang tidak dipakai.
:::

### Jalankan skrip SQL

Tabel database dibuat lewat **SQL Editor**, bukan dibuat manual satu per satu. SQL Editor adalah halaman di dalam dashboard Supabase untuk menjalankan perintah SQL, dan bentuknya seperti terminal khusus database.

Empat hal perlu dikerjakan, berurutan:

| # | Yang dijalankan | Yang dilakukan |
|---|---|---|
| 1 | Ekstensi PostGIS | Mengaktifkan PostGIS di schema `public` dan membuat schema `gis` |
| 2 | `01-schema.sql` | Membuat tiga tabel: `users`, `katalog_data_2d`, dan `katalog_data_3d` |
| 3 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama |
| 4 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca |

Langkah 1 wajib karena project Supabase yang baru dibuat belum memuat PostGIS sama sekali. Tanpa itu, unggahan layer pertama nanti gagal dengan `type "geometry" does not exist`.

**Ketiga file SQL itu ditampilkan lengkap pada halaman [Skema Database](/hari-4/praktik-11/skema-database)**, begitu juga langkah PostGIS-nya, supaya dapat disalin langsung tanpa membuka file di laptop.

Halaman itu juga memuat cara membuka SQL Editor, urutan pengerjaan, dan langkah membuat akun super admin.

### Buat akun super admin

Akun super admin dibuat oleh `02-seed-super-admin.sql`. File itu berupa template, jadi dua nilai di dalamnya harus diganti lebih dahulu.

Ringkasnya: buat hash kata sandi beserta kata sandinya, lalu isi hash itu beserta email Anda ke dalam file, lalu jalankan lewat SQL Editor. Hash-nya dapat dibuat dengan dua cara: tombol pada langkah 3 [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas), atau perintah `node scripts/hash-password.mjs` di root folder proyek.

Langkah lengkapnya ada pada halaman [Skema Database](/hari-4/praktik-11/skema-database).

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa dibuat oleh `02-seed-super-admin.sql`. Jadi file itu wajib dijalankan, bukan pilihan.
:::

Pekerjaan berlanjut pada halaman [Periksa File Konfigurasi](/hari-4/praktik-11/periksa-konfigurasi).
