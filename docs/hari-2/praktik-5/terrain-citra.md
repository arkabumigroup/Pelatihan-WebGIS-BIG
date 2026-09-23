# Terrain dan Citra: Integrasi Data Elevasi serta Drapping Citra Satelit

## **Pembuatan Fungsi Terrain**

1. Tahap pertama pada folder **components** buat file baru dengan nama **addTerrain.jsx** kemudian buat fungsi **addTerrain** serta tambahkan parameter **viewer** dan parameter **opsi**.
    
![Explorer VS Code menampilkan folder components berisi addTerrain.jsx yang sedang dibuka di editor](terrain-citra/image1.png)
    
2. Selanjutnya buat fungsi **const Cesium = window.Cesium;** yang digunakan untuk mengambil library Cesium yang telah dimuat pada browser.
    
![Baris const Cesium = window.Cesium di dalam fungsi addTerrain](terrain-citra/image2.png)
    
3. Pada tahap ketiga buat fungsi untuk untuk mengambil konfigurasi dari parameter opsi yaitu menentukan apakah terrain aktif saat awal aplikasi dijalankan dengan variabel **aktifTerrainAwal**, selanjutnya fungsi callback **onStatusBerubah** untuk mengetahui perubahan status terrain, serta **onLoadingBerubah** untuk mengetahui proses loading terrain.
    
![Editor VS Code menampilkan addTerrain.jsx dengan blok const yang membaca opsi, aktifTerrainAwal, onStatusBerubah, dan onLoadingBerubah](terrain-citra/image.png)
    
4. Pada tahap keempat buat fungsi untuk membuat **permukaanDatar** sebagai pengganti terrain 3D ketika terrain dinonaktifkan, membuat variabel **terrainAktif** untuk menyimpan status apakah terrain sedang aktif atau tidak, serta membuat **daftarListenerStatus** sebagai tempat menyimpan fungsi listener yang akan menerima informasi ketika status terrain berubah.
    
![Deklarasi permukaanDatar, terrainAktif, dan daftarListenerStatus di dalam addTerrain](terrain-citra/image4.png)
    
5. Tahap kelima buat fungsi **beritahuStatus()** sebagai wadah untuk mengelola dan menyampaikan informasi ketika terjadi perubahan status pada terrain, seperti saat terrain diaktifkan atau dinonaktifkan.
    
![Kerangka kosong beritahuStatus yang ditandai kotak kuning, setelah permukaanDatar, terrainAktif, dan daftarListenerStatus](terrain-citra/image%201.png)
    
6. Tahap keenam didalam function **beritahuStatus**, buat fungsi dengan kondisi **if** untuk memeriksa apakah fungsi **onStatusBerubah** tersedia, kemudian mengirimkan informasi status terrain terbaru melalui fungsi tersebut.
    
![Fungsi beritahuStatus memanggil onStatusBerubah bila tersedia](terrain-citra/image6.png)
    
7. Selanjutnya tambahkan fungsi mengirimkan informasi status terrain terbaru kepada semua listener yang telah terdaftar di dalam **daftarListenerStatus**.
    
![Isi beritahuStatus yang memanggil onStatusBerubah lalu mengiterasi daftarListenerStatus](terrain-citra/image%202.png)
    
8. Tahap ketujuh buat fungsi **daftarkanListenerStatus()** yang digunakan untuk menerima dan mendaftarkan listener agar dapat memperoleh informasi ketika status terrain berubah serta tambahkan parameter **callback** atau **cb.**
    
![Fungsi daftarkanListenerStatus dengan parameter cb masih kosong](terrain-citra/image8.png)
    
9. Kemudian didalam fungsi tersebut buat kondisi berupa **if** dahulu memastikan bahwa **cb** atau **callback** merupakan sebuah function, kemudian menyimpannya ke dalam **daftarListenerStatus**, lalu langsung mengirimkan status terrain saat ini kepada callback tersebut.
    
![Isi daftarkanListenerStatus memeriksa tipe cb, menyimpannya, lalu memanggilnya dengan terrainAktif](terrain-citra/image9.png)
    
10. Selanjutnya pada tahap kedelapan, buat fungsi **aktifkanTerrain()** yang bertugas untuk memuat dan mengaktifkan terrain 3D pada Cesium Viewer.
    
![Kerangka fungsi aktifkanTerrain masih kosong pada baris 25 sampai 31](terrain-citra/image10.png)
    
