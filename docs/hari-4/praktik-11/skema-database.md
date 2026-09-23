# Skema Database

Halaman ini menyiapkan database untuk portal: mengaktifkan PostGIS, mengenalkan tiga tabel yang akan dibuat, dan menunjukkan hubungan antar tabelnya.

Pekerjaannya dipecah menjadi tiga bagian supaya tidak menumpuk dalam satu halaman panjang. Kerjakan berurutan.

| Bagian | Isinya |
|---|---|
| **1. Menyiapkan Skema Database** | Mengaktifkan PostGIS dan membuat schema `gis` di Supabase |
| [2. Menjalankan Berkas SQL](/hari-4/praktik-11/menjalankan-skema) | Menjalankan `01-schema.sql`, RLS, `02-seed-super-admin.sql`, dan `03-periksa.sql` |
| [3. Bila Ada Masalah](/hari-4/praktik-11/masalah-skema) | Kolom kosong, constraint, lupa kata sandi, dan login gagal |

File aslinya juga ada di folder `sql/` pada repositori Anda, dan isinya sama. Bila Anda sudah menjalankan [Tahap 1 hingga 2 pada halaman Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database), file itu sudah ada di laptop Anda.

## Project ini baru, jadi PostGIS belum ada

::: warning Project Supabase di Hari 4 berbeda dari Hari 3
Pada [Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database) Anda membuat **project Supabase baru**, bukan memakai yang sudah ada di Hari 3. Project baru dibuat dalam keadaan kosong: extension PostGIS belum aktif dan schema `gis` belum dibuat.

Keduanya dikerjakan di sini, pada langkah 1 di bawah, supaya database Anda sudah lengkap sebelum halaman ini selesai. Kalau ditunda, unggahan layer pertama akan gagal dengan `type "geometry" does not exist`, dan pesan itu tidak menyebutkan bahwa penyebabnya adalah extension yang belum pernah diaktifkan.
:::

## Cara tabel ini dibuat

Ketiga tabel dibuat dengan menjalankan file SQL di halaman ini, bukan dengan mengetik kolomnya satu per satu di antarmuka database. Seluruh peserta memakai file yang sama, sehingga bentuk tabelnya seragam di semua komputer.

Bentuknya mengikuti ketentuan ERD pada halaman ini: nama kolom, tipe data, nilai bawaan, aturan `CHECK`, dan kaitannya antar tabel. Aplikasi mengharapkan bentuk itu persis, jadi yang perlu Anda pastikan adalah seluruh file di bawah dijalankan sampai selesai.

## Menjalankan di SQL Editor

Seluruh langkah di halaman ini dijalankan lewat **SQL Editor** Supabase, bukan lewat terminal. Ekstensi PostGIS adalah satu-satunya yang lebih mudah dikerjakan lewat menu Extensions, dan caranya dijelaskan pada langkah 1.

