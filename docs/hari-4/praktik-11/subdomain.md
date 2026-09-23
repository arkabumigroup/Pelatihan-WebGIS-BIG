# Penambahan Subdomain

Halaman ini melanjutkan [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build). Setelah tahap ini selesai, Geoportal dapat dibuka melalui `https://nama01.webgisbig.com/portal` dengan sertifikat yang dipercaya browser, bukan lagi melalui alamat IP.

Urutannya penting: record DNS harus sudah mengarah ke VM sebelum Certbot dijalankan. Let's Encrypt memverifikasi kepemilikan domain dengan mengakses alamat tersebut dari internet, sehingga sertifikat tidak akan terbit selama alamatnya belum bisa dijangkau.

<PilihShell />

## Prasyarat

- Seluruh tahap pada halaman [Persiapan Repositori dan Identitas](/hari-4/praktik-11/persiapan-repositori), [Menyiapkan Project dan VM](/hari-4/praktik-11/google-cloud-platform), [Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm), dan [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build) sudah selesai, dan variabel `PROJECT_ID`, `ZONE`, `VM_NAME`, serta `SUBDOMAIN` masih tersedia di Cloud Shell.
- Bila sesi Cloud Shell sudah berganti, jalankan kembali blok Tahap 2 halaman sebelumnya lebih dahulu.
- Subdomain sudah ditetapkan penyelenggara. Pola yang dipakai adalah `<nama-peserta>.webgisbig.com`, memakai nilai dari kolom Nama Peserta pada tabel peserta.
- Record DNS ditambahkan penyelenggara. Siapkan subdomain dan alamat IP statis VM untuk dilaporkan pada Tahap 3.

## Bagian A. Mengarahkan Subdomain ke VM

### Tahap 1. Pastikan IP statis VM sudah terkunci

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" \
  --format="table(name,address,status)"
```

Status harus `RESERVED`, dan alamat yang tampil harus sama dengan IP eksternal VM. Record A yang menunjuk ke IP dinamis akan rusak begitu VM dimatikan dan dinyalakan kembali.

### Tahap 2. Tentukan nama subdomain

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
SUBDOMAIN="${PARTICIPANT_ID}.webgisbig.com"
echo "$SUBDOMAIN"
```

