# Styling Layer Dengan Javascript - 1

**Styling Layer Dengan Javascript**

## **Styling Layer Geojson**

1. Pada tahap pertama, lakukan styling pada file **Geojson.jsx** untuk mengatur ukuran icon pada variabel **const markerIcon.** Pertama lakukan styling untuk mengatur ukuran icon dengan menggunakan variabel **iconSize** kemudian tentukan ukuran lebar dan tingginya dalam [ ].
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image1.png)
    
2. Selanjutnya tambahkan fungsi untuk mengatur mengatur ukuran titik sebenarnya pada peta sehingga titik sebenarnya berada pada posisi center marker. Gunakan fungsi i**conAnchor** kemudian tambahkan ukurannya.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image2.png)
    
3. Kemudian tambahkan fungsi berupa **popupAnchor** untuk menampilkan posisi popup terhadap marker.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image3.png)
    
4. Kemudian buat fungsi dibawah variabel markerIcon yang akan digunakan untuk mengatur styling jika data geojson dalam bentuk polygon dengan cara membuat **function getPolygonstyle** serta tambahkan parameter **feature** untuk mengambil tampilan layer.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image4.png)
    
5. Selanjutnya dalam fungsi tersebut, tambahkan variabel untuk mengambil informasi berupa kategori yang akan dijadikan parameter untuk melakukan styling.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image.png)
    
6. Tahap berikutnya buat kondisi kategori menggunakan fungsi **if** kemudian tentukan parameter yang digunakan pada kategorinya, seperti pada script ini mengambil layer dengan kategori **landmark**.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%201.png)
    
7. Selanjutnya pada fungsi kondisional **if** tersebut buat fungsi **return** yang akan mengembalikan layer sesuai dengan styling yang akan dibuat nantinya.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image7.png)
    
8. Selanjutnya didalam **return** buat fungsi untuk warna dengan **color**, kemudian tambahkan fungsi untuk mengatur ketebalan garis dengan **weight**, kemudian tambahkan fungsi untuk mengatur warna bagian dalam dengan **fillColor** serta transparansi warna dengan **fillOpacity**.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%202.png)
    
9. Selanjutnya buat kondisi untuk layer jika memiliki kategori berupa pemerintahan dengan fungsi kondisional **if**.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%203.png)
    
10. Kemudian buat fungsi **return** jika layer tidak terdapat dalam dua kategori tersebut, styling layernya akan dibuat menjadi warna abu-abu.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image10.png)
    
11. Selanjutnya pada fungsi c**onst geojsonLayer** yang sudah ada sebelumnya, tambahkan fungsi style dan buat return berupa **getPolygonsStyle** untuk mengambil styling yang telah dibuat.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image11.png)
    
12. Hasil akhir dari styling geojson layer yaitu sebagai berikut ini.
    
    ![](Styling%20Layer%20Dengan%20Javascript%20-%201/image12.png)
    

## **Styling Layer KML**

1. Tahap pertama buka file **Kml.jsx** kemudian pada fungsi script yang digunakan untuk menerima dan mengolah Kml yaitu pada fungsi berupa **.then(function(kmlText)** buat fungsi untuk mengakses objek dalam kml melalui **kmlLayer.eachLayer(function(layer)**.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%204.png)
    
2. Selanjutnya buat kondisional **if** untuk menganalisis apakah layer bisa diberi style atau tidak.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%205.png)
    
3. Tahap berikutnya jika file dapat diberikan style, maka buat variabel fungsi untuk warna dengan **color**, kemudian tambahkan fungsi untuk mengatur ketebalan garis dengan **weight**, kemudian tambahkan fungsi untuk mengatur warna bagian dalam dengan **fillColor** serta transparansi warna dengan **fillOpacity**.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%206.png)
    
4. Hasil tampilan styling layer kml dengan menggunakan warna biru sebagai warna stylenya dapat dilihat pada gambar berikut ini.
    
    ![image.png](Styling%20Layer%20Dengan%20Javascript%20-%201/image%207.png)