1. Buka project Anda di [supabase.com/dashboard](https://supabase.com/dashboard).
2. Pada menu kiri, klik **SQL Editor**.
3. Salin **seluruh** isi salah satu file di bawah, tempel ke kotak yang tersedia, lalu klik **Run**.
4. Ulangi untuk file berikutnya, sesuai urutan.

Jangan menyalin sebagian, karena `01-schema.sql` dan `02-seed-super-admin.sql` memakai `BEGIN` dan `COMMIT` yang harus berpasangan.

## Urutan Pengerjaan

| # | File | Yang dilakukan | Wajib? | Mengubah data? |
|---|---|---|---|---|
| 1 | Ekstensi PostGIS | Mengaktifkan PostGIS di schema `public` dan membuat schema `gis` | Ya, karena projectnya baru | Tidak, hanya menyiapkan schema |
| 2 | `01-schema.sql` | Membuat tiga tabel: `users`, `katalog_data_2d`, dan `katalog_data_3d` | Ya | Tidak, hanya membuat tabel |
| 3 | Perintah RLS | Mengaktifkan Row Level Security pada ketiga tabel itu | Ya, segera setelah langkah 2 | Tidak, hanya mengubah pengaturan tabel |
| 4 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama | Ya | Ya, menambah satu akun |
| 5 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca | Boleh dilewati | Tidak |

## 1. Ekstensi PostGIS dan schema gis

Bagian ini dikerjakan lebih dahulu, karena project Supabase yang Anda buat di halaman sebelumnya belum memuat PostGIS sama sekali.

Ada dua schema yang terlibat, dan keduanya punya peran berbeda:

| Schema | Isinya | Siapa yang memakainya |
|---|---|---|
| `public` | Extension PostGIS: tipe `geometry` beserta fungsinya | Aplikasi dan GeoServer |
| `gis` | Tabel spasial yang dibuat aplikasi saat layer diunggah | Aplikasi menulis, GeoServer membaca |

**Aktifkan extension-nya lewat antarmuka Supabase**, bukan lewat SQL, supaya schema-nya dapat dipilih dengan pasti:

1. Pada menu kiri dashboard Supabase, klik **Database**, lalu **Extensions**.
2. Ketik `postgis` pada kolom pencarian, lalu aktifkan extension bernama `postgis` saja.
3. Saat muncul pilihan schema, **pilih `public`**. Jangan membuat schema baru, dan jangan memilih `gis`.

::: danger Di sini beda dari PostgreSQL lokal Hari 2, dan bedanya menentukan
Pada [Basis Data Lokal](/hari-2/praktik-6/basis-data-lokal) PostGIS dipasang ke schema `gis`, lalu jalur pencariannya diarahkan ke sana dengan `ALTER DATABASE geoportal SET search_path TO gis, public;`. **Dua langkah itu satu paket.** Yang membuat pemasangan di `gis` sah adalah perintah `ALTER DATABASE` sesudahnya.

Di Supabase, perintah `ALTER DATABASE` itu **tidak berpengaruh**. Pooler menetapkan jalur pencarian pada tingkat koneksi dan menimpa nilai tingkat database, sehingga perintahnya berjalan tanpa error tetapi tidak mengubah apa pun. Artinya langkah kedua Ari tidak tersedia di sini.

Karena itu jalurnya tidak dapat dipindahkan ke PostGIS, dan PostGIS-lah yang harus diletakkan di jalur yang sudah ada, yaitu `public`. Kalau Anda memakai schema `gis` seperti di Hari 2, pembuatan tabel layer nanti gagal dengan `type "geometry" does not exist`.
:::

Padanan SQL-nya, bila Anda lebih suka menempelkannya di SQL Editor:

```sql
-- PostGIS harus berada di schema public
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
```

Lalu buat schema `gis` secara terpisah. Schema ini menampung tabel spasial yang dibuat aplikasi, bukan extension-nya:

```sql
CREATE SCHEMA IF NOT EXISTS gis;
```

::: warning Kenapa PostGIS tidak boleh diletakkan di gis
Kode aplikasi menulis nama tabelnya lengkap dengan schema, yaitu `"gis"."nama_tabel"`. Jadi tabelnya masuk ke `gis` bukan karena `search_path`, melainkan karena memang ditulis begitu.

Yang bergantung pada `search_path` justru tipe `geometry`-nya, karena kode itu menulis `GEOMETRY(Geometry, 4326)` tanpa awalan schema. Pada Supabase, pooler menetapkan `search_path` sendiri pada tingkat koneksi, dan nilai yang berlaku adalah `"$user", public, extensions`. Perhatikan bahwa `gis` tidak ada di situ, sedangkan `public` ada.

Itulah sebabnya PostGIS harus berada di `public`, bukan di `gis`. Bila dipasang di `gis`, tipe `geometry` tidak ditemukan pada jalur yang berlaku, dan pembuatan tabelnya gagal.
:::

### Periksa hasilnya

```sql
SELECT extname, extnamespace::regnamespace AS schema
FROM pg_extension
WHERE extname LIKE 'postgis%';

SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('public', 'gis', 'extensions')
ORDER BY schema_name;
```

Yang diharapkan:

```text
extname   schema
postgis   public

schema_name
extensions
gis
public
```

Bila baris pertama belum menampilkan `postgis public`, jangan lanjut ke langkah berikutnya. Tabel spasial yang dibuat nanti akan gagal, dan pesannya tidak menyebut extension.

## Tiga Tabel yang Dibuat

| Tabel | Isinya |
|---|---|
| `users` | Akun pengguna, dipakai untuk login dan pengaturan hak akses |
| `katalog_data_2d` | Metadata layer peta 2D |
| `katalog_data_3d` | Metadata model 3D |

Kolomnya sudah dicocokkan dengan kode aplikasi, jadi jangan mengubah nama atau tipe kolomnya.

## Gambaran Relasi Antar Tabel

Diagram berikut menunjukkan ketiga tabel beserta kolomnya dan hubungan di antaranya. Bentuknya mengikuti notasi ERD standar, sehingga dapat dibandingkan dengan rancangan database lain.

![Diagram relasi tabel database: users, katalog_data_2d, dan katalog_data_3d. Tabel users menyimpan akun pengguna dengan kunci utama user_id. Tabel katalog_data_2d menyimpan metadata layer peta 2D, dan katalog_data_3d menyimpan metadata model 3D. Keduanya menunjuk ke users lewat kolom author.](erd-skema-database.webp)

### Cara membaca diagram

| Tanda | Artinya |
|---|---|
| **PK** | Primary key, kunci utama yang membedakan tiap baris |
| **FK** | Foreign key, kolom yang menunjuk ke tabel lain |
| **U** | Unique, nilainya tidak boleh sama pada dua baris |
| Tiga garis mengembang | Sisi banyak. Satu baris di sisi lain dapat berpasangan dengan banyak baris di sini |
| Satu garis tegak | Sisi satu. Satu baris di sini hanya berpasangan dengan satu baris di sisi lain |

Relasinya satu ke banyak, dari `users` ke masing-masing tabel katalog. Artinya:

- Satu pengguna boleh punya banyak katalog, baik 2D maupun 3D.
- Satu katalog hanya dimiliki satu pengguna, yaitu yang tercatat pada kolom `author`.
- Kolom `author` memakai aturan `ON DELETE RESTRICT`. Pengguna yang masih memiliki katalog tidak dapat dihapus, sehingga tidak ada katalog yang kehilangan pemiliknya.

Nilai `author` boleh kosong. Katalog tanpa penulis tetap dapat disimpan, dan itu dipakai untuk data yang dimuat dari sumber luar.

Pekerjaan berlanjut pada halaman [Menjalankan Berkas SQL](/hari-4/praktik-11/menjalankan-skema).
