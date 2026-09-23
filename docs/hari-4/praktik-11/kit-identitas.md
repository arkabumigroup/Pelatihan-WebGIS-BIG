# Kit Identitas Peserta

Halaman ini menyimpan identitas peserta di browser, lalu membuat seluruh nama resource dan nilai rahasia yang diturunkan darinya. Isinya menggantikan blok yang harus diketik pada [Tahap 2 halaman Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori#tahap-2-tetapkan-identitas-peserta). Langkah 3 di sini juga dapat dipakai sebagai ganti perintah `node scripts/hash-password.mjs` yang membuat hash kata sandi super admin; keduanya sama-sama sah, dan [halaman Menjalankan Berkas SQL](/hari-4/praktik-11/menjalankan-skema#membuat-akun-super-admin) menyebut keduanya sebagai dua pilihan.

## Masalah yang Dipecahkan

Variabel shell pada blok Tahap 2 hanya bertahan selama sesi Cloud Shell terbuka. Cloud Shell memutus sesinya setelah sekitar 40 menit tanpa aktivitas di terminal, sedangkan pelatihan ini berlangsung berjam-jam. Setiap kali sesinya berganti, kedua nilai dari tabel peserta harus dicari dan diketik kembali.

Kegagalan yang muncul saat itu tidak menunjuk ke penyebabnya. Halaman [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori#bila-cloud-shell-tertutup-di-tengah-jalan) mencatat dua errornya:

```text
ERROR: (gcloud.compute.instances.describe) could not parse resource []
http:///geoserver/web
```

Halaman ini membuat pemulihannya tidak perlu mengetik apa pun. Identitas disimpan di browser, jadi cukup dibuka dan bloknya disalin lagi.

Daftar namanya memuat peserta **batch 1 dan batch 2**, masing-masing 41 orang. Setiap pilihan sudah diberi keterangan batch dan kelompoknya, supaya peserta dapat memastikan dirinya memilih baris yang benar sebelum bloknya disalin.

## Cara Memakai

<KitIdentitas :judul="''" />

## Setelah Kit Diisi

Identitas yang tersimpan di sini dipakai halaman lain. Begitu nama peserta dan Project ID terisi, blok kode di seluruh modul yang masih memuat bentuk contoh akan terisi sendiri dengan nilai Anda ketika halamannya dibuka. Peserta yang belum mengisi kit tidak melihat perubahan apa pun.

Nilai yang berubah dan nilai yang masih harus diganti dibedakan lewat penandaan merah:

| Penanda | Artinya |
|---|---|
| Merah, garis bawah penuh | Nilai milik Anda, terisi dari halaman ini. Bagian inilah yang berbeda dari bentuk contohnya. |
| Merah, garis bawah titik-titik | Masih bentuk contoh, dan harus Anda ganti sendiri. |

Penandaan itu muncul di dua tempat. Di dalam blok kode, seluruh nilai yang bukan milik Anda ditandai. Di dalam kalimat dan tabel, hanya nilai yang benar-benar harus Anda ganti yang ditandai, misalnya `IP_EKSTERNAL_VM`, `SUBDOMAIN`, `PARTICIPANT_ID`, `USERNAME_GITHUB_PESERTA`, `[YOUR-PASSWORD]`, dan alamat email pada bagian sertifikat. Nama variabel shell seperti `$SUBDOMAIN` sengaja tidak ditandai, karena itu memang dipakai apa adanya.

Nilai tanpa penandaan apa pun sama untuk semua peserta, misalnya `katalog-images` dan `asia-southeast2-b`.

Bila Anda menekan **Hapus data tersimpan**, pengisian otomatisnya berhenti dan bentuk contohnya muncul kembali. Halaman yang sedang terbuka perlu dimuat ulang sekali untuk itu.

File PDF tidak ikut terisi, karena satu PDF dipakai seluruh peserta.

## Yang Disimpan, dan di Mana

Halaman ini menyimpan dua kelompok nilai.

**Kelompok pertama** adalah identitas peserta: **Nama Peserta**, **Project ID**, dan **empat nilai acak** yang Anda buat pada langkah 4. Ketiga belas nilai turunan lainnya tidak disimpan, melainkan dihitung ulang setiap kali halaman ini dibuka, sehingga tidak ada yang dapat tertinggal saat salah satu nilai di atas berubah.

Empat nilai acak itu disimpan justru supaya tidak berubah. Nilai yang sudah Anda salin ke file `.env` harus tetap sama dengan yang tertulis di sini, dan menggantinya setelah terpasang membuat login gagal. Karena itu tombol **Buat ulang** meminta konfirmasi lebih dahulu.

**Kelompok kedua** adalah kata sandi super admin beserta emailnya, dari langkah 3. Keduanya disimpan karena tidak dapat dibaca kembali dari mana pun: yang ditempel ke file SQL hanyalah hash bcrypt, dan hash itu satu arah. Peserta yang menutup halaman ini tanpa mencatat kata sandinya harus menggantinya lewat SQL Editor.

Hash bcrypt-nya sendiri tidak disimpan. Nilainya panjang, hanya dipakai sekali saat mengisi `sql/02-seed-super-admin.sql`, dan dapat dihitung ulang kapan saja selama kata sandinya masih ada. Setelah halaman dimuat ulang, kotak hash karena itu menampilkan tombol **Hitung ulang hash**, bukan nilai yang lama.

Hash yang dihitung ulang **berbeda** dari yang lama, walaupun kata sandinya sama persis, karena bcrypt menyisipkan salt baru pada setiap perhitungan. Yang berbeda hanya tulisan hash-nya, bukan kata sandinya: hash lama yang sudah terlanjur ditempel ke file SQL tetap sah dan tetap cocok dengan kata sandi itu. Jadi nilai yang berbeda di halaman ini bukan tanda ada yang salah, dan tidak perlu menjalankan file SQL-nya sekali lagi.

Penyimpanannya memakai dua tempat sekaligus. Pilihan pertama `localStorage`, dan bila tidak tersedia barulah cookie. Alasannya, `localStorage` dapat kosong pada mode penyamaran tertentu dan pada browser yang membersihkan penyimpanan lokal antar sesi, sedangkan cookie bertahan pada kedua keadaan itu. Kata sandi super admin hanya memakai `localStorage`, karena isinya kredensial dan tidak perlu ikut terkirim pada setiap permintaan ke situs ini.

Keempat baris nilai acak itu mengisi lima variabel, karena `GEOSERVER_PASSWORD` dan `GEOSERVER_ADMIN_PASSWORD` memang harus bernilai sama. Satu baris menanganinya sekaligus, sehingga keduanya tidak dapat berbeda tanpa sengaja.

:::: warning Dua nilai identitas itu terbuka, sisanya rahasia
**Nama Peserta** dan **Project ID** sudah tercantum pada [tabel peserta](/hari-4/praktik-11/peserta-project) yang dapat dibaca siapa saja, jadi keduanya bukan rahasia.

Selebihnya adalah kredensial. Empat nilai acak, kata sandi super admin, dan emailnya tersimpan di komputer Anda tanpa enkripsi. Pakai tombol **Hapus data tersimpan** bila Anda memakai komputer bersama atau komputer pinjaman, dan jangan memotret halaman ini untuk dibagikan.

Yang perlu diingat justru sebaliknya: kata sandi super admin **harus** Anda catat di tempat yang dapat Anda buka lagi. Menutup halaman ini tanpa mencatatnya membuat akun super admin tidak dapat dimasuki, dan satu-satunya jalan keluar adalah mengganti hash-nya lewat SQL Editor.
::::

### Data ini tidak pindah ke komputer lain

Isinya melekat pada browser dan alamat situs ini. Membuka halaman ini dari laptop lain, atau dari browser lain pada laptop yang sama, akan menampilkan halaman kosong.

Isinya juga tidak sampai ke Cloud Shell dengan sendirinya. Yang berpindah hanya blok dan nilai yang Anda salin sendiri.

### Menghapusnya

Tombol **Hapus data tersimpan** di bagian bawah alat ini menghapus identitas peserta beserta nilai acaknya. Kotak kata sandi super admin punya tombol **Hapus dari browser ini** sendiri, karena isinya kredensial dan sebagian peserta menyimpannya di tempat lain.

Keduanya dijalankan terpisah supaya menghapus identitas tidak ikut menghapus kata sandi yang sudah dipakai membuat akun. Sebaliknya, menghapus kata sandi tidak mengubah akun yang sudah ada di database; yang hilang hanya salinannya di browser ini.

Pakai tombol itu bila Anda salah memilih nama peserta dan ingin memulai dari awal. Nilai yang salah tersimpan akan muncul lagi setiap kali halaman ini dibuka sampai dihapus.

## Bila Tombolnya Tidak Dapat Dipakai

Halaman ini memerlukan JavaScript, karena seluruh nilainya dihitung di browser Anda dan tidak ada server yang terlibat. Bila tombolnya tidak bereaksi, periksa dua hal berikut.

1. **Browser memblokir penyimpanan.** Mode penyamaran pada sebagian browser menolak penulisan. Nilainya tetap dapat dibuat dan disalin, hanya saja tidak tersimpan setelah halaman ditutup.
2. **Situs dibuka tanpa HTTPS.** Sumber acaknya tetap bekerja, tetapi tombol **Salin** memerlukan HTTPS pada sebagian browser. Bila tombolnya gagal, blok dan nilainya masih dapat dipilih lalu disalin dengan `Ctrl+C`.

Bila keduanya bukan penyebabnya, atau bila Anda memang lebih suka bekerja di terminal, perintah berikut menghasilkan nilai yang sama:

```bash
# Di terminal, untuk JWT_SECRET dan NEXTAUTH_SECRET: 64 karakter
openssl rand -hex 32

# Di terminal VM, untuk GEOSERVER_PASSWORD: 32 karakter
openssl rand -hex 16

# Di Windows, PowerShell, atau Command Prompt, sebagai ganti `openssl`
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Di folder proyek, sebagai cara lain membuat hash kata sandi super admin
node scripts/hash-password.mjs
```

## Setelah Bloknya Tersalin

Kembali ke [Persiapan Repositori](/hari-4/praktik-11/persiapan-repositori) dan lanjutkan dari Tahap 3. Perintah `gcloud config set project` sudah ikut di dalam blok, jadi tidak ada yang perlu dijalankan lebih dahulu.

Bila Cloud Shell menutup sesinya lagi di tengah pekerjaan, buka halaman ini dan salin bloknya sekali lagi. Tidak ada nilai yang perlu dicari ulang di tabel peserta.

Kata sandi super admin dipakai pada [Tahap 2 halaman Persiapan Repositori dan Database](/hari-4/praktik-11/persiapan-database#buat-akun-super-admin). Yang ditempel ke `sql/02-seed-super-admin.sql` adalah hash-nya, bukan kata sandinya, dan kata sandi itu sendiri dipakai untuk masuk ke portal pada [Tahap 8](/hari-4/praktik-11/uji-dan-jalankan#tahap-8-uji-seluruh-file-di-laptop).
