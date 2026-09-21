# Membuat Form Login

Front-End adalah bagian dari aplikasi web yang dilihat dan digunakan langsung oleh pengguna di browser, seperti halaman, tombol, form, dan peta. Bagian ini menampilkan data dan menerima aksi dari pengguna.

NextJS adalah framework berbasis React untuk membuat aplikasi web. NextJS sudah menyediakan banyak hal yang biasanya harus disiapkan sendiri, misalnya pengaturan alamat halaman (routing) berdasarkan struktur folder. Di proyek WebGIS ini, NextJS menjadi bagian FrontEnd yang menghubungkan tampilan, peta, dan login.

![FrontEnd NextJS pada diagram arsitektur WebGIS](form-login/image1.png)

Proyek Next.js dan repositori GitHub sudah disiapkan pada halaman [Persiapan dan Konfigurasi Framework](/hari-1/praktik-3/konfigurasi-framework). Halaman ini melanjutkan pekerjaan tersebut ke halaman login.

## Yang Akan Dipraktikkan

Pada praktik ini peserta membangun halaman login. Fokusnya hanya pada front-end, sedangkan bagian backend diajarkan pada praktik selanjutnya.

Halaman login dikerjakan dalam 3 langkah:

| Langkah | Yang dikerjakan |
|---|---|
| Struktur | Menampilkan form polos berisi judul, input email dan password, serta tombol |
| Style | Memberi tampilan agar form lebih rapi |
| Logic | Membuat form dapat memberi tanggapan atas email dan password yang diisi |

Sambil praktik, peserta mengenal berkas `page.js`, yaitu isi halaman yang tampil di browser, dan konsep dasar React: satu halaman dapat dipecah menjadi komponen-komponen kecil di berkas terpisah (`LoginForm`), lalu dipasang kembali dengan `import`.

## Tujuan

Setelah praktik ini, peserta mampu:

- Menjelaskan apa itu Front-End dan NextJS.
- Membuat project NextJS dan menjalankannya di browser.
- Membuat halaman login sederhana dengan struktur, style, dan logic.

## Apa Itu Framework Web

Framework web adalah kerangka kerja berisi kumpulan tools, aturan, dan struktur baku yang membantu developer membangun aplikasi web tanpa harus menulis semua fungsi dasar dari nol.

### Struktur Baku

![Ikon struktur baku pada framework](form-login/image2.png)

Framework menyediakan pola arsitektur (folder, routing, komponen) yang konsisten.

### Fitur Siap Pakai

![Ikon fitur siap pakai](form-login/image3.png)

Fitur yang sudah tersedia mempercepat proses development.

### Modular dan Dapat Dipakai Ulang

![Ikon kode modular yang dapat dipakai ulang](form-login/image4.png)

Kode dipecah menjadi bagian kecil yang dapat digunakan ulang.

### Contoh Framework Populer

| Framework | Bidang |
|---|---|
| Next.js | Framework berbasis React, dipakai pada pelatihan ini |
| Laravel | Framework backend berbasis PHP |
| Django | Framework backend berbasis Python |
| Angular / Vue | Framework frontend berbasis JavaScript |

## Mengapa Memakai Framework

Membangun web tanpa framework berarti menulis ulang banyak hal dasar secara manual.

### Tanpa Framework

![Ikon pekerjaan tanpa framework](form-login/image5.png)

- Menulis routing, state, dan struktur dari nol.
- Rawan inkonsisten antar bagian aplikasi.
- Waktu development jauh lebih lama.
- Sulit dipelihara saat aplikasi membesar.

### Dengan Framework

![Ikon pekerjaan dengan framework](form-login/image6.png)

- Struktur dan konvensi sudah tersedia.
- Fitur siap pakai: routing, optimasi, dan sebagainya.
- Development lebih cepat dan efisien.
- Terpelihara dan dapat dikembangkan bersama tim.

## Apa Itu Next.js

