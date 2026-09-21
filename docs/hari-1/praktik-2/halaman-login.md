# Membuat Halaman Login

Modul ini mengajarkan tiga pondasi dasar pengembangan web front-end secara bertahap memakai satu studi kasus yang sama, yaitu halaman login. Setiap tahap dibangun di atas tahap sebelumnya, sehingga peserta dapat melihat langsung dampak dari setiap lapisan (struktur, tampilan, dan perilaku) terhadap halaman yang sama.

Tujuan pembelajaran:

- Memahami struktur dokumen HTML dan elemen form (`label`, `input`, `button`).
- Memahami cara CSS mengubah tampilan tanpa mengubah struktur HTML.
- Memahami dasar JavaScript: menangani event, membaca nilai input, dan logika percabangan `if`/`else`.

## Cara menggunakan modul ini

1. Buka berkas `tutorial-login-html-css-js.html` di code editor, misalnya VS Code.
2. Ikuti Langkah 1, 2, dan 3 secara berurutan seperti dijelaskan pada bab masing-masing.
3. Setelah menerapkan tiap langkah, simpan berkas lalu muat ulang browser untuk melihat hasilnya sebelum lanjut ke langkah berikutnya.
4. Gunakan kredensial uji coba berikut untuk menguji Langkah 3: email `admin@mail.com` dan password `admin123`.

## Persiapan: instalasi Live Server di VS Code

Berkas HTML sebaiknya dibuka lewat server lokal, bukan dengan cara klik ganda biasa. Kalau dibuka dengan klik ganda, alamatnya berbentuk `file:///...` dan beberapa fitur browser bisa diblokir, terutama fitur yang berhubungan dengan pengambilan data seperti `fetch`. Ekstensi Live Server di VS Code menjalankan berkas HTML lewat alamat `http://localhost`, persis seperti website sungguhan.

Seluruh langkah di bawah ini dijalankan di laptop, di dalam aplikasi Visual Studio Code.

### Langkah instalasi

1. Buka aplikasi Visual Studio Code.
2. Klik ikon Extensions di sidebar kiri (ikon berbentuk empat kotak kecil), atau tekan `Ctrl+Shift+X` pada Windows/Linux atau `Cmd+Shift+X` pada Mac.
3. Di kotak pencarian Extensions, ketik: `Live Server`
4. Cari ekstensi bernama Live Server buatan Ritwick Dey. Ikonnya berwarna hijau-biru, biasanya muncul sebagai hasil pencarian paling atas dan memiliki jutaan unduhan.
5. Klik tombol Install pada ekstensi tersebut, lalu tunggu proses instalasi selesai. VS Code tidak perlu di-restart.

### Cara menjalankan berkas HTML dengan Live Server

1. Buka folder project, yaitu folder yang berisi `tutorial-login-html-css-js.html`, di VS Code lewat menu **File > Open Folder**.
2. Di panel Explorer sebelah kiri, klik kanan pada berkas `tutorial-login-html-css-js.html`.
3. Pilih menu **Open with Live Server** dari daftar yang muncul.
4. Browser akan terbuka otomatis dengan alamat seperti `http://127.0.0.1:5500/tutorial-login-html-css-js.html`. Alamat inilah tanda berkas sudah berjalan lewat server lokal, bukan `file://` lagi.
5. Setiap kali berkas HTML/CSS/JS disimpan dengan `Ctrl+S`, Live Server otomatis memuat ulang browser sehingga perubahan langsung terlihat tanpa perlu refresh manual.
6. Untuk menghentikan server, klik tulisan **Port: 5500** (atau sejenisnya) di pojok kanan bawah jendela VS Code, lalu pilih **Stop Live Server**.

::: warning Menu Open with Live Server tidak muncul
Pastikan ekstensinya benar-benar sudah ter-install. Cek di panel Extensions, harus ada tulisan Uninstall, bukan Install, pada Live Server. Pastikan juga folder project sudah dibuka lewat **File > Open Folder**, bukan hanya membuka satu berkas HTML secara langsung.
:::

## Langkah 1: struktur HTML dasar

Tahap ini membangun kerangka halaman tanpa gaya visual apa pun. Tujuannya supaya peserta memahami bahwa HTML hanya bertugas mendefinisikan struktur dan makna konten, bukan tampilannya.

### Langkah kerja

