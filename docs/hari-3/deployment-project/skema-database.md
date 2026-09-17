# Skema Database

Halaman ini memuat tiga berkas SQL yang membuat dan memeriksa tabel database. Isinya ditampilkan lengkap supaya dapat disalin langsung dari sini.

Berkas aslinya juga ada di folder `sql/` pada repositori Anda, dan isinya sama. Bila Anda sudah menjalankan [Tahap 1 hingga 2 pada halaman Konfigurasi Project](/hari-3/deployment-project/konfigurasi-project), berkas itu sudah ada di laptop Anda.

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

## Tiga Tabel yang Dibuat

| Tabel | Isinya |
|---|---|
| `users` | Akun pengguna, dipakai untuk login dan pengaturan hak akses |
| `katalog_data_2d` | Metadata layer peta 2D |
| `katalog_data_3d` | Metadata model 3D |

Kolomnya sudah dicocokkan dengan kode aplikasi, jadi jangan mengubah nama atau tipe kolomnya.

## 01-schema.sql

Aman dijalankan lebih dari sekali, karena memakai `CREATE TABLE IF NOT EXISTS`.

```sql
-- =====================================================================
-- Management Database Non Spasial
-- Membuat tiga tabel: users, katalog_data_2d, dan katalog_data_3d.
--
-- Cara pakai: buka SQL Editor di dashboard Supabase, salin SELURUH isi
-- berkas ini, tempel, lalu klik Run. Penjelasan SQL Editor ada di
-- sql/README.md.
--
-- Berkas ini idempoten: CREATE TABLE IF NOT EXISTS tidak menghapus data
-- yang sudah ada, jadi aman dijalankan lebih dari sekali.
-- Untuk mulai dari nol, hapus dulu ketiga tabelnya. Perintahnya ada pada
-- bagian "Mengosongkan Tabel" di sql/README.md.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- users
-- Sumber kebenaran untuk autentikasi. Kolom mengikuti pemakaian di
-- Praktik 9 (lib/auth) dan Praktik 10 (NextAuth).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id     uuid         PRIMARY KEY,
    nama        varchar(100) NOT NULL,
    email       varchar(150) NOT NULL,
    password    varchar(255) NOT NULL,
    role        varchar(20)  NOT NULL DEFAULT 'editor',
    is_active   boolean      NOT NULL DEFAULT false,
    created_at  timestamptz  NOT NULL DEFAULT now(),

    -- Baseline nilai. Validasi di Praktik 9 hanya ada di kode aplikasi,
    -- sehingga batasan berikut ditambahkan di database supaya data tidak
    -- bisa masuk lewat jalur lain, misalnya import CSV atau klien database.
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_role_valid
        CHECK (role IN ('viewer', 'editor', 'admin', 'super_admin'))
);

COMMENT ON COLUMN users.password IS
    'Hash bcrypt ($2a$/$2b$), BUKAN password asli. Seed manual lewat 02-seed-super-admin.sql.';

-- ---------------------------------------------------------------------
-- katalog_data_2d
-- Kolom mengikuti "Praktik 6/.../File latihan/katalog_data_2d.csv".
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- katalog_data_3d
-- Kolom mengikuti "Praktik 8/.../File latihan/katalog_data_3d.csv".
-- ---------------------------------------------------------------------
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
    -- Aplikasi tidak pernah mengirim kolom ini saat menyimpan data 3D
    -- (lihat src/app/api/katalog-data-3d/create/route.js). Tanpa nilai
    -- bawaan, setiap penyimpanan gagal dengan
    -- "null value in column tipe_file violates not-null constraint".
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

-- View baca-saja: join yang sama dengan yang dilakukan kode API, supaya
-- query ad-hoc tidak perlu menuliskan join berulang.
CREATE OR REPLACE VIEW v_katalog_2d_lengkap AS
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

-- ---------------------------------------------------------------------
-- Verifikasi (jalankan terpisah setelah COMMIT)
-- ---------------------------------------------------------------------
-- Harapan: tiga tabel, masing-masing punya primary key, dan
-- katalog_data_2d punya satu foreign key (contype 'f') ke users.
--
--   SELECT c.relname AS tabel, con.contype AS jenis, con.conname AS nama
--   FROM pg_constraint con
--   JOIN pg_class c     ON c.oid = con.conrelid
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--   WHERE n.nspname = current_schema()
--     AND c.relname IN ('users', 'katalog_data_2d', 'katalog_data_3d')
--   ORDER BY c.relname, con.contype;
--
--   -- Harus kosong. Kalau ada isinya, CSV belum selesai dibersihkan.
--   SELECT k.data_2d_id, k.author
--   FROM katalog_data_2d k
--   LEFT JOIN users u ON u.user_id = k.author
--   WHERE k.author IS NOT NULL AND u.user_id IS NULL;
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
-- =====================================================================
-- seed akun super admin
--
-- Menggantikan langkah manual pada modul Praktik 9: jalankan potongan JS
-- di REPL node, salin hash-nya, lalu tempel ke kolom password lewat SQL Editor.
-- Cara itu gampang salah ketik dan tidak bisa diulang orang lain.
--
-- Berkas ini memakai SQL biasa tanpa meta-command, sehingga bisa
-- ditempel apa adanya ke SQL Editor Supabase.
--
-- =====================================================================
-- LANGKAH 1. Buat hash kata sandi
-- =====================================================================
--
-- bcrypt hanya ada di Node, bukan di PostgreSQL, jadi hash dibuat lebih
-- dahulu. Jalankan dari terminal:
--
--   node scripts/hash-password.mjs
--
-- Skrip itu meminta kata sandi lewat prompt tersembunyi, sehingga kata
-- sandi aslinya tidak masuk riwayat terminal. Hasilnya satu baris yang
-- diawali $2b$12$.
--
-- =====================================================================
-- LANGKAH 2. Ganti dua nilai di Langkah 3, lalu jalankan berkas ini
-- =====================================================================
--
-- Di SQL Editor Supabase: tempel seluruh isi berkas ini, ganti kedua
-- nilai pada blok DO di bawah lebih dahulu, lalu klik Run.
--
-- Nilai yang salah ditolak penjagaan di dalam blok, sehingga kata sandi
-- polos tidak mungkin masuk ke kolom password.
--
-- =====================================================================
-- LANGKAH 3. Ganti, lalu jalankan
-- =====================================================================

DO $$
DECLARE
    email_admin text := '<ISI_EMAIL_DI_SINI>';
    hash_admin  text := '<ISI_HASH_DI_SINI>';
BEGIN
    -- Penjagaan diperiksa dari SISA PENANDA, bukan dengan membandingkan
    -- nilai terhadap penandanya sendiri. Cara itu penting: penggantian teks
    -- sederhana ikut mengubah string pembandingnya, sehingga perbandingan
    -- apa adanya justru menolak nilai yang sudah benar.
    IF email_admin LIKE '%<ISI_EMAIL%' THEN
        RAISE EXCEPTION 'Email belum diisi. Ganti nilai <ISI_EMAIL_DI_SINI> pada berkas ini.';
    END IF;

    IF hash_admin LIKE '%<ISI_HASH%' THEN
        RAISE EXCEPTION 'Hash belum diisi. Buat dulu dengan: node scripts/hash-password.mjs';
    END IF;

    -- Menolak nilai yang bukan hash bcrypt. Tanpa ini, salah paste kata
    -- sandi asli akan membuat akun tidak bisa login sekaligus menyimpan
    -- kata sandi polos di database.
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

-- =====================================================================
-- VERIFIKASI
-- =====================================================================

SELECT 'Akun super admin' AS bagian;
SELECT user_id, nama, email, role, is_active, left(password, 7) AS awalan_hash
FROM users
WHERE role = 'super_admin';

-- Harapan: tepat satu baris, is_active true, awalan_hash diawali $2a$ atau $2b$.
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
Halaman `/register` pada aplikasi selalu menghasilkan peran `editor` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa lahir dari `02-seed-super-admin.sql`. Jadi berkas itu wajib dijalankan, bukan pilihan.
:::

## 03-periksa.sql

Berkas ini hanya berisi perintah `SELECT`. Tidak mengubah apa pun, jadi aman dijalankan kapan saja, termasuk berkali-kali.

```sql
-- =====================================================================
-- periksa constraint yang benar-benar terpasang
--
-- Tempel seluruh isi berkas ini ke SQL Editor Supabase, lalu klik Run.
-- Semua di sini hanya SELECT. Tidak mengubah apa pun.
--
-- Jangan mengandalkan tampilan tabel di dashboard untuk memeriksa ini.
-- Tab itu tidak menampilkan semua jenis constraint dengan cara yang sama,
-- dan pada PostgreSQL 18 definisi NOT NULL tersimpan di pg_constraint
-- sehingga penamaannya berbeda dari dugaan. Query di bawah membaca
-- katalog sistem langsung, jadi hasilnya pasti.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Semua constraint di tiga tabel, apa adanya
--
-- Harapan setelah sql/01-schema.sql dijalankan:
--   users            10 baris  (p, u, c, dan 7 NOT NULL)
--   katalog_data_2d   8 baris
--   katalog_data_3d   8 baris
--
-- Kode jenis: p primary key, u unique, f foreign key, c check, n not null
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 2. Ringkasan: berapa constraint per tabel
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 3. Kolom mana yang belum NOT NULL
--
-- Harapan: hasilnya kosong. Kolom yang muncul di sini belum dikunci,
-- sehingga NULL bisa masuk.
-- ---------------------------------------------------------------------
SELECT '3. Kolom yang belum NOT NULL (harus kosong)' AS bagian;
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'katalog_data_2d', 'katalog_data_3d')
  AND is_nullable = 'YES'
ORDER BY table_name, column_name;

-- ---------------------------------------------------------------------
-- 4. Constraint yang seharusnya ada tetapi belum terpasang
--
-- Inilah yang paling berguna: daftar periksa yang langsung menyebut nama
-- constraint yang hilang, sehingga Anda tahu pernyataan mana yang perlu
-- dijalankan.
-- ---------------------------------------------------------------------
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

-- Bila bagian 4 berisi baris, jalankan sql/01-schema.sql. Berkas
-- itu aman dijalankan berulang dan hanya menambahkan yang belum ada.
```

## Bila Login Gagal

Periksa berurutan:

1. **`DATABASE_URL` salah.** Pesan galatnya menyebut `Can't reach database server`. Periksa bagian catatan tentang `DATABASE_URL` pada [Tahap 5 halaman Konfigurasi Project](/hari-3/deployment-project/konfigurasi-project).
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
