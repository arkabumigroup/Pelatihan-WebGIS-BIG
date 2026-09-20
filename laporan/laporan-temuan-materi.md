# Laporan Temuan Materi Praktik 9, 10, dan 11

Dokumen ini memuat temuan pada materi pelatihan, disusun dari pengujian dan pembacaan berkas sumber. Semuanya dapat diperiksa ulang tanpa menjalankan aplikasi, kecuali yang disebutkan lain.

Setiap temuan mencantumkan berkas dan barisnya, sehingga dapat diverifikasi langsung.

## Ringkasan

| # | Praktik | Temuan | Sifat |
|---|---|---|---|
| 1 | 10 | `verifyAccessToken` dipanggil tanpa diimpor | Galat tersembunyi |
| 2 | 10 | `token.user_id` dibaca tetapi tidak pernah diisi | Nilai selalu kosong |
| 3 | 9 | `"editor"` dipakai padahal peran itu tidak dimaksudkan ada | Sebagian sudah diklarifikasi |
| 4 | 9 | Koleksi Postman: nama parameter `data_d_id` | Endpoint gagal dari Postman |
| 5 | 9 | Koleksi Postman: komentar peran menawarkan `"editor"` | Mengarahkan ke peran yang salah |
| 6 | 9 | Koleksi Postman: empat endpoint tanpa kode | Fitur tidak lengkap |
| 7 | 9 | `create` mengembalikan hash kata sandi | Data sensitif terkirim |
| 8 | 6 | Docx membuat tabel manual menghasilkan skema berbeda | Berpengaruh ke seluruh aplikasi |
| 9 | 11 | `GEOSERVER_URL` dipakai untuk dua keperluan yang berlawanan | Alamat tersimpan tidak berguna |

---

## 1. `verifyAccessToken` dipanggil tanpa diimpor

**Berkas:** `Praktik 10/Konfigurasi NextAuth/File Latihan/route.js`

```js
baris 4   import { signAccessToken } from ".../lib/auth/jwt";
baris 46  verifyAccessToken(token.accessToken);
```

`verifyAccessToken` **tidak pernah diimpor**, padahal `lib/auth/jwt.js` mengekspornya di baris 14.

**Yang membuatnya sulit terlihat:** panggilan itu berada di dalam blok `try` yang disediakan untuk menangani token kedaluwarsa:

```js
try {
    verifyAccessToken(token.accessToken);
} catch (err) {
    token.accessToken = signAccessToken({...});
}
```

`ReferenceError` yang muncul **tertangkap dan disalahartikan** sebagai token kedaluwarsa. Hasilnya aplikasi tetap berjalan, tetapi validasi token tidak pernah terjadi, dan setiap permintaan selalu membuat token baru.

**Bukti:**

```
catch menangkap : ReferenceError
pesan           : verifyAccessToken is not defined
callback melempar galat : TIDAK
```

**Usulan:** tambahkan impornya, dan persempit `catch` agar hanya menangani `TokenExpiredError` serta `JsonWebTokenError`. Galat lain sebaiknya dilempar supaya muncul di log.

---

## 2. `token.user_id` dibaca tetapi tidak pernah diisi

**Berkas:** `Praktik 10/Konfigurasi NextAuth/File Latihan/route.js`

| Callback | Menulis | Membaca |
|---|---|---|
| `jwt` (baris 34 sampai 56) | `id`, `email`, `role`, `accessToken` | |
| `session` (baris 57 sampai 64) | | `id`, **`user_id`**, `email`, `role`, `accessToken` |

`token.user_id` tidak pernah ditulis, sehingga:

```js
session.user.user_id = token.user_id;   // selalu undefined
```

Kemungkinan maksudnya `token.id`, karena itu yang diisi pada baris 38.

---

## 3. Peran `"editor"`

**Berkas:**
- `Praktik 9/Membuat CRUD API users/roles.js` baris 5 sampai 9
- `Praktik 9/Membuat CRUD API users/users/register/route.js` baris 42
- `Praktik 9/Membuat CRUD API users/users/create/route.js` baris 14

```js
// roles.js
ROLE_LEVELS = { viewer: 1, admin: 2, super_admin: 3 };   // tanpa "editor"

// register/route.js
role: "editor",   // peran yang tidak dikenal

// create/route.js
const allowedRoles = ["editor", "admin"];
```

