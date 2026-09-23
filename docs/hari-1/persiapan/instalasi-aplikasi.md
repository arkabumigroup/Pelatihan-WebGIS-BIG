# Instalasi Aplikasi

**Modul 1 - Dasar-Dasar GIS, Konsep WebGIS, Dasar Pemrograman, dan Github**

## **Instalasi Visual Studio Code, GitHub Desktop, dan Node.js**

1. Buka tautan [https://code.visualstudio.com/download](https://code.visualstudio.com/download), kemudian pilih opsi unduh berdasarkan sistem operasi yang digunakan.
    
![Halaman unduh Visual Studio Code dengan tombol Windows, .deb/.rpm Linux, dan Mac](instalasi-aplikasi/image17.png)
    
2. Tahapan berikutnya setelah proses unduh selesai, maka lakukan proses instalasi kemudian tunggu hingga proses instalasi selesai. Berikut ini merupakan tampilan awal dari Virtual Studio Code.
    
![Jendela Welcome Visual Studio Code dengan panel Explorer dan tombol Open Folder](instalasi-aplikasi/image7.png)
    
3. Selanjutnya unduh **GitHub Desktop** melalui tautan [https://desktop.github.com/download/](https://desktop.github.com/download/), kemudian lakukan proses instalasinya.

    Seluruh pekerjaan repositori pada pelatihan ini dikerjakan lewat GitHub Desktop, mulai dari clone, menyimpan perubahan, sampai mengirimnya ke GitHub. Perintah `git` tidak perlu Anda ketik.

![Situs git-scm.com dengan tombol Install for Windows dan versi rilis terbaru 2.55.0](instalasi-aplikasi/image4.png)
    
4. Tahapan berikutnya instal Node.js yang akan digunakan sebagai package manager untuk melakuan pemrograman menggunakan Javascript, Next.js, Angular serta bahasa pemrograman javascript lainnya. Node.js dapat diunduh pada link berikut ini [https://nodejs.org/en/download](https://nodejs.org/en/download).

![Halaman unduh Node.js dengan pilihan versi 24.19.0 LTS dan tombol Windows Installer](instalasi-aplikasi/image2.png)
    
5. Setelah proses instalasi selesai, untuk melihat apakah Node.js telah terpasang pada perangkat yang digunakan, pengguna dapat melakukan pengecekan pada Windows Powershell kemudian melakukan pengetikan perintah `node --version` untuk melihat versi node yang telah di install.

    ```bash
    node --version
    npm --version
    ```

![Windows PowerShell yang menampilkan hasil perintah git version dan node --version](instalasi-aplikasi/image6.png)

## **Instalasi Postgresql**

1. Buka tautan [https://www.postgresql.org/](https://www.postgresql.org/) kemudian klik menu download lalu pilih sesuai dengan sistem operasi yang digunakan oleh pengguna.
    
![Halaman Downloads PostgreSQL dengan pilihan sistem operasi Linux, macOS, Windows, BSD, dan Solaris](instalasi-aplikasi/image22.png)
    
2. Tahapan berikutnya lakukan proses instalasi postgresql berdasarkan hasil yang telah diunduh pada perangkat.
    
![Jendela Setup PostgreSQL dengan pesan selamat datang dari Setup Wizard](instalasi-aplikasi/image13.png)
    
3. Setelah tahapan instalasi selesai maka akan muncul tampilan untuk stackbuilder kemudian pilih Postgresql 18 (x64).
    
![Stack Builder dengan menu pilihan PostgreSQL 18 (x64) on port 5432](instalasi-aplikasi/image26.png)
    
4. Selanjutnya pilih mn instalasi exstensi untuk mendukung penyimpanan data dalam bentuk spasial dengan memilih library postgis.
    
![Daftar aplikasi Stack Builder dengan PostGIS 3.6 Bundle untuk PostgreSQL 18 yang dicentang](instalasi-aplikasi/image23.png)
    
5. Setelah tahapan instalasi selesai,buka pgadmin untuk melihat tampilan dari Postgresql yang telah terpasang pada perangkat pengguna.

    ```text
    pgAdmin: buka dari Start Menu, lalu masukkan kata sandi yang dibuat saat instalasi.
    ```
    
![Halaman Dashboard pgAdmin 4 dengan tautan cepat Add New Server dan Configure pgAdmin](instalasi-aplikasi/image15.png)
    

## **Instalasi Geoserver**

1. Buka tautan [https://geoserver.org/](https://geoserver.org/) kemudian klik menu download lalu pilih versi geoserver yang akan digunakan, kemudian unduh installer geoserver.
    
![Beranda geoserver.org dengan tombol unduh versi Stable, Maintenance, dan Development](instalasi-aplikasi/image9.png)
    
![Gambar kosong berukuran 1x1 piksel tanpa isi yang bisa diamati](instalasi-aplikasi/image27.png)
    
2. Setelah selesai download anda bisa menjalankan file installer kemudian saat proses instalasi akan bertemu halaman berikut ini. Klik Visit Adoptium OpenJDK website untuk download JRE 17 kemudian install
    
![Halaman unduh JDK 17 Adoptium Temurin dengan tombol unduh Windows 64 bit yang dilingkari](instalasi-aplikasi/image14.png)
    
3. Jika sudah install JRE 17, biasanya terinstall di folder C:/Program Files/Eclipse Adoptium/jdk-17.0.20.101-hotspot. Kembali ke installer geoserver dan arahkan folder JRE 17 ke folder hasil instalasi JRE 17. Lanjutkan proses instalasi sampai selesai gunakan semua opsi default saja
    
![Proses instalasi GeoServer 3.0.1 yang sedang menulis environment variables](instalasi-aplikasi/image18.png)
    
4. Selanjutnya setelah geoserver terinstall, untuk mengaktifkangeoserver yang akan digunakan dilakukan dengan cara membuka aplikasi dengan nama Start Geoserver.
    
![Hasil pencarian Start GeoServer pada menu Start Windows](instalasi-aplikasi/image25.png)
    
5. Tahapan berikutnya setelah mengaktifkan geoserver, maka pengguna dapat membukanya pada browser dengan tautan port berikut ini [http://localhost:8080/geoserver/web/?0](http://localhost:8080/geoserver/web/?0). Berikut ini tampilan geoserver.
    
![Halaman Welcome antarmuka web GeoServer di localhost:8080 dengan daftar layer dan dukungan layanan WMS, WMTS, WFS, dan WCS](instalasi-aplikasi/image11.png)
    
6. Selanjutnya pengguna bisa untuk masuk kehalaman login menggunakan akun admin yang telah dibuat pada proses install geoserver.
    
![Formulir login GeoServer dengan nama pengguna admin, kata sandi, dan tombol Login](instalasi-aplikasi/image1.png)
    
7. Berikut ini merupakan hasil tampilan ketika selesai proses login sebagai admin pada geoserver.
    
![Halaman Welcome GeoServer setelah login sebagai admin dengan menu Data, Layers, dan Stores](instalasi-aplikasi/image3.png)
    
8. Jika pengguna ingin menonaktifkan geoserver, pengguna dapat memilih menu Stop Geosever, maka geosever akan nonaktif.
    
![Jendela Stop GeoServer yang menampilkan pesan bahwa layanan GeoServer 3.0.1 sedang dihentikan](instalasi-aplikasi/image10.png)
    

## **Instalasi QGIS**

1. Buka tautan berikut ini [https://qgis.org/download/](https://qgis.org/download/) kemudian pilih menu download sesuai dengan metode sistem operasi yang digunakan oleh peserta.
    
![Halaman unduh QGIS dengan pilihan Windows Desktop OS serta tombol unduh LTR 3.44 dan versi terbaru 4.2](instalasi-aplikasi/image24.png)
    
2. Selanjutnya setelah selesai mengunduh installer perangkat lunak QGIS, buka installer tersebut maka akan terdapat tampilan berikut ini kemudian klik next.
    
![Layar pembuka Setup Wizard QGIS 3.44.13 Solothurn dengan tombol Next](instalasi-aplikasi/image19.png)
    
3. Tahapan berikutnya klik next hingga muncul proses installasi.
    
![Proses instalasi QGIS 3.44.13 Solothurn dengan indikator Status yang belum terisi](instalasi-aplikasi/image12.png)
    
4. Setelah proses instalasi selesai, buka file qgis desktop.
    
![Layar splash QGIS 3.44 Solothurn long term release saat memuat plugin](instalasi-aplikasi/image16.png)
    
![Jendela QGIS terbuka dengan panel Browser berisi PostGIS dan PostgresSQL serta template New Empty Project](instalasi-aplikasi/image21.png)