Next.js adalah framework React untuk membangun aplikasi web modern secara full-stack: mencakup rendering di server, routing berbasis file, sampai optimasi performa bawaan.

### File-based Routing

![Ikon routing berbasis berkas](form-login/image7.png)

Struktur folder otomatis menjadi rute aplikasi (App Router).

### Server dan Client Rendering

![Ikon rendering di server dan di client](form-login/image8.png)

Mendukung SSR, SSG, ISR, dan Client-Side Rendering.

### Optimasi Otomatis

![Ikon optimasi otomatis](form-login/image9.png)

Optimasi gambar, font, dan kode bawaan untuk performa.

### Dibangun di Atas React

![Ikon React sebagai fondasi Next.js](form-login/image10.png)

Next.js memakai React sebagai fondasi UI-nya, lalu menambahkan lapisan routing, rendering, dan tooling produksi di atasnya.

Dipakai oleh Netflix, TikTok, Nike, dan Hulu.

## Mode Rendering di Next.js

Next.js fleksibel: setiap halaman dapat memilih strategi rendering yang paling sesuai.

### SSR (Server-Side Rendering)

![Ikon SSR](form-login/image11.png)

HTML dirender di server setiap ada permintaan, sehingga data selalu terbaru.

### SSG (Static Site Generation)

![Ikon SSG](form-login/image12.png)

HTML dibuat sekali saat build, sehingga penyajiannya cepat.

### ISR (Incremental Static Regeneration)

![Ikon ISR](form-login/image13.png)

Halaman statis yang diperbarui otomatis secara berkala.

### CSR (Client-Side Rendering)

![Ikon CSR](form-login/image14.png)

Konten dirender di browser pengguna lewat JavaScript.

## React Components

Component adalah blok bangunan dasar UI di React: sebuah fungsi JavaScript yang mengembalikan tampilan (JSX) dan dapat digunakan berulang kali.

### Reusable

![Ikon komponen yang dapat dipakai ulang](form-login/image15.png)

Satu komponen dapat dipakai di banyak tempat berbeda.

### Menerima Props

![Ikon data dikirim dari komponen induk ke komponen anak](form-login/image16.png)

Data dikirim dari komponen induk ke komponen anak.

### Dapat Disusun (Composable)

![Ikon komponen kecil digabung menjadi tampilan kompleks](form-login/image17.png)

Komponen kecil digabung menjadi tampilan yang kompleks.

Berkas `Card.jsx`:

```jsx
function Card({ title, desc }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
```

Pemakaian komponen tersebut:

```jsx
<Card
  title="Hello"
  desc="Komponen React"
/>
```

## App Router

Sistem routing Next.js berbasis struktur folder di dalam direktori `app/`. Setiap folder merepresentasikan sebuah segmen URL.

### page.js

![Ikon berkas page.js](form-login/image18.png)

Menentukan tampilan (UI) untuk suatu rute.

### layout.js

![Ikon berkas layout.js](form-login/image19.png)

Tampilan bersama yang membungkus beberapa halaman.

### loading.js

![Ikon berkas loading.js](form-login/image20.png)

UI otomatis saat konten sedang dimuat.

### route.js

![Ikon berkas route.js](form-login/image21.png)

Membuat API endpoint pada rute tersebut.

Struktur folder `app/`:

```text
app/
├─ layout.js
├─ page.js          → "/"
├─ about/
│  └─ page.js       → "/about"
├─ blog/
│  ├─ page.js       → "/blog"
│  └─ [slug]/
│     └─ page.js    → "/blog/:slug"
└─ api/
   └─ route.js      → "/api"
```

## React Hooks

Hooks adalah fungsi khusus yang memungkinkan komponen fungsi menggunakan state, siklus hidup, dan fitur React lainnya.

