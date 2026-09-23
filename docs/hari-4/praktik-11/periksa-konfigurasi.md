# Periksa File Konfigurasi

Bagian kedua [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). Kedua file di bawah sudah ada di repositori Anda, jadi tidak ada yang perlu diketik. Yang dikerjakan hanya memastikan isinya lengkap.

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
- Volume `/etc/letsencrypt` menunjuk lokasi di VM, bukan di repositori. Tanpa itu, `nginx -t` gagal dengan pesan file sertifikat tidak ditemukan meskipun sertifikatnya ada.

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
| `proxy_request_buffering off;` | Nginx tidak lagi menulis seluruh badan permintaan ke file sementara sebelum meneruskannya ke aplikasi. Tanpa baris ini file 1 GB ditulis dua kali ke disk, dan bilah kemajuan di browser langsung mencapai 100 persen lebih dahulu karena Nginx menerimanya jauh lebih cepat daripada aplikasi memakainya |
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

Pekerjaan berlanjut pada halaman [Isi File .env](/hari-4/praktik-11/isi-env).
