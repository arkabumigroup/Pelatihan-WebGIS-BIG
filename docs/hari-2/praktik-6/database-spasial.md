# Management Database Spasial

Halaman ini melanjutkan [Instalasi dan Konfigurasi Basis Data Lokal](/hari-2/praktik-6/basis-data-lokal) dan [Membuat Tabel, Primary Key, dan Foreign Key](/hari-2/praktik-6/tabel-dan-relasi). Ada dua pekerjaan di sini: menyiapkan schema `gis` beserta extension PostGIS-nya, lalu memuat data vektor dari shapefile ke dalam schema tersebut.

## Peran schema public dan gis

| Schema | Isinya |
|---|---|
| `public` | Data non spasial: tabel user, tabel katalog data, tabel role, dan sejenisnya |
| `gis` | Data spasial: feature geometry |

Pemisahan itu menjaga layer spasial tidak tercampur dengan tabel aplikasi. QGIS diarahkan ke schema `gis`, dan GeoServer membaca layer dari schema yang sama.

::: tip Nama database pada tangkapan layar
Tangkapan layar di halaman ini diambil dari beberapa sesi, sehingga nama database dapat terbaca `geoportal`, `geoportal2`, atau `geoportal4`. Langkah-langkah berikut memakai nama database Anda sendiri.
:::

## Menyiapkan koneksi dan schema spasial

Urutan berikut mengulang langkah persiapan yang sudah dikerjakan pada halaman [Instalasi dan Konfigurasi Basis Data Lokal](/hari-2/praktik-6/basis-data-lokal). Bila database, schema `gis`, dan extension PostGIS sudah ada, bagian ini dapat dipakai sebagai pemeriksaan.

1. Buka DBeaver, lalu buat koneksi baru ke PostgreSQL dengan memilih **PostgreSQL** pada daftar tipe database.

 ![Pilihan PostgreSQL pada dialog koneksi baru di DBeaver](database-spasial/image1.png)

2. Isi **Connection Settings**: **Host** `localhost`, **Port** `5432`, **Database** `postgres`, dan **Username** `postgres` beserta kata sandinya. Klik **Test Connection** untuk memastikan koneksi berhasil, lalu klik **Finish**.

 ![Connection Settings: host localhost, port 5432, dan user postgres](database-spasial/image2.png)

3. Expand **Databases**, klik kanan di dalamnya, lalu pilih **Create New Database**.

 ![Menu Create New Database pada node Databases](database-spasial/image3.png)

4. Isi **Database name** dengan `geoportal`, lalu klik **OK**.

 ![Dialog Create database dengan nama database geoportal](database-spasial/image4.png)

5. Expand **Schemas** di dalam database tersebut, klik kanan, lalu pilih **Create New Schema**.

 ![Menu Create New Schema pada node Schemas](database-spasial/image5.png)

6. Isi **Schema name** dengan `gis`, lalu klik **OK**.

7. Aktifkan extension PostGIS pada schema itu. Klik kanan node **Extensions** dan pilih **Create New Extension**.

 ![Menu Create New Extension pada node Extensions](database-spasial/image7.png)

8. Pada dialog **Install extensions**, pilih **Database** dan **Schema** `gis`, kemudian pilih `postgis` dari daftar.

 ![Dialog Install extensions: postgis dipilih untuk schema gis](database-spasial/image8.png)

9. Buka QGIS. Pada panel **Browser**, klik kanan **PostgreSQL** lalu pilih **New Connection**. Isi **Name**, **Host** `localhost`, **Port** `5432`, **Database**, **User name**, dan **Password**, kemudian klik **Test Connection** sebelum menutup dialog dengan **OK**. Pada bagian **Database Details**, isi **Schema** dengan `gis` supaya layer spasial langsung terbaca dari schema itu.

 ![Dialog koneksi PostgreSQL baru di QGIS dengan schema diarahkan ke gis](database-spasial/image9.png)

10. Arahkan `search_path` database ke schema `gis` lewat **Execute SQL** pada koneksi di panel Browser.

 ![Menu Execute SQL pada koneksi PostgreSQL di QGIS](database-spasial/image10.png)

 ```sql
 ALTER DATABASE namadatabase SET search_path TO gis, public;
 SHOW search_path;
 ```

 Ganti `namadatabase` dengan nama database Anda. `search_path` menentukan schema yang dicari lebih dulu ketika nama tabel ditulis tanpa awalan schema, sehingga tabel di schema `gis` dapat dipanggil tanpa menuliskan nama schema-nya. Perintah terakhir harus menghasilkan `gis, public`.

 ![Hasil SHOW search_path: gis, public](database-spasial/image11.png)

 QGIS menyimpan konfigurasi koneksi dari sebelum perintah itu dijalankan. Bila hasilnya belum berubah, tutup lalu buka lagi koneksinya.