| Ikon | Hook dan kegunaan |
|---|---|
| ![Ikon useState](form-login/image22.png) | **useState**: menyimpan dan memperbarui data (state) dalam komponen |
| ![Ikon useEffect](form-login/image23.png) | **useEffect**: menjalankan efek samping, seperti fetch data dan subscription |
| ![Ikon useContext](form-login/image24.png) | **useContext**: mengakses data global tanpa meneruskan props berlapis |
| ![Ikon useRef](form-login/image25.png) | **useRef**: menyimpan nilai atau referensi tanpa memicu render ulang |
| ![Ikon useMemo](form-login/image26.png) | **useMemo**: menyimpan hasil kalkulasi agar tidak dihitung berulang |
| ![Ikon custom hook](form-login/image27.png) | **Custom Hook**: hook buatan sendiri untuk logika yang dapat dipakai ulang |

## Package dan Library

Package adalah kumpulan kode (library) siap pakai yang dapat diinstal ke proyek, biasanya melalui npm (Node Package Manager), untuk menghindari penulisan ulang fungsi umum.

### package.json

![Ikon berkas package.json](form-login/image28.png)

Berisi daftar dependensi dan konfigurasi proyek.

### node_modules/

![Ikon folder node_modules](form-login/image29.png)

Folder tempat semua package yang diinstal disimpan.

### npm install

![Ikon perintah npm install](form-login/image30.png)

Perintah untuk mengunduh dan memasang package.

### Pustaka Populer di Ekosistem Next.js

| Pustaka | Kegunaan |
|---|---|
| Tailwind CSS | Utility-first styling |
| Prisma | ORM untuk database |
| Axios | HTTP client untuk fetch data |
| Zustand / Redux | State management |
| Framer Motion | Animasi UI |

## Praktik: Membuat Halaman Login

Halaman login dibangun di dalam proyek yang sudah disiapkan pada halaman [Persiapan dan Konfigurasi Framework](/hari-1/praktik-3/konfigurasi-framework). Bila server pengembangan belum berjalan, jalankan `npm run dev` pada terminal di folder proyek.

### Berkas Halaman dan Komponen

Berkas `page.js` adalah isi halaman yang tampil di browser. Form login diletakkan pada komponen terpisah bernama `LoginForm`, lalu dipasang kembali ke halaman dengan `import`. Berikut kerangka `page.js` yang memasang komponen tersebut:

```jsx
import LoginForm from './LoginForm'

const Page = () => {
  return <LoginForm />
}

export default Page
```

### Langkah 1: Struktur

Form disusun lebih dulu tanpa gaya apa pun, supaya terlihat jelas bagian yang menyusun halaman.

1. Tulis judul halaman.
2. Tambahkan input email.
3. Tambahkan input password.
4. Tambahkan tombol.

### Langkah 2: Style

Setelah strukturnya selesai, form diberi tampilan agar lebih rapi. Gaya ditulis dengan CSS, sama seperti pada halaman login praktik sebelumnya.

### Langkah 3: Logic

Langkah terakhir membuat form dapat memberi tanggapan atas email dan password yang diisi. Pemeriksaan isian di sisi backend dikerjakan pada praktik selanjutnya, bukan di halaman ini.

## Rangkuman

| Ikon | Bagian |
|---|---|
| ![Ikon framework web](form-login/image31.png) | **Framework Web**: kerangka kerja untuk membangun aplikasi secara terstruktur |
| ![Ikon Next.js](form-login/image32.png) | **Next.js**: framework React untuk aplikasi full-stack modern |
| ![Ikon React Components](form-login/image33.png) | **React Components**: blok UI reusable yang membentuk tampilan aplikasi |
| ![Ikon App Router](form-login/image34.png) | **App Router**: routing otomatis berbasis struktur folder `app/` |
| ![Ikon React Hooks](form-login/image35.png) | **React Hooks**: menghubungkan komponen dengan state dan fitur React |
| ![Ikon package dan library](form-login/image36.png) | **Package & Library**: kode siap pakai yang dikelola lewat npm |

Langkah berikutnya ada pada halaman [Membuat Halaman Profil dengan Material UI](/hari-1/praktik-3/halaman-profil).
