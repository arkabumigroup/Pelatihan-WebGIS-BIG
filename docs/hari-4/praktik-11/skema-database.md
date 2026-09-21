# Skema Database

Halaman ini memuat tiga berkas SQL yang membuat dan memeriksa tabel database. Isinya ditampilkan lengkap supaya dapat disalin langsung dari sini.

Berkas aslinya juga ada di folder `sql/` pada repositori Anda, dan isinya sama. Bila Anda sudah menjalankan [Tahap 1 hingga 2 pada halaman Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project), berkas itu sudah ada di laptop Anda.

## Jangan membuat tabel secara manual

Tabel dibuat **hanya** dengan menjalankan ketiga berkas SQL di halaman ini. Jangan membuat tabel lewat menu Create New Table pada DBeaver, pgAdmin, atau Table Editor Supabase.

Alasannya, membuat tabel secara manual hanya menghasilkan kolom dan primary key. Yang hilang justru bagian yang menentukan aplikasi berjalan:

| Yang hilang | Akibat |
|---|---|
| `DEFAULT 'viewer'` pada kolom `role` | Peran akun baru menjadi kosong |
| `DEFAULT false` pada `is_active` | Status aktivasi akun baru tidak jelas |
| `DEFAULT now()` pada `created_at` | Waktu pembuatan akun tidak tercatat |
| `DEFAULT 'glb'` pada `tipe_file` | Data 3D tersimpan tanpa jenis berkas |
| `CHECK (role IN (...))` | Peran tidak sah dapat masuk ke database |
| `UNIQUE` pada `email` | Dua akun dapat memakai email yang sama |

Berkas `01-schema.sql` sudah memuat semuanya, jadi menjalankannya jauh lebih cepat daripada mengisi satu per satu secara manual.

## Menjalankan di SQL Editor

Ketiga berkas dijalankan lewat **SQL Editor** Supabase, bukan lewat terminal.

