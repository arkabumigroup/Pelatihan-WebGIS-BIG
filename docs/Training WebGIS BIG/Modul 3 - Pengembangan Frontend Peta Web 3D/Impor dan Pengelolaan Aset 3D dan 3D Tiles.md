# Impor dan Pengelolaan Aset 3D dan 3D Tiles

## **Pembuatan Akun Cesium**

1. Buka tautan halaman cesium melalui [https://ion.cesium.com/signin/](https://ion.cesium.com/signin/) kemudian buat akun terlebih dahlu, jika sudah memiliki akun klik **sign in.**
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image1.png)
    
2. Berikut in merupakan tampilan awal halaman cesium. Tahap berikutnya buka menu **access token** yang akan digunakan untuk mendapatkan token cesium untuk proses pengembangan kedepannya.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image2.png)
    
3. Tahap berikutnya klik C**reate token** lalu input **name** dan pilih **expiration** untuk menentukan berapa lama token ini dapat digunakan, lalu klik **create**.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image3.png)
    
4. Berikut ini merupakan hasil token yang sudah dibuat, kemudian simpan token ini dan gunakan pada pengembangan web cesium ditahap berikutnya.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image.png)
    

## **Menambahkan Model 3D ke Peta CesiumJS**

1. Pada tahap pertama buat file baru didalam folder **components** dengan nama **addModel3D.jsx**.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image5.png)
    
2. Tahap kedua buat fungsi addModel3D yang digunakan untuk menambahkan dan mengatur model 3D pada Cesium Viewer. Kemudian tambahkan parameter berupa **viewer** dan **opsi**.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image6.png)
    
3. Tahap ketiga didalam fungsi tersebut, buat variabel **const Cesium = window.Cesium;** yang digunakan untuk mengambil library Cesium yang telah dimuat pada browser.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image7.png)
    
4. Kemudian pada tahap keempat buat fungsi untuk mengambil data konfigurasi model 3D dari parameter opsi, seperti lokasi file model, koordinat, ketinggian, skala, arah hadap, dan nama model, sekaligus menetapkan nilai bawaan apabila beberapa konfigurasi tidak diberikan.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image8.png)
    
5. Selanjutnya pada tahap kelima, buat fungsi untuk posisi model berdasarkan koordinat geografis dengan merubah menjadi koordinat kartersian menggunakan fungsi **Cesium.Cartesian3.fromDegrees()** untuk mengubah koordinat longitude, latitude, dan ketinggian menjadi posisi yang dapat digunakan untuk menempatkan model pada peta 3D.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image9.png)
    
6. Pada tahap keenam buat fungsi untuk membuat pengaturan orientasi atau arah model 3D agar posisi hadap model dapat ditentukan pada peta.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image10.png)
    
7. Selanjutnya pada tahap ketujuh didalam fungsi sebelumnya yaitu fungsi **Cesium.Transforms.headingPitchRollQuaternion** tambahkan parameter untuk menentukan posisi dan arah hadap model 3D berdasarkan lokasi model serta nilai heading yang telah diatur sebelumnya.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image11.png)
    
8. Pada tahap kedelapan buat fungsi berupa **return viewer.entities.add** untuk menambahkan objek atau model 3D ke dalam Cesium Viewer agar dapat ditampilkan pada peta 3D.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image12.png)
    
9. Tahap terakhir, pada fungsi kedelapan tambahkan parameter untuk melakukan konfigurasi properti model 3D yang digunakan untuk mengatur nama, posisi, arah hadap, tampilan, lokasi file, ukuran, dan ukuran minimum model saat ditampilkan pada Cesium Viewer.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image13.png)
    

## **Menambahkan Model 3D Tiles ke Peta CesiumJS**

1. Tahap pertama buat file baru pada folder **components** dengan nama **ad3DTileset.jsx** untuk menambahkan data 3D Tiles ke dalam Cesium Viewer. Selanjutnya tambahkan parameter **viewer, opsi** dan **selesai.**
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image14.png)
    
2. Selanjutnya buat fungsi **const Cesium = window.Cesium;** yang digunakan untuk mengambil library Cesium yang telah dimuat pada browser.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%201.png)
    
