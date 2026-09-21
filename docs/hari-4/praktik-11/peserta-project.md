# Peserta dan Project

Halaman ini memuat pemetaan peserta ke project Google Cloud. Gunakan pencarian di bawah untuk menemukan nama atau email Anda, lalu catat **Nama Peserta**, **Project ID**, dan **kelompok** Anda.

Data ini dipakai pada [Persiapan Repositori dan Identitas](/hari-4/praktik-11/persiapan-repositori) Tahap 1 dan 2.

## Istilah pada tabel

| Istilah | Artinya |
|---|---|
| **Akun master** | Akun Google yang memegang project. Satu akun master menaungi beberapa peserta |
| **Project ID** | Nama project di Google Cloud, dipakai pada perintah `gcloud config set project` |
| **Nama Peserta** | Nama pendek Anda, dipakai sebagai identitas di Google Cloud. Panjangnya 3 sampai 8 karakter, satu kata, dan sudah dipastikan tidak sama dengan peserta lain |
| **Kelompok** | Pembagian peserta di dalam satu akun master. Tiap kelompok memakai project sendiri |

Setiap akun master memiliki tiga project, yaitu kelompok A, B, dan C. Peserta pada kelompok berbeda memakai project berbeda, sehingga tidak saling mengganggu.

::: tip Project ID berbeda dari nama project
Yang dipakai pada perintah adalah **Project ID**, bukan nama tampilan project. Project ID selalu huruf kecil dan memuat tanda hubung, misalnya `geoportal-kelompok-a-92650`.
:::

::: tip Nama Peserta bukan nama lengkap Anda
Kolom **Nama Peserta** berisi nama pendek huruf kecil tanpa spasi, misalnya `amelliak` atau `dhany`. Nilai itu yang dimasukkan ke variabel `NAMA_PESERTA` pada Tahap 2.

Nama lengkap tidak dipakai di Google Cloud, karena nama VM, Service Account, dan subdomain menolak spasi serta huruf besar.

Gunakan nilai dari tabel, **jangan mengarang sendiri.** Nama Peserta sudah disusun agar tidak ada dua peserta yang memakai nama sama. Bila Anda memilih nama lain, ada kemungkinan nama itu sudah dipakai peserta lain, dan pekerjaan Anda berhenti di tengah jalan.
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
Nama Peserta   :
Email          :
Akun master    :
Project ID     :
Kelompok       :
```

Langkah berikutnya ada pada halaman [Persiapan Repositori dan Identitas](/hari-4/praktik-11/persiapan-repositori), Tahap 2. Di sana Nama Peserta dan Project ID dipakai untuk menetapkan identitas Anda, yang kemudian menurunkan nama VM, nama Service Account, dan subdomain Anda.
