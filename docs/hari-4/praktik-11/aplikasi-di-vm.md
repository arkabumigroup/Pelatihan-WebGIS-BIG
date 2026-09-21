# Menyiapkan Aplikasi di VM

Seluruh tahap di halaman ini dijalankan di dalam VM, bukan di Cloud Shell.

## Memasang Perkakas dan Menyiapkan Aplikasi

### Tahap 10. Masuk ke VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell menuju VM</strong></p>

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

::: tip Bila langsung gagal dengan "Failed to lookup instance"
VM yang baru dibuat butuh sekitar satu menit sebelum dapat dijangkau IAP. Bila perintah di atas gagal dengan pesan berikut, tunggu sebentar lalu jalankan lagi. Tidak ada yang perlu diperbaiki.

```text
ConnectionCreationError: Error while connecting [4047: 'Failed to lookup instance'].
```

Perintah itu juga menawarkan `--troubleshoot`. Opsi itu tidak diperlukan untuk sebab ini.
:::

Setelah perintah ini berhasil, terminal yang Anda gunakan adalah terminal VM, bukan Cloud Shell. Seluruh tahap berikutnya di halaman ini dijalankan di sana.

#### Periksa ukuran partisi disk

VM dibuat dengan disk 30 GB, sedangkan image Ubuntu yang dipakai berukuran sekitar 10 GB. Saat pembuatan, Google Cloud menampilkan peringatan seperti ini:

```text
WARNING: Disk size: '30 GB' is larger than image size: '10 GB'.
You might need to resize the root repartition
```

Biasanya partisinya sudah tumbuh sendiri saat boot pertama. Perlu dipastikan, bukan diasumsikan, karena Docker akan kehabisan ruang bila partisinya masih 10 GB.

Jalankan di dalam VM:

```bash
df -h /
```

Yang diharapkan, kolom `Size` menunjukkan sekitar **29G**:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        29G  1.8G   27G   7% /
```

Bila masih menunjukkan sekitar **9.7G**, partisinya belum ikut memakai sisa disk. Perluas partisi beserta sistem berkasnya:

```bash
sudo growpart /dev/sda 1
sudo resize2fs /dev/sda1
df -h /
```

Perintah pertama memperbesar partisinya, yang kedua memperbesar sistem berkasnya agar memakai seluruh partisi. Keduanya hanya mengubah ukuran dan tidak menghapus data. Setelah itu `df -h /` harus menunjukkan sekitar 29G.

### Tahap 11. Pasang Docker, Git, dan Google Cloud CLI

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git gnupg

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] \
https://packages.cloud.google.com/apt cloud-sdk main" | \
sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list > /dev/null

sudo apt-get update
sudo apt-get install -y google-cloud-cli
```

### Tahap 12. Uji Docker dan gcloud

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

```bash
sudo docker compose version
sudo docker run --rm hello-world
gcloud --version
```

`sudo` masih diperlukan di sini, karena akun Anda belum menjadi anggota grup `docker`. Tahap berikutnya yang menambahkannya, dan sejak itu `sudo` tidak diperlukan lagi.

Hasil yang diharapkan, ketiganya berhasil tanpa galat.

### Tahap 13. Tambahkan user ke grup docker

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

```bash
sudo usermod -aG docker "$USER"
exit
```

Perintah `exit` menutup sesi SSH dan mengembalikan terminal ke Cloud Shell. Ini perlu dilakukan supaya keanggotaan grup docker berlaku pada sesi berikutnya.

::: tip Sejak tahap berikutnya, perintah docker TANPA sudo
Tahap 12 sampai 13 masih memakai `sudo docker`, karena akun Anda belum masuk grup `docker`.

Setelah masuk kembali pada Tahap 14, seluruh perintah docker pada tahap berikutnya **tidak lagi memakai `sudo`**. Yang paling penting, Tahap 21 akan gagal bila memakai `sudo`, karena kredensial Artifact Registry tersimpan pada konfigurasi Docker milik akun Anda, bukan milik root.
:::

### Tahap 14. Masuk kembali ke VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell menuju VM</strong></p>

