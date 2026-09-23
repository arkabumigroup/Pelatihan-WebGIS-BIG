# Uji dan Jalankan Portal

Bagian terakhir [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). Seluruh file sudah diperiksa, jadi sekarang diuji bersama-sama lalu portal dijalankan sampai bisa login di laptop.

## Tahap 7. Periksa folder scripts

Di root folder proyek, pastikan ada folder bernama `scripts`, sejajar dengan folder `public` dan `src`. Folder itu berisi dua file pemeriksa.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### 7a. scripts/check-config.mjs

File ini memeriksa struktur YAML pada `docker-compose.yml` dan `cloudbuild.yaml`, lalu memastikan jumlah service pada file compose tepat tiga.

::: warning Pasang paket yaml lebih dahulu
File ini memuat paket `yaml` yang tidak termasuk dependensi bawaan proyek Next.js. Tanpa pemasangan, perintah `node scripts/check-config.mjs` berhenti dengan `Error: Cannot find module 'yaml'`.

Jalankan lebih dahulu:

```bash
npm install yaml
```
:::

### 7b. scripts/periksa-nginx.mjs
File ini memeriksa struktur `nginx.conf`: baris wajib yang belum ada, dan baris yang salah tulis. Pemeriksaannya dijalankan pada Tahap 8.

### 7c. File lain di folder scripts

Selain skrip di atas, folder `scripts` memuat empat file yang dipakai pada keperluan tertentu. Tidak diperlukan untuk menyiapkan atau menjalankan portal, tetapi berguna saat Anda mengerjakan data spasial di Hari 2.

| File | Untuk apa |
|---|---|
| `geojson-ke-csv-wkt.mjs` | Mengubah GeoJSON menjadi CSV dengan kolom WKT. Dipakai karena store GeoJSON tidak tersedia pada GeoServer bawaan |
| `geojson-ke-shapefile-zip.mjs` | Mengubah GeoJSON menjadi shapefile lalu membungkusnya menjadi satu zip, untuk diunggah ke GeoServer |
| `verifikasi-shapefile.mjs` | Memeriksa file shapefile hasil skrip di atas, tanpa pustaka luar |
| `uji-periksa-nginx.mjs` | Menguji `periksa-nginx.mjs` memakai file yang sengaja dirusak |

Menjalankan salah satunya tanpa argumen akan menampilkan cara pakainya.

## Tahap 8. Uji seluruh file di laptop

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### Uji file konfigurasi

Buka terminal di Visual Studio Code, pada folder proyek. Jalankan pemeriksa YAML:

```bash
node scripts/check-config.mjs
```

Keluaran yang diharapkan, persis seperti ini:

```
OK   docker-compose.yml -> services, networks
     service: nextjs, geoserver, nginx
OK   cloudbuild.yaml -> substitutions, steps, images, options
```

Selanjutnya jalankan pemeriksa Nginx:

```bash
node scripts/periksa-nginx.mjs nginx.conf
```

Keluaran yang diharapkan:

```
Berkas       : nginx.conf
proxy_pass   : $nextjs_upstream/portal/robots.txt, $nextjs_upstream/portal/sitemap.xml, $geoserver_upstream, $nextjs_upstream
resolver     : ada
HASIL: struktur konfigurasi valid
```

Baris `resolver : ada` yang menentukan. Tanpa directive itu, Nginx menolak start dengan `host not found in upstream` ketika container `nextjs` belum ada.

### Uji database

Periksa apakah skema database sudah benar dan alur login bekerja:

```bash
node scripts/uji-database.mjs
```

Skrip itu memeriksa **tiga belas** hal sekaligus. Data ujinya dihapus kembali di akhir, jadi database Anda tidak ditinggalkan dengan data uji di dalamnya.

Keluaran yang diharapkan, tiga belas baris `LULUS` tanpa satu pun `GAGAL`:

