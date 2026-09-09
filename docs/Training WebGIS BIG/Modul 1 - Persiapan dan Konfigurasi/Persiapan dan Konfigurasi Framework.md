# Persiapan dan Konfigurasi Framework

**Modul 1 - Dasar-Dasar GIS, Konsep WebGIS, Dasar Pemrograman, dan Github**

## **Persiapan Folder Project**

1. Buat **folder baru** yang akan digunakan sebagai tempat penyimpanan project, kemudian buka **Virtual Studio Code**, lalu **pilih folder** tersebut dengan cara **klik file,** kemudian **klik open folder**, lalu **pilih folder** yang telah dibuat.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image9.png)
    
2. Selanjutnya setelah memilih folder yang akan menjadi tersebut, berikut ini merupakan halaman awal folder dan project yang akan dirancang dan dibangun.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image18.png)
    

## **Konfigurasi Framework Next.JS**

1. Buka tautan [**https://nextjs.org/**](https://nextjs.org/) untuk melihat dokumentasi framework yang akan digunakan oleh penguna.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image16.png)
    
2. Tahapan berikutnya untuk melakukan konfigurasi framework dalam perancangan dan pembangunan WebGIS, maka **buka virtual studio code** kemudian **klik terminal** untuk menjalankan perintah konfigurasi framework.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image19.png)
    
3. Selanjutnya pada bagian terminal lakukan konfigurasi Next.js dengan menginput perintah berikut ini **npx create-next-app@latest** kemudian **klik enter**. Selanjutnya input nama project yang akan dirancang oleh penggguna.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image22.png)
    
4. Tahapan berikutnya lakukan konfigurasi next.js pada terminal dengan konfigurasi sebagai berikut.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image5.png)
    
5. Selanjutnya tunggu hingga proses konfigurasi dan instalasi framework Next.js selesai, berikut merupakan hasil konfigurasi yang telah selesai.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image1.png)
    
6. Hasil dari konfigurasi framework Next.js pada Virtual Studio Code akan menampilkan folder-folder yang menjadi tempat perancangan dan pembangunan WebGIS.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image20.png)
    
7. Tahapan berikutnya buka folder yang telah dibuat sebelumnya dengan nama **folder webgis-latihan** dengan cara **klik file**, kemudian **klik open folder**, lalu pilih folder tersebut. Selanjutnya untuk menjalakan web yang telah dikonfigurasi dengan next js dilakukan dengan cara pada **terminal** ketik **npm run dev**.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image17.png)
    
8. Untuk melihat dan menjalankan web tersebut, buka **browser** yang terdapat dalam perangkat pengguna kemudian masukan url lokal yang terdapat pada **terminal** yaitu [**http://localhost:3000/**](http://localhost:3000/) maka hasilnya dapat dilihat sebagai berikut.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image14.png)
    

## **Konfigurasi Project dengan Repository Github**

1. Buka **web github** melalui tautan berikut ini [**https://github.com/**](https://github.com/) apabila belum memiliki akun maka dapat melakukan registrasi untuk melakukan pembuatan akun github terlebih dahulu.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image8.png)
    
2. Selanjutnya setelah login pada github, untuk membuat repository baru sebagai tempat penyimpanan project pada github dengan melakukan **klik tombol new**.
3. Selanjutnya pada halaman new, buat halaman baru dengan menginput nama project yang akan dibuat pada github kemudian klik **create repository**.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image10.png)
    
4. Setelah selesai pembuatan repository barunya selanjutnya untuk melakukan unggah project yang telah dirancang sebelumnya mengikuti perintah yang ada pada github.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image7.png)
    
5. Selanjutnya untuk mengunggah project yang kita miliki berdasarkan perintah yang sudah ada pada github dilakukan dengan cara **klik kanan** pada folder project, klik **show more option** lalu klik **gitbash**.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image4.png)
    
6. Pada tampilan gitbash, input perintah-perintah yang telah ada sebelumnya pada poin nomor 4 dengan menyalinnya dari github.
7. Hasil dari project yang telah diunggah pada github maka hasilnya akan menjadi seperti berikut.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image13.png)
    

## **Cloning Project Github**

1. Untuk melakukan cloning / menyalin project web yang ada pada github kedalam perangkat peserta, dapat dilakukan dengan mengklik **tombol code** kemudian salin url github project tersebut.
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image2.png)
    
2. Kemudian buka folder yang akan dijadikan tempat penyimpanan, klik kanan, pilih **gitbash**, kemudian pada tampilan gitbash ketik **git clone** lalu **klik kanan** p**aste url project**, lalu **klik enter**.
3. Ketika pertama kali membuka project baru hasil salinan dari github, peserta dapat menjalankan perintah **npm install** pada menu terminal untuk menginstall library yang ada pada project tersebut. Setelah itu peserta dapat menjalankan project tersebut dengan menginput perintah **npm run dev.**
    
    ![](Persiapan%20dan%20Konfigurasi%20Framework/image12.png)
    

## **Mengirim Perubahan dan Mengambil Hasil Perubahan Web dengan Git**

1. Pertama jika project dikerjakan oleh beberapa orang, peserta dapat mengambil perubahan tersebut dengan menginput perintah git pull pada menu terminal serta tunggu hingga selesai.
2. Kedua jika peserta ingin mengirim perubahan hasil web yang telah dibuat peserta dapat menginput perintah pada github pertama **git add .** kemudian klik enter, lanjutkan perintah kedua yaitu input git commit -m “ isi komentar ” dan tambahkan komentar sebagai informasi perubahan yang telah dibuat lalu klik enter, kemudian tahap terakhir input perintah git push maka hasil perubahan yang telah dibuat oleh peserta akan masuk kedalam project github.

## **Penjelasan Perintah Dasar Next.js, NPM, Git, dan GitHub**

| npx create-next-app@latest | Membuat kerangka awal project menggunakan Next.js. |
| --- | --- |
| npm install | Menginstall library atau package yang dibutuhkan project. |
| npm run dev | Menjalankan project untuk proses pengembangan. |
| npm run build | Build project |
| npm run start | Menjalankan hasil build project. |
| git init | Menginisialisasi Git pada project. |
| git add .
git commit -m "isi komentar" | Menyimpan perubahan project ke dalam Git. |
| git remote add origin https://github.com/username/project.git | Menghubungkan project lokal dengan repository GitHub. |
| git push | Mengirim project/commit dari komputer lokal ke GitHub. |
| git pull | Mengambil hasil perubahan pengembangan web yang telah dibuat. |