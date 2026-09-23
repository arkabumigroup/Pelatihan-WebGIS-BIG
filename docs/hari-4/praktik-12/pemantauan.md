# Monitoring Sistem dan Container

Halaman ini melanjutkan [Backup Data dan Konfigurasi](/hari-4/praktik-12/pencadangan). Kalau backup menjawab pertanyaan "bagaimana kalau datanya hilang", monitoring menjawab pertanyaan yang lebih sering muncul: "apakah geoportal saya masih hidup".

Portal perlu diperiksa dari dua sisi. Dari dalam VM, yang Anda pakai saat sedang mengerjakan sesuatu. Dan dari luar secara berkala, yang tetap bekerja saat Anda tidur.

## Tahap 1. Periksa dari dalam VM

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Masuk ke VM lebih dahulu dari Cloud Shell:

```bash
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap
```

Satu perintah berikut menjawab hampir semua pertanyaan tentang kondisi VM:

```bash
cd /opt/webgis/app && sudo docker compose ps && sudo docker stats --no-stream && df -h / && free -m
```

Cara membaca hasilnya:

| Yang dibaca | Nilai normal | Bila menyimpang |
|---|---|---|
| `docker compose ps` | tiga container berstatus `running`, bernama `nextjs_portal`, `geoserver_app`, dan `nginx_proxy` | periksa log container yang berhenti, halaman ini bagian [Membaca log](#tahap-3-membaca-log) |
| Memori GeoServer pada `docker stats` | di bawah batas 2048 MiB, acuan terukur 1,2 GiB pada VM yang sudah menyala dua hari | turunkan `MAXIMUM_MEMORY` pada `docker-compose.yml`, lalu buat ulang container `geoserver` |
| Memori tersedia pada `free -m` | di atas 300 MB | hentikan container yang tidak sedang dipakai, atau turunkan heap GeoServer |
| Pemakaian disk `/` pada `df -h` | di bawah 80% | hapus model 3D yang tidak dipakai, lalu periksa ukuran `data` dan `geoserver-data` |
| Nilai `OOMKilled` pada ketiga container | `false` | cari dulu pemakai memori yang sebenarnya sebelum mengubah konfigurasi apa pun |

Satu baris terakhir itu tidak terbaca dari perintah di atas, karena `docker compose ps` tidak menampilkan `OOMKilled`. Nilainya diperiksa terpisah:

```bash
cd /opt/webgis/app && for c in nextjs_portal geoserver_app nginx_proxy; do
  echo -n "$c: "
  sudo docker inspect -f "{{.State.OOMKilled}}" $c
done
```

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

GeoServer tetap butuh waktu sekitar satu menit sebelum siap melayani. Pada tiga pengukuran di VM pelatihan, baris penandanya baru muncul pada detik ke-51, ke-54, dan ke-63, jadi tunggu selama itu sebelum menyimpulkan ada kerusakan. Yang ditunggu adalah baris berikut di lognya:

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

Salin segmen terakhir kolom `name` dari hasilnya, atau dari daftar di atas:

```bash
export CHECK_ID="portal-webgis-nama01-AbCdEf12345"
```

Nilai itu tidak dipakai lagi oleh perintah mana pun di halaman ini. Gunanya untuk mencocokkan check milik Anda saat memilih resource di Console pada tahap berikutnya, karena project ini dipakai bersama peserta lain.

::: tip Yang dibuktikan uptime check, dan yang tidak
Uptime check memeriksa apakah `https://DOMAIN/portal` membalas kode sukses. Itu membuktikan Nginx dan aplikasi Next.js berjalan.

Yang belum tentu terbukti adalah GeoServer dan database. Next.js yang berhenti menghasilkan `502` lewat Nginx dan akan terdeteksi, sedangkan GeoServer atau Supabase yang mati belum tentu mengubah balasan `/portal`.
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

Pastikan alamat emailnya benar, karena salah ketik berarti peringatannya tidak pernah sampai. Pada pengujian di halaman ini, saluran berjenis `email` langsung dapat mengirim tanpa langkah verifikasi tambahan.

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

`REDUCE_COUNT_FALSE` menghitung berapa lokasi yang gagal. Dengan tiga lokasi, normal semua bernilai 0 dan gagal semua bernilai 3. Threshold `> 1` berarti minimal dua lokasi gagal, sehingga gangguan di satu lokasi Google saja belum memicu email.

Yang perlu Anda pastikan adalah kedua emailnya sampai: **Alert firing** saat portal tidak dapat diakses, dan **Alert recovered** saat portalnya kembali. Pada pengujian di halaman ini keduanya masuk tanpa pengaturan tambahan. Kalau yang kedua tidak pernah datang, saluran emailnya yang perlu diperiksa.

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

Sekarang tunggu. Pada pengujian 23 September 2026, Nginx dihentikan pukul 18:35:53 WIB dan incident terbuka pukul 18:39:13 WIB, jadi perlu waktu sekitar tiga setengah menit. Email **Alert firing** masuk tidak lama setelah incident itu terbuka. Sediakan waktu sekitar sepuluh menit, dan jangan menutup incident secara manual selagi diuji.

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
| Jam Nginx dimatikan | 18:35:53 WIB |
| Jam incident terbuka | 18:39:13 WIB |
| Jam Nginx dinyalakan kembali | 18:39:49 WIB |
| Durasi incident pada email | 2 menit 38 detik |

Catat keempat hal itu untuk pengujian Anda sendiri. Angka pada tabel di atas berasal dari pengujian pada 23 September 2026, dan dipakai sebagai pembanding wajar, bukan sebagai target.

Durasi incident tidak tetap, karena bergantung pada berapa lama Anda membiarkan Nginx mati. Pada pengujian di atas Nginx mati selama 3 menit 56 detik, dan incidentnya tercatat 2 menit 38 detik. Kalau Anda menunggu sampai sepuluh menit, durasinya juga akan mendekati sepuluh menit.

## Tahap 8. Setelah pengujian selesai

::: tip Jangan lupa mematikan VM di akhir pelatihan
VM `e2-medium` yang menyala terus menagih sekitar 37 dolar per bulan dari kredit Anda. Setelah pelatihan selesai, hentikan atau hapus VM-nya dari Console.

Uptime check boleh dibiarkan aktif karena eksekusinya gratis sampai satu juta per bulan per project, sedangkan satu check dengan tiga lokasi hanya memakai sekitar 129.600 eksekusi. Yang berbayar justru alert policy-nya, yaitu 1,50 dolar per bulan untuk setiap kondisi sejak Januari 2025.

Selama VM-nya mati, check itu akan mengirim email peringatan terus-menerus, jadi hentikan juga check-nya atau hapus sekalian.
:::

### Menghapus uptime check

Perintah `gcloud monitoring uptime delete` menerima nama check, dan ada dua jebakan di sini.

Yang pertama, perintahnya menanyakan konfirmasi sebelum menghapus. Di Cloud Shell pertanyaan itu muncul dan cukup dijawab dengan menekan Enter.

Yang kedua dan lebih berbahaya: menghapusnya memakai **nama tampilan** yang Anda tulis sendiri, misalnya `portal-webgis-dhanypedia`, akan dilaporkan berhasil dengan pesan `Deleted uptime check or synthetic monitor [...]`. Tetapi check-nya sebenarnya masih ada, masih berjalan, dan masih mengirim email. Pesan berhasilnya menyesatkan.

Yang benar adalah memakai **nama resource lengkapnya**, yang memuat kode acak di belakangnya. Karena project ini dipakai bersama peserta lain, saring dulu supaya yang terambil hanya check milik Anda:

```bash
NAMA_CHECK="$(gcloud monitoring uptime list-configs --project="$PROJECT_ID" \
  --filter="displayName=portal-${VM_NAME}" \
  --format='value(name)')"

echo "$NAMA_CHECK"
gcloud monitoring uptime delete "$NAMA_CHECK" --project="$PROJECT_ID"
```

Tanpa `--filter` itu, perintahnya mengambil seluruh check di project, termasuk milik peserta lain, lalu menghapusnya sekaligus.

Setelah itu, pastikan check Anda benar-benar hilang. Daftar berikut hanya menampilkan check milik Anda, jadi hasilnya harus kosong walaupun peserta lain masih punya check:

```bash
gcloud monitoring uptime list-configs --project="$PROJECT_ID" \
  --filter="displayName=portal-${VM_NAME}" \
  --format="table(displayName,name)"
```

::: warning Menghapus project tidak selalu cukup
Kalau VM dihapus tetapi uptime check-nya ditinggalkan, pemeriksaannya akan terus gagal dan Anda akan menerima email peringatan berulang tanpa tahu sebabnya. Periksa daftar di atas sekali lagi sebelum meninggalkan project.
:::

Untuk mengurangi peringatan akibat gangguan jaringan sesaat, retest dapat diubah menjadi dua menit setelah pengujian awal selesai. Bila diubah, ulangi Tahap 7 supaya Anda tahu konfigurasi barunya juga bekerja.

Untuk perkiraan, satu endpoint dengan interval satu menit dan tiga lokasi berarti sekitar 129.600 pemeriksaan per 30 hari, dan itu masih jauh di bawah jatah gratis satu juta eksekusi per project. Angka itu berguna untuk memperkirakan, bukan sebagai bukti jumlah yang benar-benar ditagihkan. Periksa [harga Cloud Monitoring](https://cloud.google.com/products/observability/pricing#pricing-for-uptime-check-execution) bila Anda menambah banyak check, atau menambah kondisi pada alert policy.

## Bila Ada yang Gagal

| Error | Penyebab yang paling sering |
|---|---|
| `docker compose ps` tidak menampilkan tiga container | Ada container yang berhenti. Jalankan `sudo docker compose logs --tail=50 NAMA_SERVICE` untuk melihat sebabnya |
| Portal tidak terjangkau padahal ketiga container `running` | Periksa sertifikat TLS dan konfigurasi Nginx. Halaman [Penambahan Subdomain](/hari-4/praktik-11/subdomain) memuat pemeriksaannya |
| `/geoserver/web` membalas error padahal container berjalan | GeoServer belum selesai boot. Tunggu sampai `Server startup in [...] milliseconds` muncul di lognya |
| Uptime check tidak pernah memicu email | Saluran emailnya belum diverifikasi, atau notifikasi pembukaan belum dicentang pada policy. Periksa `gcloud alpha monitoring channels list` |
| Portal tidak dapat diakses tetapi tidak ada email | Buka **Monitoring > Alerting**, pilih **Show closed alerts**, dan periksa rentang waktunya. Pastikan juga filter policy menunjuk check ID milik Anda |
| Incident berbunyi terus dan tidak dapat ditutup | Kondisi policy diubah selagi incident masih terbuka, dan itu bug Cloud Monitoring `183505672`. Buat kondisi bersih lebih dahulu, lalu nilai ulang hasilnya |
| Monitoring peserta lain ikut berubah | Check dan policy di project ini terlihat oleh semua peserta. Pastikan Anda memilih resource milik sendiri sebelum mengubah apa pun |

## Rujukan

- [Uptime check dan alert policy](https://cloud.google.com/monitoring/uptime-checks/uptime-alerting-policies)
- [Contoh alert policy dalam JSON](https://docs.cloud.google.com/monitoring/alerts/policies-in-json)
- [Penanganan masalah alert](https://docs.cloud.google.com/monitoring/alerts/troubleshooting-alerts)
