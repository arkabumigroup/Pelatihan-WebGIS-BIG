# Otomatisasi Cloud Build dan Verifikasi

Halaman terakhir Deployment Project. Setelah selesai, setiap push ke branch `main` akan membangun dan men-deploy aplikasi tanpa masuk ke VM.

## Menyiapkan Trigger Cloud Build

### Tahap 24. Tambahkan Dockerfile dan cloudbuild.yaml

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Terminal Laptop</strong></p>

Berkas `Dockerfile` dan `.dockerignore` ada di fork Anda, di root repositori, karena keduanya ikut ketika Anda mem-fork repositori instruktur. Bila ternyata belum ada, salin keduanya dari repositori sumber pada halaman [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori#repositori-yang-dipakai).

Selanjutnya periksa `next.config.mjs`. Dua baris berikut wajib ada, dan keduanya bukan tambahan yang opsional:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: "/portal",
  reactStrictMode: false
};

export default nextConfig;
```

- `output: "standalone"` diperlukan karena `Dockerfile` menyalin folder `.next/standalone`. Tanpa itu, build image gagal pada tahap penyalinan.
- `basePath: "/portal"` diperlukan karena `nginx.conf` mengalihkan `/` ke `/portal`, dan seluruh alamat pada modul ini memakai bentuk `http://IP_VM/portal`. Tanpa `basePath`, Nginx tetap mengalihkan ke `/portal` tetapi Next.js tidak menyajikan halaman di sana, sehingga yang muncul adalah 404.

#### cloudbuild.yaml

Berkas `cloudbuild.yaml` juga **sudah ada** di fork Anda. **Jangan menulis ulang berkas ini.** Cukup buka dan pastikan isinya seperti berikut.

Berkas ini menjalankan tiga hal setiap kali ada push ke branch `main`: membangun image dari `Dockerfile`, push ke Artifact Registry, lalu masuk ke VM untuk menarik image terbaru dan menyalakan container.

```yaml
substitutions:
  _REGION: asia-southeast2
  _REPOSITORY: katalog-images
  # _IMAGE_NAME, _VM_NAME, _VM_ZONE, _VM_APP_DIR, dan _CESIUM_ION_TOKEN sengaja
  # tidak diberi nilai bawaan. Semuanya wajib diisi pada substitution variable
  # trigger. Tanpa nilai bawaan, build berhenti dengan pesan yang jelas daripada
  # diam-diam memakai satu nama image bersama dan menimpa image milik peserta
  # lain di Artifact Registry.

steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      # Diteruskan ke ARG di Dockerfile, lalu ditanam ke berkas hasil build.
      # Diperlukan karena komponen peta 3D memakai token ini di sisi klien.
      - --build-arg
      - NEXT_PUBLIC_CESIUM_ION_TOKEN=${_CESIUM_ION_TOKEN}
      - -t
      - ${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE_NAME}:$SHORT_SHA
      - .

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - ${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE_NAME}:$SHORT_SHA

  - name: gcr.io/cloud-builders/gcloud
    entrypoint: bash
    args:
      - -c
      - |
        gcloud compute ssh "${_VM_NAME}" \
          --zone="${_VM_ZONE}" \
          --tunnel-through-iap \
          --quiet \
          --command="sudo gcloud auth print-access-token | sudo docker login -u oauth2accesstoken --password-stdin https://${_REGION}-docker.pkg.dev && cd '${_VM_APP_DIR}' && sudo sed -i 's|^NEXTJS_IMAGE=.*|NEXTJS_IMAGE=${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE_NAME}:$SHORT_SHA|' .env && sudo -H docker compose pull nextjs && sudo -H docker compose up -d && sudo -H docker compose exec -T nginx nginx -s reload"

images:
  - ${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE_NAME}:$SHORT_SHA

options:
  dynamicSubstitutions: true
  logging: CLOUD_LOGGING_ONLY
```

Periksa kembali pemeriksa YAML pada Tahap 6 halaman [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). Sekarang kedua berkas sudah ada, sehingga keluaran yang diharapkan adalah:

```
OK   docker-compose.yml -> services, networks
     service: nextjs, geoserver, nginx
OK   cloudbuild.yaml -> substitutions, steps, images, options
```

### Tahap 25. Commit dan push

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>GitHub Desktop</strong></p>

