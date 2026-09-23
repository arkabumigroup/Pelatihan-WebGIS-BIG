# Isi File .env

Bagian ketiga [Konfigurasi Project](/hari-4/praktik-11/konfigurasi-project). File `.env` memuat seluruh nilai yang dibutuhkan container saat berjalan, dan inilah bagian terpanjang dari penyiapan proyek.

## Tahap 5. Isi file .env

`DATABASE_URL` dari Tahap 2 dan `JWT_SECRET` dari perintah acak sekarang diisi ke dalam file `.env`. Tahap ini penting karena aplikasi tidak bisa login tanpa file ini.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

### Salin file contoh

```bash
cp .env.example .env
```

File `.env.example` adalah contoh yang di-commit ke GitHub, sedangkan `.env` yang berisi nilai asli tidak pernah di-commit.

### Isi bagian WAJIB

Buka `.env`, lalu isi lima nilai berikut.

| Variabel | Dari mana |
|---|---|
| `DATABASE_URL` | Tombol **Connect** di dashboard Supabase, pilih ORM/Prisma, lalu salin. Lihat catatan di bawah |
| `JWT_SECRET` | Tombol **Buat nilai acak** pada [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas) |
| `NEXTAUTH_SECRET` | Tombol yang sama, pada baris berikutnya. Nilainya sudah dipastikan berbeda |
| `NEXTAUTH_URL` | `http://localhost:3000/portal` untuk sekarang |
| `ADMIN_CONTACT_EMAIL` | Email Anda sendiri |

::: tip Bungkus setiap nilai dengan tanda kutip ganda
Tulis `NAMA_VARIABEL="nilainya"`, bukan `NAMA_VARIABEL=nilainya`.

Berkas `.env` ini bukan hanya dibaca aplikasi. Pada [Tahap 1b halaman Menyiapkan GeoServer](/hari-4/praktik-11/siapkan-geoserver-vm#tahap-1b-uji-koneksi-dari-vm) isinya dimuat ke dalam shell dengan `. ./.env`, dan perintah itu **menjalankan berkasnya sebagai kode shell**. Nilai yang tidak dikutip dan memuat spasi, `#`, `$`, atau `&` akan terpotong atau dibaca sebagai perintah lain, sehingga variabelnya terisi keliru tanpa pesan error yang menjelaskan sebabnya.

Tanda kutipnya juga tidak mengganggu aplikasi maupun Docker Compose, karena keduanya membuang kutip yang mengapit nilai.
:::

Dua nilai acak itu dibuat di [Kit Identitas Peserta](/hari-4/praktik-11/kit-identitas), satu halaman dengan identitas peserta. Nilainya tersimpan di browser Anda, jadi tetap sama setelah halaman dimuat ulang dan dapat dibuka lagi kapan saja tanpa membuat yang baru.

Bila Anda lebih suka terminal, keduanya juga dapat dibuat dengan:

```bash
# macOS atau Linux
openssl rand -hex 32

# Windows, PowerShell, atau Command Prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`NEXTAUTH_URL` diisi `localhost` untuk sekarang, dan diubah menjadi alamat VM nanti pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env).

### Catatan tentang DATABASE_URL

Nilai ini paling sering salah, jadi dibaca pelan-pelan.

Supabase menampilkan tiga bentuk alamat koneksi, dan ketiganya dapat dipakai dengan satu syarat pada bentuk kedua:

| Bentuk | Port | Syarat |
|---|---|---|
| Session pooler | 5432 | Tidak ada, langsung bekerja |
| Transaction pooler | 6543 | **Wajib** menambahkan `?pgbouncer=true` di akhir alamat |
| Koneksi langsung `db.<ref>.supabase.co` | 5432 | Sering gagal pada project baru, karena hostnya hanya punya alamat IPv6 |

Yang disarankan **Session pooler pada port 5432**.

```bash
DATABASE_URL="postgresql://postgres.abcdefghijklm:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

Perhatikan bentuk nama penggunanya, yaitu `postgres.<ref>`, bukan `postgres` saja. Ganti `[YOUR-PASSWORD]` dengan kata sandi database dari Tahap 2. Bila kata sandinya memuat karakter khusus seperti `@` atau `#`, tulis dalam bentuk persen: `%40` dan `%23`.

Halaman connection string Supabase juga menampilkan `DIRECT_URL`. Untuk aplikasi ini, **hanya `DATABASE_URL` yang dipakai**, karena tabel dibuat lewat skrip di folder `sql/`, bukan lewat `prisma migrate`.

### Bagian DATA SPASIAL

**Di laptop, biarkan bagian ini kosong.** Seluruh variabel `POSTGIS_*` dan `GEOSERVER_*` diisi nanti di VM, pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env).

