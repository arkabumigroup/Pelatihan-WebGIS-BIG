# Menyiapkan Project dan VM

Dijalankan di Cloud Shell. Identitas peserta dari halaman sebelumnya sudah dipakai di sini, jadi halaman ini mengandaikan blok Tahap 2 sudah pernah dijalankan pada sesi Cloud Shell yang sama.

## Membuat Service Account, VM, dan IP Statis

### Tahap 3. Periksa API yang dibutuhkan

Dijalankan di: Cloud Shell

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
Ketiganya sempat ikut diperiksa pada versi sebelumnya, padahal tidak dipakai di mana pun pada pelatihan ini.

- **Cloud DNS** dan **Cloud Domains** tidak dipakai karena subdomain diatur penyelenggara melalui Cloudflare
- **Secret Manager** tidak dipakai karena rahasia aplikasi disimpan pada berkas `.env` di VM

Bila ketiganya belum aktif, abaikan saja. Tidak ada tahap yang membutuhkannya.
:::

### Tahap 4. Buat Service Account deployment

Dijalankan di: Cloud Shell

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

![Pencarian Artifact Registry pada kolom pencarian Google Cloud Console](google-cloud-platform/image%2010.png)

![Halaman Artifact Registry beserta tombol Create repository](google-cloud-platform/image%2011.png)

![Form pembuatan repository: nama, format Docker, dan region asia-southeast2](google-cloud-platform/image%2012.png)


Dijalankan di: Cloud Shell menuju Google Cloud Console

Buka halaman Artifact Registry dan pastikan repository `katalog-images` sudah ada pada region `asia-southeast2`.



Repository ini dibuat koordinator dan dipakai seluruh peserta. Peserta hanya memeriksa, bukan membuat. Bila hasilnya kosong atau `NOT_FOUND`, lapor ke koordinator dan jangan membuat repository sendiri.


### Tahap 6. Siapkan identitas VM
![Detail Service Account VM pada halaman VM details](google-cloud-platform/image45.png)

Dijalankan di: Cloud Shell

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

![Form Create an instance, bagian Machine configuration](google-cloud-platform/vm-image-2.png)

![Form Create an instance, bagian Networking dan network tag](google-cloud-platform/vm-image-4.png)


Dijalankan di: Cloud Shell menuju Google Cloud Console

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

### Tahap 8. Periksa VM dan firewall
![Daftar VM instances dengan tombol Create instance dan Connect](google-cloud-platform/cb-image-17.png)

![Daftar VM instances beserta alamat IP eksternalnya](google-cloud-platform/image%2034.png)


Dijalankan di: Cloud Shell

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

Dijalankan di: Cloud Shell

Alamat IP perlu dikunci supaya tidak berubah saat VM dimatikan dan dinyalakan kembali. Ini penting karena record DNS pada halaman [Penambahan Subdomain](/hari-3/deployment-project/subdomain) menunjuk ke alamat tersebut.

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

::: warning Kuota empat IP publik per region
Setiap project hanya mendapat empat alamat IP publik eksternal per region. Angka empat peserta per project bukan pilihan bebas, melainkan batas teknis itu. Karena alasan yang sama, jangan berpindah ke project kelompok lain tanpa sepengetahuan koordinator.
:::


---

Lanjutkan ke [Menyiapkan Aplikasi di VM](/hari-3/deployment-project/aplikasi-di-vm).
