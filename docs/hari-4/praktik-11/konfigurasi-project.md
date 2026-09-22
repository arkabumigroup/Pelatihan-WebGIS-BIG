# Konfigurasi Project

Halaman ini memeriksa file yang dibutuhkan container sebelum aplikasi bisa berjalan di server. Semuanya dikerjakan di laptop, di dalam folder proyek yang sudah Anda fork.

**Filenya sudah tersedia di repositori Anda.** Anda tidak perlu membuatnya dari nol. Yang perlu dikerjakan adalah memastikan kelimanya ada, memahami isinya, lalu mengujinya sebelum di-push.

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

Tiga file perlu dijalankan, berurutan:

| # | File | Yang dilakukan |
|---|---|---|
| 1 | `01-schema.sql` | Membuat tiga tabel: `users`, `katalog_data_2d`, dan `katalog_data_3d` |
| 2 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama |
| 3 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca |

**Isi ketiga file itu ditampilkan lengkap pada halaman [Skema Database](/hari-4/praktik-11/skema-database)**, supaya dapat disalin langsung tanpa membuka file di laptop.

Halaman itu juga memuat cara membuka SQL Editor, urutan pengerjaan, dan langkah membuat akun super admin.

### Buat akun super admin

Akun super admin dibuat oleh `02-seed-super-admin.sql`. File itu berupa template, jadi dua nilai di dalamnya harus diganti lebih dahulu.

Ringkasnya: jalankan `node scripts/hash-password.mjs` untuk membuat hash kata sandi, isi hash itu beserta email Anda ke dalam file, lalu jalankan lewat SQL Editor.

Langkah lengkapnya ada pada halaman [Skema Database](/hari-4/praktik-11/skema-database).

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa lahir dari `02-seed-super-admin.sql`. Jadi file itu wajib dijalankan, bukan pilihan.
:::

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

Seluruh isi tiap file tetap ditampilkan di halaman ini supaya Anda dapat memeriksa dan memahami maksudnya. Bandingkan dengan file di repositori Anda. Bila ada perbedaan, samakan dengan yang ada di repositori, bukan dengan yang tercetak di sini.

## Tahap 3. Periksa docker-compose.yml

Buka folder proyek di Visual Studio Code, lalu buka file `docker-compose.yml` di root folder. File itu sudah ada di repositori Anda.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

Isi yang seharusnya terlihat:

```yaml
services:
  nextjs:
    image: ${NEXTJS_IMAGE:?Set NEXTJS_IMAGE di .env}
    container_name: nextjs_portal
    env_file:
      - .env
    depends_on:
      - geoserver
    networks:
      - app-network
    restart: unless-stopped

  geoserver:
    image: kartoza/geoserver:2.24.1
    container_name: geoserver_app
    environment:
      - INITIAL_MEMORY=512m
      - MAXIMUM_MEMORY=2048m
      - GEOSERVER_ADMIN_USER=admin
      # Dibaca dari .env supaya kata sandi tidak ikut ter-commit.
      - GEOSERVER_ADMIN_PASSWORD=${GEOSERVER_ADMIN_PASSWORD}
    volumes:
      - ./geoserver-data:/opt/geoserver/data_dir
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:1.27-alpine
    container_name: nginx_proxy
    depends_on:
      - nextjs
      - geoserver
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Berkas konfigurasi dari repository.
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      # Berkas challenge ACME. Certbot menulis ke sini, Let's Encrypt membacanya.
      - ./certbot-webroot:/var/www/certbot:ro
      # Server block HTTPS. Kosong sampai sertifikat terbit, dan itu tidak masalah.
      - ./tls:/etc/nginx/tls:ro
      # Sertifikat Let's Encrypt yang ada di VM, bukan di repository.
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
```

Dua hal pada service `nginx` yang mudah terlewat, dan keduanya membuat HTTPS tidak terjangkau bila dihilangkan:

