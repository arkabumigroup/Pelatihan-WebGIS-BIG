# Konfigurasi Project

Halaman ini memeriksa berkas yang dibutuhkan container sebelum aplikasi bisa berjalan di server. Semuanya dikerjakan di laptop, di dalam folder proyek yang sudah Anda fork.

**Berkasnya sudah tersedia di repositori Anda.** Anda tidak perlu membuatnya dari nol. Yang perlu dikerjakan adalah memastikan kelimanya ada, memahami isinya, lalu mengujinya sebelum di-push.

Menulis berkas YAML sepanjang ini dari nol adalah sumber kesalahan paling sering. Satu spasi yang salah membuat container gagal jalan, dan pesan galatnya tidak menyebut baris yang bermasalah.

## Alur Deployment Project

Deployment Project bukan satu pekerjaan, melainkan rangkaian yang berujung pada satu hasil: Geoportal yang berjalan di alamat HTTPS dengan subdomain sendiri.

Diagram berikut menunjukkan titik mulai Anda, pekerjaan yang Anda kerjakan sendiri, bagian yang berjalan otomatis, dan hasil akhirnya.

![Alur Deployment Project dari titik mulai sampai hasil akhir. Dari atas ke bawah: fork repositori, siapkan database Supabase, buat akun super admin, isi berkas .env, uji di laptop, salin repositori ke VM, hubungkan Cloud Build, lalu git push. Setelah itu Cloud Build bekerja otomatis membangun image dan memperbarui container di VM, sehingga Geoportal terbit di alamat HTTPS bersama GeoServer.](alur-deployment-project.webp)

Ada dua batas yang perlu diperhatikan pada diagram itu:

| Batas | Artinya |
|---|---|
| Sampai `git push origin main` | Anda yang mengerjakan |
| Setelah `git push origin main` | Cloud Build mengerjakan sendiri, tanpa Anda masuk ke VM |

Jadi seluruh pekerjaan manual ada di laptop dan di VM, dan berhenti pada satu perintah push. Setelah itu, setiap perubahan yang Anda push akan otomatis sampai ke server.

## Tahap 1. Fork dan clone repositori

Halaman ini memeriksa berkas yang sudah ada di repositori, jadi repositori itu harus ada di laptop Anda lebih dahulu.

### Fork repositori

1. Buka `https://github.com/dhanyyudi/personal-geoportal-peserta` pada browser.
2. Pilih **Fork**, lalu pilih akun GitHub Anda sebagai tujuan.
3. Biarkan nama fork apa adanya, yaitu `personal-geoportal-peserta`, supaya seluruh contoh perintah pada halaman ini cocok.
4. Pastikan branch default fork adalah `main`.

### Clone fork Anda ke laptop

Ganti `USERNAME_GITHUB` dengan username GitHub Anda.

```bash
git clone https://github.com/USERNAME_GITHUB/personal-geoportal-peserta.git
cd personal-geoportal-peserta
```

### Pasang dependensi

```bash
npm install
```

Perintah itu memuat paket yang dipakai aplikasi, termasuk Prisma dan skrip pemeriksa di folder `scripts`.

### Periksa isi repositori

Pastikan berkas-berkas berikut ada. Bila salah satunya tidak ada, berarti clone Anda belum lengkap.

```bash
ls docker-compose.yml nginx.conf .env.example Dockerfile cloudbuild.yaml
ls scripts/check-config.mjs scripts/periksa-nginx.mjs
```

### Yang tidak perlu Anda ubah

Empat berkas ini tidak perlu diubah. Alasan tiap baris ada di kolom terakhir, supaya tidak perlu ditanyakan lagi.

| Berkas | Perlu diedit? | Alasan |
|---|---|---|
| `docker-compose.yml` | Tidak | Tidak ada nilai yang berbeda antar peserta. Nama service seperti `geoserver` dipakai antar container di dalam VM yang sama |
| `nginx.conf` | Tidak | Alamat tujuan memakai nama service internal, bukan alamat peserta |
| `cloudbuild.yaml` | Tidak | Seluruh nilai yang berbeda antar peserta diisi sebagai substitution variable pada trigger Cloud Build, bukan di berkas ini |
| `.env.example` | Tidak | Berkas contoh. Yang diisi adalah `.env`, dan itu dibuat di VM |

