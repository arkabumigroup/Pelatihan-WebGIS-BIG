# Konsep Dasar API dan Backend

Halaman ini merangkum istilah yang dipakai saat membangun backend: API, CRUD, HTTP method, query parameter, request body, header Authorization, serta perbedaan hashing dan enkripsi. Istilah-istilah ini muncul kembali pada praktik [Konfigurasi Prisma dan Membuat API Login](/hari-3/praktik-8/prisma-api-login) dan [Membuat CRUD API Users](/hari-3/praktik-9/crud-api-users).

## Apa itu API

API (Application Programming Interface) adalah perantara perangkat lunak yang memungkinkan dua aplikasi atau sistem yang berbeda saling berkomunikasi dan bertukar data.

### Jembatan penghubung

Aplikasi pemanggil tidak perlu tahu bagaimana data disimpan di sisi server. Yang perlu disepakati hanya alamat endpoint dan bentuk data yang dipertukarkan.

![Kartu slide jembatan penghubung](konsep-api-backend/image1.png)

### Analogi pelayan restoran

Klien (frontend atau aplikasi) memesan makanan ke pelayan (API). Pelayan meneruskan pesanan ke dapur (database dan server), lalu mengembalikan makanan yang sudah jadi ke klien.

![Kartu slide analogi pelayan restoran](konsep-api-backend/image2.png)

## Operasi dasar CRUD

| Operasi | Arti |
|---|---|
| Create | Membuat atau menambahkan data baru ke dalam sistem atau database |
| Read | Membaca atau mengambil data yang sudah ada dari server |
| Update | Memperbarui atau mengubah data yang sudah tersimpan |
| Delete | Menghapus data tertentu dari sistem secara permanen |

![Kartu slide operasi Create](konsep-api-backend/image5.png)

![Kartu slide operasi Read](konsep-api-backend/image6.png)

![Kartu slide operasi Update](konsep-api-backend/image7.png)

![Kartu slide operasi Delete](konsep-api-backend/image8.png)

## HTTP method

HTTP method menentukan operasi apa yang dikerjakan sebuah endpoint. Keempat method berikut dipetakan langsung ke operasi CRUD.

| Method | Fungsi utama (CRUD) | Contoh endpoint | Keterangan |
|---|---|---|---|
| GET | Read (membaca data) | `GET /api/users` | Mengambil daftar atau detail data tanpa mengubah state server |
| POST | Create (membuat data) | `POST /api/users` | Mengirim data baru untuk disimpan ke dalam database |
| PUT / PATCH | Update (mengubah data) | `PUT /api/users/1` | Memperbarui seluruh data (PUT) atau sebagian data (PATCH) |
| DELETE | Delete (menghapus data) | `DELETE /api/users/1` | Menghapus sumber daya berdasarkan identifier (ID) |

## Query parameter

Query parameter dipakai untuk melakukan filter, pencarian (search), pengurutan (sorting), atau pagination pada endpoint GET. Posisinya setelah tanda tanya (`?`) pada URL, dan antar parameter dipisahkan dengan tanda ampersand (`&`).

| Contoh | Kegunaan |
|---|---|
| `category=electronics` | Filter |
| `sort=price_asc` | Sorting |
| `limit=10` | Pagination |

Ketiganya dipakai bersama pada satu URL seperti berikut.

```text
GET /api/products?category=electronics&sort=price_asc&limit=10
```

![Contoh URL dengan tiga query parameter](konsep-api-backend/image17.png)

## Request body

Request body dipakai untuk mengirim data yang kompleks dan berukuran besar ke server. Method yang memakainya adalah POST, PUT, dan PATCH. Format yang paling sering dipakai adalah JSON.

Contoh payload JSON:

```json
{
 "name": "Budi Santoso",
 "email": "budi@mail.com",
 "role": "admin"
}
```

![Contoh payload JSON pada slide](konsep-api-backend/image19.png)

## Header Authorization

Header dipakai untuk mengirim metadata tambahan ke server di luar URL dan body. Header `Authorization` membuktikan identitas pemanggil. Skema yang paling banyak dipakai adalah token Bearer, misalnya JSON Web Token (JWT).

Contoh HTTP header:

```text
GET /api/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Content-Type: application/json
```

![Contoh header Authorization dengan Bearer token](konsep-api-backend/image21.png)

## Perbedaan hashing dan enkripsi

Keduanya dipakai di alur autentikasi, tetapi arah prosesnya berbeda.

| Aspek | Hashing | Enkripsi |
|---|---|---|
| Arah proses | Satu arah (one-way) | Dua arah (two-way) |
| Bisa dibalik | Tidak bisa didekripsi balik | Bisa dibaca ulang (decodable/verifiable) |
| Dipakai untuk | Password saat register | Token saat login berhasil |
| Contoh | Bcrypt | JSON Web Token (JWT) |

### Password register memakai hashing

Password di-hash saat pendaftaran, misalnya memakai Bcrypt, lalu nilai hash-nya yang disimpan ke database. Nilai asli password tidak bisa diambil kembali dari database, sehingga database yang bocor tidak langsung membuka password pengguna.

![Kartu slide hashing password](konsep-api-backend/image23.png)

### Token login memakai enkripsi

Saat API login sukses, server menghasilkan token (JWT) yang ditandatangani, lalu mengirimkannya ke klien. Token itu bisa dibaca ulang dan diverifikasi pada setiap request berikutnya.

![Kartu slide enkripsi token](konsep-api-backend/image24.png)

## Sesi tanya jawab

Sesi ini ditutup dengan tanya jawab mengenai API, hashing, dan enkripsi. Penerapan seluruh istilah di atas ada pada halaman [Membuat CRUD API Users](/hari-3/praktik-9/crud-api-users).