```bash
gcloud compute ssh "$VM_NAME" \
  --zone="$ZONE" \
  --tunnel-through-iap
```

### Tahap 15. Siapkan folder aplikasi

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Folder ini perlu dibuat lebih dahulu karena folder induknya, `/opt`, dimiliki root. `git clone` pada tahap berikutnya menulis ke `/opt/webgis/app`, dan perintah itu tidak dapat membuat folder induknya sendiri.

```bash
sudo mkdir -p /opt/webgis
sudo chown "$USER:$USER" /opt/webgis
ls -ld /opt/webgis
```

Keluaran `ls -ld` harus menampilkan nama pengguna Anda sebagai pemiliknya.

### Tahap 16. Clone repositori

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Perintah ini membawa seluruh berkas repositori, termasuk `docker-compose.yml`, `nginx.conf`, dan `.env.example`, sehingga tidak ada yang perlu disalin terpisah dari laptop.

Ganti `USERNAME_GITHUB_PESERTA` dengan username GitHub Anda.

```bash
GITHUB_USERNAME="USERNAME_GITHUB_PESERTA"
GITHUB_REPOSITORY="https://github.com/${GITHUB_USERNAME}/personal-geoportal-peserta.git"

git clone "$GITHUB_REPOSITORY" /opt/webgis/app
cd /opt/webgis/app
cp .env.example .env
```

Bila fork Anda memakai nama bawaan `personal-geoportal`, ganti nilai `GITHUB_REPOSITORY` menjadi `https://github.com/${GITHUB_USERNAME}/personal-geoportal.git`.

Bila GitHub meminta kata sandi, isi dengan Personal Access Token, bukan kata sandi akun.

### Tahap 17. Periksa berkas konfigurasi

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Pastikan ketiga berkas yang dibutuhkan sudah ada. Semuanya berasal dari clone pada tahap sebelumnya, bukan dari salinan terpisah.

```bash
cd /opt/webgis/app
ls -la docker-compose.yml nginx.conf .env.example
```

Keluaran yang diharapkan, ketiganya berukuran lebih dari nol:

```text
-rw-rw-r-- 1 dhanypedia_gmail_com dhanypedia_gmail_com  9876 .env.example
-rw-rw-r-- 1 dhanypedia_gmail_com dhanypedia_gmail_com  1600 docker-compose.yml
-rw-rw-r-- 1 dhanypedia_gmail_com dhanypedia_gmail_com  3000 nginx.conf
```

Lalu periksa bahwa repositori ini tertaut ke fork Anda, dan isinya sudah terbaru:

```bash
git remote -v
git log --oneline -1
```

`git remote -v` harus menampilkan alamat fork Anda, bukan alamat repositori sumber.

### Tahap 18. Isi berkas .env

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Berkas `.env` di laptop sudah terisi lengkap. Mengisinya ulang dari nol di VM hanya membuang waktu, karena hanya **lima baris** yang berbeda. Cara ini tidak memerlukan gcloud CLI di laptop.

**1.** Di terminal VM, siapkan penerimanya:

```bash
cd /opt/webgis/app
cat > .env << 'ENVEOF'
```

Perintah itu menunggu masukan. Kursor turun ke baris baru tanpa menampilkan apa pun.

**2.** Buka `.env` di laptop, pilih seluruh isinya, lalu tempel ke terminal VM.

**3.** Ketik penutupnya pada baris tersendiri, lalu tekan Enter:

```text
ENVEOF
```

Tanda kutip pada `'ENVEOF'` wajib. Tanpa kutip, shell menerjemahkan isi berkas, sehingga karakter seperti `$` berubah sebelum tersimpan.

**4.** Ubah kelima baris yang berbeda. Ganti `IP_EKSTERNAL_VM` dengan alamat dari Tahap 9:

