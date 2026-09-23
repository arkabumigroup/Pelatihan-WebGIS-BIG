# Menampilkan Data Raster

## **Menampilkan data raster**

1. Tahap pertama install library untuk menampilkan raster menggunakan leaflet dengan menginput perintah pada terminal **npm install georaster georaster-layer-for-leaflet**.

    ```bash
    npm install georaster georaster-layer-for-leaflet
    ```

![Terminal VS Code menampilkan hasil npm install georaster dan georaster-layer-for-leaflet dengan 15 vulnerabilities](data-raster/image1.png)

2. Pada tahap kedua buat file baru pada folder layer dengan nama Raster.jsx kemudian buat fungsi baru untuk menambahkan data raster kedalam peta serta tambahkan paramter urlTiff.

    ```jsx
    export default function addRasterTif(urlTiff) {
    
      return fetch(urlTiff)
    
        .then(function (response) {
          if (!response.ok) {
            throw new Error("File TIFF tidak ditemukan: " + urlTiff);
          }
          return response.arrayBuffer();
        })
    
        .then(function (arrayBuffer) {
          return parseGeoraster(arrayBuffer);
        })
    
        .then(function (georaster) {
          const rasterLayer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            resolution: 256
          });
    
          return rasterLayer;
        })
    
        .catch(function (error) {
          console.log("Gagal memuat file TIFF:", error);
          return null;
        });
    }
    ```

![Fungsi addRasterTif dengan parameter urlTiff yang badannya masih kosong](data-raster/image2.png)

3. Selanjutnya buat fungsi **return fetch** untuk mengambil data raster yang akan digunakan promise berupa return untuk menampilkan layer dalam peta.
    
![Baris return fetch(urlTiff) yang baru ditambahkan di dalam fungsi addRasterTif](data-raster/image3.png)
    
4. Tahapan ketiga buat fungsi **.then(response)** untuk melanjutkan proses setelah file selesai diambil response yang berisi hasil dari proses pengambilan file TIFF.
    
![Fungsi .then dengan parameter response yang masih kosong setelah return fetch](data-raster/image4.png)
    
5. Pada tahap keempat didalam fungsi sebelumnya, buat fungsi yang digunakan untuk melakukan pemeriksaan file apakah dapat ditemukan atau tidak dengan membuat fungsi kondisional **if.**
    
![Pemeriksaan if (!response.ok) dengan throw new Error File TIFF tidak ditemukan di dalam .then](data-raster/image5.png)
    
6. Pada tahap kelima buat fungsi untuk mengembalikan dan memproses data tiff jika berhasil diproses dengan menggunakan **return**.
    
![Baris return response.arrayBuffer() yang ditambahkan tepat setelah blok if](data-raster/image6.png)
    
7. Tahap keenam buat kembali fungsi **.then** yang akan digunakan untuk mengkonversi data tiff menjadi data raster yang dapat dibaca dan diproses oleh library leaflet.
    
![.then kedua yang mengembalikan parseGeoraster(arrayBuffer) disorot kuning di bawah blok pertama](data-raster/image7.png)
    
8. Kemudian buat kembali **.then** untuk mengambil data raster yang sudah dibaca sehingga dapat ditampilkan dalam layer. Kemudian tambahkan opacity digunakan untuk mengatur transparansi raster, serta resolution digunakan untuk mengatur tingkat detail saat raster ditampilkan.
    
![.then ketiga berisi GeoRasterLayer dengan opacity 0.7 dan resolution 256 yang disorot kuning](data-raster/image8.png)
    
9. Kemudian tahapan berikutnya buat fungsi catch( ) yang digunakan untuk menangani jika terjadi kesalahan atau jika file gagal dimuat.
    
![.catch yang mencatat Gagal memuat file TIFF dan mengembalikan null disorot kuning di akhir rantai promise](data-raster/image9.png)
    
10. Berikut ini hasil keseluruhan script fungsi untuk menambahkan data raster pada file RasterTif.jsx
    
![Isi RasterTif.jsx secara keseluruhan dari dua baris import sampai .then yang mengembalikan rasterLayer](data-raster/image10.png)
    
11. Berikutnya, masukan data raster yang dimiliki kedalam folder data yang terdapat dalam folder public.
    
![Folder public/data pada Explorer VS Code berisi latihan.kml dan pola_ruang.tif](data-raster/image11.png)
    
12. Kemudian tahap terakhir panggil fungsi untuk menampilkan data raster dalam halaman Map.jsx dengan menggunakan addRasterTif, lalu tambahkan parameter berupa path dari folder tempat penyimpanan data raster, kemudian tambahkan fungsi untuk autozoom kearea layer tersebut dengan fungsi **getbound**
    
![Pemanggilan addRasterTif untuk /data/pola_ruang.tif yang disorot kuning di dalam useEffect Map.jsx](data-raster/image12.png)
    
13. Selanjutnya tambahkan fungsi **map.on** untuk mengetahui layer yang sedang diaktifkan, kemudian tambahkan parameter overlayed sebagai parameter overlay yang ada pada layer control.
    
![Fungsi map.on overlayadd yang badannya masih kosong disorot kuning di bawah addRasterTif](data-raster/image13.png)
    
14. Kemudian didalam **map.on** buat fungsi berupa kondisi **if** untuk mengetahui apakah terdapat layer yang memiliki **custom bound**.
    
![Kondisi if (e.layer.customBounds) yang baru ditambahkan di dalam map.on overlayadd](data-raster/image14.png)
    
15. Selanjutnya tambahkan fungsi pada kondisi tersebut jika layer miliki custom bound maka tampilan peta akan menyesuaikan berdasarkan customBounds.
    
![Baris map.fitBounds(e.layer.customBounds) di dalam kondisi if pada map.on overlayadd](data-raster/image15.png)
    
16. Kemudian buat kondisi kedua menggunakan **else** jika tidak memiliki customBounds, script mengecek apakah layer memiliki fungsi getBounds() untuk mendapatkan batas geografis layer.
    
![Kondisi else if typeof getBounds function beserta map.fitBounds di dalam map.on overlayadd](data-raster/image16.png)
    
17. Hasil tampilan data raster yang dimuat pada halaman webgis dapat dilihat pada gambar berikut ini.
    
![Peta raster pola ruang berwarna hijau, kuning, dan ungu pada localhost:3000/peta-latihan-4 dengan kontrol layer dan legenda](data-raster/image17.png)