3. Pada tahap ketiga buat fungsi untuk mengambil konfigurasi 3D tiles berupa URL, Asset ID, nama layer, dan pengaturan zoom otomatis dari parameter opsi.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%202.png)
    
4. Selanjutnya pada tahap kelima buat variabel **let proses;** yang digunakan untuk menyimpan proses pemuatan data 3D Tiles sebelum hasilnya ditampilkan.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image17.png)
    
5. Pada tahap keenam buat kondisi menggunakan **if** untuk memeriksa apakah terdapat **assetId**, kemudian memuat data 3D Tiles dari Cesium ion menggunakan Asset ID yang telah diberikan.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%203.png)
    
6. Selanjutnya pada tahap ketujuh buat kondisi **else if** memeriksa apakah terdapat url, kemudian memuat data 3D Tiles dari alamat URL yang telah ditentukan menggunakan **Cesium.Cesium3DTileset.fromUrl()**.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image19.png)
    
7. Kemudian pada tahap kedelapan buat kondisi **if (selesai)** untuk menghentikan proses pemuatan dan mengembalikan nilai null melalui fungsi selesai apabila sumber data 3D Tiles tidak tersedia.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image20.png)
    
8. Tahap kesembilan buat fungsi untuk menjalankan proses berikutnya setelah data 3D Tiles berhasil dimuat, kemudian menerima hasil data dalam variabel tileset.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image21.png)
    
9. Selanjutnya didalam fungsi tersebut tambahkan variabel **tileset.show** untuk mengatur agar data 3D dapat diproses pada peta.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image22.png)
    
10. Selanjutnya buat fungsi untuk menambahkan data 3D Tiles ke dalam Cesium Viewer agar dapat ditampilkan pada peta.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image23.png)
    
11. Tahap berikutnya lanjutkan dengan membuat kondisi **if (otomatisZoom)** untuk mengarahkan kamera secara otomatis ke lokasi 3D Tiles apabila fitur otomatis zoom diaktifkan.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image24.png)
    
12. Kemudian tahap terakhir buat kondisi **if (selesai)** untuk menjalankan fungsi selesai dan mengirimkan objek tileset setelah data 3D Tiles berhasil dimuat.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%204.png)
    

## **Pembuatan Panel 3D Aset**

1. Tahap pertama buat fungsi untuk menampilkan panel layer dengan membuat fungsi **addPanelLayer3D** serta tambahkan parameter **viewer** dan **daftarLayer**.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%205.png)
    
2. Kemudian tahap kedua buat elemen **div** menggunakan JavaScript.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image27.png)
    
3. Selanjutnya pada tahap ketiga buat fungsi untuk mengatur posisi dan tampilan panel dengan menggunakan styling css meliputi **position: absolut** untuk membuat posisi panel bebas. Kemudian **top: 50px** merupakan jarak dari atas, **right: 50px** merupakan jarak dari kanan. Lalu **background: white** merupakan **Warna latar putih**, kemudian **padding** untuk memberikan jarak isi panel. Selanjutnya buat **border-radius** untuk membuat sudut panel melengkung serta **min-width** untuk menentukan lebar minimum panel.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image28.png)
    
4. Tahap keempat buat panel menggunakan properti innerHTML. Pada tahap ini, elemen `<div>` digunakan untuk menampilkan teks "Layer 3D", kemudian diberikan styling agar judul terlihat lebih tegas dan memiliki jarak dengan daftar layer yang akan ditampilkan di bawahnya.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%206.png)
    
5. Pada tahap kelima buat fungsi untuk melakukan perulangan pada setiap data layer menggunakan Object.entries() dan forEach(), kemudian ambil nama serta objek dari masing-masing layer untuk digunakan dalam proses pembuatan kontrol layer secara otomatis.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image30.png)
    
6. Tahap ketujuh buat fungsi **if** untuk periksa terlebih dahulu apakah objek layer tersedia, kemudian jika layer tersedia buat elemen label sebagai wadah untuk menampilkan kontrol checkbox dan nama dari setiap layer.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image31.png)
    
7. Selanjutnya pada tahap kedelapan buat fungsi untuk mengatur tampilan elemen baris menggunakan css agar checkbox dan nama layer tersusun secara horizontal, sejajar, memiliki jarak antar elemen, serta memberikan tampilan yang lebih interaktif ketika pengguna mengarahkan kursor ke kontrol layer.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%207.png)
    
