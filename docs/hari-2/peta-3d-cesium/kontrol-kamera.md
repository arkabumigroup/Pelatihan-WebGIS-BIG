# Kontrol Kamera dan Navigasi: Penggunaaan flyto, setView, heading, pitch dan rol

## **Pembuatan Fungsi Kontrol dan Navigasi Kamera**

1. Tahap pertama buat file baru pada folder **components** dengan nama **addCameraNav.jsx**.
    
    ![](kontrol-kamera/image1.png)
    
2. Selanjutnya pada tahap kedua buat struktur dasar modul **addCameraNav()** yang berfungsi sebagai wadah untuk seluruh fitur navigasi kamera, dengan parameter **viewer** sebagai instance Cesium Viewer dan **opsi** sebagai konfigurasi tambahan, serta mengambil library Cesium dari **window.Cesium** agar dapat digunakan.
    
    ![](kontrol-kamera/image2.png)
    
3. Pada tahap ketiga buat variabel dengan parameter **lokasiAwal** untuk menentukan posisi awal kamera dan **tampilkanPanel** untuk menentukan apakah tombol navigasi akan ditampilkan.
    
    ![](kontrol-kamera/image3.png)
    
4. Tahap keempat buat fungsi **lihatLangsung()** yang digunakan untuk memindahkan tampilan kamera secara langsung ke lokasi tertentu berdasarkan koordinat, ketinggian, dan arah pandangan kamera.
    
    ![image.png](kontrol-kamera/image.png)
    
5. Selanjutnya didalam fungsi **lihatLangsung,** buat fungsi untuk mengatur dan memindahkan posisi tampilan kamera secara langsung ke lokasi menggunakan **viewer.camera.setView**.
    
    ![](kontrol-kamera/image5.png)
    
6. Tahap berikutnya dalam fungsi **viewer.camera.setView** buat fungsi berupa **destination** untuk menentukan lokasi tujuan kamera berdasarkan nilai longitude, latitude, dan ketinggian yang kemudian diubah ke format koordinat yang digunakan oleh Cesium.
    
    ![](kontrol-kamera/image6.png)
    
7. Selanjutnya tambahkan fungsi **orientation** untuk mengatur arah dan sudut pandangan kamera, yang terdiri dari **heading** untuk menentukan arah, **pitch** untuk menentukan kemiringan pandangan, dan **roll** untuk menentukan kemiringan posisi kamera.
    
    ![image.png](kontrol-kamera/image%201.png)
    
8. Pada tahap kelima buat fungsi **terbangKe()** sebagai wadah untuk mengatur perpindahan kamera menuju lokasi tertentu dengan animasi.
    
    ![](kontrol-kamera/image8.png)
    
9. Selanjutnya pada fungsi tersebut tambahkan **viewer.camera.flyTo()** untuk membuat kamera bergerak atau terbang secara animasi menuju lokasi tujuan.
    
    ![image.png](kontrol-kamera/image%202.png)
    
10. Kemudian tambahkan fungsi berupa **destination** untuk menentukan lokasi tujuan kamera serta tambahkan **orientation** untuk mengatur arah dan sudut pandangan kamera, yang terdiri dari **heading, pitch** dan **roll.**
    
    ![](kontrol-kamera/image10.png)
    
11. Pada tahap keenam buat fungsi **resetKeAwal()** untuk mengembalikan posisi kamera ke lokasi awal yang telah ditentukan.
    
    ![](kontrol-kamera/image11.png)
    
12. Selanjutnya didalam fungsi tersebut tambahkan kondisi **if** yang digunakan untuk memastikan data lokasiAwal tersedia sebelum kamera melakukan perpindahan.
    
    ![](kontrol-kamera/image12.png)
    
13. Tahap berikutnya tambahkan fungsi **terbangKe()** untuk memindahkan kamera kembali menuju lokasi awal dengan animasi.
    
    ![](kontrol-kamera/image13.png)
    
14. Didalam fungsi **terbangKe()** tambahkan parameter untuk mengambil nilai **latitude, longitude,** dan **ketinggian** dari data **lokasiAwal** sebagai tujuan kamera, serta tambahkan parameter untuk mengambil pengaturan arah dan sudut pandangan kamera dari **lokasiAwal**, seperti **heading, pitch,** dan **roll.**
    
    ![](kontrol-kamera/image14.png)
    
15. Tahap ketujuh buat fungsi **putarKiri()** yang berfungsi untuk memutar arah pandangan kamera ke sebelah kiri.
    
    ![](kontrol-kamera/image15.png)
    
