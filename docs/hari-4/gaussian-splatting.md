# Gaussian Splatting

Halaman ini memuat sumber berkas contoh, cara mengunggahnya, sampai modelnya muncul di peta. Sesi Gaussian Splatting sendiri dipandu instruktur, jadi halaman ini adalah bahan pendamping, bukan langkah yang harus diikuti sendiri di rumah.

Gaussian Splatting merekam objek nyata dari sekumpulan foto, lalu menyimpannya sebagai ratusan ribu titik kecil. Tiap titik memuat warnanya sendiri dan bentuknya sendiri, biasanya pipih seperti cakram tipis. Hasilnya bukan permukaan padat seperti model 3D biasa, melainkan awan titik yang tampak padat saat dilihat dari jauh.

Bedanya dengan model 3D pada [Praktik 5](/hari-2/praktik-5/konfigurasi-viewer) cukup satu hal yang perlu Anda ingat: model 3D biasa memakai berkas `.glb` dan ditampilkan dengan Cesium, sedangkan Gaussian Splat memakai berkas `.ply` dan ditampilkan dengan penampil tersendiri di dalam portal.

## Berkas contoh yang bisa dipakai

Portal hanya menerima dua format, yaitu `.glb` untuk model 3D biasa dan `.ply` untuk Gaussian Splat. Berkas `.ply` tidak bisa dibuat sendiri tanpa proses perekaman, jadi pakai berkas contoh berikut.

| Berkas | Ukuran | Untuk apa |
|---|---|---|
| `vasedeck-contoh.ply` | 46,2 MB | Contoh Gaussian Splat asli, paling ringan untuk latihan unggah |
| `uji-penampil-bola.ply` | 7,1 MB | Bola uji. Bukan bahan latihan, hanya untuk memastikan penampilnya bekerja |
| `monas.glb` | 0,3 MB | Model 3D biasa, paling ringan untuk latihan unggah |
| `gedung_sate.glb` | 11,5 MB | Model 3D biasa yang lebih besar |

Keempat berkas itu ada di folder **File latihan** pada Drive pelatihan.

Berkas `vasedeck-contoh.ply` diturunkan dari scene **Vase on Deck**, salah satu dari enam scene yang dirilis bersama makalah PhysGaussian (CVPR 2024). Lisensinya **CC BY 4.0**, artinya boleh dipakai untuk keperluan apa pun termasuk komersial, asalkan sumbernya dicantumkan.

Sitasi yang dipakai bila hasilnya dipublikasikan:

```text
Xie, Tianyi, et al. "PhysGaussian: Physics-Integrated 3D Gaussians for
Generative Dynamics." CVPR 2024.
```

Berkas aslinya sebesar 237,7 MB dengan 941.746 splat. Berkas contoh di folder pelatihan sudah dikecilkan menjadi 46,2 MB, sehingga lebih jarang daripada aslinya dan lebih cepat diunggah saat latihan. Berkas aslinya kini juga muat, karena portal menerima sampai 1 GB, dan boleh dipakai bila Anda ingin kualitas penuh.

### Batas ukuran unggahan

Portal menerima berkas sampai **1 GB**. Batas itu diatur `client_max_body_size` pada `nginx.conf`, dan berkas yang melewatinya ditolak hampir seketika, karena Nginx memeriksa `Content-Length` sebelum membaca badannya.

Sebelum batas itu dinaikkan, bawaannya 100 MB, dan berkas yang melewatinya ditolak dengan gejala yang menyesatkan: portal membalas halaman HTML, dan peramban melaporkannya sebagai

```text
Unexpected token '<', "<html> ..." is not valid JSON
```

Pesan itu tidak menyebut ukuran berkas sama sekali. Bila Anda menemukannya, periksa `client_max_body_size` pada `nginx.conf`. Penjelasannya ada pada halaman [Menyiapkan GeoServer di VM](/hari-4/praktik-11/siapkan-geoserver-vm).

### Bagaimana unggahan besar ditangani

Dua hal membuat berkas ratusan megabita tidak lagi merepotkan.

**Isinya tidak pernah ditahan di memori.** Aplikasi mengalirkan berkasnya dari jaringan langsung ke disk, sepotong demi sepotong. Diukur pada berkas uji 608 MB, pemakaian memori server naik dari 97 MB menjadi 201 MB, dan angka itu tidak tumbuh mengikuti besar berkasnya. Cara lama yang menampung seluruh isi di memori memerlukan sekitar 1,7 kali ukuran berkas, sehingga berkas 1 GB akan menghabiskan hampir seluruh memori VM yang hanya 4 GB.

**Kemajuannya terlihat, dan terbagi dua tahap.** Selagi berkas dikirim, dialog menampilkan persentase, jumlah yang sudah terkirim, dan laju kirimnya. Setelah pengiriman selesai, tampilannya berganti menjadi keterangan bahwa server sedang menyimpan, karena pada saat itu berkasnya masih ditulis ke disk dan barisnya masih disimpan ke database. Tahap kedua itu yang membuat bilahnya tidak berhenti di 100 persen dan terlihat seperti macet.

Menutup dialog atau menekan **Hentikan unggahan** benar-benar menghentikan pengirimannya, jadi berkas yang salah pilih tidak perlu ditunggu sampai selesai.

## Mengunggah ke Katalog Data 3D

