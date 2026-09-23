# Konfigurasi Project

Halaman ini memeriksa file yang dibutuhkan container sebelum aplikasi bisa berjalan di server. Semuanya dikerjakan di laptop, di dalam folder proyek yang sudah Anda fork.

**Filenya sudah tersedia di repositori Anda.** Anda tidak perlu membuatnya dari nol.

Pekerjaannya dipecah menjadi empat bagian supaya tidak menumpuk dalam satu halaman panjang. Kerjakan berurutan.

| Bagian | Isinya |
|---|---|
| [1. Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database) | Fork dan clone repositori, lalu membuat project Supabase |
| [2. Periksa File Konfigurasi](/hari-4/praktik-11/periksa-konfigurasi) | Memastikan `docker-compose.yml` dan `nginx.conf` lengkap |
| [3. Isi File .env](/hari-4/praktik-11/isi-env) | Mengisi seluruh nilai yang dibutuhkan container |
| [4. Uji dan Jalankan Portal](/hari-4/praktik-11/uji-dan-jalankan) | Menguji file konfigurasi, lalu menjalankan portal sampai bisa login |

## Alur Deployment Project

Deployment Project bukan satu pekerjaan, melainkan rangkaian yang berujung pada satu hasil: Geoportal yang berjalan di alamat HTTPS dengan subdomain sendiri.

Diagram berikut menunjukkan titik mulai Anda, pekerjaan yang Anda kerjakan sendiri, bagian yang berjalan otomatis, dan hasil akhirnya.

![Alur Deployment Project dari titik mulai sampai hasil akhir, dua belas langkah. Dikerjakan sebelum menyentuh server: fork repositori lalu clone ke laptop, siapkan database Supabase, buat akun super admin, periksa file konfigurasi, isi file .env, lalu uji di laptop sampai bisa login. Menyiapkan server: buat VM lalu salin repositori ke dalamnya, hubungkan Cloud Build ke GitHub, lalu klik Push origin di GitHub Desktop. Setelah itu berjalan sendiri: Cloud Build membangun image dan container di VM diperbarui tanpa masuk ke VM. Hasilnya Geoportal terbit di alamat HTTPS bersama GeoServer. Setiap kotak ditandai tempat menjalankannya.](alur-deployment-project.png)

Ada dua batas yang perlu diperhatikan pada diagram itu:

| Batas | Artinya |
|---|---|
| Sampai **Push origin** di GitHub Desktop | Anda yang mengerjakan |
| Setelah **Push origin** | Cloud Build mengerjakan sendiri, tanpa Anda masuk ke VM |

Diagram itu menuliskan langkah terakhirnya sebagai `git push origin main`. Pada pelatihan ini perintah tersebut **tidak perlu Anda ketik**, karena seluruh pekerjaan repositori dikerjakan lewat GitHub Desktop. Padanannya adalah tombol **Push origin** pada aplikasi itu.

Jadi seluruh pekerjaan manual ada di laptop dan di VM, dan berhenti pada satu kali push. Setelah itu, setiap perubahan yang Anda push akan otomatis sampai ke server.

## File yang Diperiksa

| File | Isi | Status di repositori |
|---|---|---|
| `docker-compose.yml` | Tiga service: `nextjs`, `geoserver`, dan `nginx` | sudah ada |
| `nginx.conf` | Rute reverse proxy untuk portal dan GeoServer | sudah ada |
| `.env.example` | Daftar variabel lingkungan beserta penjelasannya | sudah ada |
| `scripts/check-config.mjs` | Memeriksa struktur YAML pada file compose dan Cloud Build | sudah ada |
| `scripts/periksa-nginx.mjs` | Memeriksa struktur `nginx.conf` | sudah ada |
| `.gitignore` | Daftar file yang tidak boleh masuk repositori | sudah ada |
| `Dockerfile` | Cara aplikasi dibangun menjadi image container | sudah ada |
| `cloudbuild.yaml` | Otomatisasi build saat push ke branch `main` | sudah ada |

Isi file yang perlu diperiksa ditampilkan di halaman ini supaya Anda dapat memahami maksudnya. Dua skrip pemeriksa pada folder `scripts` tidak ditampilkan karena filenya panjang, dan keduanya cukup dipastikan ada lalu dijalankan pada Tahap 8.

Bandingkan dengan file di repositori Anda. Bila ada perbedaan, samakan dengan yang ada di repositori, bukan dengan yang tercetak di halaman bagiannya.
