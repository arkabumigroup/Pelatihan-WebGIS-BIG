# Instalasi dan Konfigurasi Basis Data Local

## **Instalasi dan Konfigurasi Basis Data**

1. Buka tautan [https://www.postgresql.org/](https://www.postgresql.org/) kemudian klik menu download lalu pilih sesuai dengan sistem operasi yang digunakan oleh pengguna.
    
![Laman Downloads PostgreSQL dengan Quick Links di kiri dan lima pilihan sistem operasi Linux, macOS, Windows, BSD, serta Solaris](basis-data-lokal/image.png)
    
2. Tahapan berikutnya lakukan proses instalasi postgresql berdasarkan hasil yang telah diunduh pada perangkat.
    
![Jendela Setup PostgreSQL 18.6.1 yang menyambut awal proses instalasi, dengan tombol Next, Back, dan Cancel di bagian bawah](basis-data-lokal/image%201.png)
    
3. Setelah tahapan instalasi selesai maka akan muncul tampilan untuk stackbuilder kemudian pilih Postgresql 18 (x64).
    
![Dialog Stack Builder 4.2.2 dengan pilihan PostgreSQL 18 (x64) on port 5432 pada daftar instalasi perangkat lunak tambahan](basis-data-lokal/image%202.png)
    
4. Selanjutnya pilih menu instalasi exstensi untuk mendukung penyimpanan data dalam bentuk spasial dengan memilih library postgis.
    
![Daftar aplikasi Stack Builder dengan PostgreSQL 18.6.1 dan PostGIS 3.6 Bundle for PostgreSQL 18 sudah tercentang](basis-data-lokal/image%203.png)
    
5. Setelah tahapan instalasi selesai,buka pgadmin untuk melihat tampilan dari Postgresql yang telah terpasang pada perangkat pengguna.
    
![Beranda pgAdmin 4 dengan Quick Links Add New Server serta Configure pgAdmin dan tautan Getting Started](basis-data-lokal/image%204.png)
    
6. Buka tautan [https://dbeaver.io/](https://dbeaver.io/) download Dbeaver Community version.
    
![Laman dbeaver.io yang menampilkan DBeaver Community dengan tombol Download dilingkari hijau](basis-data-lokal/image%205.png)
    
![Laman unduh DBeaver Community dengan tombol Download EXE untuk Windows x86 ditandai hijau](basis-data-lokal/image25.png)
    
7. Setelah download install dengan konfigurasi default, setelah itu buka aplikasi Dbeaver, buat koneksi baru ke database PostgreSQL yang baru diinstall
    
![Menu New Database Connection DBeaver dengan pilihan PostgreSQL disorot hijau](basis-data-lokal/image16.png)
    
![Dialog Connect to a database berisi host localhost, port 5432, database postgres, dan user postgres dengan tombol Test Connection serta Finish ditandai hijau](basis-data-lokal/image3.png)
    
8. Jika sudah connect expand connection di list connections kemudian klik kanan di database lalu klik Create New Database beri nama database dengan nama aplikasi yang akan kita buat lalu OK

    ```sql
    CREATE DATABASE geoportal;
    ```
    
![Menu klik kanan Databases di DBeaver dengan pilihan Create New Database di kotak hijau dan pintasan Alt+Insert](basis-data-lokal/image%206.png)
    
![Dialog Create database dengan nama geoportal, owner postgres, dan encoding UTF8](basis-data-lokal/image10.png)
    
9. Setelah database dibuat expand Schemas akan ada schema bernama public buat schema baru bernama gis dengan cara klik kanan Create New Schema di Schemas

    ```sql
    CREATE SCHEMA IF NOT EXISTS gis;
    ```
    - Schema public => berfungsi untuk menyimpan data non spasial (tabel user, tabel katalog data, tabel role dll)
    - Schema gis => berfungsi untuk menyimpan data spasial (feature geometry, raster)
    
![Menu klik kanan folder Schemas di DBeaver dengan pilihan Create New Schema](basis-data-lokal/image2.png)
    
![Dialog Create schema dengan Schema name gis pada database geoportal](basis-data-lokal/image6.png)
    
10. Setelah schema gis dibuat, install extension PostGIS di schema ini, di dalam database terdapat folder Extensions, folder ini berisi list Extension apa saja yang terinstall saat ini PostGIS belum ada di list tersebut oleh karena itu tambahkan PostGIS extension dan extension pendukung PostGIS lainnya

    ```sql
    CREATE EXTENSION IF NOT EXISTS postgis SCHEMA gis;
    ```
    
![Menu klik kanan folder Extensions di DBeaver dengan pilihan Create New Extension, pada pohon koneksi postgres yang memuat database geoportal](basis-data-lokal/image%207.png)
    
![Dialog Install extensions DBeaver pada database geoportal schema gis dengan daftar extension postgis, postgis_raster, postgis_sfcgal, dan postgis_topology](basis-data-lokal/image27.png)
    
![Panel database DBeaver memperlihatkan schema gis, public, dan folder Extensions berisi postgis, postgis_raster, serta postgis_sfcgal](basis-data-lokal/image24.png)
    
11. Jika sudah close Dbeaver kemudian buka QGIS. Pada panel browser klik kanan di PostgreSQL kemudian klik New Connection
    
![Panel Browser QGIS dengan menu klik kanan PostgreSQL berisi New Connection, Save Connections, dan Load Connections](basis-data-lokal/image%208.png)
    
12. Untuk connection details isikan seperti ini lalu test connection jika berhasil klik OK
    
![Dialog Create a New PostgreSQL Connection di QGIS dengan Name geoportal-local, Host localhost, Port 5432, Database geoportal, Schema gis, serta tombol Test Connection](basis-data-lokal/image%209.png)
    
13. Berikut adalah tampilan awal database kosong yang sudah terkoneksi di QGIS
    
![Panel Browser QGIS memperlihatkan koneksi geoportal-local dengan schema gis dan tabel raster_columns di dalamnya](basis-data-lokal/image%2010.png)
    
14. Saat ini extension postgis sudah ada di database tetapi belum diaktifkan klik kanan pada geoportal-local lalu klik Execute SQL
    
![Menu klik kanan geoportal-local di QGIS dengan pilihan Execute SQL disorot pada daftar perintah database](basis-data-lokal/image%2011.png)
    
15. Lalu masukan perintah SQL berikut lalu execute, pastikan perintah terakhir memberi response **gis, public**
    
    ```jsx
    CREATE EXTENSION IF NOT EXISTS postgis;
    
    ALTER DATABASE geoportal SET search_path TO gis, public;
    
    SHOW search_path;
    ```

![Jendela geoportal-local Execute SQL berisi perintah CREATE EXTENSION IF NOT EXISTS postgis](basis-data-lokal/image28.png)

![Jendela Execute SQL menjalankan ALTER DATABASE geoportal SET search_path TO gis, public dengan pesan Query executed successfully](basis-data-lokal/image7.png)
    
![Hasil SHOW search_path menampilkan nilai gis, public pada jendela Execute SQL](basis-data-lokal/image4.png)
    
::: warning `ALTER DATABASE` bekerja di PostgreSQL lokal, tidak di Supabase
Perintah `ALTER DATABASE ... SET search_path` di atas bekerja pada PostgreSQL yang Anda pasang sendiri, karena Anda memegang hak penuh atas servernya.

Di Supabase, perintah yang sama **tidak berpengaruh**. Penyebabnya, Supabase menyediakan koneksi lewat pooler, dan pooler menetapkan `search_path` pada tingkat koneksi sehingga menimpa nilai tingkat database. Karena itu pada [Google Cloud Platform](/hari-4/praktik-11/google-cloud-platform) tabel non spasial diletakkan di schema `public`, sedangkan tabel spasial di schema `gis` dan datastore GeoServer diarahkan ke schema itu.
:::

16. Setelah SQL expression di atas di execute QGIS masih menyimpan konfigurasi lama sebelum SQL expression dijalankan, oleh karena itu harus re-connect database nya, remove connection database kemudian connect lagi
    
![Menu klik kanan koneksi PostgreSQL di QGIS dengan pilihan Remove Connection disorot](basis-data-lokal/image%2012.png)
    
![Dialog Create a New PostgreSQL Connection di QGIS dengan nama geoportal-local, host localhost, port 5432, database geoportal, dan schema gis](basis-data-lokal/image20.png)
    
17. Pada database gis klik kanan kemudian klik New Table untuk membuat Layer Baru
    
![Menu klik kanan schema gis di QGIS dengan pilihan New Table disorot](basis-data-lokal/image%2013.png)
    
18. Konfigurasikan Layer sesuai kebutuhan lalu OK
    
![Dialog New Table QGIS dengan Schema gis, Name bangunan_gedung, kolom nama, pemilik, luas_sertipikat, alamat, Geometry type Polygon, CRS EPSG:4326, dan Create spatial index tercentang](basis-data-lokal/image%2014.png)
    
19. Layer sudah terbuat, tambahkan layer ke project agar muncul di panel Layers, tambahkan juga basemap OSM supaya bisa zoom in ke tempat yang diinginkan
    
![Menu klik kanan layer bangunan_gedung di QGIS dengan pilihan Add Layer to Project disorot](basis-data-lokal/image%2015.png)
    
![Menu klik kanan OpenStreetMap di panel Browser QGIS dengan pilihan Add Layer to Project, panel Layers di bawahnya memuat bangunan_gedung](basis-data-lokal/image11.png)
    
20. Aktifkan toggle editing dan isi layer dengan data secukupnya kemudian save
    
![Menu klik kanan layer OpenStreetMap di QGIS dengan pilihan Toggle Editing dan Zoom to Layer](basis-data-lokal/image%2016.png)
    
![QGIS menampilkan poligon bangunan berwarna merah muda di atas basemap OpenStreetMap, tombol Save Layer Edits ditandai pada toolbar](basis-data-lokal/image21.png)