```bash
IP="IP_EKSTERNAL_VM"

sed -i \
  -e "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=http://$IP/portal|" \
  -e "s|^BASE_URL=.*|BASE_URL=http://$IP/portal|" \
  -e "s|^NEXT_PUBLIC_URL_BASE_PATH=.*|NEXT_PUBLIC_URL_BASE_PATH=http://$IP/portal|" \
  -e "s|^GEOSERVER_PUBLIC_URL=.*|GEOSERVER_PUBLIC_URL=http://$IP/geoserver|" \
  -e "s|^GEOSERVER_POSTGIS_DATASTORE=.*|GEOSERVER_POSTGIS_DATASTORE=postgis_geoportal|" \
  .env

grep -E '^(NEXTAUTH_URL|BASE_URL|NEXT_PUBLIC_URL_BASE_PATH|GEOSERVER_PUBLIC_URL|GEOSERVER_POSTGIS_DATASTORE)=' .env
```

Kelima baris terakhir harus menampilkan alamat IP VM, bukan `localhost`.

**5.** Periksa tidak ada nilai yang kosong:

```bash
for v in DATABASE_URL JWT_SECRET NEXTAUTH_SECRET ADMIN_CONTACT_EMAIL \
         GEOSERVER_ADMIN_PASSWORD GEOSERVER_PASSWORD POSTGIS_HOST \
         POSTGIS_USER POSTGIS_PASSWORD GEOSERVER_PUBLIC_URL GEOSERVER_POSTGIS_DATASTORE; do
  grep -qE "^$v=." .env || echo "MASIH KOSONG: $v"
done
```

Tidak ada keluaran berarti semuanya sudah terisi. Bila ada nama yang muncul, isi dulu sebelum lanjut.

::: tip Bila penempelan terlalu panjang
Unggah berkas `.env` ke Cloud Shell lewat tombol **Upload** di kanan atas, lalu kirim ke VM:

```bash
gcloud compute scp .env "$VM_NAME:/opt/webgis/app/.env" --zone="$ZONE" --tunnel-through-iap
```

Untuk memeriksa nilai satu per satu setelahnya, buka `nano /opt/webgis/app/.env`.
:::

#### Alamat yang berubah di VM

Empat nilai berikut berbeda dari yang di laptop, karena alamat aplikasi dan alamat GeoServer sudah berganti.

| Variabel | Nilai |
|---|---|
| `NEXTAUTH_URL` | `http://IP_EKSTERNAL_VM/portal`, tanpa slash di akhir |
| `BASE_URL` | `http://IP_EKSTERNAL_VM/portal` |
| `NEXT_PUBLIC_URL_BASE_PATH` | `http://IP_EKSTERNAL_VM/portal` |
| `GEOSERVER_PUBLIC_URL` | `http://IP_EKSTERNAL_VM/geoserver`, tanpa slash di akhir |

Slash di akhir membuat alamat tidak cocok dengan `basePath` pada `next.config.mjs`, dan gejalanya login berhasil di API tetapi gagal di browser.

`GEOSERVER_PUBLIC_URL` adalah alamat GeoServer yang dapat dijangkau dari browser Anda. Nilai itu disimpan ke kolom `wms_url` dan `wfs_url` pada katalog, dan dipakai Anda untuk membuka layer di QGIS atau aplikasi lain. Nginx sudah mem-proxy `/geoserver/`, sehingga port 8080 tidak perlu dibuka.

`GEOSERVER_URL` **tidak diubah**, tetap `http://geoserver:8080/geoserver`, karena variabel itu dipakai aplikasi untuk memanggil GeoServer dari dalam jaringan Docker.

Empat nilai yang sudah Anda siapkan di laptop dipakai apa adanya: `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`, dan `ADMIN_CONTACT_EMAIL`.

#### Kata sandi untuk GeoServer

Bila `.env` disalin dari laptop, `GEOSERVER_ADMIN_PASSWORD` dan `GEOSERVER_PASSWORD` sudah terisi dan sudah sama. Periksa lebih dahulu:

```bash
grep -E '^(GEOSERVER_ADMIN_PASSWORD|GEOSERVER_PASSWORD)=' .env
```

Bila keduanya masih kosong, buat kata sandi baru:

```bash
GEOSERVER_PASSWORD="$(openssl rand -hex 16)"
echo "$GEOSERVER_PASSWORD"
```

Hasilnya 32 karakter heksadesimal, misalnya `950fde2bdd9c36f81316a2e416117195`. Isi kedua baris dengan nilai yang sama.