- Port `443:443` harus dipublikasikan. Tanpa itu Nginx mendengarkan di dalam container, tetapi host tidak meneruskan trafik ke sana.
- Volume `/etc/letsencrypt` menunjuk lokasi di VM, bukan di repository. Tanpa itu, `nginx -t` gagal dengan pesan file sertifikat tidak ditemukan meskipun sertifikatnya ada.

## Tahap 4. Periksa nginx.conf

Buka file `nginx.conf` di root folder proyek. File itu sudah ada di repositori Anda, jadi tidak ada yang perlu diketik.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

Periksa isinya dengan perintah ini:

```bash
grep -nE "client_max_body_size|client_body_timeout|proxy_request_buffering|proxy_.*_timeout|acme-challenge|location|proxy_pass|include" nginx.conf
```

Bagian yang harus ada, beserta alasannya:

| Baris | Kegunaan |
|---|---|
| `client_max_body_size 1024m;` | Batas bawaan Nginx hanya 1 MB, sedangkan model 3D dan file GeoJSON hampir selalu lebih besar. Nilainya 1 GB supaya Gaussian Splatting hasil rekaman utuh dapat diunggah tanpa dipangkas lebih dahulu |
| `client_body_timeout 300s;` | Jeda antar potongan badan permintaan yang masih ditoleransi. Bawaannya 60 detik, dan itu terlewati pada unggahan besar di jaringan yang lambat |
| `include /etc/nginx/tls/*.conf;` | Memuat file HTTPS yang ditulis nanti pada halaman Penambahan Subdomain. Direktori yang masih kosong bukan error bagi Nginx |
| `location /.well-known/acme-challenge/` | Let's Encrypt memeriksa kepemilikan domain lewat file di direktori ini |
| `location = /` | Mengalihkan akar domain ke `/portal` |
| `location = /geoserver` | Mengalihkan ke bentuk kanonik tanpa garis miring di akhir |
| `location /geoserver/` | Meneruskan permintaan GeoServer, dengan `Host` dikirim apa adanya supaya GeoServer tahu alamat publiknya |
| `location = /robots.txt` dan `= /sitemap.xml` | Next.js menyajikannya di bawah `/portal`, sedangkan mesin pencari memintanya di akar domain |
| `location /` | Meneruskan sisanya ke container `nextjs` |
| `proxy_request_buffering off;` | Nginx tidak lagi menulis seluruh badan permintaan ke file sementara sebelum meneruskannya ke aplikasi. Tanpa baris ini file 1 GB ditulis dua kali ke disk, dan bilah kemajuan di browser melesat ke 100 persen lebih dahulu karena Nginx menerimanya jauh lebih cepat daripada aplikasi memakainya |
| `proxy_send_timeout 1800s;` | Batas 60 detik bawaan Nginx terlewati saat mengirim badan permintaan besar ke aplikasi |
| `proxy_read_timeout 1800s;` | Batas yang sama terlewati saat menunggu aplikasi menulis filenya ke disk dan menyimpan barisnya ke database |

Blok `location /geoserver/` dan `location /` sama-sama memuat `resolver 127.0.0.11 valid=10s ipv6=off;`. Nama service di-resolve saat ada permintaan, bukan saat Nginx start. Tanpa pola itu, Nginx menolak start dengan `host not found in upstream` selama container `nextjs` belum ada, padahal `geoserver` dan `nginx` sengaja dinyalakan lebih dahulu.

::: warning Batas 1 MB bawaan Nginx
Baris `client_max_body_size` mudah terlewat, karena filenya tetap sah tanpanya dan Nginx tetap menyala.

Tanpa baris itu, unggahan di atas 1 MB ditolak Nginx dengan halaman HTML, bukan balasan JSON dari aplikasi. Peserta melihat:

```text
Unexpected token '<', "<html> ..." is not valid JSON
```

Pesan itu tidak menyebut ukuran file sama sekali, sehingga penyebabnya sulit ditemukan. Model 3D hampir selalu melewati 1 MB, dan file GeoJSON pada katalog 2D dapat ikut melewatinya.
:::

