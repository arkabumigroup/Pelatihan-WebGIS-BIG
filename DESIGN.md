# DESIGN.md — Situs Materi Pelatihan WebGIS

Arah visual untuk situs VitePress di repositori ini.

> **Asal arah ini.** Tidak ada pemilik brand yang menuliskan arah ini. Nilainya
> diekstrak dari aset yang sudah ada di repositori (logo dan warna yang
> terpasang) dan dari konteks pemakaian (pelatihan teknis tiga hari untuk
> peserta dan instruktur). Sumbernya dicatat pada tiap keputusan, supaya dapat
> ditelusuri dan dikoreksi. Bila ada yang tidak sesuai, ubah berkas ini, bukan
> CSS-nya.

---

## Apa Situs Ini

Situs dokumentasi pelatihan WebGIS untuk peserta dan instruktur PPKIG BIG dan
Arkabumi. Isinya 27 halaman petunjuk teknis: perintah terminal, tabel
konfigurasi, tangkapan layar antarmuka, dan peringatan kesalahan umum.

**Yang dibaca peserta:** satu halaman pada satu waktu, sambil membuka terminal
di jendela lain.

**Tujuan desain utamanya:** peserta tidak tersesat, dan tidak salah membaca.
Bukan membuat mereka terkesan.

---

## Reading

> Reading this as: dokumentasi teknis pelatihan untuk peserta dan instruktur,
> dengan bahasa visual institusional yang tenang, dial ENERGY 1 / RHYTHM 1 /
> MOTION 1.

---

## Dials

| Dial | Nilai | Alasan satu baris |
|---|---|---|
| **ENERGY** | 1 | Peserta membuka halaman ini sambil bekerja. Halaman yang "menyapa keras" mengganggu pekerjaan itu. |
| **RHYTHM** | 1 | Semua halaman adalah petunjuk teknis dengan bentuk yang sama: judul, tabel, perintah, peringatan. Keseragaman membuat peserta tahu di mana mencari, tanpa belajar ulang tiap halaman. |
| **MOTION** | 1 | Gerakan hanya pada respons sentuhan: hover, fokus, dan buka tutup sidebar. Animasi tidak menambah kemampuan membaca perintah terminal. |

Dial ini disengaja rendah. Menambah gerakan atau variasi tata letak di sini
akan mengurangi keterbacaan, bukan menambah karakter.

---

## Palet

Palet diambil dari logo resmi di `docs/public/Logo-Light.png`, bukan dipilih
dari selera. Ketiga warna itu sudah menjadi identitas lembaga sebelum situs ini
ada.

| Peran | Warna | Hex | Asalnya |
|---|---|---|---|
| Utama | Navy | `#003060` | Badan huruf ARKABUMI pada logo, tepi PPKIG |
| Sekunder | Biru langit | `#1070b0` | Globe BAKOSURTANAL dan huruf PPKIG pada logo |
| Aksen | Oranye | `#e08000` | Segitiga Arkabumi dan kilau pada huruf PPKIG |

Aturan pemakaian:

- **Navy** untuk tautan, judul bagian aktif, dan tombol utama.
- **Biru langit** untuk keadaan hover dan garis pemisah yang menandai bagian.
- **Oranye** hanya untuk penanda posisi, yaitu penunjuk bagian yang sedang
  dibaca. Satu pemakaian per layar. Oranye pada logo hanya muncul sebagai
  bentuk kecil, dan itu dijaga di sini.

### Oranye penanda posisi, dan angkanya

Oranye dipakai sebagai **batang penanda**, bukan sebagai warna teks. Alasannya
terukur: oranye asli logo hanya mencapai **2,89:1** pada latar putih, sedangkan
teks biasa memerlukan 4,5:1.

Batang penanda termasuk elemen antarmuka, sehingga batasnya 3:1. Satu oranye
tetap tidak cukup untuk kedua mode, karena latar sidebar berbeda:

| Mode | Nilai dipakai | Latar sidebar | Rasio | Fokus di dokumen |
|---|---|---|---|---|
| Terang | `#b45309` | `#f6f6f7` | 4,65:1 | 5,02:1 pada putih |
| Gelap | `#e08000` | `#161618` | 6,25:1 | 5,93:1 pada `#1b1b1f` |

