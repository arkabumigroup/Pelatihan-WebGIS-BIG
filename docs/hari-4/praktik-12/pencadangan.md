# Pencadangan Data dan Konfigurasi

Halaman ini melanjutkan Praktik 11. Setelah geoportal berjalan, ada dua hal yang perlu dijaga, dan keduanya hanya ada di VM: data GeoServer dan berkas `.env`.

Seluruh pekerjaan di sini memakai VM dan project kelompok yang sama seperti Praktik 11, jadi variabel `PROJECT_ID`, `NAMA_PESERTA`, `VM_NAME`, dan `ZONE` masih dipakai. Kalau sesi Cloud Shell Anda sudah tertutup, jalankan ulang blok identitas pada [Persiapan Repositori dan Identitas](/hari-4/praktik-11/persiapan-repositori) Tahap 2 lebih dahulu.

## Apa yang perlu dicadangkan

Tiga hal, dan hanya dua di antaranya berada di VM.

| Yang dicadangkan | Letaknya | Keadaan |
|---|---|---|
| `docker-compose.yml`, `nginx.conf`, `cloudbuild.yaml`, `robots.js`, `sitemap.js` | fork Anda di GitHub | tercadang sendiri setiap push |
| Folder `geoserver-data` | `/opt/webgis/app/geoserver-data` di VM | belum tercadang |
| Berkas `.env` | `/opt/webgis/app/.env` di VM | belum tercadang |

Berkas konfigurasi tidak perlu dipikirkan lagi. Setiap `git push` menyimpannya di GitHub, dan itu salah satu gunanya memakai repositori sejak Praktik 11.

Dua yang tersisa justru yang paling merepotkan kalau hilang. `geoserver-data` memuat seluruh workspace, datastore, dan layer yang Anda buat di GeoServer. Berkas `.env` memuat kata sandi basis data, kata sandi GeoServer, dan kunci penanda tangan token.

::: danger Folder geoserver-data yang kosong tidak membuat GeoServer gagal
Kalau folder `geoserver-data` hilang, image kartoza akan membuatkan data directory bawaan yang baru saat container dinyalakan. GeoServer tetap menyala dan tidak menampilkan satu pun pesan galat.

Yang terjadi adalah seluruh workspace, datastore, dan layer Anda lenyap. Geoportal tetap dapat dibuka, tetapi katalog 2D kosong dan peta tidak lagi menampilkan layer apa pun.

Jadi folder kosong bukan tanda kerusakan, melainkan tanda data yang belum dipulihkan. Tanpa pencadangan, satu-satunya jalan adalah membuat ulang seluruh layer dari awal.
:::

## Tahap 1. Periksa layanan Cloud Storage

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Pencadangan disimpan di Cloud Storage, dan layanannya harus menyala di project Anda. Peserta tidak punya izin menyalakannya, jadi periksa lebih dahulu.

```bash
gcloud services list --enabled --project="$PROJECT_ID" \
  --filter="config.name:storage.googleapis.com" \
  --format="table(config.name:label=LAYANAN)"
```

Hasilnya harus memuat `storage.googleapis.com`. Bila barisnya kosong, lapor ke koordinator dan jangan melanjutkan tahap ini.

## Tahap 2. Buat bucket pencadangan

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Bucket adalah tempat menyimpan arsip di Cloud Storage. Cukup dibuat sekali, dan namanya memuat identitas Anda supaya tidak bertabrakan dengan peserta lain di project yang sama.

```bash
BUCKET="cadangan-webgis-${NAMA_PESERTA}-${PROJECT_ID}"

gcloud storage buckets create "gs://${BUCKET}" \
  --location=asia-southeast2 \
  --uniform-bucket-level-access

echo "Nama bucket Anda: ${BUCKET}"
```

Catat nama bucket yang tercetak, karena dipakai pada tahap berikutnya.

Harga penyimpanannya praktis nol. Arsip folder `geoserver-data` pada satu VM pelatihan terukur 3,2 MB, dan arsip untuk satu layer kecil pernah terukur 60 KB. Angka itu bertambah seiring banyaknya layer yang Anda buat, tetapi tetap jauh di bawah satu megabita selama pelatihan.

::: warning Nama bucket harus unik di seluruh dunia
Kalau perintahnya gagal dengan pesan bahwa nama sudah dipakai, tambahkan satu kata di belakangnya, misalnya `cadangan-webgis-${NAMA_PESERTA}-${PROJECT_ID}-a`, lalu jalankan ulang. Nama bucket dipakai bersama seluruh pengguna Google Cloud di dunia, bukan hanya di project Anda.
:::

## Tahap 3. Jadwalkan pencadangan harian

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Masuk ke VM lebih dahulu dari Cloud Shell:

```bash
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap
```

