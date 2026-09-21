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
> dengan bahasa visual neo-brutalism yang ditahan, dial ENERGY 2 / RHYTHM 1 /
> MOTION 2.

---

## Dials

| Dial | Nilai | Alasan satu baris |
|---|---|---|
| **ENERGY** | 2 | Situs ini alat kerja, bukan halaman promosi. Garis dan bayangan tegas memberi batas yang jelas antar bagian tanpa berteriak |
| **RHYTHM** | 1 | Semua halaman adalah petunjuk teknis dengan bentuk yang sama: judul, tabel, perintah, peringatan. Keseragaman membuat peserta tahu di mana mencari, tanpa belajar ulang tiap halaman |
| **MOTION** | 2 | Gerakan hanya pada elemen yang dapat disentuh, dan setiap gerakan menjawab pertanyaan "apakah ini bisa ditekan". Tidak ada animasi masuk saat menggulir |

RHYTHM sengaja tetap 1. Empat puluh empat halaman petunjuk teknis dibaca dengan
cara yang sama, dan variasi tata letak di sini akan mengurangi keterbacaan,
bukan menambah karakter. Yang dinaikkan adalah ENERGY pada kulitnya, bukan
susunan halamannya.

**Yang berubah, dan mengapa.** Arah sebelumnya memakai ENERGY 1 dan MOTION 1
dengan alasan bahwa halaman ini dibaca sambil bekerja. Alasan itu masih berlaku,
sehingga RHYTHM tidak dinaikkan dan tidak ada animasi gulir. Yang dikoreksi
adalah anggapan bahwa ketenangan harus berarti tanpa batas yang tegas: garis dan
bayangan keras justru membantu mata menemukan batas tabel dan blok perintah,
terutama pada halaman sepanjang halaman deployment.

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

### Netral

Neo-brutalism bekerja karena warna netralnya ikut ditentukan, bukan diserahkan
ke bawaan. Netral di bawah tidak dihitung sebagai warna inti.

| Peran | Terang | Gelap | Asalnya |
|---|---|---|---|
| Kertas (latar halaman) | `#f4f1ea` | `#14161a` | Kertas hangat, bukan putih murni: garis hitam tebal di atas putih murni menyilaukan untuk bacaan panjang |
| Permukaan (kartu, blok kode) | `#ffffff` | `#1d2025` | Satu tingkat di atas kertas, supaya batas blok terlihat tanpa bayangan |
| Tinta (teks dan garis) | `#111111` | `#f2f2f0` | Hitam pekat, bukan hitam murni, agar tidak bergetar di layar |
| Garis tepi | `#111111` | `#e8e6e1` | Pada mode gelap, garis terang di atas latar nyaris hitam; inilah yang membuat batas tetap terbaca |

Rasio kontras terukur: tinta pada kertas **16,74:1** di mode terang dan
**16,16:1** di mode gelap. Batas minimum teks biasa 4,5:1.

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

Dua pola yang diulang, supaya situs ini terasa milik lembaga ini dan bukan
templat umum.

**Pertama, garis penanda bagian aktif berwarna oranye.**

- Di sidebar: batang tebal di tepi kiri butir yang sedang dibuka, dengan latar
  blok navy sehingga posisinya terbaca dari jauh.
- Di teks isi: batang pada daftar isi untuk judul bagian yang sedang dibaca.

Garis itu menjawab satu pertanyaan yang sering ditanyakan peserta di tengah
materi yang panjang: **"saya sedang di bagian mana"**.

Oranye dipakai di sini karena warnanya sudah ada di logo, dan karena
pemakaiannya yang terbatas membuatnya menonjol tanpa perlu efek lain.

**Kedua, garis tepi tegas dengan bayangan keras tanpa blur.**

Setiap blok yang punya batas, yaitu tabel, blok kode, blok peringatan, kartu,
dan tombol, memakai garis tepi 2px berwarna tinta dengan bayangan padat
4px mengikuti arahnya. Bayangannya tidak kabur sama sekali.

Alasannya: bayangan kabur menyatakan ketinggian, sedangkan di dokumen ini yang
perlu dinyatakan adalah **batas**. Bayangan padat menyatakan batas itu dengan
cara yang sama seperti kertas yang ditumpuk, dan itu sesuai untuk materi yang
juga dicetak menjadi PDF.

Tombol memakai pola yang sama untuk menyatakan tekan: saat disentuh, tombolnya
bergerak ke arah bayangannya, dan saat ditekan bayangannya hilang sehingga
tombolnya rata dengan halaman.

---

## Gerakan

Gerakan hanya dipakai pada elemen yang dapat disentuh, dan setiap gerakan
menjawab satu pertanyaan: apakah ini bisa ditekan.

| Gerakan | Durasi | Menjawab |
|---|---|---|
| Tombol bergeser 2px ke arah bayangannya saat hover | 120ms | Menandai bahwa elemennya dapat ditekan |
| Tombol rata dengan halaman saat ditekan | 120ms | Mengonfirmasi tekanannya tercatat |
| Kartu dan tautan terangkat 2px saat hover | 140ms | Menandai bahwa seluruh kartunya dapat diklik |
| Butir sidebar aktif berpindah latar | 160ms | Menandai perpindahan halaman tanpa perlu membaca ulang |
| Cincin fokus saat Tab | tanpa animasi | Fokus keyboard harus muncul seketika, bukan menyusul |