1. Buat elemen pembungkus utama berupa `<div class="login-container">` yang menampung seluruh isi halaman login.
2. Tambahkan judul halaman memakai tag `<h1>Halaman Login</h1>`.
3. Buat elemen `<form id="loginForm">` sebagai pembungkus seluruh input login.
4. Di dalam form, buat kelompok input pertama: `<label for="email">` dan `<input type="text" id="email">` untuk email.
5. Buat kelompok input kedua dengan pola yang sama: `<label for="password">` dan `<input type="password" id="password">`.
6. Tambahkan `<button type="submit">` sebagai tombol untuk mengirim form.
7. Tambahkan elemen `<p id="message"></p>` tepat di luar atau di bawah form. Elemen ini sengaja dikosongkan dulu, dan baru akan diisi teks oleh JavaScript di Langkah 3.

Struktur HTML inti:

```html
<div class="login-container">
  <h1>Halaman Login</h1>

  <form id="loginForm">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" id="email" name="email" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" />
    </div>

    <button type="submit" class="btn-login">Login</button>
  </form>

  <p id="message"></p>
</div>
```

Hasil yang diharapkan: halaman menampilkan judul, dua kolom input, dan satu tombol. Semuanya berbaris ke bawah tanpa warna atau tata letak khusus, memakai tampilan bawaan browser.

## Langkah 2: pemberian style dengan CSS

Setelah struktur HTML siap, tahap ini menambahkan CSS untuk mengatur tata letak, warna, jarak antar elemen, dan bentuk visual, tanpa mengubah satu pun tag HTML yang sudah dibuat di Langkah 1.

### Langkah kerja

1. Buka blok `<style>` yang ada di bagian `<head>`. Blok ini sengaja dibungkus komentar HTML (`<!-- ... -->`) supaya belum aktif.
2. Hapus tanda komentar pembuka (`<!--`) tepat sebelum kata `<style>` dan tanda penutup (`-->`) tepat sebelum `</style>`.
3. Simpan berkas, lalu muat ulang browser untuk melihat perubahan tampilan.
4. Amati efek dari masing-masing aturan CSS berikut terhadap tampilan.

### Poin CSS penting dan efeknya

| Aturan CSS | Efek |
|---|---|
| `body { display: flex; align-items: center; justify-content: center; }` | Menempatkan seluruh kotak login tepat di tengah layar, baik secara horizontal maupun vertikal |
| `.login-container { max-width: 360px; box-shadow: ...; border-radius: 8px; }` | Membuat area login berbentuk kartu dengan sudut membulat dan bayangan halus, tidak menempel rata ke tepi layar |
| `.form-group { margin-bottom: 16px; }` | Memberi jarak antar kelompok input supaya tidak berhimpitan |
| `.form-group input { width: 100%; padding: 10px 12px; border-radius: 4px; }` | Membuat kotak input mengisi penuh lebar form dan lebih nyaman diklik |
| `.btn-login { background-color: #4a90e2; color: #ffffff; }` dan `:hover`-nya | Memberi warna latar tombol serta efek perubahan warna saat kursor diarahkan ke tombol |
| `#message.success` dan `#message.error` | Dua kelas ini belum terlihat efeknya di Langkah 2, karena baru ditambahkan ke elemen pesan lewat JavaScript di Langkah 3 |

Cuplikan sebagian CSS, yaitu posisi tengah dan bentuk kartu:

```css
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.login-container {
  background-color: #ffffff;
  padding: 32px 28px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 360px;
}
```

Hasil yang diharapkan: halaman tampil sebagai kartu putih di tengah layar dengan latar abu-abu, input yang rapi, dan tombol biru. Tombolnya belum bisa melakukan apa-apa, karena logikanya baru dibuat di Langkah 3.

## Langkah 3: pemberian logic dengan JavaScript

Tahap terakhir menambahkan perilaku ke halaman: memeriksa email dan password yang diketik pengguna, lalu menampilkan pesan sukses atau gagal. Kredensial yang benar ditulis langsung di dalam kode (hardcode). Cara ini hanya untuk latihan, bukan praktik yang aman untuk aplikasi sungguhan.

### Langkah kerja