Yang memang harus berbeda antar peserta, yaitu nama VM, nama image, dan subdomain, diatur pada trigger Cloud Build. Caranya ada di halaman [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform).

## Tahap 2. Siapkan database Supabase

Portal memerlukan database. Tanpanya aplikasi tetap berjalan, tetapi halaman login selalu gagal. Tahap ini dikerjakan sebelum berkas konfigurasi, karena `DATABASE_URL` dari sini dipakai pada Tahap 5.

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

Tiga berkas perlu dijalankan, berurutan:

| # | Berkas | Yang dilakukan |
|---|---|---|
| 1 | `01-schema.sql` | Membuat tiga tabel: `users`, `katalog_data_2d`, dan `katalog_data_3d` |
| 2 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama |
| 3 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca |

**Isi ketiga berkas itu ditampilkan lengkap pada halaman [Skema Database](/hari-3/deployment-project/skema-database)**, supaya dapat disalin langsung tanpa membuka berkas di laptop.

Halaman itu juga memuat cara membuka SQL Editor, urutan pengerjaan, dan langkah membuat akun super admin.

### Buat akun super admin

Akun super admin dibuat oleh `02-seed-super-admin.sql`. Berkas itu berupa template, jadi dua nilai di dalamnya harus diganti lebih dahulu.

Ringkasnya: jalankan `node scripts/hash-password.mjs` untuk membuat hash kata sandi, isi hash itu beserta email Anda ke dalam berkas, lalu jalankan lewat SQL Editor.

Langkah lengkapnya ada pada halaman [Skema Database](/hari-3/deployment-project/skema-database).

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa lahir dari `02-seed-super-admin.sql`. Jadi berkas itu wajib dijalankan, bukan pilihan.
:::

## Berkas yang Diperiksa

| Berkas | Isi | Status di repositori |
|---|---|---|
| `docker-compose.yml` | Tiga service: `nextjs`, `geoserver`, dan `nginx` | sudah ada |
| `nginx.conf` | Rute reverse proxy untuk portal dan GeoServer | sudah ada |
| `.env.example` | Daftar variabel lingkungan beserta penjelasannya | sudah ada |
| `scripts/check-config.mjs` | Memeriksa struktur YAML pada berkas compose dan Cloud Build | sudah ada |
| `scripts/periksa-nginx.mjs` | Memeriksa struktur `nginx.conf` | sudah ada |
| `.gitignore` | Daftar berkas yang tidak boleh masuk repositori | sudah ada |
| `Dockerfile` | Cara aplikasi dibangun menjadi image container | sudah ada |
| `cloudbuild.yaml` | Otomatisasi build saat push ke branch `main` | sudah ada |

Seluruh isi tiap berkas tetap ditampilkan di halaman ini supaya Anda dapat memeriksa dan memahami maksudnya. Bandingkan dengan berkas di repositori Anda. Bila ada perbedaan, samakan dengan yang ada di repositori, bukan dengan yang tercetak di sini.

## Tahap 3. Periksa docker-compose.yml

Buka folder proyek di Visual Studio Code, lalu buka berkas `docker-compose.yml` di root folder. Berkas itu sudah ada di repositori Anda.

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

![Mengunduh nginx.conf dan docker-compose.yml dari folder berkas pelatihan](konfigurasi-project/image%2020.png)

![Membuka docker-compose.yml di Visual Studio Code](konfigurasi-project/image%2021.png)

![Memeriksa nilai pada docker-compose.yml sebelum disimpan](konfigurasi-project/image25.png)

Dua hal pada service `nginx` yang mudah terlewat, dan keduanya membuat HTTPS tidak terjangkau bila dihilangkan:

- Port `443:443` harus dipublikasikan. Tanpa itu Nginx mendengarkan di dalam container, tetapi host tidak meneruskan trafik ke sana.
- Volume `/etc/letsencrypt` menunjuk lokasi di VM, bukan di repository. Tanpa itu, `nginx -t` gagal dengan pesan berkas sertifikat tidak ditemukan meskipun sertifikatnya ada.