::: tip File di atas 1 GB
Browser mengirim `Content-Length` bersama unggahannya, dan Nginx memeriksa header itu sebelum membaca badannya. File yang melewati 1 GB karena itu ditolak hampir seketika, bukan setelah menunggu unggahannya selesai. Peserta melihat pesan yang menyebut batasnya, bukan halaman HTML tanpa penjelasan.

Batas 1 GB dipilih karena satu rekaman Gaussian Splatting utuh biasanya berkisar ratusan MB. Bila peserta memerlukan lebih besar, ubah `client_max_body_size` pada `nginx.conf` **dan** `BATAS_BERKAS` pada `src/app/api/katalog-data-3d/create/route.js`, lalu buat ulang container `nginx`. Keduanya sengaja dipisah: Nginx menahan lebih dahulu, sedangkan nilai pada route adalah jaring pengaman supaya permintaan tanpa `Content-Length` tidak dapat menulis melebihi batas itu ke disk.
:::

## Tahap 5. Isi file .env

`DATABASE_URL` dari Tahap 2 dan `JWT_SECRET` dari perintah acak sekarang diisi ke dalam file `.env`. Tahap ini penting karena aplikasi tidak bisa login tanpa file ini.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### Salin file contoh

```bash
cp .env.example .env
```

File `.env.example` adalah contoh yang di-commit ke GitHub, sedangkan `.env` yang berisi nilai asli tidak pernah di-commit.

### Isi bagian WAJIB

Buka `.env`, lalu isi lima nilai berikut.

| Variabel | Dari mana |
|---|---|
| `DATABASE_URL` | Tombol **Connect** di dashboard Supabase, pilih ORM/Prisma, lalu salin. Lihat catatan di bawah |
| `JWT_SECRET` | Tombol **Buat nilai acak** pada [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas) |
| `NEXTAUTH_SECRET` | Tombol yang sama, pada baris berikutnya. Nilainya sudah dipastikan berbeda |
| `NEXTAUTH_URL` | `http://localhost:3000/portal` untuk sekarang |
| `ADMIN_CONTACT_EMAIL` | Email Anda sendiri |

Dua nilai acak itu dibuat di [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas), satu halaman dengan identitas peserta. Nilainya tersimpan di browser Anda, jadi tetap sama setelah halaman dimuat ulang dan dapat dibuka lagi kapan saja tanpa membuat yang baru.

Bila Anda lebih suka terminal, keduanya juga dapat dibuat dengan:

```bash
# macOS atau Linux
openssl rand -hex 32

# Windows, PowerShell, atau Command Prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`NEXTAUTH_URL` diisi `localhost` untuk sekarang, dan diubah menjadi alamat VM nanti pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env).

### Catatan tentang DATABASE_URL

Nilai ini paling sering salah, jadi dibaca pelan-pelan.

Supabase menampilkan tiga bentuk alamat koneksi, dan ketiganya dapat dipakai dengan satu syarat pada bentuk kedua:

| Bentuk | Port | Syarat |
|---|---|---|
| Session pooler | 5432 | Tidak ada, langsung bekerja |
| Transaction pooler | 6543 | **Wajib** menambahkan `?pgbouncer=true` di akhir alamat |
| Koneksi langsung `db.<ref>.supabase.co` | 5432 | Sering gagal pada project baru, karena hostnya hanya punya alamat IPv6 |

Yang disarankan **Session pooler pada port 5432**.

```bash
DATABASE_URL="postgresql://postgres.abcdefghijklm:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Perhatikan bentuk nama penggunanya, yaitu `postgres.<ref>`, bukan `postgres` saja. Ganti `[YOUR-PASSWORD]` dengan kata sandi database dari Tahap 2. Bila kata sandinya memuat karakter khusus seperti `@` atau `#`, tulis dalam bentuk persen: `%40` dan `%23`.

Halaman connection string Supabase juga menampilkan `DIRECT_URL`. Untuk aplikasi ini, **hanya `DATABASE_URL` yang dipakai**, karena tabel dibuat lewat skrip di folder `sql/`, bukan lewat `prisma migrate`.

### Bagian DATA SPASIAL

