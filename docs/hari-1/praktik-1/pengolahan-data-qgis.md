# Dasar-Dasar Pengolahan Data Spasial menggunakan QGIS

Modul ini disusun sebagai panduan praktik dasar pengolahan data spasial menggunakan perangkat lunak Sistem Informasi Geografis (SIG) berbasis desktop, yaitu QGIS. Melalui delapan (8) topik praktik pada modul ini, peserta akan mempelajari alur kerja dasar mulai dari membuka data spasial, membuat dan mengedit data sendiri, memberi styling atau simbologi, mengonversi format data, hingga mengakses dan menyimpan data spasial dari layanan web (web service) berupa WMS dan WFS.

## Tujuan Praktik

1. Memahami cara membuka berbagai format data spasial pada aplikasi SIG.
2. Mampu membuat data spasial baru (titik, garis, poligon) beserta atributnya.
3. Mampu melakukan editing geometry dan atribut pada data spasial.
4. Mampu memberikan styling/simbologi pada data spasial.
5. Mampu mengonversi data spasial antar format (shapefile, GeoJSON, KML, GeoPackage, dll).
6. Mampu mengakses layanan peta WMS (Web Map Service).
7. Mampu mengakses dan mengunduh data fitur WFS (Web Feature Service).
8. Mampu menyimpan data hasil layanan WFS menjadi data spasial lokal.

## Kebutuhan Perangkat

| Kebutuhan | Keterangan |
|---|---|
| Perangkat Lunak | QGIS versi 3.x (LTR direkomendasikan) |
| Koneksi Internet | Diperlukan untuk mengakses layanan WMS dan WFS |
| Data Latihan | Shapefile batas administrasi, titik lokasi (POI), atau data contoh lain sesuai instruktur |

## A. Membuka Data Spasial

1. Buka aplikasi QGIS, lalu buat proyek baru melalui menu **Project > New**.

   ![Jendela awal QGIS untuk membuat proyek baru](pengolahan-data-qgis/image1.png)

2. Pilih menu **Layer > Add Layer > Add Vector Layer** untuk data vektor (contoh: file `.shp`).

   ![Menu Layer > Add Layer > Add Vector Layer pada QGIS](pengolahan-data-qgis/image2.png)

3. Pada jendela yang muncul, klik tombol "..." di samping kolom **Vector Dataset(s)**, lalu arahkan ke lokasi file data spasial kemudian klik **add**.

   ![Jendela pemilihan berkas pada kolom Vector Dataset(s)](pengolahan-data-qgis/image3.png)

4. Hasilnya dapat dilihat pada gambar berikut ini.

   ![Layer vektor yang sudah tampil di kanvas peta](pengolahan-data-qgis/image4.png)

5. Kemudian tambahkan basemap dengan cara pada bagian browser pilih **XYZ Tiles** kemudian pilih basemap **OpenStreetMaps** kemudian klik dua kali untuk menambahkannya.

   ![Penambahan basemap OpenStreetMap dari XYZ Tiles](pengolahan-data-qgis/image5.png)

6. Selanjutnya pastikan urutan layer di atas urutan basemap agar layer tidak terhalangi oleh basemap yang ada.

   ![Urutan layer di atas basemap pada Layers Panel](pengolahan-data-qgis/image6.png)

## B. Membuat Data Spasial Sendiri

1. Pilih menu **Layer > Create Layer > New Shapefile Layer** (atau **New GeoPackage Layer**).

   ![Menu Layer > Create Layer > New Shapefile Layer](pengolahan-data-qgis/image7.png)

2. Tentukan nama file, tipe geometry (Point, Line, atau Polygon), dan sistem koordinat (CRS) yang sesuai.

   ![Pengisian nama file, tipe geometry, dan CRS layer baru](pengolahan-data-qgis/image8.png)

3. Kemudian pada bagian **New Field** tambahkan field atribut yang dibutuhkan (contoh: nama, jenis, keterangan) dengan menentukan tipe data (Text, Integer, Decimal) kemudian klik **OK**.

   ![Penambahan field atribut pada bagian New Field](pengolahan-data-qgis/image9.png)

4. Aktifkan mode editing dengan klik ikon pensil (**Toggle Editing**) pada Digitizing Toolbar.

   ![Ikon pensil Toggle Editing pada Digitizing Toolbar](pengolahan-data-qgis/image10.png)