Yang **tidak** dipakai: animasi masuk saat menggulir, animasi pada judul, dan
animasi pada tabel. Ketiganya menunda isi yang sedang dicari peserta.

Seluruh gerakan dimatikan ketika sistem pembaca meminta gerakan dikurangi
melalui `prefers-reduced-motion`.

---

## Latar: tiga lapisan yang turun dari langit ke peta ke teks

Halaman baca berdiri sebagai lembar kertas pekat di atas latar yang lebih
gelap, sehingga terlihat melayang. Latarnya tidak sama di semua halaman,
melainkan dibedakan menurut jenis halaman, dan pembedaannya mengikuti satu
gerak: dari langit, ke peta, lalu ke teks.

| Halaman | Lapisan | Alasan |
|---|---|---|
| Beranda | Titik bintang, kerangka bola, dan cahaya nebula | Tempat pelatihan ini berdiri: citra satelit yang datang dari atas, dan bola bumi yang koordinatnya diajarkan pada Praktik 1 |
| Daftar materi | Garis batas administrasi Jakarta | Halaman ini memang peta isi pelatihan, jadi latarnya adalah peta |
| Halaman praktik | Paling tenang: bintangnya diredupkan, tanpa bola dan tanpa peta | Yang dibaca di sini adalah perintah. Latar tidak boleh berlomba dengan teks |

Pembedaan ini menjawab dua hal sekaligus. Beranda menjadi terasa tersendiri
karena lapisan penuhnya hanya ada di sana, dan halaman praktik menjadi yang
paling tenang justru di tempat yang paling perlu tenang.

**Bentuk batas administrasinya bukan gambar tangan.** Berkasnya adalah
`batas_admin.geojson` dari folder latihan peserta sendiri, yaitu data yang
mereka pakai pada Praktik 1 dan Praktik 3. Berisi empat wilayah DKI Jakarta
dengan 578 titik, disederhanakan menjadi 359 titik. Memakai geometri yang
nyata membuat situs ini tidak mungkin tertukar dengan templat umum, dan
asalnya dapat ditelusuri.

Garis kontur sempat dipertimbangkan karena lebih khas peta topografi, lalu
tidak dipakai: kontur yang digambar sendiri adalah bentuk terrain karangan,
sedangkan batas administrasi ini nyata dan berasal dari kelas itu sendiri.

Kerangka bola sengaja berbentuk bulat, bukan kisi persegi, karena kisi persegi
hanya terbaca sebagai kertas grafik.

Warnanya tetap tiga warna logo: navy dan biru langit untuk cahayanya, oranye
dipakai sangat sedikit pada satu sudut.

**Latar ini tidak bergerak.** Tidak ada bintang berkelip, tidak ada parallax
saat menggulir. Alasannya ada pada dial MOTION: peserta membaca sambil
mengetik perintah, dan latar yang bergerak menarik mata ke tempat yang salah.
Kesan hidup datang dari gerakan pada elemen yang disentuh, bukan dari latar.

Bentuknya dibuat dari gradien dan satu berkas SVG kecil di dalam CSS, tanpa
berkas gambar dan tanpa pustaka animasi. Alasannya sama dengan alasan font
sistem: halaman harus tetap ringan pada koneksi pelatihan.

Yang **tidak** dipakai: latar bergrid persegi, bintang berkelip, parallax,
dan gambar nebula hasil unduhan.

---

## Warna penanda tempat menjalankan

Setiap tahap pada materi deployment diawali penanda tempat perintahnya
dijalankan. Penandanya memakai empat warna, bukan satu warna, karena
menemukan "apakah ini di VM atau di Cloud Shell" harus terjadi sebelum
perintahnya disalin.

| Tempat | Warna | Alasan |
|---|---|---|
| Laptop dan peramban sendiri | Tinta pekat | Titik awal pekerjaan, dan yang paling dekat dengan peserta |
| Cloud Shell dan konsol Google Cloud | Biru langit | Perkakas remote, warna dari globe pada logo |
| Terminal VM dan antarmuka GeoServer | Navy | Lapisan paling dalam, warna paling pekat pada logo |
| SQL Editor Supabase | Oranye | Layanan luar yang dibuka di peramban. Oranye adalah warna aksen, dan hanya dipakai di sini supaya tetap menjadi penanda |

Kontras keempatnya terukur lulus WCAG AA pada kedua mode, yaitu 5,29:1 sampai
16,74:1 pada mode terang dan 6,53:1 sampai 14,52:1 pada mode gelap.

---

## Yang Tidak Dipakai, dan Alasannya

| Tidak dipakai | Alasan |
|---|---|
| Gradien | Tidak menambah keterbacaan, dan tidak ada di identitas lembaga |
| Bayangan kabur | Bayangan di sini menyatakan batas, bukan ketinggian. Bayangan kabur mengaburkan batas itu |
| Efek kaca (backdrop blur) | Sama, dan menghambat pembacaan teks di atasnya |
| Sudut sangat membulat | Tabel dan blok kode butuh sudut yang jelas agar batasnya terlihat. Sudut dipakai 3px, bukan 0 dan bukan pil |
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
