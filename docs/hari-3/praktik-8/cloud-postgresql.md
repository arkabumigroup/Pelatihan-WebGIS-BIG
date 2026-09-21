# Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver

## Setup Cloud PostgreSQL + PostGIS + Koneksi Dbeaver

1. Buka Supabase [https://supabase.com/](https://supabase.com/)
    
![image.png](cloud-postgresql/image.png)
    
2. SignUp untuk register akun baru jika belum punya
    
![image.png](cloud-postgresql/image%201.png)
    
3. Setelah verifikasi email akan diminta untuk membuat organization, pilih type personal dan plan free
    
![image.png](cloud-postgresql/image%202.png)
    
4. Setelah membuat organization akan muncul tampilan pembuatan project, biarkan semua pilihan default, buat database password dan simpan password tersebut
    
![image.png](cloud-postgresql/image%203.png)
    
5. Berikut adalah tampilan awal jika project sudah dibuat
    
![image.png](cloud-postgresql/image%204.png)
    
6. Klik Connect pada menu di sebelah atas, maka detail connection untuk melakukan koneksi ke database ini akan muncul, pilih bagian ORM Third-party library
    
![image.png](cloud-postgresql/image%205.png)
    
7. Di bagian env local ada variabel bernama `DATABASE_URL`. Variabel itu berisi informasi koneksi ke database. Simpan nama user dan host yang terlihat di sana.
    
::: warning Tiga bentuk connection string, dan syaratnya
Supabase menampilkan tiga bentuk alamat koneksi. Ketiganya dapat dipakai, dengan satu syarat pada bentuk kedua.

| Bentuk | Port | Syarat |
|---|---|---|
| Session pooler | 5432 | Tidak ada, langsung bekerja |
| Transaction pooler | 6543 | **Wajib** menambahkan `?pgbouncer=true` di akhir alamat |
| Koneksi langsung `db.<ref>.supabase.co` | 5432 | Sering gagal pada project baru, karena hostnya hanya punya alamat IPv6 |

Yang disarankan **Session pooler pada port 5432**, karena paling sedikit syaratnya.

```bash
DATABASE_URL="postgresql://postgres.aefvxqjmwtbeysjyfzgo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Bila memakai Transaction pooler, contohnya seperti ini. Perhatikan `?pgbouncer=true` di akhir:

```bash
DATABASE_URL="postgresql://postgres.aefvxqjmwtbeysjyfzgo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Halaman connection string Supabase juga menampilkan `DIRECT_URL`. Untuk aplikasi ini, **hanya `DATABASE_URL` yang dipakai**, karena tabel dibuat lewat skrip di folder `sql/`, bukan lewat `prisma migrate`.

Ganti `[YOUR-PASSWORD]` dengan kata sandi database yang Anda buat pada langkah 4. Kalau kata sandinya memuat karakter khusus seperti `@` atau `#`, tulis dalam bentuk persen: `%40` dan `%23`.
:::

::: warning Pilih Session pooler, bukan Transaction pooler
Supabase menampilkan beberapa bentuk connection string. Yang bekerja dengan Prisma adalah **Session pooler pada port 5432**.

| Bentuk | Port | Hasil |
|---|---|---|
| `db.<ref>.supabase.co` | 5432 | Gagal. Pada project baru host ini hanya punya alamat IPv6 |
| `aws-0-<region>.pooler.supabase.com` | 6543 | Gagal. Transaction pooler tidak mendukung prepared statement yang dipakai Prisma, sehingga muncul `prepared statement already exists` |
| `aws-0-<region>.pooler.supabase.com` | **5432** | Bekerja. Ini yang dipakai |

Perhatikan juga nama penggunanya, yaitu `postgres.<ref>`, bukan `postgres` saja.

Contoh bentuk yang benar:

```bash
DATABASE_URL="postgresql://postgres.aefvxqjmwtbeysjyfzgo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Ganti `[YOUR-PASSWORD]` dengan kata sandi database yang Anda buat pada langkah 4. Kalau kata sandinya memuat karakter khusus seperti `@` atau `#`, tulis dalam bentuk persen: `%40` dan `%23`.
:::
    
8. Buka Dbeaver kemudian buat New Database Connection ke database yang sudah dibuat dengan connection detail yang ada di project supabase
    
![image.png](cloud-postgresql/image%206.png)
    
9. Isikan detail koneksi dengan host dan nama user yang sudah kita simpan dari supabase, masukan juga Password yang sudah kita buat di awal pembuatan project. Lalu klik test connection
    
![image.png](cloud-postgresql/image%207.png)
    
10. Database sudah terhubung menggunakan Dbeaver
    
![image.png](cloud-postgresql/image%208.png)
    
![](cloud-postgresql/image8.png)
    
11. Kembali ke web supabase di halaman overview project, klik Database yang ada di Menu sebelah kiri
    
![image.png](cloud-postgresql/image%209.png)
    
12. Setelah itu klik Extensions
    
![image.png](cloud-postgresql/image%2010.png)
    
13. Cari extension postgis dengan mengetik postgis di kolom pencarian kemudian enable extension bernama postgis saja
    
![image.png](cloud-postgresql/image%2011.png)
    
14. Setelah klik enable akan ada pilihan untuk memilih schema. **Pilih `public`, jangan membuat schema baru.**

    PostGIS harus berada di schema `public`. Schema itulah yang diperiksa GeoServer untuk menemukan fungsi `postgis_lib_version()`, dan schema itu juga ada pada `search_path` yang dipakai aplikasi.

    ```sql
    CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
    ```

    Selanjutnya buat schema `gis` secara terpisah. Schema ini menampung tabel spasial yang dibuat aplikasi, bukan extension-nya:

    ```sql
    CREATE SCHEMA IF NOT EXISTS gis;
    ```

    ::: warning PostGIS di public, tabel spasial di gis
    Keduanya berbeda keperluan dan keduanya wajib ada.

    | Schema | Isinya |
    |---|---|
    | `public` | Extension PostGIS, tempat tipe `geometry` berada |
    | `gis` | Tabel spasial yang dibuat aplikasi saat layer diunggah |

    Bila PostGIS dipasang di `gis`, aplikasi masih bekerja karena `gis` ada pada `search_path`-nya, tetapi GeoServer dapat gagal menemukan fungsinya. Susunan yang dipakai sepanjang pelatihan ini adalah PostGIS di `public` dan tabel di `gis`, dan itulah yang diuji.

    Bila PostGIS belum ada di salah satu schema itu, unggahan layer gagal dengan pesan `type "geometry" does not exist`.
    :::
    
![image.png](cloud-postgresql/image%2012.png)
    
15. Jika berhasil klik Schema Visualizer kemudian ganti schema menjadi gis maka tampilan akan seperti ini
    
![image.png](cloud-postgresql/image%2013.png)
    

## **Membuat Tabel dengan SQL Editor**

Setelah database terhubung, tabelnya belum ada. Bagian ini membuat tiga tabel yang dipakai aplikasi: `users`, `katalog_data_2d`, dan `katalog_data_3d`.

Semuanya dikerjakan lewat **SQL Editor Supabase**. Anda tidak perlu memasang aplikasi apa pun.

### Apa Itu SQL Editor

SQL Editor adalah halaman di dalam dashboard Supabase untuk menjalankan perintah SQL langsung ke database Anda. Anggap saja seperti terminal khusus database, tetapi berbentuk halaman web.

Cara membukanya:

1. Buka project Anda di [supabase.com/dashboard](https://supabase.com/dashboard).
2. Pada menu kiri, klik **SQL Editor**.
3. Halaman itu punya kotak besar untuk menulis atau menempel perintah, tombol **Run** di kanan bawah, dan daftar riwayat perintah di sisi kiri.

![Menu SQL Editor pada sidebar kiri dashboard Supabase](cloud-postgresql/image%2015.png)

Dua tombol yang perlu dibedakan:

| Tombol | Gunanya |
|---|---|
| **Run** | Menjalankan seluruh isi kotak sekaligus |
| **Run selected** | Menjalankan hanya teks yang Anda blok |

Hasil perintah muncul di panel bawah. Untuk `CREATE TABLE`, hasilnya hanya keterangan bahwa perintah berhasil. Untuk `SELECT`, hasilnya berupa tabel.

::: tip Dua cara membuat tabel di Supabase
Supabase menyediakan dua jalan, dan keduanya sah:

- **Table Editor**, yaitu antarmuka klik untuk membuat kolom satu per satu. Cocok untuk tabel sederhana, tetapi rawan berbeda antar peserta karena setiap orang menentukan tipe kolom sendiri.
- **SQL Editor**, yaitu menempel perintah SQL. Semua peserta menjalankan perintah yang sama, sehingga bentuk tabelnya pasti seragam.

Latihan ini memakai SQL Editor supaya tabel Anda sama dengan tabel peserta lain dan sama dengan yang diharapkan kode aplikasi.
:::

### Tiga Tabel yang Dibuat

| Tabel | Isinya |
|---|---|
| `users` | Akun pengguna, dipakai untuk login dan pengaturan hak akses |
| `katalog_data_2d` | Metadata layer peta 2D |
| `katalog_data_3d` | Metadata model 3D |

Kolomnya sudah dicocokkan dengan kode aplikasi, jadi jangan mengubah nama atau tipe kolomnya.

### Cara Menjalankan Skripnya

Skripnya tersedia di repositori proyek Anda, di folder `sql/`. Urutannya:

| # | Berkas | Yang dilakukan |
|---|---|---|
| 1 | `01-schema.sql` | Membuat ketiga tabel |
| 2 | `02-seed-super-admin.sql` | Membuat satu akun super admin untuk login pertama |
| 3 | `03-periksa.sql` | Memeriksa hasilnya, hanya membaca |

Untuk tiap berkas, lakukan hal yang sama:

1. Buka berkasnya di editor kode.
2. Salin **seluruh** isinya. Jangan sebagian, karena beberapa berkas memakai `BEGIN` dan `COMMIT` yang harus berpasangan.
3. Tempel ke SQL Editor Supabase.
4. Klik **Run**.
5. Pastikan panel hasil tidak memuat kata `ERROR`.

Penjelasan lebih rinci tiap berkas ada di `sql/README.md` pada repositori proyek.

### Membuat Akun Super Admin

`02-seed-super-admin.sql` tidak bisa langsung dijalankan. Berkas itu memuat dua penanda yang harus Anda isi lebih dahulu, supaya kata sandi tidak pernah ditulis dalam bentuk asli.

**Langkah 1.** Di folder proyek, jalankan:

```bash
node scripts/hash-password.mjs
```

Skrip itu meminta kata sandi lewat prompt tersembunyi, jadi kata sandinya tidak muncul di layar dan tidak masuk riwayat terminal. Hasilnya satu baris berawalan `$2b$12$`. Salin baris itu.

**Langkah 2.** Buka `sql/02-seed-super-admin.sql`, lalu ganti dua penanda:

```sql
email_admin text := '<ISI_EMAIL_DI_SINI>';
hash_admin  text := '<ISI_HASH_DI_SINI>';
```

**Langkah 3.** Salin seluruh isi berkas ke SQL Editor, lalu Run. Hasilnya:

```
NOTICE: Akun super admin nama@email.com siap dipakai.
```

Email dan kata sandi itulah yang dipakai untuk masuk ke portal.

::: warning Peserta yang mendaftar sendiri tidak menjadi super admin
Halaman `/register` pada aplikasi selalu menghasilkan peran `viewer` dan status belum aktif. Itu memang disengaja, supaya tidak ada yang bisa menaikkan perannya sendiri.

Akun super admin hanya bisa lahir dari `02-seed-super-admin.sql`. Jadi berkas itu wajib dijalankan, bukan pilihan.
:::

## **Koneksi PostgreSQL Supabase dari QGIS**

1. Buka QGIS kemudian buat koneksi database baru
    
![image.png](cloud-postgresql/image%2014.png)
    
2. Kemudian masukkan credential dari Supabase anda
    
![](cloud-postgresql/image3.png)
    
3. Credential Supabase yang anda gunakan bukanlah super user seperti saat anda menggunakan PostgreSQL lokal, oleh karena itu perlu pengaturan tambahan dari Supabase. Buka Supabase kemudian pergi ke SQL Editor
    
![image.png](cloud-postgresql/image%2015.png)
    
4. Jalankan perintah berikut di SQL Editor
    
    ```jsx
    -- 1. Buat wrapper di schema PUBLIC
    CREATE OR REPLACE FUNCTION public.addgeometrycolumn(
    		catalog_name character varying,
    		schema_name character varying,
    		table_name character varying,
    		column_name character varying,
    		new_srid integer,
    		new_type character varying,
    		new_dim integer
    ) RETURNS text AS $$
    BEGIN
    		RETURN extensions.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    EXCEPTION WHEN OTHERS THEN
    		RETURN public.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    END;
    $$ LANGUAGE plpgsql;
    -- 2. Buat wrapper di schema GIS
    CREATE OR REPLACE FUNCTION gis.addgeometrycolumn(
        catalog_name character varying,
        schema_name character varying,
        table_name character varying,
        column_name character varying,
        new_srid integer,
        new_type character varying,
        new_dim integer
    ) RETURNS text AS $$
    BEGIN
        RETURN extensions.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    EXCEPTION WHEN OTHERS THEN
        RETURN public.AddGeometryColumn(schema_name, table_name, column_name, new_srid, new_type, new_dim);
    END;
    $$ LANGUAGE plpgsql;
    
    GRANT EXECUTE ON FUNCTION public.addgeometrycolumn TO PUBLIC, postgres, anon, authenticated, service_role;
    ```

![](cloud-postgresql/image20.png)

5. Buat layer baru sama seperti di local database
    
![image.png](cloud-postgresql/image%2016.png)