Buka GitHub Desktop. Keempat berkas yang baru ditambahkan akan muncul di daftar **Changes** pada kolom kiri.

**Periksa lebih dahulu bahwa `.env` tidak ada di daftar itu.** Berkas tersebut berisi kredensial Anda dan tidak boleh ikut terkirim. Bila `.env` muncul di sana, hentikan pekerjaan dan periksa kembali halaman [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project) Tahap 6.

Bila daftarnya sudah benar:

1. Tulis ringkasan perubahan di kotak kiri bawah, misalnya `Tambah Cloud Build dan Dockerfile`
2. Klik **Commit to main**
3. Klik **Push origin**

Setelah terkirim, Cloud Build akan mulai bekerja sendiri. Tahap berikutnya menyiapkan sisi GitHub-nya.

### Tahap 26. Hubungkan repositori GitHub

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

Buka Cloud Build, lalu Repositories, lalu Connect repository. Buat connection dengan nama sesuai `CONNECTION_NAME` yang tercetak pada Tahap 2, pilih GitHub, masuk memakai akun pemilik fork, pilih repositori peserta, isi linked repository sesuai `LINKED_REPO_NAME`, lalu pastikan status connection berubah menjadi COMPLETE.

### Tahap 27. Buat trigger Cloud Build

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

Buat trigger dengan pengaturan berikut.

| Kolom | Nilai |
|---|---|
| Event | Push to a branch |
| Source | Fork repositori peserta |
| Branch | `^main$` |
| Configuration | Cloud Build configuration file |
| Location | `cloudbuild.yaml` |
| Name | Sesuai `TRIGGER_NAME` |
| Service account | Sesuai `BUILD_SA` |

### Tahap 28. Isi substitution variable

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

Tambahkan lima variabel berikut pada trigger. Ganti `PARTICIPANT_ID` dengan identitas Anda.

