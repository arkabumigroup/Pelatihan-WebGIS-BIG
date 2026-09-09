# Visualisasi Data 2D dan 3D

## **Menambahkan Data 2D**

1. Tahap pertama buat file dengan nama **addDataVektor2D.jsx** pada folder **components**.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image1.png)
    
2. Kemudian pada tahap kedua buat fungsi berupa **addDataVektor2D** digunakan sebagai tempat utama untuk menjalankan seluruh proses penambahan data vektor 2D. Kemudian tambahkan parameter **viewer**, **opsi** yang digunakan pengaturan data yang ingin ditampilkan, serta parameter **selesai** yang dijalankan setelah data berhasil dimuat.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image2.png)
    
3. Tahap ketiga didalam function tersebut tambahkan variabel c**onst Cesium = window.Cesium;** yang digunakan untuk mengambil objek Cesium yang sudah tersedia di halaman.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image3.png)
    
4. Tahap keempat buat variabel yang berfungsi digunakan untuk mengambil berbagai konfigurasi dari parameter opsi, seperti URL sumber data, nama layer, warna dan outline garis, ketebalan garis, pengaturan agar data mengikuti terrain, serta opsi untuk mengarahkan kamera secara otomatis ke lokasi data.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image.png)
    
5. Pada tahap kelima buat kondisi **if** untuk memeriksa apakah **url** tersedia, dan jika tidak tersedia maka fungsi selesai akan dijalankan dengan nilai **null** sebelum proses dihentikan agar proses dihentikan jika tanpa data.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%201.png)
    
6. Tahap keenam buat fungsi untuk memuat data GeoJSON dari url menggunakan **Cesium.GeoJsonDataSource**, dengan opsi parameter **clampToGround** untuk menentukan apakah data mengikuti atau menempel pada permukaan terrain.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image6.png)
    
7. Selanjutnya tahap ketujuh buat fungsi **.then()** yang akan dijalankan setelah proses memuat GeoJSON berhasil. Data yang berhasil dimuat kemudian disimpan dalam variabel **dataSource**.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%202.png)
    
8. Pada fungsi **.then** tambahkan fungsi untuk memberikan nama pada data yang telah dimuat melalui **dataSource.name = nama**, kemudian menambahkan data tersebut dengan **viewer.dataSources.add(dataSource)** agar dapat ditampilkan pada peta.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image8.png)
    
9. Kemudian tambahkan fungsi untuk melakukan perulangan pada seluruh objek yang terdapat di dalam **dataSource**, sehingga setiap data dapat diperiksa dan diatur satu per satu.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image9.png)
    
10. Selanjutnya pada fungsi **dataSource** tersebut tambahkan kondisi **if** untuk memeriksa apakah entity merupakan data berbentuk garis (polyline), kemudian mengatur warna dan outline garis, menentukan ketebalan garis, serta membuat garis mengikuti permukaan terrain.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image10.png)
    
11. Selanjutnya buat kondisi **if** untuk pengecekan terhadap data polygon dengan membuat variabel untuk menngatur tipe klasifikasi atau **classificationType** menjadi **Cesium.ClassificationType.TERRAIN** sehingga jika data polygon dapat ditampilkan dan mengikuti klasifikasi permukaan terrain pada peta 3D.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image11.png)
    
12. Tahap terakhir buat fungsi dengan kondisi **if** yang digunakan untuk mengarahkan kamera secara otomatis ke lokasi data apabila otomatisZoom aktif, kemudian menjalankan fungsi selesai dengan mengirimkan dataSource sebagai tanda bahwa proses pemuatan dan penambahan data telah selesai.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image12.png)
    

## **Integrasi Tampilan Data 2D dengan Cesium Viewer**

1. Tahap pertama, masukan data geojson yang akan ditampilkan kedalam folder **public**, kemudian pilih folder **data**.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image13.png)
    
2. Tahap kedua buka file CesiumViewer.jsx kemudian pada **function addContent3D(viewer) {** tambahkan variabel berupa **const Cesium = window.Cesium**.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image14.png)
    
3. Tahap ketiga pada **function (gedung3D) {** yang terdapat dalam **function addContent3D** tambahkan fungsi **addDataVektor2D** untuk memuat data GeoJSON jaringan jalan ke dalam peta Cesium, dengan tampilan garis berwarna kuning, ketebalan 4, dan tanpa mengarahkan kamera secara otomatis ke lokasi data.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%203.png)
    
4. Selanjutnya tambahkan data berupa batas administrasi dengan cara yang sama.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%204.png)
    
5. Tahap keempat buat panggilan untuk menerima data jaringan jalan yang telah berhasil dimuat sebelumnya, kemudian menambahkan data tersebut ke dalam **addPanelLayer3D** dengan nama **Jaringan Jalan** dan **Batas Administrasi** agar dapat dikelola dan ditampilkan bersama layer 3D lainnya pada panel layer.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%205.png)
    
6. Tahap terakhir pastikan addDataVektor2D sudah terimport dalam **CesiumViewer.jsx**.
    
    ![](Visualisasi%20Data%202D%20dan%203D/image18.png)
    
7. Hasil tampilan visulisasi data 2D berupa data jaringan jalan dan batas adminsitrasi berwarna kuning dengan data 3D bangunan.
    
    ![image.png](Visualisasi%20Data%202D%20dan%203D/image%206.png)