## Tahap 4. Periksa nginx.conf

Buka berkas `nginx.conf` di root folder proyek. Berkas itu sudah ada di repositori Anda.

Isi yang seharusnya terlihat:

```nginx
server {
    listen 80;
    server_name _;

    # Certbot menulis berkas challenge ke webroot ini, lalu Let's Encrypt
    # mengambilnya lewat http://<domain>/.well-known/acme-challenge/<token>.
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
        try_files $uri =404;
    }

    location = / {
        return 302 /portal;
    }

    # Diarahkan langsung ke bentuk kanonik tanpa slash, karena GeoServer
    # mengalihkan /geoserver/web/ ke /geoserver/web.
    location = /geoserver {
        return 302 /geoserver/web;
    }

    # Nama service di-resolve saat ada permintaan, bukan saat Nginx start.
    # Tanpa pola ini, Nginx menolak start dengan "host not found in upstream"
    # selama container nextjs belum ada. Padahal geoserver dan nginx sengaja
    # dinyalakan lebih dahulu, sebelum image nextjs dibangun.
    location /geoserver/ {
        resolver 127.0.0.11 valid=10s ipv6=off;

        set $geoserver_upstream http://geoserver:8080;
        rewrite ^/geoserver/(.*)$ /geoserver/$1 break;
        proxy_pass $geoserver_upstream;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host;

        proxy_buffers 16 16k;
        proxy_buffer_size 32k;
    }

    location / {
        resolver 127.0.0.11 valid=10s ipv6=off;

        set $nextjs_upstream http://nextjs:3000;
        proxy_pass $nextjs_upstream;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Server block HTTPS dimuat dari direktori ini. Sebelum sertifikat terbit,
# direktori tls/ kosong sehingga tidak ada berkas yang dimuat dan Nginx
# hanya melayani port 80.
include /etc/nginx/tls/*.conf;
```

Perhatikan baris terakhir. Berkas ini sengaja sudah memuat direktori `tls/`, walaupun direktori itu masih kosong pada tahap ini. Dengan begitu, berkas yang ditulis pada halaman [Penambahan Subdomain](/hari-3/deployment-project/subdomain) nanti langsung terbaca tanpa mengubah `nginx.conf` lagi.


## Tahap 5. Isi berkas .env

`DATABASE_URL` dari Tahap 2 dan `JWT_SECRET` dari perintah acak sekarang diisi ke dalam berkas `.env`. Tahap ini penting karena aplikasi tidak bisa login tanpa berkas ini.

### Salin berkas contoh

```bash
cp .env.example .env
```

Berkas `.env.example` adalah contoh yang di-commit ke GitHub, sedangkan `.env` yang berisi nilai asli tidak pernah di-commit.

### Isi bagian WAJIB

Buka `.env`, lalu isi lima nilai berikut.

| Variabel | Dari mana |
|---|---|
| `DATABASE_URL` | Tombol **Connect** di dashboard Supabase, pilih ORM/Prisma, lalu salin. Lihat catatan di bawah |
| `JWT_SECRET` | Hasil perintah acak |
| `NEXTAUTH_SECRET` | Hasil perintah acak, harus berbeda dari di atas |
| `NEXTAUTH_URL` | `http://localhost:3000/portal` untuk sekarang |
| `ADMIN_CONTACT_EMAIL` | Email Anda sendiri |

Perintah untuk membuat dua nilai acak:

```bash
# macOS atau Linux
openssl rand -hex 32

# Windows, PowerShell, atau Command Prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`NEXTAUTH_URL` diisi `localhost` untuk sekarang, dan diubah menjadi alamat VM nanti pada [Tahap 18 halaman Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform#tahap-18-isi-berkas-env).

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

**Di laptop, biarkan bagian ini kosong.** Seluruh variabel `POSTGIS_*` dan `GEOSERVER_*` diisi nanti di VM, pada [Tahap 18 halaman Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform#tahap-18-isi-berkas-env).

Alasannya, GeoServer berjalan di dalam VM lewat `docker-compose.yml`, bukan di laptop Anda. Mengisi alamat `localhost:8080` sekarang berarti menunjuk ke sesuatu yang belum ada.

Yang Anda perlukan di laptop hanya bagian **WAJIB** di atas, yaitu `DATABASE_URL` dan kunci-kunci rahasia. Itu sudah cukup untuk login dan menguji portal.

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
| `GEOSERVER_POSTGIS_DATASTORE` | `postgis_geoportal`, nama datastore yang Anda buat di [Koneksi PostgreSQL ke GeoServer](/hari-2/geoserver/koneksi-postgis) |

Di laptop, `GEOSERVER_URL` dan `GEOSERVER_PUBLIC_URL` bernilai **sama**, karena aplikasi dan browser berjalan di komputer yang sama.

#### Kapan datastore GeoServer dibuat

`GEOSERVER_POSTGIS_DATASTORE` berisi nama datastore yang Anda buat sendiri di antarmuka GeoServer, pada halaman [Koneksi PostgreSQL ke GeoServer](/hari-2/geoserver/koneksi-postgis). Nama yang dipakai sepanjang pelatihan adalah `postgis_geoportal`.

Karena datastore itu belum ada sebelum GeoServer berjalan, variabel ini **dibiarkan kosong di laptop** dan diisi di VM pada Tahap 18, setelah datastore-nya dibuat. Bila namanya tidak sama persis dengan yang ada di GeoServer, unggahan layer gagal dengan `Could not find datastore`.

#### Bila GeoServer hanya ada di VM

Biarkan kosong di laptop, lalu isi di VM:

| Variabel | Nilai di VM | Mengapa |
|---|---|---|
| `GEOSERVER_URL` | `http://geoserver:8080/geoserver` | Dipanggil aplikasi dari dalam jaringan Docker, jadi memakai nama service |
| `GEOSERVER_PUBLIC_URL` | `http://IP_EKSTERNAL_VM/geoserver` | Disimpan sebagai `wms_url`, lalu dibuka dari browser Anda, jadi harus alamat publik |

Bagian `POSTGIS_*` diisi dengan kredensial Supabase, sama seperti di laptop.

::: warning Jangan tertukar antara dua alamat itu
Ini penyebab kegagalan yang sulit dilacak.

`GEOSERVER_URL=http://localhost:8080/geoserver` **salah** di VM, karena di dalam container, `localhost` menunjuk ke container aplikasi sendiri. Unggahan layer gagal dengan `connection refused`.

`GEOSERVER_PUBLIC_URL=http://geoserver:8080/geoserver` **salah** di VM, karena nama `geoserver` hanya dikenal di dalam jaringan Docker. Alamat yang tersimpan di katalog tidak dapat dibuka dari browser Anda, dan tidak ada pesan galat yang menjelaskan sebabnya.
:::

### Pastikan .env tidak ikut ter-commit

```bash
git check-ignore -v .env
```

Keluaran yang diharapkan menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Hentikan pekerjaan sampai barisnya ditambahkan ke `.gitignore`.

## Tahap 6. Periksa .gitignore

Buka `.gitignore` di root folder proyek. Pastikan di dalamnya ada tiga baris berikut.

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

Pada mesin pengembang, folder itu berisi 60 berkas. Yang paling perlu diperhatikan bukan ukurannya, melainkan isi `security/`. Bila folder itu ikut ter-commit dan Anda push ke repositori publik, kata sandi admin GeoServer Anda dapat dibaca siapa pun.

Dua folder lainnya, `tls` dan `certbot-webroot`, berisi sertifikat HTTPS dan berkas tantangan Let's Encrypt. Fungsinya sama: keduanya dibuat di VM dan tidak boleh masuk repositori.

### Periksa dengan perintah

Jalankan dari root folder proyek:

```bash
git check-ignore -v geoserver-data tls certbot-webroot
```

Keluaran yang diharapkan menyebut ketiga folder itu beserta baris `.gitignore` yang mengabaikannya. Bila ada yang tidak muncul, berarti folder itu **tidak** diabaikan, dan hentikan pekerjaan sampai barisnya ditambahkan.

## Tahap 7. Periksa folder scripts

Di root folder proyek, pastikan ada folder bernama `scripts`, sejajar dengan folder `public` dan `src`. Folder itu berisi dua berkas pemeriksa.

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
Berkas ini memuat paket `yaml` yang tidak termasuk dependensi bawaan proyek Next.js. Tanpa pemasangan, perintah `node scripts/check-config.mjs` berhenti dengan `Error: Cannot find module 'yaml'`.

