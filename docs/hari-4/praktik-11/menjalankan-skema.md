# Menjalankan Berkas SQL

Bagian kedua [Skema Database](/hari-4/praktik-11/skema-database). Database dan schema `gis` sudah disiapkan, jadi sekarang ketiga berkas SQL dijalankan lewat SQL Editor.

Ketiganya dijalankan berurutan. Jangan menyalin sebagian, karena `01-schema.sql` dan `02-seed-super-admin.sql` memakai `BEGIN` dan `COMMIT` yang harus berpasangan.

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

Bagian 4 memeriksa seluruh **tiga belas** constraint yang dibuat `01-schema.sql`, lengkap dengan jenisnya. Bagian 5 menutupnya dengan satu baris kesimpulan: berapa yang terpasang, berapa yang hilang, dan apakah semuanya lengkap. Satu baris itu yang dibaca, bukan hasil bagian 4 yang kosong.

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

-- 4. Constraint yang seharusnya ada tetapi belum terpasang, atau terpasang dengan
-- jenis yang salah. Daftar di bawah memuat SELURUH constraint yang dibuat
-- 01-schema.sql, yaitu tiga belas buah: users tiga, katalog_data_2d empat,
-- katalog_data_3d enam. Jenisnya ikut diperiksa, sehingga constraint yang namanya
-- benar tetapi jenisnya salah juga ikut ketahuan.
-- Harapan: hasilnya kosong.
SELECT '4. Constraint yang hilang atau salah jenis (harus kosong)' AS bagian;
WITH seharusnya(tabel, nama, kode) AS (
    VALUES
      ('users', 'users_pkey', 'p'),
      ('users', 'users_email_key', 'u'),
      ('users', 'users_role_valid', 'c'),
      ('katalog_data_2d', 'katalog_data_2d_pkey', 'p'),
      ('katalog_data_2d', 'katalog_data_2d_layer_name_key', 'u'),
      ('katalog_data_2d', 'katalog_data_2d_akses_valid', 'c'),
      ('katalog_data_2d', 'katalog_data_2d_author_fkey', 'f'),
      ('katalog_data_3d', 'katalog_data_3d_pkey', 'p'),
      ('katalog_data_3d', 'katalog_data_3d_akses_valid', 'c'),
      ('katalog_data_3d', 'katalog_data_3d_tipe_file_valid', 'c'),
      ('katalog_data_3d', 'katalog_data_3d_lat_range', 'c'),
      ('katalog_data_3d', 'katalog_data_3d_lon_range', 'c'),
      ('katalog_data_3d', 'katalog_data_3d_author_fkey', 'f')
),
ada AS (
    -- contype bertipe internal "char", bukan text, sehingga perlu dicor sebelum
    -- digabungkan dengan teks. Tanpa cor, PostgreSQL menolaknya dengan
    -- "operator is not unique: unknown || char".
    SELECT c.relname AS tabel, con.conname AS nama, con.contype::text AS kode
    FROM pg_constraint con
    JOIN pg_class c     ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d')
)
SELECT s.tabel,
       s.nama AS nama_constraint,
       CASE WHEN a.nama IS NULL
            THEN 'BELUM TERPASANG'
            ELSE 'terpasang, tetapi jenisnya ' || a.kode || ' dan seharusnya ' || s.kode
       END AS keadaan
FROM seharusnya s
LEFT JOIN ada a ON a.tabel = s.tabel AND a.nama = s.nama
WHERE a.nama IS NULL OR a.kode <> s.kode
ORDER BY s.tabel, s.nama;

-- 5. Kesimpulan dalam satu baris, supaya tidak perlu menafsirkan hasil bagian 4
-- yang kosong. Harapan: terpasang 13, hilang 0, dan kesimpulannya LENGKAP.
-- Jenis yang dihitung hanya p, u, f, dan c, supaya batasan NOT NULL yang ikut
-- tercatat di PostgreSQL 18 ke atas tidak mengubah angkanya.
SELECT '5. Kesimpulan' AS bagian;
WITH jumlah AS (
    SELECT count(*) AS terpasang
    FROM pg_constraint con
    JOIN pg_class c     ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d')
      AND con.contype IN ('p', 'u', 'f', 'c')
)
SELECT terpasang,
       13 - terpasang AS hilang,
       13 AS seharusnya,
       CASE WHEN terpasang = 13
            THEN 'LENGKAP, tidak ada constraint yang hilang'
            ELSE 'ADA YANG HILANG, jalankan sql/01-schema.sql lalu periksa bagian 4'
       END AS kesimpulan
FROM jumlah;

-- Ketiga belas constraint itu berasal dari 01-schema.sql. Bila bagian 4 berisi
-- baris, jalankan berkas itu: aman diulang dan hanya menambahkan yang belum ada.
```

Bila ada yang tidak berjalan lancar, lanjutkan ke halaman [Bila Ada Masalah](/hari-4/praktik-11/masalah-skema).
