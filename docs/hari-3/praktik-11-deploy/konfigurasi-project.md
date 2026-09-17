# Konfigurasi Project

Halaman ini menyiapkan berkas yang dibutuhkan container sebelum aplikasi bisa berjalan di server. Semuanya dikerjakan di laptop, di dalam folder proyek Next.js yang sudah terhubung ke GitHub.

Ada tiga berkas baru dan dua berkas pemeriksa. Setelah selesai, seluruh berkas diuji di laptop lebih dahulu, lalu di-push ke GitHub.

## Berkas yang Akan Dibuat

| Berkas | Isi |
|---|---|
| `docker-compose.yml` | Tiga service: `nextjs`, `geoserver`, dan `nginx` |
| `nginx.conf` | Rute reverse proxy untuk portal dan GeoServer |
| `.env.example` | Daftar variabel lingkungan beserta penjelasannya |
| `scripts/check-config.mjs` | Memeriksa struktur YAML pada berkas compose dan Cloud Build |
| `scripts/periksa-nginx.mjs` | Memeriksa struktur `nginx.conf` |

## Tahap 1. Buat docker-compose.yml

Buka folder proyek Next.js di Visual Studio Code, lalu buat berkas baru bernama `docker-compose.yml` di root folder. Salin isi berkas berikut.

Isi lengkapnya bisa diunduh di sini: [docker-compose.yml](/unduhan/docker-compose.yml)

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

## Tahap 2. Buat nginx.conf

Buat berkas baru bernama `nginx.conf` di root folder proyek. Isi lengkapnya bisa diunduh di sini: [nginx.conf](/unduhan/nginx.conf)

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

Perhatikan baris terakhir. Berkas ini sengaja sudah memuat direktori `tls/`, walaupun direktori itu masih kosong pada tahap ini. Dengan begitu, berkas yang ditulis pada halaman [Penambahan Subdomain](/hari-3/praktik-11-deploy/subdomain) nanti langsung terbaca tanpa mengubah `nginx.conf` lagi.


## Tahap 3. Buat .env.example

Buat berkas baru bernama `.env.example` di root folder proyek. Berkas ini adalah contoh yang di-commit ke GitHub, sedangkan `.env` yang berisi nilai asli hanya dibuat di VM.

Isi lengkapnya bisa diunduh di sini: [env-contoh.txt](/unduhan/env-contoh.txt). Simpan berkas itu di root folder proyek dengan nama `.env.example`. Nama berkasnya berbeda saat diunduh karena VitePress tidak menyalin berkas yang namanya diawali titik.

```bash
# Salin berkas ini menjadi .env di VM, lalu isi nilai aslinya di sana.
# Jangan pernah commit berkas .env yang sudah terisi.

# Diisi otomatis oleh Cloud Build pada deploy pertama.
NEXTJS_IMAGE=nginx:1.27-alpine

# Boleh dikosongkan untuk menguji build, Nginx, dan halaman publik.
# Login, Prisma, dan fitur katalog memerlukan database yang valid.
DATABASE_URL=

# Buat dua nilai acak yang berbeda dengan: openssl rand -hex 32
JWT_SECRET=
JWT_EXPIRES_IN=1h
NEXTAUTH_SECRET=

# Wajib memakai alamat IP eksternal VM dan diakhiri slash, contoh:
# NEXTAUTH_URL=http://IP_EKSTERNAL_VM/portal/
NEXTAUTH_URL=

# Kata sandi admin GeoServer. Pakai openssl rand -hex 16 supaya hanya berisi
# huruf dan angka. Jangan memakai tanda dolar, karena compose membacanya
# sebagai variabel dan karakter setelahnya bisa hilang tanpa peringatan.
GEOSERVER_ADMIN_PASSWORD=

AUTH_API_URL=http://localhost:3000/portal/api

# Origin lengkap aplikasi, tanpa slash di akhir. Dipakai modul katalog 3D.
BASE_URL=http://IP_EKSTERNAL_VM/portal
```

Nilai `NEXTJS_IMAGE=nginx:1.27-alpine` pada berkas contoh bukan nilai akhir, melainkan nilai sementara yang bisa benar-benar ditarik Docker. Cloud Build akan menimpanya dengan image milik peserta pada deploy pertama. Jangan memakai nama karangan, karena compose akan mencoba menariknya dan berhenti dengan `pull access denied`.

## Tahap 4. Tambahkan /geoserver-data/ ke .gitignore

Buka `.gitignore` di root folder proyek, lalu tambahkan satu baris:

```
/geoserver-data/
```

Direktori itu diisi GeoServer saat container pertama kali berjalan. Isinya besar dan bersifat lokal, jadi tidak perlu ikut masuk ke repositori.


## Tahap 5. Buat folder scripts

Di root folder proyek, buat folder baru bernama `scripts`, sejajar dengan folder `public` dan `src`.

### 5a. scripts/check-config.mjs

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

### 5b. scripts/periksa-nginx.mjs

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

## Tahap 6. Uji seluruh berkas di laptop

Buka terminal di Visual Studio Code, pada folder proyek. Jalankan pemeriksa YAML:

```bash
node scripts/check-config.mjs
```

Keluaran yang diharapkan:

```
OK   docker-compose.yml -> services, networks
     service: nextjs, geoserver, nginx
GAGAL cloudbuild.yaml: ENOENT: no such file or directory, open 'cloudbuild.yaml'
```

Baris `GAGAL` wajar pada tahap ini: `cloudbuild.yaml` belum ada di laptop, dan baru dibuat pada halaman [Google Cloud Platform](/hari-3/praktik-11-deploy/google-cloud-platform). Yang perlu dipastikan adalah tiga nama service terbaca lengkap.

Selanjutnya jalankan pemeriksa Nginx:

```bash
node scripts/periksa-nginx.mjs nginx.conf
```

Keluaran yang diharapkan:

```
Berkas       : nginx.conf
proxy_pass   : $geoserver_upstream, $nextjs_upstream
resolver     : ada
HASIL: struktur konfigurasi valid
```

## Tahap 7. Commit dan push

Periksa daftar berkas yang akan di-commit lebih dahulu, jangan langsung memakai `git add .`:

```bash
git status --short
```

Pastikan `.env` tidak muncul di daftar itu. Setelah aman, lanjutkan:

```bash
git add docker-compose.yml nginx.conf .env.example .gitignore \
  scripts/check-config.mjs scripts/periksa-nginx.mjs

git commit -m "feat: tambah GeoServer dan rute nginx"
git push origin main
```

Bila `.env` ikut muncul pada `git status --short`, hentikan langkah ini. Tambahkan `.env` ke `.gitignore` lebih dahulu, baru ulangi commit.

## Hasil Tahap Ini

Repositori proyek sekarang memuat tiga berkas konfigurasi container dan dua berkas pemeriksa. Berkas `docker-compose.yml` dan `nginx.conf` akan dipakai lagi di VM pada halaman berikutnya, dan `cloudbuild.yaml` akan mengambil alih proses build mulai deploy pertama.