### Tahap 3. Kirim IP VM dan subdomain ke penyelenggara

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Pelaporan ini sudah dikerjakan lebih awal, pada [Tahap 9 halaman Menyiapkan Project dan VM](/hari-4/praktik-11/google-cloud-platform#tahap-9-buat-ip-statis), supaya record DNS punya waktu berpropagasi selama Anda mengerjakan tahap berikutnya.

Bila Anda melewatinya, lakukan sekarang:

```bash
echo "Subdomain : $SUBDOMAIN"
echo "IP statis : $(gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" --project="$PROJECT_ID" --format='value(address)')"
```

Kirim kedua nilai itu ke penyelenggara, lalu lanjutkan. Selama record belum ditambahkan, `dig` pada Tahap 4 akan mengembalikan kosong. Itu wajar, bukan tanda ada yang salah pada VM Anda.

### Tahap 4. Periksa resolusi DNS

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

<div class="shell-versi" data-shell="cloud">

```bash
dig +short "$SUBDOMAIN"
dig +short "$SUBDOMAIN" @1.1.1.1
```

</div>
<div class="shell-versi" data-shell="local">

```bash
# macOS dan Linux
dig +short "$SUBDOMAIN"
dig +short "$SUBDOMAIN" @1.1.1.1

# Windows
nslookup "$SUBDOMAIN"
nslookup "$SUBDOMAIN" 1.1.1.1
```

</div>

Keduanya harus mengembalikan alamat IP statis VM. Bila resolver publik (`@1.1.1.1`) sudah benar tetapi resolver lokal belum, tunggu propagasi DNS beberapa menit. Bila keduanya masih kosong, record belum tersimpan atau nama subdomainnya salah ketik.

### Tahap 5. Uji akses melalui subdomain

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Lakukan sebelum memasang HTTPS, supaya bila ada masalah DNS atau Nginx, penyebabnya masih mudah dipisahkan.

<div class="shell-versi" data-shell="cloud">

```bash
curl -sSIL --max-redirs 3 "http://${SUBDOMAIN}/portal"
```

</div>
<div class="shell-versi" data-shell="local">

```bash
# Di Windows tulis curl.exe, karena PowerShell menafsirkan `curl` sebagai
# alias Invoke-WebRequest yang opsinya berbeda.
curl -IL --max-redirs 3 "http://${SUBDOMAIN}/portal"
```

</div>

## Bagian B. Menerbitkan Sertifikat

### Tahap 6. Pasang Certbot dan siapkan direktori

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Kedua direktori ini dibuat sekarang karena keduanya di-mount oleh container Nginx pada `docker-compose.yml`.

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo apt-get update && sudo apt-get install -y certbot && cd /opt/webgis/app && sudo mkdir -p certbot-webroot tls && sudo chown -R "$USER:$USER" certbot-webroot tls && ls -ld certbot-webroot tls'
```

::: warning Kedua folder harus menjadi milik Anda, bukan root
Saat container dijalankan pada tahap sebelumnya, folder `certbot-webroot` dan
`tls` kemungkinan besar **belum ada**. Docker membuatnya sendiri untuk keperluan
bind-mount pada `docker-compose.yml`, dan Docker membuatnya **sebagai root**.

Akibatnya Tahap 10 akan gagal saat menulis file konfigurasi:

```text
-bash: tls/aktifkan.conf: Permission denied
```

Perintah di atas menambahkan `chown` supaya kedua folder menjadi milik Anda,
baik folder itu baru dibuat maupun sudah terlanjur dibuat Docker.

Periksa hasilnya. Keduanya harus menampilkan nama pengguna Anda, bukan `root`:

```text
drwxr-xr-x 2 dhanypedia_gmail_com dhanypedia_gmail_com 4096 ... certbot-webroot
drwxr-xr-x 2 dhanypedia_gmail_com dhanypedia_gmail_com 4096 ... tls
```

Bila masih tertulis `root`, jalankan:

```bash
cd /opt/webgis/app
sudo chown -R "$USER:$USER" certbot-webroot tls
```
:::

### Tahap 7. Sinkronkan konfigurasi dan nyalakan container

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='cd /opt/webgis/app && git pull --ff-only && sudo docker compose up -d && sudo docker compose ps'
```

Pastikan `nginx_proxy` berstatus running dan port 443 sudah terpublikasikan. Pada tahap ini layanan masih memakai HTTP, dan direktori `tls/` masih kosong sehingga server block HTTPS belum dimuat.

### Tahap 8. Periksa jalur ACME

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

<div class="shell-versi" data-shell="cloud">

```bash
curl -sS -o /dev/null -w "acme %{http_code}\n" "http://${SUBDOMAIN}/.well-known/acme-challenge/uji"
```

</div>
<div class="shell-versi" data-shell="local">

```bash
# Yang diperiksa hanya kode balasannya, 404 berarti benar.
curl  -o /dev/null -w "acme %{http_code}\n" "http://${SUBDOMAIN}/.well-known/acme-challenge/uji"
```

</div>

Balasan `404` adalah hasil yang diharapkan, karena file `uji` memang belum ada. Yang sedang diuji adalah apakah permintaan itu sampai ke direktori `certbot-webroot`, bukan diteruskan ke aplikasi Next.js.

Bila balasan yang muncul `502` atau `200`, hentikan tahap ini. Periksa kembali `nginx.conf`: blok `location ^~ /.well-known/acme-challenge/` harus ada di atas blok `location /`, dan volume `./certbot-webroot:/var/www/certbot:ro` harus ada pada service `nginx`.

### Tahap 9. Terbitkan sertifikat Let's Encrypt

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Ganti `EMAIL` dengan alamat email yang aktif. Let's Encrypt mengirim pemberitahuan ke alamat itu bila sertifikat mendekati kedaluwarsa.

::: warning Domain di belakang tanda @ harus domain yang benar-benar terdaftar
Alamatnya tidak perlu milik Anda, dan boleh sama untuk semua peserta. Tetapi alamat seperti `peserta@latihan.local` ditolak, dan **uji coba `--dry-run` tidak menolaknya.** Pakai alamat dengan domain nyata, misalnya Gmail Anda sendiri.
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

::: warning Bila muncul "Service busy; retry later"
Server uji Let's Encrypt kadang menolak permintaan saat sedang sibuk, dan
balasannya:

```text
An unexpected error occurred:
There were too many requests of a given type :: Service busy; retry later.
```

Pesan itu **bukan tanda konfigurasi Anda salah.** Server ujinya yang sedang
penuh. Ini masalah yang dikenal, dan bersifat sementara.

Tunggu sekitar lima menit, lalu jalankan perintah yang sama sekali lagi:

```bash
sleep 300
```

Bila masih gagal setelah dua percobaan, periksa prasyaratnya lebih dahulu.
Balasan `404` pada Tahap 8 dan resolusi DNS yang benar sudah cukup untuk
melanjutkan. Bila keduanya sudah benar, lanjutkan ke Tahap 9b tanpa `--dry-run`.
:::

::: danger Bila memilih melewati uji coba
Uji coba itu jaring pengaman. Melewatinya berarti risiko kuota bersama ditanggung
seluruh angkatan.

Sebelum melewatinya, pastikan **kedua** hal ini sudah benar:

- `dig +short "$SUBDOMAIN"` menjawab alamat IP statis VM Anda
- Tahap 8 menjawab `404`, bukan `502` atau `200`

Bila salah satu belum benar, **jangan lanjutkan.** Perbaiki dulu, karena
kegagalan pada penerbitan sungguhan memakai satu jatah kuota yang tidak dapat
dikembalikan.
:::

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
Let's Encrypt membatasi **50 sertifikat per domain per 7 hari**, dan batas itu berlaku untuk semua orang yang memakai domain yang sama, bukan per peserta. Bila penerbitan gagal berkali-kali, peserta berikutnya berhenti dengan pesan `too many certificates already issued`, dan **tidak ada cara mempercepat pemulihannya.** Kuota itu terisi ulang satu sertifikat setiap 202 menit.

Karena itu langkah 9a bukan formalitas. Uji coba memakai server uji, tidak memakai kuota, dan menangkap hampir semua penyebab kegagalan. Jangan pula mengulang penerbitan hanya untuk mencoba-coba.

Batas 5 kegagalan verifikasi per alamat per jam juga berlaku. Mengulang perintah yang gagal lebih dari lima kali dalam satu jam akan mengunci alamat itu untuk sementara. Bila sudah gagal dua kali, **berhenti dan periksa penyebabnya**, jangan mengulang terus.
:::

### Tahap 10. Aktifkan HTTPS pada Nginx

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Nginx pada proyek ini memakai **satu blok `server`** yang memuat seluruh `location`, dan blok itu mendengarkan port 80. File `nginx.conf` memuat file tambahan di dalam blok tersebut:

```nginx
server {
    listen 80;
    server_name _;

    include /etc/nginx/tls/*.conf;
    ...
}
```

Karena `include` itu berada **di dalam** blok `server`, file `tls/aktifkan.conf` hanya boleh memuat direktif yang sah pada konteks `server`. Yang perlu ditambahkan hanyalah port 443 beserta sertifikatnya.

Seluruh `location` pada `nginx.conf` otomatis berlaku untuk port 443 juga, karena berada pada blok `server` yang sama. Tidak ada yang perlu ditulis ulang.

Masuk ke VM:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

Buat filenya. Ganti `nama01.webgisbig.com` dengan subdomain Anda pada kedua baris sertifikat:

```bash
cd /opt/webgis/app
cat > tls/aktifkan.conf << 'NGINXEOF'
listen 443 ssl;
http2 on;

ssl_certificate     /etc/letsencrypt/live/nama01.webgisbig.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/nama01.webgisbig.com/privkey.pem;
ssl_protocols       TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

# Alihkan HTTP ke HTTPS, kecuali jalur verifikasi Let's Encrypt yang selalu
# diperiksa lewat HTTP saat perpanjangan sertifikat.
set $alihkan "0";
if ($scheme = http) {
    set $alihkan "1";
}
if ($request_uri ~ ^/\.well-known/acme-challenge/) {
    set $alihkan "0";
}
if ($alihkan = "1") {
    return 301 https://$host$request_uri;
}

# GeoServer menulis alamat pengalihannya dari skema yang diterimanya, sedangkan
# Nginx meneruskan permintaan lewat HTTP di dalam jaringan Docker. Tanpa baris
# ini kedua pengalihan berputar tanpa henti dan halaman admin GeoServer tidak
# dapat dibuka. Ditaruh di berkas ini, bukan di nginx.conf, supaya hanya berlaku
# setelah port 443 ada yang mendengarkan.
proxy_redirect ~^http://([^/]+)/(.*)$ https://$1/$2;
NGINXEOF
```

Muat ulang Nginx:

```bash
sudo docker compose exec -T nginx nginx -s reload
```

Yang diharapkan, tidak ada keluaran sama sekali. Bila muncul error, Nginx menolak konfigurasi barunya dan tetap memakai konfigurasi lama, sehingga situs Anda tidak ikut mati.

#### Mengapa ada bagian pengalihan

Tanpa bagian itu, `http://SUBDOMAIN/portal` tetap dapat dibuka. Artinya kata sandi login dapat terkirim tanpa enkripsi bila ada yang mengetik alamatnya tanpa `https://`. Tahap 14 memeriksa hal ini, dan bagian itulah yang memenuhinya.

Bagian pengalihan itu **tidak boleh ditulis sederhana.** Bentuk yang paling mudah:

```nginx
if ($scheme = http) {
    return 301 https://$host$request_uri;
}
```

Bentuk itu **merusak perpanjangan sertifikat.** Let's Encrypt selalu memeriksa kepemilikan domain lewat HTTP, sehingga pengalihan tanpa pengecualian membuat jalur verifikasinya ikut dialihkan dan tidak pernah sampai ke direktori `certbot-webroot`.

Diuji pada Nginx 1.27:

| Bentuk | `/portal` lewat HTTP | Jalur ACME lewat HTTP |
|---|---|---|
| Tanpa pengecualian | `301` | `301`, salah, verifikasi akan gagal |
| Dengan pengecualian | `301` | `404`, benar, file ujinya memang tidak ada |

Karena itu file di atas menetapkan variabel `$alihkan` lebih dahulu, lalu mengosongkannya kembali khusus untuk jalur ACME.

### Tahap 11. Verifikasi HTTPS

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

<div class="shell-versi" data-shell="cloud">

```bash
curl -sSIL --max-redirs 3 "https://${SUBDOMAIN}/portal"
```

</div>
<div class="shell-versi" data-shell="local">

```bash
# Di Windows tulis curl.exe, bukan curl.
curl IL --max-redirs 3 "https://${SUBDOMAIN}/portal"
```

</div>

Balasan yang diharapkan adalah `HTTP/2 200`. Bila muncul peringatan sertifikat, periksa bahwa `ssl_certificate` menunjuk ke direktori `/etc/letsencrypt/live/$SUBDOMAIN/`, bukan ke direktori lain.

### Tahap 12. Atur perpanjangan sertifikat otomatis

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Sertifikat Let's Encrypt berlaku 90 hari. Hook berikut memuat ulang Nginx setiap kali sertifikat diperbarui, sehingga container membaca file sertifikat yang baru.

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy && printf "%s\n" "#!/bin/sh" "cd /opt/webgis/app && docker compose exec -T nginx nginx -s reload" | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh >/dev/null && sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh && sudo certbot renew --dry-run'
```

Opsi `--dry-run` menguji seluruh proses perpanjangan tanpa memakai kuota penerbitan sertifikat yang sebenarnya. Pastikan hasilnya menyatakan keberhasilan, bukan sekadar tidak ada pesan error.

### Tahap 13. Ubah alamat aplikasi di .env

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Setelah HTTPS aktif, **empat** variabel pada `.env` harus ikut berubah. Perhatikan: Tahap 18 pada halaman [Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm) menyetel keempatnya ke alamat IP. Tahap ini menggantinya ke alamat HTTPS.

Masuk ke VM:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

Jalankan. Ganti `nama01.webgisbig.com` dengan subdomain Anda:

```bash
cd /opt/webgis/app
SUBDOMAIN="nama01.webgisbig.com"

sudo sed -i \
  -e "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=https://${SUBDOMAIN}/portal|" \
  -e "s|^BASE_URL=.*|BASE_URL=https://${SUBDOMAIN}/portal|" \
  -e "s|^NEXT_PUBLIC_URL_BASE_PATH=.*|NEXT_PUBLIC_URL_BASE_PATH=https://${SUBDOMAIN}/portal|" \
  -e "s|^GEOSERVER_PUBLIC_URL=.*|GEOSERVER_PUBLIC_URL=https://${SUBDOMAIN}/geoserver|" \
  .env

grep -E '^(NEXTAUTH_URL|BASE_URL|NEXT_PUBLIC_URL_BASE_PATH|GEOSERVER_PUBLIC_URL)=' .env
```

Keempatnya harus menampilkan alamat `https://`, tanpa garis miring di akhir.

#### Mengapa keempatnya, bukan hanya dua

| Variabel | Dipakai untuk | Bila dibiarkan HTTP |
|---|---|---|
| `NEXTAUTH_URL` | Alamat callback login | Login gagal setelah HTTPS aktif |
| `BASE_URL` | Alamat yang dipakai server | Sama, login dan pengalihan gagal |
| `NEXT_PUBLIC_URL_BASE_PATH` | Alamat file model 3D | File model diminta lewat HTTP, diblokir browser sebagai mixed content, sehingga model tidak muncul di pratinjau |
| `GEOSERVER_PUBLIC_URL` | Alamat WMS dan WFS yang **disimpan ke database** | Kolom `wms_url` dan `wfs_url` berisi alamat IP, sehingga layer tidak dapat dibuka dari katalog maupun dari QGIS |

Dua variabel terakhir mudah terlewat, karena keduanya tidak menggagalkan login. Errornya baru muncul saat model 3D dibuka atau layer 2D dipanggil.

Nyalakan ulang container supaya nilai barunya terbaca:

```bash
cd /opt/webgis/app && sudo docker compose up -d
```

::: warning Layer yang sudah dibuat tetap memakai alamat lama
`GEOSERVER_PUBLIC_URL` dan `NEXT_PUBLIC_URL_BASE_PATH` disalin ke database **saat layer dibuat**, bukan dibaca ulang setiap kali dibuka.

Artinya layer yang dibuat sebelum Tahap 13 masih menyimpan alamat IP, walaupun `.env` sudah diperbaiki. Perbaiki barisnya di SQL Editor Supabase. Ganti `IP_EKSTERNAL_VM` dengan alamat IP statis VM Anda dari [Tahap 9 halaman Menyiapkan Project dan VM](/hari-4/praktik-11/google-cloud-platform#tahap-9-buat-ip-statis), dan `nama01.webgisbig.com` dengan subdomain Anda:

```sql
UPDATE katalog_data_2d
SET wms_url = replace(wms_url, 'http://IP_EKSTERNAL_VM/geoserver',
                               'https://nama01.webgisbig.com/geoserver'),
    wfs_url = replace(wfs_url, 'http://IP_EKSTERNAL_VM/geoserver',
                               'https://nama01.webgisbig.com/geoserver');

UPDATE katalog_data_3d
SET url = replace(url, 'http://IP_EKSTERNAL_VM/portal',
                        'https://nama01.webgisbig.com/portal');
```

Periksa hasilnya. Perhatikan nama kolomnya berbeda antara kedua tabel: tabel 2D memakai `layer_name`, tabel 3D memakai `nama`.

```sql
SELECT layer_name, wms_url FROM katalog_data_2d;
SELECT nama, url           FROM katalog_data_3d;
```

Tidak boleh ada lagi alamat IP pada hasilnya.

Bila tidak ada baris yang perlu diperbaiki, kedua `UPDATE` menjawab `Success. No rows returned`. Itu bukan error.
:::

### Tahap 14. Verifikasi akhir

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Browser</strong></p>

Buka `https://SUBDOMAIN/portal`, lalu periksa satu per satu:

- Halaman Geoportal tampil tanpa peringatan sertifikat.
- Login berhasil memakai akun dari materi autentikasi.
- Layer GeoServer dapat dimuat dari dalam Geoportal.
- Alamat `http://SUBDOMAIN/portal` dialihkan ke versi HTTPS.
- `certbot renew --dry-run` pada Tahap 12 selesai tanpa error.

## Bila Ada yang Gagal

**`Unable to register an account with ACME server`**

Alamat email yang dipakai pada Tahap 9 domainnya tidak terdaftar. Penyebab sebenarnya ada di `/var/log/letsencrypt/letsencrypt.log`:

```text
The ACME server believes peserta@latihan.local is an invalid email address.
```

Yang membuatnya sulit terlihat: server uji Let's Encrypt menerima alamat apa pun, sehingga `--dry-run` pada Tahap 9a menyatakan berhasil. Penolakan baru muncul saat penerbitan sungguhan. Ganti `EMAIL` dengan alamat berdomain nyata, lalu ulangi Tahap 9.

| Error | Penyebab yang paling sering |
|---|---|
| Certbot gagal dengan `Invalid response ... 404` | Blok `location ^~ /.well-known/acme-challenge/` belum ada di `nginx.conf`, atau volume `certbot-webroot` belum terpasang. |
| `nginx: [emerg] cannot load certificate` | Volume `/etc/letsencrypt:/etc/letsencrypt:ro` belum ada pada service `nginx`. |
| HTTPS tidak terjangkau, HTTP normal | Port `443:443` belum dipublikasikan pada service `nginx`. |
| `dig` mengembalikan alamat berbeda | Record A masih menunjuk ke IP lama, atau ada record lain dengan nama sama. |
| Login berhasil di HTTP tetapi gagal di HTTPS | `NEXTAUTH_URL` dan `BASE_URL` belum diubah ke alamat HTTPS, atau container belum dinyalakan ulang. |

## Hasil Akhir Deployment Project

Geoportal berjalan di alamat HTTPS dengan subdomain sendiri, sertifikatnya dipercaya browser dan diperbarui otomatis, GeoServer dapat diakses dari halaman yang sama, dan setiap push ke branch `main` membangun ulang aplikasi tanpa perlu masuk ke VM.
