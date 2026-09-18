# Penambahan Subdomain

Halaman ini melanjutkan [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform). Setelah tahap ini selesai, Geoportal dapat dibuka melalui `https://nama01.webgisbig.com/portal` dengan sertifikat yang dipercaya browser, bukan lagi melalui alamat IP.

Urutannya penting: record DNS harus sudah mengarah ke VM sebelum Certbot dijalankan. Let's Encrypt memverifikasi kepemilikan domain dengan mengakses alamat tersebut dari internet, sehingga sertifikat tidak akan terbit selama alamatnya belum bisa dijangkau.

## Prasyarat

- Bagian A sampai D pada halaman [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform) sudah selesai, dan variabel `PROJECT_ID`, `ZONE`, `VM_NAME`, serta `SUBDOMAIN` masih tersedia di Cloud Shell.
- Bila sesi Cloud Shell sudah berganti, jalankan kembali blok Tahap 2 halaman sebelumnya lebih dahulu.
- Subdomain sudah ditetapkan penyelenggara. Pola yang dipakai adalah `<nama-peserta>.webgisbig.com`, memakai nilai dari kolom Nama Peserta pada tabel peserta.
- Record DNS ditambahkan penyelenggara. Siapkan subdomain dan alamat IP statis VM untuk dilaporkan pada Tahap 3.

## Bagian A. Mengarahkan Subdomain ke VM

### Tahap 1. Pastikan IP statis VM sudah terkunci

Dijalankan di: Cloud Shell

```bash
gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" \
  --format="table(name,address,status)"
```

Status harus `RESERVED`, dan alamat yang tampil harus sama dengan IP eksternal VM. Record A yang menunjuk ke IP dinamis akan rusak begitu VM dimatikan dan dinyalakan kembali.

### Tahap 2. Tentukan nama subdomain

Dijalankan di: Cloud Shell

```bash
SUBDOMAIN="${PARTICIPANT_ID}.webgisbig.com"
echo "$SUBDOMAIN"
```

### Tahap 3. Kirim IP VM dan subdomain ke penyelenggara

Dijalankan di: Cloud Shell

Record DNS **ditambahkan oleh penyelenggara**, bukan oleh peserta. Domain `webgisbig.com` dikelola satu akun Cloudflare oleh penyelenggara, dan peserta tidak diberi akses ke sana.

Yang perlu Anda lakukan hanya melaporkan dua nilai:

| Yang dilaporkan | Contoh | Diambil dari |
|---|---|---|
| Subdomain | `dhanypedia.webgisbig.com` | `$SUBDOMAIN` |
| Alamat IP statis | `34.101.xx.xx` | `$STATIC_IP` |

Kirim keduanya ke penyelenggara:

```bash
echo "Subdomain : $SUBDOMAIN"
echo "IP statis : $(gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" --project="$PROJECT_ID" --format='value(address)')"
```

Selama record belum ditambahkan, `dig` pada Tahap 4 akan mengembalikan kosong. Itu wajar, bukan tanda ada yang salah pada VM Anda.

::: warning Cara menambahkan record di Cloudflare
Bagian ini untuk penyelenggara, bukan peserta.

Isi record sebagai berikut:

| Kolom | Nilai |
|---|---|
| Type | `A` |
| Name | `PARTICIPANT_ID` saja, tanpa `.webgisbig.com` |
| IPv4 address | Alamat IP statis VM peserta |
| Proxy status | **DNS only**, bukan Proxied |
| TTL | `Auto` |

**Proxy status harus DNS only**, yaitu awan kelabu, bukan awan jingga. Alasannya dijelaskan pada bagian berikut.
:::

### Mengapa proxy Cloudflare harus dimatikan

Certbot pada halaman ini memakai metode `webroot`, sehingga Let's Encrypt memverifikasi kepemilikan domain dengan mengakses alamat berikut dari internet:

```text
http://<subdomain>/.well-known/acme-challenge/<token>
```

Bila record diproksikan, permintaan itu tidak langsung menuju VM, melainkan melewati Cloudflare lebih dahulu. Cloudflare kemudian meneruskannya ke VM memakai mode SSL/TLS yang sedang berlaku, dan beberapa mode yang umum dipakai justru menggagalkan penerbitan sertifikat pertama.

Mode **Full (strict)** adalah contohnya. Cloudflare meminta sertifikat yang sah dari VM, sedangkan sertifikat itu justru yang sedang hendak diterbitkan. Keadaannya berputar: sertifikat butuh verifikasi, verifikasi butuh sertifikat.

