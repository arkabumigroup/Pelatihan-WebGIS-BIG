# Skema Database

Halaman ini memuat file SQL yang membuat dan memeriksa tabel database. Isinya ditampilkan lengkap supaya dapat disalin langsung dari sini.

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

## 01-schema.sql

Aman dijalankan lebih dari sekali, karena memakai `CREATE TABLE IF NOT EXISTS`.

```sql
-- Jalankan seluruh berkas di SQL Editor Supabase. Aman diulang.

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    user_id     uuid         PRIMARY KEY,
    name        varchar(100) NOT NULL,
    email       varchar(150) NOT NULL,
    password    varchar(255) NOT NULL,
    role        varchar(20)  NOT NULL DEFAULT 'viewer',
    is_active   boolean      NOT NULL DEFAULT false,
    created_at  timestamptz  NOT NULL DEFAULT now(),

    -- Validasi hanya ada di kode aplikasi, jadi batasan ini ditambahkan di
    -- database supaya data tidak bisa masuk lewat jalur lain (import CSV, klien DB).
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_valid
        CHECK (role IN ('viewer', 'admin', 'super_admin'))
);

COMMENT ON COLUMN users.password IS
    'Hash bcrypt ($2a$/$2b$), BUKAN password asli. Seed manual lewat 02-seed-super-admin.sql.';

CREATE TABLE IF NOT EXISTS katalog_data_2d (
    data_2d_id  uuid         PRIMARY KEY,
    layer_name  varchar(255) NOT NULL,
    akses       varchar(20)  NOT NULL,
    is_editable boolean      NOT NULL,
    wms_url     text,
    wfs_url     text,
    author      uuid,
    -- Alias layer untuk legenda peta. Boleh kosong, dan bila kosong aplikasi
    -- memakai layer_name. Ditambahkan setelah aplikasi memakainya.
    layer_alias varchar(150),

    CONSTRAINT katalog_data_2d_layer_name_key UNIQUE (layer_name),
    CONSTRAINT katalog_data_2d_akses_valid
        CHECK (akses IN ('public', 'private')),
    CONSTRAINT katalog_data_2d_author_fkey
        FOREIGN KEY (author) REFERENCES users (user_id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS katalog_data_3d (
    data_3d_id uuid         PRIMARY KEY,
    author     uuid,
    model_name varchar(150) NOT NULL,
    akses      varchar(20)  NOT NULL,
    url        text,
    latitude   double precision,
    longitude  double precision,
    heading    integer,
    pitch      integer,
    roll       integer,
    scale      integer,
    -- Aplikasi tidak pernah mengirim kolom ini saat menyimpan data 3D, jadi
    -- tanpa nilai bawaan setiap penyimpanan gagal dengan "null value in
    -- column tipe_file violates not-null constraint".
    tipe_file  varchar(10)  NOT NULL DEFAULT 'glb',

    CONSTRAINT katalog_data_3d_akses_valid
        CHECK (akses IN ('public', 'private')),
    CONSTRAINT katalog_data_3d_tipe_file_valid
        CHECK (tipe_file IN ('glb', 'ply', 'gltf')),
    CONSTRAINT katalog_data_3d_lat_range
        CHECK (latitude  IS NULL OR latitude  BETWEEN -90  AND 90),
    CONSTRAINT katalog_data_3d_lon_range
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    CONSTRAINT katalog_data_3d_author_fkey
        FOREIGN KEY (author) REFERENCES users (user_id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS katalog_data_2d_author_idx ON katalog_data_2d (author);
CREATE INDEX IF NOT EXISTS katalog_data_2d_akses_idx  ON katalog_data_2d (akses);
CREATE INDEX IF NOT EXISTS katalog_data_3d_author_idx ON katalog_data_3d (author);

-- security_invoker = true WAJIB: tanpa itu view berjalan dengan hak pemiliknya,
-- dan karena pemilik tabel melewati RLS, peran anon tetap bisa membaca baris
-- berakses 'private' beserta email penulisnya lewat view ini.
CREATE OR REPLACE VIEW v_katalog_2d_lengkap
WITH (security_invoker = true) AS
SELECT k.data_2d_id,
       k.layer_name,
       k.akses,
       k.is_editable,
       k.wms_url,
       k.wfs_url,
       u.user_id AS author_id,
       u.name    AS author_nama,
       u.email   AS author_email
FROM katalog_data_2d k
LEFT JOIN users u ON u.user_id = k.author;

COMMIT;

-- Periksa setelah COMMIT: ketiga tabel harus punya primary key, dan katalog_data_2d
-- harus punya foreign key (contype 'f') ke users.

-- Mengaktifkan Row Level Security dikerjakan sesaat setelah berkas ini selesai,
-- dengan perintah yang ada pada halaman Skema Database di modul pelatihan.
```

