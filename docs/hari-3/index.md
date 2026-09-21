# Hari 3 - Backend dan Autentikasi

Hari ketiga menyambungkan aplikasi Next.js ke basis data dan mengamankan aksesnya. Praktik 8 menyiapkan basis data cloud lalu menghubungkannya lewat Prisma ORM dan membuat API login. Praktik 9 menjelaskan cara kerja API serta membuat CRUD pengguna. Praktik 10 menambahkan autentikasi NextAuth beserta pemeriksaan hak akses.

## Jadwal Hari 3

| Waktu | Kegiatan | Materi |
|---|---|---|
| 08.00 - 10.00 | Membuat koneksi basis data dengan ORM, membuat CRUD API | [Praktik 8](#praktik-8---database-cloud-dan-prisma-orm) dan [Praktik 9](#praktik-9---api-dan-backend) |
| 10.15 - 12.00 | Penjelasan NextAuth, session, hashing, enkripsi. Membuat session, logika hak akses, konfigurasi middleware | [Praktik 10](#praktik-10---autentikasi-nextauth) |

Pekerjaan deployment yang sebelumnya menempati sesi siang Hari 3 sekarang menjadi [Praktik 11 pada Hari 4](/hari-4/).

## Praktik 8 - Database Cloud dan Prisma ORM

Basis data dipindahkan dari perangkat sendiri ke layanan cloud, lalu aplikasi disambungkan ke sana.

1. [Setup Cloud PostgreSQL dan PostGIS di Supabase](/hari-3/praktik-8/cloud-postgresql) - membuat project Supabase, mengaktifkan PostGIS, menjalankan skema lewat SQL Editor, dan memeriksanya dari QGIS.
2. [Konfigurasi Prisma dan Membuat API Login](/hari-3/praktik-8/prisma-api-login) - memasang Prisma ORM, menyambungkannya ke basis data, dan membuat endpoint login.

## Praktik 9 - API dan Backend

1. [Konsep Dasar API dan Backend](/hari-3/praktik-9/konsep-api-backend) - cara kerja permintaan HTTP, metode, status, dan bentuk balasan.
2. [Membuat CRUD API Users](/hari-3/praktik-9/crud-api-users) - membuat endpoint daftar, tambah, ubah, dan hapus pengguna.

## Praktik 10 - Autentikasi NextAuth

[Konfigurasi NextAuth dan Access Token](/hari-3/praktik-10/nextauth-access-token) - membuat session, menerbitkan access token, mengatur hak akses, dan melindungi route.

## Yang Perlu Disiapkan Peserta

- Akun Supabase, dipakai pada [Setup Cloud PostgreSQL dan PostGIS di Supabase](/hari-3/praktik-8/cloud-postgresql).
- Proyek Next.js dari Hari 1 dan basis data dari Hari 2.
- QGIS, dipakai pada Praktik 8 untuk memeriksa hasilnya.

## Hasil Akhir Hari 3

Di akhir hari, aplikasi Next.js tersambung ke basis data cloud, memiliki API untuk login dan mengelola pengguna, serta membatasi akses berdasarkan peran pengguna. Aplikasi pada tahap ini masih berjalan di perangkat sendiri; memindahkannya ke server dikerjakan pada Hari 4.
