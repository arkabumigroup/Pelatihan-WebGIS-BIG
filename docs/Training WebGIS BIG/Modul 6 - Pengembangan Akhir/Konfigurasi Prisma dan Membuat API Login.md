# Konfigurasi Prisma dan Membuat API Login

## **Konfigurasi Prisma**

1. Buka [supabase.com](http://supabase.com/) kemudian klik Dashboard, kemudian klik organization yang sudah dibuat
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image41.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image51.png)
    
2. Setelah di dalam project klik menu Connect yang ada di sebelah atas
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image50.png)
    
3. Dibagian Connect to your project pilih ORM lalu pilih Prisma, di bagian bawah akan ada cara koneksi Prisma ke PostgreSQL supabase
    
    ![image.png](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image.png)
    
4. Buka project folder NextJS di VS Code, jalankan perintah dibawah ini untuk install prisma dan prisma client
    
    ```jsx
    npm install @prisma/client@6
    npm install prisma@6 --save-dev 
    npx prisma init
    ```
    
    ![image.png](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image%201.png)
    
    ![image.png](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image%202.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image19.png)
    
5. Setelah itu prisma akan membuat tiga file baru di project NextJS yaitu schema.prisma, .env dan prisma.config.ts. Hapus prisma.config.ts.
    
    ![image.png](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image%203.png)
    
6. Setelah itu buka file schema.prisma. File ini adalah konfigurasi database kita, pada file ini terdapat bagian datasource db, bagian ini lah yang menentukan database apa yang digunakan dan bagaimana cara koneksinya.
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image53.png)
    
7. Perhatikan bagian url = env(“DATABASE_URL”), tambahkan directUrl juga, lalu hapus output, dan juga ubah provider dari prisma-client jadi prisma-client-js sehingga menjadi seperti ini kemudian Save
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image22.png)
    
8. Buka file .env, file ini otomatis terbuat saat menjalankan perintah npx prisma init. Hapus semua isinya kemudian copy .env.local dari Supabase dan paste ke .env di NextJS kita
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image32.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image20.png)
    
9. Hasil yang kita paste ke .env terdapat [YOUR_PASSWORD] ini adalah placeholder untuk mengisikan password database kita yang dibuat saat membuat database di Supabase. Setelah menggunakan password yang benar Save .env file. Kemudian jalankan command npx prisma db pull
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image2.png)
    
10. Saat menjalankan npx prisma db pull akan error karena database kita masih kosong jadi tidak ada tabel yang bisa ditarik ke schema.prisma kita. Oleh karena itu kita harus membuat tabel di database kita. Cara paling mudah adalah dengan menggunakan DBeaver. Buka DBeaver lalu buka koneksi database Supabase kita.
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image15.png)
    
11. Buat table baru di schema public. Beri nama table “Users” kemudian buatkan kolom user_id, email, dan password semuanya dalam format varchar
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image47.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image46.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image54.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image37.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image48.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image23.png)
    
12. Sekarang database sudah memiliki satu table yaitu table users, lakukan kembali npx prisma db pull, setelah berhasil cek schema.prisma sekarang ada model table users
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image42.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image9.png)
    
13. Jalankan npx prisma generate supaya prisma client membaca schema.prisma yang baru
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image24.png)
    
14. Selanjutnya adalah konfigurasi prisma client supaya client bisa digunakan di nextjs, buat folder bernama lib di root project folder, kemudian buat file bernama db.js
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image52.png)
    
15. Isikan file tersebut dengan code berikut
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image13.png)
    

## **Membuat API Login**

1. Buat folder baru di dalam folder app bernama api/users dua folder akan otomatis terbuat api => users
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image30.png)
    
2. Di dalam users buat folder bernama login, setelah folder login dibuat, buat file baru bernama route.js
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image28.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image38.png)
    
3. Code API login akan dibuat di dalam file route.js ini. Buat kode seperti dibawah ini, kemudian buka postman buat request POST ke url localhost:3000/api/users/login maka hasilnya akan seperti berikut
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image1.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image4.png)
    
