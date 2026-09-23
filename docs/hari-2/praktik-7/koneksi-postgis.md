# Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer

## **Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer**

1. Jalankan Geoserver, setelah dijalankan buka browser dan jalankan [http://localhost:8080/geoserver/web/?0](http://localhost:8080/geoserver/web/?0)

    ```text
    http://localhost:8080/geoserver/web
    ```
    
![Menu Start Windows dengan hasil pencarian geoserver memperlihatkan Start GeoServer sebagai Best match serta berkas GeoServer-2.28.1-winsetup.exe dan GeoServer-3.0.1-winsetup.exe](koneksi-postgis/image.png)
    
![Beranda GeoServer di localhost:8080 dengan kolom login admin serta daftar versi layanan WMS, WMTS, WFS, dan WCS](koneksi-postgis/image2.png)
    
2. Login sebagai admin dan masukan password yang dibuat saat instalasi, setelah itu klik Workspaces yang ada di menu sebelah kiri lalu buat workspace baru
    
![Sidebar GeoServer dengan tautan Workspaces di bagian Data dilingkari hijau, di samping halaman Stores dengan tautan Add new store](koneksi-postgis/image%201.png)
    
![Halaman Workspaces GeoServer dengan tautan Add new workspace ditandai hijau dan daftar workspace bawaan seperti cite, it.geosolutions, dan ne](koneksi-postgis/image9.png)
    
3. Berikan nama workspace kemudian untuk Namespace URI ketik domain Geoserver saat ini diikuti dengan nama workspace.

    ```text
    Nama workspace : geoportal
    Namespace URI  : http://localhost:8080/geoserver/geoportal
    ```
    
![Form New Workspace terisi Name geoportal dan Namespace URI http://localhost:8080/geoportal](koneksi-postgis/image5.png)
    
![Halaman Workspaces GeoServer dengan baris geoportal di kotak hijau di antara workspace bawaan seperti cite, it.geosolutions, dan ne](koneksi-postgis/image%202.png)
    
4. Klik Stores lalu **Add new Store**, kemudian pilih **PostGIS** sebagai type of data source.

    Isi kolom **Data Source Name** dengan nama berikut, lalu catat karena nama ini dipakai lagi di halaman Deployment Project:

    ```text
    Workspace        : geoportal
    Data Source Name : postgis_geoportal
    ```

    Nama itu bebas, tetapi gunakan yang sama sepanjang pelatihan supaya tidak perlu diingat-ingat lagi. Nama yang berbeda antar peserta tidak menimbulkan masalah, karena setiap peserta memakai VM sendiri.
    
![Sidebar GeoServer dengan tautan Stores dilingkari hijau dan ringkasan beranda berisi 24 Layers, 4 Layer groups, 10 Stores, serta 8 Workspaces](koneksi-postgis/image%203.png)
    
![Halaman Stores GeoServer dengan tautan Add new store ditandai hijau di atas daftar store yang ada](koneksi-postgis/image17.png)
    
![Halaman New data source dengan pilihan PostGIS - PostGIS Database disorot hijau di daftar Vector Data Sources](koneksi-postgis/image3.png)
    
5. Pilih workspace yang sudah dibuat kemudian masukan koneksi sesuai dengan koneksi PostgreSQL anda

    ```text
    host     : localhost
    port     : 5432
    database : geoportal
    schema   : gis
    user     : postgres
    password : kata sandi PostgreSQL Anda
    ```
    
![Halaman New Vector Data Source untuk PostGIS Database dengan pilihan Workspace geoportal dan kolom Data Source Name masih kosong](koneksi-postgis/image%204.png)
    
![Kolom Connection Parameters data store terisi host localhost, port 5432, database geoportal, schema gis, dan user postgres](koneksi-postgis/image10.png)
    
![Bagian bawah form data store dengan SSL mode DISABLE dan tombol Save ditandai hijau](koneksi-postgis/image20.png)
    
6. Setelah save data store, geoserver akan mendeteksi layer apa saja yang ada di dalam PostgreSQL, klik Publish pada data yang ingin di Publish
    
![Halaman New Layer dengan tiga layer di store geoportal, tombol Publish pada baris bangunan_gedung disorot hijau](koneksi-postgis/image%205.png)
    
7. Pada bagian edit layer gunakan saja semua opsi default tetapi untuk Bounding Boxes klik compute from data lalu Save
    
![Halaman Edit Layer dengan Basic Resource Info layer bangunan_gedung dari store geoportal dan opsi Enabled serta Advertised tercentang](koneksi-postgis/image%206.png)
    
![Bagian Bounding Boxes halaman edit layer dengan tombol Compute from data dan Compute from native bounds ditandai hijau, di bawahnya daftar atribut geoman, nama, pemilik, luas_sertipikat, dan alamat](koneksi-postgis/image1.png)
    
8. Halaman akan berpindah ke halaman Layers dan data kita sudah berada di layer list tersebut
    
![Tabel Layers GeoServer dengan baris bangunan_gedung di workspace geoportal dilingkari hijau di antara daftar layer bawaan](koneksi-postgis/image%207.png)
    
9. Klik layer yang sudah kita buat lalu akan berpindah ke halaman edit layer, klik menu tab Security. Atur hak akses layer ini sesuai kebutuhan, berikut adalah contoh jika saya ingin data bisa dilihat publik tetapi edit hanya bisa dilakukan oleh admin, setelah itu Save
    
![Tab Security halaman Edit Layer ne:bangunan_gedung dengan hak Read dicentang untuk semua role dan Write hanya untuk ADMIN](koneksi-postgis/image7.png)
    
10. Buka menu Layers Preview, kemudian pilih layer yang sudah dipublish lalu buka format GeoJSON, maka akan terbuka tab baru di browser menunjukan data GeoJSON

    ```text
    http://localhost:8080/geoserver/geoportal/ows?service=WMS&version=1.1.0&request=GetMap&layers=geoportal:nama_layer&bbox=-180,-90,180,90&width=768&height=330&srs=EPSG:4326&format=application/openlayers
    ```
    
![Sidebar GeoServer dengan tautan Layer Preview dilingkari hijau pada daftar menu Data](koneksi-postgis/image%208.png)
    
![Daftar layer pada Layer Preview dengan menu format berisi GeoJSON disorot dan baris ne:bangunan_gedung](koneksi-postgis/image4.png)
    
![Tab browser menampilkan GeoJSON FeatureCollection fitur bangunan_gedung bertipe Polygon beserta deretan koordinatnya](koneksi-postgis/image14.png)
    
11. Buka browser dalam Incognito mode, copy url GeoJSON lalu buka di Incognito, layer akan terbuka tanpa muncul permintaan login karena layer sudah diberikan akses publik
    
![Tab Incognito menampilkan GeoJSON FeatureCollection fitur bangunan_gedung bertipe Polygon dengan deretan koordinat](koneksi-postgis/image%209.png)