Sudah diklarifikasi bahwa `editor` tidak dimaksudkan ada, dan seharusnya `viewer`. Klarifikasi itu menjelaskan temuan ini: `register` dan `create` menulis nilai yang salah.

**Sisa pertanyaan:** pada `update/route.js` baris 14 tertulis `["viewer", "admin"]`. Itu sudah benar. Setelah `create` diselaraskan menjadi `["viewer", "admin"]`, kedua endpoint akan sepadan.

---

## 4. Koleksi Postman: nama parameter `data_d_id`

**Berkas:** `Praktik 9/.../Personal Geoportal.postman_collection.json`
**Request:** grup "Katalog Data 3D", nama `getModel`

```
GET {{domain}}/api/katalog-data-3d/models/:data_d_id
    path variable: data_d_id = ae7d5e1d-...
```

Sementara di kode, nama parameternya `data_3d_id`:

```js
const { data_3d_id } = await params;
```

Nama folder route pun `[data_3d_id]`. Akibatnya menekan endpoint itu dari Postman tidak akan menemukan datanya.

**Pertanyaan:** mana yang benar, `data_d_id` atau `data_3d_id`?

---

## 5. Koleksi Postman: komentar peran menawarkan `"editor"`

**Berkas:** berkas yang sama
**Request:** grup "Users", `create user` dan `update user`

```
POST  /api/users/create    "role": "editor"   // "admin" | "editor"
PATCH /api/users/update    "role": "admin"    // "admin" | "viewer"
```

Dua hal:

1. Komentar pada `create` menawarkan `"editor"`, peran yang menurut klarifikasi tidak ada.
2. Kedua komentar memuat daftar yang berbeda untuk kolom yang sama, dan `"viewer"` tidak muncul pada `create`.

Padahal `viewer` justru peran bawaan yang benar untuk pendaftaran mandiri.

---

## 6. Koleksi Postman: empat endpoint tanpa kode

Empat endpoint berikut ada di koleksi Postman, tetapi tidak ada berkas `route.js` nya di materi Praktik 9:

```
PATCH  /api/katalog-data-2d/update
PATCH  /api/katalog-data-3d/update
GET    /api/katalog-data-3d/list-public-glb
GET    /api/katalog-data-3d/list-public-ply
```

Sebagai pembanding, enam endpoint `users/*` disediakan lengkap sebagai berkas.

Kolom `tipe_file` pada tabel `katalog_data_3d` sudah disiapkan untuk memisahkan `glb` dan `ply`, tetapi belum dipakai kode mana pun. Ini menunjukkan pemisahan itu memang direncanakan tetapi belum dikerjakan.

**Pertanyaan:** apakah keempat endpoint itu untuk dikerjakan peserta, atau sisa dari versi sebelumnya?

---

## 7. `create` mengembalikan hash kata sandi

**Berkas:** `Praktik 9/Membuat CRUD API users/users/create/route.js` baris 31 sampai 44

```js
const newUser = await db.users.create({
    data: { ... },
});   // tanpa select

return NextResponse.json({ message: "...", data: newUser }, { status: 201 });
```

Tanpa `select`, Prisma mengembalikan **seluruh kolom**, termasuk `password`:

```
password  $2b$10$RaaaXU3BcbClJvc.rec.hejn694uU.CSE...   <- hash bcrypt
```

**Bukti:** dipanggil dengan aplikasi berjalan, hash muncul pada respons.

**Usulan:** tambahkan `select` yang hanya memuat kolom yang diperlukan, misalnya `user_id`, `nama`, `email`, `role`, `is_active`, dan `created_at`.

---

## 8. Docx membuat tabel manual menghasilkan skema berbeda

**Berkas:** `Praktik 6/Management Database Non Spasial/Membuat Tabel, Import Tabel, Membuat Primary Key dan Foreign Key.docx`

Isi docx, lima langkah:

```
1. Buka DBeaver, klik kanan table, Create New Table
2. Beri nama table, tambahkan kolom, pastikan ada satu primary key
3. Buat tabel katalog_data_2d dengan cara import
4. Buat foreign key author ke user_id
5. Buat constraint primary key untuk data_2d_id
```

Kata `DEFAULT` **tidak disebut**, `CHECK` **tidak disebut**, `tipe_file`, `scale`, dan `created_at` **tidak disebut**.