1. Buka blok `<script>` di bagian bawah halaman, sebelum `</body>`. Setiap barisnya diawali tanda `//` sehingga dianggap komentar oleh JavaScript dan tidak dijalankan.
2. Hapus tanda `//` di setiap baris pada blok tersebut.
3. Simpan berkas, lalu muat ulang browser.
4. Coba isi form dengan email dan password yang salah terlebih dahulu, lalu perhatikan pesan yang muncul.
5. Coba lagi dengan email `admin@mail.com` dan password `admin123`, lalu perhatikan perbedaan pesan yang muncul.

### Penjelasan bagian-bagian kode

- `VALID_EMAIL` dan `VALID_PASSWORD` adalah dua variabel yang menyimpan kredensial benar yang sudah ditentukan sejak awal (hardcode).
- `document.getElementById(...)` adalah cara JavaScript mengambil atau menunjuk ke elemen HTML tertentu berdasarkan atribut `id`, supaya nilainya bisa dibaca atau diubah.
- `loginForm.addEventListener('submit', ...)` mendaftarkan sebuah fungsi yang akan otomatis dijalankan setiap kali form ini disubmit, yaitu saat tombol Login ditekan.
- `event.preventDefault()` mencegah perilaku bawaan form berupa muat ulang halaman, supaya halaman tetap di tempat sehingga pesan hasil login bisa ditampilkan.
- `if (emailValue === VALID_EMAIL && passwordValue === VALID_PASSWORD)` adalah logika percabangan. Operator `===` membandingkan apakah dua nilai persis sama, sedangkan `&&` berarti kedua syarat harus sama-sama benar.
- `messageEl.textContent` dan `messageEl.className` adalah dua baris yang mengubah isi teks dan warna pesan, lewat class `success` atau `error` yang sudah disiapkan CSS-nya di Langkah 2.

Cuplikan logic inti:

```js
const VALID_EMAIL = "admin@mail.com";
const VALID_PASSWORD = "admin123";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value;

  if (emailValue === VALID_EMAIL && passwordValue === VALID_PASSWORD) {
    messageEl.textContent = "Login berhasil! Selamat datang, " + emailValue;
    messageEl.className = "success";
  } else {
    messageEl.textContent = "Email atau password salah.";
    messageEl.className = "error";
  }
});
```

Hasil yang diharapkan: mengetik kredensial yang salah menampilkan pesan merah "Email atau password salah.", sedangkan mengetik kredensial yang benar menampilkan pesan hijau "Login berhasil! Selamat datang, admin@mail.com", tanpa halaman dimuat ulang.

## Berkas lengkap

Setelah ketiga langkah diterapkan, seluruh isi `tutorial-login-html-css-js.html` menjadi seperti berikut.

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Halaman Login</title>

    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f2f5;
      }

      .login-container {
        background-color: #ffffff;
        padding: 32px 28px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 360px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 4px;
      }

      .btn-login {
        background-color: #4a90e2;
        color: #ffffff;
      }

      #message.success {
        color: green;
      }

      #message.error {
        color: red;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <h1>Halaman Login</h1>

      <form id="loginForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" name="email" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>

        <button type="submit" class="btn-login">Login</button>
      </form>

      <p id="message"></p>
    </div>

    <script>
      const VALID_EMAIL = "admin@mail.com";
      const VALID_PASSWORD = "admin123";

      const loginForm = document.getElementById("loginForm");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const messageEl = document.getElementById("message");

      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;

        if (emailValue === VALID_EMAIL && passwordValue === VALID_PASSWORD) {
          messageEl.textContent = "Login berhasil! Selamat datang, " + emailValue;
          messageEl.className = "success";
        } else {
          messageEl.textContent = "Email atau password salah.";
          messageEl.className = "error";
        }
      });
    </script>
  </body>
</html>
```

## Kredensial uji coba

| Kolom | Nilai |
|---|---|
| Email | `admin@mail.com` |
| Password | `admin123` |

## Catatan keamanan

::: danger Jangan hardcode kredensial di aplikasi sungguhan
Menyimpan email dan password langsung di dalam kode JavaScript (hardcode) hanya untuk tujuan latihan. Kode JavaScript di browser dapat dilihat siapa saja lewat menu View Page Source atau DevTools, sehingga cara ini tidak boleh dipakai untuk aplikasi login sungguhan. Pada aplikasi nyata, proses pengecekan kredensial harus dilakukan di sisi server (backend), bukan di browser (frontend).
:::
