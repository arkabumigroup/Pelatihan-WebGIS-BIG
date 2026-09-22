# Kit Identitas Peserta

Halaman ini menyimpan identitas peserta di peramban, lalu membangkitkan seluruh nama resource dan nilai rahasia yang diturunkan darinya. Isinya menggantikan blok yang harus diketik pada [Tahap 2 halaman Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori#tahap-2-tetapkan-identitas-peserta).

## Masalah yang Dipecahkan

Variabel shell pada blok Tahap 2 hanya bertahan selama sesi Cloud Shell terbuka. Cloud Shell menutup sesinya sendiri setelah menganggur sekitar dua puluh menit, sedangkan pelatihan ini berlangsung berjam-jam. Setiap kali sesinya berganti, kedua nilai dari tabel peserta harus dicari dan diketikkembali.

Kegagalan yang muncul saat itu tidak menunjuk ke penyebabnya. Halaman [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori#bila-cloud-shell-tertutup-di-tengah-jalan) mencatat dua gejalanya:

```text
ERROR: (gcloud.compute.instances.describe) could not parse resource []
http:///geoserver/web
```

Halaman ini membuat pemulihannya tidak perlu mengetik apa pun. Identitas disimpan di peramban, jadi cukup dibuka dan bloknya disalin lagi.

Daftar namanya memuat peserta **batch 1 dan batch 2**, masing-masing 41 orang. Setiap pilihan sudah diberi keterangan batch dan kelompoknya, supaya peserta dapat memastikan dirinya memilih baris yang benar sebelum bloknya disalin.

## Cara Memakai

<KitIdentitas :judul="''" />

## Yang Disimpan, dan di Mana

Tujuh nilai disimpan, yaitu **Nama Peserta**, **Project ID**, dan **empat nilai acak** yang Anda buat pada langkah 3. Tiga belas nilai turunan lainnya tidak disimpan, melainkan dihitung ulang setiap kali halaman ini dibuka, sehingga tidak ada yang dapat tertinggal saat salah satu nilai di atas berubah.

Empat nilai acak itu disimpan justru supaya tidak berubah. Nilai yang sudah Anda salin ke berkas `.env` harus tetap sama dengan yang tertulis di sini, dan menggantinya setelah terpasang membuat login gagal. Karena itu tombol **Buat ulang** meminta konfirmasi lebih dahulu.

Penyimpanannya memakai dua tempat sekaligus. Pilihan pertama `localStorage`, dan bila tidak tersedia barulah cookie. Alasannya, `localStorage` dapat kosong pada mode penyamaran tertentu dan pada peramban yang membersihkan penyimpanan lokal antar sesi, sedangkan cookie bertahan pada kedua keadaan itu.

Keempat baris itu mengisi lima variabel, karena `GEOSERVER_PASSWORD` dan `GEOSERVER_ADMIN_PASSWORD` memang harus bernilai sama. Satu baris menanganinya sekaligus, sehingga keduanya tidak dapat berbeda tanpa sengaja.

:::: warning Dua nilai identitas itu terbuka, empat nilai acak tidak
**Nama Peserta** dan **Project ID** sudah tercantum pada [tabel peserta](/hari-4/praktik-11/peserta-project) yang dapat dibaca siapa saja, jadi keduanya bukan rahasia.

Empat nilai acaknya berbeda. `JWT_SECRET`, `NEXTAUTH_SECRET`, dan `GEOSERVER_PASSWORD` adalah kredensial, dan di halaman ini ketiganya tersimpan di komputer Anda tanpa enkripsi. Pakai tombol **Hapus data tersimpan** bila Anda memakai komputer bersama atau komputer pinjaman, dan jangan memotret halaman ini untuk dibagikan.
::::

### Data ini tidak pindah ke komputer lain

Isinya melekat pada peramban dan alamat situs ini. Membuka halaman ini dari laptop lain, atau dari peramban lain pada laptop yang sama, akan menampilkan halaman kosong.

Isinya juga tidak sampai ke Cloud Shell dengan sendirinya. Yang berpindah hanya blok dan nilai yang Anda salin sendiri.

### Menghapusnya

Tombol **Hapus data tersimpan** di bagian bawah alat ini menghapus seluruhnya sekaligus, baik identitas maupun nilai acaknya.

Pakai tombol itu bila Anda salah memilih nama peserta dan ingin memulai dari awal. Nilai yang salah tersimpan akan muncul lagi setiap kali halaman ini dibuka sampai dihapus.

## Bila Tombolnya Tidak Dapat Dipakai

Halaman ini memerlukan JavaScript, karena seluruh nilainya dihitung di peramban Anda dan tidak ada server yang terlibat. Bila tombolnya tidak bereaksi, periksa dua hal berikut.

1. **Peramban memblokir penyimpanan.** Mode penyamaran pada sebagian peramban menolak penulisan. Nilainya tetap dapat dibuat dan disalin, hanya saja tidak tersimpan setelah halaman ditutup.
2. **Situs dibuka tanpa HTTPS.** Sumber acaknya tetap bekerja, tetapi tombol **Salin** memerlukan HTTPS pada sebagian peramban. Bila tombolnya gagal, blok dan nilainya masih dapat dipilih lalu disalin dengan `Ctrl+C`.

Bila keduanya bukan penyebabnya, kembali ke perintah terminal yang digantikan halaman ini:

```bash
# Di laptop, untuk JWT_SECRET dan NEXTAUTH_SECRET
openssl rand -hex 32

# Di Windows, PowerShell, atau Command Prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Di terminal VM, untuk GEOSERVER_PASSWORD
openssl rand -hex 16
```

## Setelah Bloknya Tersalin

Kembali ke [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori) dan lanjutkan dari Tahap 3. Perintah `gcloud config set project` sudah ikut di dalam blok, jadi tidak ada yang perlu dijalankan lebih dahulu.

Bila Cloud Shell menutup sesinya lagi di tengah pekerjaan, buka halaman ini dan salin bloknya sekali lagi. Tidak ada nilai yang perlu dicari ulang di tabel peserta.
