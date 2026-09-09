# Deploy NextJS di VM Google Cloud dengan Docker

## **Install Docker di VM**

1. Setelah VM dibuat install terlebih dahulu Docker di VM, koneksi ke VM dengan menggunakan protocol SSH. Klik SSH pada VM instances yang sudah dibuat
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image.png)
    
2. Setelah itu klik Authorize
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%201.png)
    
3. Berikut adalah tampilan awal SSH yang terkoneksi VM
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%202.png)
    
4. Selanjutnya masukan command command ini sesuai urutan
    
    ```jsx
    # 1. Install dependency dasar
    sudo apt update
    sudo apt install -y ca-certificates curl gnupg
    
    # 2. Tambahkan GPG key resmi Docker
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    
    # 3. Tambahkan repository Docker resmi
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # 4. Update index paket, lalu install Docker + Compose plugin
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # 5. Tambahkan user ke grup docker
    sudo usermod -aG docker $USER
    exit
    
    ```
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%203.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%204.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%205.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%206.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%207.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%208.png)
    
5. Setelah exit maka SSH akan tertutup. Buka lagi SSH lewat VM Instances kemudian masukan command ini untuk memastikan Docker sudah terinstall
    
    docker --version
    
    docker compose version
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%209.png)
    

## **Membuat Artifact Registry**

1. Setelah itu buat Artifact Registry dengan cara kembali ke VM Instances di bagian search paling atas ketik Artifacts lalu pilih Artifact Registry
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2010.png)
    
2. Buat Repository baru dengan klik Create Repository
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2011.png)
    
3. Isikan Name, Format, Mode Location type dan Region seperti di bawah ini lalu create
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2012.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image14.png)
    
4. Berikut tampilan Repository katalog-images yang ada di Artifact Registry
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2013.png)
    

## **Konfigurasi Dockerfile di NextJS**

1. Buka project folder NextJS yang ada di lokal
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2014.png)
    
2. Download Dockerfile dan .dockerignore dari drive pelatihan, kemudian pindahkan file tersebut ke root folder project nextjs
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image17.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2015.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2016.png)
    
3. Kemudian ubah file next.config.mjs dengan code berikut
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2017.png)
    
    ```jsx
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      /* config options here */
      output: "standalone"
    };
    
    export default nextConfig;
    ```
    
4. Push perubahan ini ke github dengan command
    
    ```jsx
    git add .
    git commit -m ‘setup dockerfile’
    git push
    ```
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2018.png)
    
5. Sekarang di github sudah memiliki dockerfile
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2019.png)
    

## **Setup Nginx dan docker-compose.yml**

1. Download file pada folder file setup VM, download dua file yaitu nginx.conf dan docker-compose.yml
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2020.png)
    
2. Edit file docker-compose.yml menggunakan VS code. Ubah PROJECT_ID dengan project id yang ada di halaman google cloud anda setelah itu save
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2021.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image25.png)
    
3. Setelah itu pergi ke halaman VM instances, kemudian klik SSH untuk membuka SSH-in-Browser
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2022.png)
    
4. Pada SSH-in-Browser ada button UPLOAD FILE di kanan atas, klik button tersebut
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2023.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image28.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image29.png)
    
5. Jika kita ketik ls lalu enter kita bisa lihat filenya sudah terupload, tetapi kita mau file tersebut berada di dalam folder app oleh karena itu folder harus dibuat dan file dipindahkan ke folder tersebut
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2024.png)
    
6. Jalankan perintah berikut maka akan terlihat isi file dari folder app
    
    ```jsx
    cd ~
    mkdir -p app
    mv docker-compose.yml nginx.conf app/
    cd app
    ls 
    ```
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2025.png)
    

## **Git Clone Repository GitHub ke VM**

1. Pada root folder VM, clone repository github dengan cara git clone [https://github.com/arimatiur/personal-geoportal.git](https://github.com/arimatiur/personal-geoportal.git)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2026.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image37.png)
    
2. Github akan meminta username dan password akun yang punya akses terhadap repository tersebut. Isikan username dengan username github anda. Lalu isikan password dengan github token (github tidak lagi mensupport input password karena multi factor authentication). Buat token terlebih dahulu setelah itu copy dan paste ke SSH-in-Browser
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2027.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image34.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image35.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image36.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2028.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2029.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2030.png)
    

## **Build NextJS via Docker**

1. Masih dari SSH-in-Browser pindah ke dalam folder repository yang sudah di clone dengan perintah cd nama-folder
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2031.png)
    
2. Ketik ls -a di dalam folder tersebut kemudian enter, ls -a akan menunjukan file dan folder apa saja yang ada di folder tempat ls -a dijalankan
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2032.png)
    
3. Jika sudah melihat isi folder dan semuanya sama dengan apa yang ada di github anda bisa menjalankan perintah untuk build NextJS dengan docker build. Jalankan perintah berikut kemudian tunggu hingga prosesnya selesai, berikut tampilan bila sudah selesai
    
    ```jsx
    docker build -t asia-southeast2-docker.pkg.dev/project-2cd93730-d9d7-41ee-820/katalog-images/nextjs-app:latest .
    ```
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2033.png)
    
4. Setelah itu pastikan otentikasi docker ke Artifact Registry aktif, jalankan perintah dibawah ini, lalu ketik Y dan enter
    
    ```jsx
    gcloud auth configure-docker asia-southeast2-docker.pkg.dev
    ```
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image43.png)
    

## **Push Docker Image to Artifact Registry**

1. Buka halaman VM Instances kemudian cek detail Service Account simpan value tersebut
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2034.png)
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image45.png)
    
2. Kembali ke halaman utama gcp di bagian kiri klik IAM & Admin lalu IAM
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2035.png)
    
3. Di halaman IAM & Admin klik Grant Access kemudian masukan service account yang sudah disimpan ke kolom new principals dan pilih role Artifact Registry Administrator dan juga Logs Writer lalu save
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2036.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2037.png)
    
4. Setelah itu kembali ke SSH-in-Browser kemudian jalankan perintah ini dari dalam folder repository github
    
    ```jsx
    docker push asia-southeast2-docker.pkg.dev/project-2cd93730-d9d7-41ee-820/katalog-images/nextjs-app:latest
    ```
    
    ![](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image49.png)
    

## **Docker Compose untuk Melihat Status Container yang berjalan**

1. Masih di SSH-in-Browser masuk ke folder app jalankan perintah
    
    ```jsx
    cd ..
    cd app
    docker compose up -d
    docker compose ps
    ```
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2038.png)
    
2. Cek web anda dengan cara pergi ke VM Instances kemudian klik External IP, Web anda tidak akan terbuka otomatis karena secara default browser akan mengarahkan protokol https bukan http. Jika belum bisa terbuka edit url di browser anda menjadi http saja
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2039.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2040.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2041.png)
    
    ![image.png](Deploy%20NextJS%20di%20VM%20Google%20Cloud%20dengan%20Docker/image%2042.png)
    
    [http://34.101.48.149/peta-latihan-1](http://34.101.48.149/peta-latihan-1)