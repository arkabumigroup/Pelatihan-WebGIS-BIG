# Menampilkan Data Raster

**Menampilkan data raster**

1. Tahap pertama install library untuk menampilkan raster menggunakan leaflet dengan menginput perintah pada terminal **npm install georaster georaster-layer-for-leaflet**.
    
    ![](Menampilkan%20Data%20Raster/image1.png)
    
2. Pada tahap kedua buat file baru pada folder layer dengan nama Raster.jsx kemudian buat fungsi baru untuk menambahkan data raster kedalam peta serta tambahkan paramter urlTiff.
    
    ![](Menampilkan%20Data%20Raster/image2.png)
    
3. Selanjutnya buat fungsi **return fetch** untuk mengambil data raster yang akan digunakan promise berupa return untuk menampilkan layer dalam peta.
    
    ![](Menampilkan%20Data%20Raster/image3.png)
    
4. Tahapan ketiga buat fungsi **.then(response)** untuk melanjutkan proses setelah file selesai diambil response yang berisi hasil dari proses pengambilan file TIFF.
    
    ![](Menampilkan%20Data%20Raster/image4.png)
    
5. Pada tahap keempat didalam fungsi sebelumnya, buat fungsi yang digunakan untuk melakukan pemeriksaan file apakah dapat ditemukan atau tidak dengan membuat fungsi kondisional **if.**
    
    ![](Menampilkan%20Data%20Raster/image5.png)
    
6. Pada tahap kelima buat fungsi untuk mengembalikan dan memproses data tiff jika berhasil diproses dengan menggunakan **return**.
    
    ![](Menampilkan%20Data%20Raster/image6.png)
    
7. Tahap keenam buat kembali fungsi **.then** yang akan digunakan untuk mengkonversi data tiff menjadi data raster yang dapat dibaca dan diproses oleh library leaflet.
    
    ![](Menampilkan%20Data%20Raster/image7.png)
    
8. Kemudian buat kembali **.then** untuk mengambil data raster yang sudah dibaca sehingga dapat ditampilkan dalam layer. Kemudian tambahkan opacity digunakan untuk mengatur transparansi raster, serta resolution digunakan untuk mengatur tingkat detail saat raster ditampilkan.
    
    ![](Menampilkan%20Data%20Raster/image8.png)
    
9. Kemudian tahapan berikutnya buat fungsi catch( ) yang digunakan untuk menangani jika terjadi kesalahan atau jika file gagal dimuat.
    
    ![](Menampilkan%20Data%20Raster/image9.png)
    
10. Berikut ini hasil keseluruhan script fungsi untuk menambahkan data raster pada file RasterTif.jsx
    
    ![](Menampilkan%20Data%20Raster/image10.png)
    
11. Berikutnya, masukan data raster yang dimiliki kedalam folder data yang terdapat dalam folder public.
    
    ![](Menampilkan%20Data%20Raster/image11.png)
    
12. Kemudian tahap terakhir panggil fungsi untuk menampilkan data raster dalam halaman Map.jsx dengan menggunakan addRasterTif, lalu tambahkan parameter berupa path dari folder tempat penyimpanan data raster, kemudian tambahkan fungsi untuk autozoom kearea layer tersebut dengan fungsi **getbound**
    
    ![](Menampilkan%20Data%20Raster/image12.png)
    
13. Selanjutnya tambahkan fungsi **map.on** untuk mengetahui layer yang sedang diaktifkan, kemudian tambahkan parameter overlayed sebagai parameter overlay yang ada pada layer control.
    
    ![](Menampilkan%20Data%20Raster/image13.png)
    
14. Kemudian didalam **map.on** buat fungsi berupa kondisi **if** untuk mengetahui apakah terdapat layer yang memiliki **custom bound**.
    
    ![](Menampilkan%20Data%20Raster/image14.png)
    
15. Selanjutnya tambahkan fungsi pada kondisi tersebut jika layer miliki custom bound maka tampilan peta akan menyesuaikan berdasarkan customBounds.
    
    ![](Menampilkan%20Data%20Raster/image15.png)
    
16. Kemudian buat kondisi kedua menggunakan **else** jika tidak memiliki customBounds, script mengecek apakah layer memiliki fungsi getBounds() untuk mendapatkan batas geografis layer.
    
    ![](Menampilkan%20Data%20Raster/image16.png)
    
17. Hasil tampilan data raster yang dimuat pada halaman webgis dapat dilihat pada gambar berikut ini.
    
    ![](Menampilkan%20Data%20Raster/image17.png)