Keduanya harus sama, karena satu dipakai container GeoServer untuk membuat akun admin, dan satu lagi dipakai aplikasi untuk login ke REST API GeoServer. Bila berbeda, unggahan layer gagal dengan pesan kosong.

::: warning Jangan memakai node untuk perintah ini
`node` tidak dipasang di VM. Tahap 11 hanya memasang Docker, Git, dan Google Cloud CLI, sehingga perintah itu berhenti dengan `Command 'node' not found`. `openssl` sudah tersedia di Ubuntu dan keluarannya sama bentuknya.
:::

#### Nilai yang dibiarkan apa adanya

`NEXTJS_IMAGE` dibiarkan `nginx:1.27-alpine`. Cloud Build mengisinya otomatis pada deploy pertama.

Saat login ke antarmuka GeoServer nanti, gunakan username `admin` dan kata sandi hasil `GEOSERVER_PASSWORD`.

### Tahap 19. Bangun image aplikasi

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Sebelum Cloud Build dipakai, image dibangun sekali secara manual supaya masalah pada `Dockerfile` ketahuan lebih awal di terminal yang bisa dibaca langsung.

#### Setel tiga variabel lebih dahulu

Blok Tahap 2 dijalankan di **Cloud Shell**, sehingga `PROJECT_ID`, `REPOSITORY`, dan `IMAGE_NAME` tidak ikut terbawa ke VM. Di sini ketiganya masih kosong, dan perintah `docker build` akan menghasilkan nama image yang rusak:

```text
asia-southeast2-docker.pkg.dev////:latest
```

