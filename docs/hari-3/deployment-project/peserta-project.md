# Peserta dan Project

Halaman ini memuat pemetaan peserta ke project Google Cloud. Gunakan pencarian di bawah untuk menemukan nama atau email Anda, lalu catat **Project ID** dan **kelompok** Anda.

Data ini dipakai pada [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform) Tahap 1 dan 2.

## Istilah pada tabel

| Istilah | Artinya |
|---|---|
| **Akun master** | Akun Google yang memegang project. Satu akun master menaungi beberapa peserta |
| **Project ID** | Nama project di Google Cloud, dipakai pada perintah `gcloud config set project` |
| **Kelompok** | Pembagian peserta di dalam satu akun master. Tiap kelompok memakai project sendiri |

Setiap akun master memiliki tiga project, yaitu kelompok A, B, dan C. Peserta pada kelompok berbeda memakai project berbeda, sehingga tidak saling mengganggu.

::: tip Project ID berbeda dari nama project
Yang dipakai pada perintah adalah **Project ID**, bukan nama tampilan project. Project ID selalu huruf kecil dan memuat tanda hubung, misalnya `geoportal-kelompok-a-92650`.
:::

## Cari data Anda

<TabelPeserta />

## Bila data Anda tidak ada

Halaman ini dibangkitkan dari rekapitulasi penugasan, jadi peserta yang baru terdaftar setelah rekapitulasi dibuat belum tercantum.

Hubungi koordinator pelatihan bila:

- Nama atau email Anda tidak ditemukan
- Email Anda tertulis salah
- Anda belum mendapat Project ID

## Setelah menemukan Project ID Anda

Simpan nilai berikut, karena keduanya dipakai berulang pada halaman berikutnya.

```text
Nama lengkap   :
Email          :
Akun master    :
Project ID     :
Kelompok       :
```

Langkah berikutnya ada pada halaman [Google Cloud Platform](/hari-3/deployment-project/google-cloud-platform), Tahap 2. Di sana Project ID itu dipakai untuk menetapkan identitas peserta, yang kemudian menurunkan nama VM, nama image, dan subdomain Anda.