**Di laptop, biarkan bagian ini kosong.** Seluruh variabel `POSTGIS_*` dan `GEOSERVER_*` diisi nanti di VM, pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env).

Alasannya, GeoServer berjalan di dalam VM lewat `docker-compose.yml`, bukan di laptop Anda. Mengisi alamat `localhost:8080` sekarang berarti menunjuk ke sesuatu yang belum ada.

Yang Anda perlukan di laptop hanya bagian **WAJIB** di atas, yaitu `DATABASE_URL`, `JWT_SECRET`, dan `NEXTAUTH_SECRET`. Itu sudah cukup untuk login dan menguji portal.

#### Bila Anda menjalankan GeoServer di laptop

Sebagian peserta memasang GeoServer di laptop untuk latihan Hari 2. Bila Anda melakukannya dan ingin menguji unggah layer 2D sebelum ke VM, isi bagian ini sebagai berikut.

| Variabel | Nilai di laptop |
|---|---|
| `POSTGIS_HOST` | Sesuai database yang dipakai, `localhost` bila PostgreSQL lokal |
| `POSTGIS_PORT` | `5432` |
| `POSTGIS_DB` | Nama database Anda |
| `POSTGIS_USER` | `postgres` |
| `POSTGIS_PASSWORD` | Kata sandi database Anda |
| `POSTGIS_SCHEMA` | `gis` |
| `GEOSERVER_URL` | `http://localhost:8080/geoserver` |
| `GEOSERVER_PUBLIC_URL` | `http://localhost:8080/geoserver`, sama dengan di atas |
| `GEOSERVER_USERNAME` | `admin` |
| `GEOSERVER_PASSWORD` | Kata sandi GeoServer Anda |
| `GEOSERVER_WORKSPACE` | `geoportal` |
| `GEOSERVER_POSTGIS_DATASTORE` | `postgis_geoportal`, nama datastore yang Anda buat di [Koneksi PostgreSQL ke GeoServer](/hari-2/praktik-7/koneksi-postgis) |

Di laptop, `GEOSERVER_URL` dan `GEOSERVER_PUBLIC_URL` bernilai **sama**, karena aplikasi dan browser berjalan di komputer yang sama.

#### Kapan datastore GeoServer dibuat

`GEOSERVER_POSTGIS_DATASTORE` berisi nama datastore yang Anda buat sendiri di antarmuka GeoServer, pada halaman [Koneksi PostgreSQL ke GeoServer](/hari-2/praktik-7/koneksi-postgis). Nama yang dipakai sepanjang pelatihan adalah `postgis_geoportal`.

Karena datastore itu belum ada sebelum GeoServer berjalan, variabel ini **dibiarkan kosong di laptop** dan diisi di VM pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env), setelah datastore-nya dibuat. Bila namanya tidak sama persis dengan yang ada di GeoServer, unggahan layer gagal dengan `Could not find datastore`.

#### Bila GeoServer hanya ada di VM

Biarkan kosong di laptop, lalu isi di VM:

| Variabel | Nilai di VM | Mengapa |
|---|---|---|
| `GEOSERVER_URL` | `http://geoserver:8080/geoserver` | Dipanggil aplikasi dari dalam jaringan Docker, jadi memakai nama service |
| `GEOSERVER_PUBLIC_URL` | `http://IP_EKSTERNAL_VM/geoserver` | Disimpan sebagai `wms_url`, lalu dibuka dari browser Anda, jadi harus alamat publik |

Bagian `POSTGIS_*` diisi dengan kredensial Supabase, sama seperti di laptop.

::: warning Jangan tertukar antara dua alamat itu
`GEOSERVER_URL` dipanggil aplikasi dari dalam jaringan Docker, jadi memakai nama service. `GEOSERVER_PUBLIC_URL` disimpan ke katalog lalu dibuka dari browser, jadi memakai alamat publik.

Bila keduanya tertukar, unggahan layer gagal dengan `connection refused`, atau alamat yang tersimpan tidak dapat dibuka tanpa pesan error yang menjelaskan sebabnya. Bila GeoServer Anda jalankan di laptop, kedua baris berisi `http://localhost:8080/geoserver`.
:::

