# Persiapan Repositori dan Identitas

Halaman ini menyiapkan dua hal sebelum menyentuh Google Cloud: repositori yang akan dipakai, dan identitas peserta yang menurunkan nama seluruh resource Anda.

## Prasyarat

Halaman ini melanjutkan pekerjaan dari halaman [Konfigurasi Project](/hari-3/deployment-project/konfigurasi-project). Tahap 1 sampai 10 di sana harus sudah selesai, karena halaman ini memindahkan aplikasi yang sudah terbukti berjalan di laptop.

Ringkasnya, empat hal berikut harus sudah benar.

### 1. Repositori sudah di-fork dan di-clone

Fork `https://github.com/dhanyyudi/personal-geoportal-peserta` di akun GitHub Anda, lalu clone fork itu ke laptop. Dikerjakan pada Tahap 1 halaman Konfigurasi Project.

### 2. Database Supabase sudah siap, dan login sudah terbukti

- Project Supabase sudah dibuat.
- Skrip `sql/01-schema.sql` sampai `sql/03-periksa.sql` sudah dijalankan lewat SQL Editor.
- Akun super admin sudah dibuat lewat `sql/02-seed-super-admin.sql`.
- `node scripts/uji-database.mjs` melaporkan `13 lulus, 0 gagal`.
- Portal sudah berjalan di laptop dengan `npm run dev`, dan Anda berhasil login.

Kelima butir itu dikerjakan pada Tahap 2 dan Tahap 8 sampai 9 halaman Konfigurasi Project.

### 3. Berkas .env sudah terisi

`.env` di laptop sudah diisi pada Tahap 5. Yang perlu Anda siapkan di sini adalah nilai untuk `.env` di VM, yang merupakan berkas terpisah.

Enam variabel berikut wajib ada. Tanpa salah satunya, login di VM tidak bekerja.

| Variabel | Isi |
|---|---|
| `DATABASE_URL` | Connection string Supabase, sama seperti di laptop |
| `JWT_SECRET` | Hasil perintah acak, boleh sama dengan di laptop |
| `NEXTAUTH_SECRET` | Hasil perintah acak, boleh sama dengan di laptop |
| `NEXTAUTH_URL` | Untuk VM: `http://IP_EKSTERNAL_VM/portal` |
| `ADMIN_CONTACT_EMAIL` | Email Anda sendiri |
| `JWT_EXPIRES_IN` | `1h`, sudah terisi di `.env.example` |

Dua nilai yang berbeda antara laptop dan VM hanya `NEXTAUTH_URL`, `BASE_URL`, dan `NEXT_PUBLIC_URL_BASE_PATH`, karena ketiganya memuat alamat aplikasi. Nilainya diisi pada Tahap 18.

Berkas `.env` di laptop tidak ikut ter-commit, dan tidak ikut tersalin ke VM. Berkas di VM dibuat langsung di sana.

### 4. Akses Google Cloud dari koordinator

- Akses ke Google Cloud project, dengan Project ID berbentuk `geoportal-kelompok-a-xxxxx`.
- Email peserta yang sudah terdaftar di project tersebut. Email ini dipakai menurunkan identitas peserta.

## Repositori yang Dipakai

Deployment Project bekerja pada fork repositori peserta di akun GitHub Anda sendiri.

| | Repositori |
|---|---|
| Sumber, yang di-fork | `https://github.com/dhanyyudi/personal-geoportal-peserta` |
| Fork Anda | `https://github.com/<username-anda>/personal-geoportal-peserta` |

Fork dan clone repositori itu dikerjakan pada halaman [Konfigurasi Project](/hari-3/deployment-project/konfigurasi-project), Tahap 1. Pastikan tahap itu sudah selesai sebelum melanjutkan.

### Mengirim perubahan

Cloud Build membangun dari **fork Anda di GitHub**, bukan dari laptop. Jadi setiap perubahan harus dikirim lebih dahulu.