```text
HASIL UJI DATABASE
======================================================================
  LULUS  tabel users dapat dibaca
  LULUS  tabel katalog_data_2d dapat dibaca
  LULUS  tabel katalog_data_3d dapat dibaca
  LULUS  menulis user baru
  LULUS  akun belum aktif ditolak
  LULUS  kata sandi salah ditolak
  LULUS  login setelah diaktifkan berhasil
  LULUS  menyimpan katalog 3D
  LULUS  tipe_file terisi otomatis
  LULUS  menyimpan katalog 2D
  LULUS  role tidak sah ditolak
  LULUS  role editor ditolak
  LULUS  email ganda ditolak
======================================================================
13 lulus, 0 gagal
```

Baris terakhir harus berbunyi `13 lulus, 0 gagal`. Bila ada yang gagal, keluarannya menyebut bagian mana yang belum siap.

::: tip Angka 13, bukan 12
Salah satu dari ketiga belas pemeriksaan itu memastikan database **menolak** peran di luar `admin` dan `viewer`, supaya peran asing tidak dapat masuk tanpa disadari.
:::

## Tahap 9. Jalankan portal di laptop

Ini tahap yang membuktikan seluruh persiapan berhasil, sebelum aplikasi dipindahkan ke server. Bila login gagal di sini, penyebabnya masih mudah dilacak.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

```bash
npm run dev
```

Buka [http://localhost:3000/portal](http://localhost:3000/portal), lalu masuk memakai email dan kata sandi super admin dari Tahap 2.

Yang harus terjadi:

| Yang diperiksa | Hasil yang diharapkan |
|---|---|
| Halaman login terbuka | Formulir email dan kata sandi tampil |
| Login super admin | Berhasil masuk ke halaman `/portal/internal` |
| Dashboard | Menampilkan jumlah data dan jumlah akun |
| Menu Kelola Akun | Menampilkan daftar akun, termasuk akun super admin Anda |

Bila login gagal, periksa berurutan:

| Error | Penyebab yang paling sering |
|---|---|
| `Can't reach database server` | `DATABASE_URL` salah, atau memakai port 6543 tanpa `?pgbouncer=true` |
| `Email atau password salah` | Kata sandi tidak cocok dengan hash di database |
| `Akun anda belum di aktivasi` | Kolom `is_active` masih `false`. Jalankan `UPDATE users SET is_active = true WHERE email = 'email-anda';` di SQL Editor |
| Halaman login terbuka tetapi tombol tidak bekerja | `JWT_SECRET` atau `NEXTAUTH_SECRET` kosong |

Setelah berhasil login, hentikan server dengan `Ctrl+C`. Aplikasi siap dipindahkan ke server.

## Tahap 10. Pastikan file .env tidak ikut ter-commit

File `.env` memuat kata sandi database, `JWT_SECRET`, `NEXTAUTH_SECRET`, kata sandi admin GeoServer, dan token Cesium Ion Anda. Repositori GitHub bersifat publik, jadi file itu tidak boleh ikut ter-push.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

File konfigurasi Anda sudah ada di repositori, jadi pada tahap ini tidak ada yang perlu di-commit. Yang perlu diperiksa hanya satu: pastikan `.env` tidak muncul di daftar **Changes** pada GitHub Desktop. File yang diabaikan memang tidak pernah muncul di sana.

Bila ingin memastikan lewat terminal:

```bash
git check-ignore .env && echo "aman, .env diabaikan"
```

Keluaran `git check-ignore` harus menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Tambahkan `.env` ke `.gitignore` lebih dahulu.

File `.gitignore` di repositori sudah memuat pola `.env*`, sehingga `.env` dan seluruh file sejenis diabaikan, sementara `.env.example` tetap ikut karena dikecualikan khusus.

## Hasil Tahap Ini

Seluruh file konfigurasi sudah diperiksa dan lolos uji di laptop. File `docker-compose.yml` dan `nginx.conf` akan dipakai lagi di VM pada halaman berikutnya, dan `cloudbuild.yaml` mengambil alih proses build mulai deploy pertama.