### Pastikan .env tidak ikut ter-commit

Cara termudah: buka GitHub Desktop dan pastikan `.env` **tidak muncul** di daftar **Changes**. File yang diabaikan memang tidak pernah muncul di sana.

Bila ingin memastikan lewat terminal:

```bash
git check-ignore -v .env
```

Keluaran yang diharapkan menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Hentikan pekerjaan sampai barisnya ditambahkan ke `.gitignore`.

## Tahap 6. Periksa .gitignore

Buka `.gitignore` di root folder proyek. Pastikan di dalamnya ada tiga baris berikut.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

```
/geoserver-data/
/tls/
/certbot-webroot/
```

Baris itu sudah ada di repositori, jadi tidak perlu ditambahkan. Yang perlu Anda lakukan hanya memastikan ketiganya masih ada.

### Mengapa ini penting

Ketiga folder itu dibuat di **dalam VM**, oleh container yang berjalan di sana, bukan di laptop Anda. Karena itu langkah ini berlaku untuk semua sistem, termasuk Windows.

Yang paling berbahaya adalah `geoserver-data`, karena di dalamnya GeoServer menyimpan:

| Folder | Isinya |
|---|---|
| `security/` | Konfigurasi pengguna dan **kata sandi admin GeoServer** |
| `styles/` | Gaya tampilan layer |
| `gwc/` | Cache tile |
| `logs/` | Catatan aktivitas |

Pada mesin pengembang, folder itu berisi 60 file. Yang paling perlu diperhatikan bukan ukurannya, melainkan isi `security/`. Bila folder itu ikut ter-commit dan Anda push ke repositori publik, kata sandi admin GeoServer Anda dapat dibaca siapa pun.

Dua folder lainnya, `tls` dan `certbot-webroot`, berisi sertifikat HTTPS dan file tantangan Let's Encrypt. Fungsinya sama: keduanya dibuat di VM dan tidak boleh masuk repositori.

### Periksa dengan perintah

Jalankan dari root folder proyek. Perhatikan **garis miring di akhir** setiap nama:

```bash
git check-ignore -v geoserver-data/ tls/ certbot-webroot/
```

Keluaran yang diharapkan, tiga baris seperti ini:

```
.gitignore:52:/geoserver-data/	geoserver-data/
.gitignore:56:/tls/	tls/
.gitignore:57:/certbot-webroot/	certbot-webroot/
```

::: warning Garis miring di akhir itu wajib
Ketiga baris pada `.gitignore` diakhiri garis miring, dan dalam aturan `.gitignore` artinya pola itu **hanya berlaku untuk direktori**.

Folder `geoserver-data`, `tls`, dan `certbot-webroot` belum ada di laptop Anda. Ketiganya baru dibuat di VM saat container berjalan. Tanpa garis miring pada perintah di atas, Git tidak tahu bahwa yang Anda maksud adalah direktori, sehingga perintahnya **tidak mengeluarkan apa pun**.

Keluaran yang kosong di sini berarti perintahnya kurang tepat, bukan berarti folder Anda tidak diabaikan.
:::

Bila salah satu baris benar-benar tidak muncul walaupun garis miringnya sudah disertakan, berarti folder itu **tidak** diabaikan. Hentikan pekerjaan sampai barisnya ditambahkan ke `.gitignore`.

## Tahap 7. Periksa folder scripts

Di root folder proyek, pastikan ada folder bernama `scripts`, sejajar dengan folder `public` dan `src`. Folder itu berisi dua file pemeriksa.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### 7a. scripts/check-config.mjs