Di GitHub Desktop: tulis ringkasan perubahan di kotak kiri bawah, klik **Commit to main**, lalu klik **Push origin**.

### Menyelaraskan fork bila sumber diperbarui

Repositori sumber dapat diperbarui selama pelatihan, misalnya karena ada perbaikan. Fork Anda **tidak ikut berubah dengan sendirinya.**

Di GitHub Desktop: klik **Fetch origin**. Bila muncul tombol **Pull origin** dengan angka, klik tombol itu. Angka itu jumlah perubahan yang belum masuk ke fork Anda.

Bila muncul konflik, artinya Anda dan sumber mengubah berkas yang sama. Cara tercepat ada di bagian bawah halaman ini.

### Perubahan belum sampai ke VM

Fork yang sudah diperbarui **belum mengubah apa pun di VM Anda.** VM memakai salinannya sendiri di `/opt/webgis/app`, yang di-clone dari fork pada Tahap 16, dan salinan itu tidak ikut berubah sendiri.

Alurnya tiga tahap, dan ketiganya perlu:

```text
repositori sumber  ->  fork Anda  ->  salinan di VM
      GitHub            GitHub Desktop      git pull
```

Masuk ke VM:

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

Lalu tarik perubahannya:

```bash
cd /opt/webgis/app
git pull
```

::: warning Cloud Build tidak menarik perubahan untuk Anda
`cloudbuild.yaml` **tidak menjalankan `git pull`** pada VM. Yang dikerjakannya hanya tiga hal:

1. Mengganti nilai `NEXTJS_IMAGE` pada `.env` VM
2. Menarik image baru dari Artifact Registry
3. Menjalankan `docker compose up -d`, lalu memuat ulang nginx

Artinya image aplikasi diperbarui, tetapi **berkas konfigurasi di VM tidak.** Bila `docker-compose.yml` atau `nginx.conf` berubah di repositori, perubahan itu harus ditarik sendiri dengan `git pull` di atas.
:::

::: tip Bila ragu, fork ulang saja
Cara paling sederhana dan paling kecil risikonya. Salin `.env` ke luar folder lebih dahulu, karena berkas itu berisi kredensial Anda dan tidak boleh hilang:

```bash
cp .env ~/env-simpanan
```

Hapus foldernya, fork dan clone ulang lewat GitHub Desktop, lalu kembalikan:

```bash
cp ~/env-simpanan .env
```

Selama Anda belum punya perubahan sendiri yang perlu disimpan, cara ini lebih cepat daripada menyelesaikan konflik.
:::
## Nilai yang Harus Unik per Peserta

Empat peserta memakai satu project Google Cloud bersama. Karena itu sebagian nilai harus berbeda antar peserta, dan sebagian justru harus sama.

Nilai unik itu **tidak ada di berkas repositori Anda**. Seluruhnya diatur pada trigger Cloud Build sebagai substitution variable, sehingga tidak ada berkas yang perlu diedit di laptop.

| Nilai | Unik per peserta? | Diatur di mana |
|---|---|---|
| `_VM_NAME` | Ya | Substitution variable pada trigger, Tahap 28 |
| `_IMAGE_NAME` | Ya | Substitution variable pada trigger, Tahap 28 |
| `_VM_ZONE` | Tidak, sama untuk semua | Substitution variable pada trigger, Tahap 28 |
| `_VM_APP_DIR` | Tidak, sama untuk semua | Substitution variable pada trigger, Tahap 28 |
| `_CESIUM_ION_TOKEN` | Ya, token Anda sendiri | Substitution variable pada trigger, Tahap 28 |
| Nama Project ID | Tidak, milik kelompok | Dari koordinator |
| `katalog-images` | Tidak, milik kelompok | Dibuat koordinator, peserta hanya memakai |
| `nextjs_portal`, `geoserver_app`, `nginx_proxy` | Tidak | Nama container di dalam VM Anda sendiri. Tidak bertabrakan dengan peserta lain karena VM-nya terpisah |
| Alamat `geoserver` dan `nextjs` pada `nginx.conf` | Tidak | Nama service di dalam jaringan Docker VM Anda sendiri |

