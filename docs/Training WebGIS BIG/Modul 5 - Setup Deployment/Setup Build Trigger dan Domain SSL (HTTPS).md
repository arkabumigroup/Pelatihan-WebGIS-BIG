# Setup Build Trigger dan Domain SSL (HTTPS)

## **Setup Build Trigger dan Domain SSL (HTTPS)**

1. Buka Console GCP kemudian di bagian search ketik Cloud Build lalu klik Cloud Build
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image.png)
    
2. Pilih Create Trigger lalu form untuk Create Trigger akan muncul
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%201.png)
    
3. Isikan form seperti dibawah ini, pada bagian Source saat memilih repository klik Connect new repository kemudian di Panel Connect repository pilih GitHub lalu continue, setelah itu halaman untuk authorize github dan google cloud build terbuka, klik Authoriz
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%202.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image49.png)
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%203.png)
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%204.png)
    
4. Google Cloud Build harus terinstall di GitHub anda oleh karena itu akan muncul warning untuk instalasi, install di GitHub anda akan memerlukan verifikasi email
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%205.png)
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%206.png)
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%207.png)
    
5. Setelah itu akan muncul list repository kita, pilih repository yang akan digunakan centang checkbox lalu OK, maka Source akan menunjukan repository dan branch yang digunakan
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%208.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image11.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image54.png)
    
6. Untuk Configuration type ubah Autodetected menjadi Cloud Build configuration file (yaml/json). Tetapi file cloudbuild.yaml belum ada di repository kita oleh karena itu harus dibuat
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%209.png)
    
7. File cloudbuild.yaml akan melakukan docker build, push image ke artifact registry dan SSH ke VM untuk pull image terbaru serta restart container nextjs. Download file cloudbuild.yaml dari folder pelatihan. Kemudian pindahkan file ke root folder project nextjs. Edit PROJECT_ID menjadi PROJECT_ID masing masing. Kemudian push ke github perubahan yang sudah kita lakukan dengan cara
    
    ```jsx
    git add .
    git commit -m ‘penambahan cloudbuild.yaml’
    git push
    ```
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2010.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image55.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image53.png)
    
8. Sekarang cloudbuild.yaml sudah ada di repository github, selanjutnya dibagian Advance pilih service account yang kita gunakan saat push image registry manual, jika lupa ada di bagian IAM & Admin, setelah memastikan service account yang ingin digunakan benar klik Create
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2011.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image43.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image34.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image52.png)
    
9. Setelah trigger dibuat maka setiap push yang dilakukan ke branch main di repository GitHub akan otomatis di update ke website production kita. Inilah yang dimaksud dengan proses CI/CD (Continuous Integration and Continuous Delivery or Deployment). Anda juga bisa mentrigger manual proses CI/CD dengan klik Run di trigger yang sudah dibuat.
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2012.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image50.png)
    
10. Untuk memantau proses CI/CD bisa ke halaman history kemudian klik Build yang sedang berjalan
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2013.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image39.png)
    
11. Pada saat ini kemungkinan trigger akan gagal karena Service Account butuh tambahan 4 role lagi saat melakukan CICD yaitu Compute OS Login, Compute Instance Admin v1, IAP-secured Tunnel User, Service Account User klik tanda pensil di service account
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2014.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image21.png)
    
12. Principal baru akan muncul di List, jika belum ada kemungkinan terkena filter Include google provided role grant
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image56.png)
    
13. Kembali ke halaman trigger kemudian klik Run, cek history untuk melihat prosesnya, jika sudah selesai dan berhasil akan seperti berikut
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2015.png)
    

## **Membuat Domain**

1. Buka halaman utama GCP kemudian cari Cloud Domains setelah itu anda akan diminta untuk mengaktifkan Cloud Domains di project GCP anda, enable Cloud Domains tersebut, lalu anda akan redirect ke halaman Cloud Domains
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image19.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image58.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image17.png)
    
2. Search juga Cloud DNS di bagian search bar kemudian klik Cloud DNS, lalu enakble Cloud DNS API di project anda
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image27.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image31.png)
    
3. Kemudian kembali ke halaman Cloud Domain lalu klik Register domain, Accept Term of Service, ketikan domain yang anda inginkan, pilih yang tersedia lalu continue
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image1.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image36.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image57.png)
    
4. Setelah itu pilih Use Cloud DNS dan Cloud Zone biarkan default New Zone lalu continue
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image24.png)
    
5. Selanjutnya Privacy Protection biarkan default lalu continue
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image38.png)
    
6. Isikan Contact Details dengan data diri masing masing, kemudian klik Register, tunggu prosesnya sampai selesai
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image51.png)
    
7. Setelah prosesnya selesai, status domain anda akan aktif tapi harus ada verifikasi email terlebih dahulu. Verifikasi dari email yang anda masukan di contact details, kemudian refresh halaman Cloud Domain maka status domain akan aktif.
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image25.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image18.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image29.png)
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2016.png)
    

## **Mengarahkan Domain ke External IP VM**

1. Catat External IP VM anda, jika lupa bisa buka halaman utama GCP kemudian ke VM Instances
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image5.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image28.png)
    
2. Kemudian dari halaman Cloud Domains expand tanda panah kebawah untuk melihat Cloud DNS Zone kemudian klik domain anda
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image16.png)
    
3. Anda akan diarahkan ke halaman Cloud DNS, klik Add Standard lalu anda akan diarahkan ke bagian Create record set biarkan semua default cukup isikan IPv4 Address saja dengan External IP VM, lalu Create
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image40.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image48.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image41.png)
    
4. Tambahkan Standard lagi tapi kali ini Resource record type menjadi CNAME dan DNS name isikan www. Untuk Canonical name gunakan nama domain diakhiri dengan titik (.) seperti matiur-geoportal.com. Dengan begini www.matiur-geoportal.com juga akan mengarah ke website kita.
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image4.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image23.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image20.png)
    

## **Instalasi Sertifikat SSL untuk Membuka Protokol HTTPS**

1. Pergi ke halaman VM Instances, masuk ke dalam VM anda menggunakan SSH-in-Browser
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2017.png)
    
2. Jalankan perintah ini di VM
    
    ```jsx
    sudo apt update && sudo apt install certbot python3-certbot-nginx -y
    ```
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image13.png)
    
3. Akan muncul halaman verifikasi instalasi Tekan Enter saja berikut jika instalasi certbot selesai dan sukses
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2018.png)
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image3.png)
    
4. Setelah itu jalankan perintah dibawah, ganti domain dengan domain anda
    
    ```jsx
    sudo certbot --nginx -d domain.com -d www.domain.com
    ```
    
    Contoh:
    
    ```jsx
    sudo certbot --nginx -d matiur-geoportal.com -d www.matiur-geoportal.com
    ```
    
    ![](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image47.png)
    
5. Buka kembali website anda dengan https maka website akan terbuka
    
    ![image.png](Setup%20Build%20Trigger%20dan%20Domain%20SSL%20(HTTPS)/image%2019.png)