```javascript
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// YAML dimuat lewat createRequire karena paket ini berbentuk CommonJS,
// sehingga import bernama tidak tersedia di berkas .mjs.
const YAML = createRequire(import.meta.url)('yaml');

const names = ['docker-compose.yml', 'cloudbuild.yaml'];
let failed = false;

for (const file of names) {
  try {
    const data = YAML.parse(readFileSync(file, 'utf8'));
    console.log('OK   ' + file + ' -> ' + Object.keys(data).join(', '));
    if (names[0] === file) {
      const services = Object.keys(data.services ?? {});
      console.log('     service: ' + services.join(', '));
      if (services.length !== 3) {
        console.error('     HARUS 3 service, ditemukan ' + services.length);
        failed = true;
      }
    }
  } catch (error) {
    console.error('GAGAL ' + file + ': ' + error.message);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
```

::: warning Pasang paket yaml lebih dahulu
File ini memuat paket `yaml` yang tidak termasuk dependensi bawaan proyek Next.js. Tanpa pemasangan, perintah `node scripts/check-config.mjs` berhenti dengan `Error: Cannot find module 'yaml'`.

Jalankan lebih dahulu:

```bash
npm install yaml
```
:::

### 7b. scripts/periksa-nginx.mjs

```javascript
// Pemeriksa berkas konfigurasi Nginx yang berjalan dengan Node.js saja.
// Tidak memerlukan Docker maupun Podman, supaya semua asisten bisa memakainya
// di sistem operasi apa pun.
//
// Jalankan: node scripts/periksa-nginx.mjs nginx.conf
import { readFileSync } from 'node:fs';

const berkas = process.argv[2] ?? 'nginx.conf';
const isi = readFileSync(berkas, 'utf8');

// Buang komentar, tetapi hormati tanda kutip supaya tanda # di dalam nilai aman.
function tanpaKomentar(teks) {
  let hasil = '';
  let kutip = null;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      hasil += c;
      if (c === kutip && teks[i - 1] !== '\\') kutip = null;
      continue;
    }
    if (c === '"' || c === "'") { kutip = c; hasil += c; continue; }
    if (c === '#') { while (i < teks.length && teks[i] !== '\n') i++; hasil += '\n'; continue; }
    hasil += c;
  }
  return hasil;
}

const bersih = tanpaKomentar(isi);

// Token: directive sebagai teks, ditambah { } ;
function tokenisasi(teks) {
  const token = [];
  let buf = '';
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (c === '"' || c === "'") {
      let nilai = c;
      i++;
      while (i < teks.length && teks[i] !== c) { nilai += teks[i]; i++; }
      buf += nilai;
      continue;
    }
    if (c === '{' || c === '}' || c === ';') {
      if (buf.trim()) token.push({ tipe: 'teks', nilai: buf.trim() });
      token.push({ tipe: c });
      buf = '';
      continue;
    }
    buf += c;
  }
  if (buf.trim()) token.push({ tipe: 'teks', nilai: buf.trim() });
  return token;
}

const token = tokenisasi(bersih);
const masalah = [];
const namaBlok = [];
let kedalaman = 0;

// Periksa struktur per baris. Pendekatan ini dipilih karena menghilangkan titik
// koma membuat dua baris menyatu menjadi satu, sehingga jumlah titik koma pada
// baris itu menjadi kurang dari jumlah pernyataannya.
const barisKode = bersih.split('\n');
barisKode.forEach((baris, nomor) => {
  const t = baris.trim();
  if (!t) return;

  const kurungBuka = (t.match(/\{/g) ?? []).length;
  const kurungTutup = (t.match(/\}/g) ?? []).length;
  const titikKoma = (t.match(/;/g) ?? []).length;

  // Baris yang hanya membuka blok wajib menyebut nama direktifnya lebih dahulu,
  // misalnya "server {" atau "location / {". Kurung buka tanpa nama direktif
  // membuat Nginx menolak seluruh berkas.
  if (kurungBuka > 0 && kurungTutup === 0) {
    const tanpaKurung = t.replace(/[{};]/g, '').trim();
    if (!tanpaKurung) {
      masalah.push(`baris ${nomor + 1}: blok dibuka tanpa nama directive di depannya`);
    }
    return;
  }
  if (kurungBuka === 0 && kurungTutup > 0 && titikKoma === 0) return;

  // Satu pernyataan pada satu baris wajib diakhiri titik koma, kecuali baris
  // itu membuka blok yang ditutup pada baris yang sama.
  if (titikKoma === 0) {
    masalah.push(`baris ${nomor + 1}: "${t.slice(0, 50)}" tidak diakhiri titik koma`);
    return;
  }

  // Lebih dari satu pernyataan pada satu baris hanya sah bila ada blok di
  // dalamnya, misalnya "location / { proxy_pass ...; }".
  if (titikKoma > 1 && kurungBuka === 0) {
    masalah.push(`baris ${nomor + 1}: ada ${titikKoma} pernyataan tanpa blok, kemungkinan baris menyatu karena titik koma hilang`);
  }
});

// Periksa keseimbangan kurung kurawal secara keseluruhan
const totalBuka = (bersih.match(/\{/g) ?? []).length;
const totalTutup = (bersih.match(/\}/g) ?? []).length;
if (totalBuka !== totalTutup) {
  masalah.push(`kurung kurawal tidak seimbang, ${totalBuka} buka dan ${totalTutup} tutup`);
}

// Periksa hal yang bergantung antar directive.
const proxy = [...bersih.matchAll(/proxy_pass\s+([^;]+);/g)].map((m) => m[1].trim());
// Setelah alamat resolver masih ada opsi lain, misalnya valid dan ipv6,
// jadi polanya harus menangkap sampai titik koma, bukan satu kata saja.
const adaResolver = /resolver\s+[^;]+;/.test(bersih);
const pakaiVariabel = proxy.some((p) => p.startsWith('$'));

if (pakaiVariabel && !adaResolver) {
  masalah.push('proxy_pass memakai variabel tetapi tidak ada directive resolver, nama upstream tidak akan terselesaikan');
}
if (!/server\s*\{/.test(bersih)) masalah.push('tidak ada blok server');
if (!/listen\s+\d+/.test(bersih)) masalah.push('tidak ada directive listen');
if (proxy.length === 0) masalah.push('tidak ada proxy_pass sama sekali');

console.log(`Berkas       : ${berkas}`);
console.log(`proxy_pass   : ${proxy.length > 0 ? proxy.join(', ') : '(tidak ada)'}`);
console.log(`resolver     : ${adaResolver ? 'ada' : 'tidak ada'}`);

if (masalah.length === 0) {
  console.log('HASIL: struktur konfigurasi valid');
  process.exit(0);
}
console.log(`HASIL: ${masalah.length} masalah`);
for (const m of masalah) console.log(` - ${m}`);
process.exit(1);
```

