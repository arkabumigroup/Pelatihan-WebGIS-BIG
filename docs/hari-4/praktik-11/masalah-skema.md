# Bila Ada Masalah

Bagian terakhir [Skema Database](/hari-4/praktik-11/skema-database). Halaman ini dipakai hanya kalau ada yang tidak berjalan lancar pada halaman [Menjalankan Berkas SQL](/hari-4/praktik-11/menjalankan-skema).

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

Sebabnya, sejak PostgreSQL 18 batasan `NOT NULL` ikut tercatat di `pg_constraint` dengan kode `n`. Pada versi sebelumnya, `NOT NULL` disimpan di `pg_attribute` dan tidak muncul pada query itu. Karena itu kolom `jumlah` pada bagian 2 `03-periksa.sql` lebih kecil di Supabase, sedangkan `unique_`, `foreign_key`, dan `check_` bernilai sama di kedua versi.

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

Berarti `02-seed-super-admin.sql` belum pernah dijalankan. Buka file itu, ganti kedua penandanya, lalu jalankan seluruh isinya di SQL Editor. Langkahnya ada pada bagian [Membuat Akun Super Admin](/hari-4/praktik-11/menjalankan-skema#membuat-akun-super-admin) di halaman Menjalankan Berkas SQL.

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