8. Pada tahap kesembilan buat fungsi menggunakan properti **innerHTML** untuk menambahkan isi HTML ke dalam elemen baris. Isi tersebut berupa checkbox yang digunakan untuk mengontrol visibilitas layer dan nama layer.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%208.png)
    
9. Selanjutnya tambahkan tambahkan fungsi pada checkbox untuk mengatur tampilan layer. Script **querySelector('input')** digunakan untuk memilih elemen checkbox, sedangkan **addEventListener('change')** digunakan untuk mendeteksi perubahan saat pengguna mencentang atau menghilangkan centang. Nilai **e.target.checked** kemudian digunakan untuk mengatur properti **objek.show,** sehingga layer akan ditampilkan ketika checkbox aktif dan disembunyikan ketika checkbox tidak aktif.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image34.png)
    
10. Tahap berikutnya buat fungsi untuk menambahkan kontrol layer kedalam panel dengan menggunakan **appendChild()** untuk menambahkan elemen baris yang berisi checkbox dan nama layer.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%209.png)
    
11. Pada tahap terakhir, tambahkan elemen panel ke dalam container Cesium Viewer menggunakan **appendChild().** Dengan cara ini, panel kontrol layer akan tampil di atas peta. Selanjutnya, return panel digunakan untuk mengembalikan elemen panel agar dapat digunakan kembali jika diperlukan.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image36.png)
    
12. Berikut ini keseluruhan script untuk panelLayer3D.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%2010.png)
    

## **Pemanggilan Data 3D Dalam Peta**

1. Tahap pertama buka file **CesiumViewer.jsx** lalu tambahkan Cesium Ion Access Token dibawah **const CESIUM_STYLE_URL** dengan menggunakan token yang sebelumnya telah dibuat pada poin A.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image38.png)
    
2. Tahap kedua pada fungsi **function createViewerCesium(container) {** tambahkan Cesium Ion Access Token untuk menghubungkan aplikasi dengan layanan Cesium Ion.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image39.png)
    
3. Tahap beirkutnya dibawah fungsi **function createViewerCesium(container)** buat fungsi baru yaitu **function addContent3D(viewer)** yang digunakan sebagai wadah untuk mengatur seluruh proses penambahan data dan objek 3D ke dalam Cesium Viewer.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image40.png)
    
4. Selanjutnya tambahkan data 3D Tileset ke dalam Cesium Viewer menggunakan fungsi **add3DTileset()**, kemudian tentukan **assetId** sebagai sumber data 3D, berikan nama layer, dan atur opsi **otomatisZoom** agar kamera tidak berpindah secara otomatis saat layer dimuat.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image41.png)
    
5. Pada tahap berikutnya setelah data 3D Tileset berhasil dimuat, gunakan fungsi callback untuk menerima objek **gedung3D** sehingga objek tersebut dapat digunakan pada proses selanjutnya, seperti menambahkan model 3D atau membuat kontrol layer.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image42.png)
    
6. Selanjutnya pada **function (gedung3D)** buat fungsi untuk menambahkan model 3D berformat GLB menggunakan fungsi **addModel3D()** dengan menentukan sumber file, lokasi, ketinggian, ukuran, arah, dan nama model sebelum digunakan pada tahap berikutnya.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image43.png)
    
7. Tahap terakhir dalam **function (gedung3D)** buat fungsi **addPanelLayer3D()**, kemudian masukkan objek Gedung 3D dan model GLB ke dalam daftar layer melalui checkbox pada panel.
    
    ![](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image44.png)
    
8. Selanjutnya pada tahap terakhir pada fungsi **useEffect(() => {if (status !== 'siap' || viewerRef.current) return;** panggil fungsi **addContent3D()** dengan mengirimkan objek **viewerRef.current** untuk menambahkan berbagai konten dan objek 3D ke dalam peta.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%2011.png)
    
9. Hasil tampilan objek 3D dalam peta dengan format tileset.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%2012.png)
    
10. Hasil tampilan objek 3D dengan menggunakan model data glb.
    
    ![image.png](Impor%20dan%20Pengelolaan%20Aset%203D%20dan%203D%20Tiles/image%2013.png)