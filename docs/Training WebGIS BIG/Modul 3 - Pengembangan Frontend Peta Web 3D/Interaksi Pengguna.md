# Interaksi Pengguna

**Screen space event handler (klik, hover), pemilahan objek 3D (3D Object Picking) dan kustomisasi InfoBox untuk data semantik)**

## **Membuat Fungsi Interaksi Pengguna**

1. Tahap satu buat file baru pada folder **components** dengan nama file yaitu **addInteraksiPengguna.jsx**.
    
    ![](Interaksi%20Pengguna/image1.png)
    
2. Tahap kedua buat fungsi **addInteraksiPengguna** yang digunakan untuk menambahkan kemampuan interaksi pengguna pada peta 3D. Kemudian tambahkan parameter **viewer**.
    
    ![](Interaksi%20Pengguna/image2.png)
    
3. Tahap ketiga buat variabel **const cesium = windows.cesium** untuk mengambil library Cesium yang sebelumnya telah tersedia di halaman Cesium Viewer.
    
    ![](Interaksi%20Pengguna/image3.png)
    
4. Tahap keempat buat variabel **infobox** yang akan digunakan untuk menampilkan informasi ketika pengguna mengklik layer pada peta.
    
    ![](Interaksi%20Pengguna/image4.png)
    
5. Selanjutnya buat elemen **infoBox.style.cssText** yang berfungsi untuk mengatur tampilan dan posisi kotak informasi **(infoBox)** pada halaman peta, meliputi posisi di bagian bawah kiri, warna latar putih, ukuran teks, jarak isi, bentuk sudut, bayangan, serta menyembunyikan kotak informasi pada saat awal sebelum pengguna memilih objek.
    
    ![](Interaksi%20Pengguna/image5.png)
    
6. Kemudian buat **viewer.container.appendChild(infoBox);** yang digunakan untuk menambahkan kotak informasi kedalam tampilan peta.
    
    ![](Interaksi%20Pengguna/image6.png)
    
7. Tahap kelima buat variabel **handler** atau pendeteksi interaksi pengguna pada area tampilan peta (canvas), sehingga sistem dapat merespons aktivitas seperti klik atau pergerakan mouse pada peta.
    
    ![](Interaksi%20Pengguna/image7.png)
    
8. Tahap keenam buat fungsi untuk menambahkan aksi yang akan dijalankan ketika pengguna melakukan klik kiri **(LEFT_CLICK)** pada area peta 3D, sehingga sistem dapat merespons dan memproses objek yang dipilih.
    
    ![](Interaksi%20Pengguna/image8.png)
    
9. Selanjutnya didalam fungsi tersebut buat variabel **const objek** untuk mendeteksi dan mengambil objek pada peta 3D berdasarkan posisi yang diklik.
    
    ![](Interaksi%20Pengguna/image9.png)
    
10. Kemudian buat kondisi **if** untuk memeriksa apakah terdapat objek yang berhasil dipilih oleh pengguna, dan jika tidak ada objek pada lokasi yang diklik maka kotak informasi tidak ditampilkan.
    
    ![](Interaksi%20Pengguna/image10.png)
    
11. Tahap berikutnya tambahkan fungsi untuk menyiapkan variabel **namaProperti** sebagai tempat menyimpan daftar atribut objek serta variabel **judul** untuk menentukan judul informasi.
    
    ![](Interaksi%20Pengguna/image11.png)
    
12. Selanjutnya buat kondisi **if** untuk memeriksa apakah objek yang dipilih pengguna merupakan objek bertipe 3D Tiles, sehingga dapat menentukan cara yang sesuai untuk mengambil informasi.
    
    ![](Interaksi%20Pengguna/image12.png)
    
13. Pada fungsi **if** diatas, tambahkan fungsi untuk mengambil seluruh atribut dan nama dari objek 3D Tiles yang dipilih, kemudian menyusun serta menampilkan informasi tersebut ke dalam kotak informasi (infoBox).
    
    ![image.png](Interaksi%20Pengguna/image.png)
    
14. Tahap berikutnya tambahkan fungsi **else if** untuk memeriksa apakah objek yang dipilih memiliki data atribut, kemudian mengambil nama serta seluruh informasi yang tersedia pada objek tersebut untuk ditampilkan ke dalam kotak informasi (infoBox).
    
    ![](Interaksi%20Pengguna/image14.png)
    
15. Tahap terakhir buat fungsi **else** untuk menampilkan pesan bahwa objek tidak memiliki data apabila informasi objek tidak ditemukan, kemudian menampilkan kotak informasi (infoBox).
    
    ![](Interaksi%20Pengguna/image15.png)
    
16. Berikut ini merupakan keseluruhan script untuk interaksi pengguna.
    
    ![](Interaksi%20Pengguna/image16.png)
    

## **Integrasi Fungsi Interaksi Pengguna dengan Cesium Viewer**

1. Tahap pertama buat fungsi memanggil dan mengaktifkan fungsi interaksi pengguna pada peta 3D, kemudian hubungkan **kontrolInteraksi** dengan panel kontrol layer 3D, sehingga fitur interaksi dapat digunakan bersamaan dengan layer yang ditampilkan.
    
    ![](Interaksi%20Pengguna/image17.png)
    
2. Tahap kedua pastikan fungsi addInteraksiPengguna telah terpanggil pada halaman **CesiumViewer.jsx**.
    
    ![](Interaksi%20Pengguna/image18.png)
    
3. Berikut ini merupakan hasil tampilan interaksi pengguna ketika mengklik data 2d jaringan jalan.
    
    ![image.png](Interaksi%20Pengguna/image%201.png)
    
4. Hasil interaksi pengguna ketika mengklik data polygon batas administrasi.
    
    ![image.png](Interaksi%20Pengguna/image%202.png)
    
5. Hasil interaksi pengguna ketika mengklik pada bagian objek 3d bangunan.
    
    ![image.png](Interaksi%20Pengguna/image%203.png)