Masalah ini dikenal luas di luar pelatihan ini, misalnya pada [Stack Harbor](https://stackharbor.com/en/knowledge-base/cffix-lets-encrypt-http01-behind-proxy/) dan [diskusi cert-manager](https://github.com/cert-manager/cert-manager/discussions/6471).

Dengan **DNS only**, Let's Encrypt menghubungi VM secara langsung. Tidak ada lapisan yang perlu diatur, tidak ada mode SSL yang bisa salah, dan perpanjangan otomatis pada Tahap 12 bekerja tanpa perubahan.

Yang dikorbankan hanya caching dan perlindungan DDoS Cloudflare. Untuk pelatihan ini keduanya tidak diperlukan.

::: tip Bila proxy tetap diinginkan
Pilihannya masuk akal, tetapi jangan dikerjakan pada hari pelatihan. Yang perlu disiapkan:

- Mode SSL/TLS diset **Full**, bukan Full (strict), sampai sertifikat asli terbit
- Aturan Page Rule atau WAF yang mengecualikan `/.well-known/acme-challenge/*` dari pengalihan ke HTTPS
- Setelah sertifikat terbit, mode boleh dinaikkan ke Full (strict)

Tiga hal itu menambah kemungkinan gagal yang tidak sebanding dengan manfaatnya untuk satu sesi pelatihan.
:::

### Tahap 4. Periksa resolusi DNS

Dijalankan di: Cloud Shell

```bash
dig +short "$SUBDOMAIN"
dig +short "$SUBDOMAIN" @1.1.1.1
```

Keduanya harus mengembalikan alamat IP statis VM. Bila resolver publik (`@1.1.1.1`) sudah benar tetapi resolver lokal belum, tunggu propagasi DNS beberapa menit. Bila keduanya masih kosong, record belum tersimpan atau nama subdomainnya salah ketik.

### Tahap 5. Uji akses melalui subdomain

Dijalankan di: Cloud Shell

Lakukan sebelum memasang HTTPS, supaya bila ada masalah DNS atau Nginx, penyebabnya masih mudah dipisahkan.

```bash
curl -sSIL --max-redirs 3 "http://${SUBDOMAIN}/portal"
```

## Bagian B. Menerbitkan Sertifikat

### Tahap 6. Pasang Certbot dan siapkan direktori

Dijalankan di: Cloud Shell

Kedua direktori ini dibuat sekarang karena keduanya di-mount oleh container Nginx pada `docker-compose.yml`.

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo apt-get update && sudo apt-get install -y certbot && cd /opt/webgis/app && mkdir -p certbot-webroot tls'
```

### Tahap 7. Sinkronkan konfigurasi dan nyalakan container

Dijalankan di: Cloud Shell

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='cd /opt/webgis/app && git pull --ff-only && sudo docker compose up -d && sudo docker compose ps'
```

Pastikan `nginx_proxy` berstatus running dan port 443 sudah terpublikasikan. Pada tahap ini layanan masih memakai HTTP, dan direktori `tls/` masih kosong sehingga server block HTTPS belum dimuat.

### Tahap 8. Periksa jalur ACME

Dijalankan di: Cloud Shell

```bash
curl -sS -o /dev/null -w "acme %{http_code}\n" "http://${SUBDOMAIN}/.well-known/acme-challenge/uji"
```

Balasan `404` adalah hasil yang diharapkan, karena berkas `uji` memang belum ada. Yang sedang diuji adalah apakah permintaan itu sampai ke direktori `certbot-webroot`, bukan diteruskan ke aplikasi Next.js.

Bila balasan yang muncul `502` atau `200`, hentikan tahap ini. Periksa kembali `nginx.conf`: blok `location ^~ /.well-known/acme-challenge/` harus ada di atas blok `location /`, dan volume `./certbot-webroot:/var/www/certbot:ro` harus ada pada service `nginx`.

### Tahap 9. Terbitkan sertifikat Let's Encrypt

Dijalankan di: Cloud Shell

Ganti `EMAIL` dengan alamat email yang aktif. Let's Encrypt mengirim pemberitahuan ke alamat itu bila sertifikat mendekati kedaluwarsa.

::: warning Ini bukan email peserta
`EMAIL` di sini hanya alamat kontak untuk Let's Encrypt, dan tidak berhubungan dengan identitas Anda di Google Cloud. Isinya bebas, yang penting alamatnya aktif dan bisa Anda buka. Alamat yang sama boleh dipakai semua peserta.

Identitas Anda sudah ditetapkan pada Tahap 2 halaman sebelumnya, melalui `NAMA_PESERTA`.
:::

```bash
EMAIL="nama01@example.com"
```

#### 9a. Uji coba lebih dahulu

**Jangan lewati langkah ini.** Jalankan dengan `--dry-run` untuk menguji seluruh proses tanpa menerbitkan sertifikat sungguhan:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command="cd /opt/webgis/app && sudo certbot certonly --webroot -w /opt/webgis/app/certbot-webroot -d $SUBDOMAIN --non-interactive --agree-tos -m $EMAIL --dry-run"
```

Harus berakhir dengan kalimat yang menyatakan simulasi berhasil. Bila gagal, perbaiki lebih dahulu. Penyebab yang paling sering adalah record DNS belum tersimpan, atau jalur ACME pada Tahap 8 belum dapat diakses dari internet.

Opsi `--dry-run` memakai server uji Let's Encrypt, sehingga **tidak memakai kuota penerbitan yang sebenarnya.**

#### 9b. Terbitkan sertifikat

Setelah uji coba berhasil, jalankan perintah yang sama **tanpa** `--dry-run`:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command="cd /opt/webgis/app && sudo certbot certonly --webroot -w /opt/webgis/app/certbot-webroot -d $SUBDOMAIN --non-interactive --agree-tos -m $EMAIL"
```

Sertifikat tersimpan di `/etc/letsencrypt/live/$SUBDOMAIN/`.

::: danger Kuota penerbitan ini dipakai bersama seluruh peserta
Let's Encrypt membatasi **50 sertifikat per domain per 7 hari**, dan batas itu berlaku untuk semua orang yang memakai domain yang sama, bukan per peserta.

Dengan 41 peserta pada satu domain, tersisa sekitar 9 cadangan untuk seluruh angkatan. Bila belasan peserta mengulang penerbitan karena satu kesalahan yang sama, peserta berikutnya akan gagal dengan pesan `too many certificates already issued`, dan **tidak ada cara mempercepat pemulihannya.** Kuota itu terisi ulang satu sertifikat setiap 202 menit.

Karena itu langkah 9a bukan formalitas. Uji coba memakai server uji, tidak memakai kuota, dan menangkap hampir semua penyebab kegagalan.

Satu hal lagi yang perlu diketahui: batas 5 kegagalan verifikasi per alamat per jam juga berlaku. Mengulang perintah yang gagal lebih dari lima kali dalam satu jam akan mengunci alamat itu untuk sementara. Bila sudah gagal dua kali, **berhenti dan periksa penyebabnya**, jangan mengulang terus.
:::

### Tahap 10. Aktifkan HTTPS pada Nginx

Dijalankan di: Terminal VM

Nginx pada proyek ini memakai **satu blok `server`** yang memuat seluruh `location`, dan blok itu mendengarkan port 80. Berkas `nginx.conf` memuat berkas tambahan di dalam blok tersebut:

```nginx
server {
    listen 80;
    server_name _;

    include /etc/nginx/tls/*.conf;
    ...
}
```

Karena `include` itu berada **di dalam** blok `server`, berkas `tls/aktifkan.conf` hanya boleh memuat direktif yang sah pada konteks `server`. Yang perlu ditambahkan hanyalah port 443 beserta sertifikatnya.

Seluruh `location` pada `nginx.conf` otomatis berlaku untuk port 443 juga, karena berada pada blok `server` yang sama. Tidak ada yang perlu ditulis ulang.

Masuk ke VM:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

Buat berkasnya. Ganti `nama01.webgisbig.com` dengan subdomain Anda pada kedua baris sertifikat:

```bash
cd /opt/webgis/app
cat > tls/aktifkan.conf << 'NGINXEOF'
listen 443 ssl;
http2 on;

ssl_certificate     /etc/letsencrypt/live/nama01.webgisbig.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/nama01.webgisbig.com/privkey.pem;
ssl_protocols       TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
NGINXEOF
```

Muat ulang Nginx:

```bash
sudo docker compose exec -T nginx nginx -s reload
```

Yang diharapkan, tidak ada keluaran sama sekali. Bila muncul galat, Nginx menolak konfigurasi barunya dan tetap memakai konfigurasi lama, sehingga situs Anda tidak ikut mati.

::: danger Jangan menulis blok `server` di berkas ini
Panduan versi lama menyuruh menulis blok `server { ... }` lengkap ke dalam `tls/aktifkan.conf`. Cara itu **selalu gagal**, dengan pesan:

```text
[emerg] "server" directive is not allowed here in /etc/nginx/tls/aktifkan.conf:1
```

Blok `server` hanya sah di dalam konteks `http`, sedangkan `include` pada `nginx.conf` berada di dalam konteks `server`.

Diuji pada Nginx 1.27: berkas berisi blok `server` gagal, sedangkan berkas berisi direktif `listen` dan `ssl_certificate` berhasil, dan port 443 benar-benar terbuka.
:::

### Tahap 11. Verifikasi HTTPS

Dijalankan di: Cloud Shell

```bash
curl -sSIL --max-redirs 3 "https://${SUBDOMAIN}/portal"
```

Balasan yang diharapkan adalah `HTTP/2 200`. Bila muncul peringatan sertifikat, periksa bahwa `ssl_certificate` menunjuk ke direktori `/etc/letsencrypt/live/$SUBDOMAIN/`, bukan ke direktori lain.

### Tahap 12. Atur perpanjangan sertifikat otomatis

Dijalankan di: Cloud Shell

Sertifikat Let's Encrypt berlaku 90 hari. Hook berikut memuat ulang Nginx setiap kali sertifikat diperbarui, sehingga container membaca berkas sertifikat yang baru.

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy && printf "%s\n" "#!/bin/sh" "cd /opt/webgis/app && docker compose exec -T nginx nginx -s reload" | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh >/dev/null && sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh && sudo certbot renew --dry-run'
```

Opsi `--dry-run` menguji seluruh proses perpanjangan tanpa memakai kuota penerbitan sertifikat yang sebenarnya. Pastikan hasilnya menyatakan keberhasilan, bukan sekadar tidak ada pesan galat.

### Tahap 13. Ubah alamat aplikasi di .env

Dijalankan di: Terminal VM

Setelah HTTPS aktif, alamat aplikasi pada `.env` harus ikut berubah. Tanpa perubahan ini, login dan callback NextAuth akan mengarah ke alamat HTTP.

```bash
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap
nano /opt/webgis/app/.env
```

Ubah dua baris berikut:

```bash
NEXTAUTH_URL=https://nama01.webgisbig.com/portal/
BASE_URL=https://nama01.webgisbig.com/portal
```

Setelah tersimpan, nyalakan ulang container aplikasi supaya nilai barunya terbaca:

```bash
cd /opt/webgis/app && sudo docker compose up -d nextjs
```

### Tahap 14. Verifikasi akhir

Dijalankan di: Browser

Buka `https://SUBDOMAIN/portal`, lalu periksa satu per satu:

![Geoportal terbuka melalui alamat HTTPS](google-cloud-platform/cb-image-19.png)

- Halaman Geoportal tampil tanpa peringatan sertifikat.
- Login berhasil memakai akun dari materi autentikasi.
- Layer GeoServer dapat dimuat dari dalam Geoportal.
- Alamat `http://SUBDOMAIN/portal` dialihkan ke versi HTTPS.
- `certbot renew --dry-run` pada Tahap 12 selesai tanpa galat.

## Bila Ada yang Gagal

| Gejala | Penyebab yang paling sering |
|---|---|
| Certbot gagal dengan `Invalid response ... 404` | Blok `location ^~ /.well-known/acme-challenge/` belum ada di `nginx.conf`, atau volume `certbot-webroot` belum terpasang. |
| `nginx: [emerg] cannot load certificate` | Volume `/etc/letsencrypt:/etc/letsencrypt:ro` belum ada pada service `nginx`. |
| HTTPS tidak terjangkau, HTTP normal | Port `443:443` belum dipublikasikan pada service `nginx`. |
| `dig` mengembalikan alamat berbeda | Record A masih menunjuk ke IP lama, atau ada record lain dengan nama sama. |
| Login berhasil di HTTP tetapi gagal di HTTPS | `NEXTAUTH_URL` dan `BASE_URL` belum diubah ke alamat HTTPS, atau container belum dinyalakan ulang. |

## Hasil Akhir Deployment Project

Geoportal berjalan di alamat HTTPS dengan subdomain sendiri, sertifikatnya dipercaya browser dan diperbarui otomatis, GeoServer dapat diakses dari halaman yang sama, dan setiap push ke branch `main` membangun ulang aplikasi tanpa perlu masuk ke VM.