### 7c. File lain di folder scripts

Selain empat skrip di atas, folder `scripts` memuat empat file yang dipakai pada keperluan tertentu. Tidak diperlukan untuk menyiapkan atau menjalankan portal, tetapi berguna saat Anda mengerjakan data spasial di Hari 2.

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

Skrip itu memeriksa **tiga belas** hal sekaligus. Data ujinya dihapus kembali di akhir, jadi database Anda tidak ditinggalkan dalam keadaan kotor.

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

| Gejala | Penyebab yang paling sering |
|---|---|
| `Can't reach database server` | `DATABASE_URL` salah, atau memakai port 6543 tanpa `?pgbouncer=true` |
| `Email atau password salah` | Kata sandi tidak cocok dengan hash di database |
| `Akun anda belum di aktivasi` | Kolom `is_active` masih `false`. Jalankan `UPDATE users SET is_active = true WHERE email = 'email-anda';` di SQL Editor |
| Halaman login terbuka tetapi tombol tidak bekerja | `JWT_SECRET` atau `NEXTAUTH_SECRET` kosong |

Setelah berhasil login, hentikan server dengan `Ctrl+C`. Aplikasi siap dipindahkan ke server.

## Tahap 10. Pastikan file .env tidak ikut ter-commit

File `.env` memuat kata sandi basis data, `JWT_SECRET`, `NEXTAUTH_SECRET`, kata sandi admin GeoServer, dan token Cesium Ion Anda. Repositori GitHub bersifat publik, jadi file itu tidak boleh ikut ter-push.

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