Baris terakhir sering menimbulkan kekhawatiran. Nama kontainer dan nama service memang sama untuk semua peserta, tetapi tidak bertabrakan, karena keempat peserta memakai VM yang berbeda. Yang bertabrakan hanya resource yang berada di project bersama, dan itulah yang ditangani pada tabel di bawah.

## Pembagian Resource

Tabel ini perlu dibaca sebelum Tahap 2. Salah menebak pemilik resource adalah penyebab kegagalan paling sering di halaman ini.

| Resource | Dibuat oleh | Nama | Bila Anda membuatnya sendiri |
|---|---|---|---|
| Project kelompok | Koordinator | `geoportal-kelompok-a-xxxxx` | Tidak punya izin, dan tidak perlu |
| Artifact Registry | Koordinator | `katalog-images` | Gagal dengan `ALREADY_EXISTS` |
| Firewall rule port 80 dan 443 | Koordinator | `allow-webgis-http` | Gagal dengan `ALREADY_EXISTS` |
| Firewall rule SSH lewat IAP | Koordinator | `allow-webgis-iap-ssh` | Gagal dengan `ALREADY_EXISTS` |
| Network tag | Koordinator | `webgis-http`, `webgis-iap-ssh` | Gagal dengan `ALREADY_EXISTS` |
| VM, IP statis, Service Account Cloud Build, trigger, GitHub connection, image | Peserta | Mengandung identitas peserta | Bertabrakan dengan peserta lain |

Nama pada baris terakhir diturunkan seluruhnya dari satu nilai, yaitu identitas peserta. Nilai itulah yang ditetapkan pada Tahap 2.

## Menetapkan Project dan Identitas Peserta

### Tahap 1. Buka project

Dijalankan di: Google Cloud Console

Masuk memakai email yang diberikan koordinator, lalu pilih project kelompok yang sudah disiapkan. Pastikan Project ID yang tampil di bagian atas sudah benar sebelum melanjutkan.

### Tahap 2. Tetapkan identitas peserta

Dijalankan di: Cloud Shell

::: tip Ambil dua nilai ini dari tabel peserta
Sebelum menempel blok di bawah, cari nama atau email Anda pada halaman [Peserta dan Project](/hari-3/deployment-project/peserta-project). Halaman itu memuat **Nama Peserta**, **Project ID**, dan kelompok Anda.

Isi `PROJECT_ID` dan `NAMA_PESERTA` dengan nilai dari tabel itu. Keduanya harus sama persis.
:::

**Gunakan Nama Peserta dari tabel, jangan mengarang sendiri.** Nama itu sudah disusun pendek, 3 sampai 8 karakter, satu kata, dan dipastikan tidak sama dengan peserta lain.

Bila Anda tidak tercantum di tabel dan memilih nama sendiri, panjangnya boleh sampai 12 karakter. Gunakan huruf kecil dan angka saja, tanpa spasi dan tanpa tanda hubung.

Nama Peserta menjadi dasar penamaan seluruh resource Anda: nama VM, nama Service Account, nama trigger, dan subdomain. Karena itu nama yang sudah dipakai peserta lain akan menggagalkan pekerjaan Anda di tengah jalan, dan pada saat itu sebagian resource mungkin sudah terlanjur dibuat.

Tempel blok berikut di Cloud Shell. Ubah hanya dua baris pertama.