5. Pilih alat **Add Point/Line/Polygon Feature**, lalu klik pada kanvas peta untuk mulai menggambar geometry baru.

   ![Alat Add Feature untuk menggambar geometry baru](pengolahan-data-qgis/image11.png)

6. Setelah selesai menggambar satu fitur, klik kanan untuk mengakhiri, lalu isi nilai atribut pada jendela yang muncul.

   ![Pengisian nilai atribut setelah satu fitur selesai digambar](pengolahan-data-qgis/image12.png)

7. Simpan hasil digitasi melalui tombol **Save Layer Edits**, lalu nonaktifkan mode editing.

   ![Tombol Save Layer Edits untuk menyimpan hasil digitasi](pengolahan-data-qgis/image13.png)

## C. Editing Geometry dan Atribut Data Spasial

1. Aktifkan mode editing (**Toggle Editing**) pada layer yang akan diubah. Gunakan alat **Vertex Tool** untuk memindahkan, menambah, atau menghapus titik (vertex) pada geometry.

   ![Alat Vertex Tool saat mode editing aktif](pengolahan-data-qgis/image14.png)

2. Kemudian lakukan editing pada data spasial yang akan dipilih, misalnya memperbaiki bentuk polygonnya. Simpan perubahan dengan **Save Layer Edits** setelah semua perubahan geometry selesai dilakukan.

   ![Perbaikan bentuk polygon pada kanvas peta](pengolahan-data-qgis/image15.png)

3. Selanjutnya untuk editing data atribut dapat dilakukan dengan cara buka tabel atribut melalui klik kanan pada layer > **Open Attribute Table**.

   ![Menu Open Attribute Table pada layer](pengolahan-data-qgis/image16.png)

4. Aktifkan mode editing pada tabel (ikon pensil di pojok kiri atas jendela tabel). Kemudian klik dua kali pada sel yang ingin diubah, lalu masukkan nilai baru. Selanjutnya simpan perubahan dengan tombol **Save Edits**, lalu tutup tabel atribut.

   ![Jendela tabel atribut dengan mode editing aktif](pengolahan-data-qgis/image17.png)

## D. Styling Data Spasial yang Sudah Dibuat

1. Klik dua kali pada layer di Layers Panel untuk membuka jendela **Layer Properties**, lalu pilih tab **Symbology**.

   ![Tab Symbology pada jendela Layer Properties](pengolahan-data-qgis/image18.png)

2. Pilih tipe render: **Single Symbol** (satu warna seragam), **Categorized** (berdasarkan kategori atribut), atau **Graduated** (berdasarkan rentang nilai numerik).

   ![Pilihan tipe render Single Symbol, Categorized, dan Graduated](pengolahan-data-qgis/image19.png)

3. Klik **Apply** lalu **OK** untuk menerapkan hasil styling ke kanvas peta.

   ![Hasil styling yang sudah diterapkan pada kanvas peta](pengolahan-data-qgis/image20.png)

## E. Konversi Format Data Spasial

1. Klik kanan pada layer yang akan dikonversi di Layers Panel, pilih **Export > Save Features As…**.

   ![Menu Export > Save Features As pada layer](pengolahan-data-qgis/image21.png)

2. Pada kolom **Format**, pilih format tujuan konversi (contoh: GeoJSON, KML, ESRI Shapefile, GeoPackage, CSV).

   ![Pemilihan format tujuan konversi](pengolahan-data-qgis/image22.png)

3. Tentukan lokasi penyimpanan file (**File name**) dan sistem koordinat (CRS) tujuan bila perlu diproyeksikan ulang.

   ![Penentuan lokasi penyimpanan dan CRS tujuan](pengolahan-data-qgis/image23.png)

4. Klik **OK** untuk memproses konversi; hasilnya dapat langsung ditambahkan ke kanvas peta secara otomatis.

   ![Hasil konversi yang ditambahkan ke kanvas peta](pengolahan-data-qgis/image24.png)

## F. Membuka Layanan WMS (Web Map Service)

1. Klik **layer**, kemudian klik **add layer** lalu pilih **add WMS/WMST**.

   ![Menu Add Layer > Add WMS/WMST Layer](pengolahan-data-qgis/image25.png)

2. Selanjutnya pada Data Source Manager, klik **New** maka akan muncul tampilan **Create A New WMS/WMST**.

   ![Tombol New pada Data Source Manager untuk koneksi WMS](pengolahan-data-qgis/image26.png)

