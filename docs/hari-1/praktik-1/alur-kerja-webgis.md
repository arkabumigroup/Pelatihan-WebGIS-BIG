# Alur Kerja WebGIS

WebGIS dibangun dari beberapa komponen yang saling terhubung: PostGIS, GeoServer, frontend, dan layanan OGC. Halaman ini menjelaskan peran tiap komponen dan urutan alur data dari sumbernya sampai menjadi peta yang tampil di browser.

## Apa itu WebGIS?

WebGIS adalah sistem informasi geografis yang diakses melalui web browser, memungkinkan pengguna menyimpan, menganalisis, dan memvisualisasikan data spasial secara online tanpa perlu instalasi software desktop. WebGIS memisahkan pengolahan data (server) dari tampilan (client), sehingga dapat diakses banyak pengguna sekaligus.

Pemisahan server dan client memberi empat hal berikut.

| Aspek | Penjelasan |
|---|---|
| Aksesibilitas | Dapat diakses dari mana saja dan perangkat apa saja, cukup lewat browser |
| Kolaborasi | Banyak pengguna dapat mengakses dan mengedit data yang sama secara real-time |
| Skalabilitas | Dapat dikembangkan untuk menangani data dan jumlah pengguna yang bertambah |
| Efisiensi Biaya | Tidak perlu lisensi software desktop di tiap perangkat pengguna |

## Arsitektur Client-Server

WebGIS dibangun di atas tiga lapisan (tier) yang saling terhubung.

| Lapisan | Isi | Peran |
|---|---|---|
| Client / Frontend | Browser pengguna | Menampilkan peta interaktif, menerima input pengguna (pan, zoom, klik) |
| Application / Server | GeoServer dan web server | Memproses permintaan, mempublikasikan data sebagai layanan OGC |
| Data Layer | PostGIS/basis data | Menyimpan seluruh data spasial dan atribut secara terpusat |

Permintaan (request) mengalir dari client ke server, lalu data dan respons (response) mengalir kembali ke client. Alur bolak-balik inilah yang membuat peta terasa interaktif.

## Alur Kerja WebGIS End-to-End

Data berjalan satu arah melalui empat komponen, dari sumber data sampai tampil di browser.

```text
Data Spasial     Sumber data vektor/raster
     |
     v
PostGIS          Penyimpanan basis data spasial
     |
     v
GeoServer        Publikasi data via OGC Service
     |
     v
Frontend         Visualisasi peta interaktif
```

Urutan pengerjaannya:

1. Persiapan data. Data lapangan, citra, atau shapefile dibersihkan dan distandarkan sistem koordinatnya.
2. Import ke PostGIS. Data dimuat ke basis data spasial menggunakan tools seperti shp2pgsql atau ogr2ogr.
3. Publikasi di GeoServer. Layer dikonfigurasi (style, proyeksi) lalu dipublikasikan sebagai WMS/WFS.
4. Render di frontend. Aplikasi web memanggil layanan OGC dan menampilkan peta kepada pengguna akhir.

## PostGIS: Basis Data Spasial

PostGIS adalah ekstensi spasial untuk PostgreSQL yang menambahkan dukungan penyimpanan, query, dan analisis data geografis langsung di dalam basis data relasional.

- Menyimpan tipe data geometri (point, line, polygon) langsung di database
- Mendukung fungsi query spasial (ST_Intersects, ST_Distance, ST_Contains, ST_Buffer, dll)
- Terintegrasi penuh dengan SQL standar, sehingga dapat dikombinasikan dengan data atribut
- Mendukung indexing spasial (GiST) untuk mempercepat pencarian pada data berjumlah besar

Contoh query PostGIS:

```sql
-- Cari jalan yang berpotongan dengan area banjir
SELECT r.name FROM roads r, flood_zones f
WHERE ST_Intersects(r.geom, f.geom);
```

## GeoServer: Server Peta