Skrip berikut dijalankan Ubuntu sekali sehari. Ganti nilai `BUCKET` pada baris pertama dengan nama bucket Anda dari Tahap 2.

```bash
BUCKET="cadangan-webgis-nama01-geoportal-kelompok-a-xxxxx"

sudo tee /etc/cron.daily/cadangkan-webgis > /dev/null <<EOF
#!/bin/sh
set -e
BUCKET="$BUCKET"
STAMP=\$(date +%F)
cd /opt/webgis/app
tar -czf /tmp/geoserver-data-\$STAMP.tar.gz geoserver-data
gcloud storage cp /tmp/geoserver-data-\$STAMP.tar.gz gs://\$BUCKET/
rm -f /tmp/geoserver-data-\$STAMP.tar.gz
EOF

sudo chmod +x /etc/cron.daily/cadangkan-webgis
```

Perhatikan tanda `\` di depan `$(date +%F)` dan `$STAMP`. Heredoc tanpa kutip mengembangkan variabel saat perintah dijalankan, sehingga `$BUCKET` terisi nama bucket Anda sementara kedua yang lain harus tetap tertulis apa adanya di dalam berkas. Tanpa tanda itu, tanggal dan nama berkasnya ikut terisi sekarang juga dan skripnya mencadangkan ke nama yang sama setiap hari.

Isi berkasnya dapat diperiksa dengan:

```bash
cat /etc/cron.daily/cadangkan-webgis
```

Empat baris terakhirnya harus sama persis dengan yang tertulis di atas, lengkap dengan tanda `$`-nya.

### Kapan skripnya menyala

Ubuntu menjalankan seluruh isi `/etc/cron.daily` lewat systemd timer sekitar pukul 06.25, dan hanya kalau VM sedang menyala. Karena VM pelatihan biasanya hanya hidup beberapa hari, pencadangan otomatis ini menyala paling banyak dua atau tiga kali.

Nilai sesungguhnya ada pada prosedurnya, bukan pada banyaknya riwayat. Yang penting Anda tahu caranya, dan tahu bahwa hasilnya bisa dipulihkan.

### Identitas yang dipakai skripnya

Skrip itu berjalan sebagai `root`, dan `gcloud` di dalamnya memakai service account milik VM, bukan akun Google Anda. Pada VM pelatihan, bentuknya seperti ini:

```text
123749324413-compute@developer.gserviceaccount.com
```

Itu memang begitu, dan bukan tanda ada yang salah. Service account itu sudah memegang peran `roles/editor` pada project, dan itu cukup untuk membuat bucket serta menulis ke dalamnya.

Angka di depan alamat itu adalah nomor project Anda, jadi nilainya berbeda antar project. Untuk memeriksanya sendiri:

```bash
sudo gcloud config list account
```

## Tahap 4. Buktikan pencadangannya bekerja

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Menjalankan skripnya sekali sekarang lebih baik daripada menunggu pukul 06.25 besok, karena hasilnya langsung terlihat.

```bash
sudo /etc/cron.daily/cadangkan-webgis && echo "skrip selesai tanpa galat"
```

Lalu periksa isi bucket, kembali di Cloud Shell:

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
BUCKET="cadangan-webgis-${NAMA_PESERTA}-${PROJECT_ID}"

gcloud storage ls -l "gs://${BUCKET}/"
```

Satu berkas dengan nama `geoserver-data-YYYY-MM-DD.tar.gz` harus muncul, dengan ukuran beberapa megabita.

Nama berkasnya memakai tanggal, jadi pencadangan di hari yang sama menimpa arsip sebelumnya. Itu memang yang diinginkan: satu arsip per hari, bukan menumpuk belasan arsip yang tidak pernah dibuka.

## Tahap 5. Pulihkan dari arsip

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Tahap ini membuktikan arsipnya benar-benar dapat dipakai. Tanpa pernah mencoba memulihkan, Anda hanya percaya bahwa pencadangannya bekerja.

Sesuaikan `ARCHIVE` dengan nama berkas yang muncul pada Tahap 4.

```bash
BUCKET="cadangan-webgis-nama01-geoportal-kelompok-a-xxxxx"
ARCHIVE="geoserver-data-2026-09-12.tar.gz"

gcloud storage cp "gs://${BUCKET}/${ARCHIVE}" /tmp/

cd /opt/webgis/app
sudo docker compose stop geoserver
sudo tar -xzf /tmp/$ARCHIVE
sudo docker compose up -d --force-recreate geoserver
```

Tiga hal yang perlu diperhatikan pada blok itu.

**Ekstrak selalu dijalankan dari `/opt/webgis/app`.** Arsipnya memuat jalur `geoserver-data/...` di dalamnya, jadi tempat mengekstraknya menentukan ke mana isinya mendarat.