Jalankan lebih dahulu:

```bash
npm install yaml
```
:::

### 7b. scripts/periksa-nginx.mjs

```javascript
import { readFileSync } from 'node:fs';

const berkas = process.argv[2] ?? 'nginx.conf';
const isi = readFileSync(berkas, 'utf8');

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
const masalah = [];

bersih.split('\n').forEach((baris, nomor) => {
  const t = baris.trim();
  if (!t) return;

  const kurungBuka = (t.match(/\{/g) ?? []).length;
  const kurungTutup = (t.match(/\}/g) ?? []).length;
  const titikKoma = (t.match(/;/g) ?? []).length;

  if (kurungBuka > 0 && kurungTutup === 0) {
    if (!t.replace(/[{};]/g, '').trim()) {
      masalah.push(`baris ${nomor + 1}: blok dibuka tanpa nama directive di depannya`);
    }
    return;
  }
  if (kurungBuka === 0 && kurungTutup > 0 && titikKoma === 0) return;

  if (titikKoma === 0) {
    masalah.push(`baris ${nomor + 1}: "${t.slice(0, 50)}" tidak diakhiri titik koma`);
    return;
  }
  if (titikKoma > 1 && kurungBuka === 0) {
    masalah.push(`baris ${nomor + 1}: ada ${titikKoma} pernyataan tanpa blok`);
  }
});

const totalBuka = (bersih.match(/\{/g) ?? []).length;
const totalTutup = (bersih.match(/\}/g) ?? []).length;
if (totalBuka !== totalTutup) {
  masalah.push(`kurung kurawal tidak seimbang, ${totalBuka} buka dan ${totalTutup} tutup`);
}

const proxy = [...bersih.matchAll(/proxy_pass\s+([^;]+);/g)].map((m) => m[1].trim());
const adaResolver = /resolver\s+[^;]+;/.test(bersih);

if (proxy.some((p) => p.startsWith('$')) && !adaResolver) {
  masalah.push('proxy_pass memakai variabel tanpa directive resolver, nama upstream tidak akan terselesaikan');
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

## Tahap 8. Uji seluruh berkas di laptop

### Uji berkas konfigurasi

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

Skrip itu memeriksa dua belas hal sekaligus: ketiga tabel dapat dibaca, akun belum aktif ditolak, kata sandi salah ditolak, login setelah diaktifkan berhasil, katalog 2D dan 3D dapat disimpan, serta constraint dan unique email bekerja. Data ujinya dihapus kembali di akhir.

Keluaran yang diharapkan berakhir dengan `12 lulus, 0 gagal`. Bila ada yang gagal, keluarannya menyebut bagian mana yang belum siap.

## Tahap 9. Jalankan portal di laptop

Ini tahap yang membuktikan seluruh persiapan berhasil, sebelum aplikasi dipindahkan ke server. Bila login gagal di sini, penyebabnya masih mudah dilacak.

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

## Tahap 10. Pastikan tidak ada rahasia yang ikut ter-commit

Berkas konfigurasi Anda sudah ada di repositori, jadi pada tahap ini tidak ada yang perlu di-commit. Yang perlu diperiksa hanya satu hal: pastikan berkas `.env` tidak pernah ikut masuk ke Git.

```bash
git status --short
git check-ignore .env && echo "aman, .env diabaikan"
```

Keluaran `git check-ignore` harus menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Hentikan langkah ini dan tambahkan `.env` ke `.gitignore` lebih dahulu.

Berkas `.gitignore` di repositori sudah memuat pola `.env*`, sehingga `.env` dan seluruh berkas sejenis diabaikan, sementara `.env.example` tetap ikut karena dikecualikan khusus.

## Hasil Tahap Ini

Seluruh berkas konfigurasi sudah diperiksa dan lolos uji di laptop. Berkas `docker-compose.yml` dan `nginx.conf` akan dipakai lagi di VM pada halaman berikutnya, dan `cloudbuild.yaml` mengambil alih proses build mulai deploy pertama.
