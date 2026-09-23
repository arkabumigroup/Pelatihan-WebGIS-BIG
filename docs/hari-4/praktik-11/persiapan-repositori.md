# Persiapan Repositori dan Identitas

Halaman ini menyiapkan dua hal sebelum menyentuh Google Cloud: repositori yang akan dipakai, dan identitas peserta yang menurunkan nama seluruh resource Anda.

<PilihShell />

## Prasyarat

Halaman ini melanjutkan pekerjaan dari halaman [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). Keempat bagiannya harus sudah selesai, karena halaman ini memindahkan aplikasi yang sudah terbukti berjalan di laptop.

Ringkasnya, empat hal berikut harus sudah benar.

### 1. Repositori sudah di-fork dan di-clone

Fork [github.com/dhanyyudi/personal-geoportal-peserta](https://github.com/dhanyyudi/personal-geoportal-peserta) di akun GitHub Anda, lalu clone fork itu ke laptop. Dikerjakan pada Tahap 1 halaman [Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database).

### 2. Database Supabase sudah siap, dan login sudah terbukti

- Project Supabase sudah dibuat.
- Skrip `sql/01-schema.sql` sampai `sql/03-periksa.sql` sudah dijalankan lewat SQL Editor.
- Akun super admin sudah dibuat lewat `sql/02-seed-super-admin.sql`.
- `node scripts/uji-database.mjs` melaporkan `13 lulus, 0 gagal`.
- Portal sudah berjalan di laptop dengan `npm run dev`, dan Anda berhasil login.

Kelima butir itu dikerjakan pada Tahap 2 halaman [Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database), lalu Tahap 8 sampai 9 halaman [Uji dan Jalankan Portal](/hari-4/praktik-11/uji-dan-jalankan).

### 3. File .env sudah terisi

`.env` di laptop sudah diisi pada [Tahap 5 halaman Isi File .env](/hari-4/praktik-11/isi-env#tahap-5-isi-file-env). Yang perlu Anda siapkan di sini adalah nilai untuk `.env` di VM, yang merupakan file terpisah.

Enam variabel berikut wajib ada. Tanpa salah satunya, login di VM tidak bekerja.

Enam ini baru syarat agar login berjalan. Pemeriksa pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env) juga memeriksa lima variabel GeoServer dan PostGIS, dan kelimanya baru diisi di sana karena datastore-nya belum ada sebelum GeoServer berjalan. Jadi wajar bila baru sebagian yang terisi sekarang.

| Variabel | Isi |
|---|---|
| `DATABASE_URL` | Connection string Supabase, sama seperti di laptop |
| `JWT_SECRET` | Hasil perintah acak, boleh sama dengan di laptop |
| `NEXTAUTH_SECRET` | Hasil perintah acak, boleh sama dengan di laptop |
| `NEXTAUTH_URL` | Untuk VM: `http://IP_EKSTERNAL_VM/portal` |
| `ADMIN_CONTACT_EMAIL` | Email Anda sendiri |
| `JWT_EXPIRES_IN` | `1h`, sudah terisi di `.env.example` |

Tiga nilai yang berbeda antara laptop dan VM adalah `NEXTAUTH_URL`, `BASE_URL`, dan `NEXT_PUBLIC_URL_BASE_PATH`, karena ketiganya memuat alamat aplikasi. Nilainya diisi pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env).

File `.env` di laptop tidak ikut ter-commit, dan tidak ikut tersalin ke VM. File di VM dibuat langsung di sana.

### 4. Akses Google Cloud dari koordinator

- Akses ke Google Cloud project, dengan Project ID berbentuk `geoportal-kelompok-a-xxxxx`.
- Email peserta yang sudah terdaftar di project tersebut. Email ini dipakai menurunkan identitas peserta.

## Repositori yang Dipakai

Deployment Project bekerja pada fork repositori peserta di akun GitHub Anda sendiri.