Isi ketiganya dengan nilai yang sama seperti pada [blok identitas peserta](/hari-4/praktik-11/persiapan-repositori#tahap-2-tetapkan-identitas-peserta). Hanya dua baris pertama yang Anda ubah, dan `IMAGE_NAME` diturunkan dari `NAMA_PESERTA` supaya tidak bisa berbeda:

```bash
PROJECT_ID="geoportal-kelompok-a-xxxxx"     # dari tabel peserta
NAMA_PESERTA="nama01"                       # dari kolom Nama Peserta
REPOSITORY="katalog-images"                 # sama untuk semua peserta
IMAGE_NAME="nextjs-${NAMA_PESERTA}"
```

Periksa ketiganya sudah terisi sebelum melanjutkan:

```bash
for v in PROJECT_ID REPOSITORY IMAGE_NAME; do printf '%-12s %s\n' "$v" "${!v}"; done
```

Harus menampilkan tiga nilai, bukan baris kosong.

#### Bangun image

```bash
cd /opt/webgis/app
docker build -t "asia-southeast2-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:latest" .
```

Prosesnya lama, karena mengunduh image dasar Node dan memasang dependensi. Bagian akhir keluarannya menyebut nama image yang baru dibuat.

### Tahap 20. Beri izin Artifact Registry pada Service Account VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Google Cloud Console</strong></p>

::: tip Pada sebagian besar project, tahap ini tidak diperlukan
Service Account default Compute Engine biasanya sudah memegang `roles/editor`,
dan peran itu sudah memuat seluruh izin yang dibutuhkan tahap berikutnya.

Diperiksa pada `roles/editor`:

| Izin yang dibutuhkan | Ada di `roles/editor`? |
|---|---|
| `artifactregistry.repositories.uploadArtifacts` | ya |
| `artifactregistry.dockerimages.get` | ya |
| `artifactregistry.dockerimages.list` | ya |
| `artifactregistry.repositories.downloadArtifacts` | ya |
| Seluruh isi `roles/logging.logWriter` | ya |

`roles/artifactregistry.admin` hanya menambah tiga izin yang tidak dipakai untuk
push image: `createTagBinding`, `deleteTagBinding`, dan `setIamPolicy`.

**Cara mengetahui apakah tahap ini perlu:** lanjutkan saja ke Tahap 21. Bila
image berhasil di-push, tahap ini boleh dilewati. Bila gagal dengan pesan
`Permission "artifactregistry.repositories.uploadArtifacts" denied`, kembali ke
sini dan kerjakan.
:::

VM perlu izin menulis image ke Artifact Registry. Buka IAM & Admin, lalu IAM, lalu Grant Access, dan tambahkan Service Account VM sebagai principal dengan dua role berikut.

| Role | Kegunaan |
|---|---|
| Artifact Registry Administrator | Push image ke repository |
| Logs Writer | Menulis log dari VM |

Gunakan alamat `VM_SA` yang tercetak pada Tahap 6.

#### Lewat Cloud Shell

Cara yang sama dapat dikerjakan lewat perintah, dan lebih cepat daripada
menelusuri Console:

```bash
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$VM_SA" \
  --role="roles/artifactregistry.admin" \
  --condition=None

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$VM_SA" \
  --role="roles/logging.logWriter" \
  --condition=None
```

::: warning Perintah ini JANGAN dijalankan di terminal VM
Di dalam VM, `gcloud` terautentikasi sebagai Service Account VM, dan akun itu
tidak berwenang mengubah kebijakan IAM. Perintahnya akan gagal dengan:

```text
does not have permission to access projects instance [...:setIamPolicy]
Policy update access denied.
This command is authenticated as <nomor-project>-compute@developer.gserviceaccount.com
```

Perhatikan bagian terakhir pesan itu. Isinya menyebut akun yang sedang dipakai,
dan itu cara tercepat mengenali kesalahan ini. Perintah IAM selalu dijalankan
di Cloud Shell, sebagai Anda.
:::

### Tahap 21. Push image ke Artifact Registry

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Bila Anda membuka sesi SSH baru sejak Tahap 19, setel ulang ketiga variabel itu. Variabel shell tidak bertahan antar sesi:

```bash
PROJECT_ID="geoportal-kelompok-a-xxxxx"
REPOSITORY="katalog-images"
IMAGE_NAME="nextjs-nama01"
```

Lalu push image-nya:

```bash
gcloud auth configure-docker asia-southeast2-docker.pkg.dev --quiet
docker push "asia-southeast2-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:latest"
```

::: warning Perintah docker di sini TANPA sudo
Sejak Tahap 13, akun Anda sudah menjadi anggota grup `docker`, sehingga `sudo`
tidak diperlukan lagi.

Memakai `sudo` justru **menggagalkan** perintah ini. `gcloud auth
configure-docker` menulis kredensial ke konfigurasi Docker milik **akun Anda**,
sedangkan `sudo docker push` berjalan sebagai **root** dan membaca konfigurasi
milik root, yang kosong. Gejalanya:

```text
error from registry: Unauthenticated request. Unauthenticated requests do not
have permission "artifactregistry.repositories.uploadArtifacts" ...
```

Kata **Unauthenticated** itu petunjuknya. Kredensialnya tidak terkirim sama
sekali, bukan ditolak karena kurang izin. Bila masalahnya izin, pesannya akan
berbunyi `Permission denied`.

Bila ragu apakah Anda sudah masuk grup docker, periksa:

```bash
groups | grep -o docker
```

Bila tidak ada keluarannya, jalankan Tahap 13 dan 14 lebih dahulu.
:::

Setelah selesai, image itu muncul pada halaman Artifact Registry. Halaman `katalog-images` yang sebelumnya kosong sekarang memuat satu baris.

### Tahap 22. Jalankan GeoServer dan Nginx

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

Jalankan kedua container itu lebih dahulu, tanpa `nextjs`, memakai `--no-deps`. Image `nextjs` belum dibangun pada tahap ini, dan tanpa `--no-deps` compose akan mencoba menariknya.

```bash
cd /opt/webgis/app
docker compose up -d --no-deps geoserver nginx
docker compose ps
```

Kedua barisnya harus berstatus `Up`. GeoServer tetap menampilkan `Up` sejak awal, tetapi **layanannya baru siap sekitar satu menit kemudian**, karena proses Java di dalamnya masih memuat. Pada menit pertama, alamat `/geoserver/web` belum menjawab. Itu wajar dan bukan tanda gagal.

### Tahap 23. Keluar dari VM

<p class="dijalankan dijalankan--server">Dijalankan di: <strong>Terminal VM</strong></p>

```bash
exit
```

---

Lanjutkan ke [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build).
