# Konfigurasi Access Token dan Next Auth

## **Pembuatan Access Token di Response API Login dan Function Helper Role Akses**

1. Buka project NextJS di VS code, install Next Auth dengan cara jalankan command
    
    ```jsx
    npm install next-auth
    npm install jsonwebtoken 
    ```
    
    jika sudah akan ada next-auth di package.json
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image15.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image27.png)
    
2. Tambahkan variabel berikut ini di file .env
    
    ```jsx
    NEXTAUTH_SECRET=some-long-random-string
    JWT_SECRET=some-long-random-string-different-from-nextauth-secret 
    JWT_EXPIRES_IN=1h 
    ```
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image25.png)
    
3. Buat kolom baru di table users bernama role kemudian isi kolom tersebut, kemudian npx prisma db pull dan npx prisma generate.
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image13.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image6.png)
    
4. Buat function untuk verifikasi credential, buat file verifyCredentials.js di folder lib/auth, kemudian masukan kode berikut ini lalu save
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%201.png)
    
5. Selanjutnya buat function signAccessToken dan verifyAccessToken di dalam file jwt.js yang dibuat di dalam folder lib/auth. Function signAccessToken berfungsi untuk membuat access token, sedangkan function verifyAccessToken berfungsi untuk verifikasi apakah token valid
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%202.png)
    
6. Sekarang ubah API Login supaya responsenya memberikan access token
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%203.png)
    
7. Jalankan project dengan npm run dev, kemudian test API login dengan postman, pastikan sekarang API anda memberikan access_token di responnya
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%204.png)
    
8. Buat function untuk hirarki roles. Buat file role.js di folder lib/auth/ lalu masukan kode berikut
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%205.png)
    
9. Buat function untuk verifikasi bearer token. Buat file verifyBearerToken.js di dalam folder lib/auth/. Berikut kode verifyBearerToken.js
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%206.png)
    
10. Sekarang jika ada pengecekan hak akses role cukup memanggil function requireAuth yang ada di file verifyBearerToken.js. Berikut contoh penggunaannya di API list user yang mana list user hanya bisa diakses oleh role super_admin.
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%207.png)
    
11. Pergi ke postman kemudian lakukan login super admin untuk mendapatkan access_token lalu gunakan token itu di authorization bearer token dan akses localhost:3000/portal/api/users/list
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%208.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image19.png)
    

## **Konfigurasi NextAuth**

1. Tambahkan variable berikut ini di file .env
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%209.png)
    
2. Buat folder src/app/api/auth/[...nextauth], lalu di dalamnya buat file route.js. Masukan kode berikut di dalam file tersebut
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2010.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image31.png)
    
3. Selanjutnya buat file providers.js di folder src/app dan isikan kode berikut, kode ini memberikan kita component session yang mana component ini memberi aplikasi kita informasi jika ingin mengakses semua fungsi Autentikasi ada di dalam API portal/api/auth
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2011.png)
    
4. Lalu setelah session providers dibuat bungkus seluruh aplikasi kita dengan session providers. Dengan membungkus seluruh aplikasi kita dengan session provider maka session akan bisa dikenali di seluruh halaman web kita.
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2012.png)
    
5. Karena session sudah dibuat di web kita, maka di form login tidak perlu lagi mengakses API login, kita cukup menggunakan fungsi singIn dari NextAuth. Pergi ke halaman LoginForm.jsx, kemudian perbarui function handle submit menjadi seperti ini. Jangan lupa import signIn function dari next-auth/react
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2013.png)
    
6. Coba lagi login dari halaman login setelah login anda akan menemukan data session anda di network browser
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2014.png)
    
7. Buat halaman internal. Di halaman internal buat button logout agar kita bisa logout. Saat button logout di klik kita bisa cek di network tab session kita sudah dihapus
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2015.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image28.png)
    
8. Di form login kita melakukan route.push ke halaman /internal. Halaman ini tidak akan bisa diakses jika user belum login, tapi nyatanya saat ini halaman bisa langsung diakses tanpa login. Oleh karena itu kita harus melakukan proteksi halaman private dengan middleware. Buat file proxy.js di dalam folder src/
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2016.png)
    
9. Saat anda sudah logout, akses kembali halaman /internal maka anda akan redirect ke halaman login karena untuk bisa ke halaman ini harus login terlebih dahulu.
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2017.png)
    
10. Pergi ke VM buka folder app kemudian nano .env. Ubah file .env di VM anda menjadi seperti yang ada di local. Sesuaikan isi isi variabelnya menjadi variabel production.
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2018.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image18.png)
    
11. Sesuaikan juga table users yang ada di Supabase karena ada perubahan di schema.prisma yaitu penambahan kolom role di table users
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2019.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image29.png)
    
12. Setelah memastikan komponen production kita siap menerima update lakukan git push
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2020.png)
    
13. Tunggu proses CICD nya selesai lalu kunjungi halaman /internal maka anda akan di redirect ke halaman login
    
    ![image.png](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image%2021.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image16.png)
    
    ![](Konfigurasi%20Access%20Token%20dan%20Next%20Auth/image22.png)