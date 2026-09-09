# Instalasi dan Konfigurasi Basis Data Local

## **Instalasi dan Konfigurasi Basis Data**

1. Buka tautan [https://www.postgresql.org/](https://www.postgresql.org/) kemudian klik menu download lalu pilih sesuai dengan sistem operasi yang digunakan oleh pengguna.
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image.png)
    
2. Tahapan berikutnya lakukan proses instalasi postgresql berdasarkan hasil yang telah diunduh pada perangkat.
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%201.png)
    
3. Setelah tahapan instalasi selesai maka akan muncul tampilan untuk stackbuilder kemudian pilih Postgresql 18 (x64).
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%202.png)
    
4. Selanjutnya pilih menu instalasi exstensi untuk mendukung penyimpanan data dalam bentuk spasial dengan memilih library postgis.
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%203.png)
    
5. Setelah tahapan instalasi selesai,buka pgadmin untuk melihat tampilan dari Postgresql yang telah terpasang pada perangkat pengguna.
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%204.png)
    
6. Buka tautan [https://dbeaver.io/](https://dbeaver.io/) download Dbeaver Community version.
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%205.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image25.png)
    
7. Setelah download install dengan konfigurasi default, setelah itu buka aplikasi Dbeaver, buat koneksi baru ke database PostgreSQL yang baru diinstall
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image16.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image3.png)
    
8. Jika sudah connect expand connection di list connections kemudian klik kanan di database lalu klik Create New Database beri nama database dengan nama aplikasi yang akan kita buat lalu OK
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%206.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image10.png)
    
9. Setelah database dibuat expand Schemas akan ada schema bernama public buat schema baru bernama gis dengan cara klik kanan Create New Schema di Schemas
    - Schema public => berfungsi untuk menyimpan data non spasial (tabel user, tabel katalog data, tabel role dll)
    - Schema gis => berfungsi untuk menyimpan data spasial (feature geometry, raster)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image2.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image6.png)
    
10. Setelah schema gis dibuat, install extension PostGIS di schema ini, di dalam database terdapat folder Extensions, folder ini berisi list Extension apa saja yang terinstall saat ini PostGIS belum ada di list tersebut oleh karena itu tambahkan PostGIS extension dan extension pendukung PostGIS lainnya
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%207.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image27.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image24.png)
    
11. Jika sudah close Dbeaver kemudian buka QGIS. Pada panel browser klik kanan di PostgreSQL kemudian klik New Connection
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%208.png)
    
12. Untuk connection details isikan seperti ini lalu test connection jika berhasil klik OK
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%209.png)
    
13. Berikut adalah tampilan awal database kosong yang sudah terkoneksi di QGIS
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2010.png)
    
14. Saat ini extension postgis sudah ada di database tetapi belum diaktifkan klik kanan pada geoportal-local lalu klik Execute SQL
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2011.png)
    
15. Lalu masukan perintah SQL berikut lalu execute, pastikan perintah terakhir memberi response **gis, public**
    
    ```jsx
    CREATE EXTENSION IF NOT EXISTS postgis;
    
    ALTER DATABASE geoportal SET search_path TO gis, public;
    
    SHOW search_path;
    ```
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image28.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image7.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image4.png)
    
16. Setelah SQL expression di atas di execute QGIS masih menyimpan konfigurasi lama sebelum SQL expression dijalankan, oleh karena itu harus re-connect database nya, remove connection database kemudian connect lagi
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2012.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image20.png)
    
17. Pada database gis klik kanan kemudian klik New Table untuk membuat Layer Baru
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2013.png)
    
18. Konfigurasikan Layer sesuai kebutuhan lalu OK
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2014.png)
    
19. Layer sudah terbuat, tambahkan layer ke project agar muncul di panel Layers, tambahkan juga basemap OSM supaya bisa zoom in ke tempat yang diinginkan
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2015.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image11.png)
    
20. Aktifkan toggle editing dan isi layer dengan data secukupnya kemudian save
    
    ![image.png](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image%2016.png)
    
    ![](Instalasi%20dan%20Konfigurasi%20Basis%20Data%20Local/image21.png)