```bash
PROJECT_ID="geoportal-kelompok-a-xxxxx"     # dari tabel peserta
NAMA_PESERTA="nama01"                       # dari kolom Nama Peserta

set -euo pipefail

PARTICIPANT_ID="$NAMA_PESERTA"
ZONE="asia-southeast2-b"
REGION="asia-southeast2"
REPOSITORY="katalog-images"
APP_DIR="/opt/webgis/app"
VM_NAME="webgis-${PARTICIPANT_ID}"
STATIC_IP_NAME="webgis-ip-${PARTICIPANT_ID}"
BUILD_SA_NAME="cb-${PARTICIPANT_ID}"
BUILD_SA="${BUILD_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
CONNECTION_NAME="github-${PARTICIPANT_ID}"
LINKED_REPO_NAME="repo-${PARTICIPANT_ID}"
TRIGGER_NAME="deploy-${PARTICIPANT_ID}"
IMAGE_NAME="nextjs-${PARTICIPANT_ID}"
SUBDOMAIN="${PARTICIPANT_ID}.webgisbig.com"
VM_REGION="${ZONE%-*}"

printf '%s' "$PARTICIPANT_ID" | grep -qE '^[a-z0-9]{3,12}$' \
  || { echo "NAMA_PESERTA harus 3 sampai 12 karakter, huruf kecil dan angka saja."; exit 1; }

gcloud config set project "$PROJECT_ID" >/dev/null
echo "Siap. VM_NAME=$VM_NAME  SUBDOMAIN=$SUBDOMAIN"
```

`NAMA_PESERTA` hanya boleh huruf kecil dan angka, 3 sampai 12 karakter. Nama VM, Service Account, dan subdomain menolak karakter di luar itu, dan pesan galatnya menyebut nama resource, bukan nama variabel, sehingga sulit dilacak bila lolos sampai ke perintah `gcloud`.

Batas teknisnya sebenarnya 27 karakter, berasal dari nama Service Account `cb-<nama>` yang dibatasi 30 karakter. Angka 12 diambil jauh di bawah itu supaya nama resource tetap pendek dan mudah dibaca pada daftar, sementara nama seperti `dhanypedia` atau `arkabumihd1` tetap muat.

Baris `gcloud config set project` wajib ada. Banyak perintah pada tahap berikutnya tidak menyebut `--project`, misalnya `gcloud compute instances create` dan `gcloud iam service-accounts create`. Tanpa baris itu, perintah tersebut memakai project yang aktif di Cloud Shell, yang belum tentu project Anda. Resource pun dibuat di project kelompok lain, dan karena perintahnya berhasil, tidak ada pesan galat yang memberitahu. VM baru ditemukan pada tahap berikutnya ketika alamatnya tidak muncul di project yang benar.

Blok ini hanya menetapkan variabel. Aman dijalankan berkali-kali.

#### Periksa nama Anda belum dipakai

```bash
gcloud iam service-accounts describe "$BUILD_SA" --project="$PROJECT_ID" >/dev/null 2>&1 \
  && { echo "BENTROK: '$BUILD_SA_NAME' sudah ada di project $PROJECT_ID."; \
       echo "Lapor ke koordinator dan minta identitas pengganti."; } \
  || echo "Aman. Lanjutkan ke Tahap 3."
```

Bila hasilnya BENTROK, jangan mencari jalan lain. Memakai Service Account milik peserta lain membuat Cloud Build Anda men-deploy ke VM orang itu, dan sebaliknya.

#### Bila Cloud Shell tertutup di tengah jalan

Variabel di atas hanya bertahan selama sesi Cloud Shell terbuka. Cloud Shell menutup sesinya sendiri setelah menganggur sekitar dua puluh menit, sedangkan pelatihan ini berlangsung berjam-jam.

Gejalanya, perintah berhenti dengan **tanda kurung siku kosong**, atau alamat yang kehilangan salah satu bagiannya:

```text
ERROR: (gcloud.compute.instances.describe) could not parse resource []
http:///geoserver/web
```

Itu hampir selalu berarti variabel shell kosong, bukan VM atau project Anda yang bermasalah. Periksa dengan:

```bash
echo "PROJECT_ID=$PROJECT_ID  VM_NAME=$VM_NAME  ZONE=$ZONE"
```

Bila ada yang kosong, jalankan ulang blok Tahap 2.


---

Lanjutkan ke [Menyiapkan Project dan VM](/hari-3/deployment-project/google-cloud-platform).