Tabel yang dibuat dengan cara ini hanya memuat kolom dan primary key. Yang hilang justru bagian yang menentukan aplikasi berjalan:

| Yang hilang | Akibat |
|---|---|
| `DEFAULT 'viewer'` pada `role` | Peran akun baru kosong |
| `DEFAULT false` pada `is_active` | Status aktivasi tidak jelas |
| `DEFAULT now()` pada `created_at` | Waktu pembuatan akun tidak tercatat |
| `DEFAULT 'glb'` pada `tipe_file` | Data 3D tersimpan tanpa jenis berkas |
| `CHECK (role IN (...))` | Peran tidak sah dapat masuk, termasuk `"editor"` |
| `UNIQUE` pada `email` | Dua akun dapat memakai email yang sama |

**Pertanyaan:** apakah peserta sebaiknya menjalankan berkas SQL, atau tetap membuat tabel manual di DBeaver? Bila berkas SQL, docx itu perlu diubah agar tidak lagi mengajarkan cara manual.

---

## 9. `GEOSERVER_URL` dipakai untuk dua keperluan yang berlawanan

**Berkas:** `Praktik 9/Membuat CRUD API users` tidak memuatnya, tetapi aplikasi memakainya di `src/app/api/katalog-data-2d/create/route.js`

```js
const geoserverUrl = process.env.GEOSERVER_URL;

// dipakai memanggil REST API, berjalan dari dalam container
await fetch(`${geoserverUrl}/rest/workspaces/...`);

// dipakai menyusun alamat yang DISIMPAN dan DILIHAT peserta
const wmsUrl = `${geoserverUrl}/${workspace}/wms`;
```

Dua keperluan yang berlawanan:

| Keperluan | Nilai yang benar |
|---|---|
| Dipanggil container nextjs | Nama service internal, `http://geoserver:8080/geoserver` |
| Disimpan sebagai `wms_url` | Alamat publik, `http://IP_VM/geoserver` |

Di laptop keduanya kebetulan sama, sehingga masalahnya tidak terlihat. Di VM keduanya berbeda, dan satu variabel tidak dapat memenuhi keduanya.

Akibatnya di server, `wms_url` tersimpan sebagai `http://geoserver:8080/geoserver/geoportal/wms`. Nama `geoserver` hanya dikenal di dalam jaringan Docker, sehingga peserta yang menyalin alamat itu ke QGIS atau browser **selalu gagal**, tanpa pesan yang menjelaskan sebabnya.

**Usulan:** tambahkan variabel terpisah, misalnya `GEOSERVER_PUBLIC_URL`, untuk alamat yang disimpan. Nilai internal tetap dipakai untuk memanggil.

**Pertanyaan:** alamat publik itu sebaiknya memakai IP VM langsung, atau lewat nginx yang sudah mem-proxy `/geoserver/`?

---

## Temuan pada Panduan Deployment

Bagian ini berbeda sifatnya dari sembilan temuan di atas. Kesembilan temuan itu ada pada materi instruktur, sedangkan bagian ini berasal dari **menjalankan panduan Hari 3 ujung ke ujung** pada satu peserta sungguhan, dari membuat VM sampai HTTPS aktif.

Seluruhnya sudah diperbaiki pada panduan. Bagian ini dicatat karena dua alasan: sebagian temuan berakar pada berkas di repositori peserta, dan sebagian lagi menunjukkan pola yang perlu dihindari saat menulis panduan berikutnya.