## Membuat layer baru di schema gis

Layer baru dibuat dari QGIS, dan konfigurasinya diisi sesuai kebutuhan. Nilai berikut dipakai sebagai contoh pada halaman ini.

| Isian | Nilai contoh |
|---|---|
| Name | `Bangunan_Gedung` |
| Kolom | `nama`, `pemilik`, `luas_sertipikat`, `alamat` |
| Geometry type | Polygon |
| Geometry column name | `geom` |
| CRS | EPSG:4326 - WGS 84 |
| Create spatial index | Dicentang |

11. Pada panel **Browser**, klik kanan schema `gis` lalu pilih **New Table**.

 ![Menu New Table pada schema gis di QGIS](database-spasial/image12.png)

12. Isi konfigurasi layer seperti tabel di atas, lalu klik **OK**.

 ![Dialog New Table: nama layer, kolom, tipe geometri Polygon, kolom geom, dan CRS EPSG:4326](database-spasial/image13.png)

13. Tambahkan layer ke project lewat **Add Layer to Project** supaya muncul di panel **Layers**.

 ![Menu Add Layer to Project pada layer yang baru dibuat](database-spasial/image14.png)

14. Tambahkan basemap OSM dari node **XYZ Tiles** → **OpenStreetMap**, juga lewat **Add Layer to Project**, supaya dapat zoom in ke tempat yang diinginkan.

 ![Menu Add Layer to Project pada basemap OpenStreetMap](database-spasial/image15.png)

15. Aktifkan **Toggle Editing** pada layer, digitasi layer dengan data secukupnya, lalu simpan hasilnya.

 ![Menu Toggle Editing pada layer bangunan_gedung](database-spasial/image16.png)

 ![Hasil digitasi poligon sebelum layer disimpan](database-spasial/image17.png)

## Import Shapefile ke dalam Database

### Menyiapkan koneksi

16. Buka aplikasi **PostgreSQL Shapefile Loader Exporter**. Pada Windows, aplikasi ini terpasang bersama PostGIS Bundle dan terdaftar dengan nama Shapefile and DBF Loader Exporter.

 ![Aplikasi Shapefile and DBF Loader Exporter pada pencarian Windows](database-spasial/image18.png)

17. Buat koneksi ke database lewat tombol **View connection details…**, lalu isi kolom berikut.

 ```text
 Username : postgres
 Password : kata sandi PostgreSQL Anda
 Server Host : localhost
 Port : 5432
 Database : geoportal
 ```

 Klik **OK**. Log Window menampilkan `Connection succeeded` bila koneksi berhasil.

 ![Dialog PostGIS Connection pada Shapefile Import/Export Manager](database-spasial/image19.png)

### Memuat shapefile

18. Klik **Add File**, lalu pilih berkas `.shp` yang akan dimuat ke database.

 ![Dialog pemilihan berkas shp yang akan dimuat](database-spasial/image20.png)

19. Atur **Schema** tujuan dan **SRID** data pada baris import, kemudian klik **Import**.

 ![Baris import: schema gis, kolom geometri geom, SRID 4326, dan mode Create](database-spasial/image21.png)

::: warning SRID harus sesuai data
Nilai SRID dipakai PostGIS untuk menafsirkan koordinat pada berkas. Bila nilainya tidak sama dengan SRID data aslinya, fitur akan tergambar di lokasi yang salah saat layer ditambahkan ke project. Pada contoh ini dipakai `4326`.
:::

20. Kembali ke QGIS, klik kanan schema `gis` lalu pilih **Refresh** agar daftar layer di dalamnya diperbarui.

 ![Menu Refresh pada schema gis](database-spasial/image22.png)

21. Tambahkan layer hasil import ke project lewat **Add Layer to Project** untuk memastikan SRID-nya benar. Bila posisinya tepat di atas basemap, SRID yang dipilih sudah sesuai.

 ![Menu Add Layer to Project pada layer hasil import](database-spasial/image23.png)

## Hasil akhir

Setelah seluruh langkah selesai, project QGIS memuat layer hasil digitasi dan layer hasil import bersama basemap OSM.

![Hasil akhir: layer apotek, bangunan_gedung, dan mampang_prapatan di atas basemap OpenStreetMap](database-spasial/image24.png)

Langkah berikutnya, layer di schema `gis` dipublikasikan lewat GeoServer pada halaman [Koneksi PostgreSQL ke GeoServer dan Publish Layer](/hari-2/praktik-7/koneksi-postgis).