File ini hanya membuat tabel. Mengaktifkan Row Level Security dikerjakan pada langkah berikutnya, sesaat setelah tabelnya ada.

## Mengaktifkan Row Level Security

Supabase menyediakan REST API otomatis untuk setiap tabel di schema `public`, dan kunci `anon` yang dipakai API itu memang dirancang untuk dipakai di sisi browser. Yang mencegah penyalahgunaannya adalah Row Level Security, bukan kerahasiaan kunci tersebut.

Jalankan perintah ini di SQL Editor **segera setelah** `01-schema.sql` selesai, selagi tabelnya baru dibuat:

```sql
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_2d ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_3d ENABLE ROW LEVEL SECURITY;
```

Bila Anda melewatkannya, Supabase menampilkan peringatan `This query creates a table without enabling Row Level Security` saat tabel dibuat, dan peringatan itu benar. Kembalilah ke sini dan jalankan ketiga perintah di atas sebelum melanjutkan.

### Periksa hasilnya

Ketiga tabel harus bernilai `true` pada kolom `rls`, dan view memuat `security_invoker=true` pada kolom `opsi`:

```sql
SELECT c.relname AS objek, c.relkind AS jenis,
       c.relrowsecurity AS rls, c.reloptions AS opsi
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d', 'v_katalog_2d_lengkap')
ORDER BY c.relname;
```

View `v_katalog_2d_lengkap` dibuat memakai `security_invoker = true` pada `01-schema.sql`. Tanpa opsi itu, view berjalan dengan hak pemiliknya, dan karena pemilik tabel melewati RLS, isi katalog tetap dapat dibaca lewat view itu walaupun RLS pada tabelnya sudah menyala.

## 02-seed-super-admin.sql

::: warning File ini tidak bisa dijalankan apa adanya
Isinya template. Dua nilai di dalamnya masih berupa penanda, dan harus diganti lebih dahulu:

```sql
email_admin text := '<ISI_EMAIL_DI_SINI>';
hash_admin  text := '<ISI_HASH_DI_SINI>';
```

Bila dijalankan tanpa mengganti penandanya, file ini berhenti dengan pesan yang menyebut penanda mana yang belum diisi. Berhentinya disengaja, supaya akun dengan email kosong tidak pernah dibuat.

Cara mengisinya ada pada bagian **Membuat Akun Super Admin** di bawah.
:::

