# Instalasi Geoserver di VM

## **Instalasi Geoserver di VM**

1. Koneksi VM lewat SSH lalu perbarui docker-compose.yml
    
    ![image.png](Instalasi%20Geoserver%20di%20VM/image.png)
    
2. Buka docker-compose.yml dengan cara
    
    ```jsx
    cd app
    nano docker-compose.yml
    ```
    
    Perbarui docker-compose.yml menjadi seperti ini, kemudian Save
    
    ![](Instalasi%20Geoserver%20di%20VM/image3.png)
    
3. Selanjutnya perbarui juga nginx.conf menjadi seperti berikut
    
    ```jsx
    nano nginx.conf
    ```
    
    ![](Instalasi%20Geoserver%20di%20VM/image5.png)
    
    ![image.png](Instalasi%20Geoserver%20di%20VM/image%201.png)
    
4. Kemudian jalankan perintah berikut ini dari dalam folder app
    
    ```jsx
    docker compose up -d
    ```
    
    ![](Instalasi%20Geoserver%20di%20VM/image10.png)
    
5. Kemudian jalankan perintah berikut ini untuk melihat logs boot geoserver. Boot sudah selesai jika muncul Server startup in [44757] miliseconds
    
    ```jsx
    docker logs -f geoserver_app
    ```
    
    ![](Instalasi%20Geoserver%20di%20VM/image6.png)
    
6. Buka web anda tambahkan /geoserver untuk basepath nya maka anda akan diarahkan ke halaman geoserver. Login dengan username (admin) dan password (geoserver) bawaan.
    
    ![image.png](Instalasi%20Geoserver%20di%20VM/image%202.png)
    
7. Ganti password bawaan supaya geoserver anda aman. Pergi ke menu Users, Groups, Roles
    
    ![image.png](Instalasi%20Geoserver%20di%20VM/image%203.png)
    
8. Pergi ke Users/Groups kemudian klik Username admin kemudian ganti password dan Save
    
    ![image.png](Instalasi%20Geoserver%20di%20VM/image%204.png)
    
    ![](Instalasi%20Geoserver%20di%20VM/image2.png)