11. Tahap berikutnya didalam fungsi tersebut buat kondisi **if** untuk memeriksa apakah fungsi onLoadingBerubah tersedia, kemudian mengirimkan status **true** untuk menandakan bahwa proses pemuatan terrain sedang dimulai.
    
![Baris if (onLoadingBerubah) onLoadingBerubah(true) di awal aktifkanTerrain](terrain-citra/image11.png)
    
12. Selanjutnya buat fungsi **Cesium.createWorldTerrainAsync** melakukan proses pemuatan data World Terrain secara asynchronous agar terrain 3D dapat digunakan pada peta.
    
![Pemanggilan Cesium.createWorldTerrainAsync dengan objek kosong](terrain-citra/image12.png)
    
13. Kemudian pada fungsi **Cesium.createWorldTerrainAsync** tambahkan fungsi buat fungsi **requestVertexNormals: true,** yang digunakan untuk memuat data World Terrain, serta meminta data tambahan berupa vertex normals agar informasi bentuk permukaan terrain dapat digunakan.
    
![Pemanggilan Cesium.createWorldTerrainAsync dengan requestVertexNormals true ditandai kotak kuning di dalam aktifkanTerrain](terrain-citra/image%203.png)
    
14. Tahap selanjutnya buat fungsi **.then()** untuk menjalankan proses selanjutnya setelah data World Terrain berhasil dimuat, kemudian hasil terrain disimpan dalam variabel worldTerrain.
    
![Callback .then(function (worldTerrain)) masih kosong setelah pemanggilan createWorldTerrainAsync](terrain-citra/image14.png)
    
15. Selanjutnya dalam fungsi tersebut tambahkan data **worldTerrain** kemudian tambahkan pada **viewer** sehingga permukaan peta.
    
![Baris viewer.terrainProvider = worldTerrain di dalam callback .then](terrain-citra/image15.png)
    
16. Tahap berikutnya tambahkan fungsi **terrainAktif= true** untuk menandakan bahwa terrain telah berhasil diaktifkan serta fungsi beritahuStatus() untuk memberitahu callback dan listener bahwa terrain sekarang dalam kondisi aktif.
    
![Callback .then mengeset terrainAktif menjadi true dan memanggil beritahuStatus(true)](terrain-citra/image16.png)
    
17. Tahap berikutnya buat fungsi **.finally()** untuk menjalankan proses akhir setelah proses pemuatan terrain selesai serta tambahkan kondisi **if** untuk memeriksa apakah fungsi **onLoadingBerubah** tersedia, kemudian mengirimkan status false untuk menandakan bahwa proses loading terrain telah selesai.
    
![Blok .finally menonaktifkan status loading lewat onLoadingBerubah(false)](terrain-citra/image17.png)
    
18. Kemudian pada tahap kesembilan buat **function** **matikanTerrain()** yang digunakan untuk menonaktifkan terrain 3D dan mengembalikan tampilan peta ke permukaan datar.
    
![Fungsi matikanTerrain yang mengembalikan terrainProvider ke permukaanDatar dan mengirim beritahuStatus false](terrain-citra/image%204.png)
    
19. Selanjutnya dalam fungsi tersebut tambahkan v**iewer.terrainProvider = permukaanDatar;** yang digunakan untuk mengganti tampilan dengan terrain menjadi tampilan peta dengan permukaan datar. Kemudian tambahkan status **terrainAktif** **= false** untuk menandakan bahwa terrain telah dinonaktifkan serta tambahkan fungsi **beritahuStatus()** untuk memberitahu callback dan listener bahwa terrain sekarang dalam kondisi tidak aktif.
    
![Fungsi matikanTerrain mengembalikan viewer.terrainProvider ke permukaanDatar dan mengirim status false](terrain-citra/image19.png)
    
20. Selanjutnya pada tahap kesepuluh **function toggleTerrain()** untuk mengubah status terrain secara otomatis, yaitu mematikan terrain jika sedang aktif dan mengaktifkannya kembali jika sedang tidak aktif.
    
![Fungsi toggleTerrain memilih matikanTerrain atau aktifkanTerrain berdasarkan terrainAktif](terrain-citra/image20.png)
    
21. Pada tahap kesebelas buat **functionaturOpacityCitra()** yang digunakan untuk mengatur tingkat transparansi seluruh layer citra pada Cesium Viewer.
    
![Kerangka fungsi aturOpacityCitra dengan parameter nilai](terrain-citra/image21.png)
    