| # | Temuan | Akibat bila dibiarkan |
|---|---|---|
| 10 | Perintah pemeriksa `.gitignore` selalu mengeluarkan kosong | Peserta mengira `.gitignore`-nya salah, lalu berhenti tanpa sebab |
| 11 | Panduan menyebut `12 lulus`, kenyataannya 13 | Peserta mengira ada uji yang gagal |
| 12 | Jumlah constraint berbeda antara PostgreSQL 17 dan 18 | Peserta mengira skemanya salah |
| 13 | Nama datastore GeoServer tidak disebutkan | Peserta tidak tahu nilai yang harus diisi |
| 14 | Dua komentar alamat GeoServer saling bertentangan | Unggahan layer gagal tanpa pesan yang menjelaskan |
| 15 | `created_at` di Prisma tidak ada di sebagian database | Seluruh query gagal, bukan hanya satu kolom |
| 16 | Tahap 16 mengisi folder yang dibutuhkan Tahap 17 | `git clone` menolak folder yang tidak kosong |
| 17 | Variabel Cloud Shell dipakai pada tahap yang dijalankan di VM | Nama image menjadi `////:latest` |
| 18 | `sudo docker push` setelah kredensial ditulis sebagai pengguna | `Unauthenticated request`, bukan `Permission denied` |
| 19 | Blok `server` ditulis ke berkas yang dimuat di dalam blok `server` | `"server" directive is not allowed here` |
| 20 | Pengalihan HTTP ke HTTPS diperiksa Tahap 14, tetapi tidak pernah disiapkan | Kata sandi login dapat terkirim tanpa enkripsi |
| 21 | `proxyBaseUrl` GeoServer tidak pernah disetel | Setelah HTTPS aktif, formulir login GeoServer mengirim ke HTTP, isinya dibuang browser, dan kata sandi yang benar ditolak |
| 22 | `GEOSERVER_CSRF_WHITELIST` tidak ada pada `docker-compose.yml` | Seluruh formulir GeoServer ditolak `HTTP 400 Origin does not correspond to request`, sehingga workspace dan datastore tidak dapat dibuat |
| 23 | Service `nextjs` tidak memakai volume untuk `data/models` | Model 3D ditulis ke dalam container dan **hilang pada setiap deploy**, sedangkan barisnya tetap ada di database |
| 24 | Token Cesium Ion ditulis di dalam kode pada lima komponen | Token ikut ter-commit, dan peserta tidak dapat menggantinya dengan token sendiri |
| 25 | Level tile OpenStreetMap tidak dibatasi pada provider Cesium | Cesium meminta level 20 sampai 26, OSM menjawab `400`, dan seluruh peta gagal terbentuk |
| 26 | Kolom pitch dan roll tertinggal dari formulir tambah layer 3D | Keduanya selalu tersimpan `0`, padahal database dan pratinjau sudah mendukung |
| 27 | Tahap 13 mengubah dua dari empat variabel alamat | `wms_url` dan alamat berkas model tetap memakai alamat IP, sehingga layer tidak dapat dibuka |
| 28 | `.env.example` memuat dua baris `DATABASE_URL`, dan baris terakhir kosong | Berkas contoh itu menghasilkan `DATABASE_URL` kosong. Peserta yang mengisi baris pertama tetap gagal login tanpa pesan yang menjelaskan |
| 29 | Panduan meminta `wc -l .env` menghasilkan 195, sedangkan berkasnya 246 baris | Angka 195 itu jumlah komentar, bukan jumlah baris. Peserta mengira tempelannya terpotong lalu mengulang dari awal |
| 30 | `docs/public/unduhan/` memuat tiga berkas yang tidak dirujuk dari mana pun | Isinya sudah menyimpang dari repositori, dan ketiganya tetap ikut terbit ke situs |
| 31 | Komentar pada `.env.example` mencapai 79 persen, dan blok perintah Cloud Shell 177 baris | Peserta menggulir jauh untuk menemukan baris yang perlu diisi, dan versi ringkasnya baru muncul di bawah |

### Temuan dari pengujian alur 3D

Temuan 21 sampai 25 muncul berurutan saat peserta menguji unggah dan pratinjau model 3D. Keempatnya saling menutupi, sehingga gejalanya terlihat sebagai satu masalah yang sama.

Gejala pertama adalah **halaman admin GeoServer tidak dapat dibuka** setelah HTTPS aktif. Penyebabnya `proxyBaseUrl` yang belum disetel, sehingga formulir login mengirim ke HTTP dan isinya dibuang browser. Setelah itu diperbaiki, muncul gejala berikutnya: **pembuatan workspace ditolak** dengan `400`, karena `GEOSERVER_CSRF_WHITELIST` belum ada.

Setelah keduanya beres dan layer 2D berhasil diunggah, muncul gejala ketiga: **model 3D hilang setelah deploy**. Penyebabnya service `nextjs` tidak memakai volume, sehingga berkas ditulis ke dalam container.