3. Selanjutnya cari layer yang tersimpan dan dapat digunakan, salah satunya terdapat pada `https://geoserver.bps.go.id/` lalu pilih salah satu layer WMS, contohnya layer berikut ini.

   ```text
   https://geoserver.bps.go.id/rw-kumuh-dki/wms?service=WMS&version=1.1.0&request=GetMap&layers=rw-kumuh-dki%3Apeta_rw_kumuh&bbox=106.38303%2C-6.37263%2C106.97312%2C-5.18423&width=381&height=768&srs=EPSG%3A4326&styles=&format=application/openlayers
   ```

4. Pada Data Source Manager buat nama serta tambahkan tautan layer WMS tersebut.

   ![Pengisian nama dan tautan layer WMS](pengolahan-data-qgis/image27.png)

5. Selanjutnya klik **Connect** untuk menghubungkan kedalam layer tersebut. Kemudian pilih layer yang akan ditampilkan pada peta lalu klik **Add**.

   ![Tombol Connect dan pemilihan layer WMS yang akan ditampilkan](pengolahan-data-qgis/image28.png)

6. Hasil tampilan layer WMS dapat dilihat pada gambar berikut ini.

   ![Hasil tampilan layer WMS pada kanvas peta](pengolahan-data-qgis/image29.png)

::: tip Layanan WMS dan WFS memerlukan koneksi internet
Alamat layanan pada contoh ini berada di server `geoserver.bps.go.id`. Bila koneksi internet tidak tersedia, tahap F sampai H tidak dapat dijalankan.
:::

## G. Membuka Layanan WFS (Web Feature Service)

1. Klik menu **Layer → Add Layer → Add WFS Layer**.

   ![Menu Layer > Add Layer > Add WFS Layer](pengolahan-data-qgis/image30.png)

2. Pada jendela Data Source Manager yang muncul, klik tombol **New** sehingga muncul tampilan **Create a New WFS Connection**.

   ![Tombol New pada Data Source Manager untuk koneksi WFS](pengolahan-data-qgis/image31.png)

3. Tahap selanjutnya isi nama dan URL layer WFS yang didapat dari sumber yang sama, yaitu `https://geoserver.bps.go.id/web/?0`, dengan layer yang digunakan yaitu layer WFS berikut ini.

   ```text
   https://geoserver.bps.go.id/floodmap_sumatera_2025/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=floodmap_sumatera_2025%3Abrin-banjir&maxFeatures=1000
   ```

4. Tambahkan nama dan tautan tersebut kedalam data source manager kemudian klik **ok**.

   ![Pengisian nama dan URL layer WFS](pengolahan-data-qgis/image32.png)

5. Selanjutnya klik **Connect** untuk menghubungkan kedalam layer tersebut. Kemudian pilih layer yang akan ditampilkan pada peta lalu klik **Add**.

   ![Tombol Connect dan pemilihan layer WFS yang akan ditampilkan](pengolahan-data-qgis/image33.png)

6. Hasilnya dapat dilihat seperti berikut ini.

   ![Hasil tampilan layer WFS pada kanvas peta](pengolahan-data-qgis/image34.png)

## H. Menyimpan Data WFS Menjadi Data Lokal

1. Klik kanan pada layer WFS tersebut di Layers Panel, pilih **Export > Save Features As…**.

   ![Menu Export > Save Features As pada layer WFS](pengolahan-data-qgis/image35.png)

2. Pilih **Format** tujuan penyimpanan (contoh: ESRI Shapefile atau GeoPackage) dan tentukan lokasi **File name** penyimpanan pada komputer/laptop.

   ![Pemilihan format dan lokasi penyimpanan data WFS](pengolahan-data-qgis/image36.png)

3. Klik **OK** untuk menyimpan; QGIS akan mengunduh seluruh fitur dari server WFS dan menyimpannya sebagai file lokal.

   ![Pesan berhasil setelah fitur WFS tersimpan sebagai berkas lokal](pengolahan-data-qgis/image37.png)

::: warning Simpan sebelum keluar dari mode editing
Hasil digitasi dan perubahan atribut baru tertulis ke berkas setelah tombol **Save Layer Edits** atau **Save Edits** ditekan. Menonaktifkan mode editing lebih dahulu membuang perubahan yang belum disimpan.
:::
