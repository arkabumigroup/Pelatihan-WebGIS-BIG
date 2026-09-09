# Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer

## **Koneksi PostgreSQL ke Geoserver sebagai Data Store dan Publish Layer**

1. Jalankan Geoserver, setelah dijalankan buka browser dan jalankan [http://localhost:8080/geoserver/web/?0](http://localhost:8080/geoserver/web/?0)
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image2.png)
    
2. Login sebagai admin dan masukan password yang dibuat saat instalasi, setelah itu klik Workspaces yang ada di menu sebelah kiri lalu buat workspace baru
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%201.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image9.png)
    
3. Berikan nama workspace kemudian untuk Namespace URI ketik domain Geoserver saat ini diikuti dengan nama workspace.
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image5.png)
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%202.png)
    
4. Klik Stores dan buat Stores baru lalu pilih PostGIS untuk type of data source
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%203.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image17.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image3.png)
    
5. Pilih workspace yang sudah dibuat kemudian masukan koneksi sesuai dengan koneksi PostgreSQL anda
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%204.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image10.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image20.png)
    
6. Setelah save data store, geoserver akan mendeteksi layer apa saja yang ada di dalam PostgreSQL, klik Publish pada data yang ingin di Publish
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%205.png)
    
7. Pada bagian edit layer gunakan saja semua opsi default tetapi untuk Bounding Boxes klik compute from data lalu Save
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%206.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image1.png)
    
8. Halaman akan berpindah ke halaman Layers dan data kita sudah berada di layer list tersebut
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%207.png)
    
9. Klik layer yang sudah kita buat lalu akan berpindah ke halaman edit layer, klik menu tab Security. Atur hak akses layer ini sesuai kebutuhan, berikut adalah contoh jika saya ingin data bisa dilihat publik tetapi edit hanya bisa dilakukan oleh admin, setelah itu Save
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image7.png)
    
10. Buka menu Layers Preview, kemudian pilih layer yang sudah dipublish lalu buka format GeoJSON, maka akan terbuka tab baru di browser menunjukan data GeoJSON
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%208.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image4.png)
    
    ![](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image14.png)
    
11. Buka browser dalam Incognito mode, copy url GeoJSON lalu buka di Incognito, layer akan terbuka tanpa muncul permintaan login karena layer sudah diberikan akses publik
    
    ![image.png](Koneksi%20PostgreSQL%20ke%20Geoserver%20sebagai%20Data%20Store/image%209.png)