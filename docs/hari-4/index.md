# Hari 4 - Deployment Project

Hari keempat memindahkan aplikasi dari laptop ke server yang dapat diakses publik. Seluruh pekerjaannya ada pada Praktik 11, mulai dari menyiapkan konfigurasi dan repositori, membuat Virtual Machine di Google Cloud, menjalankan aplikasi di dalamnya, sampai subdomain dan HTTPS aktif.

Halaman-halaman Praktik 11 adalah satu rangkaian yang dikerjakan berurutan. Berkas yang dibuat pada tahap awal dipakai pada tahap berikutnya, dan konfigurasi Nginx yang dibuat di awal baru berguna setelah sertifikat pada tahap subdomain terbit.

## Susunan Praktik 11

| Tahap | Isi |
|---|---|
| 11.1 sampai 11.4 | Menyiapkan konfigurasi proyek, skema basis data, repositori, dan identitas peserta |
| 11.5 sampai 11.7 | Membuat Virtual Machine, menjalankan aplikasi di dalamnya, dan mengotomatiskan build |
| 11.8 sampai 11.9 | Mengarahkan subdomain, menerbitkan sertifikat, dan menyiapkan GeoServer di VM |

## Praktik 11 - Deployment Project

1. [Peserta dan Project](/hari-4/praktik-11/peserta-project) - memetakan peserta ke project Google Cloud.
2. [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project) - menyiapkan `docker-compose.yml`, `nginx.conf`, `.env.example`, dan pemeriksa konfigurasi di repositori proyek.
3. [Skema Database](/hari-4/praktik-11/skema-database) - berkas SQL yang membuat tabel, lengkap dengan isinya.
4. [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori) - mengirim perubahan ke fork, menyelaraskan fork yang tertinggal, dan menetapkan identitas peserta yang menurunkan nama seluruh resource.
5. [Menyiapkan Project dan VM](/hari-4/praktik-11/google-cloud-platform) - memeriksa API, membuat service account, VM, dan IP statis di Cloud Shell.
6. [Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm) - memasang Docker dan gcloud, meng-clone repositori, mengisi `.env`, lalu membangun dan mendorong image aplikasi.
7. [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build) - menghubungkan repositori GitHub ke Cloud Build, membuat trigger, lalu memverifikasi hasilnya.
8. [Penambahan Subdomain](/hari-4/praktik-11/subdomain) - mengarahkan subdomain ke IP statis VM dan menerbitkan sertifikat Let's Encrypt.
9. [Menyiapkan GeoServer di VM](/hari-4/praktik-11/siapkan-geoserver-vm) - membuat workspace, datastore, dan mengunggah layer dari Geoportal.

## Yang Perlu Disiapkan Peserta

- Akses ke project Google Cloud dari koordinator, beserta identitas peserta untuk `PARTICIPANT_ID`. Datanya ada pada [Peserta dan Project](/hari-4/praktik-11/peserta-project).
- Akun GitHub berisi fork repositori proyek. Berkas `cloudbuild.yaml` dan pemeriksa konfigurasi diambil dari sana.
- Domain dari penyelenggara beserta subdomain yang sudah ditetapkan, dipakai pada [Penambahan Subdomain](/hari-4/praktik-11/subdomain).
- Berkas `.env.example` dari instruktur, dipakai pada [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project).
- Aplikasi dari Hari 3 yang sudah berjalan di laptop, karena yang dipindahkan adalah aplikasi itu.

## Hasil Akhir Hari 4

Geoportal berjalan di alamat `http://IP_EKSTERNAL_VM/portal` setelah tahap aplikasi selesai, lalu berubah menjadi `https://SUBDOMAIN/portal` setelah tahap subdomain dan sertifikat selesai. Pada titik itu aplikasi, basis data, dan GeoServer sudah dapat diakses dari internet.

## Sesi Lain pada Hari 4

Susunan acara pelatihan juga mencantumkan sesi penyempurnaan WebGIS, implementasi data Gaussian Splatting, serta review alur WebGIS dan diskusi. Ketiganya dipandu langsung oleh instruktur. Untuk Gaussian Splatting, bahan pendampingnya sudah tersedia pada halaman [Gaussian Splatting](/hari-4/gaussian-splatting), sedangkan dua sesi lainnya belum punya halaman materi di repositori ini.
