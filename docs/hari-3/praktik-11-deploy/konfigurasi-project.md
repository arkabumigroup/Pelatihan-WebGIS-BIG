# Konfigurasi Project

Halaman ini memeriksa berkas yang dibutuhkan container sebelum aplikasi bisa berjalan di server. Semuanya dikerjakan di laptop, di dalam folder proyek yang sudah Anda fork.

**Berkasnya sudah tersedia di repositori Anda.** Anda tidak perlu membuatnya dari nol. Yang perlu dikerjakan adalah memastikan kelimanya ada, memahami isinya, lalu mengujinya sebelum di-push.

Menulis berkas YAML sepanjang ini dari nol adalah sumber kesalahan paling sering. Satu spasi yang salah membuat container gagal jalan, dan pesan galatnya tidak menyebut baris yang bermasalah.

## Alur Praktik 11

Sebelum mulai, penting diketahui bahwa Praktik 11 bukan satu pekerjaan, melainkan rangkaian yang berujung pada satu hasil: Geoportal yang berjalan di alamat HTTPS dengan subdomain sendiri.

Diagram berikut menunjukkan titik mulai Anda, pekerjaan yang Anda kerjakan sendiri, bagian yang berjalan otomatis, dan hasil akhirnya.

![Alur Praktik 11 dari titik mulai sampai hasil akhir. Dari atas ke bawah: fork repositori, siapkan database Supabase, buat akun super admin, isi berkas .env, uji di laptop, salin repositori ke VM, hubungkan Cloud Build, lalu git push. Setelah itu Cloud Build bekerja otomatis membangun image dan memperbarui container di VM, sehingga Geoportal terbit di alamat HTTPS bersama GeoServer.](alur-praktik-11.svg)

Ada dua batas yang perlu diperhatikan pada diagram itu:

| Batas | Artinya |
|---|---|
| Sampai `git push origin main` | Anda yang mengerjakan |
| Setelah `git push origin main` | Cloud Build mengerjakan sendiri, tanpa Anda masuk ke VM |

Jadi seluruh pekerjaan manual ada di laptop dan di VM, dan berhenti pada satu perintah push. Setelah itu, setiap perubahan yang Anda push akan otomatis sampai ke server.

## Tahap 1. Fork dan clone repositori

Halaman ini memeriksa berkas yang sudah ada di repositori. Karena itu repositori itu harus ada di laptop Anda lebih dahulu.

### Fork repositori

1. Buka `https://github.com/dhanyyudi/personal-geoportal-peserta` pada browser.
2. Pilih **Fork**, lalu pilih akun GitHub Anda sebagai tujuan.
3. Biarkan nama fork apa adanya, yaitu `personal-geoportal-peserta`, supaya seluruh contoh perintah pada Praktik 11 cocok.
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

Pastikan lima berkas berikut ada di root folder. Bila salah satunya tidak ada, berarti clone Anda belum lengkap.

```bash
ls docker-compose.yml nginx.conf .env.example Dockerfile cloudbuild.yaml
ls scripts/check-config.mjs scripts/periksa-nginx.mjs
```

### Yang TIDAK perlu Anda ubah

Ini sering ditanyakan, jadi perlu ditegaskan di awal.

| Berkas | Perlu diedit? | Alasan |
|---|---|---|
| `docker-compose.yml` | Tidak | Tidak ada nilai yang berbeda antar peserta. Nama service seperti `geoserver` dipakai antar container di dalam VM yang sama |
| `nginx.conf` | Tidak | Alamat tujuan memakai nama service internal, bukan alamat peserta |
| `cloudbuild.yaml` | Tidak | Seluruh nilai yang berbeda antar peserta diisi sebagai substitution variable pada trigger Cloud Build, bukan di berkas ini |
| `.env.example` | Tidak | Berkas contoh. Yang diisi adalah `.env`, dan itu dibuat di VM |

Nilai yang memang harus berbeda antar peserta, yaitu nama VM, nama image, dan subdomain, seluruhnya diatur pada trigger Cloud Build. Caranya ada di halaman [Google Cloud Platform](/hari-3/praktik-11-deploy/google-cloud-platform).

Jadi pekerjaan Anda di halaman ini adalah **memeriksa**, bukan mengubah.

## Berkas yang Diperiksa

| Berkas | Isi | Status di repositori |
|---|---|---|
| `docker-compose.yml` | Tiga service: `nextjs`, `geoserver`, dan `nginx` | sudah ada |
| `nginx.conf` | Rute reverse proxy untuk portal dan GeoServer | sudah ada |
| `.env.example` | Daftar variabel lingkungan beserta penjelasannya | sudah ada |
| `scripts/check-config.mjs` | Memeriksa struktur YAML pada berkas compose dan Cloud Build | sudah ada |
| `scripts/periksa-nginx.mjs` | Memeriksa struktur `nginx.conf` | sudah ada |