4. Saat ini API sudah berjalan terbukti dengan memberikan response seperti apa yang kita inginkan tetapi API belum menggunakan data dari database kita. Buka DBeaver kemudian buat row baru di tabel users. Isikan user_id email dan password
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image27.png)
    
5. Setelah itu kembali ke route.js API login kita, ubah kode menjadi seperti berikut
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image18.png)
    
6. Buka postman lalu test API dengan memasukan email dan password benar, email atau password salah, password tidak diisi berikut hasilnya sesuai dengan logika API kita
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image29.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image12.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image31.png)
    
7. Saat ini di database kita bisa melihat password user dan kita bisa login menggunakan user manapun, agar secure dan memastikan yang bisa mengakses akun user adalah user itu sendiri bukan orang lain kita harus merahasiakan password user sehingga hanya pemiliknya yang tau. Install bcryptjs dengan command npm install bcryptjs
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image44.png)
    
8. Pada terminal jalankan perintah node lalu anda akan masuk ke terminal node masukan kode berikut dan lihat hasilnya
    
    ```jsx
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('Password123', 10);
    console.log(hash);
    ```
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image36.png)
    
9. Bisa dilihat setelah console.log di execute muncul string hasil hashing copy hasilnya kemudian paste ke database. Sekarang password di database isinya masih sama “Password123” hanya saja sekarang sudah di hashing jadi yang tau value aslinya hanya orang yang mengeksekusi hashing nya yang mana itu adalah pemilik akun itu sendiri
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image35.png)
    
10. Selanjutnya ubah kodingan login menjadi seperti dibawah ini, jika sebelumnya kita hanya membandingkan dua value secara langsung dengan ‘where’ sekarang kita membandingkannya dengan fungsi compare yang ada di library bcryptjs
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image39.png)
    
11. Login tetap berhasil walaupun password yang kita masukan adalah value asli sebelum hashing
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image7.png)
    

## **Konfigurasi File-File CICD Setelah Koneksi Database Menggunakan Prisma**

1. Saat melakukan setup di atas ada beberapa file baru di project NextJS yang akan di push ke GitHub dan juga ada beberapa perintah di terminal yang dijalankan seperti npx prisma generate. Semua prosedur ini harus dimasukan ke proses CICD agar web production kita bisa berjalan sama persis seperti web local. Buka Dockerfile, ubah menjadi seperti ini
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image3.png)
    
2. Selanjutnya perbaiki cloudbuild.yaml menjadi seperti ini
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image17.png)
    
3. Selanjutnya ubah docker-compose.yml di VM menggunakan SSH, ubah menjadi seperti dibawah lalu Ctrl + O Enter Ctrl+X
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image16.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image43.png)
    
4. Selanjutnya ubah next.config.mjs menjadi seperti berikut, tambahkan basepath supaya semua web kita harus diawali portal setelah .com
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image11.png)
    
5. Tambahkan di script prisma generate pada file package.json supaya npx prisma generate dikenali
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image26.png)
    
6. Selanjutnya ubah nginx.conf menjadi seperti berikut, dengan begini semua akses ke website kita tanpa basepath ([matiur-geoportal.com](http://matiur-geoportal.com/)) akan di redirect ke /portal (matiur-geportal.com/portal)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image6.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image45.png)
    
7. Setelah itu upload .env ke VM menggunakan upload file SSH Browser
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image49.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image33.png)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image8.png)
    
8. Pindahkan file .env ke dalam folder app dengan perintah berikut maka di dalam folder repo github sudah ada file .env
    
    ```jsx
    mv ~/.env ./app/
    ```
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image14.png)
    
9. Git push semua perubahan ke github dan pantau proses CICD nya
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image34.png)
    
10. Pergi ke GCP untuk melihat proses CICD
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image5.png)
    
11. Setelah selesai pergi ke domain anda dengan /portal dibelakangnya [https://matiur-geoportal.com/portal](https://matiur-geoportal.com/portal)
    
    ![](Konfigurasi%20Prisma%20dan%20Membuat%20API%20Login/image21.png)