Masuk ke portal, lalu buka menu **Katalog Data 3D** pada halaman internal. Halamannya ada di alamat `/portal/internal/katalog-data-3d` pada domain Anda.

1. Klik tombol **Tambah Data**.
2. Isi **Nama Layer**, misalnya `Vas di Geladak`.
3. Pilih **Akses**. Pilih **Public** bila modelnya boleh dilihat tanpa login, atau **Private** bila hanya untuk akun yang sudah masuk.
4. Isi **Lat** dan **Lng** dengan koordinat tempat model itu akan diletakkan di peta.
5. Pilih berkas `.ply` atau `.glb` dari komputer Anda.
6. Klik **Simpan**.

Dialognya menampilkan kemajuan unggahannya, lengkap dengan persentase dan jumlah yang sudah terkirim, jadi biarkan halamannya terbuka sampai muncul keterangan berhasil. Berkasnya disimpan di VM pada folder `data/models`, sedangkan baris katalognya tersimpan di database Supabase.

## Melihat hasilnya

Pada tabel **Katalog Data 3D**, setiap baris punya ikon mata bertanda **Preview di Cesium**. Ikon itu membuka penampil yang sesuai dengan jenis berkasnya:

- berkas `.ply` dibuka dengan penampil Gaussian Splat,
- berkas `.glb` dibuka dengan penampil Cesium.

Penampil Gaussian Splat mengunduh seluruh berkasnya lebih dahulu, dan itu memakan waktu pada berkas puluhan megabita. Selama mengunduh, layar menampilkan persentase kemajuan. Setelah selesai, modelnya muncul dan dapat diputar dengan tetikus.

## Menempatkan model di peta

Empat kolom pada formulir menentukan posisi dan orientasi model ketika dipanggil dari peta.

| Kolom | Artinya |
|---|---|
| **Lat** dan **Lng** | Titik di permukaan bumi tempat model diletakkan |
| **Arah (heading)** | Rotasi mengelilingi sumbu tegak, dalam derajat. `0` menghadap utara |
| **Kemiringan (pitch)** | Kemiringan ke atas atau ke bawah, dalam derajat |
| **Putaran (roll)** | Putaran pada sumbu depan belakang, dalam derajat |
| **Skala** | Pengali ukuran. Bawaannya `100` |

Nilai **Skala** tidak memengaruhi bentuk model, hanya besarnya. Penampil menyesuaikan jarak kamera dengan ukuran akhir model, jadi nilai berapa pun tetap menampilkan modelnya secara utuh.

## Bila tampilannya terlihat aneh

Hasil rekonstruksi Gaussian Splat hampir selalu memuat **splat nyasar**, yaitu titik yang terlempar jauh dari objeknya. Titik-titik itu ikut terhitung saat penampil menentukan seberapa jauh kamera harus mundur, sehingga objek yang sebenarnya tampil kecil di tengah layar dengan serpihan berhamburan di sekitarnya.

Penampil di portal sekarang sudah mengabaikan splat nyasar itu, yaitu dengan menghitung kotak pembatas dari persentil 5 sampai 95 posisi splat, bukan dari titik terjauh. Diukur pada satu berkas uji, jari-jari bingkai turun dari 19.558 menjadi 4.432 satuan, dan objeknya langsung terlihat.

Bila VM Anda belum memakai versi terbaru, penampilnya masih memakai cara lama. VM menjalankan image yang dibangun Cloud Build, jadi perbaikannya baru berlaku setelah image-nya dibangun ulang dari repositori yang sudah diperbarui. Selaraskan fork Anda lebih dahulu seperti pada [Menyelaraskan fork bila sumber diperbarui](/hari-4/praktik-11/persiapan-repositori#menyelaraskan-fork-bila-sumber-diperbarui), lalu dorong perubahannya dan tunggu build selesai seperti pada halaman [Otomatisasi Cloud Build](/hari-4/praktik-11/cloud-build).

Bila setelah itu modelnya tetap terlihat seperti serpihan berduri, penyebabnya berkasnya sendiri. Itu terjadi pada berkas latihan yang sudah dipangkas terlalu banyak: jumlah splatnya tinggal sebagian kecil, sehingga permukaannya tidak lagi tertutup rapat. Solusinya memakai berkas asli yang belum dipangkas, bukan memperbaiki penampilnya.

## Berkas latihan lama

Berkas `gedung-3d.ply` pada folder pelatihan berasal dari rekonstruksi yang kualitasnya rendah. Separuh splatnya berkumpul dalam kotak 6,9 kali 4,4 kali 7,6 satuan, sedangkan kotak penuhnya 388 kali 175 kali 391 satuan. Enam puluh enam persen splatnya juga lebih lonjong dari 20 kali.

Berkas itu tetap dapat dipakai untuk menunjukkan gejalanya, dan berguna justru karena itu: peserta bisa melihat sendiri bagaimana splat nyasar membuat model tampil mengecil. Untuk latihan unggah yang hasilnya bagus, pakai `vasedeck-contoh.ply`.

---

Halaman ini pendamping sesi. Langkah deployment portalnya ada pada [Praktik 11](/hari-4/praktik-11/peserta-project), dan Materi 3D pada Hari 2 ada pada [Praktik 5](/hari-2/praktik-5/konfigurasi-viewer).