**`--force-recreate` diperlukan.** Tanpa itu Compose hanya menyalakan kembali container lama beserta mount yang sudah ada, sehingga folder hasil pemulihan tidak terbaca.

**Kepemilikan berkas biasanya sudah benar tanpa langkah tambahan.** `tar` yang dijalankan sebagai root mempertahankan kepemilikan yang tersimpan di dalam arsip, dan arsipnya dibuat dari folder yang sama. Bila GeoServer menolak menulis ke data directory-nya setelah pemulihan, samakan kepemilikannya dengan folder yang sedang dipakai container:

```bash
sudo chown -R --reference=/opt/webgis/app/geoserver-data /opt/webgis/app/geoserver-data
```

### Memeriksa hasil pemulihan

GeoServer butuh sekitar satu menit untuk siap setelah dibuat ulang. Tunggu, lalu periksa dari Cloud Shell:

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
curl -sS -o /dev/null -w "portal %{http_code}\n" "https://${SUBDOMAIN}/portal"
curl -sS -o /dev/null -w "geoserver %{http_code}\n" "https://${SUBDOMAIN}/geoserver/web"
```

Bila keduanya membalas `200` dan `302`, layanannya sudah hidup. Untuk memastikan layernya benar-benar kembali, buka antarmuka GeoServer pada `https://SUBDOMAIN/geoserver/web` lalu periksa **Data > Layers**. Jumlah layernya harus sama dengan sebelum pemulihan.

Prosedur pada halaman ini sudah pernah dijalankan sampai tuntas pada satu VM: arsip dibuat, diunggah ke bucket, dijadwalkan lewat cron, lalu dipulihkan sampai layernya terbaca kembali.

## Tahap 6. Cadangkan berkas .env

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Berkas `.env` sengaja tidak ikut ke bucket karena memuat kata sandi dan kunci rahasia. Salin manual ke laptop:

```bash
gcloud compute scp \
  --zone="$ZONE" \
  --tunnel-through-iap \
  "$VM_NAME:/opt/webgis/app/.env" "env-${NAMA_PESERTA}.txt"
```

Simpan berkas itu di pengelola kata sandi atau tempat aman lain di laptop Anda.

::: danger Jangan simpan .env di Git
Berkas `.env` sudah tercantum pada `.gitignore` repositori, dan itu memang disengaja. Jangan menghapus baris itu, jangan memaksa `git add -f`, dan jangan menempelkan isinya ke laporan, tangkapan layar, atau obrolan grup.

Isinya adalah kunci penanda tangan token, kata sandi basis data Supabase, dan kata sandi admin GeoServer. Siapa pun yang membacanya dapat masuk ke portal Anda sebagai admin.
:::

## Yang perlu diingat setelah pelatihan

Bucket dan isinya **tidak ikut terhapus** bersama VM. Keduanya tetap ada dan penyimpanannya tetap ditagih, meskipun kecil.

Kalau VM Anda akan dihapus, hapus juga bucketnya supaya tidak meninggalkan tagihan yang tidak disadari:

```bash
BUCKET="cadangan-webgis-${NAMA_PESERTA}-${PROJECT_ID}"

gcloud storage rm --recursive "gs://${BUCKET}"
```

Perintah itu menghapus bucket beserta seluruh arsip di dalamnya, jadi pastikan berkas `.env` sudah Anda salin dan tidak ada arsip yang masih dibutuhkan.

## Bila Ada yang Gagal

| Gejala | Penyebab yang paling sering |
|---|---|
| `storage.googleapis.com` tidak muncul pada Tahap 1 | Layanan Cloud Storage belum menyala di project. Peserta tidak punya izin menyalakannya, jadi lapor ke koordinator |
| `The requested bucket name is not available` | Nama bucket sudah dipakai orang lain di seluruh dunia. Tambahkan satu kata di belakangnya, lalu ulangi Tahap 2 |
| `AccessDeniedException` saat mengunggah arsip | Nama bucket pada skrip tidak sama dengan yang dibuat di Tahap 2, atau bucketnya sudah terhapus. Periksa juga identitas yang dipakai dengan `sudo gcloud config list account` |
| Skripnya berjalan tetapi tidak ada arsip di bucket | Periksa hasil `cat /etc/cron.daily/cadangkan-webgis`. Bila tertulis tanggal yang sudah terisi di dalam berkasnya, tanda `\` di depan `$` terlewat saat menempel |
| Layer tidak kembali setelah pemulihan | Folder diekstrak bukan dari `/opt/webgis/app`, atau container GeoServer tidak dibuat ulang dengan `--force-recreate` |
| `permission denied` saat mengekstrak arsip | Perintah `tar` dijalankan tanpa `sudo` |