```sql
-- Seed akun super admin. Ganti dua penanda di blok DO di bawah, lalu jalankan.
-- SQL biasa tanpa meta-command, jadi bisa ditempel apa adanya ke SQL Editor Supabase.

-- Buat hash dulu di halaman Kit Identitas Peserta (langkah 3), atau dengan
-- perintah `node scripts/hash-password.mjs` di folder proyek. Keduanya sama
-- sah, karena bcrypt tidak tersedia di dalam PostgreSQL. Hasilnya 60 karakter
-- berawalan $2b$12$.

DO $$
DECLARE
    email_admin text := '<ISI_EMAIL_DI_SINI>';
    hash_admin  text := '<ISI_HASH_DI_SINI>';
BEGIN
    -- Diperiksa dari SISA PENANDA, bukan dengan membandingkan nilai terhadap
    -- penandanya sendiri: penggantian teks sederhana ikut mengubah string
    -- pembandingnya, sehingga perbandingan apa adanya menolak nilai yang benar.
    IF email_admin LIKE '%<ISI_EMAIL%' THEN
        RAISE EXCEPTION 'Email belum diisi. Ganti nilai <ISI_EMAIL_DI_SINI> pada berkas ini.';
    END IF;

    IF hash_admin LIKE '%<ISI_HASH%' THEN
        RAISE EXCEPTION
            'Hash belum diisi. Buat dulu di halaman Kit Identitas Peserta (langkah 3) atau dengan node scripts/hash-password.mjs, lalu tempel hasilnya di sini.';
    END IF;

    -- Menolak nilai yang bukan hash bcrypt. Tanpa ini, salah paste kata sandi
    -- asli membuat akun tidak bisa login sekaligus menyimpan kata sandi polos.
    IF hash_admin !~ '^\$2[aby]\$[0-9]{2}\$' THEN
        RAISE EXCEPTION
            'Nilai hash bukan hash bcrypt. Yang benar diawali $2a$, $2b$, atau $2y$. Diterima: %',
            left(hash_admin, 12);
    END IF;

    IF email_admin !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN
        RAISE EXCEPTION 'Email tidak sah: %', email_admin;
    END IF;

    INSERT INTO users (user_id, name, email, password, role, is_active, created_at)
    VALUES (gen_random_uuid(), 'Super Admin', lower(btrim(email_admin)),
            hash_admin, 'super_admin', true, now())
    ON CONFLICT (email) DO UPDATE
    SET password  = EXCLUDED.password,
        role      = 'super_admin',
        is_active = true;

    RAISE NOTICE 'Akun super admin % siap dipakai.', lower(btrim(email_admin));
END $$;

-- Bila tabel users belum ada, jalankan sql/01-schema.sql lebih dahulu.

-- Verifikasi. Harapan: tepat satu baris, is_active true, dan awalan_hash berisi
-- hash bcrypt ($2a$ atau $2b$), bukan kata sandi asli.

SELECT 'Akun super admin' AS bagian;
SELECT user_id, name, email, role, is_active, left(password, 7) AS awalan_hash
FROM users
WHERE role = 'super_admin';
```

### Membuat Akun Super Admin

Tiga langkah. Langkah 1 dikerjakan di browser atau di terminal, pilih salah satu; langkah 2 dan 3 di SQL Editor.

**Langkah 1. Buat hash kata sandi.** Ada dua cara, dan keduanya menghasilkan hash yang sama-sama sah. Pilih salah satu.

**Cara A, di browser.** Buka [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas), lalu tekan **Buat kata sandi dan hash** pada langkah 3. Tidak ada yang perlu dijalankan di terminal, jadi cara ini dapat dipakai walau Node.js belum terpasang di laptop.

Kata sandinya dibuat sekaligus dengan hash-nya. Kata sandi aslinya ditampilkan di situ juga, dan tetap tersimpan setelah halaman ditutup. Simpan keduanya: yang ditempel ke file SQL adalah hash-nya, sedangkan yang dipakai untuk masuk ke portal adalah kata sandinya. Bcrypt satu arah, jadi kata sandi yang hilang tidak dapat dibaca kembali dari kolom `password` di database.

Bila halaman itu dimuat ulang, hash-nya tidak ikut muncul kembali karena memang tidak disimpan. Tekan **Hitung ulang hash** untuk membuatnya lagi dari kata sandi yang tersimpan. Hash yang muncul akan berbeda dari yang lama walaupun kata sandinya sama, karena bcrypt menyisipkan salt baru setiap kali; keduanya tetap sah dan tetap cocok dengan kata sandi itu.

**Cara B, di terminal.** Di root folder proyek, jalankan:

```bash
node scripts/hash-password.mjs
```

Skrip itu meminta kata sandi lewat prompt tersembunyi, jadi kata sandinya tidak muncul di layar dan tidak masuk riwayat terminal. Hasilnya satu baris berawalan `$2b$12$`. Salin baris itu.

Bedanya dengan cara A: kata sandinya ditentukan sendiri saat ditanya, dan tidak tersimpan di mana pun. Catat kata sandi itu di tempat yang aman sebelum menutup terminal, karena tidak ada halaman yang menampilkannya lagi.

**Langkah 2. Isi penandanya.** Buka file `02-seed-super-admin.sql`, lalu ganti dua penanda:

```sql
email_admin text := '<ISI_EMAIL_DI_SINI>';
hash_admin  text := '<ISI_HASH_DI_SINI>';
```

**Langkah 3. Jalankan.** Salin seluruh isi file yang sudah diubah ke SQL Editor, lalu Run. Hasilnya:

```
NOTICE: Akun super admin nama@email.com siap dipakai.
```

Email dan kata sandi itulah yang dipakai untuk masuk ke portal.

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa dibuat oleh `02-seed-super-admin.sql`. Jadi file itu wajib dijalankan, bukan pilihan.
:::

## 03-periksa.sql

File ini hanya berisi perintah `SELECT`. Tidak mengubah apa pun, jadi aman dijalankan kapan saja, termasuk berkali-kali.

```sql
-- Tempel seluruh berkas ke SQL Editor Supabase lalu Run. Semua di sini hanya SELECT.
-- Jangan mengandalkan tab tabel di dashboard, karena tidak semua jenis constraint
-- ditampilkan dengan cara yang sama.

-- 1. Semua constraint di tiga tabel, apa adanya.
-- Harapan setelah 01-schema.sql pada PostgreSQL 17 ke bawah (termasuk Supabase):
--   users 3 baris, katalog_data_2d 4 baris, katalog_data_3d 6 baris.
-- PostgreSQL 18 ke atas menambah baris, karena sejak versi 18 batasan NOT NULL ikut
-- tercatat di pg_constraint dengan kode 'n'; di versi lama NOT NULL disimpan di
-- pg_attribute dan tidak muncul di query ini. Jadi angka yang lebih kecil di Supabase
-- BUKAN tanda ada yang salah, asal ketiga tabel muncul dan kolom check_ tidak nol.
-- Kode jenis: p primary key, u unique, f foreign key, c check, n not null
SELECT '1. Constraint yang terpasang' AS bagian;
SELECT c.relname AS tabel,
       con.conname AS nama_constraint,
       con.contype AS kode,
       CASE con.contype
         WHEN 'p' THEN 'PRIMARY KEY'
         WHEN 'u' THEN 'UNIQUE'
         WHEN 'f' THEN 'FOREIGN KEY'
         WHEN 'c' THEN 'CHECK'
         WHEN 'n' THEN 'NOT NULL'
         ELSE con.contype::text
       END AS arti
FROM pg_constraint con
JOIN pg_class c     ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d')
ORDER BY c.relname, con.contype, con.conname;

-- 2. Ringkasan: berapa constraint per tabel.
SELECT '2. Jumlah constraint per tabel' AS bagian;
SELECT c.relname AS tabel, count(*) AS jumlah,
       count(*) FILTER (WHERE con.contype = 'u') AS unique_,
       count(*) FILTER (WHERE con.contype = 'f') AS foreign_key,
       count(*) FILTER (WHERE con.contype = 'c') AS check_
FROM pg_constraint con
JOIN pg_class c     ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d')
GROUP BY c.relname ORDER BY c.relname;

-- 3. Kolom wajib yang belum NOT NULL. Harapan: hasilnya kosong.
-- Sebagian kolom sengaja boleh kosong karena nilainya baru terisi setelah proses
-- berjalan: wms_url/wfs_url (setelah layer terbit ke GeoServer), author di 2D dan 3D
-- (data hasil impor), url 3D (setelah berkas model tersimpan), serta latitude, longitude,
-- heading, pitch, roll, scale (saat model ditempatkan di peta). Karena itu query ini
-- hanya menyebut kolom yang MEMANG wajib: identitas, nama, dan status.
SELECT '3. Kolom wajib yang belum NOT NULL (harus kosong)' AS bagian;
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND is_nullable = 'YES'
  AND (table_name, column_name) IN (
      ('users', 'name'), ('users', 'email'), ('users', 'password'),
      ('users', 'role'), ('users', 'is_active'), ('users', 'created_at'),
      ('katalog_data_2d', 'layer_name'), ('katalog_data_2d', 'akses'),
      ('katalog_data_2d', 'is_editable'),
      ('katalog_data_3d', 'model_name'), ('katalog_data_3d', 'akses'),
      ('katalog_data_3d', 'tipe_file')
  )
ORDER BY table_name, column_name;

-- 4. Constraint yang seharusnya ada tetapi belum terpasang. Bagian ini yang paling
-- berguna: langsung menyebut nama constraint yang hilang.
SELECT '4. Constraint yang hilang' AS bagian;
WITH seharusnya(tabel, nama) AS (
    VALUES
      ('users', 'users_pkey'),
      ('users', 'users_email_key'),
      ('users', 'users_role_valid'),
      ('katalog_data_2d', 'katalog_data_2d_pkey'),
      ('katalog_data_2d', 'katalog_data_2d_author_fkey'),
      ('katalog_data_2d', 'katalog_data_2d_akses_valid'),
      ('katalog_data_3d', 'katalog_data_3d_pkey'),
      ('katalog_data_3d', 'katalog_data_3d_author_fkey'),
      ('katalog_data_3d', 'katalog_data_3d_akses_valid')
)
SELECT s.tabel, s.nama AS nama_constraint_hilang
FROM seharusnya s
WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class c     ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = s.tabel AND con.conname = s.nama
)
ORDER BY s.tabel, s.nama;

-- Bila bagian 4 berisi baris, jalankan sql/01-schema.sql: berkas itu aman
-- dijalankan berulang dan hanya menambahkan yang belum ada.
```

