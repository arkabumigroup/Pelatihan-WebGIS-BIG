# Instalasi Aplikasi

**Modul 1 - Dasar-Dasar GIS, Konsep WebGIS, Dasar Pemrograman, dan Github**

## **Instalasi Visual Studio Code, Git dan Node.js**

1. Buka tautan [https://code.visualstudio.com/download](https://code.visualstudio.com/download), kemudian pilih opsi unduh berdasarkan sistem operasi yang digunakan.
    
![](instalasi-aplikasi/image17.png)
    
2. Tahapan berikutnya setelah proses unduh selesai, maka lakukan proses instalasi kemudian tunggu hingga proses instalasi selesai. Berikut ini merupakan tampilan awal dari Virtual Studio Code.
    
![](instalasi-aplikasi/image7.png)
    
3. Selanjutnya unduh git melalui tautan berikut ini [https://git-scm.com/](https://git-scm.com/) untuk mengelola repository project , kemudian lakukan proses instalasi git tersebut.
    
![](instalasi-aplikasi/image4.png)
    
4. Tahapan berikutnya instal Node.js yang akan digunakan sebagai package manager untuk melakuan pemrograman menggunakan Javascript, Next.js, Angular serta bahasa pemrograman javascript lainnya. Node.js dapat diunduh pada link berikut ini [https://nodejs.org/en/download](https://nodejs.org/en/download).
    
![](instalasi-aplikasi/image2.png)
    
5. Setelah proses instalasi Git dan Node.js telah selesai, untuk melihat apakah proses instalasi telah selesai dan terpasang pada perangkat yang digunakan, pengguna dapat melakukan pengecekan pada Windows Powershell kemudian melakukan pengetikan perintah git version untuk melihat versi git yang telah di install serta node --version untuk melihat versi node yang telah di install.

    ```bash
    git --version
    node --version
    npm --version
    ```

![](instalasi-aplikasi/image6.png)

## **Instalasi Postgresql**

1. Buka tautan [https://www.postgresql.org/](https://www.postgresql.org/) kemudian klik menu download lalu pilih sesuai dengan sistem operasi yang digunakan oleh pengguna.
    
![](instalasi-aplikasi/image22.png)
    
2. Tahapan berikutnya lakukan proses instalasi postgresql berdasarkan hasil yang telah diunduh pada perangkat.
    
![](instalasi-aplikasi/image13.png)
    
3. Setelah tahapan instalasi selesai maka akan muncul tampilan untuk stackbuilder kemudian pilih Postgresql 18 (x64).
    
![](instalasi-aplikasi/image26.png)
    
4. Selanjutnya pilih mn instalasi exstensi untuk mendukung penyimpanan data dalam bentuk spasial dengan memilih library postgis.
    
![](instalasi-aplikasi/image23.png)
    
5. Setelah tahapan instalasi selesai,buka pgadmin untuk melihat tampilan dari Postgresql yang telah terpasang pada perangkat pengguna.

    ```text
    pgAdmin: buka dari Start Menu, lalu masukkan kata sandi yang dibuat saat instalasi.
    ```
    
![](instalasi-aplikasi/image15.png)
    

## **Instalasi Geoserver**

1. Buka tautan [https://geoserver.org/](https://geoserver.org/) kemudian klik menu download lalu pilih versi geoserver yang akan digunakan, kemudian unduh installer geoserver.
    
![](instalasi-aplikasi/image9.png)
    
![](instalasi-aplikasi/image27.png)
    
2. Setelah selesai download anda bisa menjalankan file installer kemudian saat proses instalasi akan bertemu halaman berikut ini. Klik Visit Adoptium OpenJDK website untuk download JRE 17 kemudian install
    
![](instalasi-aplikasi/image14.png)
    
3. Jika sudah install JRE 17, biasanya terinstall di folder C:/Program Files/Eclipse Adoptium/jdk-17.0.20.101-hotspot. Kembali ke installer geoserver dan arahkan folder JRE 17 ke folder hasil instalasi JRE 17. Lanjutkan proses instalasi sampai selesai gunakan semua opsi default saja
    
![](instalasi-aplikasi/image18.png)
    
4. Selanjutnya setelah geoserver terinstall, untuk mengaktifkangeoserver yang akan digunakan dilakukan dengan cara membuka aplikasi dengan nama Start Geoserver.
    
![](instalasi-aplikasi/image25.png)
    
5. Tahapan berikutnya setelah mengaktifkan geoserver, maka pengguna dapat membukanya pada browser dengan tautan port berikut ini [http://localhost:8080/geoserver/web/?0](http://localhost:8080/geoserver/web/?0). Berikut ini tampilan geoserver.
    
![](instalasi-aplikasi/image11.png)
    
6. Selanjutnya pengguna bisa untuk masuk kehalaman login menggunakan akun admin yang telah dibuat pada proses install geoserver.
    
![](instalasi-aplikasi/image1.png)
    
7. Berikut ini merupakan hasil tampilan ketika selesai proses login sebagai admin pada geoserver.
    
![](instalasi-aplikasi/image3.png)
    
8. Jika pengguna ingin menonaktifkan geoserver, pengguna dapat memilih menu Stop Geosever, maka geosever akan nonaktif.
    
![](instalasi-aplikasi/image10.png)
    

## **Instalasi QGIS**

1. Buka tautan berikut ini [https://qgis.org/download/](https://qgis.org/download/) kemudian pilih menu download sesuai dengan metode sistem operasi yang digunakan oleh peserta.
    
![](instalasi-aplikasi/image24.png)
    
2. Selanjutnya setelah selesai mengunduh installer perangkat lunak QGIS, buka installer tersebut maka akan terdapat tampilan berikut ini kemudian klik next.
    
![](instalasi-aplikasi/image19.png)
    
3. Tahapan berikutnya klik next hingga muncul proses installasi.
    
![](instalasi-aplikasi/image12.png)
    
4. Setelah proses instalasi selesai, buka file qgis desktop.
    
![](instalasi-aplikasi/image16.png)
    
![](instalasi-aplikasi/image21.png)