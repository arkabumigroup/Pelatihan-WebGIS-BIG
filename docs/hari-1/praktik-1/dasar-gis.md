# Dasar-dasar GIS

Halaman ini membahas jenis data GIS, sistem koordinat, dan transformasi koordinat. Ketiganya dipakai berulang pada praktik berikutnya, terutama saat data dari beberapa sumber harus digabungkan dalam satu peta.

## Apa itu GIS?

Geographic Information System (GIS) adalah sistem yang dirancang untuk menangkap, menyimpan, mengelola, menganalisis, dan menyajikan data yang memiliki referensi lokasi (data spasial). GIS menggabungkan tiga aspek: perangkat lunak/keras, data spasial, dan analisis keruangan, sehingga fenomena di dunia nyata dapat dipetakan dan dipahami hubungan antar-lokasinya.

Contoh penerapan GIS:

- Perencanaan tata ruang dan wilayah kota
- Mitigasi bencana (banjir, longsor, gempa)
- Navigasi dan logistik pengiriman
- Pemantauan lingkungan dan perubahan lahan

Pekerjaan GIS berjalan melalui empat tahap berikut, berurutan dari pengumpulan data sampai penyajian hasil.

| Tahap | Kegiatan |
|---|---|
| Capture | Pengumpulan data lokasi (GPS, survei, citra satelit, drone) |
| Manage | Penyimpanan dan pengelolaan data dalam basis data spasial |
| Analyze | Analisis hubungan, pola, dan tren keruangan (overlay, buffer, dsb) |
| Present | Visualisasi dalam bentuk peta, dashboard, atau laporan |

## Komponen Utama GIS

| Komponen | Peran |
|---|---|
| Hardware | Perangkat komputer, server, GPS, drone, scanner untuk mengolah dan mengumpulkan data |
| Software | Aplikasi pengolah data spasial: QGIS, ArcGIS, PostGIS, GeoServer |
| Data | Data spasial (vektor/raster) dan data atribut sebagai bahan utama analisis |
| Metode | Prosedur dan model analisis yang diterapkan agar hasil konsisten dan valid |
| People | Pengguna, analis, dan pengambil keputusan yang mengoperasikan sistem |

## Jenis Data GIS

Secara umum data GIS terbagi menjadi data spasial (vektor dan raster) dan data atribut.

### Data Vektor

Merepresentasikan objek diskrit dengan geometri presisi menggunakan titik, garis, dan poligon. Cocok untuk objek dengan batas jelas.

| Geometri | Mewakili | Contoh |
|---|---|---|
| Point | Lokasi | Titik sumur, ATM |
| Line | Jaringan | Jalan, sungai, pipa |
| Polygon | Area | Batas wilayah, danau |

### Data Raster

Merepresentasikan permukaan bumi dalam bentuk grid/piksel dengan nilai tertentu. Cocok untuk fenomena kontinu.

- Citra satelit dan foto udara/drone
- Model elevasi digital (DEM/DTM)
- Setiap piksel menyimpan nilai (warna, suhu, ketinggian)

### Data Atribut

Informasi deskriptif non-spasial yang melekat pada setiap objek geometri melalui tabel relasional.

- Nama, kode, kategori objek
- Data numerik dan statistik terkait
- Terhubung ke geometri via ID unik

## Vektor vs Raster

| Aspek | Data Vektor | Data Raster |
|---|---|---|
| Struktur | Titik, garis, poligon (koordinat presisi) | Grid piksel berukuran seragam (sel) |
| Ukuran File | Relatif kecil untuk objek sederhana | Besar, tergantung resolusi spasial |
| Ketepatan Batas | Sangat presisi untuk objek diskrit | Bergantung resolusi piksel (kurang presisi) |
| Contoh Format | Shapefile (.shp), GeoJSON, KML | GeoTIFF, JPEG2000, IMG |
| Cocok Untuk | Batas administrasi, jaringan jalan, bangunan | Tutupan lahan, curah hujan, elevasi |