Gejala keempat terlihat sebagai viewer rusak: **globe tampil kosong berwarna beige**. Console browser memuat ratusan galat yang menunjuk ke CORS, padahal yang sebenarnya terjadi adalah `HTTP 400` dari OpenStreetMap karena Cesium meminta tile di luar batas level 19. Balasan `400` tidak memuat header CORS, sehingga browser melaporkannya sebagai galat CORS.

Gejala kelima muncul saat formulir diperiksa: **kolom pitch dan roll tidak ada**. Dibandingkan dengan repositori sumber `matiurari/personal-geoportal` yang dibuat delapan belas hari lebih awal, repositori itu memuat `DEFAULT_FORM` dengan sembilan kunci termasuk `pitch` dan `roll`, sedangkan versi yang dipakai pelatihan menyusut menjadi tiga kunci. Jadi keduanya kolom yang tertinggal, bukan fitur yang belum pernah ada.

### Satu dugaan yang tidak terbukti

Endpoint penyaji berkas model, `/api/katalog-data-3d/models/<id>`, sempat dicurigai tidak memeriksa token. Dugaan itu muncul karena permintaan tanpa token dijawab `200 model/gltf-binary`.

Setelah diperiksa, endpoint itu **sudah benar**. Berkas route memuat pemeriksaan:

```javascript
if (item.akses?.toLowerCase() === "private") {
    const { payload, error, status } = requireAuth(request, "viewer");
    if (error) return NextResponse.json({ message: error }, { status });
}
```

Yang diuji saat itu adalah model berstatus **public**, sehingga `200` tanpa token memang jawaban yang benar. Model berstatus private tetap memerlukan token, dan komponen pratinjau mengirimnya lewat `?access_token=`.

Catatan ini disimpan sebagai peringatan: **menguji perlindungan dengan data berstatus public menghasilkan positif palsu.** Untuk mengujinya perlu model berstatus private.

Pelajaran yang berulang dari kelima temuan itu: **satu tangkapan layar Console lebih menentukan daripada dugaan.** Empat perbaikan pertama dikerjakan dengan menebak lapisan penyebabnya, dan setiap kali muncul lapisan berikutnya. Yang menyelesaikan gejala keempat hanya Console browser, yang seharusnya diminta sejak awal.

Tiga di antaranya berasal dari berkas di repositori peserta, bukan dari teks panduan:

- **Temuan 15** muncul dari `prisma/schema.prisma` yang memuat kolom di luar database
- **Temuan 18** muncul dari `docker-compose.yml` yang memasang `./tls`, sehingga Docker membuat folder itu sebagai root sebelum peserta membuatnya sendiri
- **Temuan 19** muncul dari `nginx.conf` yang menaruh `include /etc/nginx/tls/*.conf;` di dalam blok `server`

### Pola yang berulang

Kesebelas temuan itu punya satu sifat yang sama: **semuanya lolos dari pembacaan, dan hanya muncul saat dijalankan.**

Penyebabnya seragam, yaitu panduan ditulis dengan mengandaikan keadaan yang tidak diperiksa. Tiga bentuk pengandaian yang paling sering muncul:

**Mengandaikan perintah berjalan di satu tempat, padahal di tempat lain.** Tahap 16, 19, dan 21 memakai variabel yang hanya ada di Cloud Shell, sedangkan perintahnya dijalankan di VM.

**Mengandaikan berkas sudah ada, atau belum ada.** Folder `tls` ternyata sudah dibuat Docker. Berkas `cloudbuild.yaml` ternyata sudah ada di repositori dengan isi berbeda.

**Mengandaikan satu versi perkakas.** Batas panjang Service Account, jumlah constraint pada `pg_constraint`, dan ketersediaan `node` semuanya berbeda menurut versi atau menurut apa yang sudah dipasang.

### Perapian bahasa dan komentar

Temuan 28 sampai 31 dikerjakan sebagai satu perapian, karena keempatnya berakar pada sebab yang sama: materi ditulis dengan menambahkan penjelasan di tempat yang paling dekat, bukan di tempat yang paling tepat.

| Berkas | Sebelum | Sesudah |
|---|---|---|
| `.env.example` | 246 baris, 195 komentar (79 persen), 25 baris nilai dengan satu duplikat | 108 baris, 59 komentar, 24 baris nilai tanpa duplikat |
| Blok Cloud Shell Tahap 2 | 177 baris, 42 komentar | 30 baris, 1 komentar |
| Tahap 18 | tiga cara untuk satu pekerjaan, 164 baris | satu cara dengan satu cara cadangan, 112 baris |
| `tls/aktifkan.conf` | 13 komentar dari 36 baris | 7 komentar dari 30 baris |
| `docs/public/unduhan/` | tiga berkas, tidak dirujuk, sudah menyimpang | dihapus |