Seluruh isi tiap berkas tetap ditampilkan di halaman ini supaya Anda dapat memeriksa dan memahami maksudnya. Bandingkan dengan berkas di repositori Anda. Bila ada perbedaan, samakan dengan yang ada di repositori, bukan dengan yang tercetak di sini.

## Tahap 2. Periksa docker-compose.yml

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

## Tahap 3. Periksa nginx.conf

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

Perhatikan baris terakhir. Berkas ini sengaja sudah memuat direktori `tls/`, walaupun direktori itu masih kosong pada tahap ini. Dengan begitu, berkas yang ditulis pada halaman [Penambahan Subdomain](/hari-3/praktik-11-deploy/subdomain) nanti langsung terbaca tanpa mengubah `nginx.conf` lagi.


## Tahap 4. Periksa .env.example

Buka berkas `.env.example` di root folder proyek. Berkas itu sudah ada di repositori Anda.

Berkas ini adalah contoh yang di-commit ke GitHub, sedangkan `.env` yang berisi nilai asli hanya dibuat di VM dan tidak pernah di-commit.

Berkas itu tersusun dalam tiga bagian, dan pembagiannya penting:

| Bagian | Isi | Perlu diisi? |
|---|---|---|
| **WAJIB** | `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_CONTACT_EMAIL` | Ya, tanpa ini login tidak bekerja |
| **NILAI BAWAAN** | `JWT_EXPIRES_IN`, `NEXTJS_IMAGE`, dan alamat aplikasi lainnya | Biasanya tidak, sudah terisi |
| **DATA SPASIAL** | `POSTGIS_*` dan `GEOSERVER_*` | Hanya bila Anda mengunggah layer 2D |

Bagian **WAJIB** sudah dijelaskan pada [Prasyarat halaman Google Cloud Platform](/hari-3/praktik-11-deploy/google-cloud-platform#_3-berkas-env-sudah-terisi).

Satu hal yang perlu diperhatikan pada bagian DATA SPASIAL. Alamat GeoServer harus memakai nama service, bukan localhost:

```bash
# Benar. "geoserver" adalah nama service pada docker-compose.yml, dan Docker
# menerjemahkannya ke container yang tepat.
GEOSERVER_URL=http://geoserver:8080/geoserver

# Salah. Di dalam container, localhost menunjuk ke container aplikasi sendiri,
# sehingga unggahan layer gagal dengan connection refused.
GEOSERVER_URL=http://localhost:8080/geoserver
```

## Tahap 5. Periksa .gitignore

Buka `.gitignore` di root folder proyek. Pastikan di dalamnya ada baris berikut:

```
/geoserver-data/
```

Direktori itu diisi GeoServer saat container pertama kali berjalan. Isinya besar dan bersifat lokal, jadi tidak perlu ikut masuk ke repositori.


## Tahap 6. Periksa folder scripts

Di root folder proyek, pastikan ada folder bernama `scripts`, sejajar dengan folder `public` dan `src`. Folder itu berisi dua berkas pemeriksa.

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

## Tahap 7. Uji seluruh berkas di laptop

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

Baris pertama memastikan tiga service terbaca. Baris kedua memastikan `cloudbuild.yaml` dapat diurai.

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

Baris `resolver : ada` yang paling penting. Tanpa directive itu, Nginx menolak start dengan `host not found in upstream` ketika container `nextjs` belum ada.

## Tahap 8. Pastikan tidak ada rahasia yang ikut ter-commit

Berkas konfigurasi Anda sudah ada di repositori, jadi pada tahap ini tidak ada yang perlu di-commit. Yang perlu diperiksa hanya satu hal: pastikan berkas `.env` tidak pernah ikut masuk ke Git.

```bash
git status --short
git check-ignore .env && echo "aman, .env diabaikan"
```

Keluaran `git check-ignore` harus menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Hentikan langkah ini dan tambahkan `.env` ke `.gitignore` lebih dahulu.

Berkas `.gitignore` di repositori sudah memuat pola `.env*`, sehingga `.env` dan seluruh berkas sejenis diabaikan, sementara `.env.example` tetap ikut karena dikecualikan khusus.

## Hasil Tahap Ini

Kelima berkas konfigurasi sudah diperiksa dan lolos uji di laptop. Berkas `docker-compose.yml` dan `nginx.conf` akan dipakai lagi di VM pada halaman berikutnya, dan `cloudbuild.yaml` mengambil alih proses build mulai deploy pertama.
