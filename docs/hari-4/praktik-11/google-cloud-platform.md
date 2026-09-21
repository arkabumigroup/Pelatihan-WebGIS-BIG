# Menyiapkan Project dan VM

Dijalankan di Cloud Shell. Identitas peserta dari halaman sebelumnya sudah dipakai di sini, jadi halaman ini mengandaikan blok Tahap 2 sudah pernah dijalankan pada sesi Cloud Shell yang sama.

## Membuat Service Account, VM, dan IP Statis

### Tahap 3. Periksa API yang dibutuhkan

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
gcloud services list --enabled --project="$PROJECT_ID" \
  --filter="config.name:(compute.googleapis.com OR cloudbuild.googleapis.com OR artifactregistry.googleapis.com OR iap.googleapis.com)" \
  --format="table(config.name:label=LAYANAN)"
```

Empat layanan itu adalah yang benar-benar dipakai:

| Layanan | Dipakai untuk |
|---|---|
| `compute.googleapis.com` | VM, alamat IP statis, firewall |
| `cloudbuild.googleapis.com` | Membangun image dari setiap push |
| `artifactregistry.googleapis.com` | Menyimpan image aplikasi |
| `iap.googleapis.com` | Masuk ke VM lewat `--tunnel-through-iap` |

Bila ada yang belum muncul, hentikan tahap ini dan lapor ke koordinator. Peserta tidak punya izin mengaktifkan API pada project kelompok.

::: tip Cloud DNS, Cloud Domains, dan Secret Manager tidak diperlukan
Ketiganya tidak dipakai di mana pun pada pelatihan ini.

- **Cloud DNS** dan **Cloud Domains** tidak dipakai karena subdomain diatur penyelenggara melalui Cloudflare
- **Secret Manager** tidak dipakai karena kata sandi dan token aplikasi disimpan pada berkas `.env` di VM

Bila ketiganya belum aktif, abaikan saja. Tidak ada tahap yang membutuhkannya.
:::

### Tahap 4. Buat Service Account deployment

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Service Account ini milik peserta, sehingga namanya memuat identitas Anda.

```bash
gcloud iam service-accounts create "$BUILD_SA_NAME" \
  --display-name="Cloud Build Deployer"

for ROLE in \
  roles/cloudbuild.builds.builder \
  roles/artifactregistry.writer \
  roles/compute.instanceAdmin.v1 \
  roles/compute.osAdminLogin \
  roles/iap.tunnelResourceAccessor \
  roles/logging.logWriter
do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$BUILD_SA" \
    --role="$ROLE" \
    --condition=None
done
```

### Tahap 5. Periksa Artifact Registry

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell menuju Google Cloud Console</strong></p>

Buka halaman Artifact Registry dan pastikan repository `katalog-images` sudah ada pada region `asia-southeast2`.

Repository ini dibuat koordinator dan dipakai seluruh peserta. Peserta hanya memeriksa, bukan membuat. Bila hasilnya kosong atau `NOT_FOUND`, lapor ke koordinator dan jangan membuat repository sendiri.

### Tahap 6. Siapkan identitas VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

VM peserta memakai Service Account default project. Alamatnya berbentuk `<nomor-project>-compute@developer.gserviceaccount.com`, dan **nilainya sama untuk semua peserta** karena hanya bergantung pada nomor project. Itu memang begitu, dan bukan tanda ada yang salah.

```bash
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" \
  --format='value(projectNumber)')"

VM_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$VM_SA" \
  --role="roles/artifactregistry.reader" \
  --condition=None

gcloud iam service-accounts add-iam-policy-binding "$VM_SA" \
  --member="serviceAccount:$BUILD_SA" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None
```

Rantai izinnya: Service Account Cloud Build peserta mendapat `roles/iam.serviceAccountUser` pada Service Account VM, sehingga trigger boleh melakukan SSH ke VM. Yang membedakan antar peserta bukan Service Account VM, melainkan nama VM dan Service Account Cloud Build-nya.

### Tahap 7. Buat VM

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell menuju Google Cloud Console</strong></p>

VM dibuat dari Cloud Shell dengan spesifikasi berikut. Pastikan Compute Engine API sudah aktif sebelum perintah ini dijalankan.

```bash
gcloud compute instances create "$VM_NAME" \
  --zone="$ZONE" \
  --machine-type="e2-medium" \
  --image-family="ubuntu-2204-lts" \
  --image-project="ubuntu-os-cloud" \
  --boot-disk-size="30GB" \
  --boot-disk-type="pd-balanced" \
  --service-account="$VM_SA" \
  --scopes="https://www.googleapis.com/auth/cloud-platform" \
  --tags="webgis-http,webgis-iap-ssh" \
  --metadata="enable-oslogin=TRUE"