22. Selanjutnya dalam fungsi tersebut buat variabel untuk mengambil jumlah seluruh imagery layer yang terdapat pada Cesium Viewer.
    
![Baris const jumlahLayer = viewer.imageryLayers.length di dalam aturOpacityCitra](terrain-citra/image22.png)
    
23. Selanjutnya tambahkan fungsi untuk mengakses setiap layer citra dengan melakukan perulangan untuk mengakses setiap layer citra yang terdapat di dalam viewer.imageryLayers.
    
![Perulangan for (let i = 0; i < jumlahLayer; i++) masih kosong](terrain-citra/image23.png)
    
24. Kemudian pada fungsi perulangan tersebut tambahkan fungsi untuk nilai transparansi (alpha) setiap layer citra diubah sesuai dengan nilai yang diberikan.
    
![Baris viewer.imageryLayers.get(i).alpha = nilai di dalam perulangan](terrain-citra/image24.png)
    
25. Selanjutnya pada tahap keduabelas buat fungsi **if aktifTerrainAwal;** dengan kondisi jika bernilai true maka terrain langsung diaktifkan, sedangkan jika bernilai false maka viewer menggunakan permukaan datar sebagai kondisi awal.
    
![Percabangan if (aktifTerrainAwal) memanggil aktifkanTerrain, sedangkan else memakai permukaanDatar](terrain-citra/image25.png)
    
26. Pada tahap terakhir buat fungsi **return** yang digunakan untuk mengembalikan fungsi-fungsi yang telah dibuat di dalam **addTerrain()** agar dapat digunakan dari luar fungsi meliputi **aktifkanTerrain,** **toggleTerrain, aturOpacityCitra, daftarkanListenerStatus** serta **cekStatusAktif()** untuk memeriksa dan mengembalikan status terrain saat ini melalui nilai **terrainAktif**, yaitu true jika aktif dan false jika tidak aktif.
    
![Objek return addTerrain memuat aktifkanTerrain sampai cekStatusAktif](terrain-citra/image26.png)
    
27. Script keseluruhan untuk addTerrain.jsx dapat dilihat pada gambar berikut ini.
    
![Script lengkap addTerrain.jsx baris 1 sampai 32 mulai dari destructuring opsi hingga pemanggilan createWorldTerrainAsync](terrain-citra/image%205.png)
    

## **Penambahan Panel Terrain pada Panel 3D Aset**

1. Pada tahap pertama dalam **export default function addPanelLayer3D** tambahkan parameter **kontrolTerrain** yang akan digunakan sebagai parameter untuk menambahkan tampilan pengaturan terrain dalam panel.
    
![Penambahan parameter kontrolTerrain pada signature addPanelLayer3D di PanelLayer3D.jsx](terrain-citra/image28.png)
    
2. Kemudian pada tahap kedua, dibawah fungsi **Object.entries(daftarLayer)** buat fungsi **if** untuk memeriksa apakah **kontrolTerrain** tersedia sebelum membuat kontrol Terrain dan Citra pada panel.
    
![Blok if (kontrolTerrain) masih kosong setelah perulangan Object.entries(daftarLayer)](terrain-citra/image29.png)
    
3. Pada tahap ketiga didalam buat variabel untuk membuat pemisah bagian panel yang akan digunakan sebagai pembatas antara kontrol sebelumnya dengan bagian Terrain dan Citra.
    
![Baris const pemisah = document.createElement div di dalam blok kontrolTerrain](terrain-citra/image30.png)
    
4. Selanjutnya buat elemen **pemisah.style.cssText** yang digunakan sebagai tampilan pemisah dengan garis horizontal, jarak, dan padding agar bagian Terrain dan Citra.
    
![Baris pemisah.style.cssText mengatur border atas, margin, dan padding panel](terrain-citra/image31.png)
    
5. Kemudian tambahkan elemen **pemisah.innerHTML** untuk menambahkan judul Terrain & Citra.
    
![Blok kontrolTerrain yang membuat pemisah, mengatur cssText garis atas, lalu menulis judul Terrain &amp; Citra lewat innerHTML](terrain-citra/image%206.png)
    
6. Tahap berikutnya tambahkan elmen **panel.appendChild(pemisah);** pemisah yang telah dibuat dimasukkan ke dalam panel.
    
![Baris pemisah.innerHTML menuliskan judul Terrain & Citra dan panel.appendChild(pemisah)](terrain-citra/image33.png)
    