16. Selanjutnya buat variabel untuk mengambil nilai arah atau posisi putaran kamera yang sedang digunakan.
    
    ![](kontrol-kamera/image16.png)
    
17. Kemudian tambahkan fungsi **viewer.camera.setView()** untuk memperbarui arah pandangan kamera.
    
    ![](kontrol-kamera/image17.png)
    
18. Tahapan berikutnya didalam **viewer.camera** tambahkan parameter **orientasi** kamera yang akan digunakan setelah kamera diputar.
    
    ![](kontrol-kamera/image18.png)
    
19. Selanjutnya dalam orientasi tambahkan parameter arah kamera yang dikurangi sebesar 15 derajat untuk memutar pandangan ke kiri, sementara nilai pitch dan roll tetap dipertahankan agar kemiringan dan posisi kamera tidak berubah.
    
    ![](kontrol-kamera/image19.png)
    
20. Tahap kedelapan buat fungsi **putarKanan()** dengan parameter yang sama dengann putar kiri, tetapi pada parameter arah kamera dalam fungsi putarKanan ditambahkan dengan 15 untuk memutar pandangan kekanan.
    
    ![](kontrol-kamera/image20.png)
    
21. Pada tahap kesembilan buat kondisi **if** untuk memeriksa apakah panel navigasi perlu ditampilkan atau tidak berdasarkan nilai **tampilkanPanel**.
    
    ![image.png](kontrol-kamera/image%203.png)
    
22. Kemudian tambahkan variabel untuk membuat container dengan elemen div yang akan digunakan sebagai wadah untuk seluruh tombol navigasi kamera.
    
    ![](kontrol-kamera/image22.png)
    
23. Selanjutnya buat **panel.style.cssText** yang akan digunakan untuk pengaturan tampilan pada panel seperti posisi, warna, ukuran, dan tata letak agar panel terlihat di atas peta.
    
    ![](kontrol-kamera/image23.png)
    
24. Kemudian tambahkan variabel **const tombolStyle** sebagai pengaturan tampilan yang akan digunakan bersama oleh seluruh tombol navigasi.
    
    ![](kontrol-kamera/image24.png)
    
25. Tahap berikutnya buat variabel yang akan digunakan sebagai daftar tombol yang akan digunakan untuk mengontrol arah kamera.
    
    ![image.png](kontrol-kamera/image%204.png)
    
26. Selanjutnya buat fungsi berupa **daftarTombol** untuk membuat tombol secara otomatis.
    
    ![](kontrol-kamera/image26.png)
    
27. Pada fungsi **daftarTombol** buat elemen HTML button untuk setiap tombol navigasi.
    
    ![](kontrol-kamera/image27.png)
    
28. Selanjutnya buat teks dan style diterapkan pada tombol yang telah dibuat, kemudian tambahkan aksi saat diklik sebelum dimasukkan ke dalam panel navigasi.
    
    ![](kontrol-kamera/image28.png)
    
29. Tahap terakhir pada fungsi **if (tampilkanPanel)** tambahkan ke dalam container Cesium agar dapat ditampilkan di atas peta 3D.
    
    ![](kontrol-kamera/image29.png)
    
30. Pada tahap terakhir, seluruh fungsi navigasi kamera dikembalikan agar dapat digunakan kembali dari luar modul untuk mengatur pergerakan dan arah pandangan kamera.
    
    ![image.png](kontrol-kamera/image%205.png)
    

## **Integrasi Fungsi Kontrol dan Navigasi Kamera dengan Cesium Viewer**

1. Tahap pertama, pada file **CesiumViewer.jsx** pada **function addContent3D** tambahkan variabel untuk kontrolKamera dan panggil **addCameraNav**.
    
    ![image.png](kontrol-kamera/image%206.png)
    
2. Tahap kedua tambahkan **kontrolKamera** untuk memanggil fungsi **terbangKe()** sehingga kamera dapat bergerak secara animasi menuju lokasi awal dengan ketinggian, arah, dan sudut pandangan yang telah ditentukan.
    
    ![](kontrol-kamera/image32.png)
    
3. Hasil tampilan untuk kontrol kamera ketika posisi dirotasi ke arah kiri ataupun kanan.
    
    ![image.png](kontrol-kamera/image%207.png)
    
4. Hasil tampilan ketika posisi direset dan mengaktifkan fitur flyto.
    
    ![image.png](kontrol-kamera/image%208.png)