Alasannya, GeoServer berjalan di dalam VM lewat `docker-compose.yml`, bukan di laptop Anda. Mengisi alamat `localhost:8080` sekarang berarti menunjuk ke sesuatu yang belum ada.

Yang Anda perlukan di laptop hanya bagian **WAJIB** di atas, yaitu `DATABASE_URL`, `JWT_SECRET`, dan `NEXTAUTH_SECRET`. Itu sudah cukup untuk login dan menguji portal.

#### Bila Anda menjalankan GeoServer di laptop

Sebagian peserta memasang GeoServer di laptop untuk latihan Hari 2. Bila Anda melakukannya dan ingin menguji unggah layer 2D sebelum ke VM, isi bagian ini sebagai berikut.

| Variabel | Nilai di laptop |
|---|---|
| `POSTGIS_HOST` | Sesuai database yang dipakai, `localhost` bila PostgreSQL lokal |
| `POSTGIS_PORT` | `5432` |
| `POSTGIS_DB` | Nama database Anda |
| `POSTGIS_USER` | `postgres` |
| `POSTGIS_PASSWORD` | Kata sandi database Anda |
| `POSTGIS_SCHEMA` | `gis` |
| `GEOSERVER_URL` | `http://localhost:8080/geoserver` |
| `GEOSERVER_PUBLIC_URL` | `http://localhost:8080/geoserver`, sama dengan di atas |
| `GEOSERVER_USERNAME` | `admin` |
| `GEOSERVER_PASSWORD` | Kata sandi GeoServer Anda |
| `GEOSERVER_WORKSPACE` | `geoportal` |
| `GEOSERVER_POSTGIS_DATASTORE` | `postgis_geoportal`, nama datastore yang Anda buat di [Koneksi PostgreSQL ke GeoServer](/hari-2/praktik-7/koneksi-postgis) |

Di laptop, `GEOSERVER_URL` dan `GEOSERVER_PUBLIC_URL` bernilai **sama**, karena aplikasi dan browser berjalan di komputer yang sama.

#### Kapan datastore GeoServer dibuat

`GEOSERVER_POSTGIS_DATASTORE` berisi nama datastore yang Anda buat sendiri di antarmuka GeoServer, pada halaman [Koneksi PostgreSQL ke GeoServer](/hari-2/praktik-7/koneksi-postgis). Nama yang dipakai sepanjang pelatihan adalah `postgis_geoportal`.