7. Pada tahap keempat buat variabel **const barisTerrain** yang akan digunakan sebagai wadah untuk checkbox dan teks kontrol terrain.
    
![Baris const barisTerrain = document.createElement label](terrain-citra/image34.png)
    
8. Selanjutnya buat elemen **barisTerrain.style.cssText** agar agar checkbox dan teks terrain tersusun secara horizontal.
    
![Baris barisTerrain.style.cssText mengatur flex, gap, dan cursor pointer](terrain-citra/image35.png)
    
9. Tahap selanjutnya buat elemen **barisTerrain.innerHTML** yang digunakan untuk membuat checkbox mengaktifkan atau menonaktifkan Terrain (DEM).
    
![Baris barisTerrain.innerHTML membuat checkbox cbTerrain dan teks Aktifkan Terrain (DEM)](terrain-citra/image36.png)
    
10. Pada tahap kelima buat variabel **const cbTerrain** yang digunakan untuk mengambil element input checkbox dari **barisTerrain** dan menyimpannya ke dalam variabel **cbTerrain**.
    
![Baris const cbTerrain = barisTerrain.querySelector input](terrain-citra/image37.png)
    
11. Tahap keenam buat fungsi berupa **cbTerrain.addEventListener('change', (e)** yang digunakan untuk mendeteksi ketika pengguna mengubah kondisi checkbox terrain.
    
![Pemanggilan cbTerrain.addEventListener dengan isi callback masih kosong](terrain-citra/image38.png)
    
12. Selanjutnya pada fungsi tersebut buat kondisi **if** untuk memeriksa apakah checkbox dalam kondisi tercentang; jika tercentang terrain akan diaktifkan, sedangkan jika tidak tercentang terrain akan dinonaktifkan.
    
![Callback change memanggil kontrolTerrain.aktifkanTerrain bila tercentang, else matikanTerrain](terrain-citra/image39.png)
    
13. Tahap ketujuh buat fungsi dan kondisi **if** untuk memeriksa apakah **kontrolTerrain** memiliki fungsi **daftarkanListenerStatus()** yang dapat digunakan untuk menerima perubahan status terrain.
    
![Blok if (kontrolTerrain.daftarkanListenerStatus) masih kosong](terrain-citra/image40.png)
    
14. Pada tahap berikutnya dalam fungsi tersebut tambahkan fungsi untuk menerima informasi perubahan status terrain, sehingga ketika status terrain berubah menjadi aktif atau tidak aktif, kondisi checkbox akan otomatis diperbarui sesuai nilai **statusAktif**.
    
![Listener status memperbarui cbTerrain.checked sesuai nilai statusAktif](terrain-citra/image41.png)
    
15. Tahap kedelapan buat elemen **barisTerrain** yang berisi checkbox dan teks kontrol Terrain ditambahkan ke dalam panel agar dapat ditampilkan pada antarmuka pengguna.
    
![Baris panel.appendChild(barisTerrain) menutup blok kontrol terrain](terrain-citra/image42.png)
    
16. Tahap kesembilan buat variabel **const wrapOpacity** yang digunakan sebagai wadah untuk menempatkan kontrol transparansi citra.
    
![Baris const wrapOpacity = document.createElement div](terrain-citra/image43.png)
    
17. Selanjutnya buat elemen **wrapOpacity.style.cssText** untuk mengatur jarak dan warna teks agar kontrol transparansi terlihat lebih rapi di dalam panel.
    
![Baris wrapOpacity.style.cssText mengatur margin dan warna teks](terrain-citra/image44.png)
    
18. Tahap berikutnya buat elemen **wrapOpacity.innerHTML** untuk mengatur tingkat transparansi citra.
    
![Baris wrapOpacity.innerHTML membuat slider rgOpacity bertipe range dengan nilai awal 1](terrain-citra/image45.png)
    
19. Selanjutnya buat elemen **wrapOpacity.querySelector** yang akan digunakan mendeteksi perubahan nilai slider, kemudian mengirimkan nilai tersebut ke fungsi aturOpacityCitra() untuk mengubah tingkat transparansi citra.
    
![Event input pada slider memanggil kontrolTerrain.aturOpacityCitra memakai parseFloat nilai slider](terrain-citra/image46.png)
    
20. Tahap terakhir buat elemen kontrol transparansi citra yang telah dibuat ditambahkan ke dalam panel agar dapat ditampilkan pada antarmuka pengguna.
    
![Baris panel.appendChild(wrapOpacity) menambahkan kontrol transparansi ke panel](terrain-citra/image47.png)
    

## **Integrasi Fungsi Terrain dengan Cesium Viewer**

1. Tahap pertama pada file **CesiumViewer.jsx** dalam fungsi berupa **function addContent3D(viewer)** buat fungsi **addTerrain()** dengan parameter viewer untuk membuat kontrol terrain, kemudian konfigurasi **aktifTerrainAwal: true** digunakan agar terrain langsung diaktifkan serta **variabel kontrolTerrain** untuk digunakan mengatur terrain.
    
![Pemanggilan addTerrain dengan viewer dan opsi aktifTerrainAwal true di dalam addContent3D pada CesiumViewer.jsx](terrain-citra/image%207.png)
    
2. Tahap kedua tambahkan **kontrolTerrain** bagai parameter ketiga ke fungsi **addPanelLayer3D()** agar panel layer dapat menggunakan fungsi-fungsi terrain.
    
![Pemanggilan addPanelLayer3D yang menerima kontrolTerrain sebagai parameter ketiga setelah daftar layer gedung](terrain-citra/image%208.png)
    
3. Tahap terakhir pastikan addTerrain telah terpanggil dan terintegrasi pada halaman **CesiumViewer.jsx**.
    
![Blok import CesiumViewer.jsx memuat addTerrain dari ./addTerrain](terrain-citra/image50.png)
    
4. Hasil tampilan peta 3d dengan basemap citra satelit sebelum mengaktifkan tampilan terrain.
    
![Peta 3D Kota Jakarta dengan basemap citra satelit dan terrain masih datar, panel Layer 3D menampilkan kontrol Terrain &amp; Citra](terrain-citra/image%209.png)
    
5. Hasil tampilan peta 3d dengan mengaktifkan tampilan terrain.
    
![Peta 3D dengan terrain World Terrain aktif sehingga relief permukaan tampak timbul di atas citra satelit](terrain-citra/image%2010.png)
    
![Tampilan peta berganti ke basemap vektor berwarna terang dengan bangunan 3D dan checkbox Aktifkan Terrain tercentang](terrain-citra/image%2011.png)
    
6. Hasil tampilan ketika mengatur transparansi citra.
    
![Peta 3D dengan citra satelit yang dibuat transparan lewat slider Transparansi Citra sehingga terrain di bawahnya terlihat](terrain-citra/image%2012.png)

### addTerrain.jsx, kode lengkap

```jsx
export default function addTerrain(viewer, opsi = {}) {
  const Cesium = window.Cesium;

  const {
    aktifTerrainAwal = true,
    onStatusBerubah = null,     
    onLoadingBerubah = null,    
  } = opsi;

  const permukaanDatar = new Cesium.EllipsoidTerrainProvider();
  let terrainAktif = false;
  const daftarListenerStatus = [];

  function beritahuStatus(status) {
    if (onStatusBerubah) onStatusBerubah(status);
    daftarListenerStatus.forEach((cb) => cb(status));
  }

  function daftarkanListenerStatus(cb) {
    if (typeof cb !== 'function') return;
    daftarListenerStatus.push(cb);
    cb(terrainAktif); 
  }

  function aktifkanTerrain() {
    if (onLoadingBerubah) onLoadingBerubah(true);

    Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
    })
      .then(function (worldTerrain) {
        viewer.terrainProvider = worldTerrain;
        terrainAktif = true;
        beritahuStatus(true);
        console.log('Terrain (DEM) berhasil diaktifkan.');
      })
      .finally(function () {
        if (onLoadingBerubah) onLoadingBerubah(false);
      });
  }

  function matikanTerrain() {
    viewer.terrainProvider = permukaanDatar; 
    terrainAktif = false;
    beritahuStatus(false);
  }

  function toggleTerrain() {
    terrainAktif ? matikanTerrain() : aktifkanTerrain();
  }

  function aturOpacityCitra(nilai) {
    const jumlahLayer = viewer.imageryLayers.length;
    for (let i = 0; i < jumlahLayer; i++) {
      viewer.imageryLayers.get(i).alpha = nilai;
    }
  }

  if (aktifTerrainAwal) {
    aktifkanTerrain();
  } else {
    viewer.terrainProvider = permukaanDatar;
  }

  return {
    aktifkanTerrain,
    matikanTerrain,
    toggleTerrain,
    aturOpacityCitra,
    daftarkanListenerStatus,
    cekStatusAktif: function () {
      return terrainAktif;
    },
  };
}
```