```

Perintah itu menampilkan peringatan yang aman diabaikan:

```text
WARNING: Disk size: '30 GB' is larger than image size: '10 GB'.
```

Ukuran disk tetap dipakai, dan pertumbuhannya diperiksa pada [Tahap 10 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-10-masuk-ke-vm).

### Tahap 8. Periksa VM dan firewall

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

```bash
gcloud compute firewall-rules list \
  --filter="name:(allow-webgis-http OR allow-webgis-iap-ssh)"

gcloud compute instances describe "$VM_NAME" \
  --zone="$ZONE" \
  --format="table(name,status,machineType.basename(),networkInterfaces[0].accessConfigs[0].natIP)"
```

Kedua firewall rule dibuat koordinator dan hasil perintah di atas seharusnya menampilkan keduanya.

**Bila daftar firewall kosong, berhenti dan lapor ke koordinator.** Jangan membuat rule sendiri. Nama yang sama dipakai seluruh peserta project ini, sehingga pembuatan ulang akan gagal dengan `ALREADY_EXISTS`, atau berhasil dan menambah satu rule yang bertabrakan dengan aturan koordinator.

### Tahap 9. Buat IP statis

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Alamat IP perlu dikunci supaya tidak berubah saat VM dimatikan dan dinyalakan kembali. Ini penting karena record DNS pada halaman [Penambahan Subdomain](/hari-4/praktik-11/subdomain) menunjuk ke alamat tersebut.

```bash
EXTERNAL_IP="$(gcloud compute instances describe "$VM_NAME" \
  --zone="$ZONE" \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')"

gcloud compute addresses create "$STATIC_IP_NAME" \
  --region="$VM_REGION" \
  --addresses="$EXTERNAL_IP"

gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" \
  --format="table(name,address,status)"
```

Statusnya harus `IN_USE`, dan alamatnya harus sama dengan IP VM pada Tahap 8. Alamat itulah yang dipakai subdomain Anda nanti, sehingga tidak berubah walaupun VM dimatikan dan dinyalakan kembali.

### Tahap 9b. Laporkan alamat IP dan subdomain ke penyelenggara

<p class="dijalankan dijalankan--cloud">Dijalankan di: <strong>Cloud Shell</strong></p>

Record DNS **ditambahkan oleh penyelenggara**, bukan oleh peserta. Domain `webgisbig.com` dikelola satu akun Cloudflare oleh penyelenggara, dan peserta tidak diberi akses ke sana.

Laporkan sekarang, bukan nanti. Record DNS perlu waktu berpropagasi, dan bila dilaporkan di akhir, DNS baru mulai menyebar setelah Anda selesai mengerjakan seluruh tahap berikutnya. Dilaporkan di sini, propagasinya berjalan sementara Anda mengerjakan Tahap 10 sampai 32.

Yang perlu dilaporkan hanya dua nilai:

| Yang dilaporkan | Contoh | Diambil dari |
|---|---|---|
| Subdomain | `dhanypedia.webgisbig.com` | `$SUBDOMAIN` |
| Alamat IP statis | `34.101.xx.xx` | `$STATIC_IP` |

Cetak keduanya, lalu kirim ke penyelenggara:

```bash
echo "Subdomain : $SUBDOMAIN"
echo "IP statis : $(gcloud compute addresses describe "$STATIC_IP_NAME" \
  --region="$VM_REGION" --project="$PROJECT_ID" --format='value(address)')"
```

## Bila ada yang gagal di halaman ini

**`Quota 'IN_USE_ADDRESSES' exceeded. Limit: 4.0 in region asia-southeast2.`**

Setiap project hanya mendapat empat alamat IP publik eksternal per region, dan angka itu dipakai bersama peserta satu project. Yang menempati kuota bukan hanya IP statis Anda, melainkan juga IP sementara yang menempel pada setiap VM. Bila keempatnya sudah terpakai, VM kelima tidak dapat dibuat.

Periksa berapa yang sudah terpakai, lalu lapor ke koordinator bila sudah ada empat VM atas nama peserta lain:

```bash
gcloud compute instances list --project="$PROJECT_ID" \
  --format="table(name,zone,networkInterfaces[0].accessConfigs[0].natIP)"
```

**`ALREADY_EXISTS`**

Resource yang Anda buat sudah ada, dan biasanya itu memang buatan koordinator. Lihat kembali tabel pembagian resource pada halaman [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori).

**`Failed to lookup instance` saat masuk ke VM**

VM baru selesai dibuat dan belum terdaftar di sistem akses. Tunggu satu menit, lalu ulangi perintahnya.

---

Lanjutkan ke [Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm).
