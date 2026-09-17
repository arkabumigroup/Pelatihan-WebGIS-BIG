# Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer

## **Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer**

1. Jalankan Geoserver, setelah dijalankan buka browser dan jalankan [http://localhost:8080/geoserver/web/?0](http://localhost:8080/geoserver/web/?0)

    ```text
    http://localhost:8080/geoserver/web
    ```
    
![image.png](koneksi-postgis/image.png)
    
![](koneksi-postgis/image2.png)
    
2. Login sebagai admin dan masukan password yang dibuat saat instalasi, setelah itu klik Workspaces yang ada di menu sebelah kiri lalu buat workspace baru
    
![image.png](koneksi-postgis/image%201.png)
    
![](koneksi-postgis/image9.png)
    
3. Berikan nama workspace kemudian untuk Namespace URI ketik domain Geoserver saat ini diikuti dengan nama workspace.

    ```text
    Nama workspace : geoportal
    Namespace URI  : http://localhost:8080/geoserver/geoportal
    ```
    
![](koneksi-postgis/image5.png)
    
![image.png](koneksi-postgis/image%202.png)
    
4. Klik Stores dan buat Stores baru lalu pilih PostGIS untuk type of data source
    
![image.png](koneksi-postgis/image%203.png)
    
![](koneksi-postgis/image17.png)
    
![](koneksi-postgis/image3.png)
    
5. Pilih workspace yang sudah dibuat kemudian masukan koneksi sesuai dengan koneksi PostgreSQL anda

    ```text
    host     : localhost
    port     : 5432
    database : geoportal
    schema   : gis
    user     : postgres
    password : kata sandi PostgreSQL Anda
    ```
    
![image.png](koneksi-postgis/image%204.png)
    
![](koneksi-postgis/image10.png)
    
![](koneksi-postgis/image20.png)
    
6. Setelah save data store, geoserver akan mendeteksi layer apa saja yang ada di dalam PostgreSQL, klik Publish pada data yang ingin di Publish
    
![image.png](koneksi-postgis/image%205.png)
    
7. Pada bagian edit layer gunakan saja semua opsi default tetapi untuk Bounding Boxes klik compute from data lalu Save
    
![image.png](koneksi-postgis/image%206.png)
    
![](koneksi-postgis/image1.png)
    
8. Halaman akan berpindah ke halaman Layers dan data kita sudah berada di layer list tersebut
    
![image.png](koneksi-postgis/image%207.png)
    
9. Klik layer yang sudah kita buat lalu akan berpindah ke halaman edit layer, klik menu tab Security. Atur hak akses layer ini sesuai kebutuhan, berikut adalah contoh jika saya ingin data bisa dilihat publik tetapi edit hanya bisa dilakukan oleh admin, setelah itu Save
    
![](koneksi-postgis/image7.png)
    
10. Buka menu Layers Preview, kemudian pilih layer yang sudah dipublish lalu buka format GeoJSON, maka akan terbuka tab baru di browser menunjukan data GeoJSON

    ```text
    http://localhost:8080/geoserver/geoportal/ows?service=WMS&version=1.1.0&request=GetMap&layers=geoportal:nama_layer&bbox=-180,-90,180,90&width=768&height=330&srs=EPSG:4326&format=application/openlayers
    ```
    
![image.png](koneksi-postgis/image%208.png)
    
![](koneksi-postgis/image4.png)
    
![](koneksi-postgis/image14.png)
    
11. Buka browser dalam Incognito mode, copy url GeoJSON lalu buka di Incognito, layer akan terbuka tanpa muncul permintaan login karena layer sudah diberikan akses publik
    
![image.png](koneksi-postgis/image%209.png)