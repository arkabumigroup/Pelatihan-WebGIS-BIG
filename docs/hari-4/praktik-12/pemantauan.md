# Monitoring Sistem dan Container

Halaman ini melanjutkan [Backup Data dan Konfigurasi](/hari-4/praktik-12/pencadangan). Kalau backup menjawab pertanyaan "bagaimana kalau datanya hilang", monitoring menjawab pertanyaan yang lebih sering muncul: "apakah geoportal saya masih hidup".

Portal perlu diperiksa dari dua sisi. Dari dalam VM, yang Anda pakai saat sedang mengerjakan sesuatu. Dan dari luar secara berkala, yang tetap bekerja saat Anda tidur.

## Tahap 1. Periksa dari dalam VM

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Masuk ke VM lebih dahulu dari Cloud Shell:

```bash
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap
```

Satu perintah berikut menjawab hampir semua pertanyaan tentang kesehatan VM:

```bash
cd /opt/webgis/app && sudo docker compose ps && sudo docker stats --no-stream && df -h / && free -m
```

Cara membaca hasilnya:

| Yang dibaca | Nilai sehat | Bila menyimpang |
|---|---|---|
| `docker compose ps` | tiga container berstatus `running`: `nextjs`, `geoserver`, `nginx` | periksa log container yang berhenti, halaman ini bagian [Membaca log](#membaca-log) |
| Memori GeoServer pada `docker stats` | jauh di bawah batas 2048 MiB, acuan terukur 882 MiB | turunkan `MAXIMUM_MEMORY` pada `docker-compose.yml`, lalu buat ulang container `geoserver` |
| Memori tersedia pada `free -m` | di atas 300 MB | hentikan container yang tidak sedang dipakai, atau turunkan heap GeoServer |
| Pemakaian disk `/` pada `df -h` | di bawah 80% | hapus model 3D yang tidak dipakai, lalu periksa ukuran `data` dan `geoserver-data` |
| `OOMKilled` pada ketiga container | `false` | cari dulu pemakai memori yang sebenarnya sebelum mengubah konfigurasi apa pun |

Angka acuan pada tabel itu berasal dari VM pelatihan berukuran `e2-medium`: memori total 3913 MB, terpakai 1897 MB, tersedia 1766 MB, dan disk 29 GB dengan 19 GB masih kosong. Angka itu bukan target, melainkan pembanding supaya Anda tahu apa yang wajar.

::: tip Memori VM ini hanya 4 GB
GeoServer dibatasi 2048 MiB, dan Nginx serta Next.js memakai sisanya. Karena itu jangan menaikkan `MAXIMUM_MEMORY` tanpa alasan. Bila GeoServer sering kehabisan memori, memperbesar VM lebih masuk akal daripada memperbesar heap.
:::

## Tahap 2. Periksa dari luar VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Pemeriksaan dari dalam VM tidak dapat membuktikan bahwa geoportal Anda terjangkau dari internet. Untuk itu, periksa dari luar:

```bash
curl -sS -o /dev/null -w "portal %{http_code}\n" "https://${SUBDOMAIN}/portal"
curl -sS -o /dev/null -w "geoserver %{http_code}\n" "https://${SUBDOMAIN}/geoserver/web"
```

Hasil yang benar adalah `200` untuk portal dan `302` untuk GeoServer. Angka `302` bukan error: GeoServer mengalihkan `/geoserver/web` ke bentuk kanoniknya.

::: warning Alamat IP tidak dipakai lagi setelah subdomain aktif
Setelah Praktik 11 selesai, aplikasi hanya melayani permintaan yang datang lewat `https://SUBDOMAIN`. Memeriksa lewat `http://IP_EKSTERNAL_VM/portal` akan membalas pengalihan, bukan halaman.

Itu memang disengaja, dan bukan tanda ada yang rusak.
:::

## Tahap 3. Membaca log

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Saat ada yang tidak beres, log container adalah tempat pertama yang menjawab. Ganti `geoserver` dengan `nextjs` atau `nginx` sesuai kebutuhan:

```bash
cd /opt/webgis/app && sudo docker compose logs --tail=50 geoserver
```

Tambahkan `-f` di belakang `logs` untuk mengikuti log secara langsung. Tekan `Ctrl+C` untuk berhenti mengikuti.

## Tahap 4. Setelah VM dinyalakan kembali

Ketiga service pada `docker-compose.yml` memakai `restart: unless-stopped`, jadi container menyala sendiri setiap kali VM di-boot. Anda tidak perlu menjalankan `docker compose up` secara manual setelah VM dinyalakan.

GeoServer tetap butuh waktu sekitar 47 detik sebelum siap melayani. Jangan menyimpulkan ada kerusakan sebelum baris berikut muncul di lognya:

```text
Server startup in [...] milliseconds
```

Sebelum baris itu muncul, `/geoserver/web` masih membalas error dan itu wajar.

## Tahap 5. Monitor otomatis dengan uptime check

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Sampai sini monitoring masih menuntut Anda membuka Cloud Shell lebih dahulu. Uptime check membalik arahnya: Google yang memeriksa portal Anda secara berkala, dan mengirim email begitu portalnya tidak menjawab.

::: warning Project ini dipakai bersama peserta lain
Satu project kelompok dipakai oleh beberapa peserta. Uptime check dan alert policy yang Anda buat akan terlihat oleh mereka, dan sebaliknya.

Jangan mengubah atau menghapus check dan policy milik peserta lain, meskipun namanya mirip. Beri nama yang memuat `NAMA_PESERTA` Anda, dan saat memilih resource, pastikan dulu bahwa itu benar-benar milik Anda.
:::

Isi variabel berikut. `ALERT_EMAIL` harus alamat email yang benar-benar Anda buka.

```bash
export PROJECT_ID="geoportal-kelompok-a-xxxxx"
export VM_NAME="webgis-nama01"
export ZONE="asia-southeast2-b"
export DOMAIN="nama01.webgisbig.com"
export ALERT_EMAIL="alamat-email-anda@contoh.com"
```

Periksa lebih dahulu apakah check untuk domain Anda sudah ada:

```bash
gcloud monitoring uptime list-configs --project="$PROJECT_ID" \
  --format='table(displayName,name,period)'
```

Bila belum ada, buat sekali:

```bash
gcloud monitoring uptime create "portal-${VM_NAME}" \
  --project="$PROJECT_ID" \
  --resource-type=uptime-url \
  --resource-labels="host=${DOMAIN},project_id=${PROJECT_ID}" \
  --protocol=https --path=/portal --port=443 \
  --period=1 --timeout=10 --validate-ssl=true \
  --regions=asia-pacific,europe,usa-iowa
```

`--period=1` berarti **satu menit**, bukan satu detik. Tiga region dipakai supaya gangguan jaringan di satu lokasi Google tidak langsung dianggap portal Anda mati.

Jumlah region itu juga bukan pilihan bebas. Cloud Monitoring menolak perintahnya dengan `selected_regions must include at least three locations` bila Anda mengurangi daftarnya, jadi biarkan ketiganya.

Salin segmen terakhir kolom `name` dari hasilnya, atau dari daftar di atas, ke variabel berikut:

```bash
export CHECK_ID="uji-portal-xxxxxxxxxxx"
```

::: tip Yang dibuktikan uptime check, dan yang tidak
Uptime check memeriksa apakah `https://DOMAIN/portal` membalas kode sukses. Itu membuktikan Nginx dan aplikasi Next.js hidup.

Yang belum tentu terbukti adalah GeoServer dan basis data. Next.js yang mati menghasilkan `502` lewat Nginx dan akan terdeteksi, sedangkan GeoServer atau Supabase yang mati belum tentu mengubah balasan `/portal`.
:::

## Tahap 6. Buat saluran email dan alert policy

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell lalu Google Cloud Console</strong></p>

Buat saluran email bila Anda belum punya:

```bash
CHANNEL="$(gcloud alpha monitoring channels create \
  --project="$PROJECT_ID" --display-name="Email ${NAMA_PESERTA}" --type=email \
  --channel-labels="email_address=${ALERT_EMAIL}" --format='value(name)')"

echo "$CHANNEL"
```

Setelah perintah itu, buka kotak masuk alamat tersebut dan selesaikan verifikasi bila Google memintanya. Saluran yang belum diverifikasi tidak akan mengirim apa pun.

Selanjutnya buat alert policy. Cara paling mudah adalah lewat Console, karena formulirnya menampilkan pilihan yang harus dicocokkan:

**Monitoring > Alerting > Create policy**, lalu isi seperti tabel berikut.

| Pengaturan | Nilai |
|---|---|
| Metric | `monitoring.googleapis.com/uptime_check/check_passed` |
| Resource dan filter | `uptime_url`, dengan check ID milik Anda dari Tahap 5 |
| Alignment | `60s`, `ALIGN_NEXT_OLDER` |
| Reducer | `REDUCE_COUNT_FALSE` |
| Kondisi | **Above threshold**, `COMPARISON_GT`, threshold `1` |
| Trigger | **Any time series**, `count: 1` |
| Retest | **No retest**, `duration: 0s` untuk pengujian |
| Notification | Email saat **open dan closure** |
| Status | **Enabled** |

`REDUCE_COUNT_FALSE` menghitung berapa lokasi yang gagal. Dengan tiga lokasi, sehat semua bernilai 0 dan gagal semua bernilai 3. Threshold `> 1` berarti minimal dua lokasi gagal, sehingga gangguan di satu lokasi Google saja belum memicu email.

Pastikan notifikasi pembukaan **dan penutupan** dicentang keduanya. Tanpa yang kedua, Anda akan diberi tahu saat portalnya mati, tetapi tidak diberi tahu saat portalnya hidup lagi.

::: danger Tutup dulu incident yang terbuka sebelum mengubah kondisi policy
Ini bukan saran gaya kerja. Cloud Monitoring memiliki bug yang diakui Google pada issue tracker `183505672`: incident yang sedang terbuka ketika kondisinya diubah akan terus berbunyi memakai konfigurasi lama, muncul sebagai peringatan palsu, dan tidak dapat ditutup manual. Incident seperti itu baru menutup sendiri setelah tujuh hari.

Akibat praktisnya, incident lama yang menggantung tidak dapat dipakai sebagai bukti apa pun tentang konfigurasi yang baru.
:::

## Tahap 7. Uji sampai emailnya masuk

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Pengujian ini sengaja mematikan Nginx, bukan VM. Bedanya penting: dengan VM tetap menyala, SSH Anda tidak ikut terputus sehingga perintah pemulihannya selalu dapat dijalankan. Kalau VM yang dimatikan, Anda harus menyalakannya dari Console lebih dahulu.

Catat jamnya, lalu matikan Nginx:

```bash
gcloud compute ssh "$VM_NAME" --project="$PROJECT_ID" --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo docker stop nginx_proxy && date -u "+NGINX STOP: %Y-%m-%d %H:%M:%S UTC"'

curl --silent --show-error --output /dev/null --write-out 'HTTP %{http_code}\n' \
  --max-time 15 "https://${DOMAIN}/portal"
```

`HTTP 000` adalah hasil yang diharapkan, artinya koneksinya gagal. Kalau masih `200`, tunggu sebentar lalu ulangi sebelum menyalahkan policy-nya.

Sekarang tunggu. Pada pengujian yang pernah dilakukan, Nginx dihentikan pukul 11:48:02 WIB, incident terbuka sekitar pukul 11:50, dan email **Alert firing** masuk setelahnya. Jadi sediakan waktu sekitar sepuluh menit, dan jangan menutup incident secara manual selagi diuji.

Setelah emailnya masuk, atau setelah sepuluh menit bila belum masuk, hidupkan kembali:

```bash
gcloud compute ssh "$VM_NAME" --project="$PROJECT_ID" --zone="$ZONE" \
  --tunnel-through-iap \
  --command='sudo docker start nginx_proxy && date -u "+NGINX START: %Y-%m-%d %H:%M:%S UTC"'

curl --silent --show-error --output /dev/null --write-out 'HTTP %{http_code}\n' \
  --max-time 20 "https://${DOMAIN}/portal"
```

`docker start` menyalakan kembali container beserta prosesnya, jadi tidak perlu membuat ulang container untuk pemulihan biasa.

Tunggu sampai `HTTP 200` kembali, lalu periksa email **Alert recovered** untuk incident yang sama. Durasi yang tertulis di email itu adalah durasi incident, bukan lamanya downtime persis.

| Yang dicatat | Contoh pada pengujian |
|---|---|
| Jam Nginx dimatikan | 11:48:02 WIB |
| Jam incident terbuka | sekitar 11:50 WIB |
| Jam Nginx dinyalakan kembali | setelah email firing masuk |
| Durasi incident pada email | 8 menit 42 detik |

Catat keempat hal itu untuk pengujian Anda sendiri. Angka pada tabel di atas berasal dari pengujian pada 13 September 2026, dan dipakai sebagai pembanding wajar, bukan sebagai target.

## Tahap 8. Setelah pengujian selesai

::: tip Jangan lupa mematikan VM di akhir pelatihan
VM `e2-medium` yang menyala terus menagih sekitar 37 dolar per bulan dari kredit Anda. Setelah pelatihan selesai, hentikan atau hapus VM-nya dari Console.

Uptime check boleh dibiarkan hidup karena biayanya praktis nol, tetapi ia akan mengirim email peringatan terus-menerus selama VM-nya mati. Jadi hentikan juga check-nya, atau hapus sekalian.
:::

### Menghapus uptime check

Perintah `gcloud monitoring uptime delete` menerima nama check, dan ada satu jebakan di sini.

Menghapusnya memakai **nama tampilan** yang Anda tulis sendiri, misalnya `uji-peserta-praktik12`, akan dilaporkan berhasil dengan pesan `Deleted uptime check`. Tetapi check-nya sebenarnya masih ada, masih berjalan, dan masih mengirim email. Pesan berhasilnya menyesatkan.

Yang benar adalah memakai **nama resource lengkapnya**, yang memuat kode acak di belakangnya:

```bash
NAMA_CHECK="$(gcloud monitoring uptime list-configs --project="$PROJECT_ID" \
  --format='value(name)')"

echo "$NAMA_CHECK"
gcloud monitoring uptime delete "$NAMA_CHECK" --project="$PROJECT_ID"
```

Setelah itu, pastikan daftarnya benar-benar kosong:

```bash
gcloud monitoring uptime list-configs --project="$PROJECT_ID" \
  --format="table(displayName,name)"
```

::: warning Menghapus project tidak selalu cukup
Kalau VM dihapus tetapi uptime check-nya ditinggalkan, pemeriksaannya akan terus gagal dan Anda akan menerima email peringatan berulang tanpa tahu sebabnya. Periksa daftar di atas sekali lagi sebelum meninggalkan project.
:::

Untuk mengurangi peringatan akibat gangguan jaringan sesaat, retest dapat diubah menjadi dua menit setelah pengujian awal selesai. Bila diubah, ulangi Tahap 7 supaya Anda tahu konfigurasi barunya juga bekerja.

Untuk kuota, satu endpoint dengan interval satu menit dan tiga lokasi berarti sekitar 129.600 pemeriksaan per 30 hari. Angka itu berguna untuk memperkirakan, bukan sebagai bukti jumlah yang benar-benar ditagihkan. Periksa [harga Cloud Monitoring](https://cloud.google.com/products/observability/pricing#pricing-for-uptime-check-execution) bila Anda menambah banyak check.

## Bila Ada yang Gagal

| Gejala | Penyebab yang paling sering |
|---|---|
| `docker compose ps` tidak menampilkan tiga container | Ada container yang berhenti. Jalankan `sudo docker compose logs --tail=50 NAMA_SERVICE` untuk melihat sebabnya |
| Portal tidak terjangkau padahal ketiga container `running` | Periksa sertifikat TLS dan konfigurasi Nginx. Halaman [Penambahan Subdomain](/hari-4/praktik-11/subdomain) memuat pemeriksaannya |
| `/geoserver/web` membalas error padahal container hidup | GeoServer belum selesai boot. Tunggu sampai `Server startup in [...] milliseconds` muncul di lognya |
| Uptime check tidak pernah memicu email | Saluran emailnya belum diverifikasi, atau notifikasi pembukaan belum dicentang pada policy. Periksa `gcloud alpha monitoring channels list` |
| Portal mati tetapi tidak ada email | Buka **Monitoring > Alerting**, pilih **Show closed alerts**, dan periksa rentang waktunya. Pastikan juga filter policy menunjuk check ID milik Anda |
| Incident berbunyi terus dan tidak dapat ditutup | Kondisi policy diubah selagi incident masih terbuka, dan itu bug Cloud Monitoring `183505672`. Buat kondisi bersih lebih dahulu, lalu nilai ulang hasilnya |
| Monitoring peserta lain ikut berubah | Check dan policy di project ini terlihat oleh semua peserta. Pastikan Anda memilih resource milik sendiri sebelum mengubah apa pun |

## Rujukan

- [Uptime check dan alert policy](https://cloud.google.com/monitoring/uptime-checks/uptime-alerting-policies)
- [Contoh alert policy dalam JSON](https://docs.cloud.google.com/monitoring/alerts/policies-in-json)
- [Penanganan masalah alert](https://docs.cloud.google.com/monitoring/alerts/troubleshooting-alerts)