Pemilihannya mengikuti bentuk objek yang dipetakan. Objek dengan batas tegas, seperti batas administrasi dan jaringan jalan, disimpan sebagai vektor. Fenomena yang berubah bertahap di seluruh wilayah, seperti tutupan lahan, curah hujan, dan elevasi, disimpan sebagai raster.

## Sistem Koordinat

Sistem koordinat menentukan bagaimana lokasi di permukaan bumi direpresentasikan secara numerik.

### Geographic Coordinate System (GCS)

Menggunakan garis lintang (latitude) dan bujur (longitude) dalam satuan derajat pada model bumi 3D (ellipsoid). Contoh: WGS 84 (EPSG:4326), standar global untuk GPS.

### Projected Coordinate System (PCS)

Memproyeksikan permukaan bumi 3D ke bidang datar 2D dalam satuan meter, sehingga jarak dan luas dapat dihitung langsung. Contoh: UTM Zone 48S (EPSG:32748) untuk wilayah Indonesia bagian tengah.

### Datum

Kerangka acuan yang mendefinisikan ukuran, bentuk bumi (ellipsoid), dan titik referensi awal (origin). Contoh: Datum WGS 1984.

| Jenis | Satuan | Contoh |
|---|---|---|
| GCS | Derajat | WGS 84 (EPSG:4326) |
| PCS | Meter | UTM Zone 48S (EPSG:32748) |
| Datum | Kerangka acuan | Datum WGS 1984 |

## Transformasi Koordinat

Transformasi koordinat adalah proses mengonversi data dari satu sistem referensi ke sistem referensi lain. Transformasi diperlukan agar data dari berbagai sumber, yang mungkin memakai sistem koordinat berbeda, dapat ditumpangsusunkan (overlay) secara akurat dalam satu analisis atau peta.

Urutan pengerjaannya:

1. Identifikasi CRS sumber. Kenali sistem koordinat asal data, biasanya tercantum dalam metadata (mis. WGS 84 geografis).
2. Tentukan CRS target. Pilih sistem koordinat tujuan sesuai kebutuhan analisis/peta (mis. UTM untuk perhitungan luas).
3. Reproyeksi. Gunakan tools seperti QGIS, PostGIS ST_Transform(), atau GDAL untuk konversi otomatis.
4. Validasi hasil. Periksa keselarasan (overlay) dengan data referensi lain untuk memastikan tidak ada pergeseran.

Contoh di PostGIS:

```sql
SELECT ST_Transform(geom, 32748) FROM parcels; -- WGS84 → UTM 48S
```

## Kesalahan Umum Seputar Koordinat

| Kesalahan | Akibat |
|---|---|
| Mengabaikan CRS data | Menggabungkan data tanpa memeriksa sistem koordinatnya terlebih dahulu, sehingga objek tampil bergeser atau tidak muncul sama sekali |
| Salah zona UTM | Menggunakan zona UTM yang tidak sesuai wilayah, sehingga distorsi jarak dan luas menjadi signifikan |
| Tertukar datum | Menyamakan datum lokal dengan WGS 84 tanpa transformasi, sehingga posisi bergeser hingga puluhan meter |
| Bypass validasi | Tidak memeriksa hasil akhir setelah reproyeksi, sehingga kesalahan baru diketahui saat data sudah digunakan |

::: warning Periksa CRS sebelum menggabungkan layer
Data yang tampil bergeser atau tidak muncul sama sekali sering berasal dari penggabungan layer dengan sistem koordinat berbeda. Periksa CRS tiap layer lebih dahulu, lalu reproyeksi ke CRS yang sama sebelum dianalisis.
:::

Halaman berikutnya membahas komponen yang menyusun WebGIS dan alur datanya: [Alur Kerja WebGIS](/hari-1/praktik-1/alur-kerja-webgis).