Karena datastore itu belum ada sebelum GeoServer berjalan, variabel ini **dibiarkan kosong di laptop** dan diisi di VM pada [Tahap 18 halaman Menyiapkan Aplikasi di VM](/hari-4/praktik-11/aplikasi-di-vm#tahap-18-isi-file-env), setelah datastore-nya dibuat. Bila namanya tidak sama persis dengan yang ada di GeoServer, unggahan layer gagal dengan `Could not find datastore`.

#### Bila GeoServer hanya ada di VM

Biarkan kosong di laptop, lalu isi di VM:

| Variabel | Nilai di VM | Mengapa |
|---|---|---|
| `GEOSERVER_URL` | `http://geoserver:8080/geoserver` | Dipanggil aplikasi dari dalam jaringan Docker, jadi memakai nama service |
| `GEOSERVER_PUBLIC_URL` | `http://IP_EKSTERNAL_VM/geoserver` | Disimpan sebagai `wms_url`, lalu dibuka dari browser Anda, jadi harus alamat publik |

Bagian `POSTGIS_*` diisi dengan kredensial Supabase, sama seperti di laptop.

::: warning Jangan tertukar antara dua alamat itu
`GEOSERVER_URL` dipanggil aplikasi dari dalam jaringan Docker, jadi memakai nama service. `GEOSERVER_PUBLIC_URL` disimpan ke katalog lalu dibuka dari browser, jadi memakai alamat publik.

Bila keduanya tertukar, unggahan layer gagal dengan `connection refused`, atau alamat yang tersimpan tidak dapat dibuka tanpa pesan error yang menjelaskan sebabnya. Bila GeoServer Anda jalankan di laptop, kedua baris berisi `http://localhost:8080/geoserver`.
:::

### Pastikan .env tidak ikut ter-commit

Cara termudah: buka GitHub Desktop dan pastikan `.env` **tidak muncul** di daftar **Changes**. File yang diabaikan memang tidak pernah muncul di sana.

Bila ingin memastikan lewat terminal:

```bash
git check-ignore -v .env
```

Keluaran yang diharapkan menyebut `.env`. Bila perintah itu tidak mengeluarkan apa pun, berarti `.env` **tidak** diabaikan dan isinya bisa ikut ter-push ke GitHub publik. Hentikan pekerjaan sampai barisnya ditambahkan ke `.gitignore`.

## Tahap 6. Periksa .gitignore

Buka `.gitignore` di root folder proyek. Pastikan di dalamnya ada tiga baris berikut.

<p class="dijalankan dijalankan--lokal">Dijalankan di: <strong>Laptop</strong></p>

```
/geoserver-data/
/tls/
/certbot-webroot/
```

Baris itu sudah ada di repositori, jadi tidak perlu ditambahkan. Yang perlu Anda lakukan hanya memastikan ketiganya masih ada.

### Mengapa ini penting

Ketiga folder itu dibuat di **dalam VM**, oleh container yang berjalan di sana, bukan di laptop Anda. Karena itu langkah ini berlaku untuk semua sistem, termasuk Windows.

Yang paling berbahaya adalah `geoserver-data`, karena di dalamnya GeoServer menyimpan:

| Folder | Isinya |
|---|---|
| `security/` | Konfigurasi pengguna dan **kata sandi admin GeoServer** |
| `styles/` | Gaya tampilan layer |
| `gwc/` | Cache tile |
| `logs/` | Catatan aktivitas |

Pada mesin pengembang, folder itu berisi 60 file. Yang paling perlu diperhatikan bukan ukurannya, melainkan isi `security/`. Bila folder itu ikut ter-commit dan Anda push ke repositori publik, kata sandi admin GeoServer Anda dapat dibaca siapa pun.

Dua folder lainnya, `tls` dan `certbot-webroot`, berisi sertifikat HTTPS dan file tantangan Let's Encrypt. Fungsinya sama: keduanya dibuat di VM dan tidak boleh masuk repositori.

### Periksa dengan perintah

Jalankan dari root folder proyek. Perhatikan **garis miring di akhir** setiap nama:

```bash
git check-ignore -v geoserver-data/ tls/ certbot-webroot/
```

Keluaran yang diharapkan, tiga baris seperti ini:

```
.gitignore:52:/geoserver-data/	geoserver-data/
.gitignore:56:/tls/	tls/
.gitignore:57:/certbot-webroot/	certbot-webroot/
```

::: warning Garis miring di akhir itu wajib
Ketiga baris pada `.gitignore` diakhiri garis miring, dan dalam aturan `.gitignore` artinya pola itu **hanya berlaku untuk direktori**.

Folder `geoserver-data`, `tls`, dan `certbot-webroot` belum ada di laptop Anda. Ketiganya baru dibuat di VM saat container berjalan. Tanpa garis miring pada perintah di atas, Git tidak tahu bahwa yang Anda maksud adalah direktori, sehingga perintahnya **tidak mengeluarkan apa pun**.

Keluaran yang kosong di sini berarti perintahnya kurang tepat, bukan berarti folder Anda tidak diabaikan.
:::

Bila salah satu baris benar-benar tidak muncul walaupun garis miringnya sudah disertakan, berarti folder itu **tidak** diabaikan. Hentikan pekerjaan sampai barisnya ditambahkan ke `.gitignore`.

Pekerjaan berlanjut pada halaman [Uji dan Jalankan Portal](/hari-4/praktik-11/uji-dan-jalankan).