1. Buka project Anda di [supabase.com/dashboard](https://supabase.com/dashboard).
2. Pada menu kiri, klik **SQL Editor**.
3. Salin **seluruh** isi salah satu berkas di bawah, tempel ke kotak yang tersedia, lalu klik **Run**.
4. Ulangi untuk berkas berikutnya, sesuai urutan.

Jangan menyalin sebagian, karena `01-schema.sql` dan `02-seed-super-admin.sql` memakai `BEGIN` dan `COMMIT` yang harus berpasangan.

## Urutan Pengerjaan

| # | Berkas | Yang dilakukan | Wajib? | Mengubah data? |
|---|---|---|---|---|
| 1 | `01-schema.sql` | Membuat tiga tabel: `users`, `katalog_data_2d`, dan `katalog_data_3d` | Ya | Tidak, hanya membuat tabel |
| 2 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama | Ya | Ya, menambah satu akun |
| 3 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca | Boleh dilewati | Tidak |
| 4 | `06-migrasi-peran-viewer.sql` | Memindahkan akun berperan `editor` menjadi `viewer` | Hanya bila database Anda dibuat sebelum peran itu dihapus | Ya, mengubah peran |
| 5 | `07-aktifkan-rls.sql` | Mengaktifkan Row Level Security | Hanya bila database Anda dibuat sebelum perintah RLS ada di `01-schema.sql` | Ya, mengaktifkan RLS |

## Tiga Tabel yang Dibuat

| Tabel | Isinya |
|---|---|
| `users` | Akun pengguna, dipakai untuk login dan pengaturan hak akses |
| `katalog_data_2d` | Metadata layer peta 2D |
| `katalog_data_3d` | Metadata model 3D |

Kolomnya sudah dicocokkan dengan kode aplikasi, jadi jangan mengubah nama atau tipe kolomnya.

## Gambaran Relasi Antar Tabel

Diagram berikut menunjukkan ketiga tabel beserta kolomnya dan hubungan di antaranya. Bentuknya mengikuti notasi ERD standar, sehingga dapat dibandingkan dengan rancangan basis data lain.

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
    nama        varchar(100) NOT NULL,
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
    nama       varchar(150) NOT NULL,
    akses      varchar(20)  NOT NULL,
    url        text,
    latitude   double precision,
    longitude  double precision,
    heading    double precision,
    pitch      double precision,
    roll       double precision,
    scale      double precision,
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
       u.nama    AS author_nama,
       u.email   AS author_email
FROM katalog_data_2d k
LEFT JOIN users u ON u.user_id = k.author;

COMMIT;

-- Periksa setelah COMMIT: ketiga tabel harus punya primary key, dan katalog_data_2d
-- harus punya foreign key (contype 'f') ke users.

-- Keamanan: RLS pada ketiga tabel. Tanpa ini tabel di schema public bisa dibaca
-- dan diubah lewat REST API Supabase dengan kunci anon, tanpa login. Kunci anon
-- memang dipakai di sisi peramban, jadi yang melindungi bukan kerahasiaannya,
-- melainkan RLS. Diuji: sebelum RLS, peran anon bisa membaca kolom password di
-- tabel users; sesudah RLS, anon dan authenticated tidak melihat satu baris pun.
-- Aplikasi tetap jalan karena Prisma memakai peran postgres, pemilik tabel, dan
-- pemilik tabel melewati RLS. RLS tanpa policy memang itu yang diinginkan: semua
-- akses lewat API aplikasi sendiri.
BEGIN;

ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_2d ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_3d ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Periksa hasilnya. relrowsecurity harus true untuk ketiga tabel.
```

## 02-seed-super-admin.sql

::: warning Berkas ini tidak bisa dijalankan apa adanya
Isinya template. Dua nilai di dalamnya masih berupa penanda, dan harus diganti lebih dahulu:

```sql
email_admin text := '<ISI_EMAIL_DI_SINI>';
hash_admin  text := '<ISI_HASH_DI_SINI>';
```

Bila dijalankan tanpa mengganti penandanya, berkas ini berhenti dengan pesan yang menyebut penanda mana yang belum diisi. Berhentinya disengaja, supaya akun dengan email kosong tidak pernah dibuat.

Cara mengisinya ada pada bagian **Membuat Akun Super Admin** di bawah.
:::

```sql
-- Seed akun super admin. Ganti dua penanda di blok DO di bawah, lalu jalankan.
-- SQL biasa tanpa meta-command, jadi bisa ditempel apa adanya ke SQL Editor Supabase.

-- Buat hash dulu di terminal, karena bcrypt tidak ada di PostgreSQL:
--   node scripts/hash-password.mjs
-- Hasilnya satu baris berawalan $2b$12$, dan kata sandi aslinya tidak masuk
-- riwayat terminal.

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
        RAISE EXCEPTION 'Hash belum diisi. Buat dulu dengan: node scripts/hash-password.mjs';
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

    INSERT INTO users (user_id, nama, email, password, role, is_active, created_at)
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
SELECT user_id, nama, email, role, is_active, left(password, 7) AS awalan_hash
FROM users
WHERE role = 'super_admin';
```

### Membuat Akun Super Admin

Tiga langkah. Langkah 1 dijalankan di terminal, langkah 2 dan 3 di SQL Editor.

**Langkah 1. Buat hash kata sandi.** Di root folder proyek, jalankan:

```bash
node scripts/hash-password.mjs
```

Skrip itu meminta kata sandi lewat prompt tersembunyi, jadi kata sandinya tidak muncul di layar dan tidak masuk riwayat terminal. Hasilnya satu baris berawalan `$2b$12$`. Salin baris itu.

**Langkah 2. Isi penandanya.** Buka berkas `02-seed-super-admin.sql`, lalu ganti dua penanda:

```sql
email_admin text := '<ISI_EMAIL_DI_SINI>';
hash_admin  text := '<ISI_HASH_DI_SINI>';
```

**Langkah 3. Jalankan.** Salin seluruh isi berkas yang sudah diubah ke SQL Editor, lalu Run. Hasilnya:

```
NOTICE: Akun super admin nama@email.com siap dipakai.
```

Email dan kata sandi itulah yang dipakai untuk masuk ke portal.

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa lahir dari `02-seed-super-admin.sql`. Jadi berkas itu wajib dijalankan, bukan pilihan.
:::

## 03-periksa.sql

Berkas ini hanya berisi perintah `SELECT`. Tidak mengubah apa pun, jadi aman dijalankan kapan saja, termasuk berkali-kali.

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
      ('users', 'nama'), ('users', 'email'), ('users', 'password'),
      ('users', 'role'), ('users', 'is_active'), ('users', 'created_at'),
      ('katalog_data_2d', 'layer_name'), ('katalog_data_2d', 'akses'),
      ('katalog_data_2d', 'is_editable'),
      ('katalog_data_3d', 'nama'), ('katalog_data_3d', 'akses'),
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

Bagian 3 pada berkas di atas memeriksa kolom wajib saja. Itu disengaja.

Sebagian kolom **memang dibiarkan boleh kosong**, karena nilainya baru terisi setelah proses berjalan:

| Kolom | Kapan terisi |
|---|---|
| `katalog_data_2d.wms_url`, `wfs_url` | Setelah layer terbit ke GeoServer |
| `katalog_data_2d.author` | Boleh kosong untuk data hasil impor |
| `katalog_data_3d.url` | Setelah berkas model tersimpan |
| `katalog_data_3d.latitude`, `longitude`, `heading`, `pitch`, `roll`, `scale` | Saat model ditempatkan di peta |
| `katalog_data_3d.author` | Boleh kosong untuk data hasil impor |

Query yang menyaring seluruh kolom `is_nullable = 'YES'` akan **selalu berisi** walaupun skemanya sudah benar. Diuji pada Supabase dengan skema yang benar, query semacam itu mengembalikan **sebelas baris**, dan itu bukan tanda ada yang salah.

## Row Level Security

Saat menjalankan `01-schema.sql`, Supabase mungkin menampilkan peringatan seperti ini:

```
This query creates a table without enabling Row Level Security.
Clients using anon or authenticated keys may be able to access users.
```

Peringatan itu benar, dan berkas SQL di halaman ini sudah menanganinya. Tiga perintah terakhir pada `01-schema.sql` mengaktifkan Row Level Security pada ketiga tabel:

```sql
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_2d ENABLE ROW LEVEL SECURITY;
ALTER TABLE katalog_data_3d ENABLE ROW LEVEL SECURITY;
```

Jadi bila Anda menjalankan berkas itu seluruhnya, **tidak ada yang perlu Anda putuskan**. Peringatan itu muncul karena Supabase memeriksa perintah `CREATE TABLE` saja, dan tidak melihat perintah `ALTER TABLE` yang menyusul.

### Mengapa ini perlu

Supabase menyediakan REST API otomatis untuk setiap tabel di schema `public`. Kunci `anon` yang dipakai API itu memang dirancang untuk dipakai di sisi peramban, sehingga nilainya tidak dianggap rahasia. Yang mencegah penyalahgunaan adalah Row Level Security, bukan kerahasiaan kunci tersebut.

Diuji pada project Supabase sungguhan:

| Keadaan | Hasil |
|---|---|
| Sebelum RLS | Peran `anon` dapat membaca kolom `password`, dan memiliki izin `SELECT`, `INSERT`, `UPDATE`, `DELETE`, serta `TRUNCATE` pada tabel `users` |
| Sesudah RLS | Peran `anon` dan `authenticated` tidak melihat satu baris pun |
| Aplikasi | Tetap berjalan normal, karena koneksi Prisma memakai peran `postgres` yang merupakan pemilik tabel, dan pemilik tabel melewati RLS secara bawaan |

Artinya tanpa RLS, siapa pun yang memegang kunci `anon` dapat membaca seluruh akun beserta hash kata sandinya, dan dapat mengubah atau menghapusnya.

RLS tanpa policy berarti menutup akses bagi semua peran selain pemilik. Itu memang yang diinginkan di sini: seluruh akses data dilakukan lewat API aplikasi sendiri, yang sudah memeriksa token dan peran pengguna.

### View juga perlu ditangani

Mengaktifkan RLS pada tabel saja belum cukup. Berkas SQL ini juga membuat satu view, `v_katalog_2d_lengkap`, yang menggabungkan katalog 2D dengan data penulisnya.

Bawaannya, view di PostgreSQL berjalan dengan hak **pemiliknya**, bukan hak pemanggilnya. Karena pemilik tabel melewati RLS, view membuat kebijakan pada tabel di bawahnya tidak berlaku. Diuji pada project Supabase sungguhan, dengan satu baris berakses `private`:

| Yang dibaca | Peran `anon` melihat |
|---|---|
| Tabel `katalog_data_2d` | kosong, 0 baris |
| View `v_katalog_2d_lengkap` | **1 baris, termasuk yang berakses `private`**, beserta nama dan email penulisnya |

Jadi tanpa penanganan khusus, seluruh isi katalog masih dapat dibaca lewat view itu.

Karena itulah view dibuat memakai `security_invoker = true`, sehingga berjalan dengan hak pemanggilnya dan RLS ikut berlaku. Opsi ini tersedia sejak PostgreSQL 15, dan Supabase memakai PostgreSQL 15 atau lebih baru.

Setelah perbaikan:

| Peran | Tabel | View |
|---|---|---|
| `anon` | 0 baris | 0 baris |
| `authenticated` | 0 baris | 0 baris |
| `postgres` (pemilik) | 1 baris | 1 baris |

Aplikasi tidak terpengaruh, karena koneksi Prisma memakai peran `postgres`, dan view itu sendiri tidak dipanggil kode aplikasi mana pun.

### Bila tabel Anda dibuat sebelum bagian ini ada

Jalankan `07-aktifkan-rls.sql`. Berkas itu hanya mengaktifkan RLS, tanpa mengubah data.

### Periksa hasilnya

Jalankan di SQL Editor. Ketiga baris harus bernilai `true`:

```sql
SELECT c.relname AS objek, c.relkind AS jenis,
       c.relrowsecurity AS rls, c.reloptions AS opsi
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d', 'v_katalog_2d_lengkap')
ORDER BY c.relname;
```

Harapannya: ketiga tabel bernilai `rls = true`, dan view memuat `security_invoker=true` pada kolom `opsi`.

## Berkas SQL Lainnya

Selain berkas di atas, folder `sql/` pada repositori Anda memuat tiga berkas yang dipakai pada keperluan tertentu. Ketiganya tidak diperlukan untuk menyiapkan database dan menjalankan portal, tetapi berguna saat Anda menemui masalah.

| Berkas | Untuk apa | Kapan dipakai |
|---|---|---|
| `04-postgis-supabase.sql` | Memasang PostGIS di Supabase, termasuk mengatasi `search_path` yang tidak dapat diubah lewat `ALTER DATABASE` | Saat mengerjakan data spasial di Hari 2 |
| `05-diagnosa-constraint.sql` | Memeriksa sepuluh hal sekaligus, lalu menyimpulkan gejala mana menunjuk ke perbaikan mana | Saat ada kegagalan constraint yang sulit dilacak |
| `06-migrasi-peran-viewer.sql` | Memindahkan akun berperan `editor` menjadi `viewer`, dan menyesuaikan nilai bawaan serta `CHECK` | Hanya bila database Anda dibuat sebelum peran `editor` dihapus |
| `07-aktifkan-rls.sql` | Mengaktifkan Row Level Security pada tabel dan view | Hanya bila tabel Anda dibuat sebelum perintah itu ada di `01-schema.sql` |

Penjelasan lengkap tiap berkas ada di `sql/README.md` pada repositori Anda.

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

Seluruh langkah di bawah dikerjakan di laptop dan di SQL Editor Supabase. Tidak ada yang perlu dijalankan di VM.

### 1. Buat hash baru

Di folder repositori Anda:

```bash
node scripts/hash-password.mjs
```

Skrip itu meminta kata sandi **tanpa menampilkannya di layar**, dan tanpa menyimpannya ke riwayat terminal. Salin hash yang tercetak, yang dimulai dengan `$2b$12$`.

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

Berarti `02-seed-super-admin.sql` belum pernah dijalankan. Buka berkas itu, ganti kedua penandanya, lalu jalankan seluruh isinya di SQL Editor. Langkahnya ada pada bagian [Membuat Akun Super Admin](#membuat-akun-super-admin) di halaman ini.

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

1. **`DATABASE_URL` salah.** Pesan galatnya menyebut `Can't reach database server`. Periksa bagian catatan tentang `DATABASE_URL` pada [Tahap 5 halaman Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project).
2. **Tabel belum ada.** Jalankan `03-periksa.sql`. Hasilnya harus menampilkan tiga tabel.
3. **Akun belum aktif.** Jalankan di SQL Editor:

    ```sql
    SELECT email, role, is_active FROM users;
    UPDATE users SET is_active = true WHERE email = 'email-anda';
    ```

4. **Kata sandi tidak cocok.** Periksa hash yang tersimpan:

    ```bash
    node scripts/hash-password.mjs --cek '<hash-dari-kolom-password>'
    ```

5. **Pesan menyebut tabel tidak ditemukan.** Prisma membaca schema `public`. Pastikan ketiga tabel dibuat di sana.
6. **Kegagalan constraint yang sulit dilacak.** Jalankan `05-diagnosa-constraint.sql`. Berkas itu memeriksa sepuluh hal sekaligus dan diakhiri tabel keputusan: gejala mana menunjuk ke perbaikan mana.
