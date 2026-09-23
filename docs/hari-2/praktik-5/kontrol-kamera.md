# Kontrol Kamera dan Navigasi: Penggunaaan flyto, setView, heading, pitch dan rol

## **Pembuatan Fungsi Kontrol dan Navigasi Kamera**

1. Tahap pertama buat file baru pada folder **components** dengan nama **addCameraNav.jsx**.
    
![Berkas addCameraNav.jsx yang baru dibuat di folder components peta3d-latihan-4 pada Explorer Visual Studio Code](kontrol-kamera/image1.png)
    
2. Selanjutnya pada tahap kedua buat struktur dasar modul **addCameraNav()** yang berfungsi sebagai wadah untuk seluruh fitur navigasi kamera, dengan parameter **viewer** sebagai instance Cesium Viewer dan **opsi** sebagai konfigurasi tambahan, serta mengambil library Cesium dari **window.Cesium** agar dapat digunakan.
    
![Struktur dasar export default function addCameraNav(viewer, opsi = {}) beserta const Cesium = window.Cesium](kontrol-kamera/image2.png)
    
3. Pada tahap ketiga buat variabel dengan parameter **lokasiAwal** untuk menentukan posisi awal kamera dan **tampilkanPanel** untuk menentukan apakah tombol navigasi akan ditampilkan.
    
![Baris const { lokasiAwal = null, tampilkanPanel = true } = opsi disorot kuning](kontrol-kamera/image3.png)
    
4. Tahap keempat buat fungsi **lihatLangsung()** yang digunakan untuk memindahkan tampilan kamera secara langsung ke lokasi tertentu berdasarkan koordinat, ketinggian, dan arah pandangan kamera.
    
![Fungsi lihatLangsung dengan parameter latitude, longitude, ketinggian, heading, pitch, dan roll yang badannya masih kosong disorot kuning](kontrol-kamera/image.png)
    
5. Selanjutnya didalam fungsi **lihatLangsung,** buat fungsi untuk mengatur dan memindahkan posisi tampilan kamera secara langsung ke lokasi menggunakan **viewer.camera.setView**.
    
![Baris viewer.camera.setView yang masih kosong di dalam fungsi lihatLangsung disorot kuning](kontrol-kamera/image5.png)
    
6. Tahap berikutnya dalam fungsi **viewer.camera.setView** buat fungsi berupa **destination** untuk menentukan lokasi tujuan kamera berdasarkan nilai longitude, latitude, dan ketinggian yang kemudian diubah ke format koordinat yang digunakan oleh Cesium.
    
![Baris destination dengan Cesium.Cartesian3.fromDegrees(longitude, latitude, ketinggian) di dalam setView disorot kuning](kontrol-kamera/image6.png)
    
7. Selanjutnya tambahkan fungsi **orientation** untuk mengatur arah dan sudut pandangan kamera, yang terdiri dari **heading** untuk menentukan arah, **pitch** untuk menentukan kemiringan pandangan, dan **roll** untuk menentukan kemiringan posisi kamera.
    
![Blok orientation di dalam viewer.camera.setView berisi heading, pitch, dan roll yang dikonversi ke radian disorot kuning](kontrol-kamera/image%201.png)
    
8. Pada tahap kelima buat fungsi **terbangKe()** sebagai wadah untuk mengatur perpindahan kamera menuju lokasi tertentu dengan animasi.
    
![Fungsi terbangKe dengan parameter latitude, longitude, ketinggian, heading, pitch, dan roll yang masih kosong disorot kuning](kontrol-kamera/image8.png)
    
9. Selanjutnya pada fungsi tersebut tambahkan **viewer.camera.flyTo()** untuk membuat kamera bergerak atau terbang secara animasi menuju lokasi tujuan.
    
![Baris viewer.camera.flyTo yang masih kosong di dalam fungsi terbangKe disorot kuning](kontrol-kamera/image%202.png)
    
10. Kemudian tambahkan fungsi berupa **destination** untuk menentukan lokasi tujuan kamera serta tambahkan **orientation** untuk mengatur arah dan sudut pandangan kamera, yang terdiri dari **heading, pitch** dan **roll.**
    
![Isi viewer.camera.flyTo berupa destination dan orientation heading, pitch, roll disorot kuning](kontrol-kamera/image10.png)
    
11. Pada tahap keenam buat fungsi **resetKeAwal()** untuk mengembalikan posisi kamera ke lokasi awal yang telah ditentukan.
    
![Baris fungsi resetKeAwal() yang masih kosong disorot kuning](kontrol-kamera/image11.png)
    
12. Selanjutnya didalam fungsi tersebut tambahkan kondisi **if** yang digunakan untuk memastikan data lokasiAwal tersedia sebelum kamera melakukan perpindahan.
    
![Baris if (!lokasiAwal) return di dalam resetKeAwal disorot kuning](kontrol-kamera/image12.png)
    
13. Tahap berikutnya tambahkan fungsi **terbangKe()** untuk memindahkan kamera kembali menuju lokasi awal dengan animasi.
    
![Pemanggilan terbangKe di dalam resetKeAwal yang argumennya masih kosong disorot kuning](kontrol-kamera/image13.png)
    
14. Didalam fungsi **terbangKe()** tambahkan parameter untuk mengambil nilai **latitude, longitude,** dan **ketinggian** dari data **lokasiAwal** sebagai tujuan kamera, serta tambahkan parameter untuk mengambil pengaturan arah dan sudut pandangan kamera dari **lokasiAwal**, seperti **heading, pitch,** dan **roll.**
    
![Pemanggilan terbangKe dengan lokasiAwal.latitude, longitude, ketinggian, heading, pitch, dan roll disorot kuning](kontrol-kamera/image14.png)
    
15. Tahap ketujuh buat fungsi **putarKiri()** yang berfungsi untuk memutar arah pandangan kamera ke sebelah kiri.
    
![Baris fungsi putarKiri() yang masih kosong disorot kuning](kontrol-kamera/image15.png)
    
16. Selanjutnya buat variabel untuk mengambil nilai arah atau posisi putaran kamera yang sedang digunakan.
    
![Baris const headingSekarang = viewer.camera.heading di dalam putarKiri disorot kuning](kontrol-kamera/image16.png)
    
17. Kemudian tambahkan fungsi **viewer.camera.setView()** untuk memperbarui arah pandangan kamera.
    
![Baris viewer.camera.setView di dalam fungsi putarKiri disorot kuning](kontrol-kamera/image17.png)
    
18. Tahapan berikutnya didalam **viewer.camera** tambahkan parameter **orientasi** kamera yang akan digunakan setelah kamera diputar.
    
![Baris orientation di dalam setView pada putarKiri disorot kuning](kontrol-kamera/image18.png)
    
19. Selanjutnya dalam orientasi tambahkan parameter arah kamera yang dikurangi sebesar 15 derajat untuk memutar pandangan ke kiri, sementara nilai pitch dan roll tetap dipertahankan agar kemiringan dan posisi kamera tidak berubah.
    
![Baris heading headingSekarang dikurangi 15 derajat serta pitch dan roll yang tetap dipertahankan disorot kuning](kontrol-kamera/image19.png)
    
20. Tahap kedelapan buat fungsi **putarKanan()** dengan parameter yang sama dengann putar kiri, tetapi pada parameter arah kamera dalam fungsi putarKanan ditambahkan dengan 15 untuk memutar pandangan kekanan.
    
![Baris heading headingSekarang ditambah 15 derajat di dalam fungsi putarKanan disorot merah](kontrol-kamera/image20.png)
    
21. Pada tahap kesembilan buat kondisi **if** untuk memeriksa apakah panel navigasi perlu ditampilkan atau tidak berdasarkan nilai **tampilkanPanel**.
    
![Blok if (tampilkanPanel) yang masih kosong di bawah fungsi putarKanan disorot kuning](kontrol-kamera/image%203.png)
    
22. Kemudian tambahkan variabel untuk membuat container dengan elemen div yang akan digunakan sebagai wadah untuk seluruh tombol navigasi kamera.
    
![Baris const panel = document.createElement('div') di dalam if (tampilkanPanel) disorot kuning](kontrol-kamera/image22.png)
    
23. Selanjutnya buat **panel.style.cssText** yang akan digunakan untuk pengaturan tampilan pada panel seperti posisi, warna, ukuran, dan tata letak agar panel terlihat di atas peta.
    
![Blok panel.style.cssText dengan position absolute, bottom 30px, left 50%, transform, dan display flex disorot kuning](kontrol-kamera/image23.png)
    
24. Kemudian tambahkan variabel **const tombolStyle** sebagai pengaturan tampilan yang akan digunakan bersama oleh seluruh tombol navigasi.
    
![Blok const tombolStyle berisi padding, border, border-radius, background abu-abu, dan font-size disorot kuning](kontrol-kamera/image24.png)
    
25. Tahap berikutnya buat variabel yang akan digunakan sebagai daftar tombol yang akan digunakan untuk mengontrol arah kamera.
    
![Daftar daftarTombol berisi label Kiri, Kanan, dan Reset beserta aksi putarKiri, putarKanan, dan resetKeAwal disorot kuning](kontrol-kamera/image%204.png)
    
26. Selanjutnya buat fungsi berupa **daftarTombol** untuk membuat tombol secara otomatis.
    
![Daftar tombol Kiri, Kanan, dan Reset beserta baris daftarTombol.forEach disorot kuning](kontrol-kamera/image26.png)
    
27. Pada fungsi **daftarTombol** buat elemen HTML button untuk setiap tombol navigasi.
    
![Baris const tombol = document.createElement('button') di dalam daftarTombol.forEach disorot kuning](kontrol-kamera/image27.png)
    
28. Selanjutnya buat teks dan style diterapkan pada tombol yang telah dibuat, kemudian tambahkan aksi saat diklik sebelum dimasukkan ke dalam panel navigasi.
    
![Baris innerText, style, addEventListener click, dan panel.appendChild pada tombol disorot kuning](kontrol-kamera/image28.png)
    
29. Tahap terakhir pada fungsi **if (tampilkanPanel)** tambahkan ke dalam container Cesium agar dapat ditampilkan di atas peta 3D.
    
![Baris viewer.container.appendChild(panel) yang menempelkan panel navigasi ke viewer disorot kuning](kontrol-kamera/image29.png)
    
30. Pada tahap terakhir, seluruh fungsi navigasi kamera dikembalikan agar dapat digunakan kembali dari luar modul untuk mengatur pergerakan dan arah pandangan kamera.
    
![Baris return addCameraNav berisi lihatLangsung, terbangKe, resetKeAwal, putarKiri, dan putarKanan disorot kuning](kontrol-kamera/image%205.png)
    

## **Integrasi Fungsi Kontrol dan Navigasi Kamera dengan Cesium Viewer**

1. Tahap pertama, pada file **CesiumViewer.jsx** pada **function addContent3D** tambahkan variabel untuk kontrolKamera dan panggil **addCameraNav**.
    
![Baris const kontrolKamera = addCameraNav dengan lokasiAwal LOKASI_AWAL dan tampilkanPanel true di dalam addContent3D disorot kuning](kontrol-kamera/image%206.png)
    
2. Tahap kedua tambahkan **kontrolKamera** untuk memanggil fungsi **terbangKe()** sehingga kamera dapat bergerak secara animasi menuju lokasi awal dengan ketinggian, arah, dan sudut pandangan yang telah ditentukan.
    
![Pemanggilan kontrolKamera.terbangKe dengan ketinggian 800, heading 20, pitch -40 serta baris return kontrol disorot kuning](kontrol-kamera/image32.png)
    
3. Hasil tampilan untuk kontrol kamera ketika posisi dirotasi ke arah kiri ataupun kanan.
    
![Peta 3D dengan tombol navigasi Kiri, Kanan, dan Reset di bagian bawah yang disorot kotak kuning](kontrol-kamera/image%207.png)
    
4. Hasil tampilan ketika posisi direset dan mengaktifkan fitur flyto.
    
![Peta 3D setelah kamera direset dan flyto, dengan tombol Kiri, Kanan, dan Reset di bagian bawah peta](kontrol-kamera/image%208.png)

### addCameraNav.jsx, kode lengkap

```jsx
export default function addCameraNav(viewer, opsi = {}) {
  const Cesium = window.Cesium;

  const { lokasiAwal = null, tampilkanPanel = true } = opsi;

  function lihatLangsung(latitude, longitude, ketinggian, heading = 0, pitch = -30, roll = 0) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, ketinggian),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: Cesium.Math.toRadians(roll),
      },
    });
  }

  function terbangKe(latitude, longitude, ketinggian, heading = 0, pitch = -30, roll = 0) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, ketinggian),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: Cesium.Math.toRadians(roll),
      },
    });
  }

  function resetKeAwal() {
    if (!lokasiAwal) return;
    terbangKe(
      lokasiAwal.latitude,
      lokasiAwal.longitude,
      lokasiAwal.ketinggian,
      lokasiAwal.heading ?? 0,
      lokasiAwal.pitch ?? -30,
      lokasiAwal.roll ?? 0
    );
  }

  function putarKiri() {
    const headingSekarang = viewer.camera.heading;
    viewer.camera.setView({
      orientation: {
        heading: headingSekarang - Cesium.Math.toRadians(15),
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
    });
  }

  function putarKanan() {
    const headingSekarang = viewer.camera.heading;
    viewer.camera.setView({
      orientation: {
        heading: headingSekarang + Cesium.Math.toRadians(15),
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
    });
  }

  if (tampilkanPanel) {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:absolute;
      bottom:30px;
      left:50%;
      transform:translateX(-50%);
      z-index:999;
      background:white;
      padding:8px 12px;
      border-radius:8px;
      font-family:sans-serif;
      font-size:13px;
      box-shadow:0 1px 6px rgba(0,0,0,0.3);
      display:flex;
      gap:6px;
      color:#111;
    `;

    const tombolStyle = `
      padding:6px 10px;
      border:1px solid #ccc;
      border-radius:6px;
      background:#f5f5f5;
      cursor:pointer;
      font-size:12px;
      color:#111;
    `;

    const daftarTombol = [
      { label: 'Kiri', aksi: () => putarKiri() },
      { label: 'Kanan', aksi: () => putarKanan() },
      { label: 'Reset', aksi: () => resetKeAwal() },
    ];

    daftarTombol.forEach(({ label, aksi }) => {
      const tombol = document.createElement('button');
      tombol.innerText = label;
      tombol.style.cssText = tombolStyle;
      tombol.addEventListener('click', aksi);
      panel.appendChild(tombol);
    });

    viewer.container.appendChild(panel);
  }

  return { lihatLangsung, terbangKe, resetKeAwal, putarKiri, putarKanan };
}
```
