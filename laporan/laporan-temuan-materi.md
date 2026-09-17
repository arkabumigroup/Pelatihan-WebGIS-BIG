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

Yang **belum** dikerjakan, karena menunggu jawaban: keempat endpoint tanpa kode pada temuan 6.

### Cara memeriksa ulang

Temuan 1, 2, dan 7 dapat diperiksa dengan membaca berkas yang disebutkan. Temuan 8 dapat diperiksa dengan membaca docx. Temuan 4 dan 5 dapat diperiksa dengan membuka koleksi Postman. Temuan 3 dan 9 memerlukan aplikasi yang berjalan.