| Variabel | Nilai |
|---|---|
| `_VM_NAME` | `webgis-PARTICIPANT_ID` |
| `_VM_ZONE` | `asia-southeast2-b` |
| `_VM_APP_DIR` | `/opt/webgis/app` |
| `_IMAGE_NAME` | `nextjs-PARTICIPANT_ID` |
| `_CESIUM_ION_TOKEN` | Token Cesium Ion Anda, dari [ion.cesium.com/tokens](https://ion.cesium.com/tokens) |

Bagian `PARTICIPANT_ID` pada dua nilai pertama dan terakhir itulah yang membuat trigger peserta A tidak pernah menyentuh VM peserta B.

::: warning Mengapa `_CESIUM_ION_TOKEN` harus ada di trigger, bukan hanya di `.env`
Token Cesium Ion dipakai komponen peta 3D, dan komponen itu berjalan di browser. NextJS **menanam** nilai `NEXT_PUBLIC_*` ke dalam berkas hasil build, bukan membacanya saat aplikasi berjalan.

Karena `.dockerignore` mengecualikan berkas `.env` dari build context, nilai yang ada di `.env` VM **tidak ikut** ke dalam build. Nilainya harus dikirim sebagai build argument, dan itulah yang dilakukan `cloudbuild.yaml` dengan `${_CESIUM_ION_TOKEN}`.

Akibat bila variabel ini kosong: build tetap berhasil dan situs tetap tampil, tetapi peta 3D gagal memuat aset 3D Tiles dari Cesium Ion. Peta dasar dan terrain tetap muncul, karena keduanya memakai sumber sendiri, sehingga gejalanya mudah disalahartikan sebagai model yang rusak.
:::

### Tahap 29. Jalankan trigger dan pantau hasilnya

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

Buka halaman History, lalu jalankan trigger dan pantau build yang sedang berjalan.

## Verifikasi

### Tahap 30. Periksa container

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap \
  --command='cd /opt/webgis/app && docker compose ps'
```

Tiga container harus berstatus running: `nextjs_portal`, `geoserver_app`, dan `nginx_proxy`.

### Tahap 31. Periksa GeoServer

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
EXTERNAL_IP="$(gcloud compute instances describe "$VM_NAME" \
  --zone="$ZONE" \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')"

echo "http://${EXTERNAL_IP}/geoserver/web"
curl -sSIL --max-redirs 3 "http://${EXTERNAL_IP}/geoserver/web"
```

### Tahap 32. Buka Geoportal

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell menuju browser</strong></p>

```bash
EXTERNAL_IP="$(gcloud compute instances describe "$VM_NAME" \
  --zone="$ZONE" \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')"

echo "http://${EXTERNAL_IP}/portal"
curl -sSIL --max-redirs 3 "http://${EXTERNAL_IP}/portal"
```

Buka alamat `http://IP_EKSTERNAL_VM/portal` di browser. Tulis `http://` secara eksplisit, karena sebagian browser mengubahnya menjadi `https://` lebih dahulu dan sertifikatnya belum ada pada tahap ini.

## Bila Ada yang Gagal

| Gejala | Penyebab yang paling sering |
|---|---|
| `ALREADY_EXISTS` saat membuat Service Account | Identitas peserta sama dengan peserta lain. Jalankan kembali blok Tahap 2 dan laporkan ke koordinator. |
| `host not found in upstream "nextjs"` | `nginx.conf` belum memakai pola `resolver` dengan `proxy_pass` variabel. Ambil berkas dari halaman Konfigurasi Project. |
| Container `nextjs` tidak muncul | Trigger belum pernah berjalan, atau `cloudbuild.yaml` belum ada di branch `main`. |
| Geoportal terbuka tetapi login gagal | `DATABASE_URL` masih kosong di `.env`. Isi, lalu jalankan `docker compose up -d` lagi. |
| `pull access denied` untuk image nextjs | `NEXTJS_IMAGE` masih berisi nama karangan. Nilai sementara yang aman adalah `nginx:1.27-alpine`. |
| Build gagal pada langkah SSH ke VM | Service Account trigger belum diberi `roles/iam.serviceAccountUser` pada Service Account VM. Ulangi Tahap 6. |

## Hasil Tahap Ini

Geoportal berjalan di `http://IP_EKSTERNAL_VM/portal`, GeoServer dapat diakses dari halaman yang sama, dan setiap push ke branch `main` otomatis membangun ulang image serta menyalakan container di VM. Alamat itu belum memakai HTTPS, dan itu yang dikerjakan pada halaman berikutnya.

## Lampiran. Bila Memakai Akun Google Cloud Sendiri

Halaman ini mengasumsikan Anda memakai project kelompok yang disiapkan koordinator. Bila Anda menjalankan seluruh praktik dengan akun Google Cloud sendiri, projectnya dibuat lebih dahulu melalui pendaftaran akun gratis. Sebagian tahapan pada halaman ini tetap sama, tetapi nama resource tidak perlu memuat identitas peserta karena projectnya hanya dipakai satu orang.

| Bagian | Perbedaan pada akun sendiri |
|---|---|
| Tahap 2 | `NAMA_PESERTA` boleh diisi nama sendiri, sampai 12 karakter. Penjagaan tabrakan tetap berguna bila Anda memakai lebih dari satu identitas. |
| Tahap 4 | Service Account dibuat di project sendiri, bukan project kelompok. |
| Tahap 5 | Repository `katalog-images` perlu dibuat sendiri di Artifact Registry. |
| Tahap 8 | Firewall rule perlu dibuat sendiri, karena tidak ada koordinator yang menyiapkannya. |
| Tahap 26 | Connection GitHub dibuat di project sendiri. |

### Pendaftaran akun

1. Buka [https://cloud.google.com/gcp](https://cloud.google.com/gcp).

2. Pilih **Get started for free**.

3. Pilih akun dan negara yang digunakan, lalu klik **Agree & continue**.

4. Isi **Contact Information**, lalu simpan.

5. Setelah organization dibuat, isi **Tax Information**. Pilih **Head Office**, masukkan NIK pada kolom NPWP, lalu simpan.

6. Isi **Add Payment Method** dengan detail kartu kredit.

7. Konfirmasi metode pembayaran, lalu klik **Start free**.

8. Buka kembali [https://cloud.google.com/gcp](https://cloud.google.com/gcp). Karena akun sudah terdaftar, tombol **Go to my console** akan muncul. Klik tombol itu untuk masuk ke dashboard project.

Setelah project tersedia, kembali ke Tahap 2 dan isi `PROJECT_ID` dengan Project ID milik Anda sendiri.

---

Lanjutkan ke [Penambahan Subdomain](/hari-4/praktik-11/subdomain).
