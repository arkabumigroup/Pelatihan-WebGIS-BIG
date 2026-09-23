# Instalasi Geoserver di VM

## **Instalasi Geoserver di VM**

::: warning Halaman ini memerlukan VM dan repositori dari Hari 3
Halaman ini mengandaikan dua hal yang sudah siap:

1. **VM dari Deployment Project**, pada [Tahap 6 halaman Google Cloud Platform](/hari-4/praktik-11/google-cloud-platform).
2. **Repositori peserta sudah di-clone ke VM**, pada folder `/opt/webgis/app`. Folder itu memuat `docker-compose.yml` dan `nginx.conf` yang diperbarui di halaman ini.

Bila VM belum siap, GeoServer masih dapat dicoba di laptop dengan menjalankan container GeoServer saja. Namun langkah pada halaman ini menyebut `/opt/webgis/app`, sehingga perintahnya perlu disesuaikan.
:::

1. Koneksi VM lewat SSH lalu perbarui docker-compose.yml
    
![Terminal SSH-in-browser VM Ubuntu 22.04 di Google Cloud dengan rincian sistem dan prompt maturiar0@latihan-web-gis](instalasi-geoserver-vm/image.png)
    
2. Buka docker-compose.yml dengan cara
    
    ```bash
    cd /opt/webgis/app
    nano docker-compose.yml
    ```
    
    Perbarui docker-compose.yml menjadi seperti ini, kemudian Save
    
![Isi docker-compose.yml di editor nano memuat layanan nextjs, geoserver, nginx, dan volume geoserver-data](instalasi-geoserver-vm/image3.png)
    
3. Selanjutnya perbarui juga nginx.conf menjadi seperti berikut
    
    ```bash
    nano nginx.conf
    ```

![Isi nginx.conf di editor nano dengan blok server port 80 dan 443 serta reverse proxy ke geoserver:8080](instalasi-geoserver-vm/image5.png)

![Potongan berkas nginx.conf pada editor nano yang memuat proxy_set_header X-Forwarded-For dan X-Forwarded-Proto](instalasi-geoserver-vm/image%201.png)
    
4. Kemudian jalankan perintah berikut ini dari dalam folder app
    
    ```bash
    docker compose up -d
    ```

![Keluaran docker compose up -d yang menandai container nextjs_portal, nginx_proxy, dan geoserver_app berstatus Running serta Started](instalasi-geoserver-vm/image10.png)

5. Kemudian jalankan perintah berikut ini untuk melihat logs boot geoserver. Boot sudah selesai jika muncul Server startup in [44757] miliseconds
    
    ```bash
    docker logs -f geoserver_app
    ```

![Log boot GeoServer berakhir pada baris Server startup in 44757 milliseconds](instalasi-geoserver-vm/image6.png)

6. Buka web anda tambahkan /geoserver untuk basepath nya maka anda akan diarahkan ke halaman geoserver. Login dengan username (admin) dan password (geoserver) bawaan.
    
![Beranda GeoServer di matur-geoportal.com/geoserver/web dengan status Logged in as admin serta kotak 24 Layers, 4 Layer groups, 10 Stores, dan 8 Workspaces](instalasi-geoserver-vm/image%202.png)
    
7. Ganti password bawaan supaya geoserver anda aman. Pergi ke menu Users, Groups, Roles
    
![Menu Security pada sidebar GeoServer dengan tautan Settings, Authentication, Passwords, dan Users, Groups, Roles](instalasi-geoserver-vm/image%203.png)
    
8. Pergi ke Users/Groups kemudian klik Username admin kemudian ganti password dan Save
    
![Halaman Users, Groups, and Roles dengan tab Users/Groups aktif dan tabel Users list berisi satu baris admin yang Enabled](instalasi-geoserver-vm/image%204.png)
    
![Halaman Edit user GeoServer untuk akun admin dengan kolom password baru, confirm password, dan tombol Save ditandai hijau](instalasi-geoserver-vm/image2.png)