## Kolom yang sengaja boleh kosong

Bagian 3 pada file di atas memeriksa kolom wajib saja. Itu disengaja.

Sebagian kolom **memang dibiarkan boleh kosong**, karena nilainya baru terisi setelah proses berjalan:

| Kolom | Kapan terisi |
|---|---|
| `katalog_data_2d.wms_url`, `wfs_url` | Setelah layer terbit ke GeoServer |
| `katalog_data_2d.author` | Boleh kosong untuk data hasil impor |
| `katalog_data_3d.url` | Setelah file model tersimpan |
| `katalog_data_3d.latitude`, `longitude`, `heading`, `pitch`, `roll`, `scale` | Saat model ditempatkan di peta |
| `katalog_data_3d.author` | Boleh kosong untuk data hasil impor |

Query yang menyaring seluruh kolom `is_nullable = 'YES'` akan **selalu berisi** walaupun skemanya sudah benar. Diuji pada Supabase dengan skema yang benar, query semacam itu mengembalikan **sebelas baris**, dan itu bukan tanda ada yang salah.

## Jumlah Constraint Berbeda Menurut Versi PostgreSQL

Saat menjalankan `03-periksa.sql`, bagian **2. Jumlah constraint per tabel** menampilkan jumlah yang berbeda di Supabase dan di PostgreSQL lokal. Itu wajar, bukan tanda ada yang salah.

| Tabel | Supabase (PostgreSQL 17) | PostgreSQL 18 lokal |
|---|---|---|
| `users` | 3 | 10 |
| `katalog_data_2d` | 4 | 8 |
| `katalog_data_3d` | 6 | 8 |

Sebabnya, sejak PostgreSQL 18 batasan `NOT NULL` ikut tercatat di `pg_constraint` dengan kode `n`. Pada versi sebelumnya, `NOT NULL` disimpan di `pg_attribute` dan tidak muncul pada query itu. Karena itu kolom `not_null` bernilai `0` di Supabase.

Yang perlu Anda pastikan bukan angkanya, melainkan:

- Ketiga tabel muncul pada hasilnya.
- Kolom `check_` tidak bernilai nol, karena `CHECK` itulah yang mencegah peran dan nilai tidak sah masuk ke database.

## Lupa Kata Sandi Super Admin

Kata sandi tidak disimpan dalam bentuk aslinya, melainkan sebagai hash bcrypt. Karena itu kata sandi yang terlupa **tidak dapat dibaca kembali**, tetapi dapat diganti.

Seluruh langkah di bawah dikerjakan di browser atau di terminal, lalu di SQL Editor Supabase. Tidak ada yang perlu dijalankan di VM.

### 1. Buat hash baru

Dua cara, sama seperti pada bagian **Membuat Akun Super Admin**. Pilih salah satu.

**Cara A, di browser.** Buka [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas), lalu tekan **Buat ulang kata sandi** pada langkah 3. Kata sandi baru beserta hash-nya dibuat sekaligus.

Salin hash yang muncul, yang dimulai dengan `$2b$12$`. Kata sandi barunya juga tercatat di situ, dan tetap tersimpan setelah halaman ditutup.

::: tip Periksa halaman Kit Identitas lebih dahulu
Kata sandi yang tersimpan di browser masih dapat dibaca di halaman itu, dengan mencentang **Tampilkan di layar**. Bila kata sandinya masih ada di sana, tidak ada yang perlu diganti: coba masuk memakai kata sandi itu.
:::

**Cara B, di terminal.** Di root folder proyek:

```bash
node scripts/hash-password.mjs
```

Skrip itu meminta kata sandi **tanpa menampilkannya di layar**, dan tanpa menyimpannya ke riwayat terminal. Salin hash yang tercetak, yang dimulai dengan `$2b$12$`. Catat kata sandi barunya sebelum menutup terminal, karena skrip ini tidak menyimpannya di mana pun.

### 2. Cari akun super admin

Di SQL Editor Supabase:

```sql
SELECT email, role, is_active
FROM users
WHERE role = 'super_admin';
```

### 3. Ganti kata sandinya

```sql
UPDATE users
SET password = 'HASH_DARI_LANGKAH_1'
WHERE email = 'EMAIL_DARI_LANGKAH_2';
```

Ganti `HASH_DARI_LANGKAH_1` dengan hash yang tadi tersalin, dan `EMAIL_DARI_LANGKAH_2` dengan email hasil langkah 2. Hasilnya harus `UPDATE 1`.

### 4. Login

Buka kembali halaman login, dan masuk memakai kata sandi yang baru.

### Bila akun super admin tidak ada

Berarti `02-seed-super-admin.sql` belum pernah dijalankan. Buka file itu, ganti kedua penandanya, lalu jalankan seluruh isinya di SQL Editor. Langkahnya ada pada bagian [Membuat Akun Super Admin](#membuat-akun-super-admin) di halaman ini.

### Bila muncul "Akun anda belum di aktivasi"

Kata sandinya sudah benar. Yang belum benar hanya statusnya:

```sql
UPDATE users SET is_active = true WHERE email = 'EMAIL_ANDA';
```

::: tip Ini bukan kelemahan, melainkan cara kerja hash
Hash bcrypt bersifat satu arah. Kata sandi asli tidak tersimpan di mana pun, sehingga tidak ada yang dapat membacanya kembali, termasuk Anda sendiri.

Yang dapat dilakukan adalah menggantinya, dan itulah yang dikerjakan bagian ini. Sifat yang sama juga yang membuat kebocoran hash tidak langsung berarti kebocoran kata sandi.
:::

## Bila Login Gagal

Periksa berurutan:

1. **`DATABASE_URL` salah.** Pesan errornya menyebut `Can't reach database server`. Periksa bagian catatan tentang `DATABASE_URL` pada [Tahap 5 halaman Isi File .env](/hari-4/praktik-11/isi-env).
2. **Tabel belum ada.** Jalankan `03-periksa.sql`. Hasilnya harus menampilkan tiga tabel.
3. **Akun belum aktif.** Jalankan di SQL Editor:

    ```sql
    SELECT email, role, is_active FROM users;
    UPDATE users SET is_active = true WHERE email = 'email-anda';
    ```

4. **Kata sandi tidak cocok.** Periksa bentuk hash yang tersimpan di kolom `password`. Yang benar berjumlah 60 karakter dan berawalan `$2b$` atau `$2a$`.

    ```sql
    SELECT email,
           length(password)                  AS panjang,
           substring(password from 1 for 7)  AS awalan,
           password ~ '^\$2[aby]\$[0-9]{2}\$' AS hash_bcrypt
    FROM users
    WHERE role = 'super_admin';
    ```

    Harapannya `panjang` 60, `awalan` `$2b$12$`, dan `hash_bcrypt` bernilai `true`. Bila `awalan` justru berisi kata sandi aslinya, penandanya belum diganti dan file SQL-nya perlu dijalankan ulang dengan hash yang benar.

    Bila Anda memakai **cara B** pada langkah 1 dan ingin memeriksa hash di luar database, skripnya juga menyediakan mode itu:

    ```bash
    node scripts/hash-password.mjs --cek '<hash-dari-kolom-password>'
    ```

5. **Pesan menyebut tabel tidak ditemukan.** Prisma membaca schema `public`. Pastikan ketiga tabel dibuat di sana.
6. **Kegagalan constraint yang sulit dilacak.** Jalankan `05-diagnosa-constraint.sql`. File itu memeriksa sepuluh hal sekaligus dan diakhiri tabel keputusan: error mana menunjuk ke perbaikan mana.