Pada mode gelap, oranye asli logo justru yang memenuhi syarat, sehingga
identitasnya paling dekat di sana. Pada mode terang, oranye itu digelapkan
satu tingkat. Keduanya masih oranye yang sama, hanya berbeda kecerahan.

**Yang diganti.** Sebelumnya situs memakai `#2563eb`, biru generik yang tidak
ada di logo. Warna itu diganti karena tidak berasal dari identitas lembaga.
Biru generik juga warna bawaan banyak perkakas, sehingga tidak membedakan situs
ini dari situs lain.

Maksimal tiga warna ditambah netral. Tidak ada warna keempat.

---

## Tipografi

Tipografi bawaan VitePress dipertahankan, bukan karena malas, tetapi karena
dua alasan yang dapat diperiksa:

1. **Teks isi memakai font sistem.** Peserta membaca sambil menyalin perintah.
   Font sistem tidak perlu diunduh, sehingga halaman muncul lebih cepat pada
   koneksi pelatihan yang tidak selalu baik.
2. **Antarmuka memakai Inter.** VitePress membawanya sendiri. Inter dipilih di
   sini karena hurufnya jelas pada ukuran kecil di dalam tabel, dan tabel
   adalah bentuk yang paling banyak dipakai di situs ini.

Yang **tidak** dipakai: font mono sebagai identitas. Blok perintah sudah
memakai mono, dan menambah mono di tempat lain hanya menambah gaya tanpa
menambah keterbacaan.

---

## Motif Identitas

Satu pola yang diulang, supaya situs ini terasa milik lembaga ini dan bukan
templat umum:

**Garis penanda bagian aktif berwarna oranye.**

- Di sidebar: batang tipis di tepi kiri butir yang sedang dibuka.
- Di teks isi: garis bawah tipis pada judul bagian yang sedang dibaca, saat
  masuk daftar isi.

Garis itu menjawab satu pertanyaan yang sering ditanyakan peserta di tengah
materi yang panjang: **"saya sedang di bagian mana"**.

Oranye dipakai di sini karena warnanya sudah ada di logo, dan karena
pemakaiannya yang terbatas membuatnya menonjol tanpa perlu efek lain.

---

## Yang Tidak Dipakai, dan Alasannya

| Tidak dipakai | Alasan |
|---|---|
| Gradien | Tidak menambah keterbacaan, dan tidak ada di identitas lembaga |
| Bayangan besar pada kartu | Situs ini dokumen, bukan dasbor. Bayangan hanya menambah keramaian |
| Efek kaca (backdrop blur) | Sama, dan menghambat pembacaan teks di atasnya |
| Sudut sangat membulat | Tabel dan blok kode butuh sudut yang jelas agar batasnya terlihat |
| Animasi masuk saat menggulir | Peserta menggulir cepat mencari satu perintah. Animasi menunda perintah itu muncul |
| Ikon hiasan | Tidak ada ikon yang menambah arti pada perintah terminal |
| Mode gelap sebagai bawaan | Peserta sering membaca sambil membandingkan dengan terminal yang gelap, tetapi materi ini juga dibaca di ruang terang. Pilihan diserahkan ke pembaca, dan kedua mode diuji |

---

## Yang Harus Tetap Aman

Hal-hal ini lebih penting daripada tampilan, dan tidak boleh dikorbankan demi
keindahan:

1. **Tabel tidak boleh meluber.** Banyak tabel memuat perintah panjang. Pada
   layar sempit, tabel boleh menggulir mendatar di dalam wadahnya, tetapi
   halaman tidak boleh ikut melebar.
2. **Blok perintah harus utuh.** Perintah yang terpotong membuat peserta
   menyalin perintah yang salah.
3. **Kontras teks.** Mininal 4,5:1 untuk teks biasa. Diterapkan di mode terang
   dan gelap.
4. **Fokus keyboard terlihat.** Peserta memakai Tab untuk berpindah bagian.
5. **Tangkapan layar tetap dapat diperbesar.** Materi bergantung pada gambar
   antarmuka, dan gambar kecil harus bisa dibuka besar.

---

## Batas Perubahan

Arah ini mengizinkan perubahan warna, motif, dan kerapian. Arah ini **tidak**
mengizinkan:

- Mengubah struktur navigasi tanpa menyesuaikan isi materi.
- Menambah halaman yang isinya belum ada.
- Menyisipkan angka, testimoni, atau klaim yang tidak punya sumber.