| | Repositori |
|---|---|
| Sumber, yang di-fork | [github.com/dhanyyudi/personal-geoportal-peserta](https://github.com/dhanyyudi/personal-geoportal-peserta) |
| Fork Anda | `https://github.com/<username-anda>/personal-geoportal-peserta` |

Fork dan clone repositori itu dikerjakan pada halaman [Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database), Tahap 1. Pastikan tahap itu sudah selesai sebelum melanjutkan.

### Mengirim perubahan

Cloud Build membangun dari **fork Anda di GitHub**, bukan dari laptop. Jadi setiap perubahan harus dikirim lebih dahulu.

Di GitHub Desktop: tulis ringkasan perubahan di kotak kiri bawah, klik **Commit to main**, lalu klik **Push origin**.

### Menyelaraskan fork bila sumber diperbarui

Repositori sumber dapat diperbarui selama pelatihan, misalnya karena ada perbaikan. Fork Anda **tidak ikut berubah dengan sendirinya.**

Di GitHub Desktop: klik **Fetch origin**. Bila muncul tombol **Pull origin** dengan angka, klik tombol itu. Angka itu jumlah perubahan yang belum masuk ke fork Anda.

Bila muncul konflik, artinya Anda dan sumber mengubah file yang sama. Cara tercepat ada di bagian bawah halaman ini.

### Perubahan belum sampai ke VM

Fork yang sudah diperbarui **belum mengubah apa pun di VM Anda.** VM memakai salinannya sendiri di `/opt/webgis/app`, yang di-clone dari fork pada [Tahap 16 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-16-clone-repositori), dan salinan itu tidak ikut berubah sendiri.

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

Artinya image aplikasi diperbarui, tetapi **file konfigurasi di VM tidak.** Bila `docker-compose.yml` atau `nginx.conf` berubah di repositori, perubahan itu harus ditarik sendiri dengan `git pull` di atas.
:::

::: tip Bila ragu, fork ulang saja
Cara paling sederhana dan paling kecil risikonya. Salin `.env` ke luar folder lebih dahulu, karena file itu berisi kredensial Anda dan tidak boleh hilang:

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

Nilai unik itu **tidak ada di file repositori Anda**. Seluruhnya diatur pada trigger Cloud Build sebagai substitution variable, sehingga tidak ada file yang perlu diedit di laptop.

| Nilai | Unik per peserta? | Diatur di mana |
|---|---|---|
| `_VM_NAME` | Ya | Substitution variable pada trigger, [Tahap 28 halaman Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build#tahap-28-isi-substitution-variable) |
| `_IMAGE_NAME` | Ya | Substitution variable pada trigger, [Tahap 28 halaman Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build#tahap-28-isi-substitution-variable) |
| `_VM_ZONE` | Tidak, sama untuk semua | Substitution variable pada trigger, [Tahap 28 halaman Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build#tahap-28-isi-substitution-variable) |
| `_VM_APP_DIR` | Tidak, sama untuk semua | Substitution variable pada trigger, [Tahap 28 halaman Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build#tahap-28-isi-substitution-variable) |
| `_CESIUM_ION_TOKEN` | Ya, token Anda sendiri | Substitution variable pada trigger, [Tahap 28 halaman Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build#tahap-28-isi-substitution-variable) |
| Nama Project ID | Tidak, milik kelompok | Dari koordinator |
| `katalog-images` | Tidak, milik kelompok | Dibuat koordinator, peserta hanya memakai |
| `nextjs_portal`, `geoserver_app`, `nginx_proxy` | Tidak | Nama container di dalam VM Anda sendiri. Tidak bertabrakan dengan peserta lain karena VM-nya terpisah |
| Alamat `geoserver` dan `nextjs` pada `nginx.conf` | Tidak | Nama service di dalam jaringan Docker VM Anda sendiri |

Baris terakhir sering menimbulkan kekhawatiran. Nama container dan nama service memang sama untuk semua peserta, tetapi itu tidak menjadi masalah karena setiap peserta memakai VM sendiri. Yang perlu diperhatikan hanya resource yang berada di project bersama, dan itulah isi tabel di bawah.

## Pembagian Resource

Tabel ini perlu dibaca sebelum Tahap 2. Sebagian resource dibuat koordinator dan dipakai bersama, sebagian lagi dibuat peserta dan harus berbeda antar peserta.

| Resource | Dibuat oleh | Nama | Bila Anda membuatnya sendiri |
|---|---|---|---|
| Project kelompok | Koordinator | `geoportal-kelompok-a-xxxxx` | Tidak punya izin, dan tidak perlu |
| Artifact Registry | Koordinator | `katalog-images` | Gagal dengan `ALREADY_EXISTS` |
| Firewall rule port 80 dan 443 | Koordinator | `allow-webgis-http` | Gagal dengan `ALREADY_EXISTS` |
| Firewall rule SSH lewat IAP | Koordinator | `allow-webgis-iap-ssh` | Gagal dengan `ALREADY_EXISTS` |
| Network tag | Koordinator | `webgis-http`, `webgis-iap-ssh` | Gagal dengan `ALREADY_EXISTS` |
| VM, IP statis, Service Account Cloud Build, trigger, GitHub connection, image | Peserta | Mengandung identitas peserta | Dapat menimpa resource peserta lain bila namanya tidak unik atau sama |

Nama pada baris terakhir diturunkan seluruhnya dari satu nilai, yaitu identitas peserta. Nilai itulah yang ditetapkan pada Tahap 2.

## Menetapkan Project dan Identitas Peserta

### Tahap 1. Buka project

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

Masuk memakai email yang diberikan koordinator, lalu pilih project kelompok yang sudah disiapkan. Pastikan Project ID yang tampil di bagian atas sudah benar sebelum melanjutkan.

### Tahap 2. Tetapkan identitas peserta

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

::: tip Ambil dua nilai ini dari tabel peserta
Sebelum menempel blok di bawah, cari nama atau email Anda pada halaman [Peserta dan Project](/hari-4/praktik-11/peserta-project). Halaman itu memuat **Nama Peserta**, **Project ID**, dan kelompok Anda.

Isi `PROJECT_ID` dan `NAMA_PESERTA` dengan nilai dari tabel itu. Keduanya harus sama persis.
:::

::: tip Blok ini tidak perlu diketik kembali
[Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas) menyusun blok di bawah lengkap dengan nilai Anda, lalu menyimpannya di browser. Setelah itu nilai yang sama dapat disalin lagi kapan saja, termasuk ketika Cloud Shell menutup sesinya di tengah pekerjaan.

Blok di halaman ini tetap ditampilkan, karena isinya yang menjelaskan dari mana setiap nama resource berasal.
:::

**Pakai Nama Peserta dari tabel.** Nama itu sudah disusun pendek, satu kata, paling banyak 12 karakter, dan dipastikan belum dipakai peserta lain di kedua batch. Sebagian besar panjangnya 4 sampai 10 karakter.

Kalau Anda tidak menghendaki nama yang disarankan itu, Anda boleh membuat nama sendiri. Syaratnya sama: huruf kecil dan angka saja, tanpa spasi dan tanpa tanda hubung, paling banyak 12 karakter, dan belum dipakai peserta lain.

Nama Peserta menjadi dasar penamaan seluruh resource Anda: nama VM, nama Service Account, nama trigger, dan subdomain. Karena itu nama yang sudah dipakai peserta lain akan menggagalkan pekerjaan Anda di tengah jalan, dan pada saat itu sebagian resource mungkin sudah terlanjur dibuat.

Tempel blok berikut di Cloud Shell. Ubah hanya dua baris pertama.

::: tip Blok ini dijalankan di bash, bukan di PowerShell
Blok ini hampir seluruhnya sintaksis bash, dan hanya satu barisnya perintah `gcloud`. Karena itu yang menentukan bukan gcloud CLI-nya, melainkan shell tempat blok itu ditempel.

| Tempat | Dapat ditempel apa adanya |
|---|---|
| Cloud Shell | Ya, sudah bash |
| Terminal laptop, macOS atau Linux | Ya |
| Windows, WSL atau Git Bash | Ya |
| Windows, PowerShell atau Command Prompt | **Tidak** |

Di PowerShell, `NAMA_PESERTA="nama01"` bukan penetapan variabel melainkan kesalahan sintaksis, dan `${ZONE%-*}` tidak dikenal.

**Dua hal yang berlaku di laptop, tidak di Cloud Shell.** Baris `gcloud config set project` mengubah project aktif untuk seluruh sesi terminal itu, sehingga tab terminal lain yang sudah terbuka ikut terpengaruh. Dan `set -euo pipefail` berlaku sampai terminalnya ditutup: menyebut variabel yang belum diisi akan menghentikan sesi, dan pemulihannya dengan membuka terminal baru.
:::

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

gcloud config set project "$PROJECT_ID" >/dev/null
echo "Siap. VM_NAME=$VM_NAME  SUBDOMAIN=$SUBDOMAIN"
```

`NAMA_PESERTA` hanya boleh huruf kecil dan angka, 3 sampai 12 karakter. Nama VM, Service Account, dan subdomain menolak karakter di luar itu, dan pesan errornya menyebut nama resource, bukan nama variabel, sehingga sulit dilacak bila lolos sampai ke perintah `gcloud`.

Batas teknisnya 27 karakter, berasal dari nama Service Account `cb-<nama>` yang dibatasi 30 karakter. Angka 12 diambil jauh di bawah itu supaya nama resource tetap pendek pada daftar.

Baris `gcloud config set project` wajib ada. Banyak perintah pada tahap berikutnya tidak menyebut `--project`, misalnya `gcloud compute instances create` dan `gcloud iam service-accounts create`. Tanpa baris itu, perintah tersebut memakai project yang aktif di Cloud Shell, yang belum tentu project Anda. Resource pun dibuat di project kelompok lain, dan karena perintahnya berhasil, tidak ada pesan error yang memberitahu. VM baru ditemukan pada tahap berikutnya ketika alamatnya tidak muncul di project yang benar.

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

Errornya, perintah berhenti dengan **tanda kurung siku kosong**, atau alamat yang kehilangan salah satu bagiannya:

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

Lanjutkan ke [Menyiapkan Project dan VM](/hari-4/praktik-11/google-cloud-platform).