Yang **tidak** dipangkas adalah komentar yang mencegah kegagalan senyap: bentuk nama pengguna `postgres.<ref>`, syarat `?pgbouncer=true` pada port 6543, larangan tanda dolar pada `GEOSERVER_ADMIN_PASSWORD`, dan perbedaan `GEOSERVER_URL` dengan `GEOSERVER_PUBLIC_URL`. Semuanya tetap ada, hanya dipendekkan dari belasan baris menjadi dua sampai tiga baris.

### Yang belum dikerjakan

Empat endpoint tanpa kode pada temuan 6 masih menunggu jawaban.

`docs/.vitepress/dist` sudah tidak lagi terlacak, dan `docs/.gitignore` mengabaikannya bersama `.vitepress/cache`, sehingga hasil build tidak ikut ter-commit lagi.

## Catatan Pengerjaan

### Cara temuan ini dikumpulkan

Kode dan teks diambil dari berkas sumber di repositori materi, lalu dicocokkan dengan tangkapan layar dan dengan aplikasi yang dijalankan. Cara ini menemukan hal yang tidak terlihat dari membaca saja.

Sebagai contoh, temuan pertama dan kedua tidak muncul saat membaca kode, karena kodenya terlihat benar. Yang menemukan adalah menjalankan callback dengan token sungguhan.

### Perbaikan yang sudah dikerjakan

Beberapa temuan sudah diperbaiki pada repositori peserta `dhanyyudi/personal-geoportal-peserta`, karena pengujian alur menemukan kegagalan yang disebabkan olehnya:

- Peran `editor` dihapus dari seluruh sistem
- Metode HTTP pada tiga endpoint dibetulkan
- `user_id` dibaca dari query string
- Hash kata sandi tidak lagi dikembalikan
- `GEOSERVER_PUBLIC_URL` dipisahkan dari `GEOSERVER_URL`
- Skema Prisma dilengkapi tiga kolom yang tertinggal

Menyusul pengujian Hari 3 ujung ke ujung, ditambahkan pula:

- Row Level Security diaktifkan pada ketiga tabel, dan `security_invoker` pada view yang melewatinya
- Tombol Tambah dan Hapus Akun dihidupkan, dan pilihan peran diselaraskan dengan API
- `PaperProps` diganti `slotProps.paper`, karena pada MUI v9 gaya dialog tidak pernah terpasang
- `created_at` dihapus dari model Prisma, supaya repositori bekerja pada dua variasi skema
- Skema SQL dibuat sadar-versi untuk jumlah constraint PostgreSQL
- Isian Skala dan Arah dibatasi bilangan bulat, karena sebagian database memakai kolom `integer`
- `proxyBaseUrl` GeoServer disetel ke alamat HTTPS, dan langkahnya masuk Tahap 2 halaman Menyiapkan GeoServer di VM
- `GEOSERVER_CSRF_WHITELIST` ditambahkan pada service geoserver
- Volume `./data:/app/data` ditambahkan pada service nextjs, beserta Tahap 8 untuk pemilik foldernya
- Token Cesium Ion dipindahkan dari kode ke `.env` dan build argument `_CESIUM_ION_TOKEN`
- Level tile OpenStreetMap dibatasi 19 pada tujuh provider Cesium
- Kolom pitch dan roll dikembalikan ke formulir, beserta `DEFAULT_FORM` yang lengkap
- Tahap 13 diubah menjadi keempat variabel, disertai langkah SQL untuk baris database yang sudah ada

Yang **belum** dikerjakan, karena menunggu jawaban: keempat endpoint tanpa kode pada temuan 6.

### Cara memeriksa ulang

Temuan 1, 2, dan 7 dapat diperiksa dengan membaca berkas yang disebutkan. Temuan 8 dapat diperiksa dengan membaca docx. Temuan 4 dan 5 dapat diperiksa dengan membuka koleksi Postman. Temuan 3 dan 9 memerlukan aplikasi yang berjalan.