GeoServer adalah server open-source yang mempublikasikan data spasial (dari PostGIS, shapefile, raster, dsb) sebagai layanan web standar yang dapat diakses aplikasi lain.

| Kemampuan | Keterangan |
|---|---|
| Menghubungkan sumber data | Terhubung ke PostGIS, shapefile, GeoTIFF, dan format lainnya sebagai data store |
| Konfigurasi layer dan style | Mengatur simbolisasi peta menggunakan SLD (Styled Layer Descriptor) |
| Publikasi layanan OGC | Menyediakan data melalui WMS, WFS, dan WCS agar dapat dipanggil frontend |
| Kontrol akses | Mengatur workspace, layer group, dan hak akses pengguna terhadap data |

### Konfigurasi Layer di GeoServer

Empat tahapan berikut dilalui saat mempublikasikan sebuah layer.

| Tahapan | Keterangan |
|---|---|
| Workspace | Namespace yang mengelompokkan layer-layer terkait dalam satu proyek |
| Store | Koneksi ke sumber data (mis. koneksi ke database PostGIS) |
| Layer | Tabel/data individual yang dipublikasikan, lengkap dengan CRS dan bounding box |
| Style (SLD) | Aturan visual: warna, ketebalan garis, simbol, dan label pada peta |

## Frontend: Visualisasi Peta

Frontend adalah lapisan aplikasi web yang menampilkan peta interaktif kepada pengguna, memanggil layanan data dari GeoServer melalui protokol OGC.

| Library | Keterangan |
|---|---|
| Leaflet | Library JavaScript ringan untuk peta interaktif dasar. Cocok untuk pemula dan proyek sederhana |
| OpenLayers | Library lengkap dengan dukungan proyeksi dan format data kompleks. Cocok untuk kebutuhan WebGIS tingkat lanjut |
| MapLibre GL | Rendering peta vektor berbasis WebGL dengan performa tinggi. Cocok untuk visualisasi data besar dan animasi halus |

Contoh Leaflet memanggil WMS:

```js
L.tileLayer.wms('https://geoserver/wms', {layers:'gis:roads'}).addTo(map);
```

## OGC Service: Standar Layanan Peta

Open Geospatial Consortium (OGC) merupakan standar protokol agar data spasial dapat dipertukarkan antar sistem yang berbeda secara interoperable.

| Layanan | Nama | Keterangan |
|---|---|---|
| WMS | Web Map Service | Menyediakan peta sebagai gambar (raster) siap tampil: cepat, ringan, tidak dapat diedit langsung |
| WFS | Web Feature Service | Menyediakan data geometri dan atribut mentah (vektor) yang dapat di-query dan diedit oleh client |
| WCS | Web Coverage Service | Menyediakan data raster/coverage mentah (mis. DEM) untuk analisis lanjutan di sisi client |

## WMS vs WFS

Dua layanan OGC yang paling sering digunakan dalam WebGIS.

| Aspek | WMS | WFS |
|---|---|---|
| Format Output | Gambar (PNG/JPEG) | Data vektor mentah (GML/GeoJSON) |
| Dapat Diedit | Tidak, hanya tampilan | Ya, geometri dan atribut dapat diquery/diedit |
| Kecepatan | Lebih cepat, ringan dirender | Lebih berat karena mengirim data mentah |
| Contoh Penggunaan | Menampilkan basemap/citra latar | Analisis interaktif, filter fitur di client |

::: warning Pilih layanan sesuai kebutuhan
WMS hanya mengirim gambar, sehingga isinya tidak dapat di-query atau diedit di client. Bila peserta perlu memfilter fitur atau mengunduh geometri, gunakan WFS. Sebaliknya, memakai WFS hanya untuk menampilkan citra latar membuat peta lebih berat karena seluruh data mentah ikut terkirim.
:::

Langkah praktiknya ada pada halaman [Pengolahan Data dengan QGIS](/hari-1/praktik-